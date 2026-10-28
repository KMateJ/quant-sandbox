import { balance, debtRank } from "../engine/metrics.math";
import type { AssetId, FinNetwork } from "../engine/systemic.types";
import { ASSET_ORDER, NO_FAIL } from "./shocks.math";

export type ScenarioId = "dealer" | "mortgage" | "credit" | "fund" | "slide";
export const SCENARIO_IDS: ScenarioId[] = ["dealer", "mortgage", "credit", "fund", "slide"];

export type ScenarioPatch = { fail: string; drop: number[]; shape: "instant" | "gradual" };

/// The setup behind each starting scenario. `fail: ""` means the most systemic institution; the hedge-fund
/// scenario fails the first fund of the network (or falls back to that default when there is none).
export function scenarioPatch(id: ScenarioId, net: FinNetwork): ScenarioPatch {
  const fund = net.institutions.find((i) => i.kind === "hedgeFund")?.id ?? "";
  switch (id) {
    case "dealer": return { fail: "", drop: [0, 0, 0, 0], shape: "instant" };
    case "mortgage": return { fail: NO_FAIL, drop: [0, 0, 30, 0], shape: "instant" };
    case "credit": return { fail: NO_FAIL, drop: [0, 25, 0, 0], shape: "instant" };
    case "fund": return { fail: fund, drop: [0, 0, 0, 20], shape: "instant" };
    case "slide": return { fail: NO_FAIL, drop: [0, 0, 30, 0], shape: "gradual" };
  }
}

export type AssetExposure = { asset: AssetId; held: number; loss: number; topHolder: string | null };

/// Per asset class: what the whole system holds ($bn at par), the day-0 mark-to-market loss at the chosen drop
/// (percent) and the institution holding the most.
export function assetExposures(net: FinNetwork, drops: number[]): AssetExposure[] {
  return ASSET_ORDER.map((asset, i) => {
    let held = 0;
    let top: { id: string; v: number } | null = null;
    for (const inst of net.institutions) {
      const v = inst.holdings[asset];
      held += v;
      if (v > 0 && (!top || v > top.v)) top = { id: inst.id, v };
    }
    return { asset, held, loss: (held * drops[i]) / 100, topHolder: top?.id ?? null };
  });
}

/// The system's total equity at par ($bn).
export const systemEquity = (net: FinNetwork): number => net.institutions.reduce((s, i) => s + balance(i, net).equity, 0);

export type FailPreview = {
  assets: number;
  leverage: number;
  /// share of all system assets, percent
  assetShare: number;
  /// DebtRank of this institution failing alone, in percent of system assets
  reach: number;
  lenders: number;
  biggestLender: { id: string; amount: number } | null;
};

/// Size, leverage, knock-on reach and lenders of the institution that is about to fail.
export function failPreview(net: FinNetwork, id: string): FailPreview | null {
  const inst = net.institutions.find((i) => i.id === id);
  if (!inst) return null;
  const total = net.institutions.reduce((s, i) => s + balance(i, net).assets, 0);
  const m = balance(inst, net);
  const claims = net.exposures.filter((e) => e.borrower === id && e.amount > 0);
  const biggest = claims.reduce<FailPreview["biggestLender"]>((b, e) => (!b || e.amount > b.amount ? { id: e.lender, amount: e.amount } : b), null);
  return {
    assets: m.assets,
    leverage: m.leverage,
    assetShare: (100 * m.assets) / total,
    reach: 100 * debtRank(net, { [id]: 1 }).rank,
    lenders: new Set(claims.map((e) => e.lender)).size,
    biggestLender: biggest,
  };
}
