'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import AvatarModel from '@/components/AvatarModel';
import { CharacterAppearance } from '@/lib/types';
import { useMovementControls } from '@/lib/useKeyboardControls';
import { WORLD_RADIUS } from '@/lib/data/world';

const SPEED = 6;

interface PlayerControllerProps {
  appearance: CharacterAppearance;
  positionRef: React.MutableRefObject<THREE.Vector3>;
  disabled: boolean;
}

export default function PlayerController({ appearance, positionRef, disabled }: PlayerControllerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const movement = useMovementControls();
  const facing = useRef(Math.PI);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!disabled) {
      let dx = 0;
      let dz = 0;
      if (movement.current.forward) dz -= 1;
      if (movement.current.backward) dz += 1;
      if (movement.current.left) dx -= 1;
      if (movement.current.right) dx += 1;

      const len = Math.hypot(dx, dz);
      if (len > 0) {
        dx /= len;
        dz /= len;
        positionRef.current.x += dx * SPEED * delta;
        positionRef.current.z += dz * SPEED * delta;

        const dist = Math.hypot(positionRef.current.x, positionRef.current.z);
        const maxDist = WORLD_RADIUS - 0.5;
        if (dist > maxDist) {
          const scale = maxDist / dist;
          positionRef.current.x *= scale;
          positionRef.current.z *= scale;
        }

        facing.current = Math.atan2(dx, dz);
      }
    }

    groupRef.current.position.set(positionRef.current.x, 0, positionRef.current.z);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, facing.current, 0.2);
  });

  return (
    <group ref={groupRef}>
      <AvatarModel appearance={appearance} bounceSpeed={1} />
    </group>
  );
}
