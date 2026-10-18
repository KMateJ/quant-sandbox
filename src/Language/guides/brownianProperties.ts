import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const brownianProperties: GuideLessonContent = {
  en: [
    p("The lesson \"Random walks and Brownian motion\" obtained Brownian motion as the limit of a scaled coin-flip walk and listed its defining properties informally. With the language of \"Probability spaces, σ-algebras and random variables\" and \"Filtrations, adapted processes and stopping times\" in hand, this lesson states the definition precisely, proves that Brownian motion is characterised by its covariance function, and uses that characterisation to derive four invariances, among them time inversion. It ends with the main path properties: recurrence, nowhere differentiability, infinite total variation, finite quadratic variation, and the Markov and strong Markov properties."),

    h("Definition of Brownian motion"),
    p("Let $(\\Omega, \\mathcal{F}, \\mathbb{P})$ be a probability space. A **standard Brownian motion** is a family of random variables $(W_t)_{t \\ge 0}$ on it such that"),
    list(
      "$W_0 = 0$ almost surely;",
      "for all $0 \\le t_0 < t_1 < \\cdots < t_n$ the increments $W_{t_1} - W_{t_0}, \\dots, W_{t_n} - W_{t_{n-1}}$ are independent;",
      "for $0 \\le s < t$ the increment $W_t - W_s$ has the normal distribution $N(0, t - s)$;",
      "for almost every $\\omega \\in \\Omega$ the path $t \\mapsto W_t(\\omega)$ is continuous.",
    ),
    p("That such a process exists is a theorem (Wiener, 1923); a standard proof builds the finite-dimensional distributions and then uses Kolmogorov's continuity theorem to obtain a continuous version. Given a filtration $(\\mathcal{F}_t)_{t \\ge 0}$, $W$ is a Brownian motion **with respect to** $(\\mathcal{F}_t)$ if it is adapted and $W_t - W_s$ is independent of $\\mathcal{F}_s$ for every $s < t$. For the natural filtration $\\mathcal{F}^W_t = \\sigma(W_u : u \\le t)$ this follows from the independent increments."),

    h("Brownian motion as a Gaussian process"),
    p("A process $(X_t)$ is a **Gaussian process** if every vector $(X_{t_1}, \\dots, X_{t_n})$ is multivariate normal. Its law is then fixed by the mean function $\\mathbb{E}[X_t]$ and the covariance function $\\operatorname{Cov}(X_s, X_t)$, because a multivariate normal distribution is fixed by its mean vector and covariance matrix."),
    p("Brownian motion is Gaussian: $(W_{t_1}, \\dots, W_{t_n})$ is a linear transformation of the independent normal increments, since $W_{t_k} = \\sum_{j \\le k}(W_{t_j} - W_{t_{j-1}})$. Its mean is zero, and for $s \\le t$, splitting $W_t = W_s + (W_t - W_s)$ with the second term independent of the first,"),
    eq("\\operatorname{Cov}(W_s, W_t) = \\operatorname{Var}(W_s) + \\operatorname{Cov}(W_s, W_t - W_s) = s = \\min(s, t)."),
    note("Characterisation: a process $(X_t)_{t \\ge 0}$ with continuous paths is a standard Brownian motion if and only if it is a centred Gaussian process with $\\operatorname{Cov}(X_s, X_t) = \\min(s, t)$."),
    p("The forward direction was just shown. Conversely, let $X$ be such a process. Then $\\operatorname{Var}(X_0) = 0$, so $X_0 = 0$. For $s < t$, $\\operatorname{Var}(X_t - X_s) = t - 2s + s = t - s$. For disjoint intervals $s < t \\le u < v$,"),
    eq("\\operatorname{Cov}(X_t - X_s,\\, X_v - X_u) = \\min(t,v) - \\min(t,u) - \\min(s,v) + \\min(s,u) = t - t - s + s = 0."),
    p("The increments are jointly normal, and for jointly normal variables zero covariance implies independence. So all four defining properties hold. In practice this means: to show that a transformed process is a Brownian motion, it suffices to check that it is centred Gaussian, has covariance $\\min(s,t)$, and has continuous paths."),

    {
      kind: "check",
      id: "brownian-properties/covariance",
      prompt: "Using $\\operatorname{Cov}(W_s, W_t) = \\min(s,t)$, compute $\\operatorname{Cov}(W_2,\\, W_3 - W_1)$.",
      answer: { type: "number", value: 1, tolerance: 0.001 },
      explain: "$\\operatorname{Cov}(W_2, W_3) - \\operatorname{Cov}(W_2, W_1) = 2 - 1 = 1$. Equivalently, $W_2 = W_1 + (W_2 - W_1)$ and only the overlap $[1, 2]$ of the two intervals contributes, with variance 1.",
    },

    h("Four invariances"),
    p("Each transformation below is a linear map applied to $W$, so the result is again a centred Gaussian process; only the covariance and continuity need checking. Let $c > 0$ and $s \\ge 0$ be fixed."),
    list(
      "**Symmetry.** $X_t = -W_t$. Then $\\operatorname{Cov}(X_u, X_v) = \\min(u,v)$ trivially.",
      "**Scaling.** $X_t = c^{-1/2} W_{ct}$. Then $\\operatorname{Cov}(X_u, X_v) = c^{-1}\\min(cu, cv) = \\min(u,v)$. Speeding up time by $c$ and shrinking space by $\\sqrt{c}$ gives the same process.",
      "**Time shift.** $X_t = W_{s+t} - W_s$. Then $\\operatorname{Cov}(X_u, X_v) = \\min(s+u, s+v) - s - s + s = \\min(u,v)$. Moreover $X$ is independent of $\\mathcal{F}_s$, because its finite-dimensional vectors are built from increments after $s$. This is the **simple Markov property**: after any fixed time the process starts afresh, independently of the past.",
      "**Time inversion.** $X_t = t\\,W_{1/t}$ for $t > 0$ and $X_0 = 0$. For $u, v > 0$, $\\operatorname{Cov}(X_u, X_v) = uv\\min(1/u, 1/v) = uv/\\max(u,v) = \\min(u,v)$.",
    ),
    p("Only time inversion needs care with continuity. On $(0, \\infty)$ the path $t \\mapsto t W_{1/t}$ is continuous; the question is whether $X_t \\to 0$ as $t \\downarrow 0$. Restricted to the positive rationals, $X$ and $W$ have the same finite-dimensional distributions, and the event $\\{X_q \\to 0 \\text{ as } q \\downarrow 0,\\ q \\in \\mathbb{Q}\\}$ is determined by countably many coordinates. Its probability is therefore the same as for $W$, namely 1. Continuity on $(0, \\infty)$ then gives $X_t \\to 0$ along all $t$. Substituting $u = 1/t$ yields the **law of large numbers for Brownian motion**:"),
    eq("\\lim_{u \\to \\infty} \\frac{W_u}{u} = \\lim_{t \\downarrow 0} t\\,W_{1/t} = 0 \\quad \\text{almost surely}."),
    p("Time inversion swaps the behaviour of the path near $t = 0$ with its behaviour as $t \\to \\infty$: every statement about one end gives a statement about the other."),
    p("The figure applies one transformation at a time to fresh Brownian paths and draws 8 transformed paths on $t \\in [0, 1]$ together with the curves $\\pm\\sqrt{t}$ and $\\pm 2\\sqrt{t}$. Choose scaling and move $c$ from 0.25 to 4, choose time inversion, symmetry, or time shift and move $s$ from 0 to 2, and press \"New paths\". The readouts, computed over 2000 paths, show the sample variance of $X_1$, close to 1, and the sample covariance of $(X_{0.5}, X_1)$, close to $\\min(0.5, 1) = 0.5$, whichever transformation is selected."),
    figure("bm-transformations"),

    {
      kind: "check",
      id: "brownian-properties/which-is-bm",
      prompt: "Which of these processes is again a standard Brownian motion?",
      answer: {
        type: "choice",
        options: ["$X_t = W_{2t}$", "$X_t = t\\,W_{1/t}$ for $t > 0$, with $X_0 = 0$", "$X_t = \\sqrt{t}\\,W_1$", "$X_t = W_t^2 - t$"],
        correct: 1,
      },
      explain: "$t\\,W_{1/t}$ is centred Gaussian with covariance $\\min(s,t)$ and continuous at 0. $W_{2t}$ has variance $2t$; $\\sqrt{t}\\,W_1$ has covariance $\\sqrt{st} \\ne \\min(s,t)$, so its increments are not independent; $W_t^2 - t$ is not Gaussian.",
    },

    h("Worked example"),
    p("Find $\\mathbb{P}(W_1 > 0,\\ W_2 > 0)$. The pair $(W_1, W_2)$ is bivariate normal with variances 1 and 2 and covariance $\\min(1,2) = 1$, so its correlation is $\\rho = 1/\\sqrt{2} \\approx 0.7071$. For a centred bivariate normal pair the probability that both coordinates are positive is $\\tfrac14 + \\arcsin(\\rho)/(2\\pi)$, hence"),
    eq("\\mathbb{P}(W_1 > 0,\\ W_2 > 0) = \\frac14 + \\frac{\\arcsin(1/\\sqrt{2})}{2\\pi} = \\frac14 + \\frac{\\pi/4}{2\\pi} = \\frac38 = 0.375."),
    p("Independent signs would give $0.25$; the extra $0.125$ comes from the shared stretch $[0, 1]$ of the two values."),

    h("Path properties"),
    p("The invariances lead to the following almost-sure properties. They are stated as theorems; the proofs are in any text on Brownian motion."),
    list(
      "**Law of the iterated logarithm** (Khinchin): $\\limsup_{t \\to \\infty} W_t / \\sqrt{2t\\ln\\ln t} = 1$. By time inversion, also $\\limsup_{t \\downarrow 0} W_t / \\sqrt{2t\\ln\\ln(1/t)} = 1$.",
      "**Recurrence**: by the law of the iterated logarithm and symmetry, $\\limsup_{t\\to\\infty} W_t = +\\infty$ and $\\liminf_{t\\to\\infty} W_t = -\\infty$. Since paths are continuous, $W$ hits every level $a \\in \\mathbb{R}$, and does so at arbitrarily large times. Near $t = 0$ the small-time version shows that $W$ returns to 0 infinitely often in every interval $[0, \\varepsilon]$.",
      "**Nowhere differentiability** (Paley, Wiener and Zygmund, 1933): with probability one, $t \\mapsto W_t$ is differentiable at no $t$. Scaling explains why: $(W_{t+h} - W_t)/h \\sim N(0, 1/h)$, so for any bound $K$, $\\mathbb{P}(|(W_{t+h} - W_t)/h| \\le K) = \\mathbb{P}(|Z| \\le K\\sqrt{h}) \\to 0$ as $h \\downarrow 0$.",
    ),

    h("Quadratic and total variation"),
    p("Take partitions $0 = t_0 < t_1 < \\cdots < t_n = t$ with mesh $\\delta_n = \\max_i (t_{i+1} - t_i) \\to 0$, write $\\Delta W_i = W_{t_{i+1}} - W_{t_i}$, $\\Delta t_i = t_{i+1} - t_i$, and $Q_n = \\sum_i (\\Delta W_i)^2$. The theorem is that $Q_n \\to t$ in $L^2$; one writes $[W]_t = t$. The proof is short. Since $\\Delta W_i \\sim N(0, \\Delta t_i)$ independently, and $\\operatorname{Var}(Z^2) = 2\\sigma^4$ for $Z \\sim N(0, \\sigma^2)$,"),
    eq("\\mathbb{E}[Q_n] = \\sum_i \\Delta t_i = t, \\qquad \\operatorname{Var}(Q_n) = \\sum_i 2\\,\\Delta t_i^2 \\le 2t\\,\\delta_n \\longrightarrow 0."),
    p("So $\\mathbb{E}[(Q_n - t)^2] \\to 0$. (Along dyadic partitions the convergence is also almost sure.) The **total variation** is then infinite: $Q_n \\le \\max_i |\\Delta W_i| \\cdot \\sum_i |\\Delta W_i|$, and $\\max_i |\\Delta W_i| \\to 0$ by uniform continuity of the path on $[0, t]$, so $\\sum_i |\\Delta W_i| \\to \\infty$ along a subsequence on which $Q_n \\to t$ almost surely. A smooth function has finite total variation and zero quadratic variation; Brownian motion has the opposite. This is why $\\int H\\,dW$ cannot be defined path by path as an ordinary Stieltjes integral."),

    {
      kind: "check",
      id: "brownian-properties/qv-variance",
      prompt: "Split $[0, 1]$ into $n = 100$ equal steps. What is $\\operatorname{Var}\\big(\\sum_i (\\Delta W_i)^2\\big)$?",
      answer: { type: "number", value: 0.02, tolerance: 0.0005 },
      explain: "Each term has variance $2\\,\\Delta t^2 = 2 \\times 0.01^2 = 0.0002$, and there are 100 independent terms: $100 \\times 0.0002 = 0.02 = 2/n$. The mean is 1, so the sum concentrates at $[W]_1 = 1$.",
    },

    h("Markov and strong Markov property"),
    p("The time-shift invariance states the **Markov property**: for every fixed $s \\ge 0$, the process $(W_{s+t} - W_s)_{t \\ge 0}$ is a Brownian motion independent of $\\mathcal{F}_s$. Equivalently, for bounded measurable $f$, $\\mathbb{E}[f(W_{s+t}) \\mid \\mathcal{F}_s] = g(W_s)$ with $g(x) = \\mathbb{E}[f(x + W_t)]$: the forecast depends on the past only through the present value."),
    p("The **strong Markov property** (Hunt, 1956) allows the fixed time $s$ to be replaced by a stopping time $\\tau$: on $\\{\\tau < \\infty\\}$, the process $(W_{\\tau+t} - W_\\tau)_{t \\ge 0}$ is a Brownian motion independent of $\\mathcal{F}_\\tau$. Think of it as a restart rule: whenever you stop using only the information available so far, what happens next is a fresh Brownian motion. A random time that looks into the future, such as the time of the maximum on $[0, 1]$, does not have this property. The next lesson uses the strong Markov property at the first time the path reaches a level."),

    h("Summary"),
    list(
      "Brownian motion: $W_0 = 0$, independent increments, $W_t - W_s \\sim N(0, t-s)$, continuous paths; equivalently, a continuous centred Gaussian process with $\\operatorname{Cov}(W_s, W_t) = \\min(s,t)$.",
      "Symmetry $-W_t$, scaling $c^{-1/2}W_{ct}$, time shift $W_{s+t} - W_s$ and time inversion $t\\,W_{1/t}$ are again Brownian motions; time inversion gives $W_t/t \\to 0$.",
      "Paths are recurrent, obey the law of the iterated logarithm and are nowhere differentiable.",
      "Quadratic variation $[W]_t = t$, total variation infinite.",
      "Markov property at fixed times, strong Markov property at stopping times.",
    ),
    lab("/stochastic-models/covariance", "Estimate the covariance of Brownian motion from simulated paths in the Stochastic Models studio"),
  ],

  hu: [
    p("A „Véletlen bolyongás és Brown-mozgás” című lecke a Brown-mozgást egy skálázott pénzfeldobásos bolyongás határértékeként kapta meg, és informálisan sorolta fel a tulajdonságait. A „Valószínűségi mezők, σ-algebrák és valószínűségi változók” és a „Filtrációk, adaptált folyamatok és megállási idők” című leckék fogalmaival ez a lecke pontosan kimondja a definíciót, bebizonyítja, hogy a Brown-mozgást a kovarianciafüggvénye jellemzi, és ebből a jellemzésből levezet négy invarianciát, köztük az időinverziót. A végén a fő pályatulajdonságok következnek: rekurrencia, sehol sem differenciálhatóság, végtelen teljes változás, véges kvadratikus variáció, valamint a Markov- és az erős Markov-tulajdonság."),

    h("A Brown-mozgás definíciója"),
    p("Legyen $(\\Omega, \\mathcal{F}, \\mathbb{P})$ valószínűségi mező. **Standard Brown-mozgásnak** nevezzük az ezen értelmezett $(W_t)_{t \\ge 0}$ valószínűségi változó-családot, ha"),
    list(
      "$W_0 = 0$ majdnem biztosan;",
      "minden $0 \\le t_0 < t_1 < \\cdots < t_n$ esetén a $W_{t_1} - W_{t_0}, \\dots, W_{t_n} - W_{t_{n-1}}$ növekmények függetlenek;",
      "$0 \\le s < t$ esetén a $W_t - W_s$ növekmény eloszlása $N(0, t - s)$;",
      "majdnem minden $\\omega \\in \\Omega$ esetén a $t \\mapsto W_t(\\omega)$ pálya folytonos.",
    ),
    p("Hogy ilyen folyamat létezik, az tétel (Wiener, 1923); a szokásos bizonyítás megadja a véges dimenziós eloszlásokat, majd a Kolmogorov-féle folytonossági tétellel folytonos változatot állít elő. Ha adott egy $(\\mathcal{F}_t)_{t \\ge 0}$ filtráció, akkor $W$ az $(\\mathcal{F}_t)$ filtrációra **vonatkozó** Brown-mozgás, ha adaptált, és minden $s < t$ esetén $W_t - W_s$ független $\\mathcal{F}_s$-től. Az $\\mathcal{F}^W_t = \\sigma(W_u : u \\le t)$ természetes filtrációra ez a független növekményekből következik."),

    h("A Brown-mozgás mint Gauss-folyamat"),
    p("Az $(X_t)$ folyamat **Gauss-folyamat**, ha minden $(X_{t_1}, \\dots, X_{t_n})$ vektor többdimenziós normális eloszlású. Ekkor az eloszlását az $\\mathbb{E}[X_t]$ várhatóérték-függvény és a $\\operatorname{Cov}(X_s, X_t)$ kovarianciafüggvény meghatározza, hiszen a többdimenziós normális eloszlást a várhatóérték-vektora és a kovarianciamátrixa meghatározza."),
    p("A Brown-mozgás Gauss-folyamat: $(W_{t_1}, \\dots, W_{t_n})$ a független, normális növekmények lineáris transzformáltja, mert $W_{t_k} = \\sum_{j \\le k}(W_{t_j} - W_{t_{j-1}})$. Várható értéke nulla, és $s \\le t$ esetén a $W_t = W_s + (W_t - W_s)$ felbontásban a második tag független az elsőtől, így"),
    eq("\\operatorname{Cov}(W_s, W_t) = \\operatorname{Var}(W_s) + \\operatorname{Cov}(W_s, W_t - W_s) = s = \\min(s, t)."),
    note("Jellemzés: egy folytonos pályájú $(X_t)_{t \\ge 0}$ folyamat pontosan akkor standard Brown-mozgás, ha centrált Gauss-folyamat, és $\\operatorname{Cov}(X_s, X_t) = \\min(s, t)$."),
    p("Az egyik irányt az imént láttuk. Megfordítva, legyen $X$ ilyen folyamat. Ekkor $\\operatorname{Var}(X_0) = 0$, tehát $X_0 = 0$. Ha $s < t$, akkor $\\operatorname{Var}(X_t - X_s) = t - 2s + s = t - s$. Diszjunkt $s < t \\le u < v$ intervallumokra"),
    eq("\\operatorname{Cov}(X_t - X_s,\\, X_v - X_u) = \\min(t,v) - \\min(t,u) - \\min(s,v) + \\min(s,u) = t - t - s + s = 0."),
    p("A növekmények együttesen normálisak, együttesen normális változóknál pedig a nulla kovariancia függetlenséget jelent. Így mind a négy definiáló tulajdonság teljesül. A gyakorlatban ez azt jelenti, hogy egy transzformált folyamatról elég megmutatni, hogy centrált Gauss-folyamat, kovarianciája $\\min(s,t)$, és pályái folytonosak, és máris Brown-mozgás."),

    {
      kind: "check",
      id: "brownian-properties/covariance",
      prompt: "A $\\operatorname{Cov}(W_s, W_t) = \\min(s,t)$ képlettel számítsd ki $\\operatorname{Cov}(W_2,\\, W_3 - W_1)$ értékét.",
      answer: { type: "number", value: 1, tolerance: 0.001 },
      explain: "$\\operatorname{Cov}(W_2, W_3) - \\operatorname{Cov}(W_2, W_1) = 2 - 1 = 1$. Másképp: $W_2 = W_1 + (W_2 - W_1)$, és csak a két intervallum közös része, $[1, 2]$ számít, ennek varianciája 1.",
    },

    h("Négy invariancia"),
    p("Az alábbi transzformációk mindegyike lineáris leképezés $W$-n, így az eredmény ismét centrált Gauss-folyamat; csak a kovarianciát és a folytonosságot kell ellenőrizni. Legyen $c > 0$ és $s \\ge 0$ rögzített."),
    list(
      "**Szimmetria.** $X_t = -W_t$. Ekkor nyilvánvalóan $\\operatorname{Cov}(X_u, X_v) = \\min(u,v)$.",
      "**Skálázás.** $X_t = c^{-1/2} W_{ct}$. Ekkor $\\operatorname{Cov}(X_u, X_v) = c^{-1}\\min(cu, cv) = \\min(u,v)$. Ha az időt $c$-szeresére gyorsítjuk, a teret pedig $\\sqrt{c}$-vel összenyomjuk, ugyanazt a folyamatot kapjuk.",
      "**Időeltolás.** $X_t = W_{s+t} - W_s$. Ekkor $\\operatorname{Cov}(X_u, X_v) = \\min(s+u, s+v) - s - s + s = \\min(u,v)$. Ráadásul $X$ független $\\mathcal{F}_s$-től, mert véges dimenziós vektorai $s$ utáni növekményekből állnak. Ez az **egyszerű Markov-tulajdonság**: bármely rögzített időpont után a folyamat elölről kezdődik, a múlttól függetlenül.",
      "**Időinverzió.** $X_t = t\\,W_{1/t}$, ha $t > 0$, és $X_0 = 0$. Ha $u, v > 0$, akkor $\\operatorname{Cov}(X_u, X_v) = uv\\min(1/u, 1/v) = uv/\\max(u,v) = \\min(u,v)$.",
    ),
    p("Csak az időinverziónál kell a folytonossággal vigyázni. A $(0, \\infty)$ intervallumon a $t \\mapsto t W_{1/t}$ pálya folytonos; a kérdés az, hogy $X_t \\to 0$ teljesül-e, ha $t \\downarrow 0$. A pozitív racionális számokra megszorítva $X$ és $W$ véges dimenziós eloszlásai megegyeznek, az $\\{X_q \\to 0,\\ \\text{ha } q \\downarrow 0,\\ q \\in \\mathbb{Q}\\}$ eseményt pedig megszámlálhatóan sok koordináta határozza meg. Valószínűsége ezért ugyanannyi, mint $W$ esetén, vagyis 1. A $(0, \\infty)$-en való folytonosság miatt ekkor minden $t$ mentén $X_t \\to 0$. Az $u = 1/t$ helyettesítéssel kapjuk a **nagy számok törvényét Brown-mozgásra**:"),
    eq("\\lim_{u \\to \\infty} \\frac{W_u}{u} = \\lim_{t \\downarrow 0} t\\,W_{1/t} = 0 \\quad \\text{majdnem biztosan}."),
    p("Az időinverzió felcseréli a pálya $t = 0$ körüli viselkedését a $t \\to \\infty$ melletti viselkedésével: az egyik végre vonatkozó minden állítás állítást ad a másikról is."),
    p("Az ábra egyszerre egy transzformációt alkalmaz friss Brown-pályákra, és 8 transzformált pályát rajzol a $t \\in [0, 1]$ intervallumon, a $\\pm\\sqrt{t}$ és $\\pm 2\\sqrt{t}$ görbékkel együtt. Válaszd a skálázást, és mozgasd $c$-t 0,25 és 4 között; válaszd az időinverziót, a szimmetriát vagy az időeltolást, és mozgasd $s$-et 0 és 2 között; közben nyomd meg az „Új pályák” gombot. A 2000 pályából számolt kijelzők szerint $X_1$ mintavarianciája 1 közelében, $(X_{0{,}5}, X_1)$ mintakovarianciája pedig $\\min(0{,}5;\\ 1) = 0{,}5$ közelében marad, bármelyik transzformációt választod is."),
    figure("bm-transformations"),

    {
      kind: "check",
      id: "brownian-properties/which-is-bm",
      prompt: "Az alábbi folyamatok közül melyik standard Brown-mozgás?",
      answer: {
        type: "choice",
        options: ["$X_t = W_{2t}$", "$X_t = t\\,W_{1/t}$, ha $t > 0$, és $X_0 = 0$", "$X_t = \\sqrt{t}\\,W_1$", "$X_t = W_t^2 - t$"],
        correct: 1,
      },
      explain: "$t\\,W_{1/t}$ centrált Gauss-folyamat $\\min(s,t)$ kovarianciával, és 0-ban folytonos. $W_{2t}$ varianciája $2t$; $\\sqrt{t}\\,W_1$ kovarianciája $\\sqrt{st} \\ne \\min(s,t)$, így a növekményei nem függetlenek; $W_t^2 - t$ pedig nem Gauss-eloszlású.",
    },

    h("Kidolgozott példa"),
    p("Számítsuk ki $\\mathbb{P}(W_1 > 0,\\ W_2 > 0)$ értékét. A $(W_1, W_2)$ pár kétdimenziós normális, varianciái 1 és 2, kovarianciája $\\min(1,2) = 1$, így korrelációja $\\rho = 1/\\sqrt{2} \\approx 0{,}7071$. Centrált kétdimenziós normális párnál annak valószínűsége, hogy mindkét koordináta pozitív, $\\tfrac14 + \\arcsin(\\rho)/(2\\pi)$, tehát"),
    eq("\\mathbb{P}(W_1 > 0,\\ W_2 > 0) = \\frac14 + \\frac{\\arcsin(1/\\sqrt{2})}{2\\pi} = \\frac14 + \\frac{\\pi/4}{2\\pi} = \\frac38 = 0{,}375."),
    p("Független előjelek esetén $0{,}25$ jönne ki; a többlet $0{,}125$ abból ered, hogy a két érték a $[0, 1]$ szakaszon közös."),

    h("Pályatulajdonságok"),
    p("Az invarianciákból a következő majdnem biztos tulajdonságok adódnak. Tételként mondjuk ki őket; a bizonyítások bármely Brown-mozgásról szóló tankönyvben megtalálhatók."),
    list(
      "**Iterált logaritmus tétele** (Hincsin): $\\limsup_{t \\to \\infty} W_t / \\sqrt{2t\\ln\\ln t} = 1$. Időinverzióval $\\limsup_{t \\downarrow 0} W_t / \\sqrt{2t\\ln\\ln(1/t)} = 1$ is teljesül.",
      "**Rekurrencia**: az iterált logaritmus tételéből és a szimmetriából $\\limsup_{t\\to\\infty} W_t = +\\infty$ és $\\liminf_{t\\to\\infty} W_t = -\\infty$. A pályák folytonossága miatt $W$ minden $a \\in \\mathbb{R}$ szintet elér, mégpedig tetszőlegesen nagy időpontokban is. A $t = 0$ körüli változat szerint $W$ minden $[0, \\varepsilon]$ intervallumban végtelen sokszor visszatér 0-ba.",
      "**Sehol sem differenciálhatóság** (Paley, Wiener és Zygmund, 1933): egy valószínűséggel a $t \\mapsto W_t$ függvény egyetlen $t$ pontban sem differenciálható. A skálázás megmutatja, miért: $(W_{t+h} - W_t)/h \\sim N(0, 1/h)$, így bármely $K$ korlátra $\\mathbb{P}(|(W_{t+h} - W_t)/h| \\le K) = \\mathbb{P}(|Z| \\le K\\sqrt{h}) \\to 0$, ha $h \\downarrow 0$.",
    ),

    h("Kvadratikus és teljes változás"),
    p("Vegyük a $0 = t_0 < t_1 < \\cdots < t_n = t$ felosztásokat $\\delta_n = \\max_i (t_{i+1} - t_i) \\to 0$ finomsággal, legyen $\\Delta W_i = W_{t_{i+1}} - W_{t_i}$, $\\Delta t_i = t_{i+1} - t_i$ és $Q_n = \\sum_i (\\Delta W_i)^2$. A tétel szerint $Q_n \\to t$ az $L^2$ térben; ezt $[W]_t = t$ alakban írjuk. A bizonyítás rövid. Mivel a $\\Delta W_i \\sim N(0, \\Delta t_i)$ változók függetlenek, és $Z \\sim N(0, \\sigma^2)$ esetén $\\operatorname{Var}(Z^2) = 2\\sigma^4$,"),
    eq("\\mathbb{E}[Q_n] = \\sum_i \\Delta t_i = t, \\qquad \\operatorname{Var}(Q_n) = \\sum_i 2\\,\\Delta t_i^2 \\le 2t\\,\\delta_n \\longrightarrow 0."),
    p("Tehát $\\mathbb{E}[(Q_n - t)^2] \\to 0$. (Diadikus felosztások mentén a konvergencia majdnem biztos is.) A **teljes változás** ezért végtelen: $Q_n \\le \\max_i |\\Delta W_i| \\cdot \\sum_i |\\Delta W_i|$, és a pálya $[0, t]$-n vett egyenletes folytonossága miatt $\\max_i |\\Delta W_i| \\to 0$, így $\\sum_i |\\Delta W_i| \\to \\infty$ egy olyan részsorozat mentén, amelyen $Q_n \\to t$ majdnem biztosan. Egy sima függvény teljes változása véges, kvadratikus variációja nulla; a Brown-mozgásnál éppen fordítva van. Ezért nem definiálható a $\\int H\\,dW$ pályánként, közönséges Stieltjes-integrálként."),

    {
      kind: "check",
      id: "brownian-properties/qv-variance",
      prompt: "Osszuk a $[0, 1]$ intervallumot $n = 100$ egyenlő lépésre. Mennyi $\\operatorname{Var}\\big(\\sum_i (\\Delta W_i)^2\\big)$?",
      answer: { type: "number", value: 0.02, tolerance: 0.0005 },
      explain: "Minden tag varianciája $2\\,\\Delta t^2 = 2 \\times 0{,}01^2 = 0{,}0002$, és 100 független tag van: $100 \\times 0{,}0002 = 0{,}02 = 2/n$. A várható érték 1, így az összeg az $[W]_1 = 1$ érték körül koncentrálódik.",
    },

    h("Markov- és erős Markov-tulajdonság"),
    p("Az időeltolási invariancia a **Markov-tulajdonságot** fejezi ki: minden rögzített $s \\ge 0$ esetén a $(W_{s+t} - W_s)_{t \\ge 0}$ folyamat $\\mathcal{F}_s$-től független Brown-mozgás. Ezzel ekvivalens, hogy korlátos, mérhető $f$ esetén $\\mathbb{E}[f(W_{s+t}) \\mid \\mathcal{F}_s] = g(W_s)$, ahol $g(x) = \\mathbb{E}[f(x + W_t)]$: az előrejelzés a múlttól csak a jelenlegi értéken keresztül függ."),
    p("Az **erős Markov-tulajdonság** (Hunt, 1956) szerint a rögzített $s$ időpont helyére $\\tau$ megállási idő is írható: a $\\{\\tau < \\infty\\}$ eseményen a $(W_{\\tau+t} - W_\\tau)_{t \\ge 0}$ folyamat $\\mathcal{F}_\\tau$-tól független Brown-mozgás. Gondolj rá újraindítási szabályként: ha csak az addig elérhető információ alapján állsz meg, ami ezután jön, az egy friss Brown-mozgás. A jövőbe tekintő véletlen időpontra, például a $[0, 1]$-en vett maximum időpontjára ez nem igaz. A következő lecke az erős Markov-tulajdonságot abban az időpontban használja, amikor a pálya először elér egy szintet."),

    h("Összefoglalás"),
    list(
      "Brown-mozgás: $W_0 = 0$, független növekmények, $W_t - W_s \\sim N(0, t-s)$, folytonos pályák; ekvivalensen folytonos, centrált Gauss-folyamat $\\operatorname{Cov}(W_s, W_t) = \\min(s,t)$ kovarianciával.",
      "A $-W_t$ szimmetria, a $c^{-1/2}W_{ct}$ skálázás, a $W_{s+t} - W_s$ időeltolás és a $t\\,W_{1/t}$ időinverzió ismét Brown-mozgás; az időinverzióból $W_t/t \\to 0$ következik.",
      "A pályák rekurrensek, teljesül rájuk az iterált logaritmus tétele, és sehol sem differenciálhatók.",
      "A kvadratikus variáció $[W]_t = t$, a teljes változás végtelen.",
      "Markov-tulajdonság rögzített időpontokban, erős Markov-tulajdonság megállási időkben.",
    ),
    lab("/stochastic-models/covariance", "Becsüld meg a Brown-mozgás kovarianciáját szimulált pályákból a Sztochasztikus modellek stúdióban"),
  ],
};
