import SectionCard from "../../components/SectionCard";
import SliderField from "../../components/SliderField";
import type { useDiffusionView } from "./useDiffusionView";

export default function DiffusionControls({ model }: { model: ReturnType<typeof useDiffusionView> }) {
  const { t, controlsOpen, setControlsOpen, kappa, setKappa, n, setN, tMin, setTMin, tMax, setTMax, curveCount, setCurveCount, times, amplitudeBound } = model;
  return (<div className="view-controls">
        <SectionCard
          title=""
          headerLeft={
            <button
              type="button"
              className="toggle-button"
              onClick={() => setControlsOpen((prev) => !prev)}
            >
              {controlsOpen ? "-" : "+"}
            </button>
          }
        >
          {controlsOpen ? (
            <>
              <div className="controls-grid">
                <SliderField
                  sectionId="diffusion"
                  label={t("diffusionKappaLabel")}
                  min={0.0001}
                  max={0.05}
                  step={0.0005}
                  value={kappa}
                  onChange={setKappa}
                  formatValue={(v) => v.toFixed(4)}
                />

                <SliderField
                  sectionId="diffusion"
                  label={t("diffusionNLabel")}
                  min={1}
                  max={12}
                  step={1}
                  value={n}
                  onChange={setN}
                  formatValue={(v) => `${v.toFixed(0)}`}
                />

                <SliderField
                  sectionId="negative-time"
                  label={t("diffusionTMinLabel")}
                  min={-5}
                  max={0}
                  step={0.1}
                  value={tMin}
                  onChange={setTMin}
                  formatValue={(v) => v.toFixed(1)}
                />

                <SliderField
                  label={t("diffusionTMaxLabel")}
                  min={0}
                  max={5}
                  step={0.1}
                  value={tMax}
                  onChange={setTMax}
                  formatValue={(v) => v.toFixed(1)}
                />

                <SliderField
                  label={t("diffusionCurveCountLabel")}
                  min={2}
                  max={6}
                  step={1}
                  value={curveCount}
                  onChange={setCurveCount}
                  formatValue={(v) => `${v.toFixed(0)} ${t("diffusionCurveCountUnit")}`}
                />
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-title">{t("diffusionTimeRange")}</div>
                  <div className="stat-value">
                    {times[0]?.toFixed(2)} → {times[times.length - 1]?.toFixed(2)}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">{t("diffusionMaxAmplitude")}</div>
                  <div className="stat-value">± {amplitudeBound.toFixed(2)}</div>
                </div>
              </div>
            </>
          ) : (
            <div className="param-summary">
              <div>κ = {kappa.toFixed(4)}</div>
              <div>n = {n}</div>
              <div>t_min = {tMin.toFixed(1)}</div>
              <div>t_max = {tMax.toFixed(1)}</div>
              <div>
                {t("diffusionCurvesShort")} = {curveCount}
              </div>
            </div>
          )}
        </SectionCard>
      </div>);
}
