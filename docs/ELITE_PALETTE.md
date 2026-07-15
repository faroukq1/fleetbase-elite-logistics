# Elite Logistics — Color Palette & Theme Guide

Single source of truth for brand colors across the console **and all `@fleetbase/*`
engines**. The token layer is **`console/tailwind.config.js`** — every button, link,
nav item, table, input, card and surface in the app resolves its color through
Tailwind utility classes that map to these tokens. There are no per-component hex
codes to maintain; change the config and it propagates everywhere on the next build.

## Palette

| Token            | Hex       | Role                                             |
| ---------------- | --------- | ------------------------------------------------ |
| Primary green    | `#5DD62C` | CTAs, links, active nav, focus rings             |
| Dark green       | `#337418` | Hover / active / secondary accents               |
| Light surface    | `#F8F8F8` | Light-mode page background                        |
| Dark surface     | `#202020` | Dark-mode cards / panels / secondary text        |
| Darkest          | `#0F0F0F` | Dark-mode page bg / primary text                  |

## How theming works here — AUTHORITATIVE config

> **Critical:** `@fleetbase/ember-ui` **owns the Tailwind/PostCSS build**. Its
> `included()` hook assigns `app.options.postcssOptions` outright (see
> `console/ember-cli-build.js` comment). So **`node_modules/@fleetbase/ember-ui/tailwind.config.js`
> is the config that generates every utility class** across the app AND all engines.
> `console/tailwind.config.js` is **inert** for color generation — editing it does
> nothing (this cost the first rebrand attempt; it edited the wrong file).

- **Framework:** Ember + Tailwind CSS. **ember-ui's** Tailwind config is the token system.
- **Dark mode:** `darkMode: ['class', '[data-theme="dark"]']`. The theme service
  stamps `data-theme="dark"` on `<html>`; every `dark:*` utility flips accordingly.
- **Toggle:** present in the header (dark-mode switch).
- **Green primary** propagates via the `sky` + `blue` scales being remapped to green
  **in ember-ui's config** (components use `bg-sky-500`, `text-blue-600`, etc.).
- ember-ui is shipped **precompiled**; changes to its config/styles are persisted as
  a pnpm patch (`console/patches/@fleetbase__ember-ui@0.3.41.patch`) and only take
  effect after `docker compose build console`.

## Named tokens (added)

`tailwind.config.js` now exposes semantic tokens in addition to the remapped scales:

```js
brand:   { 500:'#5dd62c', 700:'#337418', DEFAULT:'#5dd62c', dark:'#337418', ... }
surface: { light:'#f8f8f8', dark:'#202020', darkest:'#0f0f0f' }
```

Use `bg-brand-500`, `text-brand-700`, `bg-surface-dark`, etc. in new code instead of
reaching for `sky`/`blue`.

## Neutral ramp → palette (the dark-mode fix)

All neutral surfaces in the codebase use Tailwind `gray` (no `slate`). The `gray`
ramp is anchored to the palette so ~2000 `dark:bg-gray-*` usages across 845 engine
templates hit the exact brand neutrals — **without editing a single component**:

| Class            | Before (default) | After      | Where it shows                     |
| ---------------- | ---------------- | ---------- | ---------------------------------- |
| `gray-50`        | `#f9fafb`        | `#F8F8F8`  | light page background              |
| `gray-800`       | `#1f2937`        | `#202020`  | dark cards/surfaces (1121 uses)    |
| `gray-900`       | `#111827`        | `#0F0F0F`  | dark page bg + primary text        |
| `gray-700`       | `#374151`        | `#2B2B2B`  | dark inputs/hover/borders          |

Light shades (`gray-100`–`gray-500`) stay neutral, so **light mode is unchanged**
except the page background snapping to `#F8F8F8`.

## Color mapping in practice

**Light mode:** page `#F8F8F8`, cards white/`gray-50`, primary text `#0F0F0F`
(`text-gray-900`), secondary `#202020`/`gray-600`, primary button green + dark text,
hover `#337418`, links green.

**Dark mode:** page `#0F0F0F` (`gray-900`), cards `#202020` (`gray-800`), primary
text `#F8F8F8` (`gray-100`), primary button green, hover `#337418`.

## Accessibility

- Primary green `#5DD62C` on `#0F0F0F` text → contrast ≈ 11:1 ✅ (AAA).
- `#F8F8F8` text on `#202020` → ≈ 13:1 ✅.
- **Green as a text color on white fails AA** — never use `text-brand-500` for body
  text on light surfaces; use it for large/bold accents or put dark text on a green
  fill instead.

## Edge cases

- **Focus rings:** green (`ring`/`focus:ring-*` resolve to the green scale). Auth
  inputs use `box-shadow: 0 0 0 3px rgba(93,214,44,.25)`.
- **Disabled:** handled at component level via `disabled:opacity-*` in `ember-ui`.
- **Transitions:** `app.css` adds a 0.2s bg/border/color transition on common
  surfaces for smooth theme toggling (respects `prefers-reduced-motion`).

## Files changed

- **`@fleetbase/ember-ui/tailwind.config.js`** (via pnpm patch) — `sky`+`blue`→green,
  `gray`→palette ramp, `brand`/`surface` tokens. **The change that actually recolors
  the app** (all utilities across app + engines).
- **`@fleetbase/ember-ui/addon/styles/**`** (via same patch, 20 files, 261 swaps) —
  recolored the hex-baked component CSS (chat, dashboard, smart-nav, date-picker,
  table, modal, input, kanban, tabs…) that Tailwind utilities don't cover. Blue→green,
  default dark grays→`#202020`/`#0F0F0F`, focus-ring rgb→green.
- `console/patches/@fleetbase__ember-ui@0.3.41.patch` — regenerated (32 files: the
  above + 11 pre-existing i18n files preserved).
- `console/app/styles/app.css` — theme-toggle transitions + auth `.elite-*` styles.
- `console/tailwind.config.js` — same tokens for parity/documentation (inert for the
  build, but kept in sync so it's not misleading).
- (prior commits) dark-mode toggle, auth redesign.

## Known residual (phase 2)

- **Engine-baked accents:** each engine (fleetops, storefront, …) ships its own
  precompiled CSS with a few default-blue hex literals (~26 in fleetops). The shared
  utility layer is green, so screens read green; these engine-specific accents need
  the same hex-swap + per-engine pnpm patch when desired.
- ~6 default-blue (`rgb(59,130,246)` at 10-28% opacity) highlight rules come from a
  third-party vendor addon (not `@fleetbase` source); a minor selection highlight.

## Rebuild

```bash
cd /home/farouk/files/fleetbase-elite-logistics
docker compose build console && docker compose up -d --force-recreate console
```
