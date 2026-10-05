import type { CurveNode, PresetId } from "./yieldCurve.types";

/// Standard fixed maturity grid (years) with display labels. The curve is always
/// defined on this grid — number of nodes is not a user-tunable parameter.
export const MATURITIES: { t: number; label: string }[] = [
  { t: 0.25, label: "3M" },
  { t: 0.5, label: "6M" },
  { t: 1, label: "1Y" },
  { t: 2, label: "2Y" },
  { t: 3, label: "3Y" },
  { t: 5, label: "5Y" },
  { t: 7, label: "7Y" },
  { t: 10, label: "10Y" },
  { t: 20, label: "20Y" },
  { t: 30, label: "30Y" },
];

export const MATURITY_LABELS = MATURITIES.map((m) => m.label);

/// Illustrative par-rate curves (percent) aligned to MATURITIES, one per preset shape.
const PRESET_RATES: Record<PresetId, number[]> = {
  normal: [2.9, 3.0, 3.1, 3.25, 3.45, 3.75, 4.0, 4.2, 4.3, 4.25],
  flat: [3.5, 3.52, 3.55, 3.58, 3.6, 3.62, 3.63, 3.64, 3.65, 3.65],
  inverted: [5.0, 4.85, 4.6, 4.3, 4.1, 3.85, 3.7, 3.6, 3.5, 3.45],
  humped: [2.8, 3.1, 3.45, 3.9, 4.2, 4.35, 4.25, 4.05, 3.8, 3.7],
};

/// Build curve nodes for a named preset, converting percent quotes into fractions.
export function presetNodes(id: PresetId): CurveNode[] {
  return MATURITIES.map((m, i) => ({ ...m, rate: PRESET_RATES[id][i] / 100 }));
}

export const PRESET_IDS: PresetId[] = ["normal", "flat", "inverted", "humped"];
