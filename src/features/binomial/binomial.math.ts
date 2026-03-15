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
  const { S0, K, u, d, r, steps, optionKind } = params;

  const safeSteps = Math.max(1, Math.floor(steps));
  const discount = 1 / (1 + r);
  const q = (1 + r - d) / (u - d);

  const isFiniteModel =
    Number.isFinite(S0) &&
    Number.isFinite(K) &&
    Number.isFinite(u) &&
    Number.isFinite(d) &&
    Number.isFinite(r) &&
    Number.isFinite(q);

  const isValid =
    isFiniteModel && u > d && d > 0 && u > 0 && r > -1 && q >= 0 && q <= 1;

  let validationMessage: string | null = null;

  if (!isFiniteModel) {
    validationMessage = "A modell paraméterei nem adnak értelmes numerikus eredményt.";
  } else if (!(u > d)) {
    validationMessage = "A modellhez szükséges, hogy u > d legyen.";
  } else if (!(d > 0)) {
    validationMessage = "A lefelé szorzóhoz szükséges, hogy d > 0 legyen.";
  } else if (!(r > -1)) {
    validationMessage = "A kamatlábhoz szükséges, hogy 1 + r pozitív maradjon.";
  } else if (q < 0 || q > 1) {
    validationMessage =
      "A kockázatsemleges valószínűség nem esik 0 és 1 közé. Klasszikus arbitrázsmentes esetben d < 1 + r < u.";
  }

  const hGap = 150;
  const vGap = 54;
  const nodeWidth = 92;
  const nodeHeight = 48;
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

  if (isValid) {
    for (let i = safeSteps - 1; i >= 0; i--) {
      for (let j = 0; j <= i; j++) {
        optionTree[i][j] =
          discount * (q * optionTree[i + 1][j] + (1 - q) * optionTree[i + 1][j + 1]);
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
          probabilityLabel: `q=${q.toFixed(3)}`,
        });

        edges.push({
          id: `down-${i}-${j}`,
          fromId: `${i}-${j}`,
          toId: `${i + 1}-${j + 1}`,
          kind: "down",
          probabilityLabel: `1-q=${(1 - q).toFixed(3)}`,
        });
      }
    }
  }

  return {
    u,
    d,
    q,
    r,
    discount,
    price: isValid ? optionTree[0][0] : 0,
    isValid,
    validationMessage,
    nodes,
    edges,
    width: leftPad * 2 + safeSteps * hGap + nodeWidth + 40,
    height: topPad * 2 + nodeHeight + 20,
  };
}