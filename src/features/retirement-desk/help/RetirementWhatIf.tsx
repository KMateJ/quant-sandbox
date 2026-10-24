import { useMemo } from "react";
import { WhatIfCard, pct, type GameHelp } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { amount as fmtAmount } from "../retirementFormat";
import type { RetirementDeskModel } from "../useRetirementDesk";
import { retirementWhatIf, type WhatIfVerdict } from "./whatIf.math";

const TONE: Record<WhatIfVerdict, "good" | "bad" | "neutral"> = { comfortable: "good", stretched: "neutral", likelyOut: "bad", countsAsCut: "bad" };

/// What-if tab: this year's decision next to five alternatives, each with its success odds.
export default function RetirementWhatIf({ desk, help }: { desk: RetirementDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const { mission, state, equity } = desk;
  const amount = desk.amount ?? 0;
  const cards = useMemo(() => retirementWhatIf(mission, state, { amount, equity }), [mission, state, amount, equity]);
  const live = !state.settled;
  return (
    <div>
      <p className="gdesk-help-p">{t("retrWiIntro")}</p>
      {cards.map((c) => (
        <WhatIfCard
          key={c.id}
          title={t(`retrWi_${c.id}` as TranslationKey)}
          rows={[
            { label: t("retrWiAmount"), value: fmtAmount(c.amount) },
            { label: t("retrWiEquity"), value: pct(c.equity, 0) },
            { label: t("retrWiRate"), value: pct(c.rate, 1) },
            { label: t("retrWiOdds"), value: pct(c.odds, 0) },
          ]}
          verdicts={c.verdicts.map((v) => ({ text: t(`retrWiV_${v}` as TranslationKey), tone: TONE[v] }))}
          action={live && c.id !== "thisDecision" ? {
            label: t("retrAdvUseAmount"),
            run: () => {
              desk.setAmount(String(c.amount));
              if (!mission.equityLocked) desk.setEquity(c.equity);
              help.point("ticket");
            },
          } : undefined}
        />
      ))}
    </div>
  );
}
