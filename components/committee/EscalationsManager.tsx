'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { getAllReports, escalateReport } from '@/lib/services/reportService';
import {
  escalationStatus,
  isEscalatable,
  hoursToBreach,
  slaHoursFor,
} from '@/lib/services/slaService';
import { formatEscalationTemplate } from '@/lib/services/municipalityService';
import { WARD_COUNCILLOR } from '@/lib/services/municipalityService';
import { Report } from '@/lib/types';

const CATEGORY_ICON: Record<string, string> = {
  Pothole: '🕳️', Streetlight: '💡', Graffiti: '🎨', 'Water Main': '💧',
  Stormwater: '🌊', 'Traffic Light': '🚦', Pavement: '🛤️', Other: '⚠️',
};

function relTime(hours: number): string {
  if (hours >= 0) return `${hours}h left`;
  const over = Math.abs(hours);
  return over >= 48 ? `${Math.round(over / 24)}d overdue` : `${over}h overdue`;
}

export default function EscalationsManager() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setReports(await getAllReports(300));
    } catch {
      toast.error('Could not load reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const { breached, escalated } = useMemo(() => {
    const breached = reports.filter((r) => isEscalatable(r));
    const escalated = reports
      .filter((r) => escalationStatus(r) === 'escalated')
      .sort((a, b) => (b.escalatedToWardAt ?? 0) - (a.escalatedToWardAt ?? 0));
    return { breached, escalated };
  }, [reports]);

  const escalateOne = async (r: Report) => {
    await escalateReport(r.id, `Auto-escalated: SLA of ${slaHoursFor(r.category, r.severity)}h exceeded.`);
    toast.success('Escalated to Ward Councillor');
    await load();
  };

  const runAuto = async () => {
    if (breached.length === 0) {
      toast('Nothing to escalate — all faults within SLA.');
      return;
    }
    setRunning(true);
    try {
      await Promise.all(
        breached.map((r) =>
          escalateReport(r.id, `Auto-escalated: SLA of ${slaHoursFor(r.category, r.severity)}h exceeded.`),
        ),
      );
      toast.success(`${breached.length} fault${breached.length === 1 ? '' : 's'} escalated to Ward Councillor`);
      await load();
    } catch {
      toast.error('Escalation run failed');
    } finally {
      setRunning(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-extrabold text-gray-900">Escalations</h2>
        <button
          onClick={runAuto}
          disabled={running || loading}
          className="px-3 py-2 rounded-xl text-white text-xs font-bold disabled:opacity-50"
          style={{ backgroundColor: 'var(--primary)' }}
        >
          {running ? 'Running…' : `⚡ Auto-escalate (${breached.length})`}
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-4">
        Faults past their SLA window escalate to <strong>{WARD_COUNCILLOR}</strong>. Severity sets the window length.
      </p>

      {loading && <p className="text-sm text-gray-400 text-center py-8">Loading…</p>}

      {/* Breached / awaiting escalation */}
      {!loading && (
        <>
          <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--primary)' }}>
            SLA breached — needs escalation ({breached.length})
          </h3>
          {breached.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center mb-5">
              <div className="text-3xl mb-1">✅</div>
              <p className="text-sm text-gray-600 font-semibold">All open faults are within SLA</p>
            </div>
          ) : (
            <div className="space-y-2 mb-5">
              {breached.map((r) => (
                <ReportRow key={r.id} r={r} actionLabel="Escalate" onAction={() => escalateOne(r)} danger />
              ))}
            </div>
          )}

          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
            Escalated to ward ({escalated.length})
          </h3>
          {escalated.length === 0 ? (
            <p className="text-xs text-gray-400 mb-3">No escalations yet.</p>
          ) : (
            <div className="space-y-2">
              {escalated.map((r) => (
                <ReportRow key={r.id} r={r} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ReportRow({
  r,
  actionLabel,
  onAction,
  danger,
}: {
  r: Report;
  actionLabel?: string;
  onAction?: () => void;
  danger?: boolean;
}) {
  const [showTemplate, setShowTemplate] = useState(false);
  const h = hoursToBreach(r);
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
      <div className="flex items-center gap-3">
        <span className="text-xl flex-shrink-0">{CATEGORY_ICON[r.category] ?? '⚠️'}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm truncate">{r.title}</p>
          <p className="text-[11px] text-gray-400">
            {r.category} · {r.severity ?? 'medium'} ·{' '}
            {r.escalatedToWardAt
              ? `escalated ${new Date(r.escalatedToWardAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}`
              : relTime(h)}
          </p>
        </div>
        {actionLabel && onAction && (
          <button
            onClick={onAction}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-white flex-shrink-0"
            style={{ backgroundColor: danger ? 'var(--primary)' : '#6b7280' }}
          >
            {actionLabel}
          </button>
        )}
      </div>
      <button onClick={() => setShowTemplate((s) => !s)} className="text-[11px] text-gray-400 mt-1 underline">
        {showTemplate ? 'Hide' : 'Show'} escalation format
      </button>
      {showTemplate && (
        <pre className="mt-2 text-[10px] bg-gray-50 border border-gray-100 rounded-lg p-2 whitespace-pre-wrap text-gray-600 overflow-x-auto">
          {formatEscalationTemplate({
            id: r.id,
            title: r.title,
            category: r.category,
            location: r.location,
            createdAt: r.createdAt,
          })}
        </pre>
      )}
    </div>
  );
}
