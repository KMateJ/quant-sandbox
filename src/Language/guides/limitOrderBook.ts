import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const limitOrderBook: GuideLessonContent = {
  en: [
    p("\"Market makers and liquidity\" described what a market maker does: it quotes a bid and an ask and earns the spread for standing ready to trade. This lesson builds the machine those quotes live in, the **limit order book**. It defines the two kinds of order, shows how the book is organised and who gets filled first, and then follows a large market order down the book to measure what it costs to trade size."),
    p("Prices are quoted in USD per share, and a **tick** is the smallest allowed price step, 0.01 here. Sizes are in shares."),

    h("Orders"),
    p("A **limit order** has three parts: a side (buy or sell), a price and a size. It says: trade up to this size, at this price or better. A buy limit order at 99.99 accepts any price of 99.99 or lower. If nothing on the other side is willing to trade at that price, the order **rests** in the book and waits. Resting orders are what provide liquidity."),
    p("A **market order** has a side and a size but no price. It trades immediately against the best resting orders on the opposite side, whatever their prices are. A market buy hits resting sell orders; a market sell hits resting buy orders. It takes liquidity instead of providing it."),
    p("A limit order whose price already reaches the other side, such as a buy at 100.05 when the best sell is at 100.01, is **marketable**. The part that can trade does so at once, at the resting orders' prices, and any remainder rests at the limit price. A resting order can also be **cancelled** at any time, which removes it from the book without a trade."),

    h("The book"),
    p("The book collects all resting limit orders. Buy orders are the **bids** and sell orders the **asks**. Bids are sorted from the highest price down, asks from the lowest price up, so the best prices of both sides face each other in the middle."),
    p("The **best bid** $b$ is the highest bid and the **best ask** $a$ the lowest ask. Together they are the **touch**. The **spread** is $a - b$, and the **mid price** is their average:"),
    eq("m = \\frac{a + b}{2}."),
    p("At each price the book keeps a **level**, the queue of orders resting there. The **depth** of a level is the total size of its orders, and the **cumulative depth** at a level is the depth of that level plus all better ones on its side. In the examples below the best bid is 99.99 and the best ask 100.01, so the mid is 100.00 and the spread is two ticks."),

    h("Price–time priority"),
    p("When a market order arrives, the book needs a rule for which resting order trades first. Almost every exchange uses **price–time priority**: orders at a better price trade first (higher for bids, lower for asks), and among orders at the same price the one that arrived earlier trades first. A level is therefore a first-in, first-out queue."),
    p("Both parts of the rule reward the people who provide liquidity. A better price moves an order to the front of the book, and an earlier arrival moves it to the front of its queue. The price rule pushes quotes towards each other and narrows the spread; the time rule rewards speed, and it is why a later lesson on queues treats a place in the line as something worth having. Cancelling an order and re-entering it, even at the same price, sends it to the back of the queue."),
    {
      kind: "check",
      id: "limit-order-book/priority",
      prompt: "Two buy orders make up the best bid, both at 99.97: 500 shares entered at 09:30:01 and 2,000 shares entered at 09:30:05. A market sell of 600 shares arrives. Who is filled?",
      answer: {
        type: "choice",
        options: [
          "The 2,000 in full, because it is the larger order",
          "The 500 in full, then 100 of the 2,000",
          "Both pro rata to their size: 120 and 480",
          "Neither: the market sell trades at the mid price instead",
        ],
        correct: 1,
      },
      explain: "At the same price the earlier order has priority. The 500 trades in full, and the remaining 100 shares of the market sell go to the second order, which keeps 1,900 resting. Size does not matter, the book does not share fills pro rata, and a market order trades at the resting orders' prices, not at the mid.",
    },

    h("Walking the book"),
    p("A market buy of size $Q$ takes the whole of the best ask level first. If that is not enough, it moves to the next ask level, and so on until all $Q$ shares are bought. The order **walks the book**. Suppose it takes $q_i$ shares at price $p_i$ at the $i$-th level it reaches, so that $\\sum_i q_i = Q$. Its **average price** is the size-weighted average of those prices:"),
    eq("\\bar p = \\frac{\\sum_i p_i\\, q_i}{\\sum_i q_i}."),
    p("The measure of cost is **slippage**, the gap between the average price and the mid price at the moment the order was sent. For a buy it is positive when $\\bar p$ is above $m$, and it is quoted in **basis points** (bp, one hundredth of a percent) of the mid. In dollars, the total cost of the order against the mid is the shares times the price gap:"),
    eq("\\text{slippage} = \\frac{\\bar p - m}{m}\\cdot 10^{4}\\ \\text{bp}, \\qquad \\text{cost} = Q\\,(\\bar p - m)."),
    p("For a market sell the signs flip: the order receives $\\bar p$ below the mid, so slippage is $(m - \\bar p)/m$. Even a one-share order pays something. With the best ask at 100.01 and the mid at 100.00, it costs 0.01 per share, or 1 bp. That is half the spread, the price of immediacy from the previous lesson."),
    {
      kind: "check",
      id: "limit-order-book/average",
      prompt: "The asks are 50.00 for 200 shares and 50.01 for 300 shares. A market buy of 400 shares arrives. What is its average price in USD?",
      answer: { type: "number", value: 50.005, tolerance: 0.0005 },
      explain: "The order takes 200 shares at 50.00 and the other 200 at 50.01, so $\\bar p = (50.00 \\cdot 200 + 50.01 \\cdot 200)/400 = 50.005$.",
    },
    {
      kind: "worked",
      title: "A market buy of 1,600 shares",
      steps: [
        { text: "The asks are 100.01 for 318 shares, 100.02 for 311, 100.03 for 518 and 100.04 for 453. The first three levels are taken in full, so the fourth level supplies the rest of the order.", tex: "1600 - 318 - 311 - 518 = 453", result: { value: 453, tolerance: 0 } },
        { text: "The order consumes all four levels exactly. Its notional value is the sum of price times shares over the levels, in USD.", tex: "318\\cdot 100.01 + 311\\cdot 100.02 + 518\\cdot 100.03 + 453\\cdot 100.04", result: { value: 160043.06, tolerance: 0.01 } },
        { text: "Divide by the 1,600 shares to get the average price.", tex: "\\bar p = 160043.06 / 1600", result: { value: 100.0269, tolerance: 0.0001 } },
        { text: "Slippage against the mid of 100.00, in basis points.", tex: "\\frac{100.0269 - 100.00}{100.00}\\cdot 10^{4}", result: { value: 2.69, tolerance: 0.01 } },
        { text: "Cost against the mid in USD.", tex: "1600\\,(100.0269125 - 100.00)", result: { value: 43.06, tolerance: 0.01 } },
      ],
    },

    h("Depth and the cost of size"),
    p("The worked example shows the pattern: every extra level costs one more tick. To see how the cost grows with size, take a simple book in which every level holds the same depth $d$ and the best ask is $h$ ticks above the mid (here $h = 1$). Level $j = 1, 2, \\dots$ then sits $h + j - 1$ ticks above the mid."),
    p("A buy of $Q = k\\,d$ shares takes $k$ complete levels. Its average distance above the mid is the average of those $k$ distances, and the arithmetic series $\\sum_{j=1}^{k}(j-1) = k(k-1)/2$ gives"),
    eq("\\bar p - m = \\left(h + \\frac{k-1}{2}\\right)\\text{ticks}, \\qquad k = \\frac{Q}{d}."),
    p("Slippage is therefore about linear in size: a fixed part $h$ for the spread and a part that grows by $1/(2d)$ ticks for every extra share. Multiplying by $Q$ gives the total cost in ticks:"),
    eq("Q\\,(\\bar p - m) = Q\\,h + \\frac{Q^2}{2d} - \\frac{Q}{2}\\;\\approx\\;\\frac{Q^2}{2d}\\quad\\text{for large } Q."),
    p("Total cost grows with the square of the size. Doubling an order roughly quadruples the part of its cost that comes from walking the book, because it takes twice as many levels and each of its shares is also dearer on average. Deep books, with a large $d$, flatten this. Real books are usually thinner at the touch and thicker further out, so the first levels are the expensive ones and the curve eventually bends over; the quadratic rule is a guide for moderate sizes, not a law."),
    {
      kind: "check",
      id: "limit-order-book/depth-cost",
      prompt: "In a book with the same depth at every level, a market buy of size Q walks the book and costs C against the mid, ignoring the spread. Roughly what does a market buy of size 2Q cost?",
      answer: { type: "choice", options: ["About 2C", "About 3C", "About 4C", "About 8C"], correct: 2 },
      explain: "It takes twice as many levels, so the average gap above the mid doubles, and it buys twice as many shares at that gap. The cost is $Q^2/(2d)$ in ticks, which multiplies by $2^2 = 4$.",
    },
    p("The figure runs this experiment on a book with ten levels a side, about 450 shares each beyond the first four. Choose a market buy or sell and drag the size: the rows the order consumes are highlighted, and the curve beside them shows slippage against size, with a marker at the chosen size. At the default of 1,600 shares it reproduces the worked example, four levels and 2.69 bp, costing 43.06 USD. A single level of 100 shares costs 1.00 bp. Double the size to 3,200 and eight levels are hit: slippage rises to 4.50 bp and the cost to 144.06 USD, more than three times as much for twice the shares."),
    figure("book-walk"),
    note("A market order at the touch pays half the spread, and every further level adds a tick to the average price. Cost against the mid is $Q(\\bar p - m)$, which grows roughly like $Q^2$ in a book of even depth."),

    h("Summary"),
    list(
      "A limit order has a side, a price and a size, and rests in the book until it trades or is cancelled; a market order has no price and trades at once against the opposite side.",
      "The book keeps bids from high to low and asks from low to high, with the best bid, the best ask, the spread and the mid $m = (a+b)/2$ at the touch.",
      "Price–time priority fills better prices first and earlier orders first within a price, so each level is a first-in, first-out queue.",
      "A market order walks the book at average price $\\bar p = \\sum p_i q_i / \\sum q_i$, with slippage $(\\bar p - m)/m$ and cost $Q(\\bar p - m)$.",
      "Even depth makes slippage about linear in size and total cost about proportional to $Q^2$, so size is expensive.",
    ),
    lab("/order-book", "Walk the book with market orders in the Order Book lab"),
  ],

  hu: [
    p("A „Market makerek és a likviditás” bemutatta, mit csinál egy market maker (árjegyző): bid és ask árat jegyez, és a spreadet keresi azzal, hogy mindig kész kereskedni. Ez a lecke felépíti a gépezetet, amelyben ezek a jegyzések élnek, a **limitáras ajánlati könyvet**. Meghatározza a két megbízástípust, megmutatja, hogyan épül fel a könyv és kinek a megbízása teljesül előbb, majd egy nagy piaci megbízást követ végig a könyvön, hogy kiderüljön, mennyibe kerül nagy méretet kereskedni."),
    p("Az árak USD/részvényben értendők, a **tick** a legkisebb megengedett árlépés, itt 0,01. A méretek részvényben vannak megadva."),

    h("Megbízások"),
    p("A **limitáras megbízásnak** három része van: oldal (vétel vagy eladás), ár és méret. Azt mondja: legfeljebb ekkora mennyiséget, ezen az áron vagy jobbon. A 99,99-es vételi limit minden 99,99 vagy annál alacsonyabb árat elfogad. Ha a másik oldalon senki sem hajlandó ezen az áron kereskedni, a megbízás **a könyvben marad** és vár. A várakozó megbízások adják a likviditást."),
    p("A **piaci megbízásnak** van oldala és mérete, de ára nincs. Azonnal a szemközti oldal legjobb várakozó megbízásaival köt, az áraiktól függetlenül. A piaci vétel a várakozó eladásokat viszi el, a piaci eladás a várakozó vételeket. Likviditást elvesz, nem nyújt."),
    p("Az a limitáras megbízás, amelynek ára már eléri a másik oldalt, például 100,05-ös vétel, miközben a legjobb eladás 100,01, **azonnal teljesíthető**. A teljesíthető rész azonnal köt a várakozó megbízások árain, a maradék pedig a limitáron vár. A várakozó megbízás bármikor **visszavonható**, ekkor kötés nélkül kikerül a könyvből."),

    h("Az ajánlati könyv"),
    p("A könyv az összes várakozó limitáras megbízást tartalmazza. A vételi megbízások a **bidek**, az eladásiak az **askok**. A bidek a legmagasabb ártól lefelé, az askok a legalacsonyabbtól felfelé vannak rendezve, így a két oldal legjobb árai középen néznek egymással szembe."),
    p("A **legjobb bid** $b$ a legmagasabb vételi ár, a **legjobb ask** $a$ a legalacsonyabb eladási ár. Együtt ők a **touch**. A **spread** $a - b$, a **mid ár** pedig a kettő átlaga:"),
    eq("m = \\frac{a + b}{2}."),
    p("Minden árhoz a könyv egy **szintet** tart nyilván, az ott várakozó megbízások sorát. A szint **mélysége** a megbízásai méretének összege, a **halmozott mélység** pedig az adott szint és a nála jobb szintek mélységének összege az adott oldalon. Az alábbi példákban a legjobb bid 99,99, a legjobb ask 100,01, tehát a mid 100,00 és a spread két tick."),

    h("Ár–idő prioritás"),
    p("Amikor piaci megbízás érkezik, a könyvnek szabály kell arra, melyik várakozó megbízás köt először. Szinte minden tőzsde **ár–idő prioritást** alkalmaz: a jobb árú megbízás köt előbb (bidnél a magasabb, asknál az alacsonyabb), azonos áron pedig az, amelyik korábban érkezett. Egy szint így érkezési sorrendű (FIFO) sor."),
    p("A szabály mindkét fele a likviditásnyújtót jutalmazza. A jobb ár a könyv elejére viszi a megbízást, a korábbi érkezés pedig a sor elejére. Az ár szerinti szabály egymás felé húzza a jegyzéseket és szűkíti a spreadet, az idő szerinti a gyorsaságot díjazza, és ezért lesz egy későbbi, sorokról szóló leckében a helyezés a sorban értékes dolog. A megbízás visszavonása és újbóli beadása, még azonos áron is, a sor végére küldi."),
    {
      kind: "check",
      id: "limit-order-book/priority",
      prompt: "Két vételi megbízás alkotja a legjobb bidet, mindkettő 99,97-en: 500 részvény, beadva 09:30:01-kor, és 2 000 részvény, beadva 09:30:05-kor. 600 részvényes piaci eladás érkezik. Kinek a megbízása teljesül?",
      answer: {
        type: "choice",
        options: [
          "A 2 000-é teljesen, mert az a nagyobb megbízás",
          "A 500-é teljesen, majd a 2 000-ből 100",
          "Mindkettőé a méretük arányában: 120 és 480",
          "Egyiké sem: a piaci eladás ehelyett a mid áron köt",
        ],
        correct: 1,
      },
      explain: "Azonos áron a korábbi megbízásnak van prioritása. Az 500 teljesen köt, a piaci eladás maradék 100 részvénye a másodikhoz kerül, amelyből 1 900 vár tovább. A méret nem számít, a könyv nem osztja szét arányosan a teljesüléseket, és a piaci megbízás a várakozó megbízások árán köt, nem a mid áron.",
    },

    h("Végighaladás a könyvön"),
    p("Egy $Q$ méretű piaci vétel először a legjobb ask szint egészét viszi el. Ha ez nem elég, a következő ask szintre lép, és így tovább, amíg mind a $Q$ részvényt meg nem vette. A megbízás **végighalad a könyvön**. Legyen a megbízás által elért $i$-edik szinten $q_i$ részvény $p_i$ áron, úgy, hogy $\\sum_i q_i = Q$. Az **átlagára** ezen árak méret szerint súlyozott átlaga:"),
    eq("\\bar p = \\frac{\\sum_i p_i\\, q_i}{\\sum_i q_i}."),
    p("A költség mércéje a **csúszás** (slippage), az átlagár és a megbízás elküldésekor érvényes mid ár különbsége. Vételnél pozitív, ha $\\bar p$ a $m$ fölött van, és a mid ár **bázispontjaiban** (bp, egy század százalék) adjuk meg. Dollárban a megbízás teljes költsége a mid árhoz képest a részvényszám és az árkülönbség szorzata:"),
    eq("\\text{csúszás} = \\frac{\\bar p - m}{m}\\cdot 10^{4}\\ \\text{bp}, \\qquad \\text{költség} = Q\\,(\\bar p - m)."),
    p("Piaci eladásnál az előjelek megfordulnak: a megbízás a mid alatti $\\bar p$ árat kapja, a csúszás tehát $(m - \\bar p)/m$. Még az egyetlen részvényes megbízás is fizet valamit. Ha a legjobb ask 100,01 és a mid 100,00, részvényenként 0,01-be, azaz 1 bp-be kerül. Ez a spread fele, az azonnaliság ára az előző leckéből."),
    {
      kind: "check",
      id: "limit-order-book/average",
      prompt: "Az askok: 50,00 200 részvényre és 50,01 300 részvényre. 400 részvényes piaci vétel érkezik. Mennyi az átlagára USD-ben?",
      answer: { type: "number", value: 50.005, tolerance: 0.0005 },
      explain: "A megbízás 200 részvényt vesz 50,00-n és a másik 200-at 50,01-en, így $\\bar p = (50{,}00 \\cdot 200 + 50{,}01 \\cdot 200)/400 = 50{,}005$.",
    },
    {
      kind: "worked",
      title: "1 600 részvényes piaci vétel",
      steps: [
        { text: "Az askok: 100,01 318 részvényre, 100,02 311-re, 100,03 518-ra és 100,04 453-ra. Az első három szintet teljesen elviszi a megbízás, a negyedik szint adja a megbízás hátralévő részét.", tex: "1600 - 318 - 311 - 518 = 453", result: { value: 453, tolerance: 0 } },
        { text: "A megbízás pontosan mind a négy szintet elfogyasztja. A kötés értéke a szintenkénti ár szorozva részvényszámmal összege, USD-ben.", tex: "318\\cdot 100{,}01 + 311\\cdot 100{,}02 + 518\\cdot 100{,}03 + 453\\cdot 100{,}04", result: { value: 160043.06, tolerance: 0.01 } },
        { text: "Osszuk el az 1 600 részvénnyel, így megkapjuk az átlagárat.", tex: "\\bar p = 160043{,}06 / 1600", result: { value: 100.0269, tolerance: 0.0001 } },
        { text: "A csúszás a 100,00-s mid árhoz képest, bázispontban.", tex: "\\frac{100{,}0269 - 100{,}00}{100{,}00}\\cdot 10^{4}", result: { value: 2.69, tolerance: 0.01 } },
        { text: "A költség a mid árhoz képest, USD-ben.", tex: "1600\\,(100{,}0269125 - 100{,}00)", result: { value: 43.06, tolerance: 0.01 } },
      ],
    },

    h("Mélység és a méret költsége"),
    p("A megoldott példában ott a mintázat: minden további szint még egy ticknyivel drágább. Hogy lássuk, hogyan nő a költség a mérettel, vegyünk egy egyszerű könyvet, amelyben minden szinten ugyanakkora a $d$ mélység, és a legjobb ask $h$ tickkel van a mid fölött (itt $h = 1$). A $j = 1, 2, \\dots$ szint ekkor $h + j - 1$ tickkel van a mid fölött."),
    p("Egy $Q = k\\,d$ részvényes vétel $k$ teljes szintet visz el. Átlagos távolsága a mid felett e $k$ távolság átlaga, és a $\\sum_{j=1}^{k}(j-1) = k(k-1)/2$ számtani sor adja:"),
    eq("\\bar p - m = \\left(h + \\frac{k-1}{2}\\right)\\text{tick}, \\qquad k = \\frac{Q}{d}."),
    p("A csúszás tehát a mérettel nagyjából lineárisan nő: van egy állandó $h$ rész a spreadből, és egy rész, amely minden további részvénnyel $1/(2d)$ ticknyit nő. $Q$-val szorozva megkapjuk a teljes költséget tickekben:"),
    eq("Q\\,(\\bar p - m) = Q\\,h + \\frac{Q^2}{2d} - \\frac{Q}{2}\\;\\approx\\;\\frac{Q^2}{2d}\\quad\\text{nagy } Q \\text{ esetén}."),
    p("A teljes költség a méret négyzetével nő. Egy megbízás megduplázása nagyjából megnégyszerezi a költségének azt a részét, amely a könyvön való végighaladásból jön, mert kétszer annyi szintet visz el, és minden részvénye átlagosan drágább is. A mély könyv, nagy $d$ mellett, ellaposítja ezt. A valódi könyvek a touchnál általában vékonyabbak, távolabb vastagabbak, így az első szintek a drágák, és a görbe végül ellaposodik; a négyzetes szabály közepes méretekre iránytű, nem törvény."),
    {
      kind: "check",
      id: "limit-order-book/depth-cost",
      prompt: "Egy könyvben minden szinten ugyanakkora a mélység. Egy Q méretű piaci vétel végighalad a könyvön, és a spreadet nem számítva C költséget okoz a mid árhoz képest. Nagyjából mennyibe kerül a 2Q méretű piaci vétel?",
      answer: { type: "choice", options: ["Nagyjából 2C", "Nagyjából 3C", "Nagyjából 4C", "Nagyjából 8C"], correct: 2 },
      explain: "Kétszer annyi szintet visz el, így a mid feletti átlagos távolság megduplázódik, és kétszer annyi részvényt vesz ezen a távolságon. A költség tickekben $Q^2/(2d)$, ami $2^2 = 4$-szeresére nő.",
    },
    p("Az ábra ezt a kísérletet futtatja egy oldalanként tíz szintű könyvön, az első négy szinten túl szintenként nagyjából 450 részvénnyel. Válassz piaci vételt vagy eladást, és húzd a méretet: a megbízás által elfogyasztott sorok kiemelve látszanak, mellettük a csúszás görbéje a méret függvényében, a kiválasztott méretnél jelölővel. Az alapértelmezett 1 600 részvénynél megkapod a megoldott példát: négy szint, 2,69 bp, 43,06 USD költség. 100 részvény egyetlen szinten 1,00 bp-be kerül. Duplázd meg a méretet 3 200-ra, és nyolc szintet érintesz: a csúszás 4,50 bp-re, a költség 144,06 USD-re nő, a kétszeres részvényszámért több mint háromszoros áron."),
    figure("book-walk"),
    note("A touchon végrehajtott piaci megbízás a spread felét fizeti, és minden további szint egy ticknyivel emeli az átlagárat. A költség a mid árhoz képest $Q(\\bar p - m)$, ami egyenletes mélységű könyvben nagyjából $Q^2$-tel arányos."),

    h("Összefoglalás"),
    list(
      "A limitáras megbízásnak oldala, ára és mérete van, és a könyvben vár, amíg nem köt vagy vissza nem vonják; a piaci megbízásnak nincs ára, és azonnal köt a szemközti oldallal.",
      "A könyv a bideket a magasabbtól az alacsonyabbig, az askokat az alacsonyabbtól a magasabbig tartja, a touchnál a legjobb bid, a legjobb ask, a spread és a mid ($m = (a+b)/2$) áll.",
      "Az ár–idő prioritás a jobb árat tölti ki előbb, azonos áron a korábbit, így minden szint érkezési sorrendű sor.",
      "A piaci megbízás $\\bar p = \\sum p_i q_i / \\sum q_i$ átlagáron halad végig a könyvön, a csúszás $(\\bar p - m)/m$, a költség $Q(\\bar p - m)$.",
      "Egyenletes mélység mellett a csúszás nagyjából lineárisan, a teljes költség nagyjából $Q^2$-tel nő, tehát a méret drága.",
    ),
    lab("/order-book", "Haladj végig a könyvön piaci megbízásokkal az Ajánlati könyv laborban"),
  ],
};
