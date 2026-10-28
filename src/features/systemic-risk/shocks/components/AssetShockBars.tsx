import DraggableBars from "../../../../components/charts/DraggableBars";
import { useI18n, type TranslationKey } from "../../../../i18n";
import { ASSET_ORDER, MAX_DROP } from "../shocks.math";

type Props = { drops: number[]; onDrop: (index: number, drop: number) => void };

/// Drag a price bar below zero to crash that asset class; the bars are the input.
export default function AssetShockBars({ drops, onDrop }: Props) {
  const { t } = useI18n();
  const name = (i: number) => t(`syrShockAsset_${ASSET_ORDER[i]}` as TranslationKey);
  return (
    <DraggableBars
      height={170}
      values={drops.map((d) => -d)}
      onChange={(i, v) => onDrop(i, Math.round(-v))}
      min={-MAX_DROP}
      max={0}
      step={1}
      domain={[-MAX_DROP, 6]}
      xLabels={ASSET_ORDER.map((a) => t(`syrShockAssetShort_${a}` as TranslationKey))}
      barAriaLabel={(i) => t("syrShockBarAria", { asset: name(i) })}
      valueFormat={(v) => `${v}%`}
      yFormat={(v) => `${v}%`}
      ariaLabel={t("syrShockBarsAria")}
      colors={{ negative: "var(--chart-4)", positive: "var(--chart-4)" }}
    />
  );
}
