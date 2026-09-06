import { storage } from '@/lib/firebase/config';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import {
  newDocumentId,
  createDocumentWithId,
  getDocumentsFor,
  getDocumentById,
  updateDocument,
  deleteDocument,
} from '@/lib/repositories/documentRepository';
import {
  LibraryDocument,
  DocumentClassification,
  User,
} from '@/lib/types';

// ─── Visibility ───────────────────────────────────────────────────────────────

/** Staff = committee / BOD / admin / super_admin. */
function isStaff(user: Pick<User, 'role'>): boolean {
  return user.role === 'committee' || user.role === 'super_admin' || user.role === 'admin';
}

/** A paying member in good standing (per Constitution enforcement fields). */
function isPayingMember(user: Pick<User, 'membershipStatus'>): boolean {
  return user.membershipStatus === 'paying';
}

/**
 * Which classifications a user may read. MUST stay in sync with firestore.rules
 * `documents` read logic, otherwise the `in` query is rejected.
 */
export function allowedClassificationsFor(
  user: Pick<User, 'role' | 'membershipStatus'>,
): DocumentClassification[] {
  if (isStaff(user)) return ['public', 'members', 'committee'];
  if (isPayingMember(user)) return ['public', 'members'];
  return ['public'];
}

// ─── Read ───────────────────────────────────────────────────────────────────

export async function fetchDocuments(
  user: Pick<User, 'role' | 'membershipStatus'>,
): Promise<LibraryDocument[]> {
  return getDocumentsFor(allowedClassificationsFor(user));
}

export async function fetchDocumentById(id: string): Promise<LibraryDocument | null> {
  return getDocumentById(id);
}

// ─── Write ──────────────────────────────────────────────────────────────────

export interface CreateDocumentInput {
  title: string;
  description?: string;
  category: LibraryDocument['category'];
  classification: DocumentClassification;
  uploadedBy: string;
  uploadedByName: string;
  /** Provide either a File (uploaded to Storage) or an externalUrl. */
  file?: File | null;
  externalUrl?: string;
  onProgress?: (pct: number) => void;
}

export async function publishDocument(
  input: CreateDocumentInput,
): Promise<{ id: string } | { error: string }> {
  const title = input.title.trim();
  if (!title) return { error: 'Title is required' };
  if (!input.file && !input.externalUrl?.trim()) {
    return { error: 'Attach a file or paste a link' };
  }

  const id = newDocumentId();

  let fileUrl: string | undefined;
  let fileName: string | undefined;
  let mimeType: string | undefined;
  let sizeBytes: number | undefined;
  let externalUrl: string | undefined;

  if (input.file) {
    fileUrl = await uploadDocumentFile(input.file, id, input.onProgress);
    fileName = input.file.name;
    mimeType = input.file.type;
    sizeBytes = input.file.size;
  } else {
    externalUrl = input.externalUrl?.trim();
  }

  await createDocumentWithId(id, {
    title,
    description: input.description?.trim() || undefined,
    category: input.category,
    classification: input.classification,
    fileUrl,
    externalUrl,
    fileName,
    mimeType,
    sizeBytes,
    uploadedBy: input.uploadedBy,
    uploadedByName: input.uploadedByName,
  });

  return { id };
}

export async function editDocument(
  id: string,
  data: Partial<Pick<LibraryDocument, 'title' | 'description' | 'category' | 'classification'>>,
): Promise<void> {
  await updateDocument(id, data);
}

export async function removeDocument(docItem: LibraryDocument): Promise<void> {
  if (docItem.fileUrl) {
    await deleteDocumentFile(docItem.fileUrl).catch(() => {/* non-critical */});
  }
  await deleteDocument(docItem.id);
}

// ─── Storage ──────────────────────────────────────────────────────────────────

const MAX_SIZE = 25 * 1024 * 1024; // 25 MB

export function uploadDocumentFile(
  file: File,
  documentId: string,
  onProgress?: (pct: number) => void,
): Promise<string> {
  const storageRef = ref(
    storage,
    `documents/${documentId}/${Date.now()}_${file.name}`,
  );
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (snap) => onProgress?.(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
      reject,
      async () => {
        try {
          resolve(await getDownloadURL(task.snapshot.ref));
        } catch (err) {
          reject(err);
        }
      },
    );
  });
}

export async function deleteDocumentFile(url: string): Promise<void> {
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // not critical — file may already be gone
  }
}

export { MAX_SIZE as MAX_DOCUMENT_SIZE };
