import { useMemo, useState } from "react";
import SliderField from "../../../components/SliderField";
import type { ScatterSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { PlaybackControls } from "../../../components/playback";
import { SegmentedControl } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { buildRateSeries } from "../curveSeries";
import { pct2, YC_COLORS } from "../curveChartUtils";
import { formatDelta, rateDomain } from "../effects.math";
import { MATURITY_LABELS } from "../presets";
import type { YieldCurveModel } from "../useYieldCurve";
import { useShockPlayer } from "../useShockPlayer";
import { buildTermStructure, SHOCK_SEQUENCE, type Shock } from "../yieldCurve.math";
import type { FactorScenario } from "../yieldCurve.types";
import MaturityChart from "./MaturityChart";

const SCENARIOS: FactorScenario[] = ["parallel", "steepen", "flatten", "curvature"];
type Mode = "single" | "history";

/// Animated shocks: a parallel, slope or curvature move (or three in a row) plays on the par curve while the
/// zero and forward curves follow each frame, with the start curve left as a ghost.
export default function ShockPlayer({ model }: { model: YieldCurveModel }) {
  const { t } = useI18n();
  const [mode, setMode] = useState<Mode>("single");
  const [scenario, setScenario] = useState<FactorScenario>("steepen");
  const [sizeBp, setSizeBp] = useState(50);
  const shocks = useMemo<Shock[]>(() => (mode === "history" ? SHOCK_SEQUENCE : [{ scenario, sizeBp }]), [mode, scenario, sizeBp]);
  const player = useShockPlayer(model, shocks);
  const { playback, path, valid } = player;
  const shock = shocks[player.leg];
  const name = (s: Shock) => `${t(`ycShockName_${s.scenario}`)} ${formatDelta(s.sizeBp / 10000)}`;

  // Pick a different shock: start over from the curve as it is now.
  const pick = <T,>(set: (value: T) => void) => (value: T) => {
    playback.reset();
    set(value);
  };

  const domain = useMemo(() => (valid ? rateDomain(path.flatMap(buildTermStructure)) : ([0, 0.08] as [number, number])), [path, valid]);
  const series: ScatterSeries[] = [
    {
      key: "start", label: t("ycShockStartCurve"), color: YC_COLORS.baseline, line: true, dash: "4 4", opacity: 0.7,
      strokeWidth: 1.6, legend: true, points: path[0].map((n, i) => ({ x: i, y: n.rate })),
    },
    ...buildRateSeries(player.term, { par: t("ycParShort"), zero: t("ycZeroShort"), forward: t("ycForwardShort") }),
  ];

  return (
    <ChartContainer title={t("ycShockTitle")}>
      <div className="yc-shock-controls">
        <SegmentedControl<Mode> ariaLabel={t("ycShockMode")} value={mode} onChange={pick(setMode)}
          options={[{ value: "single", label: t("ycShockSingle") }, { value: "history", label: t("ycShockHistory") }]} />
        {mode === "single" && (
          <>
            <div className="yc-scenarios" role="group" aria-label={t("ycShockScenario")}>
              {SCENARIOS.map((id) => (
                <button key={id} type="button" className={id === scenario ? "is-active" : undefined} aria-pressed={id === scenario}
                  onClick={() => pick(setScenario)(id)}>{t(`ycShockName_${id}`)}</button>
              ))}
            </div>
            <SliderField label={t("ycShockSize")} min={-100} max={100} step={10} value={sizeBp}
              onChange={pick(setSizeBp)} formatValue={(v) => formatDelta(v / 10000)} />
          </>
        )}
      </div>
      {valid ? (
        <PlaybackControls playback={playback} steps={player.steps} label={t("ycShockProgress")}
          formatStep={(s) => `${Math.round((s / player.steps) * 100)}%`} />
      ) : (
        <p className="yc-error" role="alert">{t("ycShockInfeasible")}</p>
      )}
      <p className="yc-shock-readout" aria-live="polite">
        {valid && player.engaged ? t("ycShockStage", { name: name(shock), n: player.leg + 1, total: shocks.length }) : t("ycShockHint")}
      </p>
      <div className="chart-wrap">
        <MaturityChart labels={MATURITY_LABELS} series={series} yDomain={domain} yFormat={pct2} yLabel={t("ycYieldAxis")} />
      </div>
      <div className="yc-factor-actions">
        {mode === "history" && (
          <>
            <button type="button" onClick={() => player.jump(-1)} aria-label={t("pbStepBack")}>◀</button>
            <button type="button" onClick={() => player.jump(1)} aria-label={t("pbStepForward")}>▶</button>
          </>
        )}
        <button type="button" onClick={player.undo} disabled={!player.engaged}>{t("ycShockUndo")}</button>
      </div>
    </ChartContainer>
  );
}
