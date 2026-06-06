'use client';

import { useEffect, useState } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '@/lib/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Safety net: if Firebase never calls back (offline / slow mobile network),
    // stop showing the loading spinner after 8 seconds and treat as logged-out.
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 8000);

    const unsubscribe = auth.onAuthStateChanged(async (fbUser) => {
      clearTimeout(timeout);
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Provide defaults for new membership fields if missing
            const user: User = {
              ...userData,
              membershipStatus: userData.membershipStatus || 'non-paying',
              canVote: userData.canVote !== undefined ? userData.canVote : false,
              canStandForOffice: userData.canStandForOffice !== undefined ? userData.canStandForOffice : false,
            } as User;
            setUser(user);
          } else {
            setError('User profile not found');
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to load user');
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, []);

  return {
    user,
    firebaseUser,
    loading,
    error,
    isAuthenticated: !!user,
    /** Legacy admin check — kept for backward compat */
    isAdmin: user?.role === 'admin' || user?.role === 'committee' || user?.role === 'super_admin',
    isCommittee: user?.role === 'committee' || user?.role === 'super_admin',
    isSuperAdmin: user?.role === 'super_admin',
    /** Any elevated role */
    isStaff: user?.role !== 'resident' && !!user,
  };
}
