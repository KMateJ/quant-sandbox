import type { TranslationKey } from "../../i18n";
import type { GuideId, GuideLessonLocation, GuideLessonMeta, GuideTrackId, GuideTrackMeta } from "./guide.types";

/// Route of the guides; each track lives at `${GUIDE_PATH}/<track>`, its lessons below it.
export const GUIDE_PATH = "/guide";

export const guideTrackPath = (track: GuideTrackId) => `${GUIDE_PATH}/${track}`;

/// Lessons, each in its track. Lesson body text lives in `src/Language/guides`.
export const guideLessons: GuideLessonMeta[] = [
  { id: "interest-discounting", track: "corporate", titleKey: "guideInterestTitle", descKey: "guideInterestDesc", labs: ["tvm"] },
  { id: "annuities", track: "corporate", titleKey: "guideAnnuitiesTitle", descKey: "guideAnnuitiesDesc", labs: ["tvm"] },
  { id: "npv-irr", track: "corporate", titleKey: "guideNpvIrrTitle", descKey: "guideNpvIrrDesc", labs: ["npv-irr"] },
  { id: "wacc", track: "corporate", titleKey: "guideWaccTitle", descKey: "guideWaccDesc", labs: ["wacc"] },
  { id: "capital-structure", track: "corporate", titleKey: "guideCapitalStructureTitle", descKey: "guideCapitalStructureDesc", labs: ["capital-structure", "wacc"] },
  { id: "dcf-valuation", track: "corporate", titleKey: "guideDcfTitle", descKey: "guideDcfDesc", labs: ["valuation"] },
  { id: "valuation-multiples", track: "corporate", titleKey: "guideMultiplesTitle", descKey: "guideMultiplesDesc", labs: ["valuation"] },
  { id: "real-options", track: "corporate", titleKey: "guideRealOptionsTitle", descKey: "guideRealOptionsDesc", labs: ["npv-irr"] },
  { id: "returns-volatility", track: "portfolio", titleKey: "guideReturnsTitle", descKey: "guideReturnsDesc", labs: ["risk-return"] },
  { id: "diversification", track: "portfolio", titleKey: "guideDiversificationTitle", descKey: "guideDiversificationDesc", labs: ["portfolio-lab", "risk-return"] },
  { id: "efficient-frontier", track: "portfolio", titleKey: "guideFrontierTitle", descKey: "guideFrontierDesc", labs: ["efficient-frontier", "portfolio-lab"] },
  { id: "risk-aversion", track: "portfolio", titleKey: "guideRiskAversionTitle", descKey: "guideRiskAversionDesc", labs: ["risk-return", "efficient-frontier"] },
  { id: "capm", track: "portfolio", titleKey: "guideCapmTitle", descKey: "guideCapmDesc", labs: ["capm"] },
  { id: "performance-measures", track: "portfolio", titleKey: "guidePerformanceTitle", descKey: "guidePerformanceDesc", labs: ["capm", "risk-return"] },
  { id: "factor-models", track: "portfolio", titleKey: "guideFactorModelsTitle", descKey: "guideFactorModelsDesc", labs: ["capm", "portfolio-lab"] },
  { id: "risk-measures", track: "portfolio", titleKey: "guideRiskMeasuresTitle", descKey: "guideRiskMeasuresDesc", labs: ["risk-return",  "portfolio-lab"] },
  { id: "random-walks", track: "stochastic", titleKey: "guideRandomWalksTitle", descKey: "guideRandomWalksDesc", labs: ["brownian-motion", "monte-carlo"] },
  { id: "probability-spaces", track: "stochastic", titleKey: "guideProbSpacesTitle", descKey: "guideProbSpacesDesc", labs: ["stochastic-models"] },
  { id: "filtrations", track: "stochastic", titleKey: "guideFiltrationsTitle", descKey: "guideFiltrationsDesc", labs: ["stochastic-models"] },
  { id: "martingales", track: "stochastic", titleKey: "guideMartingalesTitle", descKey: "guideMartingalesDesc", labs: ["brownian-motion"] },
  { id: "brownian-properties", track: "stochastic", titleKey: "guideBmPropsTitle", descKey: "guideBmPropsDesc", labs: ["stochastic-models", "brownian-motion"] },
  { id: "reflection-principle", track: "stochastic", titleKey: "guideReflectionTitle", descKey: "guideReflectionDesc", labs: ["stochastic-models"] },
  { id: "brownian-bridge", track: "stochastic", titleKey: "guideBridgeTitle", descKey: "guideBridgeDesc", labs: ["brownian-motion", "stochastic-models"] },
  { id: "ito-integral", track: "stochastic", titleKey: "guideItoIntegralTitle", descKey: "guideItoIntegralDesc", labs: ["ito-process", "brownian-motion"] },
  { id: "ito-lemma", track: "stochastic", titleKey: "guideItoTitle", descKey: "guideItoDesc", labs: ["ito-process", "brownian-motion"] },
  { id: "feynman-kac", track: "stochastic", titleKey: "guideFeynmanKacTitle", descKey: "guideFeynmanKacDesc", labs: ["black-scholes", "monte-carlo"] },
  { id: "change-of-measure", track: "stochastic", titleKey: "guideMeasureTitle", descKey: "guideMeasureDesc", labs: ["gbm"] },
  { id: "monte-carlo-pricing", track: "stochastic", titleKey: "guideMonteCarloTitle", descKey: "guideMonteCarloDesc", labs: ["monte-carlo", "gbm"] },
  { id: "sde-simulation", track: "stochastic", titleKey: "guideSdeTitle", descKey: "guideSdeDesc", labs: ["gbm", "monte-carlo"] },
  { id: "mean-reversion", track: "stochastic", titleKey: "guideMeanReversionTitle", descKey: "guideMeanReversionDesc", labs: ["ito-process",  "yield-curve"] },
  { id: "jump-diffusion", track: "stochastic", titleKey: "guideJumpDiffusionTitle", descKey: "guideJumpDiffusionDesc", labs: ["monte-carlo", "heston"] },
  { id: "instruments", track: "derivatives", titleKey: "guideInstrumentsTitle", descKey: "guideInstrumentsDesc", labs: ["payoff"] },
  { id: "strategies", track: "derivatives", titleKey: "guideStrategiesTitle", descKey: "guideStrategiesDesc", labs: ["payoff"] },
  { id: "no-arbitrage", track: "derivatives", titleKey: "guideNoArbitrageTitle", descKey: "guideNoArbitrageDesc", labs: ["payoff"] },
  { id: "put-call-parity", track: "derivatives", titleKey: "guideParityTitle", descKey: "guideParityDesc", labs: ["payoff", "black-scholes"] },
  { id: "one-step-binomial", track: "derivatives", titleKey: "guideOneStepTitle", descKey: "guideOneStepDesc", labs: ["binomial"] },
  { id: "risk-neutral", track: "derivatives", titleKey: "guideRiskNeutralTitle", descKey: "guideRiskNeutralDesc", labs: ["binomial"] },
  { id: "multi-step-trees", track: "derivatives", titleKey: "guideMultiStepTitle", descKey: "guideMultiStepDesc", labs: ["binomial", "black-scholes"] },
  { id: "american-options", track: "derivatives", titleKey: "guideAmericanTitle", descKey: "guideAmericanDesc", labs: ["binomial"] },
  { id: "delta-hedging", track: "derivatives", titleKey: "guideDeltaHedgingTitle", descKey: "guideDeltaHedgingDesc", labs: ["delta-hedging", "black-scholes"] },
  { id: "gbm", track: "derivatives", titleKey: "guideGbmTitle", descKey: "guideGbmDesc", labs: ["gbm", "monte-carlo"] },
  { id: "toward-black-scholes", track: "derivatives", titleKey: "guideTowardBlackScholesTitle", descKey: "guideTowardBlackScholesDesc", labs: ["black-scholes", "heston"] },
  { id: "greeks", track: "derivatives", titleKey: "guideGreeksTitle", descKey: "guideGreeksDesc", labs: ["black-scholes",  "delta-hedging"] },
  { id: "implied-volatility", track: "derivatives", titleKey: "guideImpliedVolTitle", descKey: "guideImpliedVolDesc", labs: ["black-scholes",  "heston"] },
  { id: "stochastic-volatility", track: "derivatives", titleKey: "guideStochVolTitle", descKey: "guideStochVolDesc", labs: ["heston"] },
  { id: "static-replication", track: "derivatives", titleKey: "guideStaticReplicationTitle", descKey: "guideStaticReplicationDesc", labs: ["payoff",  "black-scholes"] },
  { id: "exotic-options", track: "derivatives", titleKey: "guideExoticOptionsTitle", descKey: "guideExoticOptionsDesc", labs: ["monte-carlo", "payoff"] },
  { id: "bond-pricing", track: "fixed-income", titleKey: "guideBondPricingTitle", descKey: "guideBondPricingDesc", labs: ["bond-pricing"] },
  { id: "duration-convexity", track: "fixed-income", titleKey: "guideDurationTitle", descKey: "guideDurationDesc", labs: ["duration-convexity", "bond-pricing"] },
  { id: "immunization", track: "fixed-income", titleKey: "guideImmunizationTitle", descKey: "guideImmunizationDesc", labs: ["duration-convexity", "bond-pricing"] },
  { id: "yield-curve", track: "fixed-income", titleKey: "guideYieldCurveTitle", descKey: "guideYieldCurveDesc", labs: ["yield-curve", "treasury-futures"] },
  { id: "treasury-futures", track: "fixed-income", titleKey: "guideTreasuryFuturesTitle", descKey: "guideTreasuryFuturesDesc", labs: ["treasury-futures"] },
  { id: "interest-rate-swaps", track: "fixed-income", titleKey: "guideSwapsTitle", descKey: "guideSwapsDesc", labs: ["yield-curve"] },
  { id: "callable-bonds", track: "fixed-income", titleKey: "guideCallableTitle", descKey: "guideCallableDesc", labs: ["bond-pricing", "binomial"] },
  { id: "credit-risk", track: "fixed-income", titleKey: "guideCreditRiskTitle", descKey: "guideCreditRiskDesc", labs: ["bond-pricing", "yield-curve"] },
];

const track = (id: GuideTrackId, titleKey: TranslationKey, descKey: TranslationKey): GuideTrackMeta => ({
  id,
  titleKey,
  descKey,
  lessons: guideLessons.filter((l) => l.track === id).map((l) => l.id),
});

/// Tracks in sidebar order; a track's lessons are read in registry order.
export const guideTracks: GuideTrackMeta[] = [
  track("derivatives", "guideTrackDerivativesTitle", "guideTrackDerivativesDesc"),
  track("portfolio", "guideTrackPortfolioTitle", "guideTrackPortfolioDesc"),
  track("fixed-income", "guideTrackFixedIncomeTitle", "guideTrackFixedIncomeDesc"),
  track("corporate", "guideTrackCorporateTitle", "guideTrackCorporateDesc"),
  track("stochastic", "guideTrackStochasticTitle", "guideTrackStochasticDesc"),
];

export function guideTrackById(id: GuideTrackId): GuideTrackMeta {
  return guideTracks.find((t) => t.id === id)!;
}

/// Page of a lesson, nested under its track.
export function guidePath(id: GuideId): string {
  const lesson = guideLessons.find((l) => l.id === id);
  return lesson ? `${guideTrackPath(lesson.track)}/${id}` : GUIDE_PATH;
}

/// The track whose pages contain `pathname`, if any.
export function guideTrackFromPath(pathname: string): GuideTrackMeta | undefined {
  return guideTracks.find((t) => {
    const base = guideTrackPath(t.id);
    return pathname === base || pathname.startsWith(`${base}/`);
  });
}

export function isGuideId(value: string | null | undefined): value is GuideId {
  return guideLessons.some((lesson) => lesson.id === value);
}

/// Lessons of a track, in reading order.
export function trackLessons(track: GuideTrackMeta): GuideLessonMeta[] {
  return track.lessons
    .map((id) => guideLessons.find((l) => l.id === id))
    .filter((l): l is GuideLessonMeta => Boolean(l));
}

/// Locates a lesson within its track, or `undefined` for an unknown id.
export function findGuideLesson(id: string | undefined): GuideLessonLocation | undefined {
  const lesson = guideLessons.find((l) => l.id === id);
  const track = lesson && guideTracks.find((t) => t.id === lesson.track);
  if (!lesson || !track) return undefined;
  const ordered = trackLessons(track);
  const index = ordered.indexOf(lesson);
  return { lesson, track, index, previous: ordered[index - 1], next: ordered[index + 1] };
}

/// Sidebar sub-navigation (and pre-rendered SEO pages) for one guide track.
export const guideNavItems = (track: GuideTrackMeta) =>
  trackLessons(track).map((lesson, i) => ({
    id: lesson.id,
    labelKey: lesson.titleKey,
    descKey: lesson.descKey,
    prefix: String(i + 1).padStart(2, "0"),
    to: guidePath(lesson.id),
  }));

/// Old flat guide URLs and where they live now.
export const guideRedirects = (): { from: string; to: string }[] => [
  { from: GUIDE_PATH, to: guideTrackPath(guideTracks[0].id) },
  ...guideLessons.map((l) => ({ from: `${GUIDE_PATH}/${l.id}`, to: guidePath(l.id) })),
];
