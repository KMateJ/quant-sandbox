import { rankAdvice } from "../../../lib/game/advice";
import type { AdviceItem } from "../../../lib/game/game.types";
import { ordersOf, queueAhead } from "../../../lib/market/book";
import type { Side } from "../../../lib/market/market.types";
import type { MmMission, MmState } from "../engine/mm.types";
import { mmPnlParts } from "../engine/objectives.math";

export type MmKeyCode = "F2" | "F4" | "F5" | "F6" | "F7" | "F8" | "F9" | "F10";

export type MmAdviceAction =
  | { kind: "key"; code: MmKeyCode }
  | { kind: "screen"; screen: "debrief" }
  | { kind: "tab"; tab: "whatIf" | "guide" }
  | { kind: "point"; anchor: string };

export type MmAdvice = AdviceItem<MmAdviceAction>;

const NEAR = 0.7;
const ONE_SIDED = 0.8;
const ONE_SIDED_WINDOW = 30;
const ONE_SIDED_MIN = 3;
const ADVERSE_SHARE = 0.6;
const NEWS_LEAD = 30;
const BACK_OF_QUEUE = 3;

/// Your maker fills (rebate-paying, so hedges are excluded).
export const makerFills = (s: MmState) => s.ledger.fills.filter((f) => f.fee > 0);

/// Shares queued ahead of your resting order on `side`, or null when nothing rests there.
export function aheadOf(s: MmState, side: Side): number | null {
  const o = ordersOf(s.book, "you").find((x) => x.side === side);
  return o ? (queueAhead(s.book, o.id) ?? 0) : null;
}

/// Adverse-selection loss (positive $) above which the desk warns: 60% of the mission's cap, else of spread capture.
export function adverseWarnAt(mission: MmMission, spreadCapture: number): number {
  const cap = mission.objectives.find((o) => o.kind === "adverseCap");
  return ADVERSE_SHARE * (cap?.kind === "adverseCap" ? cap.limit : Math.max(0, spreadCapture));
}

/// True from 30 s before an announced news tick until the tick itself.
export const newsWindow = (mission: MmMission, t: number) =>
  Boolean(mission.news?.announced && t >= mission.news.t - NEWS_LEAD && t < mission.news.t);

/// Live next-move advice, most urgent first (at most six).
export function mmAdvice(mission: MmMission, state: MmState): MmAdvice[] {
  if (state.settled) return [{ id: "ended", tone: "done", vars: { pnl: state.hist[state.hist.length - 1].pnl }, action: { kind: "screen", screen: "debrief" } }];
  const items: MmAdvice[] = [];
  const inv = state.ledger.inventory;
  const live = state.quote.live;
  const news = newsWindow(mission, state.t);

  if (!live && !news) items.push({ id: "notQuoting", tone: "urgent", vars: {}, action: { kind: "key", code: "F9" } });
  if (news && live) items.push({ id: "newsSoon", tone: "urgent", vars: { left: (mission.news?.t ?? 0) - state.t }, action: { kind: "key", code: "F9" } });
  const near = Math.abs(inv) > NEAR * mission.limit;
  if (near) items.push({ id: "inventoryNear", tone: "urgent", vars: { inv, limit: mission.limit, long: inv > 0 ? 1 : 0 }, action: { kind: "key", code: inv > 0 ? "F7" : "F8" } });

  const recent = makerFills(state).filter((f) => f.t >= state.t - ONE_SIDED_WINDOW);
  const buys = recent.filter((f) => f.side === "buy").length;
  if (recent.length >= ONE_SIDED_MIN && !near) {
    const share = Math.max(buys, recent.length - buys) / recent.length;
    const bought = buys * 2 > recent.length;
    if (share >= ONE_SIDED)
      items.push({ id: "oneSided", tone: "suggest", vars: { share, bought: bought ? 1 : 0, n: recent.length }, action: { kind: "key", code: bought ? "F7" : "F8" } });
  }

  const parts = mmPnlParts(mission, state);
  const adverse = Math.max(0, -parts.adverse);
  const warn = adverseWarnAt(mission, parts.spread);
  if (adverse > 0 && adverse > warn) items.push({ id: "adverseHigh", tone: "suggest", vars: { adverse, warn }, action: { kind: "key", code: "F5" } });

  if (live) {
    const ahead = Math.max(aheadOf(state, "buy") ?? 0, aheadOf(state, "sell") ?? 0);
    if (ahead > BACK_OF_QUEUE * state.quote.size) items.push({ id: "backOfQueue", tone: "info", vars: { ahead }, action: { kind: "key", code: "F4" } });
    if (!near) items.push({ id: "onTrack", tone: "info", vars: { inv }, action: { kind: "key", code: "F2" } });
  }
  return rankAdvice(items);
}

/// Every advice id the desk can show (for the copy test).
export const ADVICE_IDS = ["ended", "notQuoting", "newsSoon", "inventoryNear", "oneSided", "adverseHigh", "backOfQueue", "onTrack"] as const;
