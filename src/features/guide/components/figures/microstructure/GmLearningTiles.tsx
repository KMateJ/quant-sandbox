import { useRef, type KeyboardEvent } from "react";
import { useI18n } from "../../../../../i18n";
import type { Trade } from "../../../../glosten-milgrom/glostenMilgrom.types";

type Props = { trades: readonly Trade[]; onFlip: (k: number) => void };

/// Row of B/S tiles, one per trade; a click (or Space) flips that trade and ←/→ move focus.
export default function GmLearningTiles({ trades, onFlip }: Props) {
  const { t } = useI18n();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    refs.current[Math.max(0, Math.min(trades.length - 1, i + d))]?.focus();
  };
  return (
    <div className="gf-ms-glosten-milgrom-tiles" role="group" aria-label={t("gfMsGmTilesLabel")}>
      {trades.map((tr, i) => (
        <button
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          className={`gf-ms-glosten-milgrom-tile gf-ms-glosten-milgrom-tile--${tr === "B" ? "buy" : "sell"}`}
          aria-label={t("gfMsGmTileAria", { n: i + 1, side: t(tr === "B" ? "gfMsGmBuy" : "gfMsGmSell") })}
          onClick={() => onFlip(i)}
          onKeyDown={(e) => onKey(e, i)}
        >
          {tr}
        </button>
      ))}
    </div>
  );
}
