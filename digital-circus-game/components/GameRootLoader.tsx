'use client';

import dynamic from 'next/dynamic';

const GameRoot = dynamic(() => import('@/components/GameRoot'), { ssr: false });

export default function GameRootLoader() {
  return <GameRoot />;
}
