import {
  createProject,
  getActiveProjects,
  getAllProjects,
  getProjectById,
  updateProject,
  createDonation,
  confirmDonation,
  getDonationsForProject,
  getUserDonations,
} from '@/lib/repositories/financeRepository';
import { validateCommunityProject, validateDonation } from '@/lib/validation/financeValidation';
import { CommunityProject, Donation, PaymentMethod } from '@/lib/types';

// ─── Projects ─────────────────────────────────────────────────────────────────

export interface CreateProjectInput {
  title: string;
  description: string;
  category: CommunityProject['category'];
  targetAmountCents: number;
  paymentMethods: PaymentMethod[];
  coverImageUrl?: string;
  createdBy: string;
  paymentConfig?: Record<string, string>;
  // Planning metadata (Brainmap: scope, budget, duration, start/end, progress)
  scope?: string;
  estimatedDurationDays?: number;
  startDate?: number;
  endDate?: number;
  progressPercent?: number;
  progressNote?: string;
}

export async function createCommunityProject(
  input: CreateProjectInput,
): Promise<{ id: string } | { error: string }> {
  const validation = validateCommunityProject(input);
  if (!validation.valid) {
    return { error: Object.values(validation.errors)[0] };
  }

  const id = await createProject({
    title: input.title.trim(),
    description: input.description.trim(),
    category: input.category,
    status: 'active',
    targetAmountCents: input.targetAmountCents,
    raisedAmountCents: 0,
    paymentMethods: input.paymentMethods,
    paymentConfig: input.paymentConfig,
    coverImageUrl: input.coverImageUrl,
    createdBy: input.createdBy,
    createdAt: Date.now(),
    scope: input.scope?.trim() || undefined,
    estimatedDurationDays: input.estimatedDurationDays,
    startDate: input.startDate,
    endDate: input.endDate,
    progressPercent: input.progressPercent,
    progressNote: input.progressNote?.trim() || undefined,
  });

  return { id };
}

/** Update planning metadata / progress on an existing project. */
export async function updateCommunityProject(
  id: string,
  data: Partial<Pick<CommunityProject,
    'title' | 'description' | 'category' | 'status' | 'targetAmountCents' |
    'scope' | 'estimatedDurationDays' | 'startDate' | 'endDate' |
    'progressPercent' | 'progressNote' | 'coverImageUrl'>>,
): Promise<void> {
  await updateProject(id, data);
}

export async function fetchActiveProjects(): Promise<CommunityProject[]> {
  return getActiveProjects();
}

export async function fetchAllProjects(): Promise<CommunityProject[]> {
  return getAllProjects();
}

export async function fetchProjectById(id: string): Promise<CommunityProject | null> {
  return getProjectById(id);
}

export async function updateProjectStatus(
  id: string,
  status: CommunityProject['status'],
): Promise<void> {
  await updateProject(id, { status });
}

// ─── Donations ────────────────────────────────────────────────────────────────

export interface InitiateDonationInput {
  projectId: string;
  userId: string;
  amountCents: number;
  method: PaymentMethod;
  anonymous: boolean;
  donorDisplayName?: string;
}

export async function initiateDonation(
  input: InitiateDonationInput,
): Promise<{ id: string } | { error: string }> {
  const validation = validateDonation({
    amountCents: input.amountCents,
    method: input.method,
  });
  if (!validation.valid) {
    return { error: Object.values(validation.errors)[0] };
  }

  const project = await getProjectById(input.projectId);
  if (!project) return { error: 'Project not found.' };
  if (project.status !== 'active') return { error: 'This project is no longer accepting donations.' };

  const id = await createDonation({
    projectId: input.projectId,
    userId: input.userId,
    amountCents: input.amountCents,
    method: input.method,
    status: 'pending',
    createdAt: Date.now(),
    anonymous: input.anonymous,
    donorDisplayName: input.anonymous ? undefined : input.donorDisplayName,
  });

  return { id };
}

/**
 * Called by the payment gateway webhook or manual admin confirm.
 * Atomically confirms the donation and increments the project total.
 */
export async function confirmProjectDonation(
  donationId: string,
  projectId: string,
  amountCents: number,
  gatewayRef: string,
): Promise<void> {
  await confirmDonation(donationId, projectId, amountCents, gatewayRef);

  // Auto-mark as funded if target reached
  const project = await getProjectById(projectId);
  if (project && project.raisedAmountCents + amountCents >= project.targetAmountCents) {
    await updateProject(projectId, { status: 'funded' });
  }
}

export async function fetchDonationsForProject(projectId: string): Promise<Donation[]> {
  return getDonationsForProject(projectId);
}

export async function fetchMyDonations(userId: string): Promise<Donation[]> {
  return getUserDonations(userId);
}

// ─── Payment Gateway Stubs ────────────────────────────────────────────────────

/**
 * Returns the payment URL/config for a given method.
 * Replace with real gateway SDK calls in production.
 */
export function getPaymentConfig(
  method: PaymentMethod,
  project: CommunityProject,
  amountCents: number,
  donationId: string,
): Record<string, string> {
  const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/finance/donate/success?donationId=${donationId}`;
  const cancelUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/finance/donate/cancel?donationId=${donationId}`;

  switch (method) {
    case 'payfast':
      return {
        merchant_id: project.paymentConfig?.payfast_merchant_id ?? '',
        merchant_key: project.paymentConfig?.payfast_merchant_key ?? '',
        amount: (amountCents / 100).toFixed(2),
        item_name: project.title,
        m_payment_id: donationId,
        return_url: returnUrl,
        cancel_url: cancelUrl,
        notify_url: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/api/payments/payfast`,
      };
    case 'snapscan':
      return {
        snapCode: project.paymentConfig?.snapscan_code ?? '',
        amount: String(amountCents),
        id: donationId,
        label: project.title,
        imageUrl: project.coverImageUrl ?? '',
      };
    case 'stitch':
      return {
        amount: String(amountCents),
        currency: 'ZAR',
        reference: donationId,
        beneficiary: project.title,
      };
    case 'eft':
    default:
      return {
        bankName: project.paymentConfig?.eft_bank ?? 'FNB',
        accountNumber: project.paymentConfig?.eft_account ?? '',
        branchCode: project.paymentConfig?.eft_branch ?? '',
        reference: donationId,
        amount: (amountCents / 100).toFixed(2),
      };
  }
}
