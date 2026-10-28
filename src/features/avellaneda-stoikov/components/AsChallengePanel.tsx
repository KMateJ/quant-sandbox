import { ChallengeRecord } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { CE_SLACK } from "../useAvsChallenge";
import type { AvsLab } from "../useAvellanedaStoikovLab";

/// Challenge brief, the last tournament's verdict and the saved record.
export default function AsChallengePanel({ lab }: { lab: AvsLab }) {
  const { t } = useI18n();
  const { last, id } = lab.challenge;
  return (
    <section className="avs-challenge" aria-live="polite">
      <p>{t("avsChallengeBrief", { slack: CE_SLACK, seed: lab.url.seed, g: lab.params.gamma })}</p>
      {last && (
        <p className={last.hit ? "avs-challenge-result is-hit" : "avs-challenge-result is-miss"}>
          <strong>{t(last.hit ? "avsChallengeHit" : "avsChallengeMiss")}</strong>{" "}
          {t("avsChallengeDetail", { yours: last.yours.toFixed(2), as: last.as.toFixed(2) })}
        </p>
      )}
      <ChallengeRecord id={id} />
    </section>
  );
}
