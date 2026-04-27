'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLeaderboard } from '@/lib/services/userService';
import { useAuth } from '@/lib/hooks/useAuth';
import { User } from '@/lib/types';
import Link from 'next/link';

export default function LeaderboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      loadLeaderboard();
    }
  }, [user, loading, router]);

  const loadLeaderboard = async () => {
    try {
      const data = await getLeaderboard(50);
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userRank = leaderboard.findIndex((u) => u.uid === user.uid) + 1;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">🏆 Leaderboard</h1>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {userRank > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-blue-800">
              <strong>Your Rank:</strong> #{userRank} with {user.points} points
            </p>
          </div>
        )}

        <div className="space-y-4">
          {leaderboard.map((person, index) => {
            const isCurrentUser = person.uid === user.uid;
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;

            return (
              <div
                key={person.uid}
                className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                  isCurrentUser ? 'bg-blue-100 border-2 border-blue-400' : 'bg-white border border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-gray-400 w-12 text-center">{medal}</div>
                  <div>
                    <h2 className="font-semibold text-gray-900">{person.name}</h2>
                    <p className="text-sm text-gray-600">{person.unitBlock}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">{person.points}</p>
                  <p className="text-xs text-gray-500">{person.badges?.length || 0} badges</p>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No one has reported issues yet.</p>
            <p className="text-gray-500 mt-2">Be the first to earn points!</p>
            <Link
              href="/report"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Report an Issue
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
