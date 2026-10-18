import { useId, useMemo, useRef, useState } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath, Line as SvgLine } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { curveLinear } from "@visx/curve";
import { useTooltip } from "@visx/tooltip";
import { extent } from "@visx/vendor/d3-array";
import { CHART_COLORS, LEGEND_HEIGHT, chartMargin } from "./chart.theme";
import type { PlotFrame, ScatterChartProps, ScatterPoint, ScatterSeries } from "./chart.types";
import { useScatterDrag } from "./useScatterDrag";
import ScatterTooltip from "./ScatterTooltip";

type Props = ScatterChartProps & { width: number; height: number; legendHeight?: number };

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
  legendHeight = LEGEND_HEIGHT,
  xFormat,
  yFormat,
  xLabel,
  yLabel,
  onDrag,
  onDragStart,
  onDragEnd,
  onSelectPoint,
  onPlotClick,
  layer,
  xTickValues,
  yNumTicks = 7,
}: Props) {
  const base = chartMargin(isMobile);
  const margin = {
    ...base,
    bottom: base.bottom + (xLabel ? 16 : 0),
    left: base.left + (yLabel ? 14 : 0),
  };
  const svgHeight = height - (legend ? legendHeight : 0);
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

  // While dragging a marker, hold the axis domains fixed so the scale does not
  // jerk as the dragged values feed back into the domain bounds.
  const [frozen, setFrozen] = useState<{ x: [number, number]; y: [number, number] } | null>(null);
  const activeX = frozen?.x ?? resolvedX;
  const activeY = frozen?.y ?? resolvedY;

  const xScale = useMemo(
    () => scaleLinear({ domain: activeX, range: [0, innerW] }),
    [activeX, innerW]
  );
  const yScale = useMemo(
    () => scaleLinear({ domain: activeY, range: [innerH, 0] }),
    [activeY, innerH]
  );

  const tip = useTooltip<Hover>();
  const fmtX = xFormat ?? ((v: number) => v.toFixed(2));
  const fmtY = yFormat ?? ((v: number) => v.toFixed(2));

  const svgRef = useRef<SVGSVGElement>(null);
  const clipId = `clip-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const toData = (event: { clientX: number; clientY: number }): [number, number] | null => {
    const svg = svgRef.current;
    const matrix = svg?.getScreenCTM();
    if (!svg || !matrix) return null;
    const screenPoint = svg.createSVGPoint();
    screenPoint.x = event.clientX;
    screenPoint.y = event.clientY;
    const point = screenPoint.matrixTransform(matrix.inverse());
    return [xScale.invert(point.x - margin.left), yScale.invert(point.y - margin.top)];
  };
  const drag = useScatterDrag({
    svgRef, onDrag,
    onDragStart: (index, seriesKey) => {
      setFrozen({ x: resolvedX, y: resolvedY });
      onDragStart?.(index, seriesKey);
    },
    onDragEnd: () => {
      setFrozen(null);
      onDragEnd?.();
    },
    toData,
  });

  return (
    <>
      <svg ref={svgRef} width={width} height={svgHeight} {...drag.handlers}>
        <Group left={margin.left} top={margin.top}>
          <clipPath id={clipId}>
            <rect width={innerW} height={innerH} />
          </clipPath>
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

          <GridRows scale={yScale} numTicks={yNumTicks} width={innerW} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <GridColumns scale={xScale} height={innerH} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />

          {onPlotClick && (
            <rect
              width={innerW}
              height={innerH}
              fill="transparent"
              style={{ cursor: "crosshair" }}
              onClick={(event) => {
                const point = toData(event);
                if (point) onPlotClick(point[0], point[1]);
              }}
            />
          )}

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
                opacity={s.opacity}
                curve={curveLinear}
                shapeRendering="geometricPrecision"
                pointerEvents="none"
                clipPath={`url(#${clipId})`}
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
                  strokeWidth={s.hollow ? 2.5 : s.draggable ? 2 : s.outline === false ? 0 : 1.5}
                  style={{ cursor: s.draggable ? "grab" : "pointer", touchAction: s.draggable ? "none" : undefined }}
                  onPointerDown={s.draggable ? (event) => drag.start(event, i, s.key) : undefined}
                  onClick={() => onSelectPoint?.(i, s.key)}
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

          <AxisBottom top={innerH} scale={xScale} tickValues={xTickValues} numTicks={isMobile ? 5 : 8} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickFormat={(v) => fmtX(Number(v))} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: isMobile ? 11 : 12, textAnchor: "middle" })} />
          <AxisLeft scale={yScale} numTicks={yNumTicks} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickFormat={(v) => fmtY(Number(v))} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: isMobile ? 11 : 12, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })} />

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
          {layer?.({
            x: (v) => xScale(v) ?? 0,
            y: (v) => yScale(v) ?? 0,
            xInvert: (px) => xScale.invert(px),
            yInvert: (px) => yScale.invert(px),
            width: innerW,
            height: innerH,
            left: margin.left,
            top: margin.top,
          } satisfies PlotFrame)}
        </Group>
      </svg>

      {tip.tooltipData && (
        <ScatterTooltip
          left={tip.tooltipLeft ?? 0}
          top={tip.tooltipTop ?? 0}
          point={tip.tooltipData.point}
          series={tip.tooltipData.series}
          fmtX={fmtX}
          fmtY={fmtY}
        />
      )}
    </>
  );
}
