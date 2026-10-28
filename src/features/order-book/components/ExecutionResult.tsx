import { useEffect, useMemo, useRef } from "react";
import { ChallengeRecord } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { recordChallenge } from "../../../lib/game/challengeScores";
import { EXEC_HIT_FACTOR, filledOf, runExecutionPolicy, shortfallBp } from "../execution.math";
import type { ExecChallenge, MyFill } from "../orderBook.types";
import type { FlowSpec } from "../../../lib/market/market.types";

const CHALLENGE = "obk-execution";

type Props = { challenge: ExecChallenge; fills: MyFill[]; seed: number; spec: FlowSpec };

const usd = (bp: number, arrival: number, size: number) => ((bp / 1e4) * arrival * size) / 100;

/// You vs one market order vs TWAP on the same seed; the round is saved once when it ends.
export default function ExecutionResult({ challenge, fills, seed, spec }: Props) {
  const { t } = useI18n();
  const buys = fills.filter((f) => f.side === "buy");
  const you = shortfallBp(buys, challenge.arrival);
  const [one, twap] = useMemo(() => [runExecutionPolicy(seed, spec, "oneShot").shortfallBp, runExecutionPolicy(seed, spec, "twap10").shortfallBp], [seed, spec]);
  const hit = you <= EXEC_HIT_FACTOR * one;
  const saved = useRef<ExecChallenge | null>(null);
  useEffect(() => {
    if (saved.current === challenge) return;
    saved.current = challenge;
    recordChallenge(CHALLENGE, hit, Date.now());
  }, [challenge, hit]);
  const size = filledOf(buys);
  const rows = [
    { key: "you", label: t("obkExecYou"), bp: you },
    { key: "one", label: t("obkExecOneShot"), bp: one },
    { key: "twap", label: t("obkExecTwap"), bp: twap },
  ];
  return (
    <div className="obk-exec-result">
      <table className="obk-fill-table">
        <thead><tr><th>{t("obkExecStrategy")}</th><th>{t("obkExecBp")}</th><th>{t("obkExecUsd")}</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.key} className={r.key === "you" ? "is-you" : undefined}>
              <td>{r.label}</td><td>{r.bp.toFixed(2)}</td><td>{usd(r.bp, challenge.arrival, size || challenge.target).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={hit ? "obk-verdict is-hit" : "obk-verdict is-miss"}>
        {t(hit ? "obkExecHit" : "obkExecMiss", { target: (EXEC_HIT_FACTOR * one).toFixed(2) })}
      </p>
      <ChallengeRecord id={CHALLENGE} />
    </div>
  );
}
