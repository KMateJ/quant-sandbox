import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, p } from "./blocks";

export const priceImpact: GuideLessonContent = {
  en: [
    p("A large order moves the price against itself: the more you buy, the higher the price you pay, and the more you sell, the lower. This lesson separates the two ways this happens, gives the empirical rule of thumb for how big the move is, and derives how to split an order over time. It builds on \"The limit order book\", where a market order walks through the queue of resting orders, and on \"Informed trading and Kyle's lambda\", where trades move the price because they carry information."),
    p("Prices are measured as fractions of the stock's price and quantities as multiples of the order itself, so a cost of $0.0025$ means 25 basis points (bp) of the order's value."),

    h("Temporary and permanent impact"),
    p("**Temporary impact** is what you pay for demanding liquidity quickly. A buy market order eats through the asks in the book, so its average price is above the quote before the trade. A few moments later new orders refill the book and the quote returns to roughly where it was. The cost is real, but it does not last."),
    p("**Permanent impact** is the part of the move that stays. If the market learns something from the trade, the price should move for good, which is exactly the linear price response $\\lambda$ of Kyle's model. In a clean data set both are read off prices before the order, during it and some time after: the move that has disappeared after a while was temporary, the move that is still there is permanent."),
    p("Permanent impact is the same for every way of executing the order, because it depends only on the total traded. Temporary impact is not, and that is what execution is about: trading slowly keeps it small."),

    h("The square-root rule"),
    p("Empirical studies of large equity orders find that the price move is not proportional to the order size but grows roughly with its square root:"),
    eq("\\frac{\\Delta P}{P} \\approx Y\\,\\sigma \\sqrt{\\frac{Q}{V}}."),
    p("Here $\\sigma$ is the daily volatility, $Q$ the number of shares in the order, $V$ the average daily volume, and $Y$ a constant of order 1. A stock with 2% daily volatility and an order of 5% of daily volume moves by about $2\\% \\times \\sqrt{0.05} \\approx 0.447\\%$, or 44.7 bp, with $Y = 1$."),
    p("Concavity has a consequence: doubling the order does not double the impact per share, it only multiplies it by $\\sqrt 2$. The total cost of $Q$ shares grows as $Q^{3/2}$, still faster than linearly, so splitting a big order over several days or hours lowers the cost per share."),
    {
      kind: "check",
      id: "price-impact/square-root",
      prompt: "A stock has 1.5% daily volatility. An order is 4% of the average daily volume. With $Y = 1$, what price impact does the square-root rule give, in per cent?",
      answer: { type: "number", value: 0.3, tolerance: 0.005 },
      explain: "$1.5\\% \\times \\sqrt{0.04} = 1.5\\% \\times 0.2 = 0.3\\%$.",
    },

    h("Splitting an order"),
    p("The rule says what an order costs when done at once; the Almgren–Chriss model says how to spread it out. A trader must sell $X$ shares within a horizon $T$ (one trading day below). Time is cut into $N$ intervals of length $\\tau = T/N$, with times $t_j = j\\tau$. Let $x_j$ be the number of shares still held at $t_j$, so $x_0 = X$ and $x_N = 0$, and let $n_j = x_{j-1} - x_j$ be the number sold in interval $j$."),
    p("Between trades the price follows a random walk with volatility $\\sigma$ per square-root day, and both impacts are assumed linear. Selling $n_j$ lowers the price for good by $\\gamma\\,n_j$ (permanent impact), and the trade itself is executed $\\eta\\,n_j/\\tau$ below the price before it (temporary impact, which depends on the trading rate $n_j/\\tau$). A fixed fee per share is left out, since it is the same for every schedule."),

    h("Expected cost and risk"),
    p("The cost of the liquidation is the initial value of the position minus the money collected. Adding up the two impacts gives two pieces, plus a random one from the price moves. Permanent impact costs $\\gamma\\,n_j$ on every share still held after trade $j$, and temporary impact costs $\\eta\\,n_j^2/\\tau$. Since $x_{j-1}^2 - x_j^2 = 2x_j n_j + n_j^2$, adding over $j$ gives $\\sum_j x_j n_j = \\tfrac12\\left(X^2 - \\sum_j n_j^2\\right)$, so the expected cost is"),
    eq("E = \\tfrac12\\,\\gamma X^2 + \\frac{\\tilde\\eta}{\\tau}\\sum_{j=1}^{N} n_j^2, \\qquad \\tilde\\eta = \\eta - \\tfrac12\\,\\gamma\\tau."),
    p("The first term does not depend on the schedule. The second is smallest when the squares are small, which happens when the trades are equal: slow, even selling minimises temporary impact. The random part of the cost comes from the price moving while shares are still held: in interval $j$ the position $x_j$ is exposed to a price change of variance $\\sigma^2\\tau$, so"),
    eq("V = \\sigma^2\\,\\tau \\sum_{j=1}^{N} x_j^2."),
    p("The variance is smallest when the shares are sold early, because the holdings $x_j$ are then small. The two goals pull in opposite directions: cost wants an even schedule, risk wants a fast one. This is the same kind of conflict as between return and risk in \"Risk aversion and the optimal complete portfolio\"."),
    {
      kind: "check",
      id: "price-impact/risk-neutral",
      prompt: "A trader who does not care about risk ($\\lambda_{\\text{risk}} = 0$) faces linear impact. How should the order be split?",
      answer: { type: "choice", options: ["Evenly over the horizon", "All at the start", "All at the end", "In a random order"], correct: 0 },
      explain: "Only the cost matters, and $\\sum n_j^2$ for a fixed total is smallest when all $n_j$ are equal. This is the even schedule often called TWAP, time-weighted average price.",
    },

    h("The optimal schedule"),
    p("A trader who dislikes risk minimises $E + \\lambda_{\\text{risk}}V$, where $\\lambda_{\\text{risk}}$ is the risk aversion. (This is not Kyle's $\\lambda$, the price response to order flow; the subscript keeps them apart.) Setting the derivative with respect to each interior holding $x_j$ to zero gives"),
    eq("\\frac{2\\tilde\\eta}{\\tau}\\left(x_{j-1} - 2x_j + x_{j+1}\\right) = 2\\lambda_{\\text{risk}}\\sigma^2\\tau\\,x_j \\;\\Longrightarrow\\; x_{j-1} - 2x_j + x_{j+1} = \\tilde\\kappa^2\\tau^2\\,x_j, \\qquad \\tilde\\kappa^2 = \\frac{\\lambda_{\\text{risk}}\\sigma^2}{\\tilde\\eta}."),
    p("Trying $x_j \\propto e^{\\pm\\kappa t_j}$ turns this into $2\\cosh(\\kappa\\tau) - 2 = \\tilde\\kappa^2\\tau^2$. With the boundary values $x_0 = X$ and $x_N = 0$ the solution is"),
    eq("x_j = X\\,\\frac{\\sinh\\big(\\kappa\\,(T - t_j)\\big)}{\\sinh(\\kappa T)}, \\qquad \\cosh(\\kappa\\tau) = 1 + \\tfrac12\\,\\tilde\\kappa^2\\tau^2."),
    p("The parameter $\\kappa$ sets how fast the holding runs down. When $\\lambda_{\\text{risk}} \\to 0$, $\\kappa \\to 0$ and the formula becomes the straight line $x_j = X(T - t_j)/T$, the even schedule. The larger $\\lambda_{\\text{risk}}$ is, or the larger the volatility, or the smaller the temporary impact $\\eta$, the larger $\\kappa$ is and the more of the order is sold at the start."),
    {
      kind: "check",
      id: "price-impact/front-loading",
      prompt: "The market becomes more volatile while the temporary impact stays the same. How does the optimal schedule change?",
      answer: { type: "choice", options: ["More is sold early", "More is sold late", "It becomes even", "It does not change"], correct: 0 },
      explain: "A larger $\\sigma$ raises $\\tilde\\kappa$, so the holding runs down faster: the risk of holding shares is now worth more than the extra temporary impact of selling them quickly.",
    },

    h("The efficient frontier of execution"),
    p("Each value of $\\lambda_{\\text{risk}}$ gives one schedule, with its own expected cost and standard deviation $\\sqrt V$. Plotting them gives a curve like the efficient frontier of a portfolio: no schedule has both a lower cost and a lower risk than a point on the curve, and the trader picks the point that suits the risk aversion. The even schedule is the end with the lowest cost and the highest risk; selling everything at once is the end with the highest cost and no risk from price moves."),
    p("The figure sells the order in 20 slices over one day. The left chart shows how much is still held at each time, for the chosen risk aversion (solid) and for the even schedule (dashed). The right chart is the frontier; drag the dot along it to change the risk aversion. At the defaults ($\\lambda_{\\text{risk}} = 100$, 2% daily volatility, $\\eta = 20$ bp) the expected cost is 49.3 bp with a standard deviation of 59.3 bp, and 67.5% of the order is sold in the first quarter of the day. The even schedule costs about 25 bp with a standard deviation of 111 bp, so the extra 24 bp of cost buys a cut in risk of almost half. Lower the risk aversion to see the schedule straighten, and raise the volatility to see it bend again."),
    figure("execution-frontier"),

    h("A worked example"),
    p("First the rule of thumb, then the smallest possible schedule that shows the trade-off. In the toy case, $X = 2$ shares are sold in $N = 2$ intervals of length $\\tau = 1$, with $\\sigma = 1$, $\\tilde\\eta = 1$ and no permanent impact."),
    {
      kind: "worked",
      title: "Square-root impact and a two-interval schedule",
      steps: [
        { text: "Square-root rule for a 2% daily volatility stock and an order of 5% of daily volume, in per cent.", tex: "2\\% \\times \\sqrt{0.05}", result: { value: 0.447, tolerance: 0.001 } },
        { text: "Sell 1 then 1: the holdings are $x = (2, 1, 0)$ and $n = (1, 1)$. The cost is $\\tilde\\eta\\sum n_j^2/\\tau$.", tex: "E = 1^2 + 1^2", result: { value: 2, tolerance: 0.001 } },
        { text: "The variance of the even schedule counts the holdings after trading, $x_1 = 1$ and $x_2 = 0$.", tex: "V = \\sigma^2\\tau\\,(1^2 + 0^2)", result: { value: 1, tolerance: 0.001 } },
        { text: "Sell 2 then 0: the whole order goes in the first interval, so $n = (2, 0)$ and the cost is higher.", tex: "E = 2^2 + 0^2", result: { value: 4, tolerance: 0.001 } },
        { text: "Nothing is held after the first interval, so there is no price risk.", tex: "V = 1\\cdot 1\\cdot(0^2 + 0^2)", result: { value: 0, tolerance: 0.001 } },
        { text: "The two schedules are equally good when $2 + \\lambda_{\\text{risk}}\\cdot 1 = 4 + \\lambda_{\\text{risk}}\\cdot 0$.", tex: "\\lambda_{\\text{risk}} = 2", result: { value: 2, tolerance: 0.001 } },
      ],
    },
    p("A trader with $\\lambda_{\\text{risk}} < 2$ prefers to sell evenly, and one with $\\lambda_{\\text{risk}} > 2$ prefers to sell at once. The sinh formula is the same decision with many intervals, where the best answer lies in between."),

    h("Summary"),
    list(
      "Temporary impact fades after the trade and depends on how fast you trade; permanent impact stays and depends only on the total traded.",
      "Empirically the price move of a large order is about $Y\\sigma\\sqrt{Q/V}$, concave in the order size.",
      "With linear impact the expected cost is $\\tfrac12\\gamma X^2 + (\\tilde\\eta/\\tau)\\sum n_j^2$ and the variance is $\\sigma^2\\tau\\sum x_j^2$; the first prefers even trading, the second fast trading.",
      "Minimising cost plus $\\lambda_{\\text{risk}}$ times variance gives $x_j = X\\sinh(\\kappa(T - t_j))/\\sinh(\\kappa T)$: a straight line for a risk-neutral trader and more front-loading as risk aversion or volatility grows.",
      "The (risk, cost) pairs of all schedules form an efficient frontier, like the one for portfolios.",
    ),
    lab("/order-book", "Walk the book with market orders in the Order Book lab"),
  ],
  hu: [
    p("Egy nagy megbízás saját maga ellen mozgatja az árat: minél többet veszel, annál magasabb áron veszel, és minél többet adsz el, annál alacsonyabban. A lecke megkülönbözteti ennek a két módját, megadja a mozgás méretének tapasztalati ökölszabályát, és levezeti, hogyan érdemes egy megbízást az időben szétosztani. Két korábbi leckére épít: „A limitáras ajánlati könyv” megmutatja, hogyan megy végig egy piaci megbízás a várakozó megbízásokon, az „Informált kereskedés és Kyle lambdája” pedig azt, hogyan mozdítják az árat a kötések, mert információt hordoznak."),
    p("Az árakat a részvényár törtrészében, a mennyiségeket a megbízás méretének többszöröseként mérjük, így a $0{,}0025$ költség a megbízás értékének 25 bázispontját (bp) jelenti."),

    h("Átmeneti és tartós árhatás"),
    p("Az **átmeneti árhatás** az az ár, amelyet a gyors likviditásigényért fizetsz. A vételi piaci megbízás végigfogyasztja a könyv eladási oldalát, így az átlagára a kötés előtti jegyzés fölött van. Néhány pillanattal később új megbízások töltik fel a könyvet, és a jegyzés nagyjából visszatér. A költség valódi, de nem tartós."),
    p("A **tartós árhatás** a mozgásnak az a része, amely megmarad. Ha a piac tanul a kötésből, az árnak végleg el kell mozdulnia: ez éppen Kyle modelljének lineáris árreakciója, a $\\lambda$. Valós adatokon mindkettő leolvasható a megbízás előtti, alatti és egy idővel utáni árakból: ami egy idő után eltűnt, az átmeneti volt, ami megmaradt, az tartós."),
    p("A tartós árhatás minden végrehajtási módnál ugyanakkora, mert csak az összes kereskedett mennyiségtől függ. Az átmeneti árhatás nem, és a végrehajtás éppen erről szól: lassú kereskedéssel kicsi marad."),

    h("A négyzetgyök-szabály"),
    p("A nagy részvénymegbízásokon végzett vizsgálatok szerint az árhatás nem a megbízás méretével arányos, hanem nagyjából a négyzetgyökével nő:"),
    eq("\\frac{\\Delta P}{P} \\approx Y\\,\\sigma \\sqrt{\\frac{Q}{V}}."),
    p("Itt $\\sigma$ a napi volatilitás, $Q$ a megbízás részvényszáma, $V$ az átlagos napi forgalom, $Y$ pedig egy 1 nagyságrendű állandó. Egy 2%-os napi volatilitású részvényen a napi forgalom 5%-át kitevő megbízás $Y = 1$ mellett nagyjából $2\\% \\times \\sqrt{0{,}05} \\approx 0{,}447\\%$-ot, azaz 44,7 bp-ot mozdít."),
    p("A konkávitásnak következménye van: a megbízás megkétszerezése nem kétszerezi meg a részvényenkénti árhatást, csak $\\sqrt 2$-szeresére növeli. A $Q$ részvény összköltsége $Q^{3/2}$ szerint nő, ez még mindig gyorsabb a lineárisnál, ezért egy nagy megbízás több napra vagy órára szétosztása csökkenti a részvényenkénti költséget."),
    {
      kind: "check",
      id: "price-impact/square-root",
      prompt: "Egy részvény napi volatilitása 1,5%. A megbízás az átlagos napi forgalom 4%-a. $Y = 1$ mellett mekkora árhatást ad a négyzetgyök-szabály, százalékban?",
      answer: { type: "number", value: 0.3, tolerance: 0.005 },
      explain: "$1{,}5\\% \\times \\sqrt{0{,}04} = 1{,}5\\% \\times 0{,}2 = 0{,}3\\%$.",
    },

    h("Egy megbízás szétosztása"),
    p("A szabály azt mondja meg, mennyibe kerül a megbízás egyszerre végrehajtva; az Almgren–Chriss-modell azt, hogyan érdemes elosztani. Egy kereskedőnek $X$ részvényt kell eladnia a $T$ időtávon belül (lent egy kereskedési nap). Az időt $N$ darab $\\tau = T/N$ hosszú szakaszra vágjuk, az időpontok $t_j = j\\tau$. Legyen $x_j$ a $t_j$ időpontban még birtokolt részvények száma, így $x_0 = X$ és $x_N = 0$, és legyen $n_j = x_{j-1} - x_j$ a $j$-edik szakaszban eladott mennyiség."),
    p("A kötések között az ár véletlen bolyongást követ, négyzetgyök-naponként $\\sigma$ volatilitással, és mindkét árhatás lineáris. $n_j$ eladása végleg $\\gamma\\,n_j$-vel viszi lejjebb az árat (tartós árhatás), maga a kötés pedig $\\eta\\,n_j/\\tau$-val a kötés előtti ár alatt teljesül (átmeneti árhatás, amely a kereskedési ütemtől, $n_j/\\tau$-tól függ). A részvényenkénti fix díjat kihagyjuk, mert minden ütemezésnél ugyanannyi."),

    h("Várható költség és kockázat"),
    p("A felszámolás költsége a pozíció kezdeti értéke mínusz a befolyt pénz. A két árhatás két tagot ad, a véletlen ármozgások pedig egy véletlen tagot. A tartós árhatás minden, a $j$-edik kötés után még birtokolt részvényen $\\gamma\\,n_j$-be kerül, az átmeneti árhatás pedig $\\eta\\,n_j^2/\\tau$-ba. Mivel $x_{j-1}^2 - x_j^2 = 2x_j n_j + n_j^2$, a $j$ szerinti összegzés $\\sum_j x_j n_j = \\tfrac12\\left(X^2 - \\sum_j n_j^2\\right)$-t ad, így a várható költség"),
    eq("E = \\tfrac12\\,\\gamma X^2 + \\frac{\\tilde\\eta}{\\tau}\\sum_{j=1}^{N} n_j^2, \\qquad \\tilde\\eta = \\eta - \\tfrac12\\,\\gamma\\tau."),
    p("Az első tag nem függ az ütemezéstől. A második akkor a legkisebb, ha a négyzetek kicsik, vagyis a kötések egyformák: a lassú, egyenletes eladás minimalizálja az átmeneti árhatást. A költség véletlen része abból jön, hogy az ár mozog, amíg részvényeket birtokolsz: a $j$-edik szakaszban az $x_j$ pozíció $\\sigma^2\\tau$ szórásnégyzetű árváltozásnak van kitéve, tehát"),
    eq("V = \\sigma^2\\,\\tau \\sum_{j=1}^{N} x_j^2."),
    p("A szórásnégyzet akkor a legkisebb, ha korán eladsz, mert akkor kicsik az $x_j$ állományok. A két cél ellentétes irányba húz: a költség egyenletes ütemezést kér, a kockázat gyorsat. Ez ugyanolyan konfliktus, mint a hozam és a kockázat között a „Kockázatkerülés és az optimális teljes portfólió” leckében."),
    {
      kind: "check",
      id: "price-impact/risk-neutral",
      prompt: "Egy kockázatsemleges kereskedő ($\\lambda_{\\text{kock}} = 0$) lineáris árhatással szembesül. Hogyan érdemes szétosztania a megbízást?",
      answer: { type: "choice", options: ["Egyenletesen a teljes időtávon", "Mindet az elején", "Mindet a végén", "Véletlen sorrendben"], correct: 0 },
      explain: "Csak a költség számít, és adott összeg mellett $\\sum n_j^2$ akkor a legkisebb, ha minden $n_j$ egyenlő. Ez az egyenletes ütemezés, amelyet gyakran TWAP-nak, időarányos átlagárnak neveznek.",
    },

    h("Az optimális ütemezés"),
    p("A kockázatkerülő kereskedő az $E + \\lambda_{\\text{kock}}V$ kifejezést minimalizálja, ahol $\\lambda_{\\text{kock}}$ a kockázatkerülés. (Ez nem Kyle $\\lambda$-ja, az árreakció a megbízási folyamra; az alsó index választja szét őket.) Ha minden belső $x_j$ szerinti deriváltat nullával teszünk egyenlővé, azt kapjuk, hogy"),
    eq("\\frac{2\\tilde\\eta}{\\tau}\\left(x_{j-1} - 2x_j + x_{j+1}\\right) = 2\\lambda_{\\text{kock}}\\sigma^2\\tau\\,x_j \\;\\Longrightarrow\\; x_{j-1} - 2x_j + x_{j+1} = \\tilde\\kappa^2\\tau^2\\,x_j, \\qquad \\tilde\\kappa^2 = \\frac{\\lambda_{\\text{kock}}\\sigma^2}{\\tilde\\eta}."),
    p("Az $x_j \\propto e^{\\pm\\kappa t_j}$ próbafüggvény ezt $2\\cosh(\\kappa\\tau) - 2 = \\tilde\\kappa^2\\tau^2$-re alakítja. Az $x_0 = X$ és $x_N = 0$ peremfeltételekkel a megoldás"),
    eq("x_j = X\\,\\frac{\\sinh\\big(\\kappa\\,(T - t_j)\\big)}{\\sinh(\\kappa T)}, \\qquad \\cosh(\\kappa\\tau) = 1 + \\tfrac12\\,\\tilde\\kappa^2\\tau^2."),
    p("A $\\kappa$ paraméter azt adja meg, milyen gyorsan fogy az állomány. Ha $\\lambda_{\\text{kock}} \\to 0$, akkor $\\kappa \\to 0$, és a képlet az $x_j = X(T - t_j)/T$ egyenesbe megy át, az egyenletes ütemezésbe. Minél nagyobb a $\\lambda_{\\text{kock}}$ vagy a volatilitás, és minél kisebb az $\\eta$ átmeneti árhatás, annál nagyobb a $\\kappa$, és annál nagyobb részt adunk el a megbízásból az elején."),
    {
      kind: "check",
      id: "price-impact/front-loading",
      prompt: "A piac volatilisabb lesz, miközben az átmeneti árhatás ugyanakkora marad. Hogyan változik az optimális ütemezés?",
      answer: { type: "choice", options: ["Többet adunk el korán", "Többet adunk el későn", "Egyenletessé válik", "Nem változik"], correct: 0 },
      explain: "Nagyobb $\\sigma$ növeli a $\\tilde\\kappa$-t, így az állomány gyorsabban fogy: a részvények tartásának kockázata most többet ér, mint a gyors eladás extra átmeneti árhatása.",
    },

    h("A végrehajtás hatékony frontja"),
    p("A $\\lambda_{\\text{kock}}$ minden értékéhez tartozik egy ütemezés, saját várható költséggel és $\\sqrt V$ szórással. Ezeket ábrázolva a portfóliók hatékony frontjához hasonló görbét kapunk: a görbe egyetlen pontjánál sincs olyan ütemezés, amelynek költsége és kockázata is kisebb, a kereskedő pedig a kockázatkerüléséhez illő pontot választja. Az egyenletes ütemezés a legkisebb költségű és legnagyobb kockázatú vég; az egyszerre eladás a legnagyobb költségű, és az ármozgásoktól mentes vég."),
    p("Az ábra egy nap alatt, 20 szakaszban adja el a megbízást. A bal oldali grafikon azt mutatja, mennyi marad meg az egyes időpontokban a választott kockázatkerüléssel (folytonos vonal) és az egyenletes ütemezéssel (szaggatott vonal). A jobb oldali a front: húzd rajta a pontot, és változik a kockázatkerülés. Az alapértékeknél ($\\lambda_{\\text{kock}} = 100$, 2% napi volatilitás, $\\eta = 20$ bp) a várható költség 49,3 bp, a szórás 59,3 bp, és a nap első negyedében a megbízás 67,5%-a elkel. Az egyenletes ütemezés költsége nagyjából 25 bp, a szórása 111 bp, vagyis a további 24 bp költség a kockázatot majdnem a felére csökkenti. Csökkentsd a kockázatkerülést, és az ütemezés kiegyenesedik, növeld a volatilitást, és újra görbül."),
    figure("execution-frontier"),

    h("Egy részletes példa"),
    p("Először az ökölszabály, aztán a lehető legkisebb ütemezés, amelyen látszik az átváltás. A játékpéldában $X = 2$ részvényt adunk el $N = 2$ darab, $\\tau = 1$ hosszú szakaszban, $\\sigma = 1$, $\\tilde\\eta = 1$ értékekkel és tartós árhatás nélkül."),
    {
      kind: "worked",
      title: "Négyzetgyök-árhatás és egy kétszakaszos ütemezés",
      steps: [
        { text: "A négyzetgyök-szabály egy 2% napi volatilitású részvényre és a napi forgalom 5%-át kitevő megbízásra, százalékban.", tex: "2\\% \\times \\sqrt{0{,}05}", result: { value: 0.447, tolerance: 0.001 } },
        { text: "Eladunk 1-et, majd még 1-et: az állomány $x = (2, 1, 0)$, $n = (1, 1)$. A költség $\\tilde\\eta\\sum n_j^2/\\tau$.", tex: "E = 1^2 + 1^2", result: { value: 2, tolerance: 0.001 } },
        { text: "Az egyenletes ütemezés szórásnégyzete a kereskedés utáni állományokat számolja, $x_1 = 1$ és $x_2 = 0$.", tex: "V = \\sigma^2\\tau\\,(1^2 + 0^2)", result: { value: 1, tolerance: 0.001 } },
        { text: "Eladunk 2-t, majd 0-t: az egész megbízás az első szakaszban megy el, $n = (2, 0)$, és a költség nagyobb.", tex: "E = 2^2 + 0^2", result: { value: 4, tolerance: 0.001 } },
        { text: "Az első szakasz után semmink sincs, így nincs ármozgási kockázat.", tex: "V = 1\\cdot 1\\cdot(0^2 + 0^2)", result: { value: 0, tolerance: 0.001 } },
        { text: "A két ütemezés akkor egyformán jó, ha $2 + \\lambda_{\\text{kock}}\\cdot 1 = 4 + \\lambda_{\\text{kock}}\\cdot 0$.", tex: "\\lambda_{\\text{kock}} = 2", result: { value: 2, tolerance: 0.001 } },
      ],
    },
    p("A $\\lambda_{\\text{kock}} < 2$ kereskedő egyenletesen, a $\\lambda_{\\text{kock}} > 2$ egyszerre ad el. A sinh-képlet ugyanez a döntés sok szakaszra, ahol a legjobb válasz a kettő között van."),

    h("Összefoglalás"),
    list(
      "Az átmeneti árhatás a kötés után elhal, és a kereskedés gyorsaságától függ; a tartós árhatás megmarad, és csak az összes kereskedett mennyiségtől függ.",
      "Tapasztalatilag egy nagy megbízás árhatása nagyjából $Y\\sigma\\sqrt{Q/V}$, a megbízás méretének konkáv függvénye.",
      "Lineáris árhatásnál a várható költség $\\tfrac12\\gamma X^2 + (\\tilde\\eta/\\tau)\\sum n_j^2$, a szórásnégyzet $\\sigma^2\\tau\\sum x_j^2$; az első egyenletes, a második gyors kereskedést kér.",
      "A költség plusz $\\lambda_{\\text{kock}}$-szor a szórásnégyzet minimalizálása az $x_j = X\\sinh(\\kappa(T - t_j))/\\sinh(\\kappa T)$ ütemezést adja: kockázatsemleges kereskedőnek egyenest, a kockázatkerülés vagy a volatilitás növekedésével pedig egyre inkább előre hozott eladást.",
      "Az ütemezések (kockázat, költség) párjai hatékony frontot alkotnak, mint a portfóliók esetében.",
    ),
    lab("/order-book", "Járd végig a könyvet piaci megbízásokkal az Ajánlati könyv laborban"),
  ],
};
