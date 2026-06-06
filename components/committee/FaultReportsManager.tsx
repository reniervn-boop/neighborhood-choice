'use client';

import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { getAllReports, addCommitteeNote } from '@/lib/services/reportService';
import { Report, ReportCategory } from '@/lib/types';

// ── Constants ──────────────────────────────────────────────────────────────────

const STATUS_META: Record<string, { label: string; text: string; bg: string }> = {
  submitted:        { label: 'Pending',  text: '#92400E', bg: '#FEF3C7' },
  approved:         { label: 'Approved', text: '#065F46', bg: '#D1FAE5' },
  rejected:         { label: 'Rejected', text: '#991B1B', bg: '#FEE2E2' },
  submitted_to_jra: { label: 'Council',  text: '#1D4ED8', bg: '#DBEAFE' },
};

const CATEGORY_ICON: Record<string, string> = {
  Pothole: '🕳️',
  Streetlight: '💡',
  Graffiti: '🎨',
  'Water Main': '💧',
  Stormwater: '🌊',
  'Traffic Light': '🚦',
  Pavement: '🛤️',
  Other: '⚠️',
};

const ALL_CATEGORIES: ReportCategory[] = [
  'Pothole', 'Streetlight', 'Graffiti', 'Water Main',
  'Stormwater', 'Traffic Light', 'Pavement', 'Other',
];

function fmtDate(ms: number) {
  return new Date(ms).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

// ── Component ──────────────────────────────────────────────────────────────────

interface Props { userId: string; userName: string; }

export default function FaultReportsManager({ userId }: Props) {
  const [reports, setReports]         = useState<Report[]>([]);
  const [loading, setLoading]         = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [catFilter, setCatFilter]     = useState('all');
  const [search, setSearch]           = useState('');
  const [selected, setSelected]       = useState<Report | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteDraft, setNoteDraft]     = useState('');
  const [councilRef, setCouncilRef]   = useState('');
  const [savingNote, setSavingNote]   = useState(false);

  // ── Load ────────────────────────────────────────────────────────────────────

  const [loadError, setLoadError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const data = await getAllReports(300);
      setReports(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setLoadError(msg);
      toast.error('Could not load fault reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // ── Derived data ────────────────────────────────────────────────────────────

  const stats = useMemo(() => ({
    total:    reports.length,
    pending:  reports.filter(r => r.status === 'submitted').length,
    approved: reports.filter(r => r.status === 'approved').length,
    council:  reports.filter(r => r.status === 'submitted_to_jra').length,
    rejected: reports.filter(r => r.status === 'rejected').length,
  }), [reports]);

  const filtered = useMemo(() => reports.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (catFilter    !== 'all' && r.category !== catFilter)  return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.title.toLowerCase().includes(q) &&
          !(r.location?.address ?? '').toLowerCase().includes(q)) return false;
    }
    return true;
  }), [reports, statusFilter, catFilter, search]);

  // ── CSV export ──────────────────────────────────────────────────────────────

  const exportCSV = () => {
    const header = [
      'Date', 'Category', 'Title', 'Address',
      'Status', 'Description', 'Council Ref', 'Committee Note',
    ];
    const rows = [header, ...filtered.map(r => [
      fmtDate(r.createdAt),
      r.category,
      r.title,
      r.location?.address ?? '',
      STATUS_META[r.status]?.label ?? r.status,
      r.description,
      r.councilReference ?? '',
      r.committeeNote ?? '',
    ])].map(row =>
      row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')
    ).join('\n');

    const blob = new Blob([rows], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `SX7RA-fault-reports-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success(`${filtered.length} report${filtered.length === 1 ? '' : 's'} exported`);
  };

  // ── Note modal ──────────────────────────────────────────────────────────────

  const openNoteModal = (r: Report) => {
    setSelected(r);
    setNoteDraft(r.committeeNote ?? '');
    setCouncilRef(r.councilReference ?? '');
    setShowNoteModal(true);
  };

  const handleSaveNote = async () => {
    if (!selected) return;
    setSavingNote(true);
    try {
      await addCommitteeNote(selected.id, noteDraft.trim(), userId, councilRef.trim() || undefined);
      const patch: Partial<Report> = {
        committeeNote:    noteDraft.trim() || undefined,
        committeeNoteAt:  Date.now(),
        committeeNoteBy:  userId,
        ...(councilRef.trim() ? { councilReference: councilRef.trim(), escalatedAt: Date.now() } : {}),
      };
      setReports(prev => prev.map(r => r.id === selected.id ? { ...r, ...patch } : r));
      setSelected(prev => prev ? { ...prev, ...patch } : null);
      toast.success('Note saved');
      setShowNoteModal(false);
    } catch {
      toast.error('Could not save note');
    } finally {
      setSavingNote(false);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-extrabold text-gray-900">Fault Reports</h2>
          <p className="text-xs text-gray-400 mt-0.5">All resident-reported issues in the suburb</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="w-8 h-8 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-40"
            aria-label="Refresh"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
          <button
            onClick={exportCSV}
            disabled={loading || filtered.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-xs font-bold disabled:opacity-40 transition-opacity"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats row — tap a pill to filter by that status */}
      {!loading && (
        <div className="grid grid-cols-5 gap-1.5 mb-4">
          {[
            { label: 'All',      value: stats.total,    key: 'all',              color: '#374151' },
            { label: 'Pending',  value: stats.pending,  key: 'submitted',        color: '#92400E' },
            { label: 'Active',   value: stats.approved, key: 'approved',         color: '#065F46' },
            { label: 'Council',  value: stats.council,  key: 'submitted_to_jra', color: '#1D4ED8' },
            { label: 'Rejected', value: stats.rejected, key: 'rejected',         color: '#991B1B' },
          ].map(s => (
            <button
              key={s.key}
              onClick={() => setStatusFilter(prev => prev === s.key ? 'all' : s.key)}
              className="flex flex-col items-center rounded-xl py-2 px-1 border transition-all"
              style={{
                backgroundColor: statusFilter === s.key ? 'var(--primary-bg)' : 'white',
                borderColor:     statusFilter === s.key ? 'var(--primary)'    : '#E5E7EB',
              }}
            >
              <span className="font-extrabold text-base leading-none" style={{ color: s.color }}>
                {s.value}
              </span>
              <span className="text-gray-400 text-[10px] mt-0.5 leading-none">{s.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-3">
        <select
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
          className="flex-1 text-xs rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-gray-700 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {ALL_CATEGORIES.map(c => (
            <option key={c} value={c}>{CATEGORY_ICON[c]} {c}</option>
          ))}
        </select>

        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search title or address…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full text-xs rounded-xl border border-gray-200 bg-white pl-3 pr-8 py-2.5 text-gray-700 focus:outline-none"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Count line */}
      {!loading && (
        <p className="text-xs text-gray-400 mb-3">
          Showing <strong>{filtered.length}</strong> of {reports.length} report{reports.length === 1 ? '' : 's'}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="w-8 h-8 mx-auto rounded-full border-4 border-gray-200 border-t-red-500 animate-spin mb-3" />
          <p className="text-sm text-gray-400">Loading reports…</p>
        </div>
      )}

      {/* Error state */}
      {!loading && loadError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 mb-3">
          <p className="text-sm font-bold text-red-700 mb-1">Failed to load reports</p>
          <p className="text-xs text-red-500 break-all">{loadError}</p>
          <button
            onClick={load}
            className="mt-3 text-xs font-bold px-3 py-2 rounded-xl text-white"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !loadError && reports.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">📭</div>
          <p className="text-gray-500 text-sm font-semibold">No fault reports yet</p>
          <p className="text-gray-400 text-xs mt-1">Reports will appear here once residents start submitting them.</p>
        </div>
      )}

      {!loading && !loadError && reports.length > 0 && filtered.length === 0 && (
        <div className="text-center py-10">
          <div className="text-3xl mb-2">🔍</div>
          <p className="text-gray-500 text-sm font-semibold">No results</p>
          <p className="text-gray-400 text-xs mt-1">Try adjusting your filters or search.</p>
        </div>
      )}

      {/* Report cards */}
      {!loading && !loadError && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(r => {
            const sm = STATUS_META[r.status];
            return (
              <button
                key={r.id}
                onClick={() => setSelected(r)}
                className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-3 flex items-center gap-3 text-left transition-transform active:scale-[0.98]"
              >
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg"
                  style={{ backgroundColor: sm?.bg ?? '#F3F4F6' }}
                >
                  {CATEGORY_ICON[r.category] ?? '⚠️'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{r.title}</p>
                  <p className="text-gray-400 text-xs truncate mt-0.5">
                    {r.location?.address ?? 'No address recorded'}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                    <span
                      className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ color: sm?.text, backgroundColor: sm?.bg }}
                    >
                      {sm?.label ?? r.status}
                    </span>
                    <span className="text-gray-300 text-[10px]">·</span>
                    <span className="text-gray-400 text-[10px]">{r.category}</span>
                    {r.committeeNote && (
                      <>
                        <span className="text-gray-300 text-[10px]">·</span>
                        <span className="text-[10px]" style={{ color: '#1D4ED8' }}>📝 Note</span>
                      </>
                    )}
                    {r.councilReference && (
                      <>
                        <span className="text-gray-300 text-[10px]">·</span>
                        <span className="text-[10px] text-green-600">🏛 Ref</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Date + chevron */}
                <div className="flex flex-col items-end flex-shrink-0 gap-1">
                  <span className="text-gray-400 text-[10px] whitespace-nowrap">{fmtDate(r.createdAt)}</span>
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Detail bottom sheet ── */}
      {selected && !showNoteModal && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSelected(null)}
          />
          <div className="relative mt-auto bg-white rounded-t-3xl max-h-[88vh] overflow-y-auto">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Report header */}
            <div className="flex items-start justify-between px-5 pt-2 pb-3">
              <div className="flex-1 min-w-0 pr-3">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-lg">{CATEGORY_ICON[selected.category] ?? '⚠️'}</span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      color: STATUS_META[selected.status]?.text,
                      backgroundColor: STATUS_META[selected.status]?.bg,
                    }}
                  >
                    {STATUS_META[selected.status]?.label ?? selected.status}
                  </span>
                  <span className="text-xs text-gray-400">{selected.category}</span>
                </div>
                <h3 className="font-extrabold text-gray-900 text-base leading-tight">
                  {selected.title}
                </h3>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 flex-shrink-0"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-5 pb-8 space-y-4">
              {/* Description */}
              {selected.description && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{selected.description}</p>
                </div>
              )}

              {/* Location */}
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</p>
                {selected.location?.lat && selected.location?.lng ? (
                  <a
                    href={`https://maps.google.com/?q=${selected.location.lat},${selected.location.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600"
                  >
                    <svg className="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selected.location.address ?? 'Open in Google Maps'}
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">{selected.location?.address ?? 'No address recorded'}</p>
                )}
              </div>

              {/* Meta row */}
              <div className="flex gap-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Reported</p>
                  <p className="text-sm text-gray-700">{fmtDate(selected.createdAt)}</p>
                </div>
                {(selected.photos?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Photos</p>
                    <p className="text-sm text-gray-700">{selected.photos.length} attached</p>
                  </div>
                )}
                {selected.approvedAt && (
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Updated</p>
                    <p className="text-sm text-gray-700">{fmtDate(selected.approvedAt)}</p>
                  </div>
                )}
              </div>

              {/* JRA submission */}
              {selected.jraSubmission && (
                <div className="rounded-xl p-3 border" style={{ backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' }}>
                  <p className="text-xs font-bold mb-1" style={{ color: '#1D4ED8' }}>🏛 Submitted to JRA</p>
                  <p className="text-xs" style={{ color: '#1E40AF' }}>
                    Ref: <strong>{selected.jraSubmission.referenceNumber}</strong>
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: '#3B82F6' }}>
                    {fmtDate(selected.jraSubmission.timestamp)}
                  </p>
                </div>
              )}

              {/* Committee note */}
              {selected.committeeNote ? (
                <div className="rounded-xl p-3 border border-blue-100 bg-blue-50">
                  <p className="text-xs font-bold text-blue-700 mb-1">📝 Committee Note</p>
                  <p className="text-sm text-blue-800 leading-relaxed">{selected.committeeNote}</p>
                  {selected.councilReference && (
                    <p className="text-xs text-blue-500 mt-1.5 font-medium">
                      Council ref: {selected.councilReference}
                    </p>
                  )}
                  {selected.committeeNoteAt && (
                    <p className="text-[10px] text-blue-400 mt-1">{fmtDate(selected.committeeNoteAt)}</p>
                  )}
                </div>
              ) : (
                <div className="rounded-xl p-3 border border-dashed border-gray-200 bg-gray-50">
                  <p className="text-xs text-gray-400 text-center">No committee note yet — tap below to add one</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => openNoteModal(selected)}
                  className="flex-1 py-3.5 rounded-xl border-2 text-sm font-bold transition-colors"
                  style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                >
                  {selected.committeeNote ? '✏️ Edit Note' : '📝 Add Note'}
                </button>
                <button
                  onClick={() => setSelected(null)}
                  className="flex-1 py-3.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Note / council-ref modal ── */}
      {showNoteModal && selected && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowNoteModal(false)} />
          <div className="relative bg-white rounded-2xl p-5 shadow-2xl w-full max-w-sm">
            <h3 className="font-extrabold text-gray-900 mb-0.5">Committee Note</h3>
            <p className="text-xs text-gray-400 mb-4 leading-snug">
              Internal tracking note visible only to committee. Use to record follow-up actions and council references.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Note
                </label>
                <textarea
                  value={noteDraft}
                  onChange={e => setNoteDraft(e.target.value)}
                  rows={4}
                  placeholder={`e.g. Reported to JRA via email on ${new Date().toLocaleDateString('en-ZA')} — awaiting response.`}
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none resize-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Council / JRA Reference <span className="text-gray-300 font-normal">(optional)</span>
                </label>
                <input
                  type="text"
                  value={councilRef}
                  onChange={e => setCouncilRef(e.target.value)}
                  placeholder="e.g. JRA-2026-00123"
                  className="w-full px-3 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setShowNoteModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                disabled={savingNote || !noteDraft.trim()}
                className="flex-1 py-3 rounded-xl text-white font-bold text-sm disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {savingNote ? 'Saving…' : 'Save Note'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
