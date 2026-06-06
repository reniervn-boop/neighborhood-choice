import { ValidationResult } from '@/lib/types';

const SA_PHONE_RE = /^0[6-8][0-9]{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup(data: {
  name: string;
  email: string;
  cell?: string;
  unitBlock: string;
  physicalAddress?: string;
  erfNumber?: string;
  password: string;
  confirmPassword: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name.trim() || data.name.trim().length < 2) {
    errors.name = 'Full name must be at least 2 characters.';
  }

  if (!EMAIL_RE.test(data.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (data.cell && !SA_PHONE_RE.test(data.cell.replace(/\s/g, ''))) {
    errors.cell = 'Enter a valid SA mobile number (e.g. 082 123 4567).';
  }

  if (!data.unitBlock.trim()) {
    errors.unitBlock = 'Unit / block number is required.';
  }

  if (data.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.';
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateLogin(data: { email: string; password: string }): ValidationResult {
  const errors: Record<string, string> = {};

  if (!EMAIL_RE.test(data.email)) {
    errors.email = 'Enter a valid email address.';
  }

  if (!data.password) {
    errors.password = 'Password is required.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
