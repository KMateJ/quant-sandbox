import { readdir, readFile } from "node:fs/promises";
import { join, relative, resolve, dirname, sep } from "node:path";
import { fileURLToPath } from "node:url";

/// Absolute path of the built site.
export const DIST = resolve(dirname(fileURLToPath(import.meta.url)), "../../dist");

/// Site origin. Keep in sync with `BASE_URL` in `src/seo.routes.ts`.
export const BASE_URL = "https://quantsandbox.dev";

/// `{ url, lastmod? }` for each `<url>` in `dist/sitemap.xml`.
export async function sitemapEntries() {
  const xml = await readFile(join(DIST, "sitemap.xml"), "utf8");
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map(([, block]) => ({
    url: block.match(/<loc>([^<]+)<\/loc>/)[1].trim(),
    lastmod: block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1].trim(),
  }));
}

/// `<loc>` values listed in `dist/sitemap.xml`.
export async function sitemapUrls() {
  return (await sitemapEntries()).map((e) => e.url);
}

/// Path part of an absolute URL or a path (`/` for the home page).
export function urlPath(url) {
  const path = url.startsWith(BASE_URL) ? url.slice(BASE_URL.length) : url;
  return path === "" ? "/" : path;
}

/// Absolute `dist` file for a URL or path: `/` → `index.html`, `/a/b` → `a/b.html`, `/a.png` → `a.png`.
export function urlToFile(url) {
  const path = urlPath(url);
  if (path === "/") return join(DIST, "index.html");
  const parts = path.replace(/^\/|\/$/g, "").split("/");
  if (!/\.[a-z0-9]+$/i.test(parts[parts.length - 1])) parts[parts.length - 1] += ".html";
  return join(DIST, ...parts);
}

/// Reads a built page and splits it into `head` and the `#root` inner `body`.
export async function readPage(url) {
  const path = urlPath(url);
  const html = await readFile(urlToFile(path), "utf8");
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? "";
  const start = html.indexOf('<div id="root">');
  const bodyEnd = html.lastIndexOf("</body>");
  const end = html.lastIndexOf("</div>", bodyEnd);
  const body = start < 0 || end < start ? "" : html.slice(start + '<div id="root">'.length, end);
  return { url, path, html, head, body };
}

function attrRe(name) {
  return name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/// Content of `<meta {attr}="{name}" content="…">`, or `undefined`.
export function meta(head, attr, name) {
  const re = new RegExp(`<meta\\s+${attr}="${attrRe(name)}"\\s+content="([^"]*)"`);
  const m = head.match(re);
  return m ? decode(m[1]) : undefined;
}

/// Text of `<title>`, or `undefined`.
export function title(head) {
  const m = head.match(/<title>([\s\S]*?)<\/title>/);
  return m ? decode(m[1]) : undefined;
}

/// `href` of `<link rel="canonical">`, or `undefined`.
export function canonical(head) {
  return head.match(/<link\s+rel="canonical"\s+href="([^"]*)"/)?.[1];
}

/// Parsed JSON-LD blocks. Throws on invalid JSON.
export function jsonLd(head) {
  return [...head.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
}

const KINDS = { WebSite: "home", WebApplication: "lab", Course: "course", LearningResource: "lesson" };

/// Page kind from the first JSON-LD `@type`.
export function pageKind(ld) {
  const type = ld[0]?.["@type"];
  return KINDS[Array.isArray(type) ? type[0] : type] ?? "unknown";
}

function decode(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&");
}

/// Human-visible text of body HTML (scripts, styles, SVG and KaTeX MathML removed).
export function visibleText(bodyHtml) {
  const text = bodyHtml
    .replace(/<script[\s\S]*?<\/script>/g, " ")
    .replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<svg[\s\S]*?<\/svg>/g, " ")
    .replace(/<span class="katex-mathml">[\s\S]*?<\/math><\/span>/g, " ")
    .replace(/<annotation[\s\S]*?<\/annotation>/g, " ")
    .replace(/<[^>]+>/g, " ");
  return decode(text).replace(/\s+/g, " ").trim();
}

/// Number of whitespace-separated words.
export function wordCount(text) {
  return text ? text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0;
}

/// Unique internal `href="/…"` paths (query and hash stripped, assets skipped).
export function internalLinks(bodyHtml) {
  const links = new Set();
  for (const [, href] of bodyHtml.matchAll(/href="(\/[^"]*)"/g)) {
    if (href.startsWith("//")) continue;
    const path = href.replace(/[?#].*$/, "") || "/";
    if (path.startsWith("/assets/")) continue;
    const ext = path.match(/\.([a-z0-9]+)$/i)?.[1];
    if (ext && ext !== "md") continue;
    links.add(path);
  }
  return [...links];
}

/// `source` paths of the `redirects` in `vercel.json`.
export async function redirectSources() {
  const config = JSON.parse(await readFile(join(DIST, "..", "vercel.json"), "utf8"));
  return new Set((config.redirects ?? []).map((r) => r.source));
}

/// Every `.html` file under `dir` (default: the whole build), as absolute paths.
export async function htmlFiles(dir = DIST) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

/// Redirect stubs written from the registry: `{ path, html }` for each page whose head has a meta refresh.
export async function redirectStubs() {
  const stubs = [];
  for (const file of await htmlFiles()) {
    const html = await readFile(file, "utf8");
    if (!/<head>[\s\S]*http-equiv="refresh"[\s\S]*<\/head>/.test(html)) continue;
    stubs.push({ path: "/" + relative(DIST, file).split(sep).join("/").replace(/\.html$/, ""), html });
  }
  return stubs;
}

/// Script files a page fetches before it can run: the module entry plus its `modulepreload` links, as `/assets/…` paths.
export function initialScripts(html) {
  const entry = [...html.matchAll(/<script type="module"[^>]*\ssrc="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]);
  const preloads = [...html.matchAll(/<link rel="modulepreload"[^>]*\shref="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1]);
  return [...new Set([...entry, ...preloads])];
}

/// `href` of `<link rel="alternate" type="text/markdown">`, or `undefined`.
export function markdownAlternate(head) {
  return head.match(/<link\s+rel="alternate"\s+type="text\/markdown"\s+href="([^"]*)"/)?.[1];
}

/// Every `.md` twin in the build, as `{ path, text }` with `path` relative to `dist` using `/`.
export async function markdownFiles(dir = DIST) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await markdownFiles(full)));
    else if (entry.name.endsWith(".md")) out.push({ path: relative(DIST, full).split(sep).join("/"), text: await readFile(full, "utf8") });
  }
  return out;
}

/// Targets of the Markdown links `[text](url)` in a Markdown document.
export function markdownLinks(text) {
  return [...text.matchAll(/\]\((https?:\/\/[^)\s]+)\)/g)].map((m) => m[1]);
}
