import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { pct } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { successOdds } from "../engine/odds.math";
import type { SpendRule } from "../engine/retirement.types";
import { nextWithdrawal } from "../engine/rules.math";
import { ODDS_KEY, RULE_KEY } from "../retirementCopy";
import { amount, oddsWord } from "../retirementFormat";
import type { RetirementDeskModel } from "../useRetirementDesk";

const RULES: readonly SpendRule[] = ["fixed", "fixedLow", "pctWealth", "guardrails"];

/// Success odds from today if every remaining year followed one simple spending rule at the current equity share.
export default function RuleCompare({ desk }: { desk: RetirementDeskModel }) {
  const { t } = useI18n();
  const { state, mission, seed, equity } = desk;
  const rows = useMemo(() => {
    if (state.settled) return [];
    return RULES.map((rule) => {
      const first = nextWithdrawal(rule, mission, state.last, state.wealth);
      return { rule, first, odds: successOdds(mission, seed, state.year + 1, state.wealth, first, equity, rule) };
    });
  }, [state, mission, seed, equity]);
  return (
    <Panel id="retr-rules" title={t("retrRulesTitle")} className="gdesk-panel" flush>
      {rows.length === 0 ? (
        <p className="gdesk-label retr-empty">{t("retrRulesDone")}</p>
      ) : (
        <div className="gdesk-scroll">
          <table className="gdesk-matrix">
            <thead>
              <tr>
                <th scope="col">{t("retrColRule")}</th>
                <th scope="col">{t("retrColFirst")}</th>
                <th scope="col">{t("retrOddsLabel")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.rule}>
                  <th scope="row">{t(RULE_KEY[r.rule], { amount: amount(mission.target) })}</th>
                  <td>{amount(r.first)}</td>
                  <td>{pct(r.odds, 0)} · {t(ODDS_KEY[oddsWord(r.odds)])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
