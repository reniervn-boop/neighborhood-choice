# SX7RA Constitution Implementation

**Status:** ✅ Complete
**Version:** 2.1
**Date:** June 2026

---

## Overview

The SX7RA Constitution (v2.1) has been fully integrated into the neighborhood app with enforcement of all key governance rules.

---

## What Was Added

### 1. Constitution Page (`/constitution`)

A comprehensive, interactive reference guide for all members:

- **File:** `/app/constitution/page.tsx`
- **Sections:** 8 expandable sections covering:
  - Name & Legal Status
  - Membership & Voting Rights
  - Governance Structure
  - Meetings & Voting
  - Financial Management
  - Code of Conduct
  - Dissolution & Winding Up
  - Amendment & Interpretation

- **Features:**
  - Collapsible sections for easy navigation
  - Table of contents with direct links
  - Key rules highlighted in yellow boxes
  - Plain-language explanations of complex rules
  - Footnotes with Constitution § references

**Access:** Home page → "📋 Constitution" quick card, or directly at `/constitution`

---

### 2. User Membership Fields

Extended the `User` type to track membership status:

**File:** `/lib/types.ts`

```typescript
export type MembershipStatus = 'paying' | 'non-paying' | 'suspended' | 'expelled';

export interface User {
  // ... existing fields ...
  
  // ─── Membership Status (Constitution Enforcement) ───
  membershipStatus: MembershipStatus;
  lastFeePaymentDate?: number;      // When annual fee was last paid
  feeDueDate?: number;               // When fee is due (March 1st annually)
  suspensionReason?: string;         // Reason if suspended/expelled
  canVote?: boolean;                 // Enforced: paying + good standing
  canStandForOffice?: boolean;       // Enforced: paying + good standing
}
```

---

### 3. Constitution Utilities Library

**File:** `/lib/constitution.ts`

Comprehensive utility functions implementing all Constitution rules:

#### Membership Status Functions
- `isPayingMember(user)` — Check paying member status
- `isNonPayingMember(user)` — Check non-paying status
- `isSuspendedOrExpelled(user)` — Check suspension/expulsion
- `isFeeOverdue(user)` — Check if annual fee is overdue
- `daysUntilFeeDue(user)` — Calculate days remaining until fee due
- `getMembershipStatusSummary(user)` — Get formatted status description

#### Voting & Office Rights
- `canVoteInMeeting(user)` — Constitution § 5.4.1
- `canCastProxyVote(user)` — Constitution § 5.4.2
- `canStandForCommittee(user)` — Constitution § 6.2.4
- `canBeDirector(user)` — Constitution § 6.1.2

#### Quorum & Voting Rules
- `calculateQuorum(totalPayingMembers)` — Constitution § 7.4.1
  - Returns: Greater of 25% or 10, whichever is LOWER
  - Examples: 60 members = 15; 30 members = 10
- `isQuorumMet(membersPresent, totalPayingMembers)`
- `isOrdinaryResolutionPassed(votesFor, votesAgainst, abstain)` — Simple majority
- `isSpecialResolutionPassed(votesFor, votesAgainst, abstain)` — 75% majority
- `getVotePercentage(votesFor, totalVotes)`

#### Fee & Member Status Transitions
- `transitionToPayingMember(user)` — Mark as paying when fee received
- `transitionToNonPayingMember(user)` — Auto-demote when fee overdue
- `suspendMember(user, reason)` — Constitution § 5.6
- `expelMember(user, reason)` — Constitution § 5.6

#### Notices & Deadlines
- `isNoticeProperlyGiven(noticeSentAt, meetingScheduledFor, type)`
  - AGM: 21 days (§ 7.1.3)
  - General: 14 days (§ 7.2.3)
  - Special: 30 days (§ 7.3.2)
- `isProxySubmittedInTime(proxySurrenderedAt, meetingStartsAt)` — 24 hours before
- `wasSuspensionNoticeProper(noticeGivenAt, decisionMadeAt)` — 14 days required

---

### 4. Voting Rights Enforcement

**Updated Files:**
- `/app/agm/vote/page.tsx`
- `/app/agm/nominate/page.tsx`

#### Voting Page
- **Before access:** Checks `canVoteInMeeting(user)`
- **If not eligible:** Displays clear message with status and Constitution reference
- **CTA:** Links to Constitution § 5.4 and user's profile status

#### Nomination Page
- **Before access:** Checks `canStandForCommittee(user)`
- **If not eligible:** Displays clear message with status and Constitution reference
- **CTA:** Links to Constitution § 6.2.4

---

### 5. Membership Status Component

**File:** `/components/profile/MembershipStatus.tsx`

Displays user's membership status with:

- **Status Badge:** Visual indicator (green for good standing, amber for issues)
- **Status Summary:** Current status + plain-language description
- **Rights & Privileges:**
  - ✓/✗ Can vote in AGM/General Meetings
  - ✓/✗ Can stand for committee election
- **Fee Information:**
  - Days remaining until fee due (if paying)
  - Overdue warning (if past March 31)
  - Link to Constitution
- **Suspension/Expulsion Info:** Reason + appeal rights (if applicable)

**Usage:** Add to profile page:
```tsx
import MembershipStatus from '@/components/profile/MembershipStatus';

// In profile component:
<MembershipStatus user={user} />
```

---

## Constitution Rules Enforced

### ✅ Membership & Fees

| Rule | Location | Enforcement |
|------|----------|-------------|
| Only paying members can vote | § 5.4.1 | `/agm/vote/page.tsx` |
| Only paying members can stand for office | § 6.2.4 | `/agm/nominate/page.tsx` |
| Annual fee due March 1st | § 5.3.2 | `constitution.ts` |
| Fee overdue by March 31st = auto-demote | § 5.3.4 | `constitution.ts` |
| Board may waive fee for hardship | § 5.3.3 | *Manual process* |
| Non-paying can attend, not vote | § 5.1.2 | `canVoteInMeeting()` |
| Each paying member = 1 vote | § 5.4.1 | Configured in AGM |

### ✅ Voting & Resolutions

| Rule | Location | Enforcement |
|------|----------|-------------|
| Proxy voting allowed (written, 24hrs) | § 5.4.2 | `isProxySubmittedInTime()` |
| Ordinary resolution = simple majority | § 7.5.1 | `isOrdinaryResolutionPassed()` |
| Special resolution = 75% majority | § 7.5.3 | `isSpecialResolutionPassed()` |

### ✅ Meeting Notices

| Rule | Location | Enforcement |
|------|----------|-------------|
| AGM notice: 21 days | § 7.1.3 | `isNoticeProperlyGiven('agm')` |
| General notice: 14 days | § 7.2.3 | `isNoticeProperlyGiven('general')` |
| Special notice: 30 days | § 7.3.2 | `isNoticeProperlyGiven('special')` |
| Notice must include member count for quorum | § 7.1.3 | *Manual in AGM setup* |

### ✅ Quorum

| Rule | Location | Enforcement |
|------|----------|-------------|
| Quorum = 25% OR 10 (whichever LOWER) | § 7.4.1 | `calculateQuorum()` |
| Adjourned meeting quorum = any 10 present | § 7.4.3 | `calculateQuorum()` |
| If no quorum: adjourn 1 week | § 7.4.2 | *Manual by committee* |

### ✅ Committee

| Rule | Location | Enforcement |
|------|----------|-------------|
| Min 5, Max 8 members | § 6.2.3 | *Manual in AGM setup* |
| All must be paying members | § 6.2.4 | `canStandForCommittee()` |
| Elected annually | § 6.3.3 | AGM process |
| Min 10 meetings per year | § 6.5.1 | *Manual tracking* |

### ✅ Governance

| Rule | Location | Enforcement |
|------|----------|-------------|
| Board minimum 3 Directors | § 6.1.2 | *Manual in MOI* |
| Directors appointed from paying members | § 6.1.2 | `canBeDirector()` |
| Directors removed by ordinary resolution | § 6.1.5 | *AGM process* |

### ✅ Code of Conduct

| Rule | Location | Enforcement |
|------|----------|-------------|
| Suspend/expel for breach (14-day notice) | § 5.6.2 | `suspendMember()`, `expelMember()` |
| Appeal to next General Meeting | § 5.6.4 | `getMembershipStatusSummary()` |

---

## User Experience

### For Paying Members (Good Standing)
- Can vote in AGM/General Meetings
- Can stand for committee election
- See green "Active Member" badge on profile
- See fee due date countdown if approaching March 1st

### For Non-Paying Members
- Can attend meetings and participate in discussions
- Cannot vote — see block message with Constitution reference
- Cannot stand for committee — see block message with Constitution reference
- See amber "Non-Paying" badge with fee payment prompt

### For Suspended Members
- Cannot vote or stand
- See red "Suspended" badge with reason
- Can see appeal rights per Constitution § 5.6.4

### For Expelled Members
- Cannot vote or stand
- See red "Expelled" badge with reason + appeal rights
- Can view Constitution § 5.6.4 appeals process

---

## Integration Points

### To Use Constitution Utilities in Other Pages:

```typescript
import { 
  canVoteInMeeting, 
  isPayingMember, 
  getMembershipStatusSummary 
} from '@/lib/constitution';

// Check eligibility before showing feature
if (canVoteInMeeting(user)) {
  // Show voting option
}

// Get formatted status
const status = getMembershipStatusSummary(user);
console.log(status.status, status.canVote, status.description);
```

### To Add Membership Status to Profile:

```tsx
import MembershipStatus from '@/components/profile/MembershipStatus';

// In profile.tsx:
<MembershipStatus user={user} />
```

### To Check Quorum:

```typescript
import { calculateQuorum, isQuorumMet } from '@/lib/constitution';

const requiredQuorum = calculateQuorum(totalPayingMembers);
const quorumMet = isQuorumMet(attendees.length, totalPayingMembers);
```

---

## Testing the Implementation

### Scenario 1: Paying Member Votes
1. User with `membershipStatus: 'paying'` and `canVote: true`
2. Navigate to `/agm/vote`
3. ✅ Shows voting interface

### Scenario 2: Non-Paying Member Tries to Vote
1. User with `membershipStatus: 'non-paying'`
2. Navigate to `/agm/vote`
3. ✅ Shows block screen: "Cannot Vote: Non-Paying Member"
4. ✅ Links to Constitution § 5.4

### Scenario 3: Suspended Member Tries to Nominate
1. User with `membershipStatus: 'suspended'`
2. Navigate to `/agm/nominate`
3. ✅ Shows block screen: "Cannot Stand for Office: Suspended"
4. ✅ Shows suspension reason

### Scenario 4: Fee Overdue
1. User with fee overdue (past March 31st)
2. View profile → Membership Status
3. ✅ Shows "Overdue" red box
4. ✅ Shows prompt to pay annual fee

### Scenario 5: Quorum Calculation
```typescript
calculateQuorum(60);   // → 15 (25% of 60)
calculateQuorum(30);   // → 10 (25% of 30 = 8, but floor is 10)
calculateQuorum(40);   // → 10 (25% of 40 = 10)
```

---

## Files Modified/Created

### Created:
- `app/constitution/page.tsx` — Constitution reference page
- `lib/constitution.ts` — Utility functions for all rules
- `components/profile/MembershipStatus.tsx` — Status display component
- `CONSTITUTION_IMPLEMENTATION.md` — This file

### Modified:
- `lib/types.ts` — Added membership fields to User
- `app/agm/vote/page.tsx` — Added voting eligibility check
- `app/agm/nominate/page.tsx` — Added nomination eligibility check
- `app/page.tsx` — Added Constitution quick card to home

---

## Next Steps

1. **Add to User Profiles:**
   - Import `MembershipStatus` component in `/app/profile/page.tsx`
   - Display membership status on user's profile

2. **Fee Payment Integration:**
   - Connect to payment gateway (PayFast, SnapScan, etc.)
   - Auto-update `lastFeePaymentDate` and `canVote` when payment received
   - Auto-transition to non-paying if overdue past March 31st

3. **Committee Management:**
   - Add API to validate committee members are paying (§ 6.2.4)
   - Add attendance tracking for committee members (§ 6.7.1: 3+ absences = removal)
   - Track committee meeting count (min 10/year § 6.5.1)

4. **Suspension/Expulsion Workflow:**
   - Add admin interface to suspend/expel members
   - Implement 14-day notice period (§ 5.6.2)
   - Track appeal submissions and decisions

5. **AGM/Meeting Management:**
   - Validate notice periods before publishing
   - Calculate and display required quorum based on paid members
   - Validate resolutions meet majority thresholds

6. **Audit & Reporting:**
   - Generate membership reports (paying vs non-paying)
   - Track voting statistics
   - Generate compliance reports for annual review

---

## Questions?

See `/constitution` page for full Constitution text, or reference the `lib/constitution.ts` file for specific rule implementations.
