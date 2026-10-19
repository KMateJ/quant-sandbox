import type { npvIrrEn } from "./NpvIrr";

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
