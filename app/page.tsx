'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { useNoticeboard } from '@/lib/hooks/useNoticeboard';
import Link from 'next/link';
import LoadingScreen from '@/components/LoadingScreen';
import AlertsTicker from '@/components/noticeboard/AlertsTicker';
import JoburgSkyline from '@/components/JoburgSkyline';

export default function Home() {
  const { user, loading, isAuthenticated, isCommittee } = useAuth();
  const { alerts } = useNoticeboard();

  if (loading) return <LoadingScreen />;

  // ── Unauthenticated landing ──────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--brand-black)' }}>
        {/* Hero */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-0 text-center relative overflow-hidden">
          {/* Logo */}
          <div className="mb-4">
            <p className="sx7ra-logo font-display text-7xl text-white tracking-wider">
              SX<span className="accent">7</span>RA
            </p>
            <p
              className="text-white/60 text-xs font-bold uppercase tracking-[0.25em] mt-1"
              style={{ fontFamily: 'var(--font-geist-sans)' }}
            >
              Sundowner Ext. 7 Residents Association
            </p>
          </div>

          {/* Tagline */}
          <p className="text-white/50 text-sm max-w-xs leading-relaxed mt-2">
            "Working towards making SX7 a suburb of choice"
          </p>

          {/* Skyline — sits at the very bottom of the hero, bleeds to edge */}
          <div className="absolute bottom-0 left-0 right-0 select-none pointer-events-none">
            <JoburgSkyline className="w-full" fill="#2a2a2a" />
          </div>
        </div>

        {/* Auth card */}
        <div className="bg-white rounded-t-3xl px-6 pt-8 pb-10 shadow-2xl relative z-10">
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-6">
            Sign in or join your neighbourhood community
          </p>

          <div className="space-y-3">
            <Link
              href="/auth/login"
              className="block w-full text-center text-white font-bold py-4 rounded-xl text-base"
              style={{ backgroundColor: 'var(--primary)' }}
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="block w-full text-center font-bold py-4 rounded-xl border-2 text-base"
              style={{ borderColor: 'var(--brand-black)', color: 'var(--brand-black)' }}
            >
              Join Community
            </Link>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Help improve our neighbourhood by reporting civic issues
          </p>
        </div>
      </div>
    );
  }

  // ── Authenticated home ───────────────────────────────────────────────────────
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header — black brand bar */}
      <header style={{ backgroundColor: 'var(--brand-black)' }} className="text-white shadow-md">
        <div className="max-w-lg mx-auto px-4 pt-4 pb-0">
          <div className="flex items-center justify-between mb-4">
            {/* SX7RA wordmark */}
            <div>
              <p className="sx7ra-logo font-display text-3xl text-white leading-none">
                SX<span style={{ color: 'var(--primary)' }}>7</span>RA
              </p>
              <p className="text-white/50 text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                Good day, {user?.name?.split(' ')[0] || 'Resident'}
              </p>
            </div>

            <Link href="/profile" className="flex-shrink-0">
              <div
                className="w-11 h-11 rounded-full border-2 flex items-center justify-center"
                style={{ borderColor: 'var(--primary)', backgroundColor: 'rgba(204,18,18,0.2)' }}
              >
                <span className="text-white font-bold text-sm">{initials}</span>
              </div>
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-2 mb-0">
            <div className="bg-white/10 rounded-t-xl p-3 text-center">
              <p className="text-2xl font-extrabold">{user?.points || 0}</p>
              <p className="text-white/60 text-xs font-medium mt-0.5">Points</p>
            </div>
            <div className="bg-white/10 rounded-t-xl p-3 text-center">
              <p className="text-2xl font-extrabold">{user?.badges?.length || 0}</p>
              <p className="text-white/60 text-xs font-medium mt-0.5">Badges</p>
            </div>
            <div className="bg-white/10 rounded-t-xl p-3 text-center">
              <p className="text-2xl font-extrabold" style={{ color: user?.verified ? '#4ade80' : 'var(--primary)' }}>
                {user?.verified ? '✓' : '!'}
              </p>
              <p className="text-white/60 text-xs font-medium mt-0.5">
                {user?.verified ? 'Verified' : 'Pending'}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Alerts ticker */}
      {alerts.length > 0 && <AlertsTicker alerts={alerts} />}

      <main className="max-w-lg mx-auto px-4 py-5">
        {/* Emergency quick-dial */}
        <Link
          href="/contacts"
          className="col-span-2 flex items-center gap-3 rounded-2xl px-4 py-3 mb-4 transition-transform active:scale-[0.98]"
          style={{ backgroundColor: '#CC1212' }}
        >
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 5.25v1.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-extrabold text-white text-sm">Emergency Contacts</p>
            <p className="text-white/70 text-xs">SAPS · EMS · City Power · Water</p>
          </div>
          <svg className="w-5 h-5 text-white/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        {/* Quick actions */}
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* Report Issue — primary action */}
          <Link
            href="/report"
            className="col-span-2 flex items-center gap-4 rounded-2xl p-5 text-white shadow-md transition-transform active:scale-[0.98]"
            style={{ backgroundColor: 'var(--primary)' }}
          >
            <div className="w-14 h-14 rounded-xl bg-black/20 flex items-center justify-center flex-shrink-0">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-extrabold">Report an Issue</h3>
              <p className="text-white/75 text-sm">Potholes, streetlights &amp; more</p>
            </div>
          </Link>

          {/* Noticeboard */}
          <QuickCard href="/noticeboard" emoji="📢" label="Noticeboard" sub="News &amp; alerts" />
          {/* Contacts */}
          <QuickCard href="/contacts" emoji="📞" label="Contacts" sub="Committee &amp; emergency" />
          {/* Newsletters */}
          <QuickCard href="/newsletters" emoji="📰" label="Newsletters" sub="Committee updates" />
          {/* AGM */}
          <QuickCard href="/agm" emoji="🗳" label="AGM / Voting" sub="Governance" />
          {/* Finance */}
          <QuickCard href="/finance" emoji="💰" label="Finance" sub="Community projects" />
          {/* Leaderboard */}
          <QuickCard href="/leaderboard" emoji="🏆" label="Leaderboard" sub="Top reporters" />
          {/* Profile */}
          <QuickCard href="/profile" emoji="👤" label="My Profile" sub="Stats &amp; settings" />
          {/* Constitution */}
          <QuickCard href="/constitution" emoji="📋" label="Constitution" sub="Governance rules" />

          {/* Upcoming Events — full-width card */}
          <Link
            href="/events"
            className="col-span-2 rounded-2xl overflow-hidden shadow-sm transition-transform active:scale-[0.98] relative"
            style={{ backgroundColor: '#12121e' }}
          >
            {/* Orange accent bar */}
            <div className="h-1.5 w-full" style={{ backgroundColor: '#ff6b00' }} />
            <div className="p-4 flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ backgroundColor: 'rgba(255,107,0,0.15)' }}
              >
                🎃
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-white text-sm">Upcoming Events</h3>
                <p className="text-xs mt-0.5" style={{ color: '#ff6b00' }}>
                  Halloween Monster Walk is LIVE →
                </p>
              </div>
              {/* Floating emojis decoration */}
              <div className="text-xl opacity-30 select-none pointer-events-none">🦇</div>
            </div>
          </Link>

          {/* Committee Panel */}
          {isCommittee && (
            <Link
              href="/committee"
              className="col-span-2 flex items-center gap-4 rounded-2xl p-4 bg-white shadow-sm border border-gray-100 transition-transform active:scale-[0.98]"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
                style={{ backgroundColor: 'var(--brand-black)', color: 'var(--primary)' }}
              >
                ⚙️
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Committee Panel</h3>
                <p className="text-gray-400 text-xs">Post announcements, alerts &amp; manage AGM</p>
              </div>
              <svg className="w-5 h-5 text-gray-300 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}

          {/* Legacy admin */}
          {user?.role === 'admin' && !isCommittee && (
            <Link
              href="/admin"
              className="col-span-2 flex items-center gap-4 rounded-2xl p-4 bg-white shadow-sm border border-gray-100 transition-transform active:scale-[0.98]"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-gray-900">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Admin Dashboard</h3>
                <p className="text-gray-400 text-xs">Manage reports &amp; community</p>
              </div>
              <svg className="w-5 h-5 text-gray-300 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </div>

        {/* Tagline banner */}
        <div
          className="rounded-2xl p-4 flex items-center gap-3 overflow-hidden relative"
          style={{ backgroundColor: 'var(--brand-black)' }}
        >
          {/* Faint skyline watermark */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none w-48">
            <JoburgSkyline fill="white" />
          </div>
          <div className="relative z-10">
            <p className="sx7ra-logo font-display text-2xl text-white">
              SX<span style={{ color: 'var(--primary)' }}>7</span>RA
            </p>
            <p className="text-white/60 text-xs mt-0.5 leading-relaxed italic">
              "Working towards making SX7 a suburb of choice"
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function QuickCard({ href, emoji, label, sub }: { href: string; emoji: string; label: string; sub: string }) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center justify-center gap-2 rounded-2xl p-5 bg-white shadow-sm border border-gray-100 transition-transform active:scale-[0.98]"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ backgroundColor: 'var(--primary-bg)' }}
      >
        {emoji}
      </div>
      <div className="text-center">
        <h3 className="font-bold text-gray-900 text-sm">{label}</h3>
        <p className="text-gray-400 text-xs" dangerouslySetInnerHTML={{ __html: sub }} />
      </div>
    </Link>
  );
}
