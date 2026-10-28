import { DataTable, InfoTooltip, type DataColumn } from "../../components/ui";
import { useI18n } from "../../i18n";
import { ESTIMATOR_COLOR, ESTIMATOR_LABEL } from "./monteCarlo.estimators";
import type { McVrMethod, McVrResult } from "./monteCarlo.types";
import { equivalentPlainDraws, VR_METHODS } from "./monteCarloPages.math";

type Row = { method: McVrMethod; estimate: number; se: number; factor: number; equivalent: number };

/// Per method: estimate, standard error, variance-reduction factor and the plain draws that would give the same error.
export default function McVrTable({ summary, sims }: { summary: McVrResult["summary"]; sims: number }) {
  const { t } = useI18n();
  const plainSe = summary.plain.standardError;
  const rows = VR_METHODS.map((method): Row => {
    const { estimate, standardError: se } = summary[method];
    const equivalent = equivalentPlainDraws(sims, plainSe, se);
    return { method, estimate, se, factor: equivalent / sims, equivalent };
  });
  const big = (v: number) => (Number.isFinite(v) ? Math.round(v).toLocaleString("en-US") : "∞");
  const columns: DataColumn<Row>[] = [
    {
      key: "method", header: t("monteCarloVrMethod"),
      render: (r) => (<><span aria-hidden="true" style={{ color: ESTIMATOR_COLOR[r.method] }}>● </span>{t(ESTIMATOR_LABEL[r.method])}</>),
    },
    { key: "se", header: t("monteCarloStdError"), align: "end", render: (r) => r.se.toFixed(4) },
    {
      key: "factor", align: "end",
      header: (<>{t("monteCarloVrFactor")}<InfoTooltip content={t("monteCarloVrHelp")} /></>),
      render: (r) => `×${Number.isFinite(r.factor) ? r.factor.toFixed(1) : "∞"}`,
    },
    { key: "equivalent", header: t("monteCarloVrEquivalent"), align: "end", render: (r) => big(r.equivalent) },
    { key: "saved", header: t("monteCarloVrSaved"), align: "end", render: (r) => big(Math.max(r.equivalent - sims, 0)) },
  ];
  return <DataTable columns={columns} rows={rows} getRowKey={(r) => r.method} />;
}
