import SliderField from "../../../components/SliderField";
import { ControlGroup } from "../../../components/ui";
import type { SliderDescriptor } from "../../../components/SliderDock";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { HestonControlsState } from "../heston.types";

type Props = {
  values: HestonControlsState;
  sliders: SliderDescriptor[];
  feller: number;
};

/// Sidebar controls: model parameters plus derived reference readouts.
export default function HestonControls({ values, sliders, feller }: Props) {
  const { t } = useI18n();
  return (
    <>
      <ControlGroup label={t("hestonControlsParams")}>
        <div className="controls-grid">
          {sliders.map((slider) => (
            <SliderField
              key={slider.key}
              label={slider.name}
              sectionId={slider.sectionId}
              min={slider.min}
              max={slider.max}
              step={slider.step}
              value={slider.value}
              onChange={slider.onChange}
              formatValue={slider.format}
            />
          ))}
        </div>
      </ControlGroup>

      <ControlGroup label={t("hestonControlsReference")}>
        <div className="stats-grid">
          <div className="stat-card intuition-reveal">
            <div className="stat-title">
              {t("hestonInitialVol")} <IntuitionTrigger sectionId="stochastic-volatility" />
            </div>
            <div className="stat-value">{Math.sqrt(values.v0).toFixed(3)}</div>
          </div>
          <div className="stat-card intuition-reveal">
            <div className="stat-title">
              {t("hestonLongRunVol")} <IntuitionTrigger sectionId="mean-reversion" />
            </div>
            <div className="stat-value">{Math.sqrt(values.theta).toFixed(3)}</div>
          </div>
          <div className="stat-card intuition-reveal">
            <div className="stat-title">
              {t("hestonFeller")} <IntuitionTrigger sectionId="feller-condition" />
            </div>
            <div className="stat-value">
              {t(feller >= 0 ? "hestonFellerSatisfied" : "hestonFellerViolated")} ({feller.toFixed(4)})
            </div>
          </div>
        </div>
      </ControlGroup>
    </>
  );
}
