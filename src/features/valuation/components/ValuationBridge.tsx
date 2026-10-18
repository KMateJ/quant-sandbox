import { useState } from "react";
import { WaterfallChart, type WaterfallStep } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { BridgePart } from "../valuation.math";

type Props = { parts: BridgePart[]; years: number };

const money = (v: number) => v.toFixed(0);

/// DCF bridge: PV of each forecast year (or block of years) plus the PV of the terminal value = EV.
/// Selecting a bar writes out its calculation.
export default function ValuationBridge({ parts, years }: Props) {
  const { t } = useI18n();
  const [selected, setSelected] = useState<string>("tv");
  const label = (p: BridgePart) =>
    p.kind === "years"
      ? p.from === p.to ? t("valuationBridgeYear", { n: p.from }) : t("valuationBridgeYears", { from: p.from, to: p.to })
      : p.kind === "terminal" ? t("valuationBridgeTv") : t("valuationBridgeEv");
  const steps: WaterfallStep[] = parts.map((p) => ({ key: p.key, label: label(p), value: p.pv, kind: p.kind === "total" ? "total" : "delta" }));
  const part = parts.find((p) => p.key === selected) ?? parts[parts.length - 1];
  const forecastPv = parts.reduce((s, p) => s + (p.kind === "years" ? p.pv : 0), 0);

  const calc = () => {
    if (part.kind === "years") {
      return part.from === part.to
        ? t("valuationCalcYear", { n: part.from, fcf: money(part.fcf), df: (part.pv / part.fcf).toFixed(3), pv: money(part.pv) })
        : t("valuationCalcYears", { from: part.from, to: part.to, fcf: money(part.fcf), pv: money(part.pv) });
    }
    if (part.kind === "terminal") {
      return t("valuationCalcTv", { n: years, tv: money(part.tv), df: part.discount.toFixed(3), pv: money(part.pv) });
    }
    return t("valuationCalcEv", { fcf: money(forecastPv), tv: money(part.pv - forecastPv), ev: money(part.pv) });
  };

  return (
    <div className="valuation-bridge">
      <WaterfallChart
        steps={steps}
        ariaLabel={t("valuationBridgeAria")}
        valueFormat={money}
        selected={part.key}
        onSelect={setSelected}
        height={260}
      />
      <p className="npv-chart-hint" aria-live="polite">
        <strong>{label(part)}:</strong> {calc()}
      </p>
      <p className="npv-chart-hint">{t("valuationBridgeHint")}</p>
    </div>
  );
}
