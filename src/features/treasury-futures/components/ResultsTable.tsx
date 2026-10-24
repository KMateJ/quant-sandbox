import { Panel } from "../../../components/layout";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { TreasuryFuturesModel } from "../useTreasuryFutures";

/// Factor, net basis, accrued, invoice and dirty cost per bond (ranked by net basis when prices are given); CTD starred.
export default function ResultsTable({ lab }: { lab: TreasuryFuturesModel }) {
  const { t } = useI18n();
  const { results, ranked, ctd, bund } = lab;
  return (
    <Panel title={t("tfResults")} actions={<IntuitionTrigger sectionId="invoice-price" />}>
      <div className="tf-table-scroll"><table className="tf-table">
        <thead><tr>
          <th>{t("tfBond")}</th><th>{t("tfFactor")}</th>{!bund && <th>{t("tfBasis")}</th>}
          <th>{t("tfAccrued")}</th>{!bund && <><th>{t("tfInvoice")}</th><th>{t("tfDirtyDifference")}</th></>}
        </tr></thead>
        <tbody>{(bund ? results : ranked).map((bond) => <tr key={bond.id} className={bond.id === ctd?.id ? "is-ctd" : ""}>
          <th>{bond.id === ctd?.id ? "★ " : ""}{bond.id}</th><td>{bond.conversionFactor.toFixed(4)}</td>
          {!bund && <td>{bond.netBasis.toFixed(4)}</td>}
          <td>{bond.accruedInterest.toFixed(4)}</td>
          {!bund && <><td>{bond.invoiceDirty.toFixed(4)}</td><td>{bond.dirtyCostDifference.toFixed(4)}</td></>}
        </tr>)}</tbody>
      </table></div>
      {!bund && <p className="tf-note">{t("tfCleanDirty")}</p>}
    </Panel>
  );
}
