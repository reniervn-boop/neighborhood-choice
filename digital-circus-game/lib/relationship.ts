import { RelationshipTier } from '@/lib/types';

export const MIN_RELATIONSHIP = -100;
export const MAX_RELATIONSHIP = 100;

export function clampRelationship(score: number): number {
  return Math.max(MIN_RELATIONSHIP, Math.min(MAX_RELATIONSHIP, score));
}

export function tierForScore(score: number): RelationshipTier {
  if (score <= -40) return 'hostile';
  if (score <= -10) return 'cold';
  if (score < 20) return 'neutral';
  if (score < 60) return 'friendly';
  return 'beloved';
}

export const TIER_LABELS: Record<RelationshipTier, string> = {
  hostile: 'Hostile',
  cold: 'Cold',
  neutral: 'Neutral',
  friendly: 'Friendly',
  beloved: 'Beloved',
};

export const TIER_COLORS: Record<RelationshipTier, string> = {
  hostile: '#ff3b3b',
  cold: '#7fa8c9',
  neutral: '#cfd8dc',
  friendly: '#6bcf7f',
  beloved: '#ffd93d',
};
