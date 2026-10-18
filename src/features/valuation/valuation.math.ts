import { dcfValue, terminalValue } from "../../lib/finance/valuation";
import { bisection } from "../../lib/math/roots";
import type { DcfPoint } from "./valuation.types";

/// Free cashflows growing at rate `g` for `years` periods, starting from `fcf1` in year 1.
export function projectCashflows(fcf1: number, g: number, years: number): number[] {
  const cashflows: number[] = [];
  for (let t = 0; t < years; t++) cashflows.push(fcf1 * Math.pow(1 + g, t));
  return cashflows;
}

/// Enterprise value: PV of the explicit free cashflows plus the discounted terminal value.
export function enterpriseValue(
  fcf1: number,
  g: number,
  years: number,
  wacc: number,
  terminalGrowth: number
): number {
  return dcfValue(projectCashflows(fcf1, g, years), wacc, terminalGrowth);
}

/// Gordon-growth terminal value at the end of the explicit horizon.
export function horizonTerminalValue(
  fcf1: number,
  g: number,
  years: number,
  wacc: number,
  terminalGrowth: number
): number {
  const cashflows = projectCashflows(fcf1, g, years);
  return terminalValue(cashflows[cashflows.length - 1], terminalGrowth, wacc);
}

/// Per-year schedule of nominal and discounted (present-value) free cashflows.
export function dcfSchedule(
  fcf1: number,
  g: number,
  years: number,
  wacc: number
): DcfPoint[] {
  let cumulativePv = 0;
  return projectCashflows(fcf1, g, years).map((fcf, i) => {
    const discount = 1 / Math.pow(1 + wacc, i + 1);
    const pv = fcf * discount;
    cumulativePv += pv;
    return { year: i + 1, fcf, pv, discount, cumulativePv };
  });
}

/// One bar of the DCF bridge: the PV of a block of forecast years (`from`..`to`), of the terminal value, or the total.
export type BridgePart =
  | { kind: "years"; key: string; from: number; to: number; fcf: number; pv: number }
  | { kind: "terminal"; key: "tv"; tv: number; discount: number; pv: number }
  | { kind: "total"; key: "ev"; pv: number };

/// The DCF bridge: PV of the forecast FCFs (one bar per year, or blocks of years when there are more than
/// `maxBars`), plus the PV of the terminal value, adding up to the enterprise value.
export function valueBridge(
  fcf1: number,
  g: number,
  years: number,
  wacc: number,
  terminalGrowth: number,
  maxBars = 6
): BridgePart[] {
  const rows = dcfSchedule(fcf1, g, years, wacc);
  const size = Math.ceil(years / maxBars);
  const parts: BridgePart[] = [];
  for (let start = 0; start < rows.length; start += size) {
    const block = rows.slice(start, start + size);
    const from = block[0].year;
    const to = block[block.length - 1].year;
    parts.push({
      kind: "years",
      key: `y${from}`,
      from,
      to,
      fcf: block.reduce((s, r) => s + r.fcf, 0),
      pv: block.reduce((s, r) => s + r.pv, 0),
    });
  }
  const tv = horizonTerminalValue(fcf1, g, years, wacc, terminalGrowth);
  const discount = 1 / Math.pow(1 + wacc, years);
  parts.push({ kind: "terminal", key: "tv", tv, discount, pv: tv * discount });
  parts.push({ kind: "total", key: "ev", pv: parts.reduce((s, p) => s + p.pv, 0) });
  return parts;
}

/// Share of the enterprise value that comes from the discounted terminal value.
export function terminalShare(fcf1: number, g: number, years: number, wacc: number, terminalGrowth: number): number {
  const ev = enterpriseValue(fcf1, g, years, wacc, terminalGrowth);
  const pvTv = horizonTerminalValue(fcf1, g, years, wacc, terminalGrowth) / Math.pow(1 + wacc, years);
  return ev === 0 ? 0 : pvTv / ev;
}

/// Grid of the (WACC, terminal growth) value map: it spans the lab's slider ranges in coarse steps.
export const VALUE_MAP_WACC = Array.from({ length: 16 }, (_, i) => 0.05 + i * 0.01);
export const VALUE_MAP_GROWTH = Array.from({ length: 9 }, (_, i) => i * 0.005);

/// Enterprise value at a (WACC, g∞) cell, or NaN where the Gordon formula has no finite value (g∞ ≥ WACC).
export function mapValue(fcf1: number, g: number, years: number, wacc: number, terminalGrowth: number): number {
  return terminalGrowth < wacc ? enterpriseValue(fcf1, g, years, wacc, terminalGrowth) : NaN;
}

/// x-domain of the per-year charts; one forecast year is padded so the axis never has zero width.
export function yearDomain(years: number): [number, number] {
  return years > 1 ? [1, years] : [0.5, 1.5];
}

/// Which input the reverse DCF solves for: terminal growth g∞, or the WACC.
export type ReverseMode = "growth" | "wacc";

/// Range the reverse DCF searches and plots: g∞ from −2% to 1 pp below the WACC, or the WACC from 1 pp above g∞ to 30%.
/// The 1 pp gap keeps the Gordon value finite (it explodes as g∞ approaches the WACC).
export function reverseRange(mode: ReverseMode, wacc: number, terminalGrowth: number): [number, number] {
  return mode === "growth" ? [-0.02, wacc - 0.01] : [terminalGrowth + 0.01, 0.3];
}

/// Enterprise value as a function of the solved-for input, the other inputs held fixed.
export function reverseValue(mode: ReverseMode, x: number, fcf1: number, g: number, years: number, wacc: number, terminalGrowth: number): number {
  return mode === "growth" ? enterpriseValue(fcf1, g, years, wacc, x) : enterpriseValue(fcf1, g, years, x, terminalGrowth);
}

/// Points of the reverse-DCF curve over `reverseRange`, for charting.
export function reverseCurve(mode: ReverseMode, fcf1: number, g: number, years: number, wacc: number, terminalGrowth: number, points = 80) {
  const [lo, hi] = reverseRange(mode, wacc, terminalGrowth);
  return Array.from({ length: points }, (_, i) => {
    const x = lo + ((hi - lo) * i) / (points - 1);
    return { x, value: reverseValue(mode, x, fcf1, g, years, wacc, terminalGrowth) };
  });
}

/// The g∞ (or WACC) at which the enterprise value equals `target`, or null when no value in `reverseRange` reaches it.
/// The value rises with g∞ and falls with the WACC, so a sign change of value − target brackets a single root.
export function impliedInput(mode: ReverseMode, target: number, fcf1: number, g: number, years: number, wacc: number, terminalGrowth: number): number | null {
  const [lo, hi] = reverseRange(mode, wacc, terminalGrowth);
  if (!(hi > lo)) return null;
  const f = (x: number) => reverseValue(mode, x, fcf1, g, years, wacc, terminalGrowth) - target;
  if (f(lo) * f(hi) > 0) return null;
  return bisection(f, lo, hi, { tol: 1e-9 }).root;
}
