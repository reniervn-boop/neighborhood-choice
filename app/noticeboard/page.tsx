'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNoticeboard } from '@/lib/hooks/useNoticeboard';
import AlertsTicker from '@/components/noticeboard/AlertsTicker';
import AnnouncementCard from '@/components/noticeboard/AnnouncementCard';
import LoadingScreen from '@/components/LoadingScreen';
import { Announcement } from '@/lib/types';

const CATEGORY_FILTERS = ['All', 'General', 'Security', 'Maintenance', 'Event', 'Finance', 'Governance'] as const;
type FilterCategory = (typeof CATEGORY_FILTERS)[number];

export default function NoticeboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { announcements, alerts, loading, refresh } = useNoticeboard();
  const [filter, setFilter] = useState<FilterCategory>('All');
  const [selected, setSelected] = useState<Announcement | null>(null);

  if (authLoading) return <LoadingScreen message="Loading noticeboard…" />;
  if (!user) { router.push('/auth/login'); return null; }

  const filtered =
    filter === 'All' ? announcements : announcements.filter((a) => a.category === filter);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 py-3 flex items-center justify-between"
        style={{ backgroundColor: 'var(--brand-black)' }}
      >
        <div>
          <p className="sx7ra-logo font-display text-xl text-white leading-none">
            SX<span style={{ color: 'var(--primary)' }}>7</span>RA
          </p>
          <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Noticeboard</p>
        </div>
        <button
          onClick={refresh}
          className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white/60 hover:text-white"
          style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
        >
          🔄
        </button>
      </div>

      {/* Active Alerts Ticker */}
      {alerts.length > 0 && <AlertsTicker alerts={alerts} />}

      {/* Category filter pills */}
      <div className="px-4 mt-3 overflow-x-auto">
        <div className="flex gap-2 pb-1" style={{ minWidth: 'max-content' }}>
          {CATEGORY_FILTERS.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className="px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors"
              style={{
                backgroundColor: filter === c ? 'var(--primary)' : 'white',
                color: filter === c ? 'white' : '#6B7280',
                border: filter === c ? 'none' : '1.5px solid #E5E7EB',
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Announcement list */}
      <div className="px-4 mt-3 space-y-3">
        {loading && (
          <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>
        )}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500 text-sm font-semibold">No announcements yet</p>
            <p className="text-gray-400 text-xs mt-1">Check back soon</p>
          </div>
        )}
        {filtered.map((a) => (
          <AnnouncementCard key={a.id} announcement={a} onClick={() => setSelected(a)} />
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Governance (SX7RA newsletter) gets a branded header */}
            {selected.category === 'Governance' ? (
              <div
                className="px-5 pt-2 pb-4 relative overflow-hidden"
                style={{ backgroundColor: 'var(--brand-black)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p
                      className="sx7ra-logo font-display text-3xl text-white leading-none mb-1"
                      style={{ fontFamily: 'var(--font-anton), Impact, sans-serif' }}
                    >
                      SX<span style={{ color: 'var(--primary)' }}>7</span>RA
                    </p>
                    <h2 className="font-extrabold text-white text-sm leading-snug">
                      {selected.title}
                    </h2>
                    <p className="text-white/40 text-xs mt-1">
                      {selected.authorName} ·{' '}
                      {new Date(selected.publishedAt).toLocaleDateString('en-ZA', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white/60 flex-shrink-0"
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  >
                    ✕
                  </button>
                </div>
                {/* Faint watermark */}
                <p
                  className="absolute -bottom-3 -right-2 select-none pointer-events-none text-8xl font-black leading-none"
                  style={{
                    fontFamily: 'var(--font-anton), Impact, sans-serif',
                    color: 'rgba(255,255,255,0.04)',
                    letterSpacing: '0.05em',
                  }}
                >
                  SX<span style={{ color: 'rgba(204,18,18,0.12)' }}>7</span>RA
                </p>
              </div>
            ) : (
              <div className="px-5 pt-3 pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="font-extrabold text-gray-900 text-base leading-snug flex-1">
                    {selected.title}
                  </h2>
                  <button
                    onClick={() => setSelected(null)}
                    className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-500 flex-shrink-0"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span>{selected.authorName}</span>
                  <span>·</span>
                  <span>
                    {new Date(selected.publishedAt).toLocaleDateString('en-ZA', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="px-5 pb-8 pt-4">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: selected.bodyHtml }}
              />

              {selected.attachments.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Attachments
                  </p>
                  {selected.attachments.map((att, i) => (
                    <a
                      key={i}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl text-sm font-semibold"
                      style={{ color: 'var(--primary)' }}
                    >
                      📎 {att.name}
                    </a>
                  ))}
                </div>
              )}

              {/* SX7RA footer on governance items */}
              {selected.category === 'Governance' && (
                <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                  <p
                    className="font-display text-xl text-gray-800"
                    style={{ fontFamily: 'var(--font-anton), Impact, sans-serif' }}
                  >
                    SX<span style={{ color: 'var(--primary)' }}>7</span>RA
                  </p>
                  <p className="text-xs text-gray-400 font-semibold uppercase tracking-widest mt-0.5">
                    Sundowner Ext. 7 Residents Association
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
