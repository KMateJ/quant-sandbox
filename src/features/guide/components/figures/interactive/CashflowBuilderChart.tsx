import { useMemo } from "react";
import { AxisLeft } from "@visx/axis";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { scaleBand, scaleLinear } from "@visx/scale";
import { CHART_COLORS, chartMargin } from "../../../../../components/charts/chart.theme";
import { useI18n } from "../../../../../i18n";
import { CASHFLOW_MAX, CASHFLOW_MIN } from "../../../guide.interactive.cashflowBuilder.math";
import CashflowBuilderBar from "./CashflowBuilderBar";

type Props = {
  width: number;
  height: number;
  flows: number[];
  pvs: number[];
  onChange: (year: number, value: number) => void;
};

/// Bars of the cash flows around a zero line, on a fixed value axis so dragging stays stable.
export default function CashflowBuilderChart({ width, height, flows, pvs, onChange }: Props) {
  const { t } = useI18n();
  const margin = chartMargin(width < 480);
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const n = flows.length;
  const years = useMemo(() => Array.from({ length: n }, (_, i) => i), [n]);
  const x = useMemo(() => scaleBand({ domain: years, range: [0, innerW], padding: 0.22 }), [years, innerW]);
  // Headroom beyond the drag range keeps the value labels of extreme bars inside the plot.
  const y = useMemo(() => scaleLinear({ domain: [CASHFLOW_MIN - 20, CASHFLOW_MAX + 20], range: [innerH, 0] }), [innerH]);
  const zeroY = y(0);

  return (
    <svg width={width} height={height} className="ixcf-svg">
      <Group left={margin.left} top={margin.top}>
        <GridRows scale={y} width={innerW} numTicks={6} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
        <line className="ixcf-zero" x1={0} x2={innerW} y1={zeroY} y2={zeroY} />
        {years.map((year) => (
          <CashflowBuilderBar
            key={year}
            x={x(year) ?? 0}
            width={x.bandwidth()}
            plotHeight={innerH}
            zeroY={zeroY}
            y={y}
            valueFromY={(py) => y.invert(py)}
            flow={flows[year]}
            pv={pvs[year]}
            label={t("ixCfBarAria", { year })}
            onChange={(value) => onChange(year, value)}
          />
        ))}
        {years.map((year) => (
          <text key={year} className="ixcf-year" x={(x(year) ?? 0) + x.bandwidth() / 2} y={innerH + 18} textAnchor="middle">
            {year}
          </text>
        ))}
        <AxisLeft
          scale={y}
          numTicks={6}
          stroke={CHART_COLORS.axis}
          tickStroke={CHART_COLORS.axis}
          tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 12, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })}
        />
      </Group>
    </svg>
  );
}
