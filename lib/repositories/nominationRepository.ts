import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Nomination } from '@/lib/types';

const COL = 'nominations';

function toNomination(id: string, data: Record<string, unknown>): Nomination {
  return {
    id,
    agmId: data.agmId as string,
    position: data.position as string,
    nomineeId: data.nomineeId as string,
    nomineeName: data.nomineeName as string,
    nomineeUnitBlock: data.nomineeUnitBlock as string,
    motivation: data.motivation as string,
    accepted: data.accepted as boolean | null,
    submittedAt:
      data.submittedAt instanceof Timestamp
        ? data.submittedAt.toMillis()
        : (data.submittedAt as number),
    submittedBy: data.submittedBy as string,
  };
}

export async function createNomination(
  data: Omit<Nomination, 'id'>,
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    accepted: null,
    submittedAt: Date.now(),
  });
  return ref.id;
}

export async function getNominationsForAGM(agmId: string): Promise<Nomination[]> {
  const q = query(
    collection(db, COL),
    where('agmId', '==', agmId),
    orderBy('position'),
    orderBy('submittedAt', 'asc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toNomination(d.id, d.data() as Record<string, unknown>));
}

export async function getNominationsForPosition(
  agmId: string,
  position: string,
): Promise<Nomination[]> {
  const q = query(
    collection(db, COL),
    where('agmId', '==', agmId),
    where('position', '==', position),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toNomination(d.id, d.data() as Record<string, unknown>));
}

export async function getNominationById(id: string): Promise<Nomination | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return toNomination(snap.id, snap.data() as Record<string, unknown>);
}

/** Nominee accepts or declines their nomination */
export async function respondToNomination(
  id: string,
  accepted: boolean,
): Promise<void> {
  await updateDoc(doc(db, COL, id), { accepted });
}

/** Check if a user already has a nomination for this position */
export async function hasNomination(
  agmId: string,
  position: string,
  nomineeId: string,
): Promise<boolean> {
  const q = query(
    collection(db, COL),
    where('agmId', '==', agmId),
    where('position', '==', position),
    where('nomineeId', '==', nomineeId),
  );
  const snap = await getDocs(q);
  return !snap.empty;
}
