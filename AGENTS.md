<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This repo uses Next.js `16.2.4` (see `package.json`). APIs, conventions, and file structure may differ from your training data.

If you are unsure about a Next behavior, trust the checked-in config and the local docs shipped with the installed version:
- `node_modules/next/dist/docs/index.md`
<!-- END:nextjs-agent-rules -->

## Commands (npm)

- Install: `npm install` (lockfile is `package-lock.json`)
- Dev: `npm run dev`
- Build: `npm run build`
- Prod server: `npm run start`
- Lint: `npm run lint` (runs `eslint` with flat config at `eslint.config.mjs`)
- Typecheck (no script): `npx tsc -p tsconfig.json --noEmit`

No tests are configured in `package.json`.

### Typecheck gotcha

`next-env.d.ts` imports `.next/dev/types/routes.d.ts`. On a fresh clone, `npx tsc` can fail until Next has generated `.next` types.

If that happens, run `npm run dev` (or `npm run build`) once, then rerun `npx tsc -p tsconfig.json --noEmit`.

## Repo Layout (real entrypoints)

- App Router entrypoints live in `app/`.
- Main UI + state live in `app/page.tsx` (client component: it uses `localStorage`).
- Global styles: `app/globals.css`.
- Document shell + fonts + `metadata`: `app/layout.tsx`.

## Theme (dark-only)

- `app/layout.tsx` forces Tailwind dark mode via the `dark` class on `<html>`.
- `app/globals.css` sets dark palette in `:root` (there is no light theme).

## Styling (Tailwind v4)

- Tailwind is wired via PostCSS: `postcss.config.mjs` uses `@tailwindcss/postcss`.
- CSS uses `@import "tailwindcss";` in `app/globals.css`.
- There is no `tailwind.config.*` in this repo; don\'t add one unless you actually need custom Tailwind config.

## Persistence (local-only)

App data is stored in browser `localStorage` under the `easyToDo.*` keys (see `LS` in `app/page.tsx`: `habits`, `todos`, `habitHistory`, `lastSeen`).

If you change the stored shape/meaning, add a migration in `initFromStorage(...)` (or deliberately reset keys) so existing users don\'t get stuck with invalid state.

## Hydration gotcha

`app/page.tsx` derives initial UI from local-only inputs (`localStorage`, current date). It intentionally renders a deterministic loading shell until after mount to avoid Next/React hydration mismatches; preserve that pattern when editing.
