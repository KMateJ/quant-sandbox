import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const performanceMeasures: GuideLessonContent = {
  en: [
    p("A fund that returned 14% last year did better than one that returned 9%, unless it took far more risk to get there. This lesson turns that intuition into numbers. It uses the capital market line from \"The efficient frontier and the capital market line\" and beta and the security market line from \"CAPM, beta and the security market line\" to build four standard measures of risk-adjusted performance, and shows why they can rank the same funds in different orders."),

    h("Excess return"),
    p("Every measure starts from the **excess return** $\\mu - r_f$: what a portfolio earned above the risk-free rate, the reward for bearing risk at all. The measures differ in what they divide it by or compare it with, that is, in which risk they charge for. Throughout, $\\mu$, $\\sigma$ and $\\beta$ are one-year averages estimated from past returns, and the market index has $\\mu_M$ and $\\sigma_M$."),

    h("The Sharpe ratio"),
    p("The **Sharpe ratio** divides the excess return by total volatility:"),
    eq("\\text{SR} = \\frac{\\mu - r_f}{\\sigma}."),
    p("In the $(\\sigma, \\mu)$ plane it is the slope of the line from the risk-free point to the portfolio. A portfolio steeper than the capital market line, whose slope is the market's Sharpe ratio, beat the market per unit of total risk. Total risk is the right yardstick when the portfolio is all the investor holds."),

    h("M²"),
    p("A Sharpe ratio of 0.44 is hard to feel. **M²** (Modigliani squared) translates it into a return. Mix the portfolio with the risk-free asset until its volatility equals the market's $\\sigma_M$; the expected return of that mix minus the market's is"),
    eq("M^2 = r_f + \\text{SR}\\,\\sigma_M - \\mu_M."),
    p("It ranks portfolios exactly as the Sharpe ratio does, but in percentage points of return at market risk."),

    h("The Treynor ratio"),
    p("An investor who already holds a well-diversified portfolio cares about a fund's contribution to that portfolio's risk, which is its beta, not its total volatility. The **Treynor ratio** divides the excess return by beta:"),
    eq("\\text{TR} = \\frac{\\mu - r_f}{\\beta}."),
    p("In the $(\\beta, \\mu)$ plane it is the slope from the risk-free point to the fund. The market itself has $\\beta = 1$, so its Treynor ratio is the market risk premium $\\mu_M - r_f$; a fund above that beat the market per unit of systematic risk."),

    h("Jensen's alpha"),
    p("**Jensen's alpha** measures the same comparison as a return: how far the fund lies above the security market line,"),
    eq("\\alpha = \\mu - \\big[r_f + \\beta\\,(\\mu_M - r_f)\\big]."),
    p("The bracket is the return the CAPM requires for the fund's beta, so $\\alpha$ is the return earned beyond what its systematic risk justifies. A fund with positive alpha also has a Treynor ratio above the market's, so the two always agree on whether a fund beat the market, and here they rank the funds identically."),

    {
      kind: "check",
      id: "performance-measures/alpha",
      prompt: "With $r_f = 3\\%$ and $\\mu_M = 10\\%$, a fund with $\\beta = 1.4$ earned $\\mu = 13\\%$. What is its Jensen's alpha? Answer in percent.",
      answer: { type: "number", value: 0.2, tolerance: 0.02, unit: "%" },
      explain: "The CAPM requires $3\\% + 1.4 \\times 7\\% = 12.8\\%$ for that beta, so $\\alpha = 13\\% - 12.8\\% = 0.2\\%$. A high return can come mostly from a high beta.",
    },

    h("Tracking error and the information ratio"),
    p("Alpha does not say how much risk was taken to get it. Write the fund's return as $\\beta$ times the market's plus an unrelated residual $\\varepsilon$, as in the single-index view of the CAPM lesson. The residual's volatility is the **tracking error** against the beta-matched index:"),
    eq("\\sigma(\\varepsilon) = \\sqrt{\\sigma^2 - \\beta^2 \\sigma_M^2}."),
    p("The **information ratio** divides alpha by it, $\\text{IR} = \\alpha / \\sigma(\\varepsilon)$: abnormal return per unit of the risk taken by deviating from the index. It matters when a fund is judged against a benchmark, and it decides how much weight an actively managed fund deserves next to an index fund."),
    note("Sharpe and M² charge for total risk, Treynor and alpha for systematic risk, the information ratio for active (residual) risk. Which one is right depends on what else the investor holds."),

    h("Worked example"),
    p("Take four made-up funds, a market index with $\\mu_M = 10\\%$ and $\\sigma_M = 18\\%$, and $r_f = 3\\%$:"),
    list(
      "A: $\\mu = 12\\%$, $\\sigma = 24\\%$, $\\beta = 1.20$.",
      "B: $\\mu = 9\\%$, $\\sigma = 12\\%$, $\\beta = 0.60$.",
      "C: $\\mu = 14\\%$, $\\sigma = 30\\%$, $\\beta = 1.05$.",
      "D: $\\mu = 11\\%$, $\\sigma = 18\\%$, $\\beta = 0.95$.",
    ),
    p("The market's Sharpe ratio is $0.07/0.18 \\approx 0.389$ and its Treynor ratio is 7%. For fund C,"),
    eq("\\text{SR}_C = \\frac{0.11}{0.30} \\approx 0.367, \\qquad \\text{TR}_C = \\frac{0.11}{1.05} \\approx 10.48\\%, \\qquad \\alpha_C = 14\\% - (3\\% + 1.05 \\times 7\\%) = 3.65\\%,"),
    p("and its residual risk is $\\sqrt{0.09 - 1.05^2 \\times 0.0324} \\approx 23.3\\%$, so $\\text{IR}_C \\approx 0.0365/0.233 \\approx 0.157$. Fund B, the quiet one, has $\\text{SR}_B = 0.06/0.12 = 0.5$, $\\alpha_B = 9\\% - (3\\% + 0.6 \\times 7\\%) = 1.8\\%$, residual risk $\\sqrt{0.0144 - 0.36 \\times 0.0324} \\approx 5.23\\%$ and $\\text{IR}_B \\approx 0.344$. Doing the same for all four gives these rankings:"),
    list(
      "Sharpe (and M²): B 0.500, D 0.444, A 0.375, C 0.367.",
      "Treynor and alpha: C (10.48%, 3.65%), B (10.00%, 1.80%), D (8.42%, 1.35%), A (7.50%, 0.60%).",
      "Information ratio: B 0.344, D 0.240, C 0.157, A 0.057.",
    ),

    p("Now rate a fifth fund E with $\\mu = 10\\%$, $\\sigma = 16\\%$ and $\\beta = 0.70$ against the same market."),
    {
      kind: "worked",
      title: "All measures for fund E",
      steps: [
        { text: "Sharpe ratio.", tex: "\\text{SR}_E = \\frac{\\mu_E - r_f}{\\sigma_E}", result: { value: 0.4375, tolerance: 0.001 } },
        { text: "Treynor ratio.", tex: "\\text{TR}_E = \\frac{\\mu_E - r_f}{\\beta_E}", result: { value: 10, tolerance: 0.01, unit: "%" } },
        { text: "Jensen's alpha.", tex: "\\alpha_E = \\mu_E - \\big[r_f + \\beta_E(\\mu_M - r_f)\\big]", result: { value: 2.1, tolerance: 0.01, unit: "%" } },
        { text: "Residual risk (tracking error).", tex: "\\sigma(\\varepsilon_E) = \\sqrt{\\sigma_E^2 - \\beta_E^2\\sigma_M^2}", result: { value: 9.86, tolerance: 0.01, unit: "%" } },
        { text: "Information ratio.", tex: "\\text{IR}_E = \\alpha_E/\\sigma(\\varepsilon_E)", result: { value: 0.213, tolerance: 0.002 } },
        { text: "M², the return at market risk minus the market's.", tex: "M^2_E = r_f + \\text{SR}_E\\,\\sigma_M - \\mu_M", result: { value: 0.875, tolerance: 0.005, unit: "%" } },
      ],
    },
    p("E's alpha of 2.1% is second only to C's, its Sharpe ratio would place it just below D, and its information ratio below both B and D: the same fund looks good or average depending on the yardstick."),

    h("Why the rankings disagree"),
    p("Fund C has the highest alpha, yet the lowest Sharpe ratio, below the market's ($M^2_C \\approx -0.40\\%$). Most of its 30% volatility is residual risk. Held on its own, all of that risk lands on the investor, and per unit of total risk C did worse than an index fund. Held as a small slice of a large diversified portfolio, its residual risk mostly cancels against other holdings, only its beta matters, and its 3.65% alpha is a real gain. B is the opposite: a modest alpha with very little residual risk, which gives it the best Sharpe and information ratios."),
    p("The rule of thumb follows. Judge a portfolio that is the investor's whole wealth by the Sharpe ratio or M². Judge one holding among many by the Treynor ratio or alpha. Judge an active manager measured against a benchmark by the information ratio."),
    p("The figure lists the four funds and the market. Click a measure's column header to rank by it and watch the rows reorder. The scatter next to the table switches to the axes where that measure is visible: $(\\sigma, \\mu)$ with the capital market line for Sharpe, $(\\beta, \\mu)$ with the security market line for Treynor and alpha, and residual risk against alpha for the information ratio. Hover over a fund to draw its measure as a slope or, for alpha, as the vertical distance to the line. Compare fund C under Sharpe and under alpha."),
    figure("performance-ranking"),

    {
      kind: "check",
      id: "performance-measures/which-measure",
      prompt: "A fund will be a small slice of a large, well-diversified pension portfolio. Which measure should decide whether to add it?",
      answer: {
        type: "choice",
        options: [
          "The Treynor ratio or Jensen's alpha",
          "The Sharpe ratio",
          "The information ratio against the fund's own benchmark",
          "The raw average return",
        ],
        correct: 0,
      },
      explain: "Inside a diversified portfolio the fund's residual risk mostly cancels, so only its systematic risk, beta, matters: the Treynor ratio or alpha. The Sharpe ratio fits a portfolio that is the investor's whole wealth.",
    },

    h("Limits of the measures"),
    p("All four are estimates from a few years of data and carry large sampling error: an alpha of 2% a year with 10% residual risk needs decades of data before it is statistically distinguishable from zero. Beta and alpha also depend on which index is used as the market. And funds that did badly tend to close and drop out of databases, so the surviving funds look better than the average fund was."),

    h("Summary"),
    list(
      "Every measure starts from the excess return $\\mu - r_f$ and charges for a particular kind of risk.",
      "Sharpe $(\\mu - r_f)/\\sigma$ and M² use total risk: right for a portfolio held on its own.",
      "Treynor $(\\mu - r_f)/\\beta$ and Jensen's alpha use systematic risk: right for one holding in a diversified portfolio.",
      "The information ratio $\\alpha/\\sigma(\\varepsilon)$ prices the active risk taken against a benchmark.",
      "A fund with high alpha and high residual risk can rank first by one measure and last by another.",
    ),
    note("The next lesson, \"Factor models and systematic risk\", replaces the single market factor with several and splits a portfolio's variance into systematic and specific parts."),
    lab("/capm", "Place assets against the security market line and read off their betas and alphas in the CAPM lab"),
  ],

  hu: [
    p("Egy alap, amely tavaly 14%-ot hozott, jobban teljesített annál, amelyik 9%-ot, hacsak nem vállalt ehhez sokkal nagyobb kockázatot. Ez a lecke számokká alakítja ezt a megérzést. A „Hatékony front és tőkepiaci egyenes” tőkepiaci egyenesére, valamint a „CAPM, béta és az értékpapír-piaci egyenes” bétájára és értékpapír-piaci egyenesére építve négy szokásos, kockázattal korrigált teljesítménymutatót vezet be, és megmutatja, miért rangsorolhatják ugyanazokat az alapokat eltérő sorrendben."),

    h("Többlethozam"),
    p("Minden mutató a $\\mu - r_f$ **többlethozamból** indul: abból, amennyit a portfólió a kockázatmentes kamat fölött keresett, vagyis a kockázatvállalás jutalmából. A mutatók abban térnek el, hogy mivel osztják vagy mivel vetik össze, azaz hogy melyik kockázatért számolnak fel árat. A leckében $\\mu$, $\\sigma$ és $\\beta$ múltbeli hozamokból becsült egyéves átlagok, a piaci index jellemzői pedig $\\mu_M$ és $\\sigma_M$."),

    h("A Sharpe-ráta"),
    p("A **Sharpe-ráta** a többlethozamot a teljes szórással osztja:"),
    eq("\\text{SR} = \\frac{\\mu - r_f}{\\sigma}."),
    p("A $(\\sigma, \\mu)$ síkon ez a kockázatmentes pontból a portfólióba húzott egyenes meredeksége. Ha egy portfólió meredekebb a tőkepiaci egyenesnél, amelynek meredeksége a piac Sharpe-rátája, akkor teljes kockázategységre vetítve legyőzte a piacot. A teljes kockázat akkor a helyes mérce, ha a befektető csak ezt a portfóliót tartja."),

    h("M²"),
    p("Egy 0,44-es Sharpe-rátát nehéz átérezni. Az **M²** (Modigliani a négyzeten) hozammá fordítja. Keverjük a portfóliót a kockázatmentes eszközzel, amíg a szórása meg nem egyezik a piac $\\sigma_M$ szórásával; ennek a keveréknek a várható hozama mínusz a piacé:"),
    eq("M^2 = r_f + \\text{SR}\\,\\sigma_M - \\mu_M."),
    p("Pontosan úgy rangsorol, mint a Sharpe-ráta, csak piaci kockázat mellett elért hozam-százalékpontban."),

    h("A Treynor-ráta"),
    p("Aki már jól diverzifikált portfóliót tart, annak egy alapnál az számít, mennyivel járul hozzá a portfólió kockázatához, ez pedig a bétája, nem a teljes szórása. A **Treynor-ráta** a többlethozamot a bétával osztja:"),
    eq("\\text{TR} = \\frac{\\mu - r_f}{\\beta}."),
    p("A $(\\beta, \\mu)$ síkon ez a kockázatmentes pontból az alapba húzott egyenes meredeksége. Magára a piacra $\\beta = 1$, így Treynor-rátája a $\\mu_M - r_f$ piaci kockázati prémium; az ennél nagyobb értékű alap szisztematikus kockázategységre vetítve legyőzte a piacot."),

    h("Jensen-alfa"),
    p("A **Jensen-alfa** ugyanezt az összevetést hozamként fejezi ki: megmutatja, milyen messze van az alap az értékpapír-piaci egyenes fölött,"),
    eq("\\alpha = \\mu - \\big[r_f + \\beta\\,(\\mu_M - r_f)\\big]."),
    p("A zárójelben az a hozam áll, amelyet a CAPM az alap bétájához megkövetel, így $\\alpha$ a szisztematikus kockázat által indokolt hozamon felül elért többlet. A pozitív alfájú alap Treynor-rátája egyben a piacénál nagyobb, így a két mutató mindig egyetért abban, hogy egy alap legyőzte-e a piacot, és itt ugyanabban a sorrendben is rangsorolják az alapokat."),

    {
      kind: "check",
      id: "performance-measures/alpha",
      prompt: "$r_f = 3\\%$ és $\\mu_M = 10\\%$ mellett egy $\\beta = 1{,}4$ bétájú alap $\\mu = 13\\%$-ot hozott. Mekkora a Jensen-alfája? A választ százalékban add meg.",
      answer: { type: "number", value: 0.2, tolerance: 0.02, unit: "%" },
      explain: "A CAPM ehhez a bétához $3\\% + 1{,}4 \\times 7\\% = 12{,}8\\%$-ot vár el, így $\\alpha = 13\\% - 12{,}8\\% = 0{,}2\\%$. A magas hozam nagyrészt a magas bétából is fakadhat.",
    },

    h("Követési hiba és információs ráta"),
    p("Az alfa nem árulja el, mekkora kockázattal érték el. Írjuk az alap hozamát a piaci hozam $\\beta$-szorosának és egy attól független $\\varepsilon$ maradéknak az összegeként, ahogy a CAPM-lecke egyindexes szemlélete teszi. A maradék szórása a bétához igazított indexhez mért **követési hiba**:"),
    eq("\\sigma(\\varepsilon) = \\sqrt{\\sigma^2 - \\beta^2 \\sigma_M^2}."),
    p("Az **információs ráta** az alfát ezzel osztja, $\\text{IR} = \\alpha / \\sigma(\\varepsilon)$: ez az indextől való eltéréssel vállalt kockázat egységére jutó többlethozam. Akkor számít, ha egy alapot egy referenciaindexhez mérnek, és ez dönti el, mekkora súlyt érdemel egy aktívan kezelt alap egy indexalap mellett."),
    note("A Sharpe-ráta és az M² a teljes kockázatért, a Treynor-ráta és az alfa a szisztematikus kockázatért, az információs ráta az aktív (egyedi) kockázatért számol fel árat. Hogy melyik a helyes, azon múlik, mit tart még a befektető."),

    h("Számpélda"),
    p("Vegyünk négy kitalált alapot, egy $\\mu_M = 10\\%$ és $\\sigma_M = 18\\%$ jellemzőjű piaci indexet, és legyen $r_f = 3\\%$:"),
    list(
      "A: $\\mu = 12\\%$, $\\sigma = 24\\%$, $\\beta = 1{,}20$.",
      "B: $\\mu = 9\\%$, $\\sigma = 12\\%$, $\\beta = 0{,}60$.",
      "C: $\\mu = 14\\%$, $\\sigma = 30\\%$, $\\beta = 1{,}05$.",
      "D: $\\mu = 11\\%$, $\\sigma = 18\\%$, $\\beta = 0{,}95$.",
    ),
    p("A piac Sharpe-rátája $0{,}07/0{,}18 \\approx 0{,}389$, Treynor-rátája 7%. A C alapra"),
    eq("\\text{SR}_C = \\frac{0{,}11}{0{,}30} \\approx 0{,}367, \\qquad \\text{TR}_C = \\frac{0{,}11}{1{,}05} \\approx 10{,}48\\%, \\qquad \\alpha_C = 14\\% - (3\\% + 1{,}05 \\times 7\\%) = 3{,}65\\%,"),
    p("az egyedi kockázata $\\sqrt{0{,}09 - 1{,}05^2 \\times 0{,}0324} \\approx 23{,}3\\%$, így $\\text{IR}_C \\approx 0{,}0365/0{,}233 \\approx 0{,}157$. A csendes B alapra $\\text{SR}_B = 0{,}06/0{,}12 = 0{,}5$, $\\alpha_B = 9\\% - (3\\% + 0{,}6 \\times 7\\%) = 1{,}8\\%$, az egyedi kockázat $\\sqrt{0{,}0144 - 0{,}36 \\times 0{,}0324} \\approx 5{,}23\\%$, és $\\text{IR}_B \\approx 0{,}344$. Mind a négy alapra elvégezve ugyanezt, ezek a rangsorok adódnak:"),
    list(
      "Sharpe (és M²): B 0,500, D 0,444, A 0,375, C 0,367.",
      "Treynor és alfa: C (10,48%, 3,65%), B (10,00%, 1,80%), D (8,42%, 1,35%), A (7,50%, 0,60%).",
      "Információs ráta: B 0,344, D 0,240, C 0,157, A 0,057.",
    ),

    p("Most értékeljünk egy ötödik, E alapot, $\\mu = 10\\%$, $\\sigma = 16\\%$ és $\\beta = 0{,}70$ értékekkel, ugyanazzal a piaccal szemben."),
    {
      kind: "worked",
      title: "Az összes mutató az E alapra",
      steps: [
        { text: "Sharpe-ráta.", tex: "\\text{SR}_E = \\frac{\\mu_E - r_f}{\\sigma_E}", result: { value: 0.4375, tolerance: 0.001 } },
        { text: "Treynor-ráta.", tex: "\\text{TR}_E = \\frac{\\mu_E - r_f}{\\beta_E}", result: { value: 10, tolerance: 0.01, unit: "%" } },
        { text: "Jensen-alfa.", tex: "\\alpha_E = \\mu_E - \\big[r_f + \\beta_E(\\mu_M - r_f)\\big]", result: { value: 2.1, tolerance: 0.01, unit: "%" } },
        { text: "Reziduális kockázat (követési hiba).", tex: "\\sigma(\\varepsilon_E) = \\sqrt{\\sigma_E^2 - \\beta_E^2\\sigma_M^2}", result: { value: 9.86, tolerance: 0.01, unit: "%" } },
        { text: "Információs ráta.", tex: "\\text{IR}_E = \\alpha_E/\\sigma(\\varepsilon_E)", result: { value: 0.213, tolerance: 0.002 } },
        { text: "M², a piaci kockázat melletti hozam mínusz a piacé.", tex: "M^2_E = r_f + \\text{SR}_E\\,\\sigma_M - \\mu_M", result: { value: 0.875, tolerance: 0.005, unit: "%" } },
      ],
    },
    p("E 2,1%-os alfája csak C-é mögött marad, a Sharpe-rátája épp D alá sorolná, az információs rátája pedig B és D alatt van: ugyanaz az alap a mércétől függően jónak vagy átlagosnak látszik."),

    h("Miért térnek el a rangsorok"),
    p("A C alapnak a legnagyobb az alfája, mégis a legkisebb a Sharpe-rátája, kisebb a piacénál is ($M^2_C \\approx -0{,}40\\%$). 30%-os szórásának nagy része egyedi kockázat. Ha önmagában tartják, ez a kockázat teljes egészében a befektetőt terheli, és teljes kockázategységre vetítve C rosszabbul teljesített egy indexalapnál. Ha egy nagy, diverzifikált portfólió kis szeleteként tartják, egyedi kockázata a többi befektetéssel szemben nagyrészt kioltódik, csak a bétája számít, és 3,65%-os alfája valódi nyereség. B ennek az ellentéte: szerény alfa nagyon kis egyedi kockázattal, ami a legjobb Sharpe- és információs rátát adja neki."),
    p("Ebből adódik az ökölszabály. Ha a portfólió a befektető teljes vagyona, a Sharpe-rátával vagy az M²-tel érdemes megítélni. Ha sok befektetés egyike, a Treynor-rátával vagy az alfával. Ha egy aktív alapkezelőt egy referenciaindexhez mérnek, az információs rátával."),
    p("Az ábra a négy alapot és a piacot sorolja fel. Kattints egy mutató oszlopfejlécére a szerinte való rangsoroláshoz, és figyeld, ahogy a sorok átrendeződnek. A táblázat melletti szórásdiagram arra a tengelypárra vált, amelyen az adott mutató látható: a $(\\sigma, \\mu)$ síkra a tőkepiaci egyenessel a Sharpe-rátánál, a $(\\beta, \\mu)$ síkra az értékpapír-piaci egyenessel a Treynor-rátánál és az alfánál, az információs rátánál pedig az egyedi kockázat–alfa síkra. Vidd az egeret egy alapra, és a mutatója meredekségként, az alfa esetén pedig az egyenestől mért függőleges távolságként jelenik meg. Hasonlítsd össze a C alapot a Sharpe-ráta és az alfa szerint."),
    figure("performance-ranking"),

    {
      kind: "check",
      id: "performance-measures/which-measure",
      prompt: "Egy alap egy nagy, jól diverzifikált nyugdíjportfólió kis szelete lesz. Melyik mutató döntsön arról, hogy bekerüljön-e?",
      answer: {
        type: "choice",
        options: [
          "A Treynor-ráta vagy a Jensen-alfa",
          "A Sharpe-ráta",
          "Az alap saját benchmarkjához mért információs ráta",
          "A nyers átlaghozam",
        ],
        correct: 0,
      },
      explain: "Egy diverzifikált portfólióban az alap reziduális kockázata nagyrészt kiesik, így csak a szisztematikus kockázata, a béta számít: a Treynor-ráta vagy az alfa. A Sharpe-ráta olyan portfólióhoz illik, amely a befektető teljes vagyona.",
    },

    h("A mutatók korlátai"),
    p("Mind a négy mutató néhány év adataiból becsült érték, nagy mintavételi hibával: egy évi 2%-os alfa 10%-os egyedi kockázat mellett évtizedes adatsort igényel, mire statisztikailag megkülönböztethető a nullától. A béta és az alfa attól is függ, melyik indexet tekintjük piacnak. A rosszul teljesítő alapok pedig hajlamosak megszűnni és eltűnni az adatbázisokból, így a megmaradt alapok jobbnak tűnnek, mint amilyen az átlagos alap volt."),

    h("Összefoglalás"),
    list(
      "Minden mutató a $\\mu - r_f$ többlethozamból indul, és egy bizonyos fajta kockázatért számol fel árat.",
      "A $(\\mu - r_f)/\\sigma$ Sharpe-ráta és az M² a teljes kockázatot használja: önmagában tartott portfólióhoz illik.",
      "A $(\\mu - r_f)/\\beta$ Treynor-ráta és a Jensen-alfa a szisztematikus kockázatot használja: egy diverzifikált portfólió egyik eleméhez illik.",
      "Az $\\alpha/\\sigma(\\varepsilon)$ információs ráta a referenciaindexhez képest vállalt aktív kockázatot árazza.",
      "Egy nagy alfájú, de nagy egyedi kockázatú alap az egyik mutató szerint első, egy másik szerint utolsó lehet.",
    ),
    note("A következő lecke, a „Faktormodellek és szisztematikus kockázat”, az egyetlen piaci faktort több faktorra cseréli, és a portfólió varianciáját szisztematikus és egyedi részre bontja."),
    lab("/capm", "Helyezd el az eszközöket az értékpapír-piaci egyeneshez képest, és olvasd le a bétájukat és alfájukat a CAPM laborban"),
  ],
};
