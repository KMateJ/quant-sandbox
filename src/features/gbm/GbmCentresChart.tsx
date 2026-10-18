import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { AxisBottom } from "@visx/axis";
import { CHART_COLORS } from "../../components/charts/chart.theme";

export type CentreMarker = { key: string; value: number; label: string; color: string; dash?: string };

type Props = {
  pdf: (x: number) => number;
  xMax: number;
  markers: CentreMarker[];
  /// Sample statistics, drawn as small triangles under the axis.
  samples: CentreMarker[];
  sigma: number;
  sigmaRange: [number, number];
  onSigma: (sigma: number) => void;
  sigmaLabel: string;
  ariaLabel: string;
};

const M = { top: 44, right: 16, bottom: 74, left: 16 };
const TRACK = 40;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

function Inner({ width, height, pdf, xMax, markers, samples, sigma, sigmaRange, onSigma, sigmaLabel, ariaLabel }: Props & { width: number; height: number }) {
  const w = Math.max(0, width - M.left - M.right);
  const h = Math.max(0, height - M.top - M.bottom);
  const dragging = useRef(false);
  const [focused, setFocused] = useState(false);
  const x = scaleLinear({ domain: [0, xMax], range: [0, w] });
  const curve = Array.from({ length: 241 }, (_, i) => ({ x: (xMax * i) / 240, y: pdf((xMax * i) / 240) }));
  const y = scaleLinear({ domain: [0, Math.max(1e-9, ...curve.map((p) => p.y)) * 1.1], range: [h, 0] });
  const s = scaleLinear({ domain: sigmaRange, range: [0, w] });
  const ty = h + TRACK;
  const set = (v: number) => onSigma(Number(clamp(v, sigmaRange[0], sigmaRange[1]).toFixed(2)));
  const fromPointer = (e: PointerEvent<SVGElement>) => {
    const box = (e.currentTarget.ownerSVGElement ?? (e.currentTarget as SVGSVGElement)).getBoundingClientRect();
    set(s.invert(e.clientX - box.left - M.left));
  };
  const onKey = (e: KeyboardEvent<SVGGElement>) => {
    const d: Record<string, number> = { ArrowLeft: -0.01, ArrowDown: -0.01, ArrowRight: 0.01, ArrowUp: 0.01, PageDown: -0.05, PageUp: 0.05 };
    if (e.key === "Home") set(sigmaRange[0]);
    else if (e.key === "End") set(sigmaRange[1]);
    else if (d[e.key]) set(sigma + d[e.key]);
    else return;
    e.preventDefault();
  };

  return (
    <svg width={width} height={height} role="img" aria-label={ariaLabel} style={{ userSelect: "none" }}>
      <g transform={`translate(${M.left} ${M.top})`}>
        <LinePath data={curve} x={(p) => x(p.x)} y={(p) => y(p.y)} stroke="var(--primary)" strokeWidth={2} fill="none" />
        {markers.map((m, i) => (
          <g key={m.key}>
            <line x1={x(m.value)} x2={x(m.value)} y1={0} y2={h} stroke={m.color} strokeWidth={2} strokeDasharray={m.dash} />
            <text x={x(m.value)} y={-6 - i * 13} textAnchor="middle" fontSize={11} fontWeight={600} fill={m.color}>{m.label}</text>
          </g>
        ))}
        {samples.map((m) => (
          <path key={m.key} d={`M${x(m.value)} ${h + 2}l-5 8h10z`} fill={m.color} opacity={0.8}><title>{m.label}</title></path>
        ))}
        <AxisBottom top={h} scale={x} numTicks={width < 480 ? 4 : 7} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis}
          tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 11, textAnchor: "middle" })} />
        <g role="slider" tabIndex={0} aria-label={sigmaLabel} aria-valuemin={sigmaRange[0]} aria-valuemax={sigmaRange[1]} aria-valuenow={sigma}
          aria-valuetext={`σ = ${sigma.toFixed(2)}`} onKeyDown={onKey} style={{ cursor: "ew-resize", touchAction: "none", outline: "none" }} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); dragging.current = true; fromPointer(e); }}
          onPointerMove={(e) => dragging.current && fromPointer(e)} onPointerUp={() => (dragging.current = false)}>
          <rect x={-8} y={ty - 14} width={w + 16} height={28} fill="transparent" />
          <line x1={0} x2={w} y1={ty} y2={ty} stroke="var(--border)" strokeWidth={4} strokeLinecap="round" />
          <line x1={0} x2={s(sigma)} y1={ty} y2={ty} stroke="var(--primary)" strokeWidth={4} strokeLinecap="round" />
          {focused && <circle cx={s(sigma)} cy={ty} r={14} fill="none" stroke="var(--primary)" strokeOpacity={0.45} strokeWidth={3} />}
          <circle cx={s(sigma)} cy={ty} r={9} fill="var(--surface)" stroke="var(--primary)" strokeWidth={2.5} />
          <text x={s(sigma)} y={ty + 26} textAnchor="middle" fontSize={11} fill="var(--text)">{`${sigmaLabel} ${sigma.toFixed(2)}`}</text>
        </g>
      </g>
    </svg>
  );
}

/// Log-normal density of S_T with labelled centre markers and a draggable σ track underneath.
export default function GbmCentresChart(props: Props) {
  return (
    <div style={{ height: 330 }}>
      <ParentSize>{({ width, height }) => (width > 0 ? <Inner {...props} width={width} height={height} /> : null)}</ParentSize>
    </div>
  );
}
