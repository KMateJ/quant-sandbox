import { useState } from "react";
import { WhatIfCard } from "../../../components/game";
import { money, num, signedMoney } from "../../../components/game/gameFormat";
import { useI18n, type TranslationKey } from "../../../i18n";
import type { MmState } from "../engine/mm.types";
import type { MmDeskModel } from "../useMarketMakingDesk";
import { mmWhatIf, type MmWhatIf as Row, type MmWhatIfVerdict } from "./whatIf.math";

const TONE: Record<MmWhatIfVerdict, "good" | "bad" | "neutral"> = { safe: "good", risky: "neutral", breaches: "bad", toxic: "bad" };

/// Four robots and "pull now" replayed from this second to the close; computed on click, never per tick.
export default function MmWhatIf({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  const [result, setResult] = useState<{ from: MmState; rows: Row[] } | null>(null);
  const fresh = result?.from === desk.state;
  const run = () => setResult({ from: desk.state, rows: mmWhatIf(desk.mission, desk.state, desk.market) });

  if (desk.state.settled) return <p className="gdesk-help-p">{t("mmdWiSettled")}</p>;
  return (
    <div className="mmd-whatif">
      <p className="gdesk-help-p">{t("mmdWiIntro", { t: desk.state.t })}</p>
      <div className="gdesk-help-actions">
        <button type="button" className="gdesk-btn" id="mmd-whatif-run" onClick={run}>{t(result ? "mmdWiRerun" : "mmdWiRun")}</button>
      </div>
      {result && !fresh && <p className="gdesk-label">{t("mmdWiStale", { t: result.from.t })}</p>}
      {result?.rows.map((c) => (
        <WhatIfCard
          key={c.id}
          title={t(`mmdWi_${c.id}_title` as TranslationKey)}
          body={t(`mmdWi_${c.id}_body` as TranslationKey)}
          rows={[
            { label: t("mmdQPnl"), value: signedMoney(c.pnl) },
            { label: t("mmdDbMaxInv"), value: num(c.maxInv, 0) },
            { label: t("mmdQAdverse"), value: money(c.adverse) },
            { label: t("mmdBreaches"), value: String(c.breaches) },
          ]}
          verdicts={[{ text: t(`mmdWiV_${c.verdict}` as TranslationKey), tone: TONE[c.verdict] }]}
        />
      ))}
    </div>
  );
}
