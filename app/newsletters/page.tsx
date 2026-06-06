'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { getNewsletters } from '@/lib/services/newsletterService';
import { Newsletter } from '@/lib/types';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';

export default function NewslettersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
      return;
    }
    if (user) loadNewsletters();
  }, [user, authLoading, router]);

  const loadNewsletters = async () => {
    try {
      const data = await getNewsletters();
      setNewsletters(data);
    } catch (err) {
      console.error('Failed to load newsletters:', err);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) return <LoadingScreen message="Loading newsletters…" />;
  if (!user) return null;

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Newsletters" showBack backHref="/" />

      <div className="max-w-lg mx-auto px-4 py-5">
        {/* Intro */}
        <div
          className="rounded-2xl p-4 mb-5 flex items-center gap-3"
          style={{ backgroundColor: 'var(--brand-black)' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(204,18,18,0.2)' }}
          >
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <div>
            <p className="font-extrabold text-white text-sm">SX7RA Newsletters</p>
            <p className="text-white/50 text-xs mt-0.5">Committee communications &amp; updates</p>
          </div>
        </div>

        {/* Newsletter list */}
        {newsletters.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📰</div>
            <p className="font-extrabold text-gray-900 mb-1">No newsletters yet</p>
            <p className="text-gray-500 text-sm">The committee will publish newsletters here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
              All Editions
            </h2>
            {newsletters.map((nl) => (
              <NewsletterCard key={nl.id} newsletter={nl} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

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
        {/* Icon / thumbnail */}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}

        {/* Content */}
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

      {/* Action */}
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
