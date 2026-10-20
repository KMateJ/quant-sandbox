import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p, steps } from "./blocks";

export const yieldCurve: GuideLessonContent = {
  en: [
    p("In \"Bond prices and yields\" every cash flow of a bond was discounted at one rate, its yield to maturity. In real markets money lent for one year and money lent for ten years earn different rates. This lesson gives each maturity its own rate, the **spot rate**, shows how to read spot rates off bond prices, and derives the **forward rates** they imply. It builds on \"Interest, compounding and discounting\" and \"Duration and convexity\"."),

    h("Yields as averages of rates"),
    p("Two bonds with different coupons but the same maturity usually have different yields to maturity, even from the same issuer. The reason is that a yield is an average: it blends the rates for all the payment dates of that particular bond, weighted by its cash flows. A coupon payment due in year 1 should be worth the same whichever bond it comes from, so it is cleaner to attach a rate to each payment **date** rather than to each bond."),

    h("Spot rates and discount factors"),
    p("The **spot rate** $r(t)$ (also called the zero rate) is the yield of a zero-coupon bond maturing at $t$: the rate for borrowing or lending from today until $t$ with a single repayment. In this lesson spot and forward rates are **continuously compounded**, so the price today of 1 paid at $t$, the **discount factor**, is"),
    eq("P(0,t) = e^{-r(t)\\,t}, \\qquad r(t) = -\\frac{\\ln P(0,t)}{t}."),
    p("The function $t \\mapsto r(t)$ is the **yield curve** (or term structure of interest rates). The discount factors carry the same information; the rates are just easier to compare across maturities."),

    h("Pricing a coupon bond with spot rates"),
    p("A coupon bond is a bundle of zero-coupon bonds, one for each payment. If $CF_t$ is paid at year $t$, each cash flow is discounted at the spot rate for its own date:"),
    eq("P = \\sum_{t=1}^{T} CF_t\\, e^{-r(t)\\,t}."),
    p("If the curve is flat, $r(t) = r$ for every $t$, this collapses to discounting at a single rate, and the yield of every bond is the same. Otherwise the yield to maturity of a bond is the one rate that reproduces this price, a cash-flow-weighted blend of the spot rates."),

    h("Bootstrapping"),
    p("Zero-coupon bonds do not exist for every maturity, so spot rates are usually extracted from coupon bond prices one maturity at a time, starting at the short end. This is called **bootstrapping**. We use annual coupons (with $F = 100$), solve for discount factors, which do not depend on any compounding convention, and only then convert them into continuously compounded spot rates."),
    p("Suppose the market quotes a 1-year zero-coupon bond at 97.00 and a 2-year bond with a 5% annual coupon at 101.00."),
    steps(
      "The 1-year zero gives $P(0,1) = 97.00/100 = 0.9700$, so $r(1) = -\\ln 0.97 \\approx 3.05\\%$.",
      "The 2-year bond pays 5 at year 1 and 105 at year 2. The first payment is already priced by step 1: $101.00 = 5 \\cdot 0.9700 + 105\\,P(0,2)$, so $P(0,2) = 96.15/105 \\approx 0.9157$ and $r(2) = -\\tfrac{1}{2}\\ln 0.9157 \\approx 4.40\\%$.",
    ),
    p("With more bonds the procedure continues the same way: at each maturity only one discount factor is unknown. With these two spot rates a 2-year bond with a 6% coupon must cost $6 \\cdot 0.9700 + 106 \\cdot 0.9157 \\approx 102.89$; any other price would let you build it more cheaply from the two quoted bonds. Its yield to maturity (annual compounding) is about 4.46%, a blend of the two spot rates."),
    p("Bonds that trade at par are a common starting point, because their coupon rate is the par yield quoted for that maturity."),
    {
      kind: "worked",
      title: "Bootstrapping the 2-year spot rate from a par bond",
      steps: [
        { text: "Keep $P(0,1) = 0.9700$ from above. A 2-year bond with a 4.5% annual coupon trades at par, 100, and pays 4.5 and 104.5. Solve for the unknown discount factor.", tex: "P(0,2) = \\frac{100 - 4.5 \\times 0.9700}{104.5}", result: { value: 0.9152, tolerance: 0.0002 } },
        { text: "Convert it into a continuously compounded spot rate.", tex: "r(2) = -\\tfrac{1}{2}\\ln P(0,2)", result: { value: 4.43, tolerance: 0.01, unit: "%" } },
      ],
    },

    h("Forward rates"),
    p("A **forward rate** $f(t_1, t_2)$ is the rate, fixed today, for borrowing or lending between two future dates $t_1 < t_2$. No arbitrage pins it down from the spot curve. Compare two ways of investing 1 from today until $t_2$:"),
    list(
      "invest directly at the spot rate $r_2 = r(t_2)$, which grows to $e^{r_2 t_2}$;",
      "invest until $t_1$ at $r_1 = r(t_1)$, and agree today to reinvest from $t_1$ to $t_2$ at $f(t_1,t_2)$, which grows to $e^{r_1 t_1}\\,e^{f(t_1,t_2)(t_2 - t_1)}$.",
    ),
    p("Both strategies are riskless and cost 1 today, so by the argument of \"Arbitrage and the forward price\" they must deliver the same amount. Equating the exponents gives"),
    eq("f(t_1, t_2) = \\frac{r_2 t_2 - r_1 t_1}{t_2 - t_1}."),
    note("The forward rate between $t_1$ and $t_2$ is the rate that makes rolling over at $t_1$ equivalent to investing until $t_2$ at once: $f(t_1,t_2) = (r_2t_2 - r_1t_1)/(t_2 - t_1)$."),
    p("In the bootstrapping example, $f(1,2) = 2 \\cdot 4.40\\% - 3.05\\% \\approx 5.76\\%$. Check: $e^{0.0305}e^{0.0576} \\approx e^{2 \\cdot 0.0440} \\approx 1.092$."),
    {
      kind: "check",
      id: "yield-curve/one-year-forward",
      prompt: "The continuously compounded spot rates are $r(1) = 3\\%$ and $r(2) = 4\\%$. What is the forward rate $f(1,2)$, in percent?",
      answer: { type: "number", value: 5, tolerance: 0.01, unit: "%" },
      explain: "$f(1,2) = (2 \\times 4\\% - 1 \\times 3\\%)/(2 - 1) = 5\\%$. Two years at 4% equal one year at 3% followed by one year at 5%.",
    },

    h("The instantaneous forward curve"),
    p("Let $t_2$ shrink towards $t_1 = t$. The numerator is the change in $r(t)\\,t$, so the limit is a derivative, the **instantaneous forward rate**:"),
    eq("f(t) = \\frac{d}{dt}\\big(r(t)\\,t\\big) = r(t) + t\\,r'(t)."),
    p("This explains how the two curves sit relative to each other. Where the spot curve rises ($r'(t) > 0$), the forward curve lies **above** it; where the spot curve falls, the forward curve lies below; where the spot curve is flat, the two coincide. A fair picture is a running average: the spot rate $r(t)$ is the average of the forward rates from 0 to $t$, so it only goes up when the new rate being added is above the current average."),
    {
      kind: "check",
      id: "yield-curve/forward-above-spot",
      prompt: "Over a range of maturities the instantaneous forward curve lies above the spot curve. What is the spot curve doing there?",
      answer: { type: "choice", options: ["Rising", "Falling", "Flat", "It cannot be told from the forwards"], correct: 0 },
      explain: "$f(t) = r(t) + t\\,r'(t)$, so $f(t) > r(t)$ exactly when $r'(t) > 0$: the spot rate, a running average of the forwards, rises when the new forward is above it.",
    },

    h("Shapes of the yield curve"),
    list(
      "**Upward sloping** (normal): long rates above short rates. The most common shape.",
      "**Flat**: about the same rate at all maturities; the single-yield world of \"Bond prices and yields\".",
      "**Inverted**: short rates above long rates, often seen when markets expect rates to be cut.",
      "**Humped**: rates rise over the first few years and then fall back.",
    ),
    p("The figure draws a smooth three-parameter spot curve (continuously compounded) from 0 to 30 years, with the instantaneous forward curve implied by it. The **level** is the long-term rate the curve settles at, the **slope** sets how far the short end lies below (negative) or above (positive) that level, and the **hump** adds a bump at intermediate maturities. The readouts show the 2-, 10- and 30-year spot rates and the 10-year minus 2-year spread. At the defaults the curve slopes upward: about 3.00% at 2 years, 3.79% at 10 years and 3.93% at 30 years, a spread of about 79 basis points, and the forward curve runs above the spot curve. Make the slope positive to invert the curve and note that the forward curve drops below the spot curve; set slope and hump to 0 and the two curves coincide."),
    figure("spot-forward"),

    h("Summary"),
    list(
      "The spot rate $r(t)$ is the rate on a zero-coupon loan to $t$; with continuous compounding the discount factor is $e^{-r(t)t}$.",
      "A coupon bond is priced by discounting each cash flow at the spot rate for its date; its yield to maturity is a blend of these rates.",
      "Bootstrapping recovers discount factors one maturity at a time from coupon bond prices.",
      "No arbitrage gives forward rates $f(t_1,t_2) = (r_2t_2 - r_1t_1)/(t_2 - t_1)$; the forward curve lies above the spot curve where the spot curve rises and below it where it falls.",
    ),
    lab("/yield-curve", "Fit and reshape a yield curve in the Yield Curve lab"),
  ],

  hu: [
    p("A „Kötvényárak és hozamok” leckében a kötvény minden pénzáramlását egyetlen rátával, a lejáratig számított hozammal diszkontáltuk. A valódi piacon az egy évre és a tíz évre kölcsönadott pénz eltérő kamatot hoz. Ez a lecke minden lejáratnak saját rátát ad, az **azonnali kamatlábat** (spot rátát), megmutatja, hogyan olvasható ki a kötvényárakból, és levezeti a belőle következő **forward kamatlábakat**. A „Kamat, kamatozás és diszkontálás” és a „Duráció és konvexitás” leckékre épül."),

    h("A hozam mint a ráták átlaga"),
    p("Két azonos lejáratú, de eltérő kuponú kötvény lejáratig számított hozama általában különbözik, még ugyanattól a kibocsátótól is. Ennek oka, hogy a hozam átlag: az adott kötvény összes kifizetési időpontjához tartozó rátákat keveri össze, a pénzáramlásaival súlyozva. Egy első évben esedékes kuponfizetés ugyanannyit kell érnie, bármelyik kötvényből származik, ezért tisztább, ha a rátát a kifizetés **időpontjához** rendeljük, nem a kötvényhez."),

    h("Azonnali kamatlábak és diszkontfaktorok"),
    p("Az $r(t)$ **azonnali kamatláb** (zérókamat) a $t$-ben lejáró zérókuponos kötvény hozama: a mától $t$-ig tartó, egyetlen visszafizetéssel járó hitelezés kamata. Ebben a leckében az azonnali és a forward kamatlábak **folytonos kamatozásúak**, így a $t$-ben fizetett 1 mai ára, a **diszkontfaktor**:"),
    eq("P(0,t) = e^{-r(t)\\,t}, \\qquad r(t) = -\\frac{\\ln P(0,t)}{t}."),
    p("A $t \\mapsto r(t)$ függvény a **hozamgörbe** (a kamatlábak lejárati szerkezete). A diszkontfaktorok ugyanezt az információt hordozzák; a rátákat csak könnyebb lejáratok között összehasonlítani."),

    h("Kuponos kötvény árazása azonnali kamatlábakkal"),
    p("A kuponos kötvény zérókuponos kötvények csomagja, minden kifizetésre egy. Ha $CF_t$ a $t$-edik évben esedékes, minden pénzáramlást a saját időpontjához tartozó azonnali kamatlábbal diszkontálunk:"),
    eq("P = \\sum_{t=1}^{T} CF_t\\, e^{-r(t)\\,t}."),
    p("Ha a görbe vízszintes, vagyis minden $t$-re $r(t) = r$, ez egyetlen rátával való diszkontálásra egyszerűsödik, és minden kötvény hozama ugyanaz. Egyébként a kötvény lejáratig számított hozama az az egy ráta, amely ezt az árat adja vissza: az azonnali kamatlábak pénzáramlásokkal súlyozott keveréke."),

    h("Rátakinyerés (bootstrapping)"),
    p("Zérókuponos kötvény nem minden lejáratra létezik, ezért az azonnali kamatlábakat általában kuponos kötvények árából nyerjük ki, lejáratról lejáratra, a rövid végtől kezdve. Ennek neve **bootstrapping**. Éves kuponokkal ($F = 100$) dolgozunk, a diszkontfaktorokat oldjuk meg, amelyek nem függenek a kamatozási konvenciótól, és csak ezután váltjuk át őket folytonos kamatozású azonnali rátákra."),
    p("Tegyük fel, hogy a piacon egy egyéves zérókuponos kötvény ára 97,00, egy kétéves, 5%-os éves kuponú kötvényé pedig 101,00."),
    steps(
      "Az egyéves zérókuponos kötvényből $P(0,1) = 97{,}00/100 = 0{,}9700$, így $r(1) = -\\ln 0{,}97 \\approx 3{,}05\\%$.",
      "A kétéves kötvény az első évben 5-öt, a másodikban 105-öt fizet. Az első kifizetést az 1. lépés már beárazta: $101{,}00 = 5 \\cdot 0{,}9700 + 105\\,P(0,2)$, így $P(0,2) = 96{,}15/105 \\approx 0{,}9157$ és $r(2) = -\\tfrac{1}{2}\\ln 0{,}9157 \\approx 4{,}40\\%$.",
    ),
    p("Több kötvénnyel az eljárás ugyanígy folytatódik: minden lejáratnál csak egy diszkontfaktor ismeretlen. E két azonnali kamatlábbal egy 6%-os kuponú kétéves kötvény ára csak $6 \\cdot 0{,}9700 + 106 \\cdot 0{,}9157 \\approx 102{,}89$ lehet; bármely más árnál olcsóbban össze lehetne rakni a két jegyzett kötvényből. Lejáratig számított hozama (éves kamatozással) kb. 4,46%, a két azonnali kamatláb keveréke."),
    p("Gyakori kiindulópont a névértéken forgó kötvény, mert a kuponrátája éppen az adott lejáratra jegyzett névértékhozam (par hozam)."),
    {
      kind: "worked",
      title: "A kétéves azonnali kamatláb kinyerése névértéken forgó kötvényből",
      steps: [
        { text: "Maradjunk a fenti $P(0,1) = 0{,}9700$-nál. Egy kétéves, évi 4,5%-os kuponú kötvény névértéken, 100-on forog, és 4,5-et, majd 104,5-öt fizet. Oldjuk meg az ismeretlen diszkontfaktorra.", tex: "P(0,2) = \\frac{100 - 4{,}5 \\times 0{,}9700}{104{,}5}", result: { value: 0.9152, tolerance: 0.0002 } },
        { text: "Váltsuk át folytonos kamatozású azonnali kamatlábra.", tex: "r(2) = -\\tfrac{1}{2}\\ln P(0,2)", result: { value: 4.43, tolerance: 0.01, unit: "%" } },
      ],
    },

    h("Forward kamatlábak"),
    p("Az $f(t_1, t_2)$ **forward kamatláb** az a ma rögzített kamat, amelyen két jövőbeli időpont, $t_1 < t_2$ között lehet hitelt felvenni vagy nyújtani. Az arbitrázsmentesség az azonnali görbéből meghatározza. Vessünk össze két módot arra, hogy 1-et mától $t_2$-ig befektessünk:"),
    list(
      "közvetlenül az $r_2 = r(t_2)$ azonnali kamatlábon, ami $e^{r_2 t_2}$-re nő;",
      "$t_1$-ig $r_1 = r(t_1)$-en, és ma megállapodunk, hogy $t_1$-től $t_2$-ig $f(t_1,t_2)$-n fektetjük újra, ami $e^{r_1 t_1}\\,e^{f(t_1,t_2)(t_2 - t_1)}$-re nő.",
    ),
    p("Mindkét stratégia kockázatmentes és ma 1-be kerül, így az „Arbitrázs és a határidős ár” lecke érvelése szerint ugyanannyit kell hozniuk. A kitevőket egyenlővé téve"),
    eq("f(t_1, t_2) = \\frac{r_2 t_2 - r_1 t_1}{t_2 - t_1}."),
    note("A $t_1$ és $t_2$ közötti forward kamatláb az a ráta, amellyel a $t_1$-beli újrabefektetés egyenértékű azzal, hogy egyből $t_2$-ig fektetünk be: $f(t_1,t_2) = (r_2t_2 - r_1t_1)/(t_2 - t_1)$."),
    p("A bootstrapping példájában $f(1,2) = 2 \\cdot 4{,}40\\% - 3{,}05\\% \\approx 5{,}76\\%$. Ellenőrzés: $e^{0{,}0305}e^{0{,}0576} \\approx e^{2 \\cdot 0{,}0440} \\approx 1{,}092$."),
    {
      kind: "check",
      id: "yield-curve/one-year-forward",
      prompt: "A folytonos kamatozású azonnali kamatlábak $r(1) = 3\\%$ és $r(2) = 4\\%$. Mekkora az $f(1,2)$ forward kamatláb, százalékban?",
      answer: { type: "number", value: 5, tolerance: 0.01, unit: "%" },
      explain: "$f(1,2) = (2 \\times 4\\% - 1 \\times 3\\%)/(2 - 1) = 5\\%$. Két év 4%-on ugyanannyi, mint egy év 3%-on, majd egy év 5%-on.",
    },

    h("A pillanatnyi forward görbe"),
    p("Közelítsen $t_2$ a $t_1 = t$ időponthoz. A számláló $r(t)\\,t$ megváltozása, így a határérték derivált, a **pillanatnyi forward kamatláb**:"),
    eq("f(t) = \\frac{d}{dt}\\big(r(t)\\,t\\big) = r(t) + t\\,r'(t)."),
    p("Ebből látszik, hogyan helyezkedik el egymáshoz képest a két görbe. Ahol az azonnali görbe emelkedik ($r'(t) > 0$), ott a forward görbe **fölötte** halad; ahol csökken, ott alatta; ahol vízszintes, ott egybeesnek. Jó kép erre egy futó átlag: az $r(t)$ azonnali kamatláb a 0 és $t$ közötti forward kamatlábak átlaga, ezért csak akkor nő, ha az újonnan hozzávett ráta az addigi átlag fölött van."),
    {
      kind: "check",
      id: "yield-curve/forward-above-spot",
      prompt: "Egy lejárati tartományban a pillanatnyi forward görbe az azonnali görbe fölött halad. Mit csinál ott az azonnali görbe?",
      answer: { type: "choice", options: ["Emelkedik", "Csökken", "Vízszintes", "A forwardokból nem állapítható meg"], correct: 0 },
      explain: "$f(t) = r(t) + t\\,r'(t)$, így $f(t) > r(t)$ pontosan akkor, ha $r'(t) > 0$: az azonnali kamatláb, a forwardok futó átlaga, akkor nő, ha az új forward fölötte van.",
    },

    h("A hozamgörbe alakjai"),
    list(
      "**Emelkedő** (normál): a hosszú kamatok a rövidek fölött vannak. Ez a leggyakoribb alak.",
      "**Vízszintes**: minden lejáratra nagyjából ugyanaz a kamat; ez a „Kötvényárak és hozamok” lecke egyhozamú világa.",
      "**Inverz**: a rövid kamatok a hosszúak fölött vannak, gyakran akkor, ha a piac kamatcsökkentést vár.",
      "**Púpos**: a kamatok az első néhány évben emelkednek, aztán visszaesnek.",
    ),
    p("Az ábra egy sima, háromparaméteres (folytonos kamatozású) azonnali görbét rajzol 0-tól 30 évig, a belőle következő pillanatnyi forward görbével együtt. A **szint** az a hosszú távú kamat, amelyhez a görbe beáll, a **meredekség** azt adja meg, mennyivel van a rövid vég e szint alatt (negatív) vagy fölött (pozitív), a **púp** pedig a középső lejáratoknál ad egy kidudorodást. A kijelzők a 2, 10 és 30 éves azonnali kamatlábat és a 10 éves mínusz 2 éves különbözetet mutatják. Alapbeállításban a görbe emelkedő: 2 évre kb. 3,00%, 10 évre 3,79%, 30 évre 3,93%, a különbözet kb. 79 bázispont, és a forward görbe az azonnali fölött fut. Tedd pozitívvá a meredekséget, hogy a görbe inverz legyen, és figyeld meg, hogy a forward görbe az azonnali alá kerül; a meredekséget és a púpot 0-ra állítva a két görbe egybeesik."),
    figure("spot-forward"),

    h("Összefoglalás"),
    list(
      "Az $r(t)$ azonnali kamatláb a $t$-ig tartó zérókuponos hitel kamata; folytonos kamatozással a diszkontfaktor $e^{-r(t)t}$.",
      "A kuponos kötvényt úgy árazzuk, hogy minden pénzáramlását a saját időpontjához tartozó azonnali kamatlábbal diszkontáljuk; lejáratig számított hozama ezek keveréke.",
      "A bootstrapping a kuponos kötvények árából lejáratról lejáratra nyeri ki a diszkontfaktorokat.",
      "Az arbitrázsmentességből $f(t_1,t_2) = (r_2t_2 - r_1t_1)/(t_2 - t_1)$; a forward görbe ott van az azonnali fölött, ahol az emelkedik, és ott alatta, ahol csökken.",
    ),
    lab("/yield-curve", "Illessz és alakíts hozamgörbét a Hozamgörbe laborban"),
  ],
};
