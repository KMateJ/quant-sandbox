import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const brownianBridge: GuideLessonContent = {
  en: [
    p("This lesson studies Brownian motion pinned at both ends: the **Brownian bridge**. It builds on \"Properties of Brownian motion\" (the Gaussian characterisation and the covariance $\\min(s, t)$) and on \"Conditional expectation and martingales\" (conditioning jointly Gaussian variables). The bridge is the right object whenever the value of the path is known at a later time: it fills in a simulation between two sampled points, and it measures the chance that a path crossed a level between two grid points — the \"hidden crossing\" left open in \"The reflection principle and first passage times\"."),

    h("Definition and construction"),
    p("Let $W$ be a standard Brownian motion. For a target endpoint $b$, define the process on $[0, 1]$"),
    eq("B_t = W_t - t\\,W_1 + t\\,b, \\qquad 0 \\le t \\le 1."),
    p("At the ends $B_0 = 0$ and $B_1 = W_1 - W_1 + b = b$, so the path is tied down to $b$ at time 1. The special case $b = 0$ is the **standard Brownian bridge** $B^0_t = W_t - t\\,W_1$, and the general bridge is $B_t = B^0_t + t\\,b$: a standard bridge with the straight line $t \\mapsto t\\,b$ added. Each $B_t$ is a linear combination of the Gaussian vector $(W_s)$, so $B$ is again a Gaussian process, determined by its mean and covariance."),
    note("A Brownian bridge from 0 to $b$ on $[0, 1]$ is $B_t = W_t - t\\,W_1 + t\\,b$. It is the continuous Gaussian path with $B_0 = 0$, $B_1 = b$, pulled toward the line $t\\,b$ and most free to wander in the middle."),

    h("Mean and covariance"),
    p("Taking expectations, $\\mathbb{E}[B_t] = \\mathbb{E}[W_t] - t\\,\\mathbb{E}[W_1] + t\\,b = t\\,b$: the mean is the straight line between the endpoints. For the covariance it is enough to treat the standard bridge $B^0_t = W_t - t\\,W_1$, since adding the deterministic term $t\\,b$ does not change second moments. Using $\\operatorname{Cov}(W_s, W_t) = \\min(s, t)$, for $s \\le t$"),
    eq("\\operatorname{Cov}(B^0_s, B^0_t) = s - s\\,t - t\\,s + s\\,t = s - s\\,t = s\\,(1 - t), \\qquad s \\le t."),
    p("Setting $s = t$ gives the variance $\\operatorname{Var}(B_t) = t\\,(1 - t)$, a parabola that is zero at both ends and largest at the midpoint, where $\\operatorname{Var}(B_{1/2}) = 1/4$. The bridge has no freedom at the endpoints and the most freedom in the middle; this is the hallmark shape of the spread bands in the figure."),

    {
      kind: "check",
      id: "brownian-bridge/variance-half",
      prompt: "For a standard Brownian bridge on $[0, 1]$, what is the variance $\\operatorname{Var}(B_{1/2})$ at the midpoint?",
      answer: { type: "number", value: 0.25, tolerance: 0.001 },
      explain: "$\\operatorname{Var}(B_t) = t(1 - t)$, so at $t = 1/2$ it is $\\tfrac12 \\cdot \\tfrac12 = 1/4 = 0.25$, the maximum of the parabola.",
    },

    h("The bridge as conditioned Brownian motion"),
    p("The construction is not a coincidence: the bridge is exactly Brownian motion **conditioned** on its endpoint. The pair $(W_t, W_1)$ is jointly Gaussian with $\\operatorname{Cov}(W_t, W_1) = t$ and $\\operatorname{Var}(W_1) = 1$. The Gaussian conditioning formula gives"),
    eq("\\mathbb{E}[W_t \\mid W_1 = b] = \\frac{\\operatorname{Cov}(W_t, W_1)}{\\operatorname{Var}(W_1)}\\,b = t\\,b, \\qquad \\operatorname{Var}(W_t \\mid W_1) = t - \\frac{t^2}{1} = t\\,(1 - t)."),
    p("These are exactly the mean and variance of $B_t$. A short calculation on the full covariance confirms that the whole conditioned process $(W_t \\mid W_1 = b)$ has the same law as $B$. A second fact makes the decomposition clean: $B^0_t = W_t - t\\,W_1$ is **independent** of $W_1$, because they are jointly Gaussian and"),
    eq("\\operatorname{Cov}(W_t - t\\,W_1,\\ W_1) = t - t \\cdot 1 = 0."),
    p("So Brownian motion splits into two independent pieces — a bridge that ignores the endpoint and the endpoint itself:"),
    eq("W_t = B^0_t + t\\,W_1, \\qquad B^0 \\perp W_1."),
    p("To simulate a Brownian path on a fine grid, one can therefore first draw the endpoint $W_1 \\sim N(0, 1)$ and then fill in the interior with an independent standard bridge. Repeating this between every pair of sampled times is exactly the recursive refinement used to generate Brownian paths at ever finer resolution."),
    figure("brownian-bridge"),

    {
      kind: "check",
      id: "brownian-bridge/covariance",
      prompt: "For a standard Brownian bridge on $[0, 1]$, compute $\\operatorname{Cov}(B_{1/4}, B_{3/4})$.",
      answer: { type: "number", value: 0.0625, tolerance: 0.001 },
      explain: "With $s = 1/4 \\le t = 3/4$, $\\operatorname{Cov}(B_s, B_t) = s(1 - t) = \\tfrac14 \\cdot \\tfrac14 = 1/16 = 0.0625$.",
    },

    h("The hidden-crossing probability"),
    p("The reflection lesson noted that a simulated maximum, taken only at grid points, misses crossings that happen between them. The bridge answers exactly how often this occurs. Suppose a path is observed at the ends of an interval of length $\\Delta$ with values $w_0$ and $w_1$. Conditioned on these, the path in between is a Brownian bridge, and the probability that it rises to a level $a \\ge \\max(w_0, w_1)$ somewhere inside is, by a reflection argument applied to the bridge,"),
    eq("\\mathbb{P}\\Big(\\max_{0 \\le t \\le \\Delta} X_t \\ge a \\ \\Big|\\ X_0 = w_0,\\ X_\\Delta = w_1\\Big) = \\exp\\!\\Big(-\\frac{2\\,(a - w_0)(a - w_1)}{\\Delta}\\Big)."),
    p("For a standard bridge pinned at $w_0 = w_1 = 0$ over $[0, 1]$ this is $\\mathbb{P}(\\max B^0 \\ge a) = e^{-2a^2}$, which decays far faster than the unconditioned tail $2(1 - \\Phi(a))$ because both ends hold the path down. At $a = 1$ the crossing probability is $e^{-2} \\approx 0.1353$."),
    p("This formula is the basis of the **continuity (Broadie–Glasserman–Kou) correction** for discretely monitored barrier options: between two monitoring dates the asset may breach the barrier unseen, and multiplying each interval's survival probability by $1 - e^{-2(a - w_0)(a - w_1)/\\Delta}$ recovers the continuously monitored price from a coarse grid. It also quantifies the downward bias of a simulated running maximum: on a grid the missed crossings are precisely the events this probability measures."),

    {
      kind: "check",
      id: "brownian-bridge/crossing",
      prompt: "A standard Brownian bridge is pinned at 0 at both $t = 0$ and $t = 1$. What is the probability that it reaches the level $a = 1$ somewhere in between?",
      answer: { type: "number", value: 0.1353, tolerance: 0.002 },
      explain: "With $w_0 = w_1 = 0$, $\\Delta = 1$, $a = 1$: $\\exp(-2(a - w_0)(a - w_1)/\\Delta) = e^{-2 \\cdot 1 \\cdot 1} = e^{-2} \\approx 0.1353$.",
    },

    h("Where the bridge appears"),
    list(
      "**Path simulation:** the decomposition $W_t = B^0_t + t\\,W_1$ fills in a path between known points, the engine behind Brownian-bridge sampling and variance reduction in Monte Carlo.",
      "**Barrier options:** the hidden-crossing formula corrects discretely monitored barriers back to their continuous prices.",
      "**Statistics:** the empirical distribution function, centred and scaled, converges to a Brownian bridge; the Kolmogorov–Smirnov test statistic is the maximum of $|B^0|$.",
      "**Interpolation:** conditioning a Gaussian process on observed values is the same operation that underlies Gaussian-process regression and spline smoothing.",
    ),

    {
      kind: "worked",
      title: "The bridge from 0 to 1 at a quarter of the way",
      steps: [
        { text: "With $T = 1$ and endpoint $b = 1$, the mean at $t = 0.25$ is the straight line from 0 to $b$.", tex: "\\mathbb{E}[X_{0.25}] = b\\,\\frac{t}{T} = 1 \\cdot 0.25", result: { value: 0.25, tolerance: 0.001 } },
        { text: "The variance does not depend on $b$.", tex: "\\operatorname{Var}(X_{0.25}) = \\frac{t(T - t)}{T} = 0.25 \\cdot 0.75", result: { value: 0.1875, tolerance: 0.0001 } },
        { text: "Its square root is the standard deviation, smaller than the $\\sqrt{0.25} = 0.5$ of free Brownian motion.", tex: "\\sqrt{0.1875}", result: { value: 0.433, tolerance: 0.001 } },
      ],
    },

    h("Summary"),
    list(
      "The Brownian bridge from 0 to $b$ is $B_t = W_t - t\\,W_1 + t\\,b$, with $B_0 = 0$ and $B_1 = b$.",
      "It is a Gaussian process with mean $t\\,b$ and covariance $s(1 - t)$ for $s \\le t$; the variance $t(1 - t)$ is zero at the ends and $1/4$ at the midpoint.",
      "The bridge is Brownian motion conditioned on $W_1 = b$, and $B^0_t = W_t - t\\,W_1$ is independent of $W_1$, giving the split $W_t = B^0_t + t\\,W_1$.",
      "A bridge pinned at $w_0, w_1$ over an interval of length $\\Delta$ exceeds level $a$ with probability $\\exp(-2(a - w_0)(a - w_1)/\\Delta)$; this prices and corrects barrier crossings between grid points.",
    ),
    lab("/brownian-motion", "Simulate pinned paths and watch the spread collapse at the endpoints in the Brownian Motion lab"),
  ],

  hu: [
    p("Ez a lecke a mindkét végén rögzített Brown-mozgást vizsgálja: a **Brown-hidat**. „A Brown-mozgás tulajdonságai” (a Gauss-jellemzés és a $\\min(s, t)$ kovariancia) és a „Feltételes várható érték és martingálok” (együttesen Gauss-eloszlású változók kondicionálása) leckékre épít. A híd a megfelelő eszköz mindig, amikor a pálya értéke egy későbbi időpontban ismert: kitölti a szimulációt két megmintázott pont között, és megméri annak esélyét, hogy a pálya két rácspont között átlépett egy szintet — ez „A tükrözési elv és az első elérési idők” leckében nyitva hagyott „rejtett átlépés”."),

    h("Definíció és konstrukció"),
    p("Legyen $W$ standard Brown-mozgás. Egy $b$ célvégponthoz definiáljuk a $[0, 1]$-en értelmezett folyamatot"),
    eq("B_t = W_t - t\\,W_1 + t\\,b, \\qquad 0 \\le t \\le 1."),
    p("A végpontokon $B_0 = 0$ és $B_1 = W_1 - W_1 + b = b$, tehát a pálya a $t = 1$ időpontban $b$-hez van kötve. A $b = 0$ speciális eset a **standard Brown-híd** $B^0_t = W_t - t\\,W_1$, az általános híd pedig $B_t = B^0_t + t\\,b$: egy standard híd, amelyhez hozzáadjuk a $t \\mapsto t\\,b$ egyenest. Minden $B_t$ a $(W_s)$ Gauss-vektor lineáris kombinációja, így $B$ ismét Gauss-folyamat, amelyet a várható értéke és a kovarianciája meghatároz."),
    note("A $[0, 1]$-en 0-tól $b$-ig futó Brown-híd $B_t = W_t - t\\,W_1 + t\\,b$. Ez az a folytonos Gauss-pálya, amelyre $B_0 = 0$, $B_1 = b$, a $t\\,b$ egyenes felé húzódik, és középen a legszabadabban kalandozik."),

    h("Várható érték és kovariancia"),
    p("Várható értéket véve $\\mathbb{E}[B_t] = \\mathbb{E}[W_t] - t\\,\\mathbb{E}[W_1] + t\\,b = t\\,b$: a várható érték a végpontokat összekötő egyenes. A kovarianciához elég a standard hidat, $B^0_t = W_t - t\\,W_1$, vizsgálni, mert a determinisztikus $t\\,b$ tag nem változtatja meg a második momentumokat. $\\operatorname{Cov}(W_s, W_t) = \\min(s, t)$ felhasználásával $s \\le t$ esetén"),
    eq("\\operatorname{Cov}(B^0_s, B^0_t) = s - s\\,t - t\\,s + s\\,t = s - s\\,t = s\\,(1 - t), \\qquad s \\le t."),
    p("$s = t$ esetén a szórásnégyzet $\\operatorname{Var}(B_t) = t\\,(1 - t)$, egy parabola, amely mindkét végen nulla és a felezőpontban a legnagyobb, ahol $\\operatorname{Var}(B_{1/2}) = 1/4$. A hídnak a végpontokban nincs szabadsága, középen a legtöbb; ez a jellegzetes alakja az ábra szórássávjainak."),

    {
      kind: "check",
      id: "brownian-bridge/variance-half",
      prompt: "Mennyi egy $[0, 1]$-en értelmezett standard Brown-híd $\\operatorname{Var}(B_{1/2})$ szórásnégyzete a felezőpontban?",
      answer: { type: "number", value: 0.25, tolerance: 0.001 },
      explain: "$\\operatorname{Var}(B_t) = t(1 - t)$, így $t = 1/2$-ben $\\tfrac12 \\cdot \\tfrac12 = 1/4 = 0{,}25$, a parabola maximuma.",
    },

    h("A híd mint kondicionált Brown-mozgás"),
    p("A konstrukció nem véletlen: a híd pontosan a végpontjára **kondicionált** Brown-mozgás. A $(W_t, W_1)$ pár együttesen Gauss-eloszlású, $\\operatorname{Cov}(W_t, W_1) = t$ és $\\operatorname{Var}(W_1) = 1$. A Gauss-kondicionálási képlet szerint"),
    eq("\\mathbb{E}[W_t \\mid W_1 = b] = \\frac{\\operatorname{Cov}(W_t, W_1)}{\\operatorname{Var}(W_1)}\\,b = t\\,b, \\qquad \\operatorname{Var}(W_t \\mid W_1) = t - \\frac{t^2}{1} = t\\,(1 - t)."),
    p("Ezek pontosan $B_t$ várható értéke és szórásnégyzete. A teljes kovariancia rövid számolása megerősíti, hogy az egész kondicionált folyamat, $(W_t \\mid W_1 = b)$, eloszlása megegyezik $B$-ével. Egy második tény teszi teljessé a felbontást: $B^0_t = W_t - t\\,W_1$ **független** $W_1$-től, mert együttesen Gauss-eloszlásúak és"),
    eq("\\operatorname{Cov}(W_t - t\\,W_1,\\ W_1) = t - t \\cdot 1 = 0."),
    p("Így a Brown-mozgás két független részre bomlik — egy hídra, amely nem törődik a végponttal, és magára a végpontra:"),
    eq("W_t = B^0_t + t\\,W_1, \\qquad B^0 \\perp W_1."),
    p("Egy finom rácson vett Brown-pálya szimulálásához tehát először kisorsolható a végpont, $W_1 \\sim N(0, 1)$, majd a belső rész kitölthető egy független standard híddal. Ezt minden megmintázott időpontpár között megismételve kapjuk azt a rekurzív finomítást, amellyel egyre finomabb felbontású Brown-pályák állíthatók elő."),
    figure("brownian-bridge"),

    {
      kind: "check",
      id: "brownian-bridge/covariance",
      prompt: "Egy $[0, 1]$-en értelmezett standard Brown-hídra számítsd ki $\\operatorname{Cov}(B_{1/4}, B_{3/4})$-et.",
      answer: { type: "number", value: 0.0625, tolerance: 0.001 },
      explain: "$s = 1/4 \\le t = 3/4$ mellett $\\operatorname{Cov}(B_s, B_t) = s(1 - t) = \\tfrac14 \\cdot \\tfrac14 = 1/16 = 0{,}0625$.",
    },

    h("A rejtett átlépés valószínűsége"),
    p("A tükrözési leckében láttuk, hogy a csak rácspontokban vett szimulált maximum nem veszi észre a pontok közötti átlépéseket. A híd pontosan megmondja, milyen gyakran fordul ez elő. Tegyük fel, hogy egy pályát egy $\\Delta$ hosszúságú intervallum végein figyelünk meg, $w_0$ és $w_1$ értékekkel. Ezekre kondicionálva a közbenső pálya Brown-híd, és annak valószínűsége, hogy valahol belül felemelkedik egy $a \\ge \\max(w_0, w_1)$ szintre, a hídra alkalmazott tükrözési érveléssel"),
    eq("\\mathbb{P}\\Big(\\max_{0 \\le t \\le \\Delta} X_t \\ge a \\ \\Big|\\ X_0 = w_0,\\ X_\\Delta = w_1\\Big) = \\exp\\!\\Big(-\\frac{2\\,(a - w_0)(a - w_1)}{\\Delta}\\Big)."),
    p("A $w_0 = w_1 = 0$ pontokban $[0, 1]$-en rögzített standard hídra ez $\\mathbb{P}(\\max B^0 \\ge a) = e^{-2a^2}$, ami sokkal gyorsabban cseng le, mint a feltétel nélküli $2(1 - \\Phi(a))$ farok, mert mindkét vég lefelé tartja a pályát. $a = 1$-nél az átlépés valószínűsége $e^{-2} \\approx 0{,}1353$."),
    p("Ez a képlet a diszkréten figyelt barrier opciók **folytonossági (Broadie–Glasserman–Kou) korrekciójának** alapja: két megfigyelési időpont között az eszköz észrevétlenül átlépheti a korlátot, és minden intervallum túlélési valószínűségét $1 - e^{-2(a - w_0)(a - w_1)/\\Delta}$-val szorozva visszakapjuk a folytonosan figyelt árat egy durva rácsból. Egyúttal megadja a szimulált futó maximum lefelé torzítását is: a rácson éppen azok a kimaradt átlépések, amelyeket ez a valószínűség mér."),

    {
      kind: "check",
      id: "brownian-bridge/crossing",
      prompt: "Egy standard Brown-híd $t = 0$-ban és $t = 1$-ben is 0-ra van rögzítve. Mennyi annak valószínűsége, hogy közben eléri az $a = 1$ szintet?",
      answer: { type: "number", value: 0.1353, tolerance: 0.002 },
      explain: "$w_0 = w_1 = 0$, $\\Delta = 1$, $a = 1$ mellett: $\\exp(-2(a - w_0)(a - w_1)/\\Delta) = e^{-2 \\cdot 1 \\cdot 1} = e^{-2} \\approx 0{,}1353$.",
    },

    h("Hol jelenik meg a híd"),
    list(
      "**Pálya-szimuláció:** a $W_t = B^0_t + t\\,W_1$ felbontás kitölti a pályát ismert pontok között — ez a Brown-híd-mintavétel és a Monte Carlo varianciacsökkentés motorja.",
      "**Barrier opciók:** a rejtett átlépés képlete a diszkréten figyelt barrier opciók árát a folytonosan figyelt megfelelőjükre korrigálja.",
      "**Statisztika:** az empirikus eloszlásfüggvény, centrálva és skálázva, Brown-hídhoz konvergál; a Kolmogorov–Szmirnov-próba statisztikája a $|B^0|$ maximuma.",
      "**Interpoláció:** egy Gauss-folyamat megfigyelt értékekre való kondicionálása ugyanaz a művelet, amely a Gauss-folyamat-regresszió és a spline-simítás mögött áll.",
    ),

    {
      kind: "worked",
      title: "A 0-ból 1-be tartó híd az út negyedénél",
      steps: [
        { text: "$T = 1$ és $b = 1$ végpont mellett a $t = 0{,}25$-beli várható érték a 0-t és $b$-t összekötő egyenesen van.", tex: "\\mathbb{E}[X_{0{,}25}] = b\\,\\frac{t}{T} = 1 \\cdot 0{,}25", result: { value: 0.25, tolerance: 0.001 } },
        { text: "A variancia nem függ $b$-től.", tex: "\\operatorname{Var}(X_{0{,}25}) = \\frac{t(T - t)}{T} = 0{,}25 \\cdot 0{,}75", result: { value: 0.1875, tolerance: 0.0001 } },
        { text: "A gyöke a szórás, kisebb, mint a szabad Brown-mozgás $\\sqrt{0{,}25} = 0{,}5$-e.", tex: "\\sqrt{0{,}1875}", result: { value: 0.433, tolerance: 0.001 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "A 0-tól $b$-ig futó Brown-híd $B_t = W_t - t\\,W_1 + t\\,b$, ahol $B_0 = 0$ és $B_1 = b$.",
      "Gauss-folyamat $t\\,b$ várható értékkel és $s(1 - t)$ kovarianciával ($s \\le t$); a $t(1 - t)$ szórásnégyzet a végeken nulla, a felezőpontban $1/4$.",
      "A híd a $W_1 = b$-re kondicionált Brown-mozgás, és $B^0_t = W_t - t\\,W_1$ független $W_1$-től, ami a $W_t = B^0_t + t\\,W_1$ felbontást adja.",
      "Egy $w_0, w_1$-re rögzített híd egy $\\Delta$ hosszúságú intervallumon $\\exp(-2(a - w_0)(a - w_1)/\\Delta)$ valószínűséggel lépi át az $a$ szintet; ez árazza és korrigálja a rácspontok közötti korlátátlépéseket.",
    ),
    lab("/brownian-motion", "Szimulálj rögzített végű pályákat, és figyeld, ahogy a szórás a végpontokban nullára esik a Brown-mozgás laborban"),
  ],
};
