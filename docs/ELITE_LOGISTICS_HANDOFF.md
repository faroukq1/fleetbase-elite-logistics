# Elite Logistics — Arabic i18n + Green Rebrand Handoff

White-labeled Fleetbase console. This doc = state of the Arabic localization + green
brand rebrand + auth redesign so a fresh session can continue without re-deriving.

Branch: **`feat/arabic-localization`** (pushed to `origin` = `github.com/faroukq1/fleetbase-elite-logistics`).

---

## 1. How the app runs (critical)

- Console (Ember) lives in `console/`. It runs **only via Docker** — `fleetbase-elite-logistics-console-1`
  serves `:4200` as a **baked nginx image** built from `console/Dockerfile` (`ember build` at image-build
  time). It is **NOT** hot-reload `ember serve`.
- **To see any change:**
  ```bash
  cd /home/farouk/files/fleetbase-elite-logistics
  docker compose build console && docker compose up -d console
  ```
  - Build takes ~5-9 min. `ember build` step prints repeated non-fatal `unexpectedly found "! ~"` warnings — ignore.
  - Run builds **one at a time**. Two concurrent `docker compose build` spiked memory → OOM-killed MySQL/API →
    `:8000` returned 502 with no CORS header → blank login page. (Recovered by killing the extra build + waiting.)
  - Start builds with the Bash tool's `run_in_background: true`, NOT shell `&` (the `&` child dies when the shell exits).
  - After build, if `docker compose up -d console` shows "Running" (not "Recreated"), force it:
    `docker compose up -d --force-recreate console`.
- Verify a change reached the browser by grepping the **served** bundle (note the `@fleetbase/` subdir):
  ```bash
  docker exec fleetbase-elite-logistics-console-1 sh -c "grep -rl 'ARABIC_STRING' /usr/share/nginx/html/assets/ /usr/share/nginx/html/engines-dist/"
  ```
  App code = `assets/@fleetbase/console.js|css`. Engine code = `engines-dist/@fleetbase/<engine>/assets/engine*.js`.
  Translations compile into `*-vendor.js` per engine + main `vendor.js`.

## 2. i18n architecture

- `ember-intl` merges `console/translations/*.yaml` (app) with each engine's
  `node_modules/@fleetbase/*-engine/translations/*.yaml`. **All merged into one shared intl**, so a key defined
  in app translations resolves for a `{{t}}` call inside any engine.
- Locales locked to `en-us` + `ar-ae` via `console/app/services/language.js` (also sets `<html dir>` for RTL).
- **Gotcha:** `console/ember-cli-build.js` has `intl: { silent: true }` — a YAML **parse error in any translation
  file silently drops that whole file's locale** (falls back to English), no build warning. Always validate edits
  with the build's own parser (js-yaml), not pyyaml:
  ```bash
  JSY=$(find console/node_modules/.pnpm -maxdepth 5 -type f -path '*js-yaml/index.js' | head -1)
  node -e "const y=require('...'+'/'+'$JSY'),fs=require('fs'); y.load(fs.readFileSync('FILE','utf8'))"
  ```
- registry-bridge's `ar-ae.yml` does NOT compile (its ar file is `.yml`; en/vi are `.yaml`). Its keys were added
  to **console** translations instead (which compile).

## 3. Persistence — pnpm patches (engine edits are gitignored)

`console/node_modules` is gitignored, so engine edits made there vanish on `pnpm install`. All engine edits are
persisted as **pnpm patches** in `console/patches/` referenced from `patchedDependencies:` in
`console/pnpm-workspace.yaml` (pnpm 11). `console/Dockerfile` was edited to `COPY patches ./patches` before
install and changed `--frozen-lockfile` → `--no-frozen-lockfile` (committed lockfile doesn't record the patches).

Patched engines: **storefront@0.4.16, fleetops@0.6.57, iam@0.1.10, dev@0.2.14, ledger@0.0.7,
registry-bridge@0.1.9, ember-ui@0.3.41**.

**To edit an engine + re-persist:**
```bash
cd console
# 1. edit the file directly in node_modules/@fleetbase/<engine>/...
# 2. regenerate the patch:
OUT=$(pnpm patch @fleetbase/<engine>@<ver> 2>&1); PD=$(echo "$OUT" | grep -oP '/home/\S+<engine>@<ver>' | head -1)
cp <edited files> "$PD/<same relative path>"   # copy your edited files onto the pristine patch dir
pnpm patch-commit "$PD"
```
App files under `console/app/**` and `console/translations/**` are git-tracked — edit directly, no patch needed.

## 4. The dashboard-widget translation quirk (important pattern)

Engine dashboards render KPI tiles + charts via a lazy-loaded engine instance (`LazyEngineComponent`/gridstack).
In that context the **`{{t}}` template helper resolves to en** (stale locale), but **`this.intl.t()` in a JS
getter resolves ar**. Fix pattern used everywhere:
- Pass `@titleKey="some.key"` (a key string), NOT `@title={{t "..."}}`.
- Inject `@service intl` in the tile/chart component; add `get title(){ return this.args.titleKey ? this.intl.t(this.args.titleKey) : this.args.title; }`.
- Top-level widget **bodies** that use `{{t}}` directly (e.g. revenue-trend.hbs) DO render ar — only nested
  tile/chart **args** need the getter treatment.
- Bug found: `storefront-kpi-tile.js` referenced `this.storefrontDashboard` without `@service` → `undefined.on()`
  threw in the constructor → blanked the whole dashboard (unrecoverable render). Fixed by injecting the service + `?.` guard.

Header/menu labels have the same boot-timing issue → translated **at render** in components:
- Top-nav labels (Fleet-Ops/Storefront/…): `SmartNavMenu::Item` `get displayTitle()` → `header-nav.*` keys.
- User/org dropdown items: `header/dropdown/item.js` `get displayText()` → `user-menu.*` keys.
- Extension launcher cards (titles/descriptions/parent): a new helper **`ember-ui/addon/helpers/localize-label.js`**
  (`{{localize-label text "prefix"}}` → slugifies + looks up `prefix.<slug>`, English fallback) used in
  `smart-nav-menu/dropdown.hbs`. Keys: `nav-card-title.*`, `nav-card-desc.*`, parents reuse `header-nav.*`.
  **Addon helpers need an `app/helpers/<name>.js` re-export** or they don't resolve (`export { default } from '@fleetbase/ember-ui/helpers/localize-label';`).

## 5. What's DONE (translated / restyled)

- **Storefront** — full: sidebar, dashboard (KPI cards + all metric widgets), pages; fixed a broken YAML block.
- **Fleet-Ops** — Arabic loads (fixed unescaped-colon YAML break that silently dropped ALL fleetops ar).
- **Developers (dev-engine)** — dashboard KPI cards + charts; sub-pages (API keys/webhooks/events/sockets/logs)
  already used `{{t}}`.
- **Ledger** — dashboard (KPI cards + metric widgets) AND left **sidebar nav** (Dashboard/Billing/Payments/
  Accounting/Reports/Settings + children) via `intl.t` in the controller's `navigationItems` getter.
- **IAM** — dashboard (KPI cards + footnotes + metric widgets + Quick Actions).
- **Extensions (registry-bridge)** — sidebar nav.
- **Console chrome** — user dropdown, language selector (native names English / العربية), dark-mode toggle,
  header top-nav, extension launcher cards, admin config pages (mail/SMS/filesystem/queue/notification-channels/2FA).
- **Green rebrand** — Tailwind `sky` + `blue` scales → Elite green (`#5DD62C` primary / `#337418` dark). Recolors
  buttons/links/active-nav/focus everywhere (primary button = `@apply bg-sky-500`, resolved at console build).
  Palette in `console/tailwind.config.js`.
- **Auth redesign** — split-screen (branding panel + green login card): `app/templates/auth.hbs`,
  `auth/login.hbs`, `auth/forgot-password.hbs`, `onboard.hbs`. CSS in `console/app/styles/app.css` (`.elite-auth*`,
  `.elite-login*`). Login form bindings/actions/endpoints untouched. New copy keys under `auth.login.*`
  (log-in, welcome-back, remember-30-days, no-account, contact-admin, logistics-tagline).

Brand palette: `#0F0F0F` `#202020` `#5DD62C` (brand) `#337418` (dark) `#F8F8F8`.

## 6. What's REMAINING

- **Fleet-Ops deep labels** (~1000+ strings) and **customer-portal** (~280) — order/driver/vehicle/route panels
  and forms have many hardcoded English literals in `addon/components/**/*.hbs`. Largest remaining surface.
- **Ledger/other engine page forms** (invoices, reports, etc.) — some hardcoded literals remain.
- **Auth screens not yet restyled**: `auth/reset-password.hbs`, `auth/verification.hbs`, 2FA — still old inner
  card markup (they DO sit inside the new split `auth.hbs` layout).
- **Launcher panel chrome**: "EXTENSIONS" heading, "Search extensions…" placeholder, "Customise navigation",
  pin tooltips — still English.
- Some intentional non-translations kept: SKU, brand/product proper nouns, `https://`, code/algorithm examples.

To find hardcoded English per engine:
```bash
grep -rhoE '@(title|label|placeholder|helpText|subtitle)="[A-Z][^"]*"|>[A-Z][a-zA-Z /]{3,}<' \
  console/node_modules/@fleetbase/fleetops-engine/addon/components 2>/dev/null | grep -vF '{{t' | sort | uniq -c | sort -rn
```

## 7. Git

- Branch `feat/arabic-localization`. Commits `3e27124` → `4fb5a5e` (10 i18n/ui commits) on top of the branding
  commit `839b60f`. All pushed. Open a PR to `main` when ready.
- Also: the pre-existing en-us base is missing `modals.set-password.message` (surfaced by `pnpm lint:intl`) —
  pre-existing bug on the English side, unrelated to Arabic.
