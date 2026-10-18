import { useMemo, useState } from "react";
import { useI18n } from "../../../../../i18n";
import {
  PERF_FUNDS,
  fundStats,
  marketStats,
  rankBy,
  rankDisagreement,
  type RankKey,
} from "../../../guide.interactive.performanceRanking.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import PerformanceRankingScatter from "./PerformanceRankingScatter";
import PerformanceRankingTable from "./PerformanceRankingTable";

const FUNDS = PERF_FUNDS.map((f) => fundStats(f));
const MARKET = marketStats();

/// Sortable table of four funds by Sharpe, Treynor, alpha and information ratio, next to a scatter that shows the chosen measure.
export default function PerformanceRankingFigure() {
  const { t } = useI18n();
  const [sortKey, setSortKey] = useState<RankKey>("sharpe");
  const [hovered, setHovered] = useState<string | null>(null);
  const { order, rank } = useMemo(() => rankBy(FUNDS, sortKey), [sortKey]);

  return (
    <GuideFigure title={t("ixPrTitle")} labId="capm">
      <p className="pr-hint">{t("ixPrHint")}</p>
      <div className="pr-layout">
        <PerformanceRankingTable order={order} market={MARKET} rank={rank} sortKey={sortKey} onSort={setSortKey} hovered={hovered} onHover={setHovered} />
        <PerformanceRankingScatter funds={FUNDS} market={MARKET} sortKey={sortKey} hovered={hovered} onHover={setHovered} />
      </div>
      <FigureReadout
        items={[
          { label: t("ixPrLeader"), value: t("ixPrFundName", { id: order[0].id }), tone: "strong" },
          { label: t("ixPrDisagree"), value: t("ixPrDisagreeValue", { n: rankDisagreement(FUNDS, "sharpe", "treynor"), total: FUNDS.length }), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
