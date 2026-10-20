import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const gbm: GuideLessonContent = {
  en: [
    p("This lesson builds the standard continuous-time model of a stock price, **geometric Brownian motion** (GBM). It combines the Brownian motion $W_t$ from \"Random walks and Brownian motion\" with the log returns and volatility of \"Returns and volatility\", and it is the continuous limit of the trees in \"Multi-step trees and backward induction\". The Black–Scholes formula in the next lesson is computed under this model."),

    h("Modelling returns instead of prices"),
    p("The simplest idea would be to let the price itself follow a Brownian motion, $S_t = S_0 + \\mu t + \\sigma W_t$. This has two defects. First, $W_t$ is normally distributed, so the price can become negative. Second, a move of 1 means very different things for a stock at 10 and a stock at 1000. What should be random and comparable across stocks is the **return**, not the price change."),
    p("So we model the return over a short interval $dt$. The assumptions are:"),
    list(
      "The expected return per unit time is a constant $\\mu$ (the **drift**).",
      "The volatility of returns is a constant $\\sigma$.",
      "The random part of the return comes from a Brownian motion: returns over non-overlapping intervals are independent and normally distributed.",
      "The stock pays no dividends and its price moves continuously, without jumps.",
    ),

    h("The model equation"),
    p("These assumptions are written as"),
    eq("\\frac{dS_t}{S_t} = \\mu\\,dt + \\sigma\\,dW_t \\qquad\\Longleftrightarrow\\qquad dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t."),
    p("Read it as a recipe for one small step: over $dt$ the return has a deterministic part $\\mu\\,dt$ and a random part $\\sigma\\,dW_t$. Since $dW_t$ is normal with mean 0 and variance $dt$, the return over the step has mean $\\mu\\,dt$ and standard deviation $\\sigma\\sqrt{dt}$, which is the square-root-of-time rule from \"Returns and volatility\". Because both terms are proportional to $S_t$, price moves scale with the price level."),

    h("The solution"),
    p("The equation has an explicit solution:"),
    eq("S_T = S_0 \\exp\\!\\left( \\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right) T + \\sigma W_T \\right)."),
    p("Taking logarithms, the log return over $[0, T]$ is"),
    eq("\\ln\\frac{S_T}{S_0} = \\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right) T + \\sigma W_T \\sim N\\!\\left( \\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right) T,\\; \\sigma^2 T \\right)."),
    p("So the log price is a Brownian motion with a constant drift. A random variable whose logarithm is normal is called **log-normal**. Since $S_T$ is $S_0$ times an exponential, it is always positive: GBM fixes the first defect of the naive model."),
    {
      kind: "check",
      id: "gbm/log-distribution",
      prompt: "Under geometric Brownian motion, how is $\\ln S_T$ distributed?",
      answer: { type: "choice", options: ["Normal", "Log-normal", "Uniform", "Exponential"], correct: 0 },
      explain: "$\\ln S_T = \\ln S_0 + (\\mu - \\tfrac12\\sigma^2)T + \\sigma W_T$ is a constant plus a normal variable, so it is normal. It is $S_T$ itself that is log-normal.",
    },

    h("The volatility correction"),
    p("The drift of the log price is $\\mu - \\tfrac{1}{2}\\sigma^2$, not $\\mu$. The correction comes from a property of the normal distribution. If $Z \\sim N(m, s^2)$, then"),
    eq("\\mathbb{E}\\left[e^{Z}\\right] = e^{m + \\frac{1}{2}s^2}."),
    p("The exponential is convex, so large positive values of $Z$ are amplified more than negative ones are damped, and the mean of $e^Z$ exceeds $e^m$. Apply this with $m = (\\mu - \\tfrac{1}{2}\\sigma^2)T$ and $s^2 = \\sigma^2 T$:"),
    eq("\\mathbb{E}^{\\mathbb{P}}[S_T] = S_0\\, e^{(\\mu - \\frac{1}{2}\\sigma^2)T + \\frac{1}{2}\\sigma^2 T} = S_0\\, e^{\\mu T}."),
    p("The $-\\tfrac{1}{2}\\sigma^2$ is exactly what is needed so that the expected price grows at rate $\\mu$, as assumed. The formal derivation uses Itô's lemma, the chain rule for functions of Brownian motion, which adds the term $-\\tfrac{1}{2}\\sigma^2\\,dt$ when we pass from $dS/S$ to $d\\ln S$."),
    p("An everyday version of the same effect is **volatility drag**. A price that rises 10% and then falls 10% ends at $1.1 \\cdot 0.9 = 0.99$ of where it started: the average return is zero, but the compound growth is negative. The more volatile the returns, the larger the gap between the average return and the growth rate actually achieved."),

    h("Mean and median"),
    p("Because the exponential is increasing, the median of $S_T$ is the exponential of the median of the log price, which equals its mean:"),
    eq("\\text{mean} = S_0\\, e^{\\mu T}, \\qquad \\text{median} = S_0\\, e^{(\\mu - \\frac{1}{2}\\sigma^2) T}."),
    p("The mean lies above the median: the log-normal distribution is skewed to the right, with a long tail of large outcomes pulling the average up. A typical path ends near the median, below the mean."),
    p("Example: $S_0 = 100$, $\\mu = 8\\%$, $\\sigma = 20\\%$, $T = 1$. The mean is $100\\,e^{0.08} \\approx 108.33$, the median $100\\,e^{0.06} \\approx 106.18$. The log return is $N(0.06,\\, 0.2^2)$, so the probability that the stock ends below 100 is $N(-0.06/0.2) = N(-0.3) \\approx 38\\%$, even though the expected return is positive. A 95% range for $S_T$ is $100\\,e^{0.06 \\pm 1.96 \\cdot 0.2}$, about 71.7 to 157.1, which is not symmetric around the median."),
    {
      kind: "check",
      id: "gbm/median",
      prompt: "A stock follows GBM with $S_0 = 100$, $\\mu = 8\\%$, $\\sigma = 20\\%$. What is the median of $S_T$ at $T = 1$?",
      answer: { type: "number", value: 106.18, tolerance: 0.01 },
      explain: "The median is $S_0e^{(\\mu - \\frac12\\sigma^2)T} = 100\\,e^{0.08 - 0.02} = 100\\,e^{0.06} \\approx 106.18$, below the mean $100\\,e^{0.08} \\approx 108.33$.",
    },
    {
      kind: "worked",
      title: "Mean, median and a 95% range over two years",
      steps: [
        { text: "Take $S_0 = 50$, $\\mu = 10\\%$, $\\sigma = 30\\%$ and $T = 2$. The mean grows at $\\mu$:", tex: "S_0\\,e^{\\mu T} = 50\\,e^{0.2}", result: { value: 61.07, tolerance: 0.01 } },
        { text: "The log return has mean $(\\mu - \\tfrac12\\sigma^2)T = 0.11$ and standard deviation $\\sigma\\sqrt{T} \\approx 0.4243$. The median is", tex: "S_0\\,e^{(\\mu - \\frac12\\sigma^2)T} = 50\\,e^{0.11}", result: { value: 55.81, tolerance: 0.01 } },
        { text: "Lower end of the 95% range:", tex: "50\\,e^{0.11 - 1.96 \\cdot 0.4243}", result: { value: 24.3, tolerance: 0.02 } },
        { text: "Upper end of the 95% range, much further from the median than the lower end:", tex: "50\\,e^{0.11 + 1.96 \\cdot 0.4243}", result: { value: 128.2, tolerance: 0.05 } },
      ],
    },
    p("The figure simulates 20 paths over one year from $S_0 = 100$, each built from many small log-normal steps, and draws the mean curve $S_0e^{\\mu t}$ and the median curve $S_0e^{(\\mu - \\sigma^2/2)t}$. Raise $\\sigma$ and note that the paths fan out, the median falls further below the mean, and more paths end below their start. Press \"New paths\" to draw a fresh sample."),
    figure("gbm-paths"),

    h("Link to the binomial tree"),
    p("In a CRR tree with $u = e^{\\sigma\\sqrt{\\Delta t}}$ and $d = 1/u$, each step adds $\\pm\\sigma\\sqrt{\\Delta t}$ to the log price. That is the scaled coin-flip walk of \"Random walks and Brownian motion\". As the number of steps grows, the log price converges to a Brownian motion with volatility $\\sigma$ plus a drift, and the terminal stock price becomes log-normal. GBM is the model that the trees approximate, which is why tree prices converge as $n$ grows."),

    h("The risk-neutral version"),
    p("\"Risk-neutral probabilities\" showed that for pricing we use the measure $\\mathbb{Q}$ under which the stock earns the risk-free rate. In GBM this means replacing $\\mu$ by $r$ and $W$ by a Brownian motion $W^{\\mathbb{Q}}$ under $\\mathbb{Q}$:"),
    eq("dS_t = r S_t\\,dt + \\sigma S_t\\,dW_t^{\\mathbb{Q}}, \\qquad S_T = S_0 \\exp\\!\\left( \\left(r - \\tfrac{1}{2}\\sigma^2\\right) T + \\sigma W_T^{\\mathbb{Q}} \\right)."),
    p("The volatility $\\sigma$ stays the same; only the drift changes. Then $\\mathbb{E}^{\\mathbb{Q}}[S_T] = S_0 e^{rT}$, and the discounted price $e^{-rt}S_t$ is a martingale under $\\mathbb{Q}$, exactly as in the one-step tree. The real drift $\\mu$ disappears from option prices, just as the real probability $p$ did."),

    h("Summary"),
    list(
      "GBM models returns: $dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t$, with constant drift $\\mu$ and volatility $\\sigma$.",
      "Its solution is $S_T = S_0\\exp((\\mu - \\tfrac{1}{2}\\sigma^2)T + \\sigma W_T)$: log-normal and always positive.",
      "The $-\\tfrac{1}{2}\\sigma^2$ term makes the mean $S_0e^{\\mu T}$; the median $S_0e^{(\\mu - \\sigma^2/2)T}$ is lower.",
      "For pricing, replace $\\mu$ by $r$; the volatility is unchanged.",
    ),
    note("Under $\\mathbb{Q}$, $\\ln S_T \\sim N\\big(\\ln S_0 + (r - \\tfrac{1}{2}\\sigma^2)T,\\; \\sigma^2 T\\big)$. The next lesson integrates the call payoff against this distribution to obtain the Black–Scholes formula."),
    lab("/gbm", "Simulate price paths and their distribution in the Geometric Brownian Motion lab"),
  ],

  hu: [
    p("Ez a lecke a részvényár szokásos folytonos idejű modelljét, a **geometriai Brown-mozgást** (GBM) építi fel. Összekapcsolja a „Véletlen bolyongás és Brown-mozgás” lecke $W_t$ folyamatát a „Hozamok és volatilitás” lecke loghozamaival és volatilitásával. A GBM egyben a „Többlépéses fák és visszafelé indukció” lecke fáinak folytonos határesete. A következő lecke Black–Scholes-képlete erre a modellre épül."),

    h("Hozamok modellezése árak helyett"),
    p("A legegyszerűbb ötlet az lenne, hogy maga az ár kövessen Brown-mozgást: $S_t = S_0 + \\mu t + \\sigma W_t$. Ennek két hibája van. Egyrészt $W_t$ normális eloszlású, így az ár negatívvá válhat. Másrészt egy 1 egységnyi elmozdulás egészen mást jelent egy 10-es és egy 1000-es részvénynél. Ami véletlen, és részvények között összevethető, az a **hozam**, nem az árváltozás."),
    p("Ezért egy rövid $dt$ időszak hozamát modellezzük. A feltevések:"),
    list(
      "Az időegységre jutó várható hozam állandó, $\\mu$ (a **drift**).",
      "A hozamok volatilitása állandó, $\\sigma$.",
      "A hozam véletlen része Brown-mozgásból származik: nem átfedő időszakok hozamai függetlenek és normális eloszlásúak.",
      "A részvény nem fizet osztalékot, és ára folytonosan, ugrások nélkül mozog.",
    ),

    h("A modell egyenlete"),
    p("A feltevések képletben:"),
    eq("\\frac{dS_t}{S_t} = \\mu\\,dt + \\sigma\\,dW_t \\qquad\\Longleftrightarrow\\qquad dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t."),
    p("Olvasd egy kis lépés receptjeként: $dt$ alatt a hozamnak van egy determinisztikus része, $\\mu\\,dt$, és egy véletlen része, $\\sigma\\,dW_t$. Mivel $dW_t$ normális, 0 várható értékkel és $dt$ varianciával, a lépés hozamának várható értéke $\\mu\\,dt$, szórása $\\sigma\\sqrt{dt}$; ez a „Hozamok és volatilitás” lecke négyzetgyökös időszabálya. Mivel mindkét tag arányos $S_t$-vel, az ármozgások az árszinttel együtt skálázódnak."),

    h("A megoldás"),
    p("Az egyenletnek explicit megoldása van:"),
    eq("S_T = S_0 \\exp\\!\\left( \\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right) T + \\sigma W_T \\right)."),
    p("Logaritmust véve a $[0, T]$ időszak loghozama"),
    eq("\\ln\\frac{S_T}{S_0} = \\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right) T + \\sigma W_T \\sim N\\!\\left( \\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right) T,\\; \\sigma^2 T \\right)."),
    p("A logaritmikus ár tehát állandó driftű Brown-mozgás. Azt a valószínűségi változót, amelynek logaritmusa normális, **lognormális** eloszlásúnak nevezzük. Mivel $S_T$ az $S_0$ és egy exponenciális szorzata, mindig pozitív: a GBM kijavítja a naiv modell első hibáját."),
    {
      kind: "check",
      id: "gbm/log-distribution",
      prompt: "Geometriai Brown-mozgás esetén milyen eloszlású $\\ln S_T$?",
      answer: { type: "choice", options: ["Normális", "Lognormális", "Egyenletes", "Exponenciális"], correct: 0 },
      explain: "$\\ln S_T = \\ln S_0 + (\\mu - \\tfrac12\\sigma^2)T + \\sigma W_T$ egy konstans és egy normális változó összege, tehát normális. Maga $S_T$ a lognormális.",
    },

    h("A volatilitás-korrekció"),
    p("A logaritmikus ár driftje $\\mu - \\tfrac{1}{2}\\sigma^2$, nem $\\mu$. A korrekció a normális eloszlás egy tulajdonságából jön. Ha $Z \\sim N(m, s^2)$, akkor"),
    eq("\\mathbb{E}\\left[e^{Z}\\right] = e^{m + \\frac{1}{2}s^2}."),
    p("Az exponenciális függvény konvex, ezért $Z$ nagy pozitív értékeit jobban felnagyítja, mint amennyire a negatívakat tompítja, így $e^Z$ várható értéke nagyobb $e^m$-nél. Alkalmazzuk ezt $m = (\\mu - \\tfrac{1}{2}\\sigma^2)T$ és $s^2 = \\sigma^2 T$ mellett:"),
    eq("\\mathbb{E}^{\\mathbb{P}}[S_T] = S_0\\, e^{(\\mu - \\frac{1}{2}\\sigma^2)T + \\frac{1}{2}\\sigma^2 T} = S_0\\, e^{\\mu T}."),
    p("A $-\\tfrac{1}{2}\\sigma^2$ tag pontosan ahhoz kell, hogy a várható ár $\\mu$ ütemben nőjön, ahogy feltettük. A formális levezetés az Itô-lemmát használja, amely a Brown-mozgás függvényeire vonatkozó láncszabály, és $dS/S$-ről $d\\ln S$-re áttérve hozzáadja a $-\\tfrac{1}{2}\\sigma^2\\,dt$ tagot."),
    p("Ugyanennek a hatásnak hétköznapi változata a **volatilitási veszteség** (volatility drag). Ha egy ár 10%-ot emelkedik, majd 10%-ot esik, a végén $1{,}1 \\cdot 0{,}9 = 0{,}99$-szerese a kiinduló értéknek: az átlagos hozam nulla, a kamatos növekedés mégis negatív. Minél ingadozóbbak a hozamok, annál nagyobb a rés az átlagos hozam és a ténylegesen elért növekedési ütem között."),

    h("Várható érték és medián"),
    p("Mivel az exponenciális függvény növekvő, $S_T$ mediánja a logaritmikus ár mediánjának exponenciálisa, a logaritmikus ár mediánja pedig egyenlő a várható értékével:"),
    eq("\\text{várható érték} = S_0\\, e^{\\mu T}, \\qquad \\text{medián} = S_0\\, e^{(\\mu - \\frac{1}{2}\\sigma^2) T}."),
    p("A várható érték a medián fölött van: a lognormális eloszlás jobbra ferde, a nagy kimenetelek hosszú farka felhúzza az átlagot. Egy tipikus pálya a medián közelében végez, a várható érték alatt."),
    p("Példa: $S_0 = 100$, $\\mu = 8\\%$, $\\sigma = 20\\%$, $T = 1$. A várható érték $100\\,e^{0{,}08} \\approx 108{,}33$, a medián $100\\,e^{0{,}06} \\approx 106{,}18$. A loghozam $N(0{,}06;\\, 0{,}2^2)$ eloszlású, így annak valószínűsége, hogy a részvény 100 alatt zár, $N(-0{,}06/0{,}2) = N(-0{,}3) \\approx 38\\%$, noha a várható hozam pozitív. $S_T$ 95%-os tartománya $100\\,e^{0{,}06 \\pm 1{,}96 \\cdot 0{,}2}$, nagyjából 71,7 és 157,1 között, ami nem szimmetrikus a medián körül."),
    {
      kind: "check",
      id: "gbm/median",
      prompt: "Egy részvény GBM-et követ, $S_0 = 100$, $\\mu = 8\\%$, $\\sigma = 20\\%$. Mennyi $S_T$ mediánja $T = 1$-nél?",
      answer: { type: "number", value: 106.18, tolerance: 0.01 },
      explain: "A medián $S_0e^{(\\mu - \\frac12\\sigma^2)T} = 100\\,e^{0{,}08 - 0{,}02} = 100\\,e^{0{,}06} \\approx 106{,}18$, a $100\\,e^{0{,}08} \\approx 108{,}33$ várható érték alatt.",
    },
    {
      kind: "worked",
      title: "Várható érték, medián és 95%-os tartomány két évre",
      steps: [
        { text: "Legyen $S_0 = 50$, $\\mu = 10\\%$, $\\sigma = 30\\%$ és $T = 2$. A várható érték $\\mu$ ütemben nő:", tex: "S_0\\,e^{\\mu T} = 50\\,e^{0{,}2}", result: { value: 61.07, tolerance: 0.01 } },
        { text: "A loghozam várható értéke $(\\mu - \\tfrac12\\sigma^2)T = 0{,}11$, szórása $\\sigma\\sqrt{T} \\approx 0{,}4243$. A medián", tex: "S_0\\,e^{(\\mu - \\frac12\\sigma^2)T} = 50\\,e^{0{,}11}", result: { value: 55.81, tolerance: 0.01 } },
        { text: "A 95%-os tartomány alsó vége:", tex: "50\\,e^{0{,}11 - 1{,}96 \\cdot 0{,}4243}", result: { value: 24.3, tolerance: 0.02 } },
        { text: "A 95%-os tartomány felső vége, sokkal messzebb a mediántól, mint az alsó:", tex: "50\\,e^{0{,}11 + 1{,}96 \\cdot 0{,}4243}", result: { value: 128.2, tolerance: 0.05 } },
      ],
    },
    p("Az ábra 20 pályát szimulál egy évre $S_0 = 100$-ból, mindegyiket sok kis lognormális lépésből, és felrajzolja az $S_0e^{\\mu t}$ várhatóérték-görbét és az $S_0e^{(\\mu - \\sigma^2/2)t}$ mediángörbét. Növeld $\\sigma$-t: a pályák szétterülnek, a medián egyre jobban a várható érték alá kerül, és több pálya végez a kiinduló érték alatt. Az „Új pályák” gombbal új mintát húzhatsz."),
    figure("gbm-paths"),

    h("Kapcsolat a binomiális fával"),
    p("Egy $u = e^{\\sigma\\sqrt{\\Delta t}}$, $d = 1/u$ paraméterű CRR-fában minden lépés $\\pm\\sigma\\sqrt{\\Delta t}$-t ad a logaritmikus árhoz. Ez a „Véletlen bolyongás és Brown-mozgás” lecke skálázott pénzfeldobásos bolyongása. A lépésszám növelésével a logaritmikus ár egy $\\sigma$ volatilitású, driftes Brown-mozgáshoz tart, a lejáratkori részvényár pedig lognormálissá válik. A GBM az a modell, amelyet a fák közelítenek; ezért konvergálnak a fás árak $n$ növelésével."),

    h("A kockázatsemleges változat"),
    p("A „Kockázatsemleges valószínűségek” lecke megmutatta, hogy árazáshoz azt a $\\mathbb{Q}$ mértéket használjuk, amely alatt a részvény a kockázatmentes kamatlábat hozza. GBM-ben ez azt jelenti, hogy $\\mu$ helyére $r$ kerül, $W$ helyére pedig egy $\\mathbb{Q}$ alatti $W^{\\mathbb{Q}}$ Brown-mozgás:"),
    eq("dS_t = r S_t\\,dt + \\sigma S_t\\,dW_t^{\\mathbb{Q}}, \\qquad S_T = S_0 \\exp\\!\\left( \\left(r - \\tfrac{1}{2}\\sigma^2\\right) T + \\sigma W_T^{\\mathbb{Q}} \\right)."),
    p("A $\\sigma$ volatilitás nem változik, csak a drift. Ekkor $\\mathbb{E}^{\\mathbb{Q}}[S_T] = S_0 e^{rT}$, a diszkontált $e^{-rt}S_t$ ár pedig martingál $\\mathbb{Q}$ alatt, pontosan úgy, mint az egylépéses fában. A valódi $\\mu$ drift kiesik az opcióárakból, ahogy a valódi $p$ valószínűség is kiesett."),

    h("Összefoglalás"),
    list(
      "A GBM a hozamokat modellezi: $dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t$, állandó $\\mu$ drifttel és $\\sigma$ volatilitással.",
      "Megoldása $S_T = S_0\\exp((\\mu - \\tfrac{1}{2}\\sigma^2)T + \\sigma W_T)$: lognormális és mindig pozitív.",
      "A $-\\tfrac{1}{2}\\sigma^2$ tag miatt a várható érték $S_0e^{\\mu T}$; az $S_0e^{(\\mu - \\sigma^2/2)T}$ medián ennél kisebb.",
      "Árazáshoz $\\mu$ helyére $r$ kerül; a volatilitás változatlan.",
    ),
    note("$\\mathbb{Q}$ alatt $\\ln S_T \\sim N\\big(\\ln S_0 + (r - \\tfrac{1}{2}\\sigma^2)T,\\; \\sigma^2 T\\big)$. A következő lecke a call kifizetését erre az eloszlásra integrálja, és így kapja meg a Black–Scholes-képletet."),
    lab("/gbm", "Szimulálj árpályákat és eloszlásukat a Geometriai Brown-mozgás laborban"),
  ],
};
