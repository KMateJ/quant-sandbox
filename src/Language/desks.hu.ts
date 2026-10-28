import { hedgingDeskHu } from "./HedgingDesk.hu";
import { hedgingDeskMissionsHu } from "./HedgingDeskMissions.hu";
import { hedgingDeskSideHu } from "./HedgingDeskSide.hu";
import { hedgingDeskDebriefHu } from "./HedgingDeskDebrief.hu";
import { hedgingDeskChartsHu } from "./HedgingDeskCharts.hu";
import { hedgingDeskMissionScreenHu } from "./HedgingDeskMissionScreen.hu";
import { hedgingDeskDemoStepsHu } from "./HedgingDeskDemoSteps.hu";
import { hedgingDeskHelpHu } from "./HedgingDeskHelp.hu";
import { hedgingDeskHelpAdviceHu } from "./HedgingDeskHelpAdvice.hu";
import { hedgingDeskHelpGuideHu } from "./HedgingDeskHelpGuide.hu";
import { hedgingDeskHelpWhatIfHu } from "./HedgingDeskHelpWhatIf.hu";
import { gameKitHu } from "./GameKit.hu";
import { almDeskHu } from "./AlmDesk.hu";
import { almDeskMissionsHu } from "./AlmDeskMissions.hu";
import { almDeskHelpHu } from "./AlmDeskHelp.hu";
import { sandboxHu } from "./Sandbox.hu";
import { ratesDeskHu } from "./RatesDesk.hu";
import { portfolioDeskHu } from "./PortfolioDesk.hu";
import { ratesDeskMissionsHu } from "./RatesDeskMissions.hu";
import { ratesDeskHelpHu } from "./RatesDeskHelp.hu";
import { portfolioDeskMissionsHu } from "./PortfolioDeskMissions.hu";
import { portfolioDeskHelpHu } from "./PortfolioDeskHelp.hu";
import { retirementDeskHu } from "./RetirementDesk.hu";
import { retirementDeskMissionsHu } from "./RetirementDeskMissions.hu";
import { retirementDeskHelpHu } from "./RetirementDeskHelp.hu";
import { marketMakingDeskHu } from "./MarketMakingDesk.hu";
import type { DeskKey } from "./index.en";
import { marketMakingDeskMissionsHu } from "./MarketMakingDeskMissions.hu";
import { marketMakingDeskHelpHu } from "./MarketMakingDeskHelp.hu";

/// Copy of the desk games and the Sandbox; loaded with those routes only (see languageLoader.withDeskCopy).
export const desksHu = {
  ...hedgingDeskHu,
  ...hedgingDeskMissionsHu,
  ...hedgingDeskSideHu,
  ...hedgingDeskDebriefHu,
  ...hedgingDeskChartsHu,
  ...hedgingDeskMissionScreenHu,
  ...hedgingDeskDemoStepsHu,
  ...hedgingDeskHelpHu,
  ...hedgingDeskHelpAdviceHu,
  ...hedgingDeskHelpGuideHu,
  ...hedgingDeskHelpWhatIfHu,
  ...gameKitHu,
  ...almDeskHu,
  ...almDeskMissionsHu,
  ...almDeskHelpHu,
  ...sandboxHu,
  ...ratesDeskHu,
  ...ratesDeskMissionsHu,
  ...ratesDeskHelpHu,
  ...portfolioDeskHu,
  ...portfolioDeskMissionsHu,
  ...portfolioDeskHelpHu,
  ...retirementDeskHu,
  ...retirementDeskMissionsHu,
  ...retirementDeskHelpHu,
  ...marketMakingDeskHu,
  ...marketMakingDeskMissionsHu,
  ...marketMakingDeskHelpHu,
} satisfies Record<DeskKey, string>;

type NoExtraKeys<T extends never> = T;
/// Fails to compile when the Hungarian desk table has a key English lacks.
export type HuOnlyDeskKeys = NoExtraKeys<Exclude<keyof typeof desksHu, DeskKey>>;
