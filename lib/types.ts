export interface User {
  uid: string;
  email: string;
  phone?: string;
  name: string;
  unitBlock: string;
  verified: boolean;
  joinedAt: number;
  points: number;
  badges: string[];
  notificationPrefs: {
    realTime: boolean;
    weeklyDigest: boolean;
    byCategory?: Record<string, boolean>;
  };
  role: 'resident' | 'admin';
  inviteCode?: string;
  proofOfResidency?: string; // URL to uploaded document
}

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
  points: number; // Points awarded for this report
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
  authorities: string[]; // ['JRA', 'City Power', 'Joburg Water', etc.]
  status: 'pending' | 'confirmed';
  referenceNumbers?: Record<string, string>; // authority -> reference number
}

export interface Newsletter {
  id: string;
  subject: string;
  body: string;
  topReports: string[]; // report IDs
  leaderboard: { userId: string; username: string; points: number }[];
  stats: {
    totalReports: number;
    activeUsers: number;
    topCategories: Record<ReportCategory, number>;
  };
  sentAt?: number;
  sentTo?: number; // count of recipients
}
