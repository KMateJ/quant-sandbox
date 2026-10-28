import NumberStepper from "../../../../components/NumberStepper";
import SeedControl from "../../../../components/SeedControl";
import { SegmentedControl } from "../../../../components/ui";
import { useI18n } from "../../../../i18n";
import { NETWORK_SHAPES } from "../../systemicRisk.url";
import { COLOR_BY, SIZE_BY } from "../network.types";
import type { NetworkPageModel } from "../useNetworkPage";

/// Structure switch (with the degree stepper for `random` and a reseed) and the size and colour encodings.
export default function NetworkControls({ m }: { m: NetworkPageModel }) {
  const { t } = useI18n();
  const { s, set } = m;
  const shapes = NETWORK_SHAPES.map((id) => ({ value: id, label: t(`syrNet_${id}`) }));
  return (
    <div className="syr-controls">
      <div className="syr-control-row">
        <span className="syr-control-label">{t("syrStructure")}</span>
        <SegmentedControl ariaLabel={t("syrStructure")} value={s.net} options={shapes} onChange={m.setNet} />
        {s.net === "random" && (
          <NumberStepper label={t("syrDegree")} value={s.deg} min={1} max={10} onChange={(deg) => set({ deg, edits: "" })} />
        )}
        {(s.net === "core-periphery" || s.net === "random" || s.net === "starter") && (
          <SeedControl compact seed={s.seed} setSeed={(seed) => set({ seed, edits: "" })} />
        )}
      </div>
      <div className="syr-control-row">
        <span className="syr-control-label">{t("syrSizeBy")}</span>
        <SegmentedControl ariaLabel={t("syrSizeBy")} value={s.size} onChange={(size) => set({ size })} options={SIZE_BY.map((v) => ({ value: v, label: t(`syrSize_${v}`) }))} />
        <span className="syr-control-label">{t("syrColorBy")}</span>
        <SegmentedControl ariaLabel={t("syrColorBy")} value={s.color} onChange={(color) => set({ color })} options={COLOR_BY.map((v) => ({ value: v, label: t(`syrColor_${v}`) }))} />
      </div>
    </div>
  );
}
