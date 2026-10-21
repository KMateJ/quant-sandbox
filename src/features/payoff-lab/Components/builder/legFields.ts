import type { TranslationKey } from "../../../../i18n";
import type { InstrumentType, StrategyLeg } from "../../payoff.types";

type NumericKey = {
  [K in keyof StrategyLeg]-?: NonNullable<StrategyLeg[K]> extends number ? K : never;
}[keyof StrategyLeg];

/// One editable numeric field of a leg.
export type LegFieldSpec = {
  key: Exclude<NumericKey, "quantity">;
  label: TranslationKey;
  fallback: (leg: StrategyLeg) => number;
  /// Span both columns of the leg grid.
  full?: boolean;
  decimal?: boolean;
};

const at = (value: number) => () => value;

const strike: LegFieldSpec = { key: "strike", label: "payoffFieldStrike", fallback: at(100) };
const premium: LegFieldSpec = { key: "premium", label: "payoffFieldPremium", fallback: at(0), decimal: true };
const payout: LegFieldSpec = { key: "payout", label: "payoffFieldPayout", fallback: at(10), decimal: true };
const lower: LegFieldSpec = { key: "lowerStrike", label: "payoffFieldLowerStrike", fallback: at(90) };
const upper: LegFieldSpec = { key: "upperStrike", label: "payoffFieldUpperStrike", fallback: at(110) };
const full = (spec: LegFieldSpec): LegFieldSpec => ({ ...spec, full: true });

/// Type-specific fields shown under instrument / direction / quantity.
export const LEG_FIELDS: Record<InstrumentType, LegFieldSpec[]> = {
  call: [strike, premium],
  put: [strike, premium],
  "asset-call": [strike, premium],
  "asset-put": [strike, premium],
  "digital-call": [strike, premium, full(payout)],
  "digital-put": [strike, premium, full(payout)],
  "gap-call": [
    { key: "triggerStrike", label: "payoffFieldTriggerStrike", fallback: at(100) },
    { key: "settlementStrike", label: "payoffFieldSettlementStrike", fallback: at(110) },
    full(premium),
  ],
  "gap-put": [
    { key: "triggerStrike", label: "payoffFieldTriggerStrike", fallback: at(100) },
    { key: "settlementStrike", label: "payoffFieldSettlementStrike", fallback: at(110) },
    full(premium),
  ],
  "double-digital": [lower, upper, premium, payout],
  supershare: [lower, upper, full(premium)],
  forward: [
    { key: "forwardPrice", label: "payoffFieldForwardPrice", fallback: at(100) },
    { key: "strike", label: "payoffFieldStrikeMarker", fallback: (leg) => leg.forwardPrice ?? 100 },
  ],
  stock: [{ key: "entryPrice", label: "payoffFieldEntryPrice", fallback: at(100) }],
  cash: [
    { key: "cashAmount", label: "payoffFieldCashAmount", fallback: at(100), decimal: true },
    { key: "rate", label: "payoffFieldRate", fallback: at(0.05), decimal: true },
  ],
};

/// Label key per instrument; the single source for every instrument picker.
export const INSTRUMENT_LABEL_KEYS: Record<InstrumentType, TranslationKey> = {
  call: "payoffTypeCall",
  put: "payoffTypePut",
  stock: "payoffTypeStock",
  forward: "payoffTypeForward",
  cash: "payoffTypeCash",
  "digital-call": "payoffTypeDigitalCall",
  "digital-put": "payoffTypeDigitalPut",
  "asset-call": "payoffTypeAssetCall",
  "asset-put": "payoffTypeAssetPut",
  "gap-call": "payoffTypeGapCall",
  "gap-put": "payoffTypeGapPut",
  "double-digital": "payoffTypeDoubleDigital",
  supershare: "payoffTypeSupershare",
};

const option = (value: InstrumentType) => ({ value, label: INSTRUMENT_LABEL_KEYS[value] });

export const VANILLA_TYPES = (["call", "put", "stock", "forward", "cash"] as const).map(option);

export const EXOTIC_TYPES = (
  ["digital-call", "digital-put", "asset-call", "asset-put", "gap-call", "gap-put", "double-digital", "supershare"] as const
).map(option);
