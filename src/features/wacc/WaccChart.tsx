import type { PointerEvent } from "react";
import { DragHandles, LineChart } from "../../components/charts";
import type { ChartReferenceLine, ChartSeries, PlotFrame } from "../../components/charts";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import { MAX_DEBT_RATIO, type WaccLab } from "./useWaccLab";

const pct = (v: number) => `${(v * 100).toFixed(2)}%`;
const pct0 = (v: number) => `${(v * 100).toFixed(0)}%`;

/// WACC against D/V with a draggable D/V line; in the realistic mode a click on the plot places the minimum guess.
export default function WaccChart({ lab }: { lab: WaccLab }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { realistic, predict } = lab;

  // WACC only: next to r_E the curve's shallow minimum would be flattened by the axis range.
  const series: ChartSeries[] = [{ key: "wacc", label: t("waccLabel"), color: "#22c55e", strokeWidth: 2.5 }];
  const ys = lab.data.map((p) => p.wacc);
  const referenceLines: ChartReferenceLine[] = [{ axis: "y", value: lab.waccValue, color: "#38bdf8", dash: "4 4" }];

  const layer = (frame: PlotFrame) => {
    const guessAt = (event: PointerEvent<SVGRectElement>) => {
      const box = event.currentTarget.getBoundingClientRect();
      const x = frame.xInvert(((event.clientX - box.left) / box.width) * frame.width);
      predict.setGuess(Math.round(Math.min(MAX_DEBT_RATIO, Math.max(0, x)) * 100) / 100);
    };
    // The guess label sits on a second line so it never overlaps the minimum's label.
    const marker = (value: number, label: string, color: string, row: number) => {
      const right = frame.x(value) > frame.width * 0.75;
      return (
        <g key={label} pointerEvents="none">
          <line x1={frame.x(value)} x2={frame.x(value)} y1={0} y2={frame.height} stroke={color} strokeWidth={2} />
          <text x={frame.x(value) + (right ? -4 : 4)} y={12 + row * 14} fontSize={11} fill={color} textAnchor={right ? "end" : "start"}>{label}</text>
        </g>
      );
    };
    return (
      <>
        {realistic && !predict.revealed && (
          <rect x={0} y={0} width={frame.width} height={frame.height} fill="transparent" style={{ cursor: "crosshair" }} onPointerDown={guessAt} />
        )}
        {realistic && predict.guess !== null && marker(predict.guess, `${t("waccGuessMarker")} ${pct0(predict.guess)}`, "var(--chart-4)", 1)}
        {realistic && predict.revealed && marker(predict.truth, `${t("waccMinimumMarker")} ${pct0(predict.truth)}`, "var(--text)", 0)}
        <DragHandles
          frame={frame}
          handles={[{ id: "dv", axis: "x", x: lab.debtRatio, min: 0, max: MAX_DEBT_RATIO, step: 0.01, label: "D/V", color: "#38bdf8", format: pct0 }]}
          onChange={(_, v) => v.x !== undefined && lab.setDebtRatio(v.x)}
        />
      </>
    );
  };

  return (
    <div className="chart-wrap">
      <LineChart
        data={lab.data}
        xKey="debtRatio"
        series={series}
        xDomain={[0, MAX_DEBT_RATIO]}
        yDomain={[Math.min(...ys) * 0.95, Math.max(...ys) * 1.05]}
        referenceLines={referenceLines}
        isMobile={isMobile}
        tooltipLabel={(x) => `${t("waccDebtRatioLabel")} = ${(x * 100).toFixed(0)}%`}
        valueFormat={pct}
        layer={layer}
      />
    </div>
  );
}
