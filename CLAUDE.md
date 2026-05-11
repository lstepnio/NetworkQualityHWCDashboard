# CLAUDE.md — NetworkQualityHWCDashboard

## Role

SvelteKit 5 admin UI for the FisionTV+ Network Certifier. Reads and writes the backend's `/admin/*` endpoints to:

- Browse certifications (filterable by HSN, public IP, achieved tier, time range).
- Drill into a single cert's full payload, including queue-delay diagnostics.
- View per-device run history with charts (tier distribution, throughput over time).
- Manage **cert configs** — runtime configuration the backend ships to clients via `/v1/cert-config`. Create draft → promote to active. Exactly one active at a time.
- Manage **app-version manifests** — what the backend ships to clients via `/v1/app/version`. Create with apkUrl + sha256 + signing-cert sha256 → promote to active. The active manifest is what the next STB cert tap fetches.

Brand: FisionTV+ pink `#EE3D5B`, navy `#0E1B2D`. Dark theme by default. Inter typeface.

## Neighbors

This repo is one of four in the FisionTV+ system. All checked out under `/Users/lukasz.stepniowski/Development/`:

- **contract** — `fisiontv-cert-contract` — OpenAPI 3.1 + SPEC.md. Not consumed directly here; the dashboard talks to `/admin/*` which is shaped by the backend's own admin schemas, not the contract.
- **backend** — `NetworkQualityHWCBackend` — Go server. Source of all data the dashboard renders. Admin token (dev): `dev-admin-token-change-me`.
- **android** — `NetworkQualityHWC` — Kotlin/Compose STB client. Doesn't touch the dashboard directly; the dashboard manages app-version manifests that the STB consumes.

## Local dev

```
npm install       # or pnpm install (pnpm-lock.yaml is the lockfile)
npm run dev       # vite dev at localhost:5173
npm run check     # svelte-check
npm run build     # production build
```

Backend must be running for the dashboard to render anything — start `make dev` in the backend repo first.

Backend URL is read from `BACKEND_URL` env var (defaults to `http://localhost:8080` in dev). Admin token from `ADMIN_TOKEN`.

## Conventions

- **Svelte 5 runes only.** `$state`, `$derived`, `$props`, `$effect`. No `$:`, no `export let`. The `svelte.config.js` `compilerOptions.runes` is set so the compiler will warn if you slip.
- **Tailwind v4 with `@theme` brand tokens.** `app.css` defines `--color-fision-pink`, `--color-fision-navy`, etc. Use those via the standard `text-pink-500` / `bg-navy-950` Tailwind classes — don't hard-code hex.
- **Timestamps render in browser-local TZ.** Use the `<LocalTime iso={...} />` component, not `formatAbsolute()` directly. SSR renders UTC for clean hydration; the component swaps to the resolved TZ on mount via `$effect`. `Topbar.svelte` surfaces the active TZ.
- **Server actions for writes.** Forms use SvelteKit `?/action` POSTs; load functions for reads. Don't fetch from browser-side `$lib/server/api.ts` — that module is server-only by design.
- **PR-only.** Sandbox blocks direct push to `main`. Workflow: `git checkout -b <type>/<name>` → commit → push → `gh pr create` → wait for CI green → `gh pr merge --merge --delete-branch` → fast-forward main → tag if releasing.
- **Conventional Commits.** `feat:`, `fix:`, `ci:`, `chore:`, `docs:`, `refactor:`, `test:`, `ui:`.

## Release flow

1. Open a PR with the change.
2. CI green → merge.
3. Fast-forward `main` locally.
4. Bump `package.json` version to the new semver (this can be in the same branch as the change for "headline feature" releases).
5. `git tag -a vX.Y.Z -m "vX.Y.Z: <one-line>" HEAD && git push origin vX.Y.Z`.

No published artifact today — the build is server-rendered SvelteKit, runs wherever you deploy the Node adapter. Future: GHCR image alongside the backend's, or static export.

## Operational notes

- **Don't render server-side from the contract repo.** The dashboard doesn't consume the contract directly; the shape of `/admin/*` is the backend's responsibility.
- **`+page.server.ts` files use `Promise.all`** for parallel backend fetches with `.catch(() => null)` so optional widgets (e.g. queue stats from an older backend without `/admin/queue-stats`) degrade gracefully.
- **Type drift**: `src/lib/types.ts` mirrors the backend's admin response shapes. When the backend changes, update both. There's no auto-generated client.
