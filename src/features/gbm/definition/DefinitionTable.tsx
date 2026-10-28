import { InlineMath } from "react-katex";
import { useI18n, type TranslationKey } from "../../../i18n";

type Row = { label: TranslationKey; abm: TranslationKey | string; gbm: TranslationKey | string; tex?: boolean };

const ROWS: Row[] = [
  { label: "gdefRowSde", abm: String.raw`dS_t = \mu S_0\,dt + \sigma S_0\,dW_t`, gbm: String.raw`dS_t = \mu S_t\,dt + \sigma S_t\,dW_t`, tex: true },
  { label: "gdefRowSolution", abm: String.raw`S_t = S_0 + \mu S_0 t + \sigma S_0 W_t`, gbm: String.raw`S_t = S_0\, e^{(\mu - \frac{1}{2}\sigma^2)t + \sigma W_t}`, tex: true },
  { label: "gdefRowStep", abm: "gdefRowStepAbm", gbm: "gdefRowStepGbm" },
  { label: "gdefRowLaw", abm: "gdefRowLawAbm", gbm: "gdefRowLawGbm" },
  { label: "gdefRowNeg", abm: "gdefRowNegAbm", gbm: "gdefRowNegGbm" },
  { label: "gdefRowSigma", abm: "gdefRowSigmaAbm", gbm: "gdefRowSigmaGbm" },
  { label: "gdefRowUse", abm: "gdefRowUseAbm", gbm: "gdefRowUseGbm" },
];

/// ABM and GBM defined row by row: dynamics, solution, how a shock acts, law of S_T, sign, units, use.
export default function DefinitionTable() {
  const { t } = useI18n();
  const cell = (row: Row, v: string) => (row.tex ? <InlineMath math={v} /> : t(v as TranslationKey));
  return (
    <div className="gdef-table-wrap">
      <table className="gdef-table">
        <thead>
          <tr><th scope="col" /><th scope="col" className="is-abm">{t("gdefAbm")}</th><th scope="col" className="is-gbm">{t("gdefGbm")}</th></tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.label}>
              <th scope="row">{t(row.label)}</th>
              <td>{cell(row, row.abm)}</td>
              <td>{cell(row, row.gbm)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
