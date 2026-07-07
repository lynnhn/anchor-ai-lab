# Anchor AI Lab

启锚 · 探索智能边界。

Anchor AI Lab is a static personal AI engineering practice site for agent workflows, project notes, open-source tool reviews, and personal workflow building.

Inspired by Sac-Y/sac-ai.com.

## Live Site

https://anchor-ai-lab.pages.dev/

## Project Structure

- `anchor-ai-lab-astro/`: current mainline version, built with Astro + Markdown Content Collections.
- `editorial-manifesto/`: v0.1 frozen visual baseline and fallback reference for the Astro migration.
- `docs/`: project documentation and compatibility docs.

## Astro Local Development

```bash
cd anchor-ai-lab-astro
npm install
npm run dev
npm run build
```

## Cloudflare Pages

- Framework preset: Astro
- Root directory: `anchor-ai-lab-astro`
- Build command: `npm run build`
- Output directory: `dist`

## Legacy Preview

To view the v0.1 frozen baseline, open `editorial-manifesto/index.html` directly.
