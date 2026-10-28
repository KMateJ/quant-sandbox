import { useMemo } from "react";
import { useUrlState } from "../../../components/useUrlState";
import SliderField from "../../../components/SliderField";
import SeedControl from "../../../components/SeedControl";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { Histogram, LineChart } from "../../../components/charts";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../../components/layout";
import { SegmentedControl } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { BETTING_SETUP, histogram } from "../../../lib/stochastic/martingaleBetting.math";
import { simulateMartingale, type MartingaleStrategy } from "../martingales.math";
import { MARTINGALE_URL_SCHEMA } from "../itoPages.url";

const PLAYERS = 2000;
const pct = (v: number) => `${(100 * v).toFixed(1)}%`;

/// Fair-coin betting strategies: the crowd's mean wealth stays flat while the histogram shows the ruin tail.
export default function MartingalesPage() {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [{ strategy, rounds, seed }, setUrl] = useUrlState(MARTINGALE_URL_SCHEMA);
  const result = useMemo(() => simulateMartingale(strategy, seed, PLAYERS, rounds), [strategy, seed, rounds]);
  const bins = useMemo(() => {
    const h = histogram(result.finals);
    return h.counts.map((count, i) => ({ x0: h.lo + i * h.width, x1: h.lo + (i + 1) * h.width, count }));
  }, [result]);
  const mean = useMemo(() => result.meanByRound.map((m, k) => ({ k, mean: m })), [result]);
  const { start } = BETTING_SETUP;
  const label: Record<MartingaleStrategy, string> = { constant: t("marConstant"), doubling: t("marDoubling"), stop: t("marStop") };

  return (
    <>
      <PageHeader title={t("marTitle")} description={t("marDesc")} />
      <Workspace columns="sidebar">
        <Panel title={t("marControls")}>
          <SegmentedControl<MartingaleStrategy> ariaLabel={t("marStrategy")} value={strategy} onChange={(v) => setUrl({ strategy: v })}
            options={(Object.keys(label) as MartingaleStrategy[]).map((k) => ({ value: k, label: label[k] }))} />
          <div className="controls-grid">
            <SliderField label={t("marRounds")} min={10} max={200} step={10} value={rounds} onChange={(v) => setUrl({ rounds: v })} formatValue={(v) => v.toFixed(0)} />
            <SeedControl seed={seed} setSeed={(s) => setUrl({ seed: s })} compact />
          </div>
          <dl className="lp-ensemble-readout" aria-live="polite">
            <div><dt>{t("marMean")}</dt><dd>{result.mean.toFixed(2)} ± {result.se.toFixed(2)}</dd></div>
            <div><dt>{t("marAhead")}</dt><dd>{pct(result.ahead)}</dd></div>
            <div><dt>{t("marRuined")}</dt><dd>{pct(result.ruined)}</dd></div>
            <div><dt>{t("marWorst")}</dt><dd>{Math.min(...result.finals).toFixed(0)}</dd></div>
          </dl>
          <p className="lp-ensemble-hint">{t("marHint")}</p>
        </Panel>
        <ChartContainer title={t("marHistTitle")}>
          <Histogram bins={bins} ariaLabel={t("marHistAria")} height={isMobile ? 260 : 340} xFormat={(v) => v.toFixed(0)}
            markers={[{ value: start, label: t("marStartLabel") }]} />
        </ChartContainer>
      </Workspace>
      <Workspace className="lp-section">
        <ChartContainer title={t("marMeanTitle")}>
          <div className="chart-wrap" role="img" aria-label={t("marMeanAria")}>
            <LineChart data={mean} xKey="k" isMobile={isMobile} curve="linear" yDomain={[start - 10, start + 10]}
              series={[{ key: "mean", label: t("marMeanLabel"), color: "#22c55e", strokeWidth: 2.5 }]}
              referenceLines={[{ axis: "y", value: start, dash: "4 3" }]}
              tooltipLabel={(x) => `${t("marRounds")}: ${x}`} valueFormat={(v) => v.toFixed(2)} />
          </div>
        </ChartContainer>
      </Workspace>
    </>
  );
}
