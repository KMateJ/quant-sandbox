import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { useMediaQuery } from "../../components/useMediaQuery";
import { ScatterChart } from "../../components/charts";
import type { ChartReferenceLine, ScatterSeries } from "../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { useI18n } from "../../i18n";
import EfficientFrontierResults, {
  type NamedPortfolio,
} from "./components/EfficientFrontierResults";
import {
  covMatrixShared,
  efficientFrontier,
  frontierWeights,
  gmvWeights,
  portfolioStats,
  sharpeRatio,
  tangencyWeights,
} from "./efficientFrontier.math";

const STEPS = 80;
const ASSET_COLORS = ["#60a5fa", "#f59e0b", "#a78bfa"];

export default function EfficientFrontierView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [mu1, setMu1] = useState(0.06);
  const [mu2, setMu2] = useState(0.1);
  const [mu3, setMu3] = useState(0.14);
  const [sigma1, setSigma1] = useState(0.12);
  const [sigma2, setSigma2] = useState(0.18);
  const [sigma3, setSigma3] = useState(0.28);
  const [rho, setRho] = useState(0.25);
  const [target, setTarget] = useState(0.1);
  const [riskFree, setRiskFree] = useState(0.03);

  const mus = useMemo(() => [mu1, mu2, mu3], [mu1, mu2, mu3]);
  const sigmas = useMemo(() => [sigma1, sigma2, sigma3], [sigma1, sigma2, sigma3]);
  const cov = useMemo(() => covMatrixShared(sigmas, rho), [sigmas, rho]);

  const gmv = useMemo(() => portfolioStats(gmvWeights(mus, cov), mus, cov), [mus, cov]);
  const tangency = useMemo(
    () => portfolioStats(tangencyWeights(mus, cov, riskFree), mus, cov),
    [mus, cov, riskFree]
  );
  const targetP = useMemo(
    () => portfolioStats(frontierWeights(target, mus, cov), mus, cov),
    [target, mus, cov]
  );
  const tangencySharpe = sharpeRatio(tangency, riskFree);

  const retMin = Math.max(0, gmv.ret - 0.06);
  const retMax = Math.max(...mus) + 0.04;
  const frontier = useMemo(
    () => efficientFrontier(mus, cov, retMin, retMax, STEPS),
    [mus, cov, retMin, retMax]
  );

  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
  const volMax = Math.max(...sigmas, tangency.vol, ...frontier.map((p) => p.vol)) * 1.1;

  const series: ScatterSeries[] = [
    { key: "frontier", label: t("frontierLabel"), color: "#22c55e", line: true, strokeWidth: 2.5, points: frontier.map((p) => ({ x: p.vol, y: p.ret })) },
    { key: "cml", label: t("frontierCalLabel"), color: "#38bdf8", line: true, dash: "6 4", strokeWidth: 2, points: [{ x: 0, y: riskFree }, { x: volMax, y: riskFree + tangencySharpe * volMax }] },
    ...mus.map((m, i) => ({ key: `a${i}`, label: `A${i + 1}`, color: ASSET_COLORS[i], radius: 6, points: [{ x: sigmas[i], y: m, label: `A${i + 1}` }] })),
    { key: "gmv", label: t("frontierGmvLabel"), color: "#f97316", radius: 7, points: [{ x: gmv.vol, y: gmv.ret, label: t("frontierGmvLabel") }] },
    { key: "tangency", label: t("frontierTangencyLabel"), color: "#ef4444", radius: 7, points: [{ x: tangency.vol, y: tangency.ret, label: t("frontierTangencyLabel") }] },
    { key: "target", label: t("frontierTargetPointLabel"), color: "#e2e8f0", radius: 6, legend: false, points: [{ x: targetP.vol, y: targetP.ret, label: t("frontierTargetPointLabel") }] },
  ];
  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: targetP.vol, color: "#64748b", dash: "4 4" },
    { axis: "y", value: target, color: "#64748b", dash: "4 4" },
  ];

  const portfolios: NamedPortfolio[] = [
    { name: t("frontierGmvLabel"), ...gmv, sharpe: sharpeRatio(gmv, riskFree) },
    { name: t("frontierTangencyLabel"), ...tangency, sharpe: tangencySharpe },
    { name: t("frontierTargetPointLabel"), ...targetP, sharpe: sharpeRatio(targetP, riskFree) },
  ];

  return (
    <>
      <PageHeader title={t("frontierTitle")} description={t("frontierDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("frontierControlsTitle")}>
          <div className="controls-grid">
            <SliderField label={t("frontierMu1Label")} min={0} max={0.3} step={0.005} value={mu1} onChange={setMu1} formatValue={pct} />
            <SliderField label={t("frontierMu2Label")} min={0} max={0.3} step={0.005} value={mu2} onChange={setMu2} formatValue={pct} />
            <SliderField label={t("frontierMu3Label")} min={0} max={0.3} step={0.005} value={mu3} onChange={setMu3} formatValue={pct} />
            <SliderField label={t("frontierSigma1Label")} min={0.01} max={0.5} step={0.005} value={sigma1} onChange={setSigma1} formatValue={pct} />
            <SliderField label={t("frontierSigma2Label")} min={0.01} max={0.5} step={0.005} value={sigma2} onChange={setSigma2} formatValue={pct} />
            <SliderField label={t("frontierSigma3Label")} min={0.01} max={0.5} step={0.005} value={sigma3} onChange={setSigma3} formatValue={pct} />
            <SliderField label={t("frontierRhoLabel")} min={-0.45} max={0.95} step={0.05} value={rho} onChange={setRho} formatValue={(v) => v.toFixed(2)} />
            <SliderField label={t("frontierTargetLabel")} min={0} max={0.3} step={0.005} value={target} onChange={setTarget} formatValue={pct} />
            <SliderField label={t("frontierRiskFreeLabel")} min={0} max={0.1} step={0.0025} value={riskFree} onChange={setRiskFree} formatValue={pct} />
          </div>
        </Panel>

        <div className="module-main">
          <ChartContainer title={t("frontierChartTitle")}>
            <div className="chart-wrap">
              <ScatterChart
                series={series}
                xDomain={[0, volMax]}
                yDomain={[Math.min(riskFree, retMin), retMax]}
                referenceLines={referenceLines}
                isMobile={isMobile}
                xFormat={pct}
                yFormat={pct}
                xLabel={t("frontierVolAxis")}
                yLabel={t("frontierRetAxis")}
              />
            </div>
          </ChartContainer>

          <EfficientFrontierResults
            targetVol={targetP.vol}
            gmv={gmv}
            tangencySharpe={tangencySharpe}
            portfolios={portfolios}
            assetColors={ASSET_COLORS}
          />
        </div>
      </Workspace>
    </>
  );
}
