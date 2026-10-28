import { HeatmapPicker } from "../../../../components/charts";
import { ChartContainer } from "../../../../components/layout";
import { useI18n } from "../../../../i18n";
import type { CrossRow } from "../../cross.types";

const AXIS = [1, 2, 3, 4, 5];
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// 5 x 5 grid of annual alphas (rows: size small to big, columns: growth to value); clicking a cell selects that portfolio.
export default function AlphaGrid({ rows, selected, onSelect }: { rows: CrossRow[]; selected: string; onSelect: (label: string) => void }) {
  const { t } = useI18n();
  const pick = rows.find((r) => r.label === selected);
  return (
    <ChartContainer title={t("ffmCrossGridTitle")} height={320}>
      <HeatmapPicker
        height={300}
        xValues={AXIS}
        yValues={AXIS}
        value={(x, y) => rows.find((r) => r.size === y && r.value === x)?.alpha ?? 0}
        selected={pick ? { x: pick.value, y: pick.size } : undefined}
        onPick={(x, y) => onSelect(`S${y}B${x}`)}
        scale="diverging"
        center={0}
        xLabel={t("ffmCrossGridX")}
        yLabel={t("ffmCrossGridY")}
        valueFormat={pct}
        ariaLabel={t("ffmCrossGridAria")}
      />
    </ChartContainer>
  );
}
