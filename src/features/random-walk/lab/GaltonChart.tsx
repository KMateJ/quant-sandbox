import { useMemo } from "react";
import { Histogram } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import { normalDensity, pmfDensity, siteBins } from "../randomWalk.math";

type Props = {
  counts: number[];
  walkers: number;
  step: number;
  p: number;
  h: number;
  range: [number, number];
  isMobile: boolean;
};

/// Galton-board view: walkers piled up by position after `step` steps, with the exact binomial pmf (points)
/// and its normal approximation (line) in the same density units.
export default function GaltonChart({ counts, walkers, step, p, h, range, isMobile }: Props) {
  const { t } = useI18n();
  const bins = useMemo(() => siteBins(counts, step, h, range), [counts, step, h, range]);
  const pmf = useMemo(() => pmfDensity(step, p, h), [step, p, h]);
  const normal = useMemo(() => normalDensity(step, p, h, range[0], range[1]), [step, p, h, range]);
  return (
    <ChartContainer title={t("rwGaltonTitle", { n: walkers, s: step })}>
      <Histogram
        bins={bins}
        density={normal.length ? normal : undefined}
        dots={pmf.filter((d) => d.x > range[0] + h && d.x < range[1] - h)}
        height={isMobile ? 260 : 340}
        xFormat={(v) => String(Math.round(v * 100) / 100)}
        yFormat={(v) => v.toFixed(2)}
        ariaLabel={t("rwGaltonAria", { n: walkers, s: step })}
      />
      <ul className="rw-legend" aria-hidden="true">
        <li><span className="rw-key rw-key-bar" />{t("rwLegendWalkers")}</li>
        <li><span className="rw-key rw-key-dot" />{t("rwLegendPmf")}</li>
        <li><span className="rw-key rw-key-line" />{t("rwLegendNormal")}</li>
      </ul>
    </ChartContainer>
  );
}
