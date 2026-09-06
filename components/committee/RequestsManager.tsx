'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import {
  fetchAllServiceRequests,
  setRequestStatus,
  REQUEST_LABEL,
} from '@/lib/services/requestService';
import { ServiceRequest, ServiceRequestStatus } from '@/lib/types';

interface Props { userId: string; }

const STATUS_META: Record<ServiceRequestStatus, { label: string; bg: string; color: string }> = {
  open: { label: 'Open', bg: '#FEF3C7', color: '#92400E' },
  in_progress: { label: 'In progress', bg: '#DBEAFE', color: '#1D4ED8' },
  done: { label: 'Done', bg: '#D1FAE5', color: '#065F46' },
  cancelled: { label: 'Cancelled', bg: '#F3F4F6', color: '#6B7280' },
};

const TYPE_ICON: Record<string, string> = {
  debit_order_create: '🔁',
  debit_order_cancel: '🚫',
  debit_order_hardcopy: '📄',
  membership_payment: '💳',
  sales_rep: '🔒',
};

export default function RequestsManager({ userId }: Props) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'open' | 'all'>('open');

  const load = useCallback(async () => {
    setLoading(true);
    try { setRequests(await fetchAllServiceRequests()); }
    catch { toast.error('Could not load requests'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const visible = useMemo(
    () => (filter === 'open' ? requests.filter((r) => r.status === 'open' || r.status === 'in_progress') : requests),
    [requests, filter],
  );

  const advance = async (r: ServiceRequest, status: ServiceRequestStatus) => {
    setRequests((prev) => prev.map((x) => (x.id === r.id ? { ...x, status } : x)));
    try { await setRequestStatus(r.id, status, userId); toast.success('Updated'); }
    catch { toast.error('Update failed'); load(); }
  };

  const openCount = requests.filter((r) => r.status === 'open').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="font-extrabold text-gray-900">Requests</h2>
        <div className="flex gap-1">
          {(['open', 'all'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: filter === f ? 'var(--primary)' : 'var(--primary-bg)', color: filter === f ? 'white' : 'var(--primary)' }}>
              {f === 'open' ? `Open (${openCount})` : 'All'}
            </button>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-400 mb-4">Debit orders, membership payments &amp; security quote requests.</p>

      {loading && <p className="text-sm text-gray-400 text-center py-8">Loading…</p>}
      {!loading && visible.length === 0 && (
        <div className="text-center py-12"><div className="text-4xl mb-2">📭</div><p className="text-gray-500 text-sm font-semibold">No requests</p></div>
      )}

      <div className="space-y-2">
        {visible.map((r) => {
          const meta = STATUS_META[r.status];
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{TYPE_ICON[r.type] ?? '📌'}</span>
                <p className="font-bold text-gray-900 text-sm flex-1">{REQUEST_LABEL[r.type]}</p>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: meta.bg, color: meta.color }}>{meta.label}</span>
              </div>
              <p className="text-xs text-gray-600">{r.userName}{r.userCell ? ` · ${r.userCell}` : ''}{r.userEmail ? ` · ${r.userEmail}` : ''}</p>
              {r.details && <p className="text-[11px] text-gray-400 mt-0.5">{r.details}</p>}
              <p className="text-[11px] text-gray-300 mt-0.5">{new Date(r.createdAt).toLocaleString('en-ZA', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
              {r.status !== 'done' && r.status !== 'cancelled' && (
                <div className="flex gap-2 mt-2">
                  {r.status === 'open' && (
                    <button onClick={() => advance(r, 'in_progress')} className="text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-200 text-gray-600">Start</button>
                  )}
                  <button onClick={() => advance(r, 'done')} className="text-xs font-bold px-2.5 py-1 rounded-lg text-white" style={{ backgroundColor: 'var(--primary)' }}>Mark done</button>
                  <button onClick={() => advance(r, 'cancelled')} className="text-xs font-bold px-2.5 py-1 rounded-lg border border-gray-200 text-gray-500">Cancel</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
