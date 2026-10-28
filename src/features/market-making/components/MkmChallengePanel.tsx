import { ChallengeRecord } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { INVENTORY_LIMIT } from "../marketMaking.types";
import type { MkmChallenge } from "../useMkmChallenge";
import { usd } from "./mkmFormat";

/// Challenge brief, the last round's verdict and the saved record.
export default function MkmChallengePanel({ scoring }: { scoring: MkmChallenge }) {
  const { t } = useI18n();
  const { last } = scoring;
  return (
    <section className="mkm-challenge" aria-live="polite">
      <p className="mkm-challenge-brief">{t("mkmChallengeBrief", { target: usd(scoring.target), limit: INVENTORY_LIMIT.toLocaleString() })}</p>
      {last && (
        <p className={last.hit ? "mkm-challenge-result is-hit" : "mkm-challenge-result is-miss"}>
          <strong>{t(last.hit ? "mkmChallengeHit" : "mkmChallengeMiss")}</strong>{" "}
          {t("mkmChallengeDetail", { pnl: usd(last.pnl), target: usd(last.target), inv: last.maxAbsInventory.toLocaleString() })}
        </p>
      )}
      <ChallengeRecord id={scoring.id} />
    </section>
  );
}
