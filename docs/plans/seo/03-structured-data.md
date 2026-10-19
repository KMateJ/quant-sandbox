# 03 — Structured data: a pure schema module, FAQPage, Organization, richer lessons

Status: done (2026-10-19) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why

JSON-LD is how search engines and AI systems learn what a page *is* (a course, a lesson, a free web
tool, an FAQ) and how pages relate. The site already emits basic JSON-LD, but the code is
hard-coded inside the build plugin, can't be unit-tested, and leaves out data we already have: the
module FAQs, the publisher identity, and modification dates. Being honest about the payoff: Google
shows FAQ rich results only for authoritative government and health sites since 2023, so FAQPage
mostly helps Bing and AI answer engines (which read JSON-LD) rather than producing Google snippets.
Course markup can still earn Google course-list results.

## Current state (verified 2026-10-19)

- `seo.plugin.ts` → `function structuredData(page: SeoPage, site: SeoModule): object[]` (about lines
  48–112). It returns:
  - home (`page.path === "/"`): `WebSite {name, url, description}`.
  - module with lessons (`page.lessons`): `Course {name, description, url, inLanguage:"en",
    isAccessibleForFree, provider: Organization, hasPart: LearningResource[]}` + `BreadcrumbList`
    (2 items).
  - lesson (`page.parent`): `LearningResource {…, learningResourceType:"Interactive lesson",
    isPartOf: Course}` + `BreadcrumbList` (3 items).
  - everything else: `WebApplication {name, description, url,
    applicationCategory:"EducationalApplication", operatingSystem:"Any", isAccessibleForFree}`.
- `pageHtml()` serialises each object into `<script type="application/ld+json">` with
  `JSON.stringify(data).replace(/</g, "\\u003c")`.
- The plugin has its own copy of the `SeoPage` type (top of file) that duplicates the exported type
  in `src/seo.routes.ts`. This violates DRY.
- `src/seo.routes.ts`: `SeoPage = {path, title, description, parent?, lessons?}`.
  `seoPages(t, english)` maps `modules` (registry) to pages. `SITE_NAME = "Quant Sandbox"`,
  `BASE_URL = "https://quantsandbox.dev"`.
- FAQ data: `ModuleDef.about?: ModuleAbout` (`src/modules/registry.ts`), where
  `ModuleAbout = {intro: TranslationKey, faq: {question, answer}[]}` (`src/modules/moduleAbout.ts`).
  `moduleAbout(prefix, faqCount = 2)` builds keys like `aboutWaccQ1`/`aboutWaccA1` that live in
  `src/Language/ModuleAbout.ts`. The FAQ is **visible** on the module's own page only
  (`ModuleAboutSection.tsx` returns null when `pathname !== path`). All 5 guide-track modules share
  `moduleAbout("Guide")` (`guideModule()` in the registry), so they show the same FAQ.
- Git remote: `https://github.com/KMateJ/quant-sandbox` (usable as `sameAs`).
- After plan 02, a `seo/` helper folder exists at the repo root, and `seo/lastmod.ts` computes a
  per-page date. It may be `undefined` on shallow clones.
- Test helper: `scripts/lib/load-ts.mjs` → `importSrc("relative/to/src.ts")` transpiles TS under
  `src/` (type-only imports are dropped), so a pure module in `src/` can be unit-tested with
  `node:test`.

## Goal

1. Move structured-data generation to **`src/seo.schema.ts`**: pure, with no React and no Node APIs,
   importing only types from `./seo.routes`. The plugin imports it. Delete the duplicated types from
   the plugin and import `SeoPage` from `src/seo.routes.ts` instead (type import).
2. Add:
   - **Home:** `WebSite` + `Organization` (`name`, `url`, `logo` =
     `https://quantsandbox.dev/android-chrome-512x512.png`, `sameAs: [GitHub repo URL]`). Link
     them with `@id`s: `"<BASE_URL>/#website"` and `"<BASE_URL>/#organization"`, and set
     `publisher: {"@id": "…#organization"}` on the WebSite. Use the same `@id` reference as
     `provider` and `publisher` on every other page, instead of repeating the inline object.
   - **Labs (`WebApplication`):** `offers: {"@type":"Offer","price":"0","priceCurrency":"USD"}`,
     `inLanguage`, `publisher` @id ref, `dateModified` when known, plus a `BreadcrumbList`
     (Home → category label → tool) when the module has a category. Get the category label from
     `CATEGORY_LABEL_KEYS` (registry) via `t()`. This needs a new optional `category` field on
     `SeoPage` (see step 3).
   - **FAQPage** on any page whose `SeoPage` carries `faq` (module pages only, matching what's
     visible): `{"@type":"FAQPage","mainEntity":[{"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}]}`.
   - **Course:** `offers` (free, as above) and
     `hasCourseInstance: {"@type":"CourseInstance","courseMode":"Online"}`. Keep `hasPart`.
   - **LearningResource:** `dateModified` when known, `publisher` @id ref, and `isPartOf` as now.
     Keep `learningResourceType`.
3. Extend `SeoPage` in `src/seo.routes.ts` with optional fields that are filled **only from existing
   registry data** (DRY):
   - `faq?: { question: string; answer: string }[]`, from `m.about?.faq` through `t()`, on the
     module page only (not on lessons).
   - `category?: { key: string; title: string }`, from `m.category` + `t(CATEGORY_LABEL_KEYS[...])`.
   - Don't add `dateModified` to `SeoPage`. The plugin passes it as a second argument
     (`structuredData(page, site, { dateModified })`), because it's computed with git at build time.

## Non-goals

- No `aggregateRating` / `review` (we have none, and faking them is against Google's policies).
- No `SearchAction` (the site has no search URL).
- No change to visible UI.

## Constraints

CLAUDE.md: separation of concerns (pure `.ts`, no React, no `node:*` in `src/seo.schema.ts`), DRY
(one `SeoPage` type, one `@id` constant), `///` doc comments on exports. `src/seo.routes.ts` is
also imported by the client (`src/seo.tsx`), so keep it free of Node APIs.

## Steps

1. Create `src/seo.schema.ts`:
   ```ts
   import type { SeoPage } from "./seo.routes";

   export type SiteInfo = { BASE_URL: string; SITE_NAME: string };
   export type SchemaExtras = { dateModified?: string };

   /// schema.org JSON-LD objects for one page: …
   export function structuredData(page: SeoPage, site: SiteInfo, extras: SchemaExtras = {}): object[]
   ```
   Internally split it into small helpers (`organization()`, `website()`, `breadcrumbs(items)`,
   `faqPage(faq)`, `course()`, `lesson()`, `webApp()`). Export `ORG_ID(site)` and
   `WEBSITE_ID(site)` helpers or constants. Add the GitHub URL as a named constant.
   Don't import `BASE_URL` / `SITE_NAME` directly. Take `site` as a parameter so tests can pass
   their own.
2. In `src/seo.routes.ts`, add `faq?` and `category?` to `SeoPage` (with `///` comments) and fill
   them in `seoPages()`. Import `CATEGORY_LABEL_KEYS` from `./modules/registry`, where it's already
   exported.
3. In `seo.plugin.ts`:
   - Delete the local `SeoLink`/`SeoPage` types and `structuredData()`. Use
     `import type { SeoPage } from "./src/seo.routes"`. Load the schema module at build time with
     `server.ssrLoadModule("/src/seo.schema.ts")`, the same way `seo.routes.ts` is loaded, so it's
     resolved through Vite.
   - Pass `{ dateModified }` from plan 02's lastmod helper.
4. Unit test `scripts/seo-schema.test.mjs` (npm script `test:seo-schema`). Use
   `importSrc("seo.schema.ts")` with hand-made `SeoPage` objects and assert that:
   - the home page returns WebSite + Organization with matching `@id`s;
   - a page with `faq` returns an FAQPage whose `mainEntity.length` equals the faq length;
   - a lesson returns LearningResource + a 3-item BreadcrumbList;
   - `JSON.stringify` of every object contains no `undefined` values (omit absent fields instead of
     emitting `undefined` or `null`).
5. Extend `scripts/seo-audit.test.mjs` (plan 01). For every page whose `pageKind` is `lab` and
   whose body contains `module-about-faq`, the JSON-LD must include an `FAQPage` whose question
   names all appear in the visible text (Google's rule: the marked-up FAQ must be visible). Also
   check that no JSON-LD block contains `"@type":"Organization"` inline more than once per page
   (the @id refs keep it single).

## Acceptance criteria

- `src/seo.schema.ts` has no imports besides types and no `window`/`document`/`node:*` use.
- `seo.plugin.ts` no longer defines `structuredData` or its own `SeoPage`.
- `npm run build && npm run test:seo && npm run test:seo-schema && npm run lint` all pass.
- `dist/wacc.html` contains `WebApplication`, `BreadcrumbList` and `FAQPage`. `dist/index.html`
  contains `WebSite` and `Organization`. A guide lesson contains `LearningResource`.
- Paste `dist/wacc.html` source into https://validator.schema.org/: no errors. (Manual. Record the
  result in "Findings".)

## Verification

```bash
npm run build
npm run test:seo
npm run test:seo-schema
npm run lint
```

## Pitfalls

- `importSrc` resolves relative imports by appending `.ts`. Keep `seo.schema.ts` importing only
  **types** from `./seo.routes` (as `import type`), otherwise the loader pulls in the registry and
  React.
- The Hungarian edition (plan 08) will call `structuredData` per language. Take `inLanguage` from
  the page (add `language?: string` to `SeoPage` defaulting to `"en"` **only if** plan 08 is already
  done; otherwise hard-code `"en"` in one constant so plan 08 changes a single place).
- Keep the `<` → `<` escaping when serialising. It stays in the plugin's `pageHtml`.
- Guide tracks share the "Guide" FAQ. That's acceptable because it's visible on each, but don't
  invent per-track FAQs here (plan 07 owns content).

## Findings (fill in during execution)

- validator.schema.org result: **not run yet (manual step)**. Paste `dist/wacc.html` and record it here.
- Deviation: `SeoPage` lives in an import-free `src/seo.types.ts` (re-exported by `seo.routes.ts`).
  Importing it from `seo.routes.ts` into the plugin dragged the whole app (JSX) into
  `tsconfig.node.json`. Plan 02's `seo/structuredData.ts` was deleted; `seo/types.ts` re-exports
  the shared type and `seoHead()` now takes the JSON-LD blocks as an argument.
- `SeoPage.category` also carries `path` (the first module of the category, where the top-nav tab
  links), because a non-final BreadcrumbList item needs a URL. When that path is the page itself
  (e.g. `/payoff`), the category crumb is left out.
- `dateModified` comes from plan 02's git dates and is set on labs and lessons only. It is absent
  for course pages, the home page, and shallow clones (e.g. Vercel).
- FAQPage is emitted on module pages with an `about` FAQ: labs and the 5 guide tracks. The audit
  checks both directions (a visible FAQ ⇔ FAQPage, and every question name is in the visible text).
- `npm run lint` has 15 errors in files this plan doesn't touch (view hooks, `theme.tsx`,
  `i18n.tsx`). The plan's own files lint clean.

## Prompt to hand off

> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/seo/README.md` (section
> 4) and `docs/plans/seo/03-structured-data.md`, and confirm that plans 01 and 02 are marked done.
> Implement plan 03: move JSON-LD generation into a pure `src/seo.schema.ts`, remove the duplicated
> types from `seo.plugin.ts`, add Organization/WebSite @ids, FAQPage, breadcrumbs for labs, offers
> on Course/WebApplication and dateModified, extend `SeoPage` with `faq`/`category` from registry
> data, and add the unit test plus the audit checks. Make `npm run build`, `npm run test:seo`,
> `npm run test:seo-schema` and `npm run lint` pass, mark plan 03 done in the README table, and
> summarise.
