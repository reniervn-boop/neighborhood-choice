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
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';
import MembershipActions from '@/components/profile/MembershipActions';

const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  submitted:        { bg: '#FFF3E0', text: '#E65100', label: 'Submitted' },
  approved:         { bg: '#E8F5E9', text: '#2E7D32', label: 'Approved' },
  rejected:         { bg: '#FFEBEE', text: '#C62828', label: 'Rejected' },
  submitted_to_jra: { bg: '#E3F2FD', text: '#1565C0', label: 'Sent to JRA' },
};

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="relative inline-flex h-7 w-12 items-center rounded-full transition-colors flex-shrink-0"
      style={{ backgroundColor: value ? 'var(--primary)' : '#d1d5db' }}
    >
      <span
        className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
        style={{ transform: value ? 'translateX(26px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [realTime, setRealTime] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  async function loadReports() {
    if (!user) return;
    try {
      const userReports = await getUserReports(user.uid);
      setReports(userReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoadingReports(false);
    }
  }

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

  const handleSavePrefs = async () => {
    if (!user) return;
    setSavingPrefs(true);
    try {
      await updateNotificationPrefs(user.uid, { realTime, weeklyDigest });
      toast.success('Preferences saved');
    } catch {
      toast.error('Failed to save preferences');
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Signed out');
      router.push('/');
    } catch {
      toast.error('Failed to sign out');
    }
  };

  if (loading) return <LoadingScreen />;
  if (!user) return null;

  const initials = user.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="My Profile" />

      {/* Profile header */}
      <div style={{ backgroundColor: 'var(--primary)' }} className="px-4 pb-8">
        <div className="max-w-lg mx-auto flex items-center gap-4 pt-2">
          <div className="w-16 h-16 rounded-full bg-white/25 border-2 border-white/40 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-extrabold text-xl">{initials}</span>
          </div>
          <div className="text-white min-w-0">
            <h2 className="text-xl font-extrabold truncate">{user.name}</h2>
            <p className="text-white/70 text-sm truncate">{user.email}</p>
            <span
              className="inline-block mt-1 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: user.verified ? 'rgba(255,255,255,0.25)' : 'rgba(255,200,0,0.3)',
              }}
            >
              {user.verified ? '✓ Verified' : '⏳ Pending'}
            </span>
          </div>
        </div>
      </div>

      <main className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 -mt-4 space-y-4">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Points', value: user.points, color: 'var(--primary)' },
            { label: 'Badges', value: user.badges?.length || 0, color: '#f59e0b' },
            { label: 'Reports', value: reports.length, color: '#7c3aed' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 text-center">
              <p className="text-2xl font-extrabold" style={{ color }}>{value}</p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Account Details</h3>
          </div>
          {[
            { label: 'Unit / Block', value: user.unitBlock },
            { label: 'Role', value: user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Resident' },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center px-4 py-3 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-500">{label}</span>
              <span className="text-sm font-semibold text-gray-900">{value}</span>
            </div>
          ))}
        </div>

        {/* Badges */}
        {user.badges && user.badges.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <h3 className="font-bold text-gray-900 text-sm mb-3">Badges Earned</h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
                <span
                  key={badge}
                  className="text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary)' }}
                >
                  🏅 {badge}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Membership & Payments */}
        <MembershipActions user={user} />

        {/* Notification Preferences */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50">
            <h3 className="font-bold text-gray-900 text-sm">Notifications</h3>
          </div>

          <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50">
            <div className="flex-1 pr-4">
              <p className="text-sm font-semibold text-gray-900">Real-time alerts</p>
              <p className="text-xs text-gray-400">Get notified when your report is reviewed</p>
            </div>
            <Toggle value={realTime} onChange={setRealTime} />
          </div>

          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex-1 pr-4">
              <p className="text-sm font-semibold text-gray-900">Weekly digest</p>
              <p className="text-xs text-gray-400">Summary email every Monday</p>
            </div>
            <Toggle value={weeklyDigest} onChange={setWeeklyDigest} />
          </div>

          <div className="px-4 pb-4">
            <button
              onClick={handleSavePrefs}
              disabled={savingPrefs}
              className="w-full text-white font-bold py-3 rounded-xl transition-opacity text-sm disabled:opacity-60"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {savingPrefs ? 'Saving...' : 'Save Preferences'}
            </button>
          </div>
        </div>

        {/* My Reports */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-sm">My Reports</h3>
            <Link href="/report">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary)' }}
              >
                + New
              </span>
            </Link>
          </div>

          {loadingReports ? (
            <div className="flex items-center justify-center py-8">
              <svg className="animate-spin w-6 h-6" style={{ color: 'var(--primary)' }} viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-3xl mb-3">📋</p>
              <p className="text-gray-500 text-sm mb-4">You haven&apos;t submitted any reports yet.</p>
              <Link
                href="/report"
                className="inline-block text-white font-bold py-2.5 px-6 rounded-xl text-sm"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                Submit First Report
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {reports.map((report) => {
                const status = STATUS_COLORS[report.status] || STATUS_COLORS.submitted;
                return (
                  <div key={report.id} className="px-4 py-3">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-semibold text-gray-900 text-sm leading-tight">{report.title}</p>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: status.bg, color: status.text }}
                      >
                        {status.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mb-1">{report.category}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {new Date(report.createdAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {report.points > 0 && (
                        <span className="text-xs font-bold" style={{ color: 'var(--primary)' }}>
                          +{report.points} pts
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-gray-200 text-red-500 font-bold py-4 rounded-2xl transition-colors hover:bg-red-50 text-sm shadow-sm"
        >
          Sign Out
        </button>
      </main>
    </div>
  );
}
