import { useEffect, useMemo, useRef } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { useTheme } from "../../theme";
import { CHART_COLORS, SERIES_ROLE, chartMargin } from "./chart.theme";
import { cloudLineWidth, cloudOpacity, drawPathCloud, resolveCssColor, valueExtent } from "./pathCloud.draw";
import type { PathCloudProps, PlotFrame } from "./chart.types";

type Props = PathCloudProps & { width: number; height: number };

const LAYER = { position: "absolute", left: 0, top: 0 } as const;
const NO_OVERLAYS: PathCloudProps["overlays"] = [];

export default function PathCloudChartInner({
  width,
  height,
  values,
  pathCount,
  stepCount,
  dx = 1,
  xDomain,
  yDomain,
  visibleSteps = stepCount,
  color = SERIES_ROLE.cloud,
  palette,
  maxOpacity = 1,
  overlays = NO_OVERLAYS,
  layer,
  isMobile = false,
  ariaLabel,
}: Props) {
  const { resolvedTheme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const margin = chartMargin(isMobile);
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);

  const [x0, x1] = xDomain ?? [0, (stepCount - 1) * dx];
  const [y0, y1] = useMemo(
    () => yDomain ?? valueExtent(values, overlays.flatMap((o) => o.points.map((p) => p.y))),
    [yDomain, values, overlays]
  );
  const xScale = useMemo(() => scaleLinear({ domain: [x0, x1], range: [0, innerW] }), [x0, x1, innerW]);
  const yScale = useMemo(() => scaleLinear({ domain: [y0, y1], range: [innerH, 0] }), [y0, y1, innerH]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, innerW, innerH);
    const kx = innerW / (x1 - x0 || 1);
    const ky = innerH / (y1 - y0 || 1);
    drawPathCloud(ctx, {
      values,
      pathCount,
      stepCount,
      visibleSteps,
      xPx: (i) => (i * dx - x0) * kx,
      yPx: (v) => (y1 - v) * ky,
      colors: (palette ?? [color]).map((c) => resolveCssColor(c, canvas)),
      alpha: palette ? 1 : Math.min(maxOpacity, cloudOpacity(pathCount)),
      lineWidth: palette ? 1.6 : cloudLineWidth(pathCount),
    });
  }, [values, pathCount, stepCount, visibleSteps, dx, x0, x1, y0, y1, innerW, innerH, color, palette, maxOpacity, resolvedTheme]);

  const frame: PlotFrame = {
    x: (v) => xScale(v) ?? 0,
    y: (v) => yScale(v) ?? 0,
    xInvert: (px) => xScale.invert(px),
    yInvert: (px) => yScale.invert(px),
    width: innerW,
    height: innerH,
    left: margin.left,
    top: margin.top,
  };

  const dpr = typeof window === "undefined" ? 1 : window.devicePixelRatio || 1;
  const tickProps = { fill: CHART_COLORS.axis, fontSize: isMobile ? 11 : 12 };

  return (
    <div role="img" aria-label={ariaLabel} style={{ position: "relative", width, height }}>
      <svg width={width} height={height} style={LAYER}>
        <Group left={margin.left} top={margin.top}>
          <GridRows scale={yScale} width={innerW} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <GridColumns scale={xScale} height={innerH} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
          <AxisBottom
            top={innerH}
            scale={xScale}
            numTicks={isMobile ? 5 : 8}
            stroke={CHART_COLORS.axis}
            tickStroke={CHART_COLORS.axis}
            tickLabelProps={() => ({ ...tickProps, textAnchor: "middle" })}
          />
          <AxisLeft
            scale={yScale}
            numTicks={7}
            stroke={CHART_COLORS.axis}
            tickStroke={CHART_COLORS.axis}
            tickLabelProps={() => ({ ...tickProps, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })}
          />
        </Group>
      </svg>
      <canvas
        ref={canvasRef}
        width={Math.round(innerW * dpr)}
        height={Math.round(innerH * dpr)}
        style={{ ...LAYER, left: margin.left, top: margin.top, width: innerW, height: innerH }}
      />
      <svg width={width} height={height} style={{ ...LAYER, pointerEvents: "none" }}>
        <Group left={margin.left} top={margin.top}>
          {overlays.map((o) => (
            <LinePath
              key={o.key}
              data={o.points}
              x={(p) => xScale(p.x)}
              y={(p) => yScale(p.y)}
              stroke={o.color}
              strokeWidth={o.strokeWidth ?? 2}
              strokeDasharray={o.dash}
            />
          ))}
          {layer?.(frame)}
        </Group>
      </svg>
    </div>
  );
}
