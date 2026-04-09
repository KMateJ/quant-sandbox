import type { PayoffChartPoint, StrategyLeg, ViewMode } from "./payoff.types";

export type SyntheticMatch = {
  key: string;
  label: string;
  formula: string;
  overlayLegs: StrategyLeg[];
};

const EPSILON = 1e-6;

function nearlyEqual(a: number | undefined, b: number | undefined, epsilon = EPSILON) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return false;
  return Math.abs((a ?? 0) - (b ?? 0)) <= epsilon;
}

function finiteNumbers(values: Array<number | undefined>): number[] {
  return values.filter((value): value is number => Number.isFinite(value));
}

function isBetweenInclusive(value: number, lower: number, upper: number) {
  return value >= lower && value <= upper;
}

function directionSign(direction: StrategyLeg["direction"]) {
  return direction === "long" ? 1 : -1;
}

function signedQuantity(leg: StrategyLeg) {
  return directionSign(leg.direction) * leg.quantity;
}

function forwardContractPrice(leg: StrategyLeg) {
  return leg.forwardPrice ?? leg.strike ?? 0;
}

function cashTerminalValue(leg: StrategyLeg) {
  return (leg.cashAmount ?? 0) * (1 + (leg.rate ?? 0));
}

function getPair<T extends StrategyLeg["type"], U extends StrategyLeg["type"]>(
  legs: StrategyLeg[],
  firstType: T,
  secondType: U
) {
  if (legs.length !== 2) return null;

  const first = legs.find((leg) => leg.type === firstType);
  const second = legs.find((leg) => leg.type === secondType);

  if (!first || !second) return null;
  return { first, second };
}

function getTriad<
  A extends StrategyLeg["type"],
  B extends StrategyLeg["type"],
  C extends StrategyLeg["type"]
>(legs: StrategyLeg[], aType: A, bType: B, cType: C) {
  if (legs.length !== 3) return null;

  const a = legs.find((leg) => leg.type === aType);
  const b = legs.find((leg) => leg.type === bType);
  const c = legs.find((leg) => leg.type === cType);

  if (!a || !b || !c) return null;
  return { a, b, c };
}

function sameQuantity(...legs: StrategyLeg[]) {
  if (legs.length < 2) return true;
  const base = legs[0]?.quantity ?? 0;
  return legs.every((leg) => nearlyEqual(leg.quantity, base));
}

function formatType(type: StrategyLeg["type"]) {
  switch (type) {
    case "stock":
      return "Stock";
    case "call":
      return "Call";
    case "put":
      return "Put";
    case "forward":
      return "Forward";
    case "cash":
      return "Cash";
    case "digital-call":
      return "Digital Call";
    case "digital-put":
      return "Digital Put";
    case "asset-call":
      return "Asset Call";
    case "asset-put":
      return "Asset Put";
    case "gap-call":
      return "Gap Call";
    case "gap-put":
      return "Gap Put";
    case "double-digital":
      return "Double Digital";
    case "supershare":
      return "Supershare";
    default:
      return type;
  }
}

function formatLeg(leg: StrategyLeg) {
  const direction = leg.direction === "long" ? "Long" : "Short";
  return `${direction} ${formatType(leg.type)}`;
}

function formulaFromLegs(legs: StrategyLeg[], label: string) {
  return `${legs.map(formatLeg).join(" + ")} = ${label}`;
}

function createMatch(
  key: string,
  label: string,
  sourceLegs: StrategyLeg[],
  overlayLegs: StrategyLeg[]
): SyntheticMatch {
  return {
    key,
    label,
    formula: formulaFromLegs(sourceLegs, label),
    overlayLegs,
  };
}

function detectSyntheticForwardFromCallPut(legs: StrategyLeg[]) {
  const pair = getPair(legs, "call", "put");
  if (!pair) return [];

  const { first: call, second: put } = pair;
  if (!sameQuantity(call, put) || !nearlyEqual(call.strike, put.strike)) {
    return [];
  }

  const strike = call.strike ?? put.strike ?? 0;
  const quantity = call.quantity;

  if (call.direction === "long" && put.direction === "short") {
    return [
      createMatch(
        "synthetic-long-forward-from-call-put",
        "Synthetic Long Forward",
        [call, put],
        [
          {
            id: "synthetic-overlay",
            type: "forward",
            direction: "long",
            quantity,
            strike,
            forwardPrice: strike,
          },
        ]
      ),
    ];
  }

  if (call.direction === "short" && put.direction === "long") {
    return [
      createMatch(
        "synthetic-short-forward-from-call-put",
        "Synthetic Short Forward",
        [call, put],
        [
          {
            id: "synthetic-overlay",
            type: "forward",
            direction: "short",
            quantity,
            strike,
            forwardPrice: strike,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticForwardFromStockCash(legs: StrategyLeg[]) {
  const pair = getPair(legs, "stock", "cash");
  if (!pair) return [];

  const { first: stock, second: cash } = pair;
  if (!sameQuantity(stock, cash)) return [];

  const maturityValue = cashTerminalValue(cash);
  const quantity = stock.quantity;

  if (stock.direction === "long" && cash.direction === "short") {
    return [
      createMatch(
        "synthetic-long-forward-from-stock-cash",
        "Synthetic Long Forward",
        [stock, cash],
        [
          {
            id: "synthetic-overlay",
            type: "forward",
            direction: "long",
            quantity,
            strike: maturityValue,
            forwardPrice: maturityValue,
          },
        ]
      ),
    ];
  }

  if (stock.direction === "short" && cash.direction === "long") {
    return [
      createMatch(
        "synthetic-short-forward-from-stock-cash",
        "Synthetic Short Forward",
        [stock, cash],
        [
          {
            id: "synthetic-overlay",
            type: "forward",
            direction: "short",
            quantity,
            strike: maturityValue,
            forwardPrice: maturityValue,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticCallFromPutForward(legs: StrategyLeg[]) {
  const pair = getPair(legs, "put", "forward");
  if (!pair) return [];

  const { first: put, second: forward } = pair;
  const strike = put.strike ?? 0;
  if (!sameQuantity(put, forward) || !nearlyEqual(strike, forwardContractPrice(forward))) {
    return [];
  }

  const quantity = put.quantity;

  if (put.direction === "long" && forward.direction === "long") {
    return [
      createMatch(
        "synthetic-long-call-from-put-forward",
        "Synthetic Long Call",
        [put, forward],
        [
          {
            id: "synthetic-overlay",
            type: "call",
            direction: "long",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  if (put.direction === "short" && forward.direction === "short") {
    return [
      createMatch(
        "synthetic-short-call-from-put-forward",
        "Synthetic Short Call",
        [put, forward],
        [
          {
            id: "synthetic-overlay",
            type: "call",
            direction: "short",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticCallFromStockPutCash(legs: StrategyLeg[]) {
  const triad = getTriad(legs, "stock", "put", "cash");
  if (!triad) return [];

  const { a: stock, b: put, c: cash } = triad;
  const strike = put.strike ?? 0;
  if (
    !sameQuantity(stock, put, cash) ||
    !nearlyEqual(cashTerminalValue(cash), strike)
  ) {
    return [];
  }

  const quantity = stock.quantity;

  if (stock.direction === "long" && put.direction === "long" && cash.direction === "short") {
    return [
      createMatch(
        "synthetic-long-call-from-stock-put-cash",
        "Synthetic Long Call",
        [stock, put, cash],
        [
          {
            id: "synthetic-overlay",
            type: "call",
            direction: "long",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  if (stock.direction === "short" && put.direction === "short" && cash.direction === "long") {
    return [
      createMatch(
        "synthetic-short-call-from-stock-put-cash",
        "Synthetic Short Call",
        [stock, put, cash],
        [
          {
            id: "synthetic-overlay",
            type: "call",
            direction: "short",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticPutFromCallForward(legs: StrategyLeg[]) {
  const pair = getPair(legs, "call", "forward");
  if (!pair) return [];

  const { first: call, second: forward } = pair;
  const strike = call.strike ?? 0;
  if (!sameQuantity(call, forward) || !nearlyEqual(strike, forwardContractPrice(forward))) {
    return [];
  }

  const quantity = call.quantity;

  if (call.direction === "long" && forward.direction === "short") {
    return [
      createMatch(
        "synthetic-long-put-from-call-forward",
        "Synthetic Long Put",
        [call, forward],
        [
          {
            id: "synthetic-overlay",
            type: "put",
            direction: "long",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  if (call.direction === "short" && forward.direction === "long") {
    return [
      createMatch(
        "synthetic-short-put-from-call-forward",
        "Synthetic Short Put",
        [call, forward],
        [
          {
            id: "synthetic-overlay",
            type: "put",
            direction: "short",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticPutFromStockCallCash(legs: StrategyLeg[]) {
  const triad = getTriad(legs, "stock", "call", "cash");
  if (!triad) return [];

  const { a: stock, b: call, c: cash } = triad;
  const strike = call.strike ?? 0;
  if (
    !sameQuantity(stock, call, cash) ||
    !nearlyEqual(cashTerminalValue(cash), strike)
  ) {
    return [];
  }

  const quantity = stock.quantity;

  if (stock.direction === "short" && call.direction === "long" && cash.direction === "long") {
    return [
      createMatch(
        "synthetic-long-put-from-stock-call-cash",
        "Synthetic Long Put",
        [stock, call, cash],
        [
          {
            id: "synthetic-overlay",
            type: "put",
            direction: "long",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  if (stock.direction === "long" && call.direction === "short" && cash.direction === "short") {
    return [
      createMatch(
        "synthetic-short-put-from-stock-call-cash",
        "Synthetic Short Put",
        [stock, call, cash],
        [
          {
            id: "synthetic-overlay",
            type: "put",
            direction: "short",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticStockFromCallPutCash(legs: StrategyLeg[]) {
  const triad = getTriad(legs, "call", "put", "cash");
  if (!triad) return [];

  const { a: call, b: put, c: cash } = triad;
  const strike = call.strike ?? 0;
  if (
    !sameQuantity(call, put, cash) ||
    !nearlyEqual(call.strike, put.strike) ||
    !nearlyEqual(cashTerminalValue(cash), strike)
  ) {
    return [];
  }

  const quantity = call.quantity;

  if (call.direction === "long" && put.direction === "short" && cash.direction === "long") {
    return [
      createMatch(
        "synthetic-long-stock-from-call-put-cash",
        "Synthetic Long Stock",
        [call, put, cash],
        [
          {
            id: "synthetic-overlay",
            type: "stock",
            direction: "long",
            quantity,
            entryPrice: 0,
          },
        ]
      ),
    ];
  }

  if (call.direction === "short" && put.direction === "long" && cash.direction === "short") {
    return [
      createMatch(
        "synthetic-short-stock-from-call-put-cash",
        "Synthetic Short Stock",
        [call, put, cash],
        [
          {
            id: "synthetic-overlay",
            type: "stock",
            direction: "short",
            quantity,
            entryPrice: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticCashFromStockPutCall(legs: StrategyLeg[]) {
  const triad = getTriad(legs, "stock", "put", "call");
  if (!triad) return [];

  const { a: stock, b: put, c: call } = triad;
  const strike = call.strike ?? 0;
  if (!sameQuantity(stock, put, call) || !nearlyEqual(call.strike, put.strike)) {
    return [];
  }

  const quantity = stock.quantity;

  if (stock.direction === "long" && put.direction === "long" && call.direction === "short") {
    return [
      createMatch(
        "synthetic-long-cash-from-stock-put-call",
        "Synthetic Long Cash",
        [stock, put, call],
        [
          {
            id: "synthetic-overlay",
            type: "cash",
            direction: "long",
            quantity,
            cashAmount: strike,
            rate: 0,
          },
        ]
      ),
    ];
  }

  if (stock.direction === "short" && put.direction === "short" && call.direction === "long") {
    return [
      createMatch(
        "synthetic-short-cash-from-stock-put-call",
        "Synthetic Short Cash",
        [stock, put, call],
        [
          {
            id: "synthetic-overlay",
            type: "cash",
            direction: "short",
            quantity,
            cashAmount: strike,
            rate: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticAssetCallFromCallDigital(legs: StrategyLeg[]) {
  const pair = getPair(legs, "call", "digital-call");
  if (!pair) return [];

  const { first: call, second: digital } = pair;
  const strike = call.strike ?? 0;
  const payout = digital.payout ?? 0;
  if (!sameQuantity(call, digital) || !nearlyEqual(call.strike, digital.strike)) {
    return [];
  }

  const quantity = call.quantity;

  if (nearlyEqual(payout, strike) && call.direction === digital.direction) {
    return [
      createMatch(
        call.direction === "long"
          ? "synthetic-long-asset-call"
          : "synthetic-short-asset-call",
        call.direction === "long"
          ? "Synthetic Long Asset Call"
          : "Synthetic Short Asset Call",
        [call, digital],
        [
          {
            id: "synthetic-overlay",
            type: "asset-call",
            direction: call.direction,
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticAssetPutFromPutDigital(legs: StrategyLeg[]) {
  const pair = getPair(legs, "put", "digital-put");
  if (!pair) return [];

  const { first: put, second: digital } = pair;
  const strike = put.strike ?? 0;
  const payout = digital.payout ?? 0;
  if (!sameQuantity(put, digital) || !nearlyEqual(put.strike, digital.strike)) {
    return [];
  }

  const quantity = put.quantity;

  if (nearlyEqual(payout, strike) && put.direction === digital.direction) {
    return [
      createMatch(
        put.direction === "long"
          ? "synthetic-long-asset-put"
          : "synthetic-short-asset-put",
        put.direction === "long"
          ? "Synthetic Long Asset Put"
          : "Synthetic Short Asset Put",
        [put, digital],
        [
          {
            id: "synthetic-overlay",
            type: "asset-put",
            direction: put.direction,
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticDigitalCallFromAssetCall(legs: StrategyLeg[]) {
  const pair = getPair(legs, "asset-call", "call");
  if (!pair) return [];

  const { first: assetCall, second: call } = pair;
  const strike = assetCall.strike ?? 0;
  if (!sameQuantity(assetCall, call) || !nearlyEqual(assetCall.strike, call.strike)) {
    return [];
  }

  const quantity = assetCall.quantity;

  if (assetCall.direction === "long" && call.direction === "short") {
    return [
      createMatch(
        "synthetic-long-digital-call",
        `Synthetic Long Digital Call (payout ${strike})`,
        [assetCall, call],
        [
          {
            id: "synthetic-overlay",
            type: "digital-call",
            direction: "long",
            quantity,
            strike,
            payout: strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  if (assetCall.direction === "short" && call.direction === "long") {
    return [
      createMatch(
        "synthetic-short-digital-call",
        `Synthetic Short Digital Call (payout ${strike})`,
        [assetCall, call],
        [
          {
            id: "synthetic-overlay",
            type: "digital-call",
            direction: "short",
            quantity,
            strike,
            payout: strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticDigitalPutFromAssetPut(legs: StrategyLeg[]) {
  const pair = getPair(legs, "asset-put", "put");
  if (!pair) return [];

  const { first: assetPut, second: put } = pair;
  const strike = assetPut.strike ?? 0;
  if (!sameQuantity(assetPut, put) || !nearlyEqual(assetPut.strike, put.strike)) {
    return [];
  }

  const quantity = assetPut.quantity;

  if (assetPut.direction === "long" && put.direction === "short") {
    return [
      createMatch(
        "synthetic-long-digital-put",
        `Synthetic Long Digital Put (payout ${strike})`,
        [assetPut, put],
        [
          {
            id: "synthetic-overlay",
            type: "digital-put",
            direction: "long",
            quantity,
            strike,
            payout: strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  if (assetPut.direction === "short" && put.direction === "long") {
    return [
      createMatch(
        "synthetic-short-digital-put",
        `Synthetic Short Digital Put (payout ${strike})`,
        [assetPut, put],
        [
          {
            id: "synthetic-overlay",
            type: "digital-put",
            direction: "short",
            quantity,
            strike,
            payout: strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticCallFromAssetCallDigital(legs: StrategyLeg[]) {
  const pair = getPair(legs, "asset-call", "digital-call");
  if (!pair) return [];

  const { first: assetCall, second: digital } = pair;
  const strike = assetCall.strike ?? 0;
  if (
    !sameQuantity(assetCall, digital) ||
    !nearlyEqual(assetCall.strike, digital.strike) ||
    !nearlyEqual(digital.payout, strike)
  ) {
    return [];
  }

  const quantity = assetCall.quantity;

  if (assetCall.direction === "long" && digital.direction === "short") {
    return [
      createMatch(
        "synthetic-long-call-from-asset-call-digital",
        "Synthetic Long Call",
        [assetCall, digital],
        [
          {
            id: "synthetic-overlay",
            type: "call",
            direction: "long",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  if (assetCall.direction === "short" && digital.direction === "long") {
    return [
      createMatch(
        "synthetic-short-call-from-asset-call-digital",
        "Synthetic Short Call",
        [assetCall, digital],
        [
          {
            id: "synthetic-overlay",
            type: "call",
            direction: "short",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticPutFromAssetPutDigital(legs: StrategyLeg[]) {
  const pair = getPair(legs, "asset-put", "digital-put");
  if (!pair) return [];

  const { first: assetPut, second: digital } = pair;
  const strike = assetPut.strike ?? 0;
  if (
    !sameQuantity(assetPut, digital) ||
    !nearlyEqual(assetPut.strike, digital.strike) ||
    !nearlyEqual(digital.payout, strike)
  ) {
    return [];
  }

  const quantity = assetPut.quantity;

  if (assetPut.direction === "long" && digital.direction === "short") {
    return [
      createMatch(
        "synthetic-long-put-from-asset-put-digital",
        "Synthetic Long Put",
        [assetPut, digital],
        [
          {
            id: "synthetic-overlay",
            type: "put",
            direction: "long",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  if (assetPut.direction === "short" && digital.direction === "long") {
    return [
      createMatch(
        "synthetic-short-put-from-asset-put-digital",
        "Synthetic Short Put",
        [assetPut, digital],
        [
          {
            id: "synthetic-overlay",
            type: "put",
            direction: "short",
            quantity,
            strike,
            premium: 0,
          },
        ]
      ),
    ];
  }

  return [];
}

function detectSyntheticGapCall(legs: StrategyLeg[]) {
  const pair = getPair(legs, "call", "digital-call");
  if (!pair) return [];

  const { first: call, second: digital } = pair;
  const triggerStrike = call.strike ?? 0;
  if (!sameQuantity(call, digital) || !nearlyEqual(call.strike, digital.strike)) {
    return [];
  }

  if (nearlyEqual(digital.payout, triggerStrike) && call.direction === digital.direction) {
    return [];
  }

  const relativeSign = directionSign(digital.direction) / directionSign(call.direction);
  const settlementStrike = triggerStrike - relativeSign * (digital.payout ?? 0);

  return [
    createMatch(
      `synthetic-${call.direction}-gap-call`,
      call.direction === "long" ? "Synthetic Long Gap Call" : "Synthetic Short Gap Call",
      [call, digital],
      [
        {
          id: "synthetic-overlay",
          type: "gap-call",
          direction: call.direction,
          quantity: call.quantity,
          triggerStrike,
          settlementStrike,
          premium: 0,
        },
      ]
    ),
  ];
}

function detectSyntheticGapPut(legs: StrategyLeg[]) {
  const pair = getPair(legs, "put", "digital-put");
  if (!pair) return [];

  const { first: put, second: digital } = pair;
  const triggerStrike = put.strike ?? 0;
  if (!sameQuantity(put, digital) || !nearlyEqual(put.strike, digital.strike)) {
    return [];
  }

  if (nearlyEqual(digital.payout, triggerStrike) && put.direction === digital.direction) {
    return [];
  }

  const relativeSign = directionSign(digital.direction) / directionSign(put.direction);
  const settlementStrike = triggerStrike + relativeSign * (digital.payout ?? 0);

  return [
    createMatch(
      `synthetic-${put.direction}-gap-put`,
      put.direction === "long" ? "Synthetic Long Gap Put" : "Synthetic Short Gap Put",
      [put, digital],
      [
        {
          id: "synthetic-overlay",
          type: "gap-put",
          direction: put.direction,
          quantity: put.quantity,
          triggerStrike,
          settlementStrike,
          premium: 0,
        },
      ]
    ),
  ];
}

export function detectSyntheticMatches(legs: StrategyLeg[]): SyntheticMatch[] {
  const matches = [
    ...detectSyntheticForwardFromCallPut(legs),
    ...detectSyntheticForwardFromStockCash(legs),
    ...detectSyntheticCallFromPutForward(legs),
    ...detectSyntheticCallFromStockPutCash(legs),
    ...detectSyntheticPutFromCallForward(legs),
    ...detectSyntheticPutFromStockCallCash(legs),
    ...detectSyntheticStockFromCallPutCash(legs),
    ...detectSyntheticCashFromStockPutCall(legs),
    ...detectSyntheticAssetCallFromCallDigital(legs),
    ...detectSyntheticAssetPutFromPutDigital(legs),
    ...detectSyntheticDigitalCallFromAssetCall(legs),
    ...detectSyntheticDigitalPutFromAssetPut(legs),
    ...detectSyntheticCallFromAssetCallDigital(legs),
    ...detectSyntheticPutFromAssetPutDigital(legs),
    ...detectSyntheticGapCall(legs),
    ...detectSyntheticGapPut(legs),
  ];

  const seen = new Set<string>();
  return matches.filter((match) => {
    const signature = `${match.label}|${match.formula}`;
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
}

export function getPrimarySyntheticMatch(legs: StrategyLeg[]) {
  return detectSyntheticMatches(legs)[0] ?? null;
}

export function addSyntheticOverlay(
  data: PayoffChartPoint[],
  match: SyntheticMatch | null,
  mode: ViewMode
): PayoffChartPoint[] {
  if (!match || mode !== "payoff") return data;

  return data.map((row) => {
    const S = Number(row.S);
    return {
      ...row,
      syntheticOverlay: getStrategyValue(match.overlayLegs, S, "payoff"),
    };
  });
}

export function getXAxisDomain(legs: StrategyLeg[]): [number, number] {
  const anchors = legs.flatMap((leg) => {
    switch (leg.type) {
      case "call":
      case "put":
      case "digital-call":
      case "digital-put":
      case "asset-call":
      case "asset-put":
        return finiteNumbers([leg.strike]);

      case "gap-call":
      case "gap-put":
        return finiteNumbers([leg.triggerStrike, leg.settlementStrike]);

      case "double-digital":
      case "supershare":
        return finiteNumbers([leg.lowerStrike, leg.upperStrike]);

      case "forward":
        return finiteNumbers([leg.forwardPrice, leg.strike]);

      case "stock":
        return finiteNumbers([leg.entryPrice]);

      case "cash":
      default:
        return [];
    }
  });

  if (!anchors.length) return [0, 200];

  const min = Math.min(...anchors);
  const max = Math.max(...anchors);
  const span = max - min;
  const padding = span === 0 ? Math.max(Math.abs(min) * 0.4, 20) : Math.max(span * 0.35, 10);

  const lower = Math.max(0, Math.floor(min - padding));
  const upper = Math.ceil(max + padding);

  if (lower === upper) {
    return [Math.max(0, lower - 20), upper + 20];
  }

  return [lower, upper];
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

function getPremiumAdjustedProfit(leg: StrategyLeg, payoff: number) {
  const premium = leg.premium ?? 0;
  return payoff - directionSign(leg.direction) * leg.quantity * premium;
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

    case "digital-call":
      return q * (S >= (leg.strike ?? 0) ? leg.payout ?? 1 : 0);

    case "digital-put":
      return q * (S <= (leg.strike ?? 0) ? leg.payout ?? 1 : 0);

    case "asset-call":
      return q * (S >= (leg.strike ?? 0) ? S : 0);

    case "asset-put":
      return q * (S <= (leg.strike ?? 0) ? S : 0);

    case "gap-call":
      return q * (S >= (leg.triggerStrike ?? 0) ? S - (leg.settlementStrike ?? 0) : 0);

    case "gap-put":
      return q * (S <= (leg.triggerStrike ?? 0) ? (leg.settlementStrike ?? 0) - S : 0);

    case "double-digital": {
      const lower = Math.min(leg.lowerStrike ?? 0, leg.upperStrike ?? 0);
      const upper = Math.max(leg.lowerStrike ?? 0, leg.upperStrike ?? 0);
      return q * (isBetweenInclusive(S, lower, upper) ? leg.payout ?? 1 : 0);
    }

    case "supershare": {
      const lower = Math.min(leg.lowerStrike ?? 0, leg.upperStrike ?? 0);
      const upper = Math.max(leg.lowerStrike ?? 0, leg.upperStrike ?? 0);
      if (!isBetweenInclusive(S, lower, upper) || lower === 0) {
        return 0;
      }
      return q * (S / lower);
    }

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
  const direction = directionSign(leg.direction);
  const qAbs = leg.quantity;

  switch (leg.type) {
    case "call":
    case "put":
    case "digital-call":
    case "digital-put":
    case "asset-call":
    case "asset-put":
    case "gap-call":
    case "gap-put":
    case "double-digital":
    case "supershare":
      return getPremiumAdjustedProfit(leg, payoff);

    case "stock": {
      const entryPrice = leg.entryPrice ?? 0;
      return payoff - direction * qAbs * entryPrice;
    }

    case "forward":
      return payoff;

    case "cash": {
      const amount = leg.cashAmount ?? 0;
      return payoff - direction * qAbs * amount;
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
        .flatMap((leg) => {
          switch (leg.type) {
            case "call":
            case "put":
            case "digital-call":
            case "digital-put":
            case "asset-call":
            case "asset-put":
              return [leg.strike];

            case "forward":
              return [leg.strike ?? leg.forwardPrice, leg.forwardPrice];

            case "gap-call":
            case "gap-put":
              return [leg.triggerStrike, leg.settlementStrike];

            case "double-digital":
            case "supershare":
              return [leg.lowerStrike, leg.upperStrike];

            default:
              return [];
          }
        })
        .filter((value): value is number => typeof value === "number" && Number.isFinite(value))
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
