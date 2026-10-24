import { Fragment } from "react";
import { Link } from "react-router-dom";
import Panel from "../../../components/layout/Panel";
import { pct } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { modules } from "../../../modules/registry";
import { CHALLENGES } from "../../../lib/game/challenges.data";
import type { ChallengeStats } from "../../../lib/game/game.types";
import { challengeSummary, groupChallenges } from "../sandbox.math";

const GROUPS = groupChallenges(CHALLENGES);

/// Lab challenges grouped by area: lab link, hit rule, rounds played, hit rate and best streak.
export default function ChallengeTable({ challenges }: { challenges: Readonly<Record<string, ChallengeStats>> }) {
  const { t } = useI18n();
  return (
    <Panel id="sbx-challenges" title={t("sbxChallengesTitle")} className="gdesk-panel" flush>
      <div className="gdesk-scroll">
        <table className="gdesk-matrix sbx-table">
          <thead>
            <tr>
              <th scope="col">{t("sbxColChallenge")}</th>
              <th scope="col">{t("sbxColModule")}</th>
              <th scope="col">{t("sbxColTolerance")}</th>
              <th scope="col">{t("sbxColPlayed")}</th>
              <th scope="col">{t("sbxColHitRate")}</th>
              <th scope="col">{t("sbxColBestStreak")}</th>
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((g) => (
              <Fragment key={g.area}>
                <tr className="sbx-area">
                  <th scope="rowgroup" colSpan={6}>{t(`sbxArea_${g.area}` as TranslationKey)}</th>
                </tr>
                {g.items.map((c) => {
                  const s = challengeSummary(challenges[c.id]);
                  const m = modules.find((x) => x.id === c.moduleId);
                  return (
                    <tr key={c.id}>
                      <th scope="row">{t(`sbxCh_${c.id}` as TranslationKey)}</th>
                      <td>{m ? <Link to={m.path}>{t(m.navKey)}</Link> : "—"}</td>
                      <td>{c.tolerance}</td>
                      {s.played ? (
                        <>
                          <td>{s.played}</td>
                          <td>{pct(s.hitRate, 0)}</td>
                          <td>{s.bestStreak}</td>
                        </>
                      ) : (
                        <td colSpan={3} className="sbx-muted">{t("sbxNotPlayed")}</td>
                      )}
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
