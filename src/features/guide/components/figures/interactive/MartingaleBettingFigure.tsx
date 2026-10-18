import SegmentedControl from "../../../../../components/ui/SegmentedControl";
import { useI18n } from "../../../../../i18n";
import { stakeFor, type BettingStrategy } from "../../../guide.interactive.martingaleBetting.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import MartingaleBettingHistogram from "./MartingaleBettingHistogram";
import MartingaleBettingPath from "./MartingaleBettingPath";
import { useMartingaleBetting } from "./MartingaleBettingSim";

/// A fair coin game: every strategy keeps the average wealth at the start, but spreads it very differently.
export default function MartingaleBettingFigure() {
  const { t } = useI18n();
  const game = useMartingaleBetting();
  const { player, crowd } = game;
  const round = player.path.length - 1;
  const strategies: { value: BettingStrategy; label: string }[] = [
    { value: "constant", label: t("ixMgConstant") },
    { value: "doubling", label: t("ixMgDoubling") },
    { value: "fraction", label: t("ixMgFraction") },
  ];

  return (
    <GuideFigure title={t("ixMgTitle")} labId="brownian-motion">
      <SegmentedControl<BettingStrategy> options={strategies} value={game.strategy} onChange={game.setStrategy} ariaLabel={t("ixMgStrategyAria")} className="ixmg-strategy" />
      <div className="gf-toolbar ixmg-controls" role="group" aria-label={t("ixMgControlsAria")}>
        <button type="button" className="preset-btn" onClick={game.flip} disabled={game.playing || player.wealth <= 0}>{t("ixMgFlip")}</button>
        <button type="button" className="preset-btn" onClick={game.play} disabled={game.playing || player.wealth <= 0}>{t("ixMgPlay100")}</button>
        <button type="button" className="preset-btn preset-btn--active" onClick={game.simulate}>{t("ixMgCrowd")}</button>
        <button type="button" className="preset-btn" onClick={game.reset}>{t("ixMgReset")}</button>
        <span className="ixmg-round" aria-live="polite">{t("ixMgRound", { n: round })}</span>
      </div>
      <div className="ixmg-head">{t("ixMgPathHead")}</div>
      <div className="gf-chart ixmg-chart" role="img" aria-label={t("ixMgPathAria")}>
        <MartingaleBettingPath path={player.path} />
      </div>
      <div className="ixmg-head">{t("ixMgHistHead")}</div>
      {crowd ? (
        <div className="gf-chart ixmg-hist" role="img" aria-label={t("ixMgHistAria")}>
          <MartingaleBettingHistogram crowd={crowd} />
        </div>
      ) : (
        <p className="ixmg-empty">{t("ixMgHistEmpty")}</p>
      )}
      <FigureReadout
        items={[
          { label: t("ixMgWealth"), value: fmt(player.wealth, 2), tone: "strong" },
          { label: t("ixMgNextStake"), value: fmt(stakeFor(player, game.strategy), 2) },
          { label: t("ixMgCrowdMean"), value: crowd ? `${fmt(crowd.mean, 1)} ± ${fmt(1.96 * crowd.se, 1)}` : "–", tone: "accent" },
          { label: t("ixMgAhead"), value: crowd ? pct(crowd.shareAhead, 1) : "–" },
          { label: t("ixMgWorst"), value: crowd ? fmt(crowd.worst, 1) : "–" },
        ]}
      />
    </GuideFigure>
  );
}
