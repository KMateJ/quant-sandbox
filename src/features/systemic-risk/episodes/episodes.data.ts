// Owner: factor-and-systemic-risk plan 08. Dates are public record; every model number is illustrative.
import type { Episode, EpisodeEvent, EpisodeId } from "./episodes.types";

const ev = (date: string, key: string, day: number, role: EpisodeEvent["role"], rest: Partial<EpisodeEvent> = {}): EpisodeEvent =>
  ({ date, key, day, role, shocks: [], interventions: [], ...rest });

const NO_CCP = { channels: { direct: true, fireSales: true, funding: true, ccp: false } };
const TARP_IDS = ["d1", "d3", "r1", "r2", "r3", "r4", "r5", "r6"];

// 2008: most derivatives were bilateral, so the CCP channel is off.
const GFC: Episode = {
  id: "gfc", net: "core-periphery", seed: 1, params: NO_CCP,
  events: [
    ev("2007-08-09", "gfcBnp", 0, "banks", { shocks: [{ kind: "asset", asset: "mbs", drop: 0.02, shape: "instant", day: 0 }, { kind: "run", target: "bank", source: "shortFunding", fraction: 0.15, day: 0 }] }),
    ev("2008-03-16", "gfcBear", 8, "troubledBank", { actor: "d3", shocks: [{ kind: "asset", asset: "mbs", drop: 0.08, shape: "instant", day: 7 }], interventions: [{ kind: "capital", id: "d3", amount: 6, day: 8 }] }),
    ev("2008-09-07", "gfcGse", 20, "market", { shocks: [{ kind: "asset", asset: "mbs", drop: 0.06, shape: "instant", day: 20 }] }),
    ev("2008-09-15", "gfcLehman", 24, "troubledBank", { actor: "d4", shocks: [{ kind: "default", id: "d4", day: 24 }, { kind: "asset", asset: "corp", drop: 0.3, shape: "gradual", days: 8, day: 25 }] }),
    ev("2008-09-16", "gfcAig", 25, "insurer", { actor: "i1", interventions: [{ kind: "capital", id: "i1", amount: 14, day: 25 }] }),
    ev("2008-09-16", "gfcReserve", 25, "mmf", { actor: "m1", shocks: [{ kind: "default", id: "m1", day: 25 }] }),
    ev("2008-10-03", "gfcTarp", 29, "banks", { interventions: TARP_IDS.map((id) => ({ kind: "capital" as const, id, amount: 5, day: 29 })) }),
    ev("2008-10-07", "gfcFacilities", 31, "market", { interventions: [{ kind: "liquidity", day: 31 }] }),
    ev("2008-10-10", "gfcOctober", 32, "market", { shocks: [{ kind: "asset", asset: "equity", drop: 0.2, shape: "gradual", days: 4, day: 32 }, { kind: "asset", asset: "mbs", drop: 0.1, shape: "instant", day: 32 }, { kind: "run", target: "bank", source: "shortFunding", fraction: 1, day: 32 }, { kind: "run", target: "hedgeFund", source: "shortFunding", fraction: 1, day: 32 }] }),
  ],
  switches: [
    { key: "noAig", events: ["gfcAig"] },
    { key: "noTarp", events: ["gfcTarp"] },
  ],
};

const LTCM: Episode = {
  id: "ltcm", net: "core-periphery", seed: 1,
  events: [
    ev("1998-08-17", "ltcmRussia", 0, "macroFund", { actor: "h1", shocks: [{ kind: "asset", asset: "equity", drop: 0.2, shape: "gradual", days: 20, day: 0 }, { kind: "asset", asset: "corp", drop: 0.1, shape: "gradual", days: 20, day: 0 }] }),
    ev("1998-08-21", "ltcmLosses", 4, "macroFund", { actor: "h1" }),
    ev("1998-09-23", "ltcmRecap", 8, "macroFund", { actor: "h1", interventions: ["h1"].map((id) => ({ kind: "capital" as const, id, amount: 15, day: 8 })) }),
    ev("1998-09-29", "ltcmCuts", 12, "market", { interventions: [{ kind: "liquidity", day: 12 }] }),
  ],
  switches: [{ key: "noRecap", events: ["ltcmRecap"] }],
};

const COVID: Episode = {
  id: "covid2020", net: "core-periphery", seed: 1,
  events: [
    ev("2020-03-12", "covidDash", 0, "market", { shocks: [{ kind: "asset", asset: "gov", drop: 0.05, shape: "gradual", days: 14, day: 0 }, { kind: "asset", asset: "corp", drop: 0.1, shape: "gradual", days: 14, day: 0 }, { kind: "run", target: "hedgeFund", source: "shortFunding", fraction: 0.3, day: 2 }, { kind: "run", target: "mmf", source: "deposits", fraction: 0.15, day: 2 }, { kind: "run", target: "mmf", source: "deposits", fraction: 0.15, day: 4 }] }),
    ev("2020-03-15", "covidPurchases", 3, "market", { interventions: [{ kind: "assetPurchases", asset: "gov", amount: 60, day: 3 }, { kind: "assetPurchases", asset: "gov", amount: 60, day: 4 }, { kind: "assetPurchases", asset: "mbs", amount: 20, day: 3 }] }),
    ev("2020-03-17", "covidFacilities", 5, "mmf", { actor: "m1", interventions: [{ kind: "liquidity", day: 5 }, { kind: "guarantee", day: 5 }] }),
    ev("2020-03-23", "covidOpenEnded", 8, "market", { interventions: [{ kind: "assetPurchases", asset: "corp", amount: 20, day: 8 }, { kind: "assetPurchases", asset: "corp", amount: 20, day: 9 }] }),
  ],
  switches: [
    { key: "noPurchases", events: ["covidPurchases", "covidOpenEnded"] },
    { key: "noFacilities", events: ["covidFacilities"] },
  ],
};

const SVB: Episode = {
  id: "svb2023", net: "core-periphery", seed: 1,
  events: [
    ev("2023-03-08", "svbLoss", 0, "regional", { actor: "r1", shocks: [{ kind: "asset", asset: "mbs", drop: 0.2, shape: "instant", day: 0 }] }),
    ev("2023-03-09", "svbRun", 1, "regional", { actor: "r1", shocks: [{ kind: "run", target: "r1", source: "deposits", fraction: 0.4, day: 1 }] }),
    ev("2023-03-10", "svbReceivership", 2, "regional", { actor: "r1", shocks: [{ kind: "default", id: "r1", day: 2 }] }),
    ev("2023-03-12", "svbSignature", 4, "regional", { interventions: [{ kind: "guarantee", day: 4 }], shocks: [{ kind: "run", target: "regional", source: "deposits", fraction: 0.3, day: 5 }, { kind: "run", target: "regional", source: "deposits", fraction: 0.3, day: 6 }] }),
    ev("2023-03-12", "svbBtfp", 4, "market", { interventions: [{ kind: "parLending", day: 4 }], shocks: [{ kind: "asset", asset: "mbs", drop: 0.1, shape: "instant", day: 4 }, ...[5, 6, 7].map((day) => ({ kind: "run" as const, target: "bank", source: "shortFunding" as const, fraction: 0.5, day }))] }),
    ev("2023-03-19", "svbUbs", 12, "market"),
    ev("2023-05-01", "svbFirstRepublic", 30, "regional"),
  ],
  switches: [
    { key: "noGuarantee", events: ["svbSignature"] },
    { key: "noPar", events: ["svbBtfp"] },
  ],
};

export const EPISODES: Record<EpisodeId, Episode> = { gfc: GFC, ltcm: LTCM, covid2020: COVID, svb2023: SVB };
