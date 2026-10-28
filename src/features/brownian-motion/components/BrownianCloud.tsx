import { useMemo } from "react";
import { DragHandles, PathCloudChart } from "../../../components/charts";
import type { PathOverlay } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { pathPoints, valuesAtStep } from "../../../lib/stats";
import { useI18n } from "../../../i18n";
import { bandsAt, brownianTerminalLaw } from "../brownianMotion.math";
import TerminalDock from "./TerminalDock";

type Props = {
  values: Float64Array;
  pathCount: number;
  steps: number;
  horizon: number;
  drift: number;
  vol: number;
  /// Cursor time in [0, horizon] and its setter.
  cursor: number;
  onCursor: (t: number) => void;
  isMobile: boolean;
};

const DOCK_GAP = 0.02;
const DOCK_SPAN = 0.24;
const SPREAD = 4;
const GRID = 60;

/// The lab's dominant chart: the muted path cloud with one highlighted path, the mean μt and the ±1σ / ±2σ
/// theory bands, a draggable time cursor, and the histogram of the paths at that time docked on the right.
export default function BrownianCloud({ values, pathCount, steps, horizon, drift, vol, cursor, onCursor, isMobile }: Props) {
  const { t } = useI18n();
  const stepCount = steps + 1;
  const dt = horizon / steps;
  const yDomain = useMemo((): [number, number] => {
    const sd = vol * Math.sqrt(horizon);
    const end = drift * horizon;
    return [Math.min(0, end) - SPREAD * sd, Math.max(0, end) + SPREAD * sd];
  }, [drift, vol, horizon]);

  const overlays = useMemo(() => {
    const line = (key: string, f: (x: number) => number, width: number, color: string, dash?: string): PathOverlay => ({
      key, color, dash, strokeWidth: width,
      points: Array.from({ length: GRID + 1 }, (_, i) => ({ x: (i / GRID) * horizon, y: f((i / GRID) * horizon) })),
    });
    const band = (k: number, width: number, dash?: string) => [
      line(`u${k}`, (x) => bandsAt(drift, vol, x, k).hi, width, "var(--chart-reference)", dash),
      line(`l${k}`, (x) => bandsAt(drift, vol, x, k).lo, width, "var(--chart-reference)", dash),
    ];
    return [
      ...band(2, 1.25, "4 4"),
      ...band(1, 1.75),
      line("mean", (x) => drift * x, 1.75, "var(--text)", "6 4"),
      { key: "hero", color: "var(--primary)", strokeWidth: 2.25, points: pathPoints(values, pathCount, stepCount, 0, dt) },
    ];
  }, [values, pathCount, stepCount, dt, horizon, drift, vol]);

  const step = Math.round(cursor / dt);
  const sample = useMemo(() => valuesAtStep(values, pathCount, stepCount, step), [values, pathCount, stepCount, step]);
  const law = brownianTerminalLaw(drift, vol, Math.max(cursor, dt));

  return (
    <ChartContainer title={t("brownianMotionChartTitle", { n: pathCount })}>
      <div className="bro-cloud">
        <PathCloudChart
          values={values} pathCount={pathCount} stepCount={stepCount} dx={dt} xDomain={[0, horizon * (1 + DOCK_GAP + DOCK_SPAN)]}
          yDomain={yDomain} maxOpacity={0.12} overlays={overlays} isMobile={isMobile} ariaLabel={t("brownianMotionChartAria", { n: pathCount })}
          layer={(frame) => (
            <>
              <TerminalDock frame={frame} sample={sample} pdf={law.pdf} yDomain={yDomain} anchor={horizon * (1 + DOCK_GAP)} span={horizon * DOCK_SPAN} />
              <DragHandles frame={frame} onChange={(_, v) => v.x !== undefined && onCursor(v.x)}
                handles={[{ id: "cursor", axis: "x", x: cursor, min: dt, max: horizon, step: dt, label: t("brownianMotionCursor"), format: (v) => v.toFixed(2) }]} />
            </>
          )}
        />
      </div>
      <ul className="bro-legend" aria-hidden="true">
        <li><span className="bro-key bro-key-hero" />{t("brownianMotionHeroPath")}</li>
        <li><span className="bro-key bro-key-mean" />{t("brownianMotionMeanLine")}</li>
        <li><span className="bro-key bro-key-band" />{t("brownianMotionBands")}</li>
        <li><span className="bro-key bro-key-density" />{t("brownianMotionDensity")}</li>
      </ul>
    </ChartContainer>
  );
}
