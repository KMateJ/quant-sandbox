import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const riskAversion: GuideLessonContent = {
  en: [
    p("The lesson \"The efficient frontier and the capital market line\" ended with a single line of portfolios: every investor should hold the same risky portfolio P and mix it with the risk-free asset. It did not say how much of P to hold. That depends on the investor, not on the market. This lesson describes an investor's attitude to risk with one number, the risk-aversion coefficient, and uses it to find the best point on the line."),

    h("The choice left open"),
    p("Put a fraction $y$ of the capital in P and $1 - y$ in the risk-free asset with return $r_f$. As in the previous lesson, the resulting **complete portfolio** has"),
    eq("\\mu = r_f + y\\,(\\mu_P - r_f), \\qquad \\sigma = y\\,\\sigma_P."),
    p("Every value of $y$ is a point on the capital allocation line. A cautious investor picks a small $y$, a bold one a large $y$, and $y > 1$ means borrowing at $r_f$ to invest more than the own capital in P. To compare the points we need a rule that weighs expected return against risk."),

    h("Mean–variance utility"),
    p("The standard rule assigns each portfolio a score, its **utility**,"),
    eq("U = \\mu - \\tfrac{1}{2} A\\,\\sigma^2,"),
    p("with rates written as decimals. The **risk-aversion coefficient** $A$ says how heavily the investor penalises variance. With $A > 0$ the investor is risk-averse: of two portfolios with the same $\\mu$, the one with the lower $\\sigma$ scores higher. With $A = 0$ only the expected return matters (risk neutrality). Values between about 2 and 6 are typical for the way people actually invest."),
    p("Example: the risky portfolio has $\\mu_P = 11\\%$ and $\\sigma_P = 20\\%$. For an investor with $A = 4$,"),
    eq("U_P = 0.11 - \\tfrac{1}{2}\\times 4 \\times 0.20^2 = 0.11 - 0.08 = 0.03."),

    h("Certainty equivalent"),
    p("A risk-free investment has $\\sigma = 0$, so its utility is just its return. The utility of any portfolio can therefore be read as a rate: the **certainty equivalent**, the sure return that the investor finds exactly as attractive as the risky portfolio. In the example the investor values P like a sure 3%. If the risk-free rate is $r_f = 3\\%$, holding only P and holding only bills are equally good for this investor."),

    {
      kind: "check",
      id: "risk-aversion/certainty-equivalent",
      prompt: "A portfolio has $\\mu = 9\\%$ and $\\sigma = 15\\%$. What is its certainty equivalent for an investor with $A = 4$? Answer in percent.",
      answer: { type: "number", value: 4.5, tolerance: 0.05, unit: "%" },
      explain: "$U = 0.09 - \\tfrac{1}{2}\\times 4 \\times 0.15^2 = 0.09 - 0.045 = 4.5\\%$: the investor values the portfolio like a sure 4.5%.",
    },

    h("Indifference curves"),
    p("All portfolios with the same utility $U$ satisfy"),
    eq("\\mu = U + \\tfrac{1}{2} A\\,\\sigma^2."),
    p("In the $(\\sigma, \\mu)$ plane this is an upward-curving parabola, an **indifference curve**: the investor does not care which point on it they hold. Each extra unit of risk must be paid for with more expected return, and the price rises with $\\sigma$. Curves further up mean higher utility. A larger $A$ makes the curves steeper, because a more risk-averse investor demands more compensation for the same risk."),

    h("The optimal complete portfolio"),
    p("Substituting the complete portfolio into the utility gives a function of $y$ alone:"),
    eq("U(y) = r_f + y\\,(\\mu_P - r_f) - \\tfrac{1}{2} A\\,\\sigma_P^2\\, y^2."),
    p("It is a downward-opening parabola in $y$. Setting the derivative $(\\mu_P - r_f) - A\\sigma_P^2\\, y$ to zero gives"),
    eq("y^{*} = \\frac{\\mu_P - r_f}{A\\,\\sigma_P^2}, \\qquad U^{*} = r_f + \\frac{\\text{SR}_P^2}{2A},"),
    p("where $\\text{SR}_P = (\\mu_P - r_f)/\\sigma_P$ is the Sharpe ratio. Geometrically, $y^*$ is where an indifference curve just touches the capital allocation line: higher curves miss the line, lower ones cut it in two points that are both worse."),
    note("The optimal weight in the risky portfolio is $y^{*} = (\\mu_P - r_f)/(A\\sigma_P^2)$: proportional to its excess return, inversely proportional to its variance and to the investor's risk aversion."),

    {
      kind: "check",
      id: "risk-aversion/double-a",
      prompt: "An investor's optimal weight in the risky portfolio is $y^{*} = 0.6$. Their risk aversion doubles while the market stays the same. What is the new optimal weight?",
      answer: {
        type: "choice",
        options: [
          "0.3: $y^{*}$ is inversely proportional to $A$",
          "0.15: risk enters squared",
          "0.6: the tangency portfolio does not change",
          "1.2: a more cautious investor needs more return",
        ],
        correct: 0,
      },
      explain: "$y^{*} = (\\mu_P - r_f)/(A\\sigma_P^2)$ is proportional to $1/A$, so doubling $A$ halves it. The risky portfolio itself stays the same; only the amount held changes.",
    },

    h("Worked example"),
    p("Take $\\mu_P = 11\\%$, $\\sigma_P = 20\\%$, $r_f = 3\\%$ and $A = 4$. Then"),
    eq("y^{*} = \\frac{0.08}{4 \\times 0.04} = 0.5, \\qquad \\mu = 3\\% + 0.5 \\times 8\\% = 7\\%, \\qquad \\sigma = 0.5 \\times 20\\% = 10\\%,"),
    p("and $U^{*} = 0.07 - \\tfrac{1}{2}\\times 4 \\times 0.01 = 5\\%$. Holding only bills or only P each gives a certainty equivalent of 3%, so the half-and-half mix is clearly better than either end. A more risk-averse investor with $A = 8$ holds $y^* = 0.25$ (expected return 5%, volatility 5%); one with $A = 2$ holds exactly P ($y^* = 1$)."),

    p("A second investor faces a different market, $\\mu_P = 10\\%$, $\\sigma_P = 25\\%$ and $r_f = 2\\%$, and has $A = 3$."),
    {
      kind: "worked",
      title: "Optimal complete portfolio for a second investor",
      steps: [
        { text: "Optimal weight in the risky portfolio.", tex: "y^{*} = \\frac{\\mu_P - r_f}{A\\,\\sigma_P^2}", result: { value: 0.4267, tolerance: 0.0005 } },
        { text: "Expected return of the complete portfolio.", tex: "\\mu = r_f + y^{*}(\\mu_P - r_f)", result: { value: 5.413, tolerance: 0.005, unit: "%" } },
        { text: "Its volatility.", tex: "\\sigma = y^{*}\\sigma_P", result: { value: 10.67, tolerance: 0.01, unit: "%" } },
        { text: "Its utility, through the Sharpe ratio $\\text{SR}_P = 0.32$.", tex: "U^{*} = r_f + \\frac{\\text{SR}_P^2}{2A}", result: { value: 3.707, tolerance: 0.005, unit: "%" } },
      ],
    },

    h("Borrowing"),
    p("The optimal weight exceeds one when $A < (\\mu_P - r_f)/\\sigma_P^2$, here when $A < 2$. With $A = 1.6$ the investor wants $y^* = 0.08/(1.6 \\times 0.04) = 1.25$: borrow a quarter of the own capital at $r_f$ and invest 125% in P, for an expected return of 13% and a volatility of 25%. In practice investors borrow at a higher rate than they lend, which bends the line downwards beyond P and lowers the optimal borrowing."),
    p("The figure draws the capital allocation line for the example. Drag the point along it to choose $y$; the curve through that point is the indifference curve you are on, and the dashed curve belongs to the optimum. Start at P, where the two curves are far apart, and drag towards the risk-free end: utility rises until the point snaps onto the optimum at $y = 0.5$, then falls again. Switch $A$ and note that the optimum moves while the line stays the same."),
    figure("utility-indifference"),

    h("Separation of the two decisions"),
    p("The result splits the investment problem in two. Which risky portfolio to hold depends only on the market (expected returns, volatilities, correlations): every mean–variance investor picks the tangency portfolio. How much of it to hold depends only on the investor's $A$. This is the **two-fund separation** result: any optimal portfolio is a mix of the same two funds, the risk-free asset and P."),

    h("Summary"),
    list(
      "Mean–variance utility $U = \\mu - \\tfrac{1}{2}A\\sigma^2$ scores a portfolio; $A$ measures risk aversion.",
      "A portfolio's utility is its certainty equivalent: the sure return the investor finds equally attractive.",
      "Indifference curves $\\mu = U + \\tfrac{1}{2}A\\sigma^2$ are parabolas, steeper for larger $A$.",
      "The best complete portfolio holds $y^* = (\\mu_P - r_f)/(A\\sigma_P^2)$ in P; $y^* > 1$ means borrowing.",
      "Everyone holds the same risky portfolio; only the split between it and the risk-free asset differs.",
    ),
    note("The next lesson, \"CAPM, beta and the security market line\", asks what happens to prices when every investor holds the same risky portfolio."),
    lab("/risk-return", "Combine a risky asset with the risk-free rate and move along the capital allocation line in the Risk & Return lab"),
  ],

  hu: [
    p("A „Hatékony front és tőkepiaci egyenes” című lecke egyetlen egyenessel zárult: minden befektetőnek ugyanazt a P kockázatos portfóliót érdemes tartania, és ezt kell kevernie a kockázatmentes eszközzel. Azt viszont nem mondta meg, mennyit tartson P-ből. Ez a befektetőn múlik, nem a piacon. Ez a lecke egyetlen számmal, a kockázatkerülési együtthatóval írja le a befektető kockázathoz való viszonyát, és ennek segítségével megkeresi az egyenes legjobb pontját."),

    h("A nyitva maradt döntés"),
    p("Tegyük a tőke $y$ hányadát P-be, $1 - y$ hányadát pedig az $r_f$ hozamú kockázatmentes eszközbe. Az előző leckéhez hasonlóan az így kapott **teljes portfólióra**"),
    eq("\\mu = r_f + y\\,(\\mu_P - r_f), \\qquad \\sigma = y\\,\\sigma_P."),
    p("Minden $y$ érték a tőkeallokációs egyenes egy pontja. Egy óvatos befektető kis $y$-t választ, egy merész nagyot, az $y > 1$ pedig azt jelenti, hogy $r_f$ kamatra hitelt vesz fel, és a saját tőkéjénél többet fektet P-be. A pontok összevetéséhez olyan szabály kell, amely mérlegeli a várható hozamot a kockázattal szemben."),

    h("Várható érték–variancia hasznosság"),
    p("A szokásos szabály minden portfóliónak egy pontszámot ad, a **hasznosságát**:"),
    eq("U = \\mu - \\tfrac{1}{2} A\\,\\sigma^2,"),
    p("ahol a hozamokat tizedes törtként írjuk. Az $A$ **kockázatkerülési együttható** azt mutatja, mennyire bünteti a befektető a varianciát. $A > 0$ esetén a befektető kockázatkerülő: két azonos $\\mu$-jű portfólió közül a kisebb $\\sigma$-jú kap nagyobb pontszámot. $A = 0$ esetén csak a várható hozam számít (kockázatsemlegesség). A valódi befektetői viselkedést nagyjából 2 és 6 közötti értékek írják le."),
    p("Példa: a kockázatos portfólióra $\\mu_P = 11\\%$ és $\\sigma_P = 20\\%$. Egy $A = 4$ együtthatójú befektető számára"),
    eq("U_P = 0{,}11 - \\tfrac{1}{2}\\times 4 \\times 0{,}20^2 = 0{,}11 - 0{,}08 = 0{,}03."),

    h("Biztos egyenérték"),
    p("Egy kockázatmentes befektetésre $\\sigma = 0$, így a hasznossága egyszerűen a hozama. Bármely portfólió hasznossága tehát hozamként is olvasható: ez a **biztos egyenérték**, az a biztos hozam, amelyet a befektető pontosan annyira tart vonzónak, mint a kockázatos portfóliót. A példában a befektető P-t egy biztos 3%-kal egyenértékűnek tartja. Ha a kockázatmentes kamat $r_f = 3\\%$, akkor ennek a befektetőnek mindegy, hogy csak P-t vagy csak kincstárjegyet tart."),

    {
      kind: "check",
      id: "risk-aversion/certainty-equivalent",
      prompt: "Egy portfólióra $\\mu = 9\\%$ és $\\sigma = 15\\%$. Mekkora a biztos egyenértéke egy $A = 4$ kockázatkerülésű befektető számára? A választ százalékban add meg.",
      answer: { type: "number", value: 4.5, tolerance: 0.05, unit: "%" },
      explain: "$U = 0{,}09 - \\tfrac{1}{2}\\times 4 \\times 0{,}15^2 = 0{,}09 - 0{,}045 = 4{,}5\\%$: a befektető a portfóliót egy biztos 4,5%-os hozammal tartja egyenértékűnek.",
    },

    h("Közömbösségi görbék"),
    p("Az azonos $U$ hasznosságú portfóliókra"),
    eq("\\mu = U + \\tfrac{1}{2} A\\,\\sigma^2."),
    p("A $(\\sigma, \\mu)$ síkon ez egy felfelé görbülő parabola, egy **közömbösségi görbe**: a befektetőnek mindegy, melyik pontját tartja. Minden további kockázati egységért több várható hozammal kell fizetni, és ez az ár $\\sigma$-val együtt nő. A feljebb fekvő görbék nagyobb hasznosságot jelentenek. Nagyobb $A$ mellett a görbék meredekebbek, mert a kockázatkerülőbb befektető ugyanakkora kockázatért több kompenzációt kér."),

    h("Az optimális teljes portfólió"),
    p("A teljes portfóliót a hasznosságba helyettesítve csak $y$-tól függő függvényt kapunk:"),
    eq("U(y) = r_f + y\\,(\\mu_P - r_f) - \\tfrac{1}{2} A\\,\\sigma_P^2\\, y^2."),
    p("Ez $y$-ban lefelé nyíló parabola. Az $(\\mu_P - r_f) - A\\sigma_P^2\\, y$ deriváltat nullával egyenlővé téve"),
    eq("y^{*} = \\frac{\\mu_P - r_f}{A\\,\\sigma_P^2}, \\qquad U^{*} = r_f + \\frac{\\text{SR}_P^2}{2A},"),
    p("ahol $\\text{SR}_P = (\\mu_P - r_f)/\\sigma_P$ a Sharpe-ráta. Geometriailag $y^*$ az a pont, ahol egy közömbösségi görbe éppen érinti a tőkeallokációs egyenest: a magasabb görbék elkerülik az egyenest, az alacsonyabbak két pontban metszik, és mindkét pont rosszabb."),
    note("A kockázatos portfólió optimális súlya $y^{*} = (\\mu_P - r_f)/(A\\sigma_P^2)$: arányos a többlethozamával, és fordítottan arányos a varianciájával és a befektető kockázatkerülésével."),

    {
      kind: "check",
      id: "risk-aversion/double-a",
      prompt: "Egy befektető optimális súlya a kockázatos portfólióban $y^{*} = 0{,}6$. A kockázatkerülése megduplázódik, a piac változatlan. Mekkora az új optimális súly?",
      answer: {
        type: "choice",
        options: [
          "0,3: $y^{*}$ fordítottan arányos $A$-val",
          "0,15: a kockázat négyzetesen szerepel",
          "0,6: az érintési portfólió nem változik",
          "1,2: egy óvatosabb befektetőnek nagyobb hozam kell",
        ],
        correct: 0,
      },
      explain: "$y^{*} = (\\mu_P - r_f)/(A\\sigma_P^2)$ arányos $1/A$-val, így $A$ duplázása felezi. Maga a kockázatos portfólió nem változik, csak a tartott mennyiség.",
    },

    h("Számpélda"),
    p("Legyen $\\mu_P = 11\\%$, $\\sigma_P = 20\\%$, $r_f = 3\\%$ és $A = 4$. Ekkor"),
    eq("y^{*} = \\frac{0{,}08}{4 \\times 0{,}04} = 0{,}5, \\qquad \\mu = 3\\% + 0{,}5 \\times 8\\% = 7\\%, \\qquad \\sigma = 0{,}5 \\times 20\\% = 10\\%,"),
    p("és $U^{*} = 0{,}07 - \\tfrac{1}{2}\\times 4 \\times 0{,}01 = 5\\%$. Csak kincstárjegyet vagy csak P-t tartva a biztos egyenérték egyaránt 3%, így a fele-fele keverék mindkét végpontnál egyértelműen jobb. Egy kockázatkerülőbb, $A = 8$ együtthatójú befektető $y^* = 0{,}25$-öt tart (várható hozam 5%, szórás 5%), egy $A = 2$ együtthatójú pedig pontosan P-t ($y^* = 1$)."),

    p("Egy második befektető más piacon van, $\\mu_P = 10\\%$, $\\sigma_P = 25\\%$ és $r_f = 2\\%$, kockázatkerülése pedig $A = 3$."),
    {
      kind: "worked",
      title: "Optimális teljes portfólió egy második befektetőnek",
      steps: [
        { text: "Az optimális súly a kockázatos portfólióban.", tex: "y^{*} = \\frac{\\mu_P - r_f}{A\\,\\sigma_P^2}", result: { value: 0.4267, tolerance: 0.0005 } },
        { text: "A teljes portfólió várható hozama.", tex: "\\mu = r_f + y^{*}(\\mu_P - r_f)", result: { value: 5.413, tolerance: 0.005, unit: "%" } },
        { text: "A volatilitása.", tex: "\\sigma = y^{*}\\sigma_P", result: { value: 10.67, tolerance: 0.01, unit: "%" } },
        { text: "A hasznossága a $\\text{SR}_P = 0{,}32$ Sharpe-rátán keresztül.", tex: "U^{*} = r_f + \\frac{\\text{SR}_P^2}{2A}", result: { value: 3.707, tolerance: 0.005, unit: "%" } },
      ],
    },

    h("Hitelfelvétel"),
    p("Az optimális súly akkor nagyobb egynél, ha $A < (\\mu_P - r_f)/\\sigma_P^2$, itt ha $A < 2$. $A = 1{,}6$ mellett a befektető $y^* = 0{,}08/(1{,}6 \\times 0{,}04) = 1{,}25$-öt szeretne: a saját tőkéje negyedét kölcsönveszi $r_f$ kamatra, és 125%-ot fektet P-be, 13%-os várható hozammal és 25%-os szórással. A gyakorlatban a befektetők drágábban vesznek fel hitelt, mint amennyiért kölcsönadnak, ezért az egyenes P után lefelé törik, és az optimális hitelfelvétel kisebb."),
    p("Az ábra a példa tőkeallokációs egyenesét mutatja. Húzd a pontot az egyenes mentén $y$ kiválasztásához; a ponton átmenő görbe az a közömbösségi görbe, amelyen éppen vagy, a szaggatott görbe pedig az optimumhoz tartozik. Indulj P-ből, ahol a két görbe messze van egymástól, és húzd a kockázatmentes vég felé: a hasznosság nő, amíg a pont rá nem ugrik az optimumra $y = 0{,}5$-nél, utána ismét csökken. Válts $A$-t, és figyeld meg, hogy az optimum elmozdul, az egyenes viszont a helyén marad."),
    figure("utility-indifference"),

    h("A két döntés szétválása"),
    p("Az eredmény két részre bontja a befektetési problémát. Hogy melyik kockázatos portfóliót tartsuk, csak a piacon múlik (várható hozamok, szórások, korrelációk): minden várható érték–variancia alapon döntő befektető az érintési portfóliót választja. Hogy mennyit tartsunk belőle, csak a befektető $A$ együtthatóján múlik. Ez a **két alap tétele**: bármely optimális portfólió ugyanannak a két alapnak, a kockázatmentes eszköznek és P-nek a keveréke."),

    h("Összefoglalás"),
    list(
      "Az $U = \\mu - \\tfrac{1}{2}A\\sigma^2$ várható érték–variancia hasznosság pontozza a portfóliókat; $A$ a kockázatkerülés mértéke.",
      "Egy portfólió hasznossága a biztos egyenértéke: az a biztos hozam, amelyet a befektető ugyanannyira vonzónak tart.",
      "A $\\mu = U + \\tfrac{1}{2}A\\sigma^2$ közömbösségi görbék parabolák, nagyobb $A$ mellett meredekebbek.",
      "A legjobb teljes portfólió $y^* = (\\mu_P - r_f)/(A\\sigma_P^2)$ súlyt tart P-ben; $y^* > 1$ hitelfelvételt jelent.",
      "Mindenki ugyanazt a kockázatos portfóliót tartja; csak az ez és a kockázatmentes eszköz közötti arány különbözik.",
    ),
    note("A következő lecke, a „CAPM, béta és az értékpapír-piaci egyenes”, azt vizsgálja, mi történik az árakkal, ha minden befektető ugyanazt a kockázatos portfóliót tartja."),
    lab("/risk-return", "Keverj egy kockázatos eszközt a kockázatmentes kamattal, és mozogj a tőkeallokációs egyenesen a Kockázat és hozam laborban"),
  ],
};
