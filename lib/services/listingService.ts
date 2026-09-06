import { db, storage } from '@/lib/firebase/config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  deleteField,
} from 'firebase/firestore';
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { Listing, ListingKind } from '@/lib/types';

const COL = 'listings';

export function toListing(id: string, data: Record<string, unknown>): Listing {
  return {
    id,
    kind: data.kind as ListingKind,
    title: data.title as string,
    description: data.description as string | undefined,
    imageUrl: data.imageUrl as string | undefined,
    price: data.price as string | undefined,
    contactName: data.contactName as string | undefined,
    contactPhone: data.contactPhone as string | undefined,
    contactEmail: data.contactEmail as string | undefined,
    url: data.url as string | undefined,
    featured: Boolean(data.featured),
    createdBy: data.createdBy as string,
    createdAt:
      data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : (data.createdAt as number) ?? Date.now(),
    updatedAt:
      data.updatedAt instanceof Timestamp ? data.updatedAt.toMillis() : (data.updatedAt as number | undefined),
  };
}

export async function fetchListings(): Promise<Listing[]> {
  const snap = await getDocs(query(collection(db, COL)));
  return snap.docs
    .map((d) => toListing(d.id, d.data() as Record<string, unknown>))
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.createdAt - a.createdAt);
}

export interface CreateListingInput {
  kind: ListingKind;
  title: string;
  description?: string;
  price?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  url?: string;
  featured?: boolean;
  createdBy: string;
  imageFile?: File | null;
  onProgress?: (pct: number) => void;
}

export async function createListing(
  input: CreateListingInput,
): Promise<{ id: string } | { error: string }> {
  if (!input.title.trim()) return { error: 'Title is required' };

  let imageUrl: string | undefined;
  if (input.imageFile) {
    imageUrl = await uploadListingImage(input.imageFile, input.onProgress);
  }

  const payload: Record<string, unknown> = {
    kind: input.kind,
    title: input.title.trim(),
    featured: !!input.featured,
    createdBy: input.createdBy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const optional = {
    description: input.description?.trim(),
    price: input.price?.trim(),
    contactName: input.contactName?.trim(),
    contactPhone: input.contactPhone?.trim(),
    contactEmail: input.contactEmail?.trim(),
    url: input.url?.trim(),
    imageUrl,
  };
  for (const [k, v] of Object.entries(optional)) if (v) payload[k] = v;

  const docRef = await addDoc(collection(db, COL), payload);
  return { id: docRef.id };
}

export async function updateListing(
  id: string,
  data: Partial<Pick<Listing, 'title' | 'description' | 'price' | 'contactName' | 'contactPhone' | 'contactEmail' | 'url' | 'featured'>>,
): Promise<void> {
  const payload: Record<string, unknown> = { updatedAt: serverTimestamp() };
  for (const [k, v] of Object.entries(data)) {
    if (v === undefined) continue;
    payload[k] = v === null ? deleteField() : v;
  }
  await updateDoc(doc(db, COL, id), payload);
}

export async function deleteListing(listing: Listing): Promise<void> {
  if (listing.imageUrl) {
    try { await deleteObject(ref(storage, listing.imageUrl)); } catch { /* non-critical */ }
  }
  await deleteDoc(doc(db, COL, listing.id));
}

const MAX_IMG = 8 * 1024 * 1024;

export function uploadListingImage(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const storageRef = ref(storage, `listings/${Date.now()}_${file.name}`);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });
  return new Promise((resolve, reject) => {
    task.on(
      'state_changed',
      (s) => onProgress?.(Math.round((s.bytesTransferred / s.totalBytes) * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref)),
    );
  });
}

export { MAX_IMG as MAX_LISTING_IMAGE };
