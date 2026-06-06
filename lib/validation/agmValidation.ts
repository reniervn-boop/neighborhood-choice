import { ValidationResult } from '@/lib/types';

export function validateAGMWindow(data: {
  title: string;
  positions: string[];
  nominationsOpenAt: number;
  nominationsCloseAt: number;
  votingOpenAt: number;
  votingCloseAt: number;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title.trim() || data.title.trim().length < 3) {
    errors.title = 'AGM title must be at least 3 characters.';
  }

  const validPositions = data.positions.filter((p) => p.trim().length > 0);
  if (validPositions.length === 0) {
    errors.positions = 'At least one position is required.';
  }

  const now = Date.now();

  if (data.nominationsOpenAt < now - 60_000) {
    errors.nominationsOpenAt = 'Nominations open date cannot be in the past.';
  }

  if (data.nominationsCloseAt <= data.nominationsOpenAt) {
    errors.nominationsCloseAt = 'Nominations close must be after nominations open.';
  }

  if (data.votingOpenAt < data.nominationsCloseAt) {
    errors.votingOpenAt = 'Voting cannot open before nominations close.';
  }

  if (data.votingCloseAt <= data.votingOpenAt) {
    errors.votingCloseAt = 'Voting close must be after voting opens.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateNomination(data: {
  nomineeId: string;
  position: string;
  motivation: string;
  positions: string[];
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.nomineeId) {
    errors.nomineeId = 'Please select a nominee.';
  }

  if (!data.positions.includes(data.position)) {
    errors.position = 'Please select a valid position.';
  }

  if (!data.motivation.trim() || data.motivation.trim().length < 20) {
    errors.motivation = 'Motivation must be at least 20 characters.';
  }

  if (data.motivation.trim().length > 500) {
    errors.motivation = 'Motivation cannot exceed 500 characters.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateVote(data: {
  nomineeId: string;
  position: string;
  physicalAddress: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.nomineeId) {
    errors.nomineeId = 'Please select a candidate to vote for.';
  }

  if (!data.position) {
    errors.position = 'Position is required.';
  }

  if (!data.physicalAddress.trim() || data.physicalAddress.trim().length < 5) {
    errors.physicalAddress =
      'Your physical address is required to verify your vote eligibility. Update it in your profile.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

/** Normalises an address for consistent SHA-256 hashing */
export function normaliseAddress(address: string): string {
  return address.trim().toLowerCase().replace(/\s+/g, ' ');
}

/** Returns SHA-256 hex of the normalised address */
export async function hashAddress(address: string): Promise<string> {
  const normalised = normaliseAddress(address);
  const encoded = new TextEncoder().encode(normalised);
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}
