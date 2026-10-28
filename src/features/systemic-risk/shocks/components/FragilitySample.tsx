import { useMemo, useState } from "react";
import { useI18n } from "../../../../i18n";
import { sampleCascade } from "../fragilitySample.math";
import ContagionGraph from "./ContagionGraph";

/// One random bank network at the chosen average number of links, with the cascade that follows its first failure.
export default function FragilitySample({ degree, seed }: { degree: number; seed: number }) {
  const { t } = useI18n();
  const [draw, setDraw] = useState(0);
  const sample = useMemo(() => sampleCascade(degree, seed, draw), [degree, seed, draw]);
  const view = useMemo(() => ({ status: sample.result.days.at(-1)!.status }), [sample]);
  return (
    <>
      <ContagionGraph net={sample.net} view={view} height={340} bare ariaLabel={t("syrShockSampleAria", { degree })}
        layoutKey={`${degree}-${seed}-${draw}`} seed={seed + draw} />
      <p>{t("syrShockSampleResult", { failed: sample.result.defaults.length, n: sample.net.institutions.length })}</p>
      <button type="button" className="preset-btn" onClick={() => setDraw(draw + 1)}>{t("syrShockSampleNew")}</button>
    </>
  );
}
