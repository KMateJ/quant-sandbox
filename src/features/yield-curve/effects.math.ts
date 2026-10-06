import type { TermPoint } from "./yieldCurve.types";
import type { TranslationKey } from "../../i18n";

export type EffectKey = "par" | "zero" | "fwd" | "df";

/// Fit the current and pre-edit rates with enough padding for reaction labels.
export function rateDomain(term: TermPoint[]): [number, number] {
  const rates = term.flatMap((p) => [p.par, p.zero, p.fwd]);
  const low = Math.min(...rates);
  const high = Math.max(...rates);
  const padding = Math.max(0.004, (high - low) * 0.2);
  return [low < 0 ? low - padding : Math.max(0, low - padding), high + padding];
}

/// Relative discount-factor changes; rate changes remain in decimal rate units.
export function effectDelta(before: TermPoint, after: TermPoint, key: EffectKey): number {
  return key === "df" ? after.df / before.df - 1 : after[key] - before[key];
}

/// Signed basis points or relative percentages, with precision for small changes.
export function formatDelta(delta: number, discount = false): string {
  const value = delta * (discount ? 100 : 10000);
  const digits = discount || Math.abs(value) < 1 ? 1 : 0;
  const rounded = Number(value.toFixed(digits));
  return `${rounded > 0 ? "+" : rounded < 0 ? "\u2212" : ""}${Math.abs(rounded).toFixed(digits)}${discount ? "%" : " bp"}`;
}

/// Rank genuinely changed derived nodes by absolute sensitivity to the latest edit.
export function strongestEffects(before: TermPoint[], after: TermPoint[], key: EffectKey, count = 2): number[] {
  return after.map((p, i) => ({ i, delta: Math.abs(effectDelta(before[i], p, key)) }))
    .filter(({ delta }) => delta > 1e-8)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, count)
    .map(({ i }) => i);
}

/// Choose observations from actual signed changes, not an assumed upward shock.
export function describeEffects(before: TermPoint, after: TermPoint): { key: TranslationKey; values: Record<string, string> }[] {
  const par = effectDelta(before, after, "par");
  const zero = effectDelta(before, after, "zero");
  const forward = effectDelta(before, after, "fwd");
  const df = effectDelta(before, after, "df");
  if ([par, zero, forward, df].every((delta) => Math.abs(delta) < 1e-8)) return [];
  const values = {
    maturity: after.label, par: formatDelta(par), zero: formatDelta(zero),
    forward: formatDelta(forward), df: formatDelta(df, true),
    from: before.fwdFrom < 1 ? `${before.fwdFrom * 12}M` : `${before.fwdFrom}Y`,
    ratio: Math.abs(forward / zero).toFixed(1),
  };
  return [
    { key: Math.abs(par) < 1e-8 ? "ycObserveLinked" : par > 0 ? "ycObserveRaise" : "ycObserveLower", values },
    { key: Math.abs(zero) > 1e-8 && Math.abs(forward) > Math.abs(zero) * 1.05 ? "ycObserveAmplified" : "ycObserveForward", values },
    { key: df < -1e-8 ? "ycObserveDfDown" : df > 1e-8 ? "ycObserveDfUp" : "ycObserveDfSame", values },
  ];
}
