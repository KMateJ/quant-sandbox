// CRR tree with early exercise, node by node, for the explorable "american-tree" figure.

export type TreeOption = "put" | "call";
export type ExerciseStyle = "american" | "european";
export type NodeDecision = "exercise" | "continue" | "terminal";

export type TreeParams = {
  s0: number;
  k: number;
  sigma: number;
  r: number;
  t: number;
  steps: number;
  option: TreeOption;
  style: ExerciseStyle;
};

/// One node of the tree: step i (0 = today), j up-moves, its price and the backward-induction values.
export type TreeNode = {
  i: number;
  j: number;
  s: number;
  intrinsic: number;
  /// Discounted expected value of the two successors; NaN at maturity.
  continuation: number;
  value: number;
  decision: NodeDecision;
};

export type AmericanTree = {
  u: number;
  d: number;
  q: number;
  /// One-step discount factor e^{−rΔt}.
  disc: number;
  /// nodes[i][j], j = 0 … i (j up-moves).
  nodes: TreeNode[][];
};

/// Payoff of exercising now at price s.
export const intrinsicValue = (option: TreeOption, s: number, k: number) =>
  Math.max(option === "put" ? k - s : s - k, 0);

/// Builds the CRR tree (u = e^{σ√Δt}, d = 1/u) and values it backwards. American nodes take
/// max(intrinsic, continuation); a node is marked "exercise" only when exercising strictly beats waiting.
export function buildAmericanTree(p: TreeParams): AmericanTree {
  const dt = p.t / p.steps;
  const u = Math.exp(p.sigma * Math.sqrt(dt));
  const d = 1 / u;
  const disc = Math.exp(-p.r * dt);
  const q = (Math.exp(p.r * dt) - d) / (u - d);
  const nodes: TreeNode[][] = [];

  for (let i = p.steps; i >= 0; i--) {
    const row: TreeNode[] = [];
    for (let j = 0; j <= i; j++) {
      const s = p.s0 * u ** j * d ** (i - j);
      const intrinsic = intrinsicValue(p.option, s, p.k);
      if (i === p.steps) {
        row.push({ i, j, s, intrinsic, continuation: NaN, value: intrinsic, decision: "terminal" });
        continue;
      }
      const next = nodes[0];
      const continuation = disc * (q * next[j + 1].value + (1 - q) * next[j].value);
      const exercise = p.style === "american" && intrinsic > continuation + 1e-12;
      row.push({ i, j, s, intrinsic, continuation, value: exercise ? intrinsic : continuation, decision: exercise ? "exercise" : "continue" });
    }
    nodes.unshift(row);
  }
  return { u, d, q, disc, nodes };
}

/// Root values of the same tree under both exercise rules, and their difference.
export function earlyExercisePremium(p: Omit<TreeParams, "style">) {
  const american = buildAmericanTree({ ...p, style: "american" }).nodes[0][0].value;
  const european = buildAmericanTree({ ...p, style: "european" }).nodes[0][0].value;
  return { american, european, premium: american - european };
}
