'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { useNoticeboard } from '@/lib/hooks/useNoticeboard';
import { getNewsletters } from '@/lib/services/newsletterService';
import { Newsletter } from '@/lib/types';
import AppHeader from '@/components/AppHeader';
import AlertsTicker from '@/components/noticeboard/AlertsTicker';
import AnnouncementCard from '@/components/noticeboard/AnnouncementCard';
import LoadingScreen from '@/components/LoadingScreen';
import { Announcement } from '@/lib/types';

const CATEGORY_FILTERS = ['All', 'General', 'Security', 'Maintenance', 'Event', 'Finance', 'Governance'] as const;
type FilterCategory = (typeof CATEGORY_FILTERS)[number];
type Tab = 'announcements' | 'newsletters';

export default function NoticeboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { announcements, alerts, loading: boardLoading, refresh } = useNoticeboard();

  const [tab, setTab] = useState<Tab>(() =>
    searchParams.get('tab') === 'newsletters' ? 'newsletters' : 'announcements'
  );
  const [filter, setFilter] = useState<FilterCategory>('All');
  const [selected, setSelected] = useState<Announcement | null>(null);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [nlLoading, setNlLoading] = useState(false);
  const [nlLoaded, setNlLoaded] = useState(false);

  // Load newsletters when that tab is first opened
  useEffect(() => {
    if (tab === 'newsletters' && !nlLoaded && user) {
      setNlLoading(true);
      getNewsletters()
        .then(setNewsletters)
        .catch(console.error)
        .finally(() => { setNlLoading(false); setNlLoaded(true); });
    }
  }, [tab, nlLoaded, user]);

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
          tab === 'announcements' ? (
            <button
              onClick={refresh}
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm text-white/60 hover:text-white"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              aria-label="Refresh"
            >
              🔄
            </button>
          ) : undefined
        }
      />

      {/* Active Alerts Ticker — always visible */}
      {alerts.length > 0 && <AlertsTicker alerts={alerts} />}

      {/* Tab switcher */}
      <div className="px-4 pt-3 pb-0">
        <div
          className="flex rounded-xl p-1 gap-1"
          style={{ backgroundColor: 'var(--brand-black)' }}
        >
          <button
            onClick={() => setTab('announcements')}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors"
            style={{
              backgroundColor: tab === 'announcements' ? 'white' : 'transparent',
              color: tab === 'announcements' ? 'var(--brand-black)' : 'rgba(255,255,255,0.5)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            Announcements
          </button>
          <button
            onClick={() => setTab('newsletters')}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-colors"
            style={{
              backgroundColor: tab === 'newsletters' ? 'white' : 'transparent',
              color: tab === 'newsletters' ? 'var(--brand-black)' : 'rgba(255,255,255,0.5)',
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Newsletters
          </button>
        </div>
      </div>

      {/* ── ANNOUNCEMENTS TAB ─────────────────────────────────────────────── */}
      {tab === 'announcements' && (
        <>
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
            {boardLoading && (
              <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>
            )}
            {!boardLoading && filtered.length === 0 && (
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
        </>
      )}

      {/* ── NEWSLETTERS TAB ───────────────────────────────────────────────── */}
      {tab === 'newsletters' && (
        <div className="px-4 mt-3 max-w-lg mx-auto">
          {nlLoading && (
            <div className="text-center py-12 text-gray-400 text-sm">Loading…</div>
          )}
          {!nlLoading && newsletters.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">📰</div>
              <p className="font-extrabold text-gray-900 mb-1">No newsletters yet</p>
              <p className="text-gray-500 text-sm">The committee will publish newsletters here.</p>
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
      )}

      {/* ── ANNOUNCEMENT DETAIL MODAL ─────────────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSelected(null)} />
          <div className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full" />
            </div>

            {/* Governance items get branded dark header */}
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
                  SX<span style={{ color: 'rgba(213,32,39,0.12)' }}>7</span>RA
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

/* ── Newsletter card (moved from /newsletters/page.tsx) ─────────────────────── */
function NewsletterCard({ newsletter }: { newsletter: Newsletter }) {
  const date = new Date(newsletter.publishedAt).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
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
            className="w-16 h-16 object-cover rounded-xl flex-shrink-0"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'var(--primary-bg)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
