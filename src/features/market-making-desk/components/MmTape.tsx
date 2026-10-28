import Panel from "../../../components/layout/Panel";
import { num } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { clockParts } from "../deskModel.math";
import type { MmDeskModel } from "../useMarketMakingDesk";

const ROWS = 14;

/// The last trades on the market, newest first; your fills carry a YOU flag. Informed flow is never shown here.
export default function MmTape({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  const trades = desk.state.tape.slice(-ROWS).reverse();
  return (
    <Panel id="mmd-tape" title={t("mmdTapeTitle")} className="gdesk-panel" flush>
      {trades.length === 0 ? (
        <p className="gdesk-label mmd-tape-empty">{t("mmdTapeEmpty")}</p>
      ) : (
        <table className="mmd-tape">
          <thead>
            <tr>
              <th scope="col">{t("mmdTapeTime")}</th><th scope="col">{t("mmdTapeSide")}</th>
              <th scope="col">{t("mmdTapePrice")}</th><th scope="col">{t("mmdTapeSize")}</th><th scope="col" />
            </tr>
          </thead>
          <tbody>
            {trades.map((x, i) => (
              <tr key={`${x.t}-${trades.length - i}`} className={x.you ? "is-you" : undefined}>
                <td className="gdesk-num">{t("mmdTimeShort", clockParts(x.t, Infinity))}</td>
                <td className={x.side === "buy" ? "gdesk-up" : "gdesk-down"}>{t(x.side === "buy" ? "mmdTapeBuy" : "mmdTapeSell")}</td>
                <td className="gdesk-num">{num(x.price, 2)}</td>
                <td className="gdesk-num">{num(x.size, 0)}</td>
                <td>{x.you && <span className="mmd-you">{t("mmdTapeYou")}</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Panel>
  );
}
