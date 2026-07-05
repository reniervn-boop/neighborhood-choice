'use client';

import { Html } from '@react-three/drei';
import AvatarModel from '@/components/AvatarModel';
import { NPCDefinition } from '@/lib/types';
import { tierForScore, TIER_COLORS } from '@/lib/relationship';

const TIER_BOUNCE: Record<string, number> = {
  hostile: 0.4,
  cold: 0.7,
  neutral: 1,
  friendly: 1.4,
  beloved: 2,
};

export default function NPCEntity({ npc, relationship }: { npc: NPCDefinition; relationship: number }) {
  const tier = tierForScore(relationship);

  return (
    <group position={npc.position}>
      <AvatarModel
        appearance={{
          bodyColor: npc.color,
          accentColor: npc.accentColor,
          headShape: npc.headShape,
          eyeStyle: npc.eyeStyle,
          accessory: npc.accessory,
        }}
        bounceSpeed={TIER_BOUNCE[tier]}
      />
      <mesh position={[0, 2.5, 0]}>
        <sphereGeometry args={[0.08, 10, 10]} />
        <meshStandardMaterial color={TIER_COLORS[tier]} emissive={TIER_COLORS[tier]} emissiveIntensity={0.9} />
      </mesh>
      <Html position={[0, 2.15, 0]} center distanceFactor={10} occlude={false}>
        <div className="whitespace-nowrap text-white text-sm font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
          {npc.name}
        </div>
      </Html>
    </group>
  );
}
