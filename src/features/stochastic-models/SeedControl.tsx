import SliderField from "../../components/SliderField";
import { useI18n } from "../../i18n";

type Props = { seed: number; setSeed: (value: number) => void };

const nextSeed = (seed: number) => (seed >= 9999 ? 1 : seed + 1);

/// Seed slider with a Resample button — the reproducible-randomness control shared by experiments.
export default function SeedControl({ seed, setSeed }: Props) {
  const { t } = useI18n();
  return (
    <>
      <SliderField label={t("stochWalkSeed")} min={1} max={9999} step={1} value={seed} onChange={setSeed} />
      <button className="preset-btn stoch-resample-btn" type="button" onClick={() => setSeed(nextSeed(seed))}>
        {t("stochResample")}
      </button>
    </>
  );
}
