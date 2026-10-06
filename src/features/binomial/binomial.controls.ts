import type { SliderDescriptor } from "../../components/SliderDock";
import type { TranslationKey } from "../../i18n";
import type { BinomialControlHandlers, BinomialControlValues } from "./binomial.types";

type ControlDefinition = {
  key: string;
  field: Exclude<keyof BinomialControlValues, "mode">;
  handler: keyof BinomialControlHandlers;
  symbol: string;
  labelKey: TranslationKey;
  min: number;
  max: number;
  step: number;
  decimals?: number;
  sectionId: string;
};

const equityControls: readonly ControlDefinition[] = [
  { key: "s0", field: "S0", handler: "onS0Change", symbol: "S₀", labelKey: "binomialS0Label", min: 20, max: 200, step: 1, sectionId: "spot-strike" },
  { key: "k", field: "K", handler: "onKChange", symbol: "K", labelKey: "binomialKLabel", min: 20, max: 200, step: 1, sectionId: "spot-strike" },
  { key: "u", field: "u", handler: "onUChange", symbol: "u", labelKey: "binomialULabel", min: 1.01, max: 2, step: 0.01, decimals: 2, sectionId: "up-down-factors" },
  { key: "d", field: "d", handler: "onDChange", symbol: "d", labelKey: "binomialDLabel", min: 0.1, max: 0.99, step: 0.01, decimals: 2, sectionId: "up-down-factors" },
  { key: "r", field: "r", handler: "onRChange", symbol: "r", labelKey: "binomialRLabel", min: 0, max: 0.3, step: 0.01, decimals: 2, sectionId: "discounting" },
];
const rateControls: readonly ControlDefinition[] = [
  { key: "r0", field: "r", handler: "onRChange", symbol: "r₀", labelKey: "binomialR0Label", min: 0, max: 0.3, step: 0.01, decimals: 2, sectionId: "short-rate-tree" },
  { key: "q", field: "q", handler: "onQChange", symbol: "q", labelKey: "binomialQLabel", min: 0, max: 1, step: 0.01, decimals: 2, sectionId: "rate-probability" },
  { key: "h", field: "h", handler: "onHChange", symbol: "h", labelKey: "binomialHLabel", min: 0.02, max: 0.7, step: 0.01, decimals: 2, sectionId: "rate-step-size" },
];
const horizonControl: ControlDefinition = {
  key: "steps", field: "steps", handler: "onStepsChange", symbol: "N",
  labelKey: "binomialStepsLabel", min: 1, max: 8, step: 1, sectionId: "tree-horizon",
};

/// Keep desktop parameters and both mobile tree modes on the same definitions.
export function createBinomialSliders(
  values: BinomialControlValues,
  handlers: BinomialControlHandlers,
  t: (key: TranslationKey) => string,
): SliderDescriptor[] {
  const controls = values.mode === "rates" ? rateControls : equityControls;
  return [...controls, horizonControl].map(({ field, handler, labelKey, decimals, ...control }) => ({
    ...control,
    name: t(labelKey),
    value: values[field],
    onChange: handlers[handler],
    format: (value) => decimals === undefined ? String(value) : value.toFixed(decimals),
  }));
}
