import { DragHandles, LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import { useI18n } from "../../../../../i18n";
import type { AcPoint } from "../../../guide.micro.priceImpact.math";

const bp = (v: number) => v * 1e4;

type PathProps = { x: number[]; twap: number[]; isMobile: boolean };

/// Holdings over the day: the chosen schedule against the risk-neutral straight line.
export function HoldingsChart({ x, twap, isMobile }: PathProps) {
  const { t } = useI18n();
  const data = x.map((v, j) => ({ t: j / (x.length - 1), now: v * 100, twap: twap[j] * 100 }));
  return (
    <LineChart
      data={data}
      xKey="t"
      xDomain={[0, 1]}
      yDomain={[0, 100]}
      curve="linear"
      isMobile={isMobile}
      xFormat={(v) => v.toFixed(1)}
      yFormat={(v) => `${v}%`}
      valueFormat={(v) => `${v.toFixed(1)}%`}
      tooltipLabel={(v) => `t = ${v.toFixed(2)}`}
      series={[
        { key: "twap", label: t("gfMsEfTwap"), color: SERIES_PALETTE[2], strokeWidth: 1.5, dash: "5 4" },
        { key: "now", label: t("gfMsEfHoldings"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
      ]}
    />
  );
}

type FrontierProps = { points: AcPoint[]; current: AcPoint; onPick: (sd: number) => void; isMobile: boolean };

/// Expected cost against standard deviation for every risk aversion; the dot is the current choice.
export function FrontierChart({ points, current, onPick, isMobile }: FrontierProps) {
  const { t } = useI18n();
  const data = points.map((p) => ({ sd: bp(p.sd), cost: bp(p.cost) })).sort((a, b) => a.sd - b.sd);
  const sds = data.map((d) => d.sd);
  const costs = data.map((d) => d.cost);
  return (
    <LineChart
      data={data}
      xKey="sd"
      xDomain={[0, Math.ceil(Math.max(...sds) / 10) * 10]}
      yDomain={[0, Math.ceil(Math.max(...costs) / 10) * 10]}
      curve="linear"
      isMobile={isMobile}
      legend={false}
      xFormat={(v) => v.toFixed(0)}
      yFormat={(v) => v.toFixed(0)}
      valueFormat={(v) => `${v.toFixed(1)} bp`}
      tooltipLabel={(v) => `${t("gfMsEfSd")} ${v.toFixed(0)} bp`}
      series={[{ key: "cost", label: t("gfMsEfCost"), color: SERIES_PALETTE[0], strokeWidth: 2.5 }]}
      layer={(frame) => (
        <DragHandles
          frame={frame}
          onChange={(_, v) => v.x !== undefined && onPick(v.x / 1e4)}
          handles={[{ id: "pick", axis: "xy", x: bp(current.sd), y: bp(current.cost), bounds: { x: [Math.min(...sds), Math.max(...sds)], y: [Math.min(...costs), Math.max(...costs)] }, label: t("gfMsEfHandle"), format: (v) => v.toFixed(1) }]}
        />
      )}
    />
  );
}
