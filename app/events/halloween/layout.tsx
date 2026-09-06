import Link from 'next/link';

export default function HalloweenLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-dvh pb-24"
      style={{ backgroundColor: '#0a0a0f', color: 'white' }}
    >
      {/* Halloween navigation bar */}
      <nav
        className="sticky top-0 z-10 border-b px-4 py-3 app-bar-safe"
        style={{ backgroundColor: '#12121e', borderColor: 'rgba(255,107,0,0.2)' }}
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Wordmark */}
          <Link href="/events/halloween" className="flex items-center gap-2">
            <span className="text-2xl">🎃</span>
            <div>
              <p
                className="text-lg font-bold leading-none"
                style={{
                  fontFamily: 'var(--font-creepster), cursive',
                  color: '#ff6b00',
                }}
              >
                Monster Walk
              </p>
              <p className="text-xs text-gray-500 leading-none">Halloween 2025</p>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-1">
            <Link
              href="/events/halloween/map"
              className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
              style={{ color: '#ff6b00', backgroundColor: 'rgba(255,107,0,0.1)' }}
            >
              🗺️ Map
            </Link>
            <Link
              href="/events/halloween/monsters"
              className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
              style={{ color: '#ffab70', backgroundColor: 'rgba(255,107,0,0.05)' }}
            >
              📖 Index
            </Link>
            <Link
              href="/events/halloween/admin"
              className="px-3 py-1.5 text-xs font-semibold rounded-full transition-colors"
              style={{ color: '#aaaaaa', backgroundColor: 'rgba(255,255,255,0.05)' }}
            >
              🔑 Admin
            </Link>
          </div>
        </div>
      </nav>

      {children}
    </div>
  );
}
