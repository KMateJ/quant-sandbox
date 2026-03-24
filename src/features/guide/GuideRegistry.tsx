import type { ReactNode } from "react";
import type { GuideId, GuideMeta } from "./guide.types";
import InstrumentsGuide from "./guides/InstrumentsGuide";
import RiskNeutralGuide from "./guides/RiskNeutralGuide";
import DeltaHedgingGuide from "./guides/DeltaHedgingGuide";

type RegistryEntry = GuideMeta & {
  render: () => ReactNode;
};

function Placeholder({
  huTitle,
  huText,
  enTitle,
  enText,
  language,
}: {
  huTitle: string;
  huText: string;
  enTitle: string;
  enText: string;
  language: string;
}) {
  return (
    <div className="guide-content">
      <h3>{language === "hu" ? huTitle : enTitle}</h3>
      <p>{language === "hu" ? huText : enText}</p>
    </div>
  );
}

export function getGuideRegistry(language: string): RegistryEntry[] {
  return [
    {
      id: "instruments",
      title: {
        hu: "Milyen pénzügyi eszközökkel foglalkozunk?",
        en: "What financial instruments are we working with?",
      },
      description: {
        hu: "Call, put, forward és a lejáratkori kifizetés intuitív bevezetése a Payoff Lab alapján.",
        en: "An intuitive introduction to calls, puts, forwards and terminal payoff using the Payoff Lab.",
      },
      render: () => <InstrumentsGuide />,
    },
    {
      id: "risk-neutral",
      title: {
        hu: "Mi az a kockázatsemleges mérték?",
        en: "What is the risk-neutral measure?",
      },
      description: {
        hu: "Arbitrázs, fair ár, binomiális modell és az átmenet a valós mértéktől a kockázatsemlegeshez.",
        en: "Arbitrage, fair pricing, the binomial model, and the transition from the real-world measure to the risk-neutral one.",
      },
      render: () => <RiskNeutralGuide />,
    },
    {
      id: "delta-hedging",
      title: {
        hu: "Mi az a delta hedgelés?",
        en: "What is delta hedging?",
      },
      description: {
        hu: "Replikáló portfólió, binomiális delta és az út a folytonos modell felé.",
        en: "Replicating portfolios, binomial delta, and the road toward the continuous-time model.",
      },
      render: () => <DeltaHedgingGuide />,
    },
  ];
}

export function isGuideId(value: string | null): value is GuideId {
  return (
    value === "instruments" ||
    value === "risk-neutral" ||
    value === "delta-hedging"
  );
}