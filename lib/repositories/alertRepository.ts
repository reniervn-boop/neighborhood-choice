import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { LocalAlert } from '@/lib/types';

const COL = 'localAlerts';

function toAlert(id: string, data: Record<string, unknown>): LocalAlert {
  return {
    id,
    message: data.message as string,
    category: data.category as LocalAlert['category'],
    severity: data.severity as LocalAlert['severity'],
    authorId: data.authorId as string,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toMillis()
        : (data.createdAt as number),
    expiresAt:
      data.expiresAt instanceof Timestamp
        ? data.expiresAt.toMillis()
        : (data.expiresAt as number | undefined),
    isActive: Boolean(data.isActive),
  };
}

export async function createAlert(data: Omit<LocalAlert, 'id'>): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    isActive: true,
  });
  return ref.id;
}

export async function getActiveAlerts(limitCount = 10): Promise<LocalAlert[]> {
  const q = query(
    collection(db, COL),
    where('isActive', '==', true),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  const now = Date.now();
  return snap.docs
    .map((d) => toAlert(d.id, d.data() as Record<string, unknown>))
    .filter((a) => !a.expiresAt || a.expiresAt > now);
}

export async function getAllAlerts(limitCount = 50): Promise<LocalAlert[]> {
  const q = query(
    collection(db, COL),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toAlert(d.id, d.data() as Record<string, unknown>));
}

export async function deactivateAlert(id: string): Promise<void> {
  await updateDoc(doc(db, COL, id), { isActive: false });
}

export async function deleteAlert(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
