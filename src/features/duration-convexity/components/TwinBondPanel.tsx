import { useI18n } from "../../../i18n";
import type { DcModel } from "../useDurationConvexity";

type Props = {
  model: DcModel;
  /// Predict mode before the reveal: keep the rows (so the layout holds) but show no numbers.
  masked: boolean;
};

const signPct = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)}%`;

/// "Seesaw": a zero-coupon twin with the same modified duration but a different convexity, priced against
/// bond A at the selected shock.
export default function TwinBondPanel({ model, masked }: Props) {
  const { t } = useI18n();
  const { twin, result, measures } = model;
  if (!twin) return null;

  const a = result.exactPct;
  const b = twin.pct(result.dyBp);
  const diff = b - a;
  const same = Math.abs(twin.convexity - measures.convexity) < 1e-6;
  const moreConvex = twin.convexity > measures.convexity ? "B" : "A";
  const show = (v: string) => (masked ? "—" : v);

  return (
    <div className="dc-twin">
      <div className="dc-compare-row">
        <span>{t("dcTwinBond", { years: twin.years.toFixed(2) })}</span>
        <span className="dc-compare-num">D {measures.modified.toFixed(2)} · C {twin.convexity.toFixed(1)}</span>
      </div>
      <div className="dc-compare-row">
        <span>{t("dcTwinChangeA")} (C {measures.convexity.toFixed(1)})</span>
        <span className="dc-compare-num">{show(signPct(a))}</span>
      </div>
      <div className="dc-compare-row">
        <span>{t("dcTwinChangeB")}</span>
        <span className="dc-compare-num">{show(signPct(b))}</span>
      </div>
      <div className="dc-compare-row dc-twin-diff">
        <span>{t("dcTwinDiff")}</span>
        <span className="dc-compare-num">{show(signPct(diff))}</span>
      </div>
      <p className="dc-shock-hint">{same ? t("dcTwinSame") : t("dcTwinNote", { who: moreConvex })}</p>
    </div>
  );
}
