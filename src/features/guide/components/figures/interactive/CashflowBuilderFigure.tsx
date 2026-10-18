import { useMemo, useState } from "react";
import { ParentSize } from "@visx/responsive";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { CASHFLOW_DEFAULTS, presentValues, summarizeCashflows } from "../../../guide.interactive.cashflowBuilder.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import CashflowBuilderChart from "./CashflowBuilderChart";

/// Project cash flows the reader drags into shape; lighter bars show each flow's present value.
export default function CashflowBuilderFigure() {
  const { t } = useI18n();
  const [flows, setFlows] = useState(CASHFLOW_DEFAULTS);
  const [r, setR] = useState(0.1);
  const pvs = useMemo(() => presentValues(flows, r), [flows, r]);
  const summary = useMemo(() => summarizeCashflows(flows, r), [flows, r]);
  const setFlow = (year: number, value: number) =>
    setFlows((prev) => (prev[year] === value ? prev : prev.map((cf, i) => (i === year ? value : cf))));

  const irrText = summary.severalIrrs
    ? `${t("ixCfSeveral")} (${summary.roots.map((x) => pct(x)).join(", ") || "–"})`
    : Number.isFinite(summary.irr)
      ? pct(summary.irr, 2)
      : "–";

  return (
    <GuideFigure title={t("ixCfTitle")} labId="npv-irr">
      <div className="gf-toolbar">
        <div className="gf-toolbar-slider">
          <SliderField label={t("ixCfRate")} min={0} max={0.3} step={0.005} value={r} onChange={setR} formatValue={(v) => pct(v)} />
        </div>
        <button type="button" className="preset-btn" onClick={() => setFlows(CASHFLOW_DEFAULTS)}>
          {t("ixCfReset")}
        </button>
      </div>
      <p className="ixcf-hint">{t("ixCfHint")}</p>
      <div className="gf-chart ixcf-chart" role="group" aria-label={t("ixCfAria")}>
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0 ? (
              <CashflowBuilderChart width={width} height={height} flows={flows} pvs={pvs} onChange={setFlow} />
            ) : null
          }
        </ParentSize>
      </div>
      <div className="ixcf-legend" aria-hidden="true">
        <span className="ixcf-key flow">{t("ixCfLegendFlow")}</span>
        <span className="ixcf-key pv">{t("ixCfLegendPv")}</span>
      </div>
      <FigureReadout
        items={[
          { label: t("ixCfNpv"), value: fmt(summary.npv), tone: "strong" },
          { label: t("ixCfIrr"), value: irrText, tone: "accent" },
          { label: t("ixCfSum"), value: fmt(summary.sum, 0) },
        ]}
      />
    </GuideFigure>
  );
}
