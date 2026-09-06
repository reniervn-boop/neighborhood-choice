/**
 * Constitution Enforcement Utilities
 *
 * Enforces rules from the SX7RA Constitution v2.13.A (Final Draft 2026.07.18),
 * read with the amended and restated MOI (Final Draft 2026.07.14).
 * - Membership status (paying vs non-paying)
 * - Voting eligibility
 * - Committee office eligibility
 * - Quorum calculations
 * - Fee payment tracking
 */

import { User } from './types';

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
 * Whether the member falls in the Business Member category (Constitution
 * § 5.1.2). The vote belongs to the business entity and is exercised by its
 * designated representative.
 */
export function isBusinessMember(user: User | null | undefined): boolean {
  return user?.membershipCategory === 'business';
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
 * The Association's financial year runs 1 July → 30 June (Constitution § 8.5),
 * and the annual fee falls due on 1 July each year (§ 5.3.2).
 */
export const FINANCIAL_YEAR_START_MONTH = 6; // July, 0-indexed
export const FINANCIAL_YEAR_START_DAY = 1;

/**
 * Next 1 July strictly after the given instant.
 */
export function nextFeeDueDate(from: number = Date.now()): number {
  const d = new Date(from);
  const due = new Date(
    d.getFullYear(),
    FINANCIAL_YEAR_START_MONTH,
    FINANCIAL_YEAR_START_DAY,
  );
  if (due.getTime() <= from) due.setFullYear(due.getFullYear() + 1);
  return due.getTime();
}

/**
 * Whether the annual fee is past its due date.
 *
 * Constitution § 5.3.2: the fee is due on joining and thereafter on 1 July.
 * Note that being overdue is NOT by itself enough to lose the vote — see
 * hasMembershipLapsed() for the two-part test in § 5.3.5.
 */
export function isFeeOverdue(user: User | null | undefined): boolean {
  if (!user || !user.feeDueDate) return false;
  return Date.now() > user.feeDueDate;
}

/**
 * Whether membership has lapsed to non-paying status.
 *
 * Constitution § 5.3.5: a member lapses "once BOTH of the following have
 * occurred since their most recent membership fee payment: (a) twelve (12)
 * months have elapsed; and (b) an Annual General Meeting has been held."
 *
 * Both limbs are required, so a member who paid 13 months ago has NOT lapsed if
 * no AGM has been held in the interim.
 *
 * @param lastAgmDate Date of the most recent AGM, if one has been held
 */
export function hasMembershipLapsed(
  user: User | null | undefined,
  lastAgmDate?: number,
  now: number = Date.now(),
): boolean {
  if (!user) return false;
  if (user.membershipStatus !== 'paying') return false;
  if (!user.lastFeePaymentDate) return false;

  const twelveMonthsAfterPayment = new Date(user.lastFeePaymentDate);
  twelveMonthsAfterPayment.setFullYear(twelveMonthsAfterPayment.getFullYear() + 1);

  const twelveMonthsElapsed = now >= twelveMonthsAfterPayment.getTime();
  const agmHeldSincePayment =
    lastAgmDate !== undefined && lastAgmDate > user.lastFeePaymentDate;

  return twelveMonthsElapsed && agmHeldSincePayment;
}

/**
 * Whether a member paying by monthly instalment is in arrears far enough to
 * lapse.
 *
 * Constitution § 5.3.3: instalment payers stay in good standing while up to
 * date. They lapse if instalments fall more than two months into arrears AND
 * accumulated instalments for the year have not yet reached the annual fee. A
 * member whose accumulated instalments equal or exceed the annual fee is
 * treated as having paid in full and does not lapse.
 */
export function hasInstalmentPlanLapsed(
  monthsInArrears: number,
  accumulatedCents: number,
  annualFeeCents: number,
): boolean {
  if (accumulatedCents >= annualFeeCents) return false;
  return monthsInArrears > 2;
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
  if (!isPayingMember(user)) return false;
  // Constitution § 5.1.2: at most two Residential Paying Members per residential
  // address may exercise a vote. Where a third or later resident of the same
  // address pays, the Secretary clears votingDesignated for them — they remain
  // members in good standing but do not carry a vote.
  if (user!.votingDesignated === false) return false;
  return true;
}

/**
 * Whether a member may vote at a *specific* meeting.
 *
 * Constitution § 5.4.1: "a member is considered in good standing if their annual
 * membership fee was received and recorded by the Secretary on or before the
 * date on which the notice of that meeting was issued. A member who pays their
 * fee after the notice date shall have their membership status restored with
 * immediate effect but shall not be entitled to vote at the meeting for which
 * notice has already been issued."
 *
 * @param noticeIssuedAt When notice of the meeting went out
 */
export function canVoteAtMeeting(
  user: User | null | undefined,
  noticeIssuedAt: number,
): boolean {
  if (!canVoteInMeeting(user)) return false;
  const paidAt = user!.lastFeePaymentDate;
  if (paidAt === undefined) return false;
  return paidAt <= noticeIssuedAt;
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
 * Minimum number of paying members needed for a General Meeting, AGM or SGM.
 *
 * Constitution § 7.4.1 / MOI cl. 13.6: "the quorum ... shall be the greater of:
 * (a) twenty-five per cent (25%) of all paying members in good standing on the
 * date of the meeting, or (b) ten (10) paying members."
 *
 * Examples (from the Practical note to § 7.4.1):
 * - 60 paying members → 15 (25% is greater than the floor of 10)
 * - 30 paying members → 10 (the floor of 10 is greater than 25% = 8)
 *
 * @param totalPayingMembers Paying members in good standing on the meeting date
 * @returns Minimum number of members needed for quorum
 */
export function calculateQuorum(totalPayingMembers: number): number {
  const percent25 = Math.ceil(totalPayingMembers * 0.25);
  const floor = 10;

  const quorum = Math.max(percent25, floor);

  // A quorum can never exceed the membership it is drawn from. Where the
  // Association has fewer than ten paying members the whole membership is
  // needed; § 7.4.2–7.4.3 then govern the adjourned meeting.
  return Math.min(quorum, totalPayingMembers);
}

/**
 * Check if quorum is met.
 *
 * Constitution § 7.4.3 / s64(5) of the Act: at a meeting that has been properly
 * adjourned for want of a quorum, the members present constitute a quorum
 * whatever their number. Voting thresholds are unchanged — a special resolution
 * still needs 75% of the rights exercised.
 */
export function isQuorumMet(
  membersPresent: number,
  totalPayingMembers: number,
  isAdjournedMeeting = false,
): boolean {
  if (isAdjournedMeeting) return membersPresent > 0;
  return membersPresent >= calculateQuorum(totalPayingMembers);
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

  return {
    ...user,
    membershipStatus: 'paying',
    lastFeePaymentDate: now,
    // Constitution § 5.3.2 / § 8.5: the fee falls due on 1 July, the start of
    // the Association's financial year.
    feeDueDate: nextFeeDueDate(now),
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
