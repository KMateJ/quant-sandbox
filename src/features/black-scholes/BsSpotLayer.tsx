import { DragHandles, type PlotFrame } from "../../components/charts";
import { metricAtSpot, mainMaturityIndex, tangentSegment } from "./blackScholes.math";
import type { useBlackScholesView } from "./useBlackScholesView";

type Model = ReturnType<typeof useBlackScholesView>;

const S_RANGE: [number, number] = [10, 200];

/// Interactive layer over the 2D Black–Scholes chart: draggable spot and strike, a dot on every maturity curve at the
/// spot, and the tangent to the main curve there (its slope is Δ for the price, Γ for Δ, …).
export default function BsSpotLayer({ frame, model }: { frame: PlotFrame; model: Model }) {
  const { t, spot, setSpot, strike, setStrike, metric, optionType, rate, volatility, maturities, chartSeries } = model;
  const main = mainMaturityIndex(maturities);
  const tangent = tangentSegment(metric, optionType, spot, strike, maturities[main], rate, volatility);

  return (
    <g className="bs-spot-layer">
      <line
        className="bs-tangent"
        x1={frame.x(tangent.x1)}
        y1={frame.y(tangent.y1)}
        x2={frame.x(tangent.x2)}
        y2={frame.y(tangent.y2)}
        style={{ stroke: chartSeries[main]?.color }}
      />
      {maturities.map((T, i) => {
        const { value } = metricAtSpot(metric, optionType, spot, strike, T, rate, volatility);
        return (
          <circle
            key={T}
            className="bs-spot-dot"
            cx={frame.x(spot)}
            cy={frame.y(value)}
            r={i === main ? 5 : 3.5}
            style={{ fill: chartSeries[i]?.color }}
          />
        );
      })}
      <DragHandles
        frame={frame}
        handles={[
          { id: "strike", axis: "x", x: strike, min: 20, max: 200, step: 1, label: t("blackScholesStrikeHandle"), color: "var(--muted)", format: (v) => `K = ${v.toFixed(0)}` },
          { id: "spot", axis: "x", x: spot, min: S_RANGE[0], max: S_RANGE[1], step: 0.5, label: t("blackScholesSpotHandle"), format: (v) => `S = ${v.toFixed(1)}` },
        ]}
        onChange={(id, { x }) => {
          if (x === undefined) return;
          if (id === "spot") setSpot(x);
          else setStrike(x);
        }}
      />
    </g>
  );
}
