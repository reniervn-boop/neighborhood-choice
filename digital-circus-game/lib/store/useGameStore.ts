import { create } from 'zustand';
import { CharacterData, GameSave, QuestProgressState, RelationshipState, ToneKey } from '@/lib/types';
import { NPCS, getNPC } from '@/lib/data/npcs';
import { QUESTS, getQuest } from '@/lib/data/quests';
import { clampRelationship, tierForScore } from '@/lib/relationship';
import { resolveUid } from '@/lib/firebase';
import { loadGame, saveGame } from '@/lib/persistence';

export type GamePhase = 'loading' | 'create' | 'playing';

function defaultRelationships(): RelationshipState {
  const rel: RelationshipState = {};
  for (const npc of NPCS) rel[npc.id] = 0;
  return rel;
}

function defaultQuests(): QuestProgressState {
  const q: QuestProgressState = {};
  for (const quest of QUESTS) {
    q[quest.id] = { status: 'unstarted', collected: quest.collectibleIds ? [] : undefined };
  }
  return q;
}

interface GameStoreState {
  phase: GamePhase;
  uid: string | null;
  synced: boolean;
  character: CharacterData | null;
  relationships: RelationshipState;
  quests: QuestProgressState;
  activeNpcId: string | null;
  activeMinigame: boolean;
  celebration: boolean;

  init: () => Promise<void>;
  createCharacter: (data: Omit<CharacterData, 'createdAt'>) => Promise<void>;
  openDialogue: (npcId: string) => void;
  closeDialogue: () => void;
  applyTone: (npcId: string, tone: ToneKey) => void;
  startQuest: (questId: string) => void;
  collectBall: (ballId: string) => void;
  turnInQuest: (questId: string) => void;
  startMinigame: () => void;
  finishMinigame: (success: boolean) => void;
  answerRiddle: (questId: string, index: number) => boolean;
  dismissCelebration: () => void;
}

function persist(state: GameStoreState) {
  if (!state.uid) return;
  const save: GameSave = {
    character: state.character,
    relationships: state.relationships,
    quests: state.quests,
  };
  void saveGame(state.uid, state.synced, save);
}

export const useGameStore = create<GameStoreState>((set, get) => ({
  phase: 'loading',
  uid: null,
  synced: false,
  character: null,
  relationships: defaultRelationships(),
  quests: defaultQuests(),
  activeNpcId: null,
  activeMinigame: false,
  celebration: false,

  init: async () => {
    const { uid, synced } = await resolveUid();
    const save = await loadGame(uid, synced);
    set({
      uid,
      synced,
      character: save?.character ?? null,
      relationships: save?.relationships ?? defaultRelationships(),
      quests: save?.quests ?? defaultQuests(),
      phase: save?.character ? 'playing' : 'create',
    });
  },

  createCharacter: async (data) => {
    const character: CharacterData = { ...data, createdAt: Date.now() };
    set({ character, phase: 'playing' });
    persist(get());
  },

  openDialogue: (npcId) => set({ activeNpcId: npcId }),
  closeDialogue: () => set({ activeNpcId: null }),

  applyTone: (npcId, tone) => {
    const npc = getNPC(npcId);
    const delta = npc.toneDeltas[tone];
    set((state) => ({
      relationships: {
        ...state.relationships,
        [npcId]: clampRelationship((state.relationships[npcId] ?? 0) + delta),
      },
    }));
    persist(get());
  },

  startQuest: (questId) => {
    set((state) => ({
      quests: { ...state.quests, [questId]: { ...state.quests[questId], status: 'active' } },
    }));
    persist(get());
  },

  collectBall: (ballId) => {
    const quest = getQuest('bibbo_balls');
    set((state) => {
      const progress = state.quests[quest.id];
      if (progress.status !== 'active') return state;
      if (progress.collected?.includes(ballId)) return state;
      const collected = [...(progress.collected ?? []), ballId];
      const status = collected.length >= (quest.collectibleIds?.length ?? 0) ? 'ready' : 'active';
      return {
        quests: { ...state.quests, [quest.id]: { status, collected } },
      };
    });
    persist(get());
  },

  turnInQuest: (questId) => {
    const quest = getQuest(questId);
    set((state) => ({
      quests: { ...state.quests, [questId]: { ...state.quests[questId], status: 'complete' } },
      relationships: {
        ...state.relationships,
        [quest.npcId]: clampRelationship(
          (state.relationships[quest.npcId] ?? 0) + quest.relationshipReward,
        ),
      },
    }));
    persist(get());

    if (questId === 'glitchy_orientation') {
      set({ celebration: true });
    }
  },

  startMinigame: () => set({ activeMinigame: true }),
  finishMinigame: (success) => {
    set({ activeMinigame: false });
    if (success) {
      set((state) => ({
        quests: { ...state.quests, chip_beat: { ...state.quests.chip_beat, status: 'ready' } },
      }));
      persist(get());
    }
  },

  answerRiddle: (questId, index) => {
    const quest = getQuest(questId);
    const correct = quest.riddle?.correctIndex === index;
    if (correct) {
      set((state) => ({
        quests: { ...state.quests, [questId]: { ...state.quests[questId], status: 'ready' } },
      }));
      persist(get());
    }
    return correct;
  },

  dismissCelebration: () => set({ celebration: false }),
}));

export function friendlyOrBetterCount(relationships: RelationshipState, excludeNpcId: string): number {
  return Object.entries(relationships).filter(
    ([id, score]) => id !== excludeNpcId && (tierForScore(score) === 'friendly' || tierForScore(score) === 'beloved'),
  ).length;
}
