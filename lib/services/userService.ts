import { db } from '@/lib/firebase/config';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from 'firebase/firestore';
import { User } from '@/lib/types';

export async function createUser(userId: string, userData: Omit<User, 'uid' | 'joinedAt'>): Promise<void> {
  await setDoc(doc(db, 'users', userId), {
    ...userData,
    uid: userId,
    joinedAt: Timestamp.now().toMillis(),
  });
}

export async function getUser(userId: string): Promise<User | null> {
  const docSnapshot = await getDoc(doc(db, 'users', userId));
  if (docSnapshot.exists()) {
    return docSnapshot.data() as User;
  }
  return null;
}

export async function updateUserPoints(userId: string, pointsToAdd: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const currentPoints = userDoc.data().points || 0;
    await updateDoc(userRef, {
      points: currentPoints + pointsToAdd,
    });
  }
}

export async function awardBadgeToUser(userId: string, badgeId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const currentBadges = userDoc.data().badges || [];
    if (!currentBadges.includes(badgeId)) {
      await updateDoc(userRef, {
        badges: [...currentBadges, badgeId],
      });
    }
  }
}

export async function getLeaderboard(limit_count = 10): Promise<User[]> {
  const q = query(
    collection(db, 'users'),
    where('verified', '==', true),
    orderBy('points', 'desc'),
    limit(limit_count)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as User);
}

export async function updateNotificationPrefs(
  userId: string,
  prefs: { realTime?: boolean; weeklyDigest?: boolean }
): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const currentPrefs = userDoc.data().notificationPrefs || {};
    await updateDoc(userRef, {
      notificationPrefs: {
        ...currentPrefs,
        ...prefs,
      },
    });
  }
}

export async function verifyUser(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    verified: true,
  });
}

/** All committee / BOD / admin members (for the governance roster). */
export async function getStaffMembers(): Promise<User[]> {
  const q = query(
    collection(db, 'users'),
    where('role', 'in', ['committee', 'super_admin', 'admin']),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as User);
}

/** All members — used by the Master Residents Register. */
export async function getAllUsers(limitCount = 1000): Promise<User[]> {
  const q = query(collection(db, 'users'), orderBy('name'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => d.data() as User);
}

/** Assign role, portfolio and BOD membership to a user (committee management). */
export async function updateUserGovernance(
  userId: string,
  data: { role?: User['role']; portfolio?: string; isBoardMember?: boolean },
): Promise<void> {
  const payload: Record<string, unknown> = {};
  if (data.role !== undefined) payload.role = data.role;
  if (data.portfolio !== undefined) payload.portfolio = data.portfolio;
  if (data.isBoardMember !== undefined) payload.isBoardMember = data.isBoardMember;
  await updateDoc(doc(db, 'users', userId), payload);
}

/** Update a member's membership status / voting rights (Constitution enforcement). */
export async function updateMembershipStatus(
  userId: string,
  data: {
    membershipStatus?: User['membershipStatus'];
    canVote?: boolean;
    canStandForOffice?: boolean;
    lastFeePaymentDate?: number;
    feeDueDate?: number;
  },
): Promise<void> {
  const payload = Object.fromEntries(
    Object.entries(data).filter(([, v]) => v !== undefined),
  );
  await updateDoc(doc(db, 'users', userId), payload);
}

export async function getUserByInviteCode(inviteCode: string): Promise<User | null> {
  const q = query(collection(db, 'users'), where('inviteCode', '==', inviteCode));
  const snapshot = await getDocs(q);

  if (snapshot.docs.length > 0) {
    return snapshot.docs[0].data() as User;
  }
  return null;
}
