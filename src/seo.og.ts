import i18n from "i18next";
import type { TranslationKey } from "./i18n";
import type { Language } from "./languageRoutes";
import { SITE_NAME, seoPagesFor, type SeoPage } from "./seo.routes";
import type { OgText } from "./seo.types";

type Translate = (key: TranslationKey) => string;

/// The words on each page's preview image: its title, what kind of page it is and the section it sits in.
/// The first entry is the site-wide fallback card (`path: ""`).
export function ogTexts(t: Translate, pages: SeoPage[]): { tagline: string; cards: OgText[] } {
  const tagline = t("ogTagline");
  const kind = (p: SeoPage) =>
    p.path === "/" ? tagline : p.lessons ? t("ogKindCourse") : p.parent ? t("ogKindLesson") : t("ogKindLab");
  const cards = pages.map((p) => ({ path: p.path, title: p.title, kind: kind(p), section: p.parent?.title ?? p.category?.title }));
  return { tagline, cards: [{ path: "", title: SITE_NAME, kind: tagline }, ...cards] };
}

/// Preview-image text for every page of one language; its table is loaded first.
export async function ogTextsFor(language: Language) {
  const pages = await seoPagesFor(language);
  return ogTexts(i18n.getFixedT(language) as Translate, pages);
}
