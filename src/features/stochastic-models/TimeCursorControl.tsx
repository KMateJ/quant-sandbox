import SliderField from "../../components/SliderField";
import { ControlGroup } from "../../components/ui";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";
import type { TimeCursor } from "./useTimeCursor";

type Props = { cursor: TimeCursor; steps: number; labelKey: TranslationKey; hintKey?: TranslationKey };

/// Scrubbable time slider on [0, 1] with a play/pause sweep.
export default function TimeCursorControl({ cursor, steps, labelKey, hintKey }: Props) {
  const { t } = useI18n();
  return (
    <ControlGroup label={t(labelKey)} hint={hintKey && <span className="stoch-control-hint">{t(hintKey)}</span>}>
      <SliderField
        label="t"
        min={1}
        max={steps}
        step={1}
        value={cursor.step}
        onChange={cursor.setStep}
        formatValue={(value) => (value / steps).toFixed(2)}
      />
      <div className="stoch-playback-row">
        <button className="preset-btn" type="button" onClick={cursor.toggle}>
          {t(cursor.playing ? "stochPause" : "stochPlay")}
        </button>
      </div>
    </ControlGroup>
  );
}
