import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const martingales: GuideLessonContent = {
  en: [
    p("The lesson \"Probability spaces, σ-algebras and random variables\" set up the probability space $(\\Omega, \\mathcal{F}, \\mathbb{P})$, and \"Filtrations, adapted processes and stopping times\" described how information grows over time through a filtration $\\mathbb{F} = (\\mathcal{F}_n)$. This lesson uses both to define conditional expectation given a σ-algebra, states its calculation rules, defines a martingale (the mathematical model of a fair game), and proves why no betting strategy turns a fair game into a profitable one. The coin-flip walk $W_n$ and Brownian motion $W_t$ from \"Random walks and Brownian motion\" serve as the running examples."),

    h("Conditional expectation given a σ-algebra"),
    p("Let $X$ be an integrable random variable, $\\mathbb{E}|X| < \\infty$, and let $\\mathcal{G} \\subseteq \\mathcal{F}$ be a sub-σ-algebra: the events whose occurrence is known when the information $\\mathcal{G}$ is available. The **conditional expectation** $\\mathbb{E}[X \\mid \\mathcal{G}]$ is a random variable $Y$ with two properties:"),
    list(
      "$Y$ is $\\mathcal{G}$-measurable: its value can be computed from the information in $\\mathcal{G}$.",
      "$\\mathbb{E}[X\\,\\mathbf{1}_A] = \\mathbb{E}[Y\\,\\mathbf{1}_A]$ for every event $A \\in \\mathcal{G}$: on every event that $\\mathcal{G}$ can see, $Y$ has the same average as $X$.",
    ),
    p("Such a $Y$ exists (by the Radon–Nikodym theorem) and is unique up to a set of probability zero. When $X$ has a finite variance, $\\mathbb{E}[X \\mid \\mathcal{G}]$ is the $\\mathcal{G}$-measurable random variable closest to $X$ in mean square, which is why it is called the best forecast of $X$ given $\\mathcal{G}$. It is not a number fixed in advance but a random variable, because the forecast depends on what has been observed."),
    p("Example: toss a fair coin twice, let $Y$ be the number of heads and $\\mathcal{G} = \\sigma(X_1)$ the information from the first toss. $\\mathcal{G}$ contains only the events \"first toss heads\" and \"first toss tails\" (and $\\emptyset$, $\\Omega$), so $\\mathbb{E}[Y \\mid \\mathcal{G}]$ must be constant on each: $1 + \\tfrac12 = 1.5$ after heads and $0 + \\tfrac12 = 0.5$ after tails. The defining property holds on $A = \\{\\text{heads first}\\}$: $\\mathbb{E}[Y\\,\\mathbf{1}_A] = \\tfrac12 \\cdot 1.5 = 0.75$ on both sides."),

    h("Rules for conditional expectation"),
    p("All of these follow from the definition, and they are what one actually computes with. Here $X$ and $Z$ are integrable and $\\mathcal{H} \\subseteq \\mathcal{G}$ are sub-σ-algebras."),
    list(
      "**Linearity:** $\\mathbb{E}[aX + bZ \\mid \\mathcal{G}] = a\\,\\mathbb{E}[X \\mid \\mathcal{G}] + b\\,\\mathbb{E}[Z \\mid \\mathcal{G}]$.",
      "**Tower property:** $\\mathbb{E}\\big[\\mathbb{E}[X \\mid \\mathcal{G}] \\mid \\mathcal{H}\\big] = \\mathbb{E}[X \\mid \\mathcal{H}]$. Forecasting with less information what a better-informed forecast will be gives the less-informed forecast. With $\\mathcal{H} = \\{\\emptyset, \\Omega\\}$ this is $\\mathbb{E}\\big[\\mathbb{E}[X \\mid \\mathcal{G}]\\big] = \\mathbb{E}[X]$.",
      "**Taking out what is known:** if $Z$ is $\\mathcal{G}$-measurable and $ZX$ is integrable, then $\\mathbb{E}[ZX \\mid \\mathcal{G}] = Z\\,\\mathbb{E}[X \\mid \\mathcal{G}]$.",
      "**Independence:** if $X$ is independent of $\\mathcal{G}$, then $\\mathbb{E}[X \\mid \\mathcal{G}] = \\mathbb{E}[X]$. Information unrelated to $X$ does not change its forecast.",
    ),
    p("In the coin example the tower property reads $\\tfrac12 \\cdot 1.5 + \\tfrac12 \\cdot 0.5 = 1 = \\mathbb{E}[Y]$."),
    {
      kind: "check",
      id: "martingales/tower-forecast",
      prompt: "Toss a fair coin three times and let $Y$ be the number of heads. The first toss shows heads. What is $\\mathbb{E}[Y \\mid \\mathcal{F}_1]$?",
      answer: { type: "number", value: 2, tolerance: 0.01 },
      explain: "One head is already known and each of the two remaining tosses adds $\\tfrac12$ on average: $1 + 2 \\cdot \\tfrac12 = 2$. Averaging over the first toss, $\\tfrac12 \\cdot 2 + \\tfrac12 \\cdot 1 = 1.5 = \\mathbb{E}[Y]$, as the tower property says.",
    },

    h("Martingales"),
    p("Fix a filtration $\\mathbb{F} = (\\mathcal{F}_n)_{n \\ge 0}$. A process $X = (X_n)$ is a **martingale** with respect to $\\mathbb{F}$ if"),
    list(
      "it is adapted: $X_n$ is $\\mathcal{F}_n$-measurable for every $n$;",
      "it is integrable: $\\mathbb{E}|X_n| < \\infty$ for every $n$;",
      "the best forecast of the next value is the current value: $\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = X_n$.",
    ),
    p("In continuous time, with a filtration $(\\mathcal{F}_t)_{t \\ge 0}$, the third condition becomes $\\mathbb{E}[X_t \\mid \\mathcal{F}_s] = X_s$ for all $s \\le t$. If $\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] \\ge X_n$ instead, the process is a **submartingale** (a game in your favour); with $\\le$ it is a **supermartingale** (a game against you, like a casino with a house edge)."),
    note("A martingale is a fair game: given everything observed so far, the expected change over the next step is zero. By the tower property the same holds over any number of steps, $\\mathbb{E}[X_m \\mid \\mathcal{F}_n] = X_n$ for $m \\ge n$, and in particular $\\mathbb{E}[X_n] = \\mathbb{E}[X_0]$."),

    h("Examples from Brownian motion"),
    p("Use the natural filtration, the history of the path. Each example is one line with the rules above."),
    list(
      "The symmetric random walk is a martingale: $\\mathbb{E}[W_{n+1} \\mid \\mathcal{F}_n] = W_n + \\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = W_n + \\mathbb{E}[X_{n+1}] = W_n$, by taking out what is known and then independence.",
      "Brownian motion is a martingale in continuous time: for $s < t$, $W_t = W_s + (W_t - W_s)$, and the increment is independent of $\\mathcal{F}_s$ with mean zero, so $\\mathbb{E}[W_t \\mid \\mathcal{F}_s] = W_s$.",
      "$W_t^2$ is not a martingale. Writing $W_t^2 = W_s^2 + 2W_s(W_t - W_s) + (W_t - W_s)^2$ and taking the forecast term by term gives $\\mathbb{E}[W_t^2 \\mid \\mathcal{F}_s] = W_s^2 + 0 + (t - s)$: it drifts upward, so it is a submartingale.",
      "$W_t^2 - t$ is a martingale: subtracting the drift $t$ removes exactly the upward tendency.",
    ),
    p("Example: suppose $W_1 = 1$. The forecast of $W_4$ is still 1, but the forecast of $W_4^2$ is $1 + 3 = 4$, not 1. The spread of the path grows even though its centre does not move."),
    {
      kind: "check",
      id: "martingales/which-martingale",
      prompt: "Which of these processes is a martingale?",
      answer: { type: "choice", options: ["$W_t^2$", "$W_t^2 - t$", "$W_t + t$", "$e^{W_t}$"], correct: 1 },
      explain: "$\\mathbb{E}[W_t^2 \\mid \\mathcal{F}_s] = W_s^2 + (t - s)$, so subtracting $t$ removes the drift. $W_t^2$ and $W_t + t$ drift upwards, and $e^{W_t}$ is a submartingale too: it needs the factor $e^{-t/2}$ to become a martingale.",
    },

    h("Betting strategies"),
    p("Bet on a fair coin round by round. Before round $k$ you choose a stake $H_k$ using only the history $\\mathcal{F}_{k-1}$ (the stake is **predictable**), and win or lose it: your wealth changes by $H_k X_k$ with $X_k = \\pm 1$. After $n$ rounds"),
    eq("V_n = V_0 + \\sum_{k=1}^{n} H_k X_k, \\qquad \\mathbb{E}[V_{n+1} \\mid \\mathcal{F}_n] = V_n + H_{n+1}\\,\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = V_n."),
    p("The stake is taken out of the forecast because it is known at time $n$, and the coin has conditional mean zero. So the wealth of every such strategy is again a martingale (a **martingale transform**), and its expected value stays at $V_0$ at every fixed time. A strategy can change the shape of the outcome distribution, but not its mean."),
    p("The famous **doubling strategy** stakes 1, and after every loss doubles the stake, so that the first win recovers all earlier losses plus 1. Limit it to at most 5 rounds. A win in any of the first five rounds gives a net gain of 1. Losing all five rounds has probability $(\\tfrac12)^5 = \\tfrac1{32}$ and costs $1 + 2 + 4 + 8 + 16 = 31$. The expected gain is"),
    eq("\\tfrac{31}{32} \\cdot 1 + \\tfrac{1}{32} \\cdot (-31) = 0."),
    p("The strategy wins a little with probability $96.9\\%$ and loses a lot with probability $3.1\\%$. Without a round limit it needs unlimited credit: after 10 losses in a row the next stake is 512 and the losses so far are 1023."),
    p("In the figure you play this game yourself, starting from a wealth of 100. Choose a strategy: a constant stake of 1, doubling after a loss (stakes up to 64, then back to 1), or a stake of 5% of current wealth; no stake can exceed what you have. \"Flip once\" plays one round and \"Play 100 rounds\" plays a hundred, drawing your wealth as a step plot. \"Simulate 1000 players\" lets 1000 players play 100 rounds each with the chosen strategy and draws a histogram of their final wealth, with the average marked; \"Reset\" starts again with fresh coins. Compare the three strategies. The average final wealth stays near 100 in every case (the readout shows it with its 95% sampling band), but with a constant stake about 46% of players end ahead and nobody falls below about 60, with doubling about two thirds end ahead and some lose everything, and with 5% of wealth only about 38% end ahead while a few players finish with several times their starting wealth."),
    figure("martingale-betting"),
    p("The same calculation with a longer limit shows that more rounds only move the risk into a rarer, larger loss."),
    {
      kind: "worked",
      title: "The doubling strategy limited to six rounds",
      steps: [
        { text: "Probability of losing all six rounds, in percent.", tex: "\\left(\\tfrac12\\right)^6", result: { value: 1.5625, tolerance: 0.001, unit: "%" } },
        { text: "Total loss when all six rounds are lost.", tex: "1 + 2 + 4 + 8 + 16 + 32", result: { value: 63, tolerance: 0.01 } },
        { text: "Probability of a net gain of 1, in percent.", tex: "1 - \\left(\\tfrac12\\right)^6", result: { value: 98.4375, tolerance: 0.001, unit: "%" } },
        { text: "Expected gain of the strategy.", tex: "\\left(1 - \\tfrac{1}{64}\\right) \\cdot 1 + \\tfrac{1}{64} \\cdot (-63)", result: { value: 0, tolerance: 0.001 } },
      ],
    },

    h("Stopping and the optional stopping theorem"),
    p("A gambler rarely plays a fixed number of rounds; they stop when something happens. A **stopping time** $\\tau$ is a random time for which the decision to stop by time $n$ uses only the information up to $n$: $\\{\\tau \\le n\\} \\in \\mathcal{F}_n$ for every $n$. \"Stop at the first win\" is a stopping time; \"stop just before the biggest loss\" is not, because it needs the future."),
    p("Stopping a martingale at a stopping time keeps it a martingale: the stopped process $X_{\\tau \\wedge n}$ is again a martingale, so $\\mathbb{E}[X_{\\tau \\wedge n}] = \\mathbb{E}[X_0]$ for every fixed $n$. Passing to $n \\to \\infty$ needs a condition. The **optional stopping theorem** states: if $X$ is a martingale and $\\tau$ a stopping time, then"),
    eq("\\mathbb{E}[X_\\tau] = \\mathbb{E}[X_0]"),
    p("holds under any one of these hypotheses:"),
    list(
      "$\\tau$ is bounded: $\\tau \\le N$ for a fixed number $N$;",
      "$\\tau < \\infty$ almost surely and the stopped process is dominated: $|X_{\\tau \\wedge n}| \\le K$ for all $n$, for a fixed $K$ (more generally, the family $X_{\\tau \\wedge n}$ is uniformly integrable);",
      "$\\mathbb{E}[\\tau] < \\infty$ and the increments are bounded: $|X_{n+1} - X_n| \\le c$.",
    ),
    p("Example (gambler's ruin): a symmetric walk starts at 0 and stops at $\\tau$, the first time it hits $+2$ or $-3$. The stopped walk stays between $-3$ and $+2$, so the second hypothesis applies, and $0 = \\mathbb{E}[W_\\tau] = 2\\pi + (-3)(1 - \\pi)$, where $\\pi$ is the probability of reaching $+2$ first. Hence $\\pi = 3/5 = 0.6$, without any combinatorics."),
    p("The doubling strategy without a round limit shows why the hypotheses matter. Let $\\tau$ be the first win. It is a stopping time and finite with probability 1, and $V_\\tau = V_0 + 1$, so $\\mathbb{E}[V_\\tau] = V_0 + 1 \\ne V_0$. The theorem is not contradicted: $\\tau$ is unbounded, and before the win the wealth $V_0 - (2^k - 1)$ is not bounded below, so no hypothesis holds. With the cap of five rounds, $\\tau \\wedge 5$ is bounded and the expected gain is 0, as computed above."),
    {
      kind: "check",
      id: "martingales/optional-stopping",
      prompt: "The unlimited doubling strategy stops at the first win, which happens with probability 1, and then has gained exactly 1. Why does this not contradict the optional stopping theorem?",
      answer: {
        type: "choice",
        options: [
          "The first win is not a stopping time.",
          "The stopping time is unbounded and the wealth before stopping is not bounded below, so none of the theorem's hypotheses holds.",
          "The coin is not fair once the stake is doubled.",
          "The first win never happens with positive probability.",
        ],
        correct: 1,
      },
      explain: "\"Stop at the first win\" uses only the past, so it is a stopping time, and it is finite almost surely. What fails is boundedness: $\\tau$ has no upper bound, and the losses $2^k - 1$ before the win are not dominated, so $\\mathbb{E}[V_\\tau] = \\mathbb{E}[V_0]$ need not hold.",
    },

    h("Doob's maximal inequality"),
    p("A martingale also controls how far its path can stray before time $n$, not only where it ends. For a martingale $X$ and any $\\lambda > 0$, **Doob's maximal inequality** gives"),
    eq("\\mathbb{P}\\Big(\\max_{k \\le n} |X_k| \\ge \\lambda\\Big) \\le \\frac{\\mathbb{E}|X_n|}{\\lambda}, \\qquad \\mathbb{E}\\Big[\\max_{k \\le n} X_k^2\\Big] \\le 4\\,\\mathbb{E}[X_n^2]."),
    p("The second form is the $L^2$ version. Both hold with the maximum replaced by the supremum over $[0, t]$ for a martingale with continuous paths such as Brownian motion. Example: for the coin-flip walk with $n = 100$, $\\mathbb{E}|W_{100}| \\le \\sqrt{\\mathbb{E}[W_{100}^2]} = 10$, so the probability that the walk ever reaches distance 30 from the start within 100 steps is at most $10/30 = 1/3$, and $\\mathbb{E}[\\max_{k \\le 100} W_k^2] \\le 400$. Inequalities like these are what make limits of martingales, and later the Itô integral, well behaved."),

    h("Prices as martingales"),
    p("Martingales are the language of arbitrage-free pricing. In \"Risk-neutral probabilities\" the stock was expected to earn the risk-free rate under $\\mathbb{Q}$, which says exactly that the discounted price $e^{-rt}S_t$ is a martingale under $\\mathbb{Q}$. A later lesson in this track, on changing the measure, shows how to move from the real-world measure $\\mathbb{P}$, under which this fails, to $\\mathbb{Q}$, under which it holds. A price is then simply the conditional expectation of the discounted payoff."),

    h("Summary"),
    list(
      "$\\mathbb{E}[X \\mid \\mathcal{G}]$ is the $\\mathcal{G}$-measurable random variable with the same average as $X$ on every event in $\\mathcal{G}$; it obeys linearity, the tower property, taking out what is known, and the independence rule.",
      "A martingale with respect to $\\mathbb{F}$ is adapted, integrable and satisfies $\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = X_n$ (in continuous time $\\mathbb{E}[X_t \\mid \\mathcal{F}_s] = X_s$). $W_t$ and $W_t^2 - t$ are martingales.",
      "Betting with predictable stakes on a fair game gives a martingale transform: the expected wealth never changes at a fixed time.",
      "Optional stopping, $\\mathbb{E}[X_\\tau] = \\mathbb{E}[X_0]$, needs a bounded stopping time, a dominated stopped process, or $\\mathbb{E}[\\tau] < \\infty$ with bounded increments; unlimited doubling violates all three.",
      "Doob's maximal inequality bounds the whole path: $\\mathbb{P}(\\max_{k \\le n}|X_k| \\ge \\lambda) \\le \\mathbb{E}|X_n|/\\lambda$.",
    ),
    note("The next lesson, \"Properties of Brownian motion\", studies the paths of $W_t$ in detail, using the martingales $W_t$ and $W_t^2 - t$ found here."),
    lab("/brownian-motion", "Simulate Brownian paths and watch their spread grow in the Brownian motion lab"),
  ],

  hu: [
    p("A „Valószínűségi mezők, σ-algebrák és valószínűségi változók” című lecke felépítette az $(\\Omega, \\mathcal{F}, \\mathbb{P})$ valószínűségi mezőt, a „Filtrációk, adaptált folyamatok és megállási idők” pedig leírta, hogyan bővül az információ az időben egy $\\mathbb{F} = (\\mathcal{F}_n)$ filtráción keresztül. Ez a lecke mindkettőre támaszkodva definiálja a σ-algebrára vett feltételes várható értéket, kimondja a számolási szabályait, definiálja a martingált (az igazságos játék matematikai modelljét), és bebizonyítja, miért nem tehető nyereségessé egy igazságos játék semmilyen fogadási stratégiával. Végig a „Véletlen bolyongás és Brown-mozgás” című leckéből ismert $W_n$ érmedobásos bolyongás és a $W_t$ Brown-mozgás a példa."),

    h("Feltételes várható érték egy σ-algebrára"),
    p("Legyen $X$ integrálható valószínűségi változó, $\\mathbb{E}|X| < \\infty$, és legyen $\\mathcal{G} \\subseteq \\mathcal{F}$ egy rész-σ-algebra: azok az események, amelyekről a $\\mathcal{G}$ információ birtokában tudjuk, hogy bekövetkeztek-e. Az $\\mathbb{E}[X \\mid \\mathcal{G}]$ **feltételes várható érték** egy olyan $Y$ valószínűségi változó, amelyre két dolog teljesül:"),
    list(
      "$Y$ $\\mathcal{G}$-mérhető: az értéke kiszámolható a $\\mathcal{G}$-ben lévő információból.",
      "$\\mathbb{E}[X\\,\\mathbf{1}_A] = \\mathbb{E}[Y\\,\\mathbf{1}_A]$ minden $A \\in \\mathcal{G}$ eseményre: minden olyan eseményen, amelyet $\\mathcal{G}$ „lát”, $Y$ átlaga megegyezik $X$ átlagával.",
    ),
    p("Ilyen $Y$ létezik (a Radon–Nikodym-tétel szerint), és egy nulla valószínűségű halmaztól eltekintve egyértelmű. Ha $X$ szórásnégyzete véges, $\\mathbb{E}[X \\mid \\mathcal{G}]$ az a $\\mathcal{G}$-mérhető valószínűségi változó, amely átlagos négyzetes értelemben a legközelebb van $X$-hez; ezért nevezzük $X$ legjobb előrejelzésének $\\mathcal{G}$ alapján. Nem előre rögzített szám, hanem valószínűségi változó, mert az előrejelzés attól függ, mit figyeltünk meg."),
    p("Példa: dobjunk fel kétszer egy szabályos érmét, legyen $Y$ a fejek száma és $\\mathcal{G} = \\sigma(X_1)$ az első dobásból származó információ. $\\mathcal{G}$ csak az „első dobás fej” és az „első dobás írás” eseményeket tartalmazza (meg $\\emptyset$-t és $\\Omega$-t), így $\\mathbb{E}[Y \\mid \\mathcal{G}]$ mindkettőn állandó: fej után $1 + \\tfrac12 = 1{,}5$, írás után $0 + \\tfrac12 = 0{,}5$. A definiáló tulajdonság teljesül az $A = \\{\\text{az első dobás fej}\\}$ eseményen: $\\mathbb{E}[Y\\,\\mathbf{1}_A] = \\tfrac12 \\cdot 1{,}5 = 0{,}75$ mindkét oldalon."),

    h("A feltételes várható érték szabályai"),
    p("Ezek mind a definícióból következnek, és valójában ezekkel számolunk. Itt $X$ és $Z$ integrálható, $\\mathcal{H} \\subseteq \\mathcal{G}$ pedig rész-σ-algebrák."),
    list(
      "**Linearitás:** $\\mathbb{E}[aX + bZ \\mid \\mathcal{G}] = a\\,\\mathbb{E}[X \\mid \\mathcal{G}] + b\\,\\mathbb{E}[Z \\mid \\mathcal{G}]$.",
      "**Toronyszabály:** $\\mathbb{E}\\big[\\mathbb{E}[X \\mid \\mathcal{G}] \\mid \\mathcal{H}\\big] = \\mathbb{E}[X \\mid \\mathcal{H}]$. Ha kevesebb információval jelezzük előre, mit fog mondani egy jobban informált előrejelzés, a kevésbé informált előrejelzést kapjuk. $\\mathcal{H} = \\{\\emptyset, \\Omega\\}$ esetén ez $\\mathbb{E}\\big[\\mathbb{E}[X \\mid \\mathcal{G}]\\big] = \\mathbb{E}[X]$.",
      "**Az ismert tényező kiemelése:** ha $Z$ $\\mathcal{G}$-mérhető és $ZX$ integrálható, akkor $\\mathbb{E}[ZX \\mid \\mathcal{G}] = Z\\,\\mathbb{E}[X \\mid \\mathcal{G}]$.",
      "**Függetlenség:** ha $X$ független $\\mathcal{G}$-től, akkor $\\mathbb{E}[X \\mid \\mathcal{G}] = \\mathbb{E}[X]$. Az $X$-szel össze nem függő információ nem változtat az előrejelzésén.",
    ),
    p("Az érmés példában a toronyszabály így szól: $\\tfrac12 \\cdot 1{,}5 + \\tfrac12 \\cdot 0{,}5 = 1 = \\mathbb{E}[Y]$."),
    {
      kind: "check",
      id: "martingales/tower-forecast",
      prompt: "Dobj fel egy szabályos érmét háromszor, és legyen $Y$ a fejek száma. Az első dobás fej. Mennyi $\\mathbb{E}[Y \\mid \\mathcal{F}_1]$?",
      answer: { type: "number", value: 2, tolerance: 0.01 },
      explain: "Egy fej már ismert, a hátralévő két dobás pedig átlagosan $\\tfrac12$-del növeli a számot: $1 + 2 \\cdot \\tfrac12 = 2$. Az első dobásra átlagolva $\\tfrac12 \\cdot 2 + \\tfrac12 \\cdot 1 = 1{,}5 = \\mathbb{E}[Y]$, ahogy a toronyszabály mondja.",
    },

    h("Martingálok"),
    p("Rögzítsünk egy $\\mathbb{F} = (\\mathcal{F}_n)_{n \\ge 0}$ filtrációt. Az $X = (X_n)$ folyamat **martingál** $\\mathbb{F}$-re nézve, ha"),
    list(
      "adaptált: $X_n$ minden $n$-re $\\mathcal{F}_n$-mérhető;",
      "integrálható: $\\mathbb{E}|X_n| < \\infty$ minden $n$-re;",
      "a következő érték legjobb előrejelzése a jelenlegi érték: $\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = X_n$.",
    ),
    p("Folytonos időben, egy $(\\mathcal{F}_t)_{t \\ge 0}$ filtrációval a harmadik feltétel így szól: $\\mathbb{E}[X_t \\mid \\mathcal{F}_s] = X_s$ minden $s \\le t$ esetén. Ha ehelyett $\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] \\ge X_n$, a folyamat **szubmartingál** (nekünk kedvező játék); $\\le$ esetén **szupermartingál** (ellenünk szóló játék, mint egy kaszinó, ahol a ház előnyben van)."),
    note("A martingál igazságos játék: mindazok ismeretében, amit eddig megfigyeltünk, a következő lépés várható változása nulla. A toronyszabály miatt ugyanez igaz tetszőleges számú lépésre, $\\mathbb{E}[X_m \\mid \\mathcal{F}_n] = X_n$, ha $m \\ge n$, és speciálisan $\\mathbb{E}[X_n] = \\mathbb{E}[X_0]$."),

    h("Példák a Brown-mozgásból"),
    p("Használjuk a természetes filtrációt, vagyis a pálya történetét. Minden példa egy sor a fenti szabályokkal."),
    list(
      "A szimmetrikus véletlen bolyongás martingál: $\\mathbb{E}[W_{n+1} \\mid \\mathcal{F}_n] = W_n + \\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = W_n + \\mathbb{E}[X_{n+1}] = W_n$, az ismert tényező kiemelésével, majd a függetlenséggel.",
      "A Brown-mozgás folytonos idejű martingál: $s < t$ esetén $W_t = W_s + (W_t - W_s)$, a növekmény független $\\mathcal{F}_s$-től és nulla várható értékű, így $\\mathbb{E}[W_t \\mid \\mathcal{F}_s] = W_s$.",
      "$W_t^2$ nem martingál. A $W_t^2 = W_s^2 + 2W_s(W_t - W_s) + (W_t - W_s)^2$ felbontásból tagonként előrejelezve $\\mathbb{E}[W_t^2 \\mid \\mathcal{F}_s] = W_s^2 + 0 + (t - s)$: felfelé sodródik, tehát szubmartingál.",
      "$W_t^2 - t$ martingál: a $t$ levonása éppen a felfelé irányuló tendenciát tünteti el.",
    ),
    p("Példa: tegyük fel, hogy $W_1 = 1$. A $W_4$ előrejelzése továbbra is 1, de a $W_4^2$ előrejelzése $1 + 3 = 4$, nem pedig 1. A pálya szóródása nő, a közepe viszont nem mozdul."),
    {
      kind: "check",
      id: "martingales/which-martingale",
      prompt: "Az alábbi folyamatok közül melyik martingál?",
      answer: { type: "choice", options: ["$W_t^2$", "$W_t^2 - t$", "$W_t + t$", "$e^{W_t}$"], correct: 1 },
      explain: "$\\mathbb{E}[W_t^2 \\mid \\mathcal{F}_s] = W_s^2 + (t - s)$, így $t$ levonása eltünteti a driftet. $W_t^2$ és $W_t + t$ felfelé sodródik, és $e^{W_t}$ is szubmartingál: martingállá csak az $e^{-t/2}$ szorzóval válik.",
    },

    h("Fogadási stratégiák"),
    p("Fogadjunk körről körre egy szabályos érmére. A $k$-adik kör előtt megválasztjuk a $H_k$ tétet, kizárólag az $\\mathcal{F}_{k-1}$ történet alapján (a tét **előrejelezhető**), és ezt megnyerjük vagy elveszítjük: a vagyonunk $H_k X_k$-val változik, ahol $X_k = \\pm 1$. $n$ kör után"),
    eq("V_n = V_0 + \\sum_{k=1}^{n} H_k X_k, \\qquad \\mathbb{E}[V_{n+1} \\mid \\mathcal{F}_n] = V_n + H_{n+1}\\,\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = V_n."),
    p("A tétet kiemeljük az előrejelzésből, mert az $n$-edik időpontban ismert, az érme feltételes várható értéke pedig nulla. Így minden ilyen stratégia vagyona ismét martingál (**martingáltranszformált**), és a várható értéke minden rögzített időpontban $V_0$ marad. Egy stratégia megváltoztathatja a kimenetelek eloszlásának alakját, de a várható értékét nem."),
    p("A híres **duplázó stratégia** 1-es téttel indul, és minden vesztés után megduplázza a tétet, így az első nyerés visszahozza az összes korábbi veszteséget, és még 1-et. Korlátozzuk legfeljebb 5 körre. Ha az első öt kör bármelyikében nyerünk, a nettó nyereség 1. Mind az öt kör elvesztésének valószínűsége $(\\tfrac12)^5 = \\tfrac1{32}$, és ekkor a veszteség $1 + 2 + 4 + 8 + 16 = 31$. A várható nyereség"),
    eq("\\tfrac{31}{32} \\cdot 1 + \\tfrac{1}{32} \\cdot (-31) = 0."),
    p("A stratégia $96{,}9\\%$ valószínűséggel nyer egy keveset, és $3{,}1\\%$ valószínűséggel veszít sokat. Körkorlát nélkül korlátlan hitelre volna szükség: 10 egymást követő vesztés után a következő tét 512, az addigi veszteség pedig 1023."),
    p("Az ábrán ezt a játékot magunk játszhatjuk, 100-as kezdő vagyonnal. Válasszunk stratégiát: állandó 1-es tét, duplázás vesztés után (legfeljebb 64-es tétig, utána újra 1), vagy a pillanatnyi vagyon 5%-a; egyik tét sem lehet nagyobb, mint ami a vagyonunk. Az „Egy dobás” egy kört játszik le, a „100 kör” százat, a vagyont lépcsős grafikonon rajzolva. Az „1000 játékos szimulálása” ezer játékost játszat le 100–100 kört a választott stratégiával, és hisztogramot rajzol a végső vagyonukról, az átlagot megjelölve; az „Újrakezdés” új dobásokkal indít. Hasonlítsuk össze a három stratégiát. Az átlagos végső vagyon minden esetben 100 közelében marad (a kijelző a 95%-os mintavételi sávval együtt mutatja), de állandó tétnél a játékosok nagyjából 46%-a végez nyereségben, és senki sem esik 60 körüli szint alá; duplázásnál nagyjából kétharmaduk végez nyereségben, néhányan viszont mindent elveszítenek; a vagyon 5%-ának feltételével pedig csak nagyjából 38%-uk végez nyereségben, miközben néhányan a kezdő vagyonuk többszörösével zárnak."),
    figure("martingale-betting"),
    p("Ugyanez a számítás hosszabb korláttal megmutatja, hogy több kör csak egy ritkább, de nagyobb veszteségbe tolja át a kockázatot."),
    {
      kind: "worked",
      title: "A duplázó stratégia legfeljebb hat körrel",
      steps: [
        { text: "Annak valószínűsége, százalékban, hogy mind a hat kört elveszíted.", tex: "\\left(\\tfrac12\\right)^6", result: { value: 1.5625, tolerance: 0.001, unit: "%" } },
        { text: "A teljes veszteség, ha mind a hat kör elvész.", tex: "1 + 2 + 4 + 8 + 16 + 32", result: { value: 63, tolerance: 0.01 } },
        { text: "Az 1 egységnyi nettó nyereség valószínűsége, százalékban.", tex: "1 - \\left(\\tfrac12\\right)^6", result: { value: 98.4375, tolerance: 0.001, unit: "%" } },
        { text: "A stratégia várható nyeresége.", tex: "\\left(1 - \\tfrac{1}{64}\\right) \\cdot 1 + \\tfrac{1}{64} \\cdot (-63)", result: { value: 0, tolerance: 0.001 } },
      ],
    },

    h("Megállás és az opcionális megállítás tétele"),
    p("Egy játékos ritkán játszik rögzített számú kört; akkor áll meg, amikor valami történik. A $\\tau$ **megállási idő** olyan véletlen időpont, amelynél a döntés arról, hogy az $n$-edik időpontig megállunk-e, csak az addigi információt használja: $\\{\\tau \\le n\\} \\in \\mathcal{F}_n$ minden $n$-re. Az „állj meg az első nyerésnél” megállási idő; az „állj meg közvetlenül a legnagyobb veszteség előtt” nem az, mert a jövőt kellene hozzá ismerni."),
    p("Egy martingált megállási időnél megállítva ismét martingált kapunk: az $X_{\\tau \\wedge n}$ megállított folyamat martingál, így minden rögzített $n$-re $\\mathbb{E}[X_{\\tau \\wedge n}] = \\mathbb{E}[X_0]$. Az $n \\to \\infty$ határátmenethez viszont feltétel kell. Az **opcionális megállítás tétele** szerint ha $X$ martingál és $\\tau$ megállási idő, akkor"),
    eq("\\mathbb{E}[X_\\tau] = \\mathbb{E}[X_0]"),
    p("teljesül az alábbi feltételek bármelyike mellett:"),
    list(
      "$\\tau$ korlátos: $\\tau \\le N$ egy rögzített $N$ számra;",
      "$\\tau < \\infty$ majdnem biztosan, és a megállított folyamat dominált: $|X_{\\tau \\wedge n}| \\le K$ minden $n$-re, egy rögzített $K$-val (általánosabban: az $X_{\\tau \\wedge n}$ család egyenletesen integrálható);",
      "$\\mathbb{E}[\\tau] < \\infty$, és a növekmények korlátosak: $|X_{n+1} - X_n| \\le c$.",
    ),
    p("Példa (a játékos csődje): egy szimmetrikus bolyongás 0-ból indul, és a $\\tau$ időpontban áll meg, amikor először eléri a $+2$-t vagy a $-3$-at. A megállított bolyongás $-3$ és $+2$ között marad, így a második feltétel teljesül, és $0 = \\mathbb{E}[W_\\tau] = 2\\pi + (-3)(1 - \\pi)$, ahol $\\pi$ annak valószínűsége, hogy előbb a $+2$-t éri el. Innen $\\pi = 3/5 = 0{,}6$, kombinatorika nélkül."),
    p("A körkorlát nélküli duplázó stratégia megmutatja, miért számítanak a feltételek. Legyen $\\tau$ az első nyerés időpontja. Ez megállási idő, 1 valószínűséggel véges, és $V_\\tau = V_0 + 1$, így $\\mathbb{E}[V_\\tau] = V_0 + 1 \\ne V_0$. Ez nem mond ellent a tételnek: $\\tau$ nem korlátos, és a nyerés előtti $V_0 - (2^k - 1)$ vagyon alulról nem korlátos, így egyik feltétel sem teljesül. Az ötkörös korláttal $\\tau \\wedge 5$ korlátos, és a várható nyereség 0, ahogy fent kiszámoltuk."),
    {
      kind: "check",
      id: "martingales/optional-stopping",
      prompt: "A korlátlan duplázó stratégia az első nyerésnél áll meg, ami 1 valószínűséggel bekövetkezik, és ekkor pontosan 1-et nyert. Miért nem mond ez ellent az opcionális megállítás tételének?",
      answer: {
        type: "choice",
        options: [
          "Az első nyerés nem megállási idő.",
          "A megállási idő nem korlátos, és a megállás előtti vagyon alulról nem korlátos, így a tétel egyik feltétele sem teljesül.",
          "A tét duplázása után az érme már nem szabályos.",
          "Az első nyerés pozitív valószínűséggel soha nem következik be.",
        ],
        correct: 1,
      },
      explain: "Az „állj meg az első nyerésnél” csak a múltat használja, tehát megállási idő, és majdnem biztosan véges. A korlátosság hiányzik: $\\tau$-nak nincs felső korlátja, a nyerés előtti $2^k - 1$ veszteség pedig nem dominált, így $\\mathbb{E}[V_\\tau] = \\mathbb{E}[V_0]$ nem kell, hogy teljesüljön.",
    },

    h("Doob maximálegyenlőtlensége"),
    p("Egy martingál nemcsak azt korlátozza, hol ér véget, hanem azt is, milyen messzire kalandozhat el a pályája az $n$-edik időpontig. Egy $X$ martingálra és tetszőleges $\\lambda > 0$-ra **Doob maximálegyenlőtlensége** szerint"),
    eq("\\mathbb{P}\\Big(\\max_{k \\le n} |X_k| \\ge \\lambda\\Big) \\le \\frac{\\mathbb{E}|X_n|}{\\lambda}, \\qquad \\mathbb{E}\\Big[\\max_{k \\le n} X_k^2\\Big] \\le 4\\,\\mathbb{E}[X_n^2]."),
    p("A második alak az $L^2$-változat. Mindkettő érvényes folytonos pályájú martingálokra, például a Brown-mozgásra is, a maximum helyett a $[0, t]$-n vett szuprémummal. Példa: az érmedobásos bolyongásra $n = 100$ mellett $\\mathbb{E}|W_{100}| \\le \\sqrt{\\mathbb{E}[W_{100}^2]} = 10$, így annak valószínűsége, hogy a bolyongás 100 lépésen belül valaha 30 távolságra kerül a kiindulóponttól, legfeljebb $10/30 = 1/3$, és $\\mathbb{E}[\\max_{k \\le 100} W_k^2] \\le 400$. Az ilyen egyenlőtlenségek teszik jól kezelhetővé a martingálok határértékeit, később pedig az Itô-integrált."),

    h("Árak mint martingálok"),
    p("A martingálok az arbitrázsmentes árazás nyelve. A „Kockázatsemleges valószínűségek” című leckében a részvény $\\mathbb{Q}$ alatt a kockázatmentes kamatot hozta várhatóan, ami pontosan azt jelenti, hogy a diszkontált $e^{-rt}S_t$ ár martingál $\\mathbb{Q}$ alatt. Egy későbbi, a mértékcseréről szóló lecke ugyanebben a témakörben megmutatja, hogyan lehet a valós $\\mathbb{P}$ mértékről, amely alatt ez nem teljesül, áttérni a $\\mathbb{Q}$ mértékre, amely alatt igen. Egy ár ekkor egyszerűen a diszkontált kifizetés feltételes várható értéke."),

    h("Összefoglalás"),
    list(
      "$\\mathbb{E}[X \\mid \\mathcal{G}]$ az a $\\mathcal{G}$-mérhető valószínűségi változó, amelynek átlaga minden $\\mathcal{G}$-beli eseményen megegyezik $X$ átlagával; érvényes rá a linearitás, a toronyszabály, az ismert tényező kiemelése és a függetlenségi szabály.",
      "Az $\\mathbb{F}$-re nézve martingál adaptált, integrálható, és $\\mathbb{E}[X_{n+1} \\mid \\mathcal{F}_n] = X_n$ (folytonos időben $\\mathbb{E}[X_t \\mid \\mathcal{F}_s] = X_s$). $W_t$ és $W_t^2 - t$ martingál.",
      "Igazságos játékon előrejelezhető tétekkel fogadva martingáltranszformáltat kapunk: a várható vagyon rögzített időpontban sosem változik.",
      "Az opcionális megállításhoz, $\\mathbb{E}[X_\\tau] = \\mathbb{E}[X_0]$, korlátos megállási idő, dominált megállított folyamat, vagy $\\mathbb{E}[\\tau] < \\infty$ és korlátos növekmények kellenek; a korlátlan duplázás mindhármat megsérti.",
      "Doob maximálegyenlőtlensége az egész pályát korlátozza: $\\mathbb{P}(\\max_{k \\le n}|X_k| \\ge \\lambda) \\le \\mathbb{E}|X_n|/\\lambda$.",
    ),
    note("A következő lecke, „A Brown-mozgás tulajdonságai”, részletesen vizsgálja a $W_t$ pályáit, az itt talált $W_t$ és $W_t^2 - t$ martingálok segítségével."),
    lab("/brownian-motion", "Szimuláljunk Brown-pályákat, és figyeljük a szóródásuk növekedését a Brown-mozgás laborban"),
  ],
};
