'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

interface NavItem {
  href: string;
  label: string;
  icon: (active: boolean) => React.ReactNode;
  primary?: boolean;
}

const navItems: NavItem[] = [
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg className="w-5 h-5 flex-shrink-0" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/noticeboard',
    label: 'Noticeboard',
    icon: (active: boolean) => (
      <svg className="w-5 h-5 flex-shrink-0" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    href: '/report',
    label: 'Report Issue',
    icon: () => (
      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    primary: true,
  },
  {
    href: '/events',
    label: 'Events',
    icon: (active: boolean) => (
      <svg className="w-5 h-5 flex-shrink-0" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    href: '/leaderboard',
    label: 'Scores',
    icon: (active: boolean) => (
      <svg className="w-5 h-5 flex-shrink-0" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'My Profile',
    icon: (active: boolean) => (
      <svg className="w-5 h-5 flex-shrink-0" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

const secondaryItems = [
  { href: '/finance', label: 'Finance', emoji: '💰' },
  { href: '/documents', label: 'Documents', emoji: '📁' },
  { href: '/ward', label: 'Ward 134', emoji: '🏛️' },
  { href: '/contacts', label: 'Contacts', emoji: '📞' },
  { href: '/crime', label: 'Crime', emoji: '🔍' },
  { href: '/security', label: 'Security', emoji: '🔒' },
  { href: '/prospectus', label: 'Prospectus', emoji: '🏘️' },
  { href: '/agm', label: 'AGM / Voting', emoji: '🗳' },
  { href: '/governance', label: 'Governance', emoji: '📜' },
];

export default function DesktopNav() {
  const pathname = usePathname();
  const { isAuthenticated, isCommittee, user } = useAuth();

  if (!isAuthenticated || pathname.startsWith('/auth')) return null;

  return (
    <nav
      className="hidden lg:flex flex-col fixed top-0 left-0 h-screen w-64 z-50 border-r overflow-y-auto"
      style={{ backgroundColor: 'var(--brand-black)', borderColor: '#2a2a2a' }}
    >
      {/* Logo */}
      <div className="p-5 pb-4 flex-shrink-0">
        <Link href="/">
          <div className="bg-white rounded-xl px-3 py-2 inline-block">
            <img src="/sx7ra-logo.svg" alt="SX7RA" className="h-8 w-auto" draggable={false} />
          </div>
        </Link>
      </div>

      {/* Primary nav */}
      <div className="px-3 space-y-0.5 flex-shrink-0">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          if (item.primary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-white my-1 transition-transform active:scale-[0.98]"
                style={{ backgroundColor: 'var(--primary)', boxShadow: 'var(--shadow-fab)' }}
              >
                {item.icon(false)}
                {item.label}
              </Link>
            );
          }
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
              style={{
                color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.7)',
                backgroundColor: isActive ? 'rgba(213,32,39,0.12)' : 'transparent',
              }}
            >
              {item.icon(isActive)}
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Divider + secondary nav */}
      <div className="px-3 mt-3 pt-3 border-t flex-shrink-0" style={{ borderColor: '#2a2a2a' }}>
        <p className="px-4 mb-1 text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.25)' }}>
          More
        </p>
        <div className="space-y-0.5">
          {secondaryItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors"
                style={{
                  color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.55)',
                  backgroundColor: isActive ? 'rgba(213,32,39,0.12)' : 'transparent',
                }}
              >
                <span className="text-base w-5 text-center">{item.emoji}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Committee / Admin */}
      {(isCommittee || user?.role === 'admin') && (
        <div className="px-3 mt-3 pt-3 border-t flex-shrink-0" style={{ borderColor: '#2a2a2a' }}>
          {isCommittee && (
            <Link
              href="/committee"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors"
              style={{
                color: pathname.startsWith('/committee') ? 'var(--primary)' : 'rgba(255,255,255,0.55)',
                backgroundColor: pathname.startsWith('/committee') ? 'rgba(213,32,39,0.12)' : 'transparent',
              }}
            >
              <span className="text-base w-5 text-center">⚙️</span>
              Committee Panel
            </Link>
          )}
          {user?.role === 'admin' && !isCommittee && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-2 rounded-xl text-sm transition-colors"
              style={{
                color: pathname.startsWith('/admin') ? 'var(--primary)' : 'rgba(255,255,255,0.55)',
                backgroundColor: pathname.startsWith('/admin') ? 'rgba(213,32,39,0.12)' : 'transparent',
              }}
            >
              <span className="text-base w-5 text-center">🛡️</span>
              Admin Dashboard
            </Link>
          )}
        </div>
      )}

      {/* Tagline footer */}
      <div className="mt-auto p-5 pt-3 border-t flex-shrink-0" style={{ borderColor: '#2a2a2a' }}>
        <p className="text-xs leading-relaxed italic" style={{ color: 'rgba(255,255,255,0.3)' }}>
          &ldquo;Working towards making SX7 a suburb of choice&rdquo;
        </p>
      </div>
    </nav>
  );
}
