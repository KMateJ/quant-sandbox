import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { figure, h, lab, list, note, p } from "./blocks";

export const portfolioConstraints: GuideLessonContent = {
  en: [
    p("\"The efficient frontier and the capital market line\" finds the best portfolio when any weights are allowed, including negative ones. Almost no real investor may do that: many funds cannot sell short, others cap each position or sector. This lesson asks what such rules do to the frontier and what they cost, building on the two-asset picture of \"Diversification and correlation\"."),

    h("What a constraint is"),
    p("The only constraint in the earlier lessons is the budget: the weights add up to one, $\\sum_i w_i = 1$. Real mandates add more:"),
    list(
      "**No short sales:** $w_i \\ge 0$ for every asset. Common for pension funds and mutual funds.",
      "**Position caps:** $w_i \\le \\bar w$, for example 10% in any single stock, to force diversification.",
      "**Group limits:** at most 30% in one sector or one country.",
    ),
    p("Each is a condition on the weights, so the minimum-variance problem is solved over a smaller set of portfolios than before."),

    h("The constrained frontier"),
    p("The efficient frontier is the lowest-volatility portfolio for each target return. If we minimise over a smaller set, the best volatility can only stay the same or get worse. Hence the constrained frontier never lies to the left of the unconstrained one: it touches it where the free optimum happens to respect the rules and lies inside it elsewhere."),
    p("With short sales banned, the weights live on a triangle (for three assets), and the frontier is traced out by portfolios that sit on the triangle's edges and corners. The cheapest way to see it is the figure: three assets with expected returns 5%, 6% and 10% and volatilities 10%, 18% and 24%. The second and third assets are strongly correlated (0.85), so the free optimum wants to sell the weaker one short and use the money to buy more of the stronger one."),
    figure("constrained-frontier"),
    p("At a risk-free rate of 2% the free tangency portfolio holds 80%, $-$50% and 70% in the three assets: it is short half of the second asset. The banned frontier cannot do that, so its tangency portfolio holds 67%, 0% and 33%. The two frontiers coincide where no short position is needed, and separate as the target return rises. Raise the risk-free rate in the figure and the gap widens, because the tangency portfolio moves further out where shorting matters more."),
    {
      kind: "check",
      id: "portfolio-constraints/frontier-order",
      prompt: "Which statement about the frontier with a no-short-sales constraint is always true?",
      answer: { type: "choice", options: ["It is never above the unconstrained frontier", "It is a straight line", "It has a higher best Sharpe ratio", "It needs more than three assets"], correct: 0 },
      explain: "A constraint shrinks the set of allowed portfolios, so the lowest volatility for a given return can only stay equal or rise. The best Sharpe ratio therefore cannot improve either.",
    },

    h("The cost of a constraint"),
    p("Because the best Sharpe ratio is attained on the frontier, the cost of a rule can be measured as the Sharpe ratio it removes. In the figure at the defaults the free tangency portfolio has a Sharpe ratio of 0.416 and the banned one 0.394, a loss of 0.023 or about 5%. That is the price of the ban on this set of assets; with weakly correlated assets the free optimum needs no short positions and the price is zero."),
    p("A caution: the free optimum with big short positions is also the one most sensitive to errors in the inputs. The no-short-sales portfolio gives up some theoretical Sharpe ratio but is often less wrong out of sample, a point the next lesson develops."),
    {
      kind: "worked",
      title: "What the short-sales ban costs at the figure's defaults",
      steps: [
        { text: "Free tangency portfolio: expected return 8.00%, volatility 14.41%, risk-free rate 2%.", tex: "S_{\\text{free}} = \\frac{\\mu - r_f}{\\sigma}", result: { value: 0.4164, tolerance: 0.003 } },
        { text: "Banned tangency portfolio: expected return 6.65%, volatility 11.81%.", tex: "S_{\\text{ban}} = \\frac{\\mu - r_f}{\\sigma}", result: { value: 0.3938, tolerance: 0.003 } },
        { text: "The cost of the ban in Sharpe ratio.", tex: "S_{\\text{free}} - S_{\\text{ban}}", result: { value: 0.0226, tolerance: 0.004 } },
        { text: "As a share of the free Sharpe ratio, in per cent.", tex: "100\\,\\frac{S_{\\text{free}} - S_{\\text{ban}}}{S_{\\text{free}}}", result: { value: 5.4, tolerance: 0.8 } },
      ],
    },

    h("Constraints as views"),
    p("A short-sale ban is a crude statement that no asset is expected to do so badly that it deserves a negative weight. Seen that way it acts like a mild form of shrinkage on the weights. More refined methods, such as the Black–Litterman model, build the investor's views into the expected returns instead, but the idea is the same: stop the optimiser from acting on extreme inputs."),
    {
      kind: "check",
      id: "portfolio-constraints/corner",
      prompt: "Two assets are perfectly correlated ($\\rho = 1$) with volatilities 10% and 20%. Without constraints the minimum-variance portfolio holds 200% in the first asset and $-$100% in the second. What weight, in per cent, does the no-short-sales minimum-variance portfolio hold in the first asset?",
      answer: { type: "number", value: 100, tolerance: 0.5 },
      explain: "With a ban, the weight must stay between 0 and 1. Volatility falls as weight moves into the less volatile first asset, so the best allowed portfolio is at the corner: 100% in asset 1.",
    },

    h("Summary"),
    list(
      "Constraints (no short sales, caps, group limits) restrict the weights to a smaller set of portfolios.",
      "The constrained frontier is never better than the free one: it touches it where the free optimum is allowed, and lies inside it elsewhere.",
      "The cost of a rule is the Sharpe ratio it removes: 0.023 at the figure's defaults, about 5%.",
      "Constraints also tame extreme weights, which matters when the inputs are uncertain.",
    ),
    note("The next lesson, \"Estimating expected returns and covariances\", shows how uncertain those inputs are and why optimisers magnify the errors."),
    lab("/efficient-frontier", "Pin a frontier in the Efficient Frontier lab and change the constraint set"),
  ],
  hu: [
    p("„Hatékony front és tőkepiaci egyenes” a legjobb portfóliót keresi, ha tetszőleges súlyok megengedettek, a negatívak is. Alig van valódi befektető, aki ezt megtehetné: sok alap nem adhat el rövidre, mások pozíciónként vagy ágazatonként korlátoznak. Ez a lecke azt kérdezi, mit tesznek az ilyen szabályok a fronttal és mibe kerülnek, a „Diverzifikáció és korreláció” kételemű képére építve."),

    h("Mi az a korlát?"),
    p("A korábbi leckékben az egyetlen korlát a költségvetés: a súlyok összege egy, $\\sum_i w_i = 1$. A valódi megbízások többet is előírnak:"),
    list(
      "**Rövidre eladás tilalma:** minden eszközre $w_i \\ge 0$. Gyakori nyugdíjalapoknál és befektetési alapoknál.",
      "**Pozíciókorlát:** $w_i \\le \\bar w$, például legfeljebb 10% egyetlen részvényben, a diverzifikáció kikényszerítésére.",
      "**Csoportkorlát:** legfeljebb 30% egy ágazatban vagy egy országban.",
    ),
    p("Mindegyik a súlyokra szóló feltétel, így a minimális variancia feladatát a korábbinál kisebb portfóliókészleten oldjuk meg."),

    h("A korlátozott front"),
    p("A hatékony front minden célhozamhoz a legkisebb volatilitású portfólió. Ha kisebb készleten minimalizálunk, a legjobb volatilitás legfeljebb ugyanakkora marad, vagy romlik. A korlátozott front tehát sosem esik a korlátozatlantól balra: ott érinti, ahol a szabad optimum véletlenül betartja a szabályokat, máshol belül fut."),
    p("Rövidre eladás tilalmával a súlyok (három eszköznél) egy háromszögön élnek, és a frontot a háromszög szélén és csúcsain lévő portfóliók rajzolják ki. A legegyszerűbben az ábrán látszik: három eszköz 5%, 6% és 10% várható hozammal és 10%, 18% és 24% volatilitással. A második és a harmadik eszköz erősen korrelál (0,85), ezért a szabad optimum a gyengébbet rövidre eladná, és a pénzből többet vásárolna a jobbikból."),
    figure("constrained-frontier"),
    p("2%-os kockázatmentes kamatnál a szabad érintési portfólió súlyai 80%, $-$50% és 70%: a második eszközből a felének megfelelő rövid pozíciót tart. A tiltott front ezt nem teheti meg, így az érintési portfóliója 67%, 0% és 33%. A két front ott esik egybe, ahol nincs szükség rövid pozícióra, és a célhozam emelkedésével válnak szét. Növeld az ábrán a kockázatmentes kamatot, és a rés nő, mert az érintési portfólió kijjebb kerül, ahol a rövidre eladás többet számít."),
    {
      kind: "check",
      id: "portfolio-constraints/frontier-order",
      prompt: "Melyik állítás igaz mindig a rövidre eladást tiltó front esetén?",
      answer: { type: "choice", options: ["Sosem esik a korlátozatlan front fölé", "Egyenes", "Nagyobb a legjobb Sharpe-mutatója", "Háromnál több eszköz kell hozzá"], correct: 0 },
      explain: "A korlát szűkíti a megengedett portfóliók készletét, így az adott hozamhoz tartozó legkisebb volatilitás legfeljebb ugyanakkora marad vagy nő. A legjobb Sharpe-mutató ezért sem javulhat.",
    },

    h("A korlát ára"),
    p("Mivel a legjobb Sharpe-mutató a fronton érhető el, egy szabály ára azzal mérhető, mennyi Sharpe-mutatót vesz el. Az ábrán az alapbeállításnál a szabad érintési portfólió Sharpe-mutatója 0,416, a tiltotté 0,394, vagyis a veszteség 0,023, nagyjából 5%. Ennyibe kerül a tilalom ezen az eszközkészleten; gyengén korreláló eszközöknél a szabad optimumnak nincs szüksége rövid pozícióra, és az ár nulla."),
    p("Egy óvatosság: a nagy rövid pozíciókat tartalmazó szabad optimum a bemenő adatok hibáira is a legérzékenyebb. A rövidre eladás nélküli portfólió elméleti Sharpe-mutatóból ad fel, de mintán kívül gyakran kevésbé téved; ezt a következő lecke fejti ki."),
    {
      kind: "worked",
      title: "Mibe kerül a rövidre eladás tilalma az ábra alapbeállításánál",
      steps: [
        { text: "Szabad érintési portfólió: várható hozam 8,00%, volatilitás 14,41%, kockázatmentes kamat 2%.", tex: "S_{\\text{szabad}} = \\frac{\\mu - r_f}{\\sigma}", result: { value: 0.4164, tolerance: 0.003 } },
        { text: "Tiltott érintési portfólió: várható hozam 6,65%, volatilitás 11,81%.", tex: "S_{\\text{tiltott}} = \\frac{\\mu - r_f}{\\sigma}", result: { value: 0.3938, tolerance: 0.003 } },
        { text: "A tilalom ára Sharpe-mutatóban.", tex: "S_{\\text{szabad}} - S_{\\text{tiltott}}", result: { value: 0.0226, tolerance: 0.004 } },
        { text: "A szabad Sharpe-mutató százalékában.", tex: "100\\,\\frac{S_{\\text{szabad}} - S_{\\text{tiltott}}}{S_{\\text{szabad}}}", result: { value: 5.4, tolerance: 0.8 } },
      ],
    },

    h("A korlátok mint vélemények"),
    p("A rövidre eladás tilalma egy nyers állítás: egyetlen eszköz sem várható olyan rosszul teljesíteni, hogy negatív súlyt érdemeljen. Így nézve a súlyok enyhe zsugorításaként működik. A finomabb módszerek, például a Black–Litterman-modell, a befektető véleményét a várható hozamokba építik be, de az elv ugyanaz: megakadályozni, hogy az optimalizáló szélsőséges inputok alapján cselekedjen."),
    {
      kind: "check",
      id: "portfolio-constraints/corner",
      prompt: "Két eszköz tökéletesen korrelál ($\\rho = 1$), volatilitásuk 10% és 20%. Korlát nélkül a minimális varianciájú portfólió 200%-ot tart az első és $-$100%-ot a második eszközben. Hány százalékot tart az első eszközben a rövidre eladás nélküli minimális varianciájú portfólió?",
      answer: { type: "number", value: 100, tolerance: 0.5 },
      explain: "Tilalommal a súly 0 és 1 között marad. A volatilitás csökken, ahogy a súly a kisebb volatilitású első eszközbe tolódik, így a legjobb megengedett portfólió a sarokban van: 100% az 1. eszközben.",
    },

    h("Összefoglalás"),
    list(
      "A korlátok (rövidre eladás tilalma, pozíciókorlát, csoportkorlát) a súlyokat a portfóliók kisebb készletére szorítják.",
      "A korlátozott front sosem jobb a szabadnál: ott érinti, ahol a szabad optimum megengedett, máshol belül fut.",
      "A szabály ára a Sharpe-mutató, amelyet elvesz: az ábra alapbeállításánál 0,023, nagyjából 5%.",
      "A korlátok a szélsőséges súlyokat is fékezik, ami bizonytalan inputoknál számít.",
    ),
    note("A következő lecke („A várható hozam és a kovariancia becslése”) megmutatja, mennyire bizonytalanok ezek az inputok, és miért nagyítja fel az optimalizáló a hibákat."),
    lab("/efficient-frontier", "Rögzíts egy frontot a Hatékony front laborban, és változtasd a korlátokat"),
  ],
};
