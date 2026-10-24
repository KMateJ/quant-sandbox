import { useMemo } from "react";
import { WhatIfCard } from "../../../components/game";
import { money, num, pct } from "../../../components/game/gameFormat";
import { useI18n, type TranslationKey } from "../../../i18n";
import { ASSET_KEY } from "../portfolioCopy";
import { ASSET_CODES, FUND_SIZE } from "../portfolioFormat";
import type { PortfolioDeskModel } from "../usePortfolioDesk";
import { portfolioWhatIf, type WhatIfVerdict } from "./whatIf.math";

const TONE: Record<WhatIfVerdict, "good" | "bad" | "neutral"> = {
  onTarget: "good",
  offTarget: "bad",
  concentrated: "bad",
  spread: "good",
  costly: "bad",
};

/// Five rebalances side by side under today's risk model, each with "Put in ticket".
export default function PortfolioWhatIf({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const { mission, state, path } = desk;
  const cards = useMemo(() => portfolioWhatIf(mission, state, path.R), [mission, state, path]);
  const closed = state.settled || desk.demo;

  return (
    <div className="pmgr-whatif">
      {cards.map((c) => (
        <WhatIfCard
          key={c.id}
          title={t(`pmgrWi_${c.id}_title` as TranslationKey)}
          body={t(`pmgrWi_${c.id}_body` as TranslationKey)}
          rows={[
            { label: t("pmgrWiRowCost"), value: money(c.cost * FUND_SIZE) },
            { label: t("pmgrWiRowVol"), value: pct(c.vol) },
            { label: t("pmgrWiRowSharpe"), value: num(c.sharpe, 2) },
            { label: t("pmgrWiRowTop"), value: `${t(ASSET_KEY[ASSET_CODES[c.topAsset]])} ${pct(c.topShare, 0)}` },
            { label: t("pmgrWiRowLoss"), value: money(-c.loss95 * FUND_SIZE) },
          ]}
          verdicts={c.verdicts.map((v) => ({ text: t(`pmgrWiV_${v}` as TranslationKey), tone: TONE[v] }))}
          action={closed || c.id === "doNothing" ? undefined : { label: t("pmgrWiPut"), run: () => desk.fillTargets(c.targets) }}
        />
      ))}
    </div>
  );
}
