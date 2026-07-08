# Mobile Layout Issues

Findings from a code review of the current layout/CSS for mobile viewports (~320–420px wide). Ordered roughly by severity/impact.

## 1. Global route padding never shrinks for small screens

`src/App.css:27-37` (`.route-content`) hardcodes `padding-left: 8rem; padding-right: 8rem;` with **no media query** anywhere in the file. Combined with `#root { width: 80% }` in `src/index.css:69`, on a 375px-wide phone the usable content area shrinks to roughly:

```
375px * 0.8 (root width)  = 300px
300px - (128px * 2 padding) = 44px
```

That ~44px column is what every page except `/map` (which explicitly overrides padding to `0` at `src/App.css:46-51`) has to render into. This is the single biggest cause of squeezed/overflowing content on Home, Contact, and Jam.

Note that `Contact.css:4` (`margin: -2rem`) only cancels the *vertical* 2rem padding, not the 8rem horizontal padding — so even the dedicated `.contact-mobile` layout (`src/pages/Contact.css:219-244`) still renders inside ~6rem (96px) of unnecessary horizontal padding per side below the `680px` breakpoint, on top of its own `padding: 0 1.5rem`.

**Fix direction:** make `.route-content` padding responsive (e.g. `clamp()` or a `@media (max-width: 768px)` override dropping it to ~1–1.5rem), and make `#root` width 100% (or close to it) below a breakpoint.

## 2. 3D model canvas uses fixed pixel dimensions

`src/pages/Homepage/HomepageModel.tsx:232-242` sets the `.logo-3d-wrapper` div's size via inline style: `width: 500, height: 300` (px), not a responsive unit. This doesn't shrink on narrow viewports, so combined with issue #1 it forces horizontal overflow on the Home page rather than scaling the 3D scene down to fit.

**Fix direction:** drive the wrapper size from CSS (`width: 100%; max-width: 500px; aspect-ratio: 5/3`) or a resize observer instead of a hardcoded pixel value.

## 3. Key interactions only fire on mouse hover — no touch fallback

Several pieces of content are gated behind `onMouseEnter`/`onMouseMove`/`onMouseLeave`, which never fire from a tap on touch devices:

- **`src/pages/Homepage/HomepageDescription.tsx:80-106`** — the three "Who are we / What do we want / How will we achieve it" panels only reveal their descriptive text on hover (`InteractivePanel`). On mobile, users only ever see the three titles; the actual copy is unreachable.
- **`src/pages/Jam.tsx:365-386`** — `TimelineCard`'s expanding-circle reveal (extra stats) is hover-only. Lower severity since the base card already shows some info, but the "reveal" content is still inaccessible on touch.
- **`src/pages/Map/SchoolMarkers.tsx:70-91,121-123,155-157`** — pin tooltips (club name + school) only show via `handleEnter` on `onMouseEnter`. `onClick`/`handleActivate` fires independently and immediately opens the external link (or shows the "No link yet" toast). On a touch device a tap goes straight to `handleActivate` without ever showing `handleEnter`'s tooltip, so mobile users are sent to an external club link (or a dead-end toast) **without ever seeing which club they tapped**.
- **`src/pages/Homepage/HomepageFace.tsx:26-45`** — the letter-highlight sweep tracks `window` `mousemove`; harmless if it never triggers on touch, but it's dead code/weight on mobile.

**Fix direction:** add `onClick`/`onTouchStart` handling (e.g. tap-to-reveal, tap-to-preview-then-tap-again-to-open for map pins) so touch users can reach the same content.

## 4. Map pin touch targets are too small

`src/pages/Map/SchoolMarkers.tsx:44-49` gives each pin a hit-circle of `r="12"` in an `800`-wide SVG `viewBox` (`Map.tsx:11,120`). On a phone-width map render, 12 SVG units maps to only a few real CSS pixels — far under the ~44px minimum recommended touch target — making it hard to accurately tap individual clubs, especially where pins cluster (e.g. dense regions on the East Coast).

**Fix direction:** scale the hit-circle radius inversely with the map's rendered width (similar to how the pin already compensates for `zoom` via `scale(1/zoom)`), or enforce a minimum on-screen tap radius.

## 5. Overlapping fixed-position UI with no mobile-specific layout

Several independent `position: fixed` elements are placed with hardcoded `rem` offsets and never repositioned/hidden for small screens:

- Hamburger button — top-left (`src/components/Navbar.css:1-6`)
- `GlobalHUD` heading + two paragraphs of instructions — top-right, map page only (`src/GlobalHUD.tsx:18-21`)
- `NavigationArrows` prev/next buttons with text labels — bottom-left/right (`src/components/NavigationArrows.tsx:39,65`)

On a narrow viewport these can crowd the screen edges simultaneously (e.g. `GlobalHUD`'s two-sentence instructional block competing for space with the map itself), and none of them account for mobile browser chrome (iOS Safari's bottom home-indicator area, address bar) since they use fixed `rem` insets rather than `env(safe-area-inset-*)`.

**Fix direction:** add a mobile breakpoint that shortens/hides `GlobalHUD`'s copy, and use `env(safe-area-inset-bottom)`/`env(safe-area-inset-top)` in the fixed offsets.

## 6. Side menu width isn't responsive

`src/components/Navbar.css:97` sets `.side-menu { width: 350px; }` with no `max-width` fallback. On phones narrower than ~390px (e.g. 360px or 320px-wide devices) this is close to or wider than the full viewport, so the open menu can span edge-to-edge or clip slightly rather than leaving a visible margin.

**Fix direction:** `width: min(350px, 85vw);`.

## 7. Global `cursor: none` isn't scoped to non-touch devices

`html, body, * { cursor: none !important; }` is declared in both `index.html:12-18` and `src/index.css:86-90` to support the custom desktop cursor. `CustomCursor.tsx:12-17` correctly disables itself under `pointer: coarse` or `max-width: 768px`, but the blanket CSS rule doesn't share that condition — so on hybrid devices (touch laptops/tablets with an attached mouse/trackpad, or any device between those two breakpoints' edge cases) there is no visible cursor at all, since neither the custom cursor nor the native one renders.

**Fix direction:** wrap the `cursor: none` rule in the same `(pointer: fine) and (min-width: 769px)` condition used by `CustomCursor.tsx`, rather than applying it unconditionally.
