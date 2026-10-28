import { useMediaQuery } from "../../components/useMediaQuery";
import SeedControl from "../../components/SeedControl";
import { ChartContainer, PageHeader, Panel, Workspace } from "../../components/layout";
import { SegmentedControl } from "../../components/ui";
import { useI18n } from "../../i18n";
import type { Liquidity, ObkMode } from "./orderBook.types";
import { useOrderBookLab } from "./useOrderBookLab";
import BookEventLog from "./components/BookEventLog";
import BookLadder from "./components/BookLadder";
import BookReadouts from "./components/BookReadouts";
import DepthChart from "./components/DepthChart";
import FillSummary from "./components/FillSummary";
import OrderTicket from "./components/OrderTicket";
import PredictPanel from "./components/PredictPanel";
import ExecutionPanel from "./components/ExecutionPanel";
import MyFills from "./components/MyFills";
import QueueStrip from "./components/QueueStrip";
import SlippageChart from "./components/SlippageChart";

export default function OrderBookView() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const lab = useOrderBookLab();
  const { url, setUrl } = lab;
  const predicting = url.mode === "predict";
  const challenging = url.mode === "challenge";

  const actions = (
    <div className="obk-actions">
      <SegmentedControl<ObkMode> ariaLabel={t("obkModeAria")} value={url.mode} onChange={(mode) => setUrl({ mode })}
        options={(["simulate", "predict", "challenge"] as const).map((value) => ({ value, label: t(`obkMode_${value}`) }))} />
      <SegmentedControl<Liquidity> ariaLabel={t("obkLiquidityAria")} value={url.liquidity} onChange={(liquidity) => setUrl({ liquidity })}
        options={(["thin", "normal", "deep"] as const).map((value) => ({ value, label: t(`obkLiq_${value}`) }))} />
      <SeedControl compact seed={url.seed} setSeed={(seed) => setUrl({ seed })} />
      <button type="button" className="preset-btn" onClick={lab.sim.reset}>{t("obkReset")}</button>
    </div>
  );

  return (
    <>
      <PageHeader title={t("obkTitle")} description={t("obkDesc")} actions={actions} />
      <Workspace columns="thirds" className="obk-workspace">
        <Panel title={t("obkTicketTitle")} className="obk-ticket-panel">
          <OrderTicket lab={lab} />
        </Panel>
        <Panel title={t("obkLadderTitle")} className="obk-ladder-panel">
          <BookLadder lab={lab} />
        </Panel>
        <Panel title={t(predicting ? "obkPredictTitle" : challenging ? "obkExecTitle" : "obkReadoutsTitle")} className="obk-side-panel">
          {predicting ? <PredictPanel lab={lab} /> : challenging ? <ExecutionPanel lab={lab} /> : (
            <>
              <BookReadouts lab={lab} />
              <FillSummary lab={lab} />
              <BookEventLog events={lab.sim.events} />
            </>
          )}
        </Panel>
      </Workspace>
      {!predicting && (
        <Workspace columns="split" className="obk-charts">
          <Panel title={t("obkQueueTitle")}><QueueStrip lab={lab} /></Panel>
          <Panel title={t("obkMyFillsTitle")}><MyFills lab={lab} /></Panel>
        </Workspace>
      )}
      <Workspace columns="split" className="obk-charts">
        <ChartContainer title={t("obkDepthTitle")}>
          <div className="chart-wrap obk-chart"><DepthChart lab={lab} isMobile={isMobile} /></div>
        </ChartContainer>
        <ChartContainer title={t("obkSlippageTitle")}>
          <div className="chart-wrap obk-chart"><SlippageChart lab={lab} isMobile={isMobile} /></div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
