import type {
  HeatmapAxis,
  HeatmapCell,
  ProjectModel,
  SensitivityVar,
  TornadoRow,
} from "./npvIrr.types";
import { modelNpv, projectMetrics } from "./npvIrr.math";

/// Apply a single scalar override to a model, keeping every other assumption fixed.
export function withVar(model: ProjectModel, variable: SensitivityVar | HeatmapAxis, value: number): ProjectModel {
  switch (variable) {
    case "annual":
      return { ...model, annual: value };
    case "rate":
      return { ...model, rate: value };
    case "outlay":
      return { ...model, outlay: value };
    case "years":
      return { ...model, years: Math.max(1, Math.round(value)) };
    case "growth":
      return { ...model, growth: value, pattern: model.pattern === "custom" ? "growing" : model.pattern };
    default:
      return model;
  }
}

/// Current scalar value of a variable on the model.
export function readVar(model: ProjectModel, variable: SensitivityVar | HeatmapAxis): number {
  switch (variable) {
    case "annual":
      return model.annual;
    case "rate":
      return model.rate;
    case "outlay":
      return model.outlay;
    case "years":
      return model.years;
    case "growth":
      return model.growth;
    default:
      return 0;
  }
}

const TORNADO_VARS: SensitivityVar[] = ["annual", "rate", "outlay", "years", "growth"];

/// Tornado rows: NPV when each variable swings by ±`range` (fraction), sorted by impact.
export function tornado(model: ProjectModel, range: number): TornadoRow[] {
  const rows = TORNADO_VARS.map((variable) => {
    const base = readVar(model, variable);
    const span = variable === "rate" || variable === "growth" ? Math.max(Math.abs(base), 0.02) : Math.abs(base);
    const lowValue = base - span * range;
    const highValue = base + span * range;
    const low = modelNpv(withVar(model, variable, lowValue), variable === "rate" ? lowValue : model.rate);
    const high = modelNpv(withVar(model, variable, highValue), variable === "rate" ? highValue : model.rate);
    return {
      variable,
      low,
      high,
      lowValue,
      highValue,
      baseValue: base,
      swing: Math.abs(high - low),
    };
  });
  rows.sort((a, b) => b.swing - a.swing);
  return rows;
}

/// Evenly spaced axis values around the base case for a heatmap dimension.
export function axisValues(model: ProjectModel, axis: HeatmapAxis, steps: number, spread: number): number[] {
  const base = readVar(model, axis);
  if (axis === "years") {
    const lo = Math.max(1, Math.round(base * (1 - spread)));
    const hi = Math.max(lo + 1, Math.round(base * (1 + spread)));
    const out: number[] = [];
    for (let i = 0; i <= steps; i++) out.push(Math.round(lo + (i / steps) * (hi - lo)));
    return Array.from(new Set(out));
  }
  const span = axis === "rate" || axis === "growth" ? Math.max(Math.abs(base), 0.04) * spread : Math.abs(base) * spread;
  const lo = base - span;
  const hi = base + span;
  const out: number[] = [];
  for (let i = 0; i <= steps; i++) out.push(lo + (i / steps) * (hi - lo));
  return out;
}

/// 2-D grid of NPV values as x (columns) and y (rows) axes vary around the base case.
export function heatmap(
  model: ProjectModel,
  xAxis: HeatmapAxis,
  yAxis: HeatmapAxis,
  xValues: number[],
  yValues: number[]
): HeatmapCell[][] {
  return yValues.map((yValue) =>
    xValues.map((xValue) => {
      let m = withVar(model, xAxis, xValue);
      m = withVar(m, yAxis, yValue);
      const rate = xAxis === "rate" ? xValue : yAxis === "rate" ? yValue : m.rate;
      return { xValue, yValue, npv: modelNpv(m, rate) };
    })
  );
}

/// Convenience: full metrics for a model with a variable overridden (used on cell click).
export function metricsWithVar(model: ProjectModel, variable: HeatmapAxis, value: number) {
  return projectMetrics(withVar(model, variable, value));
}
