import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import { isBuiltInSighting, seedSightings } from './seedSightings';

export interface HalloweenPhoto {
  id: string;
  filename: string;
  originalName: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  monsterType: string | null;
  uploadedAt: string;
  /** Firebase Storage download URL — always prefer this over the local path */
  imageUrl?: string;
  /**
   * True for the sightings bundled with the app (see seedSightings.ts). These
   * are not Firestore documents, so they cannot be edited or deleted from the
   * admin panel.
   */
  builtIn?: boolean;
}

const COL = 'halloween_photos';

/**
 * Fetch all sightings, newest first. Optionally filter by monster slug.
 *
 * The built-in sightings are merged in with whatever residents have uploaded,
 * so the map is never empty. If Firestore is unreachable the built-ins are
 * still returned rather than failing the whole page.
 */
export async function getHalloweenPhotos(monsterType?: string): Promise<HalloweenPhoto[]> {
  let uploaded: HalloweenPhoto[] = [];
  try {
    const q = query(collection(db, COL), orderBy('uploadedAt', 'desc'));
    const snap = await getDocs(q);
    uploaded = snap.docs.map((d) => ({ id: d.id, ...d.data() } as HalloweenPhoto));
  } catch (err) {
    console.warn('Could not read uploaded sightings, showing built-ins only:', err);
  }

  const all = [...uploaded, ...seedSightings].sort((a, b) =>
    b.uploadedAt.localeCompare(a.uploadedAt),
  );

  return monsterType ? all.filter((p) => p.monsterType === monsterType) : all;
}

/**
 * Upload a photo to Firebase Storage and save its metadata to Firestore.
 * Returns the saved photo (with Firestore-generated id and imageUrl).
 */
export async function addHalloweenPhoto(
  meta: Omit<HalloweenPhoto, 'id' | 'imageUrl'>,
  file: File,
): Promise<HalloweenPhoto> {
  // Upload image to Firebase Storage
  const storageRef = ref(storage, `halloween-uploads/${meta.filename}`);
  await uploadBytes(storageRef, file, { contentType: file.type });
  const imageUrl = await getDownloadURL(storageRef);

  // Save metadata (+ imageUrl) to Firestore
  const data = { ...meta, imageUrl };
  const docRef = await addDoc(collection(db, COL), data);

  return { id: docRef.id, ...data };
}

/**
 * Delete a sighting from Firestore and its image from Storage.
 * Returns true if found and deleted, false if the document didn't exist.
 */
export async function removeHalloweenPhoto(id: string): Promise<boolean> {
  // Built-ins ship with the app and have no Firestore document or Storage file.
  if (isBuiltInSighting(id)) return false;

  const docRef = doc(db, COL, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return false;

  const photo = { id: snap.id, ...snap.data() } as HalloweenPhoto;

  // Remove from Storage (prefer the stored URL; fall back to path by filename)
  try {
    const fileRef = photo.imageUrl
      ? ref(storage, photo.imageUrl)
      : ref(storage, `halloween-uploads/${photo.filename}`);
    await deleteObject(fileRef);
  } catch {
    // File may already be gone — not critical
  }

  await deleteDoc(docRef);
  return true;
}
