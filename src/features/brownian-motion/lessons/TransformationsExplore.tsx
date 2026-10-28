import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartSeries } from "../../../components/charts";
import { ChartContainer, Panel } from "../../../components/layout";
import PredictExplain from "../../../components/ui/PredictExplain";
import SeedControl from "../../../components/SeedControl";
import SliderField from "../../../components/SliderField";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { explainSpec } from "../../../components/lesson/predictRound";
import { useI18n } from "../../../i18n";
import MiniSeriesChart from "./MiniSeriesChart";
import { SHIFT_S, TRANSFORM_KINDS, simulateBase, transformSeries, varianceProfile } from "./transformations.math";
import type { TransformKind } from "./transformations.math";

const CLOUD = 400;
const NAME_KEY = {
  negate: "stochTrNameNegate",
  scale: "stochTrNameScale",
  invert: "stochTrNameInvert",
  shift: "stochTrNameShift",
} as const;

/// One seeded path next to its four transforms, and the empirical variance of each over a cloud: all equal t.
export default function TransformationsExplore() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [seed, setSeed] = useState(7);
  const [c, setC] = useState(2);
  const base = useMemo(() => simulateBase(seed, CLOUD), [seed]);
  const vars = { c: c.toString(), s: SHIFT_S };

  const panels = useMemo(
    () => TRANSFORM_KINDS.map((kind) => ({ kind, data: transformSeries(base, 0, kind, { c, s: SHIFT_S }) })),
    [base, c],
  );
  const profile = useMemo(() => {
    const byKind = TRANSFORM_KINDS.map((kind) => varianceProfile(base, kind, { c, s: SHIFT_S }));
    return byKind[0].map((p, i) => ({
      x: p.x,
      theory: p.x,
      ...Object.fromEntries(TRANSFORM_KINDS.map((kind, j) => [kind, byKind[j][i].y])),
    }));
  }, [base, c]);

  const pair = (kind: TransformKind): ChartSeries[] => [
    { key: "original", label: "W", color: SERIES_ROLE.reference, strokeWidth: 1.5 },
    { key: "transformed", label: t(NAME_KEY[kind], vars), color: SERIES_PALETTE[TRANSFORM_KINDS.indexOf(kind)], strokeWidth: 2.25 },
  ];
  const varSeries: ChartSeries[] = [
    { key: "theory", label: t("stochTrVarTheory"), color: SERIES_ROLE.reference, strokeWidth: 2, dash: "6 4" },
    ...TRANSFORM_KINDS.map((kind, i) => ({ key: kind, label: t(NAME_KEY[kind], vars), color: SERIES_PALETTE[i], strokeWidth: 1.75 })),
  ];

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <Panel title={t("stochTrControls")}>
          <div className="controls-grid">
            <SliderField label={t("stochTrScaleFactor")} min={0.25} max={4} step={0.25} value={c} onChange={setC} formatValue={(v) => v.toFixed(2)} />
            <SeedControl seed={seed} setSeed={setSeed} compact />
          </div>
          <p className="stoch-chart-caption">{t("stochTrControlsHint", { s: SHIFT_S })}</p>
        </Panel>
        <Panel title={t("stochTrPredictTitle")}>
          <PredictExplain {...explainSpec(t, "stochTrEx", 1)} />
        </Panel>
      </aside>
      <div className="stoch-stage">
        <ChartContainer title={t("stochTrGridTitle")}>
          <div className="bl-grid">
            {panels.map(({ kind, data }) => (
              <MiniSeriesChart key={kind} title={t(NAME_KEY[kind], vars)} data={data} series={pair(kind)} ariaLabel={t(NAME_KEY[kind], vars)} />
            ))}
          </div>
          <p className="stoch-chart-caption">{t("stochTrGridCaption")}</p>
        </ChartContainer>
        <ChartContainer title={t("stochTrVarTitle", { n: CLOUD })}>
          <div className="stoch-path-chart" role="img" aria-label={t("stochTrVarTitle", { n: CLOUD })}>
            <LineChart data={profile} xKey="x" series={varSeries} xDomain={[0, 1]} yDomain={[0, 1.2]} curve="linear" isMobile={isMobile} valueFormat={(v) => v.toFixed(2)} />
          </div>
          <p className="stoch-chart-caption">{t("stochTrVarCaption")}</p>
        </ChartContainer>
      </div>
    </div>
  );
}
