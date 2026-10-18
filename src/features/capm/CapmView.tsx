import { useMediaQuery } from "../../components/useMediaQuery";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { Tabs, type TabItem } from "../../components/ui";
import { useI18n } from "../../i18n";
import type { CapmTab } from "./capm.types";
import { useCapmLab } from "./useCapmLab";
import CapmControls from "./components/CapmControls";
import CapmResults from "./components/CapmResults";
import SmlChart from "./components/SmlChart";
import AssetsChart from "./components/AssetsChart";
import AssetsTable from "./components/AssetsTable";
import BetaTab from "./components/BetaTab";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;
const signed = (v: number) => `${v >= 0 ? "+" : ""}${pct(v)}`;

const HINTS = { sml: "capmDragHint", assets: "capmAssetsDragHint", beta: "capmSketchHint" } as const;

export default function CapmView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const lab = useCapmLab();
  const { tab, riskFree, marketReturn, beta, actualReturn, required, premium, jensenAlpha, maxBeta } = lab;

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
            maxBeta={maxBeta}
            onRiskFree={lab.setRiskFree}
            onMarketReturn={lab.setMarketReturn}
            onBeta={lab.setBeta}
            onActualReturn={lab.setActualReturn}
          />
          <p className="control-hint">{t(HINTS[tab])}</p>
        </Panel>

        <div className="module-main">
          <ChartContainer
            title={t("capmChartTitle")}
            actions={<Tabs<CapmTab> segmented items={tabs} value={tab} onChange={(next) => lab.setState({ tab: next })} ariaLabel={t("capmChartTitle")} />}
          >
            {tab === "sml" && (
              <div className="chart-wrap">
                <SmlChart
                  riskFree={riskFree}
                  marketReturn={marketReturn}
                  beta={beta}
                  actualReturn={actualReturn}
                  required={required}
                  premium={premium}
                  jensenAlpha={jensenAlpha}
                  maxBeta={maxBeta}
                  isMobile={isMobile}
                  onDrag={lab.dragSelected}
                  onMarketDrag={lab.setMarketReturn}
                />
              </div>
            )}
            {tab === "assets" && (
              <div className="chart-wrap">
                <AssetsChart riskFree={riskFree} marketReturn={marketReturn} rows={lab.rows} maxBeta={maxBeta} isMobile={isMobile} onDrag={lab.dragAsset} />
              </div>
            )}
            {tab === "beta" && <BetaTab lab={lab} isMobile={isMobile} />}
          </ChartContainer>

          {tab === "assets" && (
            <>
              <AssetsTable rows={lab.rows} />
              {lab.presetsEdited && (
                <button type="button" className="preset-btn capm-reset-btn" onClick={lab.resetPresets}>
                  {t("capmResetAssets")}
                </button>
              )}
            </>
          )}
          {tab === "sml" && (
            <CapmResults
              rows={[
                { label: t("capmExpectedReturn"), value: pct(required) },
                { label: t("capmActualReturnFull"), value: pct(actualReturn) },
                { label: t("capmAlpha"), value: signed(jensenAlpha) },
                { label: t("capmPremium"), value: pct(premium) },
              ]}
            />
          )}
        </div>
      </Workspace>
    </>
  );
}
