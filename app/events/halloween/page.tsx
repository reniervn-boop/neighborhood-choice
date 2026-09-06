import Link from 'next/link';
import { getHalloweenPhotos } from '@/lib/halloween/photos';
import { monsters } from '@/lib/halloween/monsters';

export const dynamic = 'force-dynamic';

export default async function HalloweenPage() {
  const photos = await getHalloweenPhotos();
  const dangerousCounts = monsters.filter((m) => m.dangerLevel >= 4).length;

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative min-h-[75dvh] flex flex-col items-center justify-center text-center px-4 py-16">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(255,107,0,0.05)' }}
          />
          <div
            className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full blur-3xl"
            style={{ backgroundColor: 'rgba(100,0,200,0.04)' }}
          />
        </div>

        <div className="relative z-10 max-w-2xl">
          <p
            className="text-sm uppercase tracking-[0.3em] mb-4 animate-pulse"
            style={{ color: '#ff6b00' }}
          >
            ⚠ Monster Alert Active ⚠
          </p>

          <h1
            className="text-6xl md:text-8xl text-white mb-4 leading-none"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            Halloween
            <br />
            <span style={{ color: '#ff6b00' }}>Monster Walk</span>
          </h1>

          <p className="text-gray-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Monsters have been spotted in the neighbourhood. Explore the map to find them,
            search the monster index to learn how to survive, and stay with your group.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/events/halloween/map"
              className="inline-flex items-center gap-2 text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 hover:-translate-y-0.5"
              style={{ backgroundColor: '#ff6b00' }}
            >
              🗺️ View Monster Map
            </Link>
            <Link
              href="/events/halloween/monsters"
              className="inline-flex items-center gap-2 font-semibold px-8 py-4 rounded-full transition-all duration-200"
              style={{
                border: '1px solid rgba(255,107,0,0.6)',
                color: '#ff6b00',
              }}
            >
              📖 Monster Index
            </Link>
          </div>
        </div>

        {/* Floating emojis */}
        <div className="absolute top-16 left-8 text-4xl opacity-20 pointer-events-none animate-bounce">🦇</div>
        <div className="absolute top-32 right-12 text-3xl opacity-20 pointer-events-none">🕷️</div>
        <div className="absolute bottom-16 left-16 text-4xl opacity-20 pointer-events-none animate-bounce">🕸️</div>
        <div className="absolute bottom-24 right-8 text-3xl opacity-20 pointer-events-none">🦇</div>
      </section>

      {/* Stats */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-3 gap-4">
          <StatCard emoji="📸" value={photos.length} label="Monster Sightings" color="#ff6b00" />
          <StatCard emoji="👾" value={monsters.length} label="Known Monsters" color="#c084fc" />
          <StatCard emoji="💀" value={dangerousCounts} label="Lethal Threats" color="#f87171" />
        </div>
      </section>

      {/* Recent sightings */}
      {photos.length > 0 && (
        <section className="max-w-3xl mx-auto px-4 pb-12">
          <h2
            className="text-3xl text-white mb-5"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            Recent Sightings
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {photos
              .slice()
              .reverse()
              .slice(0, 4)
              .map((photo) => (
                <Link
                  key={photo.id}
                  href="/events/halloween/map"
                  className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-200"
                >
                  <img
                    src={photo.imageUrl || `/halloween-uploads/${photo.filename}`}
                    alt={photo.title}
                    className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2">
                    <p className="text-xs text-white font-medium truncate">{photo.title}</p>
                  </div>
                </Link>
              ))}
          </div>
          <div className="mt-3 text-center">
            <Link
              href="/events/halloween/map"
              className="text-sm transition-colors"
              style={{ color: '#ff6b00' }}
            >
              View all on map →
            </Link>
          </div>
        </section>
      )}

      {/* Monster preview */}
      <section className="max-w-3xl mx-auto px-4 pb-20">
        <div className="flex items-center justify-between mb-5">
          <h2
            className="text-3xl text-white"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            Monsters Nearby
          </h2>
          <Link
            href="/events/halloween/monsters"
            className="text-sm transition-colors"
            style={{ color: '#ff6b00' }}
          >
            Full index →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {monsters.slice(0, 8).map((m) => (
            <Link
              key={m.slug}
              href={`/events/halloween/monsters/${m.slug}`}
              className="rounded-xl p-4 text-center border border-white/10 hover:border-orange-500/50 hover:-translate-y-1 transition-all duration-200"
              style={{ backgroundColor: '#12121e' }}
            >
              <div className="text-3xl mb-2">{m.emoji}</div>
              <p
                className="text-base text-white"
                style={{ fontFamily: 'var(--font-creepster), cursive' }}
              >
                {m.name}
              </p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{m.category}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  emoji,
  value,
  label,
  color,
}: {
  emoji: string;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div
      className="rounded-2xl p-5 text-center border border-white/10"
      style={{ backgroundColor: '#12121e' }}
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <div
        className="text-4xl font-bold"
        style={{ fontFamily: 'var(--font-creepster), cursive', color }}
      >
        {value}
      </div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}
