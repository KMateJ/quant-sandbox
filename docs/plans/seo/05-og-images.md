# 05 — Per-page Open Graph images at build time

Status: done (2026-10-19) · Depends on: 01, 02 (03 recommended, for `SeoPage.category`) · Suggested model: Sonnet · Est. size: M

## Why

When a page is shared on LinkedIn, X, Slack, Discord or Teams, or shown as a source card by an AI
assistant, the preview image is the first thing people see. Today every page points to
`/og.png`, which doesn't exist, so previews are blank. A branded image per page, showing the page
title and its section, raises click-through and makes the site look like a serious resource.
Generating the images at build time keeps them in sync with titles automatically.

## Current state (verified 2026-10-19)

- `index.html` (template) has static `og:image`, `og:image:alt`, `twitter:image` and
  `twitter:card=summary_large_image`, all pointing to `https://quantsandbox.dev/og.png`.
- `seo.plugin.ts` → `PER_PAGE_TAGS` (array of regexes) strips the per-page tags from the template
  before writing fresh ones in `pageHtml()`. `og:image*` and `twitter:image` are **not** in that
  list today, so they're inherited from the template unchanged.
- Plan 02 may have added a hand-made `public/og.png` fallback. Plan 01's audit has an OG-image test
  that is `todo` unless plan 02 created the fallback.
- Pages: `englishSeoPages()` (`src/seo.routes.ts`) returns `SeoPage {path, title, description,
  parent?, lessons?, faq?, category?}` (`faq`/`category` exist if plan 03 is done).
- Fonts installed: `@fontsource-variable/inter` and `@fontsource-variable/source-serif-4`, **woff2
  only** (`node_modules/@fontsource-variable/inter/files/*.woff2`). Satori cannot read woff2.
- Dark theme tokens (`src/styles/tokens.scss`, the block with `color-scheme: dark`, about lines
  58–80): `--bg: #0b1220`, `--surface: #162033`, `--text: #f8fafc`, `--muted: #9fb0c9`,
  `--primary: #3b82f6`, `--border: #465975`.
- Icon: `public/android-chrome-512x512.png` (the favicon glyph).
- After plan 02, the repo-root `seo/` folder holds Node-side helpers for the plugin.

## Goal

- For each page in the sitemap, `dist/og/<path>.png` (1200×630; home → `dist/og/index.png`) plus
  `dist/og.png` as the site-wide fallback (also used by `404.html`).
- Per-page head tags: `og:image`, `og:image:width` (1200), `og:image:height` (630),
  `og:image:alt` (page title), `twitter:image`.
- Builds stay fast: a content-hash cache, so unchanged images are copied instead of re-rendered.

## Non-goals

- No KaTeX or charts inside the images. Text and layout only.
- No runtime or edge image generation (`@vercel/og`). It isn't needed, because everything is static.
- No Hungarian images yet. Plan 08 calls the same function with Hungarian labels.

## Constraints

CLAUDE.md: DRY (colours read from `tokens.scss`, labels from i18n, titles from `seoPages()`),
separation of concerns (Node-only code lives in `seo/`, never in `src/`), `///` comments. New
packages are **devDependencies** only.

## Steps

1. `npm i -D satori @resvg/resvg-js @fontsource/inter`. `@fontsource/inter` ships static `.woff`
   files (e.g. `files/inter-latin-700-normal.woff`, `inter-latin-ext-700-normal.woff`). Confirm the
   exact filenames after install. Use the 400 and 700 weights in both the `latin` and `latin-ext`
   subsets, because Hungarian titles need ő/ű in plan 08.
2. **i18n labels.** In `src/Language/Seo.ts` (create it if plan 04 hasn't, as `seoEn` / `seoHu`,
   registered in `src/i18n.tsx`), add `ogKindLab` ("Interactive lab" / "Interaktív labor"),
   `ogKindLesson` ("Lesson" / "Lecke"), `ogKindCourse` ("Course" / "Kurzus") and `ogTagline`
   ("Interactive quantitative finance" / "Interaktív kvantitatív pénzügyek").
3. **`seo/theme.ts`**: `/// Dark-theme colours read from src/styles/tokens.scss, so OG images match the app.`
   `export async function ogColors(root: string): Promise<{bg, surface, text, muted, primary, border}>`.
   Read the file, take the block containing `color-scheme: dark`, and regex
   `--name:\s*(#[0-9a-fA-F]{3,8})`. Throw a clear error if any colour is missing.
4. **`seo/ogLayout.ts`**: a pure function returning a Satori element tree as plain objects
   (`{ type: "div", props: { style, children } }`). No React or JSX, so no TSX compile is needed in
   the plugin.
   ```ts
   export type OgCard = { title: string; kind: string; section?: string; site: string; tagline: string; icon: string /* data URI */ };
   export function ogLayout(card: OgCard, colors: OgColors): SatoriNode
   ```
   Design (dense and professional, matching the app; no pills, no left-border accent bar, per the
   owner's rules):
   - Full `bg` background with 64px padding and a flex column, `space-between`.
   - Top row: the 56px icon (`<img src=data:…>` from `android-chrome-512x512.png`) + site name in
     `text` (32px, 700) + tagline in `muted` (24px).
   - Middle: the title in `text`, 64px/700, `lineHeight: 1.1`, max 3 lines. Shrink to 52px when the
     title is over 48 characters and to 44px when it's over 80.
   - Bottom row: `kind` · `section` in `muted` 28px, and a 6px-tall `primary` bar across the full
     width at the very bottom (a horizontal rule, not a left border).
5. **`seo/ogImages.ts`**:
   ```ts
   /// Renders (or reuses from cache) the OG PNG for each card; returns written file paths.
   export async function writeOgImages(cards: { path: string; card: OgCard }[], opts: { root: string; outDir: string }): Promise<void>
   ```
   - Load fonts once (`readFile` the .woff files) and pass them to `satori(tree, {width: 1200,
     height: 630, fonts: [...]})`, then `new Resvg(svg).render().asPng()`.
   - Cache: `sha1(JSON.stringify(card) + LAYOUT_VERSION + JSON.stringify(colors))` →
     `node_modules/.cache/og/<hash>.png`. On a hit, copy the file. Bump `LAYOUT_VERSION` (a const)
     whenever the layout changes.
   - Output path: `/` → `og/index.png`, `/a/b` → `og/a/b.png`. Create directories recursively.
   - Also write `dist/og.png` from a card with `title: "Quant Sandbox"`, `kind: tagline`.
   - Import `satori` and `@resvg/resvg-js` **dynamically inside the function**, so loading
     `vite.config.ts` stays fast in dev.
6. **Plugin** (`seo.plugin.ts`):
   - Build the cards from the pages: `kind` = course if `page.lessons`, lesson if `page.parent`,
     otherwise lab; home = tagline. `section` = `page.parent?.title ?? page.category?.title`.
     Resolve labels via `translations.en` (loaded with `ssrLoadModule("/src/i18n.tsx")`, or expose a
     tiny `ogLabels(t)` from `src/seo.routes.ts` to keep it DRY).
   - Call `writeOgImages` after writing the pages.
   - Add `/<meta\s+property="og:image(:alt|:width|:height)?"[\s\S]*?\/>\s*/g` and
     `/<meta\s+name="twitter:image"[\s\S]*?\/>\s*/g` to `PER_PAGE_TAGS`, and emit the five image
     tags per page in the head builder. The absolute URL is `new URL("/og" + (path === "/" ? "/index" : path) + ".png", BASE_URL)`.
   - `404.html` keeps the template's `/og.png`.
7. **Clean up:** if plan 02 committed a hand-made `public/og.png`, delete it. The build now writes
   `dist/og.png`, and a public file would be overwritten anyway, which is confusing.
8. **Audit:** remove the `todo` from the OG test in `scripts/seo-audit.test.mjs`. Add checks that
   `og:image:width` is `1200`, that each og:image file is a PNG (magic bytes
   `89 50 4E 47`) of reasonable size (5–300 KB), and that no two pages share an og:image except
   through the fallback.

## Acceptance criteria

- `dist/og/**.png` has one image per sitemap page, plus `dist/og.png`.
- A second `npm run build` without changes re-renders 0 images (log `og: N rendered, M cached`).
- `npm run build`, `npm run test:seo` and `npm run lint` are green.
- Visual check: open 3 images (home, `dist/og/wacc.png`, a long guide lesson title). The text is
  legible, nothing overflows, and the colours match the dark theme.

## Verification

```bash
npm run build
npm run build   # second run: expect all cached
npm run test:seo
npm run lint
```

After deploy, paste a URL into https://www.opengraph.xyz/ and the LinkedIn Post Inspector.

## Pitfalls

- Satori supports only a subset of CSS: flexbox only (every `div` with more than one child needs
  `display: "flex"`), no `grid`, and no CSS variables. Pass resolved hex colours.
- Satori throws on characters missing from the provided fonts. Include latin-ext. If a title
  contains a symbol like `σ` or `√`, include the Inter `greek` subset or replace the symbol in the
  card title only.
- `@resvg/resvg-js` is a native, prebuilt package. It works on Windows and on Vercel's Linux
  builders, but run `npm ci` on a clean checkout once to confirm the lockfile has both platforms'
  optional deps.
- Keep the cache under `node_modules/.cache`. Vercel persists `node_modules/.cache` between builds,
  and it's already gitignored.

## Prompt to hand off

> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/seo/README.md` (section
> 4) and `docs/plans/seo/05-og-images.md`, and confirm that plans 01–02 are done. Implement plan 05:
> add the devDeps (satori, @resvg/resvg-js, @fontsource/inter), `seo/theme.ts` (colours from
> tokens.scss), `seo/ogLayout.ts` (pure Satori tree), `seo/ogImages.ts` (render + hash cache),
> i18n labels in `src/Language/Seo.ts` (EN + HU), plugin wiring with per-page `og:image*` /
> `twitter:image` tags, and the audit updates. Run the build twice (the second run must be fully
> cached), run `npm run test:seo` and lint, look at three generated PNGs, mark plan 05 done in the
> README, and summarise.

