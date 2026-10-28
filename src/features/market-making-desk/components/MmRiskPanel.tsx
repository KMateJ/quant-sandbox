import Panel from "../../../components/layout/Panel";
import { BandMeter } from "../../../components/game";
import { money, num, signed, signedMoney } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { inventoryWord } from "../deskModel.math";
import type { MmDeskModel } from "../useMarketMakingDesk";

const WORD_KEY = { long: "mmdInvLong", short: "mmdInvShort", flat: "mmdInvFlat" } as const;
const HARD_STOP = 1.5;

/// Inventory against the limit band (meter spans ±1.5 × limit), its value, drawdown and breaches.
export default function MmRiskPanel({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  const { inventory, mission, state } = desk;
  const { limit } = mission;
  const edge = HARD_STOP * limit;
  return (
    <Panel id="mmd-risk" title={t("mmdRiskTitle")} className="gdesk-panel">
      <div className="gdesk-netdelta">
        <span className="gdesk-label">{t("mmdInventory")}</span>
        <span className="gdesk-netdelta-value gdesk-num">{signed(inventory, 0)}</span>
        <span className="gdesk-bandtag">{t(WORD_KEY[inventoryWord(inventory)])}</span>
      </div>
      <BandMeter value={inventory} min={-edge} max={edge} lo={-limit} hi={limit}
        scale={[signed(-edge, 0), "0", signed(edge, 0)]}
        label={t("mmdInvMeterAria", { inv: signed(inventory, 0), limit: num(limit, 0) })} />
      <dl className="gdesk-kv">
        <div><dt>{t("mmdLimit")}</dt><dd className="gdesk-num">±{num(limit, 0)}</dd></div>
        <div><dt>{t("mmdInvValue")}</dt><dd className="gdesk-num">{signedMoney(inventory * desk.mid)}</dd></div>
        <div><dt>{t("mmdDrawdown")}</dt><dd className="gdesk-num">{money(state.mdd)}</dd></div>
        <div><dt>{t("mmdBreaches")}</dt><dd className="gdesk-num">{state.breaches}</dd></div>
      </dl>
    </Panel>
  );
}
