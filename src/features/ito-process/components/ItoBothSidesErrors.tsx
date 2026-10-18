import { useMemo } from "react";
import { LineChart } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { itoErrorByN, type ItoFn } from "../itoProcess.math";

type Props = { fn: ItoFn; horizon: number; seed: number; ns: number[]; n: number; isMobile: boolean };

const PATHS = 200;

/// Mean |error| at T against n (x on log₂, y on log₁₀) over many seeded paths, with and without the ½∫f″dt correction.
export default function ItoBothSidesErrors({ fn, horizon, seed, ns, n, isMobile }: Props) {
  const { t } = useI18n();
  const rows = useMemo(() => itoErrorByN(fn, horizon, ns, PATHS, seed), [fn, horizon, ns, seed]);
  const data = rows.map((r) => ({ x: Math.log2(r.n), corrected: Math.log10(r.corrected), uncorrected: Math.log10(r.uncorrected) }));
  const pow = (v: number) => 10 ** v;

  return (
    <figure className="ito-bs-errors">
      <figcaption>{t("itoBsErrTitle", { paths: PATHS })}</figcaption>
      <div className="chart-wrap ito-bs-errors-chart" role="img" aria-label={t("itoBsErrAria")}>
        <LineChart
          data={data}
          xKey="x"
          curve="linear"
          isMobile={isMobile}
          series={[
            { key: "corrected", label: t("itoBsErrCorrected"), color: "#22c55e", strokeWidth: 2.25 },
            { key: "uncorrected", label: t("itoBsErrIto"), color: "#f59e0b", strokeWidth: 2, dash: "6 4" },
          ]}
          referenceLines={[{ axis: "x", value: Math.log2(n), color: "var(--primary)", dash: "0" }]}
          xFormat={(v) => (Number.isInteger(v) ? String(2 ** v) : "")}
          yFormat={(v) => pow(v).toPrecision(1)}
          tooltipLabel={(x) => `n = ${Math.round(2 ** x)}`}
          valueFormat={(v) => pow(v).toFixed(4)}
        />
      </div>
      <p className="lp-ensemble-hint">{t("itoBsErrHint")}</p>
    </figure>
  );
}
