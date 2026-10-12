import { useMemo } from "react";
import { LineChart, SERIES_PALETTE, SERIES_ROLE } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import { differenceQuotients, relativeRows, sampleWindow, smoothCurve, type LevyPath } from "./wienerProperties.math";

type Props = { path: LevyPath; a: number; b: number; center: number };

const ZOOM_POINTS = 400;
const QUOTIENT_LEVEL = 32;
const formatPow = (v: number) => `10^${v.toFixed(1)}`;

/// The zoom window drawn on window-relative time for the Brownian path and the smooth
/// curve, plus log₁₀ of the difference quotients against log₂(1/h).
export default function RoughnessZoomCharts({ path, a, b, center }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const brownian = useMemo(() => relativeRows(sampleWindow(path, a, b, ZOOM_POINTS), a, b, "w"), [path, a, b]);
  const smooth = useMemo(() => {
    const grid = Array.from({ length: ZOOM_POINTS + 1 }, (_, i) => a + ((b - a) * i) / ZOOM_POINTS);
    return relativeRows(grid.map((x) => ({ x, y: smoothCurve(x) })), a, b, "f");
  }, [a, b]);
  const quotients = useMemo(
    () =>
      differenceQuotients(path, center, QUOTIENT_LEVEL).map((r) => ({
        level: r.level,
        brownian: Math.log10(r.brownian),
        theory: Math.log10(r.theory),
        smooth: Math.log10(r.smooth),
      })),
    [path, center]
  );

  const zoomChart = (title: string, data: Record<string, number>[], key: string, color: string) => (
    <ChartContainer className="stoch-distribution-frame" title={title}>
      <div className="stoch-density-chart">
        <LineChart
          data={data}
          xKey="u"
          series={[{ key, label: title, color, strokeWidth: 1.3 }]}
          xDomain={[0, 1]}
          curve="linear"
          legend={false}
          isMobile={isMobile}
          tooltipLabel={(u) => `t = ${(a + u * (b - a)).toPrecision(10)}`}
          valueFormat={(v) => v.toPrecision(6)}
        />
      </div>
    </ChartContainer>
  );

  return (
    <>
      <div className="stoch-chart-pair">
        {zoomChart(t("wpRoughZoomBrownian"), brownian, "w", SERIES_PALETTE[0])}
        {zoomChart(t("wpRoughZoomSmooth"), smooth, "f", SERIES_ROLE.candidate)}
      </div>
      <p className="stoch-chart-caption">{t("wpRoughCaption")}</p>
      <ChartContainer className="stoch-distribution-frame" title={t("wpRoughQuotientChart")}>
        <div className="stoch-density-chart">
          <LineChart
            data={quotients}
            xKey="level"
            series={[
              { key: "brownian", label: t("wpRoughBrownian"), color: SERIES_PALETTE[0], strokeWidth: 2 },
              { key: "theory", label: t("wpRoughTheory"), color: SERIES_ROLE.reference, strokeWidth: 1.5, dash: "6 4" },
              { key: "smooth", label: t("wpRoughSmooth"), color: SERIES_ROLE.candidate, strokeWidth: 2 },
            ]}
            curve="linear"
            isMobile={isMobile}
            tooltipLabel={(j) => `${t("wpRoughLevelAxis")}: ${j}`}
            valueFormat={formatPow}
          />
        </div>
        <p className="stoch-chart-caption">{t("wpRoughQuotientCaption")}</p>
      </ChartContainer>
    </>
  );
}
