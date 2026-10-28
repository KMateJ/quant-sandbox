import { Panel } from "../../../../components/layout";
import { ChallengeRecord, DataTable, type DataColumn } from "../../../../components/ui";
import { useI18n, type TranslationKey } from "../../../../i18n";
import type { RescueOutcome } from "../../engine/policies.math";
import type { FinNetwork } from "../../engine/systemic.types";
import { RESCUE_CHUNK, RESCUE_CHUNKS, RESCUE_MBS_DROP } from "../rescue.math";
import type { RescueGame } from "../useRescueGame";
import { useGraphText } from "../useGraphText";

/// Rescue controls: scenario, budget meter, placed chunks, Run and the comparison with the regulator's rules of thumb.
export default function RescuePanel({ game, net }: { game: RescueGame; net: FinNetwork }) {
  const { t } = useI18n();
  const { nameOf } = useGraphText();
  const { placed, rows } = game;
  const nameById = (id: string) => { const i = net.institutions.find((x) => x.id === id); return i ? nameOf(i) : id; };
  const columns: DataColumn<RescueOutcome>[] = [
    { key: "policy", header: t("syrShockRescuePolicy"), render: (r) => t(`syrShockPol_${r.policy}` as TranslationKey) },
    { key: "defaults", header: t("syrShockStatFailed"), align: "end", render: (r) => r.defaults },
    { key: "loss", header: t("syrShockStatLoss"), align: "end", render: (r) => `$${r.totalLoss.toFixed(0)}bn` },
  ];
  return (
    <Panel title={t("syrShockRescueTitle")}>
      <p>{t("syrShockRescueIntro", { name: nameById(game.scenario.failed), chunk: RESCUE_CHUNK, n: RESCUE_CHUNKS, drop: Math.round(100 * RESCUE_MBS_DROP) })}</p>
      <div className="syr-budget" role="img" aria-label={t("syrShockBudgetAria", { left: RESCUE_CHUNKS - placed.length, n: RESCUE_CHUNKS })}>
        {Array.from({ length: RESCUE_CHUNKS }, (_, i) => <span key={i} className={i < placed.length ? "is-spent" : ""} />)}
        <span className="syr-budget-text">{t("syrShockBudgetLeft", { left: (RESCUE_CHUNKS - placed.length) * RESCUE_CHUNK })}</span>
      </div>
      <ul className="syr-chunks">
        {placed.map((id, i) => (
          <li key={i}>
            <span>+{RESCUE_CHUNK} · {nameById(id)}</span>
            <button type="button" className="preset-btn" aria-label={t("syrShockRemoveChunk", { name: nameById(id) })} onClick={() => game.remove(id)}>−</button>
          </li>
        ))}
      </ul>
      <div className="syr-shock-actions">
        <button type="button" className="lp-btn lp-btn--primary" disabled={rows !== null} onClick={game.run}>{t("syrShockRun")}</button>
        <button type="button" className="lp-btn" disabled={placed.length === 0} onClick={game.clear}>{t("syrShockClearPlan")}</button>
      </div>
      {rows && (
        <>
          <DataTable columns={columns} rows={rows} getRowKey={(r) => r.policy} className="syr-rescue-table" />
          <p className={game.hit ? "syr-verdict is-hit" : "syr-verdict is-miss"} role="status">{t(game.hit ? "syrShockRescueHit" : "syrShockRescueMiss")}</p>
        </>
      )}
      <ChallengeRecord id={game.challengeId} />
    </Panel>
  );
}
