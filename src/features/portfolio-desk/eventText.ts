import type { EventRow } from "../../components/game/GamePanels";
import { pct } from "../../components/game/gameFormat";
import { navIndex, spct } from "./portfolioFormat";
import type { PortfolioEvent } from "./engine/portfolio.types";

type Translate = (key: string, vars?: Record<string, unknown>) => string;

/// One event-log row per engine event (newest-first ordering is the caller's job).
export function eventText(e: PortfolioEvent, t: Translate): EventRow {
  const row = (tone: EventRow["tone"], text: string): EventRow => ({ t: t("pmgrMonthShort", { m: e.t }), kind: t(`pmgrEvKind_${e.kind}`), tone, text });
  switch (e.kind) {
    case "start":
      return row("muted", t("pmgrEvStart"));
    case "rebalance":
      return row("accent", t(e.tag === "auto" ? "pmgrEvRebalanceAuto" : "pmgrEvRebalance", { turnover: pct(e.turnover), vol: pct(e.vol) }));
    case "bigMonth":
      return row(e.fund > 0 ? "up" : "down", t("pmgrEvBigMonth", { fund: spct(e.fund), eq: spct(e.eq), gov: spct(e.gov) }));
    case "drawdown":
      return row("down", t("pmgrEvDrawdown", { dd: pct(e.dd) }));
    case "shareMiss":
      return row("down", t("pmgrEvShareMiss", { asset: e.asset, share: pct(e.share) }));
    case "end":
      return row(e.nav >= e.bench ? "up" : "down", t("pmgrEvEnd", { nav: navIndex(e.nav), bench: navIndex(e.bench) }));
    default: {
      const never: never = e;
      return never;
    }
  }
}
