'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import AppHeader from '@/components/AppHeader';
import LoadingScreen from '@/components/LoadingScreen';

const EVENTS = [
  {
    id: 'halloween',
    href: '/events/halloween',
    emoji: '🎃',
    title: 'Monster Walk',
    subtitle: 'Halloween 2025',
    description: 'Find monsters in the neighbourhood. Monster index, sightings map, and survival guide.',
    status: 'active' as const,
    accentColor: '#ff6b00',
    bgColor: '#12121e',
  },
];

export default function EventsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen message="Loading events…" />;
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: 'var(--background)' }}>
      <AppHeader title="Events" showBrand />

      <div className="max-w-lg mx-auto px-4 py-5">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
          Upcoming &amp; Active Events
        </h2>

        <div className="space-y-4">
          {EVENTS.map((event) => (
            <Link
              key={event.id}
              href={event.href}
              className="block rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-transform active:scale-[0.98]"
              style={{ backgroundColor: event.bgColor }}
            >
              {/* Accent bar */}
              <div className="h-1.5 w-full" style={{ backgroundColor: event.accentColor }} />

              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                    style={{ backgroundColor: `${event.accentColor}22` }}
                  >
                    {event.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className="font-bold text-lg text-white leading-tight"
                        style={{ fontFamily: event.id === 'halloween' ? 'var(--font-creepster), cursive' : undefined }}
                      >
                        {event.title}
                      </h3>
                      {event.status === 'active' && (
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                          style={{ backgroundColor: `${event.accentColor}22`, color: event.accentColor }}
                        >
                          LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs mb-2" style={{ color: event.accentColor }}>
                      {event.subtitle}
                    </p>
                    <p className="text-xs text-gray-400 leading-relaxed">{event.description}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <span className="text-xs font-semibold" style={{ color: event.accentColor }}>
                    Open event →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state hint */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400">
            More community events coming soon.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Committee members can create events from the Committee Panel.
          </p>
        </div>
      </div>
    </div>
  );
}
