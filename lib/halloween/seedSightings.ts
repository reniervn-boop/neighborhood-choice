import type { HalloweenPhoto } from './photos';

/**
 * Built-in monster sightings that ship with the app.
 *
 * These are the Monster Walk's anchor sightings — the ones that seed the map so
 * it is never empty, and that residents see before anyone has uploaded anything.
 * They live in `public/halloween-sightings/` rather than Firebase Storage, so
 * they need no credentials, survive a Firestore wipe, and work offline.
 *
 * They are merged into every read in `getHalloweenPhotos()`. Because they are
 * not Firestore documents they cannot be deleted through the admin panel — the
 * `builtIn` flag is what the admin UI keys off to hide the delete button.
 *
 * Coordinates are the real SX7 street centroids from OpenStreetMap, so each pin
 * lands on the street named in its image.
 */

/** Ids are stable and prefixed so they can never collide with a Firestore id. */
const ID_PREFIX = 'builtin-';

export const seedSightings: HalloweenPhoto[] = [
  {
    id: `${ID_PREFIX}alien-sundowner-park`,
    filename: 'alien-ufo-sundowner-park.jpg',
    originalName: 'UFO and Aliens.png',
    title: 'Craft over Sundowner Park',
    description:
      'Broad daylight, and three greys were counted moving between the trees by ' +
      'the swings while the craft held station overhead. They made no attempt to ' +
      'hide. Whatever they came to look at, they found it in the park.',
    lat: -26.07685,
    lng: 27.935216,
    monsterType: 'alien',
    uploadedAt: '2026-10-28T16:40:00.000Z',
    imageUrl: '/halloween-sightings/alien-ufo-sundowner-park.jpg',
    builtIn: true,
  },
  {
    id: `${ID_PREFIX}witch-kalsedoon`,
    filename: 'witch-kalsedoon-street.jpg',
    originalName: 'Witch.png',
    title: 'Witch on Kalsedoon Street',
    description:
      'Standing in the middle of the road under a crescent moon, working ' +
      'something blue and turning between her hands. A car came round the bend ' +
      'and she did not move for it. Her power is greatest on Halloween night, ' +
      'when the veil is thinnest — do not accept anything she offers you.',
    lat: -26.075757,
    lng: 27.932602,
    monsterType: 'witch',
    uploadedAt: '2026-10-29T20:15:00.000Z',
    imageUrl: '/halloween-sightings/witch-kalsedoon-street.jpg',
    builtIn: true,
  },
  {
    id: `${ID_PREFIX}werewolf-honeydew`,
    filename: 'werewolf-honeydew-road.jpg',
    originalName: 'Werewolf.png',
    title: 'Something large on Honeydew Road West',
    description:
      'Caught at the roadside near the farm stall, just outside the streetlight. ' +
      'Too big for a dog and standing wrong. The photographer did not stop to get ' +
      'a second frame, which was the correct decision.',
    lat: -26.078073,
    lng: 27.928325,
    monsterType: 'werewolf',
    uploadedAt: '2026-10-30T21:05:00.000Z',
    imageUrl: '/halloween-sightings/werewolf-honeydew-road.jpg',
    builtIn: true,
  },
  {
    id: `${ID_PREFIX}tokoloshe-kyanite`,
    filename: 'tokoloshe-kyanite-street.jpg',
    originalName: 'Tokoloshe.png',
    title: 'Three Tokoloshe in Kyanite Street',
    description:
      'Sitting in the middle of the road playing a game with stones and stolen ' +
      'garden ornaments. Note the red eyes — the only reliable way to spot one ' +
      'before it swallows its pebble and disappears. Raise your bed on bricks ' +
      'tonight.',
    lat: -26.076651,
    lng: 27.93199,
    monsterType: 'tokoloshe',
    uploadedAt: '2026-10-31T22:30:00.000Z',
    imageUrl: '/halloween-sightings/tokoloshe-kyanite-street.jpg',
    builtIn: true,
  },
];

export function isBuiltInSighting(id: string): boolean {
  return id.startsWith(ID_PREFIX);
}
