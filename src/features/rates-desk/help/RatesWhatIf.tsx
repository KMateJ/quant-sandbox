import { useMemo } from "react";
import { WhatIfCard, money, signedMoney, type GameHelp } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import type { RatesDeskModel } from "../useRatesDesk";
import { ratesWhatIf, type WhatIfResult } from "./whatIf.math";

const GOOD = new Set(["inBand", "curveRiskSmall"]);
const BUCKETS: TranslationKey[] = ["ratdBucket0", "ratdBucket1", "ratdBucket2"];

/// What-if tab: each candidate hedge applied to a copy of the book, side by side.
export default function RatesWhatIf({ desk, help }: { desk: RatesDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const { mission, state, path } = desk;
  const cards = useMemo(() => ratesWhatIf(mission, state, path), [mission, state, path]);

  const action = (c: WhatIfResult) => {
    const legs = c.trades.map((q, j) => ({ q, j })).filter((x) => x.q !== 0);
    if (legs.length === 0) return undefined;
    if (legs.length === 1) {
      const { q, j } = legs[0];
      return {
        label: t("gkHelpUseTicket"),
        run: () => {
          desk.setFuture(j);
          desk.setSide(q > 0 ? "buy" : "sell");
          desk.setQty(String(Math.abs(q)));
          help.point("ticket");
        },
      };
    }
    return { label: t("ratdWiTradeIt"), run: () => c.actions.forEach((a) => desk.dispatch(a)) };
  };

  return (
    <div>
      <p className="gdesk-help-p">{t("ratdWiIntro")}</p>
      {cards.map((c) => {
        const blocked = c.verdicts.includes("blocked");
        return (
          <WhatIfCard
            key={c.id}
            title={t(`ratdWi_${c.id}` as TranslationKey)}
            block={blocked ? t("ratdWiBlocked") : undefined}
            rows={[
              { label: t("ratdWiTraded"), value: String(c.traded) },
              { label: t("ratdWiCost"), value: money(c.cost) },
              { label: t("ratdWiNetAfter"), value: signedMoney(c.netAfter) },
              { label: t("ratdWiBucketAfter"), value: `${t(BUCKETS[c.bucket])} ${signedMoney(c.bucketValue)}` },
              { label: t("ratdWiWorst"), value: signedMoney(c.worstScenario) },
            ]}
            verdicts={c.verdicts.map((v) => ({
              text: t(`ratdWiV_${v}` as TranslationKey),
              tone: GOOD.has(v) ? "good" : v === "costly" ? "neutral" : "bad",
            }))}
            action={blocked ? undefined : action(c)}
          />
        );
      })}
    </div>
  );
}
