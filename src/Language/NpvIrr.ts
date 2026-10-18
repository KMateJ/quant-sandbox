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

export const npvIrrHu: typeof npvIrrEn = {
  // Header & general
  npvTitle: "NPV / IRR",
  npvDesc:
    "Interaktív beruházás-elemző labor: nettó jelenérték, IRR, forgatókönyvek, érzékenység, Monte Carlo és reálopciók.",
  npvControlsTitle: "Projekt paraméterek",
  npvExampleProject: "Példaprojekt…",
  npvReset: "Alaphelyzet",
  npvExport: "Exportálás",
  npvLearn: "Tanulás",
  npvClose: "Bezárás",

  // Tabs
  npvTabOverview: "Áttekintés",
  npvTabCashflow: "Pénzáram-elemzés",
  npvTabScenarios: "Forgatókönyvek",
  npvTabSensitivity: "Érzékenység",
  npvTabMonteCarlo: "Monte Carlo",
  npvTabRealOptions: "Reálopciók",

  // Inputs
  npvOutlayLabel: "Kezdő beruházás",
  npvAnnualLabel: "Éves pénzáram",
  npvYearsLabel: "Évek száma",
  npvRateLabel: "Diszkontráta",
  npvGrowthLabel: "Növekedési ráta",
  npvPatternLabel: "Pénzáram mintázat",
  npvPatternConstant: "Állandó",
  npvPatternGrowing: "Növekvő",
  npvPatternCustom: "Egyedi",
  npvCustomHint: "Az egyes évek pénzáramát a Pénzáram-elemzés fülön szerkesztheti.",
  npvDetailLabel: "Részletesség",
  npvBasic: "Alap",
  npvAdvanced: "Haladó",
  npvInflationLabel: "Inflációs korrekció",
  npvTaxLabel: "Adókulcs",
  npvTerminalLabel: "Maradványérték",
  npvTimingLabel: "Pénzáram ütemezés",
  npvTimingEnd: "Év vége",
  npvTimingBegin: "Év eleje",
  npvInfoPattern: "Hogyan alakulnak az éves bevételek: állandó, növekedési rátával, vagy kézzel megadva.",

  // KPIs
  npvValue: "NPV",
  npvIrr: "IRR",
  npvPi: "Jövedelmezőségi index",
  npvPayback: "Diszkontált megtérülés",
  npvYearsUnit: "év",
  npvVsRate: "a tőkeköltséghez képest",
  npvNoIrr: "Nincs IRR",
  npvMultipleIrr: "Több IRR",
  npvNeverPays: "Sosem térül meg",
  npvDiscountedBasis: "Diszkontált alapon",
  npvTagCreates: "Értéket teremt",
  npvTagDestroys: "Értéket rombol",
  npvTagPiGood: "1,0 felett",
  npvTagPiBad: "1,0 alatt",
  npvInfoNpv: "Az összes pénzáram jelenértéke; a pozitív érték azt jelenti, hogy a projekt értéket teremt.",
  npvInfoIrr: "Az a diszkontráta, amelynél az NPV nulla; hasonlítsa a tőkeköltséghez.",
  npvInfoPi: "A bevételek jelenértéke a kezdő beruházás egységére vetítve; 1,0 felett kedvező.",
  npvInfoPayback: "Az az év, amikor a diszkontált kumulált pénzáram először pozitívvá válik.",

  // Overview chart
  npvChartTitle: "NPV profil",
  npvToggleIrr: "IRR megjelenítése",
  npvTogglePi: "PI > 1 tartomány",
  npvDragHint: "Húzza a jelölőt vagy a diagramot a diszkontráta módosításához.",

  // Interpretation
  npvInterpretTitle: "Értelmezés",
  npvInsightAccept:
    "Az NPV {npv}, és az IRR ({irr}) meghaladja a {rate} tőkeköltséget — a projekt értéket teremt és elfogadható.",
  npvInsightReject:
    "Az NPV negatív ({npv}), és a hozam elmarad a {rate} küszöbtől — a beállítások mellett a projekt értéket rombol.",
  npvInsightMarginal:
    "Az NPV nulla közeli ({npv}); a projekt nagyjából a jelenlegi {rate} diszkontrátán térül meg.",
  npvInsightNoIrr:
    "A bevételek semmilyen pozitív rátán nem fedezik a beruházást, így nincs belső megtérülési ráta.",
  npvInsightBroad: "Az NPV a diszkontráták széles tartományában pozitív marad (egészen {irr}-ig).",
  npvInsightNarrow: "Az NPV érzékeny a diszkontrátára, és {irr} közelében metszi a nullát.",
  npvInsightMultipleIrr:
    "A pénzáramok egynél többször váltanak előjelet, így több IRR is létezhet — az NPV profilt olvassa, ne egyetlen IRR-t.",
  npvInsightDriver: "Az NPV ebben a beállításban a(z) {driver} változóra a legérzékenyebb.",

  // Cashflow tab
  npvScheduleTitle: "Pénzáram ütemezés",
  npvColYear: "Év",
  npvColCashflow: "Pénzáram",
  npvColDiscount: "Diszkontfaktor",
  npvColPv: "Jelenérték",
  npvColCumPv: "Kumulált PV",
  npvAddYear: "+ Év",
  npvRemoveYear: "− Év",
  npvExportCsv: "CSV export",
  npvCashflowChart: "Pénzáram vizualizáció",
  npvModeNominal: "Nominális",
  npvModePv: "Jelenérték",
  npvModeDrag: "Húzás",
  npvDragBarAria: "{{year}}. évi pénzáram",
  npvDragEditHint: "Húzz egy oszlopot (vagy fókuszáld, és használd a nyilakat) az adott év pénzáramának beállításához; a 0. év a kezdő befektetés. A mögötte lévő halványabb oszlop a jelenértéke az aktuális diszkontrátával. Egy év szerkesztése egyedi mintára vált, ugyanúgy, mint a táblázatba írás.",
  npvPredictIrr: "Tippeld meg az IRR-t",
  npvPredictPrompt: "Hol metszi az NPV-profil a nullát? Kattints az ábrára a tipped megadásához, aztán fedd fel.",
  npvExplainQ: "Miért ott van az IRR, ahol az NPV-profil metszi a nullát?",
  npvExplainRight: "Mert az IRR definíció szerint az a diszkontráta, amelynél a projekt NPV-je pontosan nulla.",
  npvExplainRightFb: "Az IRR-rel diszkontálva a pénzáramok jelenértéke pontosan megegyezik a kezdő befektetéssel.",
  npvExplainChosen: "Mert ez az a diszkontráta, amelyet a projekthez választottam.",
  npvExplainChosenFb: "Nem: a választott ráta ott van, ahol a rátajelölő áll. Az IRR csak a pénzáramokból adódik, nem függ ettől a választástól.",
  npvExplainProfit: "Mert ez az összes nyereség osztva a kezdő befektetéssel.",
  npvExplainProfitFb: "Ez az arány nem veszi figyelembe az időzítést. Az IRR minden pénzáramot az érkezése szerint diszkontál, tehát évi ráta, nem összes nyereség per költség.",
  npvExplainPeak: "Mert ott a legnagyobb az NPV.",
  npvExplainPeakFb: "Szokásos projektnél az NPV a rátával csökken, így 0%-nál a legnagyobb. Az IRR ott van, ahol nullára csökkent.",
  npvPredictHint: "Tippelő mód: az ábrára kattintás a tippedet helyezi el, nem a diszkontrátát mozgatja.",
  npvPredictNone: "Ennek a projektnek nincs egyetlen IRR-je az ábra tartományában (nincs előjelváltás, vagy több is van), így nincs mit megtippelni. Módosítsd a pénzáramokat, és próbáld újra.",
  npvToggleCumulative: "Kumulált",
  npvCashflowLegend:
    "Piros = kezdő beruházás, zöld = bevételek; a vonal a kumulált jelenértéket követi.",
  npvScenarioSummary: "Forgatókönyv összegzés",
  npvColScenario: "Forgatókönyv",
  npvNpvAtRate: "NPV a rátán",
  npvNpvComparison: "NPV összehasonlítás",

  // Scenarios tab
  npvScenariosTitle: "Forgatókönyvek",
  npvScenarioName: "Forgatókönyv neve",
  npvDuplicate: "Duplikálás",
  npvDelete: "Törlés",
  npvAddScenario: "Forgatókönyv hozzáadása",
  npvEditing: "Szerkesztés alatt",
  npvScenarioOverlay: "NPV profilok",
  npvOverlayHint: "A szaggatott vonalak a többi forgatókönyv; a folytonos a szerkesztett.",
  npvScenarioKpis: "Forgatókönyvek összehasonlítása",
  npvScenarioNew: "Forgatókönyv",
  npvScenarioCopy: "másolat",

  // Sensitivity tab
  npvTornadoTitle: "Tornádó — NPV hajtóerők",
  npvSensControls: "Érzékenységi vezérlők",
  npvHeatmapAxes: "Hőtérkép tengelyek",
  npvSwingRange: "Kilengés",
  npvTornadoHint:
    "Minden sáv azt mutatja, mennyit mozdul az NPV, ha egy változó a választott tartományban leng; hatás szerint rendezve.",
  npvHeatmapTitle: "2-D érzékenység",
  npvAxisX: "X",
  npvAxisY: "Y",
  npvHeatmapHint:
    "A zöld pozitív NPV, a piros negatív; a keretezett cella az alapeset. Kattintson egy cellára az alkalmazáshoz.",
  npvVarAnnual: "Éves pénzáram",
  npvVarRate: "Diszkontráta",
  npvVarOutlay: "Kezdő beruházás",
  npvVarYears: "Projekt időtartam",
  npvVarGrowth: "Növekedési ráta",

  // Monte Carlo tab
  npvMcControlsTitle: "Szimulációs bemenetek",
  npvDistLabel: "Eloszlás",
  npvDistNormal: "Normális",
  npvDistUniform: "Egyenletes",
  npvDistTriangular: "Háromszög",
  npvCashflowVol: "Pénzáram volatilitás",
  npvGrowthUncertainty: "Növekedési bizonytalanság",
  npvRateUncertainty: "Diszkontráta bizonytalanság",
  npvIterations: "Iterációk",
  npvSeed: "Véletlen mag",
  npvRunSimulation: "Szimuláció indítása",
  npvRunning: "Fut…",
  npvMcDisclaimer:
    "A Monte Carlo eredmények feltételezéseken alapuló szemléltetések, nem garantált előrejelzések.",
  npvMcHistogram: "NPV eloszlás",
  npvMcHistHint:
    "Minden sáv a szimulált kimeneteket számolja; a zöld sávok NPV > 0, a szaggatott vonal az átlag.",
  npvMcEmpty:
    "Állítsa be a bizonytalansági feltételezéseket és indítsa el a szimulációt az NPV eloszlás megtekintéséhez.",
  npvProbPositive: "P(NPV > 0)",
  npvMeanNpv: "Átlagos NPV",
  npvMedianNpv: "Medián NPV",
  npvStdDev: "Szórás",
  npvPercentileRange: "5–95% tartomány",
  npvConfidence90: "a kimenetek 90%-a",
  npvIterationsUnit: "futás",
  npvInfoProbPositive: "A pozitív NPV-t adó szimulált futások aránya.",
  npvInfoStdDev: "A szimulált NPV kimenetek szóródása az átlag körül.",

  // Real options tab
  npvOptionControls: "Bővítési opció",
  npvOptionOn: "Opcióval",
  npvOptionOff: "Opció nélkül",
  npvExpansionInvest: "Bővítési beruházás",
  npvAdditionalAnnual: "Többlet éves pénzáram",
  npvExpansionYear: "Bővítés éve",
  npvOptionProbability: "A kedvező eset valószínűsége",
  npvOptionExplainer:
    "A vezetői rugalmasság — a bővítés joga, de nem kötelezettsége — akkor is értéket adhat, amikor az előzetes elkötelezettség nem.",
  npvOptionValue: "Opció értéke",
  npvFlexibleValue: "Érték rugalmassággal",
  npvExpansionNpv: "Bővítés NPV",
  npvIfExercised: "ha lehívják",
  npvFlexComparison: "Rugalmasság összehasonlítás",
  npvFlexHint:
    "A rugalmasság nélküli figyelmen kívül hagyja a bővítést; a most-elkötelezem mindenképp vállalja; az opció csak kedvező esetben ragadja meg az előnyt.",
  npvNoFlex: "Rugalmasság nélkül",
  npvRigid: "Most elkötelezem",
  npvWithOption: "Opcióval",
  npvInfoOptionValue:
    "A bővítési opció várható értéke: a kedvező előny a valószínűségével súlyozva.",

  // Learn drawer
  npvLearnTitle: "A mutatók megértése",
  npvLearnNpv:
    "Az NPV minden pénzáramot a jelenre diszkontál, majd levonja a beruházást. A pozitív NPV azt jelenti, hogy a projekt többet hoz, mint a tőkeköltség.",
  npvLearnIrr:
    "Az IRR az a diszkontráta, amelynél az NPV nulla. Fogadja el, ha az IRR meghaladja a tőkeköltséget, de figyeljen a többszörös IRR-t adó, nem konvencionális pénzáramokra.",
  npvLearnPi:
    "A jövedelmezőségi index a bevételek jelenértéke osztva a beruházással. A befektetett egységre jutó értékteremtés szerint rangsorol.",
  npvLearnPayback:
    "A diszkontált megtérülés az az időpont, amikor a kumulált diszkontált pénzáram pozitívvá válik — likviditási szemlélet, nem értékmérő.",
  npvLearnSensitivityTitle: "Érzékenység",
  npvLearnSensitivity:
    "A tornádó és hőtérkép nézetek megmutatják, mely feltételezések mozgatják leginkább az NPV-t, a lényeges bemenetekre fókuszálva.",
  npvLearnMonteCarloTitle: "Monte Carlo",
  npvLearnMonteCarlo:
    "A Monte Carlo több ezerszer mintavételezi a bizonytalan bemeneteket, hogy megmutassa a lehetséges NPV-k eloszlását és a pozitív kimenet esélyét.",
  npvLearnRealOptionsTitle: "Reálopciók",
  npvLearnRealOptions:
    "A reálopciók a vezetői rugalmasságot értékelik — például a bővítési opciót —, amelyet a hagyományos NPV figyelmen kívül hagy a rögzített terv feltételezésével.",

  // Presets
  npvPresetBaseline: "Alapeset (1000 / 250 / 6 év)",
  npvPresetGrowth: "Növekedési vállalkozás",
  npvPresetInfra: "Infrastruktúra",
  npvPresetDeclining: "Csökkenő eszköz",
  npvPresetMarginal: "Határprojekt",
};
