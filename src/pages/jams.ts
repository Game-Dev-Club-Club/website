import jamsData from '../assets/jams.json';

/* ------------------------------------------------------------------
  Data model
  src/assets/jams.json contains the list of jam editions

  Jam status is inferred from the start and end times:
  - 'announced': before `startsAt`, counts down to the jam start, sign-ups open
  - 'in progress': between `startsAt` and `endsAt`, counts down to the deadline
  - 'completed': after `endsAt`, shows final stats

  `stats` optional, fill it in once a jam is finished
  `goal` optional
  `startsAt` and `endsAt` in ISO date format, make sure to add timezone

  Example:
  {
    "id": "gdcc-00",
    "number": 0,
    "title": "Test Jam",
    "theme": "Taking Tests",
    "joined": 40,
    "goal": 40,
    "itchUrl": "https://itch.io/jams",
    "startsAt": "2026-07-13T18:00:00-04:00",
    "endsAt": "2026-07-15T23:59:00-04:00",
    "stats": {
      "participants": 40,
      "submissions": 12,
      "ratings": 88,
      "topGame": "Final Exam Simulator",
      "topAuthor": "someone"
    }
  }
------------------------------------------------------------------- */

export type JamStatus = 'announced' | 'in progress' | 'completed';

export interface JamStats {
  participants: number;
  submissions: number;
  ratings: number;
  topGame: string;
  topAuthor: string;
}

export interface JamEdition {
  id: string;
  number: number;
  title: string;
  theme: string;
  joined: number;
  goal?: number;      // sign-up target, no progress bar shown if null
  itchUrl: string;
  startsAt?: string;  // ISO date the jam opens
  endsAt?: string;    // ISO date the submissions close
  stats?: JamStats;   // stats, only applies to completed editions
}

export const JAM_EDITIONS: JamEdition[] = (jamsData as JamEdition[])
  .slice()
  .sort((a, b) => a.number - b.number);

// returns epoch ms for one of the ISO fields, or null when unset or wrong format
export function jamTime(iso?: string): number | null {
  if (!iso) return null;
  const parsed = new Date(iso).getTime();
  return Number.isNaN(parsed) ? null : parsed;
}

export function getStatus(jam: JamEdition, now: number = Date.now()): JamStatus {
  const starts = jamTime(jam.startsAt);
  const ends = jamTime(jam.endsAt);

  if (ends !== null && now >= ends) return 'completed';
  if (starts !== null && now < starts) return 'announced';
  /* no dates at all — announced, details TBA */
  if (starts === null && ends === null) return 'announced';
  return 'in progress';
}

if (import.meta.env.DEV) {
  for (const jam of JAM_EDITIONS) {
    for (const field of ['startsAt', 'endsAt'] as const) {
      const iso = jam[field];
      if (iso && jamTime(iso) === null) {
        console.warn(
          `jams.json: ${jam.id} has an unreadable ${field} ("${iso}") — expected something like "2026-08-06T12:00:00-04:00"`,
        );
      }
    }
    const starts = jamTime(jam.startsAt);
    const ends = jamTime(jam.endsAt);
    if (starts !== null && ends !== null && ends <= starts) {
      console.warn(`jams.json: ${jam.id} ends before it starts, so it reads as completed`);
    }
  }
}

// Returns when the status will next change for re-rendering
export function nextBoundary(jam: JamEdition, now: number = Date.now()): number | null {
  const upcoming = [jamTime(jam.startsAt), jamTime(jam.endsAt)]
    .filter((t): t is number => t !== null && t > now)
    .sort((a, b) => a - b);
  return upcoming[0] ?? null;
}
