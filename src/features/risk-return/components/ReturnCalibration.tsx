import { RangeGuess, useRangeGuess } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { drawAnnualReturn, normalInterval, returnGuessDomain } from "../riskReturn.math";

type Props = {
  portReturn: number;
  portVol: number;
  /// Changes whenever an input changes, so a revealed round gives way to a new one.
  resetKey: string;
};

const pctNum = (v: number) => (v * 100).toFixed(1);
const pct = (v: number) => `${pctNum(v)}%`;
const snap = (v: number) => Math.round(v * 200) / 200;

/// "Next year's return" calibration round: a 90% range for one year drawn from N(E[rₚ], σₚ²).
export default function ReturnCalibration({ portReturn, portVol, resetKey }: Props) {
  const { t } = useI18n();
  const [min, max] = returnGuessDomain(portReturn, portVol);
  const guess = useRangeGuess({
    truth: () => drawAnnualReturn(portReturn, portVol),
    initial: [snap(portReturn - 0.05), snap(portReturn + 0.05)],
    bounds: [min, max],
    resetKey,
  });
  const [refLo, refHi] = normalInterval(portReturn, portVol);

  return (
    <RangeGuess
      state={guess}
      prompt={t("riskReturnRgPrompt", { mu: pct(portReturn), sigma: pct(portVol) })}
      hint={t("riskReturnRgHint")}
      format={pctNum}
      unit="%"
      min={min}
      max={max}
      step={0.005}
      reference={{ lo: refLo, hi: refHi, label: t("riskReturnRgTextbook") }}
    />
  );
}
