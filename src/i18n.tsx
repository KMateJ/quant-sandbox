import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import { homeEn, homeHu } from "./Language/Home";
import { binomialEn, binomialHu } from "./Language/Binomial";
import { payoffEn, payoffHu } from "./Language/Payoff";
import { payoffReplicationEn, payoffReplicationHu } from "./Language/PayoffReplication";
import { diffusionEn, diffusionHu } from "./Language/Diffusion";
import { blackScholesEn, blackScholesHu } from "./Language/BlackScholes";
import { themeEn, themeHu } from "./Language/Theme";
import { hestonEn, hestonHu } from "./Language/Heston";
import { riskReturnEn, riskReturnHu } from "./Language/RiskReturn";
import { capmEn, capmHu } from "./Language/Capm";
import { portfolioLabEn, portfolioLabHu } from "./Language/PortfolioLab";
import { bondPricingEn, bondPricingHu } from "./Language/BondPricing";
import { efficientFrontierEn, efficientFrontierHu } from "./Language/EfficientFrontier";
import { npvIrrEn, npvIrrHu } from "./Language/NpvIrr";
import { valuationEn, valuationHu } from "./Language/Valuation";
import { tvmEn, tvmHu } from "./Language/Tvm";
import { waccEn, waccHu } from "./Language/Wacc";
import { capitalStructureEn, capitalStructureHu } from "./Language/CapitalStructure";
import { yieldCurveEn, yieldCurveHu } from "./Language/YieldCurve";
import { durationConvexityEn, durationConvexityHu } from "./Language/DurationConvexity";
import { brownianMotionEn, brownianMotionHu } from "./Language/BrownianMotion";
import { gbmEn, gbmHu } from "./Language/Gbm";
import { itoProcessEn, itoProcessHu } from "./Language/ItoProcess";
import { monteCarloEn, monteCarloHu } from "./Language/MonteCarlo";
import { stochasticModelsEn, stochasticModelsHu } from "./Language/StochasticModels";
import { brownianFundamentalsEn, brownianFundamentalsHu } from "./Language/BrownianFundamentals";
import { wienerProcessEn, wienerProcessHu } from "./Language/WienerProcess";
import { moduleAboutEn, moduleAboutHu } from "./Language/ModuleAbout";
import { pathGeometryEn, pathGeometryHu } from "./Language/PathGeometry";
import { deltaHedgingEn, deltaHedgingHu } from "./Language/DeltaHedging";
import { intuitionEn, intuitionHu } from "./Language/Intuition";
import { legacyIntuitionEn, legacyIntuitionHu } from "./Language/LegacyIntuition";
import { treasuryFuturesEn, treasuryFuturesHu } from "./Language/TreasuryFutures";
import { guideEn, guideHu } from "./Language/Guide";
import { guidePortfolioEn, guidePortfolioHu } from "./Language/GuidePortfolio";
import { guideFixedIncomeEn, guideFixedIncomeHu } from "./Language/GuideFixedIncome";
import { guideCorporateEn, guideCorporateHu } from "./Language/GuideCorporate";
import { guideStochasticEn, guideStochasticHu } from "./Language/GuideStochastic";
import { guideWave2En, guideWave2Hu } from "./Language/GuideWave2";
import { guideWave3En, guideWave3Hu } from "./Language/GuideWave3";
import { guideGraphEn, guideGraphHu } from "./Language/GuideGraph";
import { guideInteractiveEn, guideInteractiveHu } from "./Language/GuideInteractive";
import { guideInteractive2En, guideInteractive2Hu } from "./Language/GuideInteractive2";
import { playbackEn, playbackHu } from "./Language/Playback";
import { labControlsEn, labControlsHu } from "./Language/LabControls";
import { bondInputsEn, bondInputsHu } from "./Language/BondInputs";
import { labPrimitivesEn, labPrimitivesHu } from "./Language/LabPrimitives";

export type Language = "hu" | "en";

type TranslationTree = Record<string, string>;

type I18nContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.hu, options?: Record<string, string | number>) => string;
};

const STORAGE_KEY = "qs-language";

export const translations = {
  hu: {
    ...intuitionHu,
    ...legacyIntuitionHu,
    ...homeHu,
    ...binomialHu,
    ...payoffHu,
    ...payoffReplicationHu,
    ...diffusionHu,
    ...blackScholesHu,
    ...hestonHu,
    ...riskReturnHu,
    ...capmHu,
    ...portfolioLabHu,
    ...efficientFrontierHu,
    ...npvIrrHu,
    ...valuationHu,
    ...tvmHu,
    ...waccHu,
    ...capitalStructureHu,
    ...bondPricingHu,
    ...yieldCurveHu,
    ...durationConvexityHu,
    ...treasuryFuturesHu,
    ...guideHu,
    ...guidePortfolioHu,
    ...guideFixedIncomeHu,
    ...guideCorporateHu,
    ...guideStochasticHu,
    ...guideWave2Hu,
    ...guideWave3Hu,
    ...guideGraphHu,
    ...guideInteractiveHu,
    ...guideInteractive2Hu,
    ...playbackHu,
    ...labControlsHu,
    ...bondInputsHu,
    ...labPrimitivesHu,
    ...brownianMotionHu,
    ...gbmHu,
    ...itoProcessHu,
    ...monteCarloHu,
    ...stochasticModelsHu,
    ...brownianFundamentalsHu,
    ...wienerProcessHu,
    ...moduleAboutHu,
    ...pathGeometryHu,
    ...deltaHedgingHu,
    ...themeHu,
    navGuide: "Útmutató",
  },
  en: {
    ...intuitionEn,
    ...legacyIntuitionEn,
    ...homeEn,
    ...binomialEn,
    ...payoffEn,
    ...payoffReplicationEn,
    ...diffusionEn,
    ...blackScholesEn,
    ...hestonEn,
    ...riskReturnEn,
    ...capmEn,
    ...portfolioLabEn,
    ...efficientFrontierEn,
    ...npvIrrEn,
    ...valuationEn,
    ...tvmEn,
    ...waccEn,
    ...capitalStructureEn,
    ...bondPricingEn,
    ...yieldCurveEn,
    ...durationConvexityEn,
    ...treasuryFuturesEn,
    ...guideEn,
    ...guidePortfolioEn,
    ...guideFixedIncomeEn,
    ...guideCorporateEn,
    ...guideStochasticEn,
    ...guideWave2En,
    ...guideWave3En,
    ...guideGraphEn,
    ...guideInteractiveEn,
    ...guideInteractive2En,
    ...playbackEn,
    ...labControlsEn,
    ...bondInputsEn,
    ...labPrimitivesEn,
    ...brownianMotionEn,
    ...gbmEn,
    ...itoProcessEn,
    ...monteCarloEn,
    ...stochasticModelsEn,
    ...brownianFundamentalsEn,
    ...wienerProcessEn,
    ...moduleAboutEn,
    ...pathGeometryEn,
    ...deltaHedgingEn,
    ...themeEn,
    navGuide: "Guide",
  },
} satisfies Record<Language, TranslationTree>;

export type TranslationKey = keyof typeof translations.hu;

function getInitialLanguage(): Language {
  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "hu" || saved === "en") return saved;
  }
  return "en";
}

if (!i18n.isInitialized) {
  void i18n.use(initReactI18next).init({
    resources: {
      en: { translation: translations.en },
      hu: { translation: translations.hu },
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    // The dev server skips type-checking, so a key missing from the tables would otherwise render silently as raw text.
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: (lngs, _ns, key) => console.warn(`[i18n] missing key "${key}" (${lngs.join(", ")})`),
  });
} else {
  // Hot reload re-runs this module with edited tables; push them into the live instance,
  // otherwise keys added since the page loaded render as raw key names.
  (["en", "hu"] as const).forEach((lng) =>
    i18n.addResourceBundle(lng, "translation", translations[lng], true, true)
  );
  void i18n.changeLanguage(i18n.language);
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { t, i18n: instance } = useTranslation();
  const [language, setLanguageState] = useState<Language>(
    () => (instance.language as Language) || "en"
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<I18nContextValue>(() => {
    return {
      language,
      setLanguage: (lang) => {
        void instance.changeLanguage(lang);
        localStorage.setItem(STORAGE_KEY, lang);
        setLanguageState(lang);
      },
      t: (key, options) => t(key, options),
    };
  }, [language, t, instance]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used inside LanguageProvider");
  }
  return ctx;
}