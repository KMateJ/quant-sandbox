import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import type { OptionKind } from "../../../../lib/finance/options";
import { blackScholesCurve } from "../../guide.pricing.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const K = 100;

/// Black–Scholes price against S₀ above the maturity payoff, with d₁, d₂ at S₀ = K.
export default function BlackScholesPriceFigure() {
  const { t } = useI18n();
  const [kind, setKind] = useState<OptionKind>("call");
  const [sigma, setSigma] = useState(0.2);
  const [T, setT] = useState(1);
  const [r, setR] = useState(0.05);
  const model = useMemo(() => blackScholesCurve(kind, K, T, r, sigma), [kind, T, r, sigma]);

  return (
    <GuideFigure title={t("gfBsTitle")} labId="black-scholes">
      <div className="gf-toolbar">
        <SegmentedControl<OptionKind>
          ariaLabel={t("guideFieldInstrument")}
          value={kind}
          onChange={setKind}
          options={[{ value: "call", label: t("guideCall") }, { value: "put", label: t("guidePut") }]}
        />
      </div>
      <div className="gf-sliders">
        <SliderField label={t("gfFieldSigma")} min={0.05} max={0.8} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfFieldMaturity")} min={0.05} max={5} step={0.05} value={T} onChange={setT} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("guideFieldRate")} min={0} max={0.15} step={0.005} value={r} onChange={setR} formatValue={(v) => pct(v)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfBsAria", { kind: t(kind === "call" ? "guideCall" : "guidePut") })}>
        <LineChart
          data={model.rows}
          xKey="S"
          series={[
            { key: "payoff", label: t("gfPayoffAtMaturity"), color: SERIES_PALETTE[2], strokeWidth: 1.25, dash: "4 4" },
            { key: "price", label: t("gfPriceToday"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          referenceLines={[{ axis: "x", value: K, color: "var(--muted)", dash: "4 4" }]}
          curve="linear"
          tooltipLabel={(x) => `S₀ = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfPriceAtK"), value: fmt(model.price), tone: "strong" },
          { label: "d₁", value: fmt(model.d1, 3) },
          { label: "d₂", value: fmt(model.d2, 3) },
          { label: "N(d₁)", value: fmt(model.nd1, 3) },
          { label: "N(d₂)", value: fmt(model.nd2, 3) },
        ]}
      />
    </GuideFigure>
  );
}
