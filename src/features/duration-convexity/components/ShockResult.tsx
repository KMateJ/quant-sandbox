import { useI18n } from "../../../i18n";
import { IntuitionTrigger } from "../../../components/intuition";
import type { DcModel } from "../useDurationConvexity";

type Props = { model: DcModel };

function ResultRow({ label, value, sectionId, muted = false }: {
  label: string; value: string; sectionId: string; muted?: boolean;
}) {
  return (
    <div className={`dc-compare-row${muted ? " muted" : ""}`}>
      <span className="intuition-reveal intuition-control-help">{label}<IntuitionTrigger sectionId={sectionId} /></span>
      <span className="dc-compare-num">{value}</span>
    </div>
  );
}

/// Compare exact repricing with both approximations at the selected shock.
export default function ShockResult({ model }: Props) {
  const { t } = useI18n();
  const r = model.result;
  const signPct = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}%`;
  const bp = (v: number) => `${v.toFixed(0)} bp`;
  const shockSign = r.dyBp > 0 ? "+" : "";

  return (
    <div className="dc-compare">
      <div className="dc-compare-shock">
        <span className="dc-compare-shock-label intuition-reveal intuition-control-help">{t("dcResultShock")}<IntuitionTrigger sectionId="yield-shock" /></span>
        <span className="dc-compare-shock-value">
          {shockSign}
          {r.dyBp} bp
        </span>
      </div>

      <div className="dc-compare-group">
        <div className="dc-compare-head" data-tone="exact">
          {t("dcResultExact")}
        </div>
        <ResultRow label={t("dcResultPriceChange")} value={signPct(r.exactPct)} sectionId="exact-repricing" />
        <ResultRow label={t("dcResultNewPrice")} value={r.newPrice.toFixed(2)} sectionId="exact-repricing" />
      </div>

      <div className="dc-compare-group">
        <div className="dc-compare-head" data-tone="duration">
          {t("dcResultDuration")}
        </div>
        <ResultRow label={t("dcResultEstimate")} value={signPct(r.durationPct)} sectionId="modified-duration" />
        <ResultRow label={t("dcResultError")} value={signPct(r.durationErrPct)} sectionId="approximation-error" />
        <ResultRow label={t("dcResultErrorBp")} value={bp(r.durationErrBp)} sectionId="approximation-error" muted />
      </div>

      <div className="dc-compare-group">
        <div className="dc-compare-head" data-tone="durconvex">
          {t("dcResultDurConvex")}
        </div>
        <ResultRow label={t("dcResultEstimate")} value={signPct(r.durConvexPct)} sectionId="convexity" />
        <ResultRow label={t("dcResultError")} value={signPct(r.durConvexErrPct)} sectionId="approximation-error" />
        <ResultRow label={t("dcResultErrorBp")} value={bp(r.durConvexErrBp)} sectionId="approximation-error" muted />
      </div>

    </div>
  );
}
