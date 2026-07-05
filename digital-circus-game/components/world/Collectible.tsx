'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Collectible({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.getElapsedTime() * 2;
    ref.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 3) * 0.1;
  });

  return (
    <mesh ref={ref} position={position}>
      <icosahedronGeometry args={[0.3, 0]} />
      <meshStandardMaterial color="#ffd93d" emissive="#ffd93d" emissiveIntensity={0.5} />
    </mesh>
  );
}
