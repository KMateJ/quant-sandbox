import { useMemo } from "react";
import SliderField from "../../../components/SliderField";
import { useI18n } from "../../../i18n";
import { feasibleCorrRange } from "../portfolioLab.math";
import type { Asset } from "../portfolioLab.types";

type Props = {
  assets: Asset[];
  corr: number[][];
  pair: [number, number];
  onScrub: (i: number, j: number, v: number) => void;
  /// Fires when the reader grabs the slider (pointer or key), e.g. to pin the current frontier first.
  onScrubStart: () => void;
};

const SCRUB_KEYS = /^(Arrow|Page|Home$|End$)/;

/// Slider for the selected ρij. Values are clamped to the interval that keeps the matrix positive semidefinite
/// with the other correlations fixed; that interval is shown as a band on the track.
export default function CorrScrubber({ assets, corr, pair, onScrub, onScrubStart }: Props) {
  const { t } = useI18n();
  const [i, j] = pair;
  const [lo, hi] = useMemo(() => feasibleCorrRange(corr, i, j), [corr, i, j]);
  const value = corr[i][j];
  const at = (v: number) => `${((v + 1) / 2) * 100}%`;

  return (
    <div
      className="pl-corr-scrub"
      onPointerDownCapture={onScrubStart}
      onKeyDownCapture={(e) => {
        if (SCRUB_KEYS.test(e.key)) onScrubStart();
      }}
    >
      <SliderField
        label={t("portfolioCorrScrubLabel", { a: assets[i].name, b: assets[j].name })}
        min={-1}
        max={1}
        step={0.01}
        value={value}
        onChange={(v) => onScrub(i, j, Math.max(lo, Math.min(hi, v)))}
        formatValue={(v) => v.toFixed(2)}
      />
      <div className="pl-corr-band" aria-hidden="true">
        <span style={{ left: at(lo), width: `calc(${at(hi)} - ${at(lo)})` }} />
      </div>
      <p className="pl-corr-range">{t("portfolioCorrFeasible", { lo: lo.toFixed(2), hi: hi.toFixed(2) })}</p>
    </div>
  );
}
