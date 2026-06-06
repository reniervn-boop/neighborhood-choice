export interface HalloweenMonster {
  id: string;
  slug: string;
  name: string;
  origin: string;
  category: 'spirit' | 'shapeshifter' | 'undead' | 'alien' | 'humanoid' | 'demon' | 'mythical';
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  description: string;
  abilities: string[];
  weaknesses: string[];
  howToHandle: string;
  emoji: string;
  accentColor: string;
}

export const monsters: HalloweenMonster[] = [
  {
    id: '1',
    slug: 'tokoloshe',
    name: 'Tokoloshe',
    origin: 'Zulu & Xhosa mythology, Southern Africa',
    category: 'demon',
    dangerLevel: 4,
    description:
      'The Tokoloshe is a small, mischievous water sprite from Southern African mythology. It can make itself invisible by swallowing a pebble and is said to be summoned by witchdoctors to do their bidding. It enters homes at night to terrorise sleepers, particularly targeting children.',
    abilities: [
      'Complete invisibility by swallowing a pebble',
      'Superhuman strength for its small size',
      'Causes nightmares and sleep paralysis',
      'Can spread disease',
      'Moves silently and rapidly',
    ],
    weaknesses: [
      'Salt circles around the bed',
      'Raised sleeping surfaces (beds on bricks)',
      'Holy water or blessed objects',
      'Speaking its name aloud three times',
      'Burning impepho (African incense)',
    ],
    howToHandle:
      'Raise your bed on bricks or high blocks so it cannot reach you. Sprinkle coarse salt around your room and bed. Burn impepho (African sage/incense) before sleeping. If you see one, do not show fear — look it directly in the eye and speak its name loudly. Consult a traditional healer (Sangoma) for persistent hauntings.',
    emoji: '👁️',
    accentColor: '#8B0000',
  },
  {
    id: '2',
    slug: 'werewolf',
    name: 'Werewolf',
    origin: 'European folklore (widespread)',
    category: 'shapeshifter',
    dangerLevel: 5,
    description:
      'A human cursed to transform into a savage wolf-human hybrid under the full moon. Werewolves retain no human memory during transformation and attack anything in their path. The curse spreads through bite wounds, and even a scratch can begin the infection during a full moon.',
    abilities: [
      'Transforms fully during full moon',
      'Superhuman strength, speed, and endurance',
      'Accelerated healing (except silver)',
      'Heightened senses — can track by scent',
      'Spreads lycanthropy through bites',
    ],
    weaknesses: [
      'Silver — bullets, blades, or any silver object',
      'Wolfsbane (Aconitum) repels and weakens',
      'Removing the curse through ritual',
      'Fire causes lasting damage',
      'Drowning in running water',
    ],
    howToHandle:
      'Stay indoors and lock all doors on full moon nights. Carry silver jewellery as a deterrent. If confronted, throw wolfsbane and run — do NOT fight. Silver bullets are the only reliable way to stop one. If scratched or bitten, seek a Sangoma or specialist immediately before the next full moon.',
    emoji: '🐺',
    accentColor: '#4a4a6a',
  },
  {
    id: '3',
    slug: 'alien',
    name: 'The Alien',
    origin: 'Unknown — reported worldwide',
    category: 'alien',
    dangerLevel: 3,
    description:
      'Extraterrestrial beings that have been visiting Earth for millennia. Their intentions range from scientific observation to abduction. Most sightings describe grey-skinned, large-eyed beings, though others report reptilian or insectoid forms. They possess technology far beyond human comprehension.',
    abilities: [
      'Advanced technology and weaponry',
      'Telepathic communication',
      'Memory erasure devices',
      'Stealth cloaking systems',
      'Abduction capability',
    ],
    weaknesses: [
      'Water (certain species are vulnerable)',
      'Common Earth bacteria and viruses',
      'Specific radio frequencies disrupt their systems',
      'Bright light disorients some species',
      'Electromagnetic pulses (EMP)',
    ],
    howToHandle:
      'Do not shine bright lights at them — it is perceived as aggression. Avoid making sudden movements. Do not attempt to communicate unless they initiate. Keep a tin foil hat handy (half-joking). If abducted, try to observe details for reporting later. Stay calm — panicking triggers their defence mechanisms.',
    emoji: '👽',
    accentColor: '#006400',
  },
  {
    id: '4',
    slug: 'ghost',
    name: 'Ghost',
    origin: 'Universal — all cultures worldwide',
    category: 'spirit',
    dangerLevel: 2,
    description:
      'The spirit of a deceased person that has not moved on to the afterlife. Ghosts are often bound to a place, object, or unresolved matter from their living years. While most are harmless, poltergeists and vengeful spirits can cause physical harm. They are drawn to strong emotions and unfinished business.',
    abilities: [
      'Passing through solid objects',
      'Invisibility and manifestation at will',
      'Moving or throwing physical objects',
      'Appearing in dreams',
      'Dropping room temperature significantly',
    ],
    weaknesses: [
      'Salt — creates barriers they cannot cross',
      'Iron repels and traps spirits',
      'Sage smudging cleanses an area',
      'Holy water and blessed objects',
      'Resolving their unfinished business sets them free',
    ],
    howToHandle:
      'Stay calm — fear amplifies their power. Lay a thick salt line across doorways and windowsills. Burn white sage to cleanse the space. Speak to the ghost respectfully; ask what it needs to move on. If aggressive, iron objects can repel it. Contact a spiritual medium or religious leader for persistent hauntings.',
    emoji: '👻',
    accentColor: '#b0b0cc',
  },
  {
    id: '5',
    slug: 'vampire',
    name: 'Vampire',
    origin: 'Eastern European folklore (widespread globally)',
    category: 'undead',
    dangerLevel: 5,
    description:
      'The undead rise from graves to feed on the blood of the living. Vampires are immortal, supernaturally strong, and centuries-old can command the weather and lesser creatures. The critical rule: a vampire CANNOT enter a home uninvited. This is their greatest limitation and your greatest protection.',
    abilities: [
      'Immortality and rapid regeneration',
      'Superhuman strength and speed',
      'Hypnotic mind control (gaze)',
      'Transformation into bats, wolves, or mist',
      'Spreading vampirism through bites',
    ],
    weaknesses: [
      'SUNLIGHT — destroys instantly',
      'Garlic — repels and burns on contact',
      'Cannot enter without explicit invitation',
      'Wooden stake through the heart',
      'Running water — cannot cross',
      'Silver and holy symbols',
    ],
    howToHandle:
      'NEVER invite a stranger into your home — this is the most critical rule. Hang garlic at all entry points. Keep curtains open during the day. Carry a wooden stake and holy water. If confronted at night, hold up a crucifix or holy symbol and back away slowly toward running water. Do not look them in the eyes.',
    emoji: '🧛',
    accentColor: '#8B0000',
  },
  {
    id: '6',
    slug: 'witch',
    name: 'Witch',
    origin: 'Global — all major folklore traditions',
    category: 'humanoid',
    dangerLevel: 3,
    description:
      'A practitioner of magic who has made a pact with dark forces. Unlike popular belief, witches appear completely normal — your neighbour could be one. They can cast hexes, brew potions, and commune with spirits. Their power is greatest on Halloween night, when the veil between worlds is thinnest.',
    abilities: [
      'Casting powerful hexes and curses',
      'Brewing potions with magical effects',
      'Divination and seeing the future',
      'Familiar spirits (black cats, ravens, toads)',
      'Weather manipulation',
    ],
    weaknesses: [
      'Iron — disrupts their magic',
      'Running water — curses cannot cross it',
      'Rowan wood offers protection',
      'Salt circles block their magic',
      "Saying \"I revoke your power\" with belief",
    ],
    howToHandle:
      "Do not accept food, drinks, or gifts from suspicious strangers on Halloween night. Iron horseshoes above your door repel them. If hexed, find a counter-curse or opposing practitioner. Salt your doorsteps. Rowan wood worn around the neck protects against bewitching. Stay in large groups — witches prefer isolated targets.",
    emoji: '🧙',
    accentColor: '#4B0082',
  },
  {
    id: '7',
    slug: 'killer-clown',
    name: 'Killer Clown',
    origin: 'Modern urban legend — USA, spreading globally',
    category: 'humanoid',
    dangerLevel: 4,
    description:
      'The most sinister humanoid threat. Killer Clowns hide behind greasepaint and costumes, lurking in storm drains, dark parks, and the shadows at events. Unlike supernatural creatures, they are disturbingly human — which makes them harder to detect. They are drawn to isolated children and stragglers at the back of groups.',
    abilities: [
      'Blending into Halloween crowds undetected',
      'Psychological terror and manipulation',
      'Concealed weapons inside props',
      'Using balloons and candy as lures',
      'Complete disappearance into crowds',
    ],
    weaknesses: [
      'Bright lights — expose their true appearance',
      'Large crowds — they avoid witnesses',
      'Noise and attention — they flee from scenes',
      'Coulrophobia is contagious (warn others)',
      'Phone cameras — document everything',
    ],
    howToHandle:
      'NEVER leave children unattended. Walk in groups — never at the back alone. If you see one acting suspiciously, make noise and alert others immediately. Do not follow balloons, candy trails, or invitations into dark areas. Call for help loudly. Film them if safe to do so. Trust your instincts — if something feels wrong, run.',
    emoji: '🤡',
    accentColor: '#cc0000',
  },
  {
    id: '8',
    slug: 'zombie',
    name: 'Zombie',
    origin: 'Haitian Vodou, popularised globally',
    category: 'undead',
    dangerLevel: 3,
    description:
      'Reanimated corpses driven by a single instinct: consumption. Individually, a zombie is slow and manageable. The danger lies in the horde — once a few emerge, hundreds follow. The infection spreads through bites, and a bitten person turns within hours. They are attracted to noise, light, and the scent of the living.',
    abilities: [
      'No pain response — keep moving when injured',
      'Infection through bites',
      'Strength in overwhelming numbers',
      'Attracted to sound and light',
      'Cannot be reasoned with',
    ],
    weaknesses: [
      'Destroy the brain — only reliable kill method',
      'Fire — effective but attracts more',
      'They are slow — can be easily outrun',
      'Poor coordination — obstacles stop them',
      'Extremely low intelligence',
    ],
    howToHandle:
      'Do not run if you can walk quietly — noise attracts more. Stay elevated (rooftops, raised structures). Aim only for the head — any other hit is useless. Move in small, quiet groups. Do not try to save someone who has been bitten — it is too late. Conserve energy and supplies. Stay away from large population areas.',
    emoji: '🧟',
    accentColor: '#3d5c2d',
  },
  {
    id: '9',
    slug: 'banshee',
    name: 'Banshee',
    origin: 'Irish & Scottish Gaelic folklore',
    category: 'spirit',
    dangerLevel: 2,
    description:
      "The Banshee is a female spirit whose mournful wailing is an omen of death. She does not cause death — she announces it. Often seen as an old woman or beautiful young woman, always dressed in white or grey. If you hear her wail, a family member's death is imminent. Hearing it directly overhead means the death is yours.",
    abilities: [
      'Her wail causes despair and madness',
      'Foreknowledge of impending deaths',
      'Invisibility to those not targeted',
      'Her presence chills the air',
      'Can appear as multiple forms',
    ],
    weaknesses: [
      'Earwax from a dead person (traditional)',
      'Iron placed in her path',
      'Respectfully acknowledging her — she is a messenger',
      'Asking her to name who she mourns for',
      'She cannot be killed, only appeased',
    ],
    howToHandle:
      'Do not ignore her wail — it is a warning, not a threat. Protect your ears to avoid madness. Light candles for the person she mourns. Speak to her respectfully if she appears — ask "Who do you mourn?" She may answer, giving you time to say goodbye. Do not try to flee or fight — she means you no harm unless provoked. Her grief is genuine.',
    emoji: '💀',
    accentColor: '#6b8cad',
  },
  {
    id: '10',
    slug: 'wendigo',
    name: 'Wendigo',
    origin: 'Algonquian First Nations mythology, North America',
    category: 'demon',
    dangerLevel: 5,
    description:
      'A towering, emaciated demon of the winter forest. The Wendigo is both a monster and a curse — any human who eats human flesh in desperation risks becoming one. It is always hungry, never satisfied, growing larger with each meal yet remaining forever starving. It moves through frozen forests at supernatural speed, leaving no tracks.',
    abilities: [
      'Supernatural speed through forests',
      'Can mimic human voices to lure victims',
      'Immunity to cold and freezing',
      'Grows larger with every meal (yet stays hungry)',
      'Induces "Wendigo psychosis" in nearby humans',
    ],
    weaknesses: [
      'Fire — its greatest weakness',
      'Silver weapons cause lasting harm',
      'Cedar smoke disrupts its senses',
      'Burning its heart destroys it permanently',
      'It cannot cross fire lines',
    ],
    howToHandle:
      'Never show fear — it feeds on terror. Travel in groups in wooded areas at night. Burn cedar wood to mask your scent and confuse it. Never, under ANY circumstances, eat human flesh — this is how the curse spreads. If stalked, make a ring of fire immediately. Call it by name to draw it out of hiding. Its heart must be burned to end it permanently.',
    emoji: '🌲',
    accentColor: '#1a3a1a',
  },
];

export function getMonsterBySlug(slug: string): HalloweenMonster | undefined {
  return monsters.find((m) => m.slug === slug);
}

export function getMonsterEmoji(monsterType: string): string {
  const monster = monsters.find(
    (m) => m.slug === monsterType || m.name.toLowerCase() === monsterType.toLowerCase()
  );
  return monster?.emoji ?? '📍';
}

export const MONSTER_CATEGORIES = [
  { value: 'all', label: 'All Monsters' },
  { value: 'spirit', label: 'Spirits' },
  { value: 'shapeshifter', label: 'Shapeshifters' },
  { value: 'undead', label: 'Undead' },
  { value: 'alien', label: 'Aliens' },
  { value: 'humanoid', label: 'Humanoids' },
  { value: 'demon', label: 'Demons' },
  { value: 'mythical', label: 'Mythical' },
];
