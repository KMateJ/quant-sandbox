import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const reflectionPrinciple: GuideLessonContent = {
  en: [
    p("This lesson computes the distribution of the running maximum of Brownian motion and of the first time it reaches a given level. The tool is the reflection principle, which rests on the strong Markov property from \"Properties of Brownian motion\" and on the notion of a stopping time from \"Filtrations, adapted processes and stopping times\". The results are exact closed forms, and they are the basis of barrier option pricing."),

    h("Running maximum and first passage time"),
    p("Let $W$ be a standard Brownian motion with natural filtration $(\\mathcal{F}^W_t)$ and fix a level $a > 0$. Define the **running maximum** and the **first passage time**"),
    eq("M_t = \\max_{0 \\le s \\le t} W_s, \\qquad \\tau_a = \\inf\\{t \\ge 0 : W_t = a\\}."),
    p("The maximum exists because the path is continuous on the compact interval $[0, t]$. Since $W_0 = 0 < a$ and paths are continuous, the intermediate value theorem gives the identity of events"),
    eq("\\{\\tau_a \\le t\\} = \\{M_t \\ge a\\}, \\qquad W_{\\tau_a} = a \\ \\text{ on } \\{\\tau_a < \\infty\\}."),
    p("$\\tau_a$ is a stopping time. By continuity, $M_t \\ge a$ holds exactly when for every $n$ some rational $q \\in [0, t]$ has $W_q > a - 1/n$, so"),
    eq("\\{\\tau_a \\le t\\} = \\bigcap_{n \\ge 1}\\ \\bigcup_{q \\in \\mathbb{Q} \\cap [0,t]} \\{W_q > a - 1/n\\} \\in \\mathcal{F}^W_t,"),
    p("a countable combination of events that are each known at time $t$. By recurrence, $\\tau_a < \\infty$ almost surely; this also follows from the formula below."),

    h("The reflection argument"),
    p("Define the **reflected path**: follow $W$ until it first reaches $a$, then mirror it in the line $y = a$:"),
    eq("\\widetilde W_t = \\begin{cases} W_t, & t \\le \\tau_a, \\\\ 2a - W_t, & t > \\tau_a. \\end{cases}"),
    p("**Claim:** $\\widetilde W$ is again a standard Brownian motion. This is where the strong Markov property enters. Applied at the stopping time $\\tau_a$, it says that $B_s = W_{\\tau_a + s} - a$, $s \\ge 0$, is a Brownian motion independent of $\\mathcal{F}_{\\tau_a}$, and in particular of the stopped path $(W_{t \\wedge \\tau_a})_{t \\ge 0}$. By symmetry $-B$ is also a Brownian motion independent of $\\mathcal{F}_{\\tau_a}$. Hence the pairs (stopped path, $B$) and (stopped path, $-B$) have the same joint law. $W$ is obtained from the first pair by gluing $a + B$ onto the stopped path at $\\tau_a$, and $\\widetilde W$ from the second pair by the same gluing map, so $W$ and $\\widetilde W$ have the same law."),
    p("Both requirements are essential. At a fixed time $s$ the ordinary Markov property would suffice, but $\\tau_a$ is random. And the argument would fail for a random time that looks ahead, such as the time at which the maximum over $[0, 1]$ is attained: after that time the path is forced to stay below its maximum, so it is not a fresh Brownian motion."),
    p("Now count paths. $\\widetilde W$ reaches $a$ at the same time $\\tau_a$ as $W$, and on $\\{\\tau_a \\le t\\}$ we have $\\widetilde W_t = 2a - W_t$, so $W_t < a$ exactly when $\\widetilde W_t > a$. Using that $\\widetilde W$ has the law of $W$, and that $\\{W_t > a\\} \\subset \\{\\tau_a \\le t\\}$,"),
    eq("\\mathbb{P}(M_t \\ge a,\\ W_t < a) = \\mathbb{P}(\\tau_a \\le t,\\ \\widetilde W_t > a) = \\mathbb{P}(\\tau_a \\le t,\\ W_t > a) = \\mathbb{P}(W_t > a)."),
    p("Since $\\mathbb{P}(W_t = a) = 0$, splitting $\\{M_t \\ge a\\}$ by the sign of $W_t - a$ gives the theorem."),
    note("Reflection principle: for $a > 0$ and $t > 0$, $\\mathbb{P}(M_t \\ge a) = 2\\,\\mathbb{P}(W_t \\ge a) = 2\\big(1 - \\Phi(a/\\sqrt{t})\\big)$. In particular $M_t$ has the same law as $|W_t|$."),
    p("The last statement holds because $\\mathbb{P}(|W_t| \\ge a) = 2\\,\\mathbb{P}(W_t \\ge a)$ for $a > 0$. A fair picture is a mirror placed at height $a$: every path that touches $a$ and ends below it has a mirror twin that ends above it, equally likely, so touching paths split evenly between the two sides. For the coin-flip walk the same argument with steps of $\\pm 1$ is exact and is André's classical solution of the ballot problem."),

    h("Worked numbers"),
    p("Take $a = 1$, $t = 1$. Then $\\mathbb{P}(W_1 \\ge 1) = 1 - \\Phi(1) \\approx 0.1587$, and"),
    eq("\\mathbb{P}(M_1 \\ge 1) = 2\\big(1 - \\Phi(1)\\big) \\approx 0.3173."),
    p("About one path in three reaches level 1 within one unit of time, although only one in six ends above it. Since $M_1 \\sim |W_1|$, the expected maximum is $\\mathbb{E}[M_1] = \\mathbb{E}|W_1| = \\sqrt{2/\\pi} \\approx 0.7979$."),
    p("Application: model the log price as driftless, $\\ln(S_t/S_0) = \\sigma W_t$, with $S_0 = 100$ and $\\sigma = 20\\%$. The probability that the stock touches 120 within one year is the probability that $W$ reaches $a = \\ln(1.2)/0.2 \\approx 0.9116$ by $t = 1$:"),
    eq("\\mathbb{P}\\Big(\\max_{s \\le 1} S_s \\ge 120\\Big) = 2\\big(1 - \\Phi(0.9116)\\big) \\approx 0.362."),
    p("With a drift $\\nu$ in the log price, $X_s = \\nu s + \\sigma W_s$, the reflection principle no longer applies directly, because the drifted process is not symmetric. The answer, obtained in \"Change of measure and Girsanov's theorem\" by removing the drift, is"),
    eq("\\mathbb{P}\\Big(\\max_{s \\le T} X_s \\ge m\\Big) = 1 - \\Phi\\Big(\\frac{m - \\nu T}{\\sigma\\sqrt{T}}\\Big) + e^{2\\nu m/\\sigma^2}\\,\\Phi\\Big(\\frac{-m - \\nu T}{\\sigma\\sqrt{T}}\\Big)."),
    p("For $\\nu = 0$ it reduces to $2(1 - \\Phi(m/(\\sigma\\sqrt{T})))$. With $\\nu = -\\sigma^2/2 = -0.02$ (zero expected stock return) the touching probability above becomes about $0.330$."),
    p("The figure fixes $T = 1$ and lets you set the level $a$ between 0.2 and 2.5 (default 1). It draws one sample path that reaches $a$ (paths are resampled until one does), the line $y = a$, and, dashed, the reflection of the path after $\\tau_a$; \"New path\" draws another. The readouts come from 20 000 simulated paths with 500 steps each: the share of paths with maximum at least $a$, the exact value $2(1 - \\Phi(a))$, and the share with $W_1 \\ge a$. The first is close to twice the third. It is also slightly below the exact value, because the simulated maximum is taken only over the 500 grid points and misses crossings that happen between them; at $a = 1$ it comes out near $0.30$ rather than $0.317$. The lesson \"The Brownian bridge\" computes the probability of such a hidden crossing."),
    figure("reflection-max"),

    {
      kind: "check",
      id: "reflection-principle/max-probability",
      prompt: "What is $\\mathbb{P}(M_4 \\ge 1)$, the probability that Brownian motion reaches level 1 by time 4?",
      answer: { type: "number", value: 0.6171, tolerance: 0.002 },
      explain: "$\\mathbb{P}(M_4 \\ge 1) = 2\\big(1 - \\Phi(1/\\sqrt{4})\\big) = 2\\big(1 - \\Phi(0.5)\\big) \\approx 2 \\times 0.3085 = 0.6171$.",
    },

    h("The law of the first passage time"),
    p("Because $\\{\\tau_a \\le t\\} = \\{M_t \\ge a\\}$, the reflection principle gives the distribution function of $\\tau_a$, and differentiating in $t$ (using $\\tfrac{d}{dt}\\,a t^{-1/2} = -\\tfrac12 a t^{-3/2}$) gives its density:"),
    eq("\\mathbb{P}(\\tau_a \\le t) = 2\\Big(1 - \\Phi\\Big(\\frac{a}{\\sqrt{t}}\\Big)\\Big), \\qquad f_{\\tau_a}(t) = \\frac{a}{\\sqrt{2\\pi t^3}}\\,e^{-a^2/(2t)}, \\quad t > 0."),
    p("This is the **Lévy distribution**. Two facts follow:"),
    list(
      "$\\mathbb{P}(\\tau_a < \\infty) = \\lim_{t \\to \\infty} 2(1 - \\Phi(a/\\sqrt{t})) = 2(1 - \\Phi(0)) = 1$: every level is reached almost surely.",
      "$\\mathbb{E}[\\tau_a] = \\infty$: for large $t$, $t\\,f_{\\tau_a}(t) \\approx a\\,(2\\pi)^{-1/2}\\,t^{-1/2}$, which is not integrable on $[1, \\infty)$.",
    ),
    p("The level is certain to be reached, but the expected waiting time is infinite. The median is finite: $\\mathbb{P}(\\tau_a \\le t) = \\tfrac12$ when $a/\\sqrt{t} = \\Phi^{-1}(0.75) \\approx 0.6745$, that is $t \\approx 2.198\\,a^2$. The factor $a^2$ is scaling at work: $\\tau_a$ has the same law as $a^2\\tau_1$. This also explains a point from \"Conditional expectation and martingales\": $W$ is a martingale with $W_0 = 0$, yet $W_{\\tau_a} = a$. Stopping at $\\tau_a$ turns a fair game into a sure gain only because $\\tau_a$ is unbounded with infinite mean, so the optional stopping theorem does not apply."),

    {
      kind: "check",
      id: "reflection-principle/passage-time",
      prompt: "For $a > 0$, which statement about $\\tau_a = \\inf\\{t \\ge 0 : W_t = a\\}$ is correct?",
      answer: {
        type: "choice",
        options: [
          "$\\mathbb{P}(\\tau_a < \\infty) = 1$ and $\\mathbb{E}[\\tau_a] = a^2$",
          "$\\mathbb{P}(\\tau_a < \\infty) = 1$ and $\\mathbb{E}[\\tau_a] = \\infty$",
          "$\\mathbb{P}(\\tau_a < \\infty) = \\tfrac12$ and $\\mathbb{E}[\\tau_a] = \\infty$",
          "$\\mathbb{P}(\\tau_a < \\infty) = 2(1 - \\Phi(a))$",
        ],
        correct: 1,
      },
      explain: "Letting $t \\to \\infty$ in $2(1 - \\Phi(a/\\sqrt{t}))$ gives 1, while the Lévy density decays only like $t^{-3/2}$, so $t\\,f_{\\tau_a}(t)$ is not integrable and the mean is infinite. The value $2(1 - \\Phi(a))$ is $\\mathbb{P}(\\tau_a \\le 1)$.",
    },

    h("Joint law of the maximum and the endpoint"),
    p("The same reflection gives more. For $a \\ge 0$ and $x \\le a$, on $\\{\\tau_a \\le t\\}$ the condition $W_t \\le x$ is equivalent to $\\widetilde W_t \\ge 2a - x$, and $2a - x \\ge a$ forces $\\tau_a \\le t$. Hence"),
    eq("\\mathbb{P}(M_t \\ge a,\\ W_t \\le x) = \\mathbb{P}(W_t \\ge 2a - x) = 1 - \\Phi\\Big(\\frac{2a - x}{\\sqrt{t}}\\Big), \\qquad a \\ge 0,\\ x \\le a."),
    p("Differentiating in $a$ and $x$ gives the joint density"),
    eq("f_{M_t, W_t}(m, w) = \\frac{2(2m - w)}{\\sqrt{2\\pi t^3}}\\,\\exp\\Big(-\\frac{(2m - w)^2}{2t}\\Big), \\qquad m \\ge 0,\\ w \\le m."),
    p("For example, the probability that the path reaches 1 by time 1 but ends at or below 0 is $\\mathbb{P}(W_1 \\ge 2) = 1 - \\Phi(2) \\approx 0.0228$."),
    p("This joint law is what barrier options need. An up-and-out call pays $(S_T - K)^+$ only if the price stays below a barrier $H$ throughout $[0, T]$. Under the Black–Scholes model the log price is a drifted Brownian motion, and the price of the option is a discounted integral of the payoff against the joint density of the maximum and the endpoint, adjusted for the drift as above. The closed-form barrier prices used in practice come from exactly this computation."),

    {
      kind: "check",
      id: "reflection-principle/joint-law",
      prompt: "Compute $\\mathbb{P}(M_1 \\ge 1,\\ W_1 \\le 0)$.",
      answer: { type: "number", value: 0.0228, tolerance: 0.0005 },
      explain: "With $a = 1$, $x = 0$: $\\mathbb{P}(M_1 \\ge 1,\\ W_1 \\le 0) = \\mathbb{P}(W_1 \\ge 2a - x) = \\mathbb{P}(W_1 \\ge 2) = 1 - \\Phi(2) \\approx 0.0228$.",
    },

    {
      kind: "worked",
      title: "Hitting the level 1",
      steps: [
        { text: "The standard normal CDF at 1.", tex: "\\Phi(1)", result: { value: 0.8413, tolerance: 0.0001 } },
        { text: "By the reflection principle the maximum up to $t = 1$ reaches 1 with twice the probability that $W_1$ ends above 1.", tex: "\\mathbb{P}\\big(\\max_{t \\le 1} W_t \\ge 1\\big) = 2\\big(1 - \\Phi(1)\\big)", result: { value: 0.3173, tolerance: 0.0001 } },
        { text: "$\\{\\tau_1 \\le 1\\}$ is the same event as $\\{\\max_{t \\le 1} W_t \\ge 1\\}$, so it has the same probability.", tex: "\\mathbb{P}(\\tau_1 \\le 1) = 2\\big(1 - \\Phi(1/\\sqrt{1})\\big)", result: { value: 0.3173, tolerance: 0.0001 } },
        { text: "With four times as long to wait, the argument of $\\Phi$ halves.", tex: "\\mathbb{P}(\\tau_1 \\le 4) = 2\\big(1 - \\Phi(1/\\sqrt{4})\\big)", result: { value: 0.6171, tolerance: 0.0001 } },
      ],
    },

    h("Summary"),
    list(
      "$\\tau_a = \\inf\\{t : W_t = a\\}$ is a stopping time and $\\{\\tau_a \\le t\\} = \\{M_t \\ge a\\}$.",
      "The strong Markov property at $\\tau_a$ makes the path reflected after $\\tau_a$ a Brownian motion; this gives $\\mathbb{P}(M_t \\ge a) = 2(1 - \\Phi(a/\\sqrt{t}))$ and $M_t \\sim |W_t|$.",
      "$\\tau_a$ has the Lévy density $a(2\\pi t^3)^{-1/2}e^{-a^2/(2t)}$: it is finite almost surely but has infinite mean.",
      "$\\mathbb{P}(M_t \\ge a, W_t \\le x) = 1 - \\Phi((2a - x)/\\sqrt{t})$ for $x \\le a$; this joint law prices barrier options.",
      "On a discrete time grid the simulated maximum is biased low because crossings between grid points are missed.",
    ),
    lab("/stochastic-models/reflection", "Reflect simulated paths at a level in the Stochastic Models studio"),
  ],

  hu: [
    p("Ez a lecke kiszámítja a Brown-mozgás futó maximumának eloszlását, valamint annak az időpontnak az eloszlását, amikor a folyamat először elér egy adott szintet. Az eszköz a tükrözési elv, amely „A Brown-mozgás tulajdonságai” című lecke erős Markov-tulajdonságán és a „Filtrációk, adaptált folyamatok és megállási idők” című lecke megállásiidő-fogalmán alapul. Az eredmények pontos, zárt alakú képletek, és ezekre épül a barrier opciók árazása."),

    h("Futó maximum és első elérési idő"),
    p("Legyen $W$ standard Brown-mozgás $(\\mathcal{F}^W_t)$ természetes filtrációval, és rögzítsünk egy $a > 0$ szintet. A **futó maximum** és az **első elérési idő**"),
    eq("M_t = \\max_{0 \\le s \\le t} W_s, \\qquad \\tau_a = \\inf\\{t \\ge 0 : W_t = a\\}."),
    p("A maximum létezik, mert a pálya a kompakt $[0, t]$ intervallumon folytonos. Mivel $W_0 = 0 < a$ és a pályák folytonosak, a Bolzano-tétel az alábbi eseményazonosságot adja:"),
    eq("\\{\\tau_a \\le t\\} = \\{M_t \\ge a\\}, \\qquad W_{\\tau_a} = a \\ \\text{ a } \\{\\tau_a < \\infty\\} \\text{ eseményen}."),
    p("$\\tau_a$ megállási idő. A folytonosság miatt $M_t \\ge a$ pontosan akkor teljesül, ha minden $n$-hez van olyan racionális $q \\in [0, t]$, amelyre $W_q > a - 1/n$, ezért"),
    eq("\\{\\tau_a \\le t\\} = \\bigcap_{n \\ge 1}\\ \\bigcup_{q \\in \\mathbb{Q} \\cap [0,t]} \\{W_q > a - 1/n\\} \\in \\mathcal{F}^W_t,"),
    p("vagyis megszámlálható sok, egyenként a $t$ időpontban ismert esemény kombinációja. A rekurrencia miatt $\\tau_a < \\infty$ majdnem biztosan; ez az alábbi képletből is következik."),

    h("A tükrözési érvelés"),
    p("Definiáljuk a **tükrözött pályát**: kövessük $W$-t addig, amíg először eléri $a$-t, utána tükrözzük az $y = a$ egyenesre:"),
    eq("\\widetilde W_t = \\begin{cases} W_t, & t \\le \\tau_a, \\\\ 2a - W_t, & t > \\tau_a. \\end{cases}"),
    p("**Állítás:** $\\widetilde W$ ismét standard Brown-mozgás. Itt lép be az erős Markov-tulajdonság. A $\\tau_a$ megállási időben alkalmazva azt mondja, hogy a $B_s = W_{\\tau_a + s} - a$, $s \\ge 0$ folyamat $\\mathcal{F}_{\\tau_a}$-tól független Brown-mozgás, így speciálisan független a $(W_{t \\wedge \\tau_a})_{t \\ge 0}$ megállított pályától. A szimmetria miatt $-B$ is $\\mathcal{F}_{\\tau_a}$-tól független Brown-mozgás. Ezért a (megállított pálya, $B$) és a (megállított pálya, $-B$) párok együttes eloszlása azonos. $W$ az első párból úgy áll elő, hogy a megállított pályához $\\tau_a$-ban hozzáragasztjuk $a + B$-t, $\\widetilde W$ pedig a második párból ugyanezzel a ragasztó leképezéssel, tehát $W$ és $\\widetilde W$ eloszlása megegyezik."),
    p("Mindkét feltétel lényeges. Rögzített $s$ időpontban elég volna a közönséges Markov-tulajdonság, de $\\tau_a$ véletlen. Előretekintő véletlen időpontra pedig az érvelés megbukna: ha például a $[0, 1]$-en vett maximum elérésének időpontjában állnánk meg, utána a pálya kénytelen a maximuma alatt maradni, tehát nem friss Brown-mozgás."),
    p("Most számoljuk meg a pályákat. $\\widetilde W$ ugyanabban a $\\tau_a$ időpontban éri el $a$-t, mint $W$, és a $\\{\\tau_a \\le t\\}$ eseményen $\\widetilde W_t = 2a - W_t$, így $W_t < a$ pontosan akkor, ha $\\widetilde W_t > a$. Felhasználva, hogy $\\widetilde W$ eloszlása $W$-éval egyezik, és hogy $\\{W_t > a\\} \\subset \\{\\tau_a \\le t\\}$,"),
    eq("\\mathbb{P}(M_t \\ge a,\\ W_t < a) = \\mathbb{P}(\\tau_a \\le t,\\ \\widetilde W_t > a) = \\mathbb{P}(\\tau_a \\le t,\\ W_t > a) = \\mathbb{P}(W_t > a)."),
    p("Mivel $\\mathbb{P}(W_t = a) = 0$, az $\\{M_t \\ge a\\}$ eseményt $W_t - a$ előjele szerint kettébontva kapjuk a tételt."),
    note("Tükrözési elv: $a > 0$ és $t > 0$ esetén $\\mathbb{P}(M_t \\ge a) = 2\\,\\mathbb{P}(W_t \\ge a) = 2\\big(1 - \\Phi(a/\\sqrt{t})\\big)$. Speciálisan $M_t$ eloszlása megegyezik $|W_t|$ eloszlásával."),
    p("Az utolsó állítás azért igaz, mert $a > 0$ esetén $\\mathbb{P}(|W_t| \\ge a) = 2\\,\\mathbb{P}(W_t \\ge a)$. Jó kép erre egy $a$ magasságban elhelyezett tükör: minden pályának, amely megérinti $a$-t és alatta végez, van egy ugyanolyan valószínű tükörképe, amely fölötte végez, így az érintő pályák egyenlően oszlanak meg a két oldal között. A pénzfeldobásos bolyongásra ugyanez az érvelés $\\pm 1$-es lépésekkel pontos, és ez André klasszikus megoldása a szavazási problémára."),

    h("Számpélda"),
    p("Legyen $a = 1$, $t = 1$. Ekkor $\\mathbb{P}(W_1 \\ge 1) = 1 - \\Phi(1) \\approx 0{,}1587$, és"),
    eq("\\mathbb{P}(M_1 \\ge 1) = 2\\big(1 - \\Phi(1)\\big) \\approx 0{,}3173."),
    p("Körülbelül minden harmadik pálya eléri az 1-es szintet egységnyi idő alatt, pedig csak minden hatodik végez fölötte. Mivel $M_1 \\sim |W_1|$, a maximum várható értéke $\\mathbb{E}[M_1] = \\mathbb{E}|W_1| = \\sqrt{2/\\pi} \\approx 0{,}7979$."),
    p("Alkalmazás: modellezzük a logárfolyamot drift nélkül, $\\ln(S_t/S_0) = \\sigma W_t$, ahol $S_0 = 100$ és $\\sigma = 20\\%$. Annak valószínűsége, hogy a részvény egy éven belül megérinti a 120-at, megegyezik annak valószínűségével, hogy $W$ a $t = 1$ időpontig eléri az $a = \\ln(1{,}2)/0{,}2 \\approx 0{,}9116$ szintet:"),
    eq("\\mathbb{P}\\Big(\\max_{s \\le 1} S_s \\ge 120\\Big) = 2\\big(1 - \\Phi(0{,}9116)\\big) \\approx 0{,}362."),
    p("Ha a logárfolyamnak $\\nu$ driftje van, $X_s = \\nu s + \\sigma W_s$, a tükrözési elv közvetlenül nem alkalmazható, mert a driftes folyamat nem szimmetrikus. A „Mértékcsere és a Girsanov-tétel” című leckében a drift eltávolításával kapott eredmény"),
    eq("\\mathbb{P}\\Big(\\max_{s \\le T} X_s \\ge m\\Big) = 1 - \\Phi\\Big(\\frac{m - \\nu T}{\\sigma\\sqrt{T}}\\Big) + e^{2\\nu m/\\sigma^2}\\,\\Phi\\Big(\\frac{-m - \\nu T}{\\sigma\\sqrt{T}}\\Big)."),
    p("$\\nu = 0$ esetén ez $2(1 - \\Phi(m/(\\sigma\\sqrt{T})))$-re egyszerűsödik. $\\nu = -\\sigma^2/2 = -0{,}02$ mellett (nulla várható részvényhozam) a fenti érintési valószínűség körülbelül $0{,}330$."),
    p("Az ábra rögzíti a $T = 1$ értéket, az $a$ szint pedig 0,2 és 2,5 között állítható (alapérték 1). Egy olyan mintapályát rajzol, amely eléri $a$-t (addig sorsol újra, amíg ilyet nem talál), az $y = a$ egyenest, valamint szaggatott vonallal a pálya $\\tau_a$ utáni tükörképét; az „Új pálya” gomb újat sorsol. A kijelzők 20 000, egyenként 500 lépéses szimulált pályából számolnak: azon pályák aránya, amelyek maximuma legalább $a$, a pontos $2(1 - \\Phi(a))$ érték, és azon pályák aránya, amelyekre $W_1 \\ge a$. Az első közel kétszerese a harmadiknak. Kissé el is marad a pontos értéktől, mert a szimulált maximumot csak az 500 rácspontban vesszük, így a rácspontok közötti átlépések rejtve maradnak; $a = 1$ esetén $0{,}317$ helyett nagyjából $0{,}30$ jön ki. „A Brown-híd” című lecke kiszámítja egy ilyen rejtett átlépés valószínűségét."),
    figure("reflection-max"),

    {
      kind: "check",
      id: "reflection-principle/max-probability",
      prompt: "Mennyi $\\mathbb{P}(M_4 \\ge 1)$, vagyis annak valószínűsége, hogy a Brown-mozgás a 4-es időpontig eléri az 1-es szintet?",
      answer: { type: "number", value: 0.6171, tolerance: 0.002 },
      explain: "$\\mathbb{P}(M_4 \\ge 1) = 2\\big(1 - \\Phi(1/\\sqrt{4})\\big) = 2\\big(1 - \\Phi(0{,}5)\\big) \\approx 2 \\times 0{,}3085 = 0{,}6171$.",
    },

    h("Az első elérési idő eloszlása"),
    p("Mivel $\\{\\tau_a \\le t\\} = \\{M_t \\ge a\\}$, a tükrözési elv megadja $\\tau_a$ eloszlásfüggvényét, $t$ szerint deriválva pedig (felhasználva, hogy $\\tfrac{d}{dt}\\,a t^{-1/2} = -\\tfrac12 a t^{-3/2}$) a sűrűségfüggvényét:"),
    eq("\\mathbb{P}(\\tau_a \\le t) = 2\\Big(1 - \\Phi\\Big(\\frac{a}{\\sqrt{t}}\\Big)\\Big), \\qquad f_{\\tau_a}(t) = \\frac{a}{\\sqrt{2\\pi t^3}}\\,e^{-a^2/(2t)}, \\quad t > 0."),
    p("Ez a **Lévy-eloszlás**. Két tény következik belőle:"),
    list(
      "$\\mathbb{P}(\\tau_a < \\infty) = \\lim_{t \\to \\infty} 2(1 - \\Phi(a/\\sqrt{t})) = 2(1 - \\Phi(0)) = 1$: minden szintet majdnem biztosan elér.",
      "$\\mathbb{E}[\\tau_a] = \\infty$: nagy $t$-re $t\\,f_{\\tau_a}(t) \\approx a\\,(2\\pi)^{-1/2}\\,t^{-1/2}$, ami az $[1, \\infty)$ intervallumon nem integrálható.",
    ),
    p("A szint elérése biztos, a várható várakozási idő mégis végtelen. A medián véges: $\\mathbb{P}(\\tau_a \\le t) = \\tfrac12$, ha $a/\\sqrt{t} = \\Phi^{-1}(0{,}75) \\approx 0{,}6745$, azaz $t \\approx 2{,}198\\,a^2$. Az $a^2$ szorzó a skálázás következménye: $\\tau_a$ eloszlása megegyezik $a^2\\tau_1$ eloszlásával. Ez megvilágít egy pontot a „Feltételes várható érték és martingálok” című leckéből is: $W$ martingál $W_0 = 0$ kezdőértékkel, mégis $W_{\\tau_a} = a$. A $\\tau_a$-ban való megállás csak azért teszi a fair játékot biztos nyereséggé, mert $\\tau_a$ nem korlátos és várható értéke végtelen, így az opcionális megállási tétel nem alkalmazható."),

    {
      kind: "check",
      id: "reflection-principle/passage-time",
      prompt: "$a > 0$ esetén melyik állítás igaz a $\\tau_a = \\inf\\{t \\ge 0 : W_t = a\\}$ első elérési időre?",
      answer: {
        type: "choice",
        options: [
          "$\\mathbb{P}(\\tau_a < \\infty) = 1$ és $\\mathbb{E}[\\tau_a] = a^2$",
          "$\\mathbb{P}(\\tau_a < \\infty) = 1$ és $\\mathbb{E}[\\tau_a] = \\infty$",
          "$\\mathbb{P}(\\tau_a < \\infty) = \\tfrac12$ és $\\mathbb{E}[\\tau_a] = \\infty$",
          "$\\mathbb{P}(\\tau_a < \\infty) = 2(1 - \\Phi(a))$",
        ],
        correct: 1,
      },
      explain: "A $2(1 - \\Phi(a/\\sqrt{t}))$ kifejezésben $t \\to \\infty$ határátmenettel 1 adódik, a Lévy-sűrűség viszont csak $t^{-3/2}$ ütemben csökken, így $t\\,f_{\\tau_a}(t)$ nem integrálható, és a várható érték végtelen. A $2(1 - \\Phi(a))$ érték $\\mathbb{P}(\\tau_a \\le 1)$.",
    },

    h("A maximum és a végpont együttes eloszlása"),
    p("Ugyanez a tükrözés többet is ad. Ha $a \\ge 0$ és $x \\le a$, akkor a $\\{\\tau_a \\le t\\}$ eseményen a $W_t \\le x$ feltétel ekvivalens a $\\widetilde W_t \\ge 2a - x$ feltétellel, és $2a - x \\ge a$ maga után vonja, hogy $\\tau_a \\le t$. Ezért"),
    eq("\\mathbb{P}(M_t \\ge a,\\ W_t \\le x) = \\mathbb{P}(W_t \\ge 2a - x) = 1 - \\Phi\\Big(\\frac{2a - x}{\\sqrt{t}}\\Big), \\qquad a \\ge 0,\\ x \\le a."),
    p("$a$ és $x$ szerint deriválva kapjuk az együttes sűrűségfüggvényt:"),
    eq("f_{M_t, W_t}(m, w) = \\frac{2(2m - w)}{\\sqrt{2\\pi t^3}}\\,\\exp\\Big(-\\frac{(2m - w)^2}{2t}\\Big), \\qquad m \\ge 0,\\ w \\le m."),
    p("Például annak valószínűsége, hogy a pálya az 1-es időpontig eléri az 1-et, de legfeljebb 0-ban végez, $\\mathbb{P}(W_1 \\ge 2) = 1 - \\Phi(2) \\approx 0{,}0228$."),
    p("A barrier opciókhoz éppen erre az együttes eloszlásra van szükség. Egy felfelé kiütő (up-and-out) call csak akkor fizet $(S_T - K)^+$ összeget, ha az árfolyam a teljes $[0, T]$ időszakban a $H$ korlát alatt marad. A Black–Scholes-modellben a logárfolyam driftes Brown-mozgás, az opció ára pedig a kifizetés diszkontált integrálja a maximum és a végpont együttes sűrűségfüggvénye szerint, a fenti módon driftre korrigálva. A gyakorlatban használt zárt alakú barrier opcióárak pontosan ebből a számításból származnak."),

    {
      kind: "check",
      id: "reflection-principle/joint-law",
      prompt: "Számítsd ki $\\mathbb{P}(M_1 \\ge 1,\\ W_1 \\le 0)$ értékét.",
      answer: { type: "number", value: 0.0228, tolerance: 0.0005 },
      explain: "$a = 1$, $x = 0$ mellett $\\mathbb{P}(M_1 \\ge 1,\\ W_1 \\le 0) = \\mathbb{P}(W_1 \\ge 2a - x) = \\mathbb{P}(W_1 \\ge 2) = 1 - \\Phi(2) \\approx 0{,}0228$.",
    },

    {
      kind: "worked",
      title: "Az 1-es szint elérése",
      steps: [
        { text: "A standard normális eloszlásfüggvény értéke 1-ben.", tex: "\\Phi(1)", result: { value: 0.8413, tolerance: 0.0001 } },
        { text: "A tükrözési elv szerint a $t = 1$-ig vett maximum kétszer akkora valószínűséggel éri el az 1-et, mint amekkorával $W_1$ 1 fölött végez.", tex: "\\mathbb{P}\\big(\\max_{t \\le 1} W_t \\ge 1\\big) = 2\\big(1 - \\Phi(1)\\big)", result: { value: 0.3173, tolerance: 0.0001 } },
        { text: "$\\{\\tau_1 \\le 1\\}$ ugyanaz az esemény, mint $\\{\\max_{t \\le 1} W_t \\ge 1\\}$, tehát a valószínűsége is ugyanannyi.", tex: "\\mathbb{P}(\\tau_1 \\le 1) = 2\\big(1 - \\Phi(1/\\sqrt{1})\\big)", result: { value: 0.3173, tolerance: 0.0001 } },
        { text: "Négyszer annyi idővel $\\Phi$ argumentuma a felére csökken.", tex: "\\mathbb{P}(\\tau_1 \\le 4) = 2\\big(1 - \\Phi(1/\\sqrt{4})\\big)", result: { value: 0.6171, tolerance: 0.0001 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "$\\tau_a = \\inf\\{t : W_t = a\\}$ megállási idő, és $\\{\\tau_a \\le t\\} = \\{M_t \\ge a\\}$.",
      "A $\\tau_a$-beli erős Markov-tulajdonság miatt a $\\tau_a$ után tükrözött pálya is Brown-mozgás; ebből $\\mathbb{P}(M_t \\ge a) = 2(1 - \\Phi(a/\\sqrt{t}))$ és $M_t \\sim |W_t|$.",
      "$\\tau_a$ sűrűségfüggvénye az $a(2\\pi t^3)^{-1/2}e^{-a^2/(2t)}$ Lévy-sűrűség: majdnem biztosan véges, de várható értéke végtelen.",
      "$x \\le a$ esetén $\\mathbb{P}(M_t \\ge a, W_t \\le x) = 1 - \\Phi((2a - x)/\\sqrt{t})$; ezzel az együttes eloszlással árazhatók a barrier opciók.",
      "Diszkrét időrácson a szimulált maximum lefelé torzít, mert a rácspontok közötti átlépések kimaradnak.",
    ),
    lab("/stochastic-models/reflection", "Tükrözz szimulált pályákat egy szinten a Sztochasztikus modellek stúdióban"),
  ],
};
