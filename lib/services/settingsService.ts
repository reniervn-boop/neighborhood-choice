import { db } from '@/lib/firebase/config';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// ─── Association Settings ─────────────────────────────────────────────────────
// Brainmap (COMMITTEE AND BOD): "the authorization must be specified, e.g. there
// must be a flag that can be switched on or off to allow approval of non valid
// members". Stored as a single document `settings/association`.

export interface AssociationSettings {
  /**
   * When true, committee may approve / admit members who do not yet meet the
   * "valid member" criteria (e.g. not yet paid). When false, only valid members
   * can be approved.
   */
  allowNonMemberApproval: boolean;
  updatedAt?: number;
  updatedBy?: string;
}

const DOC = doc(db, 'settings', 'association');

const DEFAULTS: AssociationSettings = {
  allowNonMemberApproval: false,
};

export async function getAssociationSettings(): Promise<AssociationSettings> {
  const snap = await getDoc(DOC);
  if (!snap.exists()) return { ...DEFAULTS };
  const data = snap.data();
  return {
    allowNonMemberApproval: Boolean(data.allowNonMemberApproval),
    updatedAt:
      typeof data.updatedAt === 'object' && data.updatedAt?.toMillis
        ? data.updatedAt.toMillis()
        : (data.updatedAt as number | undefined),
    updatedBy: data.updatedBy as string | undefined,
  };
}

export async function updateAssociationSettings(
  patch: Partial<Pick<AssociationSettings, 'allowNonMemberApproval'>>,
  updatedBy: string,
): Promise<void> {
  await setDoc(
    DOC,
    { ...patch, updatedBy, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
