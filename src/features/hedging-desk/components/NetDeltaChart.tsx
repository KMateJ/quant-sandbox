import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartSeries, type PlotFrame } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { signed } from "../../../components/game/gameFormat";
import type { DayRecord } from "../engine/desk.types";
import { deltaSteps } from "../engine/series.math";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { compactTick, dayAxis, symmetricDomain } from "./deskChart";

const MARK = 6;
const MIN_EDGE = 400;

function BandLayer({ frame, band, breaches }: { frame: PlotFrame; band: number; breaches: DayRecord[] }) {
  const top = frame.y(band);
  return (
    <g aria-hidden="true">
      <rect x={0} y={top} width={frame.width} height={frame.y(-band) - top} className="gdesk-band" />
      {breaches.map((r) => (
        <rect key={r.day} x={frame.x(r.day) - MARK / 2} y={frame.y(r.closeDelta) - MARK / 2} width={MARK} height={MARK} fill={SERIES_PALETTE[3]} />
      ))}
    </g>
  );
}

/// Net delta per day as open → close steps against the ±band, with breaches marked at the close.
export default function NetDeltaChart({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { state, day, greeks, mission } = desk;
  const data = useMemo(
    () => deltaSteps(state.history, state.openDelta, greeks.delta, day),
    [state.history, state.openDelta, greeks.delta, day],
  );
  const yDomain = useMemo(() => symmetricDomain(data.map((d) => d.delta), MIN_EDGE), [data]);
  const breaches = useMemo(() => state.history.filter((r) => r.breach), [state.history]);
  const series: ChartSeries[] = [{ key: "delta", label: t("hdChartNetDelta"), color: SERIES_PALETTE[0], strokeWidth: 1.75 }];

  return (
    <Panel id="hd-delta" title={t("hdNetDeltaTitle")} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--half">
        <LineChart
          data={data}
          xKey="day"
          series={series}
          {...dayAxis(desk, t)}
          yDomain={yDomain}
          curve="linear"
          legend={false}
          valueFormat={(v) => signed(v, 0)}
          yFormat={compactTick}
          referenceLines={[{ axis: "y", value: 0, color: SERIES_ROLE.reference }]}
          layer={(frame) => <BandLayer frame={frame} band={mission.band} breaches={breaches} />}
        />
      </div>
    </Panel>
  );
}
