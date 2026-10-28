import { ChallengeRecord } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { EXEC_DEADLINE, EXEC_HIT_FACTOR, EXEC_TARGET, filledOf, shortfallBp } from "../execution.math";
import type { OrderBookLab } from "../useOrderBookLab";
import ExecutionResult from "./ExecutionResult";

/// Execution challenge: buy 5,000 shares within 120 s; progress, clock and live shortfall, then the comparison.
export default function ExecutionPanel({ lab }: { lab: OrderBookLab }) {
  const { t } = useI18n();
  const { sim } = lab;
  const c = sim.challenge;
  const rules = t("obkExecRules", { n: EXEC_TARGET.toLocaleString("en-US"), s: EXEC_DEADLINE, pct: Math.round(EXEC_HIT_FACTOR * 100) });
  if (!c) {
    return (
      <div className="obk-exec">
        <p>{rules}</p>
        <button type="button" className="lp-btn lp-btn--primary" onClick={sim.startChallenge}>{t("obkExecStart")}</button>
        <ChallengeRecord id="obk-execution" />
      </div>
    );
  }
  const buys = sim.myFills.filter((f) => f.side === "buy");
  const bought = Math.min(c.target, filledOf(buys));
  return (
    <div className="obk-exec">
      <div className="obk-progress" role="progressbar" aria-valuemin={0} aria-valuemax={c.target} aria-valuenow={bought} aria-label={t("obkExecProgress")}>
        <span style={{ width: `${(bought / c.target) * 100}%` }} />
      </div>
      <dl className="obk-exec-stats">
        <div><dt>{t("obkExecBought")}</dt><dd>{bought.toLocaleString("en-US")} / {c.target.toLocaleString("en-US")}</dd></div>
        <div><dt>{t("obkExecLeft")}</dt><dd>{Math.max(0, c.deadline - sim.t)} s</dd></div>
        <div><dt>{t("obkExecLive")}</dt><dd>{buys.length ? `${shortfallBp(buys, c.arrival).toFixed(2)} bp` : "–"}</dd></div>
      </dl>
      {c.done ? (
        <>
          <ExecutionResult challenge={c} fills={sim.myFills} seed={lab.url.seed} spec={sim.spec} />
          <button type="button" className="lp-btn" onClick={sim.startChallenge}>{t("obkExecAgain")}</button>
        </>
      ) : <p className="obk-hint">{t("obkExecHint")}</p>}
    </div>
  );
}
