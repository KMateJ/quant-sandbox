import { useMemo } from "react";
import { Histogram } from "../../../components/charts";
import { Workspace, ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import type { Bin } from "../../../lib/stats";
import { weightedCounts, type GirsanovSample } from "../girsanov.math";

type Props = { sample: GirsanovSample; theta: number; horizon: number; isMobile: boolean };
const BINS = 40;

const normalCurve = (mean: number, sd: number, domain: [number, number]) =>
  Array.from({ length: 121 }, (_, i) => {
    const x = domain[0] + ((domain[1] - domain[0]) * i) / 120;
    return { x, y: Math.exp(-0.5 * ((x - mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI)) };
  });

const toBins = (mass: number[], domain: [number, number]): Bin[] => {
  const width = (domain[1] - domain[0]) / mass.length;
  return mass.map((count, i) => ({ x0: domain[0] + i * width, x1: domain[0] + (i + 1) * width, count }));
};

/// Terminal values under P next to the same values reweighted by dQ/dP, each against its target normal density.
export default function GirsanovHistograms({ sample, theta, horizon, isMobile }: Props) {
  const { t } = useI18n();
  const sd = Math.sqrt(horizon);
  const lo = -4 * sd;
  const hi = 4 * sd + theta * horizon;
  const raw = useMemo(() => toBins(weightedCounts(sample.x, null, [lo, hi], BINS), [lo, hi]), [sample, lo, hi]);
  const re = useMemo(() => toBins(weightedCounts(sample.x, sample.w, [lo, hi], BINS), [lo, hi]), [sample, lo, hi]);
  const height = isMobile ? 240 : 280;
  return (
    <Workspace columns="split" className="lp-section">
      <ChartContainer title={t("girPHist")}>
        <Histogram bins={raw} normalize="density" density={normalCurve(theta * horizon, sd, [lo, hi])} ariaLabel={t("girHistAria")} height={height} xFormat={(v) => v.toFixed(1)} />
      </ChartContainer>
      <ChartContainer title={t("girQHist")}>
        <Histogram bins={re} normalize="density" density={normalCurve(0, sd, [lo, hi])} ariaLabel={t("girHistAria")} height={height} xFormat={(v) => v.toFixed(1)} color="#22c55e" />
      </ChartContainer>
    </Workspace>
  );
}
