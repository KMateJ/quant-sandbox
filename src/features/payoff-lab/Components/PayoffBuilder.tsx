import SectionCard from "../../../components/SectionCard";
import type { PositionGroup, PresetKey, StrategyLeg, ViewMode } from "../payoff.types";
import { getPresetStrategy } from "../payoff.presets";
import { useI18n } from "../../../i18n";
import PresetSelect from "./builder/PresetSelect";
import LegList from "./builder/LegList";

type Positions = { legs: StrategyLeg[]; groups: PositionGroup[] };

type PayoffBuilderProps = Positions & {
  mode: ViewMode;
  controlsOpen: boolean;
  selectedPreset: PresetKey | null;
  showComponents: boolean;
  onToggleControls: () => void;
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
  controlsOpen,
  selectedPreset,
  showComponents,
  onToggleControls,
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
    <SectionCard
      className="payoff-builder-card"
      title=""
      headerLeft={
        <button type="button" className="toggle-button" onClick={onToggleControls}>
          {controlsOpen ? "-" : "+"}
        </button>
      }
    >
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

      {controlsOpen ? (
        <LegList
          legs={legs}
          groups={groups}
          onChange={(next) => {
            onPresetChange(null);
            onChange(next);
          }}
        />
      ) : (
        <div className="param-summary">
          <div>
            {legs.length} {t("payoffCollapsedLegCount")}
            {groups.length > 0 && ` · ${t("payoffPositionCount", { n: groups.length })}`}
          </div>
          <div>{mode === "payoff" ? t("payoffBuilderShowPayoff") : t("payoffBuilderShowProfit")}</div>
          <div>
            {showComponents
              ? t("payoffCollapsedComponentsVisible")
              : t("payoffCollapsedComponentsHidden")}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
