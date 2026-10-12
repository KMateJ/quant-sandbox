import SliderField from "../../components/SliderField";
import { ControlGroup } from "../../components/ui";
import { Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import { BM_MIN_GAP, BM_TIME_STEP, BM_WINDOW_BOUNDS } from "./brownianFundamentals.types";
import type { BrownianExperiment } from "./useBrownianExperiment";

const formatTime = (value: number) => value.toFixed(2);

export default function BrownianControls({ experiment: e }: { experiment: BrownianExperiment }) {
  const { t } = useI18n();
  return (
    <Panel title={t("stochControlsLabel")}>
      <ControlGroup label={t("stochBmWindow")} hint={<span className="stoch-control-hint">{t("stochBmWindowHint")}</span>}>
        <SliderField
          label={t("stochBmTimeS")}
          min={BM_WINDOW_BOUNDS[0]}
          max={BM_WINDOW_BOUNDS[1] - BM_MIN_GAP}
          step={BM_TIME_STEP}
          value={e.s}
          onChange={e.setS}
          formatValue={formatTime}
        />
        <SliderField
          label={t("stochBmTimeT")}
          min={BM_WINDOW_BOUNDS[0] + BM_MIN_GAP}
          max={1}
          step={BM_TIME_STEP}
          value={e.t}
          onChange={e.setT}
          formatValue={formatTime}
        />
      </ControlGroup>
      <div className="controls-grid">
        <SliderField
          label={t("stochBmPaths")}
          min={50}
          max={3000}
          step={50}
          value={e.paths}
          onChange={e.setPaths}
          formatValue={(value) => value.toLocaleString()}
        />
        <SliderField label={t("stochWalkSeed")} min={1} max={9999} step={1} value={e.seed} onChange={e.setSeed} />
      </div>
      <button className="preset-btn stoch-resample-btn" type="button" onClick={e.onResample}>
        {t("stochResample")}
      </button>
    </Panel>
  );
}
