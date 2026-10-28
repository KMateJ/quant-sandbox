import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const avellanedaStoikov: GuideLessonContent = {
  en: [
    p("\"Inventory risk and quote skewing\" argued that a market maker holding too much of an asset should lower both quotes, and that the spread should reflect the risk it carries. This lesson turns the argument into one rule. Avellaneda and Stoikov start from the utility function of \"Risk aversion and the optimal complete portfolio\", let the market maker maximise it, and obtain a reservation price, which sets the skew, and a spread, which sets the width. We derive the first from scratch and state the second with a sketch of where it comes from."),

    h("Set-up"),
    p("The mid price follows the Brownian motion of \"Random walks and Brownian motion\" without drift: $dS_t = \\sigma\\,dW_t$. The maker has cash $x$ and an inventory of $q$ shares (negative when short), and trades until a horizon $T$. At the end it is worth $x + qS_T$, and it values that outcome with exponential utility:"),
    eq("U = -e^{-\\gamma\\,(x + q S_T)},\\qquad \\gamma > 0."),
    p("The parameter $\\gamma$ is the maker's risk aversion. The maker chooses its quotes as distances from the mid: a bid at $S - \\delta^b$ and an ask at $S + \\delta^a$. A quote at distance $\\delta$ is filled at the rate $\\lambda(\\delta) = A\\,e^{-k\\delta}$ per unit of time, as in \"Market makers and liquidity\": the closer the quote, the more often it trades. A larger $k$ means that fills thin out faster as the quote moves away."),

    h("The reservation price"),
    p("Suppose the maker does not trade at all until $T$. With $\\tau = T - t$ time left, $S_T = S + \\sigma\\sqrt{\\tau}\\,Z$ with $Z$ standard normal, and since $E[e^{cZ}] = e^{c^2/2}$,"),
    eq("E\\bigl[-e^{-\\gamma(x + qS_T)}\\bigr] = -e^{-\\gamma(x + qS)}\\;e^{\\gamma^2 q^2\\sigma^2\\tau/2}."),
    p("The last factor is the penalty for the variance of the position. Now ask what price $r^b$ makes the maker indifferent to buying one more share. After the purchase, cash is $x - r^b$ and inventory is $q+1$, so equal utility requires equal exponents:"),
    eq("-\\gamma\\,(x - r^b + (q+1)S) + \\tfrac12\\gamma^2 (q+1)^2\\sigma^2\\tau = -\\gamma\\,(x + qS) + \\tfrac12\\gamma^2 q^2\\sigma^2\\tau."),
    p("Since $(q+1)^2 - q^2 = 2q + 1$, this solves to the **indifference bid** below. The same steps for selling one share, with cash $x + r^a$ and inventory $q - 1$, give the **indifference ask**:"),
    eq("r^b = S - \\frac{(1 + 2q)\\,\\gamma\\sigma^2\\tau}{2},\\qquad r^a = S + \\frac{(1 - 2q)\\,\\gamma\\sigma^2\\tau}{2}."),
    p("Their average is the **reservation price**:"),
    eq("r = S - q\\,\\gamma\\,\\sigma^2\\,(T - t)."),
    p("With no inventory the reservation price is the mid. A long maker ($q > 0$) values the asset below the mid, because every extra share adds variance to a position it already has too much of; a short maker values it above. The shift is proportional to the inventory, the risk aversion, the variance and the time left."),
    {
      kind: "check",
      id: "avellaneda-stoikov/reservation",
      prompt: "A maker is short 4 shares ($q = -4$). The mid is 50, $\\gamma = 0.2$, $\\sigma = 1$ and $T - t = 0.25$. What is its reservation price?",
      answer: { type: "number", value: 50.2, tolerance: 0.001 },
      explain: "$r = 50 - (-4)(0.2)(1)(0.25) = 50 + 0.2 = 50.2$. A short maker wants to buy back, so it values the asset above the mid.",
    },

    h("The optimal spread"),
    p("The reservation price tells the maker where to centre its quotes. The spread is a separate decision, because each side now trades off two things: a quote far from the mid earns more per fill but fills less often. Writing the maker's value function and applying dynamic programming gives the Hamilton–Jacobi–Bellman equation of the problem. We do not derive it here. Avellaneda and Stoikov show that, to first order, the optimal distances are $\\delta^a = r^a - S + \\tfrac1\\gamma\\ln(1 + \\gamma/k)$ on the ask side and the mirror image on the bid side, and the total spread is"),
    eq("\\delta^a + \\delta^b = \\gamma\\,\\sigma^2\\,(T - t) + \\frac{2}{\\gamma}\\ln\\!\\Bigl(1 + \\frac{\\gamma}{k}\\Bigr)."),
    p("This is the paper's approximation, not an exact solution, but it is accurate in the range where the model is used. Each term has a meaning."),
    list(
      "The first term, $\\gamma\\sigma^2(T-t)$, is the price of inventory risk: it grows with risk aversion, with variance and with the time left to hold a position, and it vanishes at the horizon.",
      "The second term, $\\tfrac{2}{\\gamma}\\ln(1 + \\gamma/k)$, comes from the fill rate. As $\\gamma \\to 0$ it tends to $2/k$, which is the spread of a risk-neutral maker who just maximises the income $2\\delta A e^{-k\\delta}$: the half-spread $1/k$ of \"Adverse selection and informed trading\" when every customer is noise.",
    ),

    h("Quotes"),
    p("The maker centres the spread on the reservation price, not on the mid:"),
    eq("b = r - \\tfrac12(\\delta^a + \\delta^b),\\qquad a = r + \\tfrac12(\\delta^a + \\delta^b)."),
    p("A long maker therefore has both quotes below where a flat maker would put them: the ask is cheap and likely to sell, the bid is low and unlikely to buy, which is the skew of the previous lesson, now with a size. As the horizon approaches, $T - t \\to 0$, the inventory term in the reservation price and the first term in the spread both shrink: the reservation price returns to the mid and the spread to its fill-rate term."),
    {
      kind: "worked",
      title: "Quotes at the middle of the day",
      steps: [
        { text: "Take $\\gamma = 0.1$, $\\sigma = 2$, $k = 1.5$, mid $S = 100$, $T - t = 0.5$ and an inventory of $q = 6$ shares. The inventory shift is:", tex: "q\\gamma\\sigma^2(T-t) = 6 \\cdot 0.1 \\cdot 4 \\cdot 0.5", result: { value: 1.2, tolerance: 0.001 } },
        { text: "The reservation price is the mid less the shift:", tex: "r = 100 - 1.2", result: { value: 98.8, tolerance: 0.001 } },
        { text: "The inventory-risk term of the spread is:", tex: "\\gamma\\sigma^2(T-t) = 0.1 \\cdot 4 \\cdot 0.5", result: { value: 0.2, tolerance: 0.001 } },
        { text: "The fill-rate term of the spread is:", tex: "\\tfrac{2}{0.1}\\ln(1 + 0.1/1.5) = 20 \\cdot 0.064539", result: { value: 1.2908, tolerance: 0.001 } },
        { text: "The total spread is their sum:", tex: "0.2 + 1.2908", result: { value: 1.4908, tolerance: 0.001 } },
        { text: "The bid is half a spread below the reservation price:", tex: "b = 98.8 - 0.7454", result: { value: 98.0546, tolerance: 0.001 } },
        { text: "The ask is half a spread above it, well below the 100.75 a flat maker would post:", tex: "a = 98.8 + 0.7454", result: { value: 99.5454, tolerance: 0.001 } },
        { text: "At the close, $T - t = 0$, the spread is only the fill-rate term. With $\\gamma = 0.5$ it is:", tex: "\\tfrac{2}{0.5}\\ln(1 + 0.5/1.5)", result: { value: 1.1507, tolerance: 0.001 } },
      ],
    },

    h("The effect of risk aversion"),
    p("It is tempting to say that a more risk-averse maker always quotes wider. The two terms say otherwise. Early in the day the first term dominates and it grows with $\\gamma$. Near the close it vanishes, and the second term, $\\tfrac{2}{\\gamma}\\ln(1+\\gamma/k)$, is decreasing in $\\gamma$. At the close above, $\\gamma = 0.1$ gives a spread of 1.2908 and $\\gamma = 0.5$ gives 1.1507: the more risk-averse maker is tighter. A maker that fears inventory wants to trade, and near the end it has no time left to be hurt, so it quotes close to the mid to get fills."),
    p("The figure shows the quotes on a price column and the total spread against the time left for three values of $\\gamma$. Set the inventory to 0 and move the day clock: the reservation price sits on the mid and the quotes are symmetric. Now drag the inventory to $-10$ and the quotes shift up. At the defaults (inventory 6, half-way through the day, $\\gamma = 0.1$) the reservation price is 98.80, the spread 1.49, the bid 98.05 and the ask 99.55. At the start of the day the spread is 1.51 for $\\gamma = 0.05$, 2.05 for $\\gamma = 0.2$ and 4.27 for $\\gamma = 0.8$. At the close the order reverses: 1.31, 1.25 and 1.07."),
    figure("as-quotes"),
    {
      kind: "check",
      id: "avellaneda-stoikov/close",
      prompt: "At the close ($T - t \\to 0$), how does a more risk-averse maker's spread compare with a less risk-averse one's?",
      answer: {
        type: "choice",
        options: ["A tighter spread", "A wider spread", "The same spread", "No quotes at all"],
        correct: 0,
      },
      explain: "At the close only the term $\\tfrac{2}{\\gamma}\\ln(1+\\gamma/k)$ remains, and it decreases as $\\gamma$ grows. Early in the day the inventory term makes the opposite true.",
    },

    h("Symmetric and inventory strategies"),
    p("Avellaneda and Stoikov compare the inventory strategy above with a symmetric one that always centres the same spread on the mid, ignoring inventory. In their simulations the symmetric maker earns slightly more on average, since it never gives up a fill to manage a position. But its inventory wanders freely, so its final profit varies much more from one day to the next. The inventory strategy gives up a little profit for a large reduction in variance, which is what a risk-averse maker with this utility function wants."),
    note("The model assumes a constant $\\sigma$, a smooth exponential fill rate and no informed customers. The last is a real simplification: with them the fill-rate term should be wider, as in \"Adverse selection and informed trading\"."),

    h("Summary"),
    list(
      "The maker has exponential utility, a Brownian mid with volatility $\\sigma$ and fills at rate $A e^{-k\\delta}$ at distance $\\delta$ from the mid.",
      "The reservation price $r = S - q\\gamma\\sigma^2(T-t)$ is the average of the prices at which the maker is indifferent to buying or selling one more share.",
      "To first order the total spread is $\\gamma\\sigma^2(T-t) + \\tfrac{2}{\\gamma}\\ln(1+\\gamma/k)$, an inventory-risk term plus a fill-rate term.",
      "The quotes are $r \\mp \\tfrac12$ of the spread: a long maker moves both below the mid, and both effects fade towards the close.",
      "Higher risk aversion widens the spread early in the day and narrows it at the close, and the inventory strategy trades some mean profit for much lower variance.",
    ),
    lab("/avellaneda-stoikov", "Open the Avellaneda–Stoikov lab"),
  ],
  hu: [
    p("A „Készletkockázat és a jegyzések eltolása” lecke amellett érvelt, hogy a túl sok eszközt tartó market maker (árjegyző) mindkét jegyzését lejjebb teszi, és a spreadnek tükröznie kell a vállalt kockázatot. Ez a lecke egyetlen szabállyá fogja össze az érvelést. Avellaneda és Stoikov a „Kockázatkerülés és az optimális teljes portfólió” leckéből ismert hasznossági függvényből indul ki, és maximalizáltatja a market makerrel. Eredményül egy rezervációs árat kapunk, ez adja az eltolást, és egy spreadet, ez adja a szélességet. Az elsőt a nulláról levezetjük, a másodikat kimondjuk, és vázoljuk, honnan jön."),

    h("Felépítés"),
    p("A mid ár a „Véletlen bolyongás és Brown-mozgás” leckében megismert Brown-mozgást követi drift nélkül: $dS_t = \\sigma\\,dW_t$. A market makernek $x$ készpénze és $q$ db eszköze van (negatív, ha short), és a $T$ horizontig kereskedik. A végén $x + qS_T$ az értéke, és ezt exponenciális hasznossággal értékeli:"),
    eq("U = -e^{-\\gamma\\,(x + q S_T)},\\qquad \\gamma > 0."),
    p("A $\\gamma$ a market maker kockázatkerülése. A jegyzéseit a mid-től mért távolságként választja meg: a vételi jegyzés $S - \\delta^b$, az eladási $S + \\delta^a$. A $\\delta$ távolságra lévő jegyzés teljesülési üteme időegységenként $\\lambda(\\delta) = A\\,e^{-k\\delta}$, ahogy a „Market makerek és a likviditás” leckében: minél közelebb van a jegyzés, annál gyakrabban köt. Nagyobb $k$ azt jelenti, hogy a teljesülések gyorsabban ritkulnak a távolsággal."),

    h("A rezervációs ár"),
    p("Tegyük fel, hogy a market maker $T$-ig egyáltalán nem kereskedik. Ha $\\tau = T - t$ a hátralévő idő, akkor $S_T = S + \\sigma\\sqrt{\\tau}\\,Z$ standard normális $Z$-vel, és mivel $E[e^{cZ}] = e^{c^2/2}$,"),
    eq("E\\bigl[-e^{-\\gamma(x + qS_T)}\\bigr] = -e^{-\\gamma(x + qS)}\\;e^{\\gamma^2 q^2\\sigma^2\\tau/2}."),
    p("Az utolsó tényező a pozíció szórásáért fizetett büntetés. Kérdezzük meg, mekkora $r^b$ ár mellett közömbös a market maker eggyel több eszköz megvételére. A vétel után a készpénz $x - r^b$, a készlet $q+1$, tehát az egyenlő hasznossághoz egyenlő kitevők kellenek:"),
    eq("-\\gamma\\,(x - r^b + (q+1)S) + \\tfrac12\\gamma^2 (q+1)^2\\sigma^2\\tau = -\\gamma\\,(x + qS) + \\tfrac12\\gamma^2 q^2\\sigma^2\\tau."),
    p("Mivel $(q+1)^2 - q^2 = 2q + 1$, ebből adódik az alábbi **közömbösségi vételi ár**. Ugyanígy egy eszköz eladására, $x + r^a$ készpénzzel és $q - 1$ készlettel, a **közömbösségi eladási ár** jön ki:"),
    eq("r^b = S - \\frac{(1 + 2q)\\,\\gamma\\sigma^2\\tau}{2},\\qquad r^a = S + \\frac{(1 - 2q)\\,\\gamma\\sigma^2\\tau}{2}."),
    p("Az átlaguk a **rezervációs ár**:"),
    eq("r = S - q\\,\\gamma\\,\\sigma^2\\,(T - t)."),
    p("Készlet nélkül a rezervációs ár a mid. A long market maker ($q > 0$) a mid alatt értékeli az eszközt, mert minden további darab szórást ad egy amúgy is túl nagy pozícióhoz; a short market maker fölötte. Az eltolás arányos a készlettel, a kockázatkerüléssel, a varianciával és a hátralévő idővel."),
    {
      kind: "check",
      id: "avellaneda-stoikov/reservation",
      prompt: "Egy market maker 4 db eszközben short ($q = -4$). A mid 50, $\\gamma = 0{,}2$, $\\sigma = 1$ és $T - t = 0{,}25$. Mekkora a rezervációs ára?",
      answer: { type: "number", value: 50.2, tolerance: 0.001 },
      explain: "$r = 50 - (-4)(0{,}2)(1)(0{,}25) = 50 + 0{,}2 = 50{,}2$. A short market maker vissza akar vásárolni, ezért a mid fölött értékeli az eszközt.",
    },

    h("Az optimális spread"),
    p("A rezervációs ár megmondja, hol legyen a jegyzések középpontja. A spread külön döntés, mert most minden oldalon két dolgot kell mérlegelni: a mid-től távoli jegyzés teljesülésenként többet hoz, de ritkábban teljesül. A value function felírása és a dinamikus programozás a feladat Hamilton–Jacobi–Bellman-egyenletét adja. Ezt itt nem vezetjük le. Avellaneda és Stoikov megmutatják, hogy elsőrendben az optimális távolságok az eladási oldalon $\\delta^a = r^a - S + \\tfrac1\\gamma\\ln(1 + \\gamma/k)$, a vételin ennek tükörképe, a teljes spread pedig"),
    eq("\\delta^a + \\delta^b = \\gamma\\,\\sigma^2\\,(T - t) + \\frac{2}{\\gamma}\\ln\\!\\Bigl(1 + \\frac{\\gamma}{k}\\Bigr)."),
    p("Ez a cikk közelítése, nem pontos megoldás, de abban a tartományban pontos, ahol a modellt használják. Mindkét tagnak megvan a jelentése."),
    list(
      "Az első tag, $\\gamma\\sigma^2(T-t)$, a készletkockázat ára: nő a kockázatkerüléssel, a varianciával és a pozíció tartásának hátralévő idejével, a horizonton pedig eltűnik.",
      "A második tag, $\\tfrac{2}{\\gamma}\\ln(1 + \\gamma/k)$, a teljesülési ütemből jön. Ha $\\gamma \\to 0$, $2/k$-hoz tart, ami a kockázatsemleges market maker spreadje, aki egyszerűen a $2\\delta A e^{-k\\delta}$ bevételt maximalizálja: a „Kedvezőtlen kiválasztás és informált kereskedés” leckében szereplő $1/k$ féltávolság, amikor minden ügyfél zajkereskedő.",
    ),

    h("A jegyzések"),
    p("A market maker a spreadet a rezervációs ár köré teszi, nem a mid köré:"),
    eq("b = r - \\tfrac12(\\delta^a + \\delta^b),\\qquad a = r + \\tfrac12(\\delta^a + \\delta^b)."),
    p("A long market maker mindkét jegyzése így lejjebb van, mint egy nulla készletűé: az eladási jegyzés olcsó, tehát valószínűleg teljesül, a vételi alacsony, tehát valószínűleg nem, ez az előző lecke eltolása, most már mértékkel. A horizont közeledtével, $T - t \\to 0$, a rezervációs ár készletfüggő tagja és a spread első tagja is zsugorodik: a rezervációs ár visszatér a mid-hez, a spread pedig a teljesülési tagjához."),
    {
      kind: "worked",
      title: "Jegyzések a nap közepén",
      steps: [
        { text: "Legyen $\\gamma = 0{,}1$, $\\sigma = 2$, $k = 1{,}5$, a mid $S = 100$, $T - t = 0{,}5$ és a készlet $q = 6$ db. A készlet okozta eltolás:", tex: "q\\gamma\\sigma^2(T-t) = 6 \\cdot 0{,}1 \\cdot 4 \\cdot 0{,}5", result: { value: 1.2, tolerance: 0.001 } },
        { text: "A rezervációs ár a mid mínusz az eltolás:", tex: "r = 100 - 1{,}2", result: { value: 98.8, tolerance: 0.001 } },
        { text: "A spread készletkockázati tagja:", tex: "\\gamma\\sigma^2(T-t) = 0{,}1 \\cdot 4 \\cdot 0{,}5", result: { value: 0.2, tolerance: 0.001 } },
        { text: "A spread teljesülési tagja:", tex: "\\tfrac{2}{0{,}1}\\ln(1 + 0{,}1/1{,}5) = 20 \\cdot 0{,}064539", result: { value: 1.2908, tolerance: 0.001 } },
        { text: "A teljes spread az összegük:", tex: "0{,}2 + 1{,}2908", result: { value: 1.4908, tolerance: 0.001 } },
        { text: "A vételi jegyzés fél spreaddel van a rezervációs ár alatt:", tex: "b = 98{,}8 - 0{,}7454", result: { value: 98.0546, tolerance: 0.001 } },
        { text: "Az eladási jegyzés fél spreaddel fölötte van, jóval lejjebb a 100,75-nél, amit egy nulla készletű market maker jegyezne:", tex: "a = 98{,}8 + 0{,}7454", result: { value: 99.5454, tolerance: 0.001 } },
        { text: "A zárásnál, $T - t = 0$, a spread csak a teljesülési tag. $\\gamma = 0{,}5$ mellett:", tex: "\\tfrac{2}{0{,}5}\\ln(1 + 0{,}5/1{,}5)", result: { value: 1.1507, tolerance: 0.001 } },
      ],
    },

    h("A kockázatkerülés hatása"),
    p("Kézenfekvő azt gondolni, hogy a kockázatkerülőbb market maker mindig szélesebben jegyez. A két tag mást mutat. A nap elején az első tag dominál, és nő $\\gamma$-val. A zárás közelében eltűnik, és a második tag, $\\tfrac{2}{\\gamma}\\ln(1+\\gamma/k)$, $\\gamma$-ban csökkenő. A fenti zárásnál $\\gamma = 0{,}1$ spreadje 1,2908, $\\gamma = 0{,}5$-é 1,1507: a kockázatkerülőbb szűkebb. Aki fél a készlettől, kereskedni akar, és a vége felé már nincs ideje, hogy kárt szenvedjen, ezért a mid közelében jegyez, hogy teljesüljön."),
    p("Az ábra egy ároszlopon mutatja a jegyzéseket, és a teljes spreadet a hátralévő idő függvényében három $\\gamma$-értékre. Állítsd a készletet 0-ra, és mozgasd a napi órát: a rezervációs ár a mid-en van, a jegyzések szimmetrikusak. Húzd a készletet $-10$-re, és a jegyzések följebb tolódnak. Az alapértékeknél (készlet 6, a nap fele, $\\gamma = 0{,}1$) a rezervációs ár 98,80, a spread 1,49, a vételi jegyzés 98,05, az eladási 99,55. A nap elején a spread $\\gamma = 0{,}05$-nél 1,51, $\\gamma = 0{,}2$-nél 2,05, $\\gamma = 0{,}8$-nál 4,27. A zárásnál a sorrend megfordul: 1,31, 1,25 és 1,07."),
    figure("as-quotes"),
    {
      kind: "check",
      id: "avellaneda-stoikov/close",
      prompt: "A zárásnál ($T - t \\to 0$) hogyan viszonyul a kockázatkerülőbb market maker spreadje a kevésbé kockázatkerülőéhez?",
      answer: {
        type: "choice",
        options: ["Szűkebb a spread", "Szélesebb a spread", "Ugyanakkora a spread", "Egyáltalán nem jegyez"],
        correct: 0,
      },
      explain: "A zárásnál csak a $\\tfrac{2}{\\gamma}\\ln(1+\\gamma/k)$ tag marad, és ez $\\gamma$ növekedésével csökken. A nap elején a készletkockázati tag miatt fordított a helyzet.",
    },

    h("Szimmetrikus és készletvezérelt stratégia"),
    p("Avellaneda és Stoikov összeveti a fenti készletvezérelt stratégiát egy szimmetrikussal, amely ugyanazt a spreadet mindig a mid köré teszi, a készletet figyelmen kívül hagyva. Szimulációikban a szimmetrikus market maker átlagosan valamivel többet keres, mert egyetlen teljesülésről sem mond le a pozíció kezelése miatt. De a készlete szabadon bolyong, így a végső nyeresége napról napra sokkal jobban ingadozik. A készletvezérelt stratégia egy kis nyereségről lemond a variancia nagy csökkenéséért, és ezt akarja egy ilyen hasznosságú, kockázatkerülő market maker."),
    note("A modell állandó $\\sigma$-t, sima exponenciális teljesülési ütemet és informált ügyfelek hiányát tételezi fel. Az utolsó valódi egyszerűsítés: velük a teljesülési tagnak szélesebbnek kellene lennie, ahogy a „Kedvezőtlen kiválasztás és informált kereskedés” leckében."),

    h("Összefoglalás"),
    list(
      "A market maker hasznossága exponenciális, a mid $\\sigma$ volatilitású Brown-mozgás, a teljesülések üteme a mid-től mért $\\delta$ távolságon $A e^{-k\\delta}$.",
      "A $r = S - q\\gamma\\sigma^2(T-t)$ rezervációs ár azon árak átlaga, amelyeken a market maker közömbös eggyel több eszköz vételére vagy eladására.",
      "A teljes spread elsőrendben $\\gamma\\sigma^2(T-t) + \\tfrac{2}{\\gamma}\\ln(1+\\gamma/k)$: készletkockázati és teljesülési tag összege.",
      "A jegyzések $r$ körül fél-fél spreadre vannak: a long market maker mindkettőt a mid alá viszi, és mindkét hatás a zárás felé elhalványul.",
      "A nagyobb kockázatkerülés a nap elején szélesíti, a zárásnál szűkíti a spreadet, és a készletvezérelt stratégia az átlagos nyereség egy részét adja a jóval kisebb varianciáért.",
    ),
    lab("/avellaneda-stoikov", "Nyisd meg az Avellaneda–Stoikov labort"),
  ],
};
