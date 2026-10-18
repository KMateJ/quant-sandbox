export type StoredLanguage = "hu" | "en";

/// localStorage key of the reader's chosen interface language.
export const LANGUAGE_STORAGE_KEY = "qs-language";

/// The language the reader chose last time, if any (null on the server or when storage is unavailable).
export function savedLanguage(): StoredLanguage | null {
  try {
    const saved = typeof localStorage === "undefined" ? null : localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return saved === "hu" || saved === "en" ? saved : null;
  } catch {
    return null;
  }
}

/// Language of the pre-rendered HTML (seo.plugin.ts renders English pages).
export const PRERENDER_LANGUAGE: StoredLanguage = "en";
