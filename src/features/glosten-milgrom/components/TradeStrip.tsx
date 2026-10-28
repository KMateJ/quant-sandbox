import { useRef, type KeyboardEvent } from "react";
import { useI18n } from "../../../i18n";
import type { GlostenMilgromLab } from "../useGlostenMilgromLab";

/// Square B/S tiles, one per trade; click (or Space) flips a trade, ←/→ move focus, the cursor tile is marked.
export default function TradeStrip({ lab }: { lab: GlostenMilgromLab }) {
  const { t } = useI18n();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    refs.current[Math.max(0, Math.min(lab.trades.length - 1, i + d))]?.focus();
  };
  return (
    <div className="glm-strip" role="group" aria-label={t("glmStripLabel")}>
      {lab.trades.map((tr, i) => {
        const cls = ["glm-tile", tr === "B" ? "glm-tile--buy" : "glm-tile--sell", i === lab.cursor - 1 && "is-cursor", i >= lab.cursor && "is-ahead"];
        return (
          <button
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            className={cls.filter(Boolean).join(" ")}
            aria-label={t("glmTileAria", { n: i + 1, side: t(tr === "B" ? "glmBuyWord" : "glmSellWord") })}
            onClick={() => lab.flip(i)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {tr}
          </button>
        );
      })}
    </div>
  );
}
