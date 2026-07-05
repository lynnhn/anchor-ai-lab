# Astro Deployment Checklist

## Current Mainline

`anchor-ai-lab-astro/`

## Astro Local Commands

```bash
cd anchor-ai-lab-astro
npm install
npm run dev
npm run build
```

## Build Output Directory

`anchor-ai-lab-astro/dist`

## Cloudflare Pages Suggested Configuration

- Framework preset: Astro
- Root directory: `anchor-ai-lab-astro`
- Build command: `npm run build`
- Build output directory: `dist`

## Wrangler Configuration

- `wrangler.jsonc` currently points `assets.directory` to `anchor-ai-lab-astro/dist`.
- If using Wrangler static assets deployment, this configuration can be reused.
- If using Cloudflare Pages UI/Git deployment, use the Pages project settings as the source of truth.

## Not In Scope

- CMS
- Backend
- Database
- Public reading counts
- Comments
- NAS public deployment

## Pre-Deployment Checks

- `npm run build` succeeds.
- Homepage is generated.
- `projects`, `writing`, and `tools` detail pages are generated.
- `/docs/AI_TOOL_REVIEWS.md` compatibility file exists.
- `editorial-manifesto/` remains preserved as the v0.1 frozen visual baseline.
