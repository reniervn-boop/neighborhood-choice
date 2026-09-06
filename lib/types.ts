// ─── Service Requests (Debit orders, membership, sales rep) ───────────────────
// Brainmap: debit-order create/cancel/hardcopy notifications to "Deon and Tony",
// membership payment, and Security "Request Sales Rep". One committee-visible
// queue handles them all.

export type ServiceRequestType =
  | 'debit_order_create'
  | 'debit_order_cancel'
  | 'debit_order_hardcopy'
  | 'membership_payment'
  | 'sales_rep';

export type ServiceRequestStatus = 'open' | 'in_progress' | 'done' | 'cancelled';

export interface ServiceRequest {
  id: string;
  type: ServiceRequestType;
  userId: string;
  userName: string;
  userEmail?: string;
  userCell?: string;
  /** Free-text detail / amount / notes from the resident */
  details?: string;
  status: ServiceRequestStatus;
  createdAt: number;
  handledBy?: string;
  handledAt?: number;
}

// ─── SX7 Prospectus (Listings) ────────────────────────────────────────────────
// Brainmap: "SX7 Prospectus — Properties for sale, Business for Sale, Sponsoring
// Agents, Map of SX7 with SX7RA boundaries, Picture of streets and residences,
// Pictures of businesses (provided they are members), Xtra pictures of
// sponsoring businesses".

export type ListingKind =
  | 'property_sale'   // Properties for sale
  | 'business_sale'   // Businesses for sale
  | 'sponsoring_agent'// Estate agents who sponsor the association
  | 'member_business' // Member businesses
  | 'sponsor'         // Sponsoring businesses
  | 'gallery';        // Streets / residences photos

export interface Listing {
  id: string;
  kind: ListingKind;
  title: string;
  description?: string;
  imageUrl?: string;
  /** Price for property/business sale listings (free text, e.g. "R1 950 000") */
  price?: string;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  /** External link (agent listing, business website) */
  url?: string;
  /** Featured listings appear first */
  featured?: boolean;
  createdBy: string;
  createdAt: number;
  updatedAt?: number;
}

// ─── Petitions (Ward) ─────────────────────────────────────────────────────────
// Brainmap: "PETITIONS — Consider link to petitions", "No petitions at this
// time", "Link to IEC Website And WA".

export interface Petition {
  id: string;
  title: string;
  description?: string;
  /** External link where residents sign / view the petition */
  url: string;
  isActive: boolean;
  createdBy: string;
  createdByName: string;
  createdAt: number;
  /** Optional auto-close date */
  closesAt?: number;
}

// ─── Document Library ─────────────────────────────────────────────────────────
// Brainmap: "OTHER DOCUMENTS — Minutes of meetings, BOD decisions, Project
// Reports, Financial Statements. There must be view access dependent on viewer
// and document classification" + the "Document Templates" branch (Letterhead,
// Attendance Register, Bank Mandate, Logo, Minutes, CIPC, Budget, Debit Order
// Form, Membership Form, etc.).

/** Who may view a document. Enforced in Firestore rules + query filter. */
export type DocumentClassification =
  | 'public'     // any signed-in resident
  | 'members'    // paying members in good standing (+ staff)
  | 'committee'; // committee / BOD / admin only

export type DocumentCategory =
  | 'Minutes'
  | 'BOD Decision'
  | 'Financial Statement'
  | 'Project Report'
  | 'Constitution & MOI'
  | 'CIPC'
  | 'Template'
  | 'Other';

export interface LibraryDocument {
  id: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  classification: DocumentClassification;
  /** Uploaded file (Firebase Storage) — mutually exclusive with externalUrl */
  fileUrl?: string;
  /** External link (e.g. Google Drive) — used when no file is uploaded */
  externalUrl?: string;
  fileName?: string;
  mimeType?: string;
  sizeBytes?: number;
  uploadedBy: string;
  uploadedByName: string;
  createdAt: number;
  updatedAt?: number;
}

// ─── Newsletters ──────────────────────────────────────────────────────────────

export interface Newsletter {
  id: string;
  title: string;
  edition?: string; // e.g. "May 2026"
  description?: string;
  publishedAt: number;
  pdfUrl?: string;
  externalUrl?: string;
  thumbnailUrl?: string;
  authorName: string;
  authorId: string;
}

// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'resident' | 'committee' | 'super_admin' | 'admin';

export type MembershipStatus = 'paying' | 'non-paying' | 'suspended' | 'expelled';

/**
 * Constitution v2.13.A cl. 5.1.2 recognises three member categories. Status
 * ('paying' / 'non-paying') already distinguishes the two residential ones, so
 * this only needs to separate residential from business membership.
 */
export type MembershipCategory = 'residential' | 'business';

export interface User {
  uid: string;
  email: string;
  /** SA mobile number: 0XX XXX XXXX */
  cell?: string;
  /** Legacy field — same as cell */
  phone?: string;
  name: string;
  unitBlock: string;
  /** Suburb / estate name shown on profile */
  suburb?: string;
  /** ERF / stand number for AGM vote dedup */
  erfNumber?: string;
  /** Full physical address (used for SHA-256 vote-dedup hash) */
  physicalAddress?: string;
  verified: boolean;
  joinedAt: number;
  points: number;
  badges: string[];
  notificationPrefs: {
    realTime: boolean;
    weeklyDigest: boolean;
    byCategory?: Record<string, boolean>;
  };
  role: UserRole;
  inviteCode?: string;
  proofOfResidency?: string; // URL to uploaded document

  // ─── Committee / BOD (Brainmap: "COMMITTEE AND BOD") ────────────────────────
  /** Portfolio / position, e.g. "Chairperson", "Treasurer", "Secretary" */
  portfolio?: string;
  /** True if this member sits on the Board of Directors (BOD) */
  isBoardMember?: boolean;

  // ─── Membership Status (Constitution Enforcement) ───────────────────────────
  /** Paying or non-paying member status per SX7RA Constitution */
  membershipStatus?: MembershipStatus;
  /** Date last annual fee was paid (timestamp) */
  lastFeePaymentDate?: number;
  /** When annual fee is due for next payment (timestamp) */
  feeDueDate?: number;
  /** Reason for suspension/expulsion if applicable */
  suspensionReason?: string;
  /** Whether member can vote in AGM/General Meetings (paying + good standing) */
  canVote?: boolean;
  /** Whether member can stand for committee election (paying + good standing) */
  canStandForOffice?: boolean;
  /** Residential or business membership (Constitution cl. 5.1.2). Defaults to residential. */
  membershipCategory?: MembershipCategory;
  /** Trading name, for Business Members (Constitution cl. 5.1.2) */
  businessName?: string;
  /**
   * Constitution cl. 5.1.2 caps voting at two Residential Paying Members per
   * residential address. Set by the Secretary when a third+ resident at the
   * same address pays; those members keep membership but not the vote.
   */
  votingDesignated?: boolean;
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export interface Report {
  id: string;
  userId: string;
  category: ReportCategory;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  photos: string[]; // Firebase Storage URLs
  status: 'submitted' | 'approved' | 'rejected' | 'submitted_to_jra';
  createdAt: number;
  approvedAt?: number;
  approvedBy?: string;
  points: number;
  jraSubmission?: {
    id: string;
    timestamp: number;
    referenceNumber: string;
  };
  // Committee tracking fields (added v2)
  committeeNote?: string;
  committeeNoteAt?: number;
  committeeNoteBy?: string;
  councilReference?: string;
  escalatedAt?: number;

  // ─── SLA & Auto-escalation (Brainmap: AUTO ESCALATION) ──────────────────────
  /** Severity drives the SLA window; higher severity escalates sooner */
  severity?: ReportSeverity;
  /** Timestamp by which the responsible authority should have actioned this */
  slaDueAt?: number;
  /** Set when the fault has been escalated to the Ward Councillor group */
  escalatedToWardAt?: number;
  /** Free-text note attached at escalation time */
  escalationNote?: string;
}

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type ReportCategory =
  | 'Pothole'
  | 'Streetlight'
  | 'Graffiti'
  | 'Water Main'
  | 'Stormwater'
  | 'Traffic Light'
  | 'Pavement'
  | 'Other'
  // ─── Community improvement / rewards (Brainmap: REWARDS) ──────────────────
  // Positive contributions that earn points but are NOT faults — they are never
  // submitted to a municipality and never auto-escalate.
  | 'Pavement Care'
  | 'Poster Removal'
  | 'Garden/Greening';

/** Reward categories — civic improvements, not faults. */
export const REWARD_CATEGORIES: ReportCategory[] = ['Pavement Care', 'Poster Removal', 'Garden/Greening'];

export function isRewardCategory(category: ReportCategory): boolean {
  return REWARD_CATEGORIES.includes(category);
}

// ─── Gamification ─────────────────────────────────────────────────────────────

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  triggerCondition: BadgeTrigger;
  pointsAwarded: number;
}

export type BadgeTrigger =
  | { type: 'first_report' }
  | { type: 'report_count'; category?: ReportCategory; count: number }
  | { type: 'total_points'; points: number }
  | { type: 'referrals'; count: number }
  | { type: 'monthly_top'; rank: number };

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminAction {
  id: string;
  adminId: string;
  action: 'approved_report' | 'rejected_report' | 'awarded_badge' | 'sent_newsletter';
  reportId?: string;
  targetUserId?: string;
  timestamp: number;
  notes?: string;
}

export interface JRASubmission {
  id: string;
  reportIds: string[];
  submittedBy: string;
  submittedAt: number;
  format: 'csv' | 'email';
  authorities: string[];
  status: 'pending' | 'confirmed';
  referenceNumbers?: Record<string, string>;
}

/** Tracks individual report submissions to a specific municipality */
export interface MunicipalitySubmission {
  id: string;
  reportId: string;
  authorityId: string;
  authorityName: string;
  method: 'email' | 'mailto' | 'dialer' | 'portal';
  submittedAt: number;
  submittedBy: string;
  emailTo?: string;
  referenceNumber?: string;
  status: 'sent' | 'pending_reference' | 'acknowledged';
  resendEmailId?: string;
}

// ─── Noticeboard ──────────────────────────────────────────────────────────────

export type AnnouncementCategory =
  | 'General'
  | 'Security'
  | 'Maintenance'
  | 'Event'
  | 'Finance'
  | 'Governance';

export interface AnnouncementAttachment {
  name: string;
  url: string;
  /** MIME type e.g. application/pdf, image/jpeg */
  mimeType: string;
  sizeBytes: number;
}

export interface Announcement {
  id: string;
  title: string;
  /** HTML string from Tiptap rich-text editor */
  bodyHtml: string;
  /** Plain-text fallback for notifications / search */
  bodyText: string;
  category: AnnouncementCategory;
  authorId: string;
  authorName: string;
  attachments: AnnouncementAttachment[];
  /** If true, shown in the scrolling ticker as a priority alert */
  isPinned: boolean;
  publishedAt: number;
  updatedAt?: number;
  /** Optional auto-expiry timestamp */
  expiresAt?: number;
}

export type AlertCategory =
  | 'Crime'
  | 'Safety'
  | 'Load Shedding'
  | 'Water Outage'
  | 'Road Closure'
  | 'Other';

export interface LocalAlert {
  id: string;
  message: string;
  category: AlertCategory;
  severity: 'info' | 'warning' | 'critical';
  authorId: string;
  createdAt: number;
  expiresAt?: number;
  isActive: boolean;
}

// ─── AGM / Governance ─────────────────────────────────────────────────────────

export type AGMStatus = 'upcoming' | 'nominations_open' | 'voting_open' | 'closed';

export interface AGMWindow {
  id: string;
  title: string;
  description?: string;
  status: AGMStatus;
  nominationsOpenAt: number;
  nominationsCloseAt: number;
  votingOpenAt: number;
  votingCloseAt: number;
  createdBy: string;
  createdAt: number;
  /** Positions being elected, e.g. ['Chairperson', 'Treasurer', 'Secretary'] */
  positions: string[];
}

export interface Nomination {
  id: string;
  agmId: string;
  /** Position being nominated for */
  position: string;
  /** The user being nominated */
  nomineeId: string;
  nomineeName: string;
  nomineeUnitBlock: string;
  /** Short motivation / bio submitted by nominee */
  motivation: string;
  /** Whether the nominee accepted the nomination */
  accepted: boolean | null; // null = pending
  submittedAt: number;
  /** userId of who submitted the nomination */
  submittedBy: string;
}

export interface Vote {
  id: string;
  agmId: string;
  position: string;
  /** SHA-256 hex of normalised physicalAddress — used as Firestore doc ID suffix for dedup */
  addressHash: string;
  nomineeId: string;
  castAt: number;
  /** NOT stored in Firestore — only used transiently for dedup check */
  voterUserId?: string;
}

// ─── Finance / Projects ───────────────────────────────────────────────────────

export type ProjectCategory =
  | 'Security'
  | 'Infrastructure'
  | 'Landscaping'
  | 'Events'
  | 'Maintenance'
  | 'Other';

export type ProjectStatus = 'active' | 'funded' | 'completed' | 'cancelled';

export type PaymentMethod = 'payfast' | 'snapscan' | 'stitch' | 'eft';

export interface CommunityProject {
  id: string;
  title: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  /** Target amount in ZAR cents */
  targetAmountCents: number;
  /** Running total of confirmed donations in ZAR cents */
  raisedAmountCents: number;
  coverImageUrl?: string;
  createdBy: string;
  createdAt: number;
  updatedAt?: number;
  completedAt?: number;
  /** Enabled payment methods for this project */
  paymentMethods: PaymentMethod[];
  /** SnapScan merchant code / PayFast merchant ID, etc. */
  paymentConfig?: Record<string, string>;

  // ─── Project planning metadata (Brainmap: VISION/MISSION + FUNDING) ──────────
  /** Detailed scope of work */
  scope?: string;
  /** Estimated duration in days */
  estimatedDurationDays?: number;
  /** Estimated start date (timestamp) */
  startDate?: number;
  /** Estimated end date (timestamp) */
  endDate?: number;
  /** Committee-reported delivery progress 0–100 (distinct from funding %) */
  progressPercent?: number;
  /** Free-text progress note shown to residents */
  progressNote?: string;
}

export interface Donation {
  id: string;
  projectId: string;
  userId: string;
  /** Amount in ZAR cents */
  amountCents: number;
  method: PaymentMethod;
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  /** Gateway transaction reference */
  gatewayRef?: string;
  createdAt: number;
  confirmedAt?: number;
  anonymous: boolean;
  /** Display name shown on project progress — null if anonymous */
  donorDisplayName?: string;
}

// ─── Shared Utilities ─────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
