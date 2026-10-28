import { useState } from "react";
import { PlaybackControls, usePlayback } from "../../../../../components/playback";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { COIN_PATHS, randomTime, stoppingCheck, type RandomTime } from "../../../guide.stochastic.math";
import GuideFigure from "../../GuideFigure";
import FiltrationTreeSvg from "./FiltrationTreeSvg";

const FLIPS = 3;

/// Information growing over three coin flips: the atoms of 𝓕_k, and whether a random time is a stopping time at k.
export default function FiltrationTreeFigure() {
  const { t } = useI18n();
  const playback = usePlayback({ steps: FLIPS, initial: 1, durationMs: 3000 });
  const [kind, setKind] = useState<RandomTime>("firstH");
  const k = playback.step;
  const check = stoppingCheck(kind, k);
  const times = COIN_PATHS.map((p) => randomTime(kind, p));

  return (
    <GuideFigure title={t("gsFiltrationTitle")} labId="random-walk">
      <div className="gf-toolbar">
        <SegmentedControl<RandomTime>
          ariaLabel={t("gsRandomTime")}
          value={kind}
          onChange={setKind}
          options={[{ value: "firstH", label: t("gsFirstH") }, { value: "lastH", label: t("gsLastH") }]}
        />
      </div>
      <PlaybackControls playback={playback} steps={FLIPS} label={t("gsTimeK")} formatStep={(v) => `k = ${v}`} showStepButtons />
      <FiltrationTreeSvg k={k} times={times} label={t("gsFiltrationAria", { k, atoms: 2 ** k })} noneLabel={t("gsNever")} />
      <p className="gs-verdict" aria-live="polite">
        {t("gsAtoms", { k, n: 2 ** k })}{" "}
        {check.measurable
          ? t("gsMeasurable", { k })
          : t("gsNotMeasurable", { k, a: check.pair![0], b: check.pair![1] })}
      </p>
    </GuideFigure>
  );
}
