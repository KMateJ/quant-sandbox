import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, p } from "./blocks";

export const marketMakingPnl: GuideLessonContent = {
  en: [
    p("A market maker's day ends with one number, the profit and loss, and that number alone says almost nothing about what to change. A desk that earned 23 USD may have earned 27 from the spread and lost 17 to informed customers, or the other way round. This lesson splits the P&L exactly into spread capture, adverse selection, inventory and fees, using the markout from \"Adverse selection and informed trading\" and the inventory view from \"Inventory risk and quote skewing\", and then lists the few monitoring numbers a desk reads to decide whether to widen, skew or pull its quotes."),

    h("Marking to market"),
    p("Let the maker's **cash** be the money it has received minus the money it has paid, its **inventory** $I$ the net number of shares it holds, and $m_T$ the mid price at the end of the session. Valuing the inventory at the mid, the **total P&L** is"),
    eq("\\text{P\\&L} = \\text{cash} + I\\,m_T + \\text{fees}."),
    p("A fill of $q$ shares at price $p$ changes cash by $-\\varepsilon\\,p\\,q$ and inventory by $\\varepsilon\\,q$, where $\\varepsilon = +1$ if the maker bought and $\\varepsilon = -1$ if it sold. Fees are positive for a rebate and negative for a charge. This is the number the exchange statement agrees with, but it mixes three different stories: what the maker charged, what the price did next, and what it still holds."),

    h("Spread capture"),
    p("Let $m_t$ be the mid price just before the fill at time $t$. The **spread capture** of the fill is how far from the mid the maker traded, signed so that a good price is positive:"),
    eq("S = \\varepsilon\\,(m_t - p)\\,q."),
    p("A maker who buys below the mid, or sells above it, captures the spread. Note the word *before*: if the mid is read after the fill, the price move that the fill itself caused leaks into the spread term and flatters it."),
    {
      kind: "check",
      id: "market-making-pnl/spread-capture",
      prompt: "The maker sells 200 shares at 50.03 when the mid price is 50.00. What is the spread capture in USD?",
      answer: { type: "number", value: 6, tolerance: 0.01 },
      explain: "A sale has $\\varepsilon = -1$, so $S = -(50.00 - 50.03)\\times 200 = 0.03 \\times 200 = 6$ USD. The maker sold 3 cents above the mid on every share.",
    },

    h("Adverse selection"),
    p("Choose a **markout horizon** $h$, for example 10 seconds. The **adverse selection** of the fill is the mid price move over the next $h$ seconds, signed from the maker's side, as in the lesson on markouts:"),
    eq("A = \\varepsilon\\,(m_{t+h} - m_t)\\,q."),
    p("It is negative when the maker bought just before the price fell or sold just before it rose: the customer knew something. Averaged over many fills and divided by shares, $A$ is the markout. After noise customers it averages zero; after informed customers it is negative and eats the spread capture."),

    h("Inventory"),
    p("The fill is not over after $h$ seconds: the maker still holds the shares until it trades them away, and the mid keeps moving until the end $T$ of the session. For one fill, split the total change in value at $t$ and $t+h$:"),
    eq("-\\varepsilon\\,p\\,q + \\varepsilon\\,q\\,m_T = \\underbrace{\\varepsilon\\,(m_t - p)\\,q}_{S} + \\underbrace{\\varepsilon\\,(m_{t+h} - m_t)\\,q}_{A} + \\underbrace{\\varepsilon\\,(m_T - m_{t+h})\\,q}_{\\text{inventory}}."),
    p("The identity holds because the mid terms telescope: $m_t$ and $m_{t+h}$ cancel. Summing over all fills and adding the fees gives"),
    eq("\\text{P\\&L} = \\sum S + \\sum A + \\sum \\varepsilon\\,(m_T - m_{t+h})\\,q + \\text{fees}."),
    p("The third sum is the **inventory** term: the profit or loss from holding the position beyond the markout window. The four parts sum to the total exactly, with nothing left over, which is why the desk can trust the split. If the price is a random walk, the inventory term has mean zero but a wide spread, and it is the part that skewing the quotes aims to control."),
    {
      kind: "worked",
      title: "Splitting the P&L of one fill",
      steps: [
        { text: "The maker buys 100 at 99.99 while the mid is 100.00. Spread capture:", tex: "S = (100.00 - 99.99)\\times 100", result: { value: 1, tolerance: 0.001 } },
        { text: "Ten seconds later the mid is 99.95 and stays there. Adverse selection:", tex: "A = (99.95 - 100.00)\\times 100", result: { value: -5, tolerance: 0.001 } },
        { text: "The mid does not move after the markout window, so the inventory term is zero:", tex: "(99.95 - 99.95)\\times 100", result: { value: 0, tolerance: 0.001 } },
        { text: "With no fees the total is the sum of the parts:", tex: "1.00 - 5.00 + 0 + 0", result: { value: -4, tolerance: 0.001 } },
        { text: "Direct check with cash plus inventory times the mid:", tex: "-9999 + 100\\times 99.95", result: { value: -4, tolerance: 0.001 } },
        { text: "With a maker rebate of 0.002 per share the fees are 0.20 and the total improves to:", tex: "-4.00 + 0.002\\times 100", result: { value: -3.8, tolerance: 0.001 } },
      ],
    },

    h("Fees and rebates"),
    p("Exchanges often pay a small **rebate** to the side that posts a resting order and charge a **taker fee** to the side that removes liquidity. A maker earns the rebate on every fill, so it adds to the total independent of the price path, and it can make a thin-spread strategy viable. When the maker hedges its inventory with a market order, it pays the taker fee and also crosses the spread: the hedge is a fill with a **negative** spread-capture term, because the maker trades away from the mid. The decomposition handles hedges with no extra rules, as one more fill with its own $S$, $A$ and fee."),

    h("What a desk watches"),
    p("The split is only useful if it is read every day. Try the figure below: it runs a five-minute session of a maker against the crowd flow, and lets you change the informed share, the quote distance and the markout horizon. Raise the informed share and watch the adverse selection bar and the markout curve fall; move the quotes further from the mid and watch the fills, and with them every bar, shrink. In the default state, 67 fills give 27.16 USD of spread capture, −16.98 of adverse selection, 2.90 of inventory and 10.43 of rebates, for a total of 23.51 USD."),
    figure("pnl-attribution"),
    p("Five numbers do most of the monitoring."),
    list(
      "**Markout curve.** The average markout against the horizon. A curve that sinks and stays negative means the flow is informed: widen the quotes or stop quoting to the toxic customers. A curve that returns to zero means the move was temporary pressure on the book, not information.",
      "**Fill ratio.** Fills divided by orders placed, the practical measure of queue position from \"Queue position and fill probability\". A very high ratio usually means the quotes are too tight; a very low one means the maker is far back in the queue or too wide.",
      "**Quote-to-trade ratio.** Quote updates per fill. It measures the cost of staying at the touch and is often capped by the exchange.",
      "**Inventory turnover.** How quickly the position cycles back to flat. Slow turnover with large swings in the inventory term is a signal to skew quotes harder, as in \"Optimal quoting: the Avellaneda–Stoikov model\".",
      "**Limits.** Maximum inventory and loss per day. A breach means pulling quotes, for example before a scheduled news release when adverse selection is highest.",
    ),
    {
      kind: "check",
      id: "market-making-pnl/markout",
      prompt: "A maker's spread capture is +500 USD a day, but its adverse selection is −650 USD. What is the first thing to try?",
      answer: {
        type: "choice",
        options: [
          "Widen the quotes, or quote less to the toxic flow",
          "Quote tighter to get more fills",
          "Hedge every fill immediately",
          "Stop charging fees",
        ],
        correct: 0,
      },
      explain: "Adverse selection larger than spread capture means each fill loses money on average within the markout window. Tighter quotes would add fills at an even smaller spread; hedging pays the spread again; fees do not enter the comparison. The fix is a wider spread or less quoting to the customers who cause it.",
    },

    h("The attribution in the desk game"),
    p("The Market Making Desk game at /market-making/desk reports exactly this split at the end of each round, with the markout horizon you choose. The lab linked below lets you change the quotes and the flow and see the four parts move."),

    h("Summary"),
    list(
      "Total P&L is cash plus inventory times the mid, plus fees, and it splits exactly into spread capture, adverse selection, inventory and fees.",
      "Spread capture $\\varepsilon(m_t - p)q$ uses the mid before the fill; adverse selection $\\varepsilon(m_{t+h} - m_t)q$ is the markout over the horizon; the inventory term is the rest of the holding period.",
      "The four parts sum to the total because the mid terms telescope.",
      "Hedges are fills with negative spread capture and a taker fee; rebates add a path-independent income.",
      "A markout curve, fill ratio, quote-to-trade ratio, inventory turnover and limits tell the desk whether to widen, skew or pull quotes.",
    ),
    lab("/market-making", "Open the market making lab"),
  ],
  hu: [
    p("Az árjegyző napja egyetlen számmal zárul, az eredménnyel, és ez a szám önmagában alig mond valamit arról, mit kell változtatni. Egy desk, amely 23 USD-t keresett, lehet, hogy 27-et keresett a spreaden és 17-et vesztett az informált ügyfeleken, vagy fordítva. Ez a lecke az eredményt pontosan szétbontja spread-bevételre, kedvezőtlen kiválasztásra, készletre és díjakra, a „Kedvezőtlen kiválasztás és informált kereskedés” leckéből ismert markoutot és a „Készletkockázat és a jegyzések eltolása” leckéből ismert készletszemléletet használva, majd felsorolja azt a pár figyelőszámot, amelyből a desk eldönti, hogy szélesítse, eltolja vagy visszavonja a jegyzéseit."),

    h("Piaci értékelés"),
    p("Az árjegyző (market maker) **készpénze** a kapott és a kifizetett pénz különbsége, a **készlete** $I$ a birtokolt részvények nettó száma, $m_T$ pedig a közepes ár a szakasz végén. A készletet a közepes áron értékelve az **összes eredmény**"),
    eq("\\text{eredmény} = \\text{készpénz} + I\\,m_T + \\text{díjak}."),
    p("Egy $q$ darabos, $p$ áron történt teljesülés a készpénzt $-\\varepsilon\\,p\\,q$-val, a készletet $\\varepsilon\\,q$-val változtatja, ahol $\\varepsilon = +1$, ha az árjegyző vett, és $\\varepsilon = -1$, ha eladott. A díj visszatérítésnél pozitív, költségnél negatív. Ez az a szám, amelyet a tőzsdei kimutatás is mutat, de három külön történetet kever össze: mit kért az árjegyző, mit tett utána az ár, és mit tart még."),

    h("Spread-bevétel"),
    p("Legyen $m_t$ a közepes ár közvetlenül a $t$ időpontbeli teljesülés előtt. A teljesülés **spread-bevétele** az, milyen messze kötött az árjegyző a közepes ártól, előjelezve úgy, hogy a jó ár pozitív:"),
    eq("S = \\varepsilon\\,(m_t - p)\\,q."),
    p("Aki a közepes ár alatt vesz vagy fölötte ad el, az megkeresi a spreadet. Figyelj az *előtt* szóra: ha a közepes árat a teljesülés után olvassuk le, a teljesülés által okozott ármozgás beszivárog a spread-tagba, és megszépíti."),
    {
      kind: "check",
      id: "market-making-pnl/spread-capture",
      prompt: "Az árjegyző 200 részvényt ad el 50,03-as áron, miközben a közepes ár 50,00. Mekkora a spread-bevétel USD-ben?",
      answer: { type: "number", value: 6, tolerance: 0.01 },
      explain: "Eladásnál $\\varepsilon = -1$, tehát $S = -(50{,}00 - 50{,}03)\\times 200 = 0{,}03 \\times 200 = 6$ USD. Az árjegyző minden részvényt 3 centtel a közepes ár fölött adott el.",
    },

    h("Kedvezőtlen kiválasztás"),
    p("Válassz egy **markout-horizontot** $h$, például 10 másodpercet. A teljesülés **kedvezőtlen kiválasztása** a közepes ár következő $h$ másodpercbeli mozgása, az árjegyző oldaláról előjelezve, ahogy a markoutról szóló leckében:"),
    eq("A = \\varepsilon\\,(m_{t+h} - m_t)\\,q."),
    p("Negatív, ha az árjegyző közvetlenül az árfolyam esése előtt vett, vagy emelkedése előtt adott el: az ügyfél tudott valamit. Sok teljesülésre átlagolva és a darabszámmal osztva $A$ a markout. Zajkereskedők után az átlaga nulla, informált ügyfelek után negatív, és felemészti a spread-bevételt."),

    h("Készlet"),
    p("A teljesülés nem ér véget $h$ másodperc után: az árjegyző addig tartja a részvényeket, amíg el nem adja őket, és a közepes ár a szakasz $T$ végéig mozog tovább. Egy teljesülésre bontsuk az értékváltozást $t$ és $t+h$ mentén:"),
    eq("-\\varepsilon\\,p\\,q + \\varepsilon\\,q\\,m_T = \\underbrace{\\varepsilon\\,(m_t - p)\\,q}_{S} + \\underbrace{\\varepsilon\\,(m_{t+h} - m_t)\\,q}_{A} + \\underbrace{\\varepsilon\\,(m_T - m_{t+h})\\,q}_{\\text{készlet}}."),
    p("Az azonosság azért igaz, mert a közepes ár tagjai teleszkopikusan kiesnek: $m_t$ és $m_{t+h}$ kioltja egymást. Az összes teljesülésre összegezve és a díjakat hozzáadva"),
    eq("\\text{eredmény} = \\sum S + \\sum A + \\sum \\varepsilon\\,(m_T - m_{t+h})\\,q + \\text{díjak}."),
    p("A harmadik összeg a **készlet** tagja: a pozíció markout-ablakon túli tartásának nyeresége vagy vesztesége. A négy rész pontosan kiadja az összest, maradék nélkül, ezért bízhat a desk a bontásban. Ha az ár bolyongás, a készlet tagjának várható értéke nulla, de nagy a szórása, és a jegyzések eltolása éppen ezt fogja vissza."),
    {
      kind: "worked",
      title: "Egy teljesülés eredményének bontása",
      steps: [
        { text: "Az árjegyző 100 darabot vesz 99,99-es áron, miközben a közepes ár 100,00. Spread-bevétel:", tex: "S = (100{,}00 - 99{,}99)\\times 100", result: { value: 1, tolerance: 0.001 } },
        { text: "Tíz másodperccel később a közepes ár 99,95, és ott is marad. Kedvezőtlen kiválasztás:", tex: "A = (99{,}95 - 100{,}00)\\times 100", result: { value: -5, tolerance: 0.001 } },
        { text: "A markout-ablak után a közepes ár nem mozdul, így a készlet tagja nulla:", tex: "(99{,}95 - 99{,}95)\\times 100", result: { value: 0, tolerance: 0.001 } },
        { text: "Díj nélkül az összes a részek összege:", tex: "1{,}00 - 5{,}00 + 0 + 0", result: { value: -4, tolerance: 0.001 } },
        { text: "Közvetlen ellenőrzés: készpénz plusz készlet szorozva a közepes árral:", tex: "-9999 + 100\\times 99{,}95", result: { value: -4, tolerance: 0.001 } },
        { text: "Darabonként 0,002 maker-visszatérítéssel a díjak 0,20-at tesznek ki, és az összes javul:", tex: "-4{,}00 + 0{,}002\\times 100", result: { value: -3.8, tolerance: 0.001 } },
      ],
    },

    h("Díjak és visszatérítések"),
    p("A tőzsdék gyakran kis **visszatérítést** fizetnek annak az oldalnak, amely várakozó megbízást ad, és **taker-díjat** számítanak annak, amely elveszi a likviditást. Az árjegyző minden teljesülésen megkapja a visszatérítést, így az az ár alakulásától függetlenül növeli az összest, és életképessé tehet egy vékony spreadű stratégiát. Amikor az árjegyző piaci megbízással fedezi a készletét, taker-díjat fizet, és át is lépi a spreadet: a fedezés **negatív** spread-bevételű teljesülés, mert az árjegyző a közepes ártól távolabb köt. A bontás ezt külön szabály nélkül kezeli: még egy teljesülés a saját $S$, $A$ és díj tagjával."),

    h("Mit figyel egy desk"),
    p("A bontás csak akkor hasznos, ha minden nap elolvassák. Próbáld ki az alábbi ábrát: egy öt perces szakaszon futtat egy árjegyzőt a tömeg ajánlatáramával szemben, és változtathatod az informált arányt, a jegyzés távolságát és a markout-horizontot. Emeld az informált arányt, és nézd, ahogy a kedvezőtlen kiválasztás oszlopa és a markout-görbe lesüllyed; told távolabb a jegyzéseket a közepes ártól, és nézd, ahogy a teljesülések, velük együtt minden oszlop, összezsugorodik. Alapállapotban 67 teljesülés 27,16 USD spread-bevételt, −16,98 kedvezőtlen kiválasztást, 2,90 készlet-tagot és 10,43 visszatérítést ad, összesen 23,51 USD-t."),
    figure("pnl-attribution"),
    p("Öt szám végzi a figyelés zömét."),
    list(
      "**Markout-görbe.** Az átlagos markout a horizont függvényében. A süllyedő és negatív maradó görbe informált ajánlatáramot jelez: szélesítsd a jegyzéseket, vagy ne jegyezz a mérgező ügyfeleknek. A nullához visszatérő görbe azt jelenti, hogy a mozgás átmeneti nyomás volt az ajánlati könyvön, nem információ.",
      "**Teljesülési arány.** A teljesülések osztva a feladott megbízásokkal, a „A sorban elfoglalt hely és a teljesülés valószínűsége” leckéből ismert sorbeli helyzet gyakorlati mérőszáma. Nagyon magas arány gyakran túl szoros jegyzést jelent, nagyon alacsony azt, hogy az árjegyző messze van a sor elejétől, vagy túl széles.",
      "**Jegyzés-kötés arány.** A jegyzésfrissítések száma teljesülésenként. A szinten maradás költségét méri, és a tőzsdék gyakran korlátozzák.",
      "**Készletforgás.** Milyen gyorsan tér vissza a pozíció laposra. Lassú forgás és nagy ingadozású készlet-tag azt jelzi, hogy erősebben kell eltolni a jegyzéseket, ahogy az „Optimális jegyzés: az Avellaneda–Stoikov-modell” leckében.",
      "**Limitek.** A maximális készlet és a napi veszteség. Egy megsértés a jegyzések visszavonását jelenti, például egy előre jelzett hír előtt, amikor a kedvezőtlen kiválasztás a legnagyobb.",
    ),
    {
      kind: "check",
      id: "market-making-pnl/markout",
      prompt: "Egy árjegyző spread-bevétele napi +500 USD, kedvezőtlen kiválasztása viszont −650 USD. Mit érdemes először kipróbálni?",
      answer: {
        type: "choice",
        options: [
          "Szélesíteni a jegyzéseket, vagy kevesebbet jegyezni a mérgező ügyfeleknek",
          "Szorosabban jegyezni, hogy több teljesülés legyen",
          "Minden teljesülést azonnal fedezni",
          "Nem kérni többé díjat",
        ],
        correct: 0,
      },
      explain: "Ha a kedvezőtlen kiválasztás nagyobb a spread-bevételnél, akkor a markout-ablakon belül minden teljesülés átlagosan veszít. A szorosabb jegyzés még kisebb spreaden hozna több teljesülést, a fedezés újra kifizetteti a spreadet, a díjak pedig nem szerepelnek az összehasonlításban. A megoldás a szélesebb spread, vagy kevesebb jegyzés azoknak, akik a veszteséget okozzák.",
    },

    h("Az eredménybontás a desk játékban"),
    p("A /market-making/desk címen elérhető Market Making Desk játék minden forduló végén pontosan ezt a bontást mutatja, az általad választott markout-horizonttal. Az alább linkelt labor lehetővé teszi, hogy változtasd a jegyzéseket és az ajánlatáramot, és lásd, ahogy a négy rész mozog."),

    h("Összefoglalás"),
    list(
      "Az összes eredmény készpénz plusz készlet szorozva a közepes árral, plusz díjak, és pontosan felbomlik spread-bevételre, kedvezőtlen kiválasztásra, készletre és díjakra.",
      "A spread-bevétel $\\varepsilon(m_t - p)q$ a teljesülés előtti közepes árat használja; a kedvezőtlen kiválasztás $\\varepsilon(m_{t+h} - m_t)q$ a markout a horizonton; a készlet tagja a tartási idő többi része.",
      "A négy rész azért ad ki pontosan az összest, mert a közepes ár tagjai teleszkopikusan kiesnek.",
      "A fedezés negatív spread-bevételű és taker-díjas teljesülés; a visszatérítés az ár alakulásától független bevétel.",
      "A markout-görbe, a teljesülési arány, a jegyzés-kötés arány, a készletforgás és a limitek mondják meg a deskeknek, hogy szélesítsenek, eltoljanak vagy visszavonjanak.",
    ),
    lab("/market-making", "Nyisd meg az árjegyzői labort"),
  ],
};
