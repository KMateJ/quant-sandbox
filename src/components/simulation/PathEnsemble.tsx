import { useMemo, useState } from "react";
import { DragHandles, Histogram, PathCloudChart, type BinRange } from "../charts";
import { useI18n } from "../../i18n";
import { PlaybackControls, usePlayback } from "../playback";
import { usePathEnsemble, type TerminalLaw } from "./usePathEnsemble";

type Props = {
  /// Step-major path values, `values[step * pathCount + path]`.
  values: Float64Array;
  pathCount: number;
  stepCount: number;
  horizon: number;
  /// Exact law of the terminal value, for the density overlay and the theoretical share below the level.
  law: TerminalLaw;
  /// Exact law of the value at time t. When given, a time cursor (play / scrub) shows the cloud up to t and the
  /// histogram of the values at t; it starts at the end, so the initial view is the terminal one.
  lawAt?: (t: number) => TerminalLaw;
  /// Histogram range for the terminal values.
  domain: [number, number];
  /// Starting level of the draggable line (e.g. the median); kept until the inputs change.
  initialLevel: number;
  format: (v: number) => string;
  isMobile?: boolean;
};

const pct = (v: number) => (Number.isFinite(v) ? `${(v * 100).toFixed(1)}%` : "–");

/// A path cloud with its quantile fan and a draggable level, linked to a histogram of the terminal values
/// with the exact density: brushing histogram bins highlights the paths that ended there.
export default function PathEnsemble({ values, pathCount, stepCount, horizon, law, lawAt, domain, initialLevel, format, isMobile = false }: Props) {
  const { t } = useI18n();
  const steps = stepCount - 1;
  const playback = usePlayback({ steps, durationMs: 5000 });
  const step = lawAt ? playback.step : steps;
  const lawNow = useMemo(() => (lawAt && step < steps ? lawAt((step / steps) * horizon) : law), [lawAt, law, step, steps, horizon]);
  // The cloud is drawn up to the cursor: values are step-major, so the first (k + 1) rows are the paths up to step k.
  const shownSteps = Math.max(1, step) + 1;
  const shown = useMemo(() => values.subarray(0, shownSteps * pathCount), [values, shownSteps, pathCount]);
  const timeLabel = (s: number) => `t = ${((s / steps) * horizon).toFixed(2)}`;
  const [selection, setSelection] = useState<BinRange | null>(null);
  const [level, setLevel] = useState({ value: initialLevel, base: initialLevel, values });
  // New paths or inputs start from the new median and drop a selection that refers to old bins.
  if (level.base !== initialLevel || level.values !== values) {
    setLevel({ value: initialLevel, base: initialLevel, values });
    setSelection(null);
  }
  const yDomain = useMemo((): [number, number] => {
    let lo = Infinity;
    let hi = -Infinity;
    for (let i = 0; i < values.length; i++) { if (values[i] < lo) lo = values[i]; if (values[i] > hi) hi = values[i]; }
    return [lo, hi];
  }, [values]);
  const e = usePathEnsemble({ values, pathCount, stepCount, horizon, law: lawNow, domain, level: level.value, selection, step });

  return (
    <div className="lp-ensemble">
      {lawAt && <PlaybackControls playback={playback} steps={steps} label={t("lpEnsembleTime")} formatStep={timeLabel} showSpeed />}
      <div className="lp-ensemble-charts">
        <div className="lp-ensemble-cloud">
          <PathCloudChart
            values={shown} pathCount={pathCount} stepCount={shownSteps} dx={horizon / steps} xDomain={[0, horizon]}
            yDomain={yDomain} maxOpacity={selection ? 0.25 : 0.6} overlays={[...e.fan, ...e.brushed.overlays]} isMobile={isMobile}
            ariaLabel={t("lpEnsembleCloudAria", { n: pathCount })}
            layer={(frame) => (
              <DragHandles frame={frame} onChange={(_, v) => v.y !== undefined && setLevel((l) => ({ ...l, value: v.y! }))}
                handles={[{ id: "level", axis: "y", y: level.value, min: yDomain[0], max: yDomain[1], label: t("lpEnsembleLevel"), format }]} />
            )}
          />
        </div>
        <Histogram
          bins={e.bins} density={e.density} selection={selection} onSelectionChange={setSelection} height={isMobile ? 200 : 300}
          markers={[{ value: level.value, label: format(level.value), color: "var(--primary)" }]}
          xFormat={format} yFormat={(v) => String(Number(v.toPrecision(2)))} ariaLabel={t("lpEnsembleHistAria")}
        />
      </div>
      <dl className="lp-ensemble-readout">
        {lawAt && step < steps && <div><dt>{t("lpEnsembleTime")}</dt><dd>{timeLabel(step)}</dd></div>}
        <div><dt>{t("lpEnsembleLevel")}</dt><dd>{format(level.value)}</dd></div>
        <div><dt>{t(step < steps ? "lpEnsembleBelowNow" : "lpEnsembleBelow")}</dt><dd>{pct(e.below)}</dd></div>
        <div><dt>{t("lpEnsembleBelowTheory")}</dt><dd>{pct(e.belowTheory)}</dd></div>
      </dl>
      <p className="lp-ensemble-hint">
        {selection
          ? e.brushed.count > e.maxBrushed
            ? t("lpEnsembleBrushedShown", { n: e.brushed.count, shown: e.maxBrushed })
            : t("lpEnsembleBrushed", { n: e.brushed.count })
          : `${t("lpEnsembleFan")}. ${t("lpEnsembleLevelHint")} ${t("lpEnsembleBrushHint")}${lawAt ? ` ${t("lpEnsemblePlayHint")}` : ""}`}
      </p>
    </div>
  );
}
