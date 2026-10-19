import { ogImagePath } from "./ogImages.ts";
import type { Alternate, SeoPage, SeoRedirect, SeoSite } from "./types.ts";

/// Escapes text for an HTML attribute or text node.
export const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Head tags that differ per page; stripped from the template and written fresh.
const PER_PAGE_TAGS = [
  /<title>[\s\S]*?<\/title>\s*/,
  /<meta\s+name="description"[\s\S]*?\/>\s*/,
  /<link\s+rel="canonical"[^>]*>\s*/,
  /<meta\s+property="og:(title|description|url)"[\s\S]*?\/>\s*/g,
  /<meta\s+name="twitter:(title|description)"[\s\S]*?\/>\s*/g,
  /<meta\s+property="og:image(:alt|:width|:height)?"[\s\S]*?\/>\s*/g,
  /<meta\s+name="twitter:image"[\s\S]*?\/>\s*/g,
];

/// Open Graph and Twitter image tags for the preview image of `path` ("" = the site-wide fallback `/og.png`).
function imageTags(path: string, alt: string, site: SeoSite): string[] {
  const src = escape(new URL(path ? ogImagePath(path) : "/og.png", site.BASE_URL).toString());
  return [
    `<meta property="og:image" content="${src}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${escape(alt)}" />`,
    `<meta name="twitter:image" content="${src}" />`,
  ];
}

/// Absolute URL of a page's Markdown twin.
export const markdownUrl = (path: string, site: SeoSite) => escape(new URL(`${path}.md`, site.BASE_URL).toString());

/// Head tags of an indexable page: title, description, canonical, `hreflang` links to its other language versions,
/// Open Graph, Twitter (with the preview image), the `jsonLd` blocks and, when the page has a Markdown twin, a
/// `text/markdown` alternate link.
export function seoHead(page: SeoPage, site: SeoSite, jsonLd: object[], hasMarkdown = false, alternates: Alternate[] = []): string[] {
  const title = escape(`${page.title} | ${site.SITE_NAME}`);
  const description = escape(page.description);
  const url = escape(new URL(page.path, site.BASE_URL).toString());
  // `<` is escaped so page text can never close the script element early.
  const scripts = jsonLd.map(
    (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`
  );
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...alternates.map((a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${escape(a.url)}" />`),
    ...(hasMarkdown ? [`<link rel="alternate" type="text/markdown" href="${markdownUrl(page.path, site)}" />`] : []),
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    ...imageTags(page.path, page.title, site),
    ...scripts,
  ];
}

/// Head tags of the not-found page: a title, `noindex` and the site-wide preview image; no page URL.
export function notFoundHead(site: SeoSite, title: string): string[] {
  return [`<title>${escape(`${title} | ${site.SITE_NAME}`)}</title>`, `<meta name="robots" content="noindex" />`, ...imageTags("", site.SITE_NAME, site)];
}

/// The built `index.html` with its per-page head tags replaced by `head`, `body` in the root and `<html lang>` set.
export function pageHtml(template: string, head: string[], body: string, lang = "en"): string {
  const stripped = PER_PAGE_TAGS.reduce((html, pattern) => html.replace(pattern, ""), template);
  return stripped
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/\s*<\/head>/, `\n    ${head.join("\n    ")}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

/// A static redirect that needs no server: a 0-second meta refresh (read by Google as permanent),
/// a canonical to the target and a plain link.
export function redirectStub({ to }: SeoRedirect, site: SeoSite): string {
  const target = escape(to);
  const canonical = escape(new URL(to, site.BASE_URL).toString());
  return [
    "<!doctype html>",
    '<html lang="en">',
    "  <head>",
    '    <meta charset="UTF-8" />',
    `    <title>${escape(site.SITE_NAME)}</title>`,
    `    <meta http-equiv="refresh" content="0; url=${target}" />`,
    `    <link rel="canonical" href="${canonical}" />`,
    '    <meta name="robots" content="noindex" />',
    "  </head>",
    "  <body>",
    `    <a href="${target}">${canonical}</a>`,
    "  </body>",
    "</html>",
    "",
  ].join("\n");
}
