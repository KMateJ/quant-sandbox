import { useMemo } from "react";
import { DraggableBars } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { dragScale, editableFlows } from "../npvIrr.math";
import type { NpvScheduleRow, ProjectModel } from "../npvIrr.types";

type Props = {
  model: ProjectModel;
  rows: NpvScheduleRow[];
  /// Same handler the schedule table uses for years ≥ 1 (switches the pattern to custom).
  editFlow: (year: number, value: number) => void;
  updateModel: (patch: Partial<ProjectModel>) => void;
  valueFormat: (v: number) => string;
};

/// The cash flows as draggable bars (year 0 = −outlay) with each year's present value as a shadow bar.
export default function CashflowDragChart({ model, rows, editFlow, updateModel, valueFormat }: Props) {
  const { t } = useI18n();
  const flows = useMemo(() => editableFlows(model), [model]);
  const { span, step } = dragScale(flows);
  const shadows = rows.map((r) => r.pv);

  const onChange = (year: number, value: number) => {
    if (year === 0) updateModel({ outlay: Math.max(0, -value) });
    else editFlow(year, value);
  };

  return (
    <DraggableBars
      values={flows.map((v) => Math.round(v / step) * step)}
      shadows={shadows}
      onChange={onChange}
      min={-span}
      max={span}
      step={step}
      limits={(i) => (i === 0 ? [-span, 0] : [-span, span])}
      barAriaLabel={(year) => t("npvDragBarAria", { year })}
      valueFormat={valueFormat}
      yFormat={valueFormat}
      ariaLabel={t("npvCashflowChart")}
      colors={{ positive: "var(--positive)", negative: "var(--negative)" }}
    />
  );
}
