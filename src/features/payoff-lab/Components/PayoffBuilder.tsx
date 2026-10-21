import SectionCard from "../../../components/SectionCard";
import type { PositionGroup, PresetKey, StrategyLeg, ViewMode } from "../payoff.types";
import { getPresetStrategy } from "../payoff.presets";
import { useI18n } from "../../../i18n";
import PresetSelect from "./builder/PresetSelect";
import LegList from "./builder/LegList";

type Positions = { legs: StrategyLeg[]; groups: PositionGroup[] };

type PayoffBuilderProps = Positions & {
  mode: ViewMode;
  selectedPreset: PresetKey | null;
  showComponents: boolean;
  onModeChange: (mode: ViewMode) => void;
  onPresetChange: (preset: PresetKey | null) => void;
  onShowComponentsChange: (value: boolean) => void;
  onChange: (next: Positions) => void;
};

/// Sidebar builder: view toggles, preset picker and the leg / position editor.
export default function PayoffBuilder({
  legs,
  groups,
  mode,
  selectedPreset,
  showComponents,
  onModeChange,
  onPresetChange,
  onShowComponentsChange,
  onChange,
}: PayoffBuilderProps) {
  const { t } = useI18n();

  const toggle = (active: boolean, label: string, onClick: () => void) => (
    <button type="button" className={active ? "metric-button active" : "metric-button"} onClick={onClick}>
      {label}
    </button>
  );

  return (
    <SectionCard className="payoff-builder-card" title="">
      <div className="metric-switch">
        {toggle(mode === "payoff", t("payoffBuilderShowPayoff"), () => onModeChange("payoff"))}
        {toggle(mode === "profit", t("payoffBuilderShowProfit"), () => onModeChange("profit"))}
        {toggle(showComponents, t("payoffBuilderShowComponents"), () => onShowComponentsChange(!showComponents))}
      </div>

      <PresetSelect
        selectedPreset={selectedPreset}
        onClear={() => onPresetChange(null)}
        onApply={(key) => {
          onPresetChange(key);
          onChange({ legs: getPresetStrategy(key), groups: [] });
        }}
      />

      <LegList
        legs={legs}
        groups={groups}
        onChange={(next) => {
          onPresetChange(null);
          onChange(next);
        }}
      />
    </SectionCard>
  );
}
