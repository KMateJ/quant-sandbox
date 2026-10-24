import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { num } from "../../../components/game/gameFormat";
import { parseInstrument } from "../engine/instruments.math";
import { priceSeries, sharesSteps } from "../engine/series.math";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { compactTick, dayAxis } from "./deskChart";
import FillMarkers from "./FillMarkers";
import { SeriesKey } from "../../../components/game";

const MIN_PAD = 0.05;

/// The single realized price path up to today with fills, over a shares-held vs shares-needed strip.
export default function PriceSharesChart({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { market, state, mission, day, S, greeks } = desk;
  const axis = dayAxis(desk, t);
  const held = state.positions.STOCK ?? 0;

  const prices = useMemo(() => priceSeries(market, day), [market, day]);
  const shares = useMemo(
    () => sharesSteps(state.history, held, held - greeks.delta, day),
    [state.history, held, greeks.delta, day],
  );
  const strikes = useMemo(() => {
    const ks = new Set<number>();
    for (const o of mission.opening) {
      const p = parseInstrument(o.id);
      if (p.kind === "option") ks.add(p.strike);
    }
    return [...ks];
  }, [mission]);
  const yDomain = useMemo((): [number, number] => {
    const xs = [...prices.map((p) => p.S), ...strikes];
    return [Math.min(...xs, S * (1 - MIN_PAD)), Math.max(...xs, S * (1 + MIN_PAD))];
  }, [prices, strikes, S]);

  const spotSeries: ChartSeries[] = [{ key: "S", label: t("hdChartSpot"), color: SERIES_PALETTE[0], strokeWidth: 1.75 }];
  const sharesSeries: ChartSeries[] = [
    { key: "held", label: t("hdChartSharesHeld"), color: SERIES_PALETTE[1], strokeWidth: 1.75 },
    { key: "needed", label: t("hdChartSharesNeeded"), color: SERIES_PALETTE[2], strokeWidth: 1.5, dash: "5 4" },
  ];
  const today = { axis: "x" as const, value: day, color: SERIES_PALETTE[2] };

  return (
    <Panel id="hd-price" title={t("hdPriceSharesTitle")} actions={<SeriesKey series={sharesSeries} />} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--main">
        <LineChart
          data={prices}
          xKey="day"
          series={spotSeries}
          {...axis}
          yDomain={yDomain}
          curve="linear"
          legend={false}
          valueFormat={(v) => num(v, 2)}
          referenceLines={[
            ...strikes.map((k) => ({ axis: "y" as const, value: k, color: SERIES_ROLE.reference, dash: "4 4" })),
            today,
          ]}
          layer={(frame) => <FillMarkers frame={frame} fills={state.fills} spot={market.spot} />}
        />
      </div>
      <div className="gdesk-chart gdesk-chart--strip">
        <LineChart
          data={shares}
          xKey="day"
          series={sharesSeries}
          {...axis}
          curve="linear"
          legend={false}
          valueFormat={(v) => num(v, 0)}
          yFormat={compactTick}
          referenceLines={[today]}
        />
      </div>
    </Panel>
  );
}
