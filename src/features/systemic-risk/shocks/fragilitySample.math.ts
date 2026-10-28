import { subSeed } from "../../../lib/game/seed";
import { resolveSweep } from "../engine/fragility.math";
import { DEFAULT_PARAMS, randomBankNetwork } from "../engine/presets.math";
import { simulate } from "../engine/simulate.math";
import type { FinNetwork, SimResult } from "../engine/systemic.types";

export const SAMPLE_BANKS = 30;

/// One random bank network of average `degree` where the first bank defaults (direct channel only, as in the sweep).
/// `draw` picks another sample of the same degree.
export function sampleCascade(degree: number, seed: number, draw: number): { net: FinNetwork; result: SimResult; failed: string } {
  const sweep = resolveSweep({ seed });
  const net = randomBankNetwork({
    n: SAMPLE_BANKS, degree, interbankShare: sweep.interbankShare, capitalRatio: sweep.capitalRatio, seed: subSeed(seed, 977 + draw),
  });
  const failed = net.institutions[0].id;
  const params = { ...DEFAULT_PARAMS, days: 20, lgd: sweep.lgd, channels: { direct: true, fireSales: false, funding: false, ccp: false } };
  return { net, failed, result: simulate(net, [{ kind: "default", id: failed }], params) };
}
