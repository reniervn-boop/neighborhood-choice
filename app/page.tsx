'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Neighborhood of Choice</h1>
            <p className="text-gray-600">Report issues. Earn rewards. Build community.</p>
          </div>

          <div className="space-y-4">
            <Link
              href="/auth/login"
              className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="block w-full text-center border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-lg transition-colors"
            >
              Join Community
            </Link>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Help improve our neighborhood by reporting civic issues and earning points!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Neighborhood of Choice</h1>
          <Link href="/profile" className="text-gray-600 hover:text-gray-900">
            {user?.name}
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-600 text-sm font-semibold mb-2">Points</h2>
            <p className="text-3xl font-bold text-blue-600">{user?.points || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-600 text-sm font-semibold mb-2">Badges Earned</h2>
            <p className="text-3xl font-bold text-amber-500">{user?.badges?.length || 0}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-gray-600 text-sm font-semibold mb-2">Status</h2>
            <p className="text-lg font-semibold text-green-600">{user?.verified ? 'Verified' : 'Pending'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/report" className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow p-6 text-center cursor-pointer transition-colors">
            <h2 className="text-2xl font-bold mb-2">📋 Report Issue</h2>
            <p className="text-blue-100">Log a civic issue in your area</p>
          </Link>

          <Link href="/leaderboard" className="bg-amber-500 hover:bg-amber-600 text-white rounded-lg shadow p-6 text-center cursor-pointer transition-colors">
            <h2 className="text-2xl font-bold mb-2">🏆 Leaderboard</h2>
            <p className="text-amber-100">See top community reporters</p>
          </Link>

          {user?.role === 'admin' && (
            <Link href="/admin" className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow p-6 text-center cursor-pointer transition-colors">
              <h2 className="text-2xl font-bold mb-2">⚙️ Admin Dashboard</h2>
              <p className="text-purple-100">Manage reports and community</p>
            </Link>
          )}

          <Link href="/profile" className="bg-gray-600 hover:bg-gray-700 text-white rounded-lg shadow p-6 text-center cursor-pointer transition-colors">
            <h2 className="text-2xl font-bold mb-2">👤 Profile</h2>
            <p className="text-gray-100">View your stats and preferences</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
