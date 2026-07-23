# AGENTS.md

Guidance for AI agents (and humans) working in this repo. Read [README.md](./README.md)
first for the product model (name-seeded boards, the prompt pool, deploy setup).

## What this repo is

A single self-contained page, `index.html`, that is a distributed bingo game: each player's
5×5 board is generated deterministically from their name, all client-side, no backend.
`build.mjs` copies `index.html` (+ `images/`) into `public/`; a Cloudflare static-assets
Worker serves `public/`. Every push to `master` auto-deploys.

## The core workflow: fix and deploy from a phone

Topher may message from his phone asking to change squares or fix something and deploy:

1. Make the edit (usually to `CONFIG`/`PROMPTS` in `index.html`).
2. `npm run build` to confirm it builds.
3. Commit and push **directly to `master`**. Pushing to `master` is the deploy trigger.
4. **Amending the previous commit and force-pushing `master` is allowed and encouraged** for
   quick iterative fixes, so history stays clean. Do not force-push if it would overwrite
   commits you did not just make.
5. Tell Topher it's pushed; Cloudflare redeploys on its own (typically under a minute).

This repo is the exception to the usual "don't push, don't force-push, use `gt`" rules.
Here: commit straight to `master` with plain `git`, push, amend + force-push as needed.
No Graphite stacks, no PRs required.

## Commands

```bash
npm run build     # regenerate public/
npm run preview   # build + serve public/ at localhost:8788 (python http.server)
npm run dev       # build + serve via wrangler (production-like)
npm run deploy    # build + wrangler deploy (manual; normally CI does this)
```

## Editing the game

- **Squares:** edit the `PROMPTS` array in `index.html`. Keep the pool **≥ 24**. A prompt is
  a `"string"`, `{ text, emoji }`, or `{ text, img: "file.png" }`.
- **Center free space:** `CONFIG.freeSpace`.
- **Images:** put files in `images/`, reference by filename via `{ img: "..." }`.
- **Do not touch the normalization or PRNG** (`normName`, `cyrb128`, `sfc32`, `boardFor`)
  unless intentionally re-seeding everyone. Changing normalization silently rebuilds every
  player's board; changing prompts only reshuffles. This is the one real footgun.
- Do not edit `public/` by hand; it is generated.

## Regenerating screenshots

Screenshots in `screenshots/` are phone-viewport captures. To refresh them, build, serve
`public/`, and capture at a ~390×844 viewport (seed `localStorage` `bingo:user` +
`bingo:marks:<name>` to show a populated board). Then trim and drop into `screenshots/`.

## Deploy config

- `wrangler.jsonc`: static-assets-only Worker named `peace-kids-bingo`, serving `./public`.
- Cloudflare Workers Builds runs `npm run build` then `npx wrangler deploy` on push to
  `master`. See README "One-time Cloudflare setup" for connecting the repo.
