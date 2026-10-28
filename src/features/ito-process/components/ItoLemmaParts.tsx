import { useMemo } from "react";
import { LineChart, type ChartSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { fineIncrements, itoBothSides, ITO_FINE_STEPS, type ItoFn } from "../itoProcess.math";

type Props = { fn: ItoFn; n: number; horizon: number; seed: number; isMobile: boolean };
const f4 = (v: number) => v.toFixed(4);

/// f(W_t) − f(0) split into the stochastic integral and the ½∫f″dt drift along the same path as the both-sides view.
export default function ItoLemmaParts({ fn, n, horizon, seed, isMobile }: Props) {
  const { t } = useI18n();
  const rows = useMemo(() => {
    const dw = fineIncrements(horizon, ITO_FINE_STEPS, seed);
    return itoBothSides(fn, dw, horizon, n).map((r) => ({ t: r.t, integral: r.ito, drift: r.corrected - r.ito, total: r.corrected }));
  }, [fn, n, horizon, seed]);
  const end = rows[rows.length - 1];
  const series: ChartSeries[] = [
    { key: "integral", label: t("itoLemIntegral"), color: "#f59e0b", strokeWidth: 2, dash: "6 4" },
    { key: "drift", label: t("itoLemDrift"), color: "#60a5fa", strokeWidth: 2 },
    { key: "total", label: t("itoLemTotal"), color: "#22c55e", strokeWidth: 2.5 },
  ];
  return (
    <div className="ito-bs">
      <div className="chart-wrap" role="img" aria-label={t("itoLemPartsAria")}>
        <LineChart data={rows} xKey="t" series={series} xDomain={[0, horizon]} curve="linear" isMobile={isMobile}
          tooltipLabel={(x) => `t = ${x.toFixed(3)}`} valueFormat={f4} />
      </div>
      <dl className="lp-ensemble-readout">
        <div><dt>{t("itoLemMissing")}</dt><dd>{f4(end.drift)}</dd></div>
        <div><dt>{t("itoLemIntegral")}</dt><dd>{f4(end.integral)}</dd></div>
        <div><dt>{t("itoLemTotal")}</dt><dd>{f4(end.total)}</dd></div>
      </dl>
    </div>
  );
}
