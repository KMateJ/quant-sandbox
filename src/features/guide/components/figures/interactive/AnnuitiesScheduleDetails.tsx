import { useI18n } from "../../../../../i18n";
import type { ScheduleRow } from "../../../guide.interactive.annuitySchedule.math";
import { pct } from "../figureFormat";

type Props = { row: ScheduleRow; rate: number; money: (v: number) => string };

/// The selected year's row of the schedule, with each figure worked out.
export default function AnnuitiesScheduleDetails({ row, rate, money }: Props) {
  const { t } = useI18n();
  const values = {
    rate: pct(rate, 0),
    opening: money(row.opening),
    payment: money(row.payment),
    interest: money(row.interest),
    principal: money(row.principal),
    closing: money(row.closing),
  };

  return (
    <div className="ixan-details" aria-live="polite">
      <div className="ixan-details-title">{t("ixAnYear", { year: row.year })}</div>
      <dl className="ixan-details-grid">
        <dt>{t("ixAnOpening")}</dt>
        <dd>{values.opening}</dd>
        <dt>{t("ixAnPayment")}</dt>
        <dd>{values.payment}</dd>
        <dt>{t("ixAnInterest")}</dt>
        <dd>{t("ixAnInterestLine", values)}</dd>
        <dt>{t("ixAnPrincipal")}</dt>
        <dd>{t("ixAnPrincipalLine", values)}</dd>
        <dt>{t("ixAnClosing")}</dt>
        <dd>{t("ixAnClosingLine", values)}</dd>
      </dl>
    </div>
  );
}
