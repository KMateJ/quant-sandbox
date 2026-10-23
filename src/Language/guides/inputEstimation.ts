import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const inputEstimation: GuideLessonContent = {
  en: [
    p("Every optimiser in \"The efficient frontier and the capital market line\" and \"Portfolio constraints and the no-short-sales frontier\" takes expected returns, volatilities and correlations as given. In practice they are estimated from a few years of data, and the estimates are noisy. This lesson measures how noisy, shows how the optimiser magnifies the noise, and introduces shrinkage as a remedy. It uses the returns and volatility of \"Returns and volatility\"."),

    h("Sample moments"),
    p("From $n$ observed returns $r_1, \\dots, r_n$ the usual estimates are the sample mean and the sample variance:"),
    eq("\\hat\\mu = \\frac1n\\sum_{t=1}^n r_t, \\qquad \\hat\\sigma^2 = \\frac1{n-1}\\sum_{t=1}^n (r_t - \\hat\\mu)^2."),
    p("Both are unbiased: on average over many samples they equal the truth. But a single sample is one draw, and the estimate for the portfolio is only as good as that draw."),

    h("How wrong the estimates are"),
    p("If returns are independent with volatility $\\sigma$, the standard error of the sample mean is"),
    eq("\\mathrm{SE}(\\hat\\mu) = \\frac{\\sigma}{\\sqrt n}, \\qquad \\mathrm{SE}(\\hat\\sigma) \\approx \\frac{\\sigma}{\\sqrt{2n}}."),
    p("With $n$ counted in years and $\\sigma$ annual, a stock with 20% volatility observed for 5 years has a mean known to within 8.9 percentage points, for 20 years within 4.5 points, and even after 100 years within 2.0 points. The equity risk premium itself is a few percentage points, so a lifetime of data barely separates a good asset from a mediocre one. More frequent observations do not help the mean: it depends on the length of the sample, not on how often it is cut. Volatilities and correlations, by contrast, are estimated much more precisely, and sampling daily improves them."),
    {
      kind: "check",
      id: "input-estimation/standard-error",
      prompt: "An asset has an annual volatility of 15%. What is the standard error of its mean return, in percentage points, estimated from 25 years of data?",
      answer: { type: "number", value: 3, tolerance: 0.05 },
      explain: "$\\mathrm{SE} = \\sigma/\\sqrt n = 15\\% / \\sqrt{25} = 3$ percentage points.",
    },

    h("Error maximisation"),
    p("The optimiser treats the estimates as truth and puts the most weight where the estimated return is highest relative to risk. An asset that was lucky in the sample looks attractive, and the optimiser buys a lot of it; an unlucky one is sold short. The portfolio is therefore built on the errors, which is why it is called an error maximiser."),
    p("The figure shows two assets with true expected returns 4% and 10%, volatilities 10% and 20%, no correlation and a risk-free rate of 2%. The true tangency portfolio holds 50% in each. The faint curves are frontiers estimated from 20 random samples of 60 months (5 years): they scatter widely around the true one. The middle half of the estimated tangency weight in asset 1 runs from 47% to 97%, against the true 50%, and the portfolios built from these estimates lose on average 0.160 of Sharpe ratio, compared with 0.447 for the true optimum. Move the sample to 600 months and the loss falls to 0.020."),
    figure("estimation-noise"),

    h("Shrinkage"),
    p("A remedy is to pull the noisy estimates towards a sensible target. For expected returns the simplest target is the average over all assets, $\\bar\\mu$:"),
    eq("\\tilde\\mu_i = (1 - k)\\,\\hat\\mu_i + k\\,\\bar\\mu, \\qquad 0 \\le k \\le 1."),
    p("With $k = 0$ nothing changes, and with $k = 1$ all assets get the same expected return. Another target is the prior implied by \"CAPM, beta and the security market line\", under which expected returns differ only through beta. Shrinkage adds a little bias but removes much variance. At 60 months, $k = 0.5$ cuts the average Sharpe loss in the figure from 0.160 to 0.097."),
    {
      kind: "check",
      id: "input-estimation/hardest-input",
      prompt: "Which input to a mean–variance optimisation is hardest to estimate precisely from historical data?",
      answer: { type: "choice", options: ["Expected returns", "Volatilities", "Correlations", "The number of assets"], correct: 0 },
      explain: "The standard error of a mean is $\\sigma/\\sqrt n$ and shrinks only with the length of the sample, so it is large compared with the mean itself. Variances and correlations are estimated far more precisely, and sampling more often improves them.",
    },

    h("Covariances are easier"),
    p("The relative error of a volatility estimate is $\\mathrm{SE}(\\hat\\sigma)/\\sigma = 1/\\sqrt{2n}$: with 240 monthly observations that is about 4.6%, against a mean that is uncertain by more than its own size. The difficulty with covariances is a different one, their number: $N$ assets have $N(N+1)/2$ variances and covariances, so a sample of a few years cannot pin them down for hundreds of stocks. Imposing a factor structure, as in \"Factor models and systematic risk\", replaces most of them with a handful of parameters, which is another form of shrinkage."),
    {
      kind: "worked",
      title: "How long a sample the mean needs",
      steps: [
        { text: "Standard error of the mean of a 20%-volatility asset after 5 years, in percentage points.", tex: "\\mathrm{SE} = \\frac{\\sigma}{\\sqrt n}", result: { value: 8.94, tolerance: 0.05 } },
        { text: "After 20 years.", tex: "\\mathrm{SE} = \\frac{20\\%}{\\sqrt{20}}", result: { value: 4.47, tolerance: 0.05 } },
        { text: "A 95% band around the estimate after 20 years is about 1.96 standard errors either side; its half-width in percentage points.", tex: "1.96\\cdot\\mathrm{SE}", result: { value: 8.76, tolerance: 0.1 } },
        { text: "Years of data needed to bring the standard error down to 1 percentage point.", tex: "n = \\left(\\frac{\\sigma}{\\mathrm{SE}}\\right)^2", result: { value: 400, tolerance: 1 } },
      ],
    },

    h("Summary"),
    list(
      "Sample moments are unbiased but noisy: the standard error of a mean is $\\sigma/\\sqrt n$ and does not improve with more frequent data.",
      "An optimiser overweights assets with lucky samples, so the frontier built from estimates is unstable and loses Sharpe ratio in reality.",
      "Shrinking the means towards a common target adds a little bias and removes much variance.",
      "Covariances are estimated better than means; the problem there is their number, handled with factor structure.",
    ),
    note("The Monte Carlo lessons later in the stochastic track use the same standard-error idea for simulated averages."),
    lab("/efficient-frontier", "Estimate a frontier from a sample in the Efficient Frontier lab"),
  ],
  hu: [
    p("A „Hatékony front és tőkepiaci egyenes” és a „Portfóliókorlátok és a shortolás nélküli hatékony front” minden optimalizálója adottnak veszi a várható hozamokat, a volatilitásokat és a korrelációkat. A gyakorlatban ezeket néhány évnyi adatból becsüljük, és a becslések zajosak. Ez a lecke megméri, mennyire, megmutatja, hogyan nagyítja fel az optimalizáló a zajt, és bevezeti a zsugorítást mint gyógymódot. A „Hozamok és volatilitás” leckére épít."),

    h("Mintamomentumok"),
    p("$n$ megfigyelt hozamból, $r_1, \\dots, r_n$, a szokásos becslések a minta átlaga és a minta varianciája:"),
    eq("\\hat\\mu = \\frac1n\\sum_{t=1}^n r_t, \\qquad \\hat\\sigma^2 = \\frac1{n-1}\\sum_{t=1}^n (r_t - \\hat\\mu)^2."),
    p("Mindkettő torzítatlan: sok minta átlagában az igazi értéket adják. Egyetlen minta viszont egy húzás, és a portfólióra vonatkozó becslés csak olyan jó, mint az a húzás."),

    h("Mennyire tévesek a becslések"),
    p("Ha a hozamok függetlenek és volatilitásuk $\\sigma$, a minta átlagának standard hibája"),
    eq("\\mathrm{SE}(\\hat\\mu) = \\frac{\\sigma}{\\sqrt n}, \\qquad \\mathrm{SE}(\\hat\\sigma) \\approx \\frac{\\sigma}{\\sqrt{2n}}."),
    p("Ha $n$-t években mérjük és $\\sigma$ éves, egy 20% volatilitású részvény átlaga 5 évnyi megfigyelés után 8,9 százalékponton belül ismert, 20 év után 4,5 ponton belül, és még 100 év után is 2,0 ponton belül. A részvénypiaci kockázati prémium maga is néhány százalékpont, így egy élet adata is alig választja szét a jó eszközt a közepestől. A gyakoribb megfigyelés az átlagon nem segít: az a minta hosszától függ, nem attól, milyen sűrűn szeleteljük. A volatilitások és a korrelációk ezzel szemben sokkal pontosabban becsülhetők, és a napi mintavétel javít rajtuk."),
    {
      kind: "check",
      id: "input-estimation/standard-error",
      prompt: "Egy eszköz éves volatilitása 15%. Mekkora a hozama átlagának standard hibája százalékpontban, ha 25 év adatából becsüljük?",
      answer: { type: "number", value: 3, tolerance: 0.05 },
      explain: "$\\mathrm{SE} = \\sigma/\\sqrt n = 15\\% / \\sqrt{25} = 3$ százalékpont.",
    },

    h("A hibák maximalizálása"),
    p("Az optimalizáló a becsléseket igaznak veszi, és a legnagyobb súlyt oda teszi, ahol a becsült hozam a kockázathoz képest a legmagasabb. Az az eszköz, amelyik a mintában szerencsés volt, vonzónak látszik, és az optimalizáló sokat vesz belőle; a szerencsétlent shortolja. A portfólió tehát a hibákra épül, ezért nevezik hibamaximalizálónak."),
    p("Az ábra két eszközt mutat 4% és 10% igazi várható hozammal, 10% és 20% volatilitással, korreláció nélkül és 2%-os kockázatmentes kamattal. Az igazi érintési portfólió 50-50%-ot tart. A halvány görbék 20 véletlen, 60 hónapos (5 éves) mintából becsült frontok: szélesen szórnak az igazi körül. Az 1. eszközben a becsült érintési súly középső fele 47% és 97% között van, az igazi 50% ellenében, és a becslésekből épített portfóliók átlagosan 0,160 Sharpe-mutatót veszítenek az igazi optimum 0,447-éhez képest. Vidd a mintát 600 hónapra, és a veszteség 0,020-ra esik."),
    figure("estimation-noise"),

    h("Zsugorítás"),
    p("Egy gyógymód, hogy a zajos becsléseket egy értelmes cél felé húzzuk. A várható hozamoknál a legegyszerűbb cél az összes eszköz átlaga, $\\bar\\mu$:"),
    eq("\\tilde\\mu_i = (1 - k)\\,\\hat\\mu_i + k\\,\\bar\\mu, \\qquad 0 \\le k \\le 1."),
    p("$k = 0$ esetén semmi sem változik, $k = 1$ esetén minden eszköz ugyanazt a várható hozamot kapja. Másik cél a „CAPM, béta és az értékpapír-piaci egyenes” leckéből következő prior, amelyben a várható hozamok csak a bétán keresztül különböznek. A zsugorítás kis torzítást visz be, de sok varianciát elvesz. 60 hónapnál $k = 0{,}5$ az ábrán az átlagos Sharpe-veszteséget 0,160-ról 0,097-re vágja."),
    {
      kind: "check",
      id: "input-estimation/hardest-input",
      prompt: "Melyik bemenetet a legnehezebb pontosan megbecsülni egy átlag–variancia optimalizálásban a múltbeli adatokból?",
      answer: { type: "choice", options: ["A várható hozamokat", "A volatilitásokat", "A korrelációkat", "Az eszközök számát"], correct: 0 },
      explain: "Az átlag standard hibája $\\sigma/\\sqrt n$, és csak a minta hosszával csökken, így magához az átlaghoz képest nagy. A varianciák és a korrelációk sokkal pontosabban becsülhetők, és a gyakoribb mintavétel javít rajtuk.",
    },

    h("A kovarianciák könnyebbek"),
    p("A volatilitásbecslés relatív hibája $\\mathrm{SE}(\\hat\\sigma)/\\sigma = 1/\\sqrt{2n}$: 240 havi megfigyelésnél ez körülbelül 4,6%, szemben egy átlaggal, amelynek bizonytalansága a saját nagyságrendjét is elérheti. A kovarianciáknál a nehézség más, a számuk: $N$ eszköznek $N(N+1)/2$ varianciája és kovarianciája van, így néhány évnyi minta több száz részvénynél nem határozza meg őket megbízhatóan. A faktorszerkezet kikötése, ahogy a „Faktormodellek és szisztematikus kockázat” leckében, a legtöbbjüket néhány paraméterrel helyettesíti, ami a zsugorítás egy másik formája."),
    {
      kind: "worked",
      title: "Milyen hosszú minta kell az átlaghoz",
      steps: [
        { text: "Egy 20% volatilitású eszköz átlagának standard hibája 5 év után, százalékpontban.", tex: "\\mathrm{SE} = \\frac{\\sigma}{\\sqrt n}", result: { value: 8.94, tolerance: 0.05 } },
        { text: "20 év után.", tex: "\\mathrm{SE} = \\frac{20\\%}{\\sqrt{20}}", result: { value: 4.47, tolerance: 0.05 } },
        { text: "A 95%-os sáv a becslés körül körülbelül 1,96 standard hiba mindkét irányban; a félszélessége százalékpontban 20 év után.", tex: "1{,}96\\cdot\\mathrm{SE}", result: { value: 8.76, tolerance: 0.1 } },
        { text: "Hány év adat kell ahhoz, hogy a standard hiba 1 százalékpontra csökkenjen?", tex: "n = \\left(\\frac{\\sigma}{\\mathrm{SE}}\\right)^2", result: { value: 400, tolerance: 1 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "A mintamomentumok torzítatlanok, de zajosak: az átlag standard hibája $\\sigma/\\sqrt n$, és gyakoribb adattal sem javul.",
      "Az optimalizáló a szerencsés mintájú eszközöket túlsúlyozza, így a becslésből épített front instabil, és a valóságban Sharpe-mutatót veszít.",
      "Az átlagok közös cél felé zsugorítása kis torzítást visz be, és sok varianciát elvesz.",
      "A kovarianciák jobban becsülhetők az átlagoknál; náluk a számuk a gond, amit faktorszerkezettel kezelünk.",
    ),
    note("A sztochasztikus modulban később a Monte Carlo-leckék a standard hiba ugyanezen gondolatát használják a szimulált átlagokra."),
    lab("/efficient-frontier", "Becsülj frontot mintából a Hatékony front laborban"),
  ],
};
