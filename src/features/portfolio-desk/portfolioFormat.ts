import { pct } from "../../components/game/gameFormat";

/// Always-signed percentage: `+1.2%`, `−0.4%`, `0.0%`.
export function spct(x: number, digits = 1): string {
  const s = pct(x, digits);
  return x > 0 && Number(s.replace("%", "").replace(/,/g, "")) !== 0 ? `+${s}` : s;
}

/// NAV as an index with base 100: `103.4`.
export const navIndex = (nav: number) => (nav * 100).toFixed(1);

/// Short asset codes in engine order; cash is the sixth line.
export const ASSET_CODES = ["EQ", "EM", "GOV", "CRD", "GOLD"] as const;

/// Notional fund size used to show position values and trade costs.
export const FUND_SIZE = 100_000_000;
