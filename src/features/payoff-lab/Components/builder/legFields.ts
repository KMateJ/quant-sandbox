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

export const VANILLA_TYPES: { value: InstrumentType; label: TranslationKey }[] = [
  { value: "call", label: "payoffTypeCall" },
  { value: "put", label: "payoffTypePut" },
  { value: "stock", label: "payoffTypeStock" },
  { value: "forward", label: "payoffTypeForward" },
  { value: "cash", label: "payoffTypeCash" },
];

export const EXOTIC_TYPES: { value: InstrumentType; label: string }[] = [
  { value: "digital-call", label: "Digital Call" },
  { value: "digital-put", label: "Digital Put" },
  { value: "asset-call", label: "Asset-or-Nothing Call" },
  { value: "asset-put", label: "Asset-or-Nothing Put" },
  { value: "gap-call", label: "Gap Call" },
  { value: "gap-put", label: "Gap Put" },
  { value: "double-digital", label: "Double Digital" },
  { value: "supershare", label: "Supershare" },
];
