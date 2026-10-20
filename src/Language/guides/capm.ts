import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const capm: GuideLessonContent = {
  en: [
    p("The lesson \"The efficient frontier and the capital market line\" described how a single investor should choose a portfolio. This lesson assumes that every investor behaves that way and works out the consequence for prices. The result is the capital asset pricing model (CAPM): the expected return of any asset depends on one number, its beta."),

    h("Assumptions"),
    p("The CAPM rests on the following simplifications, each stated explicitly:"),
    list(
      "Investors care only about the expected return and volatility of their portfolio over one common period (mean–variance preferences from the previous lesson).",
      "All investors agree on the expected returns, volatilities and correlations of all assets (homogeneous expectations).",
      "Everyone can lend and borrow any amount at the same risk-free rate $r_f$.",
      "There are no taxes or transaction costs, assets can be split into any fraction, short sales are allowed, and no single investor can move prices.",
    ),
    p("None of these holds exactly. The point is to see what follows if they did, and then to judge how far reality departs."),

    h("The market portfolio"),
    p("By two-fund separation, every investor holds the risk-free asset and the same tangency portfolio T, only in different amounts. Add up all investors' holdings: the total risky holding is a multiple of T. But the total risky holding must equal everything that exists, because every share outstanding is owned by someone. So in equilibrium T is the **market portfolio** M: every risky asset, held in proportion to its market value."),
    p("Write $\\mathbb{E}[R_m]$ and $\\sigma_m$ for the expected return and volatility of the market portfolio. The capital market line becomes"),
    eq("\\mathbb{E}[R_p] = r_f + \\frac{\\mathbb{E}[R_m] - r_f}{\\sigma_m}\\,\\sigma_p,"),
    p("valid for efficient portfolios, that is mixes of $r_f$ and M. A single asset is not efficient and generally lies below this line, so the CML alone does not say what its expected return should be."),

    h("Beta"),
    p("The **beta** of asset $i$ measures how strongly its return moves with the market:"),
    eq("\\beta_i = \\frac{\\operatorname{Cov}(R_i, R_m)}{\\operatorname{Var}(R_m)} = \\rho_{im}\\,\\frac{\\sigma_i}{\\sigma_m}."),
    p("The market itself has $\\beta_m = 1$, the risk-free asset has $\\beta = 0$, and the beta of a portfolio is the weighted average of the betas of its assets, because covariance is linear in each argument. A beta of 1.3 means that when the market is 1% above its mean, the asset is on average 1.3% above its own."),

    h("Deriving the security market line"),
    p("Start from the market portfolio and move a small amount $\\varepsilon$ of money from the risk-free asset into asset $i$. The expected return changes by $\\varepsilon(\\mathbb{E}[R_i] - r_f)$. The variance $\\sigma_m^2$ changes by $2\\varepsilon\\operatorname{Cov}(R_i, R_m)$ to first order, so the volatility changes by"),
    eq("d\\sigma = \\varepsilon\\,\\frac{\\operatorname{Cov}(R_i, R_m)}{\\sigma_m}."),
    p("Because M is the tangency portfolio, no such small move can improve the trade-off: the ratio of extra return to extra volatility must equal the slope of the CML for every asset,"),
    eq("\\frac{\\mathbb{E}[R_i] - r_f}{\\operatorname{Cov}(R_i, R_m)/\\sigma_m} = \\frac{\\mathbb{E}[R_m] - r_f}{\\sigma_m}."),
    p("Otherwise one could tilt the portfolio towards (or away from) asset $i$ and obtain a higher Sharpe ratio than M. Solving for $\\mathbb{E}[R_i]$ gives the **security market line** (SML):"),
    eq("\\mathbb{E}[R_i] = r_f + \\beta_i\\,\\big(\\mathbb{E}[R_m] - r_f\\big)."),
    note("CAPM: the expected excess return of any asset equals its beta times the **market risk premium** $\\mathbb{E}[R_m] - r_f$."),

    h("Systematic and idiosyncratic risk"),
    p("Split the excess return of asset $i$ into a part explained by the market and a remainder:"),
    eq("R_i - r_f = \\alpha_i + \\beta_i\\,(R_m - r_f) + \\varepsilon_i, \\qquad \\operatorname{Cov}(\\varepsilon_i, R_m) = 0."),
    p("Taking variances gives"),
    eq("\\sigma_i^2 = \\beta_i^2\\sigma_m^2 + \\sigma_{\\varepsilon}^2."),
    p("The first term is **systematic** risk, the second **idiosyncratic** (firm-specific) risk. The lesson \"Diversification and correlation\" showed that in a large portfolio firm-specific variances disappear while common movements remain. An investor holding the market therefore bears only systematic risk, and the SML says only that part earns a premium. Idiosyncratic risk is not priced, because it can be removed at no cost."),
    p("Example: an asset with $\\sigma_i = 35\\%$ and correlation $0.6$ with a market of $\\sigma_m = 20\\%$ has $\\beta = 0.6 \\times 0.35 / 0.20 = 1.05$. Its systematic variance is $1.05^2 \\times 0.04 = 0.0441$, out of a total of $0.1225$: only 36% (that is, $\\rho^2$). The remaining 64%, a residual volatility of 28%, is idiosyncratic and earns no premium."),

    h("Worked example"),
    p("Let $r_f = 3\\%$, $\\mathbb{E}[R_m] = 8\\%$ and $\\beta = 1.3$. The market risk premium is $8\\% - 3\\% = 5\\%$. The required return of the asset is"),
    eq("\\mathbb{E}[R_i] = 3\\% + 1.3 \\times 5\\% = 9.5\\%,"),
    p("so its risk premium is $6.5\\%$. An asset with $\\beta = 0.5$ would require only $5.5\\%$, however volatile it is on its own."),
    {
      kind: "check",
      id: "capm/required-return",
      prompt: "An asset has $\\beta = 1.3$. The risk-free rate is 2% and the market is expected to return 8%. What expected return does the CAPM require, in percent?",
      answer: { type: "number", value: 9.8, tolerance: 0.01, unit: "%" },
      explain: "$\\mathbb{E}[R_i] = 2\\% + 1.3 \\times (8\\% - 2\\%) = 2\\% + 7.8\\% = 9.8\\%$.",
    },
    p("The figure plots expected return against beta from 0 to 2. The SML starts at $r_f$ for $\\beta = 0$ and passes through the market at $\\beta = 1$; a second marker shows the asset. Raise $\\mathbb{E}[R_m]$ and note that the line becomes steeper around the fixed point $(0, r_f)$. Move $\\beta$ and note that the asset slides along the line. The readouts give the market risk premium, the required return of the asset and its risk premium."),
    figure("security-market-line"),
    p("The SML and the CML are different lines. The CML has volatility on the horizontal axis and holds only for efficient portfolios. The SML has beta on the horizontal axis and holds for every asset and every portfolio."),

    h("Alpha"),
    p("The **alpha** of an asset is the gap between the expected return one actually forecasts and the return the SML requires:"),
    eq("\\alpha_i = \\mathbb{E}[R_i] - \\big(r_f + \\beta_i(\\mathbb{E}[R_m] - r_f)\\big)."),
    p("If an analyst expects 11% from the asset above, its alpha is $11\\% - 9.5\\% = 1.5\\%$: it plots above the SML and looks cheap for its risk. In the CAPM world such a gap cannot last. Investors would buy the asset, its price would rise and its expected return would fall until $\\alpha = 0$. A measured alpha is therefore either a mispricing, a reward for a risk the CAPM leaves out, or estimation noise."),
    {
      kind: "check",
      id: "capm/positive-alpha",
      prompt: "An analyst's forecast puts an asset above the security market line, so its alpha is positive. In the CAPM, what does that say about the asset?",
      answer: { type: "choice", options: ["It is overvalued for its risk", "It is undervalued for its risk", "Its beta is too high", "It carries no systematic risk"], correct: 1 },
      explain: "A positive alpha means the forecast return exceeds what the SML requires for its beta, so the asset looks cheap. Buying pressure would raise its price until $\\alpha = 0$.",
    },

    h("Estimating beta"),
    p("In practice beta is estimated by an ordinary least-squares regression of the asset's excess returns on the excess returns of a broad index, typically 60 monthly observations or 2 years of weekly ones. The regression slope is the sample covariance divided by the sample variance of the index. Example: if the sample covariance of monthly returns is $0.0018$ and the monthly index variance is $0.0016$, then $\\hat\\beta = 0.0018/0.0016 = 1.125$. The intercept estimates alpha."),
    {
      kind: "worked",
      title: "From a sample covariance to a required return",
      steps: [
        { text: "The regression slope is the sample covariance with the index divided by the index variance.", tex: "\\hat\\beta = \\frac{0.0018}{0.0016}", result: { value: 1.125, tolerance: 0.001 } },
        { text: "With $r_f = 3\\%$ and $\\mathbb{E}[R_m] = 8\\%$ the market risk premium is 5%, and the SML gives the required return.", tex: "\\mathbb{E}[R_i] = 3\\% + 1.125 \\times 5\\%", result: { value: 8.625, tolerance: 0.01, unit: "%" } },
      ],
    },
    p("Such estimates are noisy, they change as the firm's business and leverage change, and they depend on the index and the return frequency. Practitioners often shrink raw estimates towards 1 for these reasons."),

    h("Limitations"),
    list(
      "The true market portfolio contains all risky assets, including property and human capital. It cannot be observed, so every test uses a proxy index.",
      "Empirically the SML is flatter than predicted: low-beta stocks earn more and high-beta stocks less than the model says.",
      "Other characteristics, such as firm size and book-to-market value, explain average returns that beta does not. Multi-factor models add these as extra risk factors.",
      "The model covers a single period and ignores taxes, trading costs and borrowing limits.",
    ),
    p("Despite this, the CAPM remains the standard first estimate of a required return, for instance as the cost of equity in corporate finance."),

    h("Summary"),
    list(
      "If all investors use mean–variance analysis with the same inputs, the tangency portfolio is the market portfolio.",
      "Beta $\\beta_i = \\operatorname{Cov}(R_i, R_m)/\\operatorname{Var}(R_m)$ measures an asset's exposure to market movements.",
      "Only systematic risk $\\beta_i^2\\sigma_m^2$ is priced; idiosyncratic risk can be diversified away and earns no premium.",
      "Security market line: $\\mathbb{E}[R_i] = r_f + \\beta_i(\\mathbb{E}[R_m] - r_f)$; alpha is the deviation from it.",
      "Beta is estimated by regressing excess returns on an index; the model is a useful benchmark with known empirical weaknesses.",
    ),
    lab("/capm", "Estimate betas and compare assets with the security market line in the CAPM lab"),
  ],

  hu: [
    p("A „Hatékony front és tőkepiaci egyenes” című lecke azt írta le, hogyan válasszon portfóliót egyetlen befektető. Ez a lecke feltételezi, hogy minden befektető így viselkedik, és levezeti, mi következik ebből az árakra. Az eredmény a tőkepiaci eszközárazási modell (CAPM): bármely eszköz várható hozama egyetlen számtól, a bétájától függ."),

    h("Feltevések"),
    p("A CAPM az alábbi egyszerűsítésekre épül, mindegyiket kimondva:"),
    list(
      "A befektetőket csak portfóliójuk várható hozama és volatilitása érdekli egy közös időszakra (az előző lecke várható hozam–variancia preferenciái).",
      "Minden befektető ugyanazt gondolja az összes eszköz várható hozamáról, volatilitásáról és korrelációiról (homogén várakozások).",
      "Bárki tetszőleges összeget helyezhet el és vehet fel hitelként ugyanazon az $r_f$ kockázatmentes kamaton.",
      "Nincsenek adók és tranzakciós költségek, az eszközök tetszőlegesen oszthatók, a short eladás megengedett, és egyetlen befektető sem képes mozgatni az árakat.",
    ),
    p("Ezek egyike sem teljesül pontosan. A cél az, hogy lássuk, mi következne belőlük, és utána megítéljük, mennyire tér el ettől a valóság."),

    h("A piaci portfólió"),
    p("A kétalapos szétválasztás szerint minden befektető a kockázatmentes eszközt és ugyanazt a T érintési portfóliót tartja, csak eltérő mennyiségben. Adjuk össze az összes befektető állományát: a teljes kockázatos állomány T többszöröse. Ugyanakkor a teljes kockázatos állománynak meg kell egyeznie mindazzal, ami létezik, hiszen minden forgalomban lévő részvény valakinek a tulajdonában van. Egyensúlyban tehát T a **piaci portfólió**, M: minden kockázatos eszköz, a piaci értékével arányos súllyal."),
    p("Jelölje $\\mathbb{E}[R_m]$ és $\\sigma_m$ a piaci portfólió várható hozamát és volatilitását. A tőkepiaci egyenes ekkor"),
    eq("\\mathbb{E}[R_p] = r_f + \\frac{\\mathbb{E}[R_m] - r_f}{\\sigma_m}\\,\\sigma_p,"),
    p("és a hatékony portfóliókra, vagyis $r_f$ és M keverékeire érvényes. Egy egyedi eszköz nem hatékony, és általában az egyenes alatt helyezkedik el, így a CML önmagában nem mondja meg, mekkora legyen a várható hozama."),

    h("Béta"),
    p("Az $i$-edik eszköz **bétája** azt méri, mennyire erősen mozog a hozama a piaccal együtt:"),
    eq("\\beta_i = \\frac{\\operatorname{Cov}(R_i, R_m)}{\\operatorname{Var}(R_m)} = \\rho_{im}\\,\\frac{\\sigma_i}{\\sigma_m}."),
    p("Magának a piacnak $\\beta_m = 1$, a kockázatmentes eszköznek $\\beta = 0$, egy portfólió bétája pedig az eszközei bétáinak súlyozott átlaga, mert a kovariancia mindkét változójában lineáris. Az 1,3-es béta azt jelenti, hogy amikor a piac 1%-kal a várható értéke felett van, az eszköz átlagosan 1,3%-kal van a sajátja felett."),

    h("Az értékpapír-piaci egyenes levezetése"),
    p("Induljunk ki a piaci portfólióból, és tegyünk át kis $\\varepsilon$ összeget a kockázatmentes eszközből az $i$-edik eszközbe. A várható hozam $\\varepsilon(\\mathbb{E}[R_i] - r_f)$-fel változik. A $\\sigma_m^2$ variancia elsőrendben $2\\varepsilon\\operatorname{Cov}(R_i, R_m)$-mel változik, így a volatilitás változása"),
    eq("d\\sigma = \\varepsilon\\,\\frac{\\operatorname{Cov}(R_i, R_m)}{\\sigma_m}."),
    p("Mivel M az érintési portfólió, egyetlen ilyen kis lépés sem javíthat a kockázat–hozam viszonyon: a többlethozam és a többletvolatilitás aránya minden eszközre meg kell egyeznie a CML meredekségével:"),
    eq("\\frac{\\mathbb{E}[R_i] - r_f}{\\operatorname{Cov}(R_i, R_m)/\\sigma_m} = \\frac{\\mathbb{E}[R_m] - r_f}{\\sigma_m}."),
    p("Ellenkező esetben a portfóliót az $i$-edik eszköz felé (vagy attól el) billentve M-nél nagyobb Sharpe-rátát lehetne elérni. $\\mathbb{E}[R_i]$-re rendezve kapjuk az **értékpapír-piaci egyenest** (security market line, SML):"),
    eq("\\mathbb{E}[R_i] = r_f + \\beta_i\\,\\big(\\mathbb{E}[R_m] - r_f\\big)."),
    note("CAPM: bármely eszköz várható többlethozama a bétájának és az $\\mathbb{E}[R_m] - r_f$ **piaci kockázati prémiumnak** a szorzata."),

    h("Szisztematikus és egyedi kockázat"),
    p("Bontsuk az $i$-edik eszköz többlethozamát a piac által magyarázott részre és egy maradékra:"),
    eq("R_i - r_f = \\alpha_i + \\beta_i\\,(R_m - r_f) + \\varepsilon_i, \\qquad \\operatorname{Cov}(\\varepsilon_i, R_m) = 0."),
    p("Varianciát véve"),
    eq("\\sigma_i^2 = \\beta_i^2\\sigma_m^2 + \\sigma_{\\varepsilon}^2."),
    p("Az első tag a **szisztematikus**, a második az **egyedi** (vállalatspecifikus) kockázat. A „Diverzifikáció és korreláció” című lecke megmutatta, hogy nagy portfólióban a vállalatspecifikus varianciák eltűnnek, a közös mozgások viszont megmaradnak. A piacot tartó befektető ezért csak szisztematikus kockázatot visel, és az SML szerint csak ez a rész jár prémiummal. Az egyedi kockázatot a piac nem árazza, mert költség nélkül eltüntethető."),
    p("Példa: egy $\\sigma_i = 35\\%$-os eszköz, amely $0{,}6$-os korrelációban áll egy $\\sigma_m = 20\\%$-os piaccal, bétája $\\beta = 0{,}6 \\times 0{,}35 / 0{,}20 = 1{,}05$. Szisztematikus varianciája $1{,}05^2 \\times 0{,}04 = 0{,}0441$ a $0{,}1225$-ös teljesből: mindössze 36% (vagyis $\\rho^2$). A maradék 64%, 28%-os reziduális volatilitás, egyedi kockázat, és nem jár érte prémium."),

    h("Számpélda"),
    p("Legyen $r_f = 3\\%$, $\\mathbb{E}[R_m] = 8\\%$ és $\\beta = 1{,}3$. A piaci kockázati prémium $8\\% - 3\\% = 5\\%$. Az eszköz elvárt hozama"),
    eq("\\mathbb{E}[R_i] = 3\\% + 1{,}3 \\times 5\\% = 9{,}5\\%,"),
    p("a kockázati prémiuma tehát $6{,}5\\%$. Egy $\\beta = 0{,}5$-ös eszköztől csak $5{,}5\\%$ volna elvárható, akármilyen volatilis is önmagában."),
    {
      kind: "check",
      id: "capm/required-return",
      prompt: "Egy eszköz bétája $\\beta = 1{,}3$. A kockázatmentes kamatláb 2%, a piac várható hozama 8%. Mekkora hozamot követel meg a CAPM, százalékban?",
      answer: { type: "number", value: 9.8, tolerance: 0.01, unit: "%" },
      explain: "$\\mathbb{E}[R_i] = 2\\% + 1{,}3 \\times (8\\% - 2\\%) = 2\\% + 7{,}8\\% = 9{,}8\\%$.",
    },
    p("Az ábra a várható hozamot mutatja a béta függvényében 0 és 2 között. Az SML $\\beta = 0$-nál $r_f$-ből indul, és $\\beta = 1$-nél átmegy a piacon; egy második jelölő mutatja az eszközt. Növeld az $\\mathbb{E}[R_m]$-et, és figyeld meg, hogy az egyenes a rögzített $(0, r_f)$ pont körül meredekebbé válik. Mozgasd a $\\beta$-t, és figyeld meg, hogy az eszköz az egyenes mentén csúszik. A kijelzők a piaci kockázati prémiumot, az eszköz elvárt hozamát és kockázati prémiumát mutatják."),
    figure("security-market-line"),
    p("Az SML és a CML két különböző egyenes. A CML vízszintes tengelyén a volatilitás áll, és csak hatékony portfóliókra érvényes. Az SML vízszintes tengelyén a béta áll, és minden eszközre és portfólióra érvényes."),

    h("Alfa"),
    p("Egy eszköz **alfája** a ténylegesen előre jelzett várható hozam és az SML által megkövetelt hozam különbsége:"),
    eq("\\alpha_i = \\mathbb{E}[R_i] - \\big(r_f + \\beta_i(\\mathbb{E}[R_m] - r_f)\\big)."),
    p("Ha egy elemző 11%-ot vár a fenti eszköztől, az alfája $11\\% - 9{,}5\\% = 1{,}5\\%$: az SML felett helyezkedik el, és a kockázatához képest olcsónak tűnik. A CAPM világában ez a különbség nem maradhat fenn. A befektetők megvennék az eszközt, az ára emelkedne, a várható hozama pedig csökkenne, amíg $\\alpha = 0$ nem lesz. Egy mért alfa tehát vagy félreárazás, vagy a CAPM-ből kimaradó kockázatért járó jutalom, vagy becslési zaj."),
    {
      kind: "check",
      id: "capm/positive-alpha",
      prompt: "Egy elemző előrejelzése szerint egy eszköz az értékpapír-piaci egyenes felett van, tehát pozitív az alfája. Mit mond ez a CAPM szerint az eszközről?",
      answer: { type: "choice", options: ["A kockázatához képest túlárazott", "A kockázatához képest alulárazott", "Túl magas a bétája", "Nincs szisztematikus kockázata"], correct: 1 },
      explain: "A pozitív alfa azt jelenti, hogy az előre jelzett hozam több, mint amit az SML a bétájához megkövetel, vagyis az eszköz olcsónak tűnik. A vásárlások addig emelnék az árát, amíg $\\alpha = 0$ nem lesz.",
    },

    h("A béta becslése"),
    p("A gyakorlatban a bétát legkisebb négyzetes regresszióval becsülik: az eszköz többlethozamait egy széles index többlethozamaira regresszálják, jellemzően 60 havi vagy 2 évnyi heti megfigyelésből. A regressziós meredekség a mintabeli kovariancia osztva az index mintabeli varianciájával. Példa: ha a havi hozamok mintabeli kovarianciája $0{,}0018$, az index havi varianciája $0{,}0016$, akkor $\\hat\\beta = 0{,}0018/0{,}0016 = 1{,}125$. A tengelymetszet az alfát becsli."),
    {
      kind: "worked",
      title: "A mintabeli kovarianciától az elvárt hozamig",
      steps: [
        { text: "A regressziós meredekség az indexszel vett mintabeli kovariancia osztva az index varianciájával.", tex: "\\hat\\beta = \\frac{0{,}0018}{0{,}0016}", result: { value: 1.125, tolerance: 0.001 } },
        { text: "$r_f = 3\\%$ és $\\mathbb{E}[R_m] = 8\\%$ mellett a piaci kockázati prémium 5%, az SML pedig megadja az elvárt hozamot.", tex: "\\mathbb{E}[R_i] = 3\\% + 1{,}125 \\times 5\\%", result: { value: 8.625, tolerance: 0.01, unit: "%" } },
      ],
    },
    p("Ezek a becslések zajosak, változnak a vállalat tevékenységével és tőkeáttételével, és függenek az indextől és a hozamok gyakoriságától. Emiatt a gyakorlatban a nyers becsléseket gyakran 1 felé húzzák."),

    h("Korlátok"),
    list(
      "A valódi piaci portfólió minden kockázatos eszközt tartalmaz, az ingatlanokat és a humán tőkét is. Nem figyelhető meg, ezért minden teszt valamilyen helyettesítő indexet használ.",
      "Empirikusan az SML laposabb a vártnál: az alacsony bétájú részvények többet, a magas bétájúak kevesebbet hoznak, mint amit a modell mond.",
      "Más jellemzők, például a vállalatméret és a könyv szerinti és piaci érték aránya, olyan átlagos hozamokat magyaráznak, amelyeket a béta nem. A többfaktoros modellek ezeket további kockázati tényezőként veszik fel.",
      "A modell egyetlen időszakot ír le, és figyelmen kívül hagyja az adókat, a kereskedési költségeket és a hitelfelvételi korlátokat.",
    ),
    p("Ennek ellenére a CAPM az elvárt hozam szokásos első becslése, például a sajáttőke-költségé a vállalati pénzügyekben."),

    h("Összefoglalás"),
    list(
      "Ha minden befektető azonos bemenetekkel végez várható hozam–variancia elemzést, az érintési portfólió a piaci portfólió.",
      "A $\\beta_i = \\operatorname{Cov}(R_i, R_m)/\\operatorname{Var}(R_m)$ béta az eszköz piaci mozgásokkal szembeni kitettségét méri.",
      "Csak a $\\beta_i^2\\sigma_m^2$ szisztematikus kockázatot árazza a piac; az egyedi kockázat kidiverzifikálható, és nem jár érte prémium.",
      "Értékpapír-piaci egyenes: $\\mathbb{E}[R_i] = r_f + \\beta_i(\\mathbb{E}[R_m] - r_f)$; az alfa az ettől való eltérés.",
      "A bétát az index többlethozamaira futtatott regresszióval becsüljük; a modell hasznos viszonyítási alap, ismert empirikus gyengeségekkel.",
    ),
    lab("/capm", "Becsülj bétát, és vesd össze az eszközöket az értékpapír-piaci egyenessel a CAPM laborban"),
  ],
};
