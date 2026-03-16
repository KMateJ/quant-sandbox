import SectionCard from "../../../components/SectionCard";
import type { StrategyLeg, ViewMode } from "../payoff.types";
import {
  detectSyntheticLongForward,
  detectSyntheticShortForward,
} from "../payoff.math";

type PayoffSummaryProps = {
  legs: StrategyLeg[];
  mode: ViewMode;
};

export default function PayoffSummary({ legs, mode }: PayoffSummaryProps) {
  const longForward = detectSyntheticLongForward(legs);
  const shortForward = detectSyntheticShortForward(legs);

  return (
    <SectionCard title="Összefoglaló" subtitle="A stratégia fő jellemzői">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Mód</div>
          <div className="stat-value">{mode === "payoff" ? "Payoff" : "Profit"}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Lábak száma</div>
          <div className="stat-value">{legs.length}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Szintetikus felismerés</div>
          <div className="stat-value">
            {longForward.detected
              ? "Synthetic Long Forward"
              : shortForward.detected
              ? "Synthetic Short Forward"
              : "Nincs"}
          </div>
        </div>
      </div>

      {(longForward.detected || shortForward.detected) && (
        <div className="warning-card" style={{ marginTop: 16 }}>
          <div className="warning-title">Opció algebra</div>
          <div className="warning-text">
            {longForward.detected
              ? "A megadott stratégia ugyanazt a lejáratkori payoff alakot adja, mint egy long forward azonos strike mellett."
              : "A megadott stratégia ugyanazt a lejáratkori payoff alakot adja, mint egy short forward azonos strike mellett."}
          </div>
        </div>
      )}
    </SectionCard>
  );
}