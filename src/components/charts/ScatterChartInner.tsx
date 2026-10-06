import { useMemo, useRef, useEffect } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath, Line as SvgLine } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { curveLinear } from "@visx/curve";
import { useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { extent } from "@visx/vendor/d3-array";
import { CHART_COLORS, LEGEND_HEIGHT, chartMargin } from "./chart.theme";
import type { ScatterChartProps, ScatterPoint, ScatterSeries } from "./chart.types";

type Props = ScatterChartProps & { width: number; height: number };

type Hover = { point: ScatterPoint; series: ScatterSeries };

function fitDomain(values: number[], provided?: [number, number]): [number, number] {
  if (provided) return provided;
  const [lo, hi] = extent(values);
  if (lo == null || hi == null) return [0, 1];
  return lo === hi ? [lo - 1, hi + 1] : [lo, hi];
}

export default function ScatterChartInner({
  width,
  height,
  series,
  xDomain,
  yDomain,
  referenceLines = [],
  bands = [],
  annotations = [],
  isMobile = false,
  legend = true,
  xFormat,
  yFormat,
  xLabel,
  yLabel,
  onDrag,
}: Props) {
  const base = chartMargin(isMobile);
  const margin = {
    ...base,
    bottom: base.bottom + (xLabel ? 16 : 0),
    left: base.left + (yLabel ? 14 : 0),
  };
  const svgHeight = height - (legend ? LEGEND_HEIGHT : 0);
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, svgHeight - margin.top - margin.bottom);

  const allPoints = useMemo(() => series.flatMap((s) => s.points), [series]);
  const resolvedX = useMemo(
    () => fitDomain(allPoints.map((p) => p.x), xDomain),
    [allPoints, xDomain]
  );
  const resolvedY = useMemo(
    () => fitDomain(allPoints.map((p) => p.y), yDomain),
    [allPoints, yDomain]
  );

  const xScale = useMemo(
    () => scaleLinear({ domain: resolvedX, range: [0, innerW] }),
    [resolvedX, innerW]
  );
  const yScale = useMemo(
    () => scaleLinear({ domain: resolvedY, range: [innerH, 0] }),
    [resolvedY, innerH]
  );

  const tip = useTooltip<Hover>();
  const fmtX = xFormat ?? ((v: number) => v.toFixed(2));
  const fmtY = yFormat ?? ((v: number) => v.toFixed(2));

  const svgRef = useRef<SVGSVGElement>(null);
  const draggingRef = useRef(false);
  const dragIndexRef = useRef(0);

  useEffect(() => {
    if (!onDrag) return;
    const toData = (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const scaleX = rect.width ? width / rect.width : 1;
      const scaleY = rect.height ? svgHeight / rect.height : 1;
      const sx = (clientX - rect.left) * scaleX - margin.left;
      const sy = (clientY - rect.top) * scaleY - margin.top;
      onDrag(xScale.invert(sx), yScale.invert(sy), dragIndexRef.current);
    };
    const move = (e: MouseEvent) => {
      if (!draggingRef.current) return;
      e.preventDefault();
      toData(e.clientX, e.clientY);
    };
    const up = () => {
      draggingRef.current = false;
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [onDrag, xScale, yScale, margin.left, margin.top, width, svgHeight]);

  return (
    <>
      <svg ref={svgRef} width={width} height={svgHeight}>
        <Group left={margin.left} top={margin.top}>
          {bands.map((b, i) => {
            const x0 = xScale(b.from);
            const x1 = xScale(b.to);
            return (
              <rect
                key={`band-${i}`}
                x={Math.min(x0, x1)}
                y={0}
                width={Math.abs(x1 - x0)}
                height={innerH}
                fill={b.color ?? CHART_COLORS.grid}
                opacity={b.opacity ?? 0.12}
              />
            );
          })}
          {bands.map((b, i) =>
            b.label ? (
              <text
                key={`band-label-${i}`}
                x={(xScale(b.from) + xScale(b.to)) / 2}
                y={12}
                textAnchor="middle"
                fill={b.labelColor ?? CHART_COLORS.axis}
                fontSize={isMobile ? 10 : 11}
                fontWeight={600}
              >
                {b.label}
              </text>
            ) : null
          )}

          <GridRows scale={yScale} width={innerW} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <GridColumns scale={xScale} height={innerH} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />

          {referenceLines.map((r, i) =>
            r.axis === "x" ? (
              <SvgLine key={`ref-${i}`} from={{ x: xScale(r.value), y: 0 }} to={{ x: xScale(r.value), y: innerH }} stroke={r.color ?? CHART_COLORS.axis} strokeWidth={r.width ?? 1} strokeDasharray={r.dash ?? "4 4"} />
            ) : (
              <SvgLine key={`ref-${i}`} from={{ x: 0, y: yScale(r.value) }} to={{ x: innerW, y: yScale(r.value) }} stroke={r.color ?? CHART_COLORS.axis} strokeWidth={r.width ?? 1} strokeDasharray={r.dash ?? "4 4"} />
            )
          )}

          {series
            .filter((s) => s.line)
            .map((s) => (
              <LinePath
                key={s.key}
                data={s.points}
                x={(p) => xScale(p.x)}
                y={(p) => yScale(p.y)}
                stroke={s.color}
                strokeWidth={s.strokeWidth ?? 2}
                strokeDasharray={s.dash}
                curve={curveLinear}
                shapeRendering="geometricPrecision"
              />
            ))}

          {series
            .filter((s) => !s.line)
            .map((s) =>
              s.points.map((p, i) => (
                <circle
                  key={`${s.key}-${i}`}
                  cx={xScale(p.x)}
                  cy={yScale(p.y)}
                  r={s.radius ?? 5}
                  fill={s.hollow ? "transparent" : p.color ?? s.color}
                  fillOpacity={p.opacity ?? s.opacity ?? 1}
                  stroke={s.hollow ? p.color ?? s.color : CHART_COLORS.tooltipBg}
                  strokeWidth={s.hollow ? 2.5 : s.draggable ? 2 : 1.5}
                  style={{ cursor: s.draggable ? "grab" : "pointer" }}
                  onMouseDown={s.draggable ? () => { draggingRef.current = true; dragIndexRef.current = i; } : undefined}
                  onMouseEnter={() =>
                    tip.showTooltip({
                      tooltipLeft: margin.left + xScale(p.x),
                      tooltipTop: margin.top + yScale(p.y),
                      tooltipData: { point: p, series: s },
                    })
                  }
                  onMouseLeave={tip.hideTooltip}
                />
              ))
            )}

          {annotations.map((a, i) => (
            <text
              key={`ann-${i}`}
              x={xScale(a.x) + (a.dx ?? 0)}
              y={yScale(a.y) + (a.dy ?? 0)}
              textAnchor={a.anchor ?? "start"}
              fill={a.color ?? CHART_COLORS.tooltipText}
              fontSize={a.fontSize ?? (isMobile ? 10 : 12)}
              fontWeight={a.fontWeight ?? 600}
              transform={
                a.rotate
                  ? `rotate(${a.rotate} ${xScale(a.x) + (a.dx ?? 0)} ${yScale(a.y) + (a.dy ?? 0)})`
                  : undefined
              }
              style={{ pointerEvents: "none" }}
            >
              {a.text}
            </text>
          ))}

          <AxisBottom top={innerH} scale={xScale} numTicks={isMobile ? 5 : 8} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickFormat={(v) => fmtX(Number(v))} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: isMobile ? 11 : 12, textAnchor: "middle" })} />
          <AxisLeft scale={yScale} numTicks={7} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickFormat={(v) => fmtY(Number(v))} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: isMobile ? 11 : 12, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })} />

          {xLabel && (
            <text x={innerW / 2} y={innerH + margin.bottom - 2} textAnchor="middle" fill={CHART_COLORS.axis} fontSize={isMobile ? 11 : 12}>
              {xLabel}
            </text>
          )}
          {yLabel && (
            <text transform={`translate(${-margin.left + 12}, ${innerH / 2}) rotate(-90)`} textAnchor="middle" fill={CHART_COLORS.axis} fontSize={isMobile ? 11 : 12}>
              {yLabel}
            </text>
          )}
        </Group>
      </svg>

      {tip.tooltipData && (
        <TooltipWithBounds
          left={tip.tooltipLeft ?? 0}
          top={tip.tooltipTop ?? 0}
          style={{
            position: "absolute",
            background: CHART_COLORS.tooltipBg,
            border: `1px solid ${CHART_COLORS.tooltipBorder}`,
            borderRadius: 8,
            color: CHART_COLORS.tooltipText,
            padding: "8px 10px",
            fontSize: 12,
            pointerEvents: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 999, background: tip.tooltipData.point.color ?? tip.tooltipData.series.color }} />
            <span>{tip.tooltipData.point.label ?? tip.tooltipData.series.label}</span>
          </div>
          <div>x: {fmtX(tip.tooltipData.point.x)}</div>
          <div>y: {fmtY(tip.tooltipData.point.y)}</div>
          {tip.tooltipData.point.tooltipRows && tip.tooltipData.point.tooltipRows.length > 0 && (
            <div style={{ marginTop: 6, paddingTop: 6, borderTop: `1px solid ${CHART_COLORS.tooltipBorder}`, display: "flex", flexDirection: "column", gap: 2 }}>
              {tip.tooltipData.point.tooltipRows.map((row, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {row.color && <span style={{ width: 8, height: 8, borderRadius: 999, background: row.color }} />}
                  <span style={{ flex: 1 }}>{row.label}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>{row.value}</span>
                </div>
              ))}
            </div>
          )}
        </TooltipWithBounds>
      )}
    </>
  );
}
