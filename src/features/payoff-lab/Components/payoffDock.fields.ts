import type { TranslationKey } from "../../../i18n";
import type { Direction, InstrumentType, StrategyLeg } from "../payoff.types";
import { ensureDefaults } from "../payoff.legs";
import { INSTRUMENT_LABEL_KEYS } from "./builder/legFields";

type Translate = (key: TranslationKey, options?: Record<string, string | number>) => string;

/// One chip of the phone dock: a slider or a set of option buttons.
export type DockField =
  | {
      key: string;
      label: string;
      kind: "slider";
      value: number;
      min: number;
      max: number;
      step: number;
      format: (value: number) => string;
      patch: (value: number) => Partial<StrategyLeg>;
    }
  | {
      key: string;
      label: string;
      kind: "options";
      value: string;
      options: { value: string; label: string }[];
      patch: (value: string) => Partial<StrategyLeg>;
    };

const priceField = (
  key: keyof StrategyLeg & string,
  label: string,
  value: number | undefined,
  fallback: number
): DockField => ({
  key,
  label,
  kind: "slider",
  value: value ?? fallback,
  min: 20,
  max: 200,
  step: 1,
  format: (v) => v.toFixed(0),
  patch: (v) => ({ [key]: v }),
});

/// Chips and the active control for one leg, in display order.
export function buildDockFields(leg: StrategyLeg, t: Translate): DockField[] {
  const premium: DockField = {
    key: "premium",
    label: t("payoffFieldPremium"),
    kind: "slider",
    value: leg.premium ?? 0,
    min: 0,
    max: 50,
    step: 0.5,
    format: (v) => v.toFixed(1),
    patch: (v) => ({ premium: v }),
  };
  const payout: DockField = {
    key: "payout",
    label: t("payoffTypeCash") + " ⇒",
    kind: "slider",
    value: leg.payout ?? 10,
    min: 0,
    max: 100,
    step: 1,
    format: (v) => v.toFixed(0),
    patch: (v) => ({ payout: v }),
  };
  const strike = priceField("strike", t("payoffFieldStrike"), leg.strike, 100);
  const lower = priceField("lowerStrike", "↓", leg.lowerStrike, 90);
  const upper = priceField("upperStrike", "↑", leg.upperStrike, 110);

  const common: DockField[] = [
    {
      key: "type",
      label: t("payoffFieldInstrument"),
      kind: "options",
      value: leg.type,
      options: (Object.keys(INSTRUMENT_LABEL_KEYS) as InstrumentType[]).map((value) => ({
        value,
        label: t(INSTRUMENT_LABEL_KEYS[value]),
      })),
      patch: (v) => ensureDefaults(v as InstrumentType, leg),
    },
    {
      key: "direction",
      label: t("payoffFieldDirection"),
      kind: "options",
      value: leg.direction,
      options: [
        { value: "long", label: t("payoffDirectionLong") },
        { value: "short", label: t("payoffDirectionShort") },
      ],
      patch: (v) => ({ direction: v as Direction }),
    },
    {
      key: "quantity",
      label: t("payoffFieldQuantity"),
      kind: "slider",
      value: leg.quantity,
      min: 1,
      max: 25,
      step: 1,
      format: (v) => `×${v.toFixed(0)}`,
      patch: (v) => ({ quantity: v }),
    },
  ];

  switch (leg.type) {
    case "call":
    case "put":
    case "asset-call":
    case "asset-put":
      return [...common, strike, premium];
    case "digital-call":
    case "digital-put":
      return [...common, strike, premium, payout];
    case "gap-call":
    case "gap-put":
      return [
        ...common,
        priceField("triggerStrike", t("payoffFieldStrike"), leg.triggerStrike, 100),
        priceField("settlementStrike", t("payoffFieldStrikeMarker"), leg.settlementStrike, 110),
        premium,
      ];
    case "double-digital":
      return [...common, lower, upper, premium, payout];
    case "supershare":
      return [...common, lower, upper, premium];
    case "forward":
      return [
        ...common,
        priceField("forwardPrice", t("payoffFieldForwardPrice"), leg.forwardPrice, 100),
        priceField("strike", t("payoffFieldStrikeMarker"), leg.strike ?? leg.forwardPrice, 100),
      ];
    case "stock":
      return [...common, priceField("entryPrice", t("payoffFieldEntryPrice"), leg.entryPrice, 100)];
    case "cash":
      return [
        ...common,
        priceField("cashAmount", t("payoffFieldCashAmount"), leg.cashAmount, 100),
        {
          key: "rate",
          label: t("payoffFieldRate"),
          kind: "slider",
          value: leg.rate ?? 0.05,
          min: 0,
          max: 0.2,
          step: 0.005,
          format: (v) => v.toFixed(3),
          patch: (v) => ({ rate: v }),
        },
      ];
  }
}
