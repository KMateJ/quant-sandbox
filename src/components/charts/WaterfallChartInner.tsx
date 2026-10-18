import { AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { CHART_COLORS, chartMargin } from "./chart.theme";
import { waterfallBars, waterfallDomain, type WaterfallProps } from "./waterfall.logic";

type Props = Omit<WaterfallProps, "height"> & { width: number; height: number };

const LABEL_ROOM = 34;
const fill = (kind: "total" | "delta", value: number) =>
  kind === "total" ? "var(--primary)" : value >= 0 ? "var(--positive)" : "var(--negative)";

export default function WaterfallChartInner({ steps, ariaLabel, valueFormat = (v) => v.toFixed(2), selected, onSelect, width, height }: Props) {
  const margin = { ...chartMargin(width < 480), bottom: LABEL_ROOM };
  const w = Math.max(0, width - margin.left - margin.right);
  const h = Math.max(0, height - margin.top - margin.bottom);
  const bars = waterfallBars(steps);
  const x = scaleBand({ domain: bars.map((b) => b.key), range: [0, w], padding: 0.28 });
  const y = scaleLinear({ domain: waterfallDomain(bars), range: [h, 0], nice: true });
  const bw = x.bandwidth();
  const maxChars = Math.max(4, Math.floor((bw + x.step() * 0.28) / 6));

  return (
    <svg width={width} height={height} role="group" aria-label={ariaLabel} className="waterfall">
      <Group left={margin.left} top={margin.top}>
        <line x1={0} x2={w} y1={y(0)} y2={y(0)} stroke={CHART_COLORS.axis} />
        {bars.map((b, i) => {
          const bx = x(b.key) ?? 0;
          const top = y(Math.max(b.start, b.end));
          const barH = Math.max(1, Math.abs(y(b.start) - y(b.end)));
          const next = bars[i + 1];
          const text = b.label.length > maxChars ? `${b.label.slice(0, maxChars - 1)}…` : b.label;
          const valueText = `${b.kind === "delta" && b.value > 0 ? "+" : ""}${valueFormat(b.value)}`;
          return (
            <g
              key={b.key}
              className={selected === b.key ? "waterfall-bar is-selected" : "waterfall-bar"}
              tabIndex={0}
              role={onSelect ? "button" : undefined}
              aria-label={`${b.label}: ${valueText}`}
              onClick={() => onSelect?.(b.key)}
              onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && onSelect) {
                  e.preventDefault();
                  onSelect(b.key);
                }
              }}
            >
              <title>{`${b.label}: ${valueText}`}</title>
              <rect x={bx} y={top} width={bw} height={barH} rx={2} style={{ fill: fill(b.kind, b.value) }} />
              <text className="waterfall-value" x={bx + bw / 2} y={b.end >= b.start ? top - 5 : top + barH + 12} textAnchor="middle">
                {valueText}
              </text>
              <text className="waterfall-label" x={bx + bw / 2} y={h + 16} textAnchor="middle">{text}</text>
              {next && (
                <line className="waterfall-connector" x1={bx + bw} x2={(x(next.key) ?? 0)} y1={y(b.end)} y2={y(b.end)} />
              )}
            </g>
          );
        })}
        <AxisLeft
          scale={y}
          numTicks={5}
          stroke={CHART_COLORS.axis}
          tickStroke={CHART_COLORS.axis}
          tickFormat={(v) => valueFormat(Number(v))}
          tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 11, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })}
        />
      </Group>
    </svg>
  );
}
