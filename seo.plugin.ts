import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { createServer, type Plugin } from "vite";

type SeoLink = { path: string; title: string };
type SeoPage = { path: string; title: string; description: string; parent?: SeoLink; lessons?: SeoLink[] };
type SeoModule = { englishSeoPages: () => SeoPage[]; BASE_URL: string; SITE_NAME: string };
type RenderModule = { renderPage: (url: string) => Promise<string> };

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

/// schema.org description of the page: the site on the home page, a learning resource
/// (with breadcrumbs) for lessons, and a web application for every tool.
function structuredData(page: SeoPage, site: SeoModule): object[] {
  const url = (path: string) => new URL(path, site.BASE_URL).toString();
  if (page.path === "/") {
    return [{ "@context": "https://schema.org", "@type": "WebSite", name: site.SITE_NAME, url: url("/"), description: page.description }];
  }
  const provider = { "@type": "Organization", name: site.SITE_NAME, url: url("/") };
  if (page.lessons) {
    return [
      {
        "@context": "https://schema.org",
        "@type": "Course",
        name: page.title,
        description: page.description,
        url: url(page.path),
        inLanguage: "en",
        isAccessibleForFree: true,
        provider,
        hasPart: page.lessons.map((l) => ({ "@type": "LearningResource", name: l.title, url: url(l.path) })),
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.SITE_NAME, item: url("/") },
          { "@type": "ListItem", position: 2, name: page.title, item: url(page.path) },
        ],
      },
    ];
  }
  if (page.parent) {
    return [
      {
        "@context": "https://schema.org",
        "@type": "LearningResource",
        name: page.title,
        description: page.description,
        url: url(page.path),
        learningResourceType: "Interactive lesson",
        inLanguage: "en",
        isAccessibleForFree: true,
        provider,
        isPartOf: { "@type": "Course", name: page.parent.title, url: url(page.parent.path) },
      },
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: site.SITE_NAME, item: url("/") },
          { "@type": "ListItem", position: 2, name: page.parent.title, item: url(page.parent.path) },
          { "@type": "ListItem", position: 3, name: page.title, item: url(page.path) },
        ],
      },
    ];
  }
  return [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: page.title,
      description: page.description,
      url: url(page.path),
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
    },
  ];
}

function pageHtml(template: string, page: SeoPage, site: SeoModule, body: string): string {
  const title = escape(`${page.title} | ${site.SITE_NAME}`);
  const description = escape(page.description);
  const url = escape(new URL(page.path, site.BASE_URL).toString());
  // `<` is escaped so page text can never close the script element early.
  const jsonLd = structuredData(page, site).map(
    (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`
  );
  const head = [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    ...jsonLd,
  ].join("\n    ");
  const stripped = PER_PAGE_TAGS.reduce((html, pattern) => html.replace(pattern, ""), template);
  return stripped
    .replace(/\s*<\/head>/, `\n    ${head}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

function sitemap(pages: SeoPage[], baseUrl: string): string {
  const today = new Date().toISOString().slice(0, 10);
  const urls = pages.map((p) => `  <url>\n    <loc>${escape(new URL(p.path, baseUrl).toString())}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}

/// Pre-renders one route; a failure or timeout leaves the page with tags only, never breaks the build.
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
        const site = (await server.ssrLoadModule("/src/seo.routes.ts")) as SeoModule;
        const render = await server.ssrLoadModule("/src/entry-prerender.tsx").then(
          (mod) => mod as RenderModule,
          (error: Error) => {
            console.warn(`seo: pre-rendering disabled, the app could not be loaded: ${error.message}`);
            return { renderPage: async () => "" } satisfies RenderModule;
          }
        );
        const pages = site.englishSeoPages();
        const template = await readFile(join(outDir, "index.html"), "utf8");
        let rendered = 0;
        for (const page of pages) {
          const body = await renderBody(render, page.path);
          if (body) rendered++;
          // `/x/y` → `x/y.html`, served at the extensionless path by Vercel's `cleanUrls`.
          const file = join(outDir, page.path === "/" ? "index.html" : `${page.path}.html`);
          await mkdir(dirname(file), { recursive: true });
          await writeFile(file, pageHtml(template, page, site, body));
        }
        await writeFile(join(outDir, "sitemap.xml"), sitemap(pages, site.BASE_URL));
        console.log(`seo: wrote ${pages.length} pages (${rendered} pre-rendered) and sitemap.xml`);
      } finally {
        await server.close();
      }
    },
  };
}
