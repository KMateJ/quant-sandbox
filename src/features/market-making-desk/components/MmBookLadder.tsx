import { memo } from "react";
import Panel from "../../../components/layout/Panel";
import { num } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import type { LadderEntry } from "../../../lib/market/ladder";
import type { MmDeskModel } from "../useMarketMakingDesk";

type Props = { rows: LadderEntry[]; tick: number };

const Ladder = memo(function Ladder({ rows, tick }: Props) {
  const { t } = useI18n();
  const max = Math.max(1, ...rows.map((r) => Math.max(r.bidSize, r.askSize)));
  const bar = (size: number) => ({ width: `${(size / max) * 100}%` });
  return (
    <table className="mmd-ladder" aria-label={t("mmdBookAria")}>
      <thead>
        <tr><th scope="col">{t("mmdBookBid")}</th><th scope="col">{t("mmdBookPrice")}</th><th scope="col">{t("mmdBookAsk")}</th></tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.price} className={[r.isBestBid && "is-best-bid", r.isBestAsk && "is-best-ask"].filter(Boolean).join(" ") || undefined}>
            <td className="mmd-ladder-bid">
              {r.bidSize > 0 && <span className="mmd-depth mmd-depth--bid" style={bar(r.bidSize)} />}
              {r.mine.bid > 0 && <span className="mmd-you">{t("mmdYou", { n: num(r.mine.bid, 0) })}</span>}
              <span className="gdesk-num">{r.bidSize > 0 ? num(r.bidSize, 0) : ""}</span>
            </td>
            <th scope="row" className="gdesk-num">{num(r.price * tick, 2)}</th>
            <td className="mmd-ladder-ask">
              {r.askSize > 0 && <span className="mmd-depth mmd-depth--ask" style={bar(r.askSize)} />}
              <span className="gdesk-num">{r.askSize > 0 ? num(r.askSize, 0) : ""}</span>
              {r.mine.ask > 0 && <span className="mmd-you">{t("mmdYou", { n: num(r.mine.ask, 0) })}</span>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});

/// Ten price levels either side of a slow-moving centre, depth bars, and your resting shares marked YOU.
export default function MmBookLadder({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  return (
    <Panel id="mmd-book" title={t("mmdBookTitle")} className="gdesk-panel" flush>
      <Ladder rows={desk.rows} tick={desk.mission.flow.tick} />
    </Panel>
  );
}
