import { ChartContainer } from "../../components/layout";
import { PlaybackControls, usePlayback } from "../../components/playback";
import { useI18n } from "../../i18n";
import { planBalance, planPaidIn, raceLeader } from "./tvm.math";
import { RACE_YEARS } from "./tvm.url";
import TvmRaceBars from "./TvmRaceBars";
import TvmRacePlans from "./TvmRacePlans";
import type { TvmLab } from "./useTvmLab";

/// Steps per year of the race, so the animation moves smoothly between year-ends.
const STEPS_PER_YEAR = 4;
const STEPS = RACE_YEARS * STEPS_PER_YEAR;

/// Three savings plans grow side by side over 40 years at the lab's rate; play, pause or scrub through time.
export default function TvmRace({ lab }: { lab: TvmLab }) {
  const { t } = useI18n();
  const playback = usePlayback({ steps: STEPS, durationMs: 8000 });
  const year = playback.step / STEPS_PER_YEAR;
  const rate = lab.inputs.rate;
  const money = (v: number) => Math.round(v).toLocaleString();
  const rows = lab.plans.map((plan) => {
    const balance = planBalance(plan, rate, year);
    const paid = planPaidIn(plan, year);
    return { plan, balance, paid, interest: balance - paid };
  });
  const peak = Math.max(1, ...lab.plans.map((p) => planBalance(p, rate, RACE_YEARS)));
  const leader = raceLeader(lab.plans, rate, year);

  return (
    <ChartContainer title={t("tvmRaceTitle")}>
      <p className="tvm-race-caption">{t("tvmRaceCaption")}</p>
      <TvmRacePlans plans={lab.plans} onChange={lab.setPlan} />
      <p className="control-hint">{t("tvmRaceRateNote", { rate: `${(rate * 100).toFixed(2)}%` })}</p>
      <div className="tvm-race-year" aria-live="polite">{t("tvmRaceYearValue", { year: Math.floor(year) })}</div>
      <TvmRaceBars rows={rows} peak={peak} leader={leader} money={money} />
      <PlaybackControls
        playback={playback}
        steps={STEPS}
        label={t("tvmRaceYear")}
        formatStep={(s) => (s / STEPS_PER_YEAR).toFixed(0)}
        showSpeed
      />
    </ChartContainer>
  );
}
