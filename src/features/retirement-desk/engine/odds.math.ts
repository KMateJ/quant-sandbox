import { subSeed } from "../../../lib/game/seed";
import { makeRng, nextNormal } from "../../../lib/math/random";
import { mixReturn } from "./market.math";
import type { RetirementMission, SpendRule } from "./retirement.types";
import { nextWithdrawal } from "./rules.math";

/// Share of Monte Carlo futures in which money lasts to the final year, when year `year` (1-based) takes `first`
/// from `wealth` and later years follow `rule` ("same" = keep taking `first`, the default: guardrails can always
/// cut, so their odds sit near 100%). Seeded per year, so the same inputs give the same odds;
/// scripted (forced) returns are unknown to the player and not used here.
export function successOdds(
  mission: RetirementMission,
  seed: number,
  year: number,
  wealth: number,
  first: number,
  equity: number,
  rule: SpendRule | "same" = "same",
): number {
  const rng = makeRng(subSeed(seed, 1000 + year));
  let ok = 0;
  for (let p = 0; p < mission.paths; p++) {
    let w = wealth;
    let last: number | null = null;
    let alive = true;
    for (let k = year; k <= mission.years; k++) {
      const take = k === year || rule === "same" ? first : nextWithdrawal(rule, mission, last, w);
      // Draw every year so paths stay aligned across different spending choices.
      const z1 = nextNormal(rng);
      const z2 = nextNormal(rng);
      if (alive && take > 0 && take >= w) alive = false;
      if (!alive) continue;
      w = (w - take) * (1 + mixReturn(mission, equity, mission.muE + mission.sigmaE * z1, z1, z2));
      last = take;
    }
    if (alive) ok++;
  }
  return mission.paths > 0 ? ok / mission.paths : 0;
}
