import { useMemo } from "react";
import { LineChart, SERIES_ROLE } from "../../../../components/charts";
import { ChartContainer } from "../../../../components/layout";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { cumulative, FACTOR_LABEL, slice } from "../../famaFrench.math";
import type { FfData } from "../../famaFrench.types";
import type { SortFactor, SortModel } from "../../useSortTab";

/// Growth of 1 in your factor (solid) against the official Fama-French factor (dashed), with t-statistics and correlation.
export default function YourFactorsChart({ model, data }: { model: SortModel; data: FfData }) {
  const { t } = useI18n();
  const { factor, setFactor, mine, stats, window } = model;
  const name = FACTOR_LABEL[factor];
  const rows = useMemo(() => {
    const own = cumulative(mine[factor]);
    const off = cumulative(slice(data.factors[factor], window));
    return own.map((v, i) => ({ i, own: v, official: off[i] }));
  }, [mine, factor, data, window]);
  const num = (v: number) => v.toFixed(2);
  const year = (i: number) => data.months[window.from + Math.round(i)]?.slice(0, 4) ?? "";

  return (
    <ChartContainer
      title={t("ffmSortFactorsTitle")}
      height={300}
      actions={
        <SegmentedControl<SortFactor>
          ariaLabel={t("ffmSortFactorPick")}
          value={factor}
          onChange={setFactor}
          options={[{ value: "smb", label: "SMB" }, { value: "hml", label: "HML" }]}
        />
      }
    >
      <LineChart
        data={rows}
        xKey="i"
        curve="linear"
        series={[
          { key: "own", label: t("ffmSortLegendYours", { f: name, t: num(stats.own.t), c: num(stats.corr) }), color: SERIES_ROLE.candidate, strokeWidth: 2 },
          { key: "official", label: t("ffmSortLegendOfficial", { f: name, t: num(stats.official.t) }), color: SERIES_ROLE.reference, strokeWidth: 1.6, dash: "5 4" },
        ]}
        xFormat={year}
        yFormat={(v) => `${Number(v.toPrecision(2))}×`}
        tooltipLabel={(i) => data.months[window.from + Math.round(i)] ?? ""}
      />
    </ChartContainer>
  );
}
