import SliderField from "./SliderField";
import { useI18n } from "../i18n";

/// `compact` shows only the Resample button and the current seed, for labs where the seed number itself isn't a control.
type Props = { seed: number; setSeed: (value: number) => void; compact?: boolean };

const nextSeed = (seed: number) => (seed >= 9999 ? 1 : seed + 1);

/// Seed slider with a Resample button: reproducible randomness for any simulation.
export default function SeedControl({ seed, setSeed, compact = false }: Props) {
  const { t } = useI18n();
  const resample = (
    <button className="preset-btn seed-resample-btn" type="button" onClick={() => setSeed(nextSeed(seed))}>
      {t("labResample")}
    </button>
  );
  if (compact) {
    return (
      <div className="seed-compact">
        {resample}
        <span className="seed-readout">{t("labSeed")}: {seed}</span>
      </div>
    );
  }
  return (
    <>
      <SliderField label={t("labSeed")} min={1} max={9999} step={1} value={seed} onChange={setSeed} />
      {resample}
    </>
  );
}
