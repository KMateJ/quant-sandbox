import { useMemo, useState } from "react";
import SectionCard from "../../../components/SectionCard";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, type ChartSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { GreekKey, HestonGreekProfilePoint } from "../heston.types";

type Props = {
  data: HestonGreekProfilePoint[];
  strike: number;
};

const METRICS: { key: GreekKey; label: string }[] = [
  { key: "delta", label: "Delta" },
  { key: "gamma", label: "Gamma" },
  { key: "vega", label: "Vega" },
  { key: "theta", label: "Theta" },
  { key: "rho", label: "Rho" },
];

export default function HestonGreeksChart({ data, strike }: Props) {
  const { language } = useI18n();
  const isHu = language === "hu";
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [metric, setMetric] = useState<GreekKey>("delta");
  const [showBs, setShowBs] = useState(true);
  const [showHeston, setShowHeston] = useState(true);

  const bsKey = `${metric}_bs`;
  const hestonKey = `${metric}_heston`;

  const series = useMemo<ChartSeries[]>(() => {
    const list: ChartSeries[] = [];
    if (showBs)
      list.push({ key: bsKey, label: "Black–Scholes", color: "#3b82f6", strokeWidth: 2 });
    if (showHeston)
      list.push({ key: hestonKey, label: "Heston (MC)", color: "#f59e0b", strokeWidth: 2 });
    return list;
  }, [showBs, showHeston, bsKey, hestonKey]);

  return (
    <SectionCard
      className="chart-card"
      title={isHu ? "Görögök az árfolyam mentén" : "Greeks across spot"}
    >
      <div className="greeks-toolbar">
        <div className="greeks-metric-seg" role="tablist">
          {METRICS.map((m) => (
            <button
              key={m.key}
              type="button"
              role="tab"
              aria-selected={metric === m.key}
              className={
                metric === m.key ? "greeks-seg-btn active" : "greeks-seg-btn"
              }
              onClick={() => setMetric(m.key)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="greeks-series-toggles">
          <button
            type="button"
            className={showBs ? "greeks-series active" : "greeks-series"}
            aria-pressed={showBs}
            onClick={() => setShowBs((v) => !v)}
          >
            <span className="greeks-series-dot" style={{ background: "#3b82f6" }} />
            Black–Scholes
          </button>
          <button
            type="button"
            className={showHeston ? "greeks-series active" : "greeks-series"}
            aria-pressed={showHeston}
            onClick={() => setShowHeston((v) => !v)}
          >
            <span className="greeks-series-dot" style={{ background: "#f59e0b" }} />
            Heston
          </button>
        </div>
      </div>

      <div className="chart-wrap">
        <LineChart
          data={data}
          xKey="S"
          series={series}
          referenceLines={[
            { axis: "x", value: strike, color: "#94a3b8", dash: "4 4" },
          ]}
          isMobile={isMobile}
          legend={false}
          tooltipLabel={(x) => `S = ${x}`}
          valueFormat={(v) => v.toFixed(4)}
        />
      </div>
    </SectionCard>
  );
}
