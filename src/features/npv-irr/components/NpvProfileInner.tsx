import { useMemo, useRef, useState, type PointerEvent } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { LinePath, Area, Line as SvgLine, Bar } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { curveMonotoneX } from "@visx/curve";
import { CHART_COLORS, chartMargin } from "../../../components/charts/chart.theme";
import type { NpvProfileChartProps } from "./NpvProfileChart";
import type { NpvPoint } from "../npvIrr.types";
import NpvGuessMarker from "./NpvGuessMarker";
import { NpvHoverReadout, NpvRateMarker } from "./NpvRateMarker";

type Props = NpvProfileChartProps & { width: number; height: number };

export default function NpvProfileInner({
  width,
  height,
  profile,
  rate,
  onRateChange,
  irr,
  npvAtRate,
  rateMax,
  overlays = [],
  showIrr,
  showPiRegion,
  isMobile = false,
  valueFormat,
  rateFormat,
  predict,
}: Props) {
  const margin = chartMargin(isMobile);
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const dragging = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [hoverRate, setHoverRate] = useState<number | null>(null);

  const allNpvs = useMemo(() => {
    const vals = profile.map((p) => p.npv);
    overlays.forEach((o) => o.profile.forEach((p) => vals.push(p.npv)));
    vals.push(0);
    return vals;
  }, [profile, overlays]);

  const yLo = Math.min(...allNpvs) * 1.08;
  const yHi = Math.max(...allNpvs) * 1.08;
  const xScale = useMemo(() => scaleLinear({ domain: [0, rateMax], range: [0, innerW] }), [rateMax, innerW]);
  const yScale = useMemo(() => scaleLinear({ domain: [yLo, yHi], range: [innerH, 0] }), [yLo, yHi, innerH]);

  const zeroFrac = Math.min(1, Math.max(0, yScale(0) / innerH));
  const npvAt = (r: number) => {
    const i = Math.min(profile.length - 1, Math.max(0, Math.round((r / rateMax) * (profile.length - 1))));
    return profile[i]?.npv ?? 0;
  };

  const rateFromEvent = (event: PointerEvent<SVGRectElement>): number => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    return Math.min(rateMax, Math.max(0, xScale.invert(x)));
  };
  const onDown = (event: PointerEvent<SVGRectElement>) => {
    dragging.current = true;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    setRate(rateFromEvent(event));
  };
  const onMove = (event: PointerEvent<SVGRectElement>) => {
    const r = rateFromEvent(event);
    setHoverRate(r);
    if (dragging.current) setRate(r);
  };
  const onUp = () => { dragging.current = false; setIsDragging(false); };
  // In predict mode the pointer places the guess; otherwise it moves the discount rate.
  const setRate = (r: number) => (predict ? predict.onGuess(Number(r.toFixed(4))) : onRateChange(Number(r.toFixed(4))));

  const markerX = xScale(rate);
  const markerY = yScale(npvAtRate);
  const hoverX = hoverRate != null ? xScale(hoverRate) : null;
  const showIrrLine = showIrr && Number.isFinite(irr) && irr >= 0 && irr <= rateMax;

  const line = (pts: NpvPoint[]) => pts;

  return (
    <svg width={width} height={height} style={{ touchAction: "none" }}>
      <defs>
        <linearGradient id="npv-profile-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#22c55e" stopOpacity="0.26" />
          <stop offset={zeroFrac} stopColor="#22c55e" stopOpacity="0.05" />
          <stop offset={zeroFrac} stopColor="#ef4444" stopOpacity="0.05" />
          <stop offset="1" stopColor="#ef4444" stopOpacity="0.26" />
        </linearGradient>
      </defs>
      <Group left={margin.left} top={margin.top}>
        {showPiRegion && showIrrLine && (
          <Bar x={0} y={0} width={xScale(irr)} height={innerH} fill="#22c55e" opacity={0.08} />
        )}
        <GridRows scale={yScale} width={innerW} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
        <GridColumns scale={xScale} height={innerH} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />

        <Area
          data={line(profile)}
          x={(d) => xScale(d.rate)}
          y0={() => yScale(0)}
          y1={(d) => yScale(d.npv)}
          curve={curveMonotoneX}
          fill="url(#npv-profile-area)"
        />

        <SvgLine from={{ x: 0, y: yScale(0) }} to={{ x: innerW, y: yScale(0) }} stroke="#64748b" strokeWidth={1} />

        {overlays.map((o) => (
          <LinePath
            key={o.name}
            data={line(o.profile)}
            x={(d) => xScale(d.rate)}
            y={(d) => yScale(d.npv)}
            stroke={o.color}
            strokeWidth={1.4}
            strokeOpacity={0.7}
            strokeDasharray="4 3"
            curve={curveMonotoneX}
          />
        ))}

        <LinePath
          data={line(profile)}
          x={(d) => xScale(d.rate)}
          y={(d) => yScale(d.npv)}
          stroke="#38bdf8"
          strokeWidth={2.5}
          curve={curveMonotoneX}
        />

        {showIrrLine && (
          <>
            <SvgLine from={{ x: xScale(irr), y: 0 }} to={{ x: xScale(irr), y: innerH }} stroke="#f97316" strokeWidth={1.5} strokeDasharray="2 4" />
            <text x={xScale(irr) + 4} y={14} fill="#f97316" fontSize={11} fontWeight={600}>
              IRR {rateFormat(irr)}
            </text>
          </>
        )}

        {predict && predict.guess !== null && (
          <NpvGuessMarker x={xScale(predict.guess)} height={innerH} label={`${predict.label} ${rateFormat(predict.guess)}`} />
        )}

        {hoverX != null && !isDragging && (
          <SvgLine from={{ x: hoverX, y: 0 }} to={{ x: hoverX, y: innerH }} stroke={CHART_COLORS.axis} strokeWidth={1} strokeDasharray="2 2" />
        )}

        <NpvRateMarker x={markerX} y={markerY} plotWidth={innerW} plotHeight={innerH} npv={npvAtRate} valueFormat={valueFormat} />
        {hoverRate != null && !isDragging && (
          <NpvHoverReadout x={hoverX ?? 0} plotWidth={innerW} rate={rateFormat(hoverRate)} npv={npvAt(hoverRate)} valueFormat={valueFormat} />
        )}

        <AxisBottom top={innerH} scale={xScale} numTicks={isMobile ? 5 : 8} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickFormat={(v) => rateFormat(Number(v))} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: isMobile ? 10 : 11, textAnchor: "middle" })} />
        <AxisLeft scale={yScale} numTicks={6} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: isMobile ? 10 : 11, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })} />

        <rect
          width={innerW}
          height={innerH}
          fill="transparent"
          style={{ cursor: "ew-resize" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={() => setHoverRate(null)}
        />
      </Group>
    </svg>
  );
}
