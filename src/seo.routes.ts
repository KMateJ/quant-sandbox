import { translations, type TranslationKey } from "./i18n";
import { modules } from "./modules/registry";

export const SITE_NAME = "Quant Sandbox";
export const BASE_URL = "https://quantsandbox.dev";

export type SeoPage = {
  path: string;
  title: string;
  description: string;
  /// The module page a sub-page (lesson) belongs to, for breadcrumbs.
  parent?: { path: string; title: string };
  /// A course page's lessons, for structured data.
  lessons?: { path: string; title: string }[];
};

type Translate = (key: TranslationKey) => string;

/// Longest meta description search engines show in full.
const SNIPPET_LENGTH = 160;

const withSuffix = (text: string, suffix?: string) =>
  suffix && text.length + suffix.length + 1 <= SNIPPET_LENGTH ? `${text} ${suffix}` : text;

/// Every indexable page — each module plus its own sub-pages (e.g. studio lessons) — with
/// its title and description. Shared by the runtime <Seo> and the build-time page writer.
/// `english` adds the English-only description suffixes (crawlers see the English pages).
export function seoPages(t: Translate, english = false): SeoPage[] {
  return modules.flatMap((m) => {
    const parent = { path: m.path, title: m.seo.title };
    const lessons = (m.subNav ?? []).flatMap((item) =>
      item.descKey
        ? [{ path: item.to, title: item.seoTitle ?? t(item.labelKey), description: withSuffix(t(item.descKey), english ? item.seoDescSuffix : undefined), parent }]
        : []
    );
    const course = lessons.length ? { lessons: lessons.map(({ path, title }) => ({ path, title })) } : {};
    return [{ path: m.path, title: m.seo.title, description: m.seo.description, ...course }, ...lessons];
  });
}

/// The page list in English, the language crawlers see.
export const englishSeoPages = () => seoPages((key) => translations.en[key], true);
