import { LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import { useI18n } from "../../../../../i18n";

type Props = { path: { n: number; p: number; opt: number }[]; v: number };

/// Price after each auction for your plan and for the optimal insider on the same noise; dashed line = V.
export default function KyleSchedulePath({ path, v }: Props) {
  const { t } = useI18n();
  return (
    <LineChart
      data={path}
      xKey="n"
      xDomain={[0, path.length - 1]}
      series={[
        { key: "opt", label: t("gfMsKylePathOptimal"), color: SERIES_PALETTE[2], strokeWidth: 1.5, dash: "5 4" },
        { key: "p", label: t("gfMsKylePathYours"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
      ]}
      referenceLines={[{ axis: "y", value: v, color: SERIES_PALETTE[3], dash: "6 4", width: 1.5 }]}
      curve="linear"
      tooltipLabel={(x) => t("gfMsKylePathTooltip", { n: x })}
      valueFormat={(p) => p.toFixed(2)}
      xFormat={(x) => String(x)}
    />
  );
}
