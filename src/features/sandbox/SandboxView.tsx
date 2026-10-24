import { useRef } from "react";
import { useI18n } from "../../i18n";
import { CommandBar, GameFrame, QuoteStrip, pct } from "../../components/game";
import { CHALLENGES } from "../../lib/game/challenges.data";
import { DESK_MISSIONS } from "./sandbox.data";
import { challengeTotals } from "./sandbox.math";
import { useSandboxData } from "./useSandboxData";
import DeskTable from "./components/DeskTable";
import ChallengeTable from "./components/ChallengeTable";

/// Sandbox hub: every game desk with saved missions and every lab challenge with saved scores.
export default function SandboxView() {
  const { t } = useI18n();
  const rootRef = useRef<HTMLDivElement>(null);
  const { desks, challenges } = useSandboxData();
  const done = desks.reduce((n, d) => n + d.completed.length, 0);
  const totals = challengeTotals(challenges);
  return (
    <GameFrame deskClass="sbx" expanded={false} demo={false} rootRef={rootRef}>
      <CommandBar ticker="QS Sandbox" code="SBX <GO>" title={t("sbxTitle")} clock={t("sbxClock", { n: CHALLENGES.length })} demo={false} />
      <QuoteStrip
        id="sbx-quotes"
        cells={[
          { label: t("sbxQuoteDesks"), value: String(desks.length) },
          { label: t("sbxQuoteMissions"), value: `${done} / ${desks.length * DESK_MISSIONS}` },
          { label: t("sbxQuotePlayed"), value: String(totals.played) },
          { label: t("sbxQuoteHitRate"), value: pct(totals.hitRate, 0) },
        ]}
      />
      <p className="sbx-intro">{t("sbxIntro")} {t("sbxHowScores")}</p>
      <div className="sbx-grid">
        <DeskTable desks={desks} />
        <ChallengeTable challenges={challenges} />
      </div>
    </GameFrame>
  );
}
