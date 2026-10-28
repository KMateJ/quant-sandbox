import { useState } from "react";
import { SegmentedControl } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { useClassifyGame } from "../useClassifyGame";
import type { SpreadEstimationLab } from "../useSpreadEstimationLab";
import ClassifyPlay from "./ClassifyPlay";
import TapeChart from "./TapeChart";

type View = "watch" | "classify";

/// Tape tab: watch the bounce (reveal the efficient price) or practise classifying prints.
export default function TapeTab({ lab, isMobile }: { lab: SpreadEstimationLab; isMobile: boolean }) {
  const { t } = useI18n();
  const [view, setView] = useState<View>("watch");
  const [revealed, setRevealed] = useState(false);
  const [round, setRound] = useState(0);
  const game = useClassifyGame(lab.tape, `${lab.seed}|${lab.S}|${lab.sigma}|${lab.alpha}|${round}`);

  return (
    <div className="spe-tab">
      <div className="spe-tab-bar">
        <SegmentedControl<View>
          ariaLabel={t("speTapeViewAria")}
          value={view}
          onChange={setView}
          options={[{ value: "watch", label: t("speWatch") }, { value: "classify", label: t("speClassify") }]}
        />
        {view === "watch" && (
          <button type="button" className="lp-btn" aria-pressed={revealed} onClick={() => setRevealed((r) => !r)}>
            {t(revealed ? "speHideEfficient" : "speRevealEfficient")}
          </button>
        )}
      </div>
      {view === "watch" ? (
        <div className="chart-wrap spe-chart">
          <TapeChart prints={lab.tape} revealed={revealed} isMobile={isMobile} />
        </div>
      ) : (
        <ClassifyPlay game={game} onRestart={() => setRound((r) => r + 1)} isMobile={isMobile} />
      )}
    </div>
  );
}
