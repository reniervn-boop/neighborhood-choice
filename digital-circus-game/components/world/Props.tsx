export default function Props() {
  return (
    <group>
      {/* Big top tent roof over the hub */}
      <mesh position={[0, 4, -1]}>
        <coneGeometry args={[6, 6, 16]} />
        <meshStandardMaterial color="#ff2d78" wireframe />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(angle) * 6, 0.6, Math.sin(angle) * 6 - 1]}>
            <cylinderGeometry args={[0.12, 0.12, 1.2, 8]} />
            <meshStandardMaterial color="#ffd93d" />
          </mesh>
        );
      })}

      {/* Junkyard scrap */}
      {[
        [12, 0.4, 2],
        [16, 0.5, -1],
        [11, 0.3, -4],
        [17, 0.6, 3],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[0, i, 0]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <meshStandardMaterial color="#5c5040" />
        </mesh>
      ))}

      {/* Meadow balloons */}
      {[
        [-17, 1.8, -2],
        [-11, 2.1, 1],
        [-15, 1.6, 5],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color={['#ff8c42', '#6bcf7f', '#4dd0e1'][i]} />
        </mesh>
      ))}

      {/* Nero's book stacks */}
      {[
        [3, 0.3, -19],
        [-3, 0.5, -20],
        [2, 0.7, -22],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <boxGeometry args={[1, pos[1] * 1.4, 0.8]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
      ))}
    </group>
  );
}
