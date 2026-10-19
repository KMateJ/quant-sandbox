// Tells IndexNow engines (Bing, Yandex, Seznam, Naver) which URLs changed. Run by hand after a production
// deploy, never from the build: preview builds would announce unreleased pages.
//   npm run indexnow            URLs whose sitemap lastmod is on or after the last successful run (or all, first time)
//   npm run indexnow -- --all   every sitemap URL
//   npm run indexnow -- --dry   print what would be sent
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { BASE_URL, sitemapEntries } from "./lib/seo-dist.mjs";

// Public by design: IndexNow checks ownership by fetching public/<KEY>.txt.
const KEY = "60459a4456dc081a5d799566df2bc117";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const MAX_URLS = 10_000;
const STATE = join(dirname(fileURLToPath(import.meta.url)), "../node_modules/.cache/indexnow.json");

const args = new Set(process.argv.slice(2));
const lastRun = args.has("--all") ? undefined : await readFile(STATE, "utf8").then((s) => JSON.parse(s).lastRun, () => undefined);
const today = new Date().toISOString().slice(0, 10);

// Sitemap dates are days, so a page changed later on the day of the last run is sent again; that is harmless.
const urls = (await sitemapEntries())
  .filter((e) => !lastRun || !e.lastmod || e.lastmod >= lastRun)
  .map((e) => e.url);

console.log(`${urls.length} URL(s) ${lastRun ? `changed since ${lastRun}` : "in total"}`);
if (urls.length === 0 || args.has("--dry")) {
  urls.forEach((u) => console.log(`  ${u}`));
  process.exit(0);
}

const host = new URL(BASE_URL).host;
for (let i = 0; i < urls.length; i += MAX_URLS) {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: KEY, keyLocation: `${BASE_URL}/${KEY}.txt`, urlList: urls.slice(i, i + MAX_URLS) }),
  });
  console.log(`IndexNow: HTTP ${res.status} ${res.statusText}`);
  // 200 = accepted, 202 = accepted while the key is still being verified.
  if (res.status !== 200 && res.status !== 202) {
    console.error(await res.text());
    process.exit(1);
  }
}

await mkdir(dirname(STATE), { recursive: true });
await writeFile(STATE, JSON.stringify({ lastRun: today }));
