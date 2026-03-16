import type { PayoffChartPoint, StrategyLeg, ViewMode } from "./payoff.types";


export function detectSyntheticLongForward(legs: StrategyLeg[]): {
  detected: boolean;
  strike?: number;
  quantity?: number;
} {
  if (legs.length !== 2) return { detected: false };

  const [a, b] = legs;

  const isCallPutPair =
    ((a.type === "call" && b.type === "put") ||
      (a.type === "put" && b.type === "call")) &&
    a.quantity === b.quantity &&
    (a.strike ?? 0) === (b.strike ?? 0);

  if (!isCallPutPair) return { detected: false };

  const call = a.type === "call" ? a : b;
  const put = a.type === "put" ? a : b;

  if (call.direction === "long" && put.direction === "short") {
    return {
      detected: true,
      strike: call.strike,
      quantity: call.quantity,
    };
  }

  return { detected: false };
}

export function detectSyntheticShortForward(legs: StrategyLeg[]): {
  detected: boolean;
  strike?: number;
  quantity?: number;
} {
  if (legs.length !== 2) return { detected: false };

  const [a, b] = legs;

  const isCallPutPair =
    ((a.type === "call" && b.type === "put") ||
      (a.type === "put" && b.type === "call")) &&
    a.quantity === b.quantity &&
    (a.strike ?? 0) === (b.strike ?? 0);

  if (!isCallPutPair) return { detected: false };

  const call = a.type === "call" ? a : b;
  const put = a.type === "put" ? a : b;

  if (call.direction === "short" && put.direction === "long") {
    return {
      detected: true,
      strike: call.strike,
      quantity: call.quantity,
    };
  }

  return { detected: false };
}

export function addSyntheticOverlay(
  data: PayoffChartPoint[],
  legs: StrategyLeg[],
  mode: ViewMode
): PayoffChartPoint[] {
  const longForward = detectSyntheticLongForward(legs);
  const shortForward = detectSyntheticShortForward(legs);

  if (!longForward.detected && !shortForward.detected) return data;

  const strike = longForward.strike ?? shortForward.strike ?? 0;
  const quantity = longForward.quantity ?? shortForward.quantity ?? 1;
  const direction = longForward.detected ? 1 : -1;

  return data.map((row) => {
    const S = Number(row.S);
    const forwardLeg: StrategyLeg = {
      id: "synthetic-overlay",
      type: "forward",
      direction: direction === 1 ? "long" : "short",
      quantity,
      strike,
      forwardPrice: strike,
    };

    return {
      ...row,
      syntheticForward: getLegValue(forwardLeg, S, mode),
    };
  });
}

export function getYAxisDomain(data: PayoffChartPoint[]): [number, number] {
  const values = data.flatMap((row) =>
    Object.entries(row)
      .filter(([key]) => key !== "S")
      .map(([, value]) => Number(value ?? 0))
  );

  const min = Math.min(...values, 0);
  const max = Math.max(...values, 0);
  const padding = Math.max((max - min) * 0.12, 5);

  return [Math.floor(min - padding), Math.ceil(max + padding)];
}


function signedQuantity(leg: StrategyLeg) {
  return leg.direction === "long" ? leg.quantity : -leg.quantity;
}

export function getLegPayoff(leg: StrategyLeg, S: number): number {
  const q = signedQuantity(leg);

  switch (leg.type) {
    case "stock":
      return q * S;

    case "call":
      return q * Math.max(S - (leg.strike ?? 0), 0);

    case "put":
      return q * Math.max((leg.strike ?? 0) - S, 0);

    case "forward":
      return q * (S - (leg.forwardPrice ?? leg.strike ?? 0));

    case "cash": {
      const amount = leg.cashAmount ?? 0;
      const rate = leg.rate ?? 0;
      return q * amount * (1 + rate);
    }

    default:
      return 0;
  }
}

export function getLegProfit(leg: StrategyLeg, S: number): number {
  const payoff = getLegPayoff(leg, S);
  const directionSign = leg.direction === "long" ? 1 : -1;
  const qAbs = leg.quantity;

  switch (leg.type) {
    case "call":
    case "put": {
      const premium = leg.premium ?? 0;
      return payoff - directionSign * qAbs * premium;
    }

    case "stock": {
      const entryPrice = leg.entryPrice ?? 0;
      return payoff - directionSign * qAbs * entryPrice;
    }

    case "forward":
      return payoff;

    case "cash": {
      const amount = leg.cashAmount ?? 0;
      return payoff - directionSign * qAbs * amount;
    }

    default:
      return payoff;
  }
}

export function getLegValue(leg: StrategyLeg, S: number, mode: ViewMode) {
  return mode === "profit" ? getLegProfit(leg, S) : getLegPayoff(leg, S);
}

export function getStrategyValue(
  legs: StrategyLeg[],
  S: number,
  mode: ViewMode
): number {
  return legs.reduce((sum, leg) => sum + getLegValue(leg, S, mode), 0);
}

export function collectRelevantStrikes(legs: StrategyLeg[]): number[] {
  return [
    ...new Set(
      legs
        .map((leg) =>
          leg.type === "call" || leg.type === "put" || leg.type === "forward"
            ? leg.strike ?? leg.forwardPrice
            : undefined
        )
        .filter((v): v is number => typeof v === "number")
    ),
  ].sort((a, b) => a - b);
}

export function buildChartData(
  legs: StrategyLeg[],
  mode: ViewMode,
  minS = 10,
  maxS = 200,
  points = 140,
  showComponents = false
): PayoffChartPoint[] {
  const data: PayoffChartPoint[] = [];
  const step = (maxS - minS) / points;

  for (let i = 0; i <= points; i++) {
    const S = Number((minS + i * step).toFixed(4));
    const row: PayoffChartPoint = {
      S,
      total: getStrategyValue(legs, S, mode),
    };

    if (showComponents) {
      legs.forEach((leg, index) => {
        row[`leg-${index + 1}`] = getLegValue(leg, S, mode);
      });
    }

    data.push(row);
  }

  return data;
}