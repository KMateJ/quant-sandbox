import { Panel } from "../../../components/layout";
import { IntuitionTrigger } from "../../../components/intuition";
import ScatterChart from "../../../components/charts/ScatterChart";
import type { ScatterSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import { cashFlowsAfterDelivery, type DeliverableBond, type DeliveryEconomics } from "../treasuryFutures.math";

export default function CashFlowPanel({ bond, delivery, marketYield }: {
  bond: DeliveryEconomics | DeliverableBond;
  delivery: number;
  marketYield: number;
}) {
  const { t } = useI18n();
  const flows = cashFlowsAfterDelivery(bond, delivery, marketYield);
  const series: ScatterSeries[] = [
    { key: "coupon", label: t("tfCoupon"), color: "#38bdf8", points: flows.map((f) => ({ x: f.time, y: f.coupon })) },
    { key: "principal", label: t("tfPrincipal"), color: "#fb923c", points: flows.map((f) => ({ x: f.time, y: f.principal })) },
    { key: "present-value", label: t("tfPresentValue"), color: "#34d399", points: flows.map((f) => ({ x: f.time, y: f.presentValue })) },
  ];
  return <Panel title={<>{t("tfCashflows")} <IntuitionTrigger sectionId="conversion-factor" /></>}>
    {flows.length > 0 && <div className="tf-cashflow-chart">
      <ScatterChart series={series} xDomain={[delivery, bond.maturity]} xLabel={t("tfTime")}
        yLabel={t("tfCashflow")} xFormat={(value) => value.toFixed(1)} yFormat={(value) => value.toFixed(1)} yNumTicks={4} />
    </div>}
    <div className="tf-table-scroll"><table className="tf-table tf-cashflows">
      <thead><tr><th>{t("tfTime")}</th><th>{t("tfCoupon")}</th><th>{t("tfPrincipal")}</th><th>{t("tfCashflow")}</th><th>{t("tfPresentValue")}</th></tr></thead>
      <tbody>{flows.map((flow) => <tr key={flow.time}>
        <td>{flow.time.toFixed(2)}</td><td>{flow.coupon.toFixed(2)}</td><td>{flow.principal.toFixed(2)}</td>
        <td>{(flow.coupon + flow.principal).toFixed(2)}</td><td>{flow.presentValue.toFixed(2)}</td>
      </tr>)}</tbody>
    </table></div>
    <p className="tf-note">{t("tfDeliveryFlows")}</p>
  </Panel>;
}
