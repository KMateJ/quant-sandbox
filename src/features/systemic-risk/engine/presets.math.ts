import { makeRng, type Rng } from "../../../lib/math/random";
import { buildNetwork, makeExposure, type BankSpec } from "./build.math";
import type { Exposure, FinNetwork, InstKind, SimParams } from "./systemic.types";

export type PresetId = "starter" | "core-periphery" | "complete" | "ring" | "random";
export const PRESET_IDS: PresetId[] = ["starter", "core-periphery", "complete", "ring", "random"];

/// Baseline simulation parameters (all four channels on, 60 days).
export const DEFAULT_PARAMS: SimParams = {
  days: 60,
  lgd: 0.6,
  distressRatio: 0.04,
  runTrigger: 0.03,
  runFraction: 0.25,
  depositRunFraction: 0.15,
  targetRatio: 0.05,
  priceFloor: 0.4,
  channels: { direct: true, fireSales: true, funding: true, ccp: true },
};

const ID_PREFIX: Record<InstKind, string> = { dealer: "d", bank: "b", regional: "r", mmf: "m", hedgeFund: "h", insurer: "i", ccp: "c" };

/// Letter tag for the i-th institution of a kind: A…Z, then A2…Z2 and so on.
export const letterTag = (i: number) => String.fromCharCode(65 + (i % 26)) + (i >= 26 ? String(Math.floor(i / 26) + 1) : "");

const jit = (rng: Rng, x: number, pct = 0.08) => x * (1 + (rng() * 2 - 1) * pct);
const between = (rng: Rng, lo: number, hi: number) => lo + (hi - lo) * rng();

type Counter = (kind: InstKind) => { id: string; tag: string };
const makeCounter = (): Counter => {
  const n: Partial<Record<InstKind, number>> = {};
  return (kind) => {
    const i = n[kind] ?? 0;
    n[kind] = i + 1;
    return { id: `${ID_PREFIX[kind]}${i + 1}`, tag: letterTag(i) };
  };
};

class Draft {
  specs: BankSpec[] = [];
  exposures: Exposure[] = [];
  private next = makeCounter();
  add(kind: InstKind, s: Omit<BankSpec, "id" | "kind" | "tag">): string {
    const { id, tag } = this.next(kind);
    this.specs.push({ id, kind, tag, ...s });
    return id;
  }
  link(lender: string, borrower: string, type: Exposure["type"], amount: number) {
    this.exposures.push(makeExposure(`x${this.exposures.length + 1}`, lender, borrower, type, amount));
  }
  build(): FinNetwork {
    return buildNetwork(this.specs, this.exposures);
  }
}

// #region core-periphery
const DEALER_SCALE = [1, 0.85, 0.72, 0.6];
const BANK_DEALER = [2, 2, 0, 2, 1, 2, 3, 2, 1, 2, 3, 0];
const REPO_TO_DEALER: [number, number][][] = [[[2, 32], [0, 3]], [[2, 30], [1, 3]]];
const HF_REPO: [number, number][][] = [[[0, 18], [2, 12]], [[1, 22]], [[2, 15], [3, 10]]];
const INSURER_DERIV: [number, number][][] = [[[0, 6], [1, 5]], [[1, 6], [3, 5]]];
const CCP_MARGIN = [14, 12, 10, 9];

function corePeriphery(seed: number): FinNetwork {
  const rng = makeRng(seed * 7919 + 11);
  const d = new Draft();
  const dealers = DEALER_SCALE.map((s) =>
    d.add("dealer", {
      cash: jit(rng, 25 * s), loans: jit(rng, 120 * s),
      holdings: { gov: jit(rng, 130 * s), corp: jit(rng, 25 * s), mbs: jit(rng, 30 * s), equity: jit(rng, 20 * s) },
      leverage: between(rng, 18, 24.5),
    }),
  );
  const banks = BANK_DEALER.map(() =>
    d.add("bank", {
      cash: jit(rng, 8), loans: jit(rng, 55),
      holdings: { gov: jit(rng, 14), corp: jit(rng, 6), mbs: jit(rng, 4), equity: jit(rng, 2) },
      leverage: between(rng, 10, 14),
    }),
  );
  const regionals = Array.from({ length: 6 }, () =>
    d.add("regional", {
      cash: jit(rng, 5), loans: jit(rng, 25),
      holdings: { gov: jit(rng, 5), corp: jit(rng, 1), mbs: jit(rng, 12) },
      leverage: between(rng, 9, 12),
    }),
  );
  const mmfs = REPO_TO_DEALER.map(() => d.add("mmf", { cash: jit(rng, 22), loans: 0, holdings: { gov: jit(rng, 35) }, leverage: 1.01 }));
  const funds = HF_REPO.map(() =>
    d.add("hedgeFund", {
      cash: jit(rng, 6), loans: 0,
      holdings: { gov: jit(rng, 6), corp: jit(rng, 14), mbs: jit(rng, 12), equity: jit(rng, 22) },
      leverage: between(rng, 5, 15),
    }),
  );
  const insurers = INSURER_DERIV.map(() =>
    d.add("insurer", {
      cash: jit(rng, 5), loans: jit(rng, 20),
      holdings: { gov: jit(rng, 20), corp: jit(rng, 55), mbs: jit(rng, 5) },
      leverage: between(rng, 8, 10),
    }),
  );
  const margin = CCP_MARGIN.map((m) => jit(rng, m));
  const ccp = d.add("ccp", { cash: margin.reduce((s, m) => s + m, 0) + 4, loans: 0, holdings: {}, leverage: 1, equity: 4 });

  dealers.forEach((a, i) =>
    dealers.forEach((b, j) => i !== j && d.link(a, b, (i + j) % 2 ? "derivatives" : "interbank", jit(rng, 9))),
  );
  banks.forEach((b, k) => {
    const p = BANK_DEALER[k];
    d.link(b, dealers[p], "interbank", between(rng, 6, 11));
    d.link(dealers[p], b, "interbank", between(rng, 3, 7));
    if (k % 2 === 0) d.link(b, dealers[((p + 1) % 4) || 2], "interbank", between(rng, 3, 6));
    d.link(b, banks[(k + 1) % banks.length], "interbank", 3);
  });
  regionals.forEach((r, k) => {
    d.link(banks[k * 2], r, "interbank", between(rng, 4, 6));
    d.link(r, banks[k * 2 + 1], "interbank", 3);
  });
  mmfs.forEach((m, k) => REPO_TO_DEALER[k].forEach(([di, amt]) => d.link(m, dealers[di], "repo", jit(rng, amt, 0.05))));
  funds.forEach((h, k) => HF_REPO[k].forEach(([di, amt]) => d.link(dealers[di], h, "repo", jit(rng, amt, 0.05))));
  insurers.forEach((s, k) => INSURER_DERIV[k].forEach(([di, amt]) => d.link(s, dealers[di], "derivatives", jit(rng, amt, 0.05))));
  dealers.forEach((a, i) => d.link(a, ccp, "derivatives", margin[i]));
  return d.build();
}
// #endregion

function starter(seed: number): FinNetwork {
  const rng = makeRng(seed * 104729 + 3);
  const d = new Draft();
  const [d1, d2] = [30, 24].map((s) =>
    d.add("dealer", {
      cash: jit(rng, s * 0.08), loans: jit(rng, s * 0.35),
      holdings: { gov: jit(rng, s * 0.3), corp: jit(rng, s * 0.12), mbs: jit(rng, s * 0.15), equity: jit(rng, s * 0.08) },
      leverage: between(rng, 18, 22),
    }),
  );
  const [b1, b2] = [0, 1].map(() =>
    d.add("bank", { cash: jit(rng, 5), loans: jit(rng, 24), holdings: { gov: jit(rng, 6), corp: jit(rng, 2), mbs: jit(rng, 2) }, leverage: between(rng, 10, 13) }),
  );
  const r1 = d.add("regional", { cash: 3, loans: jit(rng, 12), holdings: { gov: 2, mbs: jit(rng, 7) }, leverage: between(rng, 9, 11) });
  const m1 = d.add("mmf", { cash: 3, loans: 0, holdings: { gov: jit(rng, 12) }, leverage: 1.01 });
  const h1 = d.add("hedgeFund", { cash: 3, loans: 0, holdings: { corp: 8, mbs: 6, equity: 10 }, leverage: between(rng, 6, 10) });
  const i1 = d.add("insurer", { cash: 3, loans: 8, holdings: { gov: 8, corp: jit(rng, 24), mbs: 2 }, leverage: between(rng, 8, 10) });
  d.link(d1, d2, "interbank", 8);
  d.link(d2, d1, "interbank", 6);
  d.link(b1, d1, "interbank", 8);
  d.link(d1, b1, "interbank", 4);
  d.link(b2, d2, "interbank", 6);
  d.link(d2, b2, "interbank", 3);
  d.link(b1, b2, "interbank", 4);
  d.link(b1, r1, "interbank", 4);
  d.link(m1, d1, "repo", 18);
  d.link(d2, h1, "repo", 15);
  d.link(i1, d1, "derivatives", 5);
  return d.build();
}

/// `n` identical banks (equal balance sheets, leverage 11), each lending `lent` $bn in total over `links(i)`.
function symmetricBanks(n: number, lent: number, links: (i: number) => number[]): FinNetwork {
  const d = new Draft();
  const ids = Array.from({ length: n }, () => d.add("bank", { cash: 25, loans: 130, holdings: { gov: 25, corp: 10 }, leverage: 11 }));
  ids.forEach((id, i) => {
    const to = links(i);
    to.forEach((j) => d.link(id, ids[j], "interbank", lent / to.length));
  });
  return d.build();
}

const INTERBANK_LENT = 45;
const ringNetwork = () => symmetricBanks(10, INTERBANK_LENT, (i) => [(i + 1) % 10]);
const completeNetwork = () =>
  symmetricBanks(10, INTERBANK_LENT, (i) => Array.from({ length: 10 }, (_, j) => j).filter((j) => j !== i));

export type RandomNetOpts = { n: number; degree: number; interbankShare: number; capitalRatio: number; seed: number };

/// Erdős–Rényi interbank network of `n` equal banks (assets 100 each): every ordered pair is linked with
/// probability degree/(n−1); each bank lends `interbankShare` of its assets, split evenly over its links.
export function randomBankNetwork({ n, degree, interbankShare, capitalRatio, seed }: RandomNetOpts): FinNetwork {
  const rng = makeRng(seed);
  const p = Math.min(1, degree / (n - 1));
  const out = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => j).filter((j) => j !== i && rng() < p));
  const d = new Draft();
  const ids = out.map((to) => {
    const claims = to.length ? interbankShare * 100 : 0;
    return d.add("bank", { cash: 5, loans: 85 - claims, holdings: { gov: 10 }, leverage: 1, equity: capitalRatio * 100 });
  });
  out.forEach((to, i) => to.forEach((j) => d.link(ids[i], ids[j], "interbank", (interbankShare * 100) / to.length)));
  return d.build();
}

/// A named network. `seed` jitters sizes and leverage (not `ring`/`complete`, which are exactly symmetric) and draws `random`;
/// `opts.degree` is the average out-degree of `random`.
export function presetNetwork(id: PresetId, seed: number, opts: { degree?: number } = {}): FinNetwork {
  switch (id) {
    case "starter": return starter(seed);
    case "core-periphery": return corePeriphery(seed);
    case "complete": return completeNetwork();
    case "ring": return ringNetwork();
    case "random": return randomBankNetwork({ n: 30, degree: opts.degree ?? 4, interbankShare: 0.2, capitalRatio: 0.07, seed });
  }
}
