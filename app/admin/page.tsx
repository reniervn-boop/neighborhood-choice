'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getPendingReports, approveReport, rejectReport } from '@/lib/services/reportService';
import { getLeaderboard } from '@/lib/services/userService';
import { processReportApproval } from '@/lib/services/gamificationService';
import { Report, User } from '@/lib/types';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }

    if (user?.role === 'admin') {
      loadDashboard();
    }
  }, [user, loading, router]);

  const loadDashboard = async () => {
    try {
      const [pending, top] = await Promise.all([getPendingReports(), getLeaderboard(10)]);
      setPendingReports(pending);
      setLeaderboard(top);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoadingData(false);
    }
  };

  const handleApprove = async (report: Report) => {
    setApprovingId(report.id);
    try {
      await approveReport(report.id, user!.uid, 15); // 10 base + 5 bonus
      await processReportApproval(report.id, report.userId);
      toast.success('Report approved!');
      setPendingReports(pendingReports.filter((r) => r.id !== report.id));
      loadDashboard(); // Refresh leaderboard
    } catch (error) {
      toast.error('Failed to approve report');
    } finally {
      setApprovingId(null);
    }
  };

  const handleReject = async (reportId: string) => {
    setApprovingId(reportId);
    try {
      await rejectReport(reportId, user!.uid);
      toast.success('Report rejected');
      setPendingReports(pendingReports.filter((r) => r.id !== reportId));
    } catch (error) {
      toast.error('Failed to reject report');
    } finally {
      setApprovingId(null);
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">⚙️ Admin Dashboard</h1>
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Pending Reviews</h3>
            <p className="text-3xl font-bold text-yellow-500">{pendingReports.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Top Reporter</h3>
            <p className="text-lg font-bold text-gray-900">{leaderboard[0]?.name || 'N/A'}</p>
            <p className="text-sm text-gray-600">{leaderboard[0]?.points || 0} points</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Active Users</h3>
            <p className="text-3xl font-bold text-blue-600">{leaderboard.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-semibold mb-2">Admin</h3>
            <p className="text-lg font-bold text-gray-900">{user.name}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Reports - Main Content */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Pending Reports ({pendingReports.length})</h2>
            </div>

            {pendingReports.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-600 text-lg mb-2">✨ All caught up!</p>
                <p className="text-gray-500">No pending reports to review</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {pendingReports.map((report) => (
                  <div key={report.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {report.category}
                        </span>
                      </div>
                      <p className="text-gray-600">{report.description}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        📍 {report.location.address} | {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {report.photos.length > 0 && (
                      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                        {report.photos.map((url, index) => (
                          <a key={index} href={url} target="_blank" rel="noopener noreferrer">
                            <img src={url} alt={`Photo ${index + 1}`} className="w-full h-24 object-cover rounded" />
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(report)}
                        disabled={approvingId === report.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
                      >
                        {approvingId === report.id ? 'Approving...' : '✓ Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(report.id)}
                        disabled={approvingId === report.id}
                        className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-2 rounded-lg transition-colors"
                      >
                        {approvingId === report.id ? 'Rejecting...' : '✗ Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Leaderboard Sidebar */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">🏆 Top Reporters</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {leaderboard.map((person, index) => (
                <div key={person.uid} className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-gray-400 w-8 text-center">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '#'}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">{person.name}</p>
                      <p className="text-xs text-gray-600">{person.unitBlock}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-blue-600">{person.points} pts</span>
                    <span className="text-xs text-gray-500">{person.badges?.length || 0} badges</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Admin Actions Info */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-sm text-purple-900">
            <strong>📋 Workflow:</strong> Review reports, approve (award points + check badges), or reject. Approved
            reports are ready for JRA/COJ submission.
          </p>
        </div>
      </main>
    </div>
  );
}
