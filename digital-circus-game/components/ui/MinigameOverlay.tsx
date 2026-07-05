'use client';

import { useEffect, useMemo, useState } from 'react';
import { useGameStore } from '@/lib/store/useGameStore';

type Direction = 'Up' | 'Down' | 'Left' | 'Right';
const DIRECTIONS: Direction[] = ['Up', 'Down', 'Left', 'Right'];
const ARROWS: Record<Direction, string> = { Up: '↑', Down: '↓', Left: '←', Right: '→' };
const KEY_TO_DIRECTION: Record<string, Direction> = {
  ArrowUp: 'Up',
  ArrowDown: 'Down',
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
};

function randomSequence(length: number): Direction[] {
  return Array.from({ length }, () => DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]);
}

export default function MinigameOverlay() {
  const finishMinigame = useGameStore((s) => s.finishMinigame);
  const [sequence, setSequence] = useState<Direction[]>(() => randomSequence(4));
  const [phase, setPhase] = useState<'showing' | 'input' | 'success' | 'fail'>('showing');
  const [showIndex, setShowIndex] = useState(-1);
  const [inputIndex, setInputIndex] = useState(0);

  useEffect(() => {
    if (phase !== 'showing') return;
    if (showIndex < sequence.length - 1) {
      const t = setTimeout(() => setShowIndex((i) => i + 1), 650);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase('input'), 650);
    return () => clearTimeout(t);
  }, [phase, showIndex, sequence.length]);

  useEffect(() => {
    if (phase !== 'input') return;
    const handler = (e: KeyboardEvent) => {
      const dir = KEY_TO_DIRECTION[e.code];
      if (!dir) return;
      if (dir === sequence[inputIndex]) {
        if (inputIndex === sequence.length - 1) {
          setPhase('success');
        } else {
          setInputIndex((i) => i + 1);
        }
      } else {
        setPhase('fail');
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [phase, inputIndex, sequence]);

  function retry() {
    setSequence(randomSequence(4));
    setShowIndex(-1);
    setInputIndex(0);
    setPhase('showing');
  }

  const currentShown = useMemo(() => (showIndex >= 0 ? sequence[showIndex] : null), [showIndex, sequence]);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/70">
      <div className="bg-[#1a1225] border border-white/15 rounded-2xl p-8 text-white text-center w-full max-w-md">
        <h2 className="text-xl font-bold mb-2">Copy the Beat</h2>

        {phase === 'showing' && (
          <>
            <p className="text-white/60 mb-4">Watch closely...</p>
            <div className="text-6xl h-20 flex items-center justify-center">
              {currentShown ? ARROWS[currentShown] : '...'}
            </div>
          </>
        )}

        {phase === 'input' && (
          <>
            <p className="text-white/60 mb-4">Your turn! Press the arrows in order.</p>
            <div className="flex justify-center gap-2 text-2xl mb-2">
              {sequence.map((dir, i) => (
                <span key={i} className={i < inputIndex ? 'text-green-400' : 'text-white/30'}>
                  {ARROWS[dir]}
                </span>
              ))}
            </div>
          </>
        )}

        {phase === 'success' && (
          <>
            <p className="text-green-400 font-semibold mb-4">Nailed it!</p>
            <button
              onClick={() => finishMinigame(true)}
              className="rounded-lg bg-pink-500 hover:bg-pink-400 px-4 py-2 text-sm font-semibold"
            >
              Continue
            </button>
          </>
        )}

        {phase === 'fail' && (
          <>
            <p className="text-red-400 font-semibold mb-4">Off beat. Try again?</p>
            <div className="flex justify-center gap-3">
              <button onClick={retry} className="rounded-lg bg-yellow-400 text-black px-4 py-2 text-sm font-semibold">
                Retry
              </button>
              <button
                onClick={() => finishMinigame(false)}
                className="rounded-lg bg-white/10 hover:bg-white/20 px-4 py-2 text-sm"
              >
                Give Up
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
