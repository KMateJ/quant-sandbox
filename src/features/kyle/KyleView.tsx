import { ChartContainer, PageHeader, Panel, Workspace } from "../../components/layout";
import SeedControl from "../../components/SeedControl";
import { ChallengeRecord, SegmentedControl } from "../../components/ui";
import { useI18n } from "../../i18n";
import AuctionChart from "./components/AuctionChart";
import InsiderCard from "./components/InsiderCard";
import KyleControls from "./components/KyleControls";
import LambdaPredict from "./components/LambdaPredict";
import MakerView from "./components/MakerView";
import OrderBars from "./components/OrderBars";
import ProfitCompare from "./components/ProfitCompare";
import type { KyleMode, KyleView as ViewKind } from "./kyle.url";
import { useKyleLab } from "./useKyleLab";

export default function KyleView() {
  const { t } = useI18n();
  const lab = useKyleLab();
  const { url, setUrl } = lab;
  const modes: { value: KyleMode; label: string }[] = [
    { value: "simulate", label: t("kylModeSimulate") },
    { value: "predict", label: t("kylModePredict") },
    { value: "challenge", label: t("kylModeChallenge") },
  ];
  const views: { value: ViewKind; label: string }[] = [
    { value: "insider", label: t("kylViewInsider") },
    { value: "maker", label: t("kylViewMaker") },
  ];
  const insider = url.view === "insider";

  return (
    <>
      <PageHeader
        title={t("kylTitle")}
        description={t("kylDesc")}
        actions={
          <>
            <SegmentedControl ariaLabel={t("kylModeLabel")} options={modes} value={url.mode} onChange={(mode) => setUrl({ mode })} />
            <SeedControl compact seed={url.seed} setSeed={(seed) => setUrl({ seed })} />
          </>
        }
      />
      <Workspace columns="sidebar" className="kyl-workspace">
        <Panel title={t("kylSetupTitle")}>
          <KyleControls lab={lab} />
        </Panel>
        <div className="module-main">
          {url.mode === "predict" ? (
            <LambdaPredict params={lab.params} seed={url.seed} />
          ) : (
            <>
              <ChartContainer
                title={t(url.mode === "challenge" ? "kylChallengeTitle" : insider ? "kylInsiderTitle" : "kylMakerTitle")}
                actions={<SegmentedControl ariaLabel={t("kylViewLabel")} options={views} value={url.view} onChange={(view) => setUrl({ view })} />}
              >
                <InsiderCard lab={lab} />
                <AuctionChart lab={lab} />
                {insider ? <OrderBars lab={lab} /> : <MakerView lab={lab} />}
                {url.mode === "challenge" && lab.done && <p className="kyl-result">{t(lab.hit ? "kylHit" : "kylMiss")}</p>}
                {url.mode === "challenge" && <ChallengeRecord id={lab.challengeId} />}
              </ChartContainer>
              {insider && <ProfitCompare lab={lab} />}
            </>
          )}
        </div>
      </Workspace>
    </>
  );
}
