import { DataTable, type DataColumn } from "../../components/ui";
import { metricAtSpot, mainMaturityIndex } from "./blackScholes.math";
import type { useBlackScholesView } from "./useBlackScholesView";

type Model = ReturnType<typeof useBlackScholesView>;
type Row = { T: number; value: number; slope: number; color?: string; main: boolean };

/// Value and slope of the shown metric at the dragged spot, one row per maturity curve.
export default function BsSpotReadout({ model }: { model: Model }) {
  const { t, spot, strike, metric, optionType, rate, volatility, maturities, chartSeries, tooltipDigits } = model;
  const main = mainMaturityIndex(maturities);
  // The slope of the price curve is Δ, of the Δ curve Γ; for the other Greeks it is a plain ∂/∂S.
  const slopeName = metric === "price" ? "Δ" : metric === "delta" ? "Γ" : t("blackScholesReadoutSlope");
  const rows: Row[] = maturities.map((T, i) => ({
    T,
    ...metricAtSpot(metric, optionType, spot, strike, T, rate, volatility),
    color: chartSeries[i]?.color,
    main: i === main,
  }));

  const columns: DataColumn<Row>[] = [
    {
      key: "T",
      header: t("blackScholesReadoutMaturity"),
      render: (r) => (
        <span className={r.main ? "bs-readout-t is-main" : "bs-readout-t"}>
          <span className="bs-readout-dot" style={{ background: r.color }} aria-hidden="true" />
          {r.T}
        </span>
      ),
    },
    { key: "value", header: t("blackScholesReadoutValue"), align: "end", render: (r) => r.value.toFixed(tooltipDigits) },
    { key: "slope", header: slopeName, align: "end", render: (r) => r.slope.toFixed(Math.max(4, tooltipDigits)) },
  ];

  return (
    <div className="bs-readout">
      <p className="bs-readout-hint">
        {t("blackScholesTangentHint", { t: maturities[main], greek: slopeName })}
      </p>
      <DataTable
        caption={t("blackScholesReadoutTitle", { s: spot.toFixed(1) })}
        columns={columns}
        rows={rows}
        getRowKey={(r) => r.T}
      />
    </div>
  );
}
