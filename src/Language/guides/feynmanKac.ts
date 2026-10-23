import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const feynmanKac: GuideLessonContent = {
  en: [
    p("A price can be written as a discounted expectation, as in \"Change of measure and Girsanov's theorem\", or as the solution of a partial differential equation. This lesson proves that the two descriptions agree. It uses Itô's formula from \"Itô's lemma\", the martingale property of the integral from \"The Itô integral\" and conditional expectations from \"Conditional expectation and martingales\"."),

    h("Diffusions and their generator"),
    p("Let $X$ solve the stochastic differential equation"),
    eq("dX_s = \\mu(X_s)\\,ds + \\sigma(X_s)\\,dW_s,"),
    p("where $W$ is a Brownian motion and the coefficients $\\mu, \\sigma : \\mathbb{R} \\to \\mathbb{R}$ are Lipschitz continuous. Under this assumption the equation has a unique solution for every starting point, and $X$ is a Markov process: given $X_t$, the future of $X$ does not depend on the earlier path. Write $\\mathbb{E}_{t,x}[\\,\\cdot\\,] = \\mathbb{E}[\\,\\cdot \\mid X_t = x]$."),
    p("The **generator** of $X$ is the operator that gives the expected rate of change of $f(X)$ at a point. For twice continuously differentiable $f$ with compact support,"),
    eq("\\mathcal{L}f(x) = \\lim_{h \\downarrow 0} \\frac{\\mathbb{E}_{0,x}[f(X_h)] - f(x)}{h}."),
    p("Itô's lemma computes it. Integrating $df(X_s)$ over $[0, h]$,"),
    eq("f(X_h) = f(x) + \\int_0^h \\Big(\\mu f' + \\tfrac12 \\sigma^2 f''\\Big)(X_s)\\,ds + \\int_0^h \\sigma(X_s) f'(X_s)\\,dW_s."),
    p("The integrand $\\sigma f'$ is bounded on the support of $f$, so the Itô integral has mean zero. Taking expectations, dividing by $h$ and letting $h \\to 0$ (the $ds$-integrand is continuous) gives"),
    eq("\\mathcal{L}f(x) = \\mu(x)\\,f'(x) + \\tfrac12\\,\\sigma^2(x)\\,f''(x)."),
    p("The drift contributes a first-derivative term and the diffusion a second-derivative term; the $\\tfrac12\\sigma^2$ is the Itô correction. Examples: Brownian motion with volatility $\\sigma$ has $\\mathcal{L} = \\tfrac12\\sigma^2\\,\\partial_{xx}$; geometric Brownian motion under $\\mathbb{Q}$ has $\\mathcal{L}f = rx\\,f' + \\tfrac12\\sigma^2 x^2 f''$. The same computation without the limit gives **Dynkin's formula**, $\\mathbb{E}_{0,x}[f(X_t)] = f(x) + \\mathbb{E}_{0,x}\\big[\\int_0^t \\mathcal{L}f(X_s)\\,ds\\big]$."),

    {
      kind: "check",
      id: "feynman-kac/generator",
      prompt: "The Ornstein–Uhlenbeck process solves $dX_s = -\\kappa X_s\\,ds + \\sigma\\,dW_s$. What is its generator?",
      answer: {
        type: "choice",
        options: [
          "$\\mathcal{L}f = -\\kappa x\\,f' + \\tfrac12\\sigma^2 f''$",
          "$\\mathcal{L}f = -\\kappa x\\,f' + \\sigma f''$",
          "$\\mathcal{L}f = -\\kappa f' + \\tfrac12\\sigma^2 x^2 f''$",
          "$\\mathcal{L}f = -\\kappa x\\,f' + \\tfrac12\\sigma^2 f'' - \\kappa f$",
        ],
        correct: 0,
      },
      explain: "With $\\mu(x) = -\\kappa x$ and $\\sigma(x) = \\sigma$, the formula $\\mathcal{L}f = \\mu f' + \\tfrac12\\sigma^2 f''$ gives $-\\kappa x\\,f' + \\tfrac12\\sigma^2 f''$. A zero-order term such as $-\\kappa f$ only appears when there is discounting.",
    },

    h("The Kolmogorov backward equation"),
    p("Fix a horizon $T$ and a payoff function $g$, and define $v(t, x) = \\mathbb{E}_{t,x}[g(X_T)]$. By the Markov property, $v(s, X_s) = \\mathbb{E}[g(X_T) \\mid \\mathcal{F}_s]$ for $t \\le s \\le T$, so $s \\mapsto v(s, X_s)$ is a martingale. If $v$ is once differentiable in $t$ and twice in $x$, Itô's lemma gives"),
    eq("dv(s, X_s) = \\big(\\partial_s v + \\mathcal{L}v\\big)(s, X_s)\\,ds + \\sigma(X_s)\\,\\partial_x v(s, X_s)\\,dW_s."),
    p("A continuous martingale whose $ds$-part is not identically zero cannot exist, since a process of finite variation that is also a continuous martingale is constant. So the $ds$-term must vanish, which gives the **Kolmogorov backward equation**"),
    eq("\\partial_t v + \\mathcal{L}v = 0 \\quad \\text{on } [0, T) \\times \\mathbb{R}, \\qquad v(T, x) = g(x)."),
    p("It runs backwards: the terminal condition is given at $T$ and the equation is solved towards $t = 0$. If $X$ has a transition density $p(t, x; T, y)$, that density solves the backward equation in $(t, x)$, and in the forward variables $(T, y)$ it solves the **Kolmogorov forward** (Fokker–Planck) **equation**"),
    eq("\\partial_T p = -\\partial_y\\big(\\mu(y)\\,p\\big) + \\tfrac12\\,\\partial_{yy}\\big(\\sigma^2(y)\\,p\\big)."),
    p("The backward equation describes how an expected payoff depends on the starting point; the forward equation describes how probability mass spreads out from a fixed starting point."),

    h("The Feynman–Kac theorem"),
    p("Add a discount rate $r(x) \\ge 0$, continuous. **Theorem (Feynman–Kac).** Let $\\mu, \\sigma$ be Lipschitz and let $u(t, x)$, once continuously differentiable in $t$ and twice in $x$, solve"),
    eq("\\partial_t u + \\mu(x)\\,\\partial_x u + \\tfrac12\\sigma^2(x)\\,\\partial_{xx} u - r(x)\\,u = 0 \\quad \\text{on } [0, T) \\times \\mathbb{R}, \\qquad u(T, x) = g(x)."),
    p("Assume also that $\\mathbb{E}_{t,x}\\big[\\int_t^T \\big(\\sigma(X_s)\\,\\partial_x u(s, X_s)\\big)^2 ds\\big] < \\infty$, which holds, for example, if $\\sigma\\,\\partial_x u$ is bounded. Then"),
    eq("u(t, x) = \\mathbb{E}_{t,x}\\!\\left[ e^{-\\int_t^T r(X_s)\\,ds}\\, g(X_T) \\right]."),
    p("**Proof.** Fix $(t, x)$ and set $D_s = e^{-\\int_t^s r(X_v)\\,dv}$ and $Y_s = D_s\\,u(s, X_s)$ for $s \\in [t, T]$. The factor $D$ has finite variation, $dD_s = -r(X_s)\\,D_s\\,ds$, so the product rule has no cross term. With Itô's lemma for $u(s, X_s)$,"),
    eq("dY_s = D_s\\big(\\partial_s u + \\mathcal{L}u - r u\\big)(s, X_s)\\,ds + D_s\\,\\sigma(X_s)\\,\\partial_x u(s, X_s)\\,dW_s = D_s\\,\\sigma(X_s)\\,\\partial_x u(s, X_s)\\,dW_s."),
    p("The $ds$-term is zero because $u$ solves the equation. Since $0 < D_s \\le 1$, the integrability assumption makes $Y$ an Itô integral of an $\\mathcal{L}^2$ integrand, hence a martingale. Therefore $u(t, x) = Y_t = \\mathbb{E}_{t,x}[Y_T] = \\mathbb{E}_{t,x}\\big[D_T\\,g(X_T)\\big]$, using $u(T, \\cdot) = g$. $\\square$"),
    p("The proof also shows uniqueness: two solutions in the integrability class equal the same expectation. The converse direction, that the expectation is smooth enough to solve the equation, needs more, for example smooth coefficients and $\\sigma$ bounded away from zero; under such conditions the expectation is the solution. Think of $u(s, X_s)$ as a fair value carried along the path: discounted, it neither drifts up nor down, so its value today is the expected discounted value at maturity."),
    note("Feynman–Kac: the solution of $\\partial_t u + \\mathcal{L}u - ru = 0$, $u(T, \\cdot) = g$, is $u(t, x) = \\mathbb{E}_{t,x}\\big[e^{-\\int_t^T r(X_s)ds} g(X_T)\\big]$. The proof is Itô's lemma plus the fact that a $dW$-integral is a martingale."),

    h("The heat equation"),
    p("Take $\\mu = 0$, constant $\\sigma$ and $r = 0$. Then $X_T = x + \\sigma(W_T - W_t)$, and with the time to maturity $\\tau = T - t$ the theorem reads"),
    eq("\\partial_\\tau u = \\tfrac12\\sigma^2\\,\\partial_{xx} u, \\quad u(0, x) = g(x) \\qquad \\Longrightarrow \\qquad u(\\tau, x) = \\mathbb{E}\\big[g(x + \\sigma W_\\tau)\\big] = \\int_{\\mathbb{R}} g(y)\\,\\frac{1}{\\sqrt{2\\pi\\sigma^2\\tau}}\\,e^{-\\frac{(y - x)^2}{2\\sigma^2\\tau}}\\,dy."),
    p("This is the heat equation, and the solution is the payoff smoothed by a Gaussian kernel of variance $\\sigma^2\\tau$. Differentiating the kernel confirms that it solves the equation. Three payoffs have closed forms, with $s = \\sigma\\sqrt{\\tau}$ and $d = (x - 1)/s$:"),
    list(
      "Square, $g(x) = x^2$: $u = x^2 + \\sigma^2\\tau$. Check: $\\partial_\\tau u = \\sigma^2$ and $\\tfrac12\\sigma^2\\,\\partial_{xx}u = \\tfrac12\\sigma^2 \\cdot 2 = \\sigma^2$.",
      "Digital, $g(x) = \\mathbf{1}\\{x > 1\\}$: $u = \\Phi(d)$, the probability that $x + \\sigma W_\\tau$ ends above 1.",
      "Call, $g(x) = (x - 1)^+$: $u = (x - 1)\\,\\Phi(d) + s\\,\\varphi(d)$, the Bachelier price with zero interest.",
    ),
    p("Worked numbers at $x = 1$ with $\\tau = 0.5$ and $\\sigma = 1$, so $s = \\sqrt{0.5} \\approx 0.7071$ and $d = 0$: the call is worth $s\\,\\varphi(0) = 0.7071 \\times 0.3989 \\approx 0.2821$, the digital $\\Phi(0) = 0.5$, the square $1 + 0.5 = 1.5$. A Monte Carlo estimate from 2000 draws of $W_\\tau$ has standard error equal to the payoff's standard deviation over $\\sqrt{2000}$: about $0.4128/44.72 \\approx 0.0092$ for the call, $0.5/44.72 \\approx 0.0112$ for the digital and $\\sqrt{2.5}/44.72 \\approx 0.0354$ for the square."),
    p("The figure solves this heat equation for the chosen payoff: call $(x - 1)^+$, digital $\\mathbf{1}\\{x > 1\\}$ or square $x^2$. Against $x$ from $-2$ to $4$ it plots the payoff $g$ (dashed), the exact solution $u(\\tau, x)$ from the Gaussian integral (line), and Monte Carlo estimates at 13 points $x$ from 2000 draws each (dots). Increase $\\tau$ or $\\sigma$ and note that the kink of the call and the jump of the digital are smoothed out more, while the square is shifted up by $\\sigma^2\\tau$. The dots stay on the line within sampling noise. The readouts at $x = 1$ give the exact $u$, the Monte Carlo estimate and its standard error."),
    figure("feynman-kac"),

    {
      kind: "check",
      id: "feynman-kac/heat-square",
      prompt: "Solve $\\partial_\\tau u = \\tfrac12\\sigma^2\\,\\partial_{xx} u$ with $u(0, x) = x^2$, $\\sigma = 0.5$. What is $u(\\tau, x)$ at $\\tau = 2$, $x = 2$?",
      answer: { type: "number", value: 4.5, tolerance: 0.01 },
      explain: "By Feynman–Kac, $u = \\mathbb{E}[(x + \\sigma W_\\tau)^2] = x^2 + \\sigma^2\\tau = 4 + 0.25 \\times 2 = 4.5$.",
    },

    h("The Black–Scholes equation"),
    p("By \"Change of measure and Girsanov's theorem\", under $\\mathbb{Q}$ the stock follows $dS_s = rS_s\\,ds + \\sigma S_s\\,d\\tilde W_s$ with constant $r$ and $\\sigma$, and the price of a payoff $g(S_T)$ is $V(t, S) = \\mathbb{E}^{\\mathbb{Q}}_{t,S}\\big[e^{-r(T - t)} g(S_T)\\big]$. This is a Feynman–Kac expectation with $\\mu(S) = rS$, $\\sigma(S) = \\sigma S$ and constant discount rate $r$, so $V$ solves the **Black–Scholes equation**"),
    eq("\\frac{\\partial V}{\\partial t} + rS\\,\\frac{\\partial V}{\\partial S} + \\frac{1}{2}\\sigma^2 S^2\\,\\frac{\\partial^2 V}{\\partial S^2} - rV = 0, \\qquad V(T, S) = g(S)."),
    p("For a call, $g(S) = (S - K)^+$, and the expectation is the formula of \"The Black–Scholes formula\". The real-world drift $\\mu$ does not appear anywhere, because the generator is taken under $\\mathbb{Q}$. The substitution $x = \\ln S$ turns the generator into $(r - \\tfrac12\\sigma^2)\\,\\partial_x + \\tfrac12\\sigma^2\\,\\partial_{xx}$, which has constant coefficients; after removing the drift and the discounting the equation becomes the heat equation, which is why the Black–Scholes formula is built from the normal CDF $N(\\cdot)$."),
    p("Numerical check with $S = K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$: the call price is $C = 10.4506$ with $\\Delta = N(d_1) = 0.6368$, $\\Gamma = 0.018762$ and $\\partial C/\\partial t = -6.4140$. The terms of the equation are $-6.4140 + 3.1842 + 3.7524 - 0.5225 = 0.0001$, zero up to rounding."),

    {
      kind: "check",
      id: "feynman-kac/bs-theta",
      prompt: "In the Black–Scholes model with $S = 100$, $r = 5\\%$, $\\sigma = 20\\%$, a call has $C = 10.4506$, $\\Delta = 0.6368$ and $\\Gamma = 0.018762$. Use the Black–Scholes equation to find $\\partial C/\\partial t$ (per year).",
      answer: { type: "number", value: -6.414, tolerance: 0.01 },
      explain: "$\\partial C/\\partial t = rC - rS\\Delta - \\tfrac12\\sigma^2 S^2\\Gamma = 0.5225 - 3.1840 - 3.7524 \\approx -6.414$. The option loses value as time passes, at a rate fixed by its delta and gamma.",
    },

    h("Two ways to compute one number"),
    p("Feynman–Kac gives two routes to the same price. The **Monte Carlo** route simulates many paths of $X$ under $\\mathbb{Q}$, averages the discounted payoffs and reports a standard error that falls like $1/\\sqrt{N}$ in the number of paths, whatever the dimension of $X$. The **PDE** route discretises $x$ and $t$ on a grid and steps the equation backwards from $u(T, \\cdot) = g$ with finite differences; one solve gives $u$ at every grid point, and the Greeks come from differences of neighbouring values, but the grid grows exponentially with the dimension of $X$. In practice PDE methods dominate for one to three state variables and Monte Carlo for more. Any difference between the two answers is numerical error, sampling error on one side and grid error on the other, not a difference in the model."),

    {
      kind: "worked",
      title: "The square payoff at x = 1",
      steps: [
        { text: "With $\\sigma = 1$ and $\\tau = 0.5$, the Gaussian kernel has variance $\\sigma^2\\tau$.", tex: "\\mathbb{E}[(\\sigma W_\\tau)^2] = \\sigma^2\\tau", result: { value: 0.5, tolerance: 0.001 } },
        { text: "Expand $(x + \\sigma W_\\tau)^2$; the cross term has mean zero.", tex: "u(\\tau, 1) = 1^2 + 2 \\cdot 1 \\cdot 0 + 0.5", result: { value: 1.5, tolerance: 0.001 } },
        { text: "The figure's Monte Carlo readout at $x = 1$ should sit within one standard error of this: the payoff variance is 2.5, over 2000 draws.", tex: "\\sqrt{2.5}/\\sqrt{2000}", result: { value: 0.0354, tolerance: 0.0001 } },
      ],
    },

    h("Summary"),
    list(
      "A diffusion $dX = \\mu(X)\\,ds + \\sigma(X)\\,dW$ has generator $\\mathcal{L}f = \\mu f' + \\tfrac12\\sigma^2 f''$, computed from Itô's lemma.",
      "$v(t, x) = \\mathbb{E}_{t,x}[g(X_T)]$ solves the Kolmogorov backward equation $\\partial_t v + \\mathcal{L}v = 0$, $v(T, \\cdot) = g$; transition densities solve the forward equation in $(T, y)$.",
      "Feynman–Kac: the solution of $\\partial_t u + \\mathcal{L}u - ru = 0$, $u(T, \\cdot) = g$, is the discounted expectation of $g(X_T)$. Proof: the discounted value $e^{-\\int r}u(s, X_s)$ has no drift, so it is a martingale.",
      "With $\\mu = 0$, constant $\\sigma$ and $r = 0$ it is the heat equation, solved by Gaussian smoothing of the payoff. Under $\\mathbb{Q}$ with GBM it is the Black–Scholes equation.",
      "Monte Carlo and finite-difference pricing compute the same number from the two sides of the theorem.",
    ),
    note("The next lesson, \"Monte Carlo option pricing\", takes the expectation side: it simulates terminal prices under $\\mathbb{Q}$ and studies the standard error of the average."),
    lab("/black-scholes", "Explore how the solution of the Black–Scholes equation depends on S, σ and T in the Black–Scholes lab"),
  ],

  hu: [
    p("Egy ár felírható diszkontált várható értékként, ahogy a „Mértékcsere és a Girsanov-tétel” című leckében, vagy egy parciális differenciálegyenlet megoldásaként. Ez a lecke bebizonyítja, hogy a két leírás ugyanazt adja. Felhasználja „Az Itô-lemma” Itô-formuláját, „Az Itô-integrál” martingáltulajdonságát és a „Feltételes várható érték és martingálok” feltételes várható értékeit."),

    h("Diffúziók és generátoruk"),
    p("Legyen $X$ a következő sztochasztikus differenciálegyenlet megoldása:"),
    eq("dX_s = \\mu(X_s)\\,ds + \\sigma(X_s)\\,dW_s,"),
    p("ahol $W$ Brown-mozgás, a $\\mu, \\sigma : \\mathbb{R} \\to \\mathbb{R}$ együtthatók pedig Lipschitz-folytonosak. Ekkor az egyenletnek minden kezdőpontból egyértelmű megoldása van, és $X$ Markov-folyamat: $X_t$ ismeretében $X$ jövője nem függ a korábbi pályától. Jelölje $\\mathbb{E}_{t,x}[\\,\\cdot\\,] = \\mathbb{E}[\\,\\cdot \\mid X_t = x]$."),
    p("$X$ **generátora** az az operátor, amely megadja $f(X)$ várható változási ütemét egy pontban. Kétszer folytonosan differenciálható, kompakt tartójú $f$-re"),
    eq("\\mathcal{L}f(x) = \\lim_{h \\downarrow 0} \\frac{\\mathbb{E}_{0,x}[f(X_h)] - f(x)}{h}."),
    p("Ezt az Itô-lemmával számolhatjuk ki. A $df(X_s)$ differenciált a $[0, h]$ intervallumon integrálva"),
    eq("f(X_h) = f(x) + \\int_0^h \\Big(\\mu f' + \\tfrac12 \\sigma^2 f''\\Big)(X_s)\\,ds + \\int_0^h \\sigma(X_s) f'(X_s)\\,dW_s."),
    p("A $\\sigma f'$ integrandus korlátos $f$ tartóján, így az Itô-integrál várható értéke nulla. Várható értéket véve, $h$-val osztva és $h \\to 0$ határátmenettel (a $ds$-integrandus folytonos)"),
    eq("\\mathcal{L}f(x) = \\mu(x)\\,f'(x) + \\tfrac12\\,\\sigma^2(x)\\,f''(x)."),
    p("A drift elsőrendű, a diffúzió másodrendű deriválttagot ad; a $\\tfrac12\\sigma^2$ az Itô-korrekció. Példák: a $\\sigma$ volatilitású Brown-mozgásra $\\mathcal{L} = \\tfrac12\\sigma^2\\,\\partial_{xx}$; a geometriai Brown-mozgásra $\\mathbb{Q}$ alatt $\\mathcal{L}f = rx\\,f' + \\tfrac12\\sigma^2 x^2 f''$. Ugyanez a számolás határátmenet nélkül a **Dynkin-formulát** adja: $\\mathbb{E}_{0,x}[f(X_t)] = f(x) + \\mathbb{E}_{0,x}\\big[\\int_0^t \\mathcal{L}f(X_s)\\,ds\\big]$."),

    {
      kind: "check",
      id: "feynman-kac/generator",
      prompt: "Az Ornstein–Uhlenbeck-folyamat a $dX_s = -\\kappa X_s\\,ds + \\sigma\\,dW_s$ egyenlet megoldása. Mi a generátora?",
      answer: {
        type: "choice",
        options: [
          "$\\mathcal{L}f = -\\kappa x\\,f' + \\tfrac12\\sigma^2 f''$",
          "$\\mathcal{L}f = -\\kappa x\\,f' + \\sigma f''$",
          "$\\mathcal{L}f = -\\kappa f' + \\tfrac12\\sigma^2 x^2 f''$",
          "$\\mathcal{L}f = -\\kappa x\\,f' + \\tfrac12\\sigma^2 f'' - \\kappa f$",
        ],
        correct: 0,
      },
      explain: "$\\mu(x) = -\\kappa x$ és $\\sigma(x) = \\sigma$ mellett az $\\mathcal{L}f = \\mu f' + \\tfrac12\\sigma^2 f''$ képlet $-\\kappa x\\,f' + \\tfrac12\\sigma^2 f''$-t ad. Nulladrendű tag, például $-\\kappa f$, csak diszkontálás esetén jelenik meg.",
    },

    h("A Kolmogorov-féle visszafelé egyenlet"),
    p("Rögzítsünk egy $T$ időhorizontot és egy $g$ kifizetésfüggvényt, és legyen $v(t, x) = \\mathbb{E}_{t,x}[g(X_T)]$. A Markov-tulajdonság miatt $t \\le s \\le T$ esetén $v(s, X_s) = \\mathbb{E}[g(X_T) \\mid \\mathcal{F}_s]$, tehát $s \\mapsto v(s, X_s)$ martingál. Ha $v$ $t$-ben egyszer, $x$-ben kétszer differenciálható, az Itô-lemma szerint"),
    eq("dv(s, X_s) = \\big(\\partial_s v + \\mathcal{L}v\\big)(s, X_s)\\,ds + \\sigma(X_s)\\,\\partial_x v(s, X_s)\\,dW_s."),
    p("Nem létezhet olyan folytonos martingál, amelynek $ds$-része nem azonosan nulla, mert egy korlátos változású folyamat, amely egyben folytonos martingál, konstans. A $ds$-tagnak tehát el kell tűnnie, és ez a **Kolmogorov-féle visszafelé egyenlet**:"),
    eq("\\partial_t v + \\mathcal{L}v = 0 \\quad \\text{a } [0, T) \\times \\mathbb{R} \\text{ halmazon}, \\qquad v(T, x) = g(x)."),
    p("Az egyenlet visszafelé halad: a végfeltétel $T$-ben adott, és $t = 0$ felé oldjuk meg. Ha $X$-nek van $p(t, x; T, y)$ átmenetisűrűsége, az $(t, x)$-ben a visszafelé egyenletet teljesíti, a $(T, y)$ előre mutató változókban pedig a **Kolmogorov-féle előre** (Fokker–Planck-) **egyenletet**:"),
    eq("\\partial_T p = -\\partial_y\\big(\\mu(y)\\,p\\big) + \\tfrac12\\,\\partial_{yy}\\big(\\sigma^2(y)\\,p\\big)."),
    p("A visszafelé egyenlet azt írja le, hogyan függ egy várható kifizetés a kezdőponttól; az előre egyenlet azt, hogyan terül szét a valószínűségi tömeg egy rögzített kezdőpontból."),

    h("A Feynman–Kac-tétel"),
    p("Vegyünk hozzá egy folytonos $r(x) \\ge 0$ diszkontrátát. **Tétel (Feynman–Kac).** Legyenek $\\mu, \\sigma$ Lipschitz-folytonosak, és $u(t, x)$, amely $t$-ben egyszer, $x$-ben kétszer folytonosan differenciálható, oldja meg a"),
    eq("\\partial_t u + \\mu(x)\\,\\partial_x u + \\tfrac12\\sigma^2(x)\\,\\partial_{xx} u - r(x)\\,u = 0 \\quad \\text{a } [0, T) \\times \\mathbb{R} \\text{ halmazon}, \\qquad u(T, x) = g(x)"),
    p("feladatot. Tegyük fel továbbá, hogy $\\mathbb{E}_{t,x}\\big[\\int_t^T \\big(\\sigma(X_s)\\,\\partial_x u(s, X_s)\\big)^2 ds\\big] < \\infty$, ami teljesül például akkor, ha $\\sigma\\,\\partial_x u$ korlátos. Ekkor"),
    eq("u(t, x) = \\mathbb{E}_{t,x}\\!\\left[ e^{-\\int_t^T r(X_s)\\,ds}\\, g(X_T) \\right]."),
    p("**Bizonyítás.** Rögzítsük $(t, x)$-et, és legyen $s \\in [t, T]$ esetén $D_s = e^{-\\int_t^s r(X_v)\\,dv}$ és $Y_s = D_s\\,u(s, X_s)$. A $D$ tényező korlátos változású, $dD_s = -r(X_s)\\,D_s\\,ds$, így a szorzatszabályban nincs vegyes tag. Az $u(s, X_s)$-re alkalmazott Itô-lemmával"),
    eq("dY_s = D_s\\big(\\partial_s u + \\mathcal{L}u - r u\\big)(s, X_s)\\,ds + D_s\\,\\sigma(X_s)\\,\\partial_x u(s, X_s)\\,dW_s = D_s\\,\\sigma(X_s)\\,\\partial_x u(s, X_s)\\,dW_s."),
    p("A $ds$-tag nulla, mert $u$ megoldja az egyenletet. Mivel $0 < D_s \\le 1$, az integrálhatósági feltétel miatt $Y$ egy $\\mathcal{L}^2$-beli integrandus Itô-integrálja, tehát martingál. Így $u(t, x) = Y_t = \\mathbb{E}_{t,x}[Y_T] = \\mathbb{E}_{t,x}\\big[D_T\\,g(X_T)\\big]$, felhasználva, hogy $u(T, \\cdot) = g$. $\\square$"),
    p("A bizonyítás az egyértelműséget is megadja: az integrálhatósági osztályba eső két megoldás ugyanazzal a várható értékkel egyenlő. A fordított irányhoz, hogy a várható érték elég sima ahhoz, hogy megoldja az egyenletet, több kell, például sima együtthatók és nullától elválasztott $\\sigma$; ilyen feltételek mellett a várható érték a megoldás. Gondoljunk $u(s, X_s)$-re úgy, mint a pálya mentén vitt igazságos értékre: diszkontálva sem fel, sem le nem sodródik, ezért mai értéke a lejáratkori diszkontált érték várható értéke."),
    note("Feynman–Kac: a $\\partial_t u + \\mathcal{L}u - ru = 0$, $u(T, \\cdot) = g$ feladat megoldása $u(t, x) = \\mathbb{E}_{t,x}\\big[e^{-\\int_t^T r(X_s)ds} g(X_T)\\big]$. A bizonyítás az Itô-lemma, plusz az, hogy egy $dW$ szerinti integrál martingál."),

    h("A hővezetési egyenlet"),
    p("Legyen $\\mu = 0$, $\\sigma$ konstans és $r = 0$. Ekkor $X_T = x + \\sigma(W_T - W_t)$, és a $\\tau = T - t$ hátralévő futamidővel a tétel így szól:"),
    eq("\\partial_\\tau u = \\tfrac12\\sigma^2\\,\\partial_{xx} u, \\quad u(0, x) = g(x) \\qquad \\Longrightarrow \\qquad u(\\tau, x) = \\mathbb{E}\\big[g(x + \\sigma W_\\tau)\\big] = \\int_{\\mathbb{R}} g(y)\\,\\frac{1}{\\sqrt{2\\pi\\sigma^2\\tau}}\\,e^{-\\frac{(y - x)^2}{2\\sigma^2\\tau}}\\,dy."),
    p("Ez a hővezetési egyenlet, a megoldás pedig a kifizetés $\\sigma^2\\tau$ varianciájú Gauss-maggal simított változata. A mag deriválásával ellenőrizhető, hogy megoldja az egyenletet. Három kifizetésnek zárt alakja van, $s = \\sigma\\sqrt{\\tau}$ és $d = (x - 1)/s$ jelöléssel:"),
    list(
      "Négyzet, $g(x) = x^2$: $u = x^2 + \\sigma^2\\tau$. Ellenőrzés: $\\partial_\\tau u = \\sigma^2$ és $\\tfrac12\\sigma^2\\,\\partial_{xx}u = \\tfrac12\\sigma^2 \\cdot 2 = \\sigma^2$.",
      "Digitális, $g(x) = \\mathbf{1}\\{x > 1\\}$: $u = \\Phi(d)$, annak valószínűsége, hogy $x + \\sigma W_\\tau$ 1 fölött végez.",
      "Call, $g(x) = (x - 1)^+$: $u = (x - 1)\\,\\Phi(d) + s\\,\\varphi(d)$, a nulla kamatú Bachelier-ár.",
    ),
    p("Számpélda $x = 1$-ben, $\\tau = 0{,}5$ és $\\sigma = 1$ mellett, így $s = \\sqrt{0{,}5} \\approx 0{,}7071$ és $d = 0$: a call értéke $s\\,\\varphi(0) = 0{,}7071 \\times 0{,}3989 \\approx 0{,}2821$, a digitálisé $\\Phi(0) = 0{,}5$, a négyzeté $1 + 0{,}5 = 1{,}5$. A $W_\\tau$ 2000 húzásából számolt Monte Carlo-becslés standard hibája a kifizetés szórása osztva $\\sqrt{2000}$-rel: a callnál kb. $0{,}4128/44{,}72 \\approx 0{,}0092$, a digitálisnál $0{,}5/44{,}72 \\approx 0{,}0112$, a négyzetnél $\\sqrt{2{,}5}/44{,}72 \\approx 0{,}0354$."),
    p("Az ábra ezt a hővezetési egyenletet oldja meg a választott kifizetésre: call $(x - 1)^+$, digitális $\\mathbf{1}\\{x > 1\\}$ vagy négyzet $x^2$. Az $x$ függvényében, $-2$-től $4$-ig mutatja a $g$ kifizetést (szaggatott), a Gauss-integrálból adódó pontos $u(\\tau, x)$ megoldást (vonal) és 13 $x$ pontban egy-egy 2000 húzásos Monte Carlo-becslést (pontok). Növeld $\\tau$-t vagy $\\sigma$-t, és figyeld meg, hogy a call töréspontja és a digitális ugrása egyre jobban kisimul, a négyzet pedig $\\sigma^2\\tau$-val feljebb tolódik. A pontok mintavételi zajon belül a vonalon maradnak. Az $x = 1$-beli kijelzők a pontos $u$-t, a Monte Carlo-becslést és annak standard hibáját mutatják."),
    figure("feynman-kac"),

    {
      kind: "check",
      id: "feynman-kac/heat-square",
      prompt: "Oldd meg a $\\partial_\\tau u = \\tfrac12\\sigma^2\\,\\partial_{xx} u$ egyenletet $u(0, x) = x^2$, $\\sigma = 0{,}5$ mellett! Mennyi $u(\\tau, x)$, ha $\\tau = 2$ és $x = 2$?",
      answer: { type: "number", value: 4.5, tolerance: 0.01 },
      explain: "A Feynman–Kac-tétel szerint $u = \\mathbb{E}[(x + \\sigma W_\\tau)^2] = x^2 + \\sigma^2\\tau = 4 + 0{,}25 \\times 2 = 4{,}5$.",
    },

    h("A Black–Scholes-egyenlet"),
    p("A „Mértékcsere és a Girsanov-tétel” szerint $\\mathbb{Q}$ alatt a részvény a $dS_s = rS_s\\,ds + \\sigma S_s\\,d\\tilde W_s$ egyenletet követi konstans $r$ és $\\sigma$ mellett, egy $g(S_T)$ kifizetés ára pedig $V(t, S) = \\mathbb{E}^{\\mathbb{Q}}_{t,S}\\big[e^{-r(T - t)} g(S_T)\\big]$. Ez egy Feynman–Kac-típusú várható érték $\\mu(S) = rS$, $\\sigma(S) = \\sigma S$ együtthatókkal és konstans $r$ diszkontrátával, ezért $V$ megoldja a **Black–Scholes-egyenletet**:"),
    eq("\\frac{\\partial V}{\\partial t} + rS\\,\\frac{\\partial V}{\\partial S} + \\frac{1}{2}\\sigma^2 S^2\\,\\frac{\\partial^2 V}{\\partial S^2} - rV = 0, \\qquad V(T, S) = g(S)."),
    p("Callra $g(S) = (S - K)^+$, és a várható érték „A Black–Scholes-képlet” című lecke képlete. A valós $\\mu$ drift sehol sem jelenik meg, mert a generátort $\\mathbb{Q}$ alatt vesszük. Az $x = \\ln S$ helyettesítés a generátort az $(r - \\tfrac12\\sigma^2)\\,\\partial_x + \\tfrac12\\sigma^2\\,\\partial_{xx}$ konstans együtthatós alakra hozza; a drift és a diszkontálás eltávolítása után az egyenlet a hővezetési egyenlet lesz, ezért épül a Black–Scholes-képlet az $N(\\cdot)$ normális eloszlásfüggvényre."),
    p("Numerikus ellenőrzés $S = K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$ mellett: a call ára $C = 10{,}4506$, $\\Delta = N(d_1) = 0{,}6368$, $\\Gamma = 0{,}018762$ és $\\partial C/\\partial t = -6{,}4140$. Az egyenlet tagjai: $-6{,}4140 + 3{,}1842 + 3{,}7524 - 0{,}5225 = 0{,}0001$, ami kerekítéstől eltekintve nulla."),

    {
      kind: "check",
      id: "feynman-kac/bs-theta",
      prompt: "A Black–Scholes-modellben $S = 100$, $r = 5\\%$, $\\sigma = 20\\%$ mellett egy call ára $C = 10{,}4506$, $\\Delta = 0{,}6368$ és $\\Gamma = 0{,}018762$. Határozd meg a Black–Scholes-egyenletből $\\partial C/\\partial t$ értékét (évre vetítve)!",
      answer: { type: "number", value: -6.414, tolerance: 0.01 },
      explain: "$\\partial C/\\partial t = rC - rS\\Delta - \\tfrac12\\sigma^2 S^2\\Gamma = 0{,}5225 - 3{,}1840 - 3{,}7524 \\approx -6{,}414$. Az opció az idő múlásával értéket veszít, a deltája és gammája által meghatározott ütemben.",
    },

    h("Egy szám két kiszámítási módja"),
    p("A Feynman–Kac-tétel két utat ad ugyanahhoz az árhoz. A **Monte Carlo**-út sok $X$-pályát szimulál $\\mathbb{Q}$ alatt, átlagolja a diszkontált kifizetéseket, és olyan standard hibát ad, amely a pályák $N$ számában $1/\\sqrt{N}$ ütemben csökken, $X$ dimenziójától függetlenül. A **PDE**-út rácsra bontja $x$-et és $t$-t, és véges differenciákkal $u(T, \\cdot) = g$-ből visszafelé lépteti az egyenletet; egyetlen megoldás minden rácspontban megadja $u$-t, a görögök pedig a szomszédos értékek különbségeiből jönnek, a rács viszont $X$ dimenziójával exponenciálisan nő. A gyakorlatban egy-három állapotváltozóig a PDE-módszerek, fölötte a Monte Carlo dominál. A két válasz közötti bármilyen eltérés numerikus hiba, az egyik oldalon mintavételi, a másikon rácshiba, nem a modell különbsége."),

    {
      kind: "worked",
      title: "A négyzetes kifizetés x = 1-ben",
      steps: [
        { text: "$\\sigma = 1$ és $\\tau = 0{,}5$ mellett a Gauss-mag varianciája $\\sigma^2\\tau$.", tex: "\\mathbb{E}[(\\sigma W_\\tau)^2] = \\sigma^2\\tau", result: { value: 0.5, tolerance: 0.001 } },
        { text: "Bontsd ki az $(x + \\sigma W_\\tau)^2$ négyzetet; a vegyes tag várható értéke nulla.", tex: "u(\\tau, 1) = 1^2 + 2 \\cdot 1 \\cdot 0 + 0{,}5", result: { value: 1.5, tolerance: 0.001 } },
        { text: "Az ábra Monte Carlo-kijelzője $x = 1$-ben ettől legfeljebb egy-két standard hibányira tér el: a kifizetés varianciája 2,5, a húzások száma 2000.", tex: "\\sqrt{2{,}5}/\\sqrt{2000}", result: { value: 0.0354, tolerance: 0.0001 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "A $dX = \\mu(X)\\,ds + \\sigma(X)\\,dW$ diffúzió generátora $\\mathcal{L}f = \\mu f' + \\tfrac12\\sigma^2 f''$, amely az Itô-lemmából számolható.",
      "$v(t, x) = \\mathbb{E}_{t,x}[g(X_T)]$ megoldja a $\\partial_t v + \\mathcal{L}v = 0$, $v(T, \\cdot) = g$ Kolmogorov-féle visszafelé egyenletet; az átmenetisűrűségek $(T, y)$-ban az előre egyenletet teljesítik.",
      "Feynman–Kac: a $\\partial_t u + \\mathcal{L}u - ru = 0$, $u(T, \\cdot) = g$ feladat megoldása $g(X_T)$ diszkontált várható értéke. Bizonyítás: az $e^{-\\int r}u(s, X_s)$ diszkontált értéknek nincs driftje, tehát martingál.",
      "$\\mu = 0$, konstans $\\sigma$ és $r = 0$ mellett ez a hővezetési egyenlet, amelyet a kifizetés Gauss-simítása old meg. $\\mathbb{Q}$ alatt, GBM-mel a Black–Scholes-egyenlet.",
      "A Monte Carlo- és a véges differenciás árazás a tétel két oldaláról ugyanazt a számot számolja ki.",
    ),
    note("A következő lecke, a „Monte Carlo-opcióárazás”, a várható érték oldalát választja: $\\mathbb{Q}$ alatt szimulál lejáratkori árakat, és az átlag standard hibáját vizsgálja."),
    lab("/black-scholes", "Vizsgáld meg, hogyan függ a Black–Scholes-egyenlet megoldása S-től, σ-tól és T-től a Black–Scholes laborban"),
  ],
};
