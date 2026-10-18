import { LineChart, type ChartSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import SliderField from "../../components/SliderField";
import { useI18n, type TranslationKey } from "../../i18n";
import { presetOrder, SEQUENCE_RETURNS, SEQUENCE_START, sequenceWealth, type SequencePreset } from "./tvm.math";
import TvmSequenceBars from "./TvmSequenceBars";
import type { TvmLab } from "./useTvmLab";

const PRESETS: [SequencePreset, TranslationKey][] = [["original", "tvmSeqOriginal"], ["crashFirst", "tvmSeqCrashFirst"], ["crashLast", "tvmSeqCrashLast"]];
const money = (v: number) => Math.round(v).toLocaleString();

/// Sequence-of-returns risk: the same yearly returns in a different order give the same ending wealth,
/// unless money is withdrawn along the way.
export default function TvmSequence({ lab, isMobile }: { lab: TvmLab; isMobile: boolean }) {
  const { t } = useI18n();
  const { order, setOrder, withdrawalRate, setWithdrawalRate } = lab.sequence;
  const returns = order.map((i) => SEQUENCE_RETURNS[i]);
  const withdrawal = withdrawalRate * SEQUENCE_START;
  const plain = sequenceWealth(returns, SEQUENCE_START, 0);
  const drawn = sequenceWealth(returns, SEQUENCE_START, withdrawal);
  const crashLast = sequenceWealth(presetOrder(SEQUENCE_RETURNS, "crashLast").map((i) => SEQUENCE_RETURNS[i]), SEQUENCE_START, withdrawal);
  const end = (p: { wealth: number[] }) => p.wealth[p.wealth.length - 1];
  const data = plain.wealth.map((w, year) => ({ year, plain: w, drawn: drawn.wealth[year] }));
  const series: ChartSeries[] = [
    { key: "plain", label: t("tvmSeqNoWithdrawals"), color: "#64748b", strokeWidth: 2, dash: "5 4" },
    { key: "drawn", label: t("tvmSeqWithWithdrawals", { w: money(withdrawal) }), color: "#22c55e", strokeWidth: 2.5 },
  ];
  const active = PRESETS.find(([p]) => presetOrder(SEQUENCE_RETURNS, p).every((v, i) => v === order[i]))?.[0];

  return (
    <ChartContainer title={t("tvmSeqTitle")}>
      <p className="tvm-race-caption">{t("tvmSeqCaption")}</p>
      <div className="tvm-seq-controls">
        <div className="segmented-control" role="group" aria-label={t("tvmSeqPresets")}>
          {PRESETS.map(([p, key]) => (
            <button key={p} type="button" className={active === p ? "preset-btn preset-btn--active" : "preset-btn"} aria-pressed={active === p}
              onClick={() => setOrder(presetOrder(SEQUENCE_RETURNS, p))}>{t(key)}</button>
          ))}
        </div>
        <SliderField label={t("tvmSeqWithdrawal")} min={0} max={0.1} step={0.005} value={withdrawalRate} onChange={setWithdrawalRate}
          formatValue={(v) => `${(v * 100).toFixed(1)}% · ${money(v * SEQUENCE_START)}`} />
      </div>
      <TvmSequenceBars returns={SEQUENCE_RETURNS} order={order} onOrder={setOrder} />
      <p className="control-hint">{t("tvmSeqHint")}</p>
      <div className="chart-wrap">
        <LineChart data={data} xKey="year" series={series} xDomain={[0, returns.length]} isMobile={isMobile}
          yDomain={[0, Math.max(...plain.wealth, ...drawn.wealth) * 1.05]} yFormat={(v) => `${Math.round(v / 1000)}k`}
          tooltipLabel={(x) => `${t("tvmYearsLabel")}: ${x.toFixed(0)}`} valueFormat={money} />
      </div>
      <dl className="tvm-seq-stats" aria-live="polite">
        <div><dt>{t("tvmSeqEndPlain")}</dt><dd>{money(end(plain))} <span className="tvm-seq-same">{t("tvmSeqSame")}</span></dd></div>
        <div><dt>{t("tvmSeqEndDrawn")}</dt><dd>{money(end(drawn))}</dd></div>
        <div><dt>{t("tvmSeqVsCrashLast")}</dt><dd>{money(end(drawn) - end(crashLast))}</dd></div>
        <div><dt>{t("tvmSeqRanOut")}</dt><dd>{drawn.ranOutYear === null ? t("tvmSeqNever") : t("tvmRaceYearValue", { year: drawn.ranOutYear })}</dd></div>
      </dl>
    </ChartContainer>
  );
}
