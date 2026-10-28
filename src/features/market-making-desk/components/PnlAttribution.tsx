import { AttributionBars } from "../../../components/game";
import { signedMoney } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import type { MmDeskModel } from "../useMarketMakingDesk";

/// Live split of P&L: spread capture, adverse selection, inventory moves, fees, and the total.
export default function PnlAttribution({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  const p = desk.parts;
  const row = (label: string, value: number) => ({ label, value, display: signedMoney(value) });
  return (
    <AttributionBars id="mmd-pnl" title={t("mmdPnlTitle")}
      rows={[row(t("mmdPnlSpread"), p.spread), row(t("mmdPnlAdverse"), p.adverse), row(t("mmdPnlInventory"), p.inventory), row(t("mmdPnlFees"), p.fees)]}
      total={row(t("mmdPnlTotal"), p.total)} />
  );
}
