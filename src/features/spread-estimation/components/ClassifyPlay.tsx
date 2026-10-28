import { useI18n } from "../../../i18n";
import type { ClassifyGame } from "../useClassifyGame";
import ClassifyBar from "./ClassifyBar";
import TapeChart from "./TapeChart";

type Props = { game: ClassifyGame; onRestart: () => void; isMobile: boolean };

/// The classify game: the tape grows one print at a time, true sides stay hidden until the end.
export default function ClassifyPlay({ game, onRestart, isMobile }: Props) {
  const { t } = useI18n();
  const shown = game.done ? game.game : game.game.slice(0, game.current + 1);
  return (
    <>
      <p className="spe-lead">{t("speClassifyLead")}</p>
      <div className="chart-wrap spe-chart">
        <TapeChart prints={shown} revealed={game.done} current={game.done ? undefined : game.current} wrong={game.wrong} frame={game.game} isMobile={isMobile} />
      </div>
      <ClassifyBar game={game} onRestart={onRestart} />
    </>
  );
}
