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
import { defaultSeverity, computeSlaDueAt } from '@/lib/services/slaService';

export async function createReport(
  userId: string,
  reportData: Omit<Report, 'id' | 'createdAt' | 'userId'>
): Promise<string> {
  const createdAt = Timestamp.now().toMillis();
  const severity = reportData.severity ?? defaultSeverity(reportData.category);
  const slaDueAt = computeSlaDueAt({ category: reportData.category, severity, createdAt });
  const reportRef = await addDoc(collection(db, 'reports'), {
    ...reportData,
    userId,
    severity,
    slaDueAt,
    createdAt,
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
  pointsAwarded: number,
  report?: Pick<Report, 'category' | 'severity'>
): Promise<void> {
  const reportRef = doc(db, 'reports', reportId);
  const approvedAt = Timestamp.now().toMillis();
  const update: Record<string, unknown> = {
    status: 'approved',
    approvedAt,
    approvedBy: adminId,
    points: pointsAwarded,
  };
  // Re-anchor the SLA clock to approval time once the fault is confirmed.
  if (report) {
    update.slaDueAt = computeSlaDueAt({ category: report.category, severity: report.severity, createdAt: approvedAt, approvedAt });
  }
  await updateDoc(reportRef, update);
}

/** Escalate a report to the Ward Councillor group (manual or auto). */
export async function escalateReport(
  reportId: string,
  note?: string
): Promise<void> {
  const reportRef = doc(db, 'reports', reportId);
  const update: Record<string, unknown> = {
    escalatedToWardAt: Timestamp.now().toMillis(),
  };
  if (note?.trim()) update.escalationNote = note.trim();
  await updateDoc(reportRef, update);
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

/** Fetch ALL reports regardless of status, newest first. Used by the committee panel. */
export async function getAllReports(limitCount = 300): Promise<Report[]> {
  const q = query(
    collection(db, 'reports'),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Report));
}

/** Save a committee note (and optional council reference) on a report document. */
export async function addCommitteeNote(
  reportId: string,
  note: string,
  committeeUserId: string,
  councilReference?: string
): Promise<void> {
  const reportRef = doc(db, 'reports', reportId);
  await updateDoc(reportRef, {
    committeeNote: note,
    committeeNoteAt: Timestamp.now().toMillis(),
    committeeNoteBy: committeeUserId,
    ...(councilReference
      ? { councilReference, escalatedAt: Timestamp.now().toMillis() }
      : {}),
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
