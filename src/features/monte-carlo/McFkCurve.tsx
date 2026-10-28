import { LineChart, markerLine } from "../../components/charts";
import { useI18n } from "../../i18n";
import type { FkCurvePoint } from "./monteCarlo.types";

type Props = { curve: FkCurvePoint[]; x: number; isMobile: boolean };

/// u(t, ·) from the PDE (closed form) and from the Monte Carlo average, against the terminal condition u(T, ·).
export default function McFkCurve({ curve, x, isMobile }: Props) {
  const { t } = useI18n();
  return (
    <LineChart
      data={curve}
      xKey="x"
      series={[
        { key: "payoff", label: t("monteCarloFkPayoff"), color: "var(--muted)", dash: "6 4", strokeWidth: 1.5 },
        { key: "closed", label: t("monteCarloFkClosed"), color: "#22c55e", strokeWidth: 2.25 },
        { key: "mc", label: t("monteCarloFkMc"), color: "#38bdf8", strokeWidth: 1.75 },
      ]}
      referenceLines={[markerLine(x)]}
      isMobile={isMobile}
      curve="linear"
      xFormat={(v) => v.toFixed(0)}
      valueFormat={(v) => v.toFixed(3)}
      tooltipLabel={(v) => `x = ${v.toFixed(0)}`}
    />
  );
}
