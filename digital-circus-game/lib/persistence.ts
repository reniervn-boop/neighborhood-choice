import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { GameSave } from '@/lib/types';

function localKey(uid: string) {
  return `dcg_save_${uid}`;
}

function readLocal(uid: string): GameSave | null {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(localKey(uid));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as GameSave;
  } catch {
    return null;
  }
}

function writeLocal(uid: string, save: GameSave) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(localKey(uid), JSON.stringify(save));
}

export async function loadGame(uid: string, synced: boolean): Promise<GameSave | null> {
  if (synced) {
    try {
      const snap = await getDoc(doc(db, 'gameSaves', uid));
      if (snap.exists()) {
        const remote = snap.data() as GameSave;
        writeLocal(uid, remote);
        return remote;
      }
    } catch {
      // fall through to local
    }
  }
  return readLocal(uid);
}

export async function saveGame(uid: string, synced: boolean, save: GameSave): Promise<void> {
  writeLocal(uid, save);
  if (!synced) return;
  try {
    await setDoc(doc(db, 'gameSaves', uid), save, { merge: true });
  } catch {
    // local save already succeeded; ignore remote failure
  }
}
