import { useMemo } from "react";
import { PathCloudChart } from "../../../components/charts";
import type { PathOverlay } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { pathPoints } from "../../../lib/stats";
import { useI18n } from "../../../i18n";
import { SHOWN_PATHS, walkLaw } from "../randomWalk.math";

type Props = {
  positions: Float64Array;
  n: number;
  step: number;
  p: number;
  h: number;
  range: [number, number];
  isMobile: boolean;
};

const GRID = 40;

/// A handful of walks up to the current step, one highlighted, over the mean line and the ±2σ funnel.
export default function WalkPaths({ positions, n, step, p, h, range, isMobile }: Props) {
  const { t } = useI18n();
  const overlays = useMemo(() => {
    const curve = (key: string, f: (s: number) => number, dash?: string): PathOverlay => ({
      key, color: "var(--chart-reference)", dash, strokeWidth: 1.5,
      points: Array.from({ length: GRID + 1 }, (_, i) => ({ x: (i / GRID) * n, y: f((i / GRID) * n) })),
    });
    const band = (sign: number) => curve(`b${sign}`, (s) => walkLaw(s, p, h).mean + sign * 2 * Math.sqrt(walkLaw(s, p, h).variance), "4 4");
    return [
      band(1), band(-1),
      { key: "mean", color: "var(--text)", dash: "6 4", strokeWidth: 1.75, points: [{ x: 0, y: 0 }, { x: n, y: walkLaw(n, p, h).mean }] },
      { key: "hero", color: "var(--primary)", strokeWidth: 2.25, points: pathPoints(positions, SHOWN_PATHS, n + 1, 0, 1, step) },
    ];
  }, [positions, n, step, p, h]);
  return (
    <ChartContainer title={t("rwPathsTitle")}>
      <div className="rw-paths">
        <PathCloudChart
          values={positions} pathCount={SHOWN_PATHS} stepCount={n + 1} xDomain={[0, n]} yDomain={range}
          visibleSteps={step + 1} maxOpacity={0.45} overlays={overlays} isMobile={isMobile} ariaLabel={t("rwPathsAria", { s: step })}
        />
      </div>
      <p className="rw-caption">{t("rwPathsCaption")}</p>
    </ChartContainer>
  );
}
