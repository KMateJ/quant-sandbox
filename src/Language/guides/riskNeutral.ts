import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const riskNeutral: GuideLessonContent = {
  en: [
    p("In \"The one-step binomial model\" the call price came out as the cost of a replicating portfolio, $C_0 = \\Delta S_0 + B$. This lesson rewrites that price as a discounted weighted average of the two possible payoffs. The weights behave like probabilities, and they are the **risk-neutral probabilities** that every later pricing model uses."),

    h("Setting"),
    p("We keep the one-step model unchanged: the stock goes from $S_0$ to $uS_0$ or $dS_0$, the bond grows by $(1+r)$ over the period, and $d < 1+r < u$. The option pays $C_u$ in the up state and $C_d$ in the down state. The real-world probability of the up state is $p$, with $0 < p < 1$."),

    h("Rewriting the replication price"),
    p("Start from the replicating portfolio of the previous lesson:"),
    eq("\\Delta = \\frac{C_u - C_d}{(u-d)S_0}, \\qquad B = \\frac{uC_d - dC_u}{(u-d)(1+r)}."),
    p("Add $\\Delta S_0$ and $B$, writing both over the common denominator $(u-d)(1+r)$:"),
    eq("C_0 = \\frac{(1+r)(C_u - C_d) + uC_d - dC_u}{(u-d)(1+r)}."),
    p("Collect the terms in $C_u$ and in $C_d$:"),
    eq("C_0 = \\frac{1}{1+r}\\left[\\frac{(1+r) - d}{u-d}\\,C_u + \\frac{u - (1+r)}{u-d}\\,C_d\\right]."),
    p("Define"),
    eq("q = \\frac{(1+r) - d}{u - d}, \\qquad 1 - q = \\frac{u - (1+r)}{u-d}."),
    p("Then the price takes the form"),
    eq("C_0 = \\frac{1}{1+r}\\big[q\\,C_u + (1-q)\\,C_d\\big]."),

    h("$q$ as a probability"),
    p("The no-arbitrage condition $d < 1+r < u$ makes the numerator $(1+r) - d$ positive and smaller than $u - d$, so $0 < q < 1$. The two weights $q$ and $1-q$ are positive and add up to one. That is all a probability on two outcomes needs. Writing $\\mathbb{Q}$ for the probability measure that gives the up state probability $q$, the price is"),
    eq("C_0 = \\frac{1}{1+r}\\,\\mathbb{E}^{\\mathbb{Q}}[X],"),
    p("where $X$ is the payoff at time 1. The same formula holds for any payoff, because the derivation never used the shape of the call. If the no-arbitrage condition fails, $q$ falls outside $(0,1)$ and the formula has no meaning, which matches the fact that such a market has no consistent prices at all."),
    note("**Risk-neutral pricing.** With $q = \\frac{(1+r)-d}{u-d}$, the arbitrage-free price of any payoff $X$ is $\\frac{1}{1+r}\\mathbb{E}^{\\mathbb{Q}}[X]$: the expected payoff under $\\mathbb{Q}$, discounted at the risk-free rate."),
    {
      kind: "check",
      id: "risk-neutral/q-value",
      prompt: "In a one-step model $u = 1.1$, $d = 0.9$ and the simple rate for the period is $r = 2\\%$. What is the risk-neutral probability $q$ of the up move?",
      answer: { type: "number", value: 0.6, tolerance: 0.005 },
      explain: "$q = ((1+r) - d)/(u - d) = (1.02 - 0.9)/(1.1 - 0.9) = 0.12/0.2 = 0.6$.",
    },

    h("The real probability $p$ does not enter"),
    p("The formula for $q$ contains only $u$, $d$ and $r$. The real probability $p$ is absent. Two investors who disagree about how likely the up move is still agree on the option price, as long as they agree on $S_0$, $u$, $d$ and $r$. The reason is the replication argument: the portfolio matches the payoff in every state, so how often each state occurs is irrelevant."),
    p("The real probability already acts through the stock price. A market that thinks the up move is very likely will bid $S_0$ up, and $S_0$ is an input. Given $S_0$, however, the option adds no further dependence on $p$."),
    {
      kind: "check",
      id: "risk-neutral/depends-on-p",
      prompt: "Two traders agree on $S_0$, $u$, $d$ and $r$ but disagree about the real probability $p$ of the up move. Do they get different option prices?",
      answer: { type: "choice", options: ["No: $q$ uses only $u$, $d$ and $r$", "Yes: the trader with the higher $p$ gets a higher call price", "Yes, unless $p = 0.5$", "Only for puts"], correct: 0 },
      explain: "The replicating portfolio matches the payoff in both states, so how often each state occurs never enters. Given $S_0$, the price does not depend on $p$.",
    },

    h("Worked example"),
    p("Use the numbers from the previous lesson: $S_0 = 100$, $u = 1.2$, $d = 0.9$, $r = 2\\%$, $K = 100$, so $C_u = 20$ and $C_d = 0$."),
    eq("q = \\frac{1.02 - 0.9}{1.2 - 0.9} = \\frac{0.12}{0.3} = 0.4, \\qquad C_0 = \\frac{0.4\\cdot 20 + 0.6\\cdot 0}{1.02} \\approx 7.84."),
    p("This is the same 7.84 that the replicating portfolio gave. Now suppose the real probability of the up move is $p = 0.6$. Discounting the expected payoff under $\\mathbb{P}$ at the risk-free rate gives the **naive price**"),
    eq("\\frac{1}{1.02}\\,\\mathbb{E}^{\\mathbb{P}}[X] = \\frac{0.6\\cdot 20}{1.02} \\approx 11.76."),
    p("If the call traded at 11.76, you could sell it, build the replicating portfolio for 7.84 and keep 3.92 with no risk. So the naive price is wrong, and the error comes from discounting a risky payoff at the risk-free rate."),
    {
      kind: "worked",
      title: "A put priced two ways",
      steps: [
        { text: "Same tree, now a put with $K = 100$: $P_u = (100 - 120)^+ = 0$ and $P_d = (100 - 90)^+ = 10$. With $q = 0.4$, the risk-neutral price is", tex: "P_0 = \\frac{0.4 \\cdot 0 + 0.6 \\cdot 10}{1.02}", result: { value: 5.88, tolerance: 0.01 } },
        { text: "Replication: the share position is negative, a short sale.", tex: "\\Delta = \\frac{0 - 10}{120 - 90}", result: { value: -0.3333, tolerance: 0.001 } },
        { text: "The bond position is a deposit.", tex: "B = \\frac{10 - (-\\tfrac{1}{3}) \\cdot 90}{1.02}", result: { value: 39.22, tolerance: 0.01 } },
        { text: "The cost of the portfolio is the same price.", tex: "\\Delta S_0 + B = -33.33 + 39.22", result: { value: 5.88, tolerance: 0.01 } },
      ],
    },

    h("The stock earns $r$ under $\\mathbb{Q}$"),
    p("Apply the pricing formula to the stock itself, whose payoff is $uS_0$ or $dS_0$:"),
    eq("\\mathbb{E}^{\\mathbb{Q}}[S_1] = q\\,uS_0 + (1-q)\\,dS_0 = S_0\\big(d + q(u-d)\\big) = (1+r)\\,S_0."),
    p("Under $\\mathbb{Q}$ the stock's expected return equals the risk-free rate. This is where the name comes from: $\\mathbb{Q}$ is the probability under which a risk-neutral investor, one who demands no extra return for bearing risk, would be content with the observed prices. Equivalently, the discounted stock price has the same expectation as today's price,"),
    eq("\\mathbb{E}^{\\mathbb{Q}}\\left[\\frac{S_1}{1+r}\\right] = S_0,"),
    p("so the discounted price is a **martingale** under $\\mathbb{Q}$: its expected future value equals its current value."),
    p("Under the real probability the stock usually earns more. In the example with $p = 0.6$ the expected growth factor is $0.6\\cdot 1.2 + 0.4\\cdot 0.9 = 1.08$, an expected return of 8%, compared with 2% under $\\mathbb{Q}$. The difference of 6% is the risk premium. Think of $\\mathbb{Q}$ as a deliberately reweighted die: the faces are the same, but the weights are chosen so that every traded asset earns exactly $r$ on average. It is a calculation device, not a forecast."),

    h("Naive price against arbitrage-free price"),
    p("The figure fixes $S_0 = 100$, $u = 1.2$, $d = 0.9$ and $K = 100$, and plots two prices against the real probability $p$. The naive price $\\frac{1}{1+r}\\mathbb{E}^{\\mathbb{P}}[X]$ rises with $p$. The arbitrage-free price is a flat line. The two cross where $p = q$. Move $p$ and note that only the naive price and the expected stock return under $\\mathbb{P}$ change; then move $r$ and note that $q$ and the arbitrage-free price change, while the expected return under $\\mathbb{Q}$ always equals $r$."),
    figure("real-vs-risk-neutral"),

    h("The roles of $\\mathbb{P}$ and $\\mathbb{Q}$"),
    list(
      "$\\mathbb{P}$ describes what actually happens. It is used for forecasting, risk measurement and estimating expected returns.",
      "$\\mathbb{Q}$ is defined by the prices of traded assets. It is used for pricing derivatives that can be replicated.",
      "The two measures agree on which outcomes are possible; they differ only in the weights they put on them.",
    ),

    h("Summary"),
    list(
      "The replication price can be written as $C_0 = \\frac{1}{1+r}[qC_u + (1-q)C_d]$ with $q = \\frac{(1+r)-d}{u-d}$.",
      "No arbitrage, $d < 1+r < u$, is exactly the condition $0 < q < 1$.",
      "The real probability $p$ does not appear in the price; discounting $\\mathbb{E}^{\\mathbb{P}}[X]$ at $r$ gives a wrong, arbitrageable price.",
      "Under $\\mathbb{Q}$ the stock earns the risk-free rate, $\\mathbb{E}^{\\mathbb{Q}}[S_1] = (1+r)S_0$, and the discounted price is a martingale.",
    ),
    lab("/binomial", "Compare real and risk-neutral weights in the Binomial lab"),
  ],

  hu: [
    p("„Az egylépéses binomiális modell” leckében a call ára egy replikáló portfólió költségeként adódott: $C_0 = \\Delta S_0 + B$. Ez a lecke ezt az árat a két lehetséges kifizetés diszkontált súlyozott átlagaként írja fel. A súlyok valószínűségként viselkednek; ezek a **kockázatsemleges valószínűségek**, amelyeket minden későbbi árazási modell használ."),

    h("A kiinduló modell"),
    p("Az egylépéses modellt változatlanul hagyjuk: a részvény $S_0$-ról $uS_0$-ra vagy $dS_0$-ra lép, a kötvény a periódus alatt $(1+r)$-szeresére nő, és $d < 1+r < u$. Az opció felfelé állapotban $C_u$-t, lefelé állapotban $C_d$-t fizet. A felfelé állapot valós valószínűsége $p$, ahol $0 < p < 1$."),

    h("A replikációs ár átírása"),
    p("Induljunk ki az előző lecke replikáló portfóliójából:"),
    eq("\\Delta = \\frac{C_u - C_d}{(u-d)S_0}, \\qquad B = \\frac{uC_d - dC_u}{(u-d)(1+r)}."),
    p("Adjuk össze $\\Delta S_0$-t és $B$-t, közös nevezőre hozva $(u-d)(1+r)$-rel:"),
    eq("C_0 = \\frac{(1+r)(C_u - C_d) + uC_d - dC_u}{(u-d)(1+r)}."),
    p("Csoportosítsuk a $C_u$-t és a $C_d$-t tartalmazó tagokat:"),
    eq("C_0 = \\frac{1}{1+r}\\left[\\frac{(1+r) - d}{u-d}\\,C_u + \\frac{u - (1+r)}{u-d}\\,C_d\\right]."),
    p("Legyen"),
    eq("q = \\frac{(1+r) - d}{u - d}, \\qquad 1 - q = \\frac{u - (1+r)}{u-d}."),
    p("Ekkor az ár alakja"),
    eq("C_0 = \\frac{1}{1+r}\\big[q\\,C_u + (1-q)\\,C_d\\big]."),

    h("A $q$ mint valószínűség"),
    p("A $d < 1+r < u$ arbitrázsmentességi feltétel miatt a $(1+r) - d$ számláló pozitív és kisebb $u - d$-nél, tehát $0 < q < 1$. A $q$ és $1-q$ súly pozitív, összegük egy. Két kimenetelen egy valószínűséghez ennyi kell. Jelölje $\\mathbb{Q}$ azt a valószínűségi mértéket, amely a felfelé állapotnak $q$ valószínűséget ad; ekkor az ár"),
    eq("C_0 = \\frac{1}{1+r}\\,\\mathbb{E}^{\\mathbb{Q}}[X],"),
    p("ahol $X$ az 1. időpontbeli kifizetés. Ugyanez a képlet bármely kifizetésre érvényes, mert a levezetés sehol nem használta ki a call alakját. Ha az arbitrázsmentességi feltétel sérül, $q$ kiesik a $(0,1)$ intervallumból, és a képletnek nincs értelme; ez összhangban van azzal, hogy egy ilyen piacon egyáltalán nincsenek konzisztens árak."),
    note("**Kockázatsemleges árazás.** Ha $q = \\frac{(1+r)-d}{u-d}$, bármely $X$ kifizetés arbitrázsmentes ára $\\frac{1}{1+r}\\mathbb{E}^{\\mathbb{Q}}[X]$: a $\\mathbb{Q}$ szerinti várható kifizetés, a kockázatmentes kamattal diszkontálva."),
    {
      kind: "check",
      id: "risk-neutral/q-value",
      prompt: "Egy egylépéses modellben $u = 1{,}1$, $d = 0{,}9$, a periódusra vonatkozó egyszerű kamatláb $r = 2\\%$. Mennyi a felfelé lépés $q$ kockázatsemleges valószínűsége?",
      answer: { type: "number", value: 0.6, tolerance: 0.005 },
      explain: "$q = ((1+r) - d)/(u - d) = (1{,}02 - 0{,}9)/(1{,}1 - 0{,}9) = 0{,}12/0{,}2 = 0{,}6$.",
    },

    h("A valós $p$ valószínűség nem szerepel"),
    p("A $q$ képletében csak $u$, $d$ és $r$ szerepel, a valós $p$ valószínűség nem. Két befektető, akik nem értenek egyet abban, mennyire valószínű a felfelé lépés, mégis ugyanazt az opcióárat kapja, ha $S_0$-ban, $u$-ban, $d$-ben és $r$-ben egyetértenek. Ennek oka a replikációs érv: a portfólió minden állapotban reprodukálja a kifizetést, így közömbös, milyen gyakran következnek be az egyes állapotok."),
    p("A valós valószínűség a részvényáron keresztül már hat. Ha a piac nagyon valószínűnek tartja a felfelé lépést, felveri $S_0$-t, és $S_0$ bemenő adat. Adott $S_0$ mellett viszont az opció ára már nem függ tovább $p$-től."),
    {
      kind: "check",
      id: "risk-neutral/depends-on-p",
      prompt: "Két kereskedő egyetért $S_0$-ban, $u$-ban, $d$-ben és $r$-ben, de a felfelé lépés valós $p$ valószínűségében nem. Különböző opcióárat kapnak?",
      answer: { type: "choice", options: ["Nem: $q$ csak $u$-tól, $d$-től és $r$-től függ", "Igen: a nagyobb $p$-t feltételező magasabb call árat kap", "Igen, hacsak nem $p = 0{,}5$", "Csak putoknál"], correct: 0 },
      explain: "A replikáló portfólió mindkét állapotban reprodukálja a kifizetést, így az, hogy melyik állapot milyen gyakori, sehol nem jelenik meg. Adott $S_0$ mellett az ár nem függ $p$-től.",
    },

    h("Kidolgozott példa"),
    p("Használjuk az előző lecke számait: $S_0 = 100$, $u = 1{,}2$, $d = 0{,}9$, $r = 2\\%$, $K = 100$, így $C_u = 20$ és $C_d = 0$."),
    eq("q = \\frac{1{,}02 - 0{,}9}{1{,}2 - 0{,}9} = \\frac{0{,}12}{0{,}3} = 0{,}4, \\qquad C_0 = \\frac{0{,}4\\cdot 20 + 0{,}6\\cdot 0}{1{,}02} \\approx 7{,}84."),
    p("Ez ugyanaz a 7,84, amelyet a replikáló portfólió adott. Tegyük fel most, hogy a felfelé lépés valós valószínűsége $p = 0{,}6$. Ha a $\\mathbb{P}$ szerinti várható kifizetést a kockázatmentes kamattal diszkontáljuk, a **naiv árat** kapjuk:"),
    eq("\\frac{1}{1{,}02}\\,\\mathbb{E}^{\\mathbb{P}}[X] = \\frac{0{,}6\\cdot 20}{1{,}02} \\approx 11{,}76."),
    p("Ha a call 11,76-on kereskedne, eladhatnánk, 7,84-ért felépíthetnénk a replikáló portfóliót, és kockázat nélkül megtarthatnánk 3,92-t. A naiv ár tehát hibás, és a hiba abból ered, hogy egy kockázatos kifizetést a kockázatmentes kamattal diszkontáltunk."),
    {
      kind: "worked",
      title: "Egy put árazása kétféleképpen",
      steps: [
        { text: "Ugyanaz a fa, most egy $K = 100$ kötési árú put: $P_u = (100 - 120)^+ = 0$ és $P_d = (100 - 90)^+ = 10$. $q = 0{,}4$ mellett a kockázatsemleges ár", tex: "P_0 = \\frac{0{,}4 \\cdot 0 + 0{,}6 \\cdot 10}{1{,}02}", result: { value: 5.88, tolerance: 0.01 } },
        { text: "Replikálás: a részvénypozíció negatív, vagyis shortolás.", tex: "\\Delta = \\frac{0 - 10}{120 - 90}", result: { value: -0.3333, tolerance: 0.001 } },
        { text: "A kötvénypozíció betét.", tex: "B = \\frac{10 - (-\\tfrac{1}{3}) \\cdot 90}{1{,}02}", result: { value: 39.22, tolerance: 0.01 } },
        { text: "A portfólió költsége ugyanez az ár.", tex: "\\Delta S_0 + B = -33{,}33 + 39{,}22", result: { value: 5.88, tolerance: 0.01 } },
      ],
    },

    h("A részvény hozama $\\mathbb{Q}$ alatt $r$"),
    p("Alkalmazzuk az árazási képletet magára a részvényre, amelynek kifizetése $uS_0$ vagy $dS_0$:"),
    eq("\\mathbb{E}^{\\mathbb{Q}}[S_1] = q\\,uS_0 + (1-q)\\,dS_0 = S_0\\big(d + q(u-d)\\big) = (1+r)\\,S_0."),
    p("$\\mathbb{Q}$ alatt a részvény várható hozama a kockázatmentes kamatláb. Innen a név: $\\mathbb{Q}$ az a valószínűség, amely mellett egy kockázatsemleges befektető, aki a kockázatvállalásért nem vár többlethozamot, elfogadná a megfigyelt árakat. Másképp fogalmazva, a diszkontált részvényár várható értéke a mai ár,"),
    eq("\\mathbb{E}^{\\mathbb{Q}}\\left[\\frac{S_1}{1+r}\\right] = S_0,"),
    p("vagyis a diszkontált ár $\\mathbb{Q}$ alatt **martingál**: várható jövőbeli értéke a jelenlegi értéke."),
    p("A valós valószínűség szerint a részvény általában többet hoz. A $p = 0{,}6$ példában a várható növekedési szorzó $0{,}6\\cdot 1{,}2 + 0{,}4\\cdot 0{,}9 = 1{,}08$, azaz 8% várható hozam, szemben a $\\mathbb{Q}$ szerinti 2%-kal. A 6% különbség a kockázati prémium. Képzeld el $\\mathbb{Q}$-t egy szándékosan átsúlyozott dobókockaként: a lapok ugyanazok, de a súlyokat úgy választjuk, hogy minden forgalmazott termék átlagosan pontosan $r$-et hozzon. Számítási eszköz, nem előrejelzés."),

    h("Naiv ár és arbitrázsmentes ár"),
    p("Az ábra rögzíti az $S_0 = 100$, $u = 1{,}2$, $d = 0{,}9$ és $K = 100$ értékeket, és két árat rajzol a valós $p$ valószínűség függvényében. A $\\frac{1}{1+r}\\mathbb{E}^{\\mathbb{P}}[X]$ naiv ár $p$-vel nő, az arbitrázsmentes ár vízszintes egyenes. A kettő ott metszi egymást, ahol $p = q$. Mozgasd $p$-t, és figyeld meg, hogy csak a naiv ár és a $\\mathbb{P}$ szerinti várható részvényhozam változik; aztán mozgasd $r$-et, és figyeld meg, hogy $q$ és az arbitrázsmentes ár változik, a $\\mathbb{Q}$ szerinti várható hozam pedig mindig $r$."),
    figure("real-vs-risk-neutral"),

    h("$\\mathbb{P}$ és $\\mathbb{Q}$ szerepe"),
    list(
      "$\\mathbb{P}$ azt írja le, ami ténylegesen történik. Előrejelzésre, kockázatmérésre és várható hozamok becslésére használjuk.",
      "$\\mathbb{Q}$-t a forgalmazott termékek árai határozzák meg. Replikálható derivatívák árazására használjuk.",
      "A két mérték ugyanazokat a kimeneteleket tartja lehetségesnek; csak a rájuk tett súlyokban különböznek.",
    ),

    h("Összefoglalás"),
    list(
      "A replikációs ár felírható $C_0 = \\frac{1}{1+r}[qC_u + (1-q)C_d]$ alakban, ahol $q = \\frac{(1+r)-d}{u-d}$.",
      "Az arbitrázsmentesség, $d < 1+r < u$, pontosan a $0 < q < 1$ feltétel.",
      "A valós $p$ valószínűség nem szerepel az árban; ha $\\mathbb{E}^{\\mathbb{P}}[X]$-et $r$-rel diszkontáljuk, hibás, arbitrálható árat kapunk.",
      "$\\mathbb{Q}$ alatt a részvény a kockázatmentes kamatot hozza, $\\mathbb{E}^{\\mathbb{Q}}[S_1] = (1+r)S_0$, és a diszkontált ár martingál.",
    ),
    lab("/binomial", "Hasonlítsd össze a valós és a kockázatsemleges súlyokat a Binomiális laborban"),
  ],
};
