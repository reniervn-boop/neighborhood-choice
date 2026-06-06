import {
  createAGMWindow,
  getLatestAGM,
  getAllAGMs,
  getAGMById,
  updateAGMStatus,
  deriveAGMStatus,
} from '@/lib/repositories/agmRepository';
import {
  createNomination,
  getNominationsForAGM,
  getNominationsForPosition,
  respondToNomination,
  hasNomination,
} from '@/lib/repositories/nominationRepository';
import {
  castVote,
  getVotesForPosition,
  getVotesForAGM,
  hasVoted,
  tallyVotes,
} from '@/lib/repositories/voteRepository';
import {
  validateAGMWindow,
  validateNomination,
  validateVote,
} from '@/lib/validation/agmValidation';
import { AGMWindow, Nomination, Vote } from '@/lib/types';

// ─── AGM Windows ──────────────────────────────────────────────────────────────

export interface CreateAGMInput {
  title: string;
  description?: string;
  positions: string[];
  nominationsOpenAt: number;
  nominationsCloseAt: number;
  votingOpenAt: number;
  votingCloseAt: number;
  createdBy: string;
}

export async function createAGM(
  input: CreateAGMInput,
): Promise<{ id: string } | { error: string }> {
  const validation = validateAGMWindow(input);
  if (!validation.valid) {
    const firstError = Object.values(validation.errors)[0];
    return { error: firstError };
  }

  const id = await createAGMWindow({
    title: input.title.trim(),
    description: input.description?.trim(),
    positions: input.positions.map((p) => p.trim()).filter(Boolean),
    nominationsOpenAt: input.nominationsOpenAt,
    nominationsCloseAt: input.nominationsCloseAt,
    votingOpenAt: input.votingOpenAt,
    votingCloseAt: input.votingCloseAt,
    status: 'upcoming',
    createdBy: input.createdBy,
    createdAt: Date.now(),
  });

  return { id };
}

export async function fetchLatestAGM(): Promise<AGMWindow | null> {
  const agm = await getLatestAGM();
  if (!agm) return null;
  // Sync status client-side
  const derivedStatus = deriveAGMStatus(agm);
  if (derivedStatus !== agm.status) {
    await updateAGMStatus(agm.id, derivedStatus).catch(() => {});
    return { ...agm, status: derivedStatus };
  }
  return agm;
}

export async function fetchAllAGMs(): Promise<AGMWindow[]> {
  return getAllAGMs();
}

export async function fetchAGMById(id: string): Promise<AGMWindow | null> {
  return getAGMById(id);
}

// ─── Nominations ──────────────────────────────────────────────────────────────

export interface SubmitNominationInput {
  agmId: string;
  position: string;
  nomineeId: string;
  nomineeName: string;
  nomineeUnitBlock: string;
  motivation: string;
  submittedBy: string;
  availablePositions: string[];
}

export async function submitNomination(
  input: SubmitNominationInput,
): Promise<{ id: string } | { error: string }> {
  const validation = validateNomination({
    nomineeId: input.nomineeId,
    position: input.position,
    motivation: input.motivation,
    positions: input.availablePositions,
  });
  if (!validation.valid) {
    return { error: Object.values(validation.errors)[0] };
  }

  // Check for duplicate
  const exists = await hasNomination(input.agmId, input.position, input.nomineeId);
  if (exists) {
    return { error: `${input.nomineeName} is already nominated for ${input.position}.` };
  }

  const id = await createNomination({
    agmId: input.agmId,
    position: input.position,
    nomineeId: input.nomineeId,
    nomineeName: input.nomineeName,
    nomineeUnitBlock: input.nomineeUnitBlock,
    motivation: input.motivation.trim(),
    accepted: null,
    submittedAt: Date.now(),
    submittedBy: input.submittedBy,
  });

  return { id };
}

export async function fetchNominationsForAGM(agmId: string): Promise<Nomination[]> {
  return getNominationsForAGM(agmId);
}

export async function fetchNominationsForPosition(
  agmId: string,
  position: string,
): Promise<Nomination[]> {
  return getNominationsForPosition(agmId, position);
}

export async function acceptNomination(nominationId: string): Promise<void> {
  await respondToNomination(nominationId, true);
}

export async function declineNomination(nominationId: string): Promise<void> {
  await respondToNomination(nominationId, false);
}

// ─── Voting ───────────────────────────────────────────────────────────────────

export interface CastVoteInput {
  agmId: string;
  position: string;
  nomineeId: string;
  physicalAddress: string;
}

export async function submitVote(
  input: CastVoteInput,
): Promise<{ success: true } | { error: string }> {
  const validation = validateVote({
    nomineeId: input.nomineeId,
    position: input.position,
    physicalAddress: input.physicalAddress,
  });
  if (!validation.valid) {
    return { error: Object.values(validation.errors)[0] };
  }

  await castVote(input.agmId, input.position, input.nomineeId, input.physicalAddress);
  return { success: true };
}

export async function checkHasVoted(
  agmId: string,
  position: string,
  physicalAddress: string,
): Promise<boolean> {
  if (!physicalAddress.trim()) return false;
  return hasVoted(agmId, position, physicalAddress);
}

export interface PositionResult {
  position: string;
  tally: Record<string, number>; // nomineeId → count
  totalVotes: number;
  winner?: string; // nomineeId
}

export async function getVoteResults(agmId: string): Promise<PositionResult[]> {
  const agm = await getAGMById(agmId);
  if (!agm) return [];

  const results: PositionResult[] = [];
  for (const position of agm.positions) {
    const votes = await getVotesForPosition(agmId, position);
    const tally = tallyVotes(votes);
    const totalVotes = votes.length;
    const winner =
      totalVotes > 0
        ? Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0]
        : undefined;
    results.push({ position, tally, totalVotes, winner });
  }

  return results;
}
