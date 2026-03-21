import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { homeEn, homeHu } from "./Language/Home";
import { binomialEn, binomialHu } from "./Language/Binomial";
import { payoffEn, payoffHu } from "./Language/Payoff";
import { diffusionEn, diffusionHu } from "./Language/Diffusion";
import { blackScholesEn, blackScholesHu } from "./Language/BlackScholes";

export type Language = "hu" | "en";

type TranslationTree = Record<string, string>;

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.hu) => string;
};

const STORAGE_KEY = "qs-language";

const translations = {
  hu: {
    ...homeHu,
    ...binomialHu,
    ...payoffHu,
    ...diffusionHu,
    ...blackScholesHu,
  },
  en: {
    ...homeEn,
    ...binomialEn,
    ...payoffEn,
    ...diffusionEn,
    ...blackScholesEn,
  },
} satisfies Record<Language, TranslationTree>;

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("hu");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "hu" || saved === "en") {
      setLanguage(saved);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      setLanguage,
      t: (key) => translations[language][key],
    };
  }, [language]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside LanguageProvider");
  }
  return ctx;
}