import { useMemo } from "react";
import { useUrlState } from "../../../components/useUrlState";
import { ChartContainer } from "../../../components/layout";
import { Tabs, type TabItem } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { terminalShare, valueBridge } from "../valuation.math";
import { EXPLORE_URL_SCHEMA, type ExploreTab } from "../valuation.url";
import TerminalShareBar from "./TerminalShareBar";
import ValuationBridge from "./ValuationBridge";
import ValuationMap from "./ValuationMap";
import ValuationReverse from "./ValuationReverse";


type Props = {
  fcf1: number;
  growth: number;
  years: number;
  wacc: number;
  terminalGrowth: number;
  onPickRates: (wacc: number, terminalGrowth: number) => void;
};

/// "Where the value comes from": the DCF bridge, the WACC × g∞ value map and the reverse DCF, over the terminal-value share.
export default function ValuationExplore({ fcf1, growth, years, wacc, terminalGrowth, onPickRates }: Props) {
  const { t } = useI18n();
  const [{ explore: tab, solve, mv }, setUrl] = useUrlState(EXPLORE_URL_SCHEMA);
  const setTab = (v: ExploreTab) => setUrl({ explore: v });
  const parts = useMemo(() => valueBridge(fcf1, growth, years, wacc, terminalGrowth), [fcf1, growth, years, wacc, terminalGrowth]);
  const tabs: TabItem<ExploreTab>[] = [
    { id: "bridge", label: t("valuationTabBridge") },
    { id: "map", label: t("valuationTabMap") },
    { id: "reverse", label: t("valuationTabReverse") },
  ];

  return (
    <ChartContainer
      title={t("valuationExploreTitle")}
      actions={<Tabs<ExploreTab> segmented items={tabs} value={tab} onChange={(id) => setTab(id as ExploreTab)} ariaLabel={t("valuationExploreTitle")} />}
    >
      {tab === "bridge" && <ValuationBridge parts={parts} years={years} />}
      {tab === "map" && <ValuationMap fcf1={fcf1} growth={growth} years={years} wacc={wacc} terminalGrowth={terminalGrowth} onPick={onPickRates} />}
      {tab === "reverse" && (
        <ValuationReverse
          fcf1={fcf1} growth={growth} years={years} wacc={wacc} terminalGrowth={terminalGrowth}
          mode={solve} onMode={(v) => setUrl({ solve: v })} market={mv} onMarket={(v) => setUrl({ mv: v })}
        />
      )}
      <TerminalShareBar share={terminalShare(fcf1, growth, years, wacc, terminalGrowth)} />
    </ChartContainer>
  );
}
