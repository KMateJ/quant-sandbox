import { parseUrlState, urlEnum, urlNumber, writeUrlState, type UrlField } from "../../lib/urlState";
import { DEFAULT_MODEL, syncCustomFlows } from "./npvIrr.presets";
import type { ProjectModel } from "./npvIrr.types";

export const NPV_TABS = ["overview", "cashflow", "scenarios", "sensitivity", "montecarlo", "realoptions"] as const;
export type NpvTab = (typeof NPV_TABS)[number];

/// The tab lives in the URL on its own, through `useUrlState`.
export const NPV_TAB_SCHEMA = { tab: urlEnum(NPV_TABS, "overview") };

const MAX_YEARS = 25;

/// Comma-separated custom cash flows (`cf=300,400,-50`); anything malformed → no override.
const urlFlows: UrlField<number[] | null> = {
  parse: (raw) => {
    if (!raw) return null;
    const flows = raw.split(",").map(Number);
    return flows.length > 0 && flows.length <= MAX_YEARS && flows.every(Number.isFinite) ? flows.map((v) => Math.round(v)) : null;
  },
  serialize: (flows) => (flows && flows.length ? flows.map((v) => Math.round(v)).join(",") : null),
};

/// Query-string schema of the active project model (defaults are left out).
const MODEL_SCHEMA = {
  outlay: urlNumber(DEFAULT_MODEL.outlay, 0, 1_000_000, 0),
  annual: urlNumber(DEFAULT_MODEL.annual, -1_000_000, 1_000_000, 0),
  years: urlNumber(DEFAULT_MODEL.years, 1, MAX_YEARS, 0),
  rate: urlNumber(DEFAULT_MODEL.rate, 0, 0.4, 4),
  pattern: urlEnum(["constant", "growing", "custom"] as const, DEFAULT_MODEL.pattern),
  growth: urlNumber(DEFAULT_MODEL.growth, -0.5, 0.5, 4),
  inflation: urlNumber(DEFAULT_MODEL.inflation, 0, 0.2, 4),
  taxRate: urlNumber(DEFAULT_MODEL.taxRate, 0, 1, 4),
  terminalValue: urlNumber(DEFAULT_MODEL.terminalValue, 0, 10_000_000, 0),
  timing: urlEnum(["end", "begin"] as const, DEFAULT_MODEL.timing),
  cf: urlFlows,
};
type ModelUrl = { [K in keyof typeof MODEL_SCHEMA]: ReturnType<(typeof MODEL_SCHEMA)[K]["parse"]> };

/// The model a query string describes; custom flows only count with the custom pattern and are fitted to `years`.
export function modelFromParams(params: URLSearchParams): ProjectModel {
  const { cf, ...rest } = parseUrlState<ModelUrl>(MODEL_SCHEMA, params);
  const model: ProjectModel = { ...DEFAULT_MODEL, ...rest, customFlows: DEFAULT_MODEL.customFlows };
  if (model.pattern === "custom" && cf) model.customFlows = Array.from({ length: model.years }, (_, i) => cf[i] ?? cf[cf.length - 1]);
  return { ...model, customFlows: syncCustomFlows(model) };
}

/// Writes `model` into a copy of `params` (other keys, e.g. the tab, are kept).
export function paramsWithModel(model: ProjectModel, params: URLSearchParams): URLSearchParams {
  const { customFlows, ...rest } = model;
  return writeUrlState<ModelUrl>(MODEL_SCHEMA, { ...rest, cf: model.pattern === "custom" ? customFlows : null }, params);
}

/// Canonical text of the model's URL keys, for comparing a model with a query string.
export function modelKey(model: ProjectModel): string {
  return paramsWithModel(model, new URLSearchParams()).toString();
}
