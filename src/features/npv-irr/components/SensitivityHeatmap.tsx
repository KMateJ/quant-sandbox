import { useCallback, useMemo } from "react";
import { ParentSize } from "@visx/responsive";
import HeatmapPickerInner from "../../../components/charts/HeatmapPickerInner";
import { useI18n } from "../../../i18n";
import { axisValues, heatmap, readVar } from "../npvIrr.sensitivity";
import type { HeatmapAxis, ProjectModel } from "../npvIrr.types";

type SensitivityHeatmapProps = {
  model: ProjectModel;
  xAxis: HeatmapAxis;
  yAxis: HeatmapAxis;
  onApply: (xValue: number, yValue: number) => void;
  formatAxis: (axis: HeatmapAxis, v: number) => string;
  axisLabel: (axis: HeatmapAxis) => string;
  valueFormat: (v: number) => string;
};

const STEPS = 11;

/// 2-D NPV heatmap with a diverging scale centred on zero; click, drag or press Enter on a cell to apply it.
export default function SensitivityHeatmap({ model, xAxis, yAxis, onApply, formatAxis, axisLabel, valueFormat }: SensitivityHeatmapProps) {
  const { t } = useI18n();
  const xValues = useMemo(() => axisValues(model, xAxis, STEPS, 0.6), [model, xAxis]);
  const yValues = useMemo(() => axisValues(model, yAxis, STEPS, 0.6), [model, yAxis]);
  const npvAt = useCallback((x: number, y: number) => heatmap(model, xAxis, yAxis, [x], [y])[0][0].npv, [model, xAxis, yAxis]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>
        {({ width, height }) => width > 0 && height > 0 ? (
          <HeatmapPickerInner
            width={width}
            height={height}
            xValues={xValues}
            yValues={yValues}
            value={npvAt}
            selected={{ x: readVar(model, xAxis), y: readVar(model, yAxis) }}
            onPick={onApply}
            xLabel={axisLabel(xAxis)}
            yLabel={axisLabel(yAxis)}
            xFormat={(v) => formatAxis(xAxis, v)}
            yFormat={(v) => formatAxis(yAxis, v)}
            valueFormat={valueFormat}
            ariaLabel={t("npvHeatmapTitle")}
          />
        ) : null}
      </ParentSize>
    </div>
  );
}
