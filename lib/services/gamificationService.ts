import { db } from '@/lib/firebase/config';
import { collection, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { Badge, Report, ReportCategory } from '@/lib/types';
import { awardBadgeToUser, updateUserPoints, getUser } from './userService';

const BASE_POINTS_REPORT = 10;
const BONUS_POINTS_WITH_PHOTO = 5;

export async function calculatePointsForReport(report: Report): Promise<number> {
  let points = BASE_POINTS_REPORT;
  if (report.photos && report.photos.length > 0) {
    points += BONUS_POINTS_WITH_PHOTO;
  }
  return points;
}

export async function checkAndAwardBadges(userId: string): Promise<string[]> {
  const awardedBadges: string[] = [];
  const badges = await getAllBadges();
  const user = await getUser(userId);

  if (!user) return [];

  // Count user's reports by status
  const q = query(collection(db, 'reports'), where('userId', '==', userId), where('status', '==', 'approved'));
  const snapshot = await getDocs(q);
  const approvedReports = snapshot.docs.map((doc) => doc.data() as Report);

  for (const badge of badges) {
    if (user.badges?.includes(badge.id)) continue; // Already has badge

    let shouldAward = false;

    if (badge.triggerCondition.type === 'first_report') {
      shouldAward = approvedReports.length >= 1;
    } else if (badge.triggerCondition.type === 'report_count') {
      const trigger = badge.triggerCondition as { type: 'report_count'; category?: ReportCategory; count: number };
      const categoryReports = trigger.category
        ? approvedReports.filter((r) => r.category === trigger.category)
        : approvedReports;

      shouldAward = categoryReports.length >= trigger.count;
    } else if (badge.triggerCondition.type === 'total_points') {
      shouldAward = user.points >= badge.triggerCondition.points;
    } else if (badge.triggerCondition.type === 'referrals') {
      // TODO: Implement referral tracking
      shouldAward = false;
    }

    if (shouldAward) {
      await awardBadgeToUser(userId, badge.id);
      awardedBadges.push(badge.id);
    }
  }

  return awardedBadges;
}

export async function processReportApproval(reportId: string, userId: string): Promise<void> {
  const points = BASE_POINTS_REPORT + BONUS_POINTS_WITH_PHOTO; // Max points
  await updateUserPoints(userId, points);
  await checkAndAwardBadges(userId);
}

export async function getAllBadges(): Promise<Badge[]> {
  const snapshot = await getDocs(collection(db, 'badges'));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Badge));
}

export async function initializeDefaultBadges(): Promise<void> {
  const badges: Omit<Badge, 'id'>[] = [
    {
      name: 'First Report',
      description: 'Submitted your first civic issue report',
      icon: '🚀',
      color: 'blue',
      triggerCondition: { type: 'first_report' },
      pointsAwarded: 10,
    },
    {
      name: 'Pothole Champion',
      description: 'Reported 5+ pothole issues',
      icon: '🕳️',
      color: 'amber',
      triggerCondition: { type: 'report_count', category: 'Pothole', count: 5 },
      pointsAwarded: 25,
    },
    {
      name: 'Safety First',
      description: 'Reported 3+ safety-related issues',
      icon: '💡',
      color: 'yellow',
      triggerCondition: { type: 'report_count', count: 3 },
      pointsAwarded: 20,
    },
    {
      name: 'Detail Detective',
      description: 'Submitted 5+ reports with photos',
      icon: '📷',
      color: 'purple',
      triggerCondition: { type: 'report_count', count: 5 },
      pointsAwarded: 20,
    },
    {
      name: 'Community Hero',
      description: 'Accumulated 50+ points',
      icon: '🦸',
      color: 'red',
      triggerCondition: { type: 'total_points', points: 50 },
      pointsAwarded: 50,
    },
  ];

  for (const badge of badges) {
    const badgesRef = collection(db, 'badges');
    // Add badge if it doesn't exist (check by name)
    const existing = (await getDocs(badgesRef)).docs.find(
      (doc) => doc.data().name === badge.name
    );
    if (!existing) {
      await updateDoc(doc(db, 'badges', badge.name.toLowerCase().replace(' ', '_')), badge);
    }
  }
}
