import { StatCard } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { KyleLab } from "../useKyleLab";
import { fmtMoney, fmtPrice } from "./kyleFormat";

/// The secret value card (insider view only) and the round readouts.
export default function InsiderCard({ lab }: { lab: KyleLab }) {
  const { t } = useI18n();
  const { draw, params, price, shown } = lab;
  const gap0 = draw.v - params.p0;
  const closed = gap0 === 0 ? 0 : (price - params.p0) / gap0;
  const impact = price - params.p0;
  return (
    <div className="kyl-card-row">
      {lab.url.view === "insider" && (
        <div className="kyl-card">
          <span className="kyl-card-label">{t("kylYouKnow")}</span>
          <span className="kyl-card-value">{fmtPrice(draw.v)}</span>
          <span className="kyl-card-sub">{t("kylStartPrice", { p: fmtPrice(params.p0) })}</span>
        </div>
      )}
      <div className="kyl-readouts">
        <StatCard label={t("kylLeft")} value={String(params.n - shown.length)} />
        {lab.url.view === "insider" && <StatCard label={t("kylGapClosed")} value={`${Math.round(closed * 100)}%`} />}
        <StatCard label={t("kylImpact")} value={`${impact >= 0 ? "+" : "−"}${fmtPrice(Math.abs(impact))}`} />
        {lab.url.view === "insider" && <StatCard label={t("kylYourProfit")} value={fmtMoney(lab.yours)} />}
        {lab.url.view === "insider" && <StatCard label={t("kylOptProfit")} value={fmtMoney(lab.best)} />}
      </div>
    </div>
  );
}
