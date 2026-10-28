import { useMemo } from "react";
import { useUrlState } from "../../../components/useUrlState";
import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { Histogram, ScatterChart } from "../../../components/charts";
import type { ScatterSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { binValues } from "../../../lib/stats";
import { excessKurtosis } from "../../../lib/stats/moments";
import { normalLaw } from "../../../lib/stats/distributions";
import { densityCurve } from "../../../lib/stats/ensemble";
import { useI18n } from "../../../i18n";
import { JUMPS_URL_SCHEMA } from "../gbm.sde.url";
import { mertonReturnLaw, simulateMerton } from "../gbm.jumps.math";
import SdeLayout from "./SdeLayout";

const S0 = 100;
const STEPS = 252;
const SHOWN = 3;
const PATHS = 200;
const COLORS = ["var(--primary)", "var(--text)", "var(--warning-title)"];
const dec = (v: number, d = 2) => v.toFixed(d);

/// Merton jump-diffusion: price paths with their jumps marked, and the fat-tailed daily return histogram.
export default function JumpsPage() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [url, setUrl] = useUrlState(JUMPS_URL_SCHEMA);
  const { sigma, lambda, jumpMean, jumpSd, seed } = url;
  const params = useMemo(() => ({ mu: 0.06, sigma, lambda, jumpMean, jumpSd }), [sigma, lambda, jumpMean, jumpSd]);

  const sim = useMemo(() => simulateMerton(S0, params, 1, STEPS, PATHS, seed), [params, seed]);
  const law = mertonReturnLaw(params, 1 / STEPS);
  const kurt = useMemo(() => excessKurtosis(sim.returns), [sim]);

  const series: ScatterSeries[] = useMemo(() => {
    const out: ScatterSeries[] = [];
    for (let q = 0; q < SHOWN; q++) {
      const line = Array.from({ length: STEPS + 1 }, (_, s) => ({ x: s / STEPS, y: sim.levels[s * PATHS + q] }));
      const marks = line.filter((_, s) => s > 0 && sim.jumps[(s - 1) * PATHS + q] > 0);
      out.push({ key: `p${q}`, label: `${q + 1}`, color: COLORS[q], points: line, line: true, strokeWidth: 1.5, legend: false });
      out.push({ key: `j${q}`, label: t("sdeJumpsMarker"), color: COLORS[q], points: marks, radius: 5, hollow: true, legend: false });
    }
    return out;
  }, [sim, t]);

  const sd = Math.sqrt(law.variance);
  const domain: [number, number] = [law.mean - 7 * sd, law.mean + 7 * sd];
  const hist = binValues(sim.returns, domain, 61);
  const tails = useMemo(() => sim.returns.filter((r) => Math.abs(r - law.mean) > 3 * sd).length / sim.returns.length, [sim, law.mean, sd]);

  return (
    <SdeLayout
      titleKey="sdeJumpsTitle"
      descKey="sdeJumpsDesc"
      controls={
        <>
          <SliderField label={t("sdeJumpsLambda")} min={0} max={30} step={1} value={lambda} onChange={(v) => setUrl({ lambda: v })} formatValue={(v) => dec(v, 0)} />
          <SliderField label={t("sdeJumpsMean")} min={-0.2} max={0.1} step={0.01} value={jumpMean} onChange={(v) => setUrl({ jumpMean: v })} formatValue={dec} />
          <SliderField label={t("sdeJumpsSd")} min={0.01} max={0.2} step={0.01} value={jumpSd} onChange={(v) => setUrl({ jumpSd: v })} formatValue={dec} />
          <SliderField label={t("gbmVolLabel")} min={0.05} max={0.5} step={0.01} value={sigma} onChange={(v) => setUrl({ sigma: v })} formatValue={dec} />
          <SeedControl seed={seed} setSeed={(s) => setUrl({ seed: s })} compact />
        </>
      }
      stats={[
        { label: t("sdeJumpsKurtosis"), value: dec(kurt, 1) },
        { label: t("sdeJumpsKurtosisExact"), value: dec(law.excessKurtosis, 1) },
        { label: t("sdeJumpsTails"), value: `${dec(tails * 100, 2)}%` },
        { label: t("sdeJumpsTailsNormal"), value: "0.27%" },
      ]}
    >
      <ChartContainer title={t("sdeJumpsPathsTitle", { n: SHOWN })}>
        <div className="sde-chart">
          <ScatterChart series={series} isMobile={isMobile} xFormat={(v) => dec(v, 1)} yFormat={(v) => dec(v, 0)} xLabel="t" />
        </div>
      </ChartContainer>
      <ChartContainer title={t("sdeJumpsHistTitle", { n: PATHS * STEPS })}>
        <Histogram bins={hist.bins} density={densityCurve(normalLaw(law.mean, sd), domain)} height={isMobile ? 200 : 260}
          xFormat={(v) => dec(v * 100, 0)} yFormat={(v) => String(Math.round(v))} ariaLabel={t("sdeJumpsHistAria")} />
      </ChartContainer>
    </SdeLayout>
  );
}
