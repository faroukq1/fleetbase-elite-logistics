# Fleetbase Backend + Console — Environment Setup (Elite Logistics)

Backend (Laravel API + Ember console) for Elite Logistics. Repo lives at
`~/files/elite/fleetbase-elite-logistics` (Docker: API `:8000`, console `:4200`, socket `:38000`).
Driver app env: see `~/files/elite/navigator-app-elite-logistics/ENVIRONMENT.md`.

## api/.env (Laravel backend, real secrets — gitignored)

Currently set (dev, working locally):

| Var | Value / note |
|---|---|
| `APP_NAME`, `APP_KEY` | set |
| `APP_ENV` | `local` — flip to `production` before go-live |
| `APP_DEBUG` | `true` — flip to `false` before go-live |
| `APP_URL` | `http://localhost:8000` — needs real domain before go-live |
| `DB_*` | set, points at Docker `database` container |
| `DB_PASSWORD` | empty — fine, root has no password in this dev compose |
| `REDIS_HOST/PORT` | set, points at Docker `cache` container |
| `CACHE_DRIVER` | `redis` |
| `QUEUE_CONNECTION` | `redis` |
| `BROADCAST_DRIVER` | `socketcluster` — self-hosted realtime, no external creds needed |
| `FILESYSTEM_DRIVER` | `public` — **local disk storage, staying this way, no S3 needed** |
| `MAIL_MAILER` | `smtp` → `MAIL_HOST=mailhog` — fake catcher, dev only, dies in production |
| `FLEETBASE_BRANDING_LOGO_URL`, `FLEETBASE_BRANDING_ICON_URL` | set (Elite branding) |

### Missing — ask client for these

| Purpose | Vars | Ask client |
|---|---|---|
| SMS / OTP | `CALLPROMN_API_KEY`, `CALLPROMN_FROM` | Callpromn (`api-text.callpro.mn`) account key + sender ID — **or** tell you which SMS gateway they actually want (this is the only gateway wired in `api/config/services.php`, nothing else is coded) |
| Maps | `GOOGLE_MAPS_API_KEY` | Google Cloud Console key, Maps/Geocoding/Directions APIs enabled |
| Production email | one of: `MAILGUN_DOMAIN`+`MAILGUN_SECRET`, or `SENDGRID_API_KEY`, or `RESEND_KEY` | which provider they want + creds — mailhog must be replaced, it silently drops mail outside dev |
| Domain | `APP_URL`, `CONSOLE_HOST`, `FRONTEND_HOSTS`, `SANCTUM_STATEFUL_DOMAINS` | real production domain name(s) |
| Payments (optional) | `STRIPE_API_KEY`, `STRIPE_SECRET`, `STRIPE_WEBHOOK_SECRET` | only if billing is actually in scope — confirm first |

Not needed: `AWS_*` / `GOOGLE_CLOUD_STORAGE_*` (S3/GCS) — using local disk storage instead.

## console (Ember web app)

Files: `console/environments/.env.production` (build-time) + `console/fleetbase.config.json` (runtime override, mounted into the nginx container).

```env
API_HOST=https://localhost:8000
API_NAMESPACE=int/v1
API_SECURE=true
SOCKETCLUSTER_PATH=/socketcluster/
SOCKETCLUSTER_HOST=localhost
SOCKETCLUSTER_SECURE=true
SOCKETCLUSTER_PORT=38000
OSRM_HOST=https://router.project-osrm.org
```

All currently point at `localhost` — dev only. Read in `console/config/environment.js`; also consumes `STRIPE_KEY` (publishable), `EXTENSIONS`, `DISABLE_RUNTIME_CONFIG`, `DISABLE_FLEETBASE_ATTRIBUTION`, optional `DEFAULT_*_IMAGE` branding overrides (all have fallback defaults, skip unless rebranding).

**For go-live: swap `API_HOST` and `SOCKETCLUSTER_HOST` to the real production domain** (same domain the client gives you for `APP_URL` above).

## SMS/OTP — how it works locally right now

- No SMS provider configured (`CALLPROMN_API_KEY`/`CALLPROMN_FROM` empty) ⇒ real texts never send.
- Code IS created in `verification_codes` table — fetch it for testing via `~/files/elite/get-otp.sh` (see [[elite-logistics-project]] memory).
- Note: this build uses **Callpromn**, not Twilio — don't confuse with generic Fleetbase docs that mention Twilio; nothing Twilio-related is wired in this repo's `services.php`.
