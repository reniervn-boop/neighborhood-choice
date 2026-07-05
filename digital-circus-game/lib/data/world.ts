export const WORLD_RADIUS = 27;

export const ZONES = [
  { id: 'hub', label: 'The Big Top', center: [0, 0] as [number, number], radius: 9, color: '#3a2352' },
  { id: 'meadow', label: "Bibbo's Meadow", center: [-14, 0] as [number, number], radius: 8, color: '#2f4a34' },
  { id: 'junkyard', label: "Chip's Junkyard", center: [14, 0] as [number, number], radius: 8, color: '#3a3428' },
  { id: 'nook', label: "Old Nero's Nook", center: [0, -18] as [number, number], radius: 7, color: '#2a2a44' },
];

export const BALL_POSITIONS: Record<string, [number, number, number]> = {
  ball_1: [-17, 0.35, 3],
  ball_2: [-10, 0.35, 3],
  ball_3: [-14, 0.35, -6],
};
