import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en, type BaseKey } from "./Language/index.en";
import type { StoredLanguage } from "./languageStorage";

const lazyTables: Record<Exclude<StoredLanguage, "en">, () => Promise<Record<BaseKey, string>>> = {
  hu: () => import("./Language/index.hu").then((m) => m.hu),
};
const loading = new Map<StoredLanguage, Promise<void>>();

/// Loads a language's table into i18next once; English is always present. Works in SSR too (await it before rendering).
export function loadLanguage(lang: StoredLanguage): Promise<void> {
  if (lang === "en") return Promise.resolve();
  let pending = loading.get(lang);
  if (!pending) {
    pending = lazyTables[lang]().then((table) => {
      i18n.addResourceBundle(lang, "translation", table, true, true);
    });
    loading.set(lang, pending);
  }
  return pending;
}

const deskTables: Record<StoredLanguage, () => Promise<Record<string, string>>> = {
  en: () => import("./Language/desks.en").then((m) => m.desksEn),
  hu: () => import("./Language/desks.hu").then((m) => m.desksHu),
};
const deskLoading = new Map<StoredLanguage, Promise<void>>();

/// Loads the desk-game copy for `lang` (and English as its fallback) once; kept out of the initial bundle.
export function loadDeskCopy(lang: StoredLanguage): Promise<void> {
  const langs: StoredLanguage[] = lang === "en" ? ["en"] : ["en", lang];
  return Promise.all(
    langs.map((l) => {
      let pending = deskLoading.get(l);
      if (!pending) {
        pending = deskTables[l]().then((table) => {
          i18n.addResourceBundle(l, "translation", table, true, true);
        });
        deskLoading.set(l, pending);
      }
      return pending;
    }),
  ).then(() => undefined);
}

/// Wraps a lazy route import so the desk copy for the current language arrives with the component.
export function withDeskCopy<T>(importer: () => Promise<T>): () => Promise<T> {
  return () => Promise.all([importer(), loadDeskCopy((i18n.language || "en") as StoredLanguage)]).then(([m]) => m);
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: { en: { translation: en } },
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    // The dev server skips type-checking, so a key missing from the tables would otherwise render silently as raw text.
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (lngs, _ns, key) => console.warn(`[i18n] missing key "${key}" (${lngs.join(", ")})`),
  });
} else {
  // Hot reload re-runs this module with edited tables; push them into the live instance,
  // otherwise keys added since the page loaded render as raw key names.
  i18n.addResourceBundle("en", "translation", en, true, true);
  const reloads = (Object.keys(lazyTables) as StoredLanguage[])
    .filter((lng) => i18n.hasResourceBundle(lng, "translation"))
    .map(loadLanguage);
  void Promise.all(reloads).then(() => i18n.changeLanguage(i18n.language));
}
