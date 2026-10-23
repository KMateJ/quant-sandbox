import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const factorModels: GuideLessonContent = {
  en: [
    p("The lesson \"CAPM, beta and the security market line\" split the risk of a single asset into a systematic part, driven by the market, and an idiosyncratic part. This lesson turns that split into a model for a whole set of assets at once. The model explains why stocks move together, gives every covariance from a handful of numbers, and shows exactly how much risk a portfolio keeps however many stocks it holds."),

    h("The number of parameters"),
    p("The lesson \"The efficient frontier and the capital market line\" needed the full covariance matrix of the assets. For $N$ assets this matrix has $N$ variances on the diagonal and $N(N-1)/2$ different covariances off the diagonal (the matrix is symmetric, $\\sigma_{ij} = \\sigma_{ji}$), so it has"),
    eq("N + \\frac{N(N-1)}{2} = \\frac{N(N+1)}{2}"),
    p("separate entries. For 500 stocks that is $500 \\times 501/2 = 125\\,250$ numbers to estimate. With a few years of monthly data there are far fewer observations per stock than that, so most of these estimates would be noise. A **factor model** cuts the number down by assuming that all common movement comes from a few sources."),

    h("The single-index model"),
    p("The simplest factor model uses one factor, the return $R_M$ of a broad market index with volatility $\\sigma_M$. Each stock's return is written as"),
    eq("R_i = \\alpha_i + \\beta_i R_M + \\varepsilon_i, \\qquad i = 1, \\dots, N."),
    p("Here $\\beta_i$ is the sensitivity of stock $i$ to the index, $\\alpha_i$ is a constant, and $\\varepsilon_i$ is the stock's **specific** (idiosyncratic) return, with mean zero and volatility $\\sigma_{\\varepsilon,i}$. The model makes two assumptions:"),
    list(
      "Each $\\varepsilon_i$ is uncorrelated with the index: $\\operatorname{Cov}(\\varepsilon_i, R_M) = 0$.",
      "The specific returns of different stocks are uncorrelated with each other: $\\operatorname{Cov}(\\varepsilon_i, \\varepsilon_j) = 0$ for $i \\ne j$.",
    ),
    p("The first assumption only defines $\\beta_i$ as a regression slope. The second is the real restriction: it says the index is the *only* reason two stocks move together."),

    h("Variances and covariances in the index model"),
    p("Take the variance of $R_i$. The constant $\\alpha_i$ drops out, and because $\\varepsilon_i$ is uncorrelated with $R_M$ there is no cross term:"),
    eq("\\operatorname{Var}(R_i) = \\beta_i^2\\sigma_M^2 + \\sigma_{\\varepsilon,i}^2."),
    p("For two different stocks, covariance is linear in each argument, so expand the product. The terms $\\operatorname{Cov}(R_M, \\varepsilon_j)$, $\\operatorname{Cov}(\\varepsilon_i, R_M)$ and $\\operatorname{Cov}(\\varepsilon_i, \\varepsilon_j)$ are all zero by the assumptions, which leaves"),
    eq("\\operatorname{Cov}(R_i, R_j) = \\beta_i\\beta_j\\,\\operatorname{Cov}(R_M, R_M) = \\beta_i\\beta_j\\,\\sigma_M^2 \\qquad (i \\ne j)."),
    p("Every entry of the covariance matrix now follows from the betas, the specific volatilities and $\\sigma_M$. Counting the numbers that the covariance matrix needs, there are $N$ betas, $N$ specific volatilities and one market volatility: $2N + 1$ parameters instead of $N(N+1)/2$. If the alphas are included as well, to describe expected returns, the count is $3N + 1$. For 500 stocks that is 1001 risk parameters (1501 with the alphas) instead of 125 250."),

    {
      kind: "check",
      id: "factor-models/index-covariance",
      prompt: "In the single-index model stock A has $\\beta_A = 1.2$, stock B has $\\beta_B = 0.8$, and the index volatility is $\\sigma_M = 20\\%$. What is $\\operatorname{Cov}(R_A, R_B)$, as a decimal?",
      answer: { type: "number", value: 0.0384, tolerance: 0.0002 },
      explain: "$\\operatorname{Cov}(R_A, R_B) = \\beta_A\\beta_B\\sigma_M^2 = 1.2 \\times 0.8 \\times 0.04 = 0.0384$. The specific volatilities do not enter: in this model only the index links the two stocks.",
    },

    h("Diversification in the index model"),
    p("A portfolio with weights $w_i$ has return $R_p = \\sum_i w_i R_i = \\alpha_p + \\beta_p R_M + \\sum_i w_i\\varepsilon_i$, where $\\beta_p = \\sum_i w_i\\beta_i$ is the weighted average beta. The specific returns are uncorrelated with the index and with each other, so"),
    eq("\\sigma_p^2 = \\beta_p^2\\sigma_M^2 + \\sum_{i=1}^{N} w_i^2\\,\\sigma_{\\varepsilon,i}^2."),
    p("Now take $N$ stocks in equal weights $w_i = 1/N$, all with the same beta $\\beta$ and the same specific volatility $\\sigma_\\varepsilon$. The specific sum has $N$ terms of size $\\sigma_\\varepsilon^2/N^2$:"),
    eq("\\sigma_p^2 = \\beta^2\\sigma_M^2 + \\frac{\\sigma_\\varepsilon^2}{N} \\;\\longrightarrow\\; \\beta^2\\sigma_M^2 \\quad (N \\to \\infty)."),
    p("This is the result of \"Diversification and correlation\" with a structure filled in. There, the variance of an equally weighted portfolio tended to the average covariance. In the index model every covariance between different stocks is $\\beta^2\\sigma_M^2$, so the average covariance is exactly the systematic variance, and the volatility can never fall below the **systematic floor** $\\beta\\sigma_M$."),
    note("In the single-index model the specific variance of an equally weighted portfolio is $\\sigma_\\varepsilon^2/N$ and vanishes as $N$ grows. The systematic part $\\beta_p^2\\sigma_M^2$ does not depend on $N$ at all."),

    {
      kind: "check",
      id: "factor-models/diversification-floor",
      prompt: "An equally weighted portfolio holds more and more stocks, all with beta $\\beta$ and specific volatility $\\sigma_\\varepsilon$. What does its volatility tend to?",
      answer: {
        type: "choice",
        options: ["Zero", "$\\beta\\sigma_M$", "$\\sigma_\\varepsilon$", "$\\sqrt{\\beta^2\\sigma_M^2 + \\sigma_\\varepsilon^2}$, the volatility of one stock"],
        correct: 1,
      },
      explain: "The specific part $\\sigma_\\varepsilon^2/N$ vanishes while the systematic part $\\beta^2\\sigma_M^2$ stays, so the volatility falls to the floor $\\beta\\sigma_M$.",
    },

    h("The systematic share of variance"),
    p("The fraction of variance explained by the index is"),
    eq("R^2 = \\frac{\\beta^2\\sigma_M^2}{\\beta^2\\sigma_M^2 + \\sigma_\\varepsilon^2},"),
    p("the same $R^2$ that a regression of the stock on the index reports. For a single stock it equals $\\rho^2$, the squared correlation with the index, as in the CAPM lesson. For a typical single stock $R^2$ is well below one half; for a portfolio of 20 or more stocks it is usually close to one."),
    {
      kind: "worked",
      title: "Splitting one stock's variance",
      steps: [
        { text: "A stock has $\\beta = 1.2$ against an index with $\\sigma_M = 20\\%$. Its systematic variance is", tex: "\\beta^2\\sigma_M^2 = 1.44 \\times 0.04", result: { value: 0.0576, tolerance: 0.0001 } },
        { text: "Its specific volatility is $\\sigma_\\varepsilon = 25\\%$, so the specific variance is", tex: "\\sigma_\\varepsilon^2 = 0.25^2", result: { value: 0.0625, tolerance: 0.0001 } },
        { text: "The total variance is the sum, because the two parts are uncorrelated.", tex: "\\sigma^2 = 0.0576 + 0.0625", result: { value: 0.1201, tolerance: 0.0001 } },
        { text: "The systematic share is the $R^2$ of the stock.", tex: "R^2 = \\frac{0.0576}{0.1201}", result: { value: 47.96, tolerance: 0.05, unit: "%" } },
      ],
    },

    h("Estimating the index model"),
    p("The parameters come from the regression already used to estimate beta in \"CAPM, beta and the security market line\": regress the stock's returns on the index returns over, say, 60 months. The slope is $\\hat\\beta_i$, the intercept is $\\hat\\alpha_i$, and the standard deviation of the residuals estimates $\\sigma_{\\varepsilon,i}$. That lesson used excess returns; with a constant $r_f$ the slope is the same and only the intercept changes. The sample variance of the index gives $\\sigma_M$."),

    h("The index model and the CAPM"),
    p("The two look alike but make different kinds of claims. The single-index model is a **statistical** model: it describes how returns covary, and its key assumption, uncorrelated specific returns, can be checked in the data. It says nothing about what expected returns should be; any value of $\\alpha_i$ is allowed. The CAPM is an **equilibrium** model: from assumptions about investors it concludes that expected excess returns are proportional to beta, so that alpha in the excess-return regression is zero. The CAPM does not need the specific returns to be uncorrelated, and the index model does not need the CAPM to hold. In practice the CAPM supplies the expected returns and the index model the covariance matrix."),

    h("Worked example"),
    p("Let $\\sigma_M = 18\\%$, $\\beta = 1$ and $\\sigma_\\varepsilon = 30\\%$ for every stock. A single stock has variance $0.0324 + 0.09 = 0.1224$, a volatility of about $35.0\\%$, and an $R^2$ of $0.0324/0.1224 \\approx 26.5\\%$. With 20 stocks in equal weights,"),
    eq("\\sigma_p^2 = 0.0324 + \\frac{0.09}{20} = 0.0369, \\qquad \\sigma_p \\approx 19.21\\%."),
    p("The floor is $\\beta\\sigma_M = 18\\%$, and the systematic share is $0.0324/0.0369 \\approx 87.8\\%$. Twenty stocks have removed almost all of the specific risk: the volatility fell from 35% to 19.2%, and only 1.2 percentage points remain above the floor. For 100 stocks the full covariance matrix has $100 \\times 101/2 = 5050$ entries, while the index model needs $2 \\times 100 + 1 = 201$ (301 with the alphas)."),
    p("The figure keeps the market volatility fixed at $\\sigma_M = 18\\%$ and builds an equally weighted portfolio of $N$ stocks that all share the same beta and the same specific volatility. The sliders set the average beta $\\beta$ (0.5 to 1.5, default 1), the specific volatility (10% to 60%, default 30%) and the number of stocks $N$ (1 to 100, default 20). The chart plots portfolio volatility against $N$ from 1 to 100 together with the floor $\\beta\\sigma_M$, and a vertical line marks the chosen $N$. The readouts give the portfolio volatility at that $N$, the floor, the systematic share of variance, and the number of parameters for $N$ stocks under the full covariance matrix and under the single-index model. Raise the specific volatility to 60% and note how many more stocks it takes to approach the floor: about 25 stocks bring the volatility within one percentage point of 18% at 30%, about 98 at 60%. Then move $\\beta$ and watch the floor shift, to $23.4\\%$ at $\\beta = 1.3$."),
    figure("factor-variance"),

    h("Multi-factor models"),
    p("One index rarely explains all common movement: banks move with banks and small firms with small firms, so the specific returns of related stocks are correlated, against the second assumption. A **multi-factor model** adds more common sources $F_1, \\dots, F_K$:"),
    eq("R_i = \\alpha_i + \\sum_{k=1}^{K}\\beta_{ik}F_k + \\varepsilon_i,"),
    p("again with specific returns uncorrelated with the factors and with each other. Collect the loadings $\\beta_{ik}$ into an $N \\times K$ matrix $B$, the factor covariances into a $K \\times K$ matrix $\\Sigma_F$, and the specific variances into a diagonal matrix $D$. The same expansion as above gives the covariance matrix of the returns"),
    eq("\\Sigma = B\\,\\Sigma_F\\,B^{\\top} + D,"),
    p("with $NK + K(K+1)/2 + N$ parameters; for 500 stocks and 3 factors that is 2006. The best-known factors are those of Fama and French: besides the market, **size** (the return of small firms minus large firms) and **value** (the return of high book-to-market firms minus low book-to-market firms). Carhart added **momentum**, the return of recent winners minus recent losers. Each such factor is itself the return of a long–short portfolio. Whether these factors are rewards for risk or persistent mispricings is still debated; as a description of covariances they work well."),

    h("Summary"),
    list(
      "A full covariance matrix for $N$ assets has $N(N+1)/2$ entries; factor models replace it with a few parameters per asset.",
      "Single-index model: $R_i = \\alpha_i + \\beta_i R_M + \\varepsilon_i$, giving $\\operatorname{Var}(R_i) = \\beta_i^2\\sigma_M^2 + \\sigma_{\\varepsilon,i}^2$ and $\\operatorname{Cov}(R_i, R_j) = \\beta_i\\beta_j\\sigma_M^2$, with $2N + 1$ risk parameters ($3N + 1$ with alphas).",
      "Portfolio variance is $\\beta_p^2\\sigma_M^2 + \\sum_i w_i^2\\sigma_{\\varepsilon,i}^2$; in equal weights the specific part is $\\sigma_\\varepsilon^2/N$ and the volatility falls towards the floor $\\beta_p\\sigma_M$.",
      "The index model is a statistical description of covariances; the CAPM is an equilibrium statement about expected returns.",
      "Multi-factor models (market, size, value, momentum) give $\\Sigma = B\\Sigma_F B^{\\top} + D$.",
    ),
    note("The next lesson, \"Value at Risk and expected shortfall\", turns a portfolio's volatility into a loss level, and a factor covariance matrix is how that volatility is usually computed for large portfolios."),
    lab("/capm", "Estimate betas and split systematic from specific risk in the CAPM lab"),
  ],

  hu: [
    p("A „CAPM, béta és az értékpapír-piaci egyenes” című lecke egyetlen eszköz kockázatát bontotta a piac által hajtott szisztematikus és az egyedi részre. Ez a lecke ebből a felbontásból modellt épít, amely egyszerre írja le eszközök egész halmazát. A modell megmagyarázza, miért mozognak együtt a részvények, néhány számból előállítja az összes kovarianciát, és pontosan megmutatja, mennyi kockázat marad egy portfólióban, akárhány részvényt tartalmaz is."),

    h("A paraméterek száma"),
    p("A „Hatékony front és tőkepiaci egyenes” című leckéhez az eszközök teljes kovarianciamátrixára volt szükség. $N$ eszköz esetén ennek a mátrixnak a főátlójában $N$ variancia áll, azon kívül pedig $N(N-1)/2$ különböző kovariancia (a mátrix szimmetrikus, $\\sigma_{ij} = \\sigma_{ji}$), összesen tehát"),
    eq("N + \\frac{N(N-1)}{2} = \\frac{N(N+1)}{2}"),
    p("különálló elemből áll. 500 részvénynél ez $500 \\times 501/2 = 125\\,250$ becsülendő szám. Néhány évnyi havi adatból részvényenként ennél jóval kevesebb megfigyelés van, így a becslések nagy része zaj volna. A **faktormodell** úgy csökkenti a paraméterek számát, hogy feltételezi: minden közös mozgás néhány forrásból ered."),

    h("Az egyindexes modell"),
    p("A legegyszerűbb faktormodell egyetlen faktort használ, egy széles piaci index $R_M$ hozamát, amelynek volatilitása $\\sigma_M$. Minden részvény hozamát így írjuk fel:"),
    eq("R_i = \\alpha_i + \\beta_i R_M + \\varepsilon_i, \\qquad i = 1, \\dots, N."),
    p("Itt $\\beta_i$ az $i$-edik részvény indexre vonatkozó érzékenysége, $\\alpha_i$ konstans, $\\varepsilon_i$ pedig a részvény **egyedi** (specifikus) hozama, nulla várható értékkel és $\\sigma_{\\varepsilon,i}$ volatilitással. A modell két feltevésre épül:"),
    list(
      "Minden $\\varepsilon_i$ korrelálatlan az indexszel: $\\operatorname{Cov}(\\varepsilon_i, R_M) = 0$.",
      "A különböző részvények egyedi hozamai egymással korrelálatlanok: $\\operatorname{Cov}(\\varepsilon_i, \\varepsilon_j) = 0$, ha $i \\ne j$.",
    ),
    p("Az első feltevés csupán regressziós meredekségként definiálja $\\beta_i$-t. A valódi megszorítás a második: eszerint két részvény *kizárólag* az index miatt mozog együtt."),

    h("Varianciák és kovarianciák az indexmodellben"),
    p("Vegyük $R_i$ varianciáját. Az $\\alpha_i$ konstans kiesik, és mivel $\\varepsilon_i$ korrelálatlan $R_M$-mel, keresztszorzat sincs:"),
    eq("\\operatorname{Var}(R_i) = \\beta_i^2\\sigma_M^2 + \\sigma_{\\varepsilon,i}^2."),
    p("Két különböző részvény esetén a kovariancia mindkét változójában lineáris, így bonthatjuk a szorzatot. A $\\operatorname{Cov}(R_M, \\varepsilon_j)$, $\\operatorname{Cov}(\\varepsilon_i, R_M)$ és $\\operatorname{Cov}(\\varepsilon_i, \\varepsilon_j)$ tag a feltevések szerint mind nulla, így marad"),
    eq("\\operatorname{Cov}(R_i, R_j) = \\beta_i\\beta_j\\,\\operatorname{Cov}(R_M, R_M) = \\beta_i\\beta_j\\,\\sigma_M^2 \\qquad (i \\ne j)."),
    p("A kovarianciamátrix minden eleme következik a bétákból, az egyedi volatilitásokból és $\\sigma_M$-ből. Ha a kovarianciamátrixhoz szükséges paramétereket számoljuk össze, ez $N$ béta, $N$ egyedi volatilitás és egy piaci volatilitás: $N(N+1)/2$ helyett $2N + 1$ paraméter. Ha a várható hozamok leírásához az alfákat is beszámítjuk, $3N + 1$. 500 részvénynél ez 125 250 helyett 1001 kockázati paraméter (az alfákkal 1501)."),

    {
      kind: "check",
      id: "factor-models/index-covariance",
      prompt: "Az egyindexes modellben az A részvényre $\\beta_A = 1{,}2$, a B részvényre $\\beta_B = 0{,}8$, az index volatilitása $\\sigma_M = 20\\%$. Mennyi $\\operatorname{Cov}(R_A, R_B)$ tizedes törtként?",
      answer: { type: "number", value: 0.0384, tolerance: 0.0002 },
      explain: "$\\operatorname{Cov}(R_A, R_B) = \\beta_A\\beta_B\\sigma_M^2 = 1{,}2 \\times 0{,}8 \\times 0{,}04 = 0{,}0384$. Az egyedi volatilitások nem szerepelnek: ebben a modellben csak az index köti össze a két részvényt.",
    },

    h("Diverzifikáció az indexmodellben"),
    p("Egy $w_i$ súlyú portfólió hozama $R_p = \\sum_i w_i R_i = \\alpha_p + \\beta_p R_M + \\sum_i w_i\\varepsilon_i$, ahol $\\beta_p = \\sum_i w_i\\beta_i$ a béták súlyozott átlaga. Az egyedi hozamok korrelálatlanok az indexszel és egymással, ezért"),
    eq("\\sigma_p^2 = \\beta_p^2\\sigma_M^2 + \\sum_{i=1}^{N} w_i^2\\,\\sigma_{\\varepsilon,i}^2."),
    p("Vegyünk most $N$ részvényt egyenlő, $w_i = 1/N$ súllyal, mindegyiket ugyanazzal a $\\beta$ bétával és ugyanazzal a $\\sigma_\\varepsilon$ egyedi volatilitással. Az egyedi összegben $N$ darab $\\sigma_\\varepsilon^2/N^2$ nagyságú tag áll:"),
    eq("\\sigma_p^2 = \\beta^2\\sigma_M^2 + \\frac{\\sigma_\\varepsilon^2}{N} \\;\\longrightarrow\\; \\beta^2\\sigma_M^2 \\quad (N \\to \\infty)."),
    p("Ez a „Diverzifikáció és korreláció” című lecke eredménye, most már konkrét szerkezettel. Ott az egyenlő súlyú portfólió varianciája az átlagos kovarianciához tartott. Az indexmodellben két különböző részvény kovarianciája mindig $\\beta^2\\sigma_M^2$, így az átlagos kovariancia pontosan a szisztematikus variancia, és a volatilitás soha nem eshet a $\\beta\\sigma_M$ **szisztematikus padló** alá."),
    note("Az egyindexes modellben az egyenlő súlyú portfólió egyedi varianciája $\\sigma_\\varepsilon^2/N$, és $N$ növekedésével eltűnik. A $\\beta_p^2\\sigma_M^2$ szisztematikus rész egyáltalán nem függ $N$-től."),

    {
      kind: "check",
      id: "factor-models/diversification-floor",
      prompt: "Egy egyenlő súlyú portfólió egyre több részvényt tartalmaz, mindegyik bétája $\\beta$, egyedi volatilitása $\\sigma_\\varepsilon$. Mihez tart a portfólió volatilitása?",
      answer: {
        type: "choice",
        options: ["Nullához", "$\\beta\\sigma_M$-hez", "$\\sigma_\\varepsilon$-hoz", "$\\sqrt{\\beta^2\\sigma_M^2 + \\sigma_\\varepsilon^2}$-hez, egyetlen részvény volatilitásához"],
        correct: 1,
      },
      explain: "Az egyedi rész, $\\sigma_\\varepsilon^2/N$, eltűnik, a szisztematikus $\\beta^2\\sigma_M^2$ rész megmarad, így a volatilitás a $\\beta\\sigma_M$ alsó korlátig csökken.",
    },

    h("A variancia szisztematikus hányada"),
    p("Az index által magyarázott varianciahányad"),
    eq("R^2 = \\frac{\\beta^2\\sigma_M^2}{\\beta^2\\sigma_M^2 + \\sigma_\\varepsilon^2},"),
    p("ugyanaz az $R^2$, amelyet a részvény indexre futtatott regressziója mutat. Egyetlen részvénynél ez $\\rho^2$, az indexszel vett korreláció négyzete, ahogy a CAPM-leckében. Egy tipikus részvénynél az $R^2$ jóval 0,5 alatt van; egy legalább 20 részvényből álló portfólióé rendszerint egyhez közeli."),
    {
      kind: "worked",
      title: "Egy részvény varianciájának felbontása",
      steps: [
        { text: "Egy részvény bétája $\\beta = 1{,}2$ egy $\\sigma_M = 20\\%$-os indexhez képest. A szisztematikus varianciája", tex: "\\beta^2\\sigma_M^2 = 1{,}44 \\times 0{,}04", result: { value: 0.0576, tolerance: 0.0001 } },
        { text: "Az egyedi volatilitása $\\sigma_\\varepsilon = 25\\%$, így az egyedi variancia", tex: "\\sigma_\\varepsilon^2 = 0{,}25^2", result: { value: 0.0625, tolerance: 0.0001 } },
        { text: "A teljes variancia a kettő összege, mert a két rész korrelálatlan.", tex: "\\sigma^2 = 0{,}0576 + 0{,}0625", result: { value: 0.1201, tolerance: 0.0001 } },
        { text: "A szisztematikus hányad a részvény $R^2$-e.", tex: "R^2 = \\frac{0{,}0576}{0{,}1201}", result: { value: 47.96, tolerance: 0.05, unit: "%" } },
      ],
    },

    h("Az indexmodell becslése"),
    p("A paraméterek abból a regresszióból adódnak, amellyel a „CAPM, béta és az értékpapír-piaci egyenes” című lecke a bétát becsülte: regresszáljuk a részvény hozamait az index hozamaira, mondjuk 60 hónapon át. A meredekség $\\hat\\beta_i$, a tengelymetszet $\\hat\\alpha_i$, a reziduumok szórása pedig $\\sigma_{\\varepsilon,i}$ becslése. Az a lecke többlethozamokkal dolgozott; állandó $r_f$ mellett a meredekség ugyanaz, csak a tengelymetszet változik. Az index mintabeli varianciájából kapjuk $\\sigma_M$-et."),

    h("Az indexmodell és a CAPM"),
    p("A kettő hasonlít egymásra, de más jellegű állítást tesz. Az egyindexes modell **statisztikai** modell: azt írja le, hogyan mozognak együtt a hozamok, és fő feltevése, az egyedi hozamok korrelálatlansága, az adatokon ellenőrizhető. Arról semmit sem mond, mekkorák legyenek a várható hozamok; bármilyen $\\alpha_i$ megengedett. A CAPM **egyensúlyi** modell: a befektetőkről tett feltevésekből arra jut, hogy a várható többlethozamok arányosak a bétával, vagyis a többlethozamos regresszió alfája nulla. A CAPM-nek nincs szüksége korrelálatlan egyedi hozamokra, és az indexmodell érvényességéhez sem kell a CAPM. A gyakorlatban a várható hozamokat a CAPM, a kovarianciamátrixot az indexmodell adja."),

    h("Számpélda"),
    p("Legyen minden részvényre $\\sigma_M = 18\\%$, $\\beta = 1$ és $\\sigma_\\varepsilon = 30\\%$. Egyetlen részvény varianciája $0{,}0324 + 0{,}09 = 0{,}1224$, volatilitása kb. $35{,}0\\%$, $R^2$-e pedig $0{,}0324/0{,}1224 \\approx 26{,}5\\%$. 20 részvény egyenlő súlyozásával"),
    eq("\\sigma_p^2 = 0{,}0324 + \\frac{0{,}09}{20} = 0{,}0369, \\qquad \\sigma_p \\approx 19{,}21\\%."),
    p("A padló $\\beta\\sigma_M = 18\\%$, a szisztematikus hányad $0{,}0324/0{,}0369 \\approx 87{,}8\\%$. Húsz részvény az egyedi kockázat szinte egészét eltüntette: a volatilitás 35%-ról 19,2%-ra esett, és csak 1,2 százalékpont maradt a padló felett. 100 részvénynél a teljes kovarianciamátrixnak $100 \\times 101/2 = 5050$ eleme van, az indexmodellnek viszont csak $2 \\times 100 + 1 = 201$ paraméter kell (az alfákkal 301)."),
    p("Az ábra a piaci volatilitást $\\sigma_M = 18\\%$-on rögzíti, és $N$ részvényből egyenlő súlyú portfóliót épít, amelyben minden részvénynek ugyanaz a bétája és az egyedi volatilitása. A csúszkák az átlagos $\\beta$ bétát (0,5 és 1,5 között, alapérték 1), az egyedi volatilitást (10% és 60% között, alapérték 30%) és a részvények $N$ számát (1 és 100 között, alapérték 20) állítják. A diagram a portfólió volatilitását mutatja $N$ függvényében 1-től 100-ig, a $\\beta\\sigma_M$ padlóval együtt, a választott $N$-et pedig függőleges vonal jelöli. A kijelzők a portfólió volatilitását a választott $N$-nél, a padlót, a variancia szisztematikus hányadát, valamint $N$ részvényre a teljes kovarianciamátrix és az egyindexes modell paramétereinek számát mutatják. Emeld az egyedi volatilitást 60%-ra, és figyeld meg, mennyivel több részvény kell a padló megközelítéséhez: 30%-nál nagyjából 25, 60%-nál nagyjából 98 részvény kell ahhoz, hogy a volatilitás legfeljebb egy százalékponttal legyen 18% fölött. Ezután mozgasd a $\\beta$-t, és nézd, hogyan tolódik el a padló, $\\beta = 1{,}3$-nál például $23{,}4\\%$-ra."),
    figure("factor-variance"),

    h("Többfaktoros modellek"),
    p("Egyetlen index ritkán magyarázza az összes közös mozgást: a bankok a bankokkal, a kis cégek a kis cégekkel mozognak együtt, így a rokon részvények egyedi hozamai korrelálnak, ami ellentmond a második feltevésnek. A **többfaktoros modell** további közös forrásokat vesz fel, $F_1, \\dots, F_K$-t:"),
    eq("R_i = \\alpha_i + \\sum_{k=1}^{K}\\beta_{ik}F_k + \\varepsilon_i,"),
    p("ismét úgy, hogy az egyedi hozamok korrelálatlanok a faktorokkal és egymással. Gyűjtsük a $\\beta_{ik}$ faktorsúlyokat egy $N \\times K$-s $B$ mátrixba, a faktorok kovarianciáit egy $K \\times K$-s $\\Sigma_F$ mátrixba, az egyedi varianciákat pedig egy $D$ diagonális mátrixba. A fentivel azonos kifejtés adja a hozamok kovarianciamátrixát:"),
    eq("\\Sigma = B\\,\\Sigma_F\\,B^{\\top} + D,"),
    p("$NK + K(K+1)/2 + N$ paraméterrel; 500 részvényre és 3 faktorra ez 2006. A legismertebbek Fama és French faktorai: a piac mellett a **méret** (a kis cégek hozama mínusz a nagyoké) és az **érték** (a magas könyv szerinti és piaci érték arányú cégek hozama mínusz az alacsonyaké). Carhart ehhez a **momentumot** tette hozzá, a közelmúlt nyerteseinek hozama mínusz a veszteseké. Minden ilyen faktor maga is egy long–short portfólió hozama. Vitatott, hogy ezek a faktorok kockázatért járó jutalmat vagy tartós félreárazást tükröznek; a kovarianciák leírására mindenesetre jól beválnak."),

    h("Összefoglalás"),
    list(
      "$N$ eszköz teljes kovarianciamátrixának $N(N+1)/2$ eleme van; a faktormodellek ezt eszközönként néhány paraméterrel helyettesítik.",
      "Egyindexes modell: $R_i = \\alpha_i + \\beta_i R_M + \\varepsilon_i$, amiből $\\operatorname{Var}(R_i) = \\beta_i^2\\sigma_M^2 + \\sigma_{\\varepsilon,i}^2$ és $\\operatorname{Cov}(R_i, R_j) = \\beta_i\\beta_j\\sigma_M^2$ következik, $2N + 1$ kockázati paraméterrel (az alfákkal $3N + 1$).",
      "A portfólió varianciája $\\beta_p^2\\sigma_M^2 + \\sum_i w_i^2\\sigma_{\\varepsilon,i}^2$; egyenlő súlyoknál az egyedi rész $\\sigma_\\varepsilon^2/N$, és a volatilitás a $\\beta_p\\sigma_M$ padló felé csökken.",
      "Az indexmodell a kovarianciák statisztikai leírása; a CAPM egyensúlyi állítás a várható hozamokról.",
      "A többfaktoros modellek (piac, méret, érték, momentum) kovarianciamátrixa $\\Sigma = B\\Sigma_F B^{\\top} + D$.",
    ),
    note("A következő lecke, a „Kockáztatott érték (VaR) és várható veszteség (ES)”, a portfólió volatilitásából veszteségszintet számol, és nagy portfólióknál ezt a volatilitást rendszerint faktoros kovarianciamátrixból kapjuk."),
    lab("/capm", "Becsülj bétát, és válaszd szét a szisztematikus és az egyedi kockázatot a CAPM laborban"),
  ],
};
