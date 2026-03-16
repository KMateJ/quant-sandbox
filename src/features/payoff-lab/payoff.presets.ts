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

    default:
      return [];
  }
}