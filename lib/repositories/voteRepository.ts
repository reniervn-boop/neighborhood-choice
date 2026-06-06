import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Vote } from '@/lib/types';
import { hashAddress } from '@/lib/validation/agmValidation';

const COL = 'votes';

function toVote(id: string, data: Record<string, unknown>): Vote {
  return {
    id,
    agmId: data.agmId as string,
    position: data.position as string,
    addressHash: data.addressHash as string,
    nomineeId: data.nomineeId as string,
    castAt:
      data.castAt instanceof Timestamp
        ? data.castAt.toMillis()
        : (data.castAt as number),
  };
}

/**
 * Casts or updates a vote. Firestore document ID is `{agmId}_{position}_{addressHash}`.
 * Using setDoc (upsert) ensures one vote per physical address per position.
 */
export async function castVote(
  agmId: string,
  position: string,
  nomineeId: string,
  physicalAddress: string,
): Promise<void> {
  const addressHash = await hashAddress(physicalAddress);
  const docId = `${agmId}_${position.replace(/\s+/g, '_')}_${addressHash}`;
  await setDoc(doc(db, COL, docId), {
    agmId,
    position,
    addressHash,
    nomineeId,
    castAt: Date.now(),
  });
}

/** Get all votes for a given AGM and position */
export async function getVotesForPosition(
  agmId: string,
  position: string,
): Promise<Vote[]> {
  const q = query(
    collection(db, COL),
    where('agmId', '==', agmId),
    where('position', '==', position),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toVote(d.id, d.data() as Record<string, unknown>));
}

/** Get all votes for an AGM */
export async function getVotesForAGM(agmId: string): Promise<Vote[]> {
  const q = query(collection(db, COL), where('agmId', '==', agmId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => toVote(d.id, d.data() as Record<string, unknown>));
}

/** Check if an address has already voted for a specific position */
export async function hasVoted(
  agmId: string,
  position: string,
  physicalAddress: string,
): Promise<boolean> {
  const addressHash = await hashAddress(physicalAddress);
  const docId = `${agmId}_${position.replace(/\s+/g, '_')}_${addressHash}`;
  const snap = await getDoc(doc(db, COL, docId));
  return snap.exists();
}

/** Tally votes for a position — returns map of nomineeId → voteCount */
export function tallyVotes(votes: Vote[]): Record<string, number> {
  return votes.reduce<Record<string, number>>((acc, v) => {
    acc[v.nomineeId] = (acc[v.nomineeId] ?? 0) + 1;
    return acc;
  }, {});
}
