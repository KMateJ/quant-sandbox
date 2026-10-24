import { useMemo } from "react";
import { WhatIfCard, money, num, signed, signedMoney, type GameHelp } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { targetsFromWeights } from "../ticket.math";
import type { AlmDeskModel } from "../useAlmDesk";
import { almWhatIf, type AlmWhatIfVerdict } from "./whatIf.math";

const TONE: Record<AlmWhatIfVerdict, "good" | "bad" | "neutral"> = {
  matched: "good",
  gapStays: "bad",
  moreConvex: "neutral",
  lessConvex: "neutral",
  costly: "bad",
};

/// Five alternative books side by side; "Put in ticket" copies a candidate's weights into the ticket.
export default function AlmWhatIf({ desk, help }: { desk: AlmDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const cards = useMemo(() => almWhatIf(desk.mission, desk.state), [desk.mission, desk.state]);
  return (
    <div>
      {cards.map((c) => (
        <WhatIfCard
          key={c.id}
          title={t(`almdWi_${c.id}_title` as TranslationKey)}
          body={t(`almdWi_${c.id}_body` as TranslationKey)}
          block={c.block && t(`almdWiBlock_${c.block}` as TranslationKey)}
          rows={[
            { label: t("almdWiCost"), value: money(c.cost) },
            { label: t("almdWiGapAfter"), value: signed(c.gapAfter, 2) },
            { label: t("almdWiConvAfter"), value: t("almdWiConvValue", { a: num(c.convAfter, 1), l: num(c.convLiab, 1) }) },
            { label: t("almdWiWorst"), value: signedMoney(c.worstShock) },
          ]}
          verdicts={c.verdicts.map((v) => ({ text: t(`almdWiV_${v}` as TranslationKey), tone: TONE[v] }))}
          action={
            c.id === "doNothing"
              ? undefined
              : {
                  label: t("gkHelpUseTicket"),
                  run: () => {
                    targetsFromWeights(c.weights).forEach((v, i) => desk.setTarget(i, v));
                    help.point("ticket");
                  },
                }
          }
        />
      ))}
    </div>
  );
}
