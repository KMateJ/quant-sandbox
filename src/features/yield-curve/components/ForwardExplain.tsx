import { useI18n } from "../../../i18n";
import type { TermPoint } from "../yieldCurve.types";
import { forwardBetween } from "../yieldCurve.math";
import { pct2 } from "../curveChartUtils";

type Props = { start: TermPoint; end: TermPoint };

const years = (t: number) => Number(t.toFixed(2)).toString();
const growth = (v: number) => v.toFixed(4);

/// Why f(t₁, t₂) is what it is: investing to t₁ and rolling at f to t₂ grows 1 exactly as much as investing to t₂.
export default function ForwardExplain({ start, end }: Props) {
  const { t } = useI18n();
  const { fwd, dt, toStart, rolled, direct } = forwardBetween(start, end);
  const pair = { a: start.label, b: end.label };
  return (
    <div className="yc-fwd-explain" aria-live="polite">
      <p className="yc-fwd-explain-head">
        <b>f({start.label}→{end.label}) = {pct2(fwd)}</b>
        <span>{t("ycFwdExplain", pair)}</span>
      </p>
      <dl className="yc-fwd-explain-rows">
        <dt>{t("ycFwdRolled", pair)}</dt>
        <dd>(1 + {pct2(start.zero)})<sup>{years(start.t)}</sup> · (1 + {pct2(fwd)})<sup>{years(dt)}</sup> = {growth(toStart)} · {growth(rolled / toStart)} = <b>{growth(rolled)}</b></dd>
        <dt>{t("ycFwdDirect", pair)}</dt>
        <dd>(1 + {pct2(end.zero)})<sup>{years(end.t)}</sup> = <b>{growth(direct)}</b></dd>
      </dl>
    </div>
  );
}
