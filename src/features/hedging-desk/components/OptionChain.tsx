import Panel from "../../../components/layout/Panel";
import { useI18n } from "../../../i18n";
import { num, pct } from "../../../components/game/gameFormat";
import { nearestStrike } from "../sidePanels.math";
import type { HedgingDeskModel } from "../useHedgingDesk";
import ChainRow from "./ChainRow";

/// Calls and puts by strike; clicking a side loads that option into the ticket.
export default function OptionChain({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { market, S, iv, tau, mission } = desk;
  const atm = nearestStrike(market.strikes, S);
  const header = t("hdSideChainHeader", { iv: pct(iv, 2), tau: num(tau, 3) });
  return (
    <Panel id="hd-chain" title={t("hdOptionChainTitle")} actions={header} className="gdesk-panel" flush>
      <div className="hdesk-chain">
        <div className="hdesk-chain-head gdesk-label">
          <span>{t("hdSideCalls")}</span>
          <span>{t("hdSideStrike")}</span>
          <span>{t("hdSidePuts")}</span>
        </div>
        {market.strikes.map((k) => (
          <ChainRow key={k} desk={desk} strike={k} atm={k === atm} readOnly={mission.instruments === "stock"} />
        ))}
      </div>
    </Panel>
  );
}
