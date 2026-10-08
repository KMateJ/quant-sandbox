import SliderField from "../../components/SliderField";
import { Tabs, ControlGroup, type TabItem } from "../../components/ui";
import type { useBlackScholesView } from "./useBlackScholesView";

type OptionType = "call" | "put";

/// Sidebar controls: option type, model parameters and reference readouts.
export default function BlackScholesControls({
  model,
}: {
  model: ReturnType<typeof useBlackScholesView>;
}) {
  const { t, language, optionType, setOptionType, sliders, atmPrice, maturities } = model;

  const optionTabs: TabItem[] = [
    { id: "call", label: t("blackScholesOptionCall") },
    { id: "put", label: t("blackScholesOptionPut") },
  ];

  const years = language === "hu" ? "év" : "years";

  return (
    <>
      <ControlGroup label={t("blackScholesControlsOption")}>
        <Tabs
          segmented
          className="bs-option-seg"
          items={optionTabs}
          value={optionType}
          onChange={(id) => setOptionType(id as OptionType)}
          ariaLabel={t("blackScholesControlsOption")}
        />
      </ControlGroup>

      <ControlGroup label={t("blackScholesControlsParams")}>
        {sliders.map((slider) => (
          <SliderField
            key={slider.key}
            label={slider.name}
            min={slider.min}
            max={slider.max}
            step={slider.step}
            value={slider.value}
            onChange={slider.onChange}
            sectionId={slider.sectionId}
            formatValue={(v) =>
              slider.key === "tmax"
                ? `${v.toFixed(2)} ${years}`
                : slider.key === "curves"
                  ? `${v.toFixed(0)} ${language === "hu" ? "db" : "curves"}`
                  : slider.format(v)
            }
          />
        ))}
      </ControlGroup>

      <ControlGroup label={t("blackScholesControlsStats")}>
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-title">{t("blackScholesAtmExample")}</div>
            <div className="stat-value">
              {optionType === "call" ? "C" : "P"}(S=K, T=1) ≈ {atmPrice}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-title">{t("blackScholesMaturityRange")}</div>
            <div className="stat-value">
              {maturities[0]?.toFixed(2)} → {maturities[maturities.length - 1]?.toFixed(2)} {years}
            </div>
          </div>
        </div>
      </ControlGroup>
    </>
  );
}
