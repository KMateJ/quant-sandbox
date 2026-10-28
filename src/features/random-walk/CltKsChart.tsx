import { useMemo } from "react";
import { ScatterChart, SERIES_ROLE } from "../../components/charts";
import type { ScatterSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import type { KsPoint } from "../../lib/stochastic/clt.types";

type Props = { points: KsPoint[]; floor: number; activeN: number };

const log10 = Math.log10;
const Y_MIN = 0.002;
const Y_MAX = 1;
const X_TICKS = [1, 2, 5, 10, 20, 50, 100].map(log10);

/// KS distance to N(0,1) against n on log–log axes, so a 1/√n rate is a straight
/// line of slope −½ — the same slope as the Berry–Esseen bound above it.
export default function CltKsChart({ points, floor, activeN }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const series = useMemo<ScatterSeries[]>(() => {
    const at = (n: number, y: number) => ({ x: log10(n), y: log10(Math.max(y, Y_MIN)) });
    const inRange = (y: number) => y <= Y_MAX;
    const active = points.find((p) => p.n === activeN);
    return [
      {
        key: "bound",
        label: t("stochCltBoundSeries"),
        color: SERIES_ROLE.candidate,
        line: true,
        dash: "6 4",
        points: points.filter((p) => inRange(p.bound)).map((p) => at(p.n, p.bound)),
      },
      {
        key: "ks",
        label: t("stochCltKsSeries"),
        color: SERIES_ROLE.empirical,
        line: true,
        strokeWidth: 2,
        points: points.map((p) => at(p.n, p.ks)),
      },
      {
        key: "active",
        label: t("stochCltLevelReadout", { n: activeN }),
        color: SERIES_ROLE.empirical,
        radius: 5,
        legend: false,
        points: active ? [{ ...at(active.n, active.ks), label: `n = ${active.n}` }] : [],
      },
    ];
  }, [points, activeN, t]);

  const fmtPow = (digits: number) => (v: number) => Number((10 ** v).toPrecision(digits)).toString();

  return (
    <ChartContainer className="stoch-distribution-frame" title={t("stochCltKsTitle")}>
      <div className="stoch-density-chart">
        <ScatterChart
          series={series}
          xDomain={[0, 2]}
          yDomain={[log10(Y_MIN), log10(Y_MAX)]}
          xTickValues={X_TICKS}
          referenceLines={[{ axis: "y", value: log10(floor), color: SERIES_ROLE.reference, dash: "3 3", width: 2 }]}
          isMobile={isMobile}
          xFormat={fmtPow(3)}
          yFormat={fmtPow(1)}
          xLabel={t("stochCltNAxis")}
          yLabel={t("stochCltKsAxis")}
        />
      </div>
      <p className="stoch-chart-caption">{t("stochCltKsCaption", { floor: floor.toFixed(3) })}</p>
    </ChartContainer>
  );
}
