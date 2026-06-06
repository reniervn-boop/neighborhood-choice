import { ValidationResult, ProjectCategory, PaymentMethod } from '@/lib/types';

const PROJECT_CATEGORIES: ProjectCategory[] = [
  'Security', 'Infrastructure', 'Landscaping', 'Events', 'Maintenance', 'Other',
];

const PAYMENT_METHODS: PaymentMethod[] = ['payfast', 'snapscan', 'stitch', 'eft'];

export function validateCommunityProject(data: {
  title: string;
  description: string;
  category: string;
  targetAmountCents: number;
  paymentMethods: string[];
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title.trim() || data.title.trim().length < 3) {
    errors.title = 'Project title must be at least 3 characters.';
  }

  if (data.title.trim().length > 100) {
    errors.title = 'Project title cannot exceed 100 characters.';
  }

  if (!data.description.trim() || data.description.trim().length < 20) {
    errors.description = 'Description must be at least 20 characters.';
  }

  if (!PROJECT_CATEGORIES.includes(data.category as ProjectCategory)) {
    errors.category = 'Please select a valid category.';
  }

  if (!Number.isInteger(data.targetAmountCents) || data.targetAmountCents < 100) {
    errors.targetAmountCents = 'Target amount must be at least R1.00.';
  }

  if (data.targetAmountCents > 100_000_000) {
    errors.targetAmountCents = 'Target amount cannot exceed R1 000 000.';
  }

  if (data.paymentMethods.length === 0) {
    errors.paymentMethods = 'At least one payment method must be enabled.';
  }

  const invalidMethods = data.paymentMethods.filter(
    (m) => !PAYMENT_METHODS.includes(m as PaymentMethod),
  );
  if (invalidMethods.length > 0) {
    errors.paymentMethods = `Invalid payment methods: ${invalidMethods.join(', ')}.`;
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateDonation(data: {
  amountCents: number;
  method: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!Number.isInteger(data.amountCents) || data.amountCents < 100) {
    errors.amountCents = 'Minimum donation is R1.00.';
  }

  if (data.amountCents > 10_000_000) {
    errors.amountCents = 'Maximum donation is R100 000 per transaction.';
  }

  if (!PAYMENT_METHODS.includes(data.method as PaymentMethod)) {
    errors.method = 'Please select a valid payment method.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Formats ZAR cents to a display string e.g. 150000 → "R1 500.00" */
export function formatZAR(cents: number): string {
  return `R${(cents / 100).toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** Percentage funded, capped at 100 */
export function fundingPercent(raised: number, target: number): number {
  if (target === 0) return 0;
  return Math.min(100, Math.round((raised / target) * 100));
}
