import { db } from '@/lib/firebase/config';
import { collection, addDoc, getDocs, query, where, orderBy, doc, updateDoc } from 'firebase/firestore';
import { MunicipalitySubmission } from '@/lib/types';

/** Save a municipality submission record to Firestore */
export async function createSubmission(
  data: Omit<MunicipalitySubmission, 'id'>
): Promise<string> {
  const ref = await addDoc(collection(db, 'municipalitySubmissions'), data);
  return ref.id;
}

/** Get all submissions for a specific report */
export async function getSubmissionsForReport(reportId: string): Promise<MunicipalitySubmission[]> {
  const q = query(
    collection(db, 'municipalitySubmissions'),
    where('reportId', '==', reportId),
    orderBy('submittedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MunicipalitySubmission));
}

/** Update a submission with a reference number once received from the municipality */
export async function updateSubmissionReference(
  submissionId: string,
  referenceNumber: string
): Promise<void> {
  await updateDoc(doc(db, 'municipalitySubmissions', submissionId), {
    referenceNumber,
    status: 'acknowledged',
  });
}

/** Get all pending submissions (for admin) */
export async function getPendingSubmissions(): Promise<MunicipalitySubmission[]> {
  const q = query(
    collection(db, 'municipalitySubmissions'),
    where('status', '==', 'pending_reference'),
    orderBy('submittedAt', 'desc')
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as MunicipalitySubmission));
}
