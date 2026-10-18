import SectionCard from "../../../../components/SectionCard";
import SliderField from "../../../../components/SliderField";
import { ControlGroup } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { SHAPE_PRESET_KEYS } from "../replication.presets";
import { PRESET_LABEL_KEYS } from "../replication.labels";
import type { ReplicationModel } from "../useReplication";
import NodeList from "./NodeList";

/// Shape presets, edge steepness, tail slopes and the editable node list.
export default function ShapeControls({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const { shape, updateShape, applyPreset } = model;
  const slope = (v: number) => v.toFixed(2);

  return (
    <SectionCard title={t("replShapeTitle")} subtitle={t("replShapeHint")}>
      <ControlGroup label={t("replPresets")}>
        <div className="repl-presets">
          {SHAPE_PRESET_KEYS.map((key) => (
            <button key={key} type="button" className="metric-button" onClick={() => applyPreset(key)}>
              {t(PRESET_LABEL_KEYS[key])}
            </button>
          ))}
        </div>
      </ControlGroup>

      <ControlGroup>
        <SliderField
          label={t("replSteepness")}
          min={0}
          max={1}
          step={0.01}
          value={shape.steepness}
          onChange={(steepness) => updateShape({ steepness })}
          formatValue={(v) => `${Math.round(v * 100)}%`}
        />
        <SliderField
          label={t("replLeftSlope")}
          min={-1.5}
          max={1.5}
          step={0.05}
          value={shape.leftSlope}
          onChange={(leftSlope) => updateShape({ leftSlope })}
          formatValue={slope}
        />
        <SliderField
          label={t("replRightSlope")}
          min={-1.5}
          max={1.5}
          step={0.05}
          value={shape.rightSlope}
          onChange={(rightSlope) => updateShape({ rightSlope })}
          formatValue={slope}
        />
      </ControlGroup>

      <NodeList model={model} />
    </SectionCard>
  );
}
