import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  Firestore,
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
  console.warn('Firebase config not found. Please set up .env.local with Firebase credentials.');
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'PLACEHOLDER',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'placeholder.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'placeholder',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'placeholder.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || 'placeholder',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || 'placeholder',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

/**
 * In the browser, back Firestore with the IndexedDB cache.
 *
 * Residents are on mobile data on a Joburg network; without this every page
 * navigation re-fetches the same documents over the wire, and going through a
 * tunnel leaves reads hanging. With it, repeat reads are served locally and the
 * SDK syncs in the background.
 *
 * `initializeFirestore` has to run before anything calls `getFirestore`, which
 * is why it lives here at module scope. On the server (route handlers, SSR)
 * there is no IndexedDB, so fall back to the plain instance.
 */
function createFirestore(): Firestore {
  if (typeof window === 'undefined') return getFirestore(app);

  try {
    return initializeFirestore(app, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch (err) {
    // Private browsing, a blocked IndexedDB, or an already-initialised
    // instance during hot reload. Memory-only is a fine degradation.
    console.warn('Firestore persistent cache unavailable, using memory only:', err);
    return getFirestore(app);
  }
}

export const db = createFirestore();
export const storage = getStorage(app);

// Messaging only available in browser
let messaging = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      messaging = getMessaging(app);
    }
  });
}

export { messaging };
