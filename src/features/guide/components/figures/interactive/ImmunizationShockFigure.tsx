import { useMemo, useState } from "react";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { IMMUNIZATION, afterShock, surplusCurve, type Portfolio } from "../../../guide.interactive.immunizationShock.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import ImmunizationShockBars from "./ImmunizationShockBars";
import { money, signedMoney } from "./ImmunizationShockFormat";
import ImmunizationShockTrace from "./ImmunizationShockTrace";
import ImmunizationShockTrack from "./ImmunizationShockTrack";

const POINTS = 61;
const indexOf = (shock: number) => Math.round(((shock + IMMUNIZATION.maxShock) / (2 * IMMUNIZATION.maxShock)) * (POINTS - 1));
// One scale for every portfolio and shock (values peak at the largest fall in yields), so bar lengths stay comparable.
const SCALE_MAX = 1.05 * Math.max(...(["matched", "short", "long"] as const).map((p) => {
  const s = afterShock(p, -IMMUNIZATION.maxShock);
  return Math.max(s.assets, s.liability);
}));

/// A 7-year liability funded by a 2-year and a 12-year bond: drag a parallel yield shock and watch both present values.
export default function ImmunizationShockFigure() {
  const { t } = useI18n();
  const [portfolio, setPortfolio] = useState<Portfolio>("matched");
  const [shock, setShock] = useState(0);
  const [visited, setVisited] = useState<ReadonlySet<number>>(() => new Set([indexOf(0)]));
  const curve = useMemo(() => surplusCurve(portfolio, POINTS), [portfolio]);
  const state = afterShock(portfolio, shock);

  const move = (next: number) => {
    // Mark every grid point between the old and new shock, so a fast drag still leaves a continuous trace.
    const [a, b] = [indexOf(shock), indexOf(next)].sort((m, n) => m - n);
    setVisited((prev) => new Set([...prev, ...Array.from({ length: b - a + 1 }, (_, i) => a + i)]));
    setShock(next);
  };
  const choose = (p: Portfolio) => {
    setPortfolio(p);
    setVisited(new Set([indexOf(shock)]));
  };

  return (
    <GuideFigure title={t("ixImTitle")} labId="duration-convexity">
      <div className="gf-toolbar">
        <SegmentedControl<Portfolio>
          ariaLabel={t("ixImPortfolio")}
          value={portfolio}
          onChange={choose}
          options={[
            { value: "matched", label: t("ixImMatched") },
            { value: "short", label: t("ixImShortOnly") },
            { value: "long", label: t("ixImLongOnly") },
          ]}
        />
        <span className="im-hint">{t("ixImHint")}</span>
      </div>
      <ImmunizationShockTrack shock={shock} onChange={move} />
      <ImmunizationShockBars state={state} scaleMax={SCALE_MAX} />
      <ImmunizationShockTrace curve={curve} visited={visited} shock={shock} surplus={state.surplus} />
      <FigureReadout
        items={[
          { label: t("ixImAssets"), value: money(state.assets) },
          { label: t("ixImLiability"), value: money(state.liability) },
          { label: t("ixImSurplus"), value: signedMoney(state.surplus), tone: "strong" },
          { label: t("ixImDurations"), value: `${fmt(state.assetDuration, 2)} / ${fmt(state.liabilityDuration, 2)}`, tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
