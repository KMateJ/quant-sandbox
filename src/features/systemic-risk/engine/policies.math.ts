import { UNIT_PRICES, indexBook } from "./accounting.math";
import { balance, systemicRanking } from "./metrics.math";
import { simulate } from "./simulate.math";
import type { FinNetwork, Intervention, Shock, SimParams } from "./systemic.types";

export type RescuePolicy = "none" | "largest" | "debtRank" | "weakest";
export const RESCUE_POLICIES: RescuePolicy[] = ["none", "largest", "debtRank", "weakest"];

/// Institution ids in the order a policy would rescue them. `weakest` skips MMFs and CCPs, whose thin equity is
/// by design and whose capital ratio is not comparable.
export function rescueOrder(policy: RescuePolicy, net: FinNetwork): string[] {
  const book = indexBook(net.exposures);
  const m = new Map(net.institutions.map((i) => [i.id, balance(i, net, UNIT_PRICES, undefined, book)]));
  switch (policy) {
    case "none": return [];
    case "largest": return [...m].sort((a, b) => b[1].assets - a[1].assets).map(([id]) => id);
    case "debtRank": return systemicRanking(net).map((r) => r.id);
    case "weakest":
      return net.institutions
        .filter((i) => i.kind !== "mmf" && i.kind !== "ccp")
        .sort((a, b) => m.get(a.id)!.capitalRatio - m.get(b.id)!.capitalRatio)
        .map((i) => i.id);
  }
}

/// Day-0 capital injections of `chunk` $bn each to the next institutions in the policy's order, until `budget` is spent.
export function rescuePlan(policy: RescuePolicy, net: FinNetwork, budget: number, chunk: number): Intervention[] {
  const order = rescueOrder(policy, net);
  const count = chunk > 0 ? Math.min(order.length, Math.floor(budget / chunk + 1e-9)) : 0;
  return order.slice(0, count).map((id) => ({ kind: "capital", id, amount: chunk, day: 0 }));
}

export type RescueOutcome = { policy: RescuePolicy | "yours"; defaults: number; defaultIds: string[]; totalLoss: number };

/// Defaults and total loss under each policy (same budget and chunk) and under the player's own interventions.
export function compareRescues(
  net: FinNetwork, shocks: Shock[], params: SimParams, budget: number, chunk: number, yours: Intervention[],
): RescueOutcome[] {
  const run = (policy: RescueOutcome["policy"], iv: Intervention[]): RescueOutcome => {
    const r = simulate(net, shocks, params, iv);
    return { policy, defaults: r.defaults.length, defaultIds: r.defaults, totalLoss: r.totalLoss };
  };
  return [...RESCUE_POLICIES.map((p) => run(p, rescuePlan(p, net, budget, chunk))), run("yours", yours)];
}
