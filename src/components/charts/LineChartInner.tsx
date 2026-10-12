import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath, Area, Line as SvgLine } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { LinearGradient } from "@visx/gradient";
import { curveMonotoneX } from "@visx/curve";
import { extent } from "@visx/vendor/d3-array";
import { CHART_COLORS, LEGEND_HEIGHT, chartMargin } from "./chart.theme";
import { useChartTooltip } from "./useChartTooltip";
import ChartTooltip from "./ChartTooltip";
import type { ChartDatum, LineChartProps } from "./chart.types";

type Props = LineChartProps & { width: number; height: number };

function fallbackDomain(
  values: number[],
  provided?: [number, number]
): [number, number] {
  if (provided) return provided;
  const [lo, hi] = extent(values);
  if (lo == null || hi == null) return [0, 1];
  return lo === hi ? [lo - 1, hi + 1] : [lo, hi];
}

export default function LineChartInner({
  width,
  height,
  data,
  xKey,
  series,
  xDomain,
  yDomain,
  referenceLines = [],
  isMobile = false,
  legend = true,
  tooltipLabel,
  valueFormat,
}: Props) {
  const margin = chartMargin(isMobile);
  const svgHeight = height - (legend ? LEGEND_HEIGHT : 0);
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, svgHeight - margin.top - margin.bottom);

  const resolvedX = useMemo(
    () => fallbackDomain(data.map((d) => Number(d[xKey])), xDomain),
    [data, xKey, xDomain]
  );
  const resolvedY = useMemo(() => {
    if (yDomain) return yDomain;
    const values: number[] = [];
    for (const d of data) {
      for (const s of series) {
        const v = d[s.key];
        if (typeof v === "number") values.push(v);
      }
    }
    return fallbackDomain(values);
  }, [data, series, yDomain]);

  const xScale = useMemo(
    () => scaleLinear({ domain: resolvedX, range: [0, innerW] }),
    [resolvedX, innerW]
  );
  const yScale = useMemo(
    () => scaleLinear({ domain: resolvedY, range: [innerH, 0] }),
    [resolvedY, innerH]
  );

  const tip = useChartTooltip(data, xKey, xScale, margin.left);
  const px = (d: ChartDatum) => xScale(Number(d[xKey])) ?? 0;
  const pointsFor = (key: string) =>
    data.filter((d) => typeof d[key] === "number");

  return (
    <>
      <svg width={width} height={svgHeight}>
        {series
          .filter((s) => s.area)
          .map((s) => (
            <LinearGradient
              key={`grad-${s.key}`}
              id={`area-${s.key}`}
              from={s.areaColor ?? s.color}
              to={s.areaColor ?? s.color}
              fromOpacity={0.22}
              toOpacity={0.02}
              vertical
            />
          ))}

        <Group left={margin.left} top={margin.top}>
          <GridRows scale={yScale} width={innerW} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <GridColumns scale={xScale} height={innerH} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />

          {referenceLines.map((r, i) =>
            r.axis === "x" ? (
              <SvgLine
                key={`ref-${i}`}
                from={{ x: xScale(r.value), y: 0 }}
                to={{ x: xScale(r.value), y: innerH }}
                stroke={r.color ?? CHART_COLORS.axis}
                strokeWidth={r.width ?? 1}
                strokeDasharray={r.dash ?? "4 4"}
              />
            ) : (
              <SvgLine
                key={`ref-${i}`}
                from={{ x: 0, y: yScale(r.value) }}
                to={{ x: innerW, y: yScale(r.value) }}
                stroke={r.color ?? CHART_COLORS.axis}
                strokeWidth={r.width ?? 1}
                strokeDasharray={r.dash ?? "4 4"}
              />
            )
          )}

          {series.map((s) => (
            <Group key={s.key}>
              {s.area && (
                <Area
                  data={pointsFor(s.key)}
                  x={px}
                  y0={() => yScale(0)}
                  y1={(d) => yScale(Number(d[s.key])) ?? 0}
                  curve={curveMonotoneX}
                  fill={`url(#area-${s.key})`}
                  stroke="none"
                />
              )}
              <LinePath
                data={pointsFor(s.key)}
                x={px}
                y={(d) => yScale(Number(d[s.key])) ?? 0}
                stroke={s.color}
                strokeWidth={s.strokeWidth ?? 2}
                strokeDasharray={s.dash}
                curve={curveMonotoneX}
                shapeRendering="geometricPrecision"
              />
            </Group>
          ))}

          <AxisBottom
            top={innerH}
            scale={xScale}
            numTicks={isMobile ? 5 : 8}
            stroke={CHART_COLORS.axis}
            tickStroke={CHART_COLORS.axis}
            tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: isMobile ? 11 : 12, textAnchor: "middle" })}
          />
          <AxisLeft
            scale={yScale}
            numTicks={7}
            stroke={CHART_COLORS.axis}
            tickStroke={CHART_COLORS.axis}
            tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: isMobile ? 11 : 12, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })}
          />

          {tip.tooltipData && (
            <SvgLine
              from={{ x: xScale(Number(tip.tooltipData[xKey])), y: 0 }}
              to={{ x: xScale(Number(tip.tooltipData[xKey])), y: innerH }}
              stroke={CHART_COLORS.axis}
              strokeWidth={1}
              strokeDasharray="2 2"
            />
          )}

          <rect
            width={innerW}
            height={innerH}
            fill="transparent"
            onMouseMove={tip.handleMove}
            onMouseLeave={tip.hideTooltip}
            onTouchMove={tip.handleMove}
            onTouchStart={tip.handleMove}
            onTouchEnd={tip.hideTooltip}
          />
        </Group>
      </svg>

      {tip.tooltipData && (
        <ChartTooltip
          left={(tip.tooltipLeft ?? 0) + margin.left}
          top={tip.tooltipTop ?? 0}
          datum={tip.tooltipData}
          xKey={xKey}
          series={series}
          label={tooltipLabel}
          valueFormat={valueFormat}
        />
      )}
    </>
  );
}
