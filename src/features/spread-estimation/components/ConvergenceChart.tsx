import { LineChart } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { fmtCents } from "../spreadEstimation.math";
import type { ConvergencePoint } from "../spreadEstimation.types";

type Props = { points: ConvergencePoint[]; S: number; isMobile: boolean };

/// Roll and effective spread against sample size, with the true spread dashed.
export default function ConvergenceChart({ points, S, isMobile }: Props) {
  const { t } = useI18n();
  const data = points.map((p) => ({ n: p.n, roll: Number.isFinite(p.roll) ? p.roll : undefined, effective: p.effective }));
  const top = Math.max(S, ...points.map((p) => (Number.isFinite(p.roll) ? p.roll : 0))) * 1.25;
  return (
    <LineChart
      data={data}
      xKey="n"
      curve="linear"
      series={[
        { key: "roll", label: t("speRoll"), color: "var(--primary)", strokeWidth: 2 },
        { key: "effective", label: t("speEffective"), color: "var(--chart-3)", strokeWidth: 2 },
      ]}
      referenceLines={[{ axis: "y", value: S, dash: "5 4", color: "var(--muted)" }]}
      yDomain={[0, top]}
      isMobile={isMobile}
      valueFormat={fmtCents}
      yFormat={(v) => `${v.toFixed(0)}¢`}
      tooltipLabel={(n) => t("speSampleN", { n })}
    />
  );
}
