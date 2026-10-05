import type { ReactNode } from "react";
import type { GuideId, GuideLessonMeta } from "./guide.types";
import { guideLessons } from "./guide.meta";
import InstrumentsGuide from "./guides/InstrumentsGuide";
import NoArbitrageGuide from "./guides/NoArbitrageGuide";
import RiskNeutralGuide from "./guides/RiskNeutralGuide";
import DeltaHedgingGuide from "./guides/DeltaHedgingGuide";
import TowardBlackScholesGuide from "./guides/TowardBlackScholesGuide";

type RegistryEntry = GuideLessonMeta & {
  render: () => ReactNode;
};

const renderers: Record<GuideId, () => ReactNode> = {
  instruments: () => <InstrumentsGuide />,
  "no-arbitrage": () => <NoArbitrageGuide />,
  "risk-neutral": () => <RiskNeutralGuide />,
  "delta-hedging": () => <DeltaHedgingGuide />,
  "toward-black-scholes": () => <TowardBlackScholesGuide />,
};

/// Lesson metadata joined with its render component.
export function getGuideRegistry(): RegistryEntry[] {
  return guideLessons.map((meta) => ({ ...meta, render: renderers[meta.id] }));
}

export function isGuideId(value: string | null): value is GuideId {
  return guideLessons.some((lesson) => lesson.id === value);
}
