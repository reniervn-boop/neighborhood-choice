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
  limit,
  serverTimestamp,
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CommunityProject, Donation } from '@/lib/types';

const PROJECTS_COL = 'communityProjects';
const DONATIONS_COL = 'donations';

function toProject(id: string, data: Record<string, unknown>): CommunityProject {
  return {
    id,
    title: data.title as string,
    description: data.description as string,
    category: data.category as CommunityProject['category'],
    status: data.status as CommunityProject['status'],
    targetAmountCents: data.targetAmountCents as number,
    raisedAmountCents: (data.raisedAmountCents as number) ?? 0,
    coverImageUrl: data.coverImageUrl as string | undefined,
    createdBy: data.createdBy as string,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toMillis()
        : (data.createdAt as number),
    updatedAt:
      data.updatedAt instanceof Timestamp
        ? data.updatedAt.toMillis()
        : (data.updatedAt as number | undefined),
    completedAt:
      data.completedAt instanceof Timestamp
        ? data.completedAt.toMillis()
        : (data.completedAt as number | undefined),
    paymentMethods: (data.paymentMethods as CommunityProject['paymentMethods']) ?? [],
    paymentConfig: data.paymentConfig as Record<string, string> | undefined,
    scope: data.scope as string | undefined,
    estimatedDurationDays: data.estimatedDurationDays as number | undefined,
    startDate:
      data.startDate instanceof Timestamp
        ? data.startDate.toMillis()
        : (data.startDate as number | undefined),
    endDate:
      data.endDate instanceof Timestamp
        ? data.endDate.toMillis()
        : (data.endDate as number | undefined),
    progressPercent: data.progressPercent as number | undefined,
    progressNote: data.progressNote as string | undefined,
  };
}

function toDonation(id: string, data: Record<string, unknown>): Donation {
  return {
    id,
    projectId: data.projectId as string,
    userId: data.userId as string,
    amountCents: data.amountCents as number,
    method: data.method as Donation['method'],
    status: data.status as Donation['status'],
    gatewayRef: data.gatewayRef as string | undefined,
    createdAt:
      data.createdAt instanceof Timestamp
        ? data.createdAt.toMillis()
        : (data.createdAt as number),
    confirmedAt:
      data.confirmedAt instanceof Timestamp
        ? data.confirmedAt.toMillis()
        : (data.confirmedAt as number | undefined),
    anonymous: Boolean(data.anonymous),
    donorDisplayName: data.donorDisplayName as string | undefined,
  };
}

// ── Projects ──────────────────────────────────────────────────────────────────

export async function createProject(
  data: Omit<CommunityProject, 'id'>,
): Promise<string> {
  // Firestore rejects undefined — strip empty optional fields before writing.
  const clean = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  );
  const ref = await addDoc(collection(db, PROJECTS_COL), {
    ...clean,
    raisedAmountCents: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function getActiveProjects(): Promise<CommunityProject[]> {
  const q = query(
    collection(db, PROJECTS_COL),
    where('status', 'in', ['active', 'funded']),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProject(d.id, d.data() as Record<string, unknown>));
}

export async function getAllProjects(): Promise<CommunityProject[]> {
  const q = query(
    collection(db, PROJECTS_COL),
    orderBy('createdAt', 'desc'),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toProject(d.id, d.data() as Record<string, unknown>));
}

export async function getProjectById(id: string): Promise<CommunityProject | null> {
  const snap = await getDoc(doc(db, PROJECTS_COL, id));
  if (!snap.exists()) return null;
  return toProject(snap.id, snap.data() as Record<string, unknown>);
}

export async function updateProject(
  id: string,
  data: Partial<Omit<CommunityProject, 'id'>>,
): Promise<void> {
  await updateDoc(doc(db, PROJECTS_COL, id), { ...data, updatedAt: serverTimestamp() });
}

// ── Donations ─────────────────────────────────────────────────────────────────

export async function createDonation(
  data: Omit<Donation, 'id'>,
): Promise<string> {
  const ref = await addDoc(collection(db, DONATIONS_COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function confirmDonation(
  donationId: string,
  projectId: string,
  amountCents: number,
  gatewayRef: string,
): Promise<void> {
  // Update donation status
  await updateDoc(doc(db, DONATIONS_COL, donationId), {
    status: 'confirmed',
    gatewayRef,
    confirmedAt: serverTimestamp(),
  });
  // Increment project raised amount atomically
  await updateDoc(doc(db, PROJECTS_COL, projectId), {
    raisedAmountCents: increment(amountCents),
    updatedAt: serverTimestamp(),
  });
}

export async function getDonationsForProject(
  projectId: string,
  limitCount = 50,
): Promise<Donation[]> {
  const q = query(
    collection(db, DONATIONS_COL),
    where('projectId', '==', projectId),
    where('status', '==', 'confirmed'),
    orderBy('confirmedAt', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toDonation(d.id, d.data() as Record<string, unknown>));
}

export async function getUserDonations(
  userId: string,
  limitCount = 20,
): Promise<Donation[]> {
  const q = query(
    collection(db, DONATIONS_COL),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => toDonation(d.id, d.data() as Record<string, unknown>));
}
