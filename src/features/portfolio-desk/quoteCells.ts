import type { QuoteCell } from "../../components/game";
import { pct } from "../../components/game/gameFormat";
import { navIndex, spct } from "./portfolioFormat";
import type { PortfolioDeskModel } from "./usePortfolioDesk";

type Translate = (key: string, vars?: Record<string, unknown>) => string;

const tone = (x: number): QuoteCell["tone"] => (x > 0 ? "up" : x < 0 ? "down" : undefined);

/// Quote strip: NAV, month return, since start, 60/40, realised and ex-ante vol, drawdown, edge vs 60/40.
export function quoteCells(desk: PortfolioDeskModel, t: Translate): QuoteCell[] {
  const { state, realized, exAnte } = desk;
  const last = state.hist[state.hist.length - 1];
  const dd = last.dd;
  const vs = state.nav - state.bench;
  return [
    { label: t("pmgrQNav"), value: navIndex(state.nav) },
    { label: t("pmgrQMonth"), value: spct(last.rp), tone: tone(last.rp) },
    { label: t("pmgrQSince"), value: spct(state.nav - 1), tone: tone(state.nav - 1) },
    { label: t("pmgrQBench"), value: navIndex(state.bench) },
    { label: t("pmgrQRealized"), value: state.hist.length > 2 ? pct(realized) : "—" },
    { label: t("pmgrQExAnte"), value: pct(exAnte) },
    { label: t("pmgrQDrawdown"), value: pct(dd), tone: tone(dd) },
    { label: t("pmgrQVsBench"), value: spct(vs), tone: tone(vs) },
  ];
}
