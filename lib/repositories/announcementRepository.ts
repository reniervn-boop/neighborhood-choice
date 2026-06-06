import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Announcement } from '@/lib/types';

const COL = 'announcements';

function toAnnouncement(id: string, data: Record<string, unknown>): Announcement {
  return {
    id,
    title: data.title as string,
    bodyHtml: data.bodyHtml as string,
    bodyText: data.bodyText as string,
    category: data.category as Announcement['category'],
    authorId: data.authorId as string,
    authorName: data.authorName as string,
    attachments: (data.attachments as Announcement['attachments']) ?? [],
    isPinned: Boolean(data.isPinned),
    publishedAt:
      data.publishedAt instanceof Timestamp
        ? data.publishedAt.toMillis()
        : (data.publishedAt as number),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toMillis()
        : (data.updatedAt as number | undefined),
    expiresAt:
      data.expiresAt instanceof Timestamp
        ? data.expiresAt.toMillis()
        : (data.expiresAt as number | undefined),
  };
}

export async function createAnnouncement(
  data: Omit<Announcement, 'id'>,
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    publishedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getAnnouncements(limitCount = 20): Promise<Announcement[]> {
  const now = Date.now();
  // orderBy only — no where on publishedAt to avoid Timestamp vs number type mismatch
  const q = query(
    collection(db, COL),
    orderBy('publishedAt', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs
    .map((d) => toAnnouncement(d.id, d.data() as Record<string, unknown>))
    .filter((a) => !a.expiresAt || a.expiresAt > now);
}

export async function getAnnouncementById(id: string): Promise<Announcement | null> {
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return toAnnouncement(snap.id, snap.data() as Record<string, unknown>);
}

export async function updateAnnouncement(
  id: string,
  data: Partial<Omit<Announcement, 'id'>>,
): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteAnnouncement(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function getPinnedAnnouncements(): Promise<Announcement[]> {
  const q = query(
    collection(db, COL),
    where('isPinned', '==', true),
    orderBy('publishedAt', 'desc'),
    limit(5),
  );
  const snap = await getDocs(q);
  const now = Date.now();
  return snap.docs
    .map((d) => toAnnouncement(d.id, d.data() as Record<string, unknown>))
    .filter((a) => !a.expiresAt || a.expiresAt > now);
}
