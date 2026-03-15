import type {
  BinomialEdge,
  BinomialNode,
  BinomialParams,
  BinomialTreeResult,
} from "./binomial.types";

function payoff(stockPrice: number, strike: number, optionKind: "call" | "put") {
  if (optionKind === "call") {
    return Math.max(stockPrice - strike, 0);
  }
  return Math.max(strike - stockPrice, 0);
}

export function buildBinomialTree(params: BinomialParams): BinomialTreeResult {
  const { S0, K, r, sigma, T, steps, optionKind, exerciseStyle } = params;

  const safeSteps = Math.max(1, Math.floor(steps));
  const dt = T / safeSteps;
  const u = Math.exp(sigma * Math.sqrt(dt));
  const d = 1 / u;
  const discount = Math.exp(-r * dt);
  const growth = Math.exp(r * dt);
  const p = (growth - d) / (u - d);

  const hGap = 150;
  const vGap = 54;
  const nodeWidth = 84;
  const nodeHeight = 42;
  const leftPad = 44;
  const topPad = 54 + safeSteps * 30;

  const stockTree: number[][] = [];
  const optionTree: number[][] = [];

  for (let i = 0; i <= safeSteps; i++) {
    stockTree[i] = [];
    optionTree[i] = [];
    for (let j = 0; j <= i; j++) {
      const upMoves = i - j;
      const downMoves = j;
      stockTree[i][j] = S0 * Math.pow(u, upMoves) * Math.pow(d, downMoves);
      optionTree[i][j] = 0;
    }
  }

  for (let j = 0; j <= safeSteps; j++) {
    optionTree[safeSteps][j] = payoff(stockTree[safeSteps][j], K, optionKind);
  }

  for (let i = safeSteps - 1; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      const continuation =
        discount * (p * optionTree[i + 1][j] + (1 - p) * optionTree[i + 1][j + 1]);

      if (exerciseStyle === "american") {
        const exerciseNow = payoff(stockTree[i][j], K, optionKind);
        optionTree[i][j] = Math.max(continuation, exerciseNow);
      } else {
        optionTree[i][j] = continuation;
      }
    }
  }

  const nodes: BinomialNode[] = [];
  const edges: BinomialEdge[] = [];

  for (let i = 0; i <= safeSteps; i++) {
    for (let j = 0; j <= i; j++) {
      const x = leftPad + i * hGap;
      const y = topPad - i * vGap + j * 2 * vGap;

      nodes.push({
        id: `${i}-${j}`,
        step: i,
        downMoves: j,
        upMoves: i - j,
        stockPrice: stockTree[i][j],
        optionValue: optionTree[i][j],
        x,
        y,
      });

      if (i < safeSteps) {
        edges.push({
          id: `up-${i}-${j}`,
          fromId: `${i}-${j}`,
          toId: `${i + 1}-${j}`,
          kind: "up",
          probabilityLabel: `p=${p.toFixed(3)}`,
        });

        edges.push({
          id: `down-${i}-${j}`,
          fromId: `${i}-${j}`,
          toId: `${i + 1}-${j + 1}`,
          kind: "down",
          probabilityLabel: `1-p=${(1 - p).toFixed(3)}`,
        });
      }
    }
  }

  return {
    u,
    d,
    p,
    dt,
    discount,
    price: optionTree[0][0],
    nodes,
    edges,
    width: leftPad * 2 + safeSteps * hGap + nodeWidth + 40,
    height: topPad * 2 + nodeHeight + 20,
  };
}