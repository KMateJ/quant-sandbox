import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { YieldCurveModel } from "../useYieldCurve";
import { pct2, df4, YC_COLORS } from "../curveChartUtils";
import { effectDelta, formatDelta, type EffectKey } from "../effects.math";
import CurveObservations from "./CurveObservations";

export default function SelectedReadout({ model }: { model: YieldCurveModel }) {
  const { t } = useI18n();
  const { term, beforeTerm, selected } = model;
  const p = term[selected];
  const before = beforeTerm[selected];
  const rows: { key: EffectKey; label: string; section: string; color: string }[] = [
    { key: "par", label: t("ycParRate"), section: "par-rate", color: YC_COLORS.par },
    { key: "zero", label: t("ycZeroRate"), section: "zero-rate", color: YC_COLORS.zero },
    { key: "fwd", label: `${term[selected - 1]?.label ?? "0"} \u2192 ${p.label} ${t("ycForwardShort")}`, section: "forward-rate", color: YC_COLORS.forward },
    { key: "df", label: t("ycDiscountFactor"), section: "discount-factor", color: YC_COLORS.df },
  ];

  return (
    <section className="yc-readout" aria-label={t("ycCauseEffect")}>
      <div className="yc-readout-head">
        <h2>{t("ycSelectedMaturity")}: <strong>{p.label}</strong></h2>
        <span className="yc-hint">{t("ycComparisonCaption")}</span>
      </div>
      <div className="yc-effect-layout">
        <dl className="yc-effect-values">
          {rows.map(({ key, label, section, color }) => (
            <div key={key} className="yc-effect-row" style={{ borderTopColor: color }}>
              <dt>{label} <IntuitionTrigger variant="question" sectionId={section} /></dt>
              <dd>
                <span className="yc-change-values">
                <span className="yc-before">{key === "df" ? df4(before[key]) : pct2(before[key])}</span>
                <span aria-hidden="true">{"\u2192"}</span>
                <strong>{key === "df" ? df4(p[key]) : pct2(p[key])}</strong>
                </span>
                <span className="yc-delta" style={{ color }}>{formatDelta(effectDelta(before, p, key), key === "df")}</span>
              </dd>
            </div>
          ))}
        </dl>
        <CurveObservations before={before} after={p} />
      </div>
    </section>
  );
}
