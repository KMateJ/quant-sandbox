import type { ReactNode } from "react";
import SliderField from "../../components/SliderField";
import { Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import SeedControl from "../../components/SeedControl";
import type { PathGeometrySim } from "./usePathGeometry";

type Props = { sim: PathGeometrySim; maxPaths?: number; children?: ReactNode };

/// Controls panel for Chapter 3: lesson-specific controls first, then the shared
/// sample size and seed.
export default function GeometrySimControls({ sim, maxPaths = 3000, children }: Props) {
  const { t } = useI18n();
  return (
    <Panel title={t("stochControlsLabel")}>
      {children}
      <div className="controls-grid">
        <SliderField
          label={t("pgPaths")}
          min={100}
          max={maxPaths}
          step={100}
          value={sim.paths}
          onChange={sim.setPaths}
          formatValue={(value) => value.toLocaleString()}
        />
      </div>
      <SeedControl seed={sim.seed} setSeed={sim.setSeed} />
    </Panel>
  );
}
