import type { ReactNode } from "react";
import type { GuideId } from "./guide.types";
import InstrumentsGuide from "./guides/InstrumentsGuide";
import NoArbitrageGuide from "./guides/NoArbitrageGuide";
import RiskNeutralGuide from "./guides/RiskNeutralGuide";
import DeltaHedgingGuide from "./guides/DeltaHedgingGuide";
import TowardBlackScholesGuide from "./guides/TowardBlackScholesGuide";

/// Lesson body per guide id.
export const guideRenderers: Record<GuideId, () => ReactNode> = {
  instruments: () => <InstrumentsGuide />,
  "no-arbitrage": () => <NoArbitrageGuide />,
  "risk-neutral": () => <RiskNeutralGuide />,
  "delta-hedging": () => <DeltaHedgingGuide />,
  "toward-black-scholes": () => <TowardBlackScholesGuide />,
};
