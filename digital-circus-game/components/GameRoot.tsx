'use client';

import { useEffect } from 'react';
import { useGameStore } from '@/lib/store/useGameStore';
import CharacterCreator from '@/components/CharacterCreator';
import World from '@/components/world/World';

export default function GameRoot() {
  const phase = useGameStore((s) => s.phase);
  const init = useGameStore((s) => s.init);

  useEffect(() => {
    init();
  }, [init]);

  if (phase === 'loading') {
    return (
      <div className="min-h-screen w-full bg-[#0a0612] flex items-center justify-center text-white/60">
        Raising the big top...
      </div>
    );
  }

  if (phase === 'create') {
    return <CharacterCreator />;
  }

  return <World />;
}
