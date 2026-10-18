import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const riskMeasures: GuideLessonContent = {
  en: [
    p("The lesson \"Returns and volatility\" measured risk by the volatility $\\sigma$, the standard deviation of returns. A risk manager usually wants a different kind of answer: an amount of money that the position could lose. This lesson turns a return distribution into two such numbers, Value at Risk and expected shortfall, first under the normal model and then with fat tails, and ends with portfolios, which links back to \"Diversification and correlation\"."),

    h("The loss distribution"),
    p("Take a position worth $V$ today and fix a **horizon**, for example one trading day or ten. Let $R$ be the simple return of the position over that horizon. The **loss** is the fall in value, counted as a positive number:"),
    eq("L = -(V_h - V) = -V R."),
    p("A gain is a negative loss. The distribution of $L$ is the **loss distribution**; risk measures are numbers read off its right tail, where the large losses are. We assume the position is held unchanged over the horizon."),

    h("Value at Risk"),
    p("Pick a **confidence level** $\\alpha$, typically 95% or 99%. The **Value at Risk** $\\text{VaR}_\\alpha$ is the $\\alpha$-quantile of the loss distribution: the smallest amount $\\ell$ such that the loss stays at or below $\\ell$ with probability at least $\\alpha$,"),
    eq("\\text{VaR}_\\alpha = \\min\\{\\ell : \\mathbb{P}(L \\le \\ell) \\ge \\alpha\\}."),
    p("A one-day 99% VaR of 28,000 reads: on 99 days out of 100 the loss should not exceed 28,000. The convention here is that VaR is a positive amount of money and $\\alpha$ is close to 1."),

    h("Expected shortfall"),
    p("VaR is a threshold. It says how often the threshold is crossed, but nothing about how far. The **expected shortfall** answers that: it is the average loss in the worst $1-\\alpha$ fraction of outcomes. For a continuous loss distribution this equals"),
    eq("\\text{ES}_\\alpha = \\mathbb{E}\\big[L \\mid L \\ge \\text{VaR}_\\alpha\\big] = \\frac{1}{1-\\alpha}\\int_\\alpha^1 \\text{VaR}_u\\,du."),
    p("The second form shows it as the average of all VaRs beyond $\\alpha$, so $\\text{ES}_\\alpha \\ge \\text{VaR}_\\alpha$ always."),

    h("The normal model"),
    p("Assume the return over the horizon is normal, $R \\sim N(\\mu, \\sigma^2)$. Then $L = V(\\sigma Z - \\mu)$ with $Z$ standard normal (the sign of $Z$ is flipped, which the symmetry of the normal allows). Let $z_\\alpha = N^{-1}(\\alpha)$ be the standard normal quantile, so $z_{0.99} \\approx 2.326$. Since $L$ is increasing in $Z$, its quantile is"),
    eq("\\text{VaR}_\\alpha = V\\,(\\sigma z_\\alpha - \\mu)."),
    p("For the expected shortfall we need the mean of $Z$ beyond $z_\\alpha$. The standard normal density $\\varphi(x) = e^{-x^2/2}/\\sqrt{2\\pi}$ satisfies $\\varphi'(x) = -x\\varphi(x)$, so $x\\varphi(x)$ has the antiderivative $-\\varphi(x)$:"),
    eq("\\mathbb{E}[Z \\mid Z \\ge z_\\alpha] = \\frac{1}{1-\\alpha}\\int_{z_\\alpha}^{\\infty} x\\,\\varphi(x)\\,dx = \\frac{1}{1-\\alpha}\\Big[-\\varphi(x)\\Big]_{z_\\alpha}^{\\infty} = \\frac{\\varphi(z_\\alpha)}{1-\\alpha}."),
    p("Substituting into $L = V(\\sigma Z - \\mu)$ gives"),
    eq("\\text{ES}_\\alpha = V\\left(\\sigma\\,\\frac{\\varphi(z_\\alpha)}{1-\\alpha} - \\mu\\right)."),
    p("At $\\alpha = 99\\%$ the factor is $\\varphi(2.326)/0.01 \\approx 2.665$, about 15% above $z_{0.99}$."),

    {
      kind: "check",
      id: "risk-measures/normal-var-95",
      prompt: "A position of 500,000 has daily volatility $\\sigma = 2\\%$ and $\\mu = 0$. What is its one-day 95% VaR in the normal model? Use $z_{0.95} \\approx 1.645$.",
      answer: { type: "number", value: 16449, tolerance: 15 },
      explain: "$\\text{VaR}_{0.95} = V\\sigma z_{0.95} = 500{,}000 \\times 0.02 \\times 1.645 \\approx 16{,}450$ (16,449 with the exact quantile 1.6449). On about one day in twenty the loss should exceed this amount.",
    },

    h("Scaling with the horizon"),
    p("Volatility is usually estimated from daily returns. As shown in \"Returns and volatility\", if daily returns are independent and identically distributed, variances add over days, so over $h$ days"),
    eq("\\sigma_h = \\sigma_1\\sqrt{h}, \\qquad \\mu_h = \\mu_1 h."),
    p("Over short horizons $\\mu$ is tiny compared with $\\sigma$ and is often set to zero; then VaR and ES grow like $\\sqrt{h}$. The rule relies on three assumptions: returns on different days are independent, volatility stays constant, and the position is not changed during the horizon. Volatility clustering and autocorrelation break the first two, so a scaled 10-day figure is an approximation."),

    h("Worked example"),
    p("A position of $V = 1{,}000{,}000$ has daily volatility $\\sigma = 1.2\\%$ and $\\mu = 0$. The steps below compute its 99% VaR and ES over one day and its VaR over ten days."),
    {
      kind: "worked",
      title: "99% VaR and ES of a 1,000,000 position",
      steps: [
        { text: "Multiply the position by its daily volatility.", tex: "V\\sigma = 1{,}000{,}000 \\times 0.012", result: { value: 12000, tolerance: 1 } },
        { text: "Look up the 99% quantile of the standard normal distribution.", tex: "z_{0.99} = N^{-1}(0.99)", result: { value: 2.326, tolerance: 0.001 } },
        { text: "The one-day VaR is $V\\sigma$ times the quantile.", tex: "\\text{VaR}_{0.99} = V\\sigma \\cdot z_{0.99}", result: { value: 27916, tolerance: 15 } },
        { text: "The one-day ES uses the tail factor $\\varphi(z_{0.99})/0.01 \\approx 2.665$ in place of the quantile.", tex: "\\text{ES}_{0.99} = V\\sigma \\cdot \\frac{\\varphi(z_{0.99})}{0.01}", result: { value: 31983, tolerance: 15 } },
        { text: "Over ten days the volatility, and with $\\mu = 0$ also the VaR, grows by the factor $\\sqrt{10} \\approx 3.162$.", tex: "\\text{VaR}^{(10)}_{0.99} = \\text{VaR}_{0.99} \\cdot \\sqrt{10}", result: { value: 88279, tolerance: 50 } },
      ],
    },
    p("The ten-day volatility is $\\sigma_{10} = 1.2\\% \\times \\sqrt{10} \\approx 3.79\\%$, and the ten-day ES scales in the same way, to about 101,138."),

    h("Fat tails"),
    p("Daily returns have more extreme days than the normal predicts. A simple fat-tailed model is the **Student t** distribution with $\\nu$ degrees of freedom. Its variance is $\\nu/(\\nu-2)$, so we rescale it by $\\sqrt{(\\nu-2)/\\nu}$ to unit variance and multiply by $\\sigma$. Both models then have the same volatility and differ only in shape: the t puts more weight in the far tail and in the centre, less in between. Small $\\nu$ means fat tails; as $\\nu \\to \\infty$ the t becomes normal."),
    p("For $\\nu = 4$ the multipliers of $\\sigma$ are:"),
    list(
      "$\\alpha = 97.5\\%$: VaR 1.96 under both models; ES 2.34 (normal) against 2.82 (t).",
      "$\\alpha = 99\\%$: VaR 2.33 against 2.65 (14% higher); ES 2.67 against 3.69 (38% higher).",
      "$\\alpha = 99.9\\%$: VaR 3.09 against 5.07; ES 3.37 against 6.84, about twice as much.",
    ),
    p("In the worked example the fat-tailed one-day 99% VaR is about 31,794 and the ES about 44,280. A VaR at a moderate confidence level hardly sees the tail; the ES, which averages over the tail, does, and the gap widens as $\\alpha$ rises."),
    p("The figure uses a position of 100 with daily volatility 1.2% and zero mean. Sliders set the confidence level $\\alpha$ (90% to 99.5%), the horizon in days (1 to 20, volatility scaled by $\\sqrt{h}$) and the degrees of freedom $\\nu$ of the fat-tailed model (3 to 30). The chart shows the loss distribution under the normal model and under the Student t with the same volatility, with vertical lines at the two VaRs. The readouts give VaR and ES under both models, per 100 invested. With $\\alpha = 99\\%$, one day and $\\nu = 4$ they read 2.79 and 3.20 (normal) and 3.18 and 4.43 (t). Raise $\\alpha$ towards 99.5% and watch the fat-tailed ES move away from the normal one; then lower $\\nu$ and see the same effect grow."),
    figure("var-es"),

    h("Historical simulation"),
    p("Instead of assuming a distribution, **historical simulation** reuses the past. Take, say, the last 500 daily returns, apply each to today's position to get 500 hypothetical losses, and sort them. The 99% VaR is about the fifth-largest loss and the ES the average of the five largest. The method captures fat tails and correlations as they actually occurred, but only those in the window: a calm window gives a low VaR right before a crisis."),

    h("Properties of VaR and ES"),
    p("Because VaR is a single quantile, two positions with the same VaR can have very different losses beyond it. Worse, VaR is not **subadditive**: the VaR of a portfolio can exceed the sum of the VaRs of its parts. Example: two independent bonds each lose 100 with probability 4% and nothing otherwise. Each has a 95% VaR of 0, since a loss occurs with probability below 5%. Holding both, the probability of at least one default is $1 - 0.96^2 = 7.84\\%$, so the portfolio's 95% VaR is 100. Measured by VaR, diversification looks harmful."),
    p("Expected shortfall is subadditive, $\\text{ES}(L_1 + L_2) \\le \\text{ES}(L_1) + \\text{ES}(L_2)$; in the example each bond has ES 80 and the pair 103.2, well below 160. Together with three simpler properties (monotonicity, translation invariance, positive homogeneity) this makes ES a **coherent risk measure**."),
    note("VaR answers \"how bad can it get on a normal bad day\"; ES answers \"how bad is it on average once that line is crossed\". For this reason the Basel Fundamental Review of the Trading Book (FRTB) replaced 99% VaR by 97.5% ES for market risk capital. Under the normal model the two are almost equal (2.326 against 2.338 standard deviations); with fat tails ES is larger."),

    {
      kind: "check",
      id: "risk-measures/subadditivity",
      prompt: "Which risk measure can make a diversified portfolio look riskier than the sum of its parts?",
      answer: { type: "choice", options: ["Value at Risk", "Expected shortfall", "Both of them", "Neither of them"], correct: 0 },
      explain: "VaR is not subadditive: in the two-bond example each bond has a 95% VaR of 0, but the pair has 100. ES is subadditive, so $\\text{ES}(L_1 + L_2) \\le \\text{ES}(L_1) + \\text{ES}(L_2)$ always holds.",
    },

    h("Portfolio VaR"),
    p("For a portfolio with weights $w$ and return covariance matrix $\\Sigma$, the lesson \"Diversification and correlation\" gives $\\sigma_p^2 = w^\\top\\Sigma\\,w$, and in the normal model $\\text{VaR}_\\alpha = V(\\sigma_p z_\\alpha - \\mu_p)$. With correlations below one, $\\sigma_p$ is less than the weighted average of the volatilities, so the portfolio VaR is less than the sum of the separate VaRs. Splitting the 1,000,000 above into two positions of 500,000, each with daily volatility 1.2% and correlation 0.3, gives $\\sigma_p = 1.2\\% \\times \\sqrt{0.65} \\approx 0.97\\%$ and a 99% VaR of about 22,507 instead of 27,916."),

    h("Summary"),
    list(
      "The loss over a horizon is $L = -VR$; $\\text{VaR}_\\alpha$ is its $\\alpha$-quantile, a positive amount of money.",
      "$\\text{ES}_\\alpha$ is the average loss in the worst $1-\\alpha$ tail and is never below VaR.",
      "Normal model: $\\text{VaR}_\\alpha = V(\\sigma z_\\alpha - \\mu)$, $\\text{ES}_\\alpha = V(\\sigma\\varphi(z_\\alpha)/(1-\\alpha) - \\mu)$, with $\\sigma_h = \\sigma_1\\sqrt{h}$ under independence and constant volatility.",
      "With fat tails VaR rises moderately but ES much more, increasingly so at high confidence levels.",
      "ES is subadditive and coherent, VaR is not; regulation (FRTB) uses 97.5% ES.",
    ),
    lab("/risk-return", "Estimate means, volatilities and the risk–return trade-off in the Risk & Return lab"),
  ],

  hu: [
    p("A „Hozamok és volatilitás” című lecke a kockázatot a $\\sigma$ volatilitással, a hozamok szórásával mérte. A kockázatkezelő általában másfajta választ vár: egy pénzösszeget, amelyet a pozíció elveszíthet. Ez a lecke egy hozameloszlásból két ilyen számot készít, a kockáztatott értéket és a várható veszteséget, előbb a normális modellben, majd vastag farkú eloszlással, végül portfóliókra, ami visszavezet a „Diverzifikáció és korreláció” című leckéhez."),

    h("A veszteségeloszlás"),
    p("Vegyünk egy ma $V$ értékű pozíciót, és rögzítsünk egy **időtávot**, például egy vagy tíz kereskedési napot. Legyen $R$ a pozíció egyszerű hozama ezen az időtávon. A **veszteség** az értékcsökkenés, pozitív számként:"),
    eq("L = -(V_h - V) = -V R."),
    p("A nyereség negatív veszteség. $L$ eloszlása a **veszteségeloszlás**; a kockázati mértékek ennek jobb farkából, a nagy veszteségek tartományából olvasott számok. Feltesszük, hogy a pozíció az időtáv alatt változatlan."),

    h("Kockáztatott érték"),
    p("Válasszunk egy $\\alpha$ **konfidenciaszintet**, jellemzően 95%-ot vagy 99%-ot. A **kockáztatott érték** (Value at Risk, $\\text{VaR}_\\alpha$) a veszteségeloszlás $\\alpha$-**kvantilise**: az a legkisebb $\\ell$ összeg, amelynél a veszteség legalább $\\alpha$ valószínűséggel nem nagyobb,"),
    eq("\\text{VaR}_\\alpha = \\min\\{\\ell : \\mathbb{P}(L \\le \\ell) \\ge \\alpha\\}."),
    p("Az egynapos 99%-os, 28 000-es VaR jelentése: 100 napból 99-en a veszteség nem haladja meg a 28 000-et. A konvenció itt az, hogy a VaR pozitív pénzösszeg, $\\alpha$ pedig közel van 1-hez."),

    h("Várható veszteség"),
    p("A VaR egy küszöb. Megmondja, milyen gyakran lépjük át, de azt nem, hogy mennyivel. Erre felel a **várható veszteség** (expected shortfall, ES): a kimenetelek legrosszabb $1-\\alpha$ hányadában elszenvedett átlagos veszteség. Folytonos veszteségeloszlásnál"),
    eq("\\text{ES}_\\alpha = \\mathbb{E}\\big[L \\mid L \\ge \\text{VaR}_\\alpha\\big] = \\frac{1}{1-\\alpha}\\int_\\alpha^1 \\text{VaR}_u\\,du."),
    p("A második alak szerint az ES az $\\alpha$ fölötti összes VaR átlaga, így mindig $\\text{ES}_\\alpha \\ge \\text{VaR}_\\alpha$."),

    h("A normális modell"),
    p("Tegyük fel, hogy az időtávra vett hozam normális eloszlású, $R \\sim N(\\mu, \\sigma^2)$. Ekkor $L = V(\\sigma Z - \\mu)$, ahol $Z$ standard normális ($Z$ előjelét megfordítottuk, amit a normális eloszlás szimmetriája megenged). Legyen $z_\\alpha = N^{-1}(\\alpha)$ a standard normális kvantilis, például $z_{0{,}99} \\approx 2{,}326$. Mivel $L$ a $Z$ növekvő függvénye, a kvantilise"),
    eq("\\text{VaR}_\\alpha = V\\,(\\sigma z_\\alpha - \\mu)."),
    p("A várható veszteséghez $Z$ átlaga kell $z_\\alpha$ fölött. A $\\varphi(x) = e^{-x^2/2}/\\sqrt{2\\pi}$ standard normális sűrűségre $\\varphi'(x) = -x\\varphi(x)$, így $x\\varphi(x)$ primitív függvénye $-\\varphi(x)$:"),
    eq("\\mathbb{E}[Z \\mid Z \\ge z_\\alpha] = \\frac{1}{1-\\alpha}\\int_{z_\\alpha}^{\\infty} x\\,\\varphi(x)\\,dx = \\frac{1}{1-\\alpha}\\Big[-\\varphi(x)\\Big]_{z_\\alpha}^{\\infty} = \\frac{\\varphi(z_\\alpha)}{1-\\alpha}."),
    p("Ezt $L = V(\\sigma Z - \\mu)$-be helyettesítve"),
    eq("\\text{ES}_\\alpha = V\\left(\\sigma\\,\\frac{\\varphi(z_\\alpha)}{1-\\alpha} - \\mu\\right)."),
    p("$\\alpha = 99\\%$ mellett a szorzó $\\varphi(2{,}326)/0{,}01 \\approx 2{,}665$, körülbelül 15%-kal nagyobb, mint $z_{0{,}99}$."),

    {
      kind: "check",
      id: "risk-measures/normal-var-95",
      prompt: "Egy 500 000 értékű pozíció napi volatilitása $\\sigma = 2\\%$, és $\\mu = 0$. Mekkora az egynapos 95%-os VaR a normális modellben? Használd a $z_{0{,}95} \\approx 1{,}645$ értéket.",
      answer: { type: "number", value: 16449, tolerance: 15 },
      explain: "$\\text{VaR}_{0{,}95} = V\\sigma z_{0{,}95} = 500\\,000 \\times 0{,}02 \\times 1{,}645 \\approx 16\\,450$ (a pontos 1,6449-es kvantilissel 16 449). Nagyjából húsz napból egyen a veszteség meghaladja ezt az összeget.",
    },

    h("Skálázás az időtávval"),
    p("A volatilitást többnyire napi hozamokból becsüljük. Ahogy a „Hozamok és volatilitás” című lecke megmutatta, ha a napi hozamok függetlenek és azonos eloszlásúak, a varianciák napról napra összeadódnak, így $h$ napra"),
    eq("\\sigma_h = \\sigma_1\\sqrt{h}, \\qquad \\mu_h = \\mu_1 h."),
    p("Rövid távon $\\mu$ elenyésző $\\sigma$-hoz képest, ezért gyakran nullának vesszük; ekkor a VaR és az ES $\\sqrt{h}$ szerint nő. A szabály három feltevésen áll: a különböző napok hozamai függetlenek, a volatilitás állandó, és a pozíció az időtáv alatt nem változik. A volatilitás csomósodása és az autokorreláció az első kettőt sérti, ezért a skálázott tíznapos szám csak közelítés."),

    h("Számpélda"),
    p("Egy $V = 1\\,000\\,000$ értékű pozíció napi volatilitása $\\sigma = 1{,}2\\%$, és $\\mu = 0$. Az alábbi lépések kiszámítják az egynapos 99%-os VaR-t és ES-t, valamint a tíznapos VaR-t."),
    {
      kind: "worked",
      title: "Egy 1 000 000 értékű pozíció 99%-os VaR-ja és ES-e",
      steps: [
        { text: "Szorozzuk meg a pozíció értékét a napi volatilitással.", tex: "V\\sigma = 1\\,000\\,000 \\times 0{,}012", result: { value: 12000, tolerance: 1 } },
        { text: "Keressük meg a standard normális eloszlás 99%-os kvantilisét.", tex: "z_{0{,}99} = N^{-1}(0{,}99)", result: { value: 2.326, tolerance: 0.001 } },
        { text: "Az egynapos VaR $V\\sigma$ és a kvantilis szorzata.", tex: "\\text{VaR}_{0{,}99} = V\\sigma \\cdot z_{0{,}99}", result: { value: 27916, tolerance: 15 } },
        { text: "Az egynapos ES-hez a kvantilis helyett a $\\varphi(z_{0{,}99})/0{,}01 \\approx 2{,}665$ farokszorzó kell.", tex: "\\text{ES}_{0{,}99} = V\\sigma \\cdot \\frac{\\varphi(z_{0{,}99})}{0{,}01}", result: { value: 31983, tolerance: 15 } },
        { text: "Tíz napra a volatilitás, és $\\mu = 0$ mellett a VaR is, a $\\sqrt{10} \\approx 3{,}162$-szeresére nő.", tex: "\\text{VaR}^{(10)}_{0{,}99} = \\text{VaR}_{0{,}99} \\cdot \\sqrt{10}", result: { value: 88279, tolerance: 50 } },
      ],
    },
    p("A tíznapos volatilitás $\\sigma_{10} = 1{,}2\\% \\times \\sqrt{10} \\approx 3{,}79\\%$, és a tíznapos ES ugyanígy skálázódik, körülbelül 101 138-ra."),

    h("Vastag farok"),
    p("A napi hozamok között több a szélsőséges nap, mint amennyit a normális eloszlás jósol. Egy egyszerű **vastag farkú** modell a $\\nu$ szabadsági fokú **Student-féle t-eloszlás**. Ennek varianciája $\\nu/(\\nu-2)$, ezért $\\sqrt{(\\nu-2)/\\nu}$-vel egységnyi varianciára skálázzuk, majd $\\sigma$-val szorozzuk. Így a két modell volatilitása azonos, csak az alakjuk különbözik: a t több súlyt tesz a távoli farokba és a közepére, kevesebbet a kettő közé. Kis $\\nu$ vastag farkot jelent; $\\nu \\to \\infty$ esetén a t normálissá válik."),
    p("$\\nu = 4$ mellett a $\\sigma$ szorzói:"),
    list(
      "$\\alpha = 97{,}5\\%$: a VaR mindkét modellben 1,96; az ES 2,34 (normális), illetve 2,82 (t).",
      "$\\alpha = 99\\%$: a VaR 2,33, illetve 2,65 (14%-kal nagyobb); az ES 2,67, illetve 3,69 (38%-kal nagyobb).",
      "$\\alpha = 99{,}9\\%$: a VaR 3,09, illetve 5,07; az ES 3,37, illetve 6,84, nagyjából a kétszerese.",
    ),
    p("A számpéldában a vastag farkú egynapos 99%-os VaR körülbelül 31 794, az ES körülbelül 44 280. Mérsékelt konfidenciaszinten a VaR alig érzékeli a farkat; a farok fölött átlagoló ES viszont igen, és a különbség $\\alpha$ növekedésével nő."),
    p("Az ábrán egy 100 értékű pozíció szerepel 1,2%-os napi volatilitással és nulla várható hozammal. A csúszkák az $\\alpha$ konfidenciaszintet (90% és 99,5% között), az időtávot napokban (1 és 20 között, a volatilitás $\\sqrt{h}$ szerint skálázva) és a vastag farkú modell $\\nu$ szabadsági fokát (3 és 30 között) állítják. A grafikon a veszteségeloszlást mutatja a normális modellben és az azonos volatilitású Student-t modellben, a két VaR-nál függőleges vonalakkal. A kijelzők mindkét modellre megadják a VaR-t és az ES-t, 100 befektetett egységre vetítve. $\\alpha = 99\\%$, egy nap és $\\nu = 4$ mellett az értékek 2,79 és 3,20 (normális), illetve 3,18 és 4,43 (t). Emeld $\\alpha$-t 99,5% felé, és figyeld, ahogy a vastag farkú ES eltávolodik a normálistól; aztán csökkentsd $\\nu$-t, és nézd, ahogy ugyanez a hatás erősödik."),
    figure("var-es"),

    h("Történeti szimuláció"),
    p("Eloszlás feltételezése helyett a **történeti szimuláció** a múltat használja fel újra. Vegyük például az utolsó 500 napi hozamot, alkalmazzuk mindegyiket a mai pozícióra, így 500 hipotetikus veszteséget kapunk, és rendezzük sorba őket. A 99%-os VaR nagyjából az ötödik legnagyobb veszteség, az ES az öt legnagyobb átlaga. A módszer úgy ragadja meg a vastag farkat és a korrelációkat, ahogy azok ténylegesen előfordultak, de csak az ablakon belül: egy nyugodt időszak alacsony VaR-t ad, akár közvetlenül egy válság előtt is."),

    h("A VaR és az ES tulajdonságai"),
    p("Mivel a VaR egyetlen kvantilis, két azonos VaR-ú pozíció veszteségei a küszöb fölött nagyon különbözhetnek. Ráadásul a VaR nem **szubadditív**: egy portfólió VaR-ja nagyobb lehet a részei VaR-jainak összegénél. Példa: két független kötvény mindegyike 4% valószínűséggel 100-at veszít, egyébként semmit. Mindkettő 95%-os VaR-ja 0, hiszen veszteség 5%-nál kisebb valószínűséggel lép fel. A kettőt együtt tartva legalább egy csőd valószínűsége $1 - 0{,}96^2 = 7{,}84\\%$, így a portfólió 95%-os VaR-ja 100. A VaR-ral mérve a diverzifikáció károsnak tűnik."),
    p("A várható veszteség szubadditív, $\\text{ES}(L_1 + L_2) \\le \\text{ES}(L_1) + \\text{ES}(L_2)$; a példában kötvényenként az ES 80, a párra 103,2, jóval 160 alatt. Három egyszerűbb tulajdonsággal (monotonitás, eltolás-invariancia, pozitív homogenitás) együtt ez teszi az ES-t **koherens kockázati mértékké**."),
    note("A VaR arra felel, mekkora a veszteség egy „szokásos rossz napon”; az ES arra, hogy átlagosan mekkora, ha ezt a határt átléptük. Ezért cserélte le a bázeli szabályozás a kereskedési könyv alapvető felülvizsgálatában (FRTB) a piaci kockázati tőkekövetelményhez használt 99%-os VaR-t 97,5%-os ES-re. A normális modellben a kettő szinte egyenlő (2,326, illetve 2,338 szórásnyi); vastag farok mellett az ES nagyobb."),

    {
      kind: "check",
      id: "risk-measures/subadditivity",
      prompt: "Melyik kockázati mérték mutathat egy diverzifikált portfóliót kockázatosabbnak, mint a részeit együttvéve?",
      answer: { type: "choice", options: ["A kockáztatott érték (VaR)", "A várható veszteség (ES)", "Mindkettő", "Egyik sem"], correct: 0 },
      explain: "A VaR nem szubadditív: a két kötvényes példában mindkét kötvény 95%-os VaR-ja 0, a páré viszont 100. Az ES szubadditív, így mindig teljesül $\\text{ES}(L_1 + L_2) \\le \\text{ES}(L_1) + \\text{ES}(L_2)$.",
    },

    h("Portfólió-VaR"),
    p("Egy $w$ súlyú portfólióra, $\\Sigma$ hozam-kovarianciamátrix mellett a „Diverzifikáció és korreláció” című lecke szerint $\\sigma_p^2 = w^\\top\\Sigma\\,w$, a normális modellben pedig $\\text{VaR}_\\alpha = V(\\sigma_p z_\\alpha - \\mu_p)$. Egynél kisebb korrelációk mellett $\\sigma_p$ kisebb a volatilitások súlyozott átlagánál, így a portfólió VaR-ja kisebb a külön számolt VaR-ok összegénél. Ha a fenti 1 000 000-t két 500 000-es pozícióra osztjuk, mindkettő napi volatilitása 1,2%, a korreláció 0,3, akkor $\\sigma_p = 1{,}2\\% \\times \\sqrt{0{,}65} \\approx 0{,}97\\%$, és a 99%-os VaR körülbelül 22 507 a 27 916 helyett."),

    h("Összefoglalás"),
    list(
      "Az időtávra vett veszteség $L = -VR$; a $\\text{VaR}_\\alpha$ ennek $\\alpha$-kvantilise, pozitív pénzösszeg.",
      "Az $\\text{ES}_\\alpha$ a legrosszabb $1-\\alpha$ farokban elszenvedett átlagos veszteség, és sosem kisebb a VaR-nál.",
      "Normális modell: $\\text{VaR}_\\alpha = V(\\sigma z_\\alpha - \\mu)$, $\\text{ES}_\\alpha = V(\\sigma\\varphi(z_\\alpha)/(1-\\alpha) - \\mu)$, ahol függetlenség és állandó volatilitás mellett $\\sigma_h = \\sigma_1\\sqrt{h}$.",
      "Vastag farok mellett a VaR mérsékelten, az ES sokkal jobban nő, és ez magas konfidenciaszinten egyre erősebb.",
      "Az ES szubadditív és koherens, a VaR nem; a szabályozás (FRTB) 97,5%-os ES-t használ.",
    ),
    lab("/risk-return", "Becsülj várható hozamot, volatilitást és kockázat–hozam viszonyt a Kockázat és hozam laborban"),
  ],
};
