import type { CSSProperties } from "react";
import { useI18n } from "../../i18n";
import type { Cov2 } from "./brownianFundamentals.types";
import { masked } from "./predictRound";

type Props = {
  empirical: Cov2;
  theory: Cov2;
  names: [string, string];
  /// Shows "?" in the off-diagonal cells while a prediction about them is open.
  hideCross?: boolean;
};

/// 2×2 covariance matrix as shaded cells: the measured value large, the theoretical one beneath.
export default function CovarianceMatrix({ empirical, theory, names, hideCross = false }: Props) {
  const { t } = useI18n();
  const max = Math.max(theory.xx, theory.yy);
  const cells: [keyof Cov2, string, string][] = [
    ["xx", names[0], names[0]],
    ["xy", names[0], names[1]],
    ["xy", names[1], names[0]],
    ["yy", names[1], names[1]],
  ];
  return (
    <div className="stoch-cov-matrix" role="table" aria-label={t("stochCovMatrixTitle")}>
      {cells.map(([key, row, col], i) => {
        const shown = !(hideCross && key === "xy");
        const strength = shown ? Math.round((Math.abs(theory[key]) / max) * 55) : 0;
        return (
          <div
            key={i}
            role="cell"
            className="stoch-cov-cell"
            style={{ "--strength": `${strength}%` } as CSSProperties}
            title={`Cov(${row}, ${col})`}
          >
            <span className="stoch-cov-value">{masked(shown, empirical[key].toFixed(3))}</span>
            <span className="stoch-cov-theory">{t("stochCovMatrixTheory", { v: masked(shown, theory[key].toFixed(3)) })}</span>
          </div>
        );
      })}
    </div>
  );
}
