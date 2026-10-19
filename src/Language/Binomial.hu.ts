export const binomialHu = {
    binomialModeEquity: "Részvényfa",
    binomialModeRates: "Kamatlábfa",
    binomialR0Label: "r₀ (kezdeti rövid kamat)",
    binomialQLabel: "q (emelkedés árazási súlya)",
    binomialHLabel: "h (log-lépésköz)",
    binomialToggleControls: "Paraméterek megjelenítése/elrejtése",
    binomialToggleRates: "Kamatok",
    binomialToggleBonds: "Kötvényértékek",
    binomialRateTreeTitle: "Binomiális kamatlábfa",
    binomialBondPrice: "Zérókötvény ára",
    intuitionBinomialSpotTitle: "Kezdeti ár, strike és opciótípus",
    intuitionBinomialSpotSummary: "S₀ a mai részvényár; K a lejárati kötési ár.",
    intuitionBinomialSpotBody: "A call lejáratkor max(S − K, 0)-t, a put max(K − S, 0)-t fizet. S₀ az egész részvényfát skálázza; K az opció payoffját változtatja, nem a részvény útját. A modell európai opciót áraz: nincs korai lehívás. A köztes V értékek folytatási árak, a végső V értékek payoffok. Call és put váltáskor csak a szerződés kifizetése változik.",
    intuitionBinomialFactorsTitle: "Fel- és lefelé szorzók: u és d",
    intuitionBinomialFactorsSummary: "u és d egy teljes éves lépés árszorzói, nem hozamok.",
    intuitionBinomialFactorsBody: "u = 1,20 jelentése +20%, d = 0,85 jelentése −15% egy év alatt. A fa újra összefut, mert az up majd down és a down majd up ugyanazt az S₀ud árat adja. A szélesebb elágazás több szóródást jelent. A szorzókat itt közvetlenül választod: nem egy volatilitásból és zsugorodó időlépésből számoljuk őket. Változtatásuk az árazási q-t is módosítja; ellenőrizd a d < 1 + r < u feltételt.",
    intuitionBinomialDiscountTitle: "Kamat és egyperiódusos diszkontálás",
    intuitionBinomialDiscountSummary: "Az egyéves diszkontfaktor 1 / (1 + r).",
    intuitionBinomialDiscountBody: "r effektív éves kamat decimális alakban: 0,05 jelentése 5%, nem folytonosan kamatozó kamat. Részvénymódban ugyanaz a kamat adja a diszkontálást és a q árazási súlyt. Kamatmódban r₀ a kezdő rövid kamat, és később minden csomópont a saját kamatával diszkontál. Az összefoglaló faktor ezért csak a gyökér egyéves faktora, nem a teljes futamidő P(0,T) értéke.",
    intuitionBinomialHorizonTitle: "Lépésszám és futamidő",
    intuitionBinomialHorizonSummary: "Itt minden lépés egy év: N lépés N éves futamidő.",
    intuitionBinomialHorizonBody: "N növelése távolabbra helyezi az opció vagy zérókötvény lejáratát, és több lehetséges végállapotot ad. Nem rögzített futamidőt osztunk kisebb időlépésekre, ezért több lépés itt nem egyszerű pontossági beállítás és nem Black–Scholes-konvergenciateszt. A csomópont t címkéje eltelt éveket jelöl. Egy lépésnél a kamatfa jövőbeli elágazása még nem befolyásolja az egységnyi lejárati kifizetés árát.",
    intuitionBinomialRateProbabilityTitle: "A kamatfa árazási valószínűsége: q",
    intuitionBinomialRateProbabilitySummary: "Kamatmódban q-t közvetlenül adod meg, nem u, d és r számítja.",
    intuitionBinomialRateProbabilityBody: "q az emelkedő kamatág árazási súlya, 1 − q a csökkenőé. A csomóponti kötvényérték ezek súlyozott átlagának diszkontált értéke. Ez egy választott árazási modell, nem az emelkedő piaci kamatok előrejelzése vagy piaci görbére kalibrált valószínűség. Ne használd rá a részvényfa q = (1 + r − d)/(u − d) képletét. A 0 és 1 szélsőértékek egyetlen ágat súlyoznak.",
    intuitionBinomialRateStepTitle: "A kamatfa log-lépésköze: h",
    intuitionBinomialRateStepSummary: "A kamat lépésenként exp(h)-val vagy exp(−h)-val szorzódik.",
    intuitionBinomialRateStepBody: "h nem százalékpontos kamatváltozás. h = 0,18 körülbelül 1,197 és 0,835 szorzót ad a csomópont rövid kamatára. Nagyobb h szélesebb kamatelágazást okoz, q változatlan marad. A kötvény ára a későbbi csomópontok eltérő diszkontálásán keresztül reagál. Ha r₀ = 0, a szorzás miatt minden kamat nulla marad, h értékétől függetlenül. Ez a h nem a Heston időlépése.",
    binomialToggleStocks: "Részvényárak",
    binomialToggleValues: "Opcióértékek",

    binomialExplanationTitle: "Intuíció",
    binomialExplanationSubtitle: "Mit mutat ez a modell?",
    binomialExplanationP1:
      "Ebben a binomiális modellben minden időlépésben a részvényár kétféleképpen változhat: vagy megszorzódik u-val, vagy d-vel.",
    binomialExplanationP2:
      "A modellben minden periódus 1 év. A kockázatsemleges valószínűség: q = (1 + r - d) / (u - d).",
    binomialExplanationP3:
      "Először a fa legvégén kiszámoljuk a payoffot, például call opciónál max(S - K, 0). Ezután visszafelé haladunk, és minden csomópontban a következő két lehetséges érték diszkontált várható értékét vesszük.",
    binomialExplanationP4:
      "Klasszikus arbitrázsmentes helyzetben teljesül, hogy d < 1 + r < u, ekkor a q valóban 0 és 1 közé esik.",
    binomialExplanationP5:
      "A gyökércsomópontban az opció értéke egy replikáló portfólióval is előállítható: egy megfelelő számú részvény és egy kötvénypozíció együtt ugyanazt a kifizetést adja, mint az opció a következő lépés két lehetséges állapotában.",

    binomialTreeTitle: "Binomiális árazási fa",
    binomialTreeSubtitle: "A részvényárak és az opcióértékek diszkrét modellje",

    binomialOptionCall: "Call",
    binomialOptionPut: "Put",
    binomialS0Label: "S₀ (kezdeti ár)",
    binomialKLabel: "K (strike)",
    binomialULabel: "u (up factor)",
    binomialDLabel: "d (down factor)",
    binomialRLabel: "r (éves kamat)",
    binomialStepsLabel: "Lépések száma",
    binomialStepsUnit: "db",
    binomialPeriodLength: "Periódushossz",
    binomialPeriodValue: "Δt = 1 év",
    binomialSteps: "Lépésszám",

    binomialSummaryTitle: "Összefoglaló",
    binomialSummarySubtitle: "A modell fő mennyiségei",
    binomialWarningTitle: "Figyelmeztetés",
    binomialPrice: "Opció ára",
    binomialReplicatingPortfolio: "Gyökérbeli replikáló portfólió",
    binomialStockPosition: "Részvény",
    binomialCashPosition: "Cash",
    binomialDiscountFactor: "Diszkont faktor",

    binomialValidationInvalidParameters:
      "A modell paraméterei nem adnak értelmes numerikus eredményt.",
    binomialValidationUGreaterThanD:
      "A modellhez szükséges, hogy u > d legyen.",
    binomialValidationDPositive:
      "A lefelé szorzóhoz szükséges, hogy d > 0 legyen.",
    binomialValidationRatePositiveOnePlusR:
      "A kamatlábhoz szükséges, hogy 1 + r pozitív maradjon.",
    binomialValidationQNotComputable:
      "A q nem számolható ki, mert u és d nem különböznek.",
    binomialValidationQOutOfRange:
      "A kockázatsemleges valószínűség nem esik 0 és 1 közé. Klasszikus arbitrázsmentes esetben d < 1 + r < u.",
}
