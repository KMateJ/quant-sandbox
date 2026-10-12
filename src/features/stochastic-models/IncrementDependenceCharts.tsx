import { ScatterChart, SERIES_ROLE } from "../../components/charts";
import type { ScatterSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import type { TimePoint } from "./wienerProperties.types";

type Props = { pairs: TimePoint[]; acf: TimePoint[]; lag: number; sampleSize: number };

const R = 3.5;

/// Lag scatter (Xₙ, Xₙ₊ₖ) beside the autocorrelation bars with the ±1.96/√n noise band;
/// the selected lag is highlighted in both.
export default function IncrementDependenceCharts({ pairs, acf, lag, sampleSize }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const band = 1.96 / Math.sqrt(sampleSize);

  const bars: ScatterSeries[] = acf.map((p) => ({
    key: `lag-${p.x}`,
    label: `k = ${p.x}`,
    color: p.x === lag ? SERIES_ROLE.estimate : SERIES_ROLE.empirical,
    line: true,
    strokeWidth: p.x === lag ? 8 : 6,
    legend: false,
    points: [{ x: p.x, y: 0 }, { x: p.x, y: p.y }],
  }));

  return (
    <div className="stoch-chart-pair">
      <ChartContainer className="stoch-distribution-frame" title={t("wpIndLagChart")}>
        <div className="stoch-square-chart">
          <ScatterChart
            series={[{ key: "pairs", label: t("wpIndLagChart"), color: SERIES_ROLE.cloud, points: pairs, radius: 2.2, opacity: 0.4, outline: false }]}
            xDomain={[-R, R]}
            yDomain={[-R, R]}
            legend={false}
            isMobile={isMobile}
            xLabel="Xₙ"
            yLabel={`Xₙ₊${lag}`}
            xFormat={(v) => v.toFixed(1)}
            yFormat={(v) => v.toFixed(1)}
          />
        </div>
        <p className="stoch-chart-caption">{t("wpIndLagCaption")}</p>
      </ChartContainer>
      <ChartContainer className="stoch-distribution-frame" title={t("wpIndAcfChart")}>
        <div className="stoch-square-chart">
          <ScatterChart
            series={bars}
            xDomain={[0.5, acf.length + 0.5]}
            yDomain={[-0.25, 0.75]}
            referenceLines={[
              { axis: "y", value: 0, dash: "0" },
              { axis: "y", value: band, color: SERIES_ROLE.reference },
              { axis: "y", value: -band, color: SERIES_ROLE.reference },
            ]}
            legend={false}
            isMobile={isMobile}
            xLabel="k"
            xTickValues={acf.map((p) => p.x)}
            xFormat={(v) => v.toFixed(0)}
            yFormat={(v) => v.toFixed(2)}
          />
        </div>
        <p className="stoch-chart-caption">{t("wpIndAcfCaption")}</p>
      </ChartContainer>
    </div>
  );
}
