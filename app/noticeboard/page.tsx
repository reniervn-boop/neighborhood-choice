'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNoticeboard } from '@/lib/hooks/useNoticeboard';
import { getNewsletters } from '@/lib/services/newsletterService';
import { Newsletter, Announcement } from '@/lib/types';
import AppHeader from '@/components/AppHeader';
import AlertsTicker from '@/components/noticeboard/AlertsTicker';
import AnnouncementCard from '@/components/noticeboard/AnnouncementCard';
import LoadingScreen from '@/components/LoadingScreen';

const CATEGORY_FILTERS = ['All', 'General', 'Security', 'Maintenance', 'Event', 'Finance', 'Governance'] as const;
type FilterCategory = (typeof CATEGORY_FILTERS)[number];

export default function NoticeboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { announcements, alerts, loading: boardLoading, refresh } = useNoticeboard();

  const [filter, setFilter] = useState<FilterCategory>('All');
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [nlLoading, setNlLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getNewsletters()
        .then(setNewsletters)
        .catch(console.error)
        .finally(() => setNlLoading(false));
    }
  }, [user]);

  if (authLoading) return <LoadingScreen message="Loading…" />;
  if (!user) { router.push('/auth/login'); return null; }

  const filtered =
    filter === 'All' ? announcements : announcements.filter((a) => a.category === filter);

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader
        title="Noticeboard"
        showBrand
        rightElement={
          <button
            onClick={refresh}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white/60 hover:text-white"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            aria-label="Refresh"
          >
            🔄
          </button>
        }
      />

      {/* Active Alerts Ticker */}
      {alerts.length > 0 && <AlertsTicker alerts={alerts} />}

      {/* ── ANNOUNCEMENTS ──────────────────────────────────────────────────── */}
      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Announcements</h2>
        </div>

        {/* Category filter pills */}
        <div className="overflow-x-auto -mx-4 px-4">
          <div className="flex gap-2 pb-2" style={{ minWidth: 'max-content' }}>
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
        <div className="space-y-3 mt-1">
          {boardLoading && (
            <div className="text-center py-10 text-gray-400 text-sm">Loading…</div>
          )}
          {!boardLoading && filtered.length === 0 && (
            <div className="text-center py-10">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-500 text-sm font-semibold">No announcements yet</p>
              <p className="text-gray-400 text-xs mt-1">Check back soon</p>
            </div>
          )}
          {filtered.map((a) => (
            <AnnouncementCard key={a.id} announcement={a} onClick={() => setSelected(a)} />
          ))}
        </div>
      </div>

      {/* ── NEWSLETTERS ────────────────────────────────────────────────────── */}
      <div className="px-4 mt-8 mb-2">
        {/* Section divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Newsletters</h2>
          </div>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {nlLoading && (
          <div className="text-center py-8 text-gray-400 text-sm">Loading…</div>
        )}
        {!nlLoading && newsletters.length === 0 && (
          <div className="text-center py-10">
            <div className="text-4xl mb-2">📰</div>
            <p className="text-gray-500 text-sm font-semibold">No newsletters yet</p>
            <p className="text-gray-400 text-xs">The committee will publish editions here.</p>
          </div>
        )}
        {!nlLoading && newsletters.length > 0 && (
          <div className="space-y-3">
            {newsletters.map((nl) => (
              <NewsletterCard key={nl.id} newsletter={nl} />
            ))}
          </div>
        )}
      </div>

      {/* ── ANNOUNCEMENT DETAIL MODAL ──────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {selected.category === 'Governance' ? (
              <div
                className="px-5 pt-2 pb-4 relative overflow-hidden"
                style={{ backgroundColor: 'var(--brand-black)' }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="bg-white rounded-lg px-2 py-1 inline-block mb-1.5">
                      <img src="/sx7ra-logo.svg" alt="SX7RA" className="h-7 w-auto" draggable={false} />
                    </div>
                    <h2 className="font-extrabold text-white text-sm leading-snug">{selected.title}</h2>
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
                <p
                  className="absolute -bottom-3 -right-2 select-none pointer-events-none text-8xl font-black leading-none"
                  style={{
                    fontFamily: 'var(--font-anton), Impact, sans-serif',
                    color: 'rgba(255,255,255,0.04)',
                    letterSpacing: '0.05em',
                  }}
                >
                  SX<span style={{ color: 'rgba(213,32,39,0.12)' }}>7</span>RA
                </p>
              </div>
            ) : (
              <div className="px-5 pt-3 pb-3">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="font-extrabold text-gray-900 text-base leading-snug flex-1">{selected.title}</h2>
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

            <div className="px-5 pb-8 pt-4">
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: selected.bodyHtml }} />
              {selected.attachments.length > 0 && (
                <div className="mt-5 space-y-2">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Attachments</p>
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
              {selected.category === 'Governance' && (
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
                  <img src="/sx7ra-logo.svg" alt="SX7RA" className="h-10 w-auto opacity-80" draggable={false} />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Newsletter card ─────────────────────────────────────────────────────────── */
function NewsletterCard({ newsletter }: { newsletter: Newsletter }) {
  const date = new Date(newsletter.publishedAt).toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const url = newsletter.pdfUrl || newsletter.externalUrl;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-transform active:scale-[0.98]">
      <div className="flex items-start gap-4 p-4">
        {newsletter.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={newsletter.thumbnailUrl}
            alt={newsletter.title}
            className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
          />
        ) : (
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--primary-bg)' }}
          >
            <svg className="w-7 h-7" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
        )}
        <div className="flex-1 min-w-0">
          {newsletter.edition && (
            <span
              className="inline-block text-xs font-bold px-2 py-0.5 rounded-full mb-1"
              style={{ backgroundColor: 'var(--primary-bg)', color: 'var(--primary)' }}
            >
              {newsletter.edition}
            </span>
          )}
          <h3 className="font-extrabold text-gray-900 text-sm leading-snug">{newsletter.title}</h3>
          {newsletter.description && (
            <p className="text-gray-500 text-xs mt-0.5 line-clamp-2 leading-snug">{newsletter.description}</p>
          )}
          <p className="text-gray-400 text-xs mt-1">{date} · {newsletter.authorName}</p>
        </div>
      </div>
      {url && (
        <div className="border-t border-gray-100 px-4 py-2.5">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-bold"
            style={{ color: 'var(--primary)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            {newsletter.pdfUrl ? 'Open PDF' : 'View Newsletter'}
          </a>
        </div>
      )}
    </div>
  );
}
