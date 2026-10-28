import { useI18n } from "../../../i18n";
import { asQuotes } from "../../../lib/market/quotes";
import type { AsParams } from "../avellanedaStoikov.types";

const W = 260;
const H = 300;
const PAD = 16;

type Props = {
  params: AsParams;
  q: number;
  t: number;
  /// Predict: quotes hidden until revealed; clicks place the guess.
  hide?: boolean;
  guess?: number | null;
  onPick?: (price: number) => void;
};

/// Vertical price column: mid, reservation price (accent), bid and ask, with an arrow from mid to reservation.
export default function QuoteColumn({ params, q, t, hide = false, guess = null, onPick }: Props) {
  const { t: tr } = useI18n();
  const s = params.s0;
  const qt = asQuotes({ s, q, gamma: params.gamma, sigma: params.sigma, k: params.k, tLeft: params.T - t });
  const range = Math.max(3, Math.abs(qt.reservation - s) + qt.halfSpread + 0.6);
  const y = (p: number) => H / 2 - ((p - s) / range) * (H / 2 - PAD);
  const price = (py: number) => s + ((H / 2 - py) / (H / 2 - PAD)) * range;
  const row = (p: number, cls: string, label: string) => (
    <g className={`avs-col-row ${cls}`}>
      <line x1={70} x2={W - 70} y1={y(p)} y2={y(p)} />
      <text x={W - 64} y={y(p) + 4}>{label}</text>
      <text className="avs-col-value" x={64} y={y(p) + 4} textAnchor="end">{p.toFixed(2)}</text>
    </g>
  );
  const click = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onPick) return;
    const box = e.currentTarget.getBoundingClientRect();
    onPick(Math.round(price(((e.clientY - box.top) / box.height) * H) * 100) / 100);
  };

  return (
    <svg className={onPick ? "avs-column is-picking" : "avs-column"} viewBox={`0 0 ${W} ${H}`} onClick={click} role="img"
      aria-label={tr("avsColumnAria", { q, t: t.toFixed(2) })}>
      <line className="avs-col-axis" x1={W / 2} x2={W / 2} y1={PAD / 2} y2={H - PAD / 2} />
      {row(s, "is-mid", tr("avsMid"))}
      {!hide && (
        <>
          {row(qt.ask, "is-ask", tr("avsAsk"))}
          {row(qt.bid, "is-bid", tr("avsBid"))}
          {row(qt.reservation, "is-res", tr("avsReservation"))}
          {Math.abs(qt.reservation - s) > 0.05 && (
            <path className="avs-col-arrow" d={`M${W / 2} ${y(s)} L${W / 2} ${y(qt.reservation)}`} markerEnd="url(#avs-arrow)" />
          )}
        </>
      )}
      {guess !== null && row(guess, "is-guess", tr("avsGuess"))}
      <defs>
        <marker id="avs-arrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
          <path d="M0 0 L8 4 L0 8 Z" className="avs-col-arrowhead" />
        </marker>
      </defs>
    </svg>
  );
}
