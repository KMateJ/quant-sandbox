import { PlaybackControls } from "../../../components/playback";
import { StatCard } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { GlostenMilgromLab } from "../useGlostenMilgromLab";
import { fmt3 } from "./gmChart";

/// Playback with ◀ ▶ steps, the last update as a sentence, and the live readouts.
export default function StepLog({ lab }: { lab: GlostenMilgromLab }) {
  const { t } = useI18n();
  const { cursor, path, playback } = lab;
  const last = cursor > 0 ? path[cursor - 1] : null;
  return (
    <div className="glm-steplog">
      <PlaybackControls
        playback={playback}
        steps={path.length}
        label={t("glmPlayback")}
        formatStep={(s) => t("glmStepOf", { n: s, total: path.length })}
        showStepButtons
        showSpeed
      />
      <p className="glm-log-line" aria-live="polite">
        {last
          ? t("glmLogLine", { n: cursor, side: t(last.trade === "B" ? "glmBuyWord" : "glmSellWord"), from: fmt3(last.mu), to: fmt3(last.next) })
          : t("glmLogStart", { mu: fmt3(lab.params.prior) })}
      </p>
      <div className="glm-readouts">
        <StatCard label={t("glmBelief")} value={fmt3(lab.belief)} />
        <StatCard label={t("glmSpreadNow")} value={fmt3(lab.spreadNow)} />
        <StatCard label={t("glmBuysSells")} value={`${lab.buys} / ${lab.sells}`} />
        <StatCard label={t("glmToConfidence")} value={lab.toConfidence === null ? t("glmNever") : String(lab.toConfidence)} />
      </div>
    </div>
  );
}
