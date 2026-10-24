import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartSeries } from "../../../components/charts";
import { SeriesKey, signedMoney } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { benchmarkSeries, surplusSeries } from "../engine/series.math";
import { symmetricDomain } from "../deskView.math";
import type { AlmDeskModel } from "../useAlmDesk";

const FLOOR = 5_000;

/// Your surplus by year against matching every year and never trading, on the same shocks.
export default function SurplusChart({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const { state, mission, seed, cfg } = desk;
  const round = state.game.round;
  const bench = useMemo(() => benchmarkSeries(mission, seed, cfg.years), [mission, seed, cfg.years]);
  const data = useMemo(() => {
    const you = surplusSeries(state);
    return you.map((v, n) => ({ n, you: v, match: bench.matchYearly[n], none: bench.none[n] }));
  }, [state, bench]);

  const yDomain = useMemo(() => symmetricDomain(data.flatMap((d) => [d.you, d.match, d.none]), FLOOR), [data]);

  const series: ChartSeries[] = [
    { key: "you", label: t("almdSurplusYou"), color: SERIES_PALETTE[2], strokeWidth: 2 },
    { key: "match", label: t("almdSurplusMatch"), color: SERIES_PALETTE[1], strokeWidth: 1.25, dash: "5 4" },
    { key: "none", label: t("almdSurplusNone"), color: SERIES_ROLE.reference, strokeWidth: 1.25 },
  ];
  return (
    <Panel id="almd-surplus" title={t("almdSurplusTitle")} actions={<SeriesKey series={series} />} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--half">
        <LineChart
          data={data}
          xKey="n"
          series={series}
          xDomain={[0, cfg.years]}
          yDomain={yDomain}
          curve="linear"
          legend={false}
          valueFormat={signedMoney}
          yFormat={(v) => `${Math.round(v / 1000)}k`}
          xFormat={(v) => String(Math.round(v))}
          tooltipLabel={(v) => t("almdRoundShort", { n: v })}
          referenceLines={[{ axis: "y", value: 0, color: SERIES_ROLE.reference, dash: "4 4" }, { axis: "x", value: round, color: SERIES_PALETTE[2] }]}
        />
      </div>
    </Panel>
  );
}
