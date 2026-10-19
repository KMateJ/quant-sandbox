// Import-free so the build plugin (tsconfig.node) can share it without pulling in the app.

/// The interface languages; each has its own URLs.
export type Language = "hu" | "en";

/// Every language with its own URLs; the default has no prefix.
export const LANGUAGES: Language[] = ["en", "hu"];
export const DEFAULT_LANGUAGE: Language = "en";

/// URL prefix of a language ("" for the default).
export const languagePrefix = (lang: Language) => (lang === DEFAULT_LANGUAGE ? "" : `/${lang}`);

/// Language encoded in a pathname ("/hu/wacc" → "hu", "/wacc" → "en").
export function languageFromPath(pathname: string): Language {
  const first = pathname.split("/")[1];
  return LANGUAGES.find((lang) => lang !== DEFAULT_LANGUAGE && lang === first) ?? DEFAULT_LANGUAGE;
}

/// Pathname without its language prefix ("/hu/wacc" → "/wacc", "/hu" → "/").
export function stripLanguage(pathname: string): string {
  const prefix = languagePrefix(languageFromPath(pathname));
  return pathname.slice(prefix.length) || "/";
}

/// Path in the given language ("/wacc", "hu" → "/hu/wacc"; "/", "hu" → "/hu").
export function localizedPath(path: string, lang: Language): string {
  const prefix = languagePrefix(lang);
  return path === "/" ? prefix || "/" : prefix + path;
}
