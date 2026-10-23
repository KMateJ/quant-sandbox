import { useMemo } from "react";
import { useI18n } from "../../../../i18n";
import type { DeskHelp } from "../../help/useDeskHelp";
import { whatIfScenarios } from "../../help/whatIf.math";
import { parseQty } from "../../sidePanels.math";
import type { HedgingDeskModel } from "../../useHedgingDesk";
import WhatIfCard from "./WhatIfCard";

/// Side-by-side what-if cards: each candidate trade applied to a copy of the book.
export default function WhatIfTab({ desk, help }: { desk: HedgingDeskModel; help: DeskHelp }) {
  const { t } = useI18n();
  const { mission, state, market, ticket } = desk;
  const qty = parseQty(ticket.qty);
  const results = useMemo(
    () => whatIfScenarios(mission, state, market, { id: ticket.id, side: ticket.side, qty }),
    [mission, state, market, ticket.id, ticket.side, qty],
  );
  return (
    <div className="hdesk-wi">
      <p className="hdesk-help-p">{t("hdWiIntro")}</p>
      {results.map((r) => (
        <WhatIfCard key={r.id} result={r} desk={desk} help={help} />
      ))}
    </div>
  );
}
