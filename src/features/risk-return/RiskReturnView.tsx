import { useMemo, useState } from "react";
import { useMediaQuery } from "../../components/useMediaQuery";
import { ScatterChart } from "../../components/charts";
import { PageHeader, Workspace, ChartContainer } from "../../components/layout";
import { useI18n } from "../../i18n";
import { allocationReturn, allocationVolatility, riskyAssetSharpe, weightFromVolatility } from "./riskReturn.math";
import { buildCalChart } from "./riskReturn.chart";
import RiskReturnControls from "./components/RiskReturnControls";
import RiskReturnResults from "./components/RiskReturnResults";

const MAX_WEIGHT = 2.5;
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

export default function RiskReturnView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [mu, setMu] = useState(0.09);
  const [sigma, setSigma] = useState(0.18);
  const [riskFree, setRiskFree] = useState(0.03);
  const [weight, setWeight] = useState(1);
  const [compare, setCompare] = useState(false);
  const [muB, setMuB] = useState(0.12);
  const [sigmaB, setSigmaB] = useState(0.3);

  const sharpe = useMemo(() => riskyAssetSharpe(mu, sigma, riskFree), [mu, sigma, riskFree]);
  const portReturn = allocationReturn(mu, riskFree, weight);
  const portVol = allocationVolatility(sigma, weight);

  const chart = useMemo(
    () =>
      buildCalChart({
        asset: { mu, sigma },
        riskFree,
        weight,
        maxWeight: MAX_WEIGHT,
        assetB: compare ? { mu: muB, sigma: sigmaB } : undefined,
        labels: {
          cal: t("riskReturnCalLabel"),
          riskFree: t("riskReturnRiskFreePoint"),
          risky: t("riskReturnRiskyPoint"),
          assetA: t("riskReturnAssetA"),
          assetB: t("riskReturnAssetB"),
          current: t("riskReturnCurrentPoint"),
          lending: t("riskReturnLending"),
          leverage: t("riskReturnBorrowing"),
          slope: t("riskReturnSlopeLabel"),
        },
      }),
    [mu, sigma, riskFree, weight, compare, muB, sigmaB, t]
  );

  const onDrag = (x: number) => setWeight(weightFromVolatility(x, sigma, MAX_WEIGHT));

  return (
    <>
      <PageHeader title={t("riskReturnTitle")} description={t("riskReturnDesc")} />

      <Workspace columns="sidebar">
        <RiskReturnControls
          mu={mu}
          sigma={sigma}
          riskFree={riskFree}
          weight={weight}
          maxWeight={MAX_WEIGHT}
          compare={compare}
          muB={muB}
          sigmaB={sigmaB}
          onMu={setMu}
          onSigma={setSigma}
          onRiskFree={setRiskFree}
          onWeight={setWeight}
          onCompare={setCompare}
          onMuB={setMuB}
          onSigmaB={setSigmaB}
        />

        <div className="module-main">
          <ChartContainer title={t("riskReturnChartTitle")}>
            <div className="chart-wrap">
              <ScatterChart
                series={chart.series}
                bands={chart.bands}
                annotations={chart.annotations}
                referenceLines={chart.referenceLines}
                onDrag={onDrag}
                xDomain={chart.xDomain}
                yDomain={chart.yDomain}
                isMobile={isMobile}
                xFormat={pct}
                yFormat={pct}
                xLabel={t("riskReturnVolAxis")}
                yLabel={t("riskReturnRetAxis")}
              />
            </div>
          </ChartContainer>

          <RiskReturnResults portReturn={portReturn} portVol={portVol} sharpe={sharpe} weight={weight} />
        </div>
      </Workspace>
    </>
  );
}
