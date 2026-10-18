import { useMemo, useState } from "react";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { buildAmericanTree, earlyExercisePremium, type ExerciseStyle } from "../../../guide.interactive.americanTree.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import AmericanTreeDetails from "./AmericanTreeDetails";
import AmericanTreeSvg from "./AmericanTreeSvg";

const MARKET = { s0: 100, k: 100, sigma: 0.2, r: 0.05, t: 1, option: "put" } as const;
const STEP_OPTIONS = [2, 3, 4, 5].map((n) => ({ value: n, label: String(n) }));

/// Explorable American put tree: pick the step count and exercise rule, click a node to see its valuation.
export default function AmericanTreeFigure() {
  const { t } = useI18n();
  const [steps, setSteps] = useState(3);
  const [style, setStyle] = useState<ExerciseStyle>("american");
  const [selected, setSelected] = useState({ i: 0, j: 0 });
  const tree = useMemo(() => buildAmericanTree({ ...MARKET, steps, style }), [steps, style]);
  const roots = useMemo(() => earlyExercisePremium({ ...MARKET, steps }), [steps]);
  // A selection from a larger tree falls back to the root.
  const node = tree.nodes[selected.i]?.[selected.j] ?? tree.nodes[0][0];

  return (
    <GuideFigure title={t("ixAtTitle")} labId="binomial">
      <div className="gf-toolbar">
        <div className="ixat-control">
          <span className="ixat-control-label">{t("ixAtSteps")}</span>
          <SegmentedControl<number> options={STEP_OPTIONS} value={steps} onChange={setSteps} ariaLabel={t("ixAtSteps")} />
        </div>
        <div className="ixat-control">
          <span className="ixat-control-label">{t("ixAtRule")}</span>
          <SegmentedControl<ExerciseStyle>
            options={[
              { value: "american", label: t("ixAtAmerican") },
              { value: "european", label: t("ixAtEuropean") },
            ]}
            value={style}
            onChange={setStyle}
            ariaLabel={t("ixAtRule")}
          />
        </div>
      </div>
      <div className="ixat-scroll">
        <AmericanTreeSvg nodes={tree.nodes} selected={node} onSelect={(i, j) => setSelected({ i, j })} />
      </div>
      <ul className="ixat-legend">
        <li><span className="ixat-swatch ixat-swatch--exercise" />{t("ixAtLegendExercise")}</li>
        <li><span className="ixat-swatch ixat-swatch--continue" />{t("ixAtLegendContinue")}</li>
        <li><span className="ixat-swatch ixat-swatch--terminal" />{t("ixAtLegendTerminal")}</li>
      </ul>
      <AmericanTreeDetails tree={tree} node={node} style={style} />
      <FigureReadout
        items={[
          { label: t("ixAtRootAmerican"), value: fmt(roots.american), tone: style === "american" ? "strong" : undefined },
          { label: t("ixAtRootEuropean"), value: fmt(roots.european), tone: style === "european" ? "strong" : undefined },
          { label: t("ixAtPremium"), value: fmt(roots.premium), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
