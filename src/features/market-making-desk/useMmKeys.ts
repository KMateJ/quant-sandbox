import { useFunctionKeys, type GameKey } from "../../components/game";
import { useI18n } from "../../i18n";
import type { MmDeskModel } from "./useMarketMakingDesk";

/// F2–F10 of the market making desk, bound to the keyboard while the desk screen is live (not in the demo).
export function useMmKeys(desk: MmDeskModel, active: boolean): GameKey[] {
  const { t } = useI18n();
  const { live, state, running } = desk;
  const quoting = state.quote.live;
  const keys: GameKey[] = [
    { code: "F2", label: t(running ? "mmdKeyPause" : "mmdKeyPlay"), run: desk.togglePlay, enabled: live },
    { code: "F3", label: t("mmdKeyStep"), run: desk.step10, enabled: live && !running },
    { code: "F4", label: t("mmdKeyJoin"), run: desk.join, enabled: live },
    { code: "F5", label: t("mmdKeyWiden"), run: desk.widen, enabled: live },
    { code: "F6", label: t("mmdKeyTighten"), run: desk.tighten, enabled: live },
    { code: "F7", label: t("mmdKeySkewSell"), run: desk.skewToSell, enabled: live },
    { code: "F8", label: t("mmdKeySkewBuy"), run: desk.skewToBuy, enabled: live },
    { code: "F9", label: t(quoting ? "mmdKeyPull" : "mmdKeyRestore"), run: quoting ? desk.pull : desk.restore, enabled: live },
    { code: "F10", label: t("mmdKeyHedge"), run: desk.hedgeFlat, enabled: live && desk.inventory !== 0 },
  ];
  useFunctionKeys(keys, active);
  return keys;
}
