# VIEW Conference 2026 — Live Program

A mobile-first React app that shows the live program of [VIEW Conference 2026](https://www.viewconference.it) (12–16 October, Torino).

Instead of scraping data at build time, the app fetches the **official schedule page on demand** — so when the organizers update the program (which happens daily during the conference), the app picks it up automatically within ~15 minutes, with no redeploy.

## How it works

```
viewconference.it/assets/html/view_CET.html
        │
        ▼
  api/program.ts            ← Vercel serverless function: fetches + parses the HTML
        │                     (CDN-cached 15 min, stale-while-revalidate 24 h)
        ▼
  React app                 ← day tabs, search, type filters, "NOW" indicator
        │ (fallback chain)
        ▼
  public/program-snapshot.json  ← build-time snapshot, used when the API is unreachable
  localStorage                  ← last good payload, used when fully offline
```

- **Parser**: `src/lib/programService.ts` — shared between the serverless function, the dev server middleware, and the snapshot script. Session times are interpreted as Europe/Rome wall time.
- **Types**: `src/types.ts`.

## Develop

```bash
npm install
npm run dev        # http://localhost:5173 — /api/program is served by a Vite middleware
```

## Update the offline snapshot

```bash
npm run snapshot   # re-fetches the live program into public/program-snapshot.json
```

This also runs automatically before every `npm run build`.

## Deploy on Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the repo.
3. Framework is auto-detected as **Vite**; `api/program.ts` is deployed as a serverless function automatically. No extra configuration needed.

## Tech

React 19 · TypeScript · Vite 7 · Tailwind CSS 4 · node-html-parser
