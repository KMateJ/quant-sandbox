import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p, steps } from "./blocks";

export const monteCarloPricing: GuideLessonContent = {
  en: [
    p("Many quantities in finance are expected values: the price of an option is a discounted expected payoff, a risk measure is a tail probability. When the expectation has no closed form, it can be estimated by **Monte Carlo simulation**: draw many random outcomes and average them. This lesson explains why the average works, how fast it converges, and how to price a European call this way, using the stock price solution from \"Itô's lemma\"."),

    h("Expectations as long-run averages"),
    p("Let $X$ be a random variable whose mean $\\mathbb{E}[X]$ we want. Draw $N$ independent copies $X_1, \\dots, X_N$ with the same distribution and form the **sample mean**"),
    eq("\\hat\\mu_N = \\frac{1}{N} \\sum_{i=1}^{N} X_i."),
    p("The **law of large numbers** says that $\\hat\\mu_N \\to \\mathbb{E}[X]$ as $N \\to \\infty$. This is the entire idea of Monte Carlo: replace an integral that is hard to compute by an average over simulated outcomes that are easy to generate."),
    p("The estimator is **unbiased**: $\\mathbb{E}[\\hat\\mu_N] = \\mathbb{E}[X]$ for every $N$. Any single run is off by a random error, but the error has no systematic direction."),

    h("Standard error"),
    p("Let $s$ be the standard deviation of one draw $X_i$. Since the draws are independent, the variance of their sum is $N s^2$, and dividing by $N$ gives"),
    eq("\\operatorname{Var}(\\hat\\mu_N) = \\frac{s^2}{N}, \\qquad \\operatorname{SE} = \\operatorname{sd}(\\hat\\mu_N) = \\frac{s}{\\sqrt{N}}."),
    p("This is the **standard error** of the estimate. It falls like $1/\\sqrt{N}$, the same square-root law that governed the random walk in \"Random walks and Brownian motion\". The consequence is sobering: to make the error 10 times smaller you need 100 times as many simulations."),
    note("Monte Carlo error: $\\operatorname{SE} = s/\\sqrt{N}$. One extra digit of accuracy costs a hundredfold more draws."),

    h("Confidence intervals"),
    p("By the central limit theorem, for large $N$ the estimate $\\hat\\mu_N$ is approximately normal around the true mean with standard deviation $\\operatorname{SE}$. The true value $s$ is unknown, so we use the sample standard deviation of the draws in its place. An approximate **95% confidence interval** for $\\mathbb{E}[X]$ is"),
    eq("\\hat\\mu_N \\pm 1.96\\,\\frac{s}{\\sqrt{N}}."),
    p("If the whole experiment were repeated many times, about 95% of such intervals would contain the true mean. Always report a Monte Carlo estimate together with its interval: the estimate alone says nothing about how much to trust it."),

    h("Pricing a European call"),
    p("\"Risk-neutral probabilities\" showed that a derivative's price is its discounted expected payoff under the measure $\\mathbb{Q}$. For a European call with strike $K$ and maturity $T$,"),
    eq("C_0 = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}\\big[\\max(S_T - K,\\ 0)\\big]."),
    p("Under $\\mathbb{Q}$ the stock follows GBM with drift $r$. By Itô's lemma its terminal value is exact: $S_T = S_0 \\exp((r - \\tfrac12\\sigma^2)T + \\sigma W_T)$, and $W_T = \\sqrt{T}\\,Z$ with $Z$ standard normal. No time-stepping is needed for a payoff that depends only on $S_T$. The algorithm is:"),
    steps(
      "Draw $N$ independent standard normal numbers $Z_1, \\dots, Z_N$.",
      "Compute terminal prices $S_T^{(i)} = S_0 \\exp\\big((r - \\tfrac12\\sigma^2)T + \\sigma\\sqrt{T}\\,Z_i\\big)$.",
      "Compute payoffs $\\max(S_T^{(i)} - K, 0)$ and discount each by $e^{-rT}$.",
      "Average the discounted payoffs; their sample standard deviation divided by $\\sqrt{N}$ is the standard error.",
    ),
    p("The figure runs this algorithm in front of you for $S_0 = K = 100$, $r = 5\\%$, $\\sigma = 20\\%$ and $T = 1$. Each draw of $S_T$ drops into a histogram of terminal prices; the bins to the right of the strike line are tinted, because only there does the call pay. Press +1 a few times and watch single draws land, mostly near 100 and some far out. Then press Play: draws arrive faster and faster, the histogram takes the skewed log-normal shape, and the strip below shows the running estimate with its 95% band narrowing around the Black–Scholes price of 10.45. The readouts give the number of draws, the estimate, its standard error and the share of draws that end in the money, which settles near $N(d_2) \\approx 0.56$. Reset starts a new sample."),
    figure("mc-histogram"),

    h("A small worked example"),
    p("Take $S_0 = 100$, $K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$. Then $(r - \\tfrac12\\sigma^2)T = 0.03$ and $\\sigma\\sqrt{T} = 0.2$. Suppose five draws are $Z = 0.5,\\ -1.2,\\ 1.5,\\ 0.1,\\ -0.3$. The terminal prices are $100\\,e^{0.03 + 0.2Z}$:"),
    list(
      "$Z = 0.5$: $S_T = 100\\,e^{0.13} \\approx 113.88$, payoff $13.88$.",
      "$Z = -1.2$: $S_T = 100\\,e^{-0.21} \\approx 81.06$, payoff $0$.",
      "$Z = 1.5$: $S_T = 100\\,e^{0.33} \\approx 139.10$, payoff $39.10$.",
      "$Z = 0.1$: $S_T = 100\\,e^{0.05} \\approx 105.13$, payoff $5.13$.",
      "$Z = -0.3$: $S_T = 100\\,e^{-0.03} \\approx 97.04$, payoff $0$.",
    ),
    p("The average payoff is $58.11 / 5 \\approx 11.62$, and discounting gives $11.62\\,e^{-0.05} \\approx 11.05$. The Black–Scholes price for these inputs is $10.45$. Five draws are far too few: the estimate is in the right region, but its error is large."),

    h("Comparing with Black–Scholes"),
    p("For these inputs the standard deviation of one discounted payoff is about $s \\approx 14.72$, larger than the price itself, because most of the value comes from a minority of paths that end far in the money. The standard error and the half-width of the 95% interval are therefore"),
    list(
      "$N = 100$: $\\operatorname{SE} \\approx 1.47$, interval $\\pm 2.89$.",
      "$N = 1000$: $\\operatorname{SE} \\approx 0.47$, interval $\\pm 0.91$.",
      "$N = 5000$: $\\operatorname{SE} \\approx 0.21$, interval $\\pm 0.41$.",
    ),
    p("Even 5000 paths pin the price down only to within about $\\pm 0.41$ of the Black–Scholes value $10.45$. At $\\sigma = 40\\%$ the price rises to about $18.02$ and the payoff standard deviation to about $31.29$, so the interval at $N = 5000$ widens to about $\\pm 0.87$: more volatile payoffs need more draws for the same accuracy."),
    p("The figure prices this call ($S_0 = 100$, $K = 100$, $r = 5\\%$, $T = 1$) with terminal prices drawn exactly from GBM under $\\mathbb{Q}$. It plots the running Monte Carlo estimate against the number of simulations up to 5000, with the band $\\pm 1.96\\,\\operatorname{SE}$ around it and the Black–Scholes price as a horizontal line. Press \"New sample\" a few times: the early part of the curve jumps around, while the band narrows like $1/\\sqrt{N}$ and nearly always contains the line. Move the $\\sigma$ slider and note that the band widens. The readouts at $N = 5000$ give the estimate, its standard error, the Black–Scholes price and the error."),
    figure("monte-carlo-convergence"),
    p("For a European call the closed form is obviously better. Monte Carlo pays off for payoffs that depend on the whole path (Asian or barrier options), for many underlyings at once, and for models such as Heston where no simple formula exists. The flexibility is the same in all cases; only the payoff function changes."),

    h("Variance reduction"),
    p("Since the error is $s/\\sqrt{N}$, there are two ways to improve it: raise $N$, or lower $s$. Techniques that lower $s$ are called **variance reduction**. The simplest is **antithetic variates**: for every draw $Z$ also use $-Z$, and average the two payoffs. The pair moves in opposite directions, so much of their noise cancels. Another is a **control variate**: simulate alongside a quantity whose mean is known exactly, such as the discounted stock price with mean $S_0$, and correct the estimate by the observed error in that quantity."),

    h("Summary"),
    list(
      "Monte Carlo estimates an expectation by the average of $N$ independent simulated outcomes; the law of large numbers makes it converge.",
      "The standard error is $s/\\sqrt{N}$: halving the error needs four times as many draws.",
      "A 95% confidence interval is the estimate $\\pm 1.96\\,s/\\sqrt{N}$.",
      "A European call is priced by averaging $e^{-rT}\\max(S_T - K, 0)$ over risk-neutral draws of $S_T = S_0 e^{(r - \\sigma^2/2)T + \\sigma\\sqrt{T}Z}$; the result converges to Black–Scholes.",
      "Its real strength is flexibility: path-dependent payoffs and models without closed forms.",
    ),
    note("Monte Carlo price $= e^{-rT} \\times$ average payoff, reported with its standard error $s/\\sqrt{N}$."),
    lab("/monte-carlo", "Watch the Monte Carlo estimate and its confidence interval converge in the Monte Carlo lab"),
  ],

  hu: [
    p("A pénzügyekben sok mennyiség várható érték: egy opció ára a diszkontált várható kifizetés, egy kockázati mérőszám egy farokvalószínűség. Ha a várható értékre nincs zárt képlet, **Monte Carlo-szimulációval** becsülhető: sok véletlen kimenetelt sorsolunk, és átlagoljuk őket. Ez a lecke elmagyarázza, miért működik az átlagolás, milyen gyorsan konvergál, és hogyan árazható így egy európai call, felhasználva a részvényár pontos megoldását, amelyet „Az Itô-lemma” című lecke vezetett le."),

    h("Várható érték mint hosszú távú átlag"),
    p("Legyen $X$ egy valószínűségi változó, amelynek $\\mathbb{E}[X]$ várható értékét keressük. Sorsoljunk $N$ független, azonos eloszlású példányt, $X_1, \\dots, X_N$-et, és képezzük a **mintaátlagot**:"),
    eq("\\hat\\mu_N = \\frac{1}{N} \\sum_{i=1}^{N} X_i."),
    p("A **nagy számok törvénye** szerint $\\hat\\mu_N \\to \\mathbb{E}[X]$, ha $N \\to \\infty$. Ez a Monte Carlo módszer teljes alapötlete: egy nehezen kiszámolható integrált könnyen előállítható szimulált kimenetelek átlagával helyettesítünk."),
    p("A becslés **torzítatlan**: minden $N$-re $\\mathbb{E}[\\hat\\mu_N] = \\mathbb{E}[X]$. Egy-egy futás véletlen hibával tér el, de a hibának nincs szisztematikus iránya."),

    h("A standard hiba"),
    p("Legyen $s$ egyetlen $X_i$ sorsolás szórása. Mivel a sorsolások függetlenek, összegük varianciája $N s^2$, és $N$-nel osztva"),
    eq("\\operatorname{Var}(\\hat\\mu_N) = \\frac{s^2}{N}, \\qquad \\operatorname{SE} = \\operatorname{sd}(\\hat\\mu_N) = \\frac{s}{\\sqrt{N}}."),
    p("Ez a becslés **standard hibája**. $1/\\sqrt{N}$-ként csökken, ugyanazzal a négyzetgyökös törvénnyel, amely a „Véletlen bolyongás és Brown-mozgás” lecke bolyongását is irányította. A következmény kijózanító: a hiba tizedére csökkentéséhez százszor annyi szimuláció kell."),
    note("Monte Carlo-hiba: $\\operatorname{SE} = s/\\sqrt{N}$. Egy további tizedesjegy pontosság százszor annyi sorsolásba kerül."),

    h("Konfidenciaintervallum"),
    p("A centrális határeloszlás-tétel szerint nagy $N$ esetén $\\hat\\mu_N$ közelítőleg normális eloszlású a valódi várható érték körül, $\\operatorname{SE}$ szórással. A valódi $s$ ismeretlen, ezért a sorsolások mintabeli szórását használjuk helyette. Az $\\mathbb{E}[X]$ közelítő **95%-os konfidenciaintervalluma**"),
    eq("\\hat\\mu_N \\pm 1{,}96\\,\\frac{s}{\\sqrt{N}}."),
    p("Ha a teljes kísérletet sokszor megismételnénk, az ilyen intervallumok kb. 95%-a tartalmazná a valódi várható értéket. Monte Carlo-becslést mindig az intervallumával együtt közölj: a becslés önmagában semmit sem mond arról, mennyire lehet megbízni benne."),

    h("Egy európai call árazása"),
    p("A „Kockázatsemleges valószínűségek” lecke megmutatta, hogy egy derivatíva ára a $\\mathbb{Q}$ mérték szerinti diszkontált várható kifizetése. Egy $K$ kötési árú, $T$ lejáratú európai callra"),
    eq("C_0 = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}\\big[\\max(S_T - K,\\ 0)\\big]."),
    p("$\\mathbb{Q}$ alatt a részvény $r$ driftű GBM-et követ. Az Itô-lemma szerint a végső értéke pontosan ismert: $S_T = S_0 \\exp((r - \\tfrac12\\sigma^2)T + \\sigma W_T)$, ahol $W_T = \\sqrt{T}\\,Z$, $Z$ standard normális. Olyan kifizetésnél, amely csak $S_T$-től függ, nincs szükség időléptetésre. Az algoritmus:"),
    steps(
      "Sorsolj $N$ független standard normális számot: $Z_1, \\dots, Z_N$.",
      "Számold ki a végső árakat: $S_T^{(i)} = S_0 \\exp\\big((r - \\tfrac12\\sigma^2)T + \\sigma\\sqrt{T}\\,Z_i\\big)$.",
      "Számold ki a $\\max(S_T^{(i)} - K, 0)$ kifizetéseket, és mindegyiket diszkontáld $e^{-rT}$-vel.",
      "Átlagold a diszkontált kifizetéseket; mintabeli szórásuk $\\sqrt{N}$-nel osztva a standard hiba.",
    ),
    p("Az ábra a szemünk előtt futtatja le ezt az algoritmust $S_0 = K = 100$, $r = 5\\%$, $\\sigma = 20\\%$ és $T = 1$ mellett. Minden $S_T$-húzás egy végsőár-hisztogramba kerül; a kötési ár vonalától jobbra eső oszlopok színezettek, mert a call csak ott fizet. Nyomjuk meg néhányszor a +1 gombot, és figyeljük az egyes húzásokat: a legtöbb 100 közelében landol, némelyik messze kint. Ezután az Indítás gombbal a húzások egyre gyorsabban érkeznek, a hisztogram felveszi a ferde lognormális alakot, az alatta lévő sáv pedig a futó becslést mutatja 95%-os sávjával együtt, amely a 10,45-ös Black–Scholes-ár körül szűkül. A kijelzők a húzások számát, a becslést, a standard hibát és a pénzben végző húzások arányát adják, ez utóbbi $N(d_2) \\approx 0{,}56$ közelében állapodik meg. Az Újrakezdés új mintát indít."),
    figure("mc-histogram"),

    h("Egy kis számpélda"),
    p("Legyen $S_0 = 100$, $K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$. Ekkor $(r - \\tfrac12\\sigma^2)T = 0{,}03$ és $\\sigma\\sqrt{T} = 0{,}2$. Tegyük fel, hogy az öt sorsolás $Z = 0{,}5;\\ -1{,}2;\\ 1{,}5;\\ 0{,}1;\\ -0{,}3$. A végső árak $100\\,e^{0{,}03 + 0{,}2Z}$:"),
    list(
      "$Z = 0{,}5$: $S_T = 100\\,e^{0{,}13} \\approx 113{,}88$, kifizetés $13{,}88$.",
      "$Z = -1{,}2$: $S_T = 100\\,e^{-0{,}21} \\approx 81{,}06$, kifizetés $0$.",
      "$Z = 1{,}5$: $S_T = 100\\,e^{0{,}33} \\approx 139{,}10$, kifizetés $39{,}10$.",
      "$Z = 0{,}1$: $S_T = 100\\,e^{0{,}05} \\approx 105{,}13$, kifizetés $5{,}13$.",
      "$Z = -0{,}3$: $S_T = 100\\,e^{-0{,}03} \\approx 97{,}04$, kifizetés $0$.",
    ),
    p("Az átlagos kifizetés $58{,}11 / 5 \\approx 11{,}62$, diszkontálva $11{,}62\\,e^{-0{,}05} \\approx 11{,}05$. Ezekre az adatokra a Black–Scholes-ár $10{,}45$. Öt sorsolás messze kevés: a becslés jó tartományban van, de a hibája nagy."),

    h("Összevetés a Black–Scholes-árral"),
    p("Ezekre az adatokra egyetlen diszkontált kifizetés szórása kb. $s \\approx 14{,}72$, nagyobb, mint maga az ár, mert az érték nagy része a pályák kisebb hányadából származik, amelyek mélyen pénzben végződnek. A standard hiba és a 95%-os intervallum fél szélessége így"),
    list(
      "$N = 100$: $\\operatorname{SE} \\approx 1{,}47$, intervallum $\\pm 2{,}89$.",
      "$N = 1000$: $\\operatorname{SE} \\approx 0{,}47$, intervallum $\\pm 0{,}91$.",
      "$N = 5000$: $\\operatorname{SE} \\approx 0{,}21$, intervallum $\\pm 0{,}41$.",
    ),
    p("Még 5000 pálya is csak kb. $\\pm 0{,}41$ pontossággal határozza meg az árat a $10{,}45$-ös Black–Scholes-érték körül. $\\sigma = 40\\%$ mellett az ár kb. $18{,}02$-re, a kifizetés szórása kb. $31{,}29$-re nő, így az intervallum $N = 5000$-nél kb. $\\pm 0{,}87$-re szélesedik: ingadozóbb kifizetéshez ugyanakkora pontossághoz több sorsolás kell."),
    p("Az ábra ezt a callt árazza ($S_0 = 100$, $K = 100$, $r = 5\\%$, $T = 1$), a végső árakat pontosan a $\\mathbb{Q}$ alatti GBM-ből sorsolva. A futó Monte Carlo-becslést ábrázolja a szimulációk számának függvényében 5000-ig, körülötte a $\\pm 1{,}96\\,\\operatorname{SE}$ sávval, a Black–Scholes-árat pedig vízszintes egyenesként. Nyomd meg néhányszor az „Új minta” gombot: a görbe eleje ugrál, a sáv viszont $1/\\sqrt{N}$-ként szűkül, és szinte mindig tartalmazza az egyenest. Mozgasd a $\\sigma$ csúszkát, és figyeld meg, hogy a sáv szélesedik. Az $N = 5000$-nél mutatott kijelzők a becslést, a standard hibát, a Black–Scholes-árat és a hibát adják."),
    figure("monte-carlo-convergence"),
    p("Európai callnál a zárt képlet nyilvánvalóan jobb. A Monte Carlo ott térül meg, ahol a kifizetés a teljes pályától függ (ázsiai vagy korlátos opciók), ahol egyszerre sok alaptermék van, és olyan modelleknél, mint a Heston, ahol nincs egyszerű képlet. A rugalmasság minden esetben ugyanaz; csak a kifizetésfüggvény változik."),

    h("Varianciacsökkentés"),
    p("Mivel a hiba $s/\\sqrt{N}$, kétféleképpen javítható: $N$ növelésével vagy $s$ csökkentésével. Az $s$-t csökkentő eljárásokat **varianciacsökkentésnek** nevezzük. A legegyszerűbb az **antitetikus változók** módszere: minden $Z$ sorsolás mellett $-Z$-t is használjuk, és a két kifizetést átlagoljuk. A pár ellentétes irányba mozog, így zajuk nagy része kioltja egymást. Egy másik a **kontrollváltozó**: a szimuláció mellett egy pontosan ismert várható értékű mennyiséget is követünk, például a diszkontált részvényárat, amelynek várható értéke $S_0$, és a becslést az ebben a mennyiségben megfigyelt hibával korrigáljuk."),

    h("Összefoglalás"),
    list(
      "A Monte Carlo egy várható értéket $N$ független szimulált kimenetel átlagával becsül; a nagy számok törvénye biztosítja a konvergenciát.",
      "A standard hiba $s/\\sqrt{N}$: a hiba felezéséhez négyszer annyi sorsolás kell.",
      "A 95%-os konfidenciaintervallum a becslés $\\pm 1{,}96\\,s/\\sqrt{N}$.",
      "Egy európai call ára az $e^{-rT}\\max(S_T - K, 0)$ átlaga az $S_T = S_0 e^{(r - \\sigma^2/2)T + \\sigma\\sqrt{T}Z}$ kockázatsemleges sorsolásain; az eredmény a Black–Scholes-árhoz konvergál.",
      "Igazi ereje a rugalmasság: pályafüggő kifizetések és zárt képlet nélküli modellek.",
    ),
    note("Monte Carlo-ár $= e^{-rT} \\times$ átlagos kifizetés, az $s/\\sqrt{N}$ standard hibával együtt közölve."),
    lab("/monte-carlo", "Kövesd a Monte Carlo-becslés és konfidenciaintervallumának konvergenciáját a Monte Carlo laborban"),
  ],
};
