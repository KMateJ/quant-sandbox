import Panel from "../../../../components/layout/Panel";
import { useI18n } from "../../../../i18n";
import type { DeskProgress } from "../../deskProgress";
import { signedMoney } from "../../deskFormat";
import { MISSIONS } from "../../engine/missions.data";
import { missionTaglineKey, missionTitleKey } from "../../missionCopy";

const GREEK_SYMBOL = { delta: "Δ", gamma: "Γ", vega: "ν" } as const;

type Props = { selectedId: string; progress: DeskProgress; onSelect: (id: string) => void };

/// Every mission as a selectable row: id, title + tagline, Greeks, status.
export default function MissionList({ selectedId, progress, onSelect }: Props) {
  const { t } = useI18n();
  return (
    <Panel title={t("hdMsListTitle")} className="hdesk-panel" flush>
      <div className="hdesk-mlist-head hdesk-label" aria-hidden="true">
        <span />
        <span>{t("hdMsColMission")}</span>
        <span>{t("hdMsColGreeks")}</span>
        <span>{t("hdMsColStatus")}</span>
      </div>
      <ul className="hdesk-mlist" aria-label={t("hdMsListAria")}>
        {MISSIONS.map((m) => {
          const done = progress[m.id];
          const status = done?.completed
            ? t("hdMsCompleted", { pnl: signedMoney(done.bestPnl) })
            : t("hdMsAvailable");
          return (
            <li key={m.id}>
              <button
                type="button"
                className={`hdesk-mlist-row${m.id === selectedId ? " is-selected" : ""}`}
                aria-pressed={m.id === selectedId}
                onClick={() => onSelect(m.id)}
              >
                <span className="hdesk-mlist-id">{m.id}</span>
                <span className="hdesk-mlist-title">
                  <strong>{t(missionTitleKey(m.id))}</strong>
                  <span>{t(missionTaglineKey(m.id))}</span>
                </span>
                <span className="hdesk-mlist-greeks">{m.greeks.map((g) => GREEK_SYMBOL[g]).join(" ")}</span>
                <span className={`hdesk-mlist-status${done?.completed ? " hdesk-up" : ""}`}>{status}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
