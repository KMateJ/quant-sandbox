import ScatterChart from "../../../components/charts/ScatterChart";
import { useI18n } from "../../../i18n";
import { stepsByLevel } from "../gbm.definition.math";
import { MODEL_COLOR, type PairView } from "./pairView";

const SAMPLE_PATHS = 40;

/// Each step as (price before, change), one panel per model on shared axes: a flat band for ABM, a widening fan for GBM.
export default function StepScatter({ view, isMobile }: { view: PairView; isMobile: boolean }) {
  const { t } = useI18n();
  const { pair, paths, steps, yDomain } = view;
  const points = { abm: stepsByLevel(pair.abm, paths, steps, SAMPLE_PATHS), gbm: stepsByLevel(pair.gbm, paths, steps, SAMPLE_PATHS) };
  const reach = Math.max(1, ...[...points.abm, ...points.gbm].map((p) => Math.abs(p.y)));
  const panel = (model: "abm" | "gbm") => (
    <figure className="gdef-half">
      <figcaption className={`gdef-tag is-${model}`}>{t(model === "abm" ? "gdefAbm" : "gdefGbm")}</figcaption>
      <div className="sde-chart">
        <ScatterChart series={[{ key: model, label: t(model === "abm" ? "gdefAbm" : "gdefGbm"), color: MODEL_COLOR[model], radius: 2, opacity: 0.5, outline: false, points: points[model] }]}
          xDomain={[Math.max(yDomain[0], -50), yDomain[1]]} yDomain={[-reach, reach]} isMobile={isMobile}
          xLabel={t("gdefStepX")} yLabel={t("gdefStepY")} xFormat={(v) => v.toFixed(0)} yFormat={(v) => v.toFixed(0)} />
      </div>
    </figure>
  );
  return <div className="gdef-pair">{panel("abm")}{panel("gbm")}</div>;
}
