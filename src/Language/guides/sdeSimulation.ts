import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const sdeSimulation: GuideLessonContent = {
  en: [
    p("In \"Monte Carlo option pricing\" every terminal price was drawn in one step, because \"Itô's lemma\" gave the exact solution of geometric Brownian motion. Most models used in practice have no such formula. This lesson shows how to simulate a stochastic differential equation step by step with the Euler–Maruyama scheme, how to measure the error it makes, and how fast that error shrinks as the steps get smaller. Geometric Brownian motion serves as the test case, precisely because its exact solution is known."),

    h("Stochastic differential equations"),
    p("A **stochastic differential equation** (SDE) describes how a quantity $X_t$ changes over a short time $dt$:"),
    eq("dX_t = a(X_t, t)\\,dt + b(X_t, t)\\,dW_t."),
    p("The **drift** $a$ is the expected rate of change, and the **diffusion** coefficient $b$ scales the random shock $dW_t$ of a Brownian motion. Geometric Brownian motion is the case $a = \\mu X$, $b = \\sigma X$. A mean-reverting interest rate, or the variance in \"Stochastic volatility and the Heston model\", has other coefficients, and for many of them no closed-form solution exists."),

    h("The Euler–Maruyama step"),
    p("Split $[0, T]$ into $n$ steps of length $\\Delta t = T/n$ and freeze the coefficients at the start of each step. The Brownian increment over a step is normal with variance $\\Delta t$, so it can be written $\\Delta W_k = \\sqrt{\\Delta t}\\,Z_k$ with $Z_k$ standard normal. The **Euler–Maruyama** scheme is"),
    eq("X_{k+1} = X_k + a(X_k, t_k)\\,\\Delta t + b(X_k, t_k)\\,\\sqrt{\\Delta t}\\,Z_k."),
    p("It is the natural first approximation: it keeps exactly the two terms that dominate the Itô expansion of the change over one step, the $dt$ term and the $dW$ term, and drops everything smaller. Think of it as walking along a curved road by taking straight steps in the direction you are facing; the shorter the steps, the closer you stay to the road."),
    p("For geometric Brownian motion one step reads $S_{k+1} = S_k\\,(1 + \\mu\\,\\Delta t + \\sigma\\,\\Delta W_k)$, while the exact solution over the same step is"),
    eq("S_{k+1} = S_k \\exp\\!\\Big(\\big(\\mu - \\tfrac12\\sigma^2\\big)\\Delta t + \\sigma\\,\\Delta W_k\\Big)."),
    p("Example: $S_0 = 100$, $\\mu = 8\\%$, $\\sigma = 40\\%$, $\\Delta t = 0.25$ and $Z = 1$, so $\\Delta W = 0.5$. Euler gives $100\\,(1 + 0.02 + 0.2) = 122.00$. The exact value is $100\\,e^{(0.08 - 0.08) \\cdot 0.25 + 0.2} = 100\\,e^{0.2} = 122.14$. With $Z = -1$ Euler gives $82.00$ against the exact $81.87$. The step misses by about $0.13$ either way, because it ignores the curvature of the exponential."),

    {
      kind: "check",
      id: "sde-simulation/euler-step",
      prompt: "One Euler step for geometric Brownian motion with $S_0 = 100$, $\\mu = 8\\%$, $\\sigma = 40\\%$, $\\Delta t = 0.25$ and the draw $Z = -0.5$. What is $S_1$?",
      answer: { type: "number", value: 92, tolerance: 0.01 },
      explain: "$\\Delta W = \\sqrt{0.25} \\cdot (-0.5) = -0.25$, so $S_1 = 100\\,(1 + 0.08 \\cdot 0.25 + 0.4 \\cdot (-0.25)) = 100 \\cdot 0.92 = 92$.",
    },
    h("Strong and weak error"),
    p("There are two ways to judge a simulation scheme, depending on what it is used for."),
    list(
      "The **strong error** $\\mathbb{E}\\big[\\,|X_T - \\hat X_T|\\,\\big]$ compares the simulated path $\\hat X$ with the true path driven by the same Brownian motion. It matters when the path itself matters, for example when hedging along it.",
      "The **weak error** $\\big|\\,\\mathbb{E}[f(X_T)] - \\mathbb{E}[f(\\hat X_T)]\\,\\big|$ compares only averages. It is what matters for Monte Carlo pricing, which needs the distribution of $X_T$, not individual paths.",
    ),
    note("For smooth coefficients the Euler–Maruyama scheme has strong order $\\tfrac12$ and weak order 1: the strong error shrinks like $\\sqrt{\\Delta t}$, the weak error like $\\Delta t$. Four times as many steps halve the strong error but cut the weak error to a quarter."),
    p("Geometric Brownian motion makes the weak error easy to compute. Each Euler step multiplies the expected value by $1 + \\mu\\,\\Delta t$, so $\\mathbb{E}[\\hat S_T] = S_0\\,(1 + \\mu T/n)^n$, against the exact $S_0\\,e^{\\mu T}$. With the numbers above, $100\\,e^{0.08} = 108.3287$, and the gaps for $n = 4$, $16$ and $64$ are $0.0855$, $0.0216$ and $0.0054$: a quarter each time."),

    {
      kind: "worked",
      title: "Weak error of Euler for GBM with two steps",
      steps: [
        { text: "With $S_0 = 100$, $\\mu = 8\\%$, $T = 1$ and $n = 2$, each Euler step multiplies the expected value by this factor.", tex: "1 + \\mu T/n", result: { value: 1.04, tolerance: 0.0005 } },
        { text: "Expected value of the Euler approximation at $T$.", tex: "S_0\\,(1 + \\mu T/n)^n", result: { value: 108.16, tolerance: 0.005 } },
        { text: "Exact expected value.", tex: "S_0\\,e^{\\mu T}", result: { value: 108.3287, tolerance: 0.0005 } },
        { text: "Weak error: twice the gap at $n = 4$, as order 1 predicts.", tex: "S_0\\,e^{\\mu T} - S_0\\,(1 + \\mu T/n)^n", result: { value: 0.1687, tolerance: 0.0005 } },
      ],
    },
    {
      kind: "check",
      id: "sde-simulation/strong-order",
      prompt: "You increase the number of Euler steps from 16 to 256. Roughly what happens to the strong error?",
      answer: { type: "choice", options: ["It halves.", "It shrinks about 4 times.", "It shrinks about 16 times.", "It does not change."], correct: 1 },
      explain: "Strong order $\\tfrac12$: the error scales like $\\sqrt{\\Delta t}$. Sixteen times more steps shrink it by $\\sqrt{16} = 4$. The weak error, of order 1, would shrink about 16 times.",
    },
    h("The same path on finer grids"),
    p("To see the strong error you must compare a simulation with the exact path driven by the same randomness. The figure draws one Brownian path on a fine grid of 256 steps over one year, with $S_0 = 100$, $\\mu = 8\\%$ and $\\sigma = 40\\%$; the high volatility makes the error visible. The exact solution is drawn from that path, and the Euler approximation uses the same path on a coarser grid: each coarse increment is the sum of the fine increments it spans."),
    p("Choose $n = 4$, $16$, $64$ or $256$ steps and watch the Euler path close in on the exact one; \"New path\" draws another Brownian path. Hover over the chart, or focus it and use the arrow keys, to compare the two values at a grid time. Below, the strong error at $T$ averaged over 500 paths is plotted against $\\Delta t$ on log–log axes, next to a reference line of slope $\\tfrac12$. It falls from about $4.82$ at $n = 4$ to $2.34$, $1.23$ and $0.63$ at $n = 256$: roughly halving with every fourfold refinement, as order $\\tfrac12$ predicts. On the first path the terminal values at $n = 16$ are $177.23$ exact against $183.44$ for Euler."),
    figure("euler-convergence"),

    h("Simulating the logarithm instead"),
    p("For geometric Brownian motion there is a better option than discretising $S$ itself. By \"Itô's lemma\", $\\ln S_t$ follows"),
    eq("d(\\ln S_t) = \\big(\\mu - \\tfrac12\\sigma^2\\big)\\,dt + \\sigma\\,dW_t,"),
    p("whose coefficients are constant. Euler steps on $\\ln S$ are therefore exact, whatever $\\Delta t$ is, and prices stay positive automatically. Euler on $S$ can even produce a negative price if $1 + \\mu\\,\\Delta t + \\sigma\\,\\Delta W$ falls below zero. Transforming a model into variables with simpler coefficients before discretising is a standard trick; when no such transformation exists, as for many mean-reverting or stochastic-volatility models, small steps and the error orders above are what you rely on."),

    h("Summary"),
    list(
      "An SDE $dX = a\\,dt + b\\,dW$ is simulated step by step with Euler–Maruyama: $X_{k+1} = X_k + a\\,\\Delta t + b\\sqrt{\\Delta t}\\,Z_k$.",
      "The strong error (paths) has order $\\tfrac12$ and the weak error (averages) order 1; Monte Carlo pricing only needs the weak one.",
      "Coarse and fine grids must use the same Brownian path to be compared: coarse increments are sums of fine ones.",
      "When a transformation gives constant coefficients, as $\\ln S$ does for geometric Brownian motion, simulate that variable instead: the steps become exact.",
    ),
    note("A later lesson, \"Mean reversion: Ornstein–Uhlenbeck and Vasicek\", studies a process whose drift pulls it back towards a long-run level, and simulates it with exactly this kind of step."),
    lab("/gbm", "Simulate geometric Brownian motion paths in the GBM lab"),
  ],

  hu: [
    p("A „Monte Carlo-opcióárazás” című leckében minden végső árat egyetlen lépésben sorsoltunk, mert „Az Itô-lemma” megadta a geometriai Brown-mozgás pontos megoldását. A gyakorlatban használt modellek többségére nincs ilyen képlet. Ez a lecke megmutatja, hogyan szimulálható egy sztochasztikus differenciálegyenlet lépésről lépésre az Euler–Maruyama-sémával, hogyan mérhető az általa elkövetett hiba, és milyen gyorsan csökken ez a hiba a lépések finomításával. Tesztesetként a geometriai Brown-mozgást használjuk, éppen azért, mert ismerjük a pontos megoldását."),

    h("Sztochasztikus differenciálegyenletek"),
    p("Egy **sztochasztikus differenciálegyenlet** (SDE) azt írja le, hogyan változik egy $X_t$ mennyiség egy rövid $dt$ idő alatt:"),
    eq("dX_t = a(X_t, t)\\,dt + b(X_t, t)\\,dW_t."),
    p("Az $a$ **drift** a várható változási ütem, a $b$ **diffúziós együttható** pedig egy Brown-mozgás $dW_t$ véletlen sokkját skálázza. A geometriai Brown-mozgás az $a = \\mu X$, $b = \\sigma X$ eset. Egy átlaghoz visszahúzó kamatlábnak vagy a „Sztochasztikus volatilitás és a Heston-modell” varianciájának más együtthatói vannak, és sokukra nincs zárt alakú megoldás."),

    h("Az Euler–Maruyama-lépés"),
    p("Osszuk fel a $[0, T]$ intervallumot $n$ darab $\\Delta t = T/n$ hosszú lépésre, és minden lépés elején fagyasszuk be az együtthatókat. Egy lépés alatti Brown-növekmény normális eloszlású $\\Delta t$ szórásnégyzettel, így felírható $\\Delta W_k = \\sqrt{\\Delta t}\\,Z_k$ alakban, ahol $Z_k$ standard normális. Az **Euler–Maruyama**-séma:"),
    eq("X_{k+1} = X_k + a(X_k, t_k)\\,\\Delta t + b(X_k, t_k)\\,\\sqrt{\\Delta t}\\,Z_k."),
    p("Ez a természetes első közelítés: pontosan azt a két tagot tartja meg, amely egy lépés változásának Itô-féle kifejtésében dominál, a $dt$-s és a $dW$-s tagot, a kisebbeket pedig elhagyja. Jó kép erre, ha egy kanyargós úton egyenes lépésekkel haladunk abba az irányba, amerre éppen nézünk: minél rövidebbek a lépések, annál közelebb maradunk az úthoz."),
    p("A geometriai Brown-mozgásra egy lépés $S_{k+1} = S_k\\,(1 + \\mu\\,\\Delta t + \\sigma\\,\\Delta W_k)$, míg a pontos megoldás ugyanazon a lépésen"),
    eq("S_{k+1} = S_k \\exp\\!\\Big(\\big(\\mu - \\tfrac12\\sigma^2\\big)\\Delta t + \\sigma\\,\\Delta W_k\\Big)."),
    p("Példa: $S_0 = 100$, $\\mu = 8\\%$, $\\sigma = 40\\%$, $\\Delta t = 0{,}25$ és $Z = 1$, tehát $\\Delta W = 0{,}5$. Az Euler-lépés $100\\,(1 + 0{,}02 + 0{,}2) = 122{,}00$-t ad. A pontos érték $100\\,e^{(0{,}08 - 0{,}08) \\cdot 0{,}25 + 0{,}2} = 100\\,e^{0{,}2} = 122{,}14$. $Z = -1$ mellett az Euler-érték $82{,}00$, a pontos $81{,}87$. A lépés mindkét irányban nagyjából $0{,}13$-mal téved, mert figyelmen kívül hagyja az exponenciális görbületét."),

    {
      kind: "check",
      id: "sde-simulation/euler-step",
      prompt: "Egy Euler-lépés geometriai Brown-mozgásra: $S_0 = 100$, $\\mu = 8\\%$, $\\sigma = 40\\%$, $\\Delta t = 0{,}25$, a sorsolt érték $Z = -0{,}5$. Mennyi $S_1$?",
      answer: { type: "number", value: 92, tolerance: 0.01 },
      explain: "$\\Delta W = \\sqrt{0{,}25} \\cdot (-0{,}5) = -0{,}25$, így $S_1 = 100\\,(1 + 0{,}08 \\cdot 0{,}25 + 0{,}4 \\cdot (-0{,}25)) = 100 \\cdot 0{,}92 = 92$.",
    },
    h("Erős és gyenge hiba"),
    p("Egy szimulációs sémát kétféleképpen ítélhetünk meg, attól függően, mire használjuk."),
    list(
      "Az **erős hiba** $\\mathbb{E}\\big[\\,|X_T - \\hat X_T|\\,\\big]$ a szimulált $\\hat X$ pályát ugyanazon Brown-mozgás által hajtott valódi pályával veti össze. Akkor számít, ha maga a pálya számít, például ha a pálya mentén fedezünk.",
      "A **gyenge hiba** $\\big|\\,\\mathbb{E}[f(X_T)] - \\mathbb{E}[f(\\hat X_T)]\\,\\big|$ csak átlagokat hasonlít össze. Ez számít a Monte Carlo-árazásnál, amelynek $X_T$ eloszlására van szüksége, nem az egyes pályákra.",
    ),
    note("Sima együtthatók esetén az Euler–Maruyama-séma erős rendje $\\tfrac12$, gyenge rendje 1: az erős hiba $\\sqrt{\\Delta t}$-vel, a gyenge hiba $\\Delta t$-vel arányosan csökken. Négyszer annyi lépés felezi az erős hibát, a gyenge hibát viszont negyedére csökkenti."),
    p("A geometriai Brown-mozgásnál a gyenge hiba könnyen kiszámolható. Minden Euler-lépés $1 + \\mu\\,\\Delta t$-vel szorozza a várható értéket, így $\\mathbb{E}[\\hat S_T] = S_0\\,(1 + \\mu T/n)^n$, szemben a pontos $S_0\\,e^{\\mu T}$ értékkel. A fenti számokkal $100\\,e^{0{,}08} = 108{,}3287$, az eltérés pedig $n = 4$, $16$ és $64$ esetén $0{,}0855$, $0{,}0216$ és $0{,}0054$: minden alkalommal a negyedére csökken."),

    {
      kind: "worked",
      title: "Az Euler-séma gyenge hibája GBM-re két lépéssel",
      steps: [
        { text: "$S_0 = 100$, $\\mu = 8\\%$, $T = 1$ és $n = 2$ mellett minden Euler-lépés ennyivel szorozza a várható értéket.", tex: "1 + \\mu T/n", result: { value: 1.04, tolerance: 0.0005 } },
        { text: "Az Euler-közelítés várható értéke $T$-ben.", tex: "S_0\\,(1 + \\mu T/n)^n", result: { value: 108.16, tolerance: 0.005 } },
        { text: "A pontos várható érték.", tex: "S_0\\,e^{\\mu T}", result: { value: 108.3287, tolerance: 0.0005 } },
        { text: "A gyenge hiba: kétszerese az $n = 4$ melletti eltérésnek, ahogy az elsőrendű konvergencia mondja.", tex: "S_0\\,e^{\\mu T} - S_0\\,(1 + \\mu T/n)^n", result: { value: 0.1687, tolerance: 0.0005 } },
      ],
    },
    {
      kind: "check",
      id: "sde-simulation/strong-order",
      prompt: "Az Euler-lépések számát 16-ról 256-ra növeled. Nagyjából mi történik az erős hibával?",
      answer: { type: "choice", options: ["A felére csökken.", "Nagyjából a negyedére csökken.", "Nagyjából a tizenhatodára csökken.", "Nem változik."], correct: 1 },
      explain: "Az erős rend $\\tfrac12$: a hiba $\\sqrt{\\Delta t}$ szerint skálázódik. Tizenhatszor több lépés $\\sqrt{16} = 4$-szeresére csökkenti. Az elsőrendű gyenge hiba nagyjából a tizenhatodára esne.",
    },
    h("Ugyanaz a pálya finomabb rácson"),
    p("Az erős hiba csak úgy látható, ha a szimulációt ugyanazzal a véletlennel hajtott pontos pályával vetjük össze. Az ábra egy Brown-pályát rajzol egy 256 lépéses finom rácson egy évre, $S_0 = 100$, $\\mu = 8\\%$ és $\\sigma = 40\\%$ mellett; a nagy volatilitás teszi láthatóvá a hibát. A pontos megoldás ebből a pályából adódik, az Euler-közelítés pedig ugyanezt a pályát használja egy durvább rácson: minden durva növekmény az általa lefedett finom növekmények összege."),
    p("Válassz $n = 4$, $16$, $64$ vagy $256$ lépést, és figyeld, ahogy az Euler-pálya rásimul a pontosra; az „Új pálya” másik Brown-pályát sorsol. Vidd az egeret a grafikon fölé, vagy fókuszálj rá, és használd a nyílbillentyűket, hogy egy rácsidőpontban összevesd a két értéket. Alatta az 500 pálya átlagaként mért erős hiba látható $T$-ben, $\\Delta t$ függvényében, log–log tengelyeken, egy $\\tfrac12$ meredekségű referenciavonal mellett. A hiba $n = 4$ esetén nagyjából $4{,}82$, majd $2{,}34$, $1{,}23$ és $n = 256$-nál $0{,}63$: minden négyszeres finomítással nagyjából feleződik, ahogy a $\\tfrac12$-es rend előre jelzi. Az első pályán $n = 16$ mellett a végső érték pontosan $177{,}23$, Euler-sémával $183{,}44$."),
    figure("euler-convergence"),

    h("A logaritmus szimulálása"),
    p("A geometriai Brown-mozgásnál van jobb megoldás annál, mint magát $S$-t diszkretizálni. „Az Itô-lemma” szerint $\\ln S_t$ dinamikája"),
    eq("d(\\ln S_t) = \\big(\\mu - \\tfrac12\\sigma^2\\big)\\,dt + \\sigma\\,dW_t,"),
    p("amelynek együtthatói állandók. A $\\ln S$-re alkalmazott Euler-lépések ezért tetszőleges $\\Delta t$ mellett pontosak, és az árak automatikusan pozitívak maradnak. Az $S$-re alkalmazott Euler-séma akár negatív árat is adhat, ha $1 + \\mu\\,\\Delta t + \\sigma\\,\\Delta W$ nulla alá esik. Bevett fogás, hogy egy modellt a diszkretizálás előtt egyszerűbb együtthatójú változókra írunk át; ha ilyen átalakítás nincs, mint sok átlaghoz visszahúzó vagy sztochasztikus volatilitású modellnél, a kis lépésekre és a fenti hibarendekre támaszkodhatunk."),

    h("Összefoglalás"),
    list(
      "Egy $dX = a\\,dt + b\\,dW$ SDE-t lépésről lépésre szimulálunk az Euler–Maruyama-sémával: $X_{k+1} = X_k + a\\,\\Delta t + b\\sqrt{\\Delta t}\\,Z_k$.",
      "Az erős hiba (pályák) rendje $\\tfrac12$, a gyenge hibáé (átlagok) 1; a Monte Carlo-árazáshoz csak a gyenge kell.",
      "A durva és a finom rács csak ugyanazon a Brown-pályán hasonlítható össze: a durva növekmények a finomak összegei.",
      "Ha egy átalakítás állandó együtthatókat ad, ahogy $\\ln S$ a geometriai Brown-mozgásnál, azt a változót szimuláljuk: a lépések pontossá válnak.",
    ),
    note("Egy későbbi lecke, az „Átlaghoz visszahúzó folyamatok: Ornstein–Uhlenbeck és Vasicek”, egy olyan folyamatot vizsgál, amelynek driftje egy hosszú távú szint felé húzza vissza, és pontosan ilyen lépésekkel szimulálja."),
    lab("/gbm", "Szimulálj geometriai Brown-mozgás-pályákat a GBM laborban"),
  ],
};
