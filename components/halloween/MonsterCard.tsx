import Link from 'next/link';
import { HalloweenMonster } from '@/lib/halloween/monsters';

const DANGER_LABELS = ['', 'Mild', 'Moderate', 'Dangerous', 'Very Dangerous', 'LETHAL'];
const DANGER_COLORS = [
  '',
  'text-green-400',
  'text-yellow-400',
  'text-orange-400',
  'text-red-400',
  'text-red-600',
];

interface MonsterCardProps {
  monster: HalloweenMonster;
}

export default function MonsterCard({ monster }: MonsterCardProps) {
  return (
    <Link
      href={`/events/halloween/monsters/${monster.slug}`}
      className="group block rounded-2xl overflow-hidden border border-white/10 hover:border-orange-500/60 hover:-translate-y-1 transition-all duration-300"
      style={{ backgroundColor: '#12121e' }}
    >
      {/* Emoji banner */}
      <div
        className="h-28 flex items-center justify-center text-6xl"
        style={{ backgroundColor: monster.accentColor + '33' }}
      >
        <span className="group-hover:scale-110 transition-transform duration-300 inline-block">
          {monster.emoji}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3
            className="text-2xl font-bold text-white group-hover:text-orange-400 transition-colors"
            style={{ fontFamily: 'var(--font-creepster), cursive' }}
          >
            {monster.name}
          </h3>
          <span className={`text-xs font-bold mt-1 ${DANGER_COLORS[monster.dangerLevel]}`}>
            ⚠ {DANGER_LABELS[monster.dangerLevel]}
          </span>
        </div>

        <p className="text-xs text-gray-400 mb-3 italic">{monster.origin}</p>

        {/* Danger pips */}
        <div className="flex gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-2 flex-1 rounded-full"
              style={{
                backgroundColor: i < monster.dangerLevel ? '#ff6b00' : 'rgba(255,255,255,0.1)',
              }}
            />
          ))}
        </div>

        <p className="text-sm text-gray-400 line-clamp-3">{monster.description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="text-xs bg-white/5 border border-white/10 rounded-full px-3 py-1 text-gray-300 capitalize">
            {monster.category}
          </span>
          <span
            className="text-xs rounded-full px-3 py-1"
            style={{
              backgroundColor: 'rgba(255,107,0,0.1)',
              border: '1px solid rgba(255,107,0,0.3)',
              color: '#ffab70',
            }}
          >
            {monster.weaknesses.length} weaknesses
          </span>
        </div>
      </div>
    </Link>
  );
}
