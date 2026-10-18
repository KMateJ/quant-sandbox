import type { ComponentType } from "react";
import type { GuideFigureId } from "../../guide.content.types";
import BlackScholesPriceFigure from "./BlackScholesPriceFigure";
import CompoundingFigure from "./CompoundingFigure";
import DeltaTangentFigure from "./DeltaTangentFigure";
import ForwardArbitrageFigure from "./ForwardArbitrageFigure";
import GbmPathsFigure from "./GbmPathsFigure";
import OneStepTreeFigure from "./OneStepTreeFigure";
import ParityFigure from "./ParityFigure";
import PayoffFigure from "./PayoffFigure";
import RandomWalkFigure from "./RandomWalkFigure";
import RealVsRiskNeutralFigure from "./RealVsRiskNeutralFigure";
import StrategyFigure from "./StrategyFigure";
import TreeConvergenceFigure from "./TreeConvergenceFigure";
import VolatilityHorizonFigure from "./VolatilityHorizonFigure";
import TwoAssetFrontierFigure from "./TwoAssetFrontierFigure";
import CapitalMarketLineFigure from "./CapitalMarketLineFigure";
import SecurityMarketLineFigure from "./SecurityMarketLineFigure";
import PriceYieldFigure from "./PriceYieldFigure";
import DurationConvexityFigure from "./DurationConvexityFigure";
import SpotForwardFigure from "./SpotForwardFigure";
import NpvProfileFigure from "./NpvProfileFigure";
import WaccLeverageFigure from "./WaccLeverageFigure";
import DcfTerminalFigure from "./DcfTerminalFigure";
import QuadraticVariationFigure from "./QuadraticVariationFigure";
import MonteCarloConvergenceFigure from "./MonteCarloConvergenceFigure";
import CtdSwitchFigure from "./CtdSwitchFigure";
import VolSmileFigure from "./VolSmileFigure";
import GreeksProfileFigure from "./GreeksProfileFigure";
import ImpliedVolFigure from "./ImpliedVolFigure";
import BlDensityFigure from "./BlDensityFigure";
import VarEsFigure from "./VarEsFigure";
import OuPathsFigure from "./OuPathsFigure";
import AmericanBoundaryFigure from "./AmericanBoundaryFigure";
import SwapRateFigure from "./SwapRateFigure";
import GirsanovShiftFigure from "./GirsanovShiftFigure";
import RealOptionTreeFigure from "./RealOptionTreeFigure";
import ExoticPricesFigure from "./ExoticPricesFigure";
import JumpDensityFigure from "./JumpDensityFigure";
import CreditSpreadFigure from "./CreditSpreadFigure";
import FactorVarianceFigure from "./FactorVarianceFigure";
import EulerConvergenceFigure from "./interactive/EulerConvergenceFigure";
import MartingaleBettingFigure from "./interactive/MartingaleBettingFigure";
import CallablePriceYieldFigure from "./interactive/CallablePriceYieldFigure";
import ImmunizationShockFigure from "./interactive/ImmunizationShockFigure";
import PerformanceRankingFigure from "./interactive/PerformanceRankingFigure";
import UtilityIndifferenceFigure from "./interactive/UtilityIndifferenceFigure";
import MultiplesPeersFigure from "./interactive/MultiplesPeersFigure";
import AnnuitiesScheduleFigure from "./interactive/AnnuitiesScheduleFigure";
import CashflowBuilderFigure from "./interactive/CashflowBuilderFigure";
import AmericanTreeFigure from "./interactive/AmericanTreeFigure";
import McHistogramFigure from "./interactive/McHistogramFigure";
import IvSurfaceFigure from "./interactive/IvSurfaceFigure";
import SwapTimelineFigure from "./interactive/SwapTimelineFigure";
import CapitalSplitFigure from "./interactive/CapitalSplitFigure";
import DragAssetsFigure from "./interactive2/DragAssetsFigure";
import DurationBalanceFigure from "./interactive2/DurationBalanceFigure";
import GaltonWalkFigure from "./interactive2/GaltonWalkFigure";
import HedgeSimulationFigure from "./interactive2/HedgeSimulationFigure";
import SigmaPartitionFigure from "./stochastic/SigmaPartitionFigure";
import FiltrationTreeFigure from "./stochastic/FiltrationTreeFigure";
import BmTransformationsFigure from "./stochastic/BmTransformationsFigure";
import ReflectionMaxFigure from "./stochastic/ReflectionMaxFigure";
import BrownianBridgeFigure from "./stochastic/BrownianBridgeFigure";
import ItoSumsFigure from "./stochastic/ItoSumsFigure";
import FeynmanKacFigure from "./stochastic/FeynmanKacFigure";

/// Interactive figure component per id, as referenced by lesson content.
export const guideFigures: Record<GuideFigureId, ComponentType> = {
  compounding: CompoundingFigure,
  "volatility-horizon": VolatilityHorizonFigure,
  "random-walk": RandomWalkFigure,
  payoff: PayoffFigure,
  strategy: StrategyFigure,
  "forward-arbitrage": ForwardArbitrageFigure,
  "put-call-parity": ParityFigure,
  "one-step-tree": OneStepTreeFigure,
  "real-vs-risk-neutral": RealVsRiskNeutralFigure,
  "tree-convergence": TreeConvergenceFigure,
  "delta-tangent": DeltaTangentFigure,
  "gbm-paths": GbmPathsFigure,
  "black-scholes-price": BlackScholesPriceFigure,
  "two-asset-frontier": TwoAssetFrontierFigure,
  "capital-market-line": CapitalMarketLineFigure,
  "security-market-line": SecurityMarketLineFigure,
  "price-yield": PriceYieldFigure,
  "duration-convexity": DurationConvexityFigure,
  "spot-forward": SpotForwardFigure,
  "npv-profile": NpvProfileFigure,
  "wacc-leverage": WaccLeverageFigure,
  "dcf-terminal": DcfTerminalFigure,
  "quadratic-variation": QuadraticVariationFigure,
  "monte-carlo-convergence": MonteCarloConvergenceFigure,
  "ctd-switch": CtdSwitchFigure,
  "vol-smile": VolSmileFigure,
  "greeks-profile": GreeksProfileFigure,
  "implied-vol": ImpliedVolFigure,
  "bl-density": BlDensityFigure,
  "var-es": VarEsFigure,
  "ou-paths": OuPathsFigure,
  "american-boundary": AmericanBoundaryFigure,
  "swap-rate": SwapRateFigure,
  "girsanov-shift": GirsanovShiftFigure,
  "real-option-tree": RealOptionTreeFigure,
  "exotic-prices": ExoticPricesFigure,
  "jump-density": JumpDensityFigure,
  "credit-spread": CreditSpreadFigure,
  "factor-variance": FactorVarianceFigure,
  "cashflow-builder": CashflowBuilderFigure,
  "american-tree": AmericanTreeFigure,
  "mc-histogram": McHistogramFigure,
  "iv-surface": IvSurfaceFigure,
  "swap-timeline": SwapTimelineFigure,
  "capital-split": CapitalSplitFigure,
  "drag-assets": DragAssetsFigure,
  "duration-balance": DurationBalanceFigure,
  "galton-walk": GaltonWalkFigure,
  "hedge-simulation": HedgeSimulationFigure,
  "amortization-schedule": AnnuitiesScheduleFigure,
  "multiples-peers": MultiplesPeersFigure,
  "utility-indifference": UtilityIndifferenceFigure,
  "performance-ranking": PerformanceRankingFigure,
  "immunization-shock": ImmunizationShockFigure,
  "callable-price-yield": CallablePriceYieldFigure,
  "martingale-betting": MartingaleBettingFigure,
  "euler-convergence": EulerConvergenceFigure,
  "sigma-partition": SigmaPartitionFigure,
  "filtration-tree": FiltrationTreeFigure,
  "bm-transformations": BmTransformationsFigure,
  "reflection-max": ReflectionMaxFigure,
  "brownian-bridge": BrownianBridgeFigure,
  "ito-sums": ItoSumsFigure,
  "feynman-kac": FeynmanKacFigure,
};
