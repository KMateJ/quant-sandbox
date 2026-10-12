import { useState, type ComponentType } from "react";
import { SegmentedControl } from "../../components/ui";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";
import WienerGaussianExperiment from "./WienerGaussianExperiment";
import WienerIndependenceExperiment from "./WienerIndependenceExperiment";
import WienerRoughnessExperiment from "./WienerRoughnessExperiment";
import WienerStartExperiment from "./WienerStartExperiment";
import { WIENER_PROPERTIES, type WienerProperty } from "./wienerProperties.types";

const EXPERIMENTS: Record<WienerProperty, { labelKey: TranslationKey; Component: ComponentType }> = {
  start: { labelKey: "wpPropStart", Component: WienerStartExperiment },
  independence: { labelKey: "wpPropIndependence", Component: WienerIndependenceExperiment },
  gaussian: { labelKey: "wpPropGaussian", Component: WienerGaussianExperiment },
  roughness: { labelKey: "wpPropRoughness", Component: WienerRoughnessExperiment },
};

/// One experiment per defining property, picked from a property strip.
export default function WienerExplore() {
  const { t } = useI18n();
  const [property, setProperty] = useState<WienerProperty>("start");
  const { Component } = EXPERIMENTS[property];
  return (
    <div className="stoch-property-explore">
      <div className="stoch-property-bar">
        <SegmentedControl<WienerProperty>
          options={WIENER_PROPERTIES.map((value) => ({ value, label: t(EXPERIMENTS[value].labelKey) }))}
          value={property}
          onChange={setProperty}
          ariaLabel={t("wpPropertyLabel")}
        />
      </div>
      <Component key={property} />
    </div>
  );
}
