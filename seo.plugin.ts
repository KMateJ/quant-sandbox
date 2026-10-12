import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createServer, type Plugin } from "vite";

type SeoPage = { path: string; title: string; description: string };
type SeoModule = { englishSeoPages: () => SeoPage[]; BASE_URL: string; SITE_NAME: string };

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Head tags that differ per page; stripped from the template and written fresh.
const PER_PAGE_TAGS = [
  /<title>[\s\S]*?<\/title>\s*/,
  /<meta\s+name="description"[\s\S]*?\/>\s*/,
  /<link\s+rel="canonical"[^>]*>\s*/,
  /<meta\s+property="og:(title|description|url)"[\s\S]*?\/>\s*/g,
  /<meta\s+name="twitter:(title|description)"[\s\S]*?\/>\s*/g,
];

function pageHtml(template: string, page: SeoPage, site: SeoModule): string {
  const title = escape(`${page.title} | ${site.SITE_NAME}`);
  const description = escape(page.description);
  const url = escape(new URL(page.path, site.BASE_URL).toString());
  const head = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
  ].join("\n    ");
  const stripped = PER_PAGE_TAGS.reduce((html, pattern) => html.replace(pattern, ""), template);
  return stripped.replace(/\s*<\/head>/, `\n    ${head}\n  </head>`);
}

function sitemap(pages: SeoPage[], baseUrl: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.map((p) => `  <url>\n    <loc>${escape(new URL(p.path, baseUrl).toString())}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

/// After the client build, writes `<route>.html` for every page in the app's SEO
/// page list (own title, description, canonical, Open Graph) plus `sitemap.xml`, so
/// crawlers and link previews get correct metadata without running JavaScript.
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
      });
      try {
        const site = (await server.ssrLoadModule("/src/seo.routes.ts")) as SeoModule;
        const pages = site.englishSeoPages();
        const template = await readFile(join(outDir, "index.html"), "utf8");
        for (const page of pages) {
          // `/x/y` → `x/y.html`, served at the extensionless path by Vercel's `cleanUrls`.
          const file = join(outDir, page.path === "/" ? "index.html" : `${page.path}.html`);
          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, pageHtml(template, page, site));
        }
        await writeFile(join(outDir, "sitemap.xml"), sitemap(pages, site.BASE_URL));
        console.log(`seo: wrote ${pages.length} pages and sitemap.xml`);
      } finally {
        await server.close();
      }
    },
  };
}
