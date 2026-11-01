import sponsorData from '../../assets/sponsors.json' with { type: 'json' };

import type { Sponsor, SponsorSpec } from './types';

// Eager so the URLs are plain strings, vite requires this to be literals
const assetModules = import.meta.glob<string>(
  '../../assets/logos/*.{png,webp,jpg,jpeg,avif,svg}',
  { eager: true, query: '?url&no-inline', import: 'default' },
);

// Keys come back as the specifier above, e.g. '../../assets/logos/logo.png'
const urlByFile = new Map<string, string>(
  Object.entries(assetModules).map(([path, url]) => [
    path.slice(path.lastIndexOf('/') + 1),
    url,
  ]),
);

const SPONSOR_SPECS = sponsorData as SponsorSpec[];

export const SPONSOR_INFO: Sponsor[] = SPONSOR_SPECS.flatMap(({ file, cardFile, ...rest }) => {
  const src = urlByFile.get(file);
  const cardSrc = cardFile ? urlByFile.get(cardFile) : undefined;
  return src ? [{ ...rest, src, cardSrc }] : [];
});

if (import.meta.env.DEV) {
  if (urlByFile.size === 0 && SPONSOR_SPECS.length > 0) {
    console.warn(
      'sponsorInfo: nothing matched src/assets/logos/ — is the folder empty, or the glob pattern stale?',
    );
  }

  for (const spec of SPONSOR_SPECS) {
    if (!urlByFile.has(spec.file)) {
      console.warn(
        `sponsors.json: ${spec.id} points at "${spec.file}", which is not in src/assets/logos/ — the sponsor is skipped`,
      );
    }
    if (spec.cardFile && !urlByFile.has(spec.cardFile)) {
      console.warn(
        `sponsors.json: ${spec.id} has cardFile "${spec.cardFile}", which is not in src/assets/logos/ — the card falls back to "${spec.file}"`,
      );
    }
  }

  const claimed = new Set(SPONSOR_SPECS.flatMap((spec) => [spec.file, spec.cardFile ?? spec.file]));
  for (const file of urlByFile.keys()) {
    if (!claimed.has(file)) {
      console.warn(
        `src/assets/logos/${file} has no entry in sponsors.json — it ships in the bundle but never reaches the pit`,
      );
    }
  }
}
