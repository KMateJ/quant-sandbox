import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const returnsVolatility: GuideLessonContent = {
  en: [
    p("The lesson \"Interest, compounding and discounting\" dealt with money that grows at a known rate. A stock does not: its price moves up and down in a way nobody can predict exactly. This lesson introduces the two numbers used to describe such movements, the average return and the volatility, and shows how both scale with the length of the holding period."),

    h("Prices and returns"),
    p("Write $S_t$ for the price of a stock at time $t$. Prices themselves are awkward to compare: a move of 5 means a lot for a stock at 20 and little for a stock at 1000. What an investor cares about is the change relative to the starting price. So instead of prices we study **returns**, the relative change over a period."),
    p("Throughout this lesson the stock pays no dividends, so the price change is the whole return."),

    h("Simple returns"),
    p("The **simple return** from time $t-1$ to $t$ is"),
    eq("R_t = \\frac{S_t - S_{t-1}}{S_{t-1}} = \\frac{S_t}{S_{t-1}} - 1."),
    p("It is the number most people mean by \"the stock went up 10%\". Its drawback appears when periods are chained. Over two periods the total growth factor is the product $(1+R_1)(1+R_2)$, not the sum of the returns."),
    p("Example: a price goes from 100 to 110 and then back to 99. The simple returns are $+10\\%$ and $-10\\%$. They add up to zero, yet the investor has lost 1%, because $1.1 \\times 0.9 = 0.99$."),

    h("Log returns"),
    p("The **log return** (continuously compounded return) is the natural logarithm of the growth factor:"),
    eq("r_t = \\ln\\frac{S_t}{S_{t-1}} = \\ln(1 + R_t)."),
    p("It is the rate that, compounded continuously over the period, turns $S_{t-1}$ into $S_t$, exactly as in \"Interest, compounding and discounting\": $S_t = S_{t-1}e^{r_t}$. Because a logarithm turns products into sums, log returns over consecutive periods add up:"),
    eq("\\ln\\frac{S_n}{S_0} = \\ln\\frac{S_1}{S_0} + \\ln\\frac{S_2}{S_1} + \\cdots + \\ln\\frac{S_n}{S_{n-1}} = r_1 + r_2 + \\cdots + r_n."),
    p("In the example above, $\\ln 1.1 \\approx 0.0953$ and $\\ln 0.9 \\approx -0.1054$. Their sum is $-0.0101 = \\ln 0.99$, which correctly reports the 1% loss. For small moves the two kinds of return are nearly equal, since $\\ln(1+R) \\approx R$ when $R$ is close to zero."),
    {
      kind: "check",
      id: "returns-volatility/log-of-a-halving",
      prompt: "A stock falls from 100 to 50. How do its simple and log returns compare?",
      answer: { type: "choice", options: ["Both are $-50\\%$", "The log return is more negative", "The simple return is more negative", "The log return is $+69.3\\%$"], correct: 1 },
      explain: "The simple return is $50/100 - 1 = -50\\%$, the log return $\\ln 0.5 \\approx -69.3\\%$. For large falls the logarithm runs further below zero than $R$ does.",
    },
    p("From here on, \"return\" means log return. Additivity is what makes the scaling rules below so simple."),

    h("Mean and standard deviation"),
    p("Treat the return over one period as a random variable $r$. Its **mean** (expected value) $\\mathbb{E}[r]$ is the average return you would see over many repetitions. Its **standard deviation** measures the typical size of the deviation from that mean:"),
    eq("\\operatorname{sd}(r) = \\sqrt{\\operatorname{Var}(r)}, \\qquad \\operatorname{Var}(r) = \\mathbb{E}\\big[(r - \\mathbb{E}[r])^2\\big]."),
    p("From a sample of $n$ observed returns $r_1, \\dots, r_n$ we estimate them by"),
    eq("\\bar r = \\frac{1}{n}\\sum_{i=1}^{n} r_i, \\qquad s = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n} (r_i - \\bar r)^2}."),
    p("Example: four daily returns of $2\\%$, $-1\\%$, $3\\%$ and $-2\\%$. The mean is $\\bar r = 0.5\\%$. The deviations are $1.5$, $-1.5$, $2.5$ and $-2.5$ (in percent), their squares add up to 17, and $s = \\sqrt{17/3} \\approx 2.38\\%$ per day."),

    h("Volatility"),
    p("**Volatility** $\\sigma$ is the standard deviation of log returns, quoted per year. A stock with $\\sigma = 20\\%$ has annual log returns that typically land within about 20 percentage points of their mean. Volatility measures how uncertain the outcome is, not which direction it takes."),
    note("Volatility $\\sigma$ is the annualised standard deviation of log returns. The drift $\\mu$ is the annualised mean log return."),

    h("Annualising and the square-root-of-time rule"),
    p("Returns are measured daily or monthly, but $\\mu$ and $\\sigma$ are quoted per year. To convert, make two assumptions: returns over non-overlapping periods are **independent**, and they all have the **same distribution**. Split a horizon of $T$ years into $n$ periods of length $\\Delta t = T/n$, each with mean $\\mu\\,\\Delta t$ and variance $\\sigma^2\\Delta t$. The total log return is the sum of the period returns, so"),
    eq("\\mathbb{E}\\Big[\\sum_{i=1}^n r_i\\Big] = n\\,\\mu\\,\\Delta t = \\mu T, \\qquad \\operatorname{Var}\\Big(\\sum_{i=1}^n r_i\\Big) = n\\,\\sigma^2\\Delta t = \\sigma^2 T."),
    p("The variance adds because the returns are independent. Taking the square root gives the **square-root-of-time rule**:"),
    eq("\\operatorname{sd}(\\text{return over } T) = \\sigma\\sqrt{T}."),
    p("The mean grows in proportion to $T$, the standard deviation only in proportion to $\\sqrt{T}$. With about 252 trading days a year, a daily standard deviation of $1.2\\%$ corresponds to an annual volatility of $1.2\\% \\times \\sqrt{252} \\approx 19.0\\%$. In the other direction, $\\sigma = 20\\%$ per year means $20\\% / \\sqrt{12} \\approx 5.8\\%$ per month."),
    {
      kind: "check",
      id: "returns-volatility/annualise-daily",
      prompt: "A stock's daily log returns have a standard deviation of 1.2%. With 252 trading days a year, what is its annual volatility, in percent?",
      answer: { type: "number", value: 19.05, tolerance: 0.05, unit: "%" },
      explain: "$\\sigma = 1.2\\% \\times \\sqrt{252} \\approx 1.2\\% \\times 15.875 \\approx 19.05\\%$. The standard deviation scales with the square root of time, not with time.",
    },
    {
      kind: "worked",
      title: "From four monthly returns to an annual mean and volatility",
      steps: [
        { text: "Four monthly log returns are $1\\%$, $-2\\%$, $3\\%$ and $2\\%$. Their mean is the sum divided by four.", tex: "\\bar r = \\tfrac{1}{4}(1 - 2 + 3 + 2)\\%", result: { value: 1, tolerance: 0.01, unit: "%" } },
        { text: "The deviations from the mean are $0$, $-3$, $2$ and $1$; their squares add up to 14. Divide by $n - 1 = 3$ and take the root.", tex: "s = \\sqrt{14/3}\\,\\%", result: { value: 2.16, tolerance: 0.01, unit: "%" } },
        { text: "The mean grows in proportion to time: twelve months a year.", tex: "\\mu = 12\\,\\bar r", result: { value: 12, tolerance: 0.01, unit: "%" } },
        { text: "The standard deviation grows with the square root of time.", tex: "\\sigma = \\sqrt{12}\\,s", result: { value: 7.48, tolerance: 0.01, unit: "%" } },
      ],
    },

    h("The normal distribution as a first model"),
    p("A simple first model assumes that the log return over $T$ years is **normally distributed**:"),
    eq("\\ln\\frac{S_T}{S_0} \\sim N\\big(\\mu T,\\ \\sigma^2 T\\big)."),
    p("This is natural given the previous section: the total log return is a sum of many small independent pieces, and such sums are approximately normal (central limit theorem). For a normal variable about 68% of outcomes fall within one standard deviation of the mean and about 95% within two."),
    p("Example: with $\\mu = 8\\%$, $\\sigma = 20\\%$ and $T = 4$ years, the mean log return is $\\mu T = 0.32$ and the standard deviation is $\\sigma\\sqrt{T} = 0.40$. The one-standard-deviation range is $-0.08$ to $0.72$. In price terms, a stock starting at 100 ends between about $100\\,e^{-0.08} \\approx 92.3$ and $100\\,e^{0.72} \\approx 205.4$ in roughly two cases out of three."),
    p("Real returns have fatter tails than the normal distribution: large moves happen more often than it predicts. The model is still the standard starting point, and later lessons build on it."),
    p("The figure plots the expected cumulative log return $\\mu T$ over horizons up to 10 years, with bands at $\\mu T \\pm \\sigma\\sqrt{T}$ and $\\mu T \\pm 2\\sigma\\sqrt{T}$. Increase $\\sigma$ and note that the bands widen while the centre line does not move. Over short horizons the bands dominate the drift; only over long horizons does the line pull away from zero relative to their width."),
    figure("volatility-horizon"),

    h("Summary"),
    list(
      "Returns, not prices, are the objects to model. Log returns $\\ln(S_t/S_{t-1})$ add up over consecutive periods.",
      "Volatility $\\sigma$ is the annualised standard deviation of log returns; $\\mu$ is their annualised mean.",
      "With independent, identically distributed returns, the mean grows like $\\mu T$ and the standard deviation like $\\sigma\\sqrt{T}$.",
      "A first model takes $\\ln(S_T/S_0)$ to be normal with mean $\\mu T$ and variance $\\sigma^2 T$.",
    ),
    note("The next lesson, \"Diversification and correlation\", combines several assets and shows how their volatilities add up. Where the $\\sqrt{T}$ comes from is shown in \"Random walks and Brownian motion\", the first lesson of the Stochastic models track."),
    lab("/risk-return", "Estimate means, volatilities and the risk–return trade-off in the Risk & Return lab"),
  ],

  hu: [
    p("A „Kamat, kamatozás és diszkontálás” című lecke ismert ütemben növekvő pénzzel foglalkozott. Egy részvény nem ilyen: az árfolyama fel-le mozog, és senki sem tudja pontosan előre jelezni. Ez a lecke bevezeti az ilyen mozgások leírására használt két számot, az átlagos hozamot és a volatilitást, és megmutatja, hogyan függ mindkettő a tartási idő hosszától."),

    h("Árfolyamok és hozamok"),
    p("Jelölje $S_t$ egy részvény árfolyamát a $t$ időpontban. Magukat az árfolyamokat nehéz összehasonlítani: egy 5 egységnyi elmozdulás sokat jelent egy 20-as részvénynél, és keveset egy 1000-esnél. A befektetőt a kiinduló árhoz viszonyított változás érdekli. Ezért árfolyamok helyett **hozamokat** vizsgálunk, vagyis egy időszak alatti relatív változást."),
    p("A lecke végig osztalékot nem fizető részvényt feltételez, így a hozam teljes egészében az árváltozásból származik."),

    h("Egyszerű hozam"),
    p("A $t-1$ és $t$ közötti **egyszerű hozam**"),
    eq("R_t = \\frac{S_t - S_{t-1}}{S_{t-1}} = \\frac{S_t}{S_{t-1}} - 1."),
    p("A hétköznapi „10%-ot emelkedett a részvény” mondat erre a számra utal. A hátránya akkor jön elő, amikor több időszakot fűzünk egymás után. Két időszak alatt a teljes növekedési tényező az $(1+R_1)(1+R_2)$ szorzat, nem a hozamok összege."),
    p("Példa: az árfolyam 100-ról 110-re megy, majd vissza 99-re. Az egyszerű hozamok $+10\\%$ és $-10\\%$. Összegük nulla, a befektető mégis 1%-ot veszített, hiszen $1{,}1 \\times 0{,}9 = 0{,}99$."),

    h("Loghozam"),
    p("A **loghozam** (folytonos hozam) a növekedési tényező természetes logaritmusa:"),
    eq("r_t = \\ln\\frac{S_t}{S_{t-1}} = \\ln(1 + R_t)."),
    p("Ez az a ráta, amely az időszak alatt folytonosan kamatozva $S_{t-1}$-ből $S_t$-t csinál, pontosan úgy, mint a „Kamat, kamatozás és diszkontálás” leckében: $S_t = S_{t-1}e^{r_t}$. Mivel a logaritmus a szorzatot összeggé alakítja, az egymást követő időszakok loghozamai összeadódnak:"),
    eq("\\ln\\frac{S_n}{S_0} = \\ln\\frac{S_1}{S_0} + \\ln\\frac{S_2}{S_1} + \\cdots + \\ln\\frac{S_n}{S_{n-1}} = r_1 + r_2 + \\cdots + r_n."),
    p("A fenti példában $\\ln 1{,}1 \\approx 0{,}0953$ és $\\ln 0{,}9 \\approx -0{,}1054$. Összegük $-0{,}0101 = \\ln 0{,}99$, ami helyesen mutatja az 1%-os veszteséget. Kis elmozdulásoknál a kétféle hozam szinte egyenlő, mert nullához közeli $R$ esetén $\\ln(1+R) \\approx R$."),
    {
      kind: "check",
      id: "returns-volatility/log-of-a-halving",
      prompt: "Egy részvény 100-ról 50-re esik. Hogyan viszonyul egymáshoz az egyszerű hozama és a loghozama?",
      answer: { type: "choice", options: ["Mindkettő $-50\\%$", "A loghozam negatívabb", "Az egyszerű hozam negatívabb", "A loghozam $+69{,}3\\%$"], correct: 1 },
      explain: "Az egyszerű hozam $50/100 - 1 = -50\\%$, a loghozam $\\ln 0{,}5 \\approx -69{,}3\\%$. Nagy eséseknél a logaritmus messzebbre megy nulla alá, mint $R$.",
    },
    p("Innentől a „hozam” loghozamot jelent. Az összeadhatóság miatt lesznek az alábbi skálázási szabályok ilyen egyszerűek."),

    h("Várható érték és szórás"),
    p("Tekintsük az egy időszakra eső hozamot $r$ valószínűségi változónak. A **várható értéke** $\\mathbb{E}[r]$ az az átlagos hozam, amelyet sok ismétlés során látnánk. A **szórása** azt méri, mekkora jellemzően az eltérés ettől az átlagtól:"),
    eq("\\operatorname{sd}(r) = \\sqrt{\\operatorname{Var}(r)}, \\qquad \\operatorname{Var}(r) = \\mathbb{E}\\big[(r - \\mathbb{E}[r])^2\\big]."),
    p("$n$ megfigyelt hozamból, $r_1, \\dots, r_n$, ezeket így becsüljük:"),
    eq("\\bar r = \\frac{1}{n}\\sum_{i=1}^{n} r_i, \\qquad s = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n} (r_i - \\bar r)^2}."),
    p("Példa: négy napi hozam, $2\\%$, $-1\\%$, $3\\%$ és $-2\\%$. Az átlag $\\bar r = 0{,}5\\%$. Az eltérések (százalékban) $1{,}5$, $-1{,}5$, $2{,}5$ és $-2{,}5$, négyzetösszegük 17, így $s = \\sqrt{17/3} \\approx 2{,}38\\%$ naponta."),

    h("Volatilitás"),
    p("A **volatilitás**, $\\sigma$, a loghozamok évesített szórása. Egy $\\sigma = 20\\%$-os részvény éves loghozama jellemzően nagyjából 20 százalékponton belül marad a várható értékétől. A volatilitás azt méri, mennyire bizonytalan a kimenet, nem azt, hogy merre mozdul az ár."),
    note("A $\\sigma$ volatilitás a loghozamok évesített szórása. A $\\mu$ drift a loghozamok évesített várható értéke."),

    h("Évesítés és a négyzetgyökös időszabály"),
    p("A hozamokat naponta vagy havonta mérjük, a $\\mu$-t és a $\\sigma$-t viszont évre vetítve adjuk meg. Az átváltáshoz két feltevés kell: a nem átfedő időszakok hozamai **függetlenek**, és mind **azonos eloszlásúak**. Osszunk fel egy $T$ éves időtávot $n$ darab $\\Delta t = T/n$ hosszú időszakra; mindegyik várható értéke $\\mu\\,\\Delta t$, varianciája $\\sigma^2\\Delta t$. A teljes loghozam az időszaki hozamok összege, ezért"),
    eq("\\mathbb{E}\\Big[\\sum_{i=1}^n r_i\\Big] = n\\,\\mu\\,\\Delta t = \\mu T, \\qquad \\operatorname{Var}\\Big(\\sum_{i=1}^n r_i\\Big) = n\\,\\sigma^2\\Delta t = \\sigma^2 T."),
    p("A varianciák a függetlenség miatt adódnak össze. Gyököt vonva kapjuk a **négyzetgyökös időszabályt**:"),
    eq("\\operatorname{sd}(T \\text{ alatti hozam}) = \\sigma\\sqrt{T}."),
    p("A várható érték $T$-vel arányosan nő, a szórás csak $\\sqrt{T}$-vel arányosan. Évi kb. 252 kereskedési nappal számolva az $1{,}2\\%$-os napi szórás $1{,}2\\% \\times \\sqrt{252} \\approx 19{,}0\\%$-os éves volatilitásnak felel meg. Visszafelé: évi $\\sigma = 20\\%$ havonta $20\\% / \\sqrt{12} \\approx 5{,}8\\%$-ot jelent."),
    {
      kind: "check",
      id: "returns-volatility/annualise-daily",
      prompt: "Egy részvény napi loghozamainak szórása 1,2%. Évi 252 kereskedési nappal számolva mekkora az éves volatilitása, százalékban?",
      answer: { type: "number", value: 19.05, tolerance: 0.05, unit: "%" },
      explain: "$\\sigma = 1{,}2\\% \\times \\sqrt{252} \\approx 1{,}2\\% \\times 15{,}875 \\approx 19{,}05\\%$. A szórás az idő négyzetgyökével arányos, nem az idővel.",
    },
    {
      kind: "worked",
      title: "Négy havi hozamból éves várható érték és volatilitás",
      steps: [
        { text: "Négy havi loghozam: $1\\%$, $-2\\%$, $3\\%$ és $2\\%$. Az átlaguk az összegük negyede.", tex: "\\bar r = \\tfrac{1}{4}(1 - 2 + 3 + 2)\\%", result: { value: 1, tolerance: 0.01, unit: "%" } },
        { text: "Az átlagtól vett eltérések $0$, $-3$, $2$ és $1$; négyzetösszegük 14. Osszuk el $n - 1 = 3$-mal, és vonjunk gyököt.", tex: "s = \\sqrt{14/3}\\,\\%", result: { value: 2.16, tolerance: 0.01, unit: "%" } },
        { text: "A várható érték az idővel arányosan nő: egy évben tizenkét hónap van.", tex: "\\mu = 12\\,\\bar r", result: { value: 12, tolerance: 0.01, unit: "%" } },
        { text: "A szórás az idő négyzetgyökével nő.", tex: "\\sigma = \\sqrt{12}\\,s", result: { value: 7.48, tolerance: 0.01, unit: "%" } },
      ],
    },

    h("A normális eloszlás mint első modell"),
    p("Egyszerű első modellként feltesszük, hogy a $T$ év alatti loghozam **normális eloszlású**:"),
    eq("\\ln\\frac{S_T}{S_0} \\sim N\\big(\\mu T,\\ \\sigma^2 T\\big)."),
    p("Ez az előző szakasz után kézenfekvő: a teljes loghozam sok kicsi, független tag összege, az ilyen összegek pedig közelítőleg normális eloszlásúak (centrális határeloszlás-tétel). Normális változónál a kimenetek kb. 68%-a esik a várható érték körüli egy szórásnyi sávba, és kb. 95%-a a kétszórásnyiba."),
    p("Példa: $\\mu = 8\\%$, $\\sigma = 20\\%$ és $T = 4$ év mellett a várható loghozam $\\mu T = 0{,}32$, a szórás $\\sigma\\sqrt{T} = 0{,}40$. Az egyszórásnyi sáv $-0{,}08$ és $0{,}72$ között van. Árfolyamban kifejezve egy 100-ról induló részvény nagyjából három esetből kettőben $100\\,e^{-0{,}08} \\approx 92{,}3$ és $100\\,e^{0{,}72} \\approx 205{,}4$ között végez."),
    p("A valódi hozamok eloszlásának vastagabb a farka, mint a normális eloszlásnak: a nagy elmozdulások gyakrabban fordulnak elő, mint ahogy az előre jelzi. A modell ennek ellenére a szokásos kiindulópont, és a későbbi leckék erre építenek."),
    p("Az ábra a $\\mu T$ várható kumulált loghozamot mutatja 10 évig terjedő időtávokra, a $\\mu T \\pm \\sigma\\sqrt{T}$ és $\\mu T \\pm 2\\sigma\\sqrt{T}$ sávokkal együtt. Növeld a $\\sigma$-t, és figyeld meg, hogy a sávok kiszélesednek, a középvonal viszont nem mozdul. Rövid távon a sávok elnyomják a driftet; a vonal csak hosszú távon távolodik el a nullától a sávok szélességéhez képest."),
    figure("volatility-horizon"),

    h("Összefoglalás"),
    list(
      "Nem az árfolyamot, hanem a hozamot modellezzük. Az $\\ln(S_t/S_{t-1})$ loghozamok egymást követő időszakokra összeadódnak.",
      "A $\\sigma$ volatilitás a loghozamok évesített szórása, a $\\mu$ az évesített várható értékük.",
      "Független, azonos eloszlású hozamoknál a várható érték $\\mu T$-ként, a szórás $\\sigma\\sqrt{T}$-ként nő.",
      "Első modellként $\\ln(S_T/S_0)$ normális eloszlású, $\\mu T$ várható értékkel és $\\sigma^2 T$ varianciával.",
    ),
    note("A következő lecke („Diverzifikáció és korreláció”) több eszközt kombinál, és megmutatja, hogyan adódnak össze a volatilitásaik. Hogy honnan jön a $\\sqrt{T}$, azt a Sztochasztikus modellek sorozat első leckéje, a „Véletlen bolyongás és Brown-mozgás” mutatja meg."),
    lab("/risk-return", "Becsülj várható hozamot, volatilitást és kockázat–hozam viszonyt a Kockázat és hozam laborban"),
  ],
};
