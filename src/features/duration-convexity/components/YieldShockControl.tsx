import { useI18n } from "../../../i18n";
import type { DcModel } from "../useDurationConvexity";

type Props = { model: DcModel };

/// Fill the slider track from the 0 centre out to the thumb (diverging), rather
/// than from the left edge, so the centred nature of the shock is obvious.
function divergingFill(value: number, min: number, max: number) {
  const span = max - min || 1;
  const pct = (v: number) => ((v - min) / span) * 100;
  const zero = pct(0);
  const cur = pct(value);
  const from = Math.min(zero, cur);
  const to = Math.max(zero, cur);
  return {
    background: `linear-gradient(90deg, var(--surface-muted) ${from}%, var(--primary) ${from}%, var(--primary) ${to}%, var(--surface-muted) ${to}%)`,
  };
}

/// The page's primary control: a 0-centred yield-shock slider (±maxBp) with a
/// large Δy readout and precise numeric entry.
export default function YieldShockControl({ model }: Props) {
  const { t } = useI18n();
  const { shockBp, setShockBp, maxBp } = model;
  const clamp = (v: number) => Math.max(-maxBp, Math.min(maxBp, v));
  const sign = shockBp > 0 ? "+" : "";
  const tone = shockBp > 0 ? "pos" : shockBp < 0 ? "neg" : "";

  return (
    <div className="dc-shock">
      <div className="dc-shock-top">
        <div className="dc-shock-readout">
          <span className="dc-shock-caption">{t("dcShockCaption")}</span>
          <span className={`dc-shock-value ${tone}`}>
            {sign}
            {shockBp} bp
          </span>
        </div>
        <label className="dc-shock-entry num-field">
          <span className="num-label">{t("dcShockPrecise")}</span>
          <span className="num-input-wrap">
            <input
              className="num-input"
              type="number"
              value={shockBp}
              min={-maxBp}
              max={maxBp}
              step={5}
              onChange={(e) => {
                const raw = Number(e.target.value);
                if (!Number.isNaN(raw)) setShockBp(clamp(raw));
              }}
            />
            <span className="num-suffix">bp</span>
          </span>
        </label>
      </div>

      <div className="dc-shock-track">
        <input
          className="slider-input"
          type="range"
          min={-maxBp}
          max={maxBp}
          step={1}
          value={shockBp}
          style={divergingFill(shockBp, -maxBp, maxBp)}
          onChange={(e) => setShockBp(Number(e.target.value))}
          aria-label={t("dcShockCaption")}
        />
        <div className="dc-shock-marks">
          <span>−{maxBp}</span>
          <span>0</span>
          <span>+{maxBp}</span>
        </div>
      </div>
      <p className="dc-shock-hint">{t("dcShockHint")}</p>
    </div>
  );
}
