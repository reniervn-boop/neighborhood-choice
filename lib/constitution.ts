/**
 * Constitution Enforcement Utilities
 *
 * Enforces rules from SX7RA Constitution v2.1
 * - Membership status (paying vs non-paying)
 * - Voting eligibility
 * - Committee office eligibility
 * - Quorum calculations
 * - Fee payment tracking
 */

import { User, MembershipStatus } from './types';

// ── Membership Status ────────────────────────────────────────────────────────

/**
 * Check if user is a paying member in good standing
 * Paying members can vote and stand for office
 *
 * Constitution § 5.4: "Each paying member in good standing has one (1) vote"
 */
export function isPayingMember(user: User | null | undefined): boolean {
  if (!user) return false;
  return (
    user.membershipStatus === 'paying' &&
    user.canVote === true &&
    user.suspensionReason === undefined
  );
}

/**
 * Check if user is a non-paying member
 * Non-paying members can attend and participate but cannot vote
 *
 * Constitution § 5.1.2: "Non-paying members may attend meetings and
 * participate in discussions but may not vote"
 */
export function isNonPayingMember(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.membershipStatus === 'non-paying';
}

/**
 * Check if user is suspended or expelled
 */
export function isSuspendedOrExpelled(user: User | null | undefined): boolean {
  if (!user) return false;
  return user.membershipStatus === 'suspended' || user.membershipStatus === 'expelled';
}

/**
 * Calculate if fee payment is overdue
 *
 * Constitution § 5.3.2: Annual fee due "1 March of each year"
 * Constitution § 5.3.4: "A member whose annual fee is not paid by 31 March
 * of the relevant membership year shall automatically lapse to non-paying
 * member status"
 */
export function isFeeOverdue(user: User | null | undefined): boolean {
  if (!user || !user.feeDueDate) return false;
  const now = Date.now();
  // Add 30 days grace period (March 1 → March 31)
  const graceEnd = user.feeDueDate + 30 * 24 * 60 * 60 * 1000;
  return now > graceEnd;
}

/**
 * Calculate days until fee is due
 */
export function daysUntilFeeDue(user: User | null | undefined): number {
  if (!user || !user.feeDueDate) return 0;
  const now = Date.now();
  const daysMs = user.feeDueDate - now;
  const days = Math.ceil(daysMs / (24 * 60 * 60 * 1000));
  return Math.max(0, days);
}

// ── Voting Rights ───────────────────────────────────────────────────────────

/**
 * Check if user can vote in AGM/General Meetings
 *
 * Constitution § 5.4.1: "Each paying member in good standing has one (1) vote
 * at General Meetings and at the Annual General Meeting"
 */
export function canVoteInMeeting(user: User | null | undefined): boolean {
  return isPayingMember(user);
}

/**
 * Check if user can cast a proxy vote
 *
 * Constitution § 5.4.2: "Paying members must be present in person or by
 * written proxy to vote. A proxy appointment must be in writing, dated, and
 * signed by the paying member"
 */
export function canCastProxyVote(user: User | null | undefined): boolean {
  return isPayingMember(user);
}

// ── Committee & Office Eligibility ──────────────────────────────────────────

/**
 * Check if user can stand for committee election
 *
 * Constitution § 5.1.3: "Any individual resident of a property is eligible to
 * stand for election to the Committee and to be appointed as a Director in
 * their own right, provided they are a paying member in good standing"
 *
 * Constitution § 6.2.4: "All committee members must be paying members of the
 * Association in good standing at the time of their nomination, election, and
 * throughout their term of office"
 */
export function canStandForCommittee(user: User | null | undefined): boolean {
  return isPayingMember(user);
}

/**
 * Check if user can be appointed as a Director
 *
 * Constitution § 6.1.2: "Directors shall be appointed from among the paying
 * members in good standing of the Association"
 */
export function canBeDirector(user: User | null | undefined): boolean {
  return isPayingMember(user);
}

// ── Meeting Quorum ──────────────────────────────────────────────────────────

/**
 * Calculate quorum required for a general meeting
 *
 * Constitution § 7.4.1: "The quorum for any General Meeting, Annual General
 * Meeting, or Special General Meeting shall be the greater of: (a) twenty-five
 * per cent (25%) of all paying members in good standing on the date of the
 * meeting, or (b) ten (10) paying members, whichever produces the lower number"
 *
 * @param totalPayingMembers Total number of paying members
 * @returns Minimum number of members needed for quorum
 *
 * Examples:
 * - 60 members: Math.max(Math.min(15, 10), 1) = 15
 * - 30 members: Math.max(Math.min(8, 10), 1) = 10
 * - 20 members: Math.max(Math.min(5, 10), 1) = 10
 * - 5 members: Math.max(Math.min(2, 10), 1) = 10 (impossible, shows edge case)
 */
export function calculateQuorum(totalPayingMembers: number): number {
  const percent25 = Math.ceil(totalPayingMembers * 0.25);
  const minimum = 10;

  // "the greater of... whichever produces the lower number"
  // Means: take 25% OR 10, whichever is LOWER
  const quorum = Math.min(percent25, minimum);

  // But never more than total members
  return Math.min(quorum, totalPayingMembers);
}

/**
 * Check if quorum is met
 */
export function isQuorumMet(membersPresent: number, totalPayingMembers: number): boolean {
  const requiredQuorum = calculateQuorum(totalPayingMembers);
  return membersPresent >= requiredQuorum;
}

// ── Resolution Voting ────────────────────────────────────────────────────────

/**
 * Check if ordinary resolution passed
 *
 * Constitution § 7.5.1: "Decisions at General Meetings and the AGM shall be
 * taken by a simple majority of paying members present and voting"
 */
export function isOrdinaryResolutionPassed(
  votesFor: number,
  votesAgainst: number,
  votesAbstain: number
): boolean {
  const totalVotes = votesFor + votesAgainst; // abstains don't count
  if (totalVotes === 0) return false;
  return votesFor > votesAgainst;
}

/**
 * Check if special resolution passed
 *
 * Constitution § 7.5.3: "The following matters require a special resolution,
 * being a resolution supported by at least seventy-five per cent (75%) of the
 * voting rights exercised at a Special General Meeting duly convened"
 *
 * Special matters:
 * - Amendment to constitution
 * - Dissolution or winding up
 * - Amalgamation or merger
 * - Amendment to MOI
 */
export function isSpecialResolutionPassed(
  votesFor: number,
  votesAgainst: number,
  votesAbstain: number
): boolean {
  const totalVotes = votesFor + votesAgainst; // abstains don't count
  if (totalVotes === 0) return false;
  const percentage = (votesFor / totalVotes) * 100;
  return percentage >= 75;
}

/**
 * Get percentage of votes in favor
 */
export function getVotePercentage(votesFor: number, totalVotes: number): number {
  if (totalVotes === 0) return 0;
  return (votesFor / totalVotes) * 100;
}

// ── Dues & Payment ──────────────────────────────────────────────────────────

/**
 * Mark a user as a paying member
 * Typically called when annual fee payment is received
 */
export function transitionToPayingMember(user: User): User {
  const now = Date.now();
  // Annual fee due: March 1st next year
  const nextYear = new Date(now);
  nextYear.setFullYear(nextYear.getFullYear() + 1);
  nextYear.setMonth(2); // March (0-indexed)
  nextYear.setDate(1);

  return {
    ...user,
    membershipStatus: 'paying',
    lastFeePaymentDate: now,
    feeDueDate: nextYear.getTime(),
    canVote: true,
    canStandForOffice: true,
    suspensionReason: undefined,
  };
}

/**
 * Mark a user as non-paying (typically when fee becomes overdue)
 */
export function transitionToNonPayingMember(user: User, reason: string = 'Annual fee overdue'): User {
  return {
    ...user,
    membershipStatus: 'non-paying',
    canVote: false,
    canStandForOffice: false,
    suspensionReason: reason,
  };
}

/**
 * Suspend a member
 *
 * Constitution § 5.6: "The Committee may recommend the suspension or expulsion
 * of a member who has materially breached the Code of Conduct"
 */
export function suspendMember(user: User, reason: string): User {
  return {
    ...user,
    membershipStatus: 'suspended',
    canVote: false,
    canStandForOffice: false,
    suspensionReason: reason,
  };
}

/**
 * Expel a member
 *
 * Constitution § 5.6: "An expelled member may appeal to the next General Meeting"
 */
export function expelMember(user: User, reason: string): User {
  return {
    ...user,
    membershipStatus: 'expelled',
    canVote: false,
    canStandForOffice: false,
    suspensionReason: reason,
  };
}

// ── Code of Conduct ─────────────────────────────────────────────────────────

/**
 * Validate that user is not in violation of Code of Conduct
 *
 * Constitution § 10: "All members, committee members, and Directors shall
 * at all times conduct themselves in a manner consistent with the objectives
 * and values of the Association"
 */
export function isInCodeOfConductGoodStanding(user: User): boolean {
  return !isSuspendedOrExpelled(user);
}

// ── Notices & Deadlines ─────────────────────────────────────────────────────

/**
 * Check if meeting notice was provided properly
 *
 * Constitution § 7.1.3: "Notice of the AGM, including the agenda, shall be
 * given to all members at least twenty-one (21) days before the meeting"
 */
export function isNoticeProperlyGiven(
  noticeSentAt: number,
  meetingScheduledFor: number,
  noticeTypeRequired: 'agm' | 'general' | 'special'
): boolean {
  const daysRequired = {
    agm: 21 * 24 * 60 * 60 * 1000,        // 21 days
    general: 14 * 24 * 60 * 60 * 1000,    // 14 days (§7.2.3)
    special: 30 * 24 * 60 * 60 * 1000,    // 30 days (§7.3.2)
  };

  const requiredNoticePeriod = daysRequired[noticeTypeRequired];
  const actualNoticePeriod = meetingScheduledFor - noticeSentAt;

  return actualNoticePeriod >= requiredNoticePeriod;
}

/**
 * Check if proxy appointment was submitted in time
 *
 * Constitution § 5.4.2: "A proxy instrument... delivered to the Secretary
 * not later than twenty-four (24) hours before the commencement of the meeting"
 */
export function isProxySubmittedInTime(
  proxySurrenderedAt: number,
  meetingStartsAt: number
): boolean {
  const hoursInMs = 24 * 60 * 60 * 1000;
  const deadline = meetingStartsAt - hoursInMs;
  return proxySurrenderedAt <= deadline;
}

// ── Suspension/Expulsion Process ────────────────────────────────────────────

/**
 * Check if proper notice was given before suspension/expulsion decision
 *
 * Constitution § 5.6.2: "Before any decision to suspend or expel, the member
 * concerned shall be given written notice of the alleged conduct and at least
 * fourteen (14) days within which to respond in writing"
 */
export function wasSuspensionNoticeProper(
  noticeGivenAt: number,
  decisionMadeAt: number
): boolean {
  const fourteenDaysMs = 14 * 24 * 60 * 60 * 1000;
  return decisionMadeAt - noticeGivenAt >= fourteenDaysMs;
}

// ── Membership Fee Automation ───────────────────────────────────────────────

/**
 * Get membership status summary for user
 */
export function getMembershipStatusSummary(user: User | null | undefined): {
  status: string;
  icon: string;
  description: string;
  canVote: boolean;
  canStandForOffice: boolean;
  isGoodStanding: boolean;
} {
  if (!user) {
    return {
      status: 'Not Registered',
      icon: '❌',
      description: 'Not a member',
      canVote: false,
      canStandForOffice: false,
      isGoodStanding: false,
    };
  }

  const isGood = isPayingMember(user);

  if (user.membershipStatus === 'expelled') {
    return {
      status: 'Expelled',
      icon: '🚫',
      description: user.suspensionReason || 'Expelled from Association',
      canVote: false,
      canStandForOffice: false,
      isGoodStanding: false,
    };
  }

  if (user.membershipStatus === 'suspended') {
    return {
      status: 'Suspended',
      icon: '⚠️',
      description: user.suspensionReason || 'Membership suspended',
      canVote: false,
      canStandForOffice: false,
      isGoodStanding: false,
    };
  }

  if (user.membershipStatus === 'paying') {
    return {
      status: 'Active Member',
      icon: '✓',
      description: 'Paying member in good standing',
      canVote: true,
      canStandForOffice: true,
      isGoodStanding: true,
    };
  }

  if (user.membershipStatus === 'non-paying') {
    return {
      status: 'Non-Paying',
      icon: '⏳',
      description: isFeeOverdue(user) ? 'Annual fee overdue' : 'Annual fee pending',
      canVote: false,
      canStandForOffice: false,
      isGoodStanding: false,
    };
  }

  return {
    status: 'Unknown',
    icon: '?',
    description: 'Membership status unknown',
    canVote: false,
    canStandForOffice: false,
    isGoodStanding: false,
  };
}
