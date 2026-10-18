import SliderField from "../SliderField";
import { SegmentedControl } from "../ui";
import { useI18n } from "../../i18n";
import type { Playback } from "./usePlayback";

type Props = {
  playback: Playback;
  steps: number;
  /// Label of the scrub slider (e.g. "t", "Day", "Node level").
  label: string;
  formatStep?: (step: number) => string;
  /// Show ◀ / ▶ buttons that move one step (for algorithms you step through).
  showStepButtons?: boolean;
  /// Offer 0.5× / 1× / 2× speed.
  showSpeed?: boolean;
};

const SPEEDS = [0.5, 1, 2] as const;

/// Play / pause, single steps, speed and a scrub slider for a `usePlayback` cursor.
export default function PlaybackControls({ playback, steps, label, formatStep, showStepButtons, showSpeed }: Props) {
  const { t } = useI18n();
  return (
    <div className="playback">
      <div className="playback-buttons">
        <button className="preset-btn" type="button" onClick={playback.toggle} aria-pressed={playback.playing}>
          {t(playback.playing ? "pbPause" : "pbPlay")}
        </button>
        {showStepButtons && (
          <>
            <button className="preset-btn" type="button" onClick={() => playback.stepBy(-1)} disabled={playback.step <= 0} aria-label={t("pbStepBack")}>◀</button>
            <button className="preset-btn" type="button" onClick={() => playback.stepBy(1)} disabled={playback.step >= steps} aria-label={t("pbStepForward")}>▶</button>
          </>
        )}
        {showSpeed && (
          <SegmentedControl<number>
            ariaLabel={t("pbSpeed")}
            value={playback.speed}
            onChange={playback.setSpeed}
            options={SPEEDS.map((s) => ({ value: s, label: `${s}×` }))}
          />
        )}
      </div>
      <SliderField
        label={label}
        min={0}
        max={steps}
        step={1}
        value={playback.step}
        onChange={playback.setStep}
        formatValue={formatStep ?? ((v) => String(v))}
      />
    </div>
  );
}
