import type { ProjectModel, ProjectPreset } from "./npvIrr.types";

/// Baseline assumptions — matches the original module (outlay 1000, 250/yr, 6yr, 8%).
export const DEFAULT_MODEL: ProjectModel = {
  outlay: 1000,
  annual: 250,
  years: 6,
  rate: 0.08,
  pattern: "constant",
  growth: 0.04,
  inflation: 0,
  taxRate: 0,
  terminalValue: 0,
  timing: "end",
  customFlows: [250, 250, 250, 250, 250, 250],
};

/// Fill `customFlows` so the custom pattern starts from the current nominal flows.
export function syncCustomFlows(model: ProjectModel): number[] {
  const flows: number[] = [];
  for (let year = 1; year <= model.years; year++) {
    const existing = model.customFlows[year - 1];
    if (existing != null) flows.push(existing);
    else if (model.pattern === "growing") {
      flows.push(Math.round(model.annual * Math.pow(1 + model.growth, year - 1)));
    } else flows.push(model.annual);
  }
  return flows;
}

function make(partial: Partial<ProjectModel>): ProjectModel {
  const model = { ...DEFAULT_MODEL, ...partial };
  return { ...model, customFlows: syncCustomFlows(model) };
}

/// Example projects exposed through the header selector.
export const PRESETS: ProjectPreset[] = [
  { id: "baseline", labelKey: "npvPresetBaseline", model: make({}) },
  {
    id: "growth",
    labelKey: "npvPresetGrowth",
    model: make({
      outlay: 2000,
      annual: 300,
      years: 8,
      rate: 0.12,
      pattern: "growing",
      growth: 0.15,
      terminalValue: 600,
    }),
  },
  {
    id: "infrastructure",
    labelKey: "npvPresetInfra",
    model: make({
      outlay: 5000,
      annual: 650,
      years: 15,
      rate: 0.06,
      pattern: "growing",
      growth: 0.02,
      terminalValue: 1500,
    }),
  },
  {
    id: "declining",
    labelKey: "npvPresetDeclining",
    model: make({
      outlay: 1200,
      annual: 500,
      years: 6,
      rate: 0.1,
      pattern: "growing",
      growth: -0.12,
    }),
  },
  {
    id: "marginal",
    labelKey: "npvPresetMarginal",
    model: make({ outlay: 1000, annual: 205, years: 6, rate: 0.08 }),
  },
];
