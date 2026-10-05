import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Area, Line as SvgLine } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { CHART_COLORS, chartMargin } from "../../../components/charts/chart.theme";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import type { Asset } from "../../portfolio-lab/portfolioLab.types";
import type { OptPoint } from "../portfolioOptimization.types";

type Props = {
  branch: OptPoint[];
  assets: Asset[];
  selectedReturn: number;
  onSelect: (ret: number) => void;
};

const pct = (v: number) => `${(v * 100).toFixed(0)}%`;

/// Measures a container synchronously (ref-based) so the SVG renders on first
/// paint, without waiting for a ResizeObserver callback that can lag under CSS zoom.
function useBoxSize() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () =>
      setSize((prev) => {
        const width = el.clientWidth;
        const height = el.clientHeight;
        return prev.width === width && prev.height === height ? prev : { width, height };
      });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return { ref, ...size };
}

/// Stacked-area chart of optimal weights along the efficient branch.
/// Hovering/clicking selects the matching frontier point (linked to the scatter).
export default function CompositionAreaChart({ branch, assets, selectedReturn, onSelect }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [hover, setHover] = useState<number | null>(null);
  const { ref, width, height } = useBoxSize();

  const stacked = useMemo(
    () =>
      branch.map((p) => {
        let cumPos = 0;
        let cumNeg = 0;
        const bands = p.weights.map((w) => {
          if (w >= 0) {
            const y0 = cumPos;
            cumPos += w;
            return { y0, y1: cumPos };
          }
          const y1 = cumNeg;
          cumNeg += w;
          return { y0: cumNeg, y1 };
        });
        return { ret: p.ret, bands };
      }),
    [branch]
  );

  if (branch.length < 2) return <div className="chart-wrap" ref={ref} />;
  const retLo = branch[0].ret;
  const retHi = branch[branch.length - 1].ret;
  let yLo = 0;
  let yHi = 1;
  for (const s of stacked)
    for (const b of s.bands) {
      yLo = Math.min(yLo, b.y0);
      yHi = Math.max(yHi, b.y1);
    }

  const margin = chartMargin(isMobile);
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const x = scaleLinear({ domain: [retLo, retHi], range: [0, innerW] });
  const y = scaleLinear({ domain: [yLo, yHi], range: [innerH, 0] });
  const nearest = (clientX: number, rect: DOMRect) => {
    const rx = x.invert(((clientX - rect.left) / rect.width) * width - margin.left);
    let best = 0;
    for (let i = 1; i < branch.length; i++)
      if (Math.abs(branch[i].ret - rx) < Math.abs(branch[best].ret - rx)) best = i;
    return best;
  };
  const hoverRet = hover != null ? branch[hover].ret : null;

  return (
    <div className="chart-wrap" ref={ref}>
      {width > 0 && height > 0 && (
        <svg width={width} height={height}>
          <Group left={margin.left} top={margin.top}>
            {assets.map((a, ai) => (
              <Area
                key={a.id}
                data={stacked}
                x={(d) => x(d.ret)}
                y0={(d) => y(d.bands[ai].y0)}
                y1={(d) => y(d.bands[ai].y1)}
                fill={a.color}
                fillOpacity={0.82}
                stroke={CHART_COLORS.tooltipBg}
                strokeWidth={0.4}
              />
            ))}
            <SvgLine from={{ x: 0, y: y(0) }} to={{ x: innerW, y: y(0) }} stroke={CHART_COLORS.axis} strokeWidth={1} />
            <SvgLine from={{ x: x(selectedReturn), y: 0 }} to={{ x: x(selectedReturn), y: innerH }} stroke="#f97316" strokeWidth={1.5} strokeDasharray="4 3" />
            {hoverRet != null && (
              <SvgLine from={{ x: x(hoverRet), y: 0 }} to={{ x: x(hoverRet), y: innerH }} stroke={CHART_COLORS.axis} strokeWidth={1} strokeDasharray="2 2" />
            )}
            <AxisBottom top={innerH} scale={x} numTicks={isMobile ? 4 : 7} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickFormat={(v) => pct(Number(v))} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: isMobile ? 10 : 11, textAnchor: "middle" })} />
            <AxisLeft scale={y} numTicks={5} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickFormat={(v) => pct(Number(v))} tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: isMobile ? 10 : 11, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })} />
            <text x={innerW / 2} y={innerH + margin.bottom - 2} textAnchor="middle" fill={CHART_COLORS.axis} fontSize={isMobile ? 11 : 12}>{t("optCompReturnAxis")}</text>
            <rect
              width={innerW}
              height={innerH}
              fill="transparent"
              style={{ cursor: "pointer" }}
              onMouseMove={(e) => setHover(nearest(e.clientX, e.currentTarget.getBoundingClientRect()))}
              onMouseLeave={() => setHover(null)}
              onClick={(e) => onSelect(branch[nearest(e.clientX, e.currentTarget.getBoundingClientRect())].ret)}
            />
          </Group>
        </svg>
      )}
    </div>
  );
}
