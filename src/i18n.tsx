import { LANGUAGE_STORAGE_KEY } from "./languageStorage";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";
import { en, type TranslationKey } from "./Language/index.en";
import { localizedPath, stripLanguage, type Language } from "./languageRoutes";

export type { TranslationKey };

export type { Language };

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, options?: Record<string, string | number>) => string;
};

const STORAGE_KEY = LANGUAGE_STORAGE_KEY;

/// Tables available synchronously; other languages arrive through `loadLanguage` (languageLoader.ts).
export const translations = { en };

const I18nContext = createContext<I18nContextValue | null>(null);

/// Provides the page's language, which comes from the URL (`/hu/...`); load its table before rendering.
export function LanguageProvider({ language, children }: { language: Language; children: ReactNode }) {
  const { t } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      setLanguage: (lang) => {
        if (lang === language) return;
        localStorage.setItem(STORAGE_KEY, lang);
        // A full load: the router basename changes and the new language's pre-rendered page is fetched.
        const { pathname, search, hash } = window.location;
        window.location.assign(localizedPath(stripLanguage(pathname), lang) + search + hash);
      },
      t: (key, options) => t(key, options),
    };
  }, [language, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside LanguageProvider");
  }
  return ctx;
}