import { PlaybackControls } from "../../../components/playback";
import { ControlGroup } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { TranslationKey } from "../../../i18n";
import type { TimeCursor } from "./useTimeCursor";

type Props = { cursor: TimeCursor; steps: number; labelKey: TranslationKey; hintKey?: TranslationKey };

/// Scrubbable time slider on [0, 1] with a play/pause sweep.
export default function TimeCursorControl({ cursor, steps, labelKey, hintKey }: Props) {
  const { t } = useI18n();
  return (
    <ControlGroup label={t(labelKey)} hint={hintKey && <span className="stoch-control-hint">{t(hintKey)}</span>}>
      <PlaybackControls playback={cursor} steps={steps} label="t" formatStep={(value) => (value / steps).toFixed(2)} />
    </ControlGroup>
  );
}
