import { urlEnum, type UrlField } from "../../lib/urlState";
import { MATURITIES, PRESET_IDS, presetNodes } from "./presets";
import type { CurveNode, PresetId } from "./yieldCurve.types";

export const YC_TABS = ["curve", "bootstrap", "forwards", "factors"] as const;
export type YcTab = (typeof YC_TABS)[number];

/// Quote window of the lab, in percent.
const MAX_PERCENT = 12;

/// Par quotes in percent, one per maturity (`n=2.9,3,3.1,…`); anything malformed or out of range → none.
const urlRates: UrlField<number[] | null> = {
  parse: (raw) => {
    if (!raw) return null;
    const rates = raw.split(",").map((v) => (v.trim() === "" ? NaN : Number(v)));
    return rates.length === MATURITIES.length && rates.every((v) => Number.isFinite(v) && v >= 0 && v <= MAX_PERCENT) ? rates : null;
  },
  serialize: (rates) => (rates ? rates.map((v) => Number(v.toFixed(3))).join(",") : null),
};

/// The open tab, the preset and (only for a hand-edited curve) its quotes live in the URL, so a curve can be linked from a guide.
export const YC_SCHEMA = {
  tab: urlEnum(YC_TABS, "curve"),
  preset: urlEnum<PresetId | "custom">([...PRESET_IDS, "custom"], "normal"),
  n: urlRates,
};

/// Par nodes for a URL: the custom quotes when `preset` is "custom" and they are valid, else the named preset.
export function nodesFromUrl(preset: PresetId | "custom", rates: number[] | null): { nodes: CurveNode[]; preset: PresetId | "custom" } {
  if (preset === "custom" && rates) return { nodes: MATURITIES.map((m, i) => ({ ...m, rate: rates[i] / 100 })), preset };
  const id = preset === "custom" ? "normal" : preset;
  return { nodes: presetNodes(id), preset: id };
}

/// The URL fields describing `nodes`: custom quotes are written only for a "custom" curve.
export function urlFromNodes(preset: PresetId | "custom", nodes: CurveNode[]): { preset: PresetId | "custom"; n: number[] | null } {
  return { preset, n: preset === "custom" ? nodes.map((node) => node.rate * 100) : null };
}
