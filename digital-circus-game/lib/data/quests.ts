import { QuestDefinition } from '@/lib/types';

export const BALL_COLLECTIBLE_IDS = ['ball_1', 'ball_2', 'ball_3'];

export const QUESTS: QuestDefinition[] = [
  {
    id: 'bibbo_balls',
    npcId: 'bibbo',
    title: 'The Lost Juggling Balls',
    description: 'Find the 3 juggling balls scattered around the meadow and bring them back to Bibbo.',
    offerText: "I lost my juggling balls somewhere out there and I'm too dizzy to look! Could you find all 3 for me? Pretty please?",
    turnInText: "You found them?! ALL of them?! You're a lifesaver — here, take this as thanks!",
    completeText: 'Bibbo squeals with joy and gives you a friendship bracelet.',
    type: 'collect',
    relationshipReward: 15,
    collectibleIds: BALL_COLLECTIBLE_IDS,
  },
  {
    id: 'chip_beat',
    npcId: 'chip',
    title: 'Copy the Beat',
    description: "Chip wants to see if you've got rhythm. Repeat the beat pattern he plays.",
    offerText: "Bet you can't even copy a simple beat. Prove me wrong.",
    turnInText: "Not bad. Didn't expect you to actually nail it.",
    completeText: 'Chip nods, almost impressed, and tosses you a scrap-metal medal.',
    type: 'minigame',
    relationshipReward: 15,
  },
  {
    id: 'nero_riddle',
    npcId: 'old_nero',
    title: "The Ringkeeper's Riddle",
    description: 'Answer Old Nero\'s riddle correctly.',
    offerText: 'A riddle, if you dare: "I am always coming but never arrive. I am always performed but never finished. What am I?"',
    turnInText: 'Hm. Sharper than you look. Well answered.',
    completeText: 'Old Nero allows himself the faintest smile.',
    type: 'riddle',
    relationshipReward: 15,
    riddle: {
      question: 'I am always coming but never arrive. I am always performed but never finished. What am I?',
      options: ['The next show', 'A dream', 'Tomorrow', 'A song'],
      correctIndex: 0,
      hint: 'Think about what a circus never stops doing.',
    },
  },
  {
    id: 'glitchy_orientation',
    npcId: 'glitchy',
    title: 'Orientation Complete',
    description: 'Befriend at least 2 other performers to complete your orientation into the Digital Circus.',
    offerText: 'Orientation protocol: earn the trust of at least two fellow performers, then return to me.',
    turnInText: 'Orientation... complete! You are now officially part of the show.',
    completeText: 'The tent lights flicker in celebration. You belong here now.',
    type: 'social',
    relationshipReward: 10,
    requiredFriendlyCount: 2,
  },
];

export function getQuest(id: string): QuestDefinition {
  const quest = QUESTS.find((q) => q.id === id);
  if (!quest) throw new Error(`Unknown quest: ${id}`);
  return quest;
}

export function questForNPC(npcId: string): QuestDefinition {
  const quest = QUESTS.find((q) => q.npcId === npcId);
  if (!quest) throw new Error(`No quest for NPC: ${npcId}`);
  return quest;
}
