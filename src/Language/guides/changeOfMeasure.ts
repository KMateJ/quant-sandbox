import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const changeOfMeasure: GuideLessonContent = {
  en: [
    p("Option pricing works with two sets of probabilities for the same outcomes: the real-world measure $\\mathbb{P}$ and the risk-neutral measure $\\mathbb{Q}$. The lesson \"Risk-neutral probabilities\" introduced them on a one-step tree. This lesson shows how one measure is turned into the other by reweighting outcomes, first on the tree and then for Brownian motion, using the tools from \"Random walks and Brownian motion\" and \"Itô's lemma\". The continuous-time result is Girsanov's theorem."),

    h("Two measures on the same outcomes"),
    p("A **probability measure** assigns a probability to every event. Two measures can share the same set of possible outcomes and disagree only about how likely each one is. In the one-step binomial model the stock goes up or down; under $\\mathbb{P}$ the up move has probability $p$, under $\\mathbb{Q}$ it has probability $q$. The outcomes, and hence every payoff, are identical. Only the weights differ."),
    p("A fair picture is a die that is reloaded: the six faces stay the same, but the chance of each face changes. Changing the measure means reloading the die, not repainting it."),

    h("The density between two measures"),
    p("Define a random variable $Z$ that, in each outcome, is the ratio of the two probabilities. On the tree it takes two values:"),
    eq("Z_u = \\frac{q}{p}, \\qquad Z_d = \\frac{1-q}{1-p}."),
    p("Multiplying by $Z$ converts a $\\mathbb{P}$-expectation into a $\\mathbb{Q}$-expectation. For any payoff $X$ with values $X_u$ and $X_d$:"),
    eq("\\mathbb{E}^{\\mathbb{P}}[Z X] = p\\,\\frac{q}{p}\\,X_u + (1-p)\\,\\frac{1-q}{1-p}\\,X_d = q X_u + (1-q) X_d = \\mathbb{E}^{\\mathbb{Q}}[X]."),
    p("Taking $X = 1$ shows that $\\mathbb{E}^{\\mathbb{P}}[Z] = 1$, and $Z$ is positive in every outcome. In general such a $Z$ is called the **Radon–Nikodym derivative** and is written $Z = d\\mathbb{Q}/d\\mathbb{P}$."),
    p("Example: with $S_0 = 100$, $u = 1.2$, $d = 0.9$ and $r = 2\\%$, the risk-neutral probability is $q = 0.4$. Suppose the real probability is $p = 0.6$. Then $Z_u = 0.4/0.6 \\approx 0.667$ and $Z_d = 0.6/0.4 = 1.5$. The check $0.6 \\cdot 0.667 + 0.4 \\cdot 1.5 = 1$ holds. For a call with strike 100, $X_u = 20$ and $X_d = 0$, so $\\mathbb{E}^{\\mathbb{P}}[ZX] = 0.6 \\cdot 0.667 \\cdot 20 = 8$, which equals $\\mathbb{E}^{\\mathbb{Q}}[X] = 0.4 \\cdot 20 = 8$. Discounting gives the call price $8/1.02 \\approx 7.84$. The density shrinks the weight of the good outcome and raises the weight of the bad one."),

    {
      kind: "check",
      id: "change-of-measure/density-value",
      prompt: "In a one-step tree the real probability of the up move is $p = 0.5$ and the risk-neutral one is $q = 0.4$. What is the density $Z_u = d\\mathbb{Q}/d\\mathbb{P}$ in the up state?",
      answer: { type: "number", value: 0.8, tolerance: 0.005 },
      explain: "$Z_u = q/p = 0.4/0.5 = 0.8$; in the down state $Z_d = 0.6/0.5 = 1.2$, and $0.5 \\cdot 0.8 + 0.5 \\cdot 1.2 = 1$.",
    },
    h("Equivalent measures"),
    p("The density only makes sense if $p$ and $1 - p$ are both positive, so that nothing is divided by zero. Two measures are **equivalent** when they agree on which events are impossible: an event has probability zero under $\\mathbb{P}$ exactly when it has probability zero under $\\mathbb{Q}$. Then $Z$ is strictly positive and the change of measure can be undone with $1/Z$."),
    p("This is the condition that matters for pricing. An arbitrage is a strategy that cannot lose and may win. Whether something is possible or impossible is the same under equivalent measures, so a market free of arbitrage under $\\mathbb{P}$ is free of arbitrage under $\\mathbb{Q}$ as well."),
    note("Two measures are equivalent if they have the same impossible events. Between equivalent measures, $\\mathbb{E}^{\\mathbb{Q}}[X] = \\mathbb{E}^{\\mathbb{P}}[ZX]$ with a strictly positive density $Z = d\\mathbb{Q}/d\\mathbb{P}$ that has $\\mathbb{E}^{\\mathbb{P}}[Z] = 1$."),

    h("Shifting the mean of a normal variable"),
    p("Now let the outcome be continuous. Under $\\mathbb{P}$ let $W_T \\sim N(0, T)$, the value of a Brownian motion at time $T$. Fix a number $\\theta$ and define"),
    eq("Z = \\exp\\!\\left(-\\theta W_T - \\tfrac{1}{2}\\theta^2 T\\right)."),
    p("It is positive, and its $\\mathbb{P}$-mean is 1, because $\\mathbb{E}[e^{-\\theta W_T}] = e^{\\frac12\\theta^2 T}$ for a normal variable with variance $T$. Multiply the normal density of $W_T$ by $Z$ and complete the square in the exponent:"),
    eq("\\frac{1}{\\sqrt{2\\pi T}}\\,e^{-\\frac{w^2}{2T}} \\cdot e^{-\\theta w - \\frac12\\theta^2 T} = \\frac{1}{\\sqrt{2\\pi T}}\\,e^{-\\frac{(w + \\theta T)^2}{2T}}."),
    p("The result is again a normal density with the same variance $T$, but with mean $-\\theta T$. Reweighting by $Z$ has moved the distribution sideways without changing its shape. Outcomes on one side get weights above 1, outcomes on the other side weights below 1."),

    {
      kind: "worked",
      title: "Reweighting a normal variable with θ = 0.5",
      steps: [
        { text: "Let $W_1 \\sim N(0, 1)$ under $\\mathbb{P}$ and $\\theta = 0.5$, $T = 1$. Weight of the outcome $W_1 = 1$.", tex: "Z = e^{-\\theta \\cdot 1 - \\frac12\\theta^2}", result: { value: 0.5353, tolerance: 0.0005 } },
        { text: "Weight of the outcome $W_1 = -1$.", tex: "Z = e^{\\theta - \\frac12\\theta^2}", result: { value: 1.455, tolerance: 0.0005 } },
        { text: "Mean of $W_1$ under the reweighted measure $\\mathbb{Q}$.", tex: "-\\theta T", result: { value: -0.5, tolerance: 0.0005 } },
        { text: "Variance of $W_1$ under $\\mathbb{Q}$: the shape is unchanged.", tex: "T", result: { value: 1, tolerance: 0.0005 } },
      ],
    },

    h("Girsanov's theorem"),
    p("The same reweighting works for the whole path, not just the endpoint. **Girsanov's theorem** states: if $W$ is a Brownian motion under $\\mathbb{P}$ and $\\mathbb{Q}$ is defined by the density $Z$ above, then"),
    eq("\\tilde W_t = W_t + \\theta t"),
    p("is a Brownian motion under $\\mathbb{Q}$. The paths themselves are unchanged. Under the new weights, $W$ acquires a drift of $-\\theta$ per unit time, and adding $\\theta t$ back removes it. In increments, $dW_t = d\\tilde W_t - \\theta\\,dt$: a change of measure changes the drift of a process and leaves its volatility alone."),

    h("Geometric Brownian motion under the risk-neutral measure"),
    p("Take the stock model from \"Geometric Brownian motion\", $dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t$, and substitute $dW_t = d\\tilde W_t - \\theta\\,dt$:"),
    eq("dS_t = (\\mu - \\sigma\\theta)\\,S_t\\,dt + \\sigma S_t\\,d\\tilde W_t."),
    p("Choose $\\theta$ so that the drift becomes the risk-free rate $r$:"),
    eq("\\theta = \\frac{\\mu - r}{\\sigma}, \\qquad dS_t = r S_t\\,dt + \\sigma S_t\\,d\\tilde W_t."),
    p("The number $\\theta$ is the **market price of risk**: the excess return of the stock per unit of volatility. Under $\\mathbb{Q}$ the stock earns $r$ on average, the continuous-time version of $\\mathbb{E}^{\\mathbb{Q}}[S_1] = (1+r)S_0$ on the tree. By Itô's lemma, as in \"Itô's lemma\","),
    eq("\\ln\\frac{S_T}{S_0} \\sim N\\!\\left(\\left(\\mu - \\tfrac12\\sigma^2\\right)T,\\ \\sigma^2 T\\right) \\text{ under } \\mathbb{P}, \\qquad \\ln\\frac{S_T}{S_0} \\sim N\\!\\left(\\left(r - \\tfrac12\\sigma^2\\right)T,\\ \\sigma^2 T\\right) \\text{ under } \\mathbb{Q}."),
    p("This explains why option prices depend on $\\sigma$ but not on $\\mu$. A price is a discounted $\\mathbb{Q}$-expectation, and under $\\mathbb{Q}$ the drift is $r$ whatever $\\mu$ was. The volatility survives the change of measure, because Girsanov only shifts the mean."),
    p("Example: $\\mu = 10\\%$, $r = 3\\%$, $\\sigma = 20\\%$, $T = 1$. The market price of risk is $\\theta = (0.10 - 0.03)/0.20 = 0.35$. The mean log return is $0.10 - 0.02 = 0.08$ under $\\mathbb{P}$ and $0.03 - 0.02 = 0.01$ under $\\mathbb{Q}$; the standard deviation is $0.20$ under both. A path with $W_1 = 1$ (a good year) gets weight $Z = e^{-0.35 - 0.06125} \\approx 0.663$, and a path with $W_1 = -1$ gets $e^{0.35 - 0.06125} \\approx 1.335$."),
    p("The figure plots the density of $\\ln(S_T/S_0)$ for $T = 1$ under $\\mathbb{P}$ and under $\\mathbb{Q}$, together with a histogram line of 200 000 draws simulated under $\\mathbb{P}$ and reweighted by $Z = d\\mathbb{Q}/d\\mathbb{P}$. The reweighted histogram lands close to the $\\mathbb{Q}$ density; the small gap is sampling noise. Move $\\mu$ and note that only the $\\mathbb{P}$ curve moves, while the $\\mathbb{Q}$ curve stays put and the reweighted sample stays close to it. Move $r$ to shift the $\\mathbb{Q}$ curve, and $\\sigma$ to widen both. The readouts show $\\theta$, the means under $\\mathbb{P}$ and $\\mathbb{Q}$, and the mean of the reweighted sample, which stays close to the $\\mathbb{Q}$ mean (at the defaults 0.94% against 1.00%)."),
    figure("girsanov-shift"),

    {
      kind: "check",
      id: "change-of-measure/market-price-of-risk",
      prompt: "A stock has $\\mu = 12\\%$ and $\\sigma = 25\\%$, and the risk-free rate is $r = 4\\%$. What is the market price of risk $\\theta$ used in Girsanov's theorem?",
      answer: { type: "number", value: 0.32, tolerance: 0.005 },
      explain: "$\\theta = (\\mu - r)/\\sigma = 0.08/0.25 = 0.32$. Under $\\mathbb{Q}$ the drift $\\mu$ is replaced by $r$, so $\\mu$ disappears from option prices.",
    },

    h("Summary"),
    list(
      "Two measures on the same outcomes differ only in their weights. The density $Z = d\\mathbb{Q}/d\\mathbb{P}$ converts one into the other: $\\mathbb{E}^{\\mathbb{Q}}[X] = \\mathbb{E}^{\\mathbb{P}}[ZX]$.",
      "Equivalent measures share their impossible events, so they agree on what counts as an arbitrage.",
      "Reweighting a normal variable by $e^{-\\theta W_T - \\frac12\\theta^2 T}$ shifts its mean by $-\\theta T$ and keeps its variance.",
      "Girsanov: $\\tilde W_t = W_t + \\theta t$ is a $\\mathbb{Q}$-Brownian motion. With $\\theta = (\\mu - r)/\\sigma$ the stock drifts at $r$ under $\\mathbb{Q}$.",
      "Prices are $\\mathbb{Q}$-expectations, so they depend on $\\sigma$ but not on $\\mu$.",
    ),
    note("The next lesson, \"Monte Carlo option pricing\", simulates the stock directly under $\\mathbb{Q}$, with drift $r$, as this lesson justifies."),
    lab("/gbm", "Compare drift and volatility of simulated stock paths in the GBM lab"),
  ],

  hu: [
    p("Az opcióárazás ugyanazokhoz a kimenetelekhez két különböző valószínűségi mértéket használ: a valós $\\mathbb{P}$ mértéket és a kockázatsemleges $\\mathbb{Q}$ mértéket. A „Kockázatsemleges valószínűségek” című lecke egy egylépéses fán vezette be őket. Ez a lecke azt mutatja meg, hogyan lesz az egyik mértékből a másik a kimenetelek átsúlyozásával: először a fán, aztán a Brown-mozgásra, a „Véletlen bolyongás és Brown-mozgás” és „Az Itô-lemma” című leckék eszközeivel. A folytonos idejű eredmény a Girsanov-tétel."),

    h("Két mérték ugyanazokon a kimeneteleken"),
    p("Egy **valószínűségi mérték** minden eseményhez valószínűséget rendel. Két mértéknek lehet ugyanaz a lehetséges kimenetelhalmaza, és csak abban térnek el, mennyire valószínű az egyes kimenetel. Az egylépéses binomiális modellben a részvény felfelé vagy lefelé lép; $\\mathbb{P}$ alatt a felfelé lépés valószínűsége $p$, $\\mathbb{Q}$ alatt $q$. A kimenetelek, és így minden kifizetés, azonosak. Csak a súlyok különböznek."),
    p("Jó kép erre egy átsúlyozott dobókocka: a hat lap ugyanaz marad, csak az egyes lapok esélye változik. A mértékcsere a kocka átsúlyozása, nem az átfestése."),

    h("A két mérték közötti sűrűség"),
    p("Vezessünk be egy $Z$ valószínűségi változót, amely minden kimenetelben a két valószínűség hányadosa. A fán két értéket vesz fel:"),
    eq("Z_u = \\frac{q}{p}, \\qquad Z_d = \\frac{1-q}{1-p}."),
    p("A $Z$-vel való szorzás a $\\mathbb{P}$ szerinti várható értéket $\\mathbb{Q}$ szerintivé alakítja. Bármely $X_u$ és $X_d$ értékű $X$ kifizetésre:"),
    eq("\\mathbb{E}^{\\mathbb{P}}[Z X] = p\\,\\frac{q}{p}\\,X_u + (1-p)\\,\\frac{1-q}{1-p}\\,X_d = q X_u + (1-q) X_d = \\mathbb{E}^{\\mathbb{Q}}[X]."),
    p("Az $X = 1$ választás mutatja, hogy $\\mathbb{E}^{\\mathbb{P}}[Z] = 1$, és $Z$ minden kimenetelben pozitív. Az ilyen $Z$ általános neve **Radon–Nikodym-derivált**, jelölése $Z = d\\mathbb{Q}/d\\mathbb{P}$."),
    p("Példa: $S_0 = 100$, $u = 1{,}2$, $d = 0{,}9$ és $r = 2\\%$ mellett a kockázatsemleges valószínűség $q = 0{,}4$. Legyen a valós valószínűség $p = 0{,}6$. Ekkor $Z_u = 0{,}4/0{,}6 \\approx 0{,}667$ és $Z_d = 0{,}6/0{,}4 = 1{,}5$. Az ellenőrzés, $0{,}6 \\cdot 0{,}667 + 0{,}4 \\cdot 1{,}5 = 1$, teljesül. Egy 100-as kötési árú call esetén $X_u = 20$ és $X_d = 0$, így $\\mathbb{E}^{\\mathbb{P}}[ZX] = 0{,}6 \\cdot 0{,}667 \\cdot 20 = 8$, ami megegyezik $\\mathbb{E}^{\\mathbb{Q}}[X] = 0{,}4 \\cdot 20 = 8$-cal. Diszkontálva a call ára $8/1{,}02 \\approx 7{,}84$. A sűrűség csökkenti a kedvező kimenetel súlyát, és növeli a kedvezőtlenét."),

    {
      kind: "check",
      id: "change-of-measure/density-value",
      prompt: "Egy egylépéses fában a felfelé lépés valós valószínűsége $p = 0{,}5$, kockázatsemleges valószínűsége $q = 0{,}4$. Mennyi a $Z_u = d\\mathbb{Q}/d\\mathbb{P}$ sűrűség a felső állapotban?",
      answer: { type: "number", value: 0.8, tolerance: 0.005 },
      explain: "$Z_u = q/p = 0{,}4/0{,}5 = 0{,}8$; az alsó állapotban $Z_d = 0{,}6/0{,}5 = 1{,}2$, és $0{,}5 \\cdot 0{,}8 + 0{,}5 \\cdot 1{,}2 = 1$.",
    },
    h("Ekvivalens mértékek"),
    p("A sűrűségnek csak akkor van értelme, ha $p$ és $1 - p$ is pozitív, vagyis sehol sem osztunk nullával. Két mérték **ekvivalens**, ha ugyanazokat az eseményeket tartják lehetetlennek: egy esemény pontosan akkor nulla valószínűségű $\\mathbb{P}$ alatt, ha $\\mathbb{Q}$ alatt is az. Ekkor $Z$ szigorúan pozitív, és a mértékcsere $1/Z$-vel visszafordítható."),
    p("Az árazás szempontjából ez a lényeges feltétel. Az arbitrázs olyan stratégia, amely nem veszíthet, de nyerhet. Hogy valami lehetséges vagy lehetetlen, az ekvivalens mértékek alatt ugyanaz, ezért ami $\\mathbb{P}$ alatt arbitrázsmentes piac, az $\\mathbb{Q}$ alatt is az."),
    note("Két mérték ekvivalens, ha ugyanazok a lehetetlen eseményeik. Ekvivalens mértékek között $\\mathbb{E}^{\\mathbb{Q}}[X] = \\mathbb{E}^{\\mathbb{P}}[ZX]$, ahol a $Z = d\\mathbb{Q}/d\\mathbb{P}$ sűrűség szigorúan pozitív és $\\mathbb{E}^{\\mathbb{P}}[Z] = 1$."),

    h("Egy normális változó várható értékének eltolása"),
    p("Legyen most a kimenetel folytonos. $\\mathbb{P}$ alatt legyen $W_T \\sim N(0, T)$, egy Brown-mozgás értéke a $T$ időpontban. Rögzítsünk egy $\\theta$ számot, és legyen"),
    eq("Z = \\exp\\!\\left(-\\theta W_T - \\tfrac{1}{2}\\theta^2 T\\right)."),
    p("Ez pozitív, és $\\mathbb{P}$ szerinti várható értéke 1, mert egy $T$ varianciájú normális változóra $\\mathbb{E}[e^{-\\theta W_T}] = e^{\\frac12\\theta^2 T}$. Szorozzuk meg $W_T$ normális sűrűségfüggvényét $Z$-vel, és alakítsuk teljes négyzetté a kitevőt:"),
    eq("\\frac{1}{\\sqrt{2\\pi T}}\\,e^{-\\frac{w^2}{2T}} \\cdot e^{-\\theta w - \\frac12\\theta^2 T} = \\frac{1}{\\sqrt{2\\pi T}}\\,e^{-\\frac{(w + \\theta T)^2}{2T}}."),
    p("Az eredmény ismét normális sűrűség ugyanazzal a $T$ varianciával, de $-\\theta T$ várható értékkel. A $Z$-vel való átsúlyozás oldalra tolta az eloszlást, az alakját nem változtatta meg. Az egyik oldal kimenetelei 1-nél nagyobb, a másik oldalé 1-nél kisebb súlyt kapnak."),

    {
      kind: "worked",
      title: "Egy normális változó átsúlyozása θ = 0,5 mellett",
      steps: [
        { text: "Legyen $W_1 \\sim N(0, 1)$ a $\\mathbb{P}$ alatt, $\\theta = 0{,}5$ és $T = 1$. A $W_1 = 1$ kimenetel súlya.", tex: "Z = e^{-\\theta \\cdot 1 - \\frac12\\theta^2}", result: { value: 0.5353, tolerance: 0.0005 } },
        { text: "A $W_1 = -1$ kimenetel súlya.", tex: "Z = e^{\\theta - \\frac12\\theta^2}", result: { value: 1.455, tolerance: 0.0005 } },
        { text: "$W_1$ várható értéke az átsúlyozott $\\mathbb{Q}$ mérték alatt.", tex: "-\\theta T", result: { value: -0.5, tolerance: 0.0005 } },
        { text: "$W_1$ szórásnégyzete $\\mathbb{Q}$ alatt: az eloszlás alakja nem változik.", tex: "T", result: { value: 1, tolerance: 0.0005 } },
      ],
    },

    h("A Girsanov-tétel"),
    p("Ugyanez az átsúlyozás nemcsak a végpontra, hanem az egész pályára működik. A **Girsanov-tétel** szerint ha $W$ Brown-mozgás $\\mathbb{P}$ alatt, és $\\mathbb{Q}$-t a fenti $Z$ sűrűség definiálja, akkor"),
    eq("\\tilde W_t = W_t + \\theta t"),
    p("Brown-mozgás $\\mathbb{Q}$ alatt. Maguk a pályák nem változnak. Az új súlyok mellett $W$ időegységenként $-\\theta$ driftet kap, és a $\\theta t$ hozzáadása ezt tünteti el. Növekményekben $dW_t = d\\tilde W_t - \\theta\\,dt$: a mértékcsere egy folyamat driftjét változtatja meg, a volatilitását nem."),

    h("Geometriai Brown-mozgás a kockázatsemleges mérték alatt"),
    p("Vegyük a „Geometriai Brown-mozgás” című lecke részvénymodelljét, $dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t$, és helyettesítsük be $dW_t = d\\tilde W_t - \\theta\\,dt$-t:"),
    eq("dS_t = (\\mu - \\sigma\\theta)\\,S_t\\,dt + \\sigma S_t\\,d\\tilde W_t."),
    p("Válasszuk $\\theta$-t úgy, hogy a drift a kockázatmentes $r$ kamat legyen:"),
    eq("\\theta = \\frac{\\mu - r}{\\sigma}, \\qquad dS_t = r S_t\\,dt + \\sigma S_t\\,d\\tilde W_t."),
    p("A $\\theta$ szám **a kockázat piaci ára**: a részvény többlethozama egységnyi volatilitásra vetítve. $\\mathbb{Q}$ alatt a részvény átlagosan $r$-et hoz, ez a fán érvényes $\\mathbb{E}^{\\mathbb{Q}}[S_1] = (1+r)S_0$ folytonos idejű változata. Az Itô-lemmából, ahogy „Az Itô-lemma” című leckében,"),
    eq("\\ln\\frac{S_T}{S_0} \\sim N\\!\\left(\\left(\\mu - \\tfrac12\\sigma^2\\right)T,\\ \\sigma^2 T\\right) \\text{ } \\mathbb{P} \\text{ alatt}, \\qquad \\ln\\frac{S_T}{S_0} \\sim N\\!\\left(\\left(r - \\tfrac12\\sigma^2\\right)T,\\ \\sigma^2 T\\right) \\text{ } \\mathbb{Q} \\text{ alatt}."),
    p("Ez magyarázza, miért függnek az opcióárak $\\sigma$-tól, de $\\mu$-től nem. Az ár diszkontált $\\mathbb{Q}$ szerinti várható érték, és $\\mathbb{Q}$ alatt a drift $r$, bármekkora volt is $\\mu$. A volatilitás túléli a mértékcserét, mert a Girsanov-tétel csak a várható értéket tolja el."),
    p("Példa: $\\mu = 10\\%$, $r = 3\\%$, $\\sigma = 20\\%$, $T = 1$. A kockázat piaci ára $\\theta = (0{,}10 - 0{,}03)/0{,}20 = 0{,}35$. A logaritmikus hozam várható értéke $\\mathbb{P}$ alatt $0{,}10 - 0{,}02 = 0{,}08$, $\\mathbb{Q}$ alatt $0{,}03 - 0{,}02 = 0{,}01$; a szórás mindkettőben $0{,}20$. Egy $W_1 = 1$ értékű pálya (jó év) súlya $Z = e^{-0{,}35 - 0{,}06125} \\approx 0{,}663$, egy $W_1 = -1$ értékűé $e^{0{,}35 - 0{,}06125} \\approx 1{,}335$."),
    p("Az ábra $T = 1$ mellett $\\ln(S_T/S_0)$ sűrűségét mutatja $\\mathbb{P}$ és $\\mathbb{Q}$ alatt, valamint egy hisztogramvonalat: $\\mathbb{P}$ alatt szimulált 200 000 húzást, $Z = d\\mathbb{Q}/d\\mathbb{P}$-vel átsúlyozva. Az átsúlyozott hisztogram közel esik a $\\mathbb{Q}$-sűrűséghez; a kis eltérés mintavételi zaj. Mozgasd $\\mu$-t: csak a $\\mathbb{P}$-görbe mozdul, a $\\mathbb{Q}$-görbe a helyén marad, az átsúlyozott minta pedig közel marad hozzá. Az $r$ a $\\mathbb{Q}$-görbét tolja el, a $\\sigma$ mindkettőt szélesíti. A kijelzők $\\theta$-t, a $\\mathbb{P}$ és $\\mathbb{Q}$ szerinti várható értéket, valamint az átsúlyozott minta átlagát mutatják, amely közel marad a $\\mathbb{Q}$ szerinti értékhez (alapbeállítással 0,94% az 1,00%-kal szemben)."),
    figure("girsanov-shift"),

    {
      kind: "check",
      id: "change-of-measure/market-price-of-risk",
      prompt: "Egy részvényre $\\mu = 12\\%$ és $\\sigma = 25\\%$, a kockázatmentes kamatláb $r = 4\\%$. Mekkora a Girsanov-tételben használt $\\theta$, a kockázat piaci ára?",
      answer: { type: "number", value: 0.32, tolerance: 0.005 },
      explain: "$\\theta = (\\mu - r)/\\sigma = 0{,}08/0{,}25 = 0{,}32$. $\\mathbb{Q}$ alatt a $\\mu$ drift helyére $r$ lép, így $\\mu$ eltűnik az opciós árakból.",
    },

    h("Összefoglalás"),
    list(
      "Két mérték ugyanazokon a kimeneteleken csak a súlyokban tér el. A $Z = d\\mathbb{Q}/d\\mathbb{P}$ sűrűség váltja át az egyiket a másikba: $\\mathbb{E}^{\\mathbb{Q}}[X] = \\mathbb{E}^{\\mathbb{P}}[ZX]$.",
      "Az ekvivalens mértékeknek ugyanazok a lehetetlen eseményeik, ezért abban is egyetértenek, mi számít arbitrázsnak.",
      "Egy normális változót $e^{-\\theta W_T - \\frac12\\theta^2 T}$-vel átsúlyozva a várható értéke $-\\theta T$-vel eltolódik, a varianciája nem változik.",
      "Girsanov: $\\tilde W_t = W_t + \\theta t$ Brown-mozgás $\\mathbb{Q}$ alatt. $\\theta = (\\mu - r)/\\sigma$ mellett a részvény driftje $\\mathbb{Q}$ alatt $r$.",
      "Az árak $\\mathbb{Q}$ szerinti várható értékek, ezért $\\sigma$-tól függnek, $\\mu$-től nem.",
    ),
    note("A következő lecke, a „Monte Carlo-opcióárazás”, közvetlenül $\\mathbb{Q}$ alatt, $r$ drifttel szimulálja a részvényt, ahogy ez a lecke indokolja."),
    lab("/gbm", "Hasonlítsd össze a szimulált árfolyampályák driftjét és volatilitását a GBM laborban"),
  ],
};
