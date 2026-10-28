import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const marketMakers: GuideLessonContent = {
  en: [
    p("A stock chart shows one price per moment, but nobody trades at \"the price\". A buyer pays one number, a seller receives a lower one, and between the two sits a firm that stands ready to take either side. This lesson starts the track on market microstructure by explaining what that firm earns, what it risks, and how to measure the gap between the two prices. It uses returns from \"Returns and volatility\" and the idea that price changes behave like a random walk from \"Random walks and Brownian motion\"."),

    h("Bid, ask, mid and spread"),
    p("A market quotes two prices at any moment. The **bid** $b$ is the highest price at which someone is willing to buy; the **ask** $a$ is the lowest price at which someone is willing to sell. The bid is always below the ask, otherwise the two sides would already have traded. A trader who wants to buy right now pays the ask, and a trader who wants to sell right now receives the bid."),
    p("The **mid price** is the midpoint, $m = (a + b)/2$, and is the usual stand-in for \"the price\". The **spread** is the gap $a - b$. It is quoted in three ways: in currency, in **ticks** (the smallest allowed price step, so a spread of 4 cents on a 1-cent tick is 4 ticks), and in **basis points** of the mid, which makes stocks with different prices comparable:"),
    eq("s_{\\text{bp}} = 10^4 \\cdot \\frac{a - b}{m}."),
    p("With a bid of 99.98 and an ask of 100.02 the mid is 100.00 and the spread is 0.04, or $10^4 \\times 0.04 / 100 = 4$ basis points. A tight spread means trading is cheap; a wide spread means a trader loses more just by crossing from one side to the other."),
    {
      kind: "check",
      id: "market-makers/spread-bp",
      prompt: "A stock is quoted bid 49.95, ask 50.05. What is the spread in basis points of the mid?",
      answer: { type: "number", value: 20, tolerance: 0.5 },
      explain: "The mid is 50.00 and the spread is $0.10$, so $s_{\\text{bp}} = 10^4 \\times 0.10 / 50 = 20$ basis points.",
    },

    h("Liquidity and immediacy"),
    p("**Liquidity** is the ability to trade a meaningful size quickly without moving the price much. It comes from a simple mismatch in time. Some traders want to trade now and accept a worse price for it; others are willing to wait and post the price they want. The first group sends **market orders**, which execute immediately against the best quote on the other side. The second group posts **limit orders**, which rest in the book until someone trades against them."),
    p("The trader who sends the market order is the **taker**: she buys at the ask or sells at the bid and so pays half the spread relative to the mid. The trader whose limit order was waiting is the **maker**: he earns that half-spread. Many exchanges reinforce this with fees: the taker pays a small fee per share and the maker receives a smaller rebate, both a fraction of a cent. Either way, the spread is the price of **immediacy**, and the people who sell immediacy are the market makers."),
    {
      kind: "check",
      id: "market-makers/maker-taker",
      prompt: "Who pays the spread on a trade?",
      answer: {
        type: "choice",
        options: [
          "The trader who sends a market order",
          "The trader whose limit order was resting",
          "Both equally",
          "Nobody, if the exchange charges zero fees",
        ],
        correct: 0,
      },
      explain: "The market order crosses the spread: the buyer pays the ask, the seller receives the bid, each half a spread away from the mid. The resting limit order is paid for providing immediacy, and this holds even with zero fees.",
    },

    h("The round trip"),
    p("A **market maker** is a firm that continuously posts both a bid and an ask in the same asset and trades against whoever arrives. It does not want a position; it wants to buy at the bid, sell at the ask, and repeat. Take one **round trip**: a customer buys $q$ shares at the ask, so the maker is now short $q$, and later another customer sells $q$ shares at the bid, which closes the position. Suppose the maker keeps its quotes symmetric around the mid, $a = m + h$ and $b = m - h$, where $h$ is the half-spread. If the mid is $m_1$ at the first trade and $m_2$ at the second, the maker sold at $m_1 + h$ and bought back at $m_2 - h$, so per share"),
    eq("\\text{P\\&L} = (m_1 + h) - (m_2 - h) = \\underbrace{2h}_{a - b} \\; - \\; \\underbrace{(m_2 - m_1)}_{\\Delta m}."),
    p("If the mid has not moved, the maker keeps the whole spread $a - b$. If the mid has moved, the maker also gains or loses $\\Delta m$ per share on the position it carried, with a minus sign because it was short: a rising mid hurts. The first term is **spread income**; the second is **inventory P&L**. The maker controls the first by choosing the spread and has little control over the second."),
    {
      kind: "worked",
      title: "A round trip in 1,000 shares",
      steps: [
        { text: "Quotes are 99.98 / 100.02. The spread in currency:", tex: "a - b = 100.02 - 99.98", result: { value: 0.04, tolerance: 0.001 } },
        { text: "The spread in basis points of the 100.00 mid:", tex: "s_{\\text{bp}} = 10^4 \\cdot 0.04 / 100", result: { value: 4, tolerance: 0.05 } },
        { text: "A customer buys 1,000 at the ask and another later sells 1,000 at the bid. If the mid never moves, the maker's income in USD is:", tex: "0.04 \\times 1000", result: { value: 40, tolerance: 0.5 } },
        { text: "Now the mid rises by 0.10 between the two trades and the maker re-quotes around the new mid, 100.10, so its bid is 100.08. It sold at 100.02 and buys back at 100.08, a result in USD of:", tex: "(100.02 - 100.08) \\times 1000", result: { value: -60, tolerance: 0.5 } },
        { text: "Split into the two terms, the inventory P&L in USD is the short position times the rise of the mid:", tex: "-\\Delta m \\times 1000 = -0.10 \\times 1000", result: { value: -100, tolerance: 0.5 } },
        { text: "The spread income and inventory P&L add up to the round trip, in USD:", tex: "40 + (-100)", result: { value: -60, tolerance: 0.5 } },
      ],
    },
    p("The culprit in the last step is the position the maker carried through the move, not the spread. A 4 bp spread earns 40 USD on this size, while a 10-cent move of the mid, which is only 10 bp, is enough to erase it two and a half times over."),
    {
      kind: "check",
      id: "market-makers/round-trip-pnl",
      prompt: "A maker sells 500 shares at 40.03 and later buys 500 back at 40.07, in USD. What is the result of the round trip?",
      answer: { type: "number", value: -20, tolerance: 0.5 },
      explain: "The maker sold at 40.03 and bought back at 40.07, so $(40.03 - 40.07) \\times 500 = -20$ USD. The mid rose by more than the spread earned.",
    },

    h("Inventory risk and adverse selection"),
    p("Two separate risks sit behind the inventory term. The first is **inventory risk**. While the maker is short, its profit depends on the mid price, and the mid moves unpredictably. If the mid's change per step has standard deviation $\\sigma$ and steps are independent, as in a random walk, the change over $k$ steps has standard deviation $\\sigma\\sqrt{k}$. The longer the maker holds a position, the more that risk grows, and it grows with the size of the position too. Later lessons in this track develop what a maker does about it."),
    p("The second is **adverse selection**: the customer may know something. If a buyer knows the price is about to rise, the maker sells exactly before the mid moves up, and the loss is not luck but a consequence of who chose to trade. A maker cannot see who is informed, so it must charge every customer a spread wide enough to cover the losses to the informed ones. Later lessons develop it; here it is enough to see that the spread pays for both risks, not just for waiting."),
    p("The figure below plays out the round trip. A mid price follows a random walk for 30 steps; the maker always quotes half-spread $h$ around the current mid; a customer buys at the ask at step 5 and another sells at the bid at step 20, for 100 shares. Drag the ask line, or use the half-spread slider, and watch the spread income grow in proportion. Then raise the volatility, press New path a few times and compare the sign of the inventory P&L over different paths. At the defaults (half-spread 2¢, volatility 1¢ per step, first path) the spread income is 4.00 USD, the mid happens to rise 4.47¢ between the two trades, the inventory P&L is −4.47 USD and the round trip ends at −0.47 USD. Over 15 steps of 1¢ the standard deviation of the mid's change is $\\sqrt{15} \\approx 3.9$¢, about as large as the whole spread, so a typical single round trip is close to a coin flip around the income."),
    figure("round-trip"),

    h("Types of market maker"),
    p("Some market makers carry an **obligation**: a designated market maker on an exchange agrees to quote continuously, within a maximum spread and with a minimum size, and in return gets fee advantages or a privileged role. Most liquidity today comes from electronic liquidity providers, trading firms with no obligation whose software posts and cancels quotes thousands of times a second and leaves when conditions are bad. In over-the-counter markets, such as bonds and currencies, dealers quote to customers on request and keep the position on their own books. The three differ in obligations and in technology, but share the economics above: spread income in return for inventory risk and adverse selection."),

    h("Summary"),
    list(
      "The bid is the best price to sell at, the ask the best price to buy at, and the spread $a - b$ is the cost of crossing; it is measured in currency, ticks or basis points $10^4 (a - b)/m$.",
      "Takers pay the spread for immediacy; makers who post limit orders earn it.",
      "A round trip at symmetric quotes earns $(a - b) - \\Delta m$ per share: the spread, minus the rise of the mid while the maker was short.",
      "The mid's move is inventory risk, which grows like $\\sigma\\sqrt{k}$ with holding time; informed customers add adverse selection, and the spread must pay for both.",
    ),
    note("The next lesson, \"The limit order book\", shows where the quotes of all makers and traders are stored and how a market order consumes them."),
    lab("/market-making", "Open the market making lab and quote a simulated market yourself"),
  ],

  hu: [
    p("Egy árfolyamgrafikon pillanatonként egyetlen árat mutat, de „az áron” senki sem kereskedik. A vevő egy számot fizet, az eladó egy alacsonyabbat kap, és a kettő között egy cég áll, amely készen áll bármelyik oldal átvételére. Ez a lecke a piacmikrostruktúra témakörét indítja: azt magyarázza el, mit keres ez a cég, mit kockáztat, és hogyan mérhető a két ár közötti rés. Felhasználja a „Hozamok és volatilitás” című lecke hozamait, és azt az elképzelést a „Véletlen bolyongás és Brown-mozgás” című leckéből, hogy az ármozgás véletlen bolyongásként viselkedik."),

    h("Bid, ask, mid és spread"),
    p("A piac egy adott pillanatban két árat jegyez. A **bid** $b$ a legmagasabb ár, amelyen valaki vásárolni hajlandó; az **ask** $a$ a legalacsonyabb ár, amelyen valaki eladni hajlandó. A bid mindig az ask alatt van, különben a két oldal már kötést kötött volna. Aki most akar venni, az askot fizeti, aki most akar eladni, a bidet kapja."),
    p("A **mid ár** a felezőpont, $m = (a + b)/2$, ez szokott „az ár” helyett állni. A **spread** az $a - b$ különbség. Háromféleképpen szokás megadni: pénznemben, **tickben** (a legkisebb megengedett ár-lépésben, így egy 1 centes ticknél a 4 centes spread 4 tick), és a mid **bázispontjában**, amivel a különböző árú részvények összehasonlíthatók:"),
    eq("s_{\\text{bp}} = 10^4 \\cdot \\frac{a - b}{m}."),
    p("99,98-as bid és 100,02-es ask mellett a mid 100,00, a spread 0,04, azaz $10^4 \\times 0{,}04 / 100 = 4$ bázispont. A szűk spread olcsó kereskedést jelent; a széles spread mellett többet veszít az, aki az egyik oldalról átlép a másikra."),
    {
      kind: "check",
      id: "market-makers/spread-bp",
      prompt: "Egy részvény jegyzése: bid 49,95, ask 50,05. Mekkora a spread a mid bázispontjában?",
      answer: { type: "number", value: 20, tolerance: 0.5 },
      explain: "A mid 50,00, a spread $0{,}10$, így $s_{\\text{bp}} = 10^4 \\times 0{,}10 / 50 = 20$ bázispont.",
    },

    h("Likviditás és azonnaliság"),
    p("A **likviditás** az a képesség, hogy érdemi mennyiséget gyorsan, az árat alig mozdítva lehessen eladni vagy megvenni. Egy egyszerű időbeli eltérésből ered. Egyes kereskedők most akarnak kötni, és ezért rosszabb árat is elfogadnak; mások várni hajlandók, és kiírják a nekik megfelelő árat. Az első csoport **piaci megbízást** küld, amely azonnal teljesül a másik oldal legjobb jegyzésével szemben. A második **limitáras megbízást** ad, amely az ajánlati könyvben vár, amíg valaki nem köt vele."),
    p("A piaci megbízást küldő a **taker**: az askon vesz vagy a biden ad el, tehát a mid-hez képest a spread felét fizeti. A várakozó limitáras megbízás gazdája a **maker**: ő keresi meg ezt a fél spreadet. Sok tőzsde díjakkal is erősíti ezt: a taker részvényenként kis díjat fizet, a maker valamivel kisebb visszatérítést kap, mindkettő egy cent töredéke. Akárhogy is, a spread az **azonnaliság** ára, és az azonnaliságot eladók a market makerek."),
    {
      kind: "check",
      id: "market-makers/maker-taker",
      prompt: "Ki fizeti a spreadet egy kötésnél?",
      answer: {
        type: "choice",
        options: [
          "Az, aki piaci megbízást küld",
          "Az, akinek a limitáras megbízása várakozott",
          "Mindketten egyformán",
          "Senki, ha a tőzsde nem számol fel díjat",
        ],
        correct: 0,
      },
      explain: "A piaci megbízás átlépi a spreadet: a vevő az askot fizeti, az eladó a bidet kapja, a mid-től fél spreadnyire. A várakozó limitáras megbízás jutalmat kap az azonnaliság biztosításáért, és ez díjak nélkül is így van.",
    },

    h("Az oda-vissza kötés"),
    p("A **market maker** (árjegyző) olyan cég, amely folyamatosan jegyez bidet és askot ugyanarra az eszközre, és mindenkivel köt, aki érkezik. Nem pozíciót akar: bidnél venni, asknál eladni, és ezt ismételni. Nézzünk egy **oda-vissza kötést**: egy ügyfél $q$ részvényt vesz az askon, így a maker $q$ részvényben short lesz, majd egy másik ügyfél $q$ részvényt ad el a biden, ami lezárja a pozíciót. Tegyük fel, hogy a maker szimmetrikusan jegyez a mid körül, $a = m + h$ és $b = m - h$, ahol $h$ a fél spread. Ha a mid az első kötésnél $m_1$, a másodiknál $m_2$, a maker $m_1 + h$-n adott el és $m_2 - h$-n vett vissza, tehát részvényenként"),
    eq("\\text{eredmény} = (m_1 + h) - (m_2 - h) = \\underbrace{2h}_{a - b} \\; - \\; \\underbrace{(m_2 - m_1)}_{\\Delta m}."),
    p("Ha a mid nem mozdult, a maker az egész $a - b$ spreadet megkeresi. Ha mozdult, a magával vitt pozíción részvényenként $\\Delta m$-et nyer vagy veszít, mínusz előjellel, mert short volt: az emelkedő mid árt neki. Az első tag a **spreadbevétel**, a második a **készlet eredménye**. Az elsőt a spread megválasztásával a maker szabályozza, a másodikat alig."),
    {
      kind: "worked",
      title: "Egy oda-vissza kötés 1000 részvényen",
      steps: [
        { text: "A jegyzés 99,98 / 100,02. A spread pénznemben:", tex: "a - b = 100{,}02 - 99{,}98", result: { value: 0.04, tolerance: 0.001 } },
        { text: "A spread a 100,00-s mid bázispontjában:", tex: "s_{\\text{bp}} = 10^4 \\cdot 0{,}04 / 100", result: { value: 4, tolerance: 0.05 } },
        { text: "Egy ügyfél 1000-et vesz az askon, egy másik később 1000-et ad el a biden. Ha a mid nem mozdul, a maker bevétele USD-ben:", tex: "0{,}04 \\times 1000", result: { value: 40, tolerance: 0.5 } },
        { text: "Most a mid a két kötés között 0,10-zel emelkedik, a maker az új, 100,10-es mid körül jegyez újra, így a bidje 100,08. 100,02-n adott el és 100,08-on vesz vissza, az eredmény USD-ben:", tex: "(100{,}02 - 100{,}08) \\times 1000", result: { value: -60, tolerance: 0.5 } },
        { text: "Két tagra bontva a készlet eredménye USD-ben a short pozíció és a mid emelkedésének szorzata:", tex: "-\\Delta m \\times 1000 = -0{,}10 \\times 1000", result: { value: -100, tolerance: 0.5 } },
        { text: "A spreadbevétel és a készlet eredménye együtt adja az oda-vissza kötés eredményét, USD-ben:", tex: "40 + (-100)", result: { value: -60, tolerance: 0.5 } },
      ],
    },
    p("Az utolsó lépésben a hibás nem a spread, hanem az árfolyammozgáson át magával vitt pozíció. A 4 bázispontos spread ezen a méreten 40 USD-t hoz, a mid 10 centes, vagyis mindössze 10 bázispontos elmozdulása ezt két és félszer is eltünteti."),
    {
      kind: "check",
      id: "market-makers/round-trip-pnl",
      prompt: "Egy maker 500 részvényt ad el 40,03-on, majd 500-at vesz vissza 40,07-en, USD-ben. Mennyi az oda-vissza kötés eredménye?",
      answer: { type: "number", value: -20, tolerance: 0.5 },
      explain: "A maker 40,03-on adott el és 40,07-en vett vissza, így $(40{,}03 - 40{,}07) \\times 500 = -20$ USD. A mid többet emelkedett, mint amennyit a spread hozott.",
    },

    h("Készletkockázat és kedvezőtlen kiválasztás"),
    p("A készlet tagja mögött két külön kockázat áll. Az első a **készletkockázat**. Amíg a maker short, a nyeresége a mid-től függ, ami kiszámíthatatlanul mozog. Ha a mid lépésenkénti változásának szórása $\\sigma$, és a lépések függetlenek, mint egy véletlen bolyongásban, akkor $k$ lépés alatt a változás szórása $\\sigma\\sqrt{k}$. Minél tovább tart a maker a pozíciót, annál nagyobb ez a kockázat, és a pozíció méretével is nő. Mit tehet ellene a maker, azt a sorozat későbbi leckéi tárgyalják."),
    p("A második a **kedvezőtlen kiválasztás**: az ügyfél tudhat valamit. Ha a vevő tudja, hogy az ár emelkedni fog, a maker éppen a mid felfelé mozdulása előtt ad el, és a veszteség nem szerencse, hanem annak következménye, hogy ki választotta a kötést. A maker nem látja, ki a bennfentes, ezért minden ügyfélnek olyan széles spreadet kell számolnia, amely a bennfentesekkel szembeni veszteségeket is fedezi. Ezt későbbi leckék fejtik ki; itt annyi elég, hogy a spread mindkét kockázatot fizeti, nem csak a várakozást."),
    p("Az alábbi ábra lejátssza az oda-vissza kötést. A mid ár 30 lépésen át véletlen bolyongást követ; a maker mindig $h$ fél spreaddel jegyez az aktuális mid körül; az 5. lépésben egy ügyfél vesz az askon, a 20. lépésben egy másik ad el a biden, 100 részvényen. Húzd az ask vonalát, vagy használd a fél spread csúszkáját, és figyeld, ahogy a spreadbevétel arányosan nő. Utána növeld az ingadozást, nyomd meg néhányszor az Új ármozgás gombot, és nézd meg, hogyan változik a készlet eredményének előjele a különböző utakon. Az alapbeállításnál (fél spread 2¢, ingadozás lépésenként 1¢, első út) a spreadbevétel 4,00 USD, a mid a két kötés között éppen 4,47¢-et emelkedik, a készlet eredménye −4,47 USD, és az oda-vissza kötés −0,47 USD-vel zár. 15 darab 1¢-es lépés alatt a mid változásának szórása $\\sqrt{15} \\approx 3{,}9$¢, nagyjából akkora, mint az egész spread, ezért egy tipikus oda-vissza kötés a bevétel körül szinte fej vagy írás."),
    figure("round-trip"),

    h("A market makerek fajtái"),
    p("Egyes market makereknek **kötelezettségük** van: a tőzsdei kijelölt market maker vállalja, hogy folyamatosan jegyez, legfeljebb egy megadott spreaddel és legalább egy megadott mérettel, cserébe díjkedvezményt vagy kiemelt szerepet kap. A likviditás nagy része ma elektronikus likviditásbiztosítóktól származik: kötelezettség nélküli kereskedőcégektől, amelyek szoftvere másodpercenként több ezerszer ad fel és von vissza jegyzéseket, és rossz körülmények között eltűnik. A tőzsdén kívüli piacokon, például kötvényeknél és devizánál, a dealerek kérésre jegyeznek az ügyfeleknek, és a pozíciót a saját könyvükben tartják. A három szereplő kötelezettségeiben és technikájában különbözik, a fenti gazdaságtan azonban közös: spreadbevétel a készletkockázat és a kedvezőtlen kiválasztás vállalásáért."),

    h("Összefoglalás"),
    list(
      "A bid a legjobb eladási, az ask a legjobb vételi ár, a spread, $a - b$, az átlépés ára; mérhető pénznemben, tickben vagy bázispontban, $10^4 (a - b)/m$.",
      "A takerek az azonnaliságért fizetik a spreadet; a limitáras megbízással várakozó makerek keresik meg.",
      "Szimmetrikus jegyzésnél egy oda-vissza kötés részvényenként $(a - b) - \\Delta m$-et hoz: a spreadet, levonva a mid emelkedését arra az időre, amíg a maker short volt.",
      "A mid elmozdulása a készletkockázat, amely a tartási idővel $\\sigma\\sqrt{k}$ szerint nő; a bennfentes ügyfelek kedvezőtlen kiválasztást adnak hozzá, és a spreadnek mindkettőt fedeznie kell.",
    ),
    note("A következő lecke, „A limitáras ajánlati könyv”, megmutatja, hol tárolódik az összes maker és kereskedő jegyzése, és hogyan fogyasztja el őket egy piaci megbízás."),
    lab("/market-making", "Nyisd meg a market making labort, és jegyezz magad egy szimulált piacon"),
  ],
};
