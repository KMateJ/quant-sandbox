import { useMemo } from "react";
import { AxisBottom } from "@visx/axis";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear } from "@visx/scale";
import { CHART_COLORS, chartMargin } from "../../../../../components/charts/chart.theme";
import { useI18n } from "../../../../../i18n";
import { BETTING_SETUP, histogram, type CrowdResult } from "../../../guide.interactive.martingaleBetting.math";

type InnerProps = { crowd: CrowdResult; width: number; height: number };

const tickStyle = { fill: CHART_COLORS.axis, fontSize: 11 };

function Inner({ crowd, width, height }: InnerProps) {
  const { t } = useI18n();
  const narrow = width < 480;
  const margin = { ...chartMargin(narrow), left: 12, right: 12, top: 18 };
  const w = Math.max(0, width - margin.left - margin.right);
  const h = Math.max(0, height - margin.top - margin.bottom);
  const hist = useMemo(() => histogram(crowd.finals), [crowd]);
  const hiX = hist.lo + hist.width * hist.counts.length;
  const x = scaleLinear({ domain: [Math.min(hist.lo, BETTING_SETUP.start), Math.max(hiX, BETTING_SETUP.start)], range: [0, w] });
  const y = scaleLinear({ domain: [0, Math.max(...hist.counts) * 1.1], range: [h, 0] });
  const meanX = x(crowd.mean);
  const startX = x(BETTING_SETUP.start);

  return (
    <svg width={width} height={height}>
      <Group left={margin.left} top={margin.top}>
        {hist.counts.map((count, i) => {
          const left = hist.lo + i * hist.width;
          const top = y(count);
          return (
            <rect key={i} className={left + hist.width <= BETTING_SETUP.start ? "ixmg-bar behind" : "ixmg-bar"}
              x={x(left) + 0.5} y={top} width={Math.max(0, x(left + hist.width) - x(left) - 1)} height={h - top} />
          );
        })}
        <line className="ixmg-start" x1={startX} x2={startX} y1={-8} y2={h} />
        <line className="ixmg-mean" x1={meanX} x2={meanX} y1={-8} y2={h} />
        <text className="ixmg-note ixmg-note--mean" x={meanX + 4} y={-8}>{t("ixMgMean")}</text>
        <AxisBottom top={h} scale={x} numTicks={narrow ? 4 : 7} stroke={CHART_COLORS.axis} tickStroke={CHART_COLORS.axis} tickLabelProps={() => ({ ...tickStyle, textAnchor: "middle" })} />
      </Group>
    </svg>
  );
}

/// Histogram of final wealth across simulated players; bars that ended behind the start are muted.
export default function MartingaleBettingHistogram({ crowd }: { crowd: CrowdResult }) {
  return (
    <ParentSize>
      {({ width, height }) => (width > 0 && height > 0 ? <Inner crowd={crowd} width={width} height={height} /> : null)}
    </ParentSize>
  );
}
