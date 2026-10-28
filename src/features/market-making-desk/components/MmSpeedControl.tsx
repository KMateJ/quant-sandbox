import { useI18n } from "../../../i18n";
import { MM_SPEEDS, type MmDeskModel } from "../useMarketMakingDesk";

/// 1× / 2× / 5× clock speed next to the command-bar clock.
export default function MmSpeedControl({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  return (
    <span className="mmd-speed" role="group" aria-label={t("mmdSpeedAria")}>
      {MM_SPEEDS.map((n) => (
        <button key={n} type="button" className="gdesk-cmd-btn" aria-pressed={desk.speed === n} onClick={() => desk.setSpeed(n)}>
          {t("mmdSpeed", { n })}
        </button>
      ))}
    </span>
  );
}
