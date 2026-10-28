import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const inventoryRisk: GuideLessonContent = {
  en: [
    p("A market maker earns the spread on every round trip, but between the two halves of a round trip it holds a position, and the price keeps moving. \"Market makers and liquidity\" showed one such trip; this lesson asks what happens when many trips overlap and positions pile up on one side. It uses the idea from \"Random walks and Brownian motion\" that price changes behave like a random walk, measures the risk that position creates, and shows the maker's main tool for controlling it: shifting both quotes."),

    h("Inventory profit and loss"),
    p("The maker's **inventory** $q$ is the number of shares held: positive when long, negative when short. If the mid price changes by $\\Delta m$ while the position is unchanged, the profit or loss is"),
    eq("\\text{P\\&L} = q\\,\\Delta m."),
    p("Suppose the mid moves like a random walk whose standard deviation is $\\sigma$ per $\\sqrt{\\text{second}}$. Over $\\tau$ seconds $\\Delta m$ has mean 0 and standard deviation $\\sigma\\sqrt{\\tau}$, so the position's P&L has mean 0 and"),
    eq("\\text{sd}(q\\,\\Delta m) = |q|\\,\\sigma\\sqrt{\\tau}, \\qquad \\text{Var} = q^2\\sigma^2\\tau."),
    p("The risk grows in proportion to the size of the position and to the square root of the time it is held. Doubling the position doubles the standard deviation and quadruples the variance. The maker is not paid for this risk in expectation, since the mean is zero, so the sensible aim is to hold only as much of it as the spread income justifies."),
    {
      kind: "check",
      id: "inventory-risk/sd",
      prompt: "A maker is short 1,000 shares. The mid moves with $\\sigma = 0.01$ USD per $\\sqrt{\\text{second}}$. What is the standard deviation of the position's P&L over 100 seconds, in USD?",
      answer: { type: "number", value: 100, tolerance: 0.5 },
      explain: "$|q|\\,\\sigma\\sqrt{\\tau} = 1{,}000 \\times 0.01 \\times \\sqrt{100} = 100$ USD. The sign of the position does not matter, only its size.",
    },

    h("How inventory builds"),
    p("Inventory changes only when a customer trades with the maker. A fill at the bid adds a lot (here 100 shares) and a fill at the ask removes one. Which side fills next is random, so even with quotes that are symmetric around the mid the position drifts. Suppose each side fills at rate $\\lambda$ per second. In $T$ seconds the maker sees about $2\\lambda T$ fills, each $+1$ or $-1$ lot with equal probability, so the position after $T$ seconds is a random walk with variance $2\\lambda T$ lots$^2$. Its typical size grows like $\\sqrt{T}$, exactly as a price does."),
    p("A quote at distance $\\delta$ from the mid fills at the rate $\\lambda(\\delta) = A\\,e^{-k\\delta}$: the closer the quote, the more often it is hit. With $A = 0.25$ per second, $k = 30$ per USD and $\\delta = 0.02$ USD, each side fills at $0.25\\,e^{-0.6} \\approx 0.137$ per second, about once every seven seconds. Such a maker will often end a minute holding several lots, none of which it chose."),

    h("Skewing the quotes"),
    p("The maker can influence which side is hit. If it is long, it wants a sell to come before a buy. It achieves that by moving **both** quotes down: the ask becomes cheaper and is hit more often, the bid becomes less attractive and is hit less often. This is called **skewing** the quotes. Let $\\ell = q/100$ be the inventory in lots and $\\theta$ the shift per lot, in USD. The bid and ask are then at distances"),
    eq("\\delta_{\\text{bid}} = \\delta + \\theta\\ell, \\qquad \\delta_{\\text{ask}} = \\delta - \\theta\\ell"),
    p("from the mid. The quotes' centre is $m - \\theta\\ell$ and the spread $2\\delta$ is unchanged. The expected change in inventory per second is the bid fill rate minus the ask fill rate:"),
    eq("\\lambda_b - \\lambda_a = A e^{-k\\delta}\\left(e^{-k\\theta\\ell} - e^{k\\theta\\ell}\\right) = -2\\lambda\\,\\sinh(k\\theta\\ell) \\approx -2\\lambda k\\theta\\,\\ell,"),
    p("where $\\lambda = A e^{-k\\delta}$ and the approximation holds for small $k\\theta\\ell$. The drift is proportional to $-\\ell$: long positions are pushed down and short ones up. Inventory is no longer a plain random walk but is pulled back to zero at rate $\\kappa = 2\\lambda k\\theta$. Balancing the random fills against this pull gives a long-run variance of $1/(2k\\theta)$ lots$^2$, which does not depend on $A$ and falls as $\\theta$ grows."),
    {
      kind: "check",
      id: "inventory-risk/skew",
      prompt: "The maker is long and wants to reduce its inventory using only its quotes. It should",
      answer: { type: "choice", options: ["Lower both the bid and the ask", "Raise both the bid and the ask", "Widen only the ask", "Stop quoting the bid only"], correct: 0 },
      explain: "A lower ask is hit more often, so the maker sells; a lower bid is hit less often, so it buys less. Raising both quotes would make it buy more. Widening the ask makes selling harder, and withdrawing only the bid leaves the ask unchanged, so it does not actively push the position down.",
    },

    h("What skewing costs"),
    p("Skewing reduces risk but it is not free. When the maker is long, its ask is closer to the mid than $\\delta$, so each share it sells earns less than the full half-spread. It also fills less often on the side that would add to its position. Average spread income falls as $\\theta$ rises, while the standard deviation of the final position and of the P&L falls too. The figure runs 200 simulated minutes with the same random numbers for every $\\theta$, so the changes you see are caused by the skew alone."),
    p("Start with the skew at 0. The final inventory has a standard deviation of about 372 shares, the mean P&L is 36.01 USD and the P&L has a standard deviation of 39.62 USD. Drag the marker down, or use the slider, to 0.20 cents per 100 shares: the inventory spread falls to 253 shares and the P&L standard deviation to 34.50 USD, while the mean falls to 33.59 USD, about 7% less. At 0.40 cents the inventory spread is 202 shares and the P&L standard deviation 29.58 USD, but the mean has fallen to 30.39 USD. How much to skew depends on how much the maker dislikes risk, which is the question the next lessons answer precisely."),
    figure("inventory-skew"),

    h("Hedging instead of skewing"),
    p("There is a second way to remove inventory: trade it away. The maker can **cross the spread**, selling at the bid what it holds, and pay the half-spread plus any fee. Or it can trade a correlated instrument, such as a future or an exchange-traded fund, and leave the shares in place; this is the idea of \"Delta and hedging\", applied to an equity position rather than an option. Crossing the spread is certain and immediate but costs money on every share. Skewing costs nothing up front and works slowly, so it suits small positions and calm markets. Hedging suits large positions, fast markets, or a maker who cannot wait for customers to arrive."),
    {
      kind: "worked",
      title: "Hold the position or flatten it",
      steps: [
        { text: "A maker is long 500 shares and $\\sigma = 0.02$ USD per $\\sqrt{\\text{second}}$. The standard deviation of the P&L over 60 seconds, in USD:", tex: "500 \\times 0.02 \\times \\sqrt{60}", result: { value: 77.46, tolerance: 0.05 } },
        { text: "A one-sided 95% loss is 1.645 standard deviations, in USD:", tex: "1.645 \\times 77.46", result: { value: 127.42, tolerance: 0.1 } },
        { text: "Flattening now means selling 500 shares at the bid, which is the half-spread of 0.01 plus a fee of 0.003 below the mid. The cost in USD:", tex: "500 \\times (0.01 + 0.003)", result: { value: 6.5, tolerance: 0.01 } },
        { text: "The 95% loss avoided, net of the cost of flattening, in USD:", tex: "127.42 - 6.50", result: { value: 120.92, tolerance: 0.1 } },
      ],
    },
    p("A cost of 6.50 USD for removing a 127.42 USD tail loss is cheap, which is why makers flatten large positions rather than wait. With a position of 50 shares the same trade buys little, and skewing is enough."),
    {
      kind: "check",
      id: "inventory-risk/flatten",
      prompt: "A maker is long 2,000 shares. The half-spread is 0.01 USD and the fee is 0.002 USD per share. What does it cost to flatten the position at the bid, in USD?",
      answer: { type: "number", value: 24, tolerance: 0.1 },
      explain: "$2{,}000 \\times (0.01 + 0.002) = 24$ USD.",
    },

    h("Summary"),
    list(
      "Inventory $q$ earns $q\\,\\Delta m$; its P&L standard deviation is $|q|\\,\\sigma\\sqrt{\\tau}$, so risk grows with the size of the position and the square root of time.",
      "With symmetric quotes, random fills make inventory a random walk whose typical size grows like the square root of time.",
      "Moving both quotes down by $\\theta$ per lot when long makes the expected inventory change $-2\\lambda\\sinh(k\\theta\\ell)$, which pulls inventory back to zero.",
      "Skewing lowers the variance of inventory and P&L but gives up some spread income; the figure shows both effects.",
      "Crossing the spread or trading a correlated instrument removes inventory at a certain cost, which pays off for large positions.",
    ),
    note("The next lesson, \"Optimal quoting: the Avellaneda–Stoikov model\", chooses the skew from the maker's risk aversion instead of treating it as a free number."),
    lab("/market-making", "Open the Market Making lab"),
  ],
  hu: [
    p("A market maker (árjegyző) minden körútnál megkeresi a spreadet, de a körút két fele között pozíciót tart, az ár pedig közben mozog. A „Market makerek és a likviditás” egyetlen ilyen körutat mutatott; ez a lecke azt kérdezi, mi történik, ha sok körút fedi egymást, és a pozíció az egyik oldalra gyűlik. Felhasználja a „Véletlen bolyongás és Brown-mozgás” gondolatát, hogy az árváltozások véletlen bolyongásként viselkednek, megméri a pozíció kockázatát, és megmutatja a market maker fő eszközét ennek kezelésére: mindkét jegyzés eltolását."),

    h("A készlet eredménye"),
    p("A market maker **készlete** $q$ a tartott részvények száma: hosszú pozíciónál pozitív, rövidnél negatív. Ha a középár $\\Delta m$-mel változik, miközben a pozíció változatlan, az eredmény"),
    eq("\\text{P\\&L} = q\\,\\Delta m."),
    p("Tegyük fel, hogy a középár olyan véletlen bolyongást követ, amelynek szórása $\\sigma$ $\\sqrt{\\text{másodperc}}$-onként. $\\tau$ másodperc alatt $\\Delta m$ várható értéke 0, szórása $\\sigma\\sqrt{\\tau}$, így a pozíció eredményének várható értéke 0, szórása pedig"),
    eq("\\text{sd}(q\\,\\Delta m) = |q|\\,\\sigma\\sqrt{\\tau}, \\qquad \\text{Var} = q^2\\sigma^2\\tau."),
    p("A kockázat a pozíció méretével arányosan, a tartási idő négyzetgyökével nő. A pozíció megkétszerezése megkétszerezi a szórást és megnégyszerezi a varianciát. A kockázatért várhatóan nem jár díj, hiszen a várható érték nulla, ezért az a célszerű, hogy a market maker annyit tartson belőle, amennyit a spreadbevétel indokol."),
    {
      kind: "check",
      id: "inventory-risk/sd",
      prompt: "Egy market maker 1000 részvényt tart rövid pozícióban. A középár szórása $\\sigma = 0{,}01$ USD $\\sqrt{\\text{másodperc}}$-onként. Mekkora a pozíció eredményének szórása 100 másodperc alatt, USD-ben?",
      answer: { type: "number", value: 100, tolerance: 0.5 },
      explain: "$|q|\\,\\sigma\\sqrt{\\tau} = 1000 \\times 0{,}01 \\times \\sqrt{100} = 100$ USD. A pozíció előjele nem számít, csak a mérete.",
    },

    h("Hogyan épül fel a készlet"),
    p("A készlet csak akkor változik, ha egy ügyfél kereskedik a market makerrel. A vételi áron történő teljesülés egy lottal (itt 100 részvény) növeli, az eladási áron történő eggyel csökkenti. Hogy melyik oldal teljesül legközelebb, az véletlen, ezért a középár körül szimmetrikus jegyzések mellett is elmozdul a pozíció. Tegyük fel, hogy mindkét oldal $\\lambda$ ütemben teljesül másodpercenként. $T$ másodperc alatt kb. $2\\lambda T$ teljesülés van, mindegyik egyenlő eséllyel $+1$ vagy $-1$ lot, így a pozíció $T$ másodperc után véletlen bolyongás $2\\lambda T$ lot$^2$ varianciával. Tipikus mérete $\\sqrt{T}$-vel nő, pontosan úgy, mint az ár."),
    p("A középártól $\\delta$ távolságra lévő jegyzés teljesülési üteme $\\lambda(\\delta) = A\\,e^{-k\\delta}$: minél közelebb van a jegyzés, annál gyakrabban találják el. $A = 0{,}25$ másodpercenként, $k = 30$ USD-onként és $\\delta = 0{,}02$ USD mellett mindkét oldal $0{,}25\\,e^{-0{,}6} \\approx 0{,}137$ ütemben teljesül másodpercenként, nagyjából hétmásodpercenként egyszer. Az ilyen market maker egy perc végére gyakran több lot pozícióval találja magát, amelyet nem ő választott."),

    h("A jegyzések eltolása"),
    p("A market maker befolyásolhatja, melyik oldalt találják el. Ha hosszú pozícióban van, azt szeretné, hogy előbb egy eladás jöjjön, mint egy vétel. Ezt úgy éri el, hogy **mindkét** jegyzést lejjebb viszi: az eladási ár olcsóbb lesz, ezért gyakrabban találják el, a vételi ár kevésbé vonzó, ezért ritkábban. Ezt hívjuk a jegyzések **eltolásának**. Legyen $\\ell = q/100$ a készlet lotokban, $\\theta$ pedig az eltolás lotonként USD-ben. A vételi és az eladási ár ekkor a középártól"),
    eq("\\delta_{\\text{bid}} = \\delta + \\theta\\ell, \\qquad \\delta_{\\text{ask}} = \\delta - \\theta\\ell"),
    p("távolságra van. A jegyzések közepe $m - \\theta\\ell$, a $2\\delta$ spread változatlan. A készlet várható változása másodpercenként a vételi és az eladási oldali teljesülési ütem különbsége:"),
    eq("\\lambda_b - \\lambda_a = A e^{-k\\delta}\\left(e^{-k\\theta\\ell} - e^{k\\theta\\ell}\\right) = -2\\lambda\\,\\sinh(k\\theta\\ell) \\approx -2\\lambda k\\theta\\,\\ell,"),
    p("ahol $\\lambda = A e^{-k\\delta}$, és a közelítés kis $k\\theta\\ell$-re érvényes. A sodródás $-\\ell$-lel arányos: a hosszú pozíciót lefelé, a rövidet felfelé tolja. A készlet így már nem egyszerű véletlen bolyongás, hanem $\\kappa = 2\\lambda k\\theta$ ütemben húzódik vissza nullához. A véletlen teljesülések és ez a visszahúzás egyensúlyából a hosszú távú variancia $1/(2k\\theta)$ lot$^2$, amely nem függ $A$-tól, és $\\theta$ növelésével csökken."),
    {
      kind: "check",
      id: "inventory-risk/skew",
      prompt: "A market maker hosszú pozícióban van, és csak a jegyzéseivel akarja csökkenteni a készletét. Mit tegyen?",
      answer: { type: "choice", options: ["Mindkét jegyzést lejjebb viszi", "Mindkét jegyzést feljebb viszi", "Csak az eladási árat szélesíti", "Csak a vételi jegyzést vonja vissza"], correct: 0 },
      explain: "A lejjebb vitt eladási árat gyakrabban találják el, így többet ad el; a lejjebb vitt vételi árat ritkábban, így kevesebbet vesz. Mindkettő felvitele több vételt hozna. Az eladási ár szélesítése nehezíti az eladást, a vételi jegyzés visszavonása pedig az eladási árat változatlanul hagyja, tehát nem tolja aktívan lefelé a pozíciót.",
    },

    h("Mibe kerül az eltolás"),
    p("Az eltolás csökkenti a kockázatot, de nem ingyenes. Ha a market maker hosszú pozícióban van, az eladási ára közelebb van a középárhoz, mint $\\delta$, így minden eladott részvény kevesebbet hoz a teljes fél spreadnél. Ritkábban teljesül az az oldal is, amely a pozíciót növelné. Az átlagos spreadbevétel $\\theta$ növelésével csökken, de a záró készlet és az eredmény szórása is csökken. Az ábra 200 szimulált percet futtat minden $\\theta$-ra ugyanazokkal a véletlen számokkal, így a látott változásokat egyedül az eltolás okozza."),
    p("Kezdd 0 eltolással. A záró készlet szórása kb. 372 részvény, az átlagos eredmény 36,01 USD, az eredmény szórása 39,62 USD. Húzd lefelé a jelölőt, vagy használd a csúszkát 0,20 centre 100 részvényenként: a készlet szórása 253 részvényre, az eredmény szórása 34,50 USD-re esik, az átlag pedig 33,59 USD-re csökken, kb. 7%-kal. 0,40 centnél a készlet szórása 202 részvény, az eredmény szórása 29,58 USD, de az átlag már csak 30,39 USD. Hogy mennyit érdemes eltolni, az attól függ, mennyire kerüli a kockázatot a market maker; erre a következő leckék adnak pontos választ."),
    figure("inventory-skew"),

    h("Fedezés az eltolás helyett"),
    p("A készlettől meg lehet szabadulni úgy is, hogy a market maker eladja azt. **Átlépheti a spreadet**, vagyis eladhatja a tartott mennyiséget a vételi áron, és megfizeti a fél spreadet meg az esetleges díjat. Vagy kereskedhet egy korrelált eszközzel, például határidős ügylettel vagy tőzsdén kereskedett alappal, és a részvényeket megtartja; ez a „Delta és fedezés” gondolata, opció helyett részvénypozícióra alkalmazva. A spread átlépése biztos és azonnali, de minden részvényen pénzbe kerül. Az eltolás előre nem kerül semmibe, és lassan hat, ezért kis pozícióra és nyugodt piacra való. A fedezés nagy pozícióra, gyors piacra vagy olyan market makerre való, amely nem tud az ügyfelekre várni."),
    {
      kind: "worked",
      title: "Tartani vagy lezárni a pozíciót",
      steps: [
        { text: "Egy market maker 500 részvényt tart hosszan, $\\sigma = 0{,}02$ USD $\\sqrt{\\text{másodperc}}$-onként. Az eredmény szórása 60 másodperc alatt, USD-ben:", tex: "500 \\times 0{,}02 \\times \\sqrt{60}", result: { value: 77.46, tolerance: 0.05 } },
        { text: "Az egyoldali 95%-os veszteség 1,645 szórás, USD-ben:", tex: "1{,}645 \\times 77{,}46", result: { value: 127.42, tolerance: 0.1 } },
        { text: "A lezárás 500 részvény eladását jelenti a vételi áron, ami a középár alatt van a 0,01 fél spreaddel és a 0,003 díjjal. A költség USD-ben:", tex: "500 \\times (0{,}01 + 0{,}003)", result: { value: 6.5, tolerance: 0.01 } },
        { text: "Az elkerült 95%-os veszteség a lezárás költségével csökkentve, USD-ben:", tex: "127{,}42 - 6{,}50", result: { value: 120.92, tolerance: 0.1 } },
      ],
    },
    p("A 6,50 USD költség olcsó ár egy 127,42 USD-s szélsőséges veszteség kiküszöböléséért, ezért zárják le a market makerek a nagy pozíciókat ahelyett, hogy várnának. 50 részvényes pozíciónál ugyanez az ügylet keveset ad, és az eltolás elég."),
    {
      kind: "check",
      id: "inventory-risk/flatten",
      prompt: "Egy market maker 2000 részvényt tart hosszan. A fél spread 0,01 USD, a díj részvényenként 0,002 USD. Mennyibe kerül a pozíció lezárása a vételi áron, USD-ben?",
      answer: { type: "number", value: 24, tolerance: 0.1 },
      explain: "$2000 \\times (0{,}01 + 0{,}002) = 24$ USD.",
    },

    h("Összefoglalás"),
    list(
      "A $q$ készlet eredménye $q\\,\\Delta m$; az eredmény szórása $|q|\\,\\sigma\\sqrt{\\tau}$, így a kockázat a pozíció méretével és az idő négyzetgyökével nő.",
      "Szimmetrikus jegyzéseknél a véletlen teljesülésektől a készlet véletlen bolyongássá válik, tipikus mérete az idő négyzetgyökével nő.",
      "Ha hosszú pozíciónál mindkét jegyzést lotonként $\\theta$-val lejjebb visszük, a készlet várható változása $-2\\lambda\\sinh(k\\theta\\ell)$, ami nullához húzza vissza a készletet.",
      "Az eltolás csökkenti a készlet és az eredmény varianciáját, de lemond némi spreadbevételről; az ábra mindkét hatást mutatja.",
      "A spread átlépése vagy egy korrelált eszközzel való kereskedés biztos költséggel szünteti meg a készletet, ami nagy pozíciónál megéri.",
    ),
    note("A következő lecke, az „Optimális jegyzés: az Avellaneda–Stoikov-modell”, a market maker kockázatkerüléséből határozza meg az eltolást, ahelyett hogy szabad paraméternek tekintené."),
    lab("/market-making", "Nyisd meg a Market Making labort"),
  ],
};
