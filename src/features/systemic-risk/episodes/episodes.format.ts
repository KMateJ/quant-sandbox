import type { TranslationKey } from "../../../i18n";

/// "9 Aug 2007" (English) or "2007. aug. 9." (Hungarian) from an ISO date, always in UTC so it never shifts a day.
export function formatEventDate(iso: string, language: string): string {
  return new Intl.DateTimeFormat(language === "hu" ? "hu-HU" : "en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${iso}T00:00:00Z`));
}

/// Copy keys of an event (`title`, `text`, `actor`) and of a switch; the stems come from the episode data.
export const evKey = (event: string, part: "title" | "text" | "actor") => `syrEpEv_${event}_${part}` as TranslationKey;
export const swKey = (key: string) => `syrEpSw_${key}` as TranslationKey;
