import type { Language } from "../src/languageRoutes.ts";
import type { MarkdownPage, OgText, SeoPage } from "../src/seo.types.ts";
import type { SchemaExtras } from "../src/seo.schema.ts";

export type { SeoPage };
export type SeoSite = { seoPagesFor: (language: Language) => Promise<SeoPage[]>; BASE_URL: string; SITE_NAME: string };
/// One language version of a page, for `hreflang` links.
export type Alternate = { hreflang: string; url: string };
export type SeoRedirect = { from: string; to: string };
export type SchemaModule = { structuredData: (page: SeoPage, site: SeoSite, extras?: SchemaExtras) => object[] };
export type MarkdownBundle = { pages: MarkdownPage[]; llms: string; llmsFull: string };
export type MarkdownModule = { allMarkdown: () => Promise<MarkdownBundle> };
export type OgModule = { ogTextsFor: (language: Language) => Promise<{ tagline: string; cards: OgText[] }> };
