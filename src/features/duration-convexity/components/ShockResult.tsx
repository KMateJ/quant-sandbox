import { useI18n } from "../../../i18n";
import type { DcModel } from "../useDurationConvexity";

type Props = { model: DcModel };

/// Compact, aligned comparison of the exact repricing against the duration and
/// duration+convexity estimates at the selected shock, plus a one-line insight.
export default function ShockResult({ model }: Props) {
  const { t } = useI18n();
  const r = model.result;
  const signPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
  const bp = (v: number) => `${v.toFixed(0)} bp`;
  const shockSign = r.dyBp > 0 ? "+" : "";

  const insight =
    r.dyBp < 0 ? t("dcInsightFall") : r.dyBp > 0 ? t("dcInsightRise") : t("dcInsightFlat");

  return (
    <div className="dc-compare">
      <div className="dc-compare-shock">
        <span className="dc-compare-shock-label">{t("dcResultShock")}</span>
        <span className="dc-compare-shock-value">
          {shockSign}
          {r.dyBp} bp
        </span>
      </div>

      <div className="dc-compare-group">
        <div className="dc-compare-head" data-tone="exact">
          {t("dcResultExact")}
        </div>
        <div className="dc-compare-row">
          <span>{t("dcResultPriceChange")}</span>
          <span className="dc-compare-num">{signPct(r.exactPct)}</span>
        </div>
        <div className="dc-compare-row">
          <span>{t("dcResultNewPrice")}</span>
          <span className="dc-compare-num">{r.newPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="dc-compare-group">
        <div className="dc-compare-head" data-tone="duration">
          {t("dcResultDuration")}
        </div>
        <div className="dc-compare-row">
          <span>{t("dcResultEstimate")}</span>
          <span className="dc-compare-num">{signPct(r.durationPct)}</span>
        </div>
        <div className="dc-compare-row">
          <span>{t("dcResultError")}</span>
          <span className="dc-compare-num">{signPct(r.durationErrPct)}</span>
        </div>
        <div className="dc-compare-row muted">
          <span>{t("dcResultErrorBp")}</span>
          <span className="dc-compare-num">{bp(r.durationErrBp)}</span>
        </div>
      </div>

      <div className="dc-compare-group">
        <div className="dc-compare-head" data-tone="durconvex">
          {t("dcResultDurConvex")}
        </div>
        <div className="dc-compare-row">
          <span>{t("dcResultEstimate")}</span>
          <span className="dc-compare-num">{signPct(r.durConvexPct)}</span>
        </div>
        <div className="dc-compare-row">
          <span>{t("dcResultError")}</span>
          <span className="dc-compare-num">{signPct(r.durConvexErrPct)}</span>
        </div>
        <div className="dc-compare-row muted">
          <span>{t("dcResultErrorBp")}</span>
          <span className="dc-compare-num">{bp(r.durConvexErrBp)}</span>
        </div>
      </div>

      <p className="dc-compare-insight">{insight}</p>
    </div>
  );
}
