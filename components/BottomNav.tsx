'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';

const navItems = [
  {
    href: '/',
    label: 'Home',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    href: '/noticeboard',
    label: 'Board',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ),
  },
  {
    href: '/report',
    label: 'Report',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    highlight: true,
  },
  {
    href: '/events',
    label: 'Events',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
      </svg>
    ),
  },
  {
    href: '/leaderboard',
    label: 'Scores',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    href: '/profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg className="w-6 h-6" fill={active ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 0 : 2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();

  // Don't show on auth pages
  if (!isAuthenticated || pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bottom-nav shadow-2xl"
      style={{ backgroundColor: 'var(--brand-black)' }}
    >
      {/* Joburg skyline silhouette */}
      <div className="w-full overflow-hidden select-none pointer-events-none" style={{ height: 28, borderTop: '1px solid #2a2a2a' }}>
        <svg
          viewBox="0 0 375 44"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden="true"
          className="w-full h-full"
        >
          <path
            fill="rgba(255,255,255,0.09)"
            d="M0,44 L0,30 L5,30 L5,32 L8,32 L8,26 L12,26 L12,22 L14,22 L14,18 L16,18 L16,16 L18,16 L18,14 L20,14 L20,16 L22,16 L22,22 L24,22 L24,30 L28,30 L28,24 L32,24 L32,20 L34,20 L34,24 L36,24 L36,30 L40,30 L40,22 L44,22 L44,18 L46,18 L46,14 L48,14 L48,10 L49,10 L49,6 L50,6 L50,4 L51,4 L51,6 L52,6 L52,10 L53,10 L53,14 L54,14 L54,18 L56,18 L56,22 L60,22 L60,30 L64,30 L64,22 L68,22 L68,16 L70,16 L70,12 L72,12 L72,10 L73,10 L73,6 L74,6 L74,10 L75,10 L75,12 L76,12 L76,16 L78,16 L78,22 L82,22 L82,30 L88,30 L88,22 L92,22 L92,16 L94,16 L94,10 L96,10 L96,6 L97,6 L97,4 L98,4 L98,2 L99,2 L99,4 L100,4 L100,6 L101,6 L101,10 L102,10 L102,16 L104,16 L104,22 L108,22 L108,30 L114,30 L114,22 L118,22 L118,18 L120,18 L120,14 L122,14 L122,18 L124,18 L124,22 L128,22 L128,30 L134,30 L134,22 L138,22 L138,16 L140,16 L140,12 L142,12 L142,16 L144,16 L144,22 L148,22 L148,30 L154,30 L154,22 L158,22 L158,18 L162,18 L162,22 L166,22 L166,28 L172,28 L172,20 L176,20 L176,14 L178,14 L178,20 L182,20 L182,28 L188,28 L188,20 L192,20 L192,14 L194,14 L194,20 L198,20 L198,28 L204,28 L204,20 L208,20 L208,26 L214,26 L214,32 L220,32 L220,24 L224,24 L224,20 L226,20 L226,24 L230,24 L230,32 L236,32 L236,24 L240,24 L240,28 L246,28 L246,34 L252,34 L252,26 L256,26 L256,22 L258,22 L258,26 L262,26 L262,34 L268,34 L268,26 L272,26 L272,32 L278,32 L278,36 L284,36 L284,30 L288,30 L288,34 L294,34 L294,38 L300,38 L300,32 L304,32 L304,38 L310,38 L310,34 L314,34 L314,38 L320,38 L320,34 L324,34 L324,38 L330,38 L330,36 L336,36 L336,38 L342,38 L342,36 L348,36 L348,40 L360,40 L360,42 L375,42 L375,44 Z"
          />
        </svg>
      </div>

      <div className="flex items-stretch max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex-1 flex flex-col items-center justify-center py-2 relative"
              >
                <div
                  style={{ backgroundColor: 'var(--primary)', borderColor: 'var(--brand-black)' }}
                  className="absolute -top-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4"
                >
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-xs font-semibold mt-6" style={{ color: 'var(--primary)' }}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors"
              style={{ color: isActive ? 'var(--primary)' : '#6b7280' }}
            >
              {item.icon(isActive)}
              <span className="text-xs font-semibold">{item.label}</span>
              {/* Active indicator dot */}
              {isActive && (
                <span
                  className="w-1 h-1 rounded-full -mt-1"
                  style={{ backgroundColor: 'var(--primary)' }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
