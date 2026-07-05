'use client';

import { useState } from 'react';
import { useGameStore, friendlyOrBetterCount } from '@/lib/store/useGameStore';
import { getNPC } from '@/lib/data/npcs';
import { questForNPC } from '@/lib/data/quests';
import { tierForScore, TIER_LABELS } from '@/lib/relationship';
import { ToneKey } from '@/lib/types';

const TONE_LABELS: Record<ToneKey, string> = {
  kind: 'Be kind',
  funny: 'Make a joke',
  honest: 'Be honest',
  rude: 'Be rude',
};

type View = 'greeting' | 'hub' | 'reaction' | 'riddleFeedback';

export default function DialogueBox({ npcId }: { npcId: string }) {
  const npc = getNPC(npcId);
  const quest = questForNPC(npcId);

  const closeDialogue = useGameStore((s) => s.closeDialogue);
  const relationships = useGameStore((s) => s.relationships);
  const quests = useGameStore((s) => s.quests);
  const applyTone = useGameStore((s) => s.applyTone);
  const startQuest = useGameStore((s) => s.startQuest);
  const turnInQuest = useGameStore((s) => s.turnInQuest);
  const startMinigame = useGameStore((s) => s.startMinigame);
  const answerRiddle = useGameStore((s) => s.answerRiddle);

  const [view, setView] = useState<View>('greeting');
  const [lastTone, setLastTone] = useState<ToneKey | null>(null);
  const [riddleCorrect, setRiddleCorrect] = useState(false);

  const score = relationships[npcId] ?? 0;
  const tier = tierForScore(score);
  const questStatus = quests[quest.id]?.status ?? 'unstarted';
  const collected = quests[quest.id]?.collected ?? [];

  const greetingLine = npc.greetings[tier][0];

  function handleTone(tone: ToneKey) {
    applyTone(npcId, tone);
    setLastTone(tone);
    setView('reaction');
  }

  function handleRiddleAnswer(index: number) {
    const correct = answerRiddle(quest.id, index);
    setRiddleCorrect(correct);
    setView('riddleFeedback');
  }

  return (
    <div className="absolute inset-0 flex items-end justify-center pb-8 px-4">
      <div className="w-full max-w-2xl bg-[#1a1225]/95 border border-white/15 rounded-2xl p-5 text-white backdrop-blur-md shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="font-bold text-lg" style={{ color: npc.color }}>
              {npc.name}
            </div>
            <div className="text-xs text-white/50">
              {npc.title} &middot; {TIER_LABELS[tier]}
            </div>
          </div>
          <button
            onClick={closeDialogue}
            className="text-white/50 hover:text-white text-sm rounded-full px-2 py-1"
          >
            Leave ✕
          </button>
        </div>

        {view === 'greeting' && (
          <div className="space-y-4">
            <p className="text-white/90 italic">&ldquo;{greetingLine}&rdquo;</p>
            <button
              onClick={() => setView('hub')}
              className="rounded-lg bg-pink-500 hover:bg-pink-400 px-4 py-2 text-sm font-semibold"
            >
              Continue
            </button>
          </div>
        )}

        {view === 'reaction' && lastTone && (
          <div className="space-y-4">
            <p className="text-white/90 italic">&ldquo;{npc.reactions[lastTone][0]}&rdquo;</p>
            <button
              onClick={() => setView('hub')}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm"
            >
              Back
            </button>
          </div>
        )}

        {view === 'riddleFeedback' && quest.riddle && (
          <div className="space-y-4">
            <p className="text-white/90 italic">
              {riddleCorrect ? `"${quest.turnInText}"` : `"${quest.riddle.hint}"`}
            </p>
            <button
              onClick={() => setView('hub')}
              className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm"
            >
              Back
            </button>
          </div>
        )}

        {view === 'hub' && (
          <div className="space-y-4">
            {/* Quest section */}
            <div className="rounded-xl bg-black/30 p-3 space-y-2">
              <div className="text-xs uppercase tracking-wide text-white/40">Quest &middot; {quest.title}</div>

              {questStatus === 'unstarted' && (
                <>
                  <p className="text-sm text-white/80">&ldquo;{quest.offerText}&rdquo;</p>
                  <button
                    onClick={() => startQuest(quest.id)}
                    className="rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 px-4 py-2 text-sm font-semibold"
                  >
                    Accept Quest
                  </button>
                </>
              )}

              {questStatus === 'active' && quest.type === 'collect' && (
                <p className="text-sm text-white/70">
                  Balls found: {collected.length} / {quest.collectibleIds?.length ?? 0}. Keep looking around the
                  meadow!
                </p>
              )}

              {questStatus === 'active' && quest.type === 'minigame' && (
                <>
                  <p className="text-sm text-white/70">Ready to prove you&apos;ve got rhythm?</p>
                  <button
                    onClick={startMinigame}
                    className="rounded-lg bg-yellow-400 text-black hover:bg-yellow-300 px-4 py-2 text-sm font-semibold"
                  >
                    Start Minigame
                  </button>
                </>
              )}

              {questStatus === 'active' && quest.type === 'riddle' && quest.riddle && (
                <div className="space-y-2">
                  <p className="text-sm text-white/80">{quest.riddle.question}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quest.riddle.options.map((opt, i) => (
                      <button
                        key={opt}
                        onClick={() => handleRiddleAnswer(i)}
                        className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm text-left"
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {questStatus === 'active' && quest.type === 'social' && (
                friendlyOrBetterCount(relationships, npcId) >= (quest.requiredFriendlyCount ?? 0) ? (
                  <>
                    <p className="text-sm text-white/80">&ldquo;{quest.turnInText}&rdquo;</p>
                    <button
                      onClick={() => turnInQuest(quest.id)}
                      className="rounded-lg bg-green-400 text-black hover:bg-green-300 px-4 py-2 text-sm font-semibold"
                    >
                      Turn In Quest
                    </button>
                  </>
                ) : (
                  <p className="text-sm text-white/70">
                    Friends earned: {friendlyOrBetterCount(relationships, npcId)} / {quest.requiredFriendlyCount}
                  </p>
                )
              )}

              {questStatus === 'ready' && (
                <>
                  <p className="text-sm text-white/80">&ldquo;{quest.turnInText}&rdquo;</p>
                  <button
                    onClick={() => turnInQuest(quest.id)}
                    className="rounded-lg bg-green-400 text-black hover:bg-green-300 px-4 py-2 text-sm font-semibold"
                  >
                    Turn In Quest
                  </button>
                </>
              )}

              {questStatus === 'complete' && (
                <p className="text-sm text-white/50 italic">{quest.completeText}</p>
              )}
            </div>

            {/* Conversation tones */}
            <div>
              <div className="text-xs uppercase tracking-wide text-white/40 mb-2">Talk</div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(TONE_LABELS) as ToneKey[]).map((tone) => (
                  <button
                    key={tone}
                    onClick={() => handleTone(tone)}
                    className="rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-sm"
                  >
                    {TONE_LABELS[tone]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
