// ─── Character customization ────────────────────────────────────────────────

export type HeadShape = 'round' | 'square' | 'diamond' | 'cone';
export type EyeStyle = 'sparkle' | 'sleepy' | 'wide' | 'happy';
export type Accessory = 'none' | 'hat' | 'bowtie' | 'antenna';

export interface CharacterAppearance {
  bodyColor: string;
  accentColor: string;
  headShape: HeadShape;
  eyeStyle: EyeStyle;
  accessory: Accessory;
}

export interface CharacterData extends CharacterAppearance {
  name: string;
  createdAt: number;
}

// ─── NPC personality & relationships ────────────────────────────────────────

export type ToneKey = 'kind' | 'funny' | 'honest' | 'rude';

export interface ToneDeltas {
  kind: number;
  funny: number;
  honest: number;
  rude: number;
}

export type RelationshipTier = 'hostile' | 'cold' | 'neutral' | 'friendly' | 'beloved';

export interface NPCDefinition {
  id: string;
  name: string;
  title: string;
  bio: string;
  color: string;
  accentColor: string;
  headShape: HeadShape;
  eyeStyle: EyeStyle;
  accessory: Accessory;
  position: [number, number, number];
  toneDeltas: ToneDeltas;
  greetings: Record<RelationshipTier, string[]>;
  reactions: Record<ToneKey, string[]>;
  questId: string;
}

export interface RelationshipState {
  [npcId: string]: number;
}

// ─── Quests ──────────────────────────────────────────────────────────────────

export type QuestStatus = 'unstarted' | 'active' | 'ready' | 'complete';

export type QuestType = 'collect' | 'minigame' | 'riddle' | 'social';

export interface QuestDefinition {
  id: string;
  npcId: string;
  title: string;
  description: string;
  offerText: string;
  turnInText: string;
  completeText: string;
  type: QuestType;
  relationshipReward: number;
  // collect
  collectibleIds?: string[];
  // riddle
  riddle?: {
    question: string;
    options: string[];
    correctIndex: number;
    hint: string;
  };
  // social (Glitchy's main quest)
  requiredFriendlyCount?: number;
}

export interface QuestProgress {
  status: QuestStatus;
  collected?: string[];
}

export type QuestProgressState = Record<string, QuestProgress>;

// ─── Persisted save shape ────────────────────────────────────────────────────

export interface GameSave {
  character: CharacterData | null;
  relationships: RelationshipState;
  quests: QuestProgressState;
}
