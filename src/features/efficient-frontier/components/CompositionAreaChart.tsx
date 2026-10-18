import { useMemo, type PointerEvent } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { Area, Line as SvgLine } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { CHART_COLORS, chartMargin } from "../../../components/charts/chart.theme";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import type { Asset } from "../../portfolio-lab/portfolioLab.types";
import { indexAtFraction } from "../frontierBrush.math";
import { useBoxSize } from "../useBoxSize";
import { useBrushHandlers, type FrontierBrush } from "../useFrontierBrush";
import { SELECTED_COLOR, pointReadout } from "./frontierChart.style";

type Props = {
  assets: Asset[];
  brush: FrontierBrush;
  className?: string;
};

const pct = (v: number) => `${(v * 100).toFixed(0)}%`;

/// Stacked-area chart of optimal weights along the efficient branch, brushed with the frontier:
/// hover previews a point, press/drag (or arrow keys) moves the selection.
export default function CompositionAreaChart({ assets, brush, className = "chart-wrap" }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { ref, width, height } = useBoxSize();
  const { branch } = brush;
  // The hit rect spans exactly the plot, so the pointer's fraction across it maps straight onto the return axis.
  const handlers = useBrushHandlers(brush, (e: PointerEvent<Element>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return indexAtFraction(branch, rect.width > 0 ? (e.clientX - rect.left) / rect.width : 0);
  });

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

  if (branch.length < 2) return <div className={className} ref={ref} />;
  let yLo = 0;
  let yHi = 1;
  for (const s of stacked)
    for (const b of s.bands) {
      yLo = Math.min(yLo, b.y0);
      yHi = Math.max(yHi, b.y1);
    }

  // Extra bottom room keeps the axis title clear of the tick labels.
  const base = chartMargin(isMobile);
  const margin = { ...base, bottom: base.bottom + 14 };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const x = scaleLinear({ domain: [branch[0].ret, branch[branch.length - 1].ret], range: [0, innerW] });
  const y = scaleLinear({ domain: [yLo, yHi], range: [innerH, 0] });
  const selX = x(branch[brush.selectedIndex].ret);
  const hoverX = brush.hoverIndex != null ? x(branch[brush.hoverIndex].ret) : null;
  const tick = { fill: CHART_COLORS.axis, fontSize: isMobile ? 10 : 11 };

  return (
    <div className={className} ref={ref}>
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
            <SvgLine from={{ x: selX, y: 0 }} to={{ x: selX, y: innerH }} stroke={SELECTED_COLOR} strokeWidth={2} strokeDasharray="4 3" />
            {hoverX != null && (
              <SvgLine className="opt-comp-hover" from={{ x: hoverX, y: 0 }} to={{ x: hoverX, y: innerH }} stroke={CHART_COLORS.tooltipText} strokeWidth={1.5} />
            )}
            <AxisBottom top={innerH} scale={x} numTicks={isMobile ? 4 : 7} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickFormat={(v) => pct(Number(v))} tickLabelProps={() => ({ ...tick, textAnchor: "middle" })} />
            <AxisLeft scale={y} numTicks={height < 240 ? 3 : 5} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickFormat={(v) => pct(Number(v))} tickLabelProps={() => ({ ...tick, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })} />
            <text x={innerW / 2} y={innerH + margin.bottom - 2} textAnchor="middle" fill={CHART_COLORS.axis} fontSize={isMobile ? 11 : 12}>{t("optCompReturnAxis")}</text>
            <rect
              className="opt-brush"
              width={innerW}
              height={innerH}
              fill="transparent"
              style={{ cursor: "pointer", touchAction: "pan-y" }}
              tabIndex={0}
              role="slider"
              aria-label={t("optBrushAria")}
              aria-valuemin={0}
              aria-valuemax={branch.length - 1}
              aria-valuenow={brush.selectedIndex}
              aria-valuetext={pointReadout(t, branch[brush.selectedIndex])}
              {...handlers}
            />
          </Group>
        </svg>
      )}
    </div>
  );
}
