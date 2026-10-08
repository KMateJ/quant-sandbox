import { Panel } from "../../../components/layout";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import { HESTON_GREEKS } from "../heston.greeks";
import type { GreeksComparison } from "../heston.types";

type Props = { data: GreeksComparison | null };

export default function HestonGreeksSummary({ data }: Props) {
  const { t } = useI18n();
  return (
    <Panel
      title={
        <span className="chart-actions">
          {t("hestonGreeksSummaryTitle")}
          <IntuitionTrigger sectionId="pricing-paths" />
        </span>
      }
    >
      <p className="panel-subtitle">{t("hestonGreeksSummarySubtitle")}</p>
      {data ? (
        <div className="greeks-table-wrap">
          <table className="greeks-table">
            <thead>
              <tr>
                <th>{t("hestonGreek")}</th>
                <th>Black–Scholes</th>
                <th>Heston (MC)</th>
                <th>{t("hestonDifference")}</th>
              </tr>
            </thead>
            <tbody>
              <tr className="greeks-price-row">
                <td><span className="intuition-reveal">{t("hestonPrice")} <IntuitionTrigger sectionId="spot-strike" /></span></td>
                <td>{data.bsPrice.toFixed(4)}</td>
                <td>{data.hestonPrice.toFixed(4)}</td>
                <td>{(data.hestonPrice - data.bsPrice).toFixed(4)}</td>
              </tr>
              {data.rows.map((row) => {
                const meta = HESTON_GREEKS.find((item) => item.key === row.key);
                if (!meta) throw new Error(`Unknown Heston Greek: ${row.key}`);
                const diff = row.heston - row.bs;
                return (
                  <tr key={row.key}>
                    <td>
                      <span className="intuition-reveal">
                        <span className="greek-symbol">{meta.symbol}</span>{" "}
                        {t(meta.labelKey)} <IntuitionTrigger sectionId={row.key} />
                      </span>
                    </td>
                    <td>{row.bs.toFixed(meta.decimals)}</td>
                    <td>{row.heston.toFixed(meta.decimals)}</td>
                    <td className={diff >= 0 ? "greek-pos" : "greek-neg"}>
                      {diff >= 0 ? "+" : ""}{diff.toFixed(meta.decimals)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-block"><p>{t("hestonComputingGreeks")}</p></div>
      )}
    </Panel>
  );
}
