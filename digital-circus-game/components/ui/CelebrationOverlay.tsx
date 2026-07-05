'use client';

import { useGameStore } from '@/lib/store/useGameStore';

export default function CelebrationOverlay() {
  const character = useGameStore((s) => s.character);
  const dismissCelebration = useGameStore((s) => s.dismissCelebration);
  const closeDialogue = useGameStore((s) => s.closeDialogue);

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
      <div className="text-center text-white max-w-lg px-6">
        <div className="text-6xl mb-4">🎪</div>
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-pink-400 via-yellow-300 to-cyan-300 bg-clip-text text-transparent">
          Orientation Complete!
        </h1>
        <p className="text-white/80 mb-6">
          {character?.name ?? 'You'} have officially joined the Digital Circus. The lights flicker in celebration —
          you belong here now.
        </p>
        <button
          onClick={() => {
            dismissCelebration();
            closeDialogue();
          }}
          className="rounded-lg bg-pink-500 hover:bg-pink-400 px-6 py-3 font-semibold"
        >
          Back to the Show
        </button>
      </div>
    </div>
  );
}
