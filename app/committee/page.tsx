'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';
import AnnouncementForm from '@/components/committee/AnnouncementForm';
import AlertForm from '@/components/committee/AlertForm';
import { seedNewsletter2026 } from '@/lib/data/seedFunctions';
import { createNewsletter } from '@/lib/services/newsletterService';

type Tab = 'announcement' | 'alert' | 'agm' | 'finance' | 'newsletter';

export default function CommitteePage() {
  const router = useRouter();
  const { user, isCommittee, isSuperAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>('announcement');
  const [published, setPublished] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [nlTitle, setNlTitle] = useState('');
  const [nlEdition, setNlEdition] = useState('');
  const [nlDescription, setNlDescription] = useState('');
  const [nlUrl, setNlUrl] = useState('');
  const [nlSaving, setNlSaving] = useState(false);

  const handleSeedNewsletter = async () => {
    setSeeding(true);
    const result = await seedNewsletter2026();
    if ('error' in result) {
      setSeeding(false);
      toast(result.error);
      return;
    }
    // Also publish to the newsletters archive so it appears on the Newsletters page
    try {
      await createNewsletter({
        title: 'Introducing Your 2026 Committee',
        edition: 'May 2026',
        description: 'Meet the SX7RA Operations Committee for the 2026 term — portfolios, contacts and priorities.',
        publishedAt: new Date('2026-05-01T09:00:00+02:00').getTime(),
        authorId: user?.uid ?? 'system',
        authorName: 'The SX7RA Committee',
      });
    } catch (e) {
      console.warn('Newsletter archive entry failed:', e);
    }
    setSeeding(false);
    toast.success('2026 Committee Newsletter published to noticeboard and newsletters!');
  };

  if (loading) return <LoadingScreen message="Loading committee panel…" />;
  if (!user || !isCommittee) {
    router.push('/');
    return null;
  }

  const handlePublishNewsletter = async () => {
    if (!nlTitle.trim() || !nlUrl.trim()) return;
    setNlSaving(true);
    try {
      await createNewsletter({
        title: nlTitle.trim(),
        edition: nlEdition.trim() || undefined,
        description: nlDescription.trim() || undefined,
        pdfUrl: nlUrl.trim().toLowerCase().endsWith('.pdf') ? nlUrl.trim() : undefined,
        externalUrl: !nlUrl.trim().toLowerCase().endsWith('.pdf') ? nlUrl.trim() : undefined,
        publishedAt: Date.now(),
        authorId: user!.uid,
        authorName: user!.name,
      });
      toast.success('Newsletter published!');
      setNlTitle(''); setNlEdition(''); setNlDescription(''); setNlUrl('');
    } catch (err) {
      console.error(err);
      toast.error('Failed to publish newsletter.');
    } finally {
      setNlSaving(false);
    }
  };

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'announcement', label: 'Announcement', icon: '📢' },
    { id: 'alert', label: 'Alert', icon: '🚨' },
    { id: 'newsletter', label: 'Newsletter', icon: '📰' },
    { id: 'agm', label: 'AGM', icon: '🗳' },
    { id: 'finance', label: 'Finance', icon: '💰' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader
        title="Committee Panel"
        showBack
        backHref="/"
        rightElement={
          <span
            className="text-xs font-bold px-2 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white' }}
          >
            {isSuperAdmin ? 'Super Admin' : 'Committee'}
          </span>
        }
      />

      {/* Tab bar */}
      <div className="bg-white border-b border-gray-100 px-4">
        <div className="flex gap-1 overflow-x-auto py-2" style={{ scrollbarWidth: 'none' }}>
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setPublished(false); }}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
              style={{
                backgroundColor: tab === t.id ? 'var(--primary)' : 'var(--primary-bg)',
                color: tab === t.id ? 'white' : 'var(--primary)',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5">
        {/* Announcement tab */}
        {tab === 'announcement' && (
          <>
            <h2 className="font-extrabold text-gray-900 mb-4">New Announcement</h2>

            {/* Quick-seed the 2026 newsletter */}
            <button
              onClick={handleSeedNewsletter}
              disabled={seeding}
              className="w-full mb-5 border-2 rounded-xl p-3 flex items-center gap-3 text-left transition-colors disabled:opacity-50"
              style={{ borderColor: 'var(--brand-black)', backgroundColor: '#f9f9f9' }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-white border border-gray-200 overflow-hidden p-0.5">
                <img src="/sx7ra-logo.svg" alt="SX7RA" className="w-full h-full object-contain" draggable={false} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-gray-900">
                  {seeding ? 'Publishing…' : 'Publish 2026 Committee Newsletter'}
                </p>
                <p className="text-xs text-gray-400 leading-snug">
                  Publishes to the Noticeboard AND the Newsletters archive (one-time)
                </p>
              </div>
              <span className="text-gray-400 flex-shrink-0">→</span>
            </button>

            <div className="relative flex items-center mb-4">
              <div className="flex-1 border-t border-gray-200" />
              <span className="px-3 text-xs text-gray-400 font-medium">or write a new one</span>
              <div className="flex-1 border-t border-gray-200" />
            </div>

            {published ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">✅</div>
                <p className="font-extrabold text-gray-900 mb-1">Published!</p>
                <p className="text-gray-500 text-sm mb-5">
                  Residents can now see your announcement on the noticeboard.
                </p>
                <div className="flex gap-3">
                  <Link
                    href="/noticeboard"
                    className="flex-1 text-center border-2 font-bold py-3 rounded-xl text-sm"
                    style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                  >
                    View Noticeboard
                  </Link>
                  <button
                    onClick={() => setPublished(false)}
                    className="flex-1 text-white font-bold py-3 rounded-xl text-sm"
                    style={{ backgroundColor: 'var(--primary)' }}
                  >
                    New Announcement
                  </button>
                </div>
              </div>
            ) : (
              <AnnouncementForm
                authorId={user.uid}
                authorName={user.name}
                onSuccess={() => setPublished(true)}
              />
            )}
          </>
        )}

        {/* Alert tab */}
        {tab === 'alert' && (
          <>
            <h2 className="font-extrabold text-gray-900 mb-4">Send Community Alert</h2>
            {published ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">🚨</div>
                <p className="font-extrabold text-gray-900 mb-1">Alert sent!</p>
                <p className="text-gray-500 text-sm mb-5">
                  The alert is now live on the noticeboard ticker.
                </p>
                <button
                  onClick={() => setPublished(false)}
                  className="w-full text-white font-bold py-3 rounded-xl text-sm"
                  style={{ backgroundColor: 'var(--primary)' }}
                >
                  Send Another Alert
                </button>
              </div>
            ) : (
              <AlertForm
                authorId={user.uid}
                onSuccess={() => setPublished(true)}
              />
            )}
          </>
        )}

        {/* Newsletter tab */}
        {tab === 'newsletter' && (
          <div className="space-y-4">
            <h2 className="font-extrabold text-gray-900 mb-1">Publish Newsletter</h2>
            <p className="text-xs text-gray-400 mb-4">
              Add a newsletter edition for residents to view in the Newsletters section.
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Title *</label>
              <input
                type="text"
                value={nlTitle}
                onChange={(e) => setNlTitle(e.target.value)}
                placeholder="e.g. May 2026 Committee Update"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Edition</label>
              <input
                type="text"
                value={nlEdition}
                onChange={(e) => setNlEdition(e.target.value)}
                placeholder="e.g. May 2026 (optional)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Short Description</label>
              <input
                type="text"
                value={nlDescription}
                onChange={(e) => setNlDescription(e.target.value)}
                placeholder="Brief summary (optional)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">PDF / Link URL *</label>
              <input
                type="url"
                value={nlUrl}
                onChange={(e) => setNlUrl(e.target.value)}
                placeholder="https://... (PDF or webpage)"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none text-sm"
              />
              <p className="text-xs text-gray-400 mt-1">Link to a PDF file or web page.</p>
            </div>

            <button
              onClick={handlePublishNewsletter}
              disabled={nlSaving || !nlTitle.trim() || !nlUrl.trim()}
              className="w-full text-white font-bold py-4 rounded-xl text-sm disabled:opacity-50"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              {nlSaving ? 'Publishing…' : 'Publish Newsletter'}
            </button>

            <Link
              href="/noticeboard?tab=newsletters"
              className="block text-center text-sm font-semibold mt-2"
              style={{ color: 'var(--primary)' }}
            >
              View all newsletters →
            </Link>
          </div>
        )}

        {/* AGM tab */}
        {tab === 'agm' && (
          <div className="space-y-3">
            <h2 className="font-extrabold text-gray-900 mb-4">AGM Management</h2>
            <Link
              href="/agm"
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-sm font-semibold text-gray-700"
            >
              🗳 View Current AGM Status →
            </Link>
            {isSuperAdmin && (
              <Link
                href="/committee/agm/create"
                className="block text-center text-white font-bold py-3.5 rounded-xl text-sm"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                + Create New AGM Window
              </Link>
            )}
          </div>
        )}

        {/* Finance tab */}
        {tab === 'finance' && (
          <div className="space-y-3">
            <h2 className="font-extrabold text-gray-900 mb-4">Finance Management</h2>
            <Link
              href="/finance"
              className="block bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-sm font-semibold text-gray-700"
            >
              💰 View Community Projects →
            </Link>
            {isSuperAdmin && (
              <Link
                href="/committee/finance/create"
                className="block text-center text-white font-bold py-3.5 rounded-xl text-sm"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                + Create New Project
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
