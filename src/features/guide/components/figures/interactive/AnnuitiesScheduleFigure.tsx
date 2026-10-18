import { useMemo, useState } from "react";
import { ParentSize } from "@visx/responsive";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import {
  LOAN_AMOUNT,
  LOAN_RATES,
  LOAN_TERMS,
  amortizationSchedule,
  scheduleSummary,
} from "../../../guide.interactive.annuitySchedule.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { pct } from "../figureFormat";
import AnnuitiesScheduleChart from "./AnnuitiesScheduleChart";
import AnnuitiesScheduleDetails from "./AnnuitiesScheduleDetails";

/// A 200,000 loan's yearly payments split into interest and principal; click a year to see its schedule row.
export default function AnnuitiesScheduleFigure() {
  const { t, language } = useI18n();
  const [term, setTerm] = useState<number>(10);
  const [rate, setRate] = useState<number>(0.06);
  const [selected, setSelected] = useState(1);
  const rows = useMemo(() => amortizationSchedule(LOAN_AMOUNT, rate, term), [rate, term]);
  const summary = scheduleSummary(rows);
  const money = useMemo(() => {
    const f = new Intl.NumberFormat(language === "hu" ? "hu-HU" : "en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return (v: number) => f.format(v);
  }, [language]);
  // A selection beyond a shorter term falls back to its last year.
  const row = rows[Math.min(selected, rows.length) - 1];

  return (
    <GuideFigure title={t("ixAnTitle")} labId="tvm">
      <div className="gf-toolbar">
        <div className="ixan-control">
          <span className="ixan-control-label">{t("ixAnTerm")}</span>
          <SegmentedControl<number>
            options={LOAN_TERMS.map((n) => ({ value: n, label: t("ixAnTermOption", { n }) }))}
            value={term}
            onChange={setTerm}
            ariaLabel={t("ixAnTerm")}
          />
        </div>
        <div className="ixan-control">
          <span className="ixan-control-label">{t("ixAnRate")}</span>
          <SegmentedControl<number>
            options={LOAN_RATES.map((r) => ({ value: r, label: pct(r, 0) }))}
            value={rate}
            onChange={setRate}
            ariaLabel={t("ixAnRate")}
          />
        </div>
      </div>
      <p className="ixan-hint">{t("ixAnHint")}</p>
      <div className="gf-chart ixan-chart" role="group" aria-label={t("ixAnAria")}>
        <ParentSize>
          {({ width, height }) =>
            width > 0 && height > 0 ? (
              <AnnuitiesScheduleChart width={width} height={height} rows={rows} loan={LOAN_AMOUNT} selected={row.year} onSelect={setSelected} money={money} />
            ) : null
          }
        </ParentSize>
      </div>
      <ul className="ixan-legend" aria-hidden="true">
        <li><span className="ixan-swatch ixan-swatch--interest" />{t("ixAnInterest")}</li>
        <li><span className="ixan-swatch ixan-swatch--principal" />{t("ixAnPrincipal")}</li>
        <li><span className="ixan-swatch ixan-swatch--balance" />{t("ixAnBalance")}</li>
      </ul>
      <AnnuitiesScheduleDetails row={row} rate={rate} money={money} />
      <FigureReadout
        items={[
          { label: t("ixAnPayment"), value: money(summary.payment), tone: "strong" },
          { label: t("ixAnTotalInterest"), value: money(summary.totalInterest) },
          { label: t("ixAnFirstShare"), value: pct(summary.firstInterestShare), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
