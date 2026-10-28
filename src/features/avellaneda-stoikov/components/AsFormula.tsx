import { useI18n } from "../../../i18n";
import { asQuotes } from "../../../lib/market/quotes";
import type { AsParams } from "../avellanedaStoikov.types";

const n = (v: number, d = 2) => (Number.isInteger(v) ? String(v) : v.toFixed(d));

/// The two AS formulas with the current numbers filled in.
export default function AsFormula({ params, q, t }: { params: AsParams; q: number; t: number }) {
  const { t: tr } = useI18n();
  const { s0, gamma, sigma, k, T } = params;
  const left = T - t;
  const qt = asQuotes({ s: s0, q, gamma, sigma, k, tLeft: left });
  const sign = q < 0 ? "+" : "−";
  return (
    <div className="avs-formula">
      <p>{tr("avsFormulaR")}</p>
      <p className="avs-formula-live">
        r = {s0} {sign} {Math.abs(q)}·{n(gamma)}·{n(sigma * sigma)}·{n(left)} = <strong>{qt.reservation.toFixed(2)}</strong>
      </p>
      <p>{tr("avsFormulaSpread")}</p>
      <p className="avs-formula-live">
        δᵃ + δᵇ = {n(gamma)}·{n(sigma * sigma)}·{n(left)} + (2/{n(gamma)})·ln(1 + {n(gamma)}/{n(k)}) = <strong>{(2 * qt.halfSpread).toFixed(3)}</strong>
      </p>
      <p className="avs-formula-live">
        {tr("avsQuotesLive", { bid: qt.bid.toFixed(2), ask: qt.ask.toFixed(2) })}
      </p>
    </div>
  );
}
