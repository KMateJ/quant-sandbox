import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { PlaybackControls } from "../../../components/playback";
import type { Playback } from "../../../components/playback";
import { Panel } from "../../../components/layout";
import { useI18n } from "../../../i18n";

type Props = {
  p: number; setP: (v: number) => void;
  n: number; setN: (v: number) => void;
  h: number; setH: (v: number) => void;
  seed: number; setSeed: (v: number) => void;
  playback: Playback;
};

export default function WalkControls({ p, setP, n, setN, h, setH, seed, setSeed, playback }: Props) {
  const { t } = useI18n();
  return (
    <Panel title={t("rwControlsTitle")}>
      <div className="controls-grid">
        <SliderField label={t("rwProbLabel")} min={0.05} max={0.95} step={0.01} value={p} onChange={setP} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("rwStepsLabel")} min={10} max={200} step={10} value={n} onChange={setN} />
        <SliderField label={t("rwSizeLabel")} min={0.25} max={2} step={0.25} value={h} onChange={setH} formatValue={(v) => v.toFixed(2)} />
        <SeedControl seed={seed} setSeed={setSeed} compact />
      </div>
      <p className="lp-ensemble-hint">{t("rwProbHint")}</p>
      <PlaybackControls playback={playback} steps={n} label={t("rwStepCursor")} showSpeed />
    </Panel>
  );
}
