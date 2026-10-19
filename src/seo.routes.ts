import i18n from "i18next";
import type { TranslationKey } from "./i18n";
import { loadLanguage } from "./languageLoader";
import { localizedPath, type Language } from "./languageRoutes";
import { CATEGORY_LABEL_KEYS, modules, modulesInCategory } from "./modules/registry";
import type { SeoPage } from "./seo.types";

export type { SeoPage };

export const SITE_NAME = "Quant Sandbox";
export const BASE_URL = "https://quantsandbox.dev";

type Translate = (key: TranslationKey) => string;

/// Longest meta description search engines show in full.
const SNIPPET_LENGTH = 160;

const withSuffix = (text: string, suffix?: string) =>
  suffix && text.length + suffix.length + 1 <= SNIPPET_LENGTH ? `${text} ${suffix}` : text;

/// Every indexable page — each module plus its own sub-pages (e.g. studio lessons) — with
/// its title and description. Shared by the runtime <Seo> and the build-time page writer.
/// Paths carry the language's URL prefix (`/hu/wacc`). The English-only lesson titles and description
/// suffixes apply to English only; other languages use the translated lesson titles.
export function seoPages(t: Translate, language: Language = "en"): SeoPage[] {
  const english = language === "en";
  const at = (path: string) => localizedPath(path, language);
  return modules.flatMap((m) => {
    const parent = { path: at(m.path), title: t(m.seo.titleKey) };
    const lessons = (m.subNav ?? []).flatMap((item) =>
      item.descKey
        ? [{
            language,
            path: at(item.to),
            title: (english && item.seoTitle) || t(item.labelKey),
            description: withSuffix(t(item.descKey), english ? item.seoDescSuffix : undefined),
            parent,
          }]
        : []
    );
    const course = lessons.length ? { lessons: lessons.map(({ path, title }) => ({ path, title })) } : {};
    const faq = m.about ? { faq: m.about.faq.map((f) => ({ question: t(f.question), answer: t(f.answer) })) } : {};
    const category = m.category
      ? { category: { key: m.category, title: t(CATEGORY_LABEL_KEYS[m.category]), path: at(modulesInCategory(m.category)[0].path) } }
      : {};
    return [{ language, path: parent.path, title: parent.title, description: t(m.seo.descKey), ...course, ...faq, ...category }, ...lessons];
  });
}

/// The page list in any language; loads its table first.
export async function seoPagesFor(language: Language): Promise<SeoPage[]> {
  await loadLanguage(language);
  return seoPages(i18n.getFixedT(language) as Translate, language);
}
