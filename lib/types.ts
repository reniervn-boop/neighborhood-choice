// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole = 'resident' | 'committee' | 'super_admin' | 'admin';

export type MembershipStatus = 'paying' | 'non-paying' | 'suspended' | 'expelled';

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
}

export type ReportCategory =
  | 'Pothole'
  | 'Streetlight'
  | 'Graffiti'
  | 'Water Main'
  | 'Stormwater'
  | 'Traffic Light'
  | 'Pavement'
  | 'Other';

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

export interface Newsletter {
  id: string;
  subject: string;
  body: string;
  topReports: string[];
  leaderboard: { userId: string; username: string; points: number }[];
  stats: {
    totalReports: number;
    activeUsers: number;
    topCategories: Record<ReportCategory, number>;
  };
  sentAt?: number;
  sentTo?: number;
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
