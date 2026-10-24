import { useI18n } from "../../i18n";
import { useChallengeStats } from "./useChallengeStats";

/// One muted line with the saved record of a lab challenge; nothing until it has been played.
export default function ChallengeRecord({ id }: { id: string }) {
  const { t } = useI18n();
  const stats = useChallengeStats(id);
  if (!stats) return null;
  return (
    <p className="lp-challenge-record">
      {t("chlRecord")}: {t("chlPlayed")} {stats.played} · {t("chlHits")} {stats.hits} · {t("chlStreak")} {stats.streak} ·{" "}
      {t("chlBest")} {stats.bestStreak}
    </p>
  );
}
