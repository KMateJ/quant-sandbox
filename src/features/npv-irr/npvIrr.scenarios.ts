import type { ProjectModel, Scenario } from "./npvIrr.types";
import { syncCustomFlows } from "./npvIrr.presets";

/// Fixed palette so a scenario keeps its colour across every chart and tab.
export const SCENARIO_COLORS = [
  "#38bdf8",
  "#22c55e",
  "#f97316",
  "#a78bfa",
  "#f59e0b",
  "#ec4899",
  "#2dd4bf",
];

/// Pick the next unused colour, falling back to the palette modulo its length.
export function nextColor(used: string[]): string {
  const free = SCENARIO_COLORS.find((c) => !used.includes(c));
  return free ?? SCENARIO_COLORS[used.length % SCENARIO_COLORS.length];
}

let counter = 0;
function id(): string {
  counter += 1;
  return `sc-${Date.now().toString(36)}-${counter}`;
}

/// Shift a base model by a multiplicative factor on cashflows and an additive rate bump.
function shift(base: ProjectModel, cfFactor: number, rateDelta: number, growthDelta: number): ProjectModel {
  const model: ProjectModel = {
    ...base,
    annual: Math.round(base.annual * cfFactor),
    rate: Math.max(0, base.rate + rateDelta),
    growth: base.growth + growthDelta,
    terminalValue: Math.round(base.terminalValue * cfFactor),
    customFlows: base.customFlows.map((v) => Math.round(v * cfFactor)),
  };
  return { ...model, customFlows: syncCustomFlows(model) };
}

/// Build the standard base / optimistic / pessimistic trio from a seed model.
export function defaultScenarios(base: ProjectModel): Scenario[] {
  return [
    { id: id(), name: "Base", color: SCENARIO_COLORS[0], model: { ...base } },
    {
      id: id(),
      name: "Optimistic",
      color: SCENARIO_COLORS[1],
      model: shift(base, 1.2, -0.02, 0.03),
    },
    {
      id: id(),
      name: "Pessimistic",
      color: SCENARIO_COLORS[2],
      model: shift(base, 0.8, 0.03, -0.03),
    },
  ];
}

/// Create a fresh scenario cloned from `model` with a unique id and colour.
export function makeScenario(name: string, model: ProjectModel, used: string[]): Scenario {
  return { id: id(), name, color: nextColor(used), model: { ...model } };
}
