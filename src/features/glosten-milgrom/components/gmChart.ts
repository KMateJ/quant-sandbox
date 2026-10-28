import type { ScatterSeries } from "../../../components/charts";
import type { GmStep } from "../glostenMilgrom.types";

export const GM_COLORS = { ask: "var(--negative)", bid: "var(--positive)", belief: "var(--primary)", truth: "var(--muted)" };
export const fmt3 = (v: number) => v.toFixed(3);
export const fmtIndex = (v: number) => String(Math.round(v));

/// Ask, bid and belief as line series over trade index (point i = quotes facing trade i + 1).
export function quoteSeries(path: readonly GmStep[], labels: { ask: string; bid: string; belief: string }): ScatterSeries[] {
  const at = (f: (s: GmStep) => number) => path.map((s, i) => ({ x: i + 1, y: f(s) }));
  return [
    { key: "ask", label: labels.ask, color: GM_COLORS.ask, line: true, strokeWidth: 2.4, legend: true, points: at((s) => s.ask) },
    { key: "bid", label: labels.bid, color: GM_COLORS.bid, line: true, strokeWidth: 2.4, legend: true, points: at((s) => s.bid) },
    { key: "mu", label: labels.belief, color: GM_COLORS.belief, line: true, dash: "5 4", strokeWidth: 1.6, legend: true, points: at((s) => s.mu) },
  ];
}
