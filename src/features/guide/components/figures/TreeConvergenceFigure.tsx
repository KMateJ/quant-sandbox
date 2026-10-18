import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { blackScholesCall } from "../../../black-scholes/blackScholes.math";
import { treeConvergenceRows } from "../../guide.pricing.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const S0 = 100;
const R = 0.05;
const T = 1;

/// CRR tree price against the number of steps, closing in on the Black–Scholes price.
export default function TreeConvergenceFigure() {
  const { t } = useI18n();
  const [K, setK] = useState(100);
  const [sigma, setSigma] = useState(0.2);
  const bs = blackScholesCall(S0, K, T, R, sigma);
  const data = useMemo(() => treeConvergenceRows(S0, K, T, R, sigma).map((row) => ({ ...row, bs })), [K, sigma, bs]);
  const at = (n: number) => data[n - 1].tree;

  return (
    <GuideFigure title={t("gfConvergenceTitle")} labId="binomial">
      <div className="gf-sliders">
        <SliderField label={t("guideFieldStrike")} min={70} max={130} step={1} value={K} onChange={setK} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldSigma")} min={0.05} max={0.6} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfConvergenceAria")}>
        <LineChart
          data={data}
          xKey="n"
          series={[
            { key: "tree", label: t("gfTreePrice"), color: SERIES_PALETTE[0], strokeWidth: 1.25 },
            { key: "bs", label: t("gfBlackScholesPrice"), color: SERIES_PALETTE[2], strokeWidth: 2, dash: "8 4" },
          ]}
          curve="linear"
          tooltipLabel={(x) => `n = ${x}`}
          valueFormat={(v) => v.toFixed(4)}
        />
      </div>
      <FigureReadout
        items={[
          ...[1, 10, 150].map((n) => ({ label: `n = ${n}`, value: fmt(at(n), 4) })),
          { label: t("gfBlackScholesPrice"), value: fmt(bs, 4), tone: "accent" as const },
        ]}
      />
    </GuideFigure>
  );
}
