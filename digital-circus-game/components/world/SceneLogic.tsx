'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { NPCS } from '@/lib/data/npcs';
import { BALL_POSITIONS } from '@/lib/data/world';

const INTERACT_DISTANCE = 3;
const PICKUP_DISTANCE = 1.1;

const cameraOffset = new THREE.Vector3(0, 7, 10);
const lookTarget = new THREE.Vector3();
const desiredCamPos = new THREE.Vector3();

interface SceneLogicProps {
  positionRef: React.MutableRefObject<THREE.Vector3>;
  disabled: boolean;
  onNearbyChange: (npcId: string | null) => void;
  collectedBalls: string[];
  onCollectBall: (id: string) => void;
}

export default function SceneLogic({
  positionRef,
  disabled,
  onNearbyChange,
  collectedBalls,
  onCollectBall,
}: SceneLogicProps) {
  const { camera } = useThree();
  const lastNearby = useRef<string | null>(null);

  useFrame(() => {
    const p = positionRef.current;

    // camera follow
    desiredCamPos.set(p.x + cameraOffset.x, cameraOffset.y, p.z + cameraOffset.z);
    camera.position.lerp(desiredCamPos, 0.08);
    lookTarget.set(p.x, 1, p.z);
    camera.lookAt(lookTarget);

    if (disabled) return;

    // proximity to NPCs
    let nearest: string | null = null;
    let nearestDist = INTERACT_DISTANCE;
    for (const npc of NPCS) {
      const dist = Math.hypot(p.x - npc.position[0], p.z - npc.position[2]);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = npc.id;
      }
    }
    if (nearest !== lastNearby.current) {
      lastNearby.current = nearest;
      onNearbyChange(nearest);
    }

    // ball pickup
    for (const [id, pos] of Object.entries(BALL_POSITIONS)) {
      if (collectedBalls.includes(id)) continue;
      const dist = Math.hypot(p.x - pos[0], p.z - pos[2]);
      if (dist < PICKUP_DISTANCE) {
        onCollectBall(id);
      }
    }
  });

  return null;
}
