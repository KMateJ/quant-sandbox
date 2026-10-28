import { Panel } from "../../../../components/layout";
import { SegmentedControl, StatCard } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { FACTOR_LABEL } from "../../famaFrench.math";
import type { FfTabProps } from "../../famaFrench.types";
import type { Weighting } from "../../sort.types";
import { useSortTab } from "../../useSortTab";
import SeedControl from "../../../../components/SeedControl";
import SortPredict from "../sort/SortPredict";
import SortTable from "../sort/SortTable";
import SweepChart from "../sort/SweepChart";
import UniverseScatter from "../sort/UniverseScatter";
import YourFactorsChart from "../sort/YourFactorsChart";

/// Build-the-factors tab: drag the breakpoints, get your own SMB and HML, compare with Fama and French's.
export default function SortTab({ data, window }: FfTabProps) {
  const { t } = useI18n();
  const model = useSortTab(data, window);
  const { url, setUrl } = model;

  return (
    <div className="ffm-sort">
      <Panel>
        <p className="control-hint">{t("ffmSortHint")}</p>
        <div className="ffm-sort-controls">
          <SegmentedControl<Weighting>
            ariaLabel={t("ffmSortWeighting")}
            value={url.sw}
            onChange={(sw) => setUrl({ sw })}
            options={[{ value: "equal", label: t("ffmSortEqual") }, { value: "value", label: t("ffmSortValue") }]}
          />
          <SeedControl compact seed={url.sseed} setSeed={(sseed) => setUrl({ sseed })} />
        </div>
        <p className="control-hint">{t("ffmSortKey")}</p>
        <p className="control-hint">{t("ffmSortSimplify")}</p>
      </Panel>
      <UniverseScatter model={model} />
      <div className="ffm-sort-grid">
        <YourFactorsChart model={model} data={data} />
        <SweepChart model={model} />
      </div>
      <div className="stats-grid">
        <StatCard label={t("ffmSortStatCorr", { f: FACTOR_LABEL[model.factor] })} value={model.stats.corr.toFixed(2)} />
        <StatCard label={t("ffmSortStatYours")} value={`${(model.stats.own.mean * 100).toFixed(1)}% · t ${model.stats.own.t.toFixed(1)}`} />
        <StatCard label={t("ffmSortStatOfficial")} value={`${(model.stats.official.mean * 100).toFixed(1)}% · t ${model.stats.official.t.toFixed(1)}`} />
      </div>
      <SortTable model={model} />
      <SortPredict model={model} />
    </div>
  );
}
