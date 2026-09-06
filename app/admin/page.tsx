'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getPendingReports, getApprovedReports, approveReport, rejectReport } from '@/lib/services/reportService';
import { getLeaderboard } from '@/lib/services/userService';
import { processReportApproval } from '@/lib/services/gamificationService';
import { getAuthorityForCategory, ReportSummary } from '@/lib/services/municipalityService';
import { getSubmissionsForReport } from '@/lib/services/submissionService';
import { Report, User, MunicipalitySubmission } from '@/lib/types';
import { toast } from 'react-hot-toast';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';
import MunicipalityModal from '@/components/MunicipalityModal';

type Tab = 'pending' | 'approved' | 'leaderboard';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('pending');
  const [pendingReports, setPendingReports] = useState<Report[]>([]);
  const [approvedReports, setApprovedReports] = useState<Report[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reportSubmissions, setReportSubmissions] = useState<Record<string, MunicipalitySubmission[]>>({});

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      router.push('/');
      return;
    }
    if (user?.role === 'admin') loadDashboard();
  }, [user, loading, router]);

  async function loadDashboard() {
    try {
      const [pending, approved, top] = await Promise.all([
        getPendingReports(),
        getApprovedReports(50),
        getLeaderboard(10),
      ]);
      setPendingReports(pending);
      setApprovedReports(approved);
      setLeaderboard(top);
    } catch {
      toast.error('Failed to load dashboard');
    } finally {
      setLoadingData(false);
    }
  }

  const handleApprove = async (report: Report) => {
    setApprovingId(report.id);
    try {
      await approveReport(report.id, user!.uid, 15, { category: report.category, severity: report.severity });
      await processReportApproval(report.id, report.userId);
      toast.success('Report approved! Points awarded.');
      setPendingReports((prev) => prev.filter((r) => r.id !== report.id));
      loadDashboard();
    } catch {
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
      setPendingReports((prev) => prev.filter((r) => r.id !== reportId));
    } catch {
      toast.error('Failed to reject');
    } finally {
      setApprovingId(null);
    }
  };

  const openMunicipalityModal = async (report: Report) => {
    setSelectedReport(report);
    if (!reportSubmissions[report.id]) {
      try {
        const subs = await getSubmissionsForReport(report.id);
        setReportSubmissions((prev) => ({ ...prev, [report.id]: subs }));
      } catch {
        setReportSubmissions((prev) => ({ ...prev, [report.id]: [] }));
      }
    }
  };

  const onSubmitted = () => {
    if (selectedReport) {
      getSubmissionsForReport(selectedReport.id).then((subs) =>
        setReportSubmissions((prev) => ({ ...prev, [selectedReport!.id]: subs }))
      );
    }
  };

  if (loading || loadingData) return <LoadingScreen message="Loading admin dashboard…" />;
  if (!user || user.role !== 'admin') return null;

  const toReportSummary = (r: Report): ReportSummary => ({
    id: r.id,
    title: r.title,
    description: r.description,
    category: r.category,
    location: r.location,
    photos: r.photos,
    createdAt: r.createdAt,
  });

  const TABS: { id: Tab; label: string; count?: number }[] = [
    { id: 'pending', label: 'Review', count: pendingReports.length },
    { id: 'approved', label: 'Submit to City', count: approvedReports.length },
    { id: 'leaderboard', label: 'Top Reporters' },
  ];

  return (
    <div className="min-h-dvh pb-24 lg:pb-8" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Admin Dashboard" />

      {/* Stats strip */}
      <div style={{ backgroundColor: 'var(--primary)' }} className="pb-5">
        <div className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 grid grid-cols-3 gap-2 pt-2">
          {[
            { value: pendingReports.length, label: 'Pending' },
            { value: approvedReports.length, label: 'Approved' },
            { value: leaderboard.length, label: 'Active Users' },
          ].map(({ value, label }) => (
            <div key={label} className="bg-white/15 rounded-xl p-3 text-center text-white">
              <p className="text-2xl font-extrabold">{value}</p>
              <p className="text-white/70 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-lg lg:max-w-4xl mx-auto px-4 lg:px-8 -mt-3">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex gap-1 mb-4">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-colors"
              style={{
                backgroundColor: tab === t.id ? 'var(--primary)' : 'transparent',
                color: tab === t.id ? 'white' : '#6b7280',
              }}
            >
              {t.label}
              {t.count !== undefined && t.count > 0 && (
                <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/30 text-xs">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── PENDING REPORTS ───────────────────────────── */}
        {tab === 'pending' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {pendingReports.length === 0 ? (
              <div className="text-center py-14">
                <p className="text-4xl mb-3">✨</p>
                <p className="font-bold text-gray-900 mb-1">All caught up!</p>
                <p className="text-gray-400 text-sm">No pending reports to review</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {pendingReports.map((report) => (
                  <div key={report.id} className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="font-bold text-gray-900 text-sm leading-tight">{report.title}</p>
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary)' }}
                      >
                        {report.category}
                      </span>
                    </div>
                    {report.description && (
                      <p className="text-xs text-gray-500 mb-2 leading-relaxed">{report.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mb-3">
                      📍 {report.location.address || `${report.location.lat.toFixed(4)}, ${report.location.lng.toFixed(4)}`}
                      {' · '}{new Date(report.createdAt).toLocaleDateString('en-ZA')}
                    </p>
                    {report.photos?.length > 0 && (
                      <div className="grid grid-cols-3 gap-1.5 mb-3">
                        {report.photos.map((url, i) => (
                          <a key={i} href={url} target="_blank" rel="noopener noreferrer">
                            <img src={url} alt="" className="w-full h-20 object-cover rounded-lg" />
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(report)}
                        disabled={!!approvingId}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm"
                      >
                        {approvingId === report.id ? 'Approving…' : '✓ Approve'}
                      </button>
                      <button
                        onClick={() => handleReject(report.id)}
                        disabled={!!approvingId}
                        className="flex-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── SUBMIT TO CITY TAB ────────────────────────── */}
        {tab === 'approved' && (
          <div className="space-y-3">
            <div className="rounded-2xl p-4 flex items-start gap-3" style={{ backgroundColor: 'var(--primary-bg)' }}>
              <span className="text-xl flex-shrink-0">🏙️</span>
              <div>
                <p className="font-bold text-sm" style={{ color: 'var(--primary)' }}>Route to the right authority</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                  Each category maps to the correct Joburg department — email for JRA &amp; Joburg Water, dialer for JMPD &amp; City Power.
                </p>
              </div>
            </div>

            {approvedReports.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
                <p className="text-3xl mb-3">📭</p>
                <p className="font-bold text-gray-900 mb-1">No approved reports yet</p>
                <p className="text-gray-400 text-sm">Approve reports from the Review tab first</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                {approvedReports.map((report) => {
                  const authority = getAuthorityForCategory(report.category);
                  const submissions = reportSubmissions[report.id] || [];
                  const alreadySubmitted = submissions.length > 0;

                  return (
                    <div key={report.id} className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-0.5">
                        <p className="font-bold text-gray-900 text-sm leading-tight">{report.title}</p>
                        <span className="text-xl flex-shrink-0">{authority.icon}</span>
                      </div>
                      <p className="text-xs text-gray-400 mb-1">
                        {report.category} · {new Date(report.createdAt).toLocaleDateString('en-ZA')}
                      </p>
                      <p className="text-xs font-semibold mb-3" style={{ color: authority.color }}>
                        → {authority.shortName}
                        {authority.method === 'email' && ` · ${authority.email}`}
                        {authority.method === 'dialer' && ` · ${authority.phone}`}
                      </p>

                      {alreadySubmitted ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-700 font-semibold bg-green-50 px-3 py-1 rounded-full">
                            ✓ Submitted {new Date(submissions[0].submittedAt).toLocaleDateString('en-ZA')}
                          </span>
                          <button
                            onClick={() => openMunicipalityModal(report)}
                            className="text-xs font-bold"
                            style={{ color: 'var(--primary)' }}
                          >
                            Submit again →
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openMunicipalityModal(report)}
                          className="w-full text-white font-bold py-2.5 rounded-xl text-sm"
                          style={{ backgroundColor: authority.color }}
                        >
                          Submit to {authority.shortName}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── LEADERBOARD TAB ────────────────────────────── */}
        {tab === 'leaderboard' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {leaderboard.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-12">No users yet</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {leaderboard.map((person, index) => {
                  const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`;
                  return (
                    <div key={person.uid} className="flex items-center gap-3 px-4 py-3">
                      <span className="w-8 text-center text-lg">{medal}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{person.name}</p>
                        <p className="text-xs text-gray-400">{person.unitBlock}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-extrabold text-sm" style={{ color: 'var(--primary)' }}>{person.points} pts</p>
                        <p className="text-xs text-gray-400">{person.badges?.length || 0} badges</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Municipality modal */}
      {selectedReport && (
        <MunicipalityModal
          report={toReportSummary(selectedReport)}
          userId={user.uid}
          onClose={() => setSelectedReport(null)}
          onSubmitted={onSubmitted}
        />
      )}
    </div>
  );
}
