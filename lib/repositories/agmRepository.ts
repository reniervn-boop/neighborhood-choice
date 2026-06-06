import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { AGMWindow } from '@/lib/types';

const COL = 'agmWindows';

function toAGM(id: string, data: Record<string, unknown>): AGMWindow {
  const ts = (field: unknown): number =>
    field instanceof Timestamp ? field.toMillis() : (field as number);

  return {
    id,
    title: data.title as string,
    description: data.description as string | undefined,
    status: data.status as AGMWindow['status'],
    nominationsOpenAt: ts(data.nominationsOpenAt),
    nominationsCloseAt: ts(data.nominationsCloseAt),
    votingOpenAt: ts(data.votingOpenAt),
    votingCloseAt: ts(data.votingCloseAt),
    createdBy: data.createdBy as string,
    createdAt: ts(data.createdAt),
    positions: (data.positions as string[]) ?? [],
  };
}

export async function createAGMWindow(
  data: Omit<AGMWindow, 'id'>,
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getLatestAGM(): Promise<AGMWindow | null> {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'), limit(1));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return toAGM(d.id, d.data() as Record<string, unknown>);
}

export async function getAllAGMs(): Promise<AGMWindow[]> {
  const q = query(collection(db, COL), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toAGM(d.id, d.data() as Record<string, unknown>));
}

export async function getAGMById(id: string): Promise<AGMWindow | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return toAGM(snap.id, snap.data() as Record<string, unknown>);
}

export async function updateAGMStatus(
  id: string,
  status: AGMWindow['status'],
): Promise<void> {
  await updateDoc(doc(db, COL, id), { status });
}

/** Derive current status from timestamps — call this on the client to sync UI */
export function deriveAGMStatus(agm: AGMWindow): AGMWindow['status'] {
  const now = Date.now();
  if (now < agm.nominationsOpenAt) return 'upcoming';
  if (now < agm.nominationsCloseAt) return 'nominations_open';
  if (now < agm.votingCloseAt) return 'voting_open';
  return 'closed';
}
