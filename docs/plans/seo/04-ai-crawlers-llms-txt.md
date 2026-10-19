# 04 — AI crawlers: `llms.txt`, Markdown twins, robots

Status: done (2026-10-19) · Depends on: 01, 02 (03 recommended first) · Suggested model: Sonnet · Est. size: M

## Why

AI assistants and answer engines (ChatGPT search, Claude, Perplexity, Copilot) fetch pages and
condense them. Clean Markdown is far easier for them than hydrated React markup full of SVG, KaTeX
spans and controls. `llms.txt` (https://llmstxt.org) is an emerging convention: a Markdown index at
the site root that tells an agent what the site contains and where the clean text lives. Our lesson
content is already structured data (`GuideBlock[]`), so we can emit exact Markdown for every lesson
at build time at almost no cost, and make the site easy to cite.

## Current state (verified 2026-10-19)

- No `llms.txt` and no Markdown output. `public/robots.txt` is:
  ```
  User-agent: *
  Allow: /

  Sitemap: https://quantsandbox.dev/sitemap.xml
  ```
- **Lesson content:** `src/Language/guides/index.ts` exports
  `guideContent: Record<GuideId, GuideLessonContent>`, where `GuideLessonContent =
  Record<Language, GuideBlock[]>` (`"en" | "hu"`). Block types are in
  `src/features/guide/guide.content.types.ts`:
  `p {text}`, `h {text}`, `math {tex}`, `list {items, ordered?}`, `note {text}`, `figure {id}`,
  `lab {to, text}`, `check {id, prompt, answer, explain}` and `worked {title, steps[]}` (a step is
  `{text, tex?, result?}`; result is `{value, tolerance, unit?}`). Inline text already uses Markdown
  syntax: `$tex$`, `**bold**`, `*italic*`. Lessons are authored with helpers in
  `src/Language/guides/blocks.ts` (`p`, `h`, `eq`, `list`, `note`, `lab`, …).
- **Lesson metadata:** `src/features/guide/guide.meta.ts` → `guideLessons: GuideLessonMeta[]`
  (`{id, track, titleKey, descKey, labs: string[]}` where `labs` are registry module ids),
  `guideTracks`, `guidePath(id)`, `findGuideLesson(id)` (gives previous/next) and `trackLessons()`.
  SEO titles are in `src/features/guide/guide.seo.ts`.
- In the UI, `check` blocks are collected and shown at the end of each track
  (`GuideTrackChecks.tsx`), not inline.
- **Labs:** `ModuleDef` in `src/modules/registry.ts` has `seo {title, description}`,
  `about?: {intro, faq[]}` (translation keys, `src/Language/ModuleAbout.ts`), `category`,
  `relatedGuides?: string[]` (guide ids) and `subNav`. `CATEGORY_ORDER` and `CATEGORY_LABEL_KEYS`
  are exported there.
- Studio lessons (`/stochastic-models/<lesson>`) are React components, not block data. Only their
  title and description exist as data (`lessonNavItems()` in
  `src/features/stochastic-models/stochasticModels.curriculum.ts`).
- English strings: `translations.en[key]` from `src/i18n.tsx` (as `englishSeoPages()` in
  `src/seo.routes.ts` uses them).
- The plugin (`seo.plugin.ts`, plus the `seo/` helper folder from plan 02) loads `src/` modules at
  build time through `server.ssrLoadModule(...)`.

## Goal

At build time, write:

1. `dist/<lesson path>.md` for each **guide lesson**: the full lesson in Markdown.
2. `dist/<module path>.md` for each **lab/tool module that has `about`**: title, description, intro,
   FAQ, a link to the live tool, and related lessons.
3. `dist/llms.txt`: the index. `dist/llms-full.txt`: all lesson Markdown concatenated, in track
   order.
4. `<link rel="alternate" type="text/markdown" href="<BASE_URL><path>.md" />` in the head of every
   page that has a twin.
5. `vercel.json` headers: the right `Content-Type` for `.md` / `.txt`, and `X-Robots-Tag: noindex`
   on the twins so Google keeps ranking the HTML pages (no duplicate content).
6. `public/robots.txt`: explicit groups for the main AI crawlers (all allowed), plus pointers to
   the sitemap and `llms.txt`.

## Non-goals

- No Markdown for studio lessons, course or track pages, or the home page. `llms.txt` links to
  their HTML instead.
- No Hungarian Markdown yet. Write the converter language-agnostic, because plan 08 calls it with
  `"hu"`.
- No runtime fetching or UI changes.

## Constraints

CLAUDE.md: pure converter (`.ts`, no React, no Node) under `src/`, DRY (titles, descriptions and
paths come from `seoPages()` / `guide.meta.ts` / the registry; never retype them), `///` comments.
English UI words used in the Markdown ("Practice questions", "Answer", "Open the interactive
lab") must come from i18n keys. Put them in a new `src/Language/Seo.ts` (`seoEn` / `seoHu`, registered in
`src/i18n.tsx` like the other tables). Plans 05 and 08 reuse this file.

## Steps

1. **Converter** `src/features/guide/guide.markdown.ts` (pure):
   ```ts
   /// Labels used in the Markdown output, resolved through i18n by the caller.
   export type MarkdownLabels = { practice: string; answer: string; figure: string; workedExample: string };
   /// One lesson as Markdown: H1 title, description, body, practice questions, live-page link.
   export function lessonToMarkdown(input: {
     title: string; description: string; url: string; blocks: GuideBlock[];
     labs: { title: string; url: string }[]; previous?: { title: string; url: string };
     next?: { title: string; url: string }; labels: MarkdownLabels;
   }): string
   ```
   Block mapping:
   - `h` → `## text`. `p` → text. `note` → `> text`. `math` → a fenced display block `$$\n tex \n$$`.
   - `list` → `- item` or `1. item`.
   - `figure` → `*[{labels.figure}: {humanised id}]({url})*`, where the humanised id is
     `id.replace(/-/g, " ")`. It links to the live page because the figure is interactive.
   - `lab` → `[text](BASE_URL + to)`, as an absolute URL.
   - `worked` → `### {labels.workedExample}: {title}`, then a numbered list of steps. Each step is
     its text, plus `$$tex$$` on the next line if present, plus ` → **{value}{unit}**` if `result`.
   - `check` → **not inline.** Collect them, and at the end emit `## {labels.practice}`, numbered
     questions. Each one has the prompt; for choice answers, options as `a)`, `b)`, …; then
     `{labels.answer}: …` (number + unit, or the correct option text) and the `explain` text.
   - Footer: `Source: {url}` plus previous and next lesson links.
   Keep inline text untouched (it is already Markdown). Collapse 3+ newlines to 2. End with a single
   `\n`.
2. **Unit test** `scripts/guide-markdown.test.mjs` (npm script `test:guide-markdown`). Use
   `importSrc("features/guide/guide.markdown.ts")` with a tiny hand-written block array covering
   every block kind, and assert the exact expected output. Add one smoke test that converts the
   real `wacc` lesson (`importSrc("Language/guides/wacc.ts")`), with assertions that it starts with
   `# `, contains `## Practice` (or the label used) and contains no `[object Object]` or
   `undefined`.
3. **Site-level builder** `src/seo.markdown.ts` (pure; may import the registry, `guide.meta`,
   `guideContent`, `seoPages`):
   - `export function markdownPages(t, language): { path: string; markdown: string }[]`. For each
     guide lesson, resolve `title`/`description` from the matching `SeoPage` (so SEO titles are
     reused) and the blocks from `guideContent[id][language]`. For each module with `about`,
     build: H1, description, `## About` + intro, `## Frequently asked questions` (`### Q` + answer),
     `## Related lessons` (from `relatedGuides` → `guidePath(id)` + title), and a link
     "Open the interactive tool: <url>".
   - `export function llmsTxt(t, pages: SeoPage[], mdPaths: Set<string>): string`:
     ```
     # Quant Sandbox

     > Free interactive labs and step-by-step lessons for quantitative finance: derivatives pricing,
     > portfolio theory, fixed income, corporate finance and stochastic calculus.

     Math is written in LaTeX between `$…$`. Every page below links to its Markdown version when one
     exists; the HTML page is interactive.

     ## Lessons — <Track title>
     - [Lesson title](https://quantsandbox.dev/guide/…/x.md): description
     …
     ## Labs — <Category label>
     - [Tool title](https://quantsandbox.dev/wacc.md): description
     …
     ## Optional
     - [Stochastic studio lesson](https://quantsandbox.dev/stochastic-models/x): description
     ```
     Order tracks and categories by `guideTracks` and `CATEGORY_ORDER`. Link to `.md` when the path
     is in `mdPaths`, otherwise to the HTML URL. Put the summary sentence in an i18n key (EN + HU)
     rather than hard-coding it.
   - `export function llmsFullTxt(pages): string` joins the lesson Markdown in track order,
     separated by `\n\n---\n\n`.
4. **Plugin** (`seo.plugin.ts` / `seo/`): load `/src/seo.markdown.ts` via `ssrLoadModule`. Write
   each `{path, markdown}` to `dist/<path>.md` (home → skip) plus `llms.txt` and `llms-full.txt`.
   In the head builder, add the `rel="alternate" type="text/markdown"` link for pages with a twin.
   Log the counts.
5. **`vercel.json`**: add
   ```json
   "headers": [
     { "source": "/(.*)\\.md", "headers": [
       { "key": "Content-Type", "value": "text/markdown; charset=utf-8" },
       { "key": "X-Robots-Tag", "value": "noindex" } ] },
     { "source": "/llms(-full)?\\.txt", "headers": [
       { "key": "Content-Type", "value": "text/plain; charset=utf-8" },
       { "key": "X-Robots-Tag", "value": "noindex" } ] }
   ]
   ```
   Check the source-pattern syntax against the Vercel docs (path-to-regexp). Test it on a preview
   deploy with `curl -sI`.
6. **`public/robots.txt`**: keep the `*` group. Add one group per AI agent with `Allow: /`:
   `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `ClaudeBot`, `Claude-SearchBot`, `Claude-User`,
   `PerplexityBot`, `Perplexity-User`, `Google-Extended`, `Applebot-Extended`, `CCBot`. Keep the
   `Sitemap:` line, and add the comment `# LLM index: https://quantsandbox.dev/llms.txt`. A crawler
   that matches a named group ignores `*`, so each group must carry its own `Allow: /`.
7. **Audit** (`scripts/seo-audit.test.mjs` + `scripts/lib/seo-dist.mjs`): every
   `rel="alternate" type="text/markdown"` href resolves to a file in `dist`. Every `.md` starts with
   `# `, has ≥ 150 words and contains no `undefined` or `[object Object]`. Every Markdown link in
   `llms.txt` points to an existing page or `.md`. `llms.txt` lists every guide lesson.

## Acceptance criteria

- `dist/llms.txt`, `dist/llms-full.txt`, one `.md` per guide lesson and one per module with
  `about`.
- `dist/guide/corporate/wacc.md` reads well as plain Markdown: headings, display math, the worked
  example and the practice questions at the end.
- `npm run build`, `npm run test:seo`, `npm run test:guide-markdown` and `npm run lint` are green.
- After deploy: `curl -sI https://quantsandbox.dev/guide/corporate/wacc.md` shows `text/markdown`
  and `x-robots-tag: noindex`.

## Verification

```bash
npm run build
npm run test:guide-markdown
npm run test:seo
npm run lint
head -40 dist/llms.txt
head -60 dist/guide/corporate/wacc.md
```

## Pitfalls

- `importSrc` only follows relative `.ts` imports. Keep `guide.markdown.ts` importing **types only**
  so the unit test stays light. `seo.markdown.ts` is loaded by Vite in the plugin, not by
  `importSrc`, so it may import freely.
- Some lesson text contains `|` or `*` inside `$…$`. Don't escape inline text; it's already valid
  Markdown with TeX.
- `X-Robots-Tag: noindex` keeps Google from indexing the twins. AI crawlers read them anyway. Don't
  add the twins to `sitemap.xml`.
- `llms-full.txt` may be about 1 MB. That's fine. Don't split it.
- Keep `seo.plugin.ts` an orchestrator. File writing for Markdown goes in a small `seo/markdown.ts`
  helper if the plugin grows.

## Prompt to hand off

> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/seo/README.md` (section
> 4) and `docs/plans/seo/04-ai-crawlers-llms-txt.md`, and confirm that plans 01–02 are done.
> Implement plan 04: a pure `src/features/guide/guide.markdown.ts` converter with a unit test,
> `src/seo.markdown.ts` (lesson and lab Markdown, `llms.txt`, `llms-full.txt`), writing them from
> the build plugin, the head `rel=alternate` links, `vercel.json` headers, robots.txt AI-bot groups,
> i18n keys (EN + HU) for every label, and the audit checks. Make build, tests and lint pass, show
> the first 40 lines of `dist/llms.txt`, mark plan 04 done in the README, and summarise.
