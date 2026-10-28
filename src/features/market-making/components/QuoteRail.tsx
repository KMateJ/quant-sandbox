import { useI18n } from "../../../i18n";
import { ROUND_DT, type MmParams } from "../marketMaking.types";
import { fairAt } from "../round.math";
import { RAIL_H, RAIL_W, railFrame } from "../rail.math";
import type { QuoteRound } from "../useQuoteRound";
import RailCustomers from "./RailCustomers";
import RailQuotes from "./RailQuotes";

const KEYS: Record<string, (r: QuoteRound) => void> = {
  ArrowUp: (r) => r.skew(0.5),
  ArrowDown: (r) => r.skew(-0.5),
  ArrowLeft: (r) => r.widen(-0.5),
  ArrowRight: (r) => r.widen(0.5),
  p: (r) => r.togglePull(),
  P: (r) => r.togglePull(),
  " ": (r) => r.toggle(),
};

/// The dominant figure: fair value scrolling left, your bid/ask lines with drag handles, customers arriving.
export default function QuoteRail({ live, params }: { live: QuoteRound; params: MmParams }) {
  const { t } = useI18n();
  const { round, schedule, quotes } = live;
  const now = round.step * ROUND_DT;
  const frame = railFrame(now, schedule.fair[round.step], params);
  const onKey = (e: React.KeyboardEvent) => {
    const act = KEYS[e.key];
    if (!act) return;
    e.preventDefault();
    act(live);
  };

  return (
    <div className="mkm-rail">
      <svg viewBox={`0 0 ${RAIL_W} ${RAIL_H}`} tabIndex={0} onKeyDown={onKey} role="application" aria-label={t("mkmRailAria")}
        aria-describedby="mkm-rail-keys">
        <RailQuotes frame={frame} schedule={schedule} round={round} quotes={quotes} onQuotes={live.setQuotes} />
        <RailCustomers frame={frame} events={round.events} fills={round.fills} centreAt={(t0) => fairAt(schedule, t0)} labels={!live.reduced} />
        {!quotes.live && (
          <text className="mkm-pulled" x={RAIL_W / 2} y={24}>{t("mkmPulled")}</text>
        )}
      </svg>
      <p id="mkm-rail-keys" className="mkm-keys">{t("mkmKeys")}</p>
    </div>
  );
}
