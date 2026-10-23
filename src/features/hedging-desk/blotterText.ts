import type { TranslationKey } from "../../i18n";
import type { DeskEvent, MissionDef, OrderTag } from "./engine/desk.types";
import { num, signed } from "./deskFormat";
import type { Translate } from "./missionCopy";
import { instrumentLabel } from "./sidePanels.math";

const TAG_KEYS: Record<DeskEvent["kind"], TranslationKey> = {
  fill: "hdSideKindFill",
  breach: "hdSideKindBreach",
  expiry: "hdSideKindExpiry",
  start: "hdSideKindStart",
  gap: "hdSideKindGap",
  ivShift: "hdSideKindIv",
  rejected: "hdSideKindRejected",
  assignment: "hdSideKindAssignment",
};

const ORDER_TAG_KEYS: Record<OrderTag, TranslationKey> = {
  client: "hdSideTagClient",
  manual: "hdSideTagManual",
  auto: "hdSideTagAuto",
};

const assertNever = (x: never): never => {
  throw new Error(`Unhandled desk event: ${JSON.stringify(x)}`);
};

/// Short blotter tag for an event kind: FILL, BRCH, EXP, INFO, GAP, IV, REJ, ASGN.
export const eventTag = (t: Translate, event: DeskEvent) => t(TAG_KEYS[event.kind]);

/// One blotter line for a structured engine event.
export function eventText(t: Translate, event: DeskEvent, mission: MissionDef): string {
  switch (event.kind) {
    case "fill": {
      const f = event.fill;
      return t("hdSideEvFill", {
        side: t(f.side === "buy" ? "hdSideBuyCaps" : "hdSideSellCaps"),
        qty: f.qty,
        inst: instrumentLabel(f.id),
        price: num(f.price, 2),
        tag: t(ORDER_TAG_KEYS[f.tag]),
      });
    }
    case "breach": return t("hdSideEvBreach", { delta: signed(event.delta), band: mission.band });
    case "expiry": return t("hdSideEvExpiry");
    case "start": return t("hdSideEvStart");
    case "gap": return t("hdSideEvGap", { move: signed(event.move, 1) });
    case "ivShift": return t("hdSideEvIvShift", { iv: num(event.iv * 100, 1) });
    case "rejected": return t("hdSideEvRejected");
    case "assignment":
      return t("hdSideEvAssignment", { inst: instrumentLabel(event.id), shares: signed(event.shares) });
    default: return assertNever(event);
  }
}
