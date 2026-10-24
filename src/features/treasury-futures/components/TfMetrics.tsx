import { useI18n } from "../../../i18n";
import type { TreasuryFuturesModel } from "../useTreasuryFutures";

function Metric({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return <div className={`tf-metric${accent ? " accent" : ""}`}><span>{label}</span><strong>{value}</strong></div>;
}

/// Futures price, CTD, its net basis and the gap to the runner-up, then the conversion factor strip.
export default function TfMetrics({ lab }: { lab: TreasuryFuturesModel }) {
  const { t } = useI18n();
  const { data, ctd, ranked, bund } = lab;
  return (
    <>
      {!bund && <div className="tf-metrics">
        <Metric label={t("tfFuturesPrice")} value={data.futures.toFixed(2)} />
        <Metric label={t("tfCtd")} value={ctd ? t("tfBondId", { id: ctd.id }) : "—"} accent />
        <Metric label={t("tfBasis")} value={ctd?.netBasis.toFixed(4) ?? "—"} />
        <Metric label={t("tfSpread")} value={ranked.length > 1 ? (ranked[1].netBasis - ranked[0].netBasis).toFixed(4) : t("tfNoSecond")} />
      </div>}
      <div className="tf-factor-strip">
        {ranked.map((bond) => <div className="tf-factor-item" key={bond.id}>
          <strong>{t("tfBondId", { id: bond.id })}</strong>
          <span>{t("tfConversionFactor")} {bond.conversionFactor.toFixed(4)}</span>
          {!bund && <span>{t("tfInvoice")} {bond.invoiceDirty.toFixed(2)}</span>}
        </div>)}
      </div>
    </>
  );
}
