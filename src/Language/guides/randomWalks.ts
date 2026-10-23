import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const randomWalks: GuideLessonContent = {
  en: [
    p("The lesson \"Returns and volatility\" showed that, with independent returns, the standard deviation of the total log return grows like $\\sigma\\sqrt{T}$. This lesson builds the random process behind that rule from the simplest possible ingredient, a fair coin, and takes a limit to arrive at Brownian motion, the source of randomness in every continuous-time model that follows."),

    h("The coin-flip walk"),
    p("Toss a fair coin repeatedly. On heads move one unit up, on tails one unit down. Write the $k$-th move as $X_k$, so $X_k = +1$ or $X_k = -1$, each with probability $\\tfrac12$, and different tosses are independent. The position after $n$ tosses, starting from zero, is"),
    eq("W_n = X_1 + X_2 + \\cdots + X_n."),
    p("This is the **symmetric random walk**. Think of a person on a long corridor who takes one step forward or back each second depending on the coin. Nobody can say where they will be after 100 steps, but the spread of their likely positions can be computed exactly."),

    h("Mean and variance of the walk"),
    p("Each step has mean zero and variance one:"),
    eq("\\mathbb{E}[X_k] = \\tfrac12(+1) + \\tfrac12(-1) = 0, \\qquad \\operatorname{Var}(X_k) = \\mathbb{E}[X_k^2] = 1."),
    p("Expectations always add. Variances add when the terms are independent, which they are here. So"),
    eq("\\mathbb{E}[W_n] = 0, \\qquad \\operatorname{Var}(W_n) = n, \\qquad \\operatorname{sd}(W_n) = \\sqrt{n}."),
    p("The variance grows **linearly** in the number of steps and the standard deviation grows like its square root. After 100 tosses the typical distance from the start is $\\sqrt{100} = 10$ units, not 100. After 10000 tosses it is 100. Many steps partly cancel each other, which is why the spread grows much more slowly than the number of steps."),

    h("Scaling the steps"),
    p("To describe a price that moves continuously, we want many small steps inside a fixed time interval rather than unit steps once a second. Fix the interval $[0, 1]$, split it into $n$ steps of length $\\Delta t = 1/n$, and let each step have size $\\pm a$ for some $a$ still to be chosen. After $k$ steps the time is $t = k\\,\\Delta t$ and the variance of the position is $k a^2 = (t/\\Delta t)\\,a^2$."),
    p("Now let $n$ grow, so $\\Delta t$ shrinks. There are three cases:"),
    list(
      "If $a = 1$, the variance $t/\\Delta t$ grows without bound. The walk flies off.",
      "If $a = \\Delta t$, the variance $t\\,\\Delta t$ goes to zero. The walk collapses to a flat line.",
      "If $a = \\sqrt{\\Delta t}$, the variance is exactly $t$ for every $n$. This is the only choice that gives a non-trivial limit.",
    ),
    p("So the step size must be proportional to the **square root** of the time step:"),
    eq("W_{t + \\Delta t} = W_t \\pm \\sqrt{\\Delta t}, \\qquad \\operatorname{Var}(W_t) = \\frac{t}{\\Delta t}\\cdot \\Delta t = t."),
    p("Example: with $n = 100$ steps on $[0,1]$, each step is $\\pm\\sqrt{0.01} = \\pm 0.1$. At $t = 0.25$ the walk has taken 25 steps, so its variance is $25 \\times 0.01 = 0.25$ and its standard deviation is $0.5$. At $t = 1$ the standard deviation is 1."),
    p("The figure draws six sample paths of this scaled walk on $[0,1]$ together with the curves $\\pm\\sqrt{t}$ and $\\pm 2\\sqrt{t}$. Switch between $n = 10$, $100$ and $1000$ steps and press \"New paths\" a few times. The paths get finer, but the envelope stays the same, and the readout of the endpoint variance over 2000 simulated paths stays close to 1 whatever $n$ is."),
    figure("random-walk"),

    h("Brownian motion"),
    p("As $n \\to \\infty$, each $W_t$ is a sum of more and more small independent steps, so by the central limit theorem its distribution becomes normal. The limiting process is **Brownian motion** (also called the Wiener process), written $W_t$. It is defined by four properties:"),
    list(
      "$W_0 = 0$.",
      "For $s < t$, the increment $W_t - W_s$ is normally distributed with mean 0 and variance $t - s$.",
      "Increments over non-overlapping intervals are independent.",
      "The path $t \\mapsto W_t$ is continuous.",
    ),
    p("Taking $s = 0$ in the second property gives"),
    eq("W_t \\sim N(0,\\ t)."),
    p("Example: $W_1$ is standard normal, so it lies between $-1$ and $1$ with probability about 68%. The increment $W_1 - W_{0.5}$ has variance $0.5$, regardless of what the path did before $t = 0.5$."),
    note("Brownian motion: $W_0 = 0$, independent increments, $W_t - W_s \\sim N(0, t-s)$, continuous paths. In particular $\\operatorname{Var}(W_t) = t$."),

    h("Continuous but jagged paths"),
    p("Brownian paths have no jumps, yet they are extremely rough. Over a short interval $\\Delta t$ the typical move is $\\sqrt{\\Delta t}$, so the typical slope is"),
    eq("\\frac{\\sqrt{\\Delta t}}{\\Delta t} = \\frac{1}{\\sqrt{\\Delta t}} \\longrightarrow \\infty \\quad \\text{as } \\Delta t \\to 0."),
    p("Zooming in does not make the path look smoother, as it would for an ordinary smooth curve; it reveals more wiggles at every scale. The path has no well-defined slope at any point. This is why ordinary calculus does not apply directly to Brownian motion and later lessons need a correction term."),

    h("The link to the square-root-of-time rule"),
    p("Combine this with \"Returns and volatility\". Model the log return over $[0, T]$ as a straight-line drift plus a scaled Brownian motion:"),
    eq("\\ln\\frac{S_T}{S_0} = \\mu T + \\sigma W_T."),
    p("Since $W_T \\sim N(0, T)$, the log return is normal with mean $\\mu T$ and standard deviation $\\sigma\\sqrt{T}$, exactly the first model from \"Returns and volatility\". The $\\sqrt{T}$ in that rule is the $\\sqrt{t}$ envelope of the random walk in the figure."),

    h("Endpoints and the bell curve"),
    p("A single walk says little; many walks show the distribution. In the figure each walker takes $n$ steps of $\\pm 1$ and drops into the bin of its endpoint. Press Play, or add walkers by hand, and watch the histogram fill the normal curve with variance $n$. The sample variance settles near $n$ whatever $n$ you choose, and doubling $n$ makes the spread grow by $\\sqrt{2}$, not by 2."),
    figure("galton-walk"),

    {
      kind: "check",
      id: "random-walks/variance-100",
      prompt: "A symmetric walk takes 100 independent steps of $\\pm 1$. What is the variance of its position $W_{100}$?",
      answer: { type: "number", value: 100, tolerance: 0.5 },
      explain: "Each step has variance 1 and independent variances add, so $\\operatorname{Var}(W_{100}) = 100$; the standard deviation is 10.",
    },

    {
      kind: "check",
      id: "random-walks/brownian-scaling",
      prompt: "The interval $[0, 1]$ is split into $n$ steps of length $1/n$. Which step size gives a walk that converges to Brownian motion as $n \\to \\infty$?",
      answer: { type: "choice", options: ["$\\pm 1$","$\\pm 1/n$","$\\pm\\sqrt{1/n}$","$\\pm n$"], correct: 2 },
      explain: "With steps $\\pm\\sqrt{\\Delta t}$ the variance at time $t$ is $(t/\\Delta t)\\,\\Delta t = t$ for every $n$. Steps of $\\pm 1$ make the variance blow up, steps of $\\pm 1/n$ make it vanish.",
    },

    {
      kind: "worked",
      title: "The distribution of a four-step walk",
      steps: [
        { text: "Paths ending at $W_4 = 2$ need three up-steps and one down-step; count the orderings.", tex: "\\binom{4}{3}", result: { value: 4, tolerance: 0 } },
        { text: "Each path has probability $(1/2)^4$.", tex: "\\Pr(W_4 = 2) = 4 \\cdot (1/2)^4", result: { value: 0.25, tolerance: 0.001 } },
        { text: "The mean is zero, since every step has mean zero.", tex: "\\mathbb{E}[W_4] = 0", result: { value: 0, tolerance: 0.001 } },
        { text: "The variance is the number of steps.", tex: "\\operatorname{Var}(W_4) = 4 \\cdot 1", result: { value: 4, tolerance: 0.001 } },
      ],
    },

    h("Summary"),
    list(
      "A coin-flip walk of $n$ independent $\\pm 1$ steps has mean 0 and variance $n$, so its spread grows like $\\sqrt{n}$.",
      "To get a sensible limit in continuous time, steps of length $\\Delta t$ must have size $\\pm\\sqrt{\\Delta t}$; then $\\operatorname{Var}(W_t) = t$.",
      "The limit is Brownian motion: $W_0 = 0$, independent normal increments with variance equal to elapsed time, continuous paths.",
      "Brownian paths are continuous but have no slope anywhere.",
      "The log return model $\\mu T + \\sigma W_T$ reproduces the square-root-of-time rule.",
    ),
    lab("/brownian-motion", "Simulate and inspect Brownian paths in the Brownian Motion lab"),
  ],

  hu: [
    p("A „Hozamok és volatilitás” című lecke megmutatta, hogy független hozamok esetén a teljes loghozam szórása $\\sigma\\sqrt{T}$-ként nő. Ez a lecke a szabály mögötti véletlen folyamatot a lehető legegyszerűbb építőelemből, egy szabályos pénzérméből rakja össze, majd egy határátmenettel eljut a Brown-mozgáshoz. A későbbi folytonos idejű modellekben minden véletlenség ebből származik."),

    h("Pénzfeldobásos bolyongás"),
    p("Dobjunk fel ismételten egy szabályos érmét. Fej esetén lépjünk egy egységet felfelé, írás esetén egyet lefelé. A $k$-adik lépés legyen $X_k$, tehát $X_k = +1$ vagy $X_k = -1$, mindkettő $\\tfrac12$ valószínűséggel, és a dobások egymástól függetlenek. A nulláról induló pozíció $n$ dobás után"),
    eq("W_n = X_1 + X_2 + \\cdots + X_n."),
    p("Ez a **szimmetrikus véletlen bolyongás**. Képzelj el valakit egy hosszú folyosón, aki másodpercenként az érme szerint egyet előre vagy egyet hátra lép. Senki sem tudja megmondani, hol lesz 100 lépés után, de a valószínű helyzetek szóródása pontosan kiszámolható."),

    h("A bolyongás várható értéke és varianciája"),
    p("Minden lépés várható értéke nulla, varianciája egy:"),
    eq("\\mathbb{E}[X_k] = \\tfrac12(+1) + \\tfrac12(-1) = 0, \\qquad \\operatorname{Var}(X_k) = \\mathbb{E}[X_k^2] = 1."),
    p("A várható értékek mindig összeadódnak, a varianciák pedig akkor, ha a tagok függetlenek, és itt azok. Így"),
    eq("\\mathbb{E}[W_n] = 0, \\qquad \\operatorname{Var}(W_n) = n, \\qquad \\operatorname{sd}(W_n) = \\sqrt{n}."),
    p("A variancia a lépésszámmal **lineárisan** nő, a szórás ennek gyökével. 100 dobás után a kiindulóponttól mért jellemző távolság $\\sqrt{100} = 10$ egység, nem 100. 10000 dobás után 100. A lépések részben kioltják egymást, ezért nő a szóródás sokkal lassabban, mint a lépések száma."),

    h("A lépések skálázása"),
    p("Folytonosan mozgó árfolyam leírásához egy rögzített időintervallumon belül sok kis lépésre van szükség, nem másodpercenkénti egységlépésekre. Rögzítsük a $[0, 1]$ intervallumot, osszuk fel $n$ darab $\\Delta t = 1/n$ hosszú lépésre, és legyen minden lépés mérete $\\pm a$, ahol $a$-t még meg kell választani. $k$ lépés után az idő $t = k\\,\\Delta t$, a pozíció varianciája pedig $k a^2 = (t/\\Delta t)\\,a^2$."),
    p("Növeljük most $n$-et, vagyis csökkentsük $\\Delta t$-t. Három eset van:"),
    list(
      "Ha $a = 1$, a $t/\\Delta t$ variancia minden határon túl nő. A bolyongás elszáll.",
      "Ha $a = \\Delta t$, a $t\\,\\Delta t$ variancia nullához tart. A bolyongás vízszintes egyenessé laposodik.",
      "Ha $a = \\sqrt{\\Delta t}$, a variancia minden $n$-re pontosan $t$. Csak ez a választás ad nem triviális határértéket.",
    ),
    p("A lépésméretnek tehát az időlépés **négyzetgyökével** kell arányosnak lennie:"),
    eq("W_{t + \\Delta t} = W_t \\pm \\sqrt{\\Delta t}, \\qquad \\operatorname{Var}(W_t) = \\frac{t}{\\Delta t}\\cdot \\Delta t = t."),
    p("Példa: $n = 100$ lépésnél a $[0,1]$ intervallumon minden lépés $\\pm\\sqrt{0{,}01} = \\pm 0{,}1$. A $t = 0{,}25$ időpontig 25 lépés történt, így a variancia $25 \\times 0{,}01 = 0{,}25$, a szórás $0{,}5$. A $t = 1$ időpontban a szórás 1."),
    p("Az ábra a skálázott bolyongás hat mintapályáját rajzolja ki a $[0,1]$ intervallumon, a $\\pm\\sqrt{t}$ és $\\pm 2\\sqrt{t}$ görbékkel együtt. Válts az $n = 10$, $100$ és $1000$ lépés között, és nyomd meg néhányszor az „Új pályák” gombot. A pályák finomabbak lesznek, a burkológörbe viszont ugyanaz marad, és a 2000 szimulált pálya végpontjainak varianciája $n$-től függetlenül 1 közelében van."),
    figure("random-walk"),

    h("Brown-mozgás"),
    p("Ha $n \\to \\infty$, minden $W_t$ egyre több kicsi, független lépés összege, ezért a centrális határeloszlás-tétel szerint eloszlása normálissá válik. A határfolyamat a **Brown-mozgás** (más néven Wiener-folyamat), jele $W_t$. Négy tulajdonság határozza meg:"),
    list(
      "$W_0 = 0$.",
      "$s < t$ esetén a $W_t - W_s$ növekmény normális eloszlású, várható értéke 0, varianciája $t - s$.",
      "A nem átfedő intervallumokon vett növekmények függetlenek.",
      "A $t \\mapsto W_t$ pálya folytonos.",
    ),
    p("A második tulajdonságba $s = 0$-t írva"),
    eq("W_t \\sim N(0,\\ t)."),
    p("Példa: $W_1$ standard normális, így kb. 68% valószínűséggel esik $-1$ és $1$ közé. A $W_1 - W_{0{,}5}$ növekmény varianciája $0{,}5$, függetlenül attól, mit csinált a pálya $t = 0{,}5$ előtt."),
    note("Brown-mozgás: $W_0 = 0$, független növekmények, $W_t - W_s \\sim N(0, t-s)$, folytonos pályák. Speciálisan $\\operatorname{Var}(W_t) = t$."),

    h("Folytonos, de recés pályák"),
    p("A Brown-pályákban nincs ugrás, mégis rendkívül egyenetlenek. Egy rövid $\\Delta t$ intervallumon a jellemző elmozdulás $\\sqrt{\\Delta t}$, így a jellemző meredekség"),
    eq("\\frac{\\sqrt{\\Delta t}}{\\Delta t} = \\frac{1}{\\sqrt{\\Delta t}} \\longrightarrow \\infty \\quad \\text{ha } \\Delta t \\to 0."),
    p("Ha belenagyítunk, a pálya nem simul ki, ahogy egy közönséges sima görbe tenné, hanem minden léptékben újabb hullámzás jelenik meg. A pályának egyetlen pontban sincs jól definiált meredeksége. Ezért nem alkalmazható közvetlenül a szokásos analízis a Brown-mozgásra, és ezért lesz szükség a későbbi leckékben egy korrekciós tagra."),

    h("Kapcsolat a négyzetgyökös időszabállyal"),
    p("Kössük össze ezt a „Hozamok és volatilitás” leckével. Modellezzük a $[0, T]$ alatti loghozamot egy lineáris drift és egy skálázott Brown-mozgás összegeként:"),
    eq("\\ln\\frac{S_T}{S_0} = \\mu T + \\sigma W_T."),
    p("Mivel $W_T \\sim N(0, T)$, a loghozam normális eloszlású $\\mu T$ várható értékkel és $\\sigma\\sqrt{T}$ szórással, pontosan úgy, mint a „Hozamok és volatilitás” lecke első modelljében. A szabályban szereplő $\\sqrt{T}$ nem más, mint a bolyongás $\\sqrt{t}$ burkológörbéje az ábrán."),

    h("Végpontok és a haranggörbe"),
    p("Egyetlen bolyongás keveset árul el, sok bolyongás viszont kirajzolja az eloszlást. Az ábrán minden bolyongó $n$ darab $\\pm 1$-es lépést tesz, majd a végpontjának megfelelő oszlopba esik. Nyomd meg a Lejátszás gombot, vagy adj hozzá bolyongókat kézzel, és figyeld, ahogy a hisztogram kitölti az $n$ varianciájú normális görbét. A mintavariancia bármely $n$ mellett $n$ közelébe áll be, és $n$ duplázásakor a szóródás $\\sqrt{2}$-szeresére nő, nem kétszeresére."),
    figure("galton-walk"),

    {
      kind: "check",
      id: "random-walks/variance-100",
      prompt: "Egy szimmetrikus bolyongás 100 független, $\\pm 1$-es lépést tesz. Mennyi a $W_{100}$ pozíció varianciája?",
      answer: { type: "number", value: 100, tolerance: 0.5 },
      explain: "Minden lépés varianciája 1, és független tagok varianciái összeadódnak, így $\\operatorname{Var}(W_{100}) = 100$; a szórás 10.",
    },

    {
      kind: "check",
      id: "random-walks/brownian-scaling",
      prompt: "A $[0, 1]$ intervallumot $n$ darab $1/n$ hosszú lépésre osztjuk. Melyik lépésméret mellett tart a bolyongás a Brown-mozgáshoz, ha $n \\to \\infty$?",
      answer: { type: "choice", options: ["$\\pm 1$","$\\pm 1/n$","$\\pm\\sqrt{1/n}$","$\\pm n$"], correct: 2 },
      explain: "$\\pm\\sqrt{\\Delta t}$ lépésekkel a $t$ időpontbeli variancia minden $n$-re $(t/\\Delta t)\\,\\Delta t = t$. $\\pm 1$-es lépésekkel a variancia elszáll, $\\pm 1/n$-esekkel eltűnik.",
    },

    {
      kind: "worked",
      title: "Egy négylépéses bolyongás eloszlása",
      steps: [
        { text: "A $W_4 = 2$-ben végződő pályákhoz három felfelé és egy lefelé lépés kell; számold meg a sorrendeket.", tex: "\\binom{4}{3}", result: { value: 4, tolerance: 0 } },
        { text: "Minden pálya valószínűsége $(1/2)^4$.", tex: "\\Pr(W_4 = 2) = 4 \\cdot (1/2)^4", result: { value: 0.25, tolerance: 0.001 } },
        { text: "A várható érték nulla, mert minden lépés várható értéke nulla.", tex: "\\mathbb{E}[W_4] = 0", result: { value: 0, tolerance: 0.001 } },
        { text: "A variancia a lépések száma.", tex: "\\operatorname{Var}(W_4) = 4 \\cdot 1", result: { value: 4, tolerance: 0.001 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "$n$ független $\\pm 1$ lépésből álló pénzfeldobásos bolyongás várható értéke 0, varianciája $n$, így a szóródása $\\sqrt{n}$-ként nő.",
      "Értelmes folytonos idejű határértékhez a $\\Delta t$ hosszú lépések mérete $\\pm\\sqrt{\\Delta t}$ kell legyen; ekkor $\\operatorname{Var}(W_t) = t$.",
      "A határfolyamat a Brown-mozgás: $W_0 = 0$, független, normális növekmények az eltelt idővel egyenlő varianciával, folytonos pályák.",
      "A Brown-pályák folytonosak, de sehol sincs meredekségük.",
      "A $\\mu T + \\sigma W_T$ loghozam-modell visszaadja a négyzetgyökös időszabályt.",
    ),
    lab("/brownian-motion", "Szimulálj és vizsgálj Brown-pályákat a Brown-mozgás laborban"),
  ],
};
