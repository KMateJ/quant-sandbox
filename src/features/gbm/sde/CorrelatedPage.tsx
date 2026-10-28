import { useMemo } from "react";
import { useUrlState } from "../../../components/useUrlState";
import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { LineChart, ScatterChart } from "../../../components/charts";
import type { ChartSeries, ScatterSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { correlation } from "../../../lib/stats/moments";
import { useI18n } from "../../../i18n";
import { CORR_URL_SCHEMA } from "../gbm.sde.url";
import { correlatedBrownian } from "../gbm.corr.math";
import SdeLayout from "./SdeLayout";

const dec = (v: number, d = 2) => v.toFixed(d);

/// Two Brownian motions with correlation ρ built by Cholesky: increment scatter and the paired paths.
export default function CorrelatedPage() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [url, setUrl] = useUrlState(CORR_URL_SCHEMA);
  const { rho, steps, seed } = url;

  const sim = useMemo(() => correlatedBrownian(rho, 1, steps, seed), [rho, steps, seed]);
  const empirical = correlation(sim.dW1, sim.dW2);

  const sd = 1 / Math.sqrt(steps);
  const lim = 3.5;
  const cloud: ScatterSeries[] = [
    { key: "inc", label: t("sdeCorrIncrements"), color: "var(--primary)", points: sim.dW1.map((x, i) => ({ x: x / sd, y: sim.dW2[i] / sd })), radius: 2.5, opacity: 0.5, outline: false, legend: false },
    { key: "fit", label: t("sdeCorrLine"), color: "var(--text)", points: [-lim, lim].map((x) => ({ x, y: rho * x })), line: true, dash: "5 4", strokeWidth: 1.5, legend: false },
  ];

  const rows = useMemo(() => sim.w1.map((w, i) => ({ t: i / steps, w1: w, w2: sim.w2[i] })), [sim, steps]);
  const series: ChartSeries[] = [
    { key: "w1", label: "W₁", color: "var(--primary)", strokeWidth: 2 },
    { key: "w2", label: "W₂", color: "var(--warning-title)", strokeWidth: 2 },
  ];
  const f1 = (v: number) => dec(v, 1);

  return (
    <SdeLayout
      titleKey="sdeCorrTitle"
      descKey="sdeCorrDesc"
      controls={
        <>
          <SliderField label={t("sdeCorrRho")} min={-0.99} max={0.99} step={0.01} value={rho} onChange={(v) => setUrl({ rho: v })} formatValue={dec} />
          <SliderField label={t("sdeCorrSteps")} min={50} max={1000} step={50} value={steps} onChange={(v) => setUrl({ steps: v })} formatValue={(v) => dec(v, 0)} />
          <SeedControl seed={seed} setSeed={(s) => setUrl({ seed: s })} compact />
        </>
      }
      stats={[
        { label: t("sdeCorrTarget"), value: dec(rho) },
        { label: t("sdeCorrEmpirical"), value: dec(empirical) },
        { label: t("sdeCorrSecondLeg"), value: `${dec(rho)}·Z₁ + ${dec(Math.sqrt(1 - rho * rho))}·Z₂` },
      ]}
    >
      <ChartContainer title={t("sdeCorrPathsTitle")}>
        <div className="sde-chart">
          <LineChart data={rows} xKey="t" series={series} xDomain={[0, 1]} curve="linear" isMobile={isMobile} legend
            tooltipLabel={(x) => `t = ${dec(x)}`} valueFormat={dec} />
        </div>
      </ChartContainer>
      <ChartContainer title={t("sdeCorrScatterTitle", { n: steps })}>
        <div className="sde-chart">
          <ScatterChart series={cloud} isMobile={isMobile} xDomain={[-lim, lim]} yDomain={[-lim, lim]} xFormat={f1} yFormat={f1}
            xLabel={t("sdeCorrXLabel")} yLabel={t("sdeCorrYLabel")} />
        </div>
      </ChartContainer>
    </SdeLayout>
  );
}
