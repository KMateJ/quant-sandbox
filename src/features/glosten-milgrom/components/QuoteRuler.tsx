import { useRef, type KeyboardEvent, type PointerEvent } from "react";
import { useI18n } from "../../../i18n";
import type { YourQuote } from "../glostenMilgrom.types";

type Props = { quote: YourQuote; onChange: (q: YourQuote) => void; belief: number; disabled?: boolean };
type Side = keyof YourQuote;

const clamp = (v: number) => Math.round(Math.max(0, Math.min(1, v)) * 100) / 100;

/// Vertical 0–1 ruler with square bid/ask handles (drag, or ↑/↓ by 0.01, Shift by 0.05) and a belief ghost.
export default function QuoteRuler({ quote, onChange, belief, disabled }: Props) {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const set = (side: Side, v: number) => {
    const next = { ...quote, [side]: clamp(v) };
    if (next.bid < next.ask) onChange(next);
  };
  const fromPointer = (e: PointerEvent, side: Side) => {
    const r = track.current?.getBoundingClientRect();
    if (r && e.buttons) set(side, 1 - (e.clientY - r.top) / r.height);
  };
  const onKey = (e: KeyboardEvent, side: Side) => {
    const d = e.key === "ArrowUp" ? 1 : e.key === "ArrowDown" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    set(side, quote[side] + d * (e.shiftKey ? 0.05 : 0.01));
  };
  const handle = (side: Side) => (
    <div
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={t(side === "ask" ? "glmYourAsk" : "glmYourBid")}
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={quote[side]}
      aria-disabled={disabled}
      className={`glm-handle glm-handle--${side}`}
      style={{ bottom: `${quote[side] * 100}%` }}
      onPointerDown={(e) => !disabled && e.currentTarget.setPointerCapture(e.pointerId)}
      onPointerMove={(e) => !disabled && fromPointer(e, side)}
      onKeyDown={(e) => !disabled && onKey(e, side)}
    >
      <span className="glm-handle-label">{`${t(side === "ask" ? "glmAsk" : "glmBid")} ${quote[side].toFixed(2)}`}</span>
    </div>
  );
  return (
    <div className="glm-ruler" ref={track}>
      {[0, 0.25, 0.5, 0.75, 1].map((v) => (
        <span key={v} className="glm-ruler-tick" style={{ bottom: `${v * 100}%` }}>{v.toFixed(2)}</span>
      ))}
      <span className="glm-ruler-band" style={{ bottom: `${quote.bid * 100}%`, height: `${(quote.ask - quote.bid) * 100}%` }} />
      <span className="glm-ruler-ghost" style={{ bottom: `${belief * 100}%` }} title={t("glmBelief")} />
      {handle("ask")}
      {handle("bid")}
    </div>
  );
}
