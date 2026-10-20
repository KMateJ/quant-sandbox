import type { TranslationKey } from "../../i18n";
import type { HomeTile, HomeTileInput } from "./home.types";

/// "01"… for the zero-based category index.
export function categoryNumber(index: number): string {
  return String(index + 1).padStart(2, "0");
}

/// Featured lab first, then the rest in registry order; codes "01.1", "01.2", ….
export function orderTiles(categoryIndex: number, mods: HomeTileInput[]): HomeTile[] {
  const ordered = [...mods.filter((m) => m.featured), ...mods.filter((m) => !m.featured)];
  return ordered.map((m, i) => ({ ...m, code: `${categoryNumber(categoryIndex)}.${i + 1}` }));
}

/// True when a 4-column bento needs a guide tile to close its second row.
export function needsGuideFiller(count: number): boolean {
  return count - 1 < 4;
}

/// Read-lesson count as "n / total" plus the filled fraction.
export function trackProgress(read: number, total: number): { label: string; pct: number } {
  return { label: `${read} / ${total}`, pct: total ? read / total : 0 };
}

/// String key of a lab's one-line description on the home tile ("black-scholes" -> homeLabDesc_blackScholes).
export function labDescKey(id: string): TranslationKey {
  const camel = id.replace(/-(\w)/g, (_, c: string) => c.toUpperCase());
  return `homeLabDesc_${camel}` as TranslationKey;
}
