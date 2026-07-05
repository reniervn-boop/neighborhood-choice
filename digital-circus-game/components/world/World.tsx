'use client';

import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Ground from '@/components/world/Ground';
import Props from '@/components/world/Props';
import PlayerController from '@/components/world/PlayerController';
import NPCEntity from '@/components/world/NPCEntity';
import Collectible from '@/components/world/Collectible';
import SceneLogic from '@/components/world/SceneLogic';
import HUD from '@/components/ui/HUD';
import DialogueBox from '@/components/ui/DialogueBox';
import InteractPrompt from '@/components/ui/InteractPrompt';
import MinigameOverlay from '@/components/ui/MinigameOverlay';
import CelebrationOverlay from '@/components/ui/CelebrationOverlay';
import { NPCS } from '@/lib/data/npcs';
import { BALL_POSITIONS } from '@/lib/data/world';
import { useGameStore } from '@/lib/store/useGameStore';
import { useInteractKey } from '@/lib/useKeyboardControls';

export default function World() {
  const character = useGameStore((s) => s.character);
  const relationships = useGameStore((s) => s.relationships);
  const quests = useGameStore((s) => s.quests);
  const activeNpcId = useGameStore((s) => s.activeNpcId);
  const activeMinigame = useGameStore((s) => s.activeMinigame);
  const celebration = useGameStore((s) => s.celebration);
  const openDialogue = useGameStore((s) => s.openDialogue);
  const collectBall = useGameStore((s) => s.collectBall);

  const positionRef = useRef(new THREE.Vector3(0, 0, 6));
  const [nearbyNpcId, setNearbyNpcId] = useState<string | null>(null);

  const collectedBalls = quests.bibbo_balls?.collected ?? [];
  const uncollectedBalls = Object.entries(BALL_POSITIONS).filter(([id]) => !collectedBalls.includes(id));

  const overlayOpen = Boolean(activeNpcId) || activeMinigame || celebration;

  useInteractKey(() => {
    if (overlayOpen) return;
    if (nearbyNpcId) openDialogue(nearbyNpcId);
  });

  if (!character) return null;

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <Canvas camera={{ position: [0, 7, 16], fov: 50 }}>
        <color attach="background" args={['#100a1a']} />
        <fog attach="fog" args={['#100a1a', 20, 45]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 5]} intensity={1.1} />

        <Ground />
        <Props />

        <PlayerController appearance={character} positionRef={positionRef} disabled={overlayOpen} />

        {NPCS.map((npc) => (
          <NPCEntity key={npc.id} npc={npc} relationship={relationships[npc.id] ?? 0} />
        ))}

        {quests.bibbo_balls?.status === 'active' &&
          uncollectedBalls.map(([id, pos]) => <Collectible key={id} position={pos} />)}

        <SceneLogic
          positionRef={positionRef}
          disabled={overlayOpen}
          onNearbyChange={setNearbyNpcId}
          collectedBalls={collectedBalls}
          onCollectBall={collectBall}
        />
      </Canvas>

      <HUD />

      {!overlayOpen && nearbyNpcId && <InteractPrompt npcId={nearbyNpcId} />}

      {activeNpcId && <DialogueBox npcId={activeNpcId} />}
      {activeMinigame && <MinigameOverlay />}
      {celebration && <CelebrationOverlay />}
    </div>
  );
}
