import { db } from '@/lib/firebase/config';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { Report } from '@/lib/types';

export async function createReport(
  userId: string,
  reportData: Omit<Report, 'id' | 'createdAt' | 'userId'>
): Promise<string> {
  const reportRef = await addDoc(collection(db, 'reports'), {
    ...reportData,
    userId,
    createdAt: Timestamp.now().toMillis(),
  });
  return reportRef.id;
}

export async function getUserReports(userId: string): Promise<Report[]> {
  const q = query(
    collection(db, 'reports'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Report));
}

export async function getApprovedReports(limit_count = 50): Promise<Report[]> {
  const q = query(
    collection(db, 'reports'),
    where('status', '==', 'approved'),
    orderBy('approvedAt', 'desc'),
    limit(limit_count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Report));
}

export async function getPendingReports(): Promise<Report[]> {
  const q = query(
    collection(db, 'reports'),
    where('status', '==', 'submitted'),
    orderBy('createdAt', 'asc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Report));
}

export async function approveReport(
  reportId: string,
  adminId: string,
  pointsAwarded: number
): Promise<void> {
  const reportRef = doc(db, 'reports', reportId);
  await updateDoc(reportRef, {
    status: 'approved',
    approvedAt: Timestamp.now().toMillis(),
    approvedBy: adminId,
    points: pointsAwarded,
  });
}

export async function rejectReport(reportId: string, adminId: string): Promise<void> {
  const reportRef = doc(db, 'reports', reportId);
  await updateDoc(reportRef, {
    status: 'rejected',
    approvedAt: Timestamp.now().toMillis(),
    approvedBy: adminId,
    points: 0,
  });
}

export async function markReportAsSubmittedToJRA(
  reportId: string,
  submissionId: string,
  referenceNumber: string
): Promise<void> {
  const reportRef = doc(db, 'reports', reportId);
  await updateDoc(reportRef, {
    status: 'submitted_to_jra',
    jraSubmission: {
      id: submissionId,
      timestamp: Timestamp.now().toMillis(),
      referenceNumber,
    },
  });
}
