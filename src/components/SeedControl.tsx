import SliderField from "./SliderField";
import { useI18n } from "../i18n";

type Props = { seed: number; setSeed: (value: number) => void };

const nextSeed = (seed: number) => (seed >= 9999 ? 1 : seed + 1);

/// Seed slider with a Resample button: reproducible randomness for any simulation.
export default function SeedControl({ seed, setSeed }: Props) {
  const { t } = useI18n();
  return (
    <>
      <SliderField label={t("labSeed")} min={1} max={9999} step={1} value={seed} onChange={setSeed} />
      <button className="preset-btn seed-resample-btn" type="button" onClick={() => setSeed(nextSeed(seed))}>
        {t("labResample")}
      </button>
    </>
  );
}
