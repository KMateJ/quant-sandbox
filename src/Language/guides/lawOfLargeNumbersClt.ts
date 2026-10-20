import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const lawOfLargeNumbersClt: GuideLessonContent = {
  en: [
    p("Almost every simulation in this course ends by averaging. A Monte Carlo price is an average of discounted payoffs, a sample volatility is an average of squared returns, and the Brownian motion of \"Random walks and Brownian motion\" is the limit of a rescaled sum of coin flips. Two theorems explain why averages are so well behaved: the **law of large numbers** says that an average settles down, and the **central limit theorem** says how it fluctuates around the value it settles on. This lesson states both with their hypotheses, proves the simpler one, and uses a figure to show how quickly the second takes hold. The sample means and variances of \"Returns and volatility\" are the first averages you met."),

    h("Averages of independent draws"),
    p("Let $X_1, X_2, \\dots$ be independent, identically distributed (i.i.d.) random variables with mean $\\mu$ and a finite variance $\\sigma^2$. The **sample mean** of the first $n$ is $\\bar X_n = (X_1 + \\cdots + X_n)/n$. Linearity of expectation, and the fact that variances of independent variables add, give two facts that everything below rests on:"),
    eq("E[\\bar X_n] = \\mu, \\qquad \\operatorname{Var}(\\bar X_n) = \\frac{\\sigma^2}{n}."),
    p("The average is right on average, and its standard deviation $\\sigma/\\sqrt{n}$, called the **standard error**, shrinks like $1/\\sqrt{n}$. Nothing more is assumed yet. The rest of the lesson asks what that shrinking implies."),

    h("The weak law of large numbers"),
    p("**Theorem (weak law).** For every $\\varepsilon > 0$, $P(|\\bar X_n - \\mu| > \\varepsilon) \\to 0$ as $n \\to \\infty$. One says that $\\bar X_n$ converges to $\\mu$ **in probability**. The proof is Chebyshev's inequality, $P(|Y - E[Y]| \\ge \\varepsilon) \\le \\operatorname{Var}(Y)/\\varepsilon^2$, applied to $Y = \\bar X_n$:"),
    eq("P(|\\bar X_n - \\mu| \\ge \\varepsilon) \\le \\frac{\\operatorname{Var}(\\bar X_n)}{\\varepsilon^2} = \\frac{\\sigma^2}{n\\,\\varepsilon^2} \\xrightarrow[n \\to \\infty]{} 0."),
    p("Chebyshev's bound is crude, but it needs nothing beyond a finite variance, and the shrinking variance does all the work."),

    h("The strong law"),
    p("**Theorem (strong law).** If $E|X_i| < \\infty$, then $P(\\bar X_n \\to \\mu) = 1$. Here \"with probability one\", or **almost surely**, means that the sequences of draws for which the averages fail to settle form a set of probability zero. The weak law controls each fixed $n$ separately. The strong law controls the whole path of running averages as $n$ grows, and that is what a single long simulation relies on. It does not even need a finite variance, only a finite mean. We state it without proof."),

    h("The central limit theorem"),
    p("The laws say where the average ends up, not how it is distributed around that value. To see the shape, standardise it, so that it has mean 0 and variance 1 for every $n$:"),
    eq("Z_n = \\frac{\\bar X_n - \\mu}{\\sigma/\\sqrt{n}} = \\frac{X_1 + \\cdots + X_n - n\\mu}{\\sigma\\sqrt{n}}."),
    p("**Theorem (central limit theorem).** If the $X_i$ are i.i.d. with finite mean $\\mu$ and finite, positive variance $\\sigma^2$, then for every $z$"),
    eq("P(Z_n \\le z) \\to \\Phi(z) \\quad (n \\to \\infty),"),
    p("where $\\Phi$ is the standard normal distribution function. The hypotheses matter: independence, a common distribution, and a finite variance. The source distribution is otherwise arbitrary, which is why the walk of \"Random walks and Brownian motion\", rescaled by $\\sqrt{n}$, has a normal limit even though its steps are coin flips. In practice the theorem is used as the approximation $\\bar X_n \\approx N(\\mu, \\sigma^2/n)$ for large $n$."),
    {
      kind: "check",
      id: "law-of-large-numbers-clt/hypothesis",
      prompt: "Besides independence and a common distribution, which assumption does the classical central limit theorem need?",
      answer: { type: "choice", options: ["A finite variance", "A bounded range of values", "A symmetric distribution", "A normal source distribution"], correct: 0 },
      explain: "Only a finite, positive variance is needed. The source may be skewed, discrete or unbounded; heavy tails with infinite variance are exactly where the theorem fails.",
    },

    h("How fast: the Berry–Esseen bound"),
    p("The theorem is a statement about a limit. For a finite $n$ it is an approximation, and **Berry–Esseen** measures its error. If $\\rho_3 = E|X_i - \\mu|^3$ is finite, then"),
    eq("\\sup_z \\left| P(Z_n \\le z) - \\Phi(z) \\right| \\le \\frac{C\\,\\rho_3}{\\sigma^3\\sqrt{n}}, \\qquad C \\le 0.4748."),
    p("The error shrinks like $1/\\sqrt{n}$ and is larger when $\\rho_3/\\sigma^3$ is large, that is, for skewed or heavy-tailed sources. It equals about 1.30 for the uniform law and $12/e - 2 \\approx 2.41$ for the exponential law."),
    p("The figure averages $n$ draws from the source you choose, 4,000 times, standardises each average and draws the histogram against the standard normal density. The first readout is the **Kolmogorov distance**, the largest gap between the two distribution functions. With the exponential source and $n = 10$ it is about 0.05, and at $n = 100$ about 0.02, which is close to the 0.014 that sampling noise alone produces with 4,000 averages. Switch to the Bernoulli source with $p = 0.1$, a very skewed coin: the distance is about 0.24 at $n = 10$ and still about 0.09 at $n = 100$. Berry–Esseen is conservative, since for the exponential source at $n = 10$ it would allow 0.36, but its message is the one the figure shows: skewed sources converge more slowly. The second readout, the simulated standard deviation of the average, matches $\\sigma/\\sqrt{n}$ at every $n$, which is the weak law at work."),
    figure("clt-convergence"),

    h("Where the theorems are used"),
    p("A Monte Carlo price is a sample mean $\\bar X_n$ of discounted payoffs. The strong law says that it converges to the true price. The central limit theorem gives the error bar: the estimate lies within $\\pm 1.96\\,\\sigma/\\sqrt{n}$ of the truth in about 95% of runs, which is the band that returns when the track prices options by simulation. Because the error falls like $1/\\sqrt{n}$, every extra correct digit costs a hundred times as many draws."),
    {
      kind: "worked",
      title: "The error bar of a Monte Carlo estimate",
      steps: [
        { text: "Payoffs with standard deviation 2, averaged over 10,000 draws: the standard error.", tex: "\\frac{\\sigma}{\\sqrt{n}} = \\frac{2}{\\sqrt{10\\,000}}", result: { value: 0.02, tolerance: 0.0005 } },
        { text: "The 95% half-width is 1.96 standard errors.", tex: "1.96 \\times 0.02", result: { value: 0.0392, tolerance: 0.0005 } },
        { text: "To halve the half-width the standard error must halve, so the draws must quadruple.", tex: "n_{\\text{new}} = 4 \\times 10\\,000", result: { value: 40000, tolerance: 1 } },
      ],
    },
    {
      kind: "check",
      id: "law-of-large-numbers-clt/draws-needed",
      prompt: "A Monte Carlo estimate based on 2,500 draws has a standard error of 0.05. How many draws are needed for a standard error of 0.01?",
      answer: { type: "number", value: 62500, tolerance: 1 },
      explain: "The standard error falls like $1/\\sqrt{n}$. Going from 0.05 to 0.01 is a factor of 5, so the draws must grow by $5^2 = 25$, from 2,500 to 62,500.",
    },
    p("The same theorem is behind the Brownian limit. A random walk with steps of mean 0 and variance 1, observed after $n$ steps and divided by $\\sqrt{n}$, is a standardised sum, so its distribution at a fixed time is approximately normal. Brownian motion is the continuous-time object whose every time slice has exactly that normal distribution."),

    h("Summary"),
    list(
      "The sample mean of i.i.d. draws has mean $\\mu$ and standard error $\\sigma/\\sqrt{n}$.",
      "The weak law (by Chebyshev) says the average converges in probability; the strong law says the whole sequence of averages converges almost surely, needing only a finite mean.",
      "The central limit theorem says the standardised average becomes normal, whatever the source, provided the variance is finite.",
      "Berry–Esseen bounds the error by a constant times $1/\\sqrt{n}$; skewed sources converge more slowly.",
    ),
    note("The next lesson, \"Probability spaces, σ-algebras and random variables\", makes precise what \"with probability one\" and \"random variable\" mean."),
    lab("/stochastic-models/clt", "Watch the central limit theorem emerge in the Stochastic Studio"),
  ],

  hu: [
    p("A kurzus szinte minden szimulációja átlagolással végződik. A Monte Carlo-ár diszkontált kifizetések átlaga, a mintabeli volatilitás négyzetes hozamok átlaga, és a „Véletlen bolyongás és Brown-mozgás” lecke Brown-mozgása is átskálázott érmefeldobás-összegek határértéke. Két tétel magyarázza, miért viselkednek olyan szépen az átlagok: a **nagy számok törvénye** szerint az átlag megnyugszik, a **centrális határeloszlás-tétel** pedig azt mondja meg, hogyan ingadozik az érték körül, amelyre megnyugszik. A lecke mindkettőt feltételeikkel együtt kimondja, az egyszerűbbet bizonyítja, egy ábrán pedig megmutatja, milyen gyorsan érvényesül a második. A „Hozamok és volatilitás” mintaátlagai és szórásnégyzetei az első átlagok, amelyekkel találkoztál."),

    h("Független minták átlaga"),
    p("Legyenek $X_1, X_2, \\dots$ független, azonos eloszlású (i.i.d.) valószínűségi változók $\\mu$ várható értékkel és véges $\\sigma^2$ szórásnégyzettel. Az első $n$ **mintaátlaga** $\\bar X_n = (X_1 + \\cdots + X_n)/n$. A várható érték linearitása és az, hogy független változók szórásnégyzete összeadódik, két tényt ad, amelyre minden alább épül:"),
    eq("E[\\bar X_n] = \\mu, \\qquad \\operatorname{Var}(\\bar X_n) = \\frac{\\sigma^2}{n}."),
    p("Az átlag átlagosan eltalálja a $\\mu$-t, szórása, a $\\sigma/\\sqrt{n}$, azaz a **standard hiba** pedig $1/\\sqrt{n}$ sebességgel csökken. Ennél többet egyelőre nem tételeztünk fel. A lecke további része azt kérdezi, mit jelent ez a csökkenés."),

    h("A nagy számok gyenge törvénye"),
    p("**Tétel (gyenge törvény).** Minden $\\varepsilon > 0$-ra $P(|\\bar X_n - \\mu| > \\varepsilon) \\to 0$, ha $n \\to \\infty$. Ezt úgy mondjuk, hogy $\\bar X_n$ **sztochasztikusan** konvergál $\\mu$-höz. A bizonyítás a Csebisev-egyenlőtlenség, $P(|Y - E[Y]| \\ge \\varepsilon) \\le \\operatorname{Var}(Y)/\\varepsilon^2$, az $Y = \\bar X_n$ választással:"),
    eq("P(|\\bar X_n - \\mu| \\ge \\varepsilon) \\le \\frac{\\operatorname{Var}(\\bar X_n)}{\\varepsilon^2} = \\frac{\\sigma^2}{n\\,\\varepsilon^2} \\xrightarrow[n \\to \\infty]{} 0."),
    p("A Csebisev-korlát durva, de véges szórásnégyzeten kívül semmit sem igényel, és a csökkenő szórásnégyzet végzi el a munkát."),

    h("Az erős törvény"),
    p("**Tétel (erős törvény).** Ha $E|X_i| < \\infty$, akkor $P(\\bar X_n \\to \\mu) = 1$. A „valószínűséggel 1”, vagy **majdnem biztosan**, azt jelenti, hogy azoknak a mintasorozatoknak a halmaza, amelyekre az átlagok nem nyugszanak meg, nulla valószínűségű. A gyenge törvény minden rögzített $n$-et külön kezel. Az erős törvény a futó átlagok teljes pályáját kezeli, ahogy $n$ nő, és egyetlen hosszú szimuláció erre támaszkodik. Véges szórásnégyzet sem kell hozzá, csak véges várható érték. Bizonyítás nélkül mondjuk ki."),

    h("A centrális határeloszlás-tétel"),
    p("A törvények azt mondják meg, hová tart az átlag, azt nem, hogyan oszlik el e körül az érték körül. Az alak megismeréséhez standardizáljuk, hogy minden $n$-re 0 legyen a várható értéke és 1 a szórásnégyzete:"),
    eq("Z_n = \\frac{\\bar X_n - \\mu}{\\sigma/\\sqrt{n}} = \\frac{X_1 + \\cdots + X_n - n\\mu}{\\sigma\\sqrt{n}}."),
    p("**Tétel (centrális határeloszlás-tétel).** Ha az $X_i$ i.i.d. változók véges $\\mu$ várható értékkel és véges, pozitív $\\sigma^2$ szórásnégyzettel, akkor minden $z$-re"),
    eq("P(Z_n \\le z) \\to \\Phi(z) \\quad (n \\to \\infty),"),
    p("ahol $\\Phi$ a standard normális eloszlásfüggvény. A feltételek számítanak: függetlenség, közös eloszlás és véges szórásnégyzet. A forráseloszlás egyébként tetszőleges, ezért van normális határértéke a „Véletlen bolyongás és Brown-mozgás” bolyongásának, ha $\\sqrt{n}$-nel átskálázzuk, pedig a lépései érmefeldobások. A gyakorlatban a tételt a $\\bar X_n \\approx N(\\mu, \\sigma^2/n)$ közelítésként használjuk nagy $n$-re."),
    {
      kind: "check",
      id: "law-of-large-numbers-clt/hypothesis",
      prompt: "A függetlenségen és a közös eloszláson kívül melyik feltételt igényli a klasszikus centrális határeloszlás-tétel?",
      answer: { type: "choice", options: ["Véges szórásnégyzetet", "Korlátos értékkészletet", "Szimmetrikus eloszlást", "Normális forráseloszlást"], correct: 0 },
      explain: "Csak véges, pozitív szórásnégyzet kell. A forrás lehet ferde, diszkrét vagy korlátlan; a végtelen szórásnégyzetű, nehéz farkú eloszlásoknál mondja fel a tétel a szolgálatot.",
    },

    h("Milyen gyorsan: a Berry–Esseen-korlát"),
    p("A tétel határértékről szól. Véges $n$-re közelítés, és a **Berry–Esseen-tétel** méri a hibáját. Ha $\\rho_3 = E|X_i - \\mu|^3$ véges, akkor"),
    eq("\\sup_z \\left| P(Z_n \\le z) - \\Phi(z) \\right| \\le \\frac{C\\,\\rho_3}{\\sigma^3\\sqrt{n}}, \\qquad C \\le 0{,}4748."),
    p("A hiba $1/\\sqrt{n}$ sebességgel csökken, és nagyobb, ha $\\rho_3/\\sigma^3$ nagy, vagyis ferde vagy nehéz farkú forrásoknál. Az egyenletes eloszlásnál körülbelül 1,30, az exponenciálisnál $12/e - 2 \\approx 2{,}41$."),
    p("Az ábra a választott forrásból $n$ mintát átlagol, 4000-szer, minden átlagot standardizál, és a hisztogramot a standard normális sűrűségfüggvény mellé rajzolja. Az első mutató a **Kolmogorov-távolság**, a két eloszlásfüggvény legnagyobb eltérése. Exponenciális forrással és $n = 10$-zel körülbelül 0,05, $n = 100$-nál körülbelül 0,02, ami közel van ahhoz a 0,014-hez, amelyet 4000 átlagnál már a mintavételi zaj is okoz. Válts a $p = 0{,}1$ paraméterű Bernoulli-forrásra, egy nagyon ferde érmére: a távolság $n = 10$-nél körülbelül 0,24, $n = 100$-nál még mindig körülbelül 0,09. A Berry–Esseen-korlát óvatos, hiszen az exponenciális forrásnál $n = 10$-re 0,36-ot engedne meg, de az üzenete az, amit az ábra mutat: a ferde források lassabban konvergálnak. A második mutató, az átlag szimulált szórása minden $n$-nél egyezik a $\\sigma/\\sqrt{n}$-nel, ez a gyenge törvény működés közben."),
    figure("clt-convergence"),

    h("Hol használjuk a tételeket"),
    p("A Monte Carlo-ár a diszkontált kifizetések $\\bar X_n$ mintaátlaga. Az erős törvény szerint a valódi árhoz konvergál. A centrális határeloszlás-tétel adja a hibasávot: a becslés a futások nagyjából 95%-ában a valódi értéktől legfeljebb $\\pm 1{,}96\\,\\sigma/\\sqrt{n}$-re van, ez a sáv tér vissza, amikor a kurzus opciókat áraz szimulációval. Mivel a hiba $1/\\sqrt{n}$ sebességgel csökken, minden további helyes tizedesjegy százszor annyi mintába kerül."),
    {
      kind: "worked",
      title: "Egy Monte Carlo-becslés hibasávja",
      steps: [
        { text: "A kifizetések szórása 2, 10 000 minta átlagából: a standard hiba.", tex: "\\frac{\\sigma}{\\sqrt{n}} = \\frac{2}{\\sqrt{10\\,000}}", result: { value: 0.02, tolerance: 0.0005 } },
        { text: "A 95%-os félszélesség 1,96 standard hiba.", tex: "1{,}96 \\times 0{,}02", result: { value: 0.0392, tolerance: 0.0005 } },
        { text: "A félszélesség felezéséhez a standard hibának is felére kell csökkennie, vagyis a mintaszámot meg kell négyszerezni.", tex: "n_{\\text{új}} = 4 \\times 10\\,000", result: { value: 40000, tolerance: 1 } },
      ],
    },
    {
      kind: "check",
      id: "law-of-large-numbers-clt/draws-needed",
      prompt: "Egy 2500 mintán alapuló Monte Carlo-becslés standard hibája 0,05. Hány minta kell 0,01-es standard hibához?",
      answer: { type: "number", value: 62500, tolerance: 1 },
      explain: "A standard hiba $1/\\sqrt{n}$ szerint csökken. A 0,05-ről 0,01-re ötszörös csökkenés $5^2 = 25$-szörös mintaszámot kíván: 2500-ról 62 500-ra.",
    },
    p("Ugyanez a tétel áll a Brown-féle határérték mögött is. Egy 0 várható értékű és 1 szórásnégyzetű lépésekből álló bolyongás $n$ lépés után, $\\sqrt{n}$-nel osztva standardizált összeg, így rögzített időpontban az eloszlása közelítőleg normális. A Brown-mozgás az a folytonos idejű objektum, amelynek minden időmetszete pontosan ilyen normális eloszlású."),

    h("Összefoglalás"),
    list(
      "Független, azonos eloszlású minták átlagának várható értéke $\\mu$, standard hibája $\\sigma/\\sqrt{n}$.",
      "A gyenge törvény (Csebisevvel) szerint az átlag sztochasztikusan konvergál; az erős törvény szerint az átlagok egész sorozata majdnem biztosan konvergál, ehhez elég a véges várható érték.",
      "A centrális határeloszlás-tétel szerint a standardizált átlag normálissá válik, bármilyen is a forrás, ha a szórásnégyzet véges.",
      "A Berry–Esseen-tétel a hibát egy konstans szorosával korlátozza $1/\\sqrt{n}$ sebességgel; a ferde források lassabban konvergálnak.",
    ),
    note("A következő lecke, a „Valószínűségi mezők, σ-algebrák és valószínűségi változók”, pontosan definiálja, mit jelent a „valószínűséggel 1” és a „valószínűségi változó”."),
    lab("/stochastic-models/clt", "Figyeld a centrális határeloszlás-tételt a Sztochasztikus Stúdióban"),
  ],
};
