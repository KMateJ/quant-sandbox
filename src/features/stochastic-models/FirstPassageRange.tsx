import { RangeGuess, useRangeGuess } from "../../components/ui";
import { nextNormal } from "../../lib/math/random";
import { useI18n } from "../../i18n";
import { FP_LOG_TIME_DOMAIN, drawFirstPassageTime, firstPassageQuantile, formatPassageTime } from "./pathGeometry.math";

const log10 = Math.log10;
const fmt = (v: number) => formatPassageTime(10 ** v);

/// Calibration round on a log-time track: a 90% range for the hitting time τₐ of one fresh path, drawn exactly
/// as a² / Z². The heavy right tail (infinite mean) is what a symmetric "median ± a bit" range misses.
export default function FirstPassageRange({ barrier }: { barrier: number }) {
  const { t } = useI18n();
  const [min, max] = FP_LOG_TIME_DOMAIN;
  const guess = useRangeGuess({
    truth: () => log10(drawFirstPassageTime(barrier, nextNormal(Math.random))),
    initial: [log10(0.1), log10(1)],
    bounds: FP_LOG_TIME_DOMAIN,
    resetKey: barrier,
  });

  return (
    <RangeGuess
      state={guess}
      prompt={t("pgFpRangePrompt", { a: barrier.toFixed(2) })}
      hint={t("pgFpRangeHint")}
      format={fmt}
      min={min}
      max={max}
      step={0.05}
      reference={{
        lo: log10(firstPassageQuantile(barrier, 0.05)),
        hi: log10(firstPassageQuantile(barrier, 0.95)),
        label: t("pgFpRangeTheory"),
      }}
    />
  );
}
