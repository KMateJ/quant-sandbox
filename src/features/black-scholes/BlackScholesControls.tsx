import SectionCard from "../../components/SectionCard";
import SliderField from "../../components/SliderField";
import type { useBlackScholesView } from "./useBlackScholesView";
import { IntuitionTrigger } from "../../components/intuition";

export default function BlackScholesControls({ model }: { model: ReturnType<typeof useBlackScholesView> }) {
  const { t, language, strike, rate, volatility, maxMaturity, curveCount, controlsOpen, setControlsOpen, metric, setMetric, optionType, setOptionType, maturities, atmPrice, sliders, metricOptions } = model;
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
          <div className="metric-switch">
            <button
              type="button"
              className={optionType === "call" ? "metric-button active" : "metric-button"}
              onClick={() => setOptionType("call")}
            >
              {t("blackScholesOptionCall")}
            </button>
            <button
              type="button"
              className={optionType === "put" ? "metric-button active" : "metric-button"}
              onClick={() => setOptionType("put")}
            >
              {t("blackScholesOptionPut")}
            </button>
          </div>

          <div className="metric-switch">
            {metricOptions.map((option) => (
              <span key={option.key} className="intuition-reveal">
                <button type="button" className={metric === option.key ? "metric-button active" : "metric-button"} onClick={() => setMetric(option.key)}>
                  {option.label}
                </button>
                <IntuitionTrigger sectionId={option.key} />
              </span>
            ))}
          </div>

          {controlsOpen ? (
            <>
              <div className="controls-grid">
                {sliders.map((slider) => (
                  <SliderField key={slider.key} label={slider.name} min={slider.min} max={slider.max} step={slider.step}
                    value={slider.value} onChange={slider.onChange}
                    sectionId={slider.sectionId}
                    formatValue={(v) => slider.key === "tmax"
                      ? `${v.toFixed(2)} ${language === "hu" ? "év" : "years"}`
                      : slider.key === "curves"
                        ? `${v.toFixed(0)} ${language === "hu" ? "db" : "curves"}`
                        : slider.format(v)} />
                ))}
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-title">{t("blackScholesAtmExample")}</div>
                  <div className="stat-value">
                    {optionType === "call" ? "C" : "P"}(S=K, T=1) ≈ {atmPrice}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">{t("blackScholesMaturityRange")}</div>
                  <div className="stat-value">
                    {maturities[0]?.toFixed(2)} {language === "hu" ? "év" : "years"} →{" "}
                    {maturities[maturities.length - 1]?.toFixed(2)}{" "}
                    {language === "hu" ? "év" : "years"}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="param-summary">
              <div>
                {t("blackScholesSummaryOption")} = {optionType}
              </div>
              <div>K = {strike}</div>
              <div>r = {rate.toFixed(3)}</div>
              <div>σ = {volatility.toFixed(2)}</div>
              <div>Tmax = {maxMaturity.toFixed(2)}</div>
              <div>
                {t("blackScholesSummaryCurves")} = {curveCount}
              </div>
              <div>
                {t("blackScholesSummaryMode")} = {metric}
              </div>
            </div>
          )}
        </SectionCard>
      </div>);
}
