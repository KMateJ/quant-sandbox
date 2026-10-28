import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const famaFrenchFactors: GuideLessonContent = {
  en: [
    p("The lesson \"CAPM, beta and the security market line\" said that a single number, the market beta, should explain every asset's expected return, and \"Factor models and systematic risk\" showed how one common factor splits risk into a systematic and an idiosyncratic part. This lesson asks what happens when the market alone is not enough. It builds the Fama–French factors from sorted portfolios, runs the regressions that use them, and shows how to read the loadings, the alpha and the R² that come out."),

    h("Size and value anomalies under CAPM"),
    p("Test CAPM on a stock or a portfolio by regressing its monthly excess return $R_i - R_f$ on the market's excess return $R_M - R_f$:"),
    eq("R_{i,t} - R_{f,t} = \\alpha_i + \\beta_i\\,(R_{M,t} - R_{f,t}) + \\varepsilon_{i,t}."),
    p("If CAPM holds, the intercept $\\alpha_i$ is zero: the market beta accounts for the whole average return. In US data from the 1960s onwards two groups of portfolios break this. Portfolios of small companies earned more than their betas justify, and so did portfolios of value stocks, firms with a high ratio of book equity to market value. Growth stocks, with a low ratio, earned less. These positive and negative alphas are called the size and value anomalies. Fama and French (1993) responded by adding the returns that size and value themselves earn as extra factors."),

    h("Building factors from sorted portfolios"),
    p("A factor here is the return of a long–short portfolio. Each June, sort all stocks by market capitalisation into small and big, and separately by book-to-market into growth (bottom 30%), neutral and value (top 30%). The intersections give six value-weighted portfolios. Two factors come out of them:"),
    eq("\\text{SMB} = \\tfrac{1}{3}(\\text{SV} + \\text{SN} + \\text{SG}) - \\tfrac{1}{3}(\\text{BV} + \\text{BN} + \\text{BG}),"),
    eq("\\text{HML} = \\tfrac{1}{2}(\\text{SV} + \\text{BV}) - \\tfrac{1}{2}(\\text{SG} + \\text{BG})."),
    p("SMB (small minus big) buys small firms and sells big ones while holding the value mix fixed; HML (high minus low) buys value and sells growth while holding the size mix fixed. Because each is a difference of two portfolios, it costs nothing to hold in theory, and its average return is a premium per unit of exposure. The market factor MKT is $R_M - R_f$."),
    p("The five-factor model of 2015 adds two more built the same way. RMW (robust minus weak) is long firms with high operating profitability and short those with low profitability. CMA (conservative minus aggressive) is long firms that grow their assets slowly and short those that invest heavily. Carhart (1997) added momentum, UMD (up minus down), long last year's winners and short its losers; it is often appended to either model."),

    h("The three-factor and five-factor regressions"),
    p("The Fama–French regressions are time-series regressions, one per fund or portfolio, with the factor returns as regressors. The three-factor model (FF3) is"),
    eq("R_{i,t} - R_{f,t} = \\alpha_i + b_i\\,\\text{MKT}_t + s_i\\,\\text{SMB}_t + h_i\\,\\text{HML}_t + \\varepsilon_{i,t},"),
    p("and the five-factor model (FF5) adds $r_i\\,\\text{RMW}_t + c_i\\,\\text{CMA}_t$. Taking expectations and using $E[\\varepsilon] = 0$ gives the model's prediction for the average excess return:"),
    eq("E[R_i - R_f] = \\alpha_i + b_i\\,E[\\text{MKT}] + s_i\\,E[\\text{SMB}] + h_i\\,E[\\text{HML}]."),
    p("The model holds when $\\alpha_i = 0$: then the average return is just the sum of each loading times its factor premium, exactly as CAPM's line had one beta times one premium."),

    h("Reading the loadings"),
    p("Each loading is a sensitivity holding the other factors fixed. $b_i$ is close to the CAPM beta but usually not equal to it, because SMB and HML now absorb part of the co-movement. A positive $s_i$ means the fund behaves like small stocks, a negative one like large stocks; a positive $h_i$ means a value tilt and a negative one a growth tilt. A loading of 0.5 on SMB says that when small firms beat big ones by 1% in a month, the fund tends to gain 0.5% more than its market exposure alone would give. In the five-factor model, a positive $r_i$ points to profitable firms and a positive $c_i$ to firms that invest conservatively."),
    {
      kind: "check",
      id: "fama-french-factors/expected-excess",
      prompt: "A fund has loadings b = 0.9, s = 0.6 and h = 0.5. The factor premia are 7% a year on MKT, 2% on SMB and 3% on HML. What annual excess return (in %) does FF3 predict with zero alpha?",
      answer: { type: "number", value: 9, tolerance: 0.01 },
      explain: "$0.9 \\cdot 7 + 0.6 \\cdot 2 + 0.5 \\cdot 3 = 6.3 + 1.2 + 1.5 = 9.0\\%$.",
    },

    h("Alpha and its t-statistic"),
    p("Alpha is the average return the factors do not explain. It is estimated from a finite sample, so it comes with a standard error, and the question is whether it differs from zero by more than noise. The usual test is the t-statistic"),
    eq("t_\\alpha = \\frac{\\hat\\alpha}{\\text{SE}(\\hat\\alpha)},"),
    p("and $|t_\\alpha| > 2$ is the rough threshold for a significant alpha at the 5% level. The standard error shrinks like $1/\\sqrt{T}$ in the number of months $T$, so a given alpha becomes easier to detect in a longer sample."),
    p("Why does adding factors shrink alpha? Suppose the true model is FF3, but you fit CAPM. The omitted terms $s_i\\,\\text{SMB} + h_i\\,\\text{HML}$ then sit in the residual, and their mean ends up in the intercept:"),
    eq("\\alpha_i^{\\text{CAPM}} \\approx \\alpha_i + s_i\\,E[\\text{SMB}] + h_i\\,E[\\text{HML}]."),
    p("A small-value fund therefore shows a positive CAPM alpha even if its manager has no skill: it is collecting the size and value premia. Once those factors enter the regression, that part of the alpha moves into the loadings. (The approximation ignores the correlation between the market and the omitted factors, which shifts the beta a little too.)"),
    {
      kind: "worked",
      title: "Expected return and alpha from an FF3 fit",
      steps: [
        { text: "A fund's FF3 loadings are b = 1.1, s = 0.4 and h = −0.3, a growth tilt. Premia are 6% on MKT, 2% on SMB and 3.5% on HML a year. The market contributes, in %:", tex: "1.1 \\cdot 6", result: { value: 6.6, tolerance: 0.001 } },
        { text: "Size and value together contribute (the growth tilt costs return):", tex: "0.4 \\cdot 2 - 0.3 \\cdot 3.5", result: { value: -0.25, tolerance: 0.001 } },
        { text: "So the model predicts this annual excess return, in %:", tex: "6.6 - 0.25", result: { value: 6.35, tolerance: 0.001 } },
        { text: "The fund actually earned 8% a year over the risk-free rate. Its FF3 alpha is the gap:", tex: "8 - 6.35", result: { value: 1.65, tolerance: 0.001 } },
        { text: "With a standard error of 1.1% a year on alpha, the t-statistic is below 2, so the alpha is not significant:", tex: "1.65 / 1.1", result: { value: 1.5, tolerance: 0.001 } },
      ],
    },
    p("The figure simulates 240 months of factor returns and a fund whose true alpha is zero, with market loading 1, RMW loading 0.3, CMA loading 0, and size and value loadings set by the sliders. Start at the defaults, $s = 0.5$ and $h = 0.4$, with CAPM: the fitted alpha is 4.00% a year with a t-statistic of 2.08, apparently significant skill, and R² is 0.746. Switch to FF3: alpha falls to 1.28% (t = 1.04) and R² rises to 0.899, while the size and value bars land near their true marks. Switch to FF5: the remaining alpha, which was the profitability premium, drops to 0.29% (t = 0.26), R² reaches 0.919, and the RMW bar finds its loading of 0.3. Then set both tilts to zero and see the CAPM alpha shrink, or lengthen the sample and watch the bars settle."),
    figure("ff-loadings"),
    {
      kind: "check",
      id: "fama-french-factors/alpha-shrinks",
      prompt: "A fund has a CAPM alpha of 4% a year with t = 2.1. In FF3 its alpha is 0.3% with t = 0.3, and its SMB and HML loadings are large and positive. What is the best reading?",
      answer: { type: "choice", options: ["Its CAPM alpha came from size and value exposure, not skill", "The manager is skilled, and FF3 hides it", "FF3 is wrong because R² went up", "The fund has no market risk"], correct: 0 },
      explain: "The CAPM alpha is roughly $s\\,E[\\text{SMB}] + h\\,E[\\text{HML}]$ plus any true alpha. Once those premia are priced in, almost nothing is left, so the return came from factor exposure that could be bought cheaply.",
    },

    h("Explained variance"),
    p("The R² of the regression is the share of the fund's return variance the factors explain. With uncorrelated residuals, the variance splits as"),
    eq("\\text{Var}(R_i) = \\mathbf{b}_i^{\\top}\\,\\Sigma_f\\,\\mathbf{b}_i + \\sigma_{\\varepsilon,i}^2,"),
    p("where $\\mathbf{b}_i$ collects the loadings and $\\Sigma_f$ is the covariance matrix of the factors. With the market as the only factor this is the single-index split from the factor-models lesson, $\\beta_i^2\\sigma_M^2 + \\sigma_\\varepsilon^2$. Adding factors moves variance from the residual into the systematic part, so R² can only rise. A high R² says the fund is close to a mix of factor portfolios; it says nothing about whether the alpha is zero."),

    h("Testing many portfolios at once"),
    p("A model is judged on many test portfolios together, for example 25 portfolios sorted by size and book-to-market. Run the time-series regression for each and look at all intercepts: a good model leaves them small and jointly insignificant. The Gibbons–Ross–Shanken (GRS) test turns the vector of alphas into one F-statistic, and the average absolute alpha gives an easy-to-read summary. FF3 cuts the mean absolute alpha of size–value portfolios far below CAPM's; FF5 does better still on portfolios sorted by profitability and investment, and makes HML nearly redundant, because value firms tend to be profitable and to invest conservatively."),

    h("Limits of factor models"),
    p("Factors found by sorting historical data are at risk of data mining: test enough characteristics and some will show a premium by chance. Hundreds of candidate factors have been published, the so-called factor zoo, and many shrink or vanish out of sample or after costs. Whether a premium is a reward for risk or a mispricing is not settled by the regression either. In practice the models are most useful as a benchmark: they tell you which part of a fund's return could have been bought with cheap factor portfolios."),
    note("Alpha is always relative to a model. A CAPM alpha, an FF3 alpha and an FF5 alpha are different numbers for the same fund, and a manager's skill should be measured against the factors an investor could have held instead."),

    h("Summary"),
    list(
      "SMB, HML, RMW, CMA and UMD are long–short portfolios built from sorts on size, book-to-market, profitability, investment and past returns.",
      "The time-series regression $R_i - R_f = \\alpha + b\\,\\text{MKT} + s\\,\\text{SMB} + h\\,\\text{HML} (+ r\\,\\text{RMW} + c\\,\\text{CMA}) + \\varepsilon$ gives loadings that say which styles a fund resembles.",
      "With zero alpha the expected excess return is the sum of loadings times factor premia; the CAPM alpha of a tilted fund is roughly its tilts times the omitted premia.",
      "Alpha is significant when $|t_\\alpha| > 2$; R² measures how much of the variance is systematic, and rises as factors are added.",
      "Models are tested on many portfolios jointly (GRS, mean |α|), and the long list of published factors calls for caution about data mining.",
    ),
    lab("/fama-french", "Open the Fama–French lab"),
  ],
  hu: [
    p("A „CAPM, béta és az értékpapír-piaci egyenes” lecke szerint egyetlen szám, a piaci béta, megmagyarázza minden eszköz várható hozamát, a „Faktormodellek és szisztematikus kockázat” pedig megmutatta, hogyan bontja egy közös faktor a kockázatot szisztematikus és egyedi részre. Ez a lecke azt nézi meg, mi történik, ha a piac önmagában nem elég. Felépíti a Fama–French-faktorokat rendezett portfóliókból, lefuttatja a rájuk épülő regressziókat, és megmutatja, hogyan olvasd a kapott faktorbétákat, az alfát és az R²-et."),

    h("Méret- és értékanomália a CAPM-ben"),
    p("A CAPM-et egy részvényen vagy portfólión úgy teszteled, hogy a havi többlethozamát, $R_i - R_f$-et, a piac többlethozamára, $R_M - R_f$-re regresszálod:"),
    eq("R_{i,t} - R_{f,t} = \\alpha_i + \\beta_i\\,(R_{M,t} - R_{f,t}) + \\varepsilon_{i,t}."),
    p("Ha a CAPM érvényes, az $\\alpha_i$ tengelymetszet nulla: a piaci béta a teljes átlagos hozamot megmagyarázza. Az 1960-as évektől kezdődő amerikai adatokban két portfóliócsoport ezt megsérti. A kis vállalatok portfóliói többet hoztak, mint amennyit a bétájuk indokol, és ugyanígy az értékrészvényeké, vagyis a magas könyv szerinti és piaci érték arányú cégeké. A növekedési részvények, alacsony aránnyal, kevesebbet hoztak. Ezeket a pozitív és negatív alfákat nevezik méret- és értékanomáliának. Fama és French (1993) válasza az volt, hogy magának a méretnek és az értéknek a hozamát vették fel további faktorként."),

    h("Faktorok építése rendezett portfóliókból"),
    p("A faktor itt egy long–short portfólió hozama. Minden júniusban rendezd az összes részvényt piaci kapitalizáció szerint kicsikre és nagyokra, és külön könyv szerinti/piaci érték szerint növekedési (alsó 30%), semleges és érték (felső 30%) csoportokra. A metszetek hat, piaci értékkel súlyozott portfóliót adnak. Ezekből két faktor születik:"),
    eq("\\text{SMB} = \\tfrac{1}{3}(\\text{SV} + \\text{SN} + \\text{SG}) - \\tfrac{1}{3}(\\text{BV} + \\text{BN} + \\text{BG}),"),
    eq("\\text{HML} = \\tfrac{1}{2}(\\text{SV} + \\text{BV}) - \\tfrac{1}{2}(\\text{SG} + \\text{BG})."),
    p("Az SMB (small minus big) a kis cégeket veszi és a nagyokat adja el, rögzített értékösszetétel mellett; a HML (high minus low) az értékrészvényeket veszi és a növekedésieket adja el, rögzített méretösszetétel mellett. Mivel mindkettő két portfólió különbsége, elméletben semmibe sem kerül a tartása, és az átlagos hozama egységnyi kitettségre jutó prémium. A piaci faktor, az MKT, $R_M - R_f$."),
    p("A 2015-ös ötfaktoros modell két további, ugyanígy épített faktort ad hozzá. Az RMW (robust minus weak) a magas működési jövedelmezőségű cégekben long, az alacsonyban short. A CMA (conservative minus aggressive) a lassan, óvatosan beruházó cégekben long, a sokat beruházókban short. Carhart (1997) a momentumot tette hozzá: az UMD (up minus down) az előző év nyerteseiben long, a veszteseiben short, és gyakran bármelyik modellhez hozzáveszik."),

    h("A három- és az ötfaktoros regresszió"),
    p("A Fama–French-regressziók idősoros regressziók, alaponként vagy portfóliónként egy-egy, a faktorhozamokkal mint magyarázó változókkal. A háromfaktoros modell (FF3):"),
    eq("R_{i,t} - R_{f,t} = \\alpha_i + b_i\\,\\text{MKT}_t + s_i\\,\\text{SMB}_t + h_i\\,\\text{HML}_t + \\varepsilon_{i,t},"),
    p("az ötfaktoros modell (FF5) pedig hozzáadja az $r_i\\,\\text{RMW}_t + c_i\\,\\text{CMA}_t$ tagokat. Várható értéket véve és $E[\\varepsilon] = 0$-t használva megkapod a modell előrejelzését az átlagos többlethozamra:"),
    eq("E[R_i - R_f] = \\alpha_i + b_i\\,E[\\text{MKT}] + s_i\\,E[\\text{SMB}] + h_i\\,E[\\text{HML}]."),
    p("A modell akkor érvényes, ha $\\alpha_i = 0$: ekkor az átlagos hozam egyszerűen az egyes faktorbéták és a hozzájuk tartozó prémiumok szorzatainak összege, ahogy a CAPM egyenesénél egy béta szorozta egy prémiumot."),

    h("A faktorbéták értelmezése"),
    p("Minden faktorbéta érzékenység, a többi faktor rögzítése mellett. A $b_i$ közel van a CAPM-bétához, de általában nem egyenlő vele, mert az SMB és a HML most átveszi az együttmozgás egy részét. A pozitív $s_i$ azt jelenti, hogy az alap kis vállalatokként viselkedik, a negatív nagy vállalatokként; a pozitív $h_i$ értékorientációt, a negatív növekedési orientációt jelez. Egy 0{,}5-ös SMB-béta azt mondja, hogy ha egy hónapban a kis cégek 1%-kal verik a nagyokat, az alap jellemzően 0{,}5%-kal többet nyer annál, amit a piaci kitettsége önmagában adna. Az ötfaktoros modellben a pozitív $r_i$ jövedelmező cégekre, a pozitív $c_i$ óvatosan beruházó cégekre utal."),
    {
      kind: "check",
      id: "fama-french-factors/expected-excess",
      prompt: "Egy alap faktorbétái b = 0,9, s = 0,6 és h = 0,5. A faktorprémiumok évente 7% az MKT-n, 2% az SMB-n és 3% a HML-en. Hány százalék éves többlethozamot jelez előre az FF3 nulla alfa mellett?",
      answer: { type: "number", value: 9, tolerance: 0.01 },
      explain: "$0{,}9 \\cdot 7 + 0{,}6 \\cdot 2 + 0{,}5 \\cdot 3 = 6{,}3 + 1{,}2 + 1{,}5 = 9{,}0\\%$.",
    },

    h("Az alfa és a t-értéke"),
    p("Az alfa az az átlagos hozam, amit a faktorok nem magyaráznak meg. Véges mintából becsülöd, ezért standard hibája van, és az a kérdés, hogy a zajnál jobban eltér-e a nullától. A szokásos próba a t-érték"),
    eq("t_\\alpha = \\frac{\\hat\\alpha}{\\text{SE}(\\hat\\alpha)},"),
    p("és $|t_\\alpha| > 2$ a durva küszöb, amely felett az alfa 5%-os szinten szignifikáns. A standard hiba a hónapok $T$ számával $1/\\sqrt{T}$ ütemben csökken, így egy adott alfa hosszabb mintában könnyebben kimutatható."),
    p("Miért zsugorodik az alfa, ha faktorokat adsz hozzá? Tegyük fel, hogy a valódi modell az FF3, de te CAPM-et illesztesz. A kihagyott $s_i\\,\\text{SMB} + h_i\\,\\text{HML}$ tagok ekkor a reziduumban ülnek, és az átlaguk a tengelymetszetbe kerül:"),
    eq("\\alpha_i^{\\text{CAPM}} \\approx \\alpha_i + s_i\\,E[\\text{SMB}] + h_i\\,E[\\text{HML}]."),
    p("Egy kis és értékrészvényekbe fektető alap ezért pozitív CAPM-alfát mutat akkor is, ha a kezelője semmilyen különleges képességgel nem rendelkezik: egyszerűen begyűjti a méret- és az értékprémiumot. Amint ezek a faktorok bekerülnek a regresszióba, az alfának ez a része átvándorol a faktorbétákba. (A közelítés elhanyagolja a piac és a kihagyott faktorok korrelációját, ami a bétát is kicsit elmozdítja.)"),
    {
      kind: "worked",
      title: "Várható hozam és alfa egy FF3-illesztésből",
      steps: [
        { text: "Egy alap FF3-bétái b = 1,1, s = 0,4 és h = −0,3, azaz növekedési orientációjú. A prémiumok évente 6% az MKT-n, 2% az SMB-n és 3,5% a HML-en. A piac hozzájárulása, %-ban:", tex: "1{,}1 \\cdot 6", result: { value: 6.6, tolerance: 0.001 } },
        { text: "A méret és az érték együttes hozzájárulása (a növekedési orientáció hozamba kerül):", tex: "0{,}4 \\cdot 2 - 0{,}3 \\cdot 3{,}5", result: { value: -0.25, tolerance: 0.001 } },
        { text: "A modell tehát ennyi éves többlethozamot jelez előre, %-ban:", tex: "6{,}6 - 0{,}25", result: { value: 6.35, tolerance: 0.001 } },
        { text: "Az alap ténylegesen évi 8%-ot hozott a kockázatmentes hozam felett. Az FF3-alfája a különbség:", tex: "8 - 6{,}35", result: { value: 1.65, tolerance: 0.001 } },
        { text: "Ha az alfa standard hibája évi 1,1%, a t-érték 2 alatt van, így az alfa nem szignifikáns:", tex: "1{,}65 / 1{,}1", result: { value: 1.5, tolerance: 0.001 } },
      ],
    },
    p("Az ábra 240 hónapnyi faktorhozamot szimulál, és egy alapot, amelynek valódi alfája nulla, piaci bétája 1, RMW-bétája 0{,}3, CMA-bétája 0, a méret- és értékbétáját pedig a csúszkák állítják. Indulj az alapbeállításból, $s = 0{,}5$ és $h = 0{,}4$, CAPM-mel: az illesztett alfa évi 4{,}00%, 2{,}08-os t-értékkel, ami látszólag szignifikáns tehetség, az R² pedig 0{,}746. Válts FF3-ra: az alfa 1{,}28%-ra esik (t = 1{,}04), az R² 0{,}899-re nő, a méret- és az értékoszlop pedig a valódi jele közelébe kerül. Válts FF5-re: a maradék alfa, ami a jövedelmezőségi prémium volt, 0{,}29%-ra csökken (t = 0{,}26), az R² eléri a 0{,}919-et, az RMW-oszlop pedig megtalálja a 0{,}3-as bétáját. Ezután állítsd mindkét kitettséget nullára, és nézd, ahogy a CAPM-alfa zsugorodik, vagy hosszabbítsd a mintát, és figyeld, ahogy az oszlopok beállnak."),
    figure("ff-loadings"),
    {
      kind: "check",
      id: "fama-french-factors/alpha-shrinks",
      prompt: "Egy alap CAPM-alfája évi 4%, t = 2,1. Az FF3-ban az alfája 0,3%, t = 0,3, az SMB- és HML-bétája pedig nagy és pozitív. Mi a legjobb értelmezés?",
      answer: { type: "choice", options: ["A CAPM-alfája a méret- és értékkitettségből jött, nem tehetségből", "A kezelő tehetséges, és az FF3 ezt elrejti", "Az FF3 hibás, mert nőtt az R²", "Az alapnak nincs piaci kockázata"], correct: 0 },
      explain: "A CAPM-alfa nagyjából $s\\,E[\\text{SMB}] + h\\,E[\\text{HML}]$ plusz az esetleges valódi alfa. Ha ezeket a prémiumokat beárazod, szinte semmi sem marad, vagyis a hozam olcsón megvásárolható faktorkitettségből jött.",
    },

    h("A megmagyarázott variancia"),
    p("A regresszió R²-e az alap hozamvarianciájának az a része, amelyet a faktorok megmagyaráznak. Korrelálatlan reziduumok mellett a variancia így bomlik fel:"),
    eq("\\text{Var}(R_i) = \\mathbf{b}_i^{\\top}\\,\\Sigma_f\\,\\mathbf{b}_i + \\sigma_{\\varepsilon,i}^2,"),
    p("ahol $\\mathbf{b}_i$ a faktorbéták vektora, $\\Sigma_f$ pedig a faktorok kovarianciamátrixa. Ha a piac az egyetlen faktor, ez a faktormodellek leckéjének egyindexes felbontása, $\\beta_i^2\\sigma_M^2 + \\sigma_\\varepsilon^2$. Újabb faktorok varianciát mozgatnak a reziduumból a szisztematikus részbe, így az R² csak nőhet. A magas R² azt mondja, hogy az alap közel van faktorportfóliók keverékéhez; arról semmit, hogy az alfa nulla-e."),

    h("Sok portfólió együttes tesztje"),
    p("Egy modellt sok tesztportfólión együtt ítélünk meg, például 25, méret és könyv szerinti/piaci érték szerint rendezett portfólión. Mindegyikre lefuttatod az idősoros regressziót, és az összes tengelymetszetet nézed: egy jó modell után ezek kicsik és együttesen sem szignifikánsak. A Gibbons–Ross–Shanken- (GRS-) próba az alfák vektorát egyetlen F-statisztikává alakítja, az átlagos abszolút alfa pedig könnyen olvasható összefoglaló. Az FF3 a méret–érték portfóliók átlagos abszolút alfáját a CAPM-énél jóval kisebbre szorítja; az FF5 a jövedelmezőség és beruházás szerint rendezett portfóliókon még jobb, és a HML-t szinte feleslegessé teszi, mert az értékcégek jellemzően jövedelmezők és óvatosan ruháznak be."),

    h("A faktormodellek korlátai"),
    p("A történeti adatok rendezéséből talált faktorokat fenyegeti az adatbányászat: ha elég sok jellemzőt tesztelsz, némelyik véletlenül is prémiumot mutat. Több száz jelölt faktort publikáltak már, ez az úgynevezett faktorállatkert, és sokuk mintán kívül vagy költségek után összezsugorodik vagy eltűnik. Azt sem dönti el a regresszió, hogy egy prémium a kockázat jutalma vagy félreárazás. A gyakorlatban a modellek leginkább viszonyítási alapként hasznosak: megmondják, egy alap hozamának mekkora része lett volna megvásárolható olcsó faktorportfóliókkal."),
    note("Az alfa mindig egy modellhez képest értendő. A CAPM-alfa, az FF3-alfa és az FF5-alfa ugyanannál az alapnál különböző számok, és a kezelő tehetségét azokhoz a faktorokhoz kell mérni, amelyeket a befektető helyette tarthatott volna."),

    h("Összefoglalás"),
    list(
      "Az SMB, a HML, az RMW, a CMA és az UMD long–short portfóliók, amelyek méret, könyv szerinti/piaci érték, jövedelmezőség, beruházás és múltbeli hozam szerinti rendezésből épülnek.",
      "Az $R_i - R_f = \\alpha + b\\,\\text{MKT} + s\\,\\text{SMB} + h\\,\\text{HML} (+ r\\,\\text{RMW} + c\\,\\text{CMA}) + \\varepsilon$ idősoros regresszió faktorbétái megmutatják, mely stílusokra hasonlít egy alap.",
      "Nulla alfa mellett a várható többlethozam a faktorbéták és a faktorprémiumok szorzatainak összege; egy orientált alap CAPM-alfája nagyjából a kitettségei szorozva a kihagyott prémiumokkal.",
      "Az alfa akkor szignifikáns, ha $|t_\\alpha| > 2$; az R² a variancia szisztematikus részét méri, és faktorok hozzáadásával nő.",
      "A modelleket sok portfólión együtt tesztelik (GRS, átlagos |α|), a publikált faktorok hosszú listája pedig óvatosságra int az adatbányászattal szemben.",
    ),
    lab("/fama-french", "Nyisd meg a Fama–French-labort"),
  ],
};
