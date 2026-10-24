import { num, pct } from "../../components/game/gameFormat";

/// Amount in today's money, grouped: `40,000`.
export const amount = (x: number) => num(x, 0);

/// Compact amount for axes: `1.25m`, `640k`.
export function compact(x: number): string {
  return Math.abs(x) >= 1e6 ? `${num(x / 1e6, 2)}m` : `${num(x / 1e3, 0)}k`;
}

/// Always-signed percentage: `+1.2%`, `−0.4%`, `0.0%`.
export function spct(x: number, digits = 1): string {
  const s = pct(x, digits);
  return x > 0 && Number(s.replace("%", "").replace(/,/g, "")) !== 0 ? `+${s}` : s;
}

/// Odds bands of the risk panel: comfortable ≥ 85%, stretched ≥ 70%, else in danger.
export type OddsWord = "comfortable" | "stretched" | "danger";
export const oddsWord = (p: number): OddsWord => (p >= 0.85 ? "comfortable" : p >= 0.7 ? "stretched" : "danger");
