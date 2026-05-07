# NetworkQualityHWCDashboard

Admin dashboard for the
[FisionTV+ Network Certifier](https://github.com/lstepnio/NetworkQualityHWC)
backend. Read-only MVP: paginated cert listings, per-cert detail with the
full payload, configuration history, device fleet drill-downs. Reads
through the backend's `/admin/*` endpoints (gated by a shared bearer
token); never talks to Postgres directly.

## Stack

- **SvelteKit 5** (Svelte 5 with runes) on Vite + Rolldown
- **Tailwind v4** with the FisionTV+ / Hotwire Communications brand palette
  baked into `@theme`
- **lucide-svelte** for icons, **date-fns** for time formatting
- Hand-rolled SVG charts in Svelte (no chart lib pulled in)

## Pages

| Route                      | What                                                                |
|----------------------------|---------------------------------------------------------------------|
| `/`                        | Overview: total count, active config, premium rate, recent runs     |
| `/certs`                   | Paginated cert list; `?tier=` `?deviceId=` `?configVersion=` filter |
| `/certs/[id]`              | Single cert: KPI grids + identity/lineage + full JSONB payload      |
| `/devices`                 | Fleet rollup by deviceId (runs, avg ↓, latest tier, last seen)      |
| `/devices/[deviceId]`      | Device drill-down with its own tier + throughput charts             |
| `/configs`                 | All `cert_config` rows with active/inactive state                   |
| `/configs/[configVersion]` | Single config document                                              |

## Run locally

```bash
# 1. The backend must be running (in NetworkQualityHWCBackend):
make dev

# 2. Then here:
pnpm install
cp .env.example .env       # already created with dev defaults
pnpm dev --port 3000       # http://localhost:3000
```

## Configuration

| Var                              | Required | Default                 |
|----------------------------------|----------|-------------------------|
| `NETWORKQUALITY_BACKEND_URL`     | yes      | `http://localhost:8080` |
| `NETWORKQUALITY_ADMIN_TOKEN`     | yes      | (empty — fail loudly)   |

Both are server-side only (no `PUBLIC_` prefix). Used inside SvelteKit
load functions; never reach the browser.

## Phase 2 (not in MVP)

- Form-based config editor with draft → active promotion
- Saved searches
- HWC SSO instead of shared admin token
- Streaming live updates as new certs land
