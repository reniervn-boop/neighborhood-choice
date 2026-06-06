import { db, storage } from '@/lib/firebase/config';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
  deleteField,
  orderBy,
  query,
  limit,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { Newsletter } from '@/lib/types';

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getNewsletters(count = 50): Promise<Newsletter[]> {
  const q = query(
    collection(db, 'newsletters'),
    orderBy('publishedAt', 'desc'),
    limit(count)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Newsletter));
}

// ── Write ─────────────────────────────────────────────────────────────────────

export async function createNewsletter(
  data: Omit<Newsletter, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'newsletters'), data);
  return ref.id;
}

/**
 * Create a newsletter document with a pre-determined ID.
 * Used when a PDF must be uploaded before the doc is created
 * (so we know the storage path = newsletters/{id}/...).
 */
export async function createNewsletterWithId(
  id: string,
  data: Omit<Newsletter, 'id'>
): Promise<void> {
  // Strip undefined values — Firestore rejects them in setDoc too
  const payload = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined)
  );
  await setDoc(doc(db, 'newsletters', id), payload);
}

/** Generate a new Firestore document ID without creating the document. */
export function newNewsletterRef(): string {
  return doc(collection(db, 'newsletters')).id;
}

/**
 * Update a newsletter document.
 * - `undefined` values are stripped (Firestore rejects them in updateDoc)
 * - Pass `null` for any optional field to explicitly delete it from Firestore
 */
type NewsletterUpdate = Omit<
  Partial<Omit<Newsletter, 'id'>>,
  'pdfUrl' | 'externalUrl' | 'edition' | 'description' | 'thumbnailUrl'
> & {
  pdfUrl?: string | null;
  externalUrl?: string | null;
  edition?: string | null;
  description?: string | null;
  thumbnailUrl?: string | null;
};

export async function updateNewsletter(
  id: string,
  data: NewsletterUpdate
): Promise<void> {
  const payload: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;          // skip undefined
    if (v === null) payload[k] = deleteField(); // null → deleteField()
    else payload[k] = v;
  }
  await updateDoc(doc(db, 'newsletters', id), payload);
}

export async function deleteNewsletter(id: string): Promise<void> {
  await deleteDoc(doc(db, 'newsletters', id));
}

// ── Storage ───────────────────────────────────────────────────────────────────

/**
 * Upload a PDF to Firebase Storage under newsletters/{newsletterId}/{filename}.
 * Calls onProgress(0–100) as the upload proceeds.
 * Returns the public download URL on completion.
 */
export function uploadNewsletterPdf(
  file: File,
  newsletterId: string,
  onProgress?: (pct: number) => void
): Promise<string> {
  const storageRef = ref(
    storage,
    `newsletters/${newsletterId}/${Date.now()}_${file.name}`
  );
  const task = uploadBytesResumable(storageRef, file, {
    contentType: 'application/pdf',
  });

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snapshot) => {
        const pct = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        onProgress?.(pct);
      },
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

/**
 * Delete a PDF from Storage by its full gs:// or https:// URL.
 * Silently ignores errors (e.g. file already deleted).
 */
export async function deleteNewsletterPdf(url: string): Promise<void> {
  try {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  } catch {
    // not critical
  }
}
