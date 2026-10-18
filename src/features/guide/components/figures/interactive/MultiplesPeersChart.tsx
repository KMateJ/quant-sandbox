import type { KeyboardEvent } from "react";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { scaleLinear } from "@visx/scale";
import { CHART_COLORS, chartMargin } from "../../../../../components/charts/chart.theme";
import { useI18n } from "../../../../../i18n";
import { GROWTH_MAX, GROWTH_MIN, PEERS } from "../../../guide.interactive.multiplesPeers.math";
import { pct } from "../figureFormat";
import MultiplesPeersTarget from "./MultiplesPeersTarget";

type Props = {
  width: number;
  height: number;
  excluded: ReadonlySet<string>;
  onTogglePeer: (id: string) => void;
  line: { a: number; b: number } | null;
  growth: number;
  multiple: number;
  onGrowth: (g: number) => void;
};

/// Scatter of peer multiples against growth, the least-squares line through the included peers, and the target on it.
export default function MultiplesPeersChart({ width, height, excluded, onTogglePeer, line, growth, multiple, onGrowth }: Props) {
  const { t } = useI18n();
  const margin = chartMargin(width < 480);
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const x = scaleLinear({ domain: [GROWTH_MIN, GROWTH_MAX], range: [0, innerW] });
  const y = scaleLinear({ domain: [4, 20], range: [innerH, 0] });
  const clampY = (v: number) => Math.min(innerH, Math.max(0, y(v)));

  const onPeerKey = (event: KeyboardEvent, id: string) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onTogglePeer(id);
  };

  return (
    <svg width={width} height={height} className="ixmp-svg">
      <Group left={margin.left} top={margin.top}>
        <GridRows scale={y} width={innerW} numTicks={5} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
        {line && (
          <line
            className="ixmp-line"
            x1={0}
            x2={innerW}
            y1={clampY(line.a + line.b * GROWTH_MIN)}
            y2={clampY(line.a + line.b * GROWTH_MAX)}
          />
        )}
        {PEERS.map((p) => {
          const out = excluded.has(p.id);
          return (
            <g
              key={p.id}
              className={out ? "ixmp-peer is-excluded" : "ixmp-peer"}
              role="button"
              tabIndex={0}
              aria-pressed={!out}
              aria-label={t("ixMpPeerAria", { id: p.id, growth: pct(p.growth), multiple: p.multiple.toFixed(1), state: t(out ? "ixMpExcluded" : "ixMpIncluded") })}
              onClick={() => onTogglePeer(p.id)}
              onKeyDown={(event) => onPeerKey(event, p.id)}
            >
              <circle className="ixmp-peer-hit" cx={x(p.growth)} cy={y(p.multiple)} r={16} />
              <circle className="ixmp-peer-dot" cx={x(p.growth)} cy={y(p.multiple)} r={7} />
              <text className="ixmp-peer-label" x={x(p.growth) + 11} y={y(p.multiple) + 4}>{p.id}</text>
            </g>
          );
        })}
        <MultiplesPeersTarget
          cx={x(growth)}
          cy={clampY(multiple)}
          baseline={innerH}
          growth={growth}
          growthAt={(px) => x.invert(px)}
          plotLeft={margin.left}
          label={t("ixMpTargetLabel")}
          ariaLabel={t("ixMpTargetAria")}
          onChange={onGrowth}
        />
        <AxisLeft
          scale={y}
          numTicks={5}
          tickFormat={(v) => `${Number(v)}×`}
          stroke={CHART_COLORS.axis}
          tickStroke={CHART_COLORS.axis}
          tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 11, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })}
        />
        <AxisBottom
          top={innerH}
          scale={x}
          numTicks={width < 480 ? 4 : 7}
          tickFormat={(v) => pct(Number(v), 0)}
          stroke={CHART_COLORS.axis}
          tickStroke={CHART_COLORS.axis}
          tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 11, textAnchor: "middle" })}
        />
      </Group>
    </svg>
  );
}
