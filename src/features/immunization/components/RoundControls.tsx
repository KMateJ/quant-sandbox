import SeedControl from "../../../components/SeedControl";
import { useI18n } from "../../../i18n";
import { DEFAULT_CONFIG as C, signedBp } from "../immunization.math";
import type { ImmunizationModel } from "../useImmunizationGame";

type Props = { model: ImmunizationModel; seed: number; setSeed: (seed: number) => void };

/// Round counter, the last shock, and the buttons that move the game on.
export default function RoundControls({ model, seed, setSeed }: Props) {
  const { t } = useI18n();
  const last = model.game.history[model.game.history.length - 1];
  return (
    <div className="im-round">
      <div className="im-round-info" aria-live="polite">
        <strong>{t("imRoundLabel", { n: model.game.round, total: C.years })}</strong>
        <span>
          {last
            ? t("imShockLine", { parallel: signedBp(last.shock.parallelBp), twist: signedBp(last.shock.twistBp) })
            : t("imNoShockYet")}
        </span>
      </div>
      <div className="im-actions">
        <button type="button" className="preset-btn preset-btn--active" data-action="next-round" onClick={model.nextRound} disabled={model.done}>
          {t("imNextRound")}
        </button>
        <button type="button" className="preset-btn" onClick={model.playOn} disabled={model.done} aria-pressed={model.playing}>
          {t(model.playing ? "pbPause" : "imPlayOn")}
        </button>
        <button type="button" className="preset-btn" onClick={model.replay}>{t("imReplay")}</button>
        <SeedControl seed={seed} setSeed={setSeed} compact />
      </div>
    </div>
  );
}
