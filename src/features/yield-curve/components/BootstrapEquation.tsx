import { BlockMath } from "react-katex";
import { useI18n } from "../../../i18n";
import type { TermPoint } from "../yieldCurve.types";
import { bootstrapStep } from "../yieldCurve.math";
import { instrumentKind } from "../bootstrap";
import { df4, pct2, YC_COLORS } from "../curveChartUtils";

const KNOWN = YC_COLORS.df;
const SOLVED = YC_COLORS.highlight;

const color = (hex: string, tex: string) => String.raw`\textcolor{${hex}}{${tex}}`;
const percent = (v: number) => pct2(v).replace("%", String.raw`\%`);

/// The bootstrap equation of step `step` with the real numbers: the known discount factors (green) feed the
/// par condition that pins down the next one (orange), which then gives the zero rate.
export default function BootstrapEquation({ term, step }: { term: TermPoint[]; step: number }) {
  const { t } = useI18n();
  const p = term[step];
  if (!p) return null;
  const { known, couponSum, solvedDf } = bootstrapStep(term, step);
  const deposit = instrumentKind(p.t) === "deposit";
  const df = color(SOLVED, String.raw`\mathrm{DF}(\text{${p.label}})`);
  const c = percent(p.par);
  const s = color(KNOWN, "S");
  const sum = color(KNOWN, df4(couponSum));
  const solved = color(SOLVED, df4(solvedDf));

  const lines = deposit
    ? [String.raw`${df} = \frac{1}{(1+${c})^{${p.t}}} = ${solved}`]
    : [
        String.raw`${s} = \sum_{k=1}^{${p.t - 1}} \mathrm{DF}(k) = ${sum}`,
        String.raw`${df} = \frac{1 - ${c}\cdot ${s}}{1 + ${c}} = \frac{1 - ${c}\cdot ${sum}}{1 + ${c}} = ${solved}`,
      ];
  lines.push(String.raw`z(\text{${p.label}}) = \mathrm{DF}^{-1/${p.t}} - 1 = ${percent(p.zero)}`);

  return (
    <div className="yc-formula">
      <div className="yc-formula-title">
        {t("ycSolveFor")} {p.label} ({t(`ycKind_${instrumentKind(p.t)}`)})
      </div>
      {lines.map((math) => <BlockMath key={math} math={math} />)}
      <p className="yc-formula-note">
        {deposit ? t("ycBootstrapDepositNote") : t("ycBootstrapKnown", { n: known.length })}
      </p>
    </div>
  );
}
