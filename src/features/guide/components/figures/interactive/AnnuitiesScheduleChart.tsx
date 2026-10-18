import type { KeyboardEvent } from "react";
import { AxisLeft, AxisRight } from "@visx/axis";
import { Group } from "@visx/group";
import { GridRows } from "@visx/grid";
import { scaleBand, scaleLinear } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { CHART_COLORS, chartMargin } from "../../../../../components/charts/chart.theme";
import { useI18n } from "../../../../../i18n";
import type { ScheduleRow } from "../../../guide.interactive.annuitySchedule.math";

type Props = {
  width: number;
  height: number;
  rows: ScheduleRow[];
  loan: number;
  selected: number;
  onSelect: (year: number) => void;
  money: (v: number) => string;
};

const compact = (v: number) => (Math.abs(v) >= 1000 ? `${Math.round(v / 1000)}k` : String(Math.round(v)));

/// One stacked bar per year (interest below, principal above); the line is the balance left after that year.
export default function AnnuitiesScheduleChart({ width, height, rows, loan, selected, onSelect, money }: Props) {
  const { t } = useI18n();
  const base = chartMargin(width < 480);
  const margin = { ...base, right: base.left };
  const innerW = Math.max(0, width - margin.left - margin.right);
  const innerH = Math.max(0, height - margin.top - margin.bottom);
  const x = scaleBand({ domain: rows.map((r) => r.year), range: [0, innerW], padding: rows.length > 12 ? 0.15 : 0.3 });
  const y = scaleLinear({ domain: [0, (rows[0]?.payment ?? 1) * 1.12], range: [innerH, 0], nice: true });
  const yBalance = scaleLinear({ domain: [0, loan], range: [innerH, 0] });
  const labelEvery = rows.length > 12 ? 5 : 1;

  const onKey = (event: KeyboardEvent, year: number) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onSelect(year);
  };

  return (
    <svg width={width} height={height} className="ixan-svg">
      <Group left={margin.left} top={margin.top}>
        <GridRows scale={y} width={innerW} numTicks={5} stroke={CHART_COLORS.grid} strokeDasharray="3 3" />
        {rows.map((row) => {
          const bx = x(row.year) ?? 0;
          const bw = x.bandwidth();
          const yInterest = y(row.interest);
          const yTop = y(row.interest + row.principal);
          return (
            <g
              key={row.year}
              className={row.year === selected ? "ixan-bar is-selected" : "ixan-bar"}
              role="button"
              tabIndex={0}
              aria-pressed={row.year === selected}
              aria-label={t("ixAnBarAria", { year: row.year, interest: money(row.interest), principal: money(row.principal) })}
              onClick={() => onSelect(row.year)}
              onKeyDown={(event) => onKey(event, row.year)}
            >
              <rect className="ixan-hit" x={bx - (x.step() - bw) / 2} y={0} width={x.step()} height={innerH} />
              <rect className="ixan-interest" x={bx} y={yInterest} width={bw} height={innerH - yInterest} />
              <rect className="ixan-principal" x={bx} y={yTop} width={bw} height={yInterest - yTop} />
              {(row.year === 1 || row.year % labelEvery === 0) && (
                <text className="ixan-year" x={bx + bw / 2} y={innerH + 16} textAnchor="middle">{row.year}</text>
              )}
            </g>
          );
        })}
        <LinePath
          className="ixan-balance"
          data={[{ year: 0, closing: loan }, ...rows]}
          x={(d) => (d.year === 0 ? 0 : (x(d.year) ?? 0) + x.bandwidth())}
          y={(d) => yBalance(d.closing)}
        />
        <AxisLeft
          scale={y}
          numTicks={5}
          tickFormat={(v) => compact(Number(v))}
          stroke={CHART_COLORS.axis}
          tickStroke={CHART_COLORS.axis}
          tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 11, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })}
        />
        <AxisRight
          left={innerW}
          scale={yBalance}
          numTicks={4}
          tickFormat={(v) => compact(Number(v))}
          stroke={CHART_COLORS.axis}
          tickStroke={CHART_COLORS.axis}
          tickLabelProps={() => ({ fill: CHART_COLORS.axis, fontSize: 11, textAnchor: "start", dx: "0.25em", dy: "0.25em" })}
        />
      </Group>
    </svg>
  );
}
