import { useI18n } from "../../../../i18n";
import { isSignificant, ladderDomain } from "../../alpha.math";
import type { AlphaRung } from "../../fund.types";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Alpha with a ±2 standard-error whisker for each model; the current model's row is tinted.
export default function AlphaLadder({ rungs, current }: { rungs: AlphaRung[]; current: AlphaRung["model"] | null }) {
  const { t } = useI18n();
  const [lo, hi] = ladderDomain(rungs);
  const at = (v: number) => `${((v - lo) / (hi - lo)) * 100}%`;
  return (
    <div className="ffm-ladder" role="table" aria-label={t("ffmLadderAria")}>
      {rungs.map((r) => (
        <div key={r.model} role="row" className={r.model === current ? "ffm-ladder-row is-current" : "ffm-ladder-row"}>
          <span role="cell" className="ffm-ladder-name">{t(`ffmModel_${r.model}`)}</span>
          <span role="cell" className="ffm-ladder-track">
            <span className="ffm-ladder-zero" style={{ left: at(0) }} />
            <span className="ffm-ladder-whisker" style={{ left: at(r.fit.lo), width: `${((r.fit.hi - r.fit.lo) / (hi - lo)) * 100}%` }} />
            <span className={isSignificant(r.fit.alphaT) ? "ffm-ladder-dot is-sig" : "ffm-ladder-dot"} style={{ left: at(r.fit.alphaAnnual) }} />
          </span>
          <span role="cell" className="ffm-ladder-value">
            {pct(r.fit.alphaAnnual)} · t {r.fit.alphaT.toFixed(1)} · {t(isSignificant(r.fit.alphaT) ? "ffmSignificant" : "ffmNotSignificant")}
          </span>
        </div>
      ))}
    </div>
  );
}
