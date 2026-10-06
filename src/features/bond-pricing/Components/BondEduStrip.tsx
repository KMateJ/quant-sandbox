import { useI18n } from "../../../i18n";
import { priceChangePct } from "../bondPricing.math";

type Props = {
  modified: number;
  convexity: number;
};

/// Compact educational strip that restates the current bond's duration sensitivity
/// in plain language, updating live as the parameters change.
export default function BondEduStrip({ modified, convexity }: Props) {
  const { t } = useI18n();
  const { duration } = priceChangePct(modified, convexity, 0.01);
  const signed = `${duration >= 0 ? "+" : "−"}${Math.abs(duration).toFixed(2)}%`;

  return (
    <p className="bond-py-edu">
      {t("bondEduLead")} <b className="bond-py-edu-delta">{signed}</b> {t("bondEduTail")}{" "}
      {t("bondEduConvexity")}
    </p>
  );
}
