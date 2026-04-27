'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { useAuth } from '@/lib/hooks/useAuth';
import { updateNotificationPrefs } from '@/lib/services/userService';
import { getUserReports } from '@/lib/services/reportService';
import { Report } from '@/lib/types';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [realTime, setRealTime] = useState(user?.notificationPrefs.realTime ?? true);
  const [weeklyDigest, setWeeklyDigest] = useState(user?.notificationPrefs.weeklyDigest ?? true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
      return;
    }

    if (user) {
      setRealTime(user.notificationPrefs.realTime);
      setWeeklyDigest(user.notificationPrefs.weeklyDigest);
      loadReports();
    }
  }, [user, loading, router]);

  const loadReports = async () => {
    if (!user) return;
    try {
      const userReports = await getUserReports(user.uid);
      setReports(userReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoadingReports(false);
    }
  };

  const handleSavePrefs = async () => {
    if (!user) return;

    setSavingPrefs(true);
    try {
      await updateNotificationPrefs(user.uid, {
        realTime,
        weeklyDigest,
      });
      toast.success('Notification preferences saved');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Profile</h1>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* User Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Name</span>
              <span className="font-semibold text-gray-900">{user.name}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Email</span>
              <span className="font-semibold text-gray-900">{user.email}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Unit / Block</span>
              <span className="font-semibold text-gray-900">{user.unitBlock}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Status</span>
              <span className={`font-semibold ${user.verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {user.verified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-gray-600">Role</span>
              <span className="font-semibold text-gray-900 capitalize">{user.role}</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Points</h3>
            <p className="text-3xl font-bold text-blue-600">{user.points}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Badges Earned</h3>
            <p className="text-3xl font-bold text-amber-500">{user.badges?.length || 0}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Reports Submitted</h3>
            <p className="text-3xl font-bold text-purple-600">{reports.length}</p>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Real-time Notifications</h3>
                <p className="text-sm text-gray-600">Get notified immediately when something important happens</p>
              </div>
              <button
                onClick={() => setRealTime(!realTime)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  realTime ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    realTime ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">Weekly Digest</h3>
                <p className="text-sm text-gray-600">Receive a summary email every Monday</p>
              </div>
              <button
                onClick={() => setWeeklyDigest(!weeklyDigest)}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  weeklyDigest ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    weeklyDigest ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <button
              onClick={handleSavePrefs}
              disabled={savingPrefs}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors mt-6"
            >
              {savingPrefs ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* Recent Reports */}
        {loadingReports ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading your reports...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Reports</h2>
            {reports.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You haven't submitted any reports yet.</p>
                <Link
                  href="/report"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
                >
                  Submit Your First Report
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{report.title}</h3>
                        <p className="text-sm text-gray-600">{report.category}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          report.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : report.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">{new Date(report.createdAt).toLocaleDateString()}</span>
                      {report.points > 0 && <span className="font-semibold text-blue-600">+{report.points} points</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}
