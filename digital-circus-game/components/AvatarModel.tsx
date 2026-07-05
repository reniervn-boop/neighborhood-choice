'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CharacterAppearance } from '@/lib/types';

interface AvatarModelProps {
  appearance: CharacterAppearance;
  bounceSpeed?: number;
  scale?: number;
}

function HeadGeometry({ shape }: { shape: CharacterAppearance['headShape'] }) {
  switch (shape) {
    case 'square':
      return <boxGeometry args={[0.9, 0.9, 0.9]} />;
    case 'diamond':
      return <octahedronGeometry args={[0.65]} />;
    case 'cone':
      return <coneGeometry args={[0.6, 1, 16]} />;
    case 'round':
    default:
      return <sphereGeometry args={[0.55, 20, 20]} />;
  }
}

function Eyes({ style, accentColor }: { style: CharacterAppearance['eyeStyle']; accentColor: string }) {
  const config = {
    sparkle: { radius: 0.09, color: accentColor, emissive: true, scaleY: 1 },
    sleepy: { radius: 0.09, color: '#111111', emissive: false, scaleY: 0.35 },
    wide: { radius: 0.13, color: '#111111', emissive: false, scaleY: 1.2 },
    happy: { radius: 0.07, color: '#111111', emissive: false, scaleY: 1 },
  }[style];

  return (
    <group position={[0, 0.05, 0.45]}>
      {[-0.18, 0.18].map((x) => (
        <mesh key={x} position={[x, 0, 0]} scale={[1, config.scaleY, 1]}>
          <sphereGeometry args={[config.radius, 12, 12]} />
          <meshStandardMaterial
            color={config.color}
            emissive={config.emissive ? config.color : '#000000'}
            emissiveIntensity={config.emissive ? 1.2 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

function Accessory({
  type,
  accentColor,
  headOffset,
}: {
  type: CharacterAppearance['accessory'];
  accentColor: string;
  headOffset: number;
}) {
  if (type === 'hat') {
    return (
      <mesh position={[0, headOffset + 0.55, 0]}>
        <coneGeometry args={[0.35, 0.6, 12]} />
        <meshStandardMaterial color={accentColor} />
      </mesh>
    );
  }
  if (type === 'antenna') {
    return (
      <group position={[0, headOffset + 0.4, 0]}>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color={accentColor} emissive={accentColor} emissiveIntensity={0.8} />
        </mesh>
      </group>
    );
  }
  if (type === 'bowtie') {
    return (
      <group position={[0, 0.75, 0.35]}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.14, 0.22, 4]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>
        <mesh rotation={[0, Math.PI, Math.PI / 2]} position={[0, 0, 0]}>
          <coneGeometry args={[0.14, 0.22, 4]} />
          <meshStandardMaterial color={accentColor} />
        </mesh>
      </group>
    );
  }
  return null;
}

export default function AvatarModel({ appearance, bounceSpeed = 1, scale = 1 }: AvatarModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const headY = 1.55;

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 2 * bounceSpeed) * 0.05;
  });

  return (
    <group scale={scale}>
      <group ref={groupRef}>
        {/* body */}
        <mesh position={[0, 0.85, 0]}>
          <capsuleGeometry args={[0.42, 0.7, 4, 12]} />
          <meshStandardMaterial color={appearance.bodyColor} />
        </mesh>

        {/* head */}
        <group position={[0, headY, 0]}>
          <mesh>
            <HeadGeometry shape={appearance.headShape} />
            <meshStandardMaterial color={appearance.bodyColor} />
          </mesh>
          <Eyes style={appearance.eyeStyle} accentColor={appearance.accentColor} />
        </group>

        <Accessory type={appearance.accessory} accentColor={appearance.accentColor} headOffset={headY} />
      </group>
    </group>
  );
}
