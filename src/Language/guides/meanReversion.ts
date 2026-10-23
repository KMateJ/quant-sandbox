import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const meanReversion: GuideLessonContent = {
  en: [
    p("Brownian motion from \"Random walks and Brownian motion\" and the stock price model built on it wander without limit: their variance grows with the horizon, and nothing pulls them back. Interest rates, volatility and credit spreads behave differently. They fluctuate, but over years they tend to return to a typical level. This lesson builds the standard model of such a process, solves it exactly with the tools of \"Itô's lemma\", and applies it to the short interest rate in the Vasicek model."),

    h("The Ornstein–Uhlenbeck process"),
    p("Let $X_t$ be the quantity of interest, for example an interest rate. The **Ornstein–Uhlenbeck process** is the Itô process"),
    eq("dX_t = \\kappa\\,(\\theta - X_t)\\,dt + \\sigma\\,dW_t,"),
    p("with three constant parameters:"),
    list(
      "$\\theta$ is the **long-run level**, the value the process is pulled towards.",
      "$\\kappa > 0$ is the **speed of mean reversion**: how strongly the gap $\\theta - X_t$ is closed per unit of time.",
      "$\\sigma > 0$ is the volatility: the size of the random shocks, as in \"Itô's lemma\".",
    ),
    p("The drift has the sign of the gap. Above $\\theta$ the drift is negative and pushes the process down; below $\\theta$ it is positive and pushes it up. Think of a ball attached to a spring in a stream of random kicks: the further it is pulled from its rest point, the harder the spring pulls back. Unlike geometric Brownian motion, the volatility here does not depend on the level, so the shocks have the same size everywhere."),

    h("The deterministic part"),
    p("Switch off the noise, $\\sigma = 0$. The equation becomes the ordinary differential equation $dx/dt = \\kappa(\\theta - x)$, whose solution is"),
    eq("x(t) = \\theta + (x_0 - \\theta)\\,e^{-\\kappa t}."),
    p("The gap to $\\theta$ shrinks exponentially. The time after which half of the gap is left solves $e^{-\\kappa t} = 1/2$ and is called the **half-life**:"),
    eq("t_{1/2} = \\frac{\\ln 2}{\\kappa}."),
    p("It does not depend on how large the gap is. With $\\kappa = 0.5$ the half-life is $\\ln 2 / 0.5 \\approx 1.39$ years; with $\\kappa = 5$ it is about 35 trading days."),

    {
      kind: "check",
      id: "mean-reversion/half-life",
      prompt: "An interest rate follows an Ornstein–Uhlenbeck process with $\\kappa = 2$ per year. How many years does it take for the expected gap to $\\theta$ to halve?",
      answer: { type: "number", value: 0.347, tolerance: 0.005, unit: "years" },
      explain: "$t_{1/2} = \\ln 2/\\kappa = 0.693/2 \\approx 0.347$ years, a little over four months, whatever the size of the gap.",
    },

    h("Exact solution"),
    p("The trick is to remove the pull towards $\\theta$ by a change of variable. Apply Itô's lemma to $Y_t = f(t, X_t) = e^{\\kappa t} X_t$, with $\\partial f/\\partial t = \\kappa e^{\\kappa t} x$, $\\partial f/\\partial x = e^{\\kappa t}$ and $\\partial^2 f/\\partial x^2 = 0$. Since the second derivative is zero, there is no Itô correction:"),
    eq("dY_t = \\kappa e^{\\kappa t} X_t\\,dt + e^{\\kappa t}\\big(\\kappa(\\theta - X_t)\\,dt + \\sigma\\,dW_t\\big) = \\kappa\\theta\\,e^{\\kappa t}\\,dt + \\sigma e^{\\kappa t}\\,dW_t."),
    p("The terms with $X_t$ cancel, and the right-hand side no longer depends on $Y$. Add up the increments over $[0, t]$:"),
    eq("e^{\\kappa t} X_t = X_0 + \\theta\\,\\big(e^{\\kappa t} - 1\\big) + \\sigma \\int_0^t e^{\\kappa s}\\,dW_s."),
    p("Multiplying by $e^{-\\kappa t}$ gives the solution:"),
    eq("X_t = \\theta + (X_0 - \\theta)\\,e^{-\\kappa t} + \\sigma \\int_0^t e^{-\\kappa (t-s)}\\,dW_s."),
    p("The first two terms are the deterministic path from above. The integral adds up the shocks, each weighted by $e^{-\\kappa(t-s)}$: a shock that happened long ago has mostly been pulled back and counts little."),

    h("Mean, variance and stationary distribution"),
    p("The integral of a deterministic function against $dW$ is normal with mean zero, and by the **Itô isometry** its variance is the integral of the squared weight: $\\operatorname{Var}\\big(\\int_0^t g(s)\\,dW_s\\big) = \\int_0^t g(s)^2\\,ds$. With $g(s) = \\sigma e^{-\\kappa(t-s)}$ this gives"),
    eq("\\mathbb{E}[X_t] = \\theta + (X_0 - \\theta)\\,e^{-\\kappa t}, \\qquad \\operatorname{Var}(X_t) = \\frac{\\sigma^2}{2\\kappa}\\big(1 - e^{-2\\kappa t}\\big)."),
    p("So $X_t$ is normally distributed for every $t$. As $t \\to \\infty$ the mean tends to $\\theta$ and the variance stops growing. Compare Brownian motion, whose variance $\\sigma^2 t$ grows forever."),
    note("Stationary distribution of the Ornstein–Uhlenbeck process: $X_\\infty \\sim N\\big(\\theta,\\ \\sigma^2/(2\\kappa)\\big)$. Faster mean reversion (larger $\\kappa$) means a narrower long-run spread around $\\theta$."),

    {
      kind: "check",
      id: "mean-reversion/stationary-spread",
      prompt: "Double the speed of mean reversion $\\kappa$ and keep $\\sigma$ fixed. What happens to the standard deviation of the stationary distribution?",
      answer: { type: "choice", options: ["It doubles.", "It halves.", "It is divided by $\\sqrt{2}$.", "It does not change."], correct: 2 },
      explain: "The stationary variance is $\\sigma^2/(2\\kappa)$, so the standard deviation is $\\sigma/\\sqrt{2\\kappa}$. Doubling $\\kappa$ divides it by $\\sqrt{2}$: a stronger pull keeps the process closer to $\\theta$.",
    },

    h("Exact simulation and the AR(1) form"),
    p("The same calculation over one step of length $\\Delta t$, started from the current value, gives an exact simulation scheme with no discretisation error. With $Z \\sim N(0,1)$ drawn independently at each step:"),
    eq("X_{t+\\Delta t} = \\theta + (X_t - \\theta)\\,e^{-\\kappa\\Delta t} + \\sigma\\sqrt{\\frac{1 - e^{-2\\kappa\\Delta t}}{2\\kappa}}\\;Z."),
    p("Sampled at a fixed step, the process is a first-order autoregression, AR(1): $X_{n+1} = a + \\phi X_n + \\varepsilon_{n+1}$ with $\\phi = e^{-\\kappa\\Delta t}$ and $a = \\theta(1 - \\phi)$. Regressing observed values on their previous values therefore estimates the parameters: $\\kappa = -\\ln\\phi / \\Delta t$ and $\\theta = a/(1-\\phi)$."),

    h("Worked example"),
    p("Take $\\kappa = 0.5$, $\\theta = 4\\%$, $\\sigma = 1\\%$ and a starting level $X_0 = 8\\%$, with time in years."),
    list(
      "Half-life: $\\ln 2 / 0.5 \\approx 1.39$ years.",
      "After 1 year: mean $4\\% + 4\\% \\cdot e^{-0.5} \\approx 6.43\\%$, standard deviation $0.01\\sqrt{(1 - e^{-1})/1} \\approx 0.80\\%$.",
      "After 5 years: mean $4\\% + 4\\% \\cdot e^{-2.5} \\approx 4.33\\%$, standard deviation $\\approx 0.997\\%$.",
      "Stationary standard deviation: $\\sigma/\\sqrt{2\\kappa} = 0.01/\\sqrt{1} = 1\\%$.",
    ),
    p("After five years the starting level is almost forgotten: the mean is close to $\\theta$ and the spread is already 99.7% of its long-run value."),
    p("The figure fixes $\\theta = 4\\%$ and $\\sigma = 1\\%$ over a horizon of 5 years. Sliders set the speed of mean reversion $\\kappa$ (0.1 to 5) and the starting level $X_0$ (0% to 10%), and \"New paths\" draws fresh paths. The chart shows several simulated paths, the expected path $\\theta + (X_0 - \\theta)e^{-\\kappa t}$ and bands at $\\pm 2$ standard deviations. The readouts give the half-life, the stationary standard deviation $\\sigma/\\sqrt{2\\kappa}$, the expected level after 5 years and the 5-year zero-coupon yield in the Vasicek model with $r_0 = X_0$. Raise $\\kappa$ and the paths snap to $\\theta$ while the band narrows; lower it towards 0.1 and the paths look almost like Brownian motion. Then start far from $\\theta$, at 0% or 10%, and watch the expected path decay."),
    figure("ou-paths"),

    h("The Vasicek model"),
    p("The **short rate** $r_t$ is the continuously compounded rate for borrowing over an instant. The **Vasicek model** assumes that it follows an Ornstein–Uhlenbeck process, $dr_t = \\kappa(\\theta - r_t)\\,dt + \\sigma\\,dW_t$, under the risk-neutral measure $\\mathbb{Q}$. A **zero-coupon bond** pays 1 at time $T$, and its price is the expected discount factor along the random path of the short rate, $P(0,T) = \\mathbb{E}^{\\mathbb{Q}}\\big[e^{-\\int_0^T r_s\\,ds}\\big]$. Because the integral of a normal process is normal, this expectation has a closed form:"),
    eq("P(0,T) = A(T)\\,e^{-B(T)\\,r_0}, \\qquad B(T) = \\frac{1 - e^{-\\kappa T}}{\\kappa},"),
    eq("\\ln A(T) = \\left(\\theta - \\frac{\\sigma^2}{2\\kappa^2}\\right)\\big(B(T) - T\\big) - \\frac{\\sigma^2 B(T)^2}{4\\kappa}."),
    p("$B(T)$ measures how much the current short rate matters: for short maturities it is close to $T$, while for long maturities it levels off at $1/\\kappa$, because $r_0$ is forgotten. The continuously compounded zero-coupon yield is $y(T) = -\\ln P(0,T)/T$."),
    p("In the example above with $r_0 = 8\\%$ and $T = 5$: $B(5) = (1 - e^{-2.5})/0.5 \\approx 1.836$, $A(5) \\approx 0.8815$, so $P(0,5) \\approx 0.8815\\,e^{-1.836 \\cdot 0.08} \\approx 0.7611$ and the 5-year yield is $-\\ln(0.7611)/5 \\approx 5.46\\%$. The yield lies between $r_0$ and $\\theta$, since the market expects the rate to fall back towards 4%."),
    p("As $T$ grows the yield tends to $\\theta - \\sigma^2/(2\\kappa^2)$, here $3.98\\%$. If $r_0$ is below this level the model produces a rising curve, if above an inverted (falling) curve, and for $r_0$ just above it a slightly humped one that rises briefly before falling. The lesson \"Spot rates, forward rates and the yield curve\" describes these shapes as observed in the market; the Vasicek model can produce only these few, which is why practitioners often fit richer curves directly. The Yield Curve lab shows such market curves."),
    p("The main drawback is that a normal short rate can become negative with positive probability. The Cox–Ingersoll–Ross (CIR) model avoids this by making the volatility proportional to $\\sqrt{r_t}$."),

    {
      kind: "worked",
      title: "The OU distribution after one year",
      steps: [
        { text: "With $\\kappa = 0.5$, $\\theta = 4\\%$, $X_0 = 8\\%$, the expected level after one year (in %).", tex: "\\theta + (X_0 - \\theta)e^{-\\kappa} = 4 + 4e^{-0.5}", result: { value: 6.43, tolerance: 0.01 } },
        { text: "Standard deviation after one year with $\\sigma = 1\\%$ (in %).", tex: "\\sigma\\sqrt{\\frac{1 - e^{-2\\kappa}}{2\\kappa}} = 1 \\cdot \\sqrt{1 - e^{-1}}", result: { value: 0.795, tolerance: 0.001 } },
        { text: "Half-life of the expected gap, in years.", tex: "t_{1/2} = \\ln 2/\\kappa", result: { value: 1.386, tolerance: 0.001 } },
      ],
    },

    h("Summary"),
    list(
      "The Ornstein–Uhlenbeck process $dX = \\kappa(\\theta - X)\\,dt + \\sigma\\,dW$ is pulled towards the long-run level $\\theta$ with speed $\\kappa$; the expected gap halves every $\\ln 2/\\kappa$.",
      "Itô's lemma applied to $e^{\\kappa t}X_t$ gives the exact solution; $X_t$ is normal with mean $\\theta + (X_0 - \\theta)e^{-\\kappa t}$ and variance $\\tfrac{\\sigma^2}{2\\kappa}(1 - e^{-2\\kappa t})$.",
      "The variance stays bounded and the stationary distribution is $N(\\theta, \\sigma^2/(2\\kappa))$; sampled at a fixed step the process is an AR(1).",
      "In the Vasicek model the short rate is an OU process and $P(0,T) = A(T)e^{-B(T)r_0}$ with $B(T) = (1 - e^{-\\kappa T})/\\kappa$; rates can turn negative.",
    ),
    lab("/ito-process", "Simulate Itô processes and compare their drift and spread in the Itô Process lab"),
  ],

  hu: [
    p("A „Véletlen bolyongás és Brown-mozgás” lecke Brown-mozgása és a rá épülő részvényár-modell korlátlanul elvándorolhat: a varianciájuk az időtávval nő, és semmi sem húzza vissza őket. A kamatlábak, a volatilitás és a hitelfelárak másképp viselkednek. Ingadoznak, de évek alatt jellemzően visszatérnek egy szokásos szintre. Ez a lecke felépíti az ilyen folyamatok standard modelljét, „Az Itô-lemma” eszközeivel pontosan megoldja, majd a Vasicek-modellben a rövid kamatlábra alkalmazza."),

    h("Az Ornstein–Uhlenbeck-folyamat"),
    p("Legyen $X_t$ a vizsgált mennyiség, például egy kamatláb. Az **Ornstein–Uhlenbeck-folyamat** az alábbi Itô-folyamat:"),
    eq("dX_t = \\kappa\\,(\\theta - X_t)\\,dt + \\sigma\\,dW_t,"),
    p("három állandó paraméterrel:"),
    list(
      "$\\theta$ a **hosszú távú szint**, amely felé a folyamatot húzza a drift.",
      "$\\kappa > 0$ a **visszahúzási sebesség**: időegységenként mennyire zárja a $\\theta - X_t$ rést.",
      "$\\sigma > 0$ a volatilitás: a véletlen sokkok mérete, ahogy „Az Itô-lemma” leckében.",
    ),
    p("A drift előjele a rés előjele. $\\theta$ fölött a drift negatív és lefelé tolja a folyamatot, $\\theta$ alatt pozitív és felfelé. Gondolj egy rugóra kötött golyóra, amelyet folyamatosan véletlen lökések érnek: minél messzebb kerül a nyugalmi helyzetétől, annál erősebben húzza vissza a rugó. A geometriai Brown-mozgással ellentétben itt a volatilitás nem függ a szinttől, a sokkok mindenhol ugyanakkorák. Ezt a viselkedést nevezzük **átlaghoz való visszahúzásnak**."),

    h("A determinisztikus rész"),
    p("Kapcsoljuk ki a zajt, $\\sigma = 0$. Ekkor a $dx/dt = \\kappa(\\theta - x)$ közönséges differenciálegyenletet kapjuk, amelynek megoldása"),
    eq("x(t) = \\theta + (x_0 - \\theta)\\,e^{-\\kappa t}."),
    p("A $\\theta$-tól való távolság exponenciálisan csökken. Azt az időt, amely után a rés fele marad meg, az $e^{-\\kappa t} = 1/2$ egyenlet adja; ez a **felezési idő**:"),
    eq("t_{1/2} = \\frac{\\ln 2}{\\kappa}."),
    p("Nem függ a rés nagyságától. $\\kappa = 0{,}5$ mellett a felezési idő $\\ln 2 / 0{,}5 \\approx 1{,}39$ év, $\\kappa = 5$ mellett nagyjából 35 kereskedési nap."),

    {
      kind: "check",
      id: "mean-reversion/half-life",
      prompt: "Egy kamatláb $\\kappa = 2$ (évente) paraméterű Ornstein–Uhlenbeck-folyamatot követ. Hány év alatt feleződik meg a $\\theta$-tól való várható eltérés?",
      answer: { type: "number", value: 0.347, tolerance: 0.005, unit: "év" },
      explain: "$t_{1/2} = \\ln 2/\\kappa = 0{,}693/2 \\approx 0{,}347$ év, valamivel több mint négy hónap, akármekkora is az eltérés.",
    },

    h("Egzakt megoldás"),
    p("A fogás az, hogy változócserével eltüntetjük a $\\theta$ felé húzó tagot. Alkalmazzuk az Itô-lemmát az $Y_t = f(t, X_t) = e^{\\kappa t} X_t$ folyamatra, ahol $\\partial f/\\partial t = \\kappa e^{\\kappa t} x$, $\\partial f/\\partial x = e^{\\kappa t}$ és $\\partial^2 f/\\partial x^2 = 0$. Mivel a második derivált nulla, Itô-korrekció nincs:"),
    eq("dY_t = \\kappa e^{\\kappa t} X_t\\,dt + e^{\\kappa t}\\big(\\kappa(\\theta - X_t)\\,dt + \\sigma\\,dW_t\\big) = \\kappa\\theta\\,e^{\\kappa t}\\,dt + \\sigma e^{\\kappa t}\\,dW_t."),
    p("Az $X_t$-t tartalmazó tagok kiesnek, a jobb oldal már nem függ $Y$-tól. Összegezzük a növekményeket a $[0, t]$ intervallumon:"),
    eq("e^{\\kappa t} X_t = X_0 + \\theta\\,\\big(e^{\\kappa t} - 1\\big) + \\sigma \\int_0^t e^{\\kappa s}\\,dW_s."),
    p("$e^{-\\kappa t}$-vel szorozva kapjuk a megoldást:"),
    eq("X_t = \\theta + (X_0 - \\theta)\\,e^{-\\kappa t} + \\sigma \\int_0^t e^{-\\kappa (t-s)}\\,dW_s."),
    p("Az első két tag a fenti determinisztikus pálya. Az integrál összegzi a sokkokat, mindegyiket $e^{-\\kappa(t-s)}$ súllyal: a régen történt sokkot a folyamat már nagyrészt visszahúzta, ezért alig számít."),

    h("Várható érték, variancia és stacionárius eloszlás"),
    p("Egy determinisztikus függvény $dW$ szerinti integrálja nulla várható értékű normális változó, és az **Itô-izometria** szerint a varianciája a súly négyzetének integrálja: $\\operatorname{Var}\\big(\\int_0^t g(s)\\,dW_s\\big) = \\int_0^t g(s)^2\\,ds$. A $g(s) = \\sigma e^{-\\kappa(t-s)}$ választással"),
    eq("\\mathbb{E}[X_t] = \\theta + (X_0 - \\theta)\\,e^{-\\kappa t}, \\qquad \\operatorname{Var}(X_t) = \\frac{\\sigma^2}{2\\kappa}\\big(1 - e^{-2\\kappa t}\\big)."),
    p("$X_t$ tehát minden $t$-re normális eloszlású. Ha $t \\to \\infty$, a várható érték $\\theta$-hoz tart, a variancia pedig korlátos marad. A Brown-mozgás $\\sigma^2 t$ varianciája ezzel szemben a végtelenségig nő."),
    note("Az Ornstein–Uhlenbeck-folyamat stacionárius eloszlása: $X_\\infty \\sim N\\big(\\theta,\\ \\sigma^2/(2\\kappa)\\big)$. Gyorsabb visszahúzás (nagyobb $\\kappa$) szűkebb hosszú távú szóródást jelent $\\theta$ körül."),

    {
      kind: "check",
      id: "mean-reversion/stationary-spread",
      prompt: "Kétszeresére növeljük a visszahúzás $\\kappa$ sebességét, $\\sigma$ változatlan. Mi történik a stacionárius eloszlás szórásával?",
      answer: { type: "choice", options: ["A kétszeresére nő.", "A felére csökken.", "A $\\sqrt{2}$-ed részére csökken.", "Nem változik."], correct: 2 },
      explain: "A stacionárius variancia $\\sigma^2/(2\\kappa)$, a szórás tehát $\\sigma/\\sqrt{2\\kappa}$. Ha $\\kappa$ kétszeres, a szórás $\\sqrt{2}$-vel osztódik: az erősebb visszahúzás közelebb tartja a folyamatot $\\theta$-hoz.",
    },

    h("Egzakt szimuláció és az AR(1) alak"),
    p("Ugyanez a számolás egyetlen $\\Delta t$ hosszú lépésre, az aktuális értékből indulva, diszkretizációs hiba nélküli, egzakt szimulációs sémát ad. Minden lépésben egy független $Z \\sim N(0,1)$ húzással:"),
    eq("X_{t+\\Delta t} = \\theta + (X_t - \\theta)\\,e^{-\\kappa\\Delta t} + \\sigma\\sqrt{\\frac{1 - e^{-2\\kappa\\Delta t}}{2\\kappa}}\\;Z."),
    p("Rögzített lépésközzel mintavételezve a folyamat elsőrendű autoregresszió, AR(1): $X_{n+1} = a + \\phi X_n + \\varepsilon_{n+1}$, ahol $\\phi = e^{-\\kappa\\Delta t}$ és $a = \\theta(1 - \\phi)$. A megfigyelt értékeket az előző értékükre regresszálva így megbecsülhetők a paraméterek: $\\kappa = -\\ln\\phi / \\Delta t$ és $\\theta = a/(1-\\phi)$."),

    h("Számpélda"),
    p("Legyen $\\kappa = 0{,}5$, $\\theta = 4\\%$, $\\sigma = 1\\%$, a kezdőszint $X_0 = 8\\%$, az idő években mérve."),
    list(
      "Felezési idő: $\\ln 2 / 0{,}5 \\approx 1{,}39$ év.",
      "1 év után: várható érték $4\\% + 4\\% \\cdot e^{-0{,}5} \\approx 6{,}43\\%$, szórás $0{,}01\\sqrt{(1 - e^{-1})/1} \\approx 0{,}80\\%$.",
      "5 év után: várható érték $4\\% + 4\\% \\cdot e^{-2{,}5} \\approx 4{,}33\\%$, szórás $\\approx 0{,}997\\%$.",
      "Stacionárius szórás: $\\sigma/\\sqrt{2\\kappa} = 0{,}01/\\sqrt{1} = 1\\%$.",
    ),
    p("Öt év után a kezdőszint szinte teljesen feledésbe merül: a várható érték közel van $\\theta$-hoz, a szórás pedig már a hosszú távú értékének 99,7%-a."),
    p("Az ábrán $\\theta = 4\\%$ és $\\sigma = 1\\%$ rögzített, az időtáv 5 év. Csúszkákkal a $\\kappa$ visszahúzási sebesség (0,1 és 5 között) és az $X_0$ kezdőszint (0% és 10% között) állítható, az „Új pályák” gomb új pályákat sorsol. A grafikon több szimulált pályát, a $\\theta + (X_0 - \\theta)e^{-\\kappa t}$ várható pályát és a $\\pm 2$ szórásnyi sávokat mutatja. A kijelzők a felezési időt, a $\\sigma/\\sqrt{2\\kappa}$ stacionárius szórást, az 5 év utáni várható szintet és a Vasicek-modell 5 éves zérókupon-hozamát adják $r_0 = X_0$ mellett. Növeld $\\kappa$-t: a pályák $\\theta$-hoz tapadnak, a sáv szűkül; vidd 0,1 felé, és a pályák szinte Brown-mozgásnak látszanak. Aztán indítsd a folyamatot $\\theta$-tól messze, 0%-ról vagy 10%-ról, és figyeld a várható pálya lecsengését."),
    figure("ou-paths"),

    h("A Vasicek-modell"),
    p("A **rövid kamatláb** $r_t$ egy pillanatnyi időtartamra szóló hitel folytonos kamatlába. A **Vasicek-modell** feltevése, hogy a $\\mathbb{Q}$ kockázatsemleges mérték alatt Ornstein–Uhlenbeck-folyamatot követ: $dr_t = \\kappa(\\theta - r_t)\\,dt + \\sigma\\,dW_t$. Egy **zérókupon-kötvény** a $T$ időpontban 1-et fizet, ára pedig a rövid kamat véletlen pályája menti diszkontfaktor várható értéke, $P(0,T) = \\mathbb{E}^{\\mathbb{Q}}\\big[e^{-\\int_0^T r_s\\,ds}\\big]$. Mivel egy normális folyamat integrálja is normális, ez a várható érték zárt alakban felírható:"),
    eq("P(0,T) = A(T)\\,e^{-B(T)\\,r_0}, \\qquad B(T) = \\frac{1 - e^{-\\kappa T}}{\\kappa},"),
    eq("\\ln A(T) = \\left(\\theta - \\frac{\\sigma^2}{2\\kappa^2}\\right)\\big(B(T) - T\\big) - \\frac{\\sigma^2 B(T)^2}{4\\kappa}."),
    p("$B(T)$ azt méri, mennyit számít a mai rövid kamat: rövid lejáratra közel van $T$-hez, hosszú lejáratra $1/\\kappa$-hoz tart, mert $r_0$ hatása elhalványul. A folytonos zérókupon-hozam $y(T) = -\\ln P(0,T)/T$."),
    p("A fenti példában $r_0 = 8\\%$ és $T = 5$ mellett: $B(5) = (1 - e^{-2{,}5})/0{,}5 \\approx 1{,}836$, $A(5) \\approx 0{,}8815$, így $P(0,5) \\approx 0{,}8815\\,e^{-1{,}836 \\cdot 0{,}08} \\approx 0{,}7611$, az 5 éves hozam pedig $-\\ln(0{,}7611)/5 \\approx 5{,}46\\%$. A hozam $r_0$ és $\\theta$ közé esik, mert a piac a kamat 4% felé való visszatérésére számít."),
    p("$T$ növelésével a hozam $\\theta - \\sigma^2/(2\\kappa^2)$-hez tart, itt $3{,}98\\%$-hoz. Ha $r_0$ ez alatt van, a modell emelkedő görbét ad, ha fölötte, akkor fordított (csökkenő) görbét, közvetlenül fölötte pedig enyhén púpos, előbb kissé emelkedő, majd csökkenő görbét. Az „Azonnali kamatok, forward kamatok és a hozamgörbe” lecke ezeket az alakokat a piacon megfigyelhető formában mutatja be; a Vasicek-modell csak ezt a néhány alakot tudja előállítani, ezért a gyakorlatban a görbét gyakran közvetlenül, rugalmasabb függvénnyel illesztik. Ilyen piaci görbéket a Hozamgörbe labor mutat."),
    p("A modell fő hátránya, hogy a normális eloszlású rövid kamat pozitív valószínűséggel negatívvá válhat. A Cox–Ingersoll–Ross- (CIR-) modell ezt úgy kerüli el, hogy a volatilitást $\\sqrt{r_t}$-vel arányosnak veszi."),

    {
      kind: "worked",
      title: "Az OU-eloszlás egy év után",
      steps: [
        { text: "$\\kappa = 0{,}5$, $\\theta = 4\\%$, $X_0 = 8\\%$ mellett a várható szint egy év után (%-ban).", tex: "\\theta + (X_0 - \\theta)e^{-\\kappa} = 4 + 4e^{-0{,}5}", result: { value: 6.43, tolerance: 0.01 } },
        { text: "A szórás egy év után $\\sigma = 1\\%$ mellett (%-ban).", tex: "\\sigma\\sqrt{\\frac{1 - e^{-2\\kappa}}{2\\kappa}} = 1 \\cdot \\sqrt{1 - e^{-1}}", result: { value: 0.795, tolerance: 0.001 } },
        { text: "A várható eltérés felezési ideje, években.", tex: "t_{1/2} = \\ln 2/\\kappa", result: { value: 1.386, tolerance: 0.001 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "A $dX = \\kappa(\\theta - X)\\,dt + \\sigma\\,dW$ Ornstein–Uhlenbeck-folyamatot $\\kappa$ sebességgel húzza a $\\theta$ hosszú távú szint; a várható rés $\\ln 2/\\kappa$ időnként feleződik.",
      "Az Itô-lemmát $e^{\\kappa t}X_t$-re alkalmazva kapjuk az egzakt megoldást; $X_t$ normális, várható értéke $\\theta + (X_0 - \\theta)e^{-\\kappa t}$, varianciája $\\tfrac{\\sigma^2}{2\\kappa}(1 - e^{-2\\kappa t})$.",
      "A variancia korlátos marad, a stacionárius eloszlás $N(\\theta, \\sigma^2/(2\\kappa))$; rögzített lépésközzel mintavételezve a folyamat AR(1).",
      "A Vasicek-modellben a rövid kamat OU-folyamat, és $P(0,T) = A(T)e^{-B(T)r_0}$, ahol $B(T) = (1 - e^{-\\kappa T})/\\kappa$; a kamat negatívvá válhat.",
    ),
    lab("/ito-process", "Szimulálj Itô-folyamatokat, és hasonlítsd össze a driftjüket és szóródásukat az Itô-folyamat laborban"),
  ],
};
