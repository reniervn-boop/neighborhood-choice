import { ZONES, WORLD_RADIUS } from '@/lib/data/world';

export default function Ground() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.01, 0]}>
        <circleGeometry args={[WORLD_RADIUS, 48]} />
        <meshStandardMaterial color="#191225" />
      </mesh>

      {ZONES.map((zone) => (
        <mesh
          key={zone.id}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[zone.center[0], 0, zone.center[1]]}
          receiveShadow
        >
          <circleGeometry args={[zone.radius, 32]} />
          <meshStandardMaterial color={zone.color} />
        </mesh>
      ))}

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[WORLD_RADIUS - 0.4, WORLD_RADIUS, 64]} />
        <meshStandardMaterial color="#ff5d8f" emissive="#ff5d8f" emissiveIntensity={0.4} />
      </mesh>
    </group>
  );
}
