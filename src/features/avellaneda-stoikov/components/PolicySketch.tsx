import { ScatterChart, SERIES_ROLE, SketchLayer } from "../../../components/charts";
import NumberStepper from "../../../components/NumberStepper";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { asCurve, asMeanHalfSpread, flatCurve, MIN_DIFF, POLICY_QS } from "../policy.math";
import type { AvsLab } from "../useAvellanedaStoikovLab";

const Y_RANGE: [number, number] = [-2, 2];
const usd = (v: number) => `${v >= 0 ? "+" : "−"}$${Math.abs(v).toFixed(2)}`;

/// Draw your reservation offset against inventory (at the open; it fades to 0 at the close like AS's).
export default function PolicySketch({ lab }: { lab: AvsLab }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { params, points, setPoints } = lab;
  const ghost = asCurve(params.gamma, lab.t, params).filter((p) => p.y >= Y_RANGE[0] && p.y <= Y_RANGE[1]);
  return (
    <div className="avs-policy">
      <p className="avs-caption">{t("avsPolicyHint", { t: lab.t.toFixed(2) })}</p>
      <div className="avs-policy-chart">
        <ScatterChart
          series={[
            { key: "as", label: t("avsAsGhost", { t: lab.t.toFixed(2) }), color: SERIES_ROLE.reference, line: true, dash: "5 4", points: ghost },
            { key: "yours", label: t("avsYourPolicy"), color: "var(--primary)", line: true, strokeWidth: 2, points },
          ]}
          xDomain={[-10, 10]}
          yDomain={Y_RANGE}
          referenceLines={[{ axis: "y", value: 0, color: "var(--border)" }, { axis: "x", value: 0, color: "var(--border)" }]}
          xTickValues={[-10, -5, 0, 5, 10]}
          isMobile={isMobile}
          legend
          xLabel={t("avsAxisQ")}
          yLabel={t("avsAxisOffset")}
          yFormat={usd}
          layer={(frame) => (
            <SketchLayer frame={frame} mode="curve" value={points} onChange={setPoints} xGrid={POLICY_QS} yRange={Y_RANGE} ariaLabel={t("avsSketchAria")} />
          )}
        />
      </div>
      <div className="avs-policy-actions">
        <button type="button" className="lp-btn" onClick={() => setPoints(asCurve(params.gamma, 0, params))}>{t("avsCopyAs")}</button>
        <button type="button" className="lp-btn" onClick={() => setPoints(flatCurve())}>{t("avsFlatPolicy")}</button>
        <button type="button" className="lp-btn" onClick={() => lab.setHalfSpread(asMeanHalfSpread(params.gamma, params))}>{t("avsAsSpread")}</button>
        <NumberStepper label={t("avsHalfSpread")} value={lab.halfSpread} min={0.05} max={3} step={0.05} onChange={lab.setHalfSpread} formatValue={(v) => `$${v.toFixed(2)}`} />
      </div>
      {lab.url.mode === "challenge" && lab.tooClose && <p className="avs-caption avs-warn">{t("avsTooClose", { d: MIN_DIFF.toFixed(2) })}</p>}
    </div>
  );
}
