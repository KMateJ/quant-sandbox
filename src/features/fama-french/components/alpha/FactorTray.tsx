import { useRef } from "react";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { FACTOR_IDS } from "../../famaFrench.math";
import type { FactorId, ModelId } from "../../famaFrench.types";
import type { AlphaTabModel } from "../../useAlphaTab";
import FactorName from "../FactorName";
import { useTileDrag } from "./useTileDrag";

const PRESETS: ModelId[] = ["capm", "ff3", "carhart", "ff5"];

/// Six factor tiles: click, press Enter/Space, or drag a tile into (or out of) the Model tray.
export default function FactorTray({ m }: { m: AlphaTabModel }) {
  const { t } = useI18n();
  const tray = useRef<HTMLDivElement>(null);
  const { drag, bind, swallowClick } = useTileDrag(tray, (id, inside) => {
    if (m.factors.includes(id as FactorId) !== inside) m.toggle(id as FactorId);
  });

  const tile = (id: FactorId) => {
    const inModel = m.factors.includes(id);
    return (
      <button
        key={id}
        type="button"
        className={drag?.id === id ? "ffm-tile is-dragging" : "ffm-tile"}
        aria-pressed={inModel}
        aria-label={t(id === "mkt" ? "ffmTileLocked" : inModel ? "ffmTileRemove" : "ffmTileAdd", { factor: t(`ffmFactor_${id}`) })}
        onClick={() => !swallowClick() && m.toggle(id)}
        {...bind(id)}
      >
        <FactorName id={id} />
        <span className="ffm-tile-name">{t(`ffmFactor_${id}`)}</span>
      </button>
    );
  };

  return (
    <div className="ffm-tray-wrap">
      <div className="ffm-tray-zone">
        <span className="ffm-tray-label">{t("ffmTrayAvailable")}</span>
        <div className="ffm-tray">{FACTOR_IDS.filter((id) => !m.factors.includes(id)).map(tile)}</div>
      </div>
      <div className="ffm-tray-zone ffm-tray-model" ref={tray}>
        <span className="ffm-tray-label">{t("ffmTrayModel")}</span>
        <div className="ffm-tray">{FACTOR_IDS.filter((id) => m.factors.includes(id)).map(tile)}</div>
      </div>
      <SegmentedControl<ModelId | "">
        options={PRESETS.map((v) => ({ value: v, label: t(`ffmModel_${v}`) }))}
        value={m.activePreset ?? ""}
        onChange={(v) => v && m.preset(v)}
        ariaLabel={t("ffmPresetAria")}
      />
      {drag && (
        <span className="ffm-ghost" style={{ left: drag.x, top: drag.y }}>
          <FactorName id={drag.id as FactorId} />
        </span>
      )}
    </div>
  );
}
