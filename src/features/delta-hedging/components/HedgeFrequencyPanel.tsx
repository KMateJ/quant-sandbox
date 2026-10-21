import { ChartContainer } from "../../../components/layout";
import { Histogram } from "../../../components/charts";
import { DataTable, type DataColumn } from "../../../components/ui";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { FrequencyStudyRow } from "../deltaHedging.types";
import type { DeltaHedgingModel } from "../useDeltaHedging";

const FREQ_KEYS = { 4: "deltaHedgingFreqQuarterly", 12: "deltaHedgingFreqMonthly", 52: "deltaHedgingFreqWeekly", 252: "deltaHedgingFreqDaily" } as const;

/// Many paths, one question: how much does the terminal error shrink when you rebalance more often?
/// The histogram shows the chosen frequency; the table compares all of them on the same random paths.
export default function HedgeFrequencyPanel({ model }: { model: DeltaHedgingModel }) {
  const { t } = useI18n();
  const { study, current, histogram, result, freq, isMobile, studyPaths } = model;
  const base = study[0]?.sd || 1;
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  const columns: DataColumn<FrequencyStudyRow>[] = [
    { key: "freq", header: t("deltaHedgingColFrequency"), render: (row) => <span className={row.freq === freq ? "dh-row-current" : undefined}>{t(FREQ_KEYS[row.freq as keyof typeof FREQ_KEYS])}</span> },
    { key: "n", header: t("deltaHedgingColRebalances"), align: "end", render: (row) => row.rebalances },
    { key: "sd", header: t("deltaHedgingColSd"), align: "end", render: (row) => row.sd.toFixed(3) },
    { key: "share", header: t("deltaHedgingColSdShare"), align: "end", render: (row) => pct(result.premium > 0 ? row.sd / result.premium : 0) },
    { key: "rel", header: t("deltaHedgingColRelative"), align: "end", render: (row) => `×${(row.sd / base).toFixed(2)}` },
  ];

  return (
    <ChartContainer title={t("deltaHedgingStudyTitle")} actions={<IntuitionTrigger sectionId="frequency-study" />}>
      <div className="dh-study">
        <div className="dh-study-hist">
          <Histogram
            bins={histogram.bins}
            height={isMobile ? 200 : 260}
            xFormat={(v) => v.toFixed(2)}
            markers={[
              { value: 0, color: "var(--text)" },
              { value: -current.sd, label: "−1σ", color: "var(--muted)", dash: "4 4" },
              { value: current.sd, label: "+1σ", color: "var(--muted)", dash: "4 4" },
            ]}
            ariaLabel={t("deltaHedgingHistAria", { n: studyPaths })}
          />
          <p className="dh-caption">{t("deltaHedgingHistCaption", { n: studyPaths, sd: current.sd.toFixed(3) })}</p>
        </div>
        <div className="dh-study-table">
          <DataTable columns={columns} rows={study} getRowKey={(row) => row.freq} />
          <p className="dh-caption">{t("deltaHedgingStudyCaption")}</p>
        </div>
      </div>
    </ChartContainer>
  );
}
