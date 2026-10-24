import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { LineChart, SERIES_PALETTE, SERIES_ROLE, type ChartSeries, type PlotFrame } from "../../../components/charts";
import { SeriesKey, pct } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { yieldAt } from "../../immunization/immunization.math";
import { curvePoints } from "../engine/risk.math";
import { curveHistory, holdingRows, paddedDomain } from "../deskView.math";
import type { AlmDeskModel } from "../useAlmDesk";

const MAX_T = 15;
const MARK = 7;
const Y_PAD = 0.005;

/// Today's curve over last year's (dashed) and the start (faint), with held bonds (squares) and the liability (diamond).
export default function CurveChart({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const { state, mission } = desk;
  const curves = useMemo(() => curveHistory(state, mission), [state, mission]);
  const now = state.game.curve;
  const last = curves.at(-2);
  const data = useMemo(() => {
    const prev = curves.at(-2);
    return curvePoints(now, MAX_T).map((p) => ({
      t: p.t,
      today: p.y,
      last: prev ? yieldAt(prev, p.t) : undefined,
      start: yieldAt(curves[0], p.t),
    }));
  }, [now, curves]);
  const yDomain = useMemo(() => paddedDomain(data.flatMap((d) => [d.today, d.last, d.start]), Y_PAD), [data]);
  const marks = useMemo(() => holdingRows(state, mission).filter((r) => r.kind !== "cash" && r.left > 0), [state, mission]);

  const series: ChartSeries[] = [
    { key: "today", label: t("almdCurveToday"), color: SERIES_PALETTE[2], strokeWidth: 2 },
    ...(last ? [{ key: "last", label: t("almdCurveLast"), color: SERIES_PALETTE[0], strokeWidth: 1.25, dash: "5 4" }] : []),
    { key: "start", label: t("almdCurveStart"), color: SERIES_ROLE.reference, strokeWidth: 1 },
  ];
  const layer = (frame: PlotFrame) => (
    <g aria-hidden="true">
      {marks.map((m, i) => {
        const x = frame.x(m.left);
        const y = frame.y(yieldAt(now, m.left));
        return m.kind === "liability" ? (
          <rect key={i} x={x - MARK / 2} y={y - MARK / 2} width={MARK} height={MARK} fill={SERIES_PALETTE[3]} transform={`rotate(45 ${x} ${y})`} />
        ) : (
          <rect key={i} x={x - MARK / 2} y={y - MARK / 2} width={MARK} height={MARK} fill={SERIES_PALETTE[1]} />
        );
      })}
    </g>
  );

  return (
    <Panel id="almd-curve" title={t("almdCurveTitle")} actions={<SeriesKey series={series} />} className="gdesk-panel" flush>
      <div className="gdesk-chart gdesk-chart--main">
        <LineChart
          data={data}
          xKey="t"
          series={series}
          xDomain={[0, MAX_T]}
          yDomain={yDomain}
          curve="linear"
          legend={false}
          valueFormat={(v) => pct(v, 2)}
          yFormat={(v) => pct(v, 1)}
          xFormat={(v) => String(Math.round(v))}
          tooltipLabel={(v) => t("almdCurveYears", { t: v })}
          layer={layer}
        />
      </div>
    </Panel>
  );
}
