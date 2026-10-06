import type { SliderDescriptor } from "../../components/SliderDock";
import type { TranslationKey } from "../../i18n";
import type { HestonControlsSetters, HestonControlsState } from "./heston.types";

type ControlDefinition = {
  key: string;
  field: keyof HestonControlsState;
  setter: keyof HestonControlsSetters;
  symbol: string;
  labelKey: TranslationKey;
  min: number;
  max: number;
  step: number;
  decimals: number;
  sectionId: string;
};

const controls: readonly ControlDefinition[] = [
  { key: "S0", field: "S0", setter: "setS0", symbol: "S₀", labelKey: "hestonSpot", min: 20, max: 200, step: 1, decimals: 0, sectionId: "spot-strike" },
  { key: "K", field: "strike", setter: "setStrike", symbol: "K", labelKey: "hestonStrike", min: 20, max: 200, step: 1, decimals: 0, sectionId: "spot-strike" },
  { key: "r", field: "rate", setter: "setRate", symbol: "r", labelKey: "hestonRate", min: 0, max: 0.2, step: 0.005, decimals: 3, sectionId: "rho" },
  { key: "v0", field: "v0", setter: "setV0", symbol: "v₀", labelKey: "hestonInitialVariance", min: 0.0001, max: 0.25, step: 0.0025, decimals: 4, sectionId: "stochastic-volatility" },
  { key: "theta", field: "theta", setter: "setTheta", symbol: "θ", labelKey: "hestonLongRunVariance", min: 0.0001, max: 0.25, step: 0.0025, decimals: 4, sectionId: "mean-reversion" },
  { key: "kappa", field: "kappa", setter: "setKappa", symbol: "κ", labelKey: "hestonReversionSpeed", min: 0.1, max: 10, step: 0.1, decimals: 2, sectionId: "mean-reversion" },
  { key: "xi", field: "xi", setter: "setXi", symbol: "ξ", labelKey: "hestonVolOfVol", min: 0.01, max: 2, step: 0.01, decimals: 2, sectionId: "vol-of-vol" },
  { key: "rho", field: "rho", setter: "setRho", symbol: "ρ", labelKey: "hestonShockCorrelation", min: -0.99, max: 0.99, step: 0.01, decimals: 2, sectionId: "correlation" },
  { key: "T", field: "maturity", setter: "setMaturity", symbol: "T", labelKey: "hestonMaturity", min: 0.25, max: 10, step: 0.25, decimals: 2, sectionId: "maturity" },
  { key: "steps", field: "steps", setter: "setSteps", symbol: "steps", labelKey: "hestonPathSteps", min: 25, max: 500, step: 25, decimals: 0, sectionId: "time-steps" },
  { key: "paths", field: "pathCount", setter: "setPathCount", symbol: "paths", labelKey: "hestonVisualPaths", min: 1, max: 30, step: 1, decimals: 0, sectionId: "visual-paths" },
  { key: "pSteps", field: "pricingSteps", setter: "setPricingSteps", symbol: "pSteps", labelKey: "hestonPricingSteps", min: 25, max: 400, step: 25, decimals: 0, sectionId: "time-steps" },
  { key: "pPaths", field: "pricingPaths", setter: "setPricingPaths", symbol: "pPaths", labelKey: "hestonPricingPaths", min: 100, max: 2000, step: 100, decimals: 0, sectionId: "pricing-paths" },
];

/// One parameter definition drives both desktop fields and the mobile dock.
export function createHestonSliders(
  values: HestonControlsState,
  setters: HestonControlsSetters,
  t: (key: TranslationKey) => string,
): SliderDescriptor[] {
  return controls.map(({ field, setter, labelKey, decimals, ...control }) => ({
    ...control,
    name: t(labelKey),
    value: values[field],
    onChange: setters[setter],
    format: (value) => control.key === "T"
      ? `${value.toFixed(decimals)} ${t("hestonYears")}`
      : value.toFixed(decimals),
  }));
}
