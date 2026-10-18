import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { payoffSeries, type PayoffInstrument } from "../../guide.figures.math";
import GuideFigure from "../GuideFigure";
import { markerLine } from "./figureSeries";

const S_RANGE: [number, number] = [0, 200];
const LABEL_KEY = { call: "guideCall", put: "guidePut", forward: "guideForward" } as const;

/// Payoffs lesson figure: switch between call, put and forward and move the strike.
export default function PayoffFigure() {
  const { t } = useI18n();
  const [kind, setKind] = useState<PayoffInstrument>("call");
  const [K, setK] = useState(100);
  const data = useMemo(() => payoffSeries(kind, K, ...S_RANGE), [kind, K]);
  const yDomain: [number, number] = kind === "forward" ? [-K, S_RANGE[1] - K] : [0, Math.max(K, S_RANGE[1] - K)];

  return (
    <GuideFigure title={t("guideFigurePayoffTitle")} labId="payoff">
      <div className="gf-toolbar">
        <SegmentedControl<PayoffInstrument>
          ariaLabel={t("guideFieldInstrument")}
          value={kind}
          onChange={setKind}
          options={(["call", "put", "forward"] as const).map((k) => ({ value: k, label: t(LABEL_KEY[k]) }))}
        />
        <div className="gf-toolbar-slider">
          <SliderField label={t("guideFieldStrike")} min={40} max={160} step={1} value={K} onChange={setK} formatValue={(v) => v.toFixed(0)} />
        </div>
      </div>
      <div className="gf-chart" role="img" aria-label={t("guideFigurePayoffAria", { kind: t(LABEL_KEY[kind]), k: K })}>
        <LineChart
          data={data}
          xKey="S"
          series={[{ key: "payoff", label: t("guideSeriesPayoff"), color: SERIES_PALETTE[0], strokeWidth: 2.25 }]}
          xDomain={S_RANGE}
          yDomain={yDomain}
          referenceLines={[markerLine(K), { axis: "y", value: 0, color: "var(--border)" }]}
          curve="linear"
          legend={false}
          tooltipLabel={(x) => `${t("guideTooltipStock")} = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
    </GuideFigure>
  );
}
