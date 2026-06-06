'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getLeaderboard } from '@/lib/services/userService';
import { useAuth } from '@/lib/hooks/useAuth';
import { User } from '@/lib/types';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';

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
    if (user) loadLeaderboard();
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

  if (loading || loadingData) return <LoadingScreen message="Loading leaderboard..." />;
  if (!user) return null;

  const userRank = leaderboard.findIndex((u) => u.uid === user.uid) + 1;
  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader
        title="Leaderboard"
        rightElement={
          <Link href="/report">
            <div
              className="text-white text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              + Report
            </div>
          </Link>
        }
      />

      <main className="max-w-lg mx-auto">
        {/* Your rank banner */}
        {userRank > 0 && (
          <div
            className="mx-4 mt-4 rounded-2xl p-4 flex items-center justify-between"
            style={{ backgroundColor: 'var(--primary)', color: 'white' }}
          >
            <div>
              <p className="text-white/70 text-xs font-medium">Your ranking</p>
              <p className="text-2xl font-extrabold">#{userRank}</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs font-medium">Total points</p>
              <p className="text-2xl font-extrabold">{user.points}</p>
            </div>
            <div
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-bold"
            >
              {user.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </div>
          </div>
        )}

        {/* Top 3 podium */}
        {top3.length >= 3 && (
          <div className="px-4 mt-4">
            <div className="flex items-end justify-center gap-3 mb-4">
              {/* 2nd place */}
              <div className="flex-1 text-center">
                <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-lg font-bold text-white mb-2 shadow ${top3[1].uid === user.uid ? 'ring-2 ring-offset-1' : ''}`}
                  style={{ backgroundColor: '#9e9e9e', ...(top3[1].uid === user.uid ? { ringColor: 'var(--primary)' } : {}) }}>
                  {top3[1].name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <p className="text-xs font-bold text-gray-700 truncate">{top3[1].name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-400">{top3[1].points} pts</p>
                <div className="h-14 rounded-t-lg mt-1 flex items-center justify-center" style={{ backgroundColor: '#bdbdbd' }}>
                  <span className="text-white font-extrabold text-lg">2</span>
                </div>
              </div>

              {/* 1st place */}
              <div className="flex-1 text-center">
                <div className="text-2xl mb-1">👑</div>
                <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center text-xl font-bold text-white mb-2 shadow-lg ${top3[0].uid === user.uid ? 'ring-2 ring-offset-1' : ''}`}
                  style={{ backgroundColor: '#f59e0b' }}>
                  {top3[0].name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <p className="text-xs font-bold text-gray-700 truncate">{top3[0].name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-400">{top3[0].points} pts</p>
                <div className="h-20 rounded-t-lg mt-1 flex items-center justify-center" style={{ backgroundColor: 'var(--primary)' }}>
                  <span className="text-white font-extrabold text-xl">1</span>
                </div>
              </div>

              {/* 3rd place */}
              <div className="flex-1 text-center">
                <div className={`w-14 h-14 rounded-full mx-auto flex items-center justify-center text-lg font-bold text-white mb-2 shadow ${top3[2].uid === user.uid ? 'ring-2 ring-offset-1' : ''}`}
                  style={{ backgroundColor: '#cd7f32' }}>
                  {top3[2].name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <p className="text-xs font-bold text-gray-700 truncate">{top3[2].name?.split(' ')[0]}</p>
                <p className="text-xs text-gray-400">{top3[2].points} pts</p>
                <div className="h-10 rounded-t-lg mt-1 flex items-center justify-center" style={{ backgroundColor: '#a97c50' }}>
                  <span className="text-white font-extrabold text-lg">3</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Rest of the list */}
        <div className="px-4 space-y-2 mt-2">
          {(top3.length < 3 ? leaderboard : rest).map((person, index) => {
            const rank = top3.length < 3 ? index + 1 : index + 4;
            const isCurrentUser = person.uid === user.uid;
            const initials = person.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

            return (
              <div
                key={person.uid}
                className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border transition-all"
                style={{
                  borderColor: isCurrentUser ? 'var(--primary)' : '#f3f4f6',
                  backgroundColor: isCurrentUser ? 'var(--primary-bg)' : 'white',
                }}
              >
                <span className="w-8 text-center font-bold text-sm text-gray-400">#{rank}</span>

                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ backgroundColor: isCurrentUser ? 'var(--primary)' : '#9ca3af' }}
                >
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">
                    {person.name}
                    {isCurrentUser && <span className="ml-1 text-xs" style={{ color: 'var(--primary)' }}>(you)</span>}
                  </p>
                  <p className="text-xs text-gray-400">{person.unitBlock}</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-extrabold text-sm" style={{ color: 'var(--primary)' }}>{person.points}</p>
                  <p className="text-xs text-gray-400">{person.badges?.length || 0} badges</p>
                </div>
              </div>
            );
          })}
        </div>

        {leaderboard.length === 0 && (
          <div className="text-center py-16 px-6">
            <div className="text-5xl mb-4">🏆</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Be the first!</h2>
            <p className="text-gray-500 text-sm mb-6">No one has reported issues yet. Start now and claim the top spot.</p>
            <Link
              href="/report"
              className="inline-block text-white font-bold py-3 px-8 rounded-xl"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Report an Issue
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
