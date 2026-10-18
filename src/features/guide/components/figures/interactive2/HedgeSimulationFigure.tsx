import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { makeRng } from "../../../../../lib/math/random";
import { HEDGE_SETUP, hedgeErrorSpread, hedgePath } from "../../../guide.interactive2.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import { PlaybackControls, usePlayback } from "../../../../../components/playback";

const EVERY = [1, 5, 21] as const;

/// A short call hedged with Δ shares along one path, animated day by day, against the naked short call.
export default function HedgeSimulationFigure() {
  const { t } = useI18n();
  const [every, setEvery] = useState<number>(5);
  const [seed, setSeed] = useState(1);
  const playback = usePlayback({ steps: HEDGE_SETUP.days, durationMs: 5000 });
  const shown = playback.step;
  const path = useMemo(() => hedgePath(HEDGE_SETUP, every, makeRng(seed)), [every, seed]);
  const spread = useMemo(() => hedgeErrorSpread(HEDGE_SETUP, every, 200, 3), [every]);
  const visible = path.map((row) => (row.day <= shown ? row : { day: row.day }));
  const last = path[Math.min(shown, HEDGE_SETUP.days)];

  return (
    <GuideFigure title={t("gi2HedgeTitle")} labId="delta-hedging">
      <div className="gf-toolbar">
        <SegmentedControl<number> ariaLabel={t("gi2Rebalance")} value={every} onChange={setEvery} options={EVERY.map((v) => ({ value: v, label: t("gi2EveryDays", { k: v }) }))} />
        <button type="button" className="preset-btn" onClick={() => setSeed((s) => s + 1)}>{t("gfNewPaths")}</button>
      </div>
      <PlaybackControls playback={playback} steps={HEDGE_SETUP.days} label={t("gi2DayLabel")} />
      <div className="gf-chart" role="img" aria-label={t("gi2HedgeAria", { k: every })}>
        <LineChart
          data={visible}
          xKey="day"
          series={[
            { key: "naked", label: t("gi2Naked"), color: SERIES_PALETTE[2], strokeWidth: 1.75, dash: "6 3" },
            { key: "hedged", label: t("gi2Hedged"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          xDomain={[0, HEDGE_SETUP.days]}
          referenceLines={[{ axis: "y", value: 0, color: "var(--border-hover)", dash: "none" }]}
          curve="linear"
          tooltipLabel={(x) => t("gi2Day", { d: x })}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gi2PathPnl"), value: last && "hedged" in last ? fmt(last.hedged) : "–" },
          { label: t("gi2SdHedged", { k: every }), value: fmt(spread.hedged), tone: "strong" },
          { label: t("gi2SdNaked"), value: fmt(spread.naked), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
