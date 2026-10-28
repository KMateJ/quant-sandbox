import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";
import { test } from "node:test";
import {
  DIST, BASE_URL, sitemapUrls, urlPath, urlToFile, readPage, meta, title, canonical, jsonLd, pageKind,
  visibleText, wordCount, internalLinks, redirectSources, htmlFiles, redirectStubs, initialScripts,
  markdownAlternate, markdownFiles, markdownLinks,
} from "./lib/seo-dist.mjs";

// Run `npm run build` first; this suite only reads `dist/`.
const urls = await sitemapUrls();
const isHungarianUrl = (url) => /^\/hu(\/|$)/.test(url.slice(BASE_URL.length));
const stubs = await redirectStubs();
const pages = await Promise.all(urls.filter((u) => existsSync(urlToFile(u))).map(readPage));
for (const p of pages) {
  try {
    p.ld = jsonLd(p.head);
  } catch (e) {
    p.ld = [];
    p.ldError = e.message;
  }
  p.kind = pageKind(p.ld);
  p.words = wordCount(visibleText(p.body));
}

const isHungarian = (path) => /^\/hu(\/|$)/.test(path);
/// Path without the `/hu` prefix, so a baseline entry covers both language versions.
const basePath = (path) => path.replace(/^\/hu(?=\/|$)/, "") || "/";

function duplicates(values) {
  const seen = new Map();
  values.forEach(([path, v]) => seen.set(v, [...(seen.get(v) ?? []), path]));
  return [...seen.values()].filter((paths) => paths.length > 1);
}

test("sitemap URLs are absolute and map to built pages", () => {
  assert.ok(urls.length > 0, "sitemap is empty");
  const bad = urls.filter((u) => !u.startsWith(BASE_URL) || !existsSync(urlToFile(u)));
  assert.deepEqual(bad, [], "sitemap URLs without a page");
});

test("every built page is in the sitemap", async () => {
  const listed = new Set([...urls, ...stubs.map((s) => s.path)].map(urlToFile));
  const orphans = (await htmlFiles())
    .filter((f) => !/^(google.*|404)\.html$/.test(relative(DIST, f)))
    .filter((f) => !listed.has(f))
    .map((f) => relative(DIST, f));
  assert.deepEqual(orphans, [], "pages missing from the sitemap");
});

// Pages failing a rule on the 2026-10-19 baseline. The rule is enforced for every other page and these
// are reported as todo; delete entries as they get fixed.
const KNOWN = {
  h1: [],
  title: ["/treasury-futures", "/random-walk", "/guide/derivatives", "/guide/portfolio",
    "/guide/portfolio/returns-volatility", "/guide/portfolio/diversification", "/guide/portfolio/efficient-frontier",
    "/guide/portfolio/performance-measures", "/guide/fixed-income", "/guide/fixed-income/yield-curve",
    "/guide/fixed-income/credit-risk", "/guide/corporate", "/guide/stochastic",
    // Hungarian-only: the translated lesson titles run longer.
    "/hu/guide/derivatives/static-replication", "/hu/guide/stochastic/mean-reversion", "/hu/guide/stochastic/probability-spaces",
    "/hu/guide/derivatives/options-on-other-underlyings", "/hu/guide/portfolio/portfolio-constraints", "/hu/guide/fixed-income/curve-risk",
    "/hu/guide/corporate/capital-budgeting-risk", "/hu/guide/corporate/dividend-policy", "/hu/guide/stochastic/law-of-large-numbers-clt"],
  description: ["/", "/payoff", "/delta-hedging", "/efficient-frontier", "/guide/portfolio"],
};

/// One enforced test for `rule` (returns offending paths) plus a todo test for its KNOWN baseline.
function audit(name, key, reason, rule) {
  const known = (p) => KNOWN[key].includes(p) || KNOWN[key].includes(basePath(p));
  test(name, () => assert.deepEqual(rule().filter((p) => !known(p)), [], name));
  test(`${name} (known baseline)`, { todo: reason }, () => assert.deepEqual(rule().filter(known), [], name));
}

audit("pages have exactly one h1", "h1", "studio lessons render no h1", () =>
  pages.filter((p) => (p.body.match(/<h1[\s>]/g) ?? []).length !== 1).map((p) => p.path));

audit("titles exist and are at most 70 characters", "title", "guide tracks and some lessons are too long", () =>
  pages.filter((p) => !title(p.head) || title(p.head).length > 70).map((p) => p.path));

audit("descriptions are 50-160 characters", "description", "over 160 characters", () => {
  const desc = (p) => meta(p.head, "name", "description");
  return pages.filter((p) => !desc(p) || desc(p).length < 50 || desc(p).length > 160).map((p) => p.path);
});

test("titles and descriptions are unique", () => {
  const long = pages.filter((p) => (title(p.head)?.length ?? 0) > 60);
  if (long.length) console.warn(`titles over 60 chars:\n${long.map((p) => `  ${title(p.head).length} ${p.path}`).join("\n")}`);
  // Unique within a language; the same text in both languages only warns (an untranslated string).
  for (const hu of [false, true]) {
    const group = pages.filter((p) => isHungarian(p.path) === hu);
    assert.deepEqual(duplicates(group.map((p) => [p.path, title(p.head)])), [], "pages sharing a title");
    assert.deepEqual(duplicates(group.map((p) => [p.path, meta(p.head, "name", "description")])), [], "pages sharing a description");
  }
  const crossLanguage = duplicates(pages.map((p) => [p.path, title(p.head)]));
  if (crossLanguage.length) console.warn(`titles identical in both languages:\n${crossLanguage.map((g) => `  ${g.join(" = ")}`).join("\n")}`);
});

test("canonical and og:url match the page URL", () => {
  const bad = pages
    .filter((p) => {
      const want = BASE_URL + p.path;
      return canonical(p.head) !== want || meta(p.head, "property", "og:url") !== want;
    })
    .map((p) => p.path);
  assert.deepEqual(bad, [], "pages with a wrong canonical or og:url");
});

test("JSON-LD parses and declares schema.org context and type", () => {
  const bad = pages
    .filter((p) => p.ldError || p.ld.length === 0 || p.ld.some((b) => b["@context"] !== "https://schema.org" || !b["@type"]))
    .map((p) => (p.ldError ? `${p.path}: ${p.ldError}` : p.path));
  assert.deepEqual(bad, [], "pages with missing or invalid JSON-LD");
});

test("FAQPage markup matches the FAQ visible on the page", () => {
  const bad = [];
  for (const p of pages) {
    const shown = p.body.includes("module-about-faq");
    const faq = p.ld.find((b) => b["@type"] === "FAQPage");
    if (shown !== Boolean(faq)) bad.push(`${p.path}: ${shown ? "FAQ without FAQPage" : "FAQPage without a visible FAQ"}`);
    const text = visibleText(p.body);
    for (const q of faq?.mainEntity ?? []) if (!text.includes(q.name)) bad.push(`${p.path}: "${q.name}" not visible`);
  }
  assert.deepEqual(bad, [], "pages whose FAQPage and visible FAQ differ");
});

test("the Organization is defined inline at most once per page", () => {
  const bad = pages.filter((p) => JSON.stringify(p.ld).split('"@type":"Organization"').length - 1 > 1).map((p) => p.path);
  assert.deepEqual(bad, [], "pages repeating the Organization");
});

// Plan 07 (2026-10-19): thinnest lab 440 words (/delta-hedging), about 10% below.
const MIN_WORDS = { lab: 400, lesson: 250, course: 150, home: 300 };

test("lab About sections link to their lessons", () => {
  const bad = pages
    .filter((p) => p.kind === "lab" && p.body.includes('class="module-about"'))
    .filter((p) => !p.body.slice(p.body.indexOf('class="module-about"')).match(/href="(\/hu)?\/guide\//))
    .map((p) => p.path);
  assert.deepEqual(bad, [], "labs whose About section links to no lesson");
});

test("body has enough words for its page kind", () => {
  const thin = [...pages].sort((a, b) => a.words - b.words).slice(0, 10);
  console.log(`thinnest pages:\n${thin.map((p) => `  ${String(p.words).padStart(5)} ${p.kind.padEnd(7)} ${p.path}`).join("\n")}`);
  const bad = pages.filter((p) => p.kind === "unknown" || p.words < MIN_WORDS[p.kind]).map((p) => `${p.path} (${p.kind}, ${p.words})`);
  assert.deepEqual(bad, [], "pages below the word minimum");
});

test("internal links resolve", async () => {
  const known = new Set(urls.map(urlPath));
  const redirects = new Set([...(await redirectSources()), ...stubs.map((s) => s.path)]);
  const bad = [];
  for (const p of pages) {
    for (const link of internalLinks(p.body)) {
      const ok = known.has(link) || redirects.has(link) || (link.endsWith(".md") && existsSync(urlToFile(link)));
      if (!ok) bad.push(`${p.path} → ${link}`);
    }
  }
  assert.deepEqual(bad, [], "broken internal links");
});

test("Hungarian pages link only to Hungarian pages", () => {
  const bad = pages
    .filter((p) => isHungarian(p.path))
    .flatMap((p) => internalLinks(p.body).filter((link) => !isHungarian(link)).map((link) => `${p.path} → ${link}`));
  assert.deepEqual(bad, [], "links that drop the /hu prefix");
});

test("og images exist", () => {
  const exists = (img) => img?.startsWith(BASE_URL) && existsSync(urlToFile(img));
  const bad = pages
    .filter((p) => !exists(meta(p.head, "property", "og:image")) || !exists(meta(p.head, "name", "twitter:image")))
    .map((p) => p.path);
  assert.deepEqual(bad, [], "pages with a missing og:image or twitter:image file");
});

test("og images are 1200x630 PNGs of a sensible size, one per page", async () => {
  const bad = [];
  const owners = new Map();
  for (const p of pages) {
    const img = meta(p.head, "property", "og:image");
    if (meta(p.head, "property", "og:image:width") !== "1200" || meta(p.head, "property", "og:image:height") !== "630") bad.push(`${p.path}: og:image size tags`);
    if (meta(p.head, "name", "twitter:image") !== img) bad.push(`${p.path}: twitter:image differs from og:image`);
    owners.set(img, [...(owners.get(img) ?? []), p.path]);
    const file = await readFile(urlToFile(img)).catch(() => undefined);
    if (!file) continue;
    const isPng = file.subarray(0, 4).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47]));
    if (!isPng) bad.push(`${p.path}: not a PNG`);
    else if (file.readUInt32BE(16) !== 1200 || file.readUInt32BE(20) !== 630) bad.push(`${p.path}: not 1200x630`);
    if (file.length < 5_000 || file.length > 300_000) bad.push(`${p.path}: ${file.length} bytes`);
  }
  assert.deepEqual(bad, [], "pages with a bad og:image");
  assert.deepEqual([...owners].filter(([, paths]) => paths.length > 1).map(([img, paths]) => `${img}: ${paths.join(", ")}`), [], "pages sharing an og:image");
});

test("html lang matches the page language", () => {
  const bad = pages
    .filter((p) => p.html.match(/<html[^>]*\slang="([^"]*)"/)?.[1] !== (isHungarian(p.path) ? "hu" : "en"))
    .map((p) => p.path);
  assert.deepEqual(bad, [], "pages with a wrong <html lang>");
});

test("404.html is a noindex page with one h1, outside the sitemap", async () => {
  assert.ok(existsSync(urlToFile("/404")), "dist/404.html is missing");
  const page = await readPage("/404");
  assert.equal(meta(page.head, "name", "robots"), "noindex");
  assert.equal(canonical(page.head), undefined, "404 has a canonical");
  assert.equal((page.body.match(/<h1[\s>]/g) ?? []).length, 1, "404 needs exactly one h1");
  assert.ok(!urls.map(urlPath).includes("/404"), "404 is listed in the sitemap");
});

test("redirect stubs refresh to a built page and are noindex", () => {
  assert.ok(stubs.some((s) => s.path === "/guide"), "no stub for /guide");
  const known = new Set(urls.map(urlPath));
  const bad = stubs
    .filter((s) => {
      const target = s.html.match(/http-equiv="refresh" content="0; url=([^"]+)"/)?.[1];
      return !known.has(target) || !s.html.includes('<meta name="robots" content="noindex"');
    })
    .map((s) => s.path);
  assert.deepEqual(bad, [], "stubs with a bad target or no noindex");
  assert.deepEqual(stubs.filter((s) => known.has(s.path)).map((s) => s.path), [], "stubs shadowing a page");
});

// Plan 06 (2026-10-19): 867 KB once Hungarian moved to its own chunk, down from 1,117 KB; budget = that + 10%.
// Market-making 01 (2026-10-28): six microstructure modules add ~20 KB of eager EN About/SEO copy.
const INITIAL_JS_BUDGET = 1_000_000;

test("initial JS stays within budget and ships no Hungarian table", async () => {
  const { html } = await readPage("/");
  const files = initialScripts(html).map((src) => join(DIST, src));
  assert.ok(files.length > 0, "no module entry found in index.html");
  const sizes = await Promise.all(files.map((f) => stat(f).then((s) => s.size)));
  const total = sizes.reduce((a, b) => a + b, 0);
  console.log(`initial JS: ${total} B in ${files.length} files (budget ${INITIAL_JS_BUDGET})`);
  assert.ok(total <= INITIAL_JS_BUDGET, `initial JS is ${total} B, budget ${INITIAL_JS_BUDGET} B`);
  const withHu = [];
  for (const f of files) if ((await readFile(f, "utf8")).includes("Útmutató")) withHu.push(relative(DIST, f));
  assert.deepEqual(withHu, [], "initial chunks containing the Hungarian table");
});

// Plan 04: Markdown twins and llms.txt for AI crawlers.
const twins = await markdownFiles();
const llms = await readFile(join(DIST, "llms.txt"), "utf8");

test("markdown alternates resolve to a built twin", () => {
  const bad = pages
    .filter((p) => markdownAlternate(p.head))
    .filter((p) => markdownAlternate(p.head) !== `${BASE_URL}${p.path}.md` || !existsSync(urlToFile(markdownAlternate(p.head))))
    .map((p) => p.path);
  assert.ok(pages.some((p) => markdownAlternate(p.head)), "no page links a Markdown twin");
  assert.deepEqual(bad, [], "pages whose Markdown alternate is wrong or missing");
});

test("markdown twins have a title, real content and no leaked values", () => {
  assert.ok(twins.length > 0, "no .md files in dist");
  const bad = twins
    .filter(({ text }) => !text.startsWith("# ") || wordCount(text) < 150 || /undefined|\[object Object\]/.test(text))
    .map(({ path, text }) => `${path} (${wordCount(text)} words)`);
  assert.deepEqual(bad, [], "twins that are untitled, thin or contain undefined");
});

test("llms.txt links resolve and list every guide lesson", () => {
  assert.ok(llms.startsWith("# "), "llms.txt has no H1");
  const links = markdownLinks(llms);
  assert.deepEqual(links.filter((l) => !l.startsWith(BASE_URL) || !existsSync(urlToFile(l))), [], "llms.txt links to missing files");
  const listed = new Set(links.map((l) => urlPath(l).replace(/\.md$/, "")));
  const lessons = pages.filter((p) => p.kind === "lesson" && p.path.startsWith("/guide/")).map((p) => p.path);
  assert.ok(lessons.length > 0, "no guide lessons found");
  assert.deepEqual(lessons.filter((p) => !listed.has(p)), [], "guide lessons missing from llms.txt");
});

test("every page links its language versions with hreflang", () => {
  const listed = new Set(urls);
  const bad = [];
  const byUrl = new Map(pages.map((p) => [BASE_URL + p.path, p]));
  for (const p of pages) {
    const links = [...p.head.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]);
    const langs = links.map(([lang]) => lang).sort().join(",");
    if (langs !== "en,hu,x-default") bad.push(`${p.path}: hreflang ${langs || "missing"}`);
    for (const [lang, href] of links) {
      if (!listed.has(href)) bad.push(`${p.path}: ${lang} → ${href} not in sitemap`);
      const target = byUrl.get(href);
      if (target && !target.head.includes(`hreflang="${lang === "x-default" ? "x-default" : isHungarian(p.path) ? "hu" : "en"}" href="${BASE_URL + p.path}"`) && lang !== "x-default") {
        bad.push(`${p.path}: ${href} does not link back`);
      }
    }
  }
  assert.deepEqual(bad, [], "pages with missing or one-way hreflang");
});

test("the sitemap lists both languages, each URL with three alternates", async () => {
  const xml = await readFile(join(DIST, "sitemap.xml"), "utf8");
  const blocks = xml.split("<url>").slice(1);
  assert.equal(urls.filter(isHungarianUrl).length * 2, urls.length, "Hungarian pages should be half the sitemap");
  const bad = blocks.filter((b) => (b.match(/<xhtml:link /g) ?? []).length !== 3).map((b) => b.match(/<loc>([^<]+)/)?.[1]);
  assert.deepEqual(bad, [], "sitemap URLs without three xhtml:link alternates");
});
