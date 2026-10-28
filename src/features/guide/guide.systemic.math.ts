// Sequential (Furfine-style) default cascade on a small symmetric interbank network for the systemic-contagion lesson.

export type CascadeInput = {
  /// Number of banks on the ring.
  n: number;
  /// Each bank lends to this many banks that follow it on the ring (1 = ring, n − 1 = complete).
  degree: number;
  /// Index of the bank hit by the initial shock.
  shocked: number;
  /// Share of the shocked bank's external assets that is lost.
  shock: number;
  /// Equity as a share of total assets.
  equityRatio: number;
  /// Share of a claim on a defaulted bank that its creditor recovers.
  recovery: number;
  /// Total assets per bank (default 100).
  assets?: number;
  /// Interbank share of total assets (default 0.2).
  interbankShare?: number;
};

export type CascadeResult = {
  equity: number;
  /// What each bank has lent to each of its borrowers.
  exposure: number;
  /// Borrowers of each bank.
  borrowers: number[][];
  /// Round in which each bank defaults (1 = the shocked bank's own round), or 0 if it survives.
  defaultRound: number[];
  /// Cumulative loss of each bank after each round: losses[r][i], r = 0 is round 1 (the last entry may add losses without new defaults).
  losses: number[][];
  rounds: number;
  defaulted: number;
  /// Equity wiped out across the system as a share of total system equity.
  lossShare: number;
};

/// Borrowers of bank i: the `degree` banks that follow it on the ring.
export function borrowersOf(n: number, degree: number): number[][] {
  const d = Math.min(Math.max(1, Math.round(degree)), n - 1);
  return Array.from({ length: n }, (_, i) => Array.from({ length: d }, (_, k) => (i + k + 1) % n));
}

/// Runs the cascade: a bank defaults when its losses exceed its equity; each default costs every creditor exposure × (1 − recovery) in the next round.
export function contagionCascade(input: CascadeInput): CascadeResult {
  const { n, shocked, shock, equityRatio, recovery } = input;
  const assets = input.assets ?? 100;
  const ib = assets * (input.interbankShare ?? 0.2);
  const borrowers = borrowersOf(n, input.degree);
  const exposure = ib / borrowers[0].length;
  const equity = assets * equityRatio;
  const loss = Array<number>(n).fill(0);
  const defaultRound = Array<number>(n).fill(0);
  const losses: number[][] = [];
  loss[shocked] = shock * (assets - ib);
  let fresh = loss[shocked] > equity + 1e-12 ? [shocked] : [];
  fresh.forEach((i) => (defaultRound[i] = 1));
  losses.push([...loss]);
  let round = 1;
  // Each round charges the defaults of the previous round to their creditors.
  while (fresh.length > 0) {
    round += 1;
    for (const j of fresh) for (let i = 0; i < n; i++) if (borrowers[i].includes(j)) loss[i] += exposure * (1 - recovery);
    fresh = [];
    for (let i = 0; i < n; i++) if (!defaultRound[i] && loss[i] > equity + 1e-12) { defaultRound[i] = round; fresh.push(i); }
    losses.push([...loss]);
  }
  const defaulted = defaultRound.filter((r) => r > 0).length;
  const wiped = loss.reduce((s, l) => s + Math.min(l, equity), 0);
  return { equity, exposure, borrowers, defaultRound, losses, rounds: Math.max(...defaultRound), defaulted, lossShare: wiped / (n * equity) };
}

/// Defaults and wiped-out equity share after `step` + 1 rounds of a computed cascade.
export function cascadeSnapshot(r: CascadeResult, step: number) {
  const s = Math.min(Math.max(0, step), r.losses.length - 1);
  const loss = r.losses[s];
  const failed = r.defaultRound.map((d) => d > 0 && d <= s + 1);
  const wiped = loss.reduce((acc, l) => acc + Math.min(l, r.equity), 0);
  return { loss, failed, defaulted: failed.filter(Boolean).length, lossShare: wiped / (loss.length * r.equity), last: s === r.losses.length - 1 };
}
