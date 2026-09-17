import { useState } from "react";
import { useI18n } from "../../../i18n";
import { useChartInViewport } from "../../../components/chartConfig";
import type {
  Direction,
  InstrumentType,
  StrategyLeg,
} from "../payoff.types";

type PayoffDockProps = {
  legs: StrategyLeg[];
  onChange: (legs: StrategyLeg[]) => void;
  onClearPreset: () => void;
};

function createEmptyLeg(index: number): StrategyLeg {
  return {
    id: `leg-${Date.now()}-${index}`,
    type: "call",
    direction: "long",
    quantity: 1,
    strike: 100,
    premium: 0,
    entryPrice: 100,
    forwardPrice: 100,
    cashAmount: 100,
    rate: 0.05,
    payout: 10,
    lowerStrike: 90,
    upperStrike: 110,
    triggerStrike: 100,
    settlementStrike: 110,
  };
}

function ensureDefaults(
  type: InstrumentType,
  leg: StrategyLeg
): Partial<StrategyLeg> {
  switch (type) {
    case "call":
    case "put":
    case "asset-call":
    case "asset-put":
      return { type, strike: leg.strike ?? 100, premium: leg.premium ?? 0 };
    case "digital-call":
    case "digital-put":
      return {
        type,
        strike: leg.strike ?? 100,
        premium: leg.premium ?? 0,
        payout: leg.payout ?? 10,
      };
    case "gap-call":
    case "gap-put":
      return {
        type,
        triggerStrike: leg.triggerStrike ?? leg.strike ?? 100,
        settlementStrike: leg.settlementStrike ?? 110,
        premium: leg.premium ?? 0,
      };
    case "double-digital":
      return {
        type,
        lowerStrike: leg.lowerStrike ?? 90,
        upperStrike: leg.upperStrike ?? 110,
        premium: leg.premium ?? 0,
        payout: leg.payout ?? 10,
      };
    case "supershare":
      return {
        type,
        lowerStrike: leg.lowerStrike ?? 90,
        upperStrike: leg.upperStrike ?? 110,
        premium: leg.premium ?? 0,
      };
    case "forward":
      return {
        type,
        strike: leg.strike ?? 100,
        forwardPrice: leg.forwardPrice ?? leg.strike ?? 100,
      };
    case "stock":
      return { type, entryPrice: leg.entryPrice ?? 100 };
    case "cash":
      return { type, cashAmount: leg.cashAmount ?? 100, rate: leg.rate ?? 0.05 };
    default:
      return { type };
  }
}

type DockField =
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

export default function PayoffDock({
  legs,
  onChange,
  onClearPreset,
}: PayoffDockProps) {
  const { t } = useI18n();
  const [activeLegId, setActiveLegId] = useState<string | null>(
    legs[0]?.id ?? null
  );
  const [activeFieldKey, setActiveFieldKey] = useState<string>("type");
  const chartInView = useChartInViewport();

  const activeLeg =
    legs.find((leg) => leg.id === activeLegId) ?? legs[0] ?? null;

  function commitLeg(patch: Partial<StrategyLeg>) {
    if (!activeLeg) return;
    onClearPreset();
    onChange(
      legs.map((leg) =>
        leg.id === activeLeg.id ? { ...leg, ...patch } : leg
      )
    );
  }

  function addLeg() {
    onClearPreset();
    const next = createEmptyLeg(legs.length + 1);
    onChange([...legs, next]);
    setActiveLegId(next.id);
    setActiveFieldKey("type");
  }

  function removeActiveLeg() {
    if (!activeLeg || legs.length <= 1) return;
    onClearPreset();
    const remaining = legs.filter((leg) => leg.id !== activeLeg.id);
    onChange(remaining);
    setActiveLegId(remaining[0]?.id ?? null);
  }

  if (!activeLeg) {
    return (
      <div className="slider-dock payoff-dock" role="group">
        <div className="slider-dock-handle" aria-hidden="true" />
        <div className="payoff-dock-legs">
          <button
            type="button"
            className="dock-chip dock-chip--add"
            onClick={addLeg}
          >
            +
          </button>
        </div>
      </div>
    );
  }

  const instrumentOptions: { value: InstrumentType; label: string }[] = [
    { value: "call", label: t("payoffTypeCall") },
    { value: "put", label: t("payoffTypePut") },
    { value: "stock", label: t("payoffTypeStock") },
    { value: "forward", label: t("payoffTypeForward") },
    { value: "cash", label: t("payoffTypeCash") },
    { value: "digital-call", label: "Digital Call" },
    { value: "digital-put", label: "Digital Put" },
    { value: "asset-call", label: "Asset Call" },
    { value: "asset-put", label: "Asset Put" },
    { value: "gap-call", label: "Gap Call" },
    { value: "gap-put", label: "Gap Put" },
    { value: "double-digital", label: "Double Digital" },
    { value: "supershare", label: "Supershare" },
  ];

  const strikeField = (
    key: string,
    label: string,
    value: number | undefined,
    fallback: number,
    apply: (v: number) => Partial<StrategyLeg>
  ): DockField => ({
    key,
    label,
    kind: "slider",
    value: value ?? fallback,
    min: 20,
    max: 200,
    step: 1,
    format: (v) => v.toFixed(0),
    patch: apply,
  });

  const premiumField = (value: number | undefined): DockField => ({
    key: "premium",
    label: t("payoffFieldPremium"),
    kind: "slider",
    value: value ?? 0,
    min: 0,
    max: 50,
    step: 0.5,
    format: (v) => v.toFixed(1),
    patch: (v) => ({ premium: v }),
  });

  const payoutField = (value: number | undefined): DockField => ({
    key: "payout",
    label: t("payoffTypeCash") + " ⇒",
    kind: "slider",
    value: value ?? 10,
    min: 0,
    max: 100,
    step: 1,
    format: (v) => v.toFixed(0),
    patch: (v) => ({ payout: v }),
  });

  const fields: DockField[] = [
    {
      key: "type",
      label: t("payoffFieldInstrument"),
      kind: "options",
      value: activeLeg.type,
      options: instrumentOptions,
      patch: (v) => ensureDefaults(v as InstrumentType, activeLeg),
    },
    {
      key: "direction",
      label: t("payoffFieldDirection"),
      kind: "options",
      value: activeLeg.direction,
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
      value: activeLeg.quantity,
      min: 1,
      max: 25,
      step: 1,
      format: (v) => `×${v.toFixed(0)}`,
      patch: (v) => ({ quantity: v }),
    },
  ];

  const type = activeLeg.type;
  if (type === "call" || type === "put" || type === "asset-call" || type === "asset-put") {
    fields.push(
      strikeField("strike", t("payoffFieldStrike"), activeLeg.strike, 100, (v) => ({ strike: v })),
      premiumField(activeLeg.premium)
    );
  } else if (type === "digital-call" || type === "digital-put") {
    fields.push(
      strikeField("strike", t("payoffFieldStrike"), activeLeg.strike, 100, (v) => ({ strike: v })),
      premiumField(activeLeg.premium),
      payoutField(activeLeg.payout)
    );
  } else if (type === "gap-call" || type === "gap-put") {
    fields.push(
      strikeField("triggerStrike", t("payoffFieldStrike"), activeLeg.triggerStrike, 100, (v) => ({ triggerStrike: v })),
      strikeField("settlementStrike", t("payoffFieldStrikeMarker"), activeLeg.settlementStrike, 110, (v) => ({ settlementStrike: v })),
      premiumField(activeLeg.premium)
    );
  } else if (type === "double-digital") {
    fields.push(
      strikeField("lowerStrike", "↓", activeLeg.lowerStrike, 90, (v) => ({ lowerStrike: v })),
      strikeField("upperStrike", "↑", activeLeg.upperStrike, 110, (v) => ({ upperStrike: v })),
      premiumField(activeLeg.premium),
      payoutField(activeLeg.payout)
    );
  } else if (type === "supershare") {
    fields.push(
      strikeField("lowerStrike", "↓", activeLeg.lowerStrike, 90, (v) => ({ lowerStrike: v })),
      strikeField("upperStrike", "↑", activeLeg.upperStrike, 110, (v) => ({ upperStrike: v })),
      premiumField(activeLeg.premium)
    );
  } else if (type === "forward") {
    fields.push(
      strikeField("forwardPrice", t("payoffFieldForwardPrice"), activeLeg.forwardPrice, 100, (v) => ({ forwardPrice: v })),
      strikeField("strike", t("payoffFieldStrikeMarker"), activeLeg.strike ?? activeLeg.forwardPrice, 100, (v) => ({ strike: v }))
    );
  } else if (type === "stock") {
    fields.push(
      strikeField("entryPrice", t("payoffFieldEntryPrice"), activeLeg.entryPrice, 100, (v) => ({ entryPrice: v }))
    );
  } else if (type === "cash") {
    fields.push(
      strikeField("cashAmount", t("payoffFieldCashAmount"), activeLeg.cashAmount, 100, (v) => ({ cashAmount: v })),
      {
        key: "rate",
        label: t("payoffFieldRate"),
        kind: "slider",
        value: activeLeg.rate ?? 0.05,
        min: 0,
        max: 0.2,
        step: 0.005,
        format: (v) => v.toFixed(3),
        patch: (v) => ({ rate: v }),
      }
    );
  }

  const activeField =
    fields.find((field) => field.key === activeFieldKey) ?? fields[0];

  return (
    <div
      className={`slider-dock payoff-dock ${chartInView ? "" : "slider-dock--hidden"}`}
      role="group"
      aria-label={t("payoffLegTitle")}
    >
      <div className="slider-dock-handle" aria-hidden="true" />

      <div className="payoff-dock-legs">
        {legs.map((leg, index) => (
          <button
            key={leg.id}
            type="button"
            className={
              leg.id === activeLeg.id ? "dock-leg-chip active" : "dock-leg-chip"
            }
            onClick={() => setActiveLegId(leg.id)}
          >
            {t("payoffLegTitle")} {index + 1}
          </button>
        ))}
        <button
          type="button"
          className="dock-chip dock-chip--add"
          onClick={addLeg}
          aria-label={t("payoffAddLeg")}
        >
          +
        </button>
        {legs.length > 1 && (
          <button
            type="button"
            className="dock-chip dock-chip--del"
            onClick={removeActiveLeg}
            aria-label={t("payoffDelete")}
          >
            ✕
          </button>
        )}
      </div>

      <div className="slider-dock-chips">
        {fields.map((field) => (
          <button
            key={field.key}
            type="button"
            className={
              field.key === activeField.key ? "dock-chip active" : "dock-chip"
            }
            onClick={() => setActiveFieldKey(field.key)}
          >
            <span className="dock-chip-symbol">{field.label}</span>
            <span className="dock-chip-value">
              {field.kind === "slider"
                ? field.format(field.value)
                : field.options.find((o) => o.value === field.value)?.label ??
                  field.value}
            </span>
          </button>
        ))}
      </div>

      <div className="slider-dock-control">
        <span className="dock-current-name">{activeField.label}</span>
        {activeField.kind === "slider" ? (
          <div className="slider-dock-row">
            <input
              className="slider-input"
              type="range"
              min={activeField.min}
              max={activeField.max}
              step={activeField.step}
              value={activeField.value}
              onChange={(event) =>
                commitLeg(activeField.patch(Number(event.target.value)))
              }
            />
            <span className="dock-current-value">
              {activeField.format(activeField.value)}
            </span>
          </div>
        ) : (
          <div className="payoff-dock-options">
            {activeField.options.map((option) => (
              <button
                key={option.value}
                type="button"
                className={
                  option.value === activeField.value
                    ? "payoff-dock-option active"
                    : "payoff-dock-option"
                }
                onClick={() => commitLeg(activeField.patch(option.value))}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
