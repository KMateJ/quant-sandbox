import { useState } from "react";
import { CapitalSplitBar } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { fmtCents } from "../spreadEstimation.math";
import type { SpreadEstimationLab } from "../useSpreadEstimationLab";

const pct = (v: number) => (Number.isFinite(v) ? `${Math.round(v * 100)}%` : "–");
const signedPp = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(Math.round(v * 100))}`;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/// Drag the boundary between adverse selection and order processing, then reveal Huang–Stoll and the truth.
export default function SpreadSplit({ lab }: { lab: SpreadEstimationLab }) {
  const { t } = useI18n();
  const [share, setShare] = useState(0.5);
  const [revealed, setRevealed] = useState(false);
  const S = lab.S;
  const hs = lab.estimates.hs;
  const set = (v: number) => !revealed && setShare(clamp01(Math.round(v * 100) / 100));

  return (
    <div className="spe-split">
      <CapitalSplitBar
        label={t("speSplitLabel", { s: fmtCents(S) })}
        segments={[
          { key: "adverse", value: share * S, tone: "debt" },
          { key: "processing", value: (1 - share) * S, tone: "equity" },
        ]}
        scaleMax={S}
        reference={revealed ? { value: lab.alpha * S, label: t("speTruth") } : undefined}
        handle={{
          ariaLabel: t("speSplitAria"),
          valueNow: Math.round(share * 100),
          valueMin: 0,
          valueMax: 100,
          valueText: pct(share),
          onPointerValue: (v) => set(v / S),
          onKeyStep: (step) => set(step === "min" ? 0 : step === "max" ? 1 : share + step / 100),
        }}
      />
      <div className="spe-split-legend">
        <span className="spe-tone spe-tone--adverse">{t("speAdverse")}: {pct(share)}</span>
        <span className="spe-tone spe-tone--processing">{t("speProcessing")}: {pct(1 - share)}</span>
      </div>
      <div className="spe-readout-line" aria-live="polite">
        {revealed ? (
          <>
            <span>{t("speHsEstimate", { share: pct(hs.adverseShare), half: fmtCents(hs.halfSpread) })}</span>
            <span>{t("speTrueAlpha", { share: pct(lab.alpha) })}</span>
            <span>{t("speYourError", { pp: signedPp(share - lab.alpha) })}</span>
            <button type="button" className="lp-btn" onClick={() => setRevealed(false)}>{t("lpTryAgain")}</button>
          </>
        ) : (
          <button type="button" className="lp-btn lp-btn--primary" onClick={() => setRevealed(true)}>{t("lpReveal")}</button>
        )}
      </div>
      <p className="spe-note">{t("speSplitNote")}</p>
    </div>
  );
}
