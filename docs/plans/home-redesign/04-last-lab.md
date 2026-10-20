# 04 — Last-visited lab store ("Continue")

Status: done (2026-10-20) · Depends on: – · Suggested model: Haiku · Est. size: S

## Why
The home page's "Continue" cell sends a returning learner straight back to the lab they last used,
with their inputs (labs keep their state in the URL query string).

## Current state (verified 2026-10-20)
- `src/components/layout/useActiveModule.ts`: `useActiveModule()` → `{ activeModule?: ModuleDef,
  activeCategory?: ModuleCategory }`, matching `pathname === m.path` or a sub-path for modules with
  `subNav`.
- `src/components/layout/AppShell.tsx` (31 lines) already calls `useActiveModule()` and
  `useLocation()`; it renders on every route.
- Router: `BrowserRouter` with `basename` `/hu` for Hungarian (`src/main.tsx`), so
  `useLocation().pathname` is **unprefixed** (`/black-scholes` in both languages).
- Storage pattern to copy: `src/components/layout/useSidebarPin.ts` — `useSyncExternalStore` with a
  module-level `listeners` set, `try/catch` around `localStorage`.
- Lab state lives in the query string (e.g. `/black-scholes?k=100&r=0.05&sigma=0.2…`).

## Goal
1. `src/components/layout/useLastLab.ts` exporting `useRecordLastLab()` and `useLastLab()`.
2. AppShell records the current lab on every location change.

## Non-goals
- No UI (plan 05 renders the Continue cell).
- Do not record the home page, guide pages or `guide-graph` (category `guides`).

## Constraints
- Hydration: `useLastLab()` must return `null` on the server and on the first client render
  (`getServerSnapshot = () => null`), so pre-rendered HTML matches.
- Keep the file under ~60 lines; `///` doc comments on exports.

## Steps
1. Create `src/components/layout/useLastLab.ts`:
   ```ts
   export type LastLab = { id: string; href: string; at: number };
   const STORAGE_KEY = "qs-last-lab";
   /// Saves the active lab (id + path + query) whenever the location changes.
   export function useRecordLastLab(): void
   /// The lab the reader last opened on this device, or null (always null before hydration).
   export function useLastLab(): LastLab | null
   ```
   - `useRecordLastLab`: `const { activeModule } = useActiveModule(); const { pathname, search } = useLocation();`
     in a `useEffect([activeModule, pathname, search])`: if `activeModule` exists, `activeModule.category`
     is set and not `"guides"`, write `{ id, href: pathname + search, at: Date.now() }` as JSON and notify
     listeners. Wrap storage in `try/catch`.
   - `useLastLab`: `useSyncExternalStore(subscribe, read, () => null)` where `read` parses the JSON and
     returns `null` on any error or missing `id`/`href`. Cache the parsed object by raw string so `read`
     returns a stable reference (useSyncExternalStore requires it).
2. `AppShell.tsx`: call `useRecordLastLab();` next to `useStickyFit();`.

## Acceptance criteria
- Visiting `/black-scholes?k=110` then `/` leaves `localStorage["qs-last-lab"]` with
  `href: "/black-scholes?k=110"` and `id: "black-scholes"`.
- Visiting `/guide/derivatives` does not overwrite it.
- No hydration warnings in the console on `/`.

## Verification
```bash
npx tsc -b && npx eslint src/components/layout/useLastLab.ts src/components/layout/AppShell.tsx
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel/insights" \
  --after "/black-scholes|(async()=>{history.pushState({},'','/guide/derivatives');dispatchEvent(new PopStateEvent('popstate'));await new Promise(r=>setTimeout(r,500));return localStorage.getItem('qs-last-lab')})()"
# expect: no problems; value contains "black-scholes" (not "guide")
```
Stop the server afterwards and check the port is free.

## Pitfalls
- `useSyncExternalStore` loops forever if `read` returns a new object each call; cache by raw string.
- Labs rewrite their query string with `history.replaceState` as inputs change; the effect depends on
  `search` from `useLocation`, which React Router updates only for router navigations. That is fine: the
  stored href may lag behind the latest slider move by design (it updates on the next router change). If
  a lab uses `setSearchParams`, it updates live.

## Findings (fill in during execution)
- Smoke: `/black-scholes?k=110` then pushState to `/guide/derivatives` left `qs-last-lab` = black-scholes with the full query (labs append defaults to the URL). Guide did not overwrite.
- eslint: one error in AppShell (`setNavOpen` in effect) is pre-existing, not from this change.
- A React #418 / missing-font error appeared on later smoke runs, but dist was being rebuilt by another session (font imports in `main.tsx` changing mid-run) and the preview server kept dropping; the plain `/` smoke run was clean. Re-check hydration once plan 01 lands.

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/plans/home-redesign/README.md`
> (section 4) and `docs/plans/home-redesign/04-last-lab.md`. Run `git status` and stop if
> `src/components/layout/AppShell.tsx` has changes you didn't make. Implement plan 04: a hydration-safe
> `useLastLab`/`useRecordLastLab` localStorage store and the one-line hook call in AppShell. Run the
> Verification commands and make them pass. Fill in Findings, set plan 04 to `done (<date>)` in the README
> table, and summarise.
