import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, type ChartSeries } from "../../../components/charts";
import { SeriesKey, num } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { zeroRate } from "../engine/curve.math";
import { curveRows } from "../deskView.math";
import type { RatesDeskModel } from "../useRatesDesk";

const MARK = 7;

/// Zero curve today vs day 0; squares at the book bonds, diamonds at each future's cheapest-to-deliver bond.
export default function CurveChart({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  const { path, day, mission, quotes } = desk;
  const rows = useMemo(() => curveRows(path, day), [path, day]);
  const f = path[day];
  const bonds = mission.book.map((b) => ({ t: b.maturity, z: zeroRate(f, b.maturity) * 100 }));
  const ctds = mission.futures.map((s, j) => {
    const m = s.basket[quotes[j].ctd][1];
    return { t: m, z: zeroRate(f, m) * 100 };
  });
  const series: ChartSeries[] = [
    { key: "today", label: t("ratdCurveToday"), color: SERIES_PALETTE[0], strokeWidth: 1.75 },
    { key: "start", label: t("ratdCurveStart"), color: SERIES_PALETTE[2], strokeWidth: 1.25, dash: "4 4" },
  ];
  return (
    <Panel id="ratd-curve" title={t("ratdCurveTitle")} actions={<SeriesKey series={series} />} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--main">
        <LineChart
          data={rows}
          xKey="t"
          series={series}
          xDomain={[0, 30]}
          curve="linear"
          legend={false}
          tooltipLabel={(x) => t("ratdChartMat", { t: num(x, 1) })}
          valueFormat={(v) => `${num(v, 2)}%`}
          xFormat={(x) => String(Math.round(x))}
          yFormat={(v) => num(v, 1)}
          layer={(frame) => (
            <g aria-hidden="true">
              {bonds.map((p, i) => (
                <rect key={`b${i}`} className="ratd-mark-bond" x={frame.x(p.t) - MARK / 2} y={frame.y(p.z) - MARK / 2} width={MARK} height={MARK}>
                  <title>{t("ratdCurveBonds")}</title>
                </rect>
              ))}
              {ctds.map((p, i) => (
                <rect key={`c${i}`} className="ratd-mark-ctd" x={frame.x(p.t) - MARK / 2} y={frame.y(p.z) - MARK / 2} width={MARK} height={MARK}
                  transform={`rotate(45 ${frame.x(p.t)} ${frame.y(p.z)})`}>
                  <title>{t("ratdCurveCtd")}</title>
                </rect>
              ))}
            </g>
          )}
        />
      </div>
    </Panel>
  );
}
