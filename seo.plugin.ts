import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createServer, type Plugin } from "vite";
import { notFoundHead, pageHtml, redirectStub, seoHead } from "./seo/html.ts";
import { canDateFromGit, gitLastModified, pageSources } from "./seo/lastmod.ts";
import { sitemap } from "./seo/sitemap.ts";
import { writeMarkdown } from "./seo/markdown.ts";
import { ogIcon, ogImagePath, writeOgImages } from "./seo/ogImages.ts";
import { LANGUAGES, localizedPath, stripLanguage } from "./src/languageRoutes.ts";
import type { Alternate, MarkdownModule, OgModule, SchemaModule, SeoPage, SeoRedirect, SeoSite } from "./seo/types.ts";

type RenderModule = { renderPage: (url: string) => Promise<string> };
type RegistryModule = { redirects: SeoRedirect[] };

// `SEO_ALLOW_EMPTY=1` ships pages whose pre-render failed instead of failing the build (local debugging only).
const ALLOW_EMPTY = process.env.SEO_ALLOW_EMPTY === "1";

const RENDER_TIMEOUT_MS = 20_000;

// CommonJS packages whose named imports Node's ESM loader cannot see; re-exported via `require`.
const CJS_NAMED_EXPORTS: Record<string, string[]> = { "react-katex": ["BlockMath", "InlineMath"] };

function cjsInterop(root: string): Plugin {
  const prefix = "\0cjs-interop:";
  return {
    name: "quant-sandbox-ssr-cjs-interop",
    enforce: "pre",
    resolveId: (id) => (id in CJS_NAMED_EXPORTS ? prefix + id : undefined),
    load(id) {
      if (!id.startsWith(prefix)) return;
      const pkg = id.slice(prefix.length);
      const names = CJS_NAMED_EXPORTS[pkg].map((name) => `export const ${name} = mod.${name};`);
      return [
        `import { createRequire } from "node:module";`,
        `const mod = createRequire(${JSON.stringify(join(root, "package.json"))})(${JSON.stringify(pkg)});`,
        ...names,
        `export default mod;`,
      ].join("\n");
    },
  };
}

/// Pre-renders one route; a failure or timeout returns "", which fails the build unless `SEO_ALLOW_EMPTY=1`.
async function renderBody(render: RenderModule, path: string): Promise<string> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`timed out after ${RENDER_TIMEOUT_MS} ms`)), RENDER_TIMEOUT_MS);
  });
  try {
    return await Promise.race([render.renderPage(path), timeout]);
  } catch (error) {
    console.warn(`seo: could not pre-render ${path}: ${(error as Error).message}`);
    return "";
  } finally {
    clearTimeout(timer);
  }
}

/// `hreflang` links for every page that exists in all languages (keyed by page path); the default
/// language also answers `x-default`. A page missing in some language gets none.
function languageAlternates(versions: { language: string; pages: SeoPage[] }[], site: SeoSite): Map<string, Alternate[]> {
  const byBase = new Map<string, { language: string; path: string }[]>();
  for (const { language, pages } of versions) {
    for (const { path } of pages) byBase.set(stripLanguage(path), [...(byBase.get(stripLanguage(path)) ?? []), { language, path }]);
  }
  const url = (path: string) => new URL(path, site.BASE_URL).toString();
  const result = new Map<string, Alternate[]>();
  for (const group of byBase.values()) {
    if (group.length < versions.length) continue;
    const links = [
      ...group.map((v) => ({ hreflang: v.language, url: url(v.path) })),
      { hreflang: "x-default", url: url(group[0].path) },
    ];
    for (const v of group) result.set(v.path, links);
  }
  return result;
}

/// After the client build, writes `<route>.html` for every page in the app's SEO page list —
/// pre-rendered content, its own title, description, canonical, Open Graph and structured
/// data — plus `sitemap.xml`, so crawlers and link previews need no JavaScript.
export function seoPages(): Plugin {
  let root = process.cwd();
  let outDir = "dist";
  return {
    name: "quant-sandbox-seo-pages",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = join(config.root, config.build.outDir);
    },
    async closeBundle() {
      const server = await createServer({
        root,
        configFile: false,
        // A private cache and no dep pre-bundling, so a running dev server's cache is untouched.
        cacheDir: "node_modules/.vite-seo",
        optimizeDeps: { noDiscovery: true, include: [] },
        logLevel: "error",
        server: { middlewareMode: true, hmr: false },
        appType: "custom",
        plugins: [cjsInterop(root)],
        // Route these through the interop plugin instead of Node's ESM loader.
        ssr: { noExternal: Object.keys(CJS_NAMED_EXPORTS) },
      });
      try {
        const site = (await server.ssrLoadModule("/src/seo.routes.ts")) as SeoSite;
        const { structuredData } = (await server.ssrLoadModule("/src/seo.schema.ts")) as SchemaModule;
        const { allMarkdown } = (await server.ssrLoadModule("/src/seo.markdown.ts")) as MarkdownModule;
        const { ogTextsFor } = (await server.ssrLoadModule("/src/seo.og.ts")) as OgModule;
        const { redirects } = (await server.ssrLoadModule("/src/modules/registry.ts")) as RegistryModule;
        const { notFoundEn } = await server.ssrLoadModule("/src/Language/NotFound.ts");
        const render = await server.ssrLoadModule("/src/entry-prerender.tsx").then(
          (mod) => mod as RenderModule,
          (error: Error) => {
            if (!ALLOW_EMPTY) throw new Error(`seo: the app could not be loaded for pre-rendering: ${error.message}`);
            console.warn(`seo: pre-rendering disabled, the app could not be loaded: ${error.message}`);
            return { renderPage: async () => "" } satisfies RenderModule;
          }
        );
        const pagesByLanguage = await Promise.all(LANGUAGES.map(async (language) => ({ language, pages: await site.seoPagesFor(language) })));
        const pages = pagesByLanguage.flatMap((l) => l.pages);
        const alternates = languageAlternates(pagesByLanguage, site);
        const markdown = await allMarkdown();
        const twins = new Set(markdown.pages.map((p) => p.path));
        // Git date per page; undefined in a shallow clone or when no source file is known.
        const dated = canDateFromGit(root);
        const modified = new Map(
          pages.map((p) => {
            const sources = dated ? pageSources(root, stripLanguage(p.path)) : [];
            return [p.path, sources.length ? gitLastModified(root, sources) : undefined];
          })
        );
        const template = await readFile(join(outDir, "index.html"), "utf8");
        // `/x/y` → `x/y.html`, served at the extensionless path by Vercel's `cleanUrls`.
        const write = async (path: string, html: string) => {
          const file = join(outDir, path === "/" ? "index.html" : `${path}.html`);
          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, html);
        };
        const empty: string[] = [];
        // One at a time: the pre-renderer switches the shared i18next language per page.
        for (const page of pages) {
          const body = await renderBody(render, page.path);
          if (!body) empty.push(page.path);
          const jsonLd = structuredData(page, site, { dateModified: modified.get(page.path) });
          const head = seoHead(page, site, jsonLd, twins.has(page.path), alternates.get(page.path));
          await write(page.path, pageHtml(template, head, body, page.language));
        }
        // Any unknown path hits the `*` route, which renders <NotFound>.
        const notFoundBody = await renderBody(render, "/__not-found");
        if (!notFoundBody) empty.push("/404");
        await write("/404", pageHtml(template, notFoundHead(site, notFoundEn.notFoundTitle), notFoundBody));
        if (empty.length && !ALLOW_EMPTY) throw new Error(`seo: these pages pre-rendered empty: ${empty.join(", ")}`);

        const pagePaths = new Set(pages.map((p) => p.path));
        const stubs = LANGUAGES.flatMap((language) =>
          redirects.map((r) => ({ from: localizedPath(r.from, language), to: localizedPath(r.to, language) }))
        ).filter((r) => !pagePaths.has(r.from));
        for (const redirect of stubs) await write(redirect.from, redirectStub(redirect, site));

        const today = new Date().toISOString().slice(0, 10);
        const entries = pages.map((p) => ({
          url: new URL(p.path, site.BASE_URL).toString(),
          lastmod: dated ? modified.get(p.path) || today : undefined,
          alternates: alternates.get(p.path),
        }));
        await writeFile(join(outDir, "sitemap.xml"), sitemap(entries));
        await writeMarkdown(outDir, markdown);

        // Preview images: `og/<path>.png` per page, plus `og.png` (path "") as the site-wide fallback.
        const icon = await ogIcon(root);
        const cards = (
          await Promise.all(
            LANGUAGES.map(async (language, i) => {
              const og = await ogTextsFor(language);
              // The site-wide fallback card (path "") is written once, from the first language.
              return og.cards
                .filter(({ path }) => i === 0 || path)
                .map(({ path, ...text }) => ({
                  file: path ? ogImagePath(path).slice(1) : "og.png",
                  card: { ...text, site: site.SITE_NAME, tagline: og.tagline, icon },
                }));
            })
          )
        ).flat();
        await writeOgImages(cards, { root, outDir });
        console.log(`seo: wrote ${pages.length} pages, 404.html, ${stubs.length} redirect stubs, sitemap.xml, ${twins.size} Markdown twins, llms.txt and llms-full.txt`);
      } finally {
        await server.close();
      }
    },
  };
}
