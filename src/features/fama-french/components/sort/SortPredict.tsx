import { Panel } from "../../../../components/layout";
import { PredictExplain, type ExplainOption } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import type { SortModel } from "../../useSortTab";

const SAME_BAND = 0.15;

/// "What happens to the HML t-statistic at 10/90?": the right option is read off the reader's own sweep.
export default function SortPredict({ model }: { model: SortModel }) {
  const { t } = useI18n();
  const { sweep, url } = model;
  const at = (cut: number) => sweep.find((p) => Math.abs(p.cut - cut) < 1e-9)?.t ?? 0;
  const a = at(0.3);
  const b = at(0.1);
  const truth = Math.abs(b - a) < SAME_BAND ? "same" : b > a ? "up" : "down";
  const vars = { a: a.toFixed(2), b: b.toFixed(2) };
  const option = (id: "up" | "down" | "same"): ExplainOption => {
    const correct = id === truth;
    return { text: t(`ffmSortPredict_${id}`), correct, feedback: `${t(correct ? "ffmSortFbRight" : "ffmSortFbWrong", vars)} ${t("ffmSortFbWhy")}` };
  };
  return (
    <Panel>
      <PredictExplain
        key={`${url.sseed}-${url.sw}-${a.toFixed(3)}-${b.toFixed(3)}`}
        question={t("ffmSortPredictQ")}
        options={[option("up"), option("down"), option("same")]}
      />
    </Panel>
  );
}
