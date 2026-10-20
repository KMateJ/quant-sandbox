import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const jumpDiffusion: GuideLessonContent = {
  en: [
    p("Every model in this track so far moves continuously: Brownian motion from \"Random walks and Brownian motion\", \"Geometric Brownian motion\" built on it, and the processes of \"Mean reversion: Ornstein–Uhlenbeck and Vasicek\". Real prices sometimes gap. An earnings surprise, a default or a market crash moves the price by several percent between two trades, with nothing in between. This lesson adds such jumps to geometric Brownian motion and works out their effect on returns, option prices and hedging."),

    h("The Poisson process"),
    p("Jumps arrive at random times, so we first need a model for counting them. The **Poisson process** $N_t$ counts the events up to time $t$. It starts at $N_0 = 0$, increases by exactly 1 at each event and is constant in between. Its single parameter is the **intensity** $\\lambda > 0$, the expected number of events per year. The modelling assumptions are:"),
    list(
      "In a short interval of length $dt$ an event occurs with probability $\\lambda\\,dt$, and two or more events with negligible probability.",
      "The numbers of events in non-overlapping intervals are independent (**independent increments**), as for Brownian motion.",
    ),
    p("From these assumptions the number of events up to $t$ follows the Poisson distribution:"),
    eq("\\Pr(N_t = n) = e^{-\\lambda t}\\,\\frac{(\\lambda t)^n}{n!}, \\qquad n = 0, 1, 2, \\ldots"),
    p("Its mean and its variance are both $\\lambda t$."),

    h("The compound Poisson process"),
    p("A count alone does not move a price; each event needs a size. Let $J_1, J_2, \\ldots$ be independent, identically distributed jump sizes, independent of $N$. The **compound Poisson process** adds up the jumps that have occurred so far:"),
    eq("Y_t = \\sum_{i=1}^{N_t} J_i."),
    p("Think of the claims arriving at an insurer: $N_t$ is the number of claims, $J_i$ the size of each, and $Y_t$ the total paid. Conditioning on the number of jumps gives the mean $\\mathbb{E}[Y_t] = \\lambda t\\,\\mathbb{E}[J]$ and the variance $\\operatorname{Var}(Y_t) = \\lambda t\\,\\mathbb{E}[J^2]$."),

    h("The Merton jump-diffusion model"),
    p("Merton (1976) adds such jumps to geometric Brownian motion. The jumps act on the log price: when a jump of size $J$ occurs, the price is multiplied by $e^J$, so its relative change is $e^J - 1$. Merton assumes normal log-jumps, $J \\sim N(\\mu_J, \\sigma_J^2)$, independent of each other, of $N$ and of $W$. The dynamics are"),
    eq("\\frac{dS_t}{S_{t-}} = (\\mu - \\lambda\\kappa)\\,dt + \\sigma\\,dW_t + \\big(e^{J} - 1\\big)\\,dN_t, \\qquad \\kappa = \\mathbb{E}\\big[e^{J} - 1\\big] = e^{\\mu_J + \\sigma_J^2/2} - 1."),
    p("$S_{t-}$ is the price just before a possible jump. Between jumps the price follows geometric Brownian motion; at a jump it is multiplied by $e^J$. The jump term has expected value $\\lambda\\kappa\\,dt$ per instant, so the **compensator** $-\\lambda\\kappa$ in the drift cancels it and the expected return stays $\\mu$. With $\\mu_J = -10\\%$ and $\\sigma_J = 15\\%$, $\\kappa \\approx -8.5\\%$: an average jump costs 8.5% of the price, and with $\\lambda = 0.5$ the compensator raises the drift by about 4.25% per year."),
    p("Under the risk-neutral measure $\\mathbb{Q}$ the discounted price must be a martingale, so $\\mu$ is replaced by $r$ and the drift becomes $r - \\lambda\\kappa$. \"Change of measure and Girsanov's theorem\" covered only the Brownian part, where a change of measure shifts the drift of $W$. With jumps the compensator term $-\\lambda\\kappa$ is needed as well, otherwise the expected jump loss would make the discounted price drift."),
    p("Applying \"Itô's lemma\" to $\\ln S$ between jumps gives the familiar $-\\sigma^2/2$ correction, and each jump adds $J$ to the log price. The log return over $[0, T]$ is therefore"),
    eq("\\ln\\frac{S_T}{S_0} = \\Big(\\mu - \\lambda\\kappa - \\frac{\\sigma^2}{2}\\Big)T + \\sigma W_T + \\sum_{i=1}^{N_T} J_i."),

    h("The distribution of the log return"),
    p("Condition on the number of jumps. Given $N_T = n$, the log return is a constant plus $\\sigma W_T$ plus $n$ independent normal jumps, a sum of independent normals. Writing $m = (\\mu - \\lambda\\kappa - \\sigma^2/2)T$,"),
    eq("\\ln\\frac{S_T}{S_0}\\;\\Big|\\;N_T = n \\;\\sim\\; N\\big(m + n\\mu_J,\\ \\sigma^2 T + n\\sigma_J^2\\big)."),
    p("Averaging over $n$ with the Poisson weights gives the density $f$ of the log return as a **Poisson mixture of normals**:"),
    eq("f(x) = \\sum_{n=0}^{\\infty} e^{-\\lambda T}\\frac{(\\lambda T)^n}{n!}\\;\\varphi\\big(x;\\ m + n\\mu_J,\\ \\sigma^2 T + n\\sigma_J^2\\big),"),
    p("where $\\varphi(x; a, b)$ is the normal density with mean $a$ and variance $b$. Each normal component is a scenario with a given number of jumps."),

    h("Moments and fat tails"),
    p("The shape is easiest to read from **cumulants**. The first two are the mean and the variance; the third and fourth, divided by the matching powers of the standard deviation, give the **skewness** and the **excess kurtosis** (kurtosis minus 3, zero for a normal). Cumulants of independent sums add. The diffusion part is normal and contributes only to the variance, $\\sigma^2 T$. For a compound Poisson sum the $k$-th cumulant is $\\lambda T\\,\\mathbb{E}[J^k]$. Hence"),
    eq("\\operatorname{Var} = \\sigma^2 T + \\lambda T(\\mu_J^2 + \\sigma_J^2), \\qquad c_3 = \\lambda T(\\mu_J^3 + 3\\mu_J\\sigma_J^2), \\qquad c_4 = \\lambda T(\\mu_J^4 + 6\\mu_J^2\\sigma_J^2 + 3\\sigma_J^4),"),
    p("with skewness $c_3/\\operatorname{Var}^{3/2}$ and excess kurtosis $c_4/\\operatorname{Var}^2$. When $\\mu_J < 0$, $c_3$ is negative: the distribution has a longer left tail. $c_4$ is always positive, so the tails are **fat**: extreme returns are more likely than under a normal with the same variance. Both effects shrink with the horizon, since skewness scales like $1/\\sqrt{T}$ and excess kurtosis like $1/T$."),
    note("In the Merton model the log return is a Poisson mixture of normals. Its variance is $\\sigma^2T + \\lambda T(\\mu_J^2 + \\sigma_J^2)$; negative mean jumps give negative skew, and the excess kurtosis is always positive."),

    h("Worked example"),
    p("Take $\\sigma = 15\\%$, $\\lambda = 0.5$ per year, $\\mu_J = -10\\%$, $\\sigma_J = 15\\%$ and $T = 1$."),
    list(
      "Number of jumps: $\\Pr(N_1 = 0) = e^{-0.5} \\approx 60.65\\%$, $\\Pr(N_1 = 1) = 0.5\\,e^{-0.5} \\approx 30.33\\%$, $\\Pr(N_1 = 2) \\approx 7.58\\%$, and three or more about 1.44%.",
      "Variance: $0.15^2 + 0.5\\,(0.01 + 0.0225) = 0.0225 + 0.01625 = 0.03875$, a standard deviation of 19.69%. The jumps supply $0.01625/0.03875 \\approx 41.9\\%$ of the variance.",
      "Skewness: $c_3 = 0.5\\,(-0.001 - 0.00675) = -0.003875$, divided by $0.03875^{3/2}$ gives $-0.51$.",
      "Excess kurtosis: $c_4 = 0.5\\,(0.0001 + 0.00135 + 0.00151875) \\approx 0.00148$, divided by $0.03875^2$ gives $0.99$.",
      "Probability of a log return below $-30\\%$: 10.85% under Merton, 11.26% under the normal with the same mean and variance.",
    ),
    p("The last line looks surprising: $-30\\%$ lies only about 1.2 standard deviations below the mean, and there the normal has slightly more mass. The fat tail shows further out. Below $-50\\%$ the probabilities are 2.46% against 1.29%, and below $-60\\%$ 1.10% against 0.31%, more than three times as much. Over one month the same parameters give a skewness of about $-1.76$ and an excess kurtosis of about 11.9."),
    p("The figure keeps the diffusion volatility at $\\sigma = 15\\%$ and the horizon at $T = 1$ year. Sliders set the jump intensity $\\lambda$ (0 to 3 per year, default 0.5), the mean log-jump $\\mu_J$ ($-30\\%$ to $+10\\%$, default $-10\\%$) and the jump volatility $\\sigma_J$ (0% to 30%, default 15%). The chart shows the density of the 1-year log return under the Merton model and the normal density with the same mean and variance, for log returns from $-100\\%$ to $+100\\%$. It shows the shape of the distribution: the diffusion part is centred at $-\\sigma^2/2$ and the compensator is left out, which would shift both curves by a constant without changing their shape. The readouts give the share of the variance due to jumps, the skewness, the excess kurtosis, and the probability of a log return below $-30\\%$ under both. Set $\\lambda = 0$ and the two curves coincide. Then make $\\mu_J$ strongly negative and watch the left tail of the Merton density thicken while its peak grows taller and narrower than the normal's."),
    figure("jump-density"),

    h("Option prices and the smile"),
    p("Merton assumed that jump risk is specific to the firm and can be diversified away, so the jump intensity and the jump distribution are the same under $\\mathbb{Q}$ as under $\\mathbb{P}$. Conditional on $n$ jumps the price at $T$ is log-normal, so the conditional option price is a Black–Scholes price. Averaging over $n$ gives **Merton's formula**:"),
    eq("C_0 = \\sum_{n=0}^{\\infty} e^{-\\lambda' T}\\frac{(\\lambda' T)^n}{n!}\\;C^{\\text{BS}}\\big(S_0, K, T, \\sigma_n, r_n\\big),"),
    eq("\\lambda' = \\lambda(1 + \\kappa), \\qquad \\sigma_n^2 = \\sigma^2 + \\frac{n\\sigma_J^2}{T}, \\qquad r_n = r - \\lambda\\kappa + \\frac{n\\ln(1 + \\kappa)}{T}."),
    p("Each term is the Black–Scholes price of the scenario with $n$ jumps."),
    p("Invert these prices to implied volatilities, as in \"Implied volatility and the volatility smile\". Because the risk-neutral distribution has a fat, negatively skewed left tail, out-of-the-money puts are worth more than Black–Scholes with a single volatility allows, and the implied volatility rises for low strikes: a skew. Since skewness and excess kurtosis decay with the horizon, the skew is steepest at short maturities and flattens for long ones. A pure diffusion behaves differently: over a very short horizon its log return is almost normal, so it struggles to produce a steep short-dated skew. Jumps are one way to explain the short-dated skew seen in equity markets; the other, a random volatility, is the subject of \"Stochastic volatility and the Heston model\", and practical models often combine both. The Heston lab lets you price options under stochastic volatility for comparison."),

    h("Hedging and incompleteness"),
    p("In the Black–Scholes setting a position of $\\Delta$ shares, rebalanced continuously, removes all risk from an option. With jumps this fails. When a jump occurs, the option changes by $C(S e^J) - C(S)$, which is not linear in the random jump size $e^J - 1$. A stock position can offset the change for one jump size but not for all of them, and rebalancing cannot react to an instantaneous jump. Some risk remains, and the market with only the stock and the bond is **incomplete**: the option price is no longer fixed by replication but depends on how the market prices jump risk."),

    {
      kind: "check",
      id: "jump-diffusion/expected-jumps",
      prompt: "Jumps arrive as a Poisson process with intensity $\\lambda = 2$ per year. How many jumps do you expect in one year?",
      answer: { type: "number", value: 2, tolerance: 0.01 },
      explain: "$\\mathbb{E}[N_t] = \\lambda t = 2 \\times 1 = 2$; the variance of the count is also 2.",
    },

    {
      kind: "check",
      id: "jump-diffusion/kurtosis",
      prompt: "Adding normal log-jumps to geometric Brownian motion changes the excess kurtosis of the log return how?",
      answer: { type: "choice", options: ["It raises it above zero.","It lowers it below zero.","It leaves it at zero.","Its sign depends on $\\mu_J$."], correct: 0 },
      explain: "The fourth cumulant $\\lambda T(\\mu_J^4 + 6\\mu_J^2\\sigma_J^2 + 3\\sigma_J^4)$ is positive whatever the sign of $\\mu_J$, so the tails are fatter than the normal's. The sign of $\\mu_J$ sets the skew, not the kurtosis.",
    },

    {
      kind: "worked",
      title: "Splitting the variance between diffusion and jumps",
      steps: [
        { text: "Diffusion variance over one year with $\\sigma = 15\\%$.", tex: "\\sigma^2 T = 0.15^2", result: { value: 0.0225, tolerance: 0.0001 } },
        { text: "Jump variance with the figure's defaults $\\lambda = 0.5$, $\\mu_J = -10\\%$, $\\sigma_J = 15\\%$.", tex: "\\lambda T(\\mu_J^2 + \\sigma_J^2) = 0.5\\,(0.01 + 0.0225)", result: { value: 0.01625, tolerance: 0.00001 } },
        { text: "Total variance of the log return.", tex: "0.0225 + 0.01625", result: { value: 0.03875, tolerance: 0.00001 } },
        { text: "Share of the variance from the diffusion.", tex: "0.0225 / 0.03875", result: { value: 0.5806, tolerance: 0.0001 } },
      ],
    },

    h("Summary"),
    list(
      "The Poisson process $N_t$ counts events with intensity $\\lambda$: $\\Pr(N_t = n) = e^{-\\lambda t}(\\lambda t)^n/n!$, mean and variance $\\lambda t$, independent increments.",
      "The Merton model $dS/S_{-} = (\\mu - \\lambda\\kappa)\\,dt + \\sigma\\,dW + (e^J - 1)\\,dN$ adds normal log-jumps to geometric Brownian motion; the compensator $-\\lambda\\kappa$ keeps the expected return, and under $\\mathbb{Q}$ makes the discounted price a martingale.",
      "The log return is a Poisson mixture of normals with variance $\\sigma^2T + \\lambda T(\\mu_J^2 + \\sigma_J^2)$, negative skew for $\\mu_J < 0$ and fat tails, strongest at short horizons.",
      "Merton's option price is a Poisson-weighted sum of Black–Scholes prices; the implied volatility shows a skew that is steepest at short maturities.",
      "A jump cannot be delta-hedged, so the market is incomplete.",
    ),
    lab("/monte-carlo", "Simulate price paths and price options by simulation in the Monte Carlo lab"),
  ],

  hu: [
    p("Ennek a résznek eddigi modelljei mind folytonosan mozognak: a „Véletlen bolyongás és Brown-mozgás” Brown-mozgása, a rá épülő „Geometriai Brown-mozgás”, és az „Átlaghoz való visszahúzás: Ornstein–Uhlenbeck és Vasicek” folyamatai. A valódi árfolyamok néha ugranak. Egy meglepő gyorsjelentés, egy csőd vagy egy piaci összeomlás két kötés között több százalékot mozdít az áron, közbülső értékek nélkül. Ez a lecke ugrásokat ad a geometriai Brown-mozgáshoz, megnézi, mit tesznek a hozamok eloszlásával, és bemutatja a hatásukat az opcióárakra és a fedezésre."),

    h("A Poisson-folyamat"),
    p("Az ugrások véletlen időpontokban érkeznek, ezért először a számlálásukra kell modell. A **Poisson-folyamat** $N_t$ a $t$ időpontig bekövetkezett események számát adja. $N_0 = 0$-ból indul, minden eseménynél pontosan 1-gyel nő, közben állandó. Egyetlen paramétere az **intenzitás** $\\lambda > 0$, az évente várható események száma. A modellfeltevések:"),
    list(
      "Egy rövid, $dt$ hosszú intervallumban $\\lambda\\,dt$ valószínűséggel történik esemény, kettő vagy több pedig elhanyagolható valószínűséggel.",
      "Az egymást nem átfedő intervallumokban bekövetkező események száma független (**független növekmények**), mint a Brown-mozgásnál.",
    ),
    p("Ezekből a feltevésekből a $t$-ig bekövetkezett események száma Poisson-eloszlású:"),
    eq("\\Pr(N_t = n) = e^{-\\lambda t}\\,\\frac{(\\lambda t)^n}{n!}, \\qquad n = 0, 1, 2, \\ldots"),
    p("A várható értéke és a varianciája is $\\lambda t$."),

    h("Az összetett Poisson-folyamat"),
    p("A puszta darabszám még nem mozgatja az árat; minden eseményhez méret is kell. Legyenek $J_1, J_2, \\ldots$ független, azonos eloszlású ugrásméretek, $N$-től is függetlenek. Az **összetett Poisson-folyamat** az addig bekövetkezett ugrások összege:"),
    eq("Y_t = \\sum_{i=1}^{N_t} J_i."),
    p("Gondolj egy biztosítóhoz befutó kárbejelentésekre: $N_t$ a károk száma, $J_i$ az egyes károk nagysága, $Y_t$ az összes kifizetés. Az ugrások számára feltételezve a várható érték $\\mathbb{E}[Y_t] = \\lambda t\\,\\mathbb{E}[J]$, a variancia $\\operatorname{Var}(Y_t) = \\lambda t\\,\\mathbb{E}[J^2]$."),

    h("A Merton-féle ugró diffúzió"),
    p("Merton (1976) ilyen ugrásokat ad a geometriai Brown-mozgáshoz. Az ugrások a log-árfolyamra hatnak: egy $J$ méretű ugrásnál az ár $e^J$-szeresére változik, a relatív változás tehát $e^J - 1$. Merton normális log-ugrásokat feltételez, $J \\sim N(\\mu_J, \\sigma_J^2)$, amelyek egymástól, $N$-től és $W$-től is függetlenek. A dinamika:"),
    eq("\\frac{dS_t}{S_{t-}} = (\\mu - \\lambda\\kappa)\\,dt + \\sigma\\,dW_t + \\big(e^{J} - 1\\big)\\,dN_t, \\qquad \\kappa = \\mathbb{E}\\big[e^{J} - 1\\big] = e^{\\mu_J + \\sigma_J^2/2} - 1."),
    p("$S_{t-}$ az ár közvetlenül egy esetleges ugrás előtt. Két ugrás között az ár geometriai Brown-mozgást követ, ugráskor $e^J$-szeresére változik. Az ugrótag várható értéke pillanatonként $\\lambda\\kappa\\,dt$, ezért a driftben szereplő $-\\lambda\\kappa$ **kompenzátor** ezt kiegyenlíti, és a várható hozam $\\mu$ marad. $\\mu_J = -10\\%$ és $\\sigma_J = 15\\%$ mellett $\\kappa \\approx -8{,}5\\%$: egy átlagos ugrás az ár 8,5%-át viszi el, és $\\lambda = 0{,}5$ mellett a kompenzátor évi nagyjából 4,25%-kal emeli a driftet."),
    p("A $\\mathbb{Q}$ kockázatsemleges mérték alatt a diszkontált árnak martingálnak kell lennie, ezért $\\mu$ helyére $r$ kerül, a drift pedig $r - \\lambda\\kappa$ lesz. A „Mértékcsere és a Girsanov-tétel” lecke csak a Brown-mozgásos részt tárgyalta, ahol a mértékcsere $W$ driftjét tolja el. Ugrásokkal a $-\\lambda\\kappa$ kompenzátortag is kell, különben a várható ugrásveszteség miatt a diszkontált ár sodródna."),
    p("„Az Itô-lemma” két ugrás között $\\ln S$-re alkalmazva a megszokott $-\\sigma^2/2$ korrekciót adja, minden ugrás pedig $J$-t ad a log-árhoz. A $[0, T]$ szakasz log-hozama tehát"),
    eq("\\ln\\frac{S_T}{S_0} = \\Big(\\mu - \\lambda\\kappa - \\frac{\\sigma^2}{2}\\Big)T + \\sigma W_T + \\sum_{i=1}^{N_T} J_i."),

    h("A log-hozam eloszlása"),
    p("Feltételezzünk az ugrások számára. $N_T = n$ esetén a log-hozam egy konstans, $\\sigma W_T$ és $n$ független normális ugrás összege, vagyis független normálisok összege. Az $m = (\\mu - \\lambda\\kappa - \\sigma^2/2)T$ jelöléssel"),
    eq("\\ln\\frac{S_T}{S_0}\\;\\Big|\\;N_T = n \\;\\sim\\; N\\big(m + n\\mu_J,\\ \\sigma^2 T + n\\sigma_J^2\\big)."),
    p("$n$ szerint a Poisson-súlyokkal átlagolva a log-hozam $f$ sűrűségfüggvénye normálisok **Poisson-keveréke**:"),
    eq("f(x) = \\sum_{n=0}^{\\infty} e^{-\\lambda T}\\frac{(\\lambda T)^n}{n!}\\;\\varphi\\big(x;\\ m + n\\mu_J,\\ \\sigma^2 T + n\\sigma_J^2\\big),"),
    p("ahol $\\varphi(x; a, b)$ az $a$ várható értékű, $b$ varianciájú normális sűrűség. Minden normális komponens egy adott ugrásszámú forgatókönyv."),

    h("Momentumok és vastag farkak"),
    p("Az alakot a **kumulánsokból** a legkönnyebb leolvasni. Az első kettő a várható érték és a variancia; a harmadik és a negyedik a szórás megfelelő hatványával osztva a **ferdeséget** és a **többletcsúcsosságot** adja (a csúcsosság mínusz 3, normálisnál nulla). Független tagok összegének kumulánsai összeadódnak. A diffúziós rész normális, csak a varianciához ad hozzá, $\\sigma^2 T$-t. Összetett Poisson-összeg $k$-adik kumulánsa $\\lambda T\\,\\mathbb{E}[J^k]$. Ebből"),
    eq("\\operatorname{Var} = \\sigma^2 T + \\lambda T(\\mu_J^2 + \\sigma_J^2), \\qquad c_3 = \\lambda T(\\mu_J^3 + 3\\mu_J\\sigma_J^2), \\qquad c_4 = \\lambda T(\\mu_J^4 + 6\\mu_J^2\\sigma_J^2 + 3\\sigma_J^4),"),
    p("a ferdeség $c_3/\\operatorname{Var}^{3/2}$, a többletcsúcsosság $c_4/\\operatorname{Var}^2$. Ha $\\mu_J < 0$, $c_3$ negatív: az eloszlás bal farka hosszabb. $c_4$ mindig pozitív, tehát a farkak **vastagok**: szélsőséges hozamok valószínűbbek, mint egy azonos varianciájú normálisnál. Mindkét hatás gyengül az időtávval, mert a ferdeség $1/\\sqrt{T}$, a többletcsúcsosság $1/T$ szerint skálázódik."),
    note("A Merton-modellben a log-hozam normálisok Poisson-keveréke. Varianciája $\\sigma^2T + \\lambda T(\\mu_J^2 + \\sigma_J^2)$; negatív átlagos ugrás negatív ferdeséget ad, a többletcsúcsosság pedig mindig pozitív."),

    h("Számpélda"),
    p("Legyen $\\sigma = 15\\%$, $\\lambda = 0{,}5$ évente, $\\mu_J = -10\\%$, $\\sigma_J = 15\\%$ és $T = 1$."),
    list(
      "Az ugrások száma: $\\Pr(N_1 = 0) = e^{-0{,}5} \\approx 60{,}65\\%$, $\\Pr(N_1 = 1) = 0{,}5\\,e^{-0{,}5} \\approx 30{,}33\\%$, $\\Pr(N_1 = 2) \\approx 7{,}58\\%$, három vagy több nagyjából 1,44%.",
      "Variancia: $0{,}15^2 + 0{,}5\\,(0{,}01 + 0{,}0225) = 0{,}0225 + 0{,}01625 = 0{,}03875$, azaz 19,69% szórás. Az ugrások adják a variancia $0{,}01625/0{,}03875 \\approx 41{,}9\\%$-át.",
      "Ferdeség: $c_3 = 0{,}5\\,(-0{,}001 - 0{,}00675) = -0{,}003875$, ezt $0{,}03875^{3/2}$-nel osztva $-0{,}51$.",
      "Többletcsúcsosság: $c_4 = 0{,}5\\,(0{,}0001 + 0{,}00135 + 0{,}00151875) \\approx 0{,}00148$, ezt $0{,}03875^2$-nel osztva $0{,}99$.",
      "Annak valószínűsége, hogy a log-hozam $-30\\%$ alatt marad: a Merton-modellben 10,85%, az azonos várható értékű és varianciájú normálisnál 11,26%.",
    ),
    p("Az utolsó sor meglepőnek tűnik: $-30\\%$ csak nagyjából 1,2 szórásnyira van a várható érték alatt, és ott a normálisnak valamivel több tömege van. A vastag farok távolabb mutatkozik meg. $-50\\%$ alatt a valószínűségek 2,46% és 1,29%, $-60\\%$ alatt 1,10% és 0,31%, vagyis több mint háromszoros a különbség. Egyhónapos távon ugyanezek a paraméterek nagyjából $-1{,}76$ ferdeséget és 11,9 többletcsúcsosságot adnak."),
    p("Az ábrán a diffúziós volatilitás $\\sigma = 15\\%$, az időtáv $T = 1$ év, mindkettő rögzített. Csúszkákkal a $\\lambda$ ugrásintenzitás (évi 0 és 3 között, alapértéke 0,5), a $\\mu_J$ átlagos log-ugrás ($-30\\%$ és $+10\\%$ között, alapértéke $-10\\%$) és a $\\sigma_J$ ugrásvolatilitás (0% és 30% között, alapértéke 15%) állítható. A grafikon az 1 éves log-hozam sűrűségét mutatja a Merton-modellben, valamint az azonos várható értékű és varianciájú normális sűrűséget, $-100\\%$ és $+100\\%$ közötti log-hozamokra. Az eloszlás alakját mutatja: a diffúziós rész $-\\sigma^2/2$ körül van, a kompenzátor kimarad, ez ugyanis mindkét görbét ugyanazzal a konstanssal tolná el, az alakjukon nem változtatna. A kijelzők az ugrásokból származó varianciahányadot, a ferdeséget, a többletcsúcsosságot és a $-30\\%$ alatti log-hozam valószínűségét adják mindkét eloszlásra. Állítsd $\\lambda$-t 0-ra: a két görbe egybeesik. Aztán tedd $\\mu_J$-t erősen negatívvá, és figyeld, ahogy a Merton-sűrűség bal farka megvastagszik, a csúcsa pedig magasabb és keskenyebb lesz a normálisénál."),
    figure("jump-density"),

    h("Opcióárak és a mosoly"),
    p("Merton feltevése szerint az ugráskockázat vállalatspecifikus és diverzifikálható, ezért az ugrásintenzitás és az ugrások eloszlása $\\mathbb{Q}$ alatt ugyanaz, mint $\\mathbb{P}$ alatt. $n$ ugrás feltétele mellett a $T$-beli ár lognormális, így a feltételes opcióár Black–Scholes-ár. $n$ szerint átlagolva kapjuk **Merton képletét**:"),
    eq("C_0 = \\sum_{n=0}^{\\infty} e^{-\\lambda' T}\\frac{(\\lambda' T)^n}{n!}\\;C^{\\text{BS}}\\big(S_0, K, T, \\sigma_n, r_n\\big),"),
    eq("\\lambda' = \\lambda(1 + \\kappa), \\qquad \\sigma_n^2 = \\sigma^2 + \\frac{n\\sigma_J^2}{T}, \\qquad r_n = r - \\lambda\\kappa + \\frac{n\\ln(1 + \\kappa)}{T}."),
    p("Minden tag az $n$ ugrásos forgatókönyv Black–Scholes-ára."),
    p("Váltsuk át ezeket az árakat implikált volatilitásra, ahogy az „Implikált volatilitás és a volatilitás-mosoly” leckében. Mivel a kockázatsemleges eloszlás bal farka vastag és negatívan ferde, a mélyen pénzen kívüli eladási opciók többet érnek, mint amennyit az egyetlen volatilitású Black–Scholes-modell megenged, így alacsony kötési áraknál nő az implikált volatilitás: ferde mosoly alakul ki. Mivel a ferdeség és a többletcsúcsosság az időtávval lecseng, a ferdeség rövid lejáratokon a legmeredekebb, hosszú lejáratokon ellaposodik. Egy tisztán diffúziós modell másképp viselkedik: nagyon rövid távon a log-hozama szinte normális, ezért nehezen ad meredek rövid lejáratú ferdeséget. Az ugrások az egyik magyarázatot adják a részvénypiacokon látott rövid lejáratú ferdeségre; a másik, a véletlen volatilitás, a „Sztochasztikus volatilitás és a Heston-modell” lecke témája, a gyakorlati modellek pedig gyakran mindkettőt kombinálják. Összehasonlításképp a Heston-laborban sztochasztikus volatilitás mellett árazhatsz opciókat."),

    h("Fedezés és nem teljes piac"),
    p("A Black–Scholes-modellben a folyamatosan újrasúlyozott $\\Delta$ darab részvény minden kockázatot eltávolít egy opcióból. Ugrásokkal ez nem működik. Ugráskor az opció értéke $C(S e^J) - C(S)$-sel változik, ami nem lineáris a véletlen $e^J - 1$ ugrásméretben. Egy részvénypozíció egyetlen ugrásméretre ki tudja egyenlíteni az opció változását, de egyszerre mindegyikre nem, és a folyamatos újrasúlyozás sem segít, mert az ugrás egy pillanat alatt zajlik le. Marad kockázat, és a csak részvényből és kötvényből álló piac **nem teljes**: az opció árát már nem a replikáció határozza meg, hanem az, hogyan árazza a piac az ugráskockázatot."),

    {
      kind: "check",
      id: "jump-diffusion/expected-jumps",
      prompt: "Az ugrások évi $\\lambda = 2$ intenzitású Poisson-folyamat szerint érkeznek. Hány ugrás várható egy év alatt?",
      answer: { type: "number", value: 2, tolerance: 0.01 },
      explain: "$\\mathbb{E}[N_t] = \\lambda t = 2 \\times 1 = 2$; a darabszám varianciája szintén 2.",
    },

    {
      kind: "check",
      id: "jump-diffusion/kurtosis",
      prompt: "Hogyan változtatja meg a log-hozam többletcsúcsosságát, ha normális log-ugrásokat adunk a geometriai Brown-mozgáshoz?",
      answer: { type: "choice", options: ["Nulla fölé emeli.","Nulla alá csökkenti.","Nullán hagyja.","Az előjele $\\mu_J$-től függ."], correct: 0 },
      explain: "A negyedik kumuláns, $\\lambda T(\\mu_J^4 + 6\\mu_J^2\\sigma_J^2 + 3\\sigma_J^4)$, $\\mu_J$ előjelétől függetlenül pozitív, így a farkak vastagabbak a normálisénál. $\\mu_J$ előjele a ferdeséget határozza meg, nem a csúcsosságot.",
    },

    {
      kind: "worked",
      title: "A variancia felosztása diffúzió és ugrások között",
      steps: [
        { text: "A diffúziós variancia egy évre $\\sigma = 15\\%$ mellett.", tex: "\\sigma^2 T = 0{,}15^2", result: { value: 0.0225, tolerance: 0.0001 } },
        { text: "Az ugrásvariancia az ábra alapértékeivel: $\\lambda = 0{,}5$, $\\mu_J = -10\\%$, $\\sigma_J = 15\\%$.", tex: "\\lambda T(\\mu_J^2 + \\sigma_J^2) = 0{,}5\\,(0{,}01 + 0{,}0225)", result: { value: 0.01625, tolerance: 0.00001 } },
        { text: "A log-hozam teljes varianciája.", tex: "0{,}0225 + 0{,}01625", result: { value: 0.03875, tolerance: 0.00001 } },
        { text: "A variancia diffúzióból származó hányada.", tex: "0{,}0225 / 0{,}03875", result: { value: 0.5806, tolerance: 0.0001 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "A Poisson-folyamat $N_t$ $\\lambda$ intenzitással számlálja az eseményeket: $\\Pr(N_t = n) = e^{-\\lambda t}(\\lambda t)^n/n!$, várható értéke és varianciája $\\lambda t$, növekményei függetlenek.",
      "A $dS/S_{-} = (\\mu - \\lambda\\kappa)\\,dt + \\sigma\\,dW + (e^J - 1)\\,dN$ Merton-modell normális log-ugrásokat ad a geometriai Brown-mozgáshoz; a $-\\lambda\\kappa$ kompenzátor megtartja a várható hozamot, $\\mathbb{Q}$ alatt pedig martingállá teszi a diszkontált árat.",
      "A log-hozam normálisok Poisson-keveréke, varianciája $\\sigma^2T + \\lambda T(\\mu_J^2 + \\sigma_J^2)$, $\\mu_J < 0$ esetén negatívan ferde, a farkai vastagok, és ez rövid távon a legerősebb.",
      "Merton opcióára Black–Scholes-árak Poisson-súlyozott összege; az implikált volatilitás ferdesége rövid lejáratokon a legmeredekebb.",
      "Egy ugrás nem fedezhető delta-fedezéssel, ezért a piac nem teljes.",
    ),
    lab("/monte-carlo", "Szimulálj árfolyampályákat, és árazz opciókat szimulációval a Monte Carlo laborban"),
  ],
};
