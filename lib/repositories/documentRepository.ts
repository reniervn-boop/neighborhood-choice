import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  serverTimestamp,
  deleteField,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { LibraryDocument, DocumentClassification } from '@/lib/types';

const COL = 'documents';

function toMillis(v: unknown): number | undefined {
  if (v instanceof Timestamp) return v.toMillis();
  return v as number | undefined;
}

export function toDocumentDoc(id: string, data: Record<string, unknown>): LibraryDocument {
  return {
    id,
    title: data.title as string,
    description: data.description as string | undefined,
    category: data.category as LibraryDocument['category'],
    classification: data.classification as DocumentClassification,
    fileUrl: data.fileUrl as string | undefined,
    externalUrl: data.externalUrl as string | undefined,
    fileName: data.fileName as string | undefined,
    mimeType: data.mimeType as string | undefined,
    sizeBytes: data.sizeBytes as number | undefined,
    uploadedBy: data.uploadedBy as string,
    uploadedByName: data.uploadedByName as string,
    createdAt: toMillis(data.createdAt) ?? Date.now(),
    updatedAt: toMillis(data.updatedAt),
  };
}

/** Generate a new document ID without creating the document (needed for Storage path). */
export function newDocumentId(): string {
  return doc(collection(db, COL)).id;
}

export async function createDocumentWithId(
  id: string,
  data: Omit<LibraryDocument, 'id' | 'createdAt' | 'updatedAt'>,
): Promise<void> {
  // Firestore rejects undefined — strip empties before writing
  const payload = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  );
  await setDoc(doc(db, COL, id), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

/**
 * Fetch documents the caller is permitted to read.
 * `allowed` MUST match what the Firestore rules grant, otherwise the query is
 * rejected. Ordering is done client-side to avoid a composite index.
 */
export async function getDocumentsFor(
  allowed: DocumentClassification[],
): Promise<LibraryDocument[]> {
  if (allowed.length === 0) return [];
  const q = query(collection(db, COL), where('classification', 'in', allowed));
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => toDocumentDoc(d.id, d.data() as Record<string, unknown>))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getDocumentById(id: string): Promise<LibraryDocument | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return toDocumentDoc(snap.id, snap.data() as Record<string, unknown>);
}

type DocumentUpdate = Partial<Omit<LibraryDocument, 'id' | 'createdAt'>>;

export async function updateDocument(id: string, data: DocumentUpdate): Promise<void> {
  const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    if (v === null) payload[k] = deleteField();
    else payload[k] = v;
  }
  await updateDoc(doc(db, COL, id), payload);
}

export async function deleteDocument(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}
