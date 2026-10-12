import { translations, type TranslationKey } from "./i18n";
import { modules } from "./modules/registry";

export const SITE_NAME = "Quant Sandbox";
export const BASE_URL = "https://quantsandbox.dev";

export type SeoPage = { path: string; title: string; description: string };

type Translate = (key: TranslationKey) => string;

/// Every indexable page — each module plus its own sub-pages (e.g. studio lessons) — with
/// its title and description. Shared by the runtime <Seo> and the build-time page writer.
export function seoPages(t: Translate): SeoPage[] {
  return modules.flatMap((m) => [
    { path: m.path, title: m.seo.title, description: m.seo.description },
    ...(m.subNav ?? []).flatMap((item) =>
      item.descKey ? [{ path: item.to, title: t(item.labelKey), description: t(item.descKey) }] : []
    ),
  ]);
}

/// The page list in English, the language crawlers see.
export const englishSeoPages = () => seoPages((key) => translations.en[key]);
