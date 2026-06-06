import { db } from '@/lib/firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import { Newsletter } from '@/lib/types';

export async function getNewsletters(count = 30): Promise<Newsletter[]> {
  const q = query(
    collection(db, 'newsletters'),
    orderBy('publishedAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Newsletter));
}

export async function createNewsletter(
  data: Omit<Newsletter, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'newsletters'), data);
  return ref.id;
}

export async function deleteNewsletter(id: string): Promise<void> {
  await deleteDoc(doc(db, 'newsletters', id));
}
