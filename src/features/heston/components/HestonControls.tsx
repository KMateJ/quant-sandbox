import SectionCard from "../../../components/SectionCard";
import SliderField from "../../../components/SliderField";
import type { SliderDescriptor } from "../../../components/SliderDock";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";
import type { HestonControlsState } from "../heston.types";

type Props = {
  controlsOpen: boolean;
  setControlsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  values: HestonControlsState;
  sliders: SliderDescriptor[];
  feller: number;
};

export default function HestonControls({
  controlsOpen, setControlsOpen, values, sliders, feller,
}: Props) {
  const { t } = useI18n();
  return (
    <SectionCard
      title=""
      headerLeft={
        <button
          type="button"
          className="toggle-button"
          aria-label={t("hestonToggleControls")}
          aria-expanded={controlsOpen}
          onClick={() => setControlsOpen((prev) => !prev)}
        >
          {controlsOpen ? "-" : "+"}
        </button>
      }
    >
      {controlsOpen ? (
        <>
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
          <div className="stats-row">
            <div className="stat-card intuition-reveal">
              <div className="stat-title">{t("hestonInitialVol")} <IntuitionTrigger sectionId="stochastic-volatility" /></div>
              <div className="stat-value">{Math.sqrt(values.v0).toFixed(3)}</div>
            </div>
            <div className="stat-card intuition-reveal">
              <div className="stat-title">{t("hestonLongRunVol")} <IntuitionTrigger sectionId="mean-reversion" /></div>
              <div className="stat-value">{Math.sqrt(values.theta).toFixed(3)}</div>
            </div>
            <div className="stat-card intuition-reveal">
              <div className="stat-title">{t("hestonFeller")} <IntuitionTrigger sectionId="feller-condition" /></div>
              <div className="stat-value">
                {t(feller >= 0 ? "hestonFellerSatisfied" : "hestonFellerViolated")} ({feller.toFixed(4)})
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="param-summary">
          {sliders.slice(0, 9).map((slider) => (
            <div key={slider.key}>{slider.symbol} = {slider.format(slider.value)}</div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
