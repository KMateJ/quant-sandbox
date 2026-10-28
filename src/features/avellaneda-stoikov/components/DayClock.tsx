import { useI18n } from "../../../i18n";
import type { AvsLab } from "../useAvellanedaStoikovLab";

/// Day clock: a scrubber from open (0) to close (T) and a play button (a 0.05 step under reduced motion).
export default function DayClock({ lab }: { lab: AvsLab }) {
  const { t } = useI18n();
  const label = lab.reduced ? t("avsClockStep") : lab.playing ? t("avsClockPause") : t("avsClockPlay");
  return (
    <div className="avs-clock">
      <button type="button" className="lp-btn" onClick={lab.togglePlay}>{label}</button>
      <label className="avs-clock-scrub">
        <span>{t("avsClockLabel", { t: lab.t.toFixed(2), left: (lab.params.T - lab.t).toFixed(2) })}</span>
        <input type="range" min={0} max={lab.params.T} step={0.01} value={lab.t} onChange={(e) => lab.setT(Number(e.target.value))} />
      </label>
    </div>
  );
}
