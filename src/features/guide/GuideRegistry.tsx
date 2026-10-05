import type { ReactNode } from "react";
import type { GuideId, GuideMeta } from "./guide.types";
import { guideMeta } from "./guide.meta";
import InstrumentsGuide from "./guides/InstrumentsGuide";
import RiskNeutralGuide from "./guides/RiskNeutralGuide";
import DeltaHedgingGuide from "./guides/DeltaHedgingGuide";

type RegistryEntry = GuideMeta & {
  render: () => ReactNode;
};

const renderers: Record<GuideId, () => ReactNode> = {
  instruments: () => <InstrumentsGuide />,
  "risk-neutral": () => <RiskNeutralGuide />,
  "delta-hedging": () => <DeltaHedgingGuide />,
};

export function getGuideRegistry(): RegistryEntry[] {
  return guideMeta.map((meta) => ({ ...meta, render: renderers[meta.id] }));
}

export function isGuideId(value: string | null): value is GuideId {
  return (
    value === "instruments" ||
    value === "risk-neutral" ||
    value === "delta-hedging"
  );
}