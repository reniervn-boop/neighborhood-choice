import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { ServiceRequest, ServiceRequestType, ServiceRequestStatus } from '@/lib/types';

const COL = 'serviceRequests';

export const REQUEST_LABEL: Record<ServiceRequestType, string> = {
  debit_order_create: 'Set up debit order',
  debit_order_cancel: 'Cancel debit order',
  debit_order_hardcopy: 'Hardcopy debit-order form',
  membership_payment: 'Membership payment',
  sales_rep: 'Security sales rep callback',
};

function toRequest(id: string, data: Record<string, unknown>): ServiceRequest {
  return {
    id,
    type: data.type as ServiceRequestType,
    userId: data.userId as string,
    userName: data.userName as string,
    userEmail: data.userEmail as string | undefined,
    userCell: data.userCell as string | undefined,
    details: data.details as string | undefined,
    status: (data.status as ServiceRequestStatus) ?? 'open',
    createdAt:
      data.createdAt instanceof Timestamp ? data.createdAt.toMillis() : (data.createdAt as number) ?? Date.now(),
    handledBy: data.handledBy as string | undefined,
    handledAt:
      data.handledAt instanceof Timestamp ? data.handledAt.toMillis() : (data.handledAt as number | undefined),
  };
}

export interface CreateServiceRequestInput {
  type: ServiceRequestType;
  userId: string;
  userName: string;
  userEmail?: string;
  userCell?: string;
  details?: string;
}

export async function createServiceRequest(
  input: CreateServiceRequestInput,
): Promise<{ id: string }> {
  const payload: Record<string, unknown> = {
    type: input.type,
    userId: input.userId,
    userName: input.userName,
    status: 'open',
    createdAt: serverTimestamp(),
  };
  for (const k of ['userEmail', 'userCell', 'details'] as const) {
    if (input[k]?.trim()) payload[k] = input[k]!.trim();
  }
  const ref = await addDoc(collection(db, COL), payload);
  return { id: ref.id };
}

/** Committee: all requests, newest first. */
export async function fetchAllServiceRequests(): Promise<ServiceRequest[]> {
  const snap = await getDocs(query(collection(db, COL), orderBy('createdAt', 'desc')));
  return snap.docs.map((d) => toRequest(d.id, d.data() as Record<string, unknown>));
}

/** A resident's own requests. */
export async function fetchMyServiceRequests(userId: string): Promise<ServiceRequest[]> {
  const snap = await getDocs(query(collection(db, COL), where('userId', '==', userId)));
  return snap.docs
    .map((d) => toRequest(d.id, d.data() as Record<string, unknown>))
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function setRequestStatus(
  id: string,
  status: ServiceRequestStatus,
  handledBy: string,
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    status,
    handledBy,
    handledAt: serverTimestamp(),
  });
}
