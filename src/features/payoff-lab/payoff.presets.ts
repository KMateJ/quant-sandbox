import type { PresetKey, StrategyLeg } from "./payoff.types";

function createLeg(
  partial: Omit<StrategyLeg, "id">,
  index: number
): StrategyLeg {
  return {
    id: `preset-${index}-${partial.type}`,
    ...partial,
  };
}

export function getPresetStrategy(preset: PresetKey): StrategyLeg[] {
  switch (preset) {
    case "long-call":
      return [
        createLeg(
          {
            type: "call",
            direction: "long",
            quantity: 1,
            strike: 100,
            premium: 8,
          },
          1
        ),
      ];

    case "long-put":
      return [
        createLeg(
          {
            type: "put",
            direction: "long",
            quantity: 1,
            strike: 100,
            premium: 7,
          },
          1
        ),
      ];

    case "long-stock":
      return [
        createLeg(
          {
            type: "stock",
            direction: "long",
            quantity: 1,
            entryPrice: 100,
          },
          1
        ),
      ];

    case "cash":
      return [
        createLeg(
          {
            type: "cash",
            direction: "long",
            quantity: 1,
            cashAmount: 100,
            rate: 0.05,
          },
          1
        ),
      ];

    case "covered-call":
      return [
        createLeg(
          {
            type: "stock",
            direction: "long",
            quantity: 1,
            entryPrice: 100,
          },
          1
        ),
        createLeg(
          {
            type: "call",
            direction: "short",
            quantity: 1,
            strike: 110,
            premium: 4,
          },
          2
        ),
      ];

    case "protective-put":
      return [
        createLeg(
          {
            type: "stock",
            direction: "long",
            quantity: 1,
            entryPrice: 100,
          },
          1
        ),
        createLeg(
          {
            type: "put",
            direction: "long",
            quantity: 1,
            strike: 90,
            premium: 3,
          },
          2
        ),
      ];

    case "collar":
      return [
        createLeg(
          {
            type: "stock",
            direction: "long",
            quantity: 1,
            entryPrice: 100,
          },
          1
        ),
        createLeg(
          {
            type: "put",
            direction: "long",
            quantity: 1,
            strike: 90,
            premium: 3,
          },
          2
        ),
        createLeg(
          {
            type: "call",
            direction: "short",
            quantity: 1,
            strike: 110,
            premium: 4,
          },
          3
        ),
      ];

    case "bull-call-spread":
      return [
        createLeg(
          {
            type: "call",
            direction: "long",
            quantity: 1,
            strike: 95,
            premium: 11,
          },
          1
        ),
        createLeg(
          {
            type: "call",
            direction: "short",
            quantity: 1,
            strike: 110,
            premium: 4,
          },
          2
        ),
      ];

    case "bear-put-spread":
      return [
        createLeg(
          {
            type: "put",
            direction: "long",
            quantity: 1,
            strike: 110,
            premium: 9,
          },
          1
        ),
        createLeg(
          {
            type: "put",
            direction: "short",
            quantity: 1,
            strike: 95,
            premium: 3,
          },
          2
        ),
      ];

    case "long-straddle":
      return [
        createLeg(
          {
            type: "call",
            direction: "long",
            quantity: 1,
            strike: 100,
            premium: 8,
          },
          1
        ),
        createLeg(
          {
            type: "put",
            direction: "long",
            quantity: 1,
            strike: 100,
            premium: 7,
          },
          2
        ),
      ];

    case "short-straddle":
      return [
        createLeg(
          {
            type: "call",
            direction: "short",
            quantity: 1,
            strike: 100,
            premium: 8,
          },
          1
        ),
        createLeg(
          {
            type: "put",
            direction: "short",
            quantity: 1,
            strike: 100,
            premium: 7,
          },
          2
        ),
      ];

    case "long-strangle":
      return [
        createLeg(
          {
            type: "put",
            direction: "long",
            quantity: 1,
            strike: 90,
            premium: 3,
          },
          1
        ),
        createLeg(
          {
            type: "call",
            direction: "long",
            quantity: 1,
            strike: 110,
            premium: 4,
          },
          2
        ),
      ];

    case "short-strangle":
      return [
        createLeg(
          {
            type: "put",
            direction: "short",
            quantity: 1,
            strike: 90,
            premium: 3,
          },
          1
        ),
        createLeg(
          {
            type: "call",
            direction: "short",
            quantity: 1,
            strike: 110,
            premium: 4,
          },
          2
        ),
      ];

    case "risk-reversal":
      return [
        createLeg(
          {
            type: "put",
            direction: "short",
            quantity: 1,
            strike: 90,
            premium: 3,
          },
          1
        ),
        createLeg(
          {
            type: "call",
            direction: "long",
            quantity: 1,
            strike: 110,
            premium: 4,
          },
          2
        ),
      ];

    case "long-call-butterfly":
      return [
        createLeg(
          {
            type: "call",
            direction: "long",
            quantity: 1,
            strike: 90,
            premium: 14,
          },
          1
        ),
        createLeg(
          {
            type: "call",
            direction: "short",
            quantity: 2,
            strike: 100,
            premium: 8,
          },
          2
        ),
        createLeg(
          {
            type: "call",
            direction: "long",
            quantity: 1,
            strike: 110,
            premium: 3,
          },
          3
        ),
      ];

    case "box-spread":
      return [
        createLeg(
          {
            type: "call",
            direction: "long",
            quantity: 1,
            strike: 90,
            premium: 14,
          },
          1
        ),
        createLeg(
          {
            type: "call",
            direction: "short",
            quantity: 1,
            strike: 110,
            premium: 4,
          },
          2
        ),
        createLeg(
          {
            type: "put",
            direction: "long",
            quantity: 1,
            strike: 110,
            premium: 9,
          },
          3
        ),
        createLeg(
          {
            type: "put",
            direction: "short",
            quantity: 1,
            strike: 90,
            premium: 2,
          },
          4
        ),
      ];

    case "synthetic-long-forward":
      return [
        createLeg(
          {
            type: "call",
            direction: "long",
            quantity: 1,
            strike: 100,
            premium: 8,
          },
          1
        ),
        createLeg(
          {
            type: "put",
            direction: "short",
            quantity: 1,
            strike: 100,
            premium: 8,
          },
          2
        ),
      ];

    case "synthetic-short-forward":
      return [
        createLeg(
          {
            type: "call",
            direction: "short",
            quantity: 1,
            strike: 100,
            premium: 8,
          },
          1
        ),
        createLeg(
          {
            type: "put",
            direction: "long",
            quantity: 1,
            strike: 100,
            premium: 8,
          },
          2
        ),
      ];

    case "digital-call":
      return [
        createLeg(
          {
            type: "digital-call",
            direction: "long",
            quantity: 1,
            strike: 100,
            premium: 4,
            payout: 15,
          },
          1
        ),
      ];

    case "digital-put":
      return [
        createLeg(
          {
            type: "digital-put",
            direction: "long",
            quantity: 1,
            strike: 100,
            premium: 4,
            payout: 15,
          },
          1
        ),
      ];

    case "asset-call":
      return [
        createLeg(
          {
            type: "asset-call",
            direction: "long",
            quantity: 1,
            strike: 100,
            premium: 9,
          },
          1
        ),
      ];

    case "gap-call":
      return [
        createLeg(
          {
            type: "gap-call",
            direction: "long",
            quantity: 1,
            triggerStrike: 100,
            settlementStrike: 110,
            premium: 5,
          },
          1
        ),
      ];

    case "double-digital":
      return [
        createLeg(
          {
            type: "double-digital",
            direction: "long",
            quantity: 1,
            lowerStrike: 90,
            upperStrike: 110,
            premium: 3,
            payout: 12,
          },
          1
        ),
      ];

    case "supershare":
      return [
        createLeg(
          {
            type: "supershare",
            direction: "long",
            quantity: 1,
            lowerStrike: 90,
            upperStrike: 120,
            premium: 2,
          },
          1
        ),
      ];

    default:
      return [];
  }
}
