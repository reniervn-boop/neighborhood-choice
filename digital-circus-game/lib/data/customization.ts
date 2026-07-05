import { Accessory, EyeStyle, HeadShape } from '@/lib/types';

export const BODY_COLORS = [
  '#ff5d8f', '#ff8c42', '#ffd93d', '#6bcf7f',
  '#4dd0e1', '#5c7cfa', '#b088f9', '#ff6b6b',
];

export const ACCENT_COLORS = [
  '#ffffff', '#2b2d42', '#ffd93d', '#00e5ff',
  '#ff2d78', '#7effb2', '#c77dff', '#0a0a0a',
];

export const HEAD_SHAPES: { value: HeadShape; label: string }[] = [
  { value: 'round', label: 'Round' },
  { value: 'square', label: 'Square' },
  { value: 'diamond', label: 'Diamond' },
  { value: 'cone', label: 'Cone' },
];

export const EYE_STYLES: { value: EyeStyle; label: string }[] = [
  { value: 'sparkle', label: 'Sparkle' },
  { value: 'sleepy', label: 'Sleepy' },
  { value: 'wide', label: 'Wide' },
  { value: 'happy', label: 'Happy' },
];

export const ACCESSORIES: { value: Accessory; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'hat', label: 'Party Hat' },
  { value: 'bowtie', label: 'Bowtie' },
  { value: 'antenna', label: 'Antenna' },
];
