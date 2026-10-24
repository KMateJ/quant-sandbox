import type { AdviceTone } from "./game.types";

export const TONE_ORDER: Readonly<Record<AdviceTone, number>> = { urgent: 0, suggest: 1, info: 2, done: 3 };

/// Advice sorted by tone (stable within a tone) and cut to `max` items.
export function rankAdvice<T extends { tone: AdviceTone }>(items: readonly T[], max = 6): T[] {
  return items
    .map((a, i) => ({ a, i }))
    .sort((x, y) => TONE_ORDER[x.a.tone] - TONE_ORDER[y.a.tone] || x.i - y.i)
    .slice(0, max)
    .map((x) => x.a);
}
