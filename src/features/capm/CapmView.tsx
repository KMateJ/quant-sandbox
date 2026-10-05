import { useMemo, useState } from "react";
import { useMediaQuery } from "../../components/useMediaQuery";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { Tabs, type TabItem } from "../../components/ui";
import { useI18n } from "../../i18n";
import {
  alpha,
  assetRows,
  betaObservations,
  expectedReturn,
  marketRiskPremium,
  observationCorrelation,
  regressBeta,
  PRESET_ASSETS,
} from "./capm.math";
import type { CapmTab } from "./capm.types";
import CapmControls from "./components/CapmControls";
import CapmResults from "./components/CapmResults";
import SmlChart from "./components/SmlChart";
import AssetsChart from "./components/AssetsChart";
import AssetsTable from "./components/AssetsTable";
import BetaChart from "./components/BetaChart";
import BetaStats from "./components/BetaStats";

const MAX_BETA = 2;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export default function CapmView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const [riskFree, setRiskFree] = useState(0.03);
  const [marketReturn, setMarketReturn] = useState(0.09);
  const [beta, setBeta] = useState(1.1);
  const [actualReturn, setActualReturn] = useState(0.1);
  const [dispersion, setDispersion] = useState(0.03);
  const [tab, setTab] = useState<CapmTab>("sml");

  const required = expectedReturn(riskFree, beta, marketReturn);
  const premium = marketRiskPremium(riskFree, marketReturn);
  const jensenAlpha = alpha(actualReturn, riskFree, beta, marketReturn);

  const rows = useMemo(() => {
    const selected = { name: t("capmSelectedPoint"), beta, expectedReturn: actualReturn };
    return assetRows([...PRESET_ASSETS, selected], riskFree, marketReturn);
  }, [beta, actualReturn, riskFree, marketReturn, t]);

  const observations = useMemo(
    () => betaObservations(beta, marketReturn, riskFree, dispersion),
    [beta, marketReturn, riskFree, dispersion]
  );
  const regression = useMemo(() => regressBeta(observations), [observations]);
  const corr = useMemo(() => observationCorrelation(observations), [observations]);

  const handleDrag = (x: number, y: number) => {
    setBeta(clamp(x, 0, MAX_BETA));
    setActualReturn(clamp(y, 0, 0.3));
  };

  const tabs: TabItem<CapmTab>[] = [
    { id: "sml", label: t("capmTabSml") },
    { id: "assets", label: t("capmTabAssets") },
    { id: "beta", label: t("capmTabBeta") },
  ];

  return (
    <>
      <PageHeader title={t("capmTitle")} description={t("capmDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("capmControlsTitle")}>
          <CapmControls
            riskFree={riskFree}
            marketReturn={marketReturn}
            beta={beta}
            actualReturn={actualReturn}
            required={required}
            premium={premium}
            jensenAlpha={jensenAlpha}
            maxBeta={MAX_BETA}
            onRiskFree={setRiskFree}
            onMarketReturn={setMarketReturn}
            onBeta={setBeta}
            onActualReturn={setActualReturn}
          />
          {tab === "sml" && <p className="control-hint">{t("capmDragHint")}</p>}
        </Panel>

        <div className="module-main">
          <ChartContainer
            title={t("capmChartTitle")}
            actions={<Tabs<CapmTab> segmented items={tabs} value={tab} onChange={setTab} ariaLabel={t("capmChartTitle")} />}
          >
            <div className="chart-wrap">
              {tab === "sml" && (
                <SmlChart
                  riskFree={riskFree}
                  marketReturn={marketReturn}
                  beta={beta}
                  actualReturn={actualReturn}
                  required={required}
                  premium={premium}
                  jensenAlpha={jensenAlpha}
                  maxBeta={MAX_BETA}
                  isMobile={isMobile}
                  onDrag={handleDrag}
                />
              )}
              {tab === "assets" && (
                <AssetsChart riskFree={riskFree} marketReturn={marketReturn} rows={rows} maxBeta={MAX_BETA} isMobile={isMobile} />
              )}
              {tab === "beta" && (
                <BetaChart observations={observations} regression={regression} isMobile={isMobile} />
              )}
            </div>
          </ChartContainer>

          {tab === "assets" && <AssetsTable rows={rows} />}
          {tab === "beta" && (
            <BetaStats regression={regression} correlation={corr} dispersion={dispersion} onDispersion={setDispersion} />
          )}
          {tab === "sml" && (
            <CapmResults
              rows={[
                { label: t("capmExpectedReturn"), value: `${(required * 100).toFixed(1)}%` },
                { label: t("capmActualReturnFull"), value: `${(actualReturn * 100).toFixed(1)}%` },
                { label: t("capmAlpha"), value: `${jensenAlpha >= 0 ? "+" : ""}${(jensenAlpha * 100).toFixed(1)}%` },
                { label: t("capmPremium"), value: `${(premium * 100).toFixed(1)}%` },
              ]}
            />
          )}
        </div>
      </Workspace>
    </>
  );
}

