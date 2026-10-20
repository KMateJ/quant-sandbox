import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const itoIntegral: GuideLessonContent = {
  en: [
    p("This lesson defines the stochastic integral $\\int_0^t H_s\\,dW_s$, which gives meaning to the expression $dX = a\\,dt + b\\,dW$ used for asset prices. It builds on \"Filtrations, adapted processes and stopping times\" (adapted integrands), \"Conditional expectation and martingales\" (the martingale property) and \"Properties of Brownian motion\" (infinite total variation and quadratic variation $[W]_t = t$). The next lesson, \"Itô's lemma\", is the chain rule for these integrals."),

    h("Why a Riemann–Stieltjes integral fails"),
    p("For a deterministic function $g$, the Riemann–Stieltjes integral $\\int_0^t f\\,dg$ is the limit of sums $\\sum_i f(s_i)\\,(g(t_{i+1}) - g(t_i))$ over partitions $0 = t_0 < t_1 < \\dots < t_n = t$ whose mesh $\\max_i (t_{i+1} - t_i)$ tends to zero, with any evaluation points $s_i \\in [t_i, t_{i+1}]$. A classical theorem says that this limit exists for every continuous $f$ exactly when $g$ has finite total variation. Brownian paths have infinite total variation on every interval, almost surely, so the pathwise construction is not available."),
    p("The failure is visible in the simplest case $f = g = W$. Write $\\Delta W_i = W_{t_{i+1}} - W_{t_i}$ and compare right-point and left-point sums:"),
    eq("\\sum_{i} W_{t_{i+1}}\\,\\Delta W_i - \\sum_{i} W_{t_i}\\,\\Delta W_i = \\sum_{i} (\\Delta W_i)^2 \\longrightarrow t."),
    p("The difference tends to the quadratic variation $t$, not to zero, so the answer depends on where in each interval the integrand is evaluated. A definition has to fix the evaluation point. Itô's choice is the left endpoint."),

    h("Simple integrands"),
    p("Fix a probability space $(\\Omega, \\mathcal{F}, \\mathbb{P})$ with a filtration $(\\mathcal{F}_t)_{t \\ge 0}$ and a Brownian motion $W$ with respect to it: $W$ is adapted and each increment $W_u - W_s$, $u > s$, is independent of $\\mathcal{F}_s$. A process $H$ is **simple** if there are times $0 = t_0 < t_1 < \\dots < t_n = T$ and random variables $\\xi_0, \\dots, \\xi_{n-1}$ with $\\xi_i$ bounded and $\\mathcal{F}_{t_i}$-measurable, such that"),
    eq("H_s = \\sum_{i=0}^{n-1} \\xi_i\\,\\mathbf{1}_{(t_i,\\, t_{i+1}]}(s)."),
    p("The value on $(t_i, t_{i+1}]$ is fixed at the left endpoint, using only the information available there. For such $H$ the **Itô integral** is defined directly as a finite sum, for $t_k \\le t \\le t_{k+1}$:"),
    eq("\\int_0^t H_s\\,dW_s = \\sum_{i=0}^{k-1} \\xi_i\\,\\big(W_{t_{i+1}} - W_{t_i}\\big) + \\xi_k\\,\\big(W_t - W_{t_k}\\big)."),
    p("In trading terms, $\\xi_i$ is the number of shares held over $(t_i, t_{i+1}]$, chosen at time $t_i$, and the integral is the accumulated gain."),

    h("The Itô isometry"),
    p("**Theorem.** For a simple $H$,"),
    eq("\\mathbb{E}\\!\\left[\\Big(\\int_0^T H_s\\,dW_s\\Big)^{2}\\right] = \\mathbb{E}\\!\\left[\\int_0^T H_s^2\\,ds\\right]."),
    p("**Proof.** Let $I = \\sum_i \\xi_i\\,\\Delta W_i$ and expand the square into diagonal and cross terms. On the diagonal, $\\xi_i^2$ is $\\mathcal{F}_{t_i}$-measurable and $\\Delta W_i$ is independent of $\\mathcal{F}_{t_i}$ with variance $t_{i+1} - t_i$, so by the tower property"),
    eq("\\mathbb{E}\\big[\\xi_i^2 (\\Delta W_i)^2\\big] = \\mathbb{E}\\Big[\\xi_i^2\\,\\mathbb{E}\\big[(\\Delta W_i)^2 \\mid \\mathcal{F}_{t_i}\\big]\\Big] = \\mathbb{E}[\\xi_i^2]\\,(t_{i+1} - t_i)."),
    p("For a cross term with $i < j$, the product $\\xi_i \\xi_j \\Delta W_i$ is $\\mathcal{F}_{t_j}$-measurable, while $\\mathbb{E}[\\Delta W_j \\mid \\mathcal{F}_{t_j}] = 0$; hence $\\mathbb{E}[\\xi_i \\xi_j \\Delta W_i \\Delta W_j] = 0$. Summing the diagonal gives $\\mathbb{E}[I^2] = \\sum_i \\mathbb{E}[\\xi_i^2](t_{i+1} - t_i) = \\mathbb{E}\\big[\\int_0^T H_s^2\\,ds\\big]$. $\\square$"),
    p("Adaptedness was used twice: to pull $\\xi_i$ out of the conditional expectation, and to make the cross terms vanish. With an integrand that peeks into its own interval both steps break."),
    note("Itô isometry: $\\mathbb{E}\\big[(\\int_0^T H\\,dW)^2\\big] = \\mathbb{E}\\big[\\int_0^T H^2\\,ds\\big]$. It turns a question about a random integral into an ordinary $ds$-integral."),

    {
      kind: "check",
      id: "ito-integral/isometry-variance",
      prompt: "Use the Itô isometry to compute $\\operatorname{Var}\\big(\\int_0^2 W_s\\,dW_s\\big)$. (The integral has mean zero.)",
      answer: { type: "number", value: 2, tolerance: 0.01 },
      explain: "The variance equals $\\mathbb{E}\\big[\\int_0^2 W_s^2\\,ds\\big] = \\int_0^2 s\\,ds = 2$. As a cross-check, $\\int_0^2 W\\,dW = (W_2^2 - 2)/2$ and $\\operatorname{Var}(W_2^2)/4 = 2 \\cdot 2^2/4 = 2$.",
    },

    h("Extension to general integrands"),
    p("Let $\\mathcal{L}^2_T$ be the set of progressively measurable processes (adapted and jointly measurable in $(s, \\omega)$) with $\\mathbb{E}\\big[\\int_0^T H_s^2\\,ds\\big] < \\infty$. Every $H \\in \\mathcal{L}^2_T$ is the limit of simple processes $H^{(n)}$ in the norm $\\|H\\|^2 = \\mathbb{E}\\big[\\int_0^T H_s^2\\,ds\\big]$. By the isometry, the integrals $I(H^{(n)})$ form a Cauchy sequence in $L^2(\\Omega)$, so they converge, and the limit does not depend on the approximating sequence. This limit is the Itô integral of $H$. The isometry therefore holds for all of $\\mathcal{L}^2_T$. Integrands with only $\\int_0^T H_s^2\\,ds < \\infty$ almost surely can be handled by stopping (localisation); the result is then a local martingale rather than a martingale."),

    h("Properties"),
    p("For $H, K \\in \\mathcal{L}^2_T$ and constants $a, b$, the process $I_t = \\int_0^t H_s\\,dW_s$ has the following properties. Each one is checked on simple integrands and passes to the limit."),
    list(
      "Linearity: $\\int (aH + bK)\\,dW = a\\int H\\,dW + b\\int K\\,dW$.",
      "Zero mean: $\\mathbb{E}[I_t] = 0$, since $\\mathbb{E}[\\xi_i \\Delta W_i] = \\mathbb{E}\\big[\\xi_i\\,\\mathbb{E}[\\Delta W_i \\mid \\mathcal{F}_{t_i}]\\big] = 0$.",
      "Martingale: $\\mathbb{E}[I_t \\mid \\mathcal{F}_s] = I_s$ for $s \\le t$, and $I$ has a version with continuous paths.",
      "Isometry and covariance: $\\mathbb{E}[I_t^2] = \\mathbb{E}\\big[\\int_0^t H_s^2\\,ds\\big]$ and $\\mathbb{E}\\big[\\int_0^t H\\,dW \\int_0^t K\\,dW\\big] = \\mathbb{E}\\big[\\int_0^t H_s K_s\\,ds\\big]$.",
      "Quadratic variation: $[I]_t = \\int_0^t H_s^2\\,ds$, the integral analogue of $[W]_t = t$.",
    ),
    p("For a deterministic integrand $h$ the integral is Gaussian: $\\int_0^t h(s)\\,dW_s \\sim N\\big(0, \\int_0^t h(s)^2\\,ds\\big)$. For example, $\\int_0^1 s\\,dW_s \\sim N(0, 1/3)$."),

    h("Computing the integral of W against itself"),
    p("Take $H = W$ on $[0, t]$ with the grid $t_i = it/n$. The left-point sum can be rewritten with the identity $b(a - b) = \\tfrac12(a^2 - b^2) - \\tfrac12(a - b)^2$, applied to $a = W_{t_{i+1}}$, $b = W_{t_i}$:"),
    eq("\\sum_{i=0}^{n-1} W_{t_i}\\,\\Delta W_i = \\frac{1}{2}\\sum_{i=0}^{n-1}\\big(W_{t_{i+1}}^2 - W_{t_i}^2\\big) - \\frac{1}{2}\\sum_{i=0}^{n-1}(\\Delta W_i)^2 = \\frac{1}{2}W_t^2 - \\frac{1}{2}\\sum_{i=0}^{n-1}(\\Delta W_i)^2."),
    p("The first sum telescopes, and this is an exact identity for every $n$. The second sum is the only random approximation left. Each $(\\Delta W_i)^2$ has mean $t/n$ and variance $2(t/n)^2$, and they are independent, so"),
    eq("\\mathbb{E}\\Big[\\sum_i (\\Delta W_i)^2\\Big] = t, \\qquad \\operatorname{Var}\\Big(\\sum_i (\\Delta W_i)^2\\Big) = \\frac{2t^2}{n} \\longrightarrow 0."),
    p("The sum converges to $t$ in $L^2$, and therefore"),
    eq("\\int_0^t W_s\\,dW_s = \\frac{W_t^2 - t}{2}."),
    p("The $-t/2$ is exactly half the quadratic variation. Ordinary calculus would give $W_t^2/2$; the correction is there because squared increments of Brownian motion do not vanish in the limit. The result is consistent with the properties above: its mean is $(t - t)/2 = 0$, and its variance is $\\operatorname{Var}(W_t^2)/4 = 2t^2/4 = t^2/2$, which matches the isometry $\\int_0^t \\mathbb{E}[W_s^2]\\,ds = \\int_0^t s\\,ds = t^2/2$."),
    p("Numbers: if $W_1 = 1.3$, then $\\int_0^1 W\\,dW = (1.69 - 1)/2 = 0.345$, while $W_1^2/2 = 0.845$. On a grid of $n$ steps the left-point sum differs from $(W_1^2 - 1)/2$ by $-\\tfrac12\\big(\\sum_i(\\Delta W_i)^2 - 1\\big)$, whose standard deviation is $\\sqrt{1/(2n)}$: $0.224$ for $n = 10$, $0.0707$ for $n = 100$ and $0.00707$ for $n = 10\\,000$."),

    {
      kind: "check",
      id: "ito-integral/w-dw-value",
      prompt: "A Brownian path ends at $W_1 = 1.3$. What is the value of the Itô integral $\\int_0^1 W_s\\,dW_s$ along this path?",
      answer: { type: "number", value: 0.345, tolerance: 0.002 },
      explain: "$\\int_0^1 W\\,dW = (W_1^2 - 1)/2 = (1.69 - 1)/2 = 0.345$. The $-1$ is the quadratic variation $[W]_1 = 1$; the naive answer $W_1^2/2 = 0.845$ is the Stratonovich integral.",
    },

    h("Left-point and midpoint evaluation"),
    p("Evaluate instead at the midpoint $m_i = (t_i + t_{i+1})/2$. Split $\\Delta W_i = A_i + B_i$ with $A_i = W_{m_i} - W_{t_i}$ and $B_i = W_{t_{i+1}} - W_{m_i}$, independent $N(0, t/(2n))$ variables. Since $W_{m_i} = W_{t_i} + A_i$,"),
    eq("\\sum_i W_{m_i}\\,\\Delta W_i = \\sum_i W_{t_i}\\,\\Delta W_i + \\sum_i A_i^2 + \\sum_i A_i B_i \\longrightarrow \\frac{W_t^2 - t}{2} + \\frac{t}{2} + 0 = \\frac{W_t^2}{2}."),
    p("Here $\\sum_i A_i^2 \\to t/2$ by the same variance argument as before, and $\\sum_i A_i B_i$ has mean zero and variance $n\\,(t/2n)^2 \\to 0$. The midpoint limit is the **Stratonovich integral**, written $\\int_0^t W_s \\circ dW_s = W_t^2/2$. In general $\\int H \\circ dW = \\int H\\,dW + \\tfrac12 [H, W]_t$, where $[H, W]$ is the quadratic covariation; for $H = W$ this is $t/2$."),
    p("The figure draws one Brownian path on $[0, 1]$ and, for the chosen number of steps $n$ (10, 100, 1000 or 10 000), plots against $t$ the running left-point sum $\\sum W_{t_i} \\Delta W_i$, the running midpoint sum $\\sum W_{(t_i + t_{i+1})/2} \\Delta W_i$, and the curves $(W_t^2 - t)/2$ and $W_t^2/2$. Increase $n$ and note that the left sum settles on $(W_t^2 - t)/2$ and the midpoint sum on $W_t^2/2$. The readouts at $t = 1$ compare the left sum with $(W_1^2 - 1)/2$, the midpoint sum with $W_1^2/2$, and show the difference of the two sums, which approaches $0.5 = t/2$ as $n$ grows. Press \"New path\" to repeat with another path; the gap of $t/2$ stays."),
    figure("ito-sums"),
    p("The two integrals have complementary strengths. Stratonovich integrals obey the ordinary chain rule, which is why they are common in physics, where white noise models a smooth but fast physical signal. Itô integrals are martingales: $\\mathbb{E}\\big[\\int_0^t W\\,dW\\big] = 0$, while $\\mathbb{E}\\big[\\int_0^t W \\circ dW\\big] = t/2$. Finance uses Itô for a modelling reason. A trader chooses the position $\\xi_i$ at the start of the period, using the information $\\mathcal{F}_{t_i}$, and then the price moves. The gain $\\xi_i\\,(S_{t_{i+1}} - S_{t_i})$ is a left-point sum. Evaluating at the midpoint would let the position depend on half of the price move it is paid for, which is a form of trading on future information. Under a measure where discounted prices are martingales, the Itô integral keeps the gains from any such strategy a martingale too, which is the continuous-time statement that no strategy turns a fair game into a sure profit."),

    {
      kind: "check",
      id: "ito-integral/left-point",
      prompt: "Why do models of trading gains use the Itô (left-point) integral rather than the Stratonovich (midpoint) integral?",
      answer: {
        type: "choice",
        options: [
          "Because the Stratonovich integral does not exist for Brownian motion",
          "Because the position over $(t_i, t_{i+1}]$ is chosen at $t_i$ with the information in $\\mathcal{F}_{t_i}$, so the integrand must not anticipate the move",
          "Because the Itô integral obeys the ordinary chain rule",
          "Because both give the same value for every integrand",
        ],
        correct: 1,
      },
      explain: "A trading position is set before the price change it earns, which is left-point evaluation. The Stratonovich integral exists but evaluates the integrand inside the interval, and it is the Stratonovich integral, not the Itô integral, that follows the ordinary chain rule. For $H = W$ the two differ by $t/2$.",
    },

    {
      kind: "worked",
      title: "Moments of the integral of W against itself",
      steps: [
        { text: "An Itô integral of an adapted integrand has mean zero.", tex: "\\mathbb{E}\\Big[\\int_0^2 W_t\\,dW_t\\Big] = 0", result: { value: 0, tolerance: 0.001 } },
        { text: "The Itô isometry turns the variance into an ordinary integral, $\\int_0^T t\\,dt = T^2/2$, here with $T = 2$.", tex: "\\operatorname{Var}\\Big(\\int_0^2 W_t\\,dW_t\\Big) = \\int_0^2 \\mathbb{E}[W_t^2]\\,dt = \\frac{2^2}{2}", result: { value: 2, tolerance: 0.001 } },
        { text: "On a path that ends at $W_2 = 1.5$, the closed form gives the value of the integral.", tex: "\\int_0^2 W_t\\,dW_t = \\frac{W_2^2 - 2}{2} = \\frac{2.25 - 2}{2}", result: { value: 0.125, tolerance: 0.001 } },
      ],
    },

    h("Summary"),
    list(
      "Brownian paths have infinite variation, so $\\int H\\,dW$ cannot be defined path by path; the value of the sums depends on the evaluation point.",
      "For simple adapted $H$ the Itô integral is $\\sum_i \\xi_i\\,\\Delta W_i$ with $\\xi_i$ known at $t_i$; the Itô isometry $\\mathbb{E}[(\\int H\\,dW)^2] = \\mathbb{E}[\\int H^2\\,ds]$ extends it to all of $\\mathcal{L}^2_T$ by $L^2$ limits.",
      "The Itô integral is linear, has mean zero, is a martingale and has quadratic variation $\\int H^2\\,ds$.",
      "$\\int_0^t W\\,dW = (W_t^2 - t)/2$: the $-t/2$ comes from $\\sum (\\Delta W_i)^2 \\to t$. Midpoint evaluation gives the Stratonovich value $W_t^2/2$.",
      "Finance uses Itô because positions are chosen before the price moves they are paid on.",
    ),
    note("The next lesson, \"Itô's lemma\", turns the computation for $W^2$ into a general rule: $d(W_t^2) = 2W_t\\,dW_t + dt$ is the differential form of $\\int_0^t W\\,dW = (W_t^2 - t)/2$."),
    lab("/ito-process", "See the Itô correction at work on simulated log prices in the Itô Process lab"),
  ],

  hu: [
    p("Ez a lecke a $\\int_0^t H_s\\,dW_s$ sztochasztikus integrált definiálja, amely értelmet ad az árfolyamokra használt $dX = a\\,dt + b\\,dW$ kifejezésnek. Épít a „Filtrációk, adaptált folyamatok és megállási idők” (adaptált integrandusok), a „Feltételes várható érték és martingálok” (martingáltulajdonság) és „A Brown-mozgás tulajdonságai” (végtelen teljes variáció és a $[W]_t = t$ kvadratikus variáció) című leckékre. A következő lecke, „Az Itô-lemma”, ezeknek az integráloknak a láncszabálya."),

    h("A Riemann–Stieltjes-integrál kudarca"),
    p("Egy determinisztikus $g$ függvényre a $\\int_0^t f\\,dg$ Riemann–Stieltjes-integrál a $\\sum_i f(s_i)\\,(g(t_{i+1}) - g(t_i))$ összegek határértéke olyan $0 = t_0 < t_1 < \\dots < t_n = t$ felosztások mentén, amelyek finomsága, $\\max_i (t_{i+1} - t_i)$, nullához tart, tetszőleges $s_i \\in [t_i, t_{i+1}]$ kiértékelési pontokkal. Egy klasszikus tétel szerint ez a határérték pontosan akkor létezik minden folytonos $f$-re, ha $g$ korlátos változású. A Brown-pályák teljes variációja majdnem biztosan végtelen minden intervallumon, így a pályánkénti konstrukció nem használható."),
    p("A kudarc a legegyszerűbb esetben, $f = g = W$ mellett is látszik. Jelölje $\\Delta W_i = W_{t_{i+1}} - W_{t_i}$, és vessük össze a jobb és a bal végponti összeget:"),
    eq("\\sum_{i} W_{t_{i+1}}\\,\\Delta W_i - \\sum_{i} W_{t_i}\\,\\Delta W_i = \\sum_{i} (\\Delta W_i)^2 \\longrightarrow t."),
    p("A különbség a $t$ kvadratikus variációhoz tart, nem nullához, vagyis az eredmény attól függ, hol értékeljük ki az integrandust az egyes intervallumokon. A definíciónak rögzítenie kell a kiértékelési pontot. Itô választása a bal végpont."),

    h("Egyszerű integrandusok"),
    p("Rögzítsünk egy $(\\Omega, \\mathcal{F}, \\mathbb{P})$ valószínűségi mezőt egy $(\\mathcal{F}_t)_{t \\ge 0}$ filtrációval, és egy erre vonatkozó $W$ Brown-mozgást: $W$ adaptált, és minden $W_u - W_s$ ($u > s$) növekmény független $\\mathcal{F}_s$-től. Egy $H$ folyamat **egyszerű**, ha vannak $0 = t_0 < t_1 < \\dots < t_n = T$ időpontok és $\\xi_0, \\dots, \\xi_{n-1}$ valószínűségi változók, ahol $\\xi_i$ korlátos és $\\mathcal{F}_{t_i}$-mérhető, úgy, hogy"),
    eq("H_s = \\sum_{i=0}^{n-1} \\xi_i\\,\\mathbf{1}_{(t_i,\\, t_{i+1}]}(s)."),
    p("A $(t_i, t_{i+1}]$ intervallumon felvett érték a bal végpontban rögzül, csak az ott elérhető információ alapján. Ilyen $H$-ra az **Itô-integrált** közvetlenül véges összegként definiáljuk, $t_k \\le t \\le t_{k+1}$ esetén:"),
    eq("\\int_0^t H_s\\,dW_s = \\sum_{i=0}^{k-1} \\xi_i\\,\\big(W_{t_{i+1}} - W_{t_i}\\big) + \\xi_k\\,\\big(W_t - W_{t_k}\\big)."),
    p("Kereskedési nyelven $\\xi_i$ a $(t_i, t_{i+1}]$ alatt tartott részvények száma, amelyet $t_i$-ben választunk, az integrál pedig a felhalmozott nyereség."),

    h("Az Itô-izometria"),
    p("**Tétel.** Egyszerű $H$-ra"),
    eq("\\mathbb{E}\\!\\left[\\Big(\\int_0^T H_s\\,dW_s\\Big)^{2}\\right] = \\mathbb{E}\\!\\left[\\int_0^T H_s^2\\,ds\\right]."),
    p("**Bizonyítás.** Legyen $I = \\sum_i \\xi_i\\,\\Delta W_i$, és bontsuk a négyzetet átlós és vegyes tagokra. Az átlóban $\\xi_i^2$ $\\mathcal{F}_{t_i}$-mérhető, $\\Delta W_i$ pedig független $\\mathcal{F}_{t_i}$-től, varianciája $t_{i+1} - t_i$, így a toronyszabály szerint"),
    eq("\\mathbb{E}\\big[\\xi_i^2 (\\Delta W_i)^2\\big] = \\mathbb{E}\\Big[\\xi_i^2\\,\\mathbb{E}\\big[(\\Delta W_i)^2 \\mid \\mathcal{F}_{t_i}\\big]\\Big] = \\mathbb{E}[\\xi_i^2]\\,(t_{i+1} - t_i)."),
    p("Egy $i < j$ vegyes tagban a $\\xi_i \\xi_j \\Delta W_i$ szorzat $\\mathcal{F}_{t_j}$-mérhető, míg $\\mathbb{E}[\\Delta W_j \\mid \\mathcal{F}_{t_j}] = 0$; ezért $\\mathbb{E}[\\xi_i \\xi_j \\Delta W_i \\Delta W_j] = 0$. Az átlós tagokat összeadva $\\mathbb{E}[I^2] = \\sum_i \\mathbb{E}[\\xi_i^2](t_{i+1} - t_i) = \\mathbb{E}\\big[\\int_0^T H_s^2\\,ds\\big]$. $\\square$"),
    p("Az adaptáltságot kétszer használtuk: amikor $\\xi_i$-t kiemeltük a feltételes várható értékből, és amikor a vegyes tagok eltűntek. Ha az integrandus belelát a saját intervallumába, mindkét lépés elromlik."),
    note("Itô-izometria: $\\mathbb{E}\\big[(\\int_0^T H\\,dW)^2\\big] = \\mathbb{E}\\big[\\int_0^T H^2\\,ds\\big]$. Egy véletlen integrálra vonatkozó kérdést közönséges $ds$-integrállá alakít."),

    {
      kind: "check",
      id: "ito-integral/isometry-variance",
      prompt: "Számítsd ki az Itô-izometriával $\\operatorname{Var}\\big(\\int_0^2 W_s\\,dW_s\\big)$ értékét! (Az integrál várható értéke nulla.)",
      answer: { type: "number", value: 2, tolerance: 0.01 },
      explain: "A variancia $\\mathbb{E}\\big[\\int_0^2 W_s^2\\,ds\\big] = \\int_0^2 s\\,ds = 2$. Ellenőrzésként: $\\int_0^2 W\\,dW = (W_2^2 - 2)/2$ és $\\operatorname{Var}(W_2^2)/4 = 2 \\cdot 2^2/4 = 2$.",
    },

    h("Kiterjesztés általános integrandusokra"),
    p("Jelölje $\\mathcal{L}^2_T$ azon progresszíven mérhető (adaptált és $(s, \\omega)$-ban együttesen mérhető) folyamatok halmazát, amelyekre $\\mathbb{E}\\big[\\int_0^T H_s^2\\,ds\\big] < \\infty$. Minden $H \\in \\mathcal{L}^2_T$ előáll $H^{(n)}$ egyszerű folyamatok határértékeként az $\\|H\\|^2 = \\mathbb{E}\\big[\\int_0^T H_s^2\\,ds\\big]$ normában. Az izometria miatt az $I(H^{(n)})$ integrálok Cauchy-sorozatot alkotnak $L^2(\\Omega)$-ban, tehát konvergálnak, és a határérték nem függ a közelítő sorozattól. Ez a határérték $H$ Itô-integrálja, így az izometria az egész $\\mathcal{L}^2_T$-n érvényes. Azok az integrandusok, amelyekre csak majdnem biztosan $\\int_0^T H_s^2\\,ds < \\infty$, megállítással (lokalizációval) kezelhetők; ekkor az eredmény martingál helyett lokális martingál."),

    h("Tulajdonságok"),
    p("$H, K \\in \\mathcal{L}^2_T$ és $a, b$ konstansok mellett az $I_t = \\int_0^t H_s\\,dW_s$ folyamat tulajdonságai az alábbiak. Mindegyiket egyszerű integrandusokon ellenőrizzük, és a határátmenet megőrzi."),
    list(
      "Linearitás: $\\int (aH + bK)\\,dW = a\\int H\\,dW + b\\int K\\,dW$.",
      "Nulla várható érték: $\\mathbb{E}[I_t] = 0$, mert $\\mathbb{E}[\\xi_i \\Delta W_i] = \\mathbb{E}\\big[\\xi_i\\,\\mathbb{E}[\\Delta W_i \\mid \\mathcal{F}_{t_i}]\\big] = 0$.",
      "Martingál: $s \\le t$ esetén $\\mathbb{E}[I_t \\mid \\mathcal{F}_s] = I_s$, és $I$-nek van folytonos pályájú változata.",
      "Izometria és kovariancia: $\\mathbb{E}[I_t^2] = \\mathbb{E}\\big[\\int_0^t H_s^2\\,ds\\big]$ és $\\mathbb{E}\\big[\\int_0^t H\\,dW \\int_0^t K\\,dW\\big] = \\mathbb{E}\\big[\\int_0^t H_s K_s\\,ds\\big]$.",
      "Kvadratikus variáció: $[I]_t = \\int_0^t H_s^2\\,ds$, a $[W]_t = t$ integrálos megfelelője.",
    ),
    p("Determinisztikus $h$ integrandusra az integrál normális eloszlású: $\\int_0^t h(s)\\,dW_s \\sim N\\big(0, \\int_0^t h(s)^2\\,ds\\big)$. Például $\\int_0^1 s\\,dW_s \\sim N(0, 1/3)$."),

    h("A W önmaga szerinti integrálja"),
    p("Legyen $H = W$ a $[0, t]$ intervallumon, $t_i = it/n$ rácsponttal. A bal végponti összeg a $b(a - b) = \\tfrac12(a^2 - b^2) - \\tfrac12(a - b)^2$ azonossággal írható át, $a = W_{t_{i+1}}$, $b = W_{t_i}$ választással:"),
    eq("\\sum_{i=0}^{n-1} W_{t_i}\\,\\Delta W_i = \\frac{1}{2}\\sum_{i=0}^{n-1}\\big(W_{t_{i+1}}^2 - W_{t_i}^2\\big) - \\frac{1}{2}\\sum_{i=0}^{n-1}(\\Delta W_i)^2 = \\frac{1}{2}W_t^2 - \\frac{1}{2}\\sum_{i=0}^{n-1}(\\Delta W_i)^2."),
    p("Az első összeg teleszkopikus, és ez minden $n$-re pontos azonosság. Egyedül a második összeg marad véletlen közelítés. Minden $(\\Delta W_i)^2$ várható értéke $t/n$, varianciája $2(t/n)^2$, és ezek függetlenek, ezért"),
    eq("\\mathbb{E}\\Big[\\sum_i (\\Delta W_i)^2\\Big] = t, \\qquad \\operatorname{Var}\\Big(\\sum_i (\\Delta W_i)^2\\Big) = \\frac{2t^2}{n} \\longrightarrow 0."),
    p("Az összeg $L^2$-ben $t$-hez tart, következésképpen"),
    eq("\\int_0^t W_s\\,dW_s = \\frac{W_t^2 - t}{2}."),
    p("A $-t/2$ pontosan a kvadratikus variáció fele. A szokásos analízis $W_t^2/2$-t adna; a korrekció azért jelenik meg, mert a Brown-mozgás négyzetes növekményei a határátmenetben nem tűnnek el. Az eredmény összhangban van a fenti tulajdonságokkal: várható értéke $(t - t)/2 = 0$, varianciája $\\operatorname{Var}(W_t^2)/4 = 2t^2/4 = t^2/2$, ami egyezik az izometriából adódó $\\int_0^t \\mathbb{E}[W_s^2]\\,ds = \\int_0^t s\\,ds = t^2/2$ értékkel."),
    p("Számokkal: ha $W_1 = 1{,}3$, akkor $\\int_0^1 W\\,dW = (1{,}69 - 1)/2 = 0{,}345$, míg $W_1^2/2 = 0{,}845$. Egy $n$ lépéses rácson a bal végponti összeg eltérése $(W_1^2 - 1)/2$-től $-\\tfrac12\\big(\\sum_i(\\Delta W_i)^2 - 1\\big)$, amelynek szórása $\\sqrt{1/(2n)}$: $n = 10$ esetén $0{,}224$, $n = 100$ esetén $0{,}0707$, $n = 10\\,000$ esetén $0{,}00707$."),

    {
      kind: "check",
      id: "ito-integral/w-dw-value",
      prompt: "Egy Brown-pálya végpontja $W_1 = 1{,}3$. Mennyi az $\\int_0^1 W_s\\,dW_s$ Itô-integrál értéke ezen a pályán?",
      answer: { type: "number", value: 0.345, tolerance: 0.002 },
      explain: "$\\int_0^1 W\\,dW = (W_1^2 - 1)/2 = (1{,}69 - 1)/2 = 0{,}345$. A $-1$ a $[W]_1 = 1$ kvadratikus variáció; a naiv $W_1^2/2 = 0{,}845$ a Stratonovich-integrál értéke.",
    },

    h("Bal végponti és felezőponti kiértékelés"),
    p("Értékeljünk inkább az $m_i = (t_i + t_{i+1})/2$ felezőpontban. Bontsuk fel: $\\Delta W_i = A_i + B_i$, ahol $A_i = W_{m_i} - W_{t_i}$ és $B_i = W_{t_{i+1}} - W_{m_i}$ független $N(0, t/(2n))$ változók. Mivel $W_{m_i} = W_{t_i} + A_i$,"),
    eq("\\sum_i W_{m_i}\\,\\Delta W_i = \\sum_i W_{t_i}\\,\\Delta W_i + \\sum_i A_i^2 + \\sum_i A_i B_i \\longrightarrow \\frac{W_t^2 - t}{2} + \\frac{t}{2} + 0 = \\frac{W_t^2}{2}."),
    p("Itt $\\sum_i A_i^2 \\to t/2$ az előbbi varianciaérvvel, $\\sum_i A_i B_i$ várható értéke pedig nulla, varianciája $n\\,(t/2n)^2 \\to 0$. A felezőponti határérték a **Stratonovich-integrál**, jelölése $\\int_0^t W_s \\circ dW_s = W_t^2/2$. Általában $\\int H \\circ dW = \\int H\\,dW + \\tfrac12 [H, W]_t$, ahol $[H, W]$ a kvadratikus kovariáció; $H = W$ esetén ez $t/2$."),
    p("Az ábra egyetlen Brown-pályát rajzol a $[0, 1]$ intervallumon, és a választott $n$ lépésszámra (10, 100, 1000 vagy 10 000) $t$ függvényében mutatja a $\\sum W_{t_i} \\Delta W_i$ futó bal végponti összeget, a $\\sum W_{(t_i + t_{i+1})/2} \\Delta W_i$ futó felezőponti összeget, valamint a $(W_t^2 - t)/2$ és $W_t^2/2$ görbéket. Növeld $n$-et, és figyeld meg, hogy a bal végponti összeg a $(W_t^2 - t)/2$, a felezőponti a $W_t^2/2$ görbére simul. A $t = 1$-beli kijelzők a bal összeget $(W_1^2 - 1)/2$-vel, a felezőponti összeget $W_1^2/2$-vel vetik össze, és mutatják a két összeg különbségét, amely $n$ növelésével $0{,}5 = t/2$-höz tart. Az „Új pálya” gombbal másik pályán ismételhető; a $t/2$ eltérés megmarad."),
    figure("ito-sums"),
    p("A két integrálnak egymást kiegészítő erősségei vannak. A Stratonovich-integrál a szokásos láncszabályt követi, ezért gyakori a fizikában, ahol a fehér zaj egy sima, de gyors fizikai jelet modellez. Az Itô-integrál martingál: $\\mathbb{E}\\big[\\int_0^t W\\,dW\\big] = 0$, míg $\\mathbb{E}\\big[\\int_0^t W \\circ dW\\big] = t/2$. A pénzügyekben modellezési ok miatt Itô-integrált használunk. A kereskedő az időszak elején, az $\\mathcal{F}_{t_i}$ információ alapján választja meg a $\\xi_i$ pozíciót, és csak utána mozdul az ár. A $\\xi_i\\,(S_{t_{i+1}} - S_{t_i})$ nyereség bal végponti összeg. A felezőponti kiértékelés megengedné, hogy a pozíció függjön annak az ármozgásnak a feléből, amelyért fizetnek érte, ez pedig a jövőbeli információval való kereskedés egy formája. Olyan mérték alatt, amelyben a diszkontált árak martingálok, az Itô-integrál minden ilyen stratégia nyereségét is martingálnak tartja; ez annak folytonos idejű megfogalmazása, hogy egyetlen stratégia sem változtat egy igazságos játékot biztos nyereséggé."),

    {
      kind: "check",
      id: "ito-integral/left-point",
      prompt: "Miért az Itô-féle (bal végponti) integrállal modellezzük a kereskedési nyereséget a Stratonovich-féle (felezőponti) helyett?",
      answer: {
        type: "choice",
        options: [
          "Mert a Stratonovich-integrál Brown-mozgásra nem létezik",
          "Mert a $(t_i, t_{i+1}]$ alatti pozíciót $t_i$-ben, az $\\mathcal{F}_{t_i}$ információ alapján választjuk, így az integrandus nem láthatja előre a mozgást",
          "Mert az Itô-integrál a szokásos láncszabályt követi",
          "Mert minden integrandusra ugyanazt az értéket adják",
        ],
        correct: 1,
      },
      explain: "A kereskedési pozíciót az általa megkeresett árváltozás előtt rögzítjük, ez bal végponti kiértékelés. A Stratonovich-integrál létezik, de az intervallum belsejében értékel ki, és nem az Itô-, hanem a Stratonovich-integrál követi a szokásos láncszabályt. $H = W$ esetén a kettő $t/2$-vel tér el.",
    },

    {
      kind: "worked",
      title: "W önmagára vett integráljának momentumai",
      steps: [
        { text: "Adaptált integrandus Itô-integráljának várható értéke nulla.", tex: "\\mathbb{E}\\Big[\\int_0^2 W_t\\,dW_t\\Big] = 0", result: { value: 0, tolerance: 0.001 } },
        { text: "Az Itô-izometria a varianciát közönséges integrállá alakítja, $\\int_0^T t\\,dt = T^2/2$, itt $T = 2$-vel.", tex: "\\operatorname{Var}\\Big(\\int_0^2 W_t\\,dW_t\\Big) = \\int_0^2 \\mathbb{E}[W_t^2]\\,dt = \\frac{2^2}{2}", result: { value: 2, tolerance: 0.001 } },
        { text: "Egy $W_2 = 1{,}5$-ben végződő pályán a zárt alak megadja az integrál értékét.", tex: "\\int_0^2 W_t\\,dW_t = \\frac{W_2^2 - 2}{2} = \\frac{2{,}25 - 2}{2}", result: { value: 0.125, tolerance: 0.001 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "A Brown-pályák végtelen variációjúak, ezért $\\int H\\,dW$ pályánként nem definiálható; az összegek értéke függ a kiértékelési ponttól.",
      "Egyszerű adaptált $H$-ra az Itô-integrál $\\sum_i \\xi_i\\,\\Delta W_i$, ahol $\\xi_i$ $t_i$-ben ismert; az $\\mathbb{E}[(\\int H\\,dW)^2] = \\mathbb{E}[\\int H^2\\,ds]$ Itô-izometria $L^2$-határértékkel kiterjeszti az egész $\\mathcal{L}^2_T$-re.",
      "Az Itô-integrál lineáris, várható értéke nulla, martingál, kvadratikus variációja $\\int H^2\\,ds$.",
      "$\\int_0^t W\\,dW = (W_t^2 - t)/2$: a $-t/2$ a $\\sum (\\Delta W_i)^2 \\to t$ tényből ered. A felezőponti kiértékelés a $W_t^2/2$ Stratonovich-értéket adja.",
      "A pénzügyekben azért Itô-integrált használunk, mert a pozíciót az ármozgás előtt választjuk meg.",
    ),
    note("A következő lecke, „Az Itô-lemma”, a $W^2$-re végzett számolásból általános szabályt csinál: $d(W_t^2) = 2W_t\\,dW_t + dt$ éppen az $\\int_0^t W\\,dW = (W_t^2 - t)/2$ differenciális alakja."),
    lab("/ito-process", "Nézd meg az Itô-korrekciót szimulált logárakon az Itô-folyamat laborban"),
  ],
};
