import { useState } from "react";
import { lineCoefficients, ScatterChart, SketchLayer, type ScatterSeries, type SketchPoint } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { diffVariance, fmtCents, lagPairs, rollFromSlope } from "../spreadEstimation.math";
import type { SpreadEstimationLab } from "../useSpreadEstimationLab";

/// Slope tab: draw a line through (Δpₜ₋₁, Δpₜ); its slope gives Roll's spread. Reveal shows the data's estimate.
export default function SlopeTab({ lab, isMobile }: { lab: SpreadEstimationLab; isMobile: boolean }) {
  const { t } = useI18n();
  const [line, setLine] = useState<SketchPoint[]>([]);
  const [revealed, setRevealed] = useState(false);
  const pairs = lagPairs(lab.tape);
  const varDp = diffVariance(lab.tape);
  const ext = Math.max(1, ...pairs.map((p) => Math.max(Math.abs(p.x), Math.abs(p.y)))) * 1.1;
  const slope = lineCoefficients(line)?.slope ?? null;
  const dataSlope = lab.estimates.roll.cov / varDp;
  const yours = slope === null ? NaN : rollFromSlope(slope, varDp);

  const series: ScatterSeries[] = [
    { key: "pairs", label: t("speLagPairs"), color: "var(--text-dim)", radius: 3, opacity: 0.55, outline: false, points: pairs },
  ];
  if (revealed) {
    series.push({ key: "ols", label: t("speDataSlope"), color: "var(--primary)", line: true, strokeWidth: 2, points: [{ x: -ext, y: -ext * dataSlope }, { x: ext, y: ext * dataSlope }] });
  }

  return (
    <div className="spe-tab">
      <p className="spe-lead">{t("speSlopeLead")}</p>
      <div className="chart-wrap spe-chart">
        <ScatterChart
          series={series}
          xDomain={[-ext, ext]}
          yDomain={[-ext, ext]}
          referenceLines={[{ axis: "x", value: 0, dash: "2 4" }, { axis: "y", value: 0, dash: "2 4" }]}
          isMobile={isMobile}
          xFormat={(v) => v.toFixed(0)}
          yFormat={(v) => v.toFixed(0)}
          xLabel={t("speDpPrev")}
          yLabel={t("speDpNow")}
          layer={(frame) => (
            <SketchLayer frame={frame} mode="line" value={line} onChange={revealed ? () => {} : setLine} ariaLabel={t("speSketchAria")} color="var(--accent)" />
          )}
        />
      </div>
      <div className="spe-readout-line" aria-live="polite">
        <span>{slope === null ? t("speDrawHint") : t("speYourSlope", { slope: slope.toFixed(2), s: fmtCents(yours) })}</span>
        {revealed ? (
          <>
            <span>{lab.estimates.roll.defined ? t("speDataRoll", { slope: dataSlope.toFixed(2), s: fmtCents(lab.estimates.roll.s) }) : t("speRollUndefined")}</span>
            <span>{t("speTrueS", { s: fmtCents(lab.S) })}</span>
            <button type="button" className="lp-btn" onClick={() => { setRevealed(false); setLine([]); }}>{t("lpTryAgain")}</button>
          </>
        ) : (
          <button type="button" className="lp-btn lp-btn--primary" disabled={slope === null} onClick={() => setRevealed(true)}>{t("lpReveal")}</button>
        )}
      </div>
    </div>
  );
}
