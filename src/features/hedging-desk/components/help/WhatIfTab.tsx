import { useMemo } from "react";
import { WhatIfCard } from "../../../../components/game";
import type { GameHelp } from "../../../../components/game/useGameHelp";
import { money, num, pct, signed } from "../../../../components/game/gameFormat";
import { useI18n } from "../../../../i18n";
import { whatIfScenarios } from "../../help/whatIf.math";
import { verdictTone, whatIfBlockKey, whatIfTitleKey, whatIfVerdictKey } from "../../help/whatIfCopy";
import { parseQty } from "../../sidePanels.math";
import type { HedgingDeskModel } from "../../useHedgingDesk";
import WhatIfDetail from "./WhatIfDetail";

const VERDICT_TONE = { done: "good", urgent: "bad", info: "neutral" } as const;

/// Side-by-side what-if cards: each candidate trade applied to a copy of the book.
export default function WhatIfTab({ desk, help }: { desk: HedgingDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const { mission, state, market, ticket } = desk;
  const qty = parseQty(ticket.qty);
  const results = useMemo(
    () => whatIfScenarios(mission, state, market, { id: ticket.id, side: ticket.side, qty }),
    [mission, state, market, ticket.id, ticket.side, qty],
  );
  return (
    <div className="gdesk-wi">
      <p className="gdesk-help-p">{t("hdWiIntro")}</p>
      {results.map((r) => {
        const first = r.orders[0];
        const loadable = !r.block && r.id !== "ticket" && first !== undefined;
        const load = () => {
          desk.setTicketId(first.id);
          desk.setSide(first.side);
          desk.setQty(String(first.qty));
          help.point("ticket");
        };
        return (
          <WhatIfCard
            key={r.id}
            title={t(whatIfTitleKey(r.id))}
            block={r.block ? t(whatIfBlockKey(r.block)) : undefined}
            body={loadable && r.orders.length > 1 ? `${t("hdWiStep", { n: 1, total: r.orders.length })} · ${t("hdWiMultiLeg")}` : undefined}
            rows={[
              { label: t("hdWiCost"), value: money(r.cost) },
              { label: t("hdWiDeltaAfter"), value: signed(r.after.delta) },
              { label: t("hdWiGammaAfter"), value: num(r.after.gamma, 1) },
              { label: t("hdWiBreach"), value: pct(r.breachChance, 0) },
            ]}
            verdicts={r.verdicts.map((v) => ({ text: t(whatIfVerdictKey(v)), tone: VERDICT_TONE[verdictTone(v)] }))}
            action={loadable ? { label: t("gkHelpUseTicket"), run: load } : undefined}
            detail={<WhatIfDetail result={r} desk={desk} />}
          />
        );
      })}
    </div>
  );
}
