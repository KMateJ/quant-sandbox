import type {
  BinomialEdge,
  BinomialNode,
  BinomialParams,
  BinomialTreeResult,
  RateTreeParams,
} from "./binomial.types";

function payoff(stockPrice: number, strike: number, optionKind: "call" | "put") {
  if (optionKind === "call") {
    return Math.max(stockPrice - strike, 0);
  }

  return Math.max(strike - stockPrice, 0);
}

function createLayout(safeSteps: number) {
  const hGap = 150;
  const vGap = 54;
  const nodeWidth = 92;
  const nodeHeight = 48;
  const leftPad = 44;
  const topPad = 54 + safeSteps * 30;

  return {
    hGap,
    vGap,
    nodeWidth,
    nodeHeight,
    leftPad,
    topPad,
    width: leftPad * 2 + safeSteps * hGap + nodeWidth + 40,
    height: topPad * 2 + nodeHeight + 20,
  };
}

export function buildBinomialTree(params: BinomialParams): BinomialTreeResult {
  const { S0, K, u, d, r, steps, optionKind } = params;

  const safeSteps = Math.max(1, Math.floor(steps));
  const deltaT = 1;
  const maturity = safeSteps * deltaT;
  const discount = 1 / (1 + r);

  const qDenominator = u - d;
  const q = qDenominator !== 0 ? (1 + r - d) / qDenominator : Number.NaN;

  const isFiniteModel =
    Number.isFinite(S0) &&
    Number.isFinite(K) &&
    Number.isFinite(u) &&
    Number.isFinite(d) &&
    Number.isFinite(r) &&
    Number.isFinite(q);

  const isValid =
    isFiniteModel && u > d && d > 0 && u > 0 && r > -1 && q >= 0 && q <= 1;

  let validationKey: string | null = null;

  if (
    !Number.isFinite(S0) ||
    !Number.isFinite(K) ||
    !Number.isFinite(u) ||
    !Number.isFinite(d) ||
    !Number.isFinite(r)
  ) {
    validationKey = "binomialValidationInvalidParameters";
  } else if (!(u > d)) {
    validationKey = "binomialValidationUGreaterThanD";
  } else if (!(d > 0)) {
    validationKey = "binomialValidationDPositive";
  } else if (!(r > -1)) {
    validationKey = "binomialValidationRatePositiveOnePlusR";
  } else if (!Number.isFinite(q)) {
    validationKey = "binomialValidationQNotComputable";
  } else if (q < 0 || q > 1) {
    validationKey = "binomialValidationQOutOfRange";
  }

  const layout = createLayout(safeSteps);

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

  const qLabel = Number.isFinite(q) ? `q=${q.toFixed(3)}` : "q=–";
  const oneMinusQLabel = Number.isFinite(q) ? `1-q=${(1 - q).toFixed(3)}` : "1-q=–";

  for (let i = 0; i <= safeSteps; i++) {
    for (let j = 0; j <= i; j++) {
      const x = layout.leftPad + i * layout.hGap;
      const y = layout.topPad - i * layout.vGap + j * 2 * layout.vGap;

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
          probabilityLabel: qLabel,
        });

        edges.push({
          id: `down-${i}-${j}`,
          fromId: `${i}-${j}`,
          toId: `${i + 1}-${j + 1}`,
          kind: "down",
          probabilityLabel: oneMinusQLabel,
        });
      }
    }
  }

  let replicatingPortfolio: { delta: number; bond: number } | null = null;

  if (isValid && safeSteps >= 1) {
    const Vup = optionTree[1][0];
    const Vdown = optionTree[1][1];
    const Sup = stockTree[1][0];
    const Sdown = stockTree[1][1];

    const stockDenominator = Sup - Sdown;

    if (stockDenominator !== 0) {
      const delta = (Vup - Vdown) / stockDenominator;
      const bond = (u * Vdown - d * Vup) / ((u - d) * (1 + r));

      replicatingPortfolio = { delta, bond };
    }
  }

  return {
    mode: "equity",
    u,
    d,
    q,
    r,
    deltaT,
    maturity,
    discount,
    price: isValid ? optionTree[0][0] : 0,
    isValid,
    validationKey,
    replicatingPortfolio,
    nodes,
    edges,
    steps,
    width: layout.width,
    height: layout.height,
  };
}

export function buildRateTree(params: RateTreeParams): BinomialTreeResult {
  const { r0, q, steps } = params;
  const h = params.h ?? Math.log(params.u ?? 1.2);
  const u = params.u ?? Math.exp(h);
  const d = params.d ?? Math.exp(-h);
  const safeSteps = Math.max(1, Math.floor(steps));
  const deltaT = 1;
  const maturity = safeSteps * deltaT;
  const discount = 1 / (1 + r0);

  const isFiniteModel =
    Number.isFinite(r0) && Number.isFinite(u) && Number.isFinite(d) && Number.isFinite(q) && Number.isFinite(h);

  const isValid = isFiniteModel && r0 > -1 && h > 0 && u > d && d > 0 && u > 0 && q >= 0 && q <= 1;

  let validationKey: string | null = null;
  if (!isFiniteModel) {
    validationKey = "binomialValidationInvalidParameters";
  } else if (!(u > d)) {
    validationKey = "binomialValidationUGreaterThanD";
  } else if (!(d > 0)) {
    validationKey = "binomialValidationDPositive";
  } else if (!(r0 > -1)) {
    validationKey = "binomialValidationRatePositiveOnePlusR";
  } else if (!(h > 0)) {
    validationKey = "binomialValidationInvalidParameters";
  } else if (q < 0 || q > 1) {
    validationKey = "binomialValidationQOutOfRange";
  }

  const layout = createLayout(safeSteps);

  const rateTree: number[][] = [];
  const bondTree: number[][] = [];
  const statePriceTree: number[][] = [];

  for (let i = 0; i <= safeSteps; i++) {
    rateTree[i] = [];
    bondTree[i] = [];
    statePriceTree[i] = [];

    for (let j = 0; j <= i; j++) {
      const upMoves = i - j;
      const downMoves = j;
      rateTree[i][j] = r0 * Math.pow(u, upMoves) * Math.pow(d, downMoves);
      bondTree[i][j] = i === safeSteps ? 1 : 0;
      statePriceTree[i][j] = 0;
    }
  }

  statePriceTree[0][0] = 1;

  if (isValid) {
    for (let i = 0; i < safeSteps; i++) {
      for (let j = 0; j <= i; j++) {
        const localDiscount = 1 / (1 + rateTree[i][j]);
        const weightedStatePrice = statePriceTree[i][j] * localDiscount;

        statePriceTree[i + 1][j] += weightedStatePrice * q;
        statePriceTree[i + 1][j + 1] += weightedStatePrice * (1 - q);
      }
    }

    for (let i = safeSteps - 1; i >= 0; i--) {
      for (let j = 0; j <= i; j++) {
        bondTree[i][j] =
          (q * bondTree[i + 1][j] + (1 - q) * bondTree[i + 1][j + 1]) /
          (1 + rateTree[i][j]);
      }
    }
  }

  const nodes: BinomialNode[] = [];
  const edges: BinomialEdge[] = [];
  const qLabel = `q=${q.toFixed(3)}`;
  const oneMinusQLabel = `1-q=${(1 - q).toFixed(3)}`;

  for (let i = 0; i <= safeSteps; i++) {
    for (let j = 0; j <= i; j++) {
      const x = layout.leftPad + i * layout.hGap;
      const y = layout.topPad - i * layout.vGap + j * 2 * layout.vGap;

      nodes.push({
        id: `${i}-${j}`,
        step: i,
        downMoves: j,
        upMoves: i - j,
        shortRate: rateTree[i][j],
        bondValue: bondTree[i][j],
        statePrice: statePriceTree[i][j],
        x,
        y,
      });

      if (i < safeSteps) {
        edges.push({
          id: `up-${i}-${j}`,
          fromId: `${i}-${j}`,
          toId: `${i + 1}-${j}`,
          kind: "up",
          probabilityLabel: qLabel,
        });

        edges.push({
          id: `down-${i}-${j}`,
          fromId: `${i}-${j}`,
          toId: `${i + 1}-${j + 1}`,
          kind: "down",
          probabilityLabel: oneMinusQLabel,
        });
      }
    }
  }

  const price = isValid ? bondTree[0][0] : 0;
  const yieldToMaturity = isValid && price > 0 ? -Math.log(price) / maturity : undefined;

  return {
    mode: "rates",
    u,
    d,
    q,
    r: r0,
    h,
    deltaT,
    maturity,
    discount,
    price,
    yieldToMaturity,
    isValid,
    validationKey,
    replicatingPortfolio: null,
    nodes,
    edges,
    steps,
    width: layout.width,
    height: layout.height,
  };
}
