'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/lib/hooks/useAuth';
import LoadingScreen from '@/components/LoadingScreen';
import AnnouncementForm from '@/components/committee/AnnouncementForm';
import AlertForm from '@/components/committee/AlertForm';
import { seedNewsletter2026 } from '@/lib/data/seedFunctions';

type Tab = 'announcement' | 'alert' | 'agm' | 'finance';

export default function CommitteePage() {
  const router = useRouter();
  const { user, isCommittee, isSuperAdmin, loading } = useAuth();
  const [tab, setTab] = useState<Tab>('announcement');
  const [published, setPublished] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSeedNewsletter = async () => {
    setSeeding(true);
    const result = await seedNewsletter2026();
    setSeeding(false);
    if ('error' in result) {
      toast(result.error);
    } else {
      toast.success('2026 Committee Newsletter published to noticeboard!');
    }
  };

  if (loading) return <LoadingScreen message="Loading committee panel…" />;
  if (!user || !isCommittee) {
    router.push('/');
    return null;
  }

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'announcement', label: 'Announcement', icon: '📢' },
    { id: 'alert', label: 'Alert', icon: '🚨' },
    { id: 'agm', label: 'AGM', icon: '🗳' },
    { id: 'finance', label: 'Finance', icon: '💰' },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            {isSuperAdmin ? '★' : '◆'}
          </div>
          <div>
            <h1 className="font-extrabold text-gray-900">Committee Panel</h1>
            <p className="text-xs text-gray-400">
              {isSuperAdmin ? 'Super Admin' : 'Committee Member'} · {user.name}
            </p>
          </div>
        </div>
      </div>

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
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'var(--brand-black)' }}
              >
                <span className="sx7ra-logo font-display text-xs text-white">
                  SX<span style={{ color: 'var(--primary)' }}>7</span>
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs text-gray-900">
                  {seeding ? 'Publishing…' : 'Publish 2026 Committee Newsletter'}
                </p>
                <p className="text-xs text-gray-400 leading-snug">
                  Adds the "Introducing Your 2026 Committee" announcement to the noticeboard (one-time)
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
