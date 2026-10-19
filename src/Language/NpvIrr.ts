export const npvIrrEn = {
  // Header & general
  npvTitle: "NPV / IRR",
  npvDesc:
    "An interactive investment-analysis lab: explore net present value, IRR, scenarios, sensitivity, Monte Carlo and real options.",
  npvControlsTitle: "Project inputs",
  npvExampleProject: "Example project…",
  npvReset: "Reset",
  npvExport: "Export",
  npvLearn: "Learn",
  npvClose: "Close",

  // Tabs
  npvTabOverview: "Overview",
  npvTabCashflow: "Cashflow analysis",
  npvTabScenarios: "Scenarios",
  npvTabSensitivity: "Sensitivity",
  npvTabMonteCarlo: "Monte Carlo",
  npvTabRealOptions: "Real options",

  // Inputs
  npvOutlayLabel: "Initial outlay",
  npvAnnualLabel: "Annual cashflow",
  npvYearsLabel: "Number of years",
  npvRateLabel: "Discount rate",
  npvGrowthLabel: "Growth rate",
  npvPatternLabel: "Cashflow pattern",
  npvPatternConstant: "Constant",
  npvPatternGrowing: "Growing",
  npvPatternCustom: "Custom",
  npvCustomHint: "Edit each year's cashflow in the Cashflow analysis tab.",
  npvDetailLabel: "Detail",
  npvBasic: "Basic",
  npvAdvanced: "Advanced",
  npvInflationLabel: "Inflation adjustment",
  npvTaxLabel: "Tax rate",
  npvTerminalLabel: "Terminal value",
  npvTimingLabel: "Cashflow timing",
  npvTimingEnd: "End of year",
  npvTimingBegin: "Begin of year",
  npvInfoPattern: "How yearly inflows evolve: level, compounding at the growth rate, or hand-entered.",

  // KPIs
  npvValue: "NPV",
  npvIrr: "IRR",
  npvPi: "Profitability index",
  npvPayback: "Discounted payback",
  npvYearsUnit: "yr",
  npvVsRate: "vs cost of capital",
  npvNoIrr: "No IRR",
  npvMultipleIrr: "Multiple IRRs",
  npvNeverPays: "Never pays back",
  npvDiscountedBasis: "Discounted basis",
  npvTagCreates: "Creates value",
  npvTagDestroys: "Destroys value",
  npvTagPiGood: "Above 1.0",
  npvTagPiBad: "Below 1.0",
  npvInfoNpv: "Present value of all cashflows; positive means the project adds value.",
  npvInfoIrr: "The discount rate at which NPV is zero; compare it with the cost of capital.",
  npvInfoPi: "Present value of inflows per unit of initial outlay; above 1.0 is favourable.",
  npvInfoPayback: "The year at which discounted cumulative cashflow first turns positive.",

  // Overview chart
  npvChartTitle: "NPV profile",
  npvToggleIrr: "Show IRR",
  npvTogglePi: "PI > 1 region",
  npvDragHint: "Drag the marker or the plot to change the discount rate.",

  // Interpretation
  npvInterpretTitle: "Interpretation",
  npvInsightAccept:
    "NPV is {npv} and IRR ({irr}) exceeds the {rate} cost of capital — the project creates value and is acceptable.",
  npvInsightReject:
    "NPV is negative ({npv}) and the return falls short of the {rate} hurdle — as configured the project destroys value.",
  npvInsightMarginal:
    "NPV is close to zero ({npv}); the project roughly breaks even at the current {rate} discount rate.",
  npvInsightNoIrr:
    "Inflows never recover the outlay at any positive rate, so there is no internal rate of return.",
  npvInsightBroad: "NPV stays positive across a broad range of discount rates (up to {irr}).",
  npvInsightNarrow: "NPV is sensitive to the discount rate and crosses zero near {irr}.",
  npvInsightMultipleIrr:
    "Cashflows change sign more than once, so several IRRs may exist — read the NPV profile, not a single IRR.",
  npvInsightDriver: "NPV is most sensitive to {driver} in this configuration.",

  // Cashflow tab
  npvScheduleTitle: "Cashflow schedule",
  npvColYear: "Year",
  npvColCashflow: "Cash flow",
  npvColDiscount: "Discount factor",
  npvColPv: "Present value",
  npvColCumPv: "Cumulative PV",
  npvAddYear: "+ Year",
  npvRemoveYear: "− Year",
  npvExportCsv: "Export CSV",
  npvCashflowChart: "Cashflow visualisation",
  npvModeNominal: "Nominal",
  npvModePv: "Present value",
  npvModeDrag: "Drag to edit",
  npvDragBarAria: "Cash flow in year {{year}}",
  npvDragEditHint: "Drag a bar, or focus it and use the arrow keys, to set that year's cash flow; year 0 is the outlay. The lighter bar behind it is its present value at the current rate. Editing a year switches the pattern to custom, exactly like typing in the table.",
  npvPredictIrr: "Predict the IRR",
  npvPredictPrompt: "Where does the NPV profile cross zero? Click the chart to place your guess, then reveal.",
  npvExplainQ: "Why is the IRR where the NPV profile crosses zero?",
  npvExplainRight: "Because the IRR is defined as the discount rate at which the project's NPV is exactly zero.",
  npvExplainRightFb: "Discounting the cash flows at the IRR makes their present value exactly equal to the outlay.",
  npvExplainChosen: "Because it is the discount rate I chose for the project.",
  npvExplainChosenFb: "No: your chosen rate is where the rate marker sits. The IRR comes from the cash flows alone and does not depend on that choice.",
  npvExplainProfit: "Because it is the total profit divided by the outlay.",
  npvExplainProfitFb: "That ratio ignores timing. The IRR discounts each cash flow by when it arrives, so it is a rate per year, not total profit over cost.",
  npvExplainPeak: "Because it is where the NPV is largest.",
  npvExplainPeakFb: "For an ordinary project the NPV falls as the rate rises, so it is largest at a 0% rate. The IRR is where it has fallen to zero.",
  npvPredictHint: "Predict mode: a click on the chart places your guess instead of moving the discount rate.",
  npvPredictNone: "This project has no single IRR in the chart's range (no sign change, or several), so there is nothing to predict. Change the cash flows and try again.",
  npvToggleCumulative: "Cumulative",
  npvCashflowLegend:
    "Red = initial outlay, green = inflows; the line tracks cumulative present value.",
  npvScenarioSummary: "Scenario summary",
  npvColScenario: "Scenario",
  npvNpvAtRate: "NPV @ rate",
  npvNpvComparison: "NPV comparison",

  // Scenarios tab
  npvScenariosTitle: "Scenarios",
  npvScenarioName: "Scenario name",
  npvDuplicate: "Duplicate",
  npvDelete: "Delete",
  npvAddScenario: "Add scenario",
  npvEditing: "Editing",
  npvScenarioOverlay: "NPV profiles",
  npvOverlayHint: "Dashed lines are other scenarios; the solid line is the one you are editing.",
  npvScenarioKpis: "Scenario comparison",
  npvScenarioNew: "Scenario",
  npvScenarioCopy: "copy",

  // Sensitivity tab
  npvTornadoTitle: "Tornado — NPV drivers",
  npvSensControls: "Sensitivity controls",
  npvHeatmapAxes: "Heatmap axes",
  npvSwingRange: "Swing",
  npvTornadoHint:
    "Each bar shows how far NPV moves when a variable swings by the chosen range; sorted by impact.",
  npvHeatmapTitle: "2-D sensitivity",
  npvAxisX: "X",
  npvAxisY: "Y",
  npvHeatmapHint:
    "Green is positive NPV, red negative; the outlined cell is the base case. Click a cell to apply it.",
  npvVarAnnual: "Annual cashflow",
  npvVarRate: "Discount rate",
  npvVarOutlay: "Initial outlay",
  npvVarYears: "Project duration",
  npvVarGrowth: "Growth rate",

  // Monte Carlo tab
  npvMcControlsTitle: "Simulation inputs",
  npvDistLabel: "Distribution",
  npvDistNormal: "Normal",
  npvDistUniform: "Uniform",
  npvDistTriangular: "Triangular",
  npvCashflowVol: "Cashflow volatility",
  npvGrowthUncertainty: "Growth uncertainty",
  npvRateUncertainty: "Discount-rate uncertainty",
  npvIterations: "Iterations",
  npvSeed: "Random seed",
  npvRunSimulation: "Run simulation",
  npvRunning: "Running…",
  npvMcDisclaimer:
    "Monte Carlo outputs are assumption-driven illustrations, not guaranteed forecasts.",
  npvMcHistogram: "NPV distribution",
  npvMcHistHint:
    "Each bar counts simulated outcomes; green bars are NPV > 0 and the dashed line is the mean.",
  npvMcEmpty:
    "Set your uncertainty assumptions and run the simulation to see the NPV distribution.",
  npvProbPositive: "P(NPV > 0)",
  npvMeanNpv: "Mean NPV",
  npvMedianNpv: "Median NPV",
  npvStdDev: "Std deviation",
  npvPercentileRange: "5–95% range",
  npvConfidence90: "90% of outcomes",
  npvIterationsUnit: "runs",
  npvInfoProbPositive: "Share of simulated runs with a positive NPV.",
  npvInfoStdDev: "Dispersion of simulated NPV outcomes around the mean.",

  // Real options tab
  npvOptionControls: "Option to expand",
  npvOptionOn: "With option",
  npvOptionOff: "No option",
  npvExpansionInvest: "Expansion investment",
  npvAdditionalAnnual: "Additional annual cashflow",
  npvExpansionYear: "Expansion year",
  npvOptionProbability: "Probability upside occurs",
  npvOptionExplainer:
    "Managerial flexibility — the right but not the obligation to expand — can add value even when an upfront commitment would not.",
  npvOptionValue: "Option value",
  npvFlexibleValue: "Value with flexibility",
  npvExpansionNpv: "Expansion NPV",
  npvIfExercised: "if exercised",
  npvFlexComparison: "Flexibility comparison",
  npvFlexHint:
    "No flexibility ignores expansion; commit-now takes it regardless; the option captures the upside only when favourable.",
  npvNoFlex: "No flexibility",
  npvRigid: "Commit now",
  npvWithOption: "With option",
  npvInfoOptionValue:
    "Expected value of the expansion option: the favourable upside weighted by its probability.",

  // Learn drawer
  npvLearnTitle: "Understanding the metrics",
  npvLearnNpv:
    "NPV discounts every cashflow to today and subtracts the outlay. Positive NPV means the project earns more than the cost of capital.",
  npvLearnIrr:
    "IRR is the discount rate that makes NPV zero. Accept when IRR exceeds the cost of capital, but beware non-conventional cashflows with multiple IRRs.",
  npvLearnPi:
    "The profitability index is PV of inflows divided by the outlay. It ranks projects by value created per unit invested.",
  npvLearnPayback:
    "Discounted payback is when cumulative discounted cashflow turns positive — a liquidity view, not a value measure.",
  npvLearnSensitivityTitle: "Sensitivity",
  npvLearnSensitivity:
    "Tornado and heatmap views reveal which assumptions move NPV most, focusing attention on the inputs that matter.",
  npvLearnMonteCarloTitle: "Monte Carlo",
  npvLearnMonteCarlo:
    "Monte Carlo samples uncertain inputs thousands of times to show the distribution of possible NPVs and the chance of a positive outcome.",
  npvLearnRealOptionsTitle: "Real options",
  npvLearnRealOptions:
    "Real options value managerial flexibility — such as the option to expand — which standard NPV ignores by assuming a fixed plan.",

  // Presets
  npvPresetBaseline: "Baseline (1000 / 250 / 6yr)",
  npvPresetGrowth: "Growth venture",
  npvPresetInfra: "Infrastructure",
  npvPresetDeclining: "Declining asset",
  npvPresetMarginal: "Marginal project",
};
