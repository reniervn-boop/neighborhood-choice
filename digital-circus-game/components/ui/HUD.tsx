'use client';

import { useGameStore } from '@/lib/store/useGameStore';
import { NPCS } from '@/lib/data/npcs';
import { QUESTS } from '@/lib/data/quests';
import { tierForScore, TIER_COLORS, TIER_LABELS } from '@/lib/relationship';

const QUEST_STATUS_LABEL: Record<string, string> = {
  unstarted: 'Not started',
  active: 'In progress',
  ready: 'Ready to turn in!',
  complete: 'Complete',
};

export default function HUD() {
  const character = useGameStore((s) => s.character);
  const relationships = useGameStore((s) => s.relationships);
  const quests = useGameStore((s) => s.quests);

  return (
    <div className="pointer-events-none absolute inset-0 p-4 flex flex-col justify-between text-white font-sans">
      <div className="flex justify-between items-start">
        <div className="bg-black/50 rounded-xl p-3 max-w-xs backdrop-blur">
          <div className="text-xs uppercase tracking-wide text-white/50 mb-1">Quest Log</div>
          <ul className="space-y-1 text-sm">
            {QUESTS.map((q) => (
              <li key={q.id} className="flex justify-between gap-3">
                <span>{q.title}</span>
                <span
                  className={
                    quests[q.id]?.status === 'ready'
                      ? 'text-yellow-300'
                      : quests[q.id]?.status === 'complete'
                        ? 'text-green-400'
                        : 'text-white/50'
                  }
                >
                  {QUEST_STATUS_LABEL[quests[q.id]?.status ?? 'unstarted']}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-black/50 rounded-xl p-3 backdrop-blur min-w-[180px]">
          <div className="text-xs uppercase tracking-wide text-white/50 mb-1">Performers</div>
          <ul className="space-y-1 text-sm">
            {NPCS.map((npc) => {
              const tier = tierForScore(relationships[npc.id] ?? 0);
              return (
                <li key={npc.id} className="flex items-center gap-2">
                  <span
                    className="inline-block w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: TIER_COLORS[tier] }}
                  />
                  <span className="flex-1">{npc.name}</span>
                  <span className="text-white/50">{TIER_LABELS[tier]}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div className="bg-black/40 rounded-lg px-3 py-2 text-xs text-white/70 backdrop-blur">
          WASD / Arrows to move &middot; E to interact
        </div>
        {character && (
          <div className="bg-black/40 rounded-lg px-3 py-2 text-sm backdrop-blur">{character.name}</div>
        )}
      </div>
    </div>
  );
}
