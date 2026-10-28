import { LineChart } from "../../../../../components/charts";
import { useI18n } from "../../../../../i18n";
import { LOT } from "../../../guide.micro.inventoryRisk.math";

const SHOWN = 5;

type Props = { paths: number[][]; reach: number; isMobile: boolean };

/// Inventory in shares over the session for the first few simulated makers.
export default function InventorySkewPaths({ paths, reach, isMobile }: Props) {
  const { t } = useI18n();
  const shown = paths.slice(0, SHOWN);
  const data = shown[0].map((_, step) => Object.fromEntries([["step", step], ...shown.map((p, i) => [`p${i}`, p[step]])]));
  return (
    <LineChart
      data={data}
      xKey="step"
      yDomain={[-reach, reach]}
      curve="linear"
      legend={false}
      isMobile={isMobile}
      yFormat={(v) => `${v / LOT}`}
      valueFormat={(v) => v.toFixed(0)}
      tooltipLabel={(x) => t("gfMsIsSecond", { v: x.toFixed(0) })}
      series={shown.map((_, i) => ({ key: `p${i}`, label: t("gfMsIsPath", { n: i + 1 }), color: "var(--primary)", strokeWidth: 1.4 }))}
    />
  );
}
