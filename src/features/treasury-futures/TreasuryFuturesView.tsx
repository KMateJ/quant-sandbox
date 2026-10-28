import { ChartContainer, PageHeader, Panel, Workspace } from "../../components/layout";
import { IntuitionTrigger } from "../../components/intuition";
import { useI18n, type TranslationKey } from "../../i18n";
import { SCENARIO_IDS, type ScenarioId } from "./scenarios";
import { useTreasuryFutures } from "./useTreasuryFutures";
import BondBasket from "./components/BondBasket";
import DeliveryChart from "./components/DeliveryChart";
import CtdSwitchPanel from "./components/CtdSwitchPanel";
import CashFlowPanel from "./components/CashFlowPanel";
import TfMetrics from "./components/TfMetrics";
import ResultsTable from "./components/ResultsTable";

export default function TreasuryFuturesView() {
  const { t } = useI18n();
  const lab = useTreasuryFutures();
  const { data, error, results, ctd, bund } = lab;

  return <div className="intuition-on-demand treasury-futures">
    <PageHeader title={t("treasuryFuturesTitle")} description={t("treasuryFuturesDesc")} />
    <Workspace columns="sidebar">
      <Panel title={t("tfControls")}>
        <label className="tf-scenario">{t("tfScenario")}
          <select value={data.id} onChange={(e) => lab.selectScenario(e.target.value as ScenarioId)}>
            {SCENARIO_IDS.map((id) => <option key={id} value={id}>{t(`tfScenario_${id}` as TranslationKey)}</option>)}
          </select>
        </label>
        <BondBasket lab={lab} />
        {error && <p className="tf-error" role="alert">{t(error)}</p>}
      </Panel>
      <div className="module-main">
        <TfMetrics lab={lab} />
        <ChartContainer title={<span>{bund ? t("tfConversionExplorer") : t("tfSwitching")}
          <IntuitionTrigger sectionId={bund ? "conversion-factor" : "net-basis"} /></span>}>
          {!bund && ctd && <DeliveryChart bonds={data.bonds} futures={data.futures} selected={lab.chartCtd?.id ?? ctd.id} onFutures={lab.setFutures} />}
          {!bund && ctd && <p className="tf-explanation"><strong>{t("tfBondId", { id: ctd.id })} · {ctd.netBasis.toFixed(4)}.</strong> {t("tfWhyCtd")}</p>}
          {bund && <p className="tf-explanation">{t("tfNoMarketPrices")}</p>}
        </ChartContainer>
        {!bund && <CtdSwitchPanel lab={lab} />}
        <ResultsTable lab={lab} />
        {bund ? results.map((bond) => <CashFlowPanel key={bond.id} bond={bond} delivery={data.delivery} marketYield={data.marketYield} />)
          : data.id === "amortizing" && ctd && <CashFlowPanel bond={ctd} delivery={data.delivery} marketYield={data.marketYield} />}
        <Panel title={t("tfAssumption")}><p className="tf-note">{t(`tfNote_${data.id}` as TranslationKey)}</p></Panel>
      </div>
    </Workspace>
  </div>;
}
