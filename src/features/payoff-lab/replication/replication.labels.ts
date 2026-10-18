import type { TranslationKey } from "../../../i18n";
import type { ReplicationLeg, ReplicationMethod } from "./replication.types";
import type { ShapePresetKey } from "./replication.presets";

export const METHOD_LABEL_KEYS: Record<ReplicationMethod, TranslationKey> = {
  calls: "replMethodCalls",
  puts: "replMethodPuts",
  "carr-madan": "replMethodCarrMadan",
};

export const PRESET_LABEL_KEYS: Record<ShapePresetKey, TranslationKey> = {
  tent: "replPresetTent",
  digital: "replPresetDigital",
  butterfly: "replPresetButterfly",
  range: "replPresetRange",
  capped: "replPresetCapped",
};

const KIND_LABEL_KEYS: Record<ReplicationLeg["kind"], TranslationKey> = {
  bond: "replKindBond",
  stock: "replKindStock",
  forward: "replKindForward",
  call: "replKindCall",
  put: "replKindPut",
};

type Translate = (key: TranslationKey, options?: Record<string, string | number>) => string;

/// Human-readable instrument name, e.g. "Call K = 105".
export function legLabel(leg: ReplicationLeg, t: Translate): string {
  return t(KIND_LABEL_KEYS[leg.kind], { k: Number((leg.strike ?? 0).toFixed(2)) });
}
