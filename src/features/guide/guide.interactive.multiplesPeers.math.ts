/// A comparable firm: expected growth and its EV/EBITDA multiple (made-up but plausible data).
export type Peer = { id: string; growth: number; multiple: number };

export const PEERS: Peer[] = [
  { id: "A", growth: 0.03, multiple: 7.6 },
  { id: "B", growth: 0.05, multiple: 8.9 },
  { id: "C", growth: 0.06, multiple: 9.9 },
  { id: "D", growth: 0.08, multiple: 10.8 },
  { id: "E", growth: 0.1, multiple: 12.3 },
  // Priced on takeover talk: an outlier for its growth.
  { id: "F", growth: 0.07, multiple: 16.5 },
];

/// The firm being valued: EBITDA and net debt in millions, default expected growth.
export const TARGET = { ebitda: 50, netDebt: 120, growth: 0.07 };
export const GROWTH_MIN = 0;
export const GROWTH_MAX = 0.14;
export const GROWTH_STEP = 0.005;

/// Median of a list (mean of the middle two for an even count); NaN when empty.
export function median(values: number[]): number {
  if (values.length === 0) return NaN;
  const s = [...values].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/// Least-squares line multiple = a + b·growth through the peers; null with fewer than two distinct growth rates.
export function fitLine(peers: Peer[]): { a: number; b: number } | null {
  const n = peers.length;
  if (n < 2) return null;
  const mx = peers.reduce((s, p) => s + p.growth, 0) / n;
  const my = peers.reduce((s, p) => s + p.multiple, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (const p of peers) {
    sxy += (p.growth - mx) * (p.multiple - my);
    sxx += (p.growth - mx) ** 2;
  }
  return sxx > 0 ? { a: my - (sxy / sxx) * mx, b: sxy / sxx } : null;
}

/// Snaps a growth rate to the figure's step and range.
export const snapGrowth = (g: number) =>
  Math.min(GROWTH_MAX, Math.max(GROWTH_MIN, Math.round(g / GROWTH_STEP) * GROWTH_STEP));

/// Peer median, the regression multiple at the target's growth (the median when no line fits), and the implied values.
export function impliedValue(peers: Peer[], growth: number, target = TARGET) {
  const med = median(peers.map((p) => p.multiple));
  const line = fitLine(peers);
  const multiple = line ? line.a + line.b * growth : med;
  const ev = multiple * target.ebitda;
  return { median: med, line, multiple, ev, equity: ev - target.netDebt };
}
