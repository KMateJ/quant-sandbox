import { escape } from "./html.ts";
import type { Alternate } from "./types.ts";

export type SitemapEntry = { url: string; lastmod?: string; alternates?: Alternate[] };

/// `sitemap.xml` for the given URLs; `<lastmod>` only where it is known, and each URL lists its language versions.
export function sitemap(entries: SitemapEntry[]): string {
  const urls = entries.map(({ url, lastmod, alternates = [] }) =>
    [
      `  <url>`,
      `    <loc>${escape(url)}</loc>`,
      ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
      ...alternates.map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${escape(a.url)}" />`),
      `  </url>`,
    ].join("\n")
  );
  const namespaces = `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml"`;
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset ${namespaces}>\n${urls.join("\n")}\n</urlset>\n`;
}
