'use client';

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '@/lib/types';
import { withTimeout } from '@/lib/utils/async';

/**
 * Auth state for the whole app.
 *
 * This used to be a plain hook. Because 23 components call it — including
 * BottomNav and DesktopNav, which render on every screen — each navigation
 * spun up three separate onAuthStateChanged listeners and three separate
 * `users/{uid}` reads, and reset `loading` to true so every page flashed a
 * full-screen spinner. It is now a single provider mounted once in
 * app/providers.tsx: one listener, one profile read per session.
 */

/**
 * How long to wait for the profile read before falling back.
 *
 * Shorter than DATA_TIMEOUT_MS: this one gates every screen in the app, so it
 * should give up sooner than a single page's data load.
 */
const PROFILE_TIMEOUT_MS = 6000;

export interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  /** Legacy admin check — kept for backward compat */
  isAdmin: boolean;
  isCommittee: boolean;
  isSuperAdmin: boolean;
  /** Any elevated role */
  isStaff: boolean;
  /** Re-read the profile from Firestore, e.g. after the user edits it. */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

/** A usable profile built from the auth token alone, for when Firestore is unreachable. */
function fallbackProfile(fbUser: FirebaseUser): User {
  return {
    uid: fbUser.uid,
    email: fbUser.email || '',
    name: fbUser.displayName || 'Resident',
    unitBlock: '',
    verified: false,
    joinedAt: Date.now(),
    points: 0,
    badges: [],
    notificationPrefs: { realTime: true, weeklyDigest: true },
    role: 'resident',
    membershipStatus: 'non-paying',
    canVote: false,
    canStandForOffice: false,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadProfile(fbUser: FirebaseUser): Promise<User> {
    const snapshot = await getDoc(doc(db, 'users', fbUser.uid));

    if (snapshot.exists()) {
      const data = snapshot.data();
      return {
        ...data,
        membershipStatus: data.membershipStatus || 'non-paying',
        canVote: data.canVote ?? false,
        canStandForOffice: data.canStandForOffice ?? false,
      } as User;
    }

    // No profile document yet — create one, but don't block sign-in on the
    // write succeeding (rules may reject it).
    const created = fallbackProfile(fbUser);
    try {
      await withTimeout(
        setDoc(doc(db, 'users', fbUser.uid), created),
        PROFILE_TIMEOUT_MS,
      );
    } catch (writeErr) {
      console.warn('Profile write failed (check Firestore rules):', writeErr);
    }
    return created;
  }

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      if (cancelled) return;
      setFirebaseUser(fbUser);

      if (!fbUser) {
        setUser(null);
        setError(null);
        setLoading(false);
        return;
      }

      // Keep a handle on the real read so a timeout doesn't abandon it.
      const realRead = loadProfile(fbUser);

      // Upgrade whenever the read eventually lands. This matters because the
      // fallback profile is always role 'resident' — without it a committee
      // member on a slow connection would be stuck looking at the resident UI
      // until they refreshed.
      realRead
        .then((profile) => {
          if (!cancelled) {
            setUser(profile);
            setError(null);
          }
        })
        .catch(() => {
          /* handled below */
        });

      try {
        const profile = await withTimeout(realRead, PROFILE_TIMEOUT_MS);
        if (cancelled) return;
        setUser(profile);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        // Signed in, but the profile is slow or unreachable. Let them in with
        // what the token gives us rather than trapping them on a spinner; the
        // .then() above swaps in the real profile if it arrives later.
        console.warn('Profile read slow or failed, using token fallback:', err);
        setUser((current) => current ?? fallbackProfile(fbUser));
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        if (!cancelled) setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const value = useMemo<AuthState>(() => {
    async function refreshProfile() {
      if (!firebaseUser) return;
      try {
        setUser(await loadProfile(firebaseUser));
      } catch (err) {
        console.warn('Profile refresh failed:', err);
      }
    }

    return {
      user,
      firebaseUser,
      loading,
      error,
      isAuthenticated: !!user,
      isAdmin:
        user?.role === 'admin' ||
        user?.role === 'committee' ||
        user?.role === 'super_admin',
      isCommittee: user?.role === 'committee' || user?.role === 'super_admin',
      isSuperAdmin: user?.role === 'super_admin',
      isStaff: user?.role !== 'resident' && !!user,
      refreshProfile,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, firebaseUser, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider> (see app/providers.tsx)');
  }
  return context;
}
