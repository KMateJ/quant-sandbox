import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const efficientFrontier: GuideLessonContent = {
  en: [
    p("The lesson \"Diversification and correlation\" showed how the expected return and volatility of a portfolio follow from the weights, volatilities and correlations of its assets. This lesson asks which of those portfolios are worth holding. It first sorts the risky portfolios into good and bad ones, then adds a risk-free asset, which turns the choice into a single line: the capital market line."),

    h("Mean–variance preferences"),
    p("Throughout the lesson we assume that investors judge a portfolio only by its expected return $\\mu$ and its volatility $\\sigma$ over one period. They prefer a higher $\\mu$ when $\\sigma$ is the same, and a lower $\\sigma$ when $\\mu$ is the same. A portfolio **dominates** another if it is at least as good in both respects and strictly better in one. Investors may differ in how much extra return they demand for extra risk, but no one holds a dominated portfolio."),

    h("Short sales"),
    p("A **short sale** means borrowing an asset, selling it, and buying it back later to return it. It gives a negative weight. With $w_A = -0.5$ and $w_B = 1.5$ the investor sells A worth half of the own capital and invests one and a half times the capital in B. The formulas of the previous lesson still apply, since they never required the weights to be positive:"),
    eq("\\mu_p = -0.5 \\times 6\\% + 1.5 \\times 12\\% = 15\\%, \\qquad \\sigma_p^2 = 0.25 \\times 0.0225 + 2.25 \\times 0.09 - 2 \\times 0.75 \\times 0.009 = 0.194625."),
    p("This is for the assets of the previous lesson ($\\mu_A = 6\\%$, $\\sigma_A = 15\\%$, $\\mu_B = 12\\%$, $\\sigma_B = 30\\%$, $\\rho = 0.2$, so $\\sigma_{AB} = 0.009$), and gives $\\sigma_p \\approx 44.1\\%$. Short selling extends the curve of attainable portfolios beyond the two assets in both directions."),

    h("The attainable set and the efficient frontier"),
    p("Letting the weight $w = w_B$ run over all real numbers traces a curve in the $(\\sigma, \\mu)$ plane: the **set of attainable portfolios** for two assets. With more assets it becomes a region whose left edge has the same shape. The leftmost point is the **minimum-variance portfolio** from the previous lesson, here $w_B^{*} \\approx 0.143$ with $\\sigma \\approx 14.34\\%$ and $\\mu \\approx 6.86\\%$."),
    p("The minimum-variance portfolio splits the curve into two branches. Every point on the lower branch is dominated by the point on the upper branch with the same volatility. Example: at $\\sigma = 20\\%$ the lower branch has $w_B \\approx -0.31$ and $\\mu \\approx 4.14\\%$, while the upper branch has $w_B \\approx 0.60$ and $\\mu \\approx 9.58\\%$. Nobody would choose the first."),
    note("The **efficient frontier** is the upper branch of the attainable set, from the minimum-variance portfolio upwards. Every portfolio on it gives the highest expected return available for its volatility."),

    h("Adding a risk-free asset"),
    p("Now add a **risk-free asset** with return $r_f$, for example a short government bill held to maturity. Its volatility is zero and its covariance with every risky asset is zero. Put a fraction $y$ of the money in a risky portfolio P and $1 - y$ in the risk-free asset. By the formulas of the previous lesson"),
    eq("\\mu = (1-y)\\,r_f + y\\,\\mu_P = r_f + y\\,(\\mu_P - r_f), \\qquad \\sigma = y\\,\\sigma_P \\quad (y \\ge 0)."),
    p("The variance has no cross term because the covariance is zero. Eliminating $y = \\sigma/\\sigma_P$ gives a straight line from the point $(0, r_f)$ through P:"),
    eq("\\mu = r_f + \\frac{\\mu_P - r_f}{\\sigma_P}\\,\\sigma."),
    p("Points between $(0, r_f)$ and P mean lending at $r_f$ ($0 \\le y \\le 1$). Points beyond P mean borrowing at $r_f$ to invest more than one's own capital in P ($y > 1$); here we assume one can borrow at the same rate."),

    h("The Sharpe ratio and the tangency portfolio"),
    p("The slope of that line is the **Sharpe ratio** of P,"),
    eq("\\text{SR}_P = \\frac{\\mu_P - r_f}{\\sigma_P},"),
    p("the excess return over $r_f$ per unit of volatility. A steeper line gives more expected return at every level of volatility, so the investor wants the risky portfolio with the largest Sharpe ratio. Rotating the line upward around $(0, r_f)$, the last attainable portfolio it touches is where it is tangent to the efficient frontier. This is the **tangency portfolio** T."),
    p("Write $e_i = \\mu_i - r_f$ for the excess returns. Maximising $\\text{SR}$ over the weights (setting the derivative with respect to $w_B$ to zero) gives weights proportional to"),
    eq("w_A \\propto \\sigma_B^2\\, e_A - \\sigma_{AB}\\, e_B, \\qquad w_B \\propto \\sigma_A^2\\, e_B - \\sigma_{AB}\\, e_A,"),
    p("scaled so that they add up to one. With $N$ assets the same result reads $w \\propto \\Sigma^{-1}(\\mu - r_f\\mathbf{1})$, where $\\Sigma$ is the covariance matrix."),

    h("Worked example"),
    p("Take the assets above with $r_f = 2\\%$, so $e_A = 0.04$ and $e_B = 0.10$:"),
    eq("w_A \\propto 0.09 \\times 0.04 - 0.009 \\times 0.10 = 0.0027, \\qquad w_B \\propto 0.0225 \\times 0.10 - 0.009 \\times 0.04 = 0.00189."),
    p("Normalising, $w_B = 0.00189 / 0.00459 \\approx 0.412$ and $w_A \\approx 0.588$. The tangency portfolio has"),
    eq("\\mu_T \\approx 0.588 \\times 6\\% + 0.412 \\times 12\\% \\approx 8.47\\%, \\qquad \\sigma_T = \\sqrt{0.027405} \\approx 16.55\\%,"),
    p("and a Sharpe ratio of $(8.47\\% - 2\\%)/16.55\\% \\approx 0.391$. This beats both assets on their own: A has $0.04/0.15 \\approx 0.267$ and B has $0.10/0.30 \\approx 0.333$."),
    p("The figure shows the two-asset curve for weights in B from $-0.5$ to $1.5$, so short positions are included, together with the line from $(0, r_f)$ through the tangency portfolio. Markers show A, B, the minimum-variance portfolio and the tangency portfolio. Raise $r_f$ and note that the tangency point slides up the frontier towards B. Lower $\\rho$ and note that the curve moves left and the Sharpe ratio in the readouts rises."),
    figure("capital-market-line"),

    h("The capital market line"),
    p("The line through the tangency portfolio is the **capital market line** (CML):"),
    eq("\\mu = r_f + \\frac{\\mu_T - r_f}{\\sigma_T}\\,\\sigma."),
    p("Apart from the single point T, it lies above the efficient frontier. Once a risk-free asset is available, every risky-only portfolio other than T is dominated by some point on the CML. At $\\sigma = 20\\%$, for example, the CML gives $2\\% + 0.391 \\times 20\\% \\approx 9.82\\%$, more than the $9.58\\%$ of the frontier portfolio with the same volatility."),

    h("Two-fund separation"),
    p("Every efficient choice is therefore a mix of two funds: the risk-free asset and the tangency portfolio. Investors differ only in the proportion $y$, not in the composition of their risky holdings. This result is called **two-fund separation**. Think of a kitchen that serves one soup in different portion sizes, topped up with water to taste: the recipe is the same for everyone."),
    p("At the numbers above, a cautious investor who accepts $\\sigma = 10\\%$ holds $y = 10/16.55 \\approx 0.604$ in T and $0.396$ in the risk-free asset, for $\\mu \\approx 5.91\\%$. Without the risk-free asset this volatility would not be reachable at all, since the minimum is 14.34%. A bolder investor who accepts $\\sigma = 20\\%$ holds $y \\approx 1.208$, borrowing about 20.8% of the capital at $r_f$, for $\\mu \\approx 9.82\\%$. Both hold A and B in the same ratio of 58.8 to 41.2."),

    h("Summary"),
    list(
      "With short sales allowed, the attainable portfolios form a curve whose upper branch, from the minimum-variance portfolio up, is the efficient frontier.",
      "Mixing a risky portfolio P with a risk-free asset gives a line from $(0, r_f)$ through P with slope equal to the Sharpe ratio $(\\mu_P - r_f)/\\sigma_P$.",
      "The tangency portfolio maximises the Sharpe ratio; in the example $w_B \\approx 0.412$, $\\mu_T \\approx 8.47\\%$, $\\sigma_T \\approx 16.55\\%$, $\\text{SR} \\approx 0.391$.",
      "The capital market line $\\mu = r_f + \\text{SR}_T\\,\\sigma$ dominates every other risky portfolio.",
      "Two-fund separation: every investor holds the risk-free asset and the tangency portfolio, only in different proportions.",
    ),
    note("The next lesson, \"CAPM, beta and the security market line\", assumes all investors reason this way and derives what it implies for the expected return of each single asset."),
    lab("/efficient-frontier", "Build efficient frontiers from many assets in the Efficient Frontier lab"),
  ],

  hu: [
    p("A „Diverzifikáció és korreláció” című lecke megmutatta, hogyan következik egy portfólió várható hozama és volatilitása az eszközök súlyaiból, volatilitásaiból és korrelációiból. Ez a lecke azt vizsgálja, melyik portfóliókat érdemes tartani. Először jó és rossz portfóliókra osztja a kockázatos portfóliókat, majd bevezet egy kockázatmentes eszközt, amellyel a választás egyetlen egyenesre szűkül: ez a tőkepiaci egyenes."),

    h("Várható hozam–variancia preferenciák"),
    p("A lecke végig feltételezi, hogy a befektetők egy portfóliót kizárólag egy időszakra vett $\\mu$ várható hozama és $\\sigma$ volatilitása alapján ítélnek meg. Azonos $\\sigma$ mellett a nagyobb $\\mu$-t, azonos $\\mu$ mellett a kisebb $\\sigma$-t választják. Egy portfólió **dominál** egy másikat, ha mindkét szempontból legalább olyan jó, és legalább az egyikben szigorúan jobb. A befektetők abban különbözhetnek, mekkora többlethozamot várnak el a többletkockázatért, de dominált portfóliót senki sem tart."),

    h("Short eladás"),
    p("**Short eladás** (shortolás) esetén a befektető kölcsönvesz egy eszközt, eladja, majd később visszavásárolja, hogy visszaadja. Ez negatív súlyt jelent. $w_A = -0{,}5$ és $w_B = 1{,}5$ mellett a befektető a saját tőkéje felének megfelelő A-t ad el, és a tőkéje másfélszeresét fekteti B-be. Az előző lecke képletei továbbra is érvényesek, hiszen sehol sem kötötték ki, hogy a súlyok pozitívak:"),
    eq("\\mu_p = -0{,}5 \\times 6\\% + 1{,}5 \\times 12\\% = 15\\%, \\qquad \\sigma_p^2 = 0{,}25 \\times 0{,}0225 + 2{,}25 \\times 0{,}09 - 2 \\times 0{,}75 \\times 0{,}009 = 0{,}194625."),
    p("Ez az előző lecke eszközeire vonatkozik ($\\mu_A = 6\\%$, $\\sigma_A = 15\\%$, $\\mu_B = 12\\%$, $\\sigma_B = 30\\%$, $\\rho = 0{,}2$, tehát $\\sigma_{AB} = 0{,}009$), és $\\sigma_p \\approx 44{,}1\\%$-ot ad. A short eladás mindkét irányban meghosszabbítja az elérhető portfóliók görbéjét a két eszközön túl."),

    h("Az elérhető portfóliók és a hatékony front"),
    p("Ha a $w = w_B$ súlyt minden valós számon végigfuttatjuk, a $(\\sigma, \\mu)$ síkon egy görbét kapunk: két eszköz esetén ez az **elérhető portfóliók halmaza**. Több eszköznél tartomány lesz belőle, amelynek bal széle ugyanilyen alakú. A legbaloldalibb pont az előző leckéből ismert **minimális varianciájú portfólió**, itt $w_B^{*} \\approx 0{,}143$, $\\sigma \\approx 14{,}34\\%$ és $\\mu \\approx 6{,}86\\%$."),
    p("A minimális varianciájú portfólió két ágra bontja a görbét. Az alsó ág minden pontját dominálja a felső ág azonos volatilitású pontja. Példa: $\\sigma = 20\\%$-nál az alsó ágon $w_B \\approx -0{,}31$ és $\\mu \\approx 4{,}14\\%$, a felső ágon $w_B \\approx 0{,}60$ és $\\mu \\approx 9{,}58\\%$. Az elsőt senki sem választaná."),
    note("A **hatékony front** az elérhető halmaz felső ága a minimális varianciájú portfóliótól felfelé. Minden pontja az adott volatilitás mellett elérhető legnagyobb várható hozamot adja."),

    h("Kockázatmentes eszköz hozzáadása"),
    p("Vegyünk most hozzá egy $r_f$ hozamú **kockázatmentes eszközt**, például egy lejáratig tartott rövid állampapírt. Volatilitása nulla, és minden kockázatos eszközzel vett kovarianciája is nulla. Fektessük a pénz $y$ hányadát egy P kockázatos portfólióba, $1 - y$ hányadát a kockázatmentes eszközbe. Az előző lecke képletei szerint"),
    eq("\\mu = (1-y)\\,r_f + y\\,\\mu_P = r_f + y\\,(\\mu_P - r_f), \\qquad \\sigma = y\\,\\sigma_P \\quad (y \\ge 0)."),
    p("A varianciában nincs vegyes tag, mert a kovariancia nulla. Az $y = \\sigma/\\sigma_P$ kiküszöbölésével a $(0, r_f)$ pontból P-n át húzott egyenest kapjuk:"),
    eq("\\mu = r_f + \\frac{\\mu_P - r_f}{\\sigma_P}\\,\\sigma."),
    p("A $(0, r_f)$ és P közötti pontok $r_f$ kamatú betételhelyezést jelentenek ($0 \\le y \\le 1$). A P-n túli pontok azt, hogy a befektető $r_f$ kamatra hitelt vesz fel, és a saját tőkéjénél többet fektet P-be ($y > 1$); itt feltesszük, hogy ugyanazon a kamaton lehet hitelt felvenni."),

    h("A Sharpe-ráta és az érintési portfólió"),
    p("Az egyenes meredeksége P **Sharpe-rátája**:"),
    eq("\\text{SR}_P = \\frac{\\mu_P - r_f}{\\sigma_P},"),
    p("vagyis az $r_f$ feletti többlethozam egységnyi volatilitásra vetítve. Meredekebb egyenes minden volatilitásszinten nagyobb várható hozamot ad, ezért a befektető a legnagyobb Sharpe-rátájú kockázatos portfóliót keresi. Ha az egyenest a $(0, r_f)$ pont körül felfelé forgatjuk, az utolsó elérhető portfólió, amelyet még érint, ott van, ahol érinti a hatékony frontot. Ez a T **érintési portfólió**."),
    p("Jelölje $e_i = \\mu_i - r_f$ a többlethozamokat. A Sharpe-rátát a súlyok szerint maximalizálva (a $w_B$ szerinti deriváltat nullával egyenlővé téve) a súlyok arányosak lesznek ezekkel:"),
    eq("w_A \\propto \\sigma_B^2\\, e_A - \\sigma_{AB}\\, e_B, \\qquad w_B \\propto \\sigma_A^2\\, e_B - \\sigma_{AB}\\, e_A,"),
    p("úgy skálázva, hogy összegük egy legyen. $N$ eszközre ugyanez $w \\propto \\Sigma^{-1}(\\mu - r_f\\mathbf{1})$ alakú, ahol $\\Sigma$ a kovarianciamátrix."),

    h("Számpélda"),
    p("Vegyük a fenti eszközöket $r_f = 2\\%$ mellett, így $e_A = 0{,}04$ és $e_B = 0{,}10$:"),
    eq("w_A \\propto 0{,}09 \\times 0{,}04 - 0{,}009 \\times 0{,}10 = 0{,}0027, \\qquad w_B \\propto 0{,}0225 \\times 0{,}10 - 0{,}009 \\times 0{,}04 = 0{,}00189."),
    p("Normálva $w_B = 0{,}00189 / 0{,}00459 \\approx 0{,}412$ és $w_A \\approx 0{,}588$. Az érintési portfólióra"),
    eq("\\mu_T \\approx 0{,}588 \\times 6\\% + 0{,}412 \\times 12\\% \\approx 8{,}47\\%, \\qquad \\sigma_T = \\sqrt{0{,}027405} \\approx 16{,}55\\%,"),
    p("a Sharpe-ráta pedig $(8{,}47\\% - 2\\%)/16{,}55\\% \\approx 0{,}391$. Ez mindkét eszközt külön-külön felülmúlja: A-é $0{,}04/0{,}15 \\approx 0{,}267$, B-é $0{,}10/0{,}30 \\approx 0{,}333$."),
    p("Az ábra a kéteszközös görbét mutatja $-0{,}5$ és $1{,}5$ közötti B-súlyokra, vagyis a short pozíciókat is beleértve, és a $(0, r_f)$ pontból az érintési portfólión át húzott egyenest. Jelölők mutatják A-t, B-t, a minimális varianciájú és az érintési portfóliót. Növeld az $r_f$-et, és figyeld meg, hogy az érintési pont felfelé csúszik a fronton B felé. Csökkentsd a $\\rho$-t, és figyeld meg, hogy a görbe balra tolódik, a kijelzett Sharpe-ráta pedig nő."),
    figure("capital-market-line"),

    h("A tőkepiaci egyenes"),
    p("Az érintési portfólión átmenő egyenes a **tőkepiaci egyenes** (capital market line, CML):"),
    eq("\\mu = r_f + \\frac{\\mu_T - r_f}{\\sigma_T}\\,\\sigma."),
    p("A T pontot kivéve a hatékony front felett halad. Ha van kockázatmentes eszköz, a T-n kívül minden csak kockázatos eszközökből álló portfóliót dominál a CML valamelyik pontja. $\\sigma = 20\\%$-nál például a CML $2\\% + 0{,}391 \\times 20\\% \\approx 9{,}82\\%$-ot ad, többet, mint az azonos volatilitású frontportfólió $9{,}58\\%$-a."),

    h("Kétalapos szétválasztás"),
    p("Minden hatékony választás tehát két alap keveréke: a kockázatmentes eszközé és az érintési portfólióé. A befektetők csak az $y$ arányban különböznek, a kockázatos részük összetételében nem. Ez a **kétalapos szétválasztás** (two-fund separation) tétele. Gondolj egy konyhára, amely egyféle levest szolgál fel különböző adagokban, ízlés szerint vízzel hígítva: a recept mindenkinek ugyanaz."),
    p("A fenti számokkal egy óvatos befektető, aki $\\sigma = 10\\%$-ot vállal, $y = 10/16{,}55 \\approx 0{,}604$ részt tart T-ben és $0{,}396$ részt a kockázatmentes eszközben, $\\mu \\approx 5{,}91\\%$ várható hozammal. Kockázatmentes eszköz nélkül ez a volatilitás el sem érhető, hiszen a minimum 14,34%. Egy bátrabb befektető, aki $\\sigma = 20\\%$-ot vállal, $y \\approx 1{,}208$-at tart, vagyis tőkéje kb. 20,8%-át $r_f$ kamatra hitelből fedezi, és $\\mu \\approx 9{,}82\\%$-ot vár. Mindketten 58,8 : 41,2 arányban tartják A-t és B-t."),

    h("Összefoglalás"),
    list(
      "Short eladást megengedve az elérhető portfóliók görbét alkotnak, amelynek a minimális varianciájú portfóliótól felfelé tartó ága a hatékony front.",
      "Egy P kockázatos portfóliót kockázatmentes eszközzel keverve a $(0, r_f)$ pontból P-n át húzott egyenest kapjuk, amelynek meredeksége a $(\\mu_P - r_f)/\\sigma_P$ Sharpe-ráta.",
      "Az érintési portfólió maximalizálja a Sharpe-rátát; a példában $w_B \\approx 0{,}412$, $\\mu_T \\approx 8{,}47\\%$, $\\sigma_T \\approx 16{,}55\\%$, $\\text{SR} \\approx 0{,}391$.",
      "A $\\mu = r_f + \\text{SR}_T\\,\\sigma$ tőkepiaci egyenes minden más kockázatos portfóliót dominál.",
      "Kétalapos szétválasztás: minden befektető a kockázatmentes eszközt és az érintési portfóliót tartja, csak eltérő arányban.",
    ),
    note("A következő lecke („CAPM, béta és az értékpapír-piaci egyenes”) feltételezi, hogy minden befektető így gondolkodik, és levezeti, mit jelent ez az egyes eszközök várható hozamára."),
    lab("/efficient-frontier", "Építs hatékony frontot sok eszközből a Hatékony front laborban"),
  ],
};
