import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'PLACEHOLDER',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'placeholder.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'placeholder',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'placeholder.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'placeholder',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'placeholder',
};

const isConfigured = Boolean(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

const app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

const GUEST_ID_KEY = 'dcg_guest_uid';

function getOrCreateGuestId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = window.localStorage.getItem(GUEST_ID_KEY);
  if (!id) {
    id = `guest_${crypto.randomUUID()}`;
    window.localStorage.setItem(GUEST_ID_KEY, id);
  }
  return id;
}

/**
 * Resolves a stable user id for saving progress. Tries real Firebase
 * anonymous auth first; if Firebase isn't configured (or the network/auth
 * call fails, e.g. in local dev without credentials) it falls back to a
 * locally-persisted guest id so the game is always playable offline.
 */
export function resolveUid(): Promise<{ uid: string; synced: boolean }> {
  return new Promise((resolve) => {
    if (!isConfigured) {
      resolve({ uid: getOrCreateGuestId(), synced: false });
      return;
    }

    let settled = false;
    const fallback = window.setTimeout(() => {
      if (!settled) {
        settled = true;
        resolve({ uid: getOrCreateGuestId(), synced: false });
      }
    }, 4000);

    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user && !settled) {
        settled = true;
        window.clearTimeout(fallback);
        unsubscribe();
        resolve({ uid: user.uid, synced: true });
      }
    });

    signInAnonymously(auth).catch(() => {
      if (!settled) {
        settled = true;
        window.clearTimeout(fallback);
        unsubscribe();
        resolve({ uid: getOrCreateGuestId(), synced: false });
      }
    });
  });
}
