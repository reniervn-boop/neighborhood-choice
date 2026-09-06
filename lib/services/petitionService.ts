import {
  collection,
  doc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Petition } from '@/lib/types';

const COL = 'petitions';

export function toPetition(id: string, data: Record<string, unknown>): Petition {
  return {
    id,
    title: data.title as string,
    description: data.description as string | undefined,
    url: data.url as string,
    isActive: data.isActive !== false,
    createdBy: data.createdBy as string,
    createdByName: data.createdByName as string,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toMillis()
        : (data.createdAt as number) ?? Date.now(),
    closesAt:
      data.closesAt instanceof Timestamp
        ? data.closesAt.toMillis()
        : (data.closesAt as number | undefined),
  };
}

export interface CreatePetitionInput {
  title: string;
  description?: string;
  url: string;
  createdBy: string;
  createdByName: string;
}

export async function createPetition(
  input: CreatePetitionInput,
): Promise<{ id: string } | { error: string }> {
  if (!input.title.trim()) return { error: 'Title is required' };
  let url = input.url.trim();
  if (!url) return { error: 'A petition link is required' };
  if (!/^https?:\/\//i.test(url)) url = `https://${url}`;

  const payload: Record<string, unknown> = {
    title: input.title.trim(),
    url,
    isActive: true,
    createdBy: input.createdBy,
    createdByName: input.createdByName,
    createdAt: serverTimestamp(),
  };
  if (input.description?.trim()) payload.description = input.description.trim();

  const ref = await addDoc(collection(db, COL), payload);
  return { id: ref.id };
}

export async function setPetitionActive(id: string, isActive: boolean): Promise<void> {
  await updateDoc(doc(db, COL, id), { isActive });
}

export async function deletePetition(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
