import { useI18n } from "../../../i18n";
import type { ClassifyGame } from "../useClassifyGame";

const pct = (v: number) => `${Math.round(v * 100)}%`;

/// Buy / Sell / Undo buttons for the classify game, with progress and the final scorecard.
export default function ClassifyBar({ game, onRestart }: { game: ClassifyGame; onRestart: () => void }) {
  const { t } = useI18n();
  if (game.done) {
    return (
      <div className="spe-classify spe-classify--done" aria-live="polite">
        <dl className="spe-score">
          <div><dt>{t("speYouAccuracy")}</dt><dd>{pct(game.accuracy)}</dd></div>
          <div><dt>{t("speTickAccuracy")}</dt><dd>{pct(game.tickAccuracy)}</dd></div>
          <div><dt>{t("speWrongCount")}</dt><dd>{game.wrong.size}</dd></div>
        </dl>
        <button type="button" className="lp-btn" onClick={onRestart}>{t("speNewGame")}</button>
      </div>
    );
  }
  return (
    <div className="spe-classify" aria-live="polite">
      <span className="spe-progress">{t("speProgress", { i: game.current + 1, n: game.game.length })}</span>
      <button type="button" className="lp-btn spe-buy" onClick={() => game.guess(1)}>{t("speBuyKey")}</button>
      <button type="button" className="lp-btn spe-sell" onClick={() => game.guess(-1)}>{t("speSellKey")}</button>
      <button type="button" className="lp-btn" disabled={game.current === 0} onClick={game.undo}>{t("speUndo")}</button>
      <span className="spe-hint">{t("speKeysHint")}</span>
    </div>
  );
}
