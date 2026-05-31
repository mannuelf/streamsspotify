# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

StreamsSpotify is a Spotify stats visualizer: a user authorizes via Spotify, and the app renders their top tracks, artists, genres, and recently played, with shareable stat cards. It's a **TanStack Start** (full-stack React 19) app deployed to **Cloudflare Workers**.

## Tooling

- **Bun is the package manager** (`bun install`, `bun add`, `bunx`). `bun.lock` is committed; there are no pnpm/npm lockfiles despite some stale `pnpm` references in `README.md`.
- **Vite is the build tool and dev server** — this project *does* use Vite. Do not replace it with `Bun.serve()` or Bun's bundler. The Vite plugin chain (order matters) is in `vite.config.ts`: `devtools()` → `cloudflare()` → `tailwindcss()` → `tanstackStart()` → `viteReact()`.
- **Vitest** is the test runner (`jsdom` env, `@testing-library/react`). Do not use `bun test`.
- Tailwind CSS v4 via `@tailwindcss/vite` (no `tailwind.config.js`; config lives in `src/styles.css`).

## Commands

| Task | Command |
|------|---------|
| Install deps | `bun install` |
| Dev server (port 3000) | `bun run dev` |
| Build | `bun run build` |
| Preview production build | `bun run preview` |
| Run all tests | `bun run test` (alias for `vitest run`) |
| Run a single test file | `bunx vitest run src/path/to/file.test.ts` |
| Watch a test | `bunx vitest src/path/to/file.test.ts` |
| Deploy to Cloudflare | `bun run deploy` (builds, then `wrangler deploy`) |

## Architecture

- **Routing** is file-based via TanStack Router. Routes live in `src/routes/`; `src/routeTree.gen.ts` is **generated** by the router plugin — never edit it by hand. `src/routes/__root.tsx` is the document shell (`<html>`, head, `QueryClientProvider`, `Header`/`Footer`, devtools).
- **Router setup** is in `src/router.tsx` (`getRouter()`), which wires a `QueryClient` into router context. The root route uses `createRootRouteWithContext<{ queryClient }>()`.
- **Data fetching** uses TanStack Query (`useQuery`) inside components, calling the wrappers in `src/utils/spotifyApi.ts`. The query client is in router context, but components currently read it via `QueryClientProvider` in the shell.
- **Theme** is applied before hydration by an inline blocking script (`THEME_INIT_SCRIPT` in `__root.tsx`) that reads `localStorage.theme` and sets `light`/`dark` classes to avoid FOUC. `ThemeToggle` toggles it client-side.

## Spotify auth flow (client-side OAuth PKCE)

All in `src/utils/spotifyApi.ts`, and it runs **entirely in the browser** — there is no server-side token exchange:
1. `redirectToAuthCodeFlow()` generates a PKCE verifier/challenge, stashes the verifier in `localStorage`, and redirects to Spotify.
2. Spotify redirects back to `/callback` (`src/routes/callback.tsx`), which calls `getAccessToken(code)` and stores `spotify_access_token` in `localStorage`.
3. `fetchWebApi()` attaches the bearer token; on a `401` it clears the token and bounces to `/`.

Token presence in `localStorage` is the entire "logged in" gate (see `src/routes/index.tsx`).

## Sharing

`src/utils/sharing.ts` serializes stats to JSON, compresses with `lz-string` into a URL hash fragment (`/share#data=...`), and decodes on the other end. `html-to-image` is used to render stat cards as images. Data lives in the URL, not a backend.

## Environment & deployment

- Env vars use Vite's `VITE_` prefix and are read via `import.meta.env`. Required: `VITE_SPOTIFY_CLIENT_ID`, `VITE_SPOTIFY_CLIENT_SECRET`, `VITE_REDIRECT_URI`. `.env` is gitignored.
- For production, secrets go in Cloudflare via `wrangler secret put <NAME>` (declared under `secrets.required` in `wrangler.jsonc`); non-secret vars go under `vars` in `wrangler.jsonc`.
- `wrangler.jsonc` targets the `streamsspotify.com` custom domain, uses `main: "@tanstack/react-start/server-entry"`, `nodejs_compat`, and serves built assets from `.output/public`.

## Conventions

- Import alias: `#/*` maps to `./src/*` (see `package.json` `imports`); TanStack code also uses relative imports — match the surrounding file.
- `AGENTS.md` is an auto-generated TanStack "intent skills" map (load specific TanStack guidance with `npx @tanstack/intent@latest load <use>`). It is not project documentation.
</content>
</invoke>
