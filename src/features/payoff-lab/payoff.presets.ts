import type { PresetKey, StrategyLeg } from "./payoff.types";

function createLeg(partial: Omit<StrategyLeg, "id">, index: number): StrategyLeg {
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
          },
          1
        ),
        createLeg(
          {
            type: "call",
            direction: "short",
            quantity: 1,
            strike: 110,
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
          },
          1
        ),
        createLeg(
          {
            type: "put",
            direction: "long",
            quantity: 1,
            strike: 90,
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
          },
          1
        ),
        createLeg(
          {
            type: "put",
            direction: "short",
            quantity: 1,
            strike: 100,
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
          },
          1
        ),
        createLeg(
          {
            type: "put",
            direction: "long",
            quantity: 1,
            strike: 100,
          },
          2
        ),
      ];

    default:
      return [];
  }
}