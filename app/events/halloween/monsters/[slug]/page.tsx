import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getMonsterBySlug, monsters } from '@/lib/halloween/monsters';
import { getHalloweenPhotos } from '@/lib/halloween/photos';

export function generateStaticParams() {
  return monsters.map((m) => ({ slug: m.slug }));
}

const DANGER_LABELS = ['', 'Mild', 'Moderate', 'Dangerous', 'Very Dangerous', 'LETHAL'];
const DANGER_COLORS = [
  '',
  'text-green-400 border-green-400/40',
  'text-yellow-400 border-yellow-400/40',
  'text-orange-400 border-orange-400/40',
  'text-red-400 border-red-400/40',
  'text-red-500 border-red-500/40',
];

export default async function MonsterDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const monster = getMonsterBySlug(slug);
  if (!monster) notFound();

  const allPhotos = await getHalloweenPhotos();
  const sightings = allPhotos.filter((p) => p.monsterType === monster.slug);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        href="/events/halloween/monsters"
        className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-orange-400 transition-colors mb-8"
      >
        ← Back to Monster Index
      </Link>

      {/* Header */}
      <div
        className="rounded-3xl p-8 mb-8 relative overflow-hidden border border-white/10"
        style={{ backgroundColor: monster.accentColor + '22' }}
      >
        <div className="absolute top-0 right-0 text-[12rem] opacity-10 pointer-events-none leading-none">
          {monster.emoji}
        </div>
        <div className="relative z-10">
          <div className="text-6xl mb-4">{monster.emoji}</div>
          <h1
            className="text-5xl md:text-6xl text-white mb-2"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            {monster.name}
          </h1>
          <p className="text-gray-400 italic mb-4">{monster.origin}</p>

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`text-sm font-bold border rounded-full px-4 py-1.5 ${DANGER_COLORS[monster.dangerLevel]}`}
            >
              ⚠ {DANGER_LABELS[monster.dangerLevel]}
            </span>
            <span className="text-sm bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-gray-300 capitalize">
              {monster.category}
            </span>
            {sightings.length > 0 && (
              <span
                className="text-sm rounded-full px-4 py-1.5"
                style={{
                  backgroundColor: 'rgba(255,107,0,0.15)',
                  border: '1px solid rgba(255,107,0,0.4)',
                  color: '#ffab70',
                }}
              >
                📍 {sightings.length} local sighting{sightings.length === 1 ? '' : 's'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Description */}
        <div
          className="md:col-span-2 rounded-2xl p-6 border border-white/10"
          style={{ backgroundColor: '#12121e' }}
        >
          <h2
            className="text-2xl text-orange-400 mb-3"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            Overview
          </h2>
          <p className="text-gray-300 leading-relaxed">{monster.description}</p>
        </div>

        {/* Abilities */}
        <div
          className="rounded-2xl p-6 border border-white/10"
          style={{ backgroundColor: '#12121e' }}
        >
          <h2
            className="text-2xl text-orange-400 mb-3"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            ⚡ Abilities
          </h2>
          <ul className="space-y-2">
            {monster.abilities.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-red-400 mt-0.5 shrink-0">✦</span>
                {a}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div
          className="rounded-2xl p-6 border border-white/10"
          style={{ backgroundColor: '#12121e' }}
        >
          <h2
            className="text-2xl text-orange-400 mb-3"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            🛡️ Weaknesses
          </h2>
          <ul className="space-y-2">
            {monster.weaknesses.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-green-400 mt-0.5 shrink-0">✔</span>
                {w}
              </li>
            ))}
          </ul>
        </div>

        {/* How to handle */}
        <div
          className="md:col-span-2 rounded-2xl p-6 border"
          style={{
            backgroundColor: 'rgba(255,107,0,0.1)',
            borderColor: 'rgba(255,107,0,0.3)',
          }}
        >
          <h2
            className="text-2xl text-orange-400 mb-3"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            🧠 How to Handle It
          </h2>
          <p className="text-gray-200 leading-relaxed">{monster.howToHandle}</p>
        </div>
      </div>

      {/* Danger meter */}
      <div
        className="rounded-2xl p-6 mb-8 border border-white/10"
        style={{ backgroundColor: '#12121e' }}
      >
        <h2
          className="text-2xl text-orange-400 mb-4"
          style={{ fontFamily: 'var(--font-creepster), cursive' }}
        >
          Danger Level
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex gap-2 flex-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-4 flex-1 rounded-full"
                style={{
                  backgroundColor: i < monster.dangerLevel ? '#ff6b00' : 'rgba(255,255,255,0.1)',
                }}
              />
            ))}
          </div>
          <span
            className={`text-sm font-bold ${DANGER_COLORS[monster.dangerLevel].split(' ')[0]}`}
          >
            {monster.dangerLevel}/5 — {DANGER_LABELS[monster.dangerLevel]}
          </span>
        </div>
      </div>

      {/* Neighbourhood sightings */}
      {sightings.length > 0 && (
        <div className="mb-8">
          <h2
            className="text-3xl text-white mb-4"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            Neighbourhood Sightings
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {sightings.map((photo) => (
              <Link
                key={photo.id}
                href="/events/halloween/map"
                className="group relative rounded-xl overflow-hidden border border-white/10 hover:border-orange-500/50 transition-all duration-200"
              >
                <img
                  src={`/halloween-uploads/${photo.filename}`}
                  alt={photo.title}
                  className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <p className="absolute bottom-2 left-2 right-2 text-xs text-white truncate">
                  {photo.title}
                </p>
              </Link>
            ))}
          </div>
          <Link
            href="/events/halloween/map"
            className="inline-block mt-3 text-sm text-orange-400 hover:text-orange-300 transition-colors"
          >
            View on map →
          </Link>
        </div>
      )}

      {/* Other monsters */}
      <div>
        <h2
          className="text-2xl text-white mb-4"
          style={{ fontFamily: 'var(--font-creepster), cursive' }}
        >
          Other Monsters
        </h2>
        <div className="flex flex-wrap gap-3">
          {monsters
            .filter((m) => m.slug !== monster.slug)
            .map((m) => (
              <Link
                key={m.slug}
                href={`/events/halloween/monsters/${m.slug}`}
                className="flex items-center gap-2 rounded-full px-4 py-2 text-sm text-gray-300 hover:text-white transition-all duration-200 border border-white/10 hover:border-orange-500/50"
                style={{ backgroundColor: '#12121e' }}
              >
                <span>{m.emoji}</span>
                <span>{m.name}</span>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
