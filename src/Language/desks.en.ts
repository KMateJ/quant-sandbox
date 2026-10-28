import { hedgingDeskEn } from "./HedgingDesk";
import { hedgingDeskMissionsEn } from "./HedgingDeskMissions";
import { hedgingDeskSideEn } from "./HedgingDeskSide";
import { hedgingDeskDebriefEn } from "./HedgingDeskDebrief";
import { hedgingDeskChartsEn } from "./HedgingDeskCharts";
import { hedgingDeskMissionScreenEn } from "./HedgingDeskMissionScreen";
import { hedgingDeskDemoStepsEn } from "./HedgingDeskDemoSteps";
import { hedgingDeskHelpEn } from "./HedgingDeskHelp";
import { hedgingDeskHelpAdviceEn } from "./HedgingDeskHelpAdvice";
import { hedgingDeskHelpGuideEn } from "./HedgingDeskHelpGuide";
import { hedgingDeskHelpWhatIfEn } from "./HedgingDeskHelpWhatIf";
import { gameKitEn } from "./GameKit";
import { almDeskEn } from "./AlmDesk";
import { almDeskMissionsEn } from "./AlmDeskMissions";
import { almDeskHelpEn } from "./AlmDeskHelp";
import { sandboxEn } from "./Sandbox";
import { ratesDeskEn } from "./RatesDesk";
import { portfolioDeskEn } from "./PortfolioDesk";
import { ratesDeskMissionsEn } from "./RatesDeskMissions";
import { ratesDeskHelpEn } from "./RatesDeskHelp";
import { portfolioDeskMissionsEn } from "./PortfolioDeskMissions";
import { portfolioDeskHelpEn } from "./PortfolioDeskHelp";
import { retirementDeskEn } from "./RetirementDesk";
import { retirementDeskMissionsEn } from "./RetirementDeskMissions";
import { retirementDeskHelpEn } from "./RetirementDeskHelp";
import { marketMakingDeskEn } from "./MarketMakingDesk";
import { marketMakingDeskMissionsEn } from "./MarketMakingDeskMissions";
import { marketMakingDeskHelpEn } from "./MarketMakingDeskHelp";

/// Copy of the desk games and the Sandbox; loaded with those routes only (see languageLoader.withDeskCopy).
export const desksEn = {
  ...hedgingDeskEn,
  ...hedgingDeskMissionsEn,
  ...hedgingDeskSideEn,
  ...hedgingDeskDebriefEn,
  ...hedgingDeskChartsEn,
  ...hedgingDeskMissionScreenEn,
  ...hedgingDeskDemoStepsEn,
  ...hedgingDeskHelpEn,
  ...hedgingDeskHelpAdviceEn,
  ...hedgingDeskHelpGuideEn,
  ...hedgingDeskHelpWhatIfEn,
  ...gameKitEn,
  ...almDeskEn,
  ...almDeskMissionsEn,
  ...almDeskHelpEn,
  ...sandboxEn,
  ...ratesDeskEn,
  ...ratesDeskMissionsEn,
  ...ratesDeskHelpEn,
  ...portfolioDeskEn,
  ...portfolioDeskMissionsEn,
  ...portfolioDeskHelpEn,
  ...retirementDeskEn,
  ...retirementDeskMissionsEn,
  ...retirementDeskHelpEn,
  ...marketMakingDeskEn,
  ...marketMakingDeskMissionsEn,
  ...marketMakingDeskHelpEn,
};
