import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const stochasticVolatility: GuideLessonContent = {
  en: [
    p("\"Implied volatility and the volatility smile\" described a market fact that \"The Black–Scholes formula\" cannot explain: when each quoted option price is inverted for its own $\\sigma$, the implied volatilities form a smile or skew across strikes instead of a flat line. A model that produces this shape has to let volatility change. This lesson builds the Heston model, in which the variance itself moves randomly, and shows how two of its parameters shape the smile."),

    h("Constant volatility and its failure"),
    p("In geometric Brownian motion the size of the random shocks never changes. Observed returns behave differently. Calm periods and turbulent periods alternate, so volatility clusters in time. Large falls in the price tend to come with rising volatility. And the distribution of returns has fatter tails than the normal distribution, especially on the downside."),
    p("A constant $\\sigma$ cannot produce any of this. The natural fix is to make the variance a random process of its own, driven by a second source of randomness."),

    h("The Heston model"),
    p("Write $v_t$ for the instantaneous variance of the stock's returns, so the instantaneous volatility is $\\sqrt{v_t}$. Under the risk-neutral measure $\\mathbb{Q}$, with no dividends, the **Heston model** is"),
    eq("dS_t = rS_t\\,dt + \\sqrt{v_t}\\,S_t\\,dW^{(1)}_t,"),
    eq("dv_t = \\kappa(\\theta - v_t)\\,dt + \\xi\\sqrt{v_t}\\,dW^{(2)}_t,"),
    p("where $W^{(1)}$ and $W^{(2)}$ are Brownian motions with correlation $\\rho$, that is $dW^{(1)}_t\\,dW^{(2)}_t = \\rho\\,dt$. The first equation is geometric Brownian motion from \"Geometric Brownian motion\", with $\\sigma$ replaced by the moving quantity $\\sqrt{v_t}$. The second equation describes how the variance moves."),

    h("The parameters"),
    list(
      "$v_0$: the variance today. $\\sqrt{v_0}$ is the current volatility.",
      "$\\theta$: the long-run variance. Over long horizons $v_t$ is pulled towards $\\theta$, so $\\sqrt{\\theta}$ is the long-run volatility.",
      "$\\kappa$: the speed of mean reversion. The drift $\\kappa(\\theta - v_t)$ is positive when the variance is below $\\theta$ and negative when it is above, and it is stronger the larger $\\kappa$ is.",
      "$\\xi$: the volatility of variance (vol-of-vol). It sets how strongly the variance itself fluctuates.",
      "$\\rho$: the correlation between the shocks to the price and the shocks to the variance.",
    ),
    p("Without the random term the variance would relax exponentially towards $\\theta$. The random term does not change the average path, so the expected variance at time $t$ is"),
    eq("\\mathbb{E}^{\\mathbb{Q}}[v_t] = \\theta + (v_0 - \\theta)\\,e^{-\\kappa t}."),
    p("The gap to $\\theta$ halves every $\\ln 2/\\kappa$ years. This is the **half-life** of a variance shock."),
    p("The factor $\\sqrt{v_t}$ in front of $dW^{(2)}$ makes the shocks shrink as the variance approaches zero. If mean reversion is strong enough compared with the vol-of-vol, the variance never reaches zero. This is the **Feller condition**:"),
    eq("2\\kappa\\theta \\ge \\xi^2."),
    p("When it fails the variance can touch zero and bounce back. The model still works, but simulations need care near zero."),

    {
      kind: "check",
      id: "stochastic-volatility/half-life",
      prompt: "In the Heston model the variance mean-reverts with speed $\\kappa = 4$. What is the half-life of a variance shock, in years?",
      answer: { type: "number", value: 0.1733, tolerance: 0.002, unit: "years" },
      explain: "The gap to $\\theta$ shrinks like $e^{-\\kappa t}$, so it halves after $\\ln 2/\\kappa = 0.693/4 \\approx 0.173$ years, about two months.",
    },
    h("A worked example"),
    p("Take $v_0 = 0.09$, $\\theta = 0.04$ and $\\kappa = 2$. Today's volatility is $\\sqrt{0.09} = 30\\%$ and the long-run volatility is $\\sqrt{0.04} = 20\\%$. The half-life is $\\ln 2/2 \\approx 0.35$ years, a little over four months."),
    p("After half a year the expected variance is $0.04 + 0.05\\,e^{-1} \\approx 0.0584$, a volatility of about $24.2\\%$. After one year it is $0.04 + 0.05\\,e^{-2} \\approx 0.0468$, about $21.6\\%$."),
    p("For the Feller condition, $2\\kappa\\theta = 0.16$. With $\\xi = 0.3$ we have $\\xi^2 = 0.09 \\le 0.16$, so the condition holds. With $\\xi = 0.5$ we have $\\xi^2 = 0.25 > 0.16$, so it fails, and the variance can reach zero."),

    {
      kind: "worked",
      title: "Expected variance and the Feller check",
      steps: [
        { text: "Take $v_0 = 0.0625$ (25% volatility), $\\theta = 0.04$, $\\kappa = 1.5$. Half-life of a variance shock, in years.", tex: "\\ln 2 / \\kappa", result: { value: 0.4621, tolerance: 0.0005 } },
        { text: "Expected variance after one year.", tex: "\\theta + (v_0 - \\theta)\\,e^{-\\kappa \\cdot 1}", result: { value: 0.04502, tolerance: 0.00002 } },
        { text: "The corresponding volatility, in percent.", tex: "\\sqrt{\\mathbb{E}^{\\mathbb{Q}}[v_1]}", result: { value: 21.22, tolerance: 0.01, unit: "%" } },
        { text: "Feller margin with $\\xi = 0.35$; it is negative, so the condition just fails.", tex: "2\\kappa\\theta - \\xi^2", result: { value: -0.0025, tolerance: 0.00005 } },
      ],
    },

    h("Correlation and the skew"),
    p("For equities $\\rho$ is typically negative, often between $-0.5$ and $-0.9$. A negative $\\rho$ means that a fall in the price tends to come with a rise in variance. This is the **leverage effect**: as the share price drops, the firm's debt is larger relative to its equity, and the equity becomes riskier."),
    p("Consider what this does to the distribution of $S_T$. Paths that fall gain variance and spread out further downwards. Paths that rise lose variance and stay closer together. The left tail becomes longer than the right. Out-of-the-money puts, which pay off in that left tail, become more valuable than under Black–Scholes, so their implied volatility is higher. Implied volatility then falls as the strike rises: the **skew**."),

    {
      kind: "check",
      id: "stochastic-volatility/skew-side",
      prompt: "With $\\rho = -0.7$, which options have a higher implied volatility than the at-the-money ones?",
      answer: { type: "choice", options: ["Low-strike (out-of-the-money) puts", "High-strike (out-of-the-money) calls", "All strikes equally", "None: $\\rho$ only shifts the level"], correct: 0 },
      explain: "A negative $\\rho$ raises the variance on falling paths and lengthens the left tail, so low strikes become dearer than under Black–Scholes: the equity skew.",
    },
    h("Vol-of-vol and the curvature"),
    p("The parameter $\\xi$ controls how much the variance moves. With $\\xi = 0$ the variance follows its deterministic path and the model is close to Black–Scholes with a time-varying volatility, so the smile is nearly flat. A larger $\\xi$ mixes calm paths with very turbulent ones. The resulting distribution of returns has a sharper peak and fatter tails on both sides than a normal distribution with the same variance. Options far from the money on either side gain value, and the smile curves upwards at both ends."),
    note("In the Heston model, $\\rho$ tilts the implied-volatility curve (negative $\\rho$ gives the equity skew), and $\\xi$ bends it (larger vol-of-vol gives more curvature)."),
    p("The figure plots the Heston implied volatility against the strike for $S_0 = 100$, $r = 0$, $T = 1$, $v_0 = \\theta = 0.04$ and $\\kappa = 2$. Each point is the Black–Scholes implied volatility of the Heston call price at that strike, with the Heston price computed from the characteristic function described below. The flat line at $\\sqrt{\\theta} = 20\\%$ is the Black–Scholes (constant volatility) reference. The readouts give the implied volatility at $K = 80$, $100$ and $120$ and the skew $\\text{IV}(80) - \\text{IV}(120)$."),
    p("At the defaults $\\rho = -0.7$, $\\xi = 0.5$ the implied volatilities are $23.03\\%$, $18.05\\%$ and $14.54\\%$, a skew of $8.49$ percentage points. Move $\\rho$ towards $-0.9$ and the skew grows. At $\\rho = 0$ the same three strikes give $20.26\\%$, $18.76\\%$ and $19.82\\%$: a roughly symmetric smile with its minimum near the money. Increase $\\xi$ and the curve bends more strongly. Note also that the at-the-money implied volatility is below 20%, even though the variance starts at $\\theta$ and reverts to it: vol-of-vol moves value from the centre of the distribution into the tails."),
    figure("vol-smile"),

    p("The smile above is one slice, at $T = 1$, of a whole **implied-volatility surface**: one implied volatility for every strike and every maturity. The next figure draws that surface for strikes from 70 to 130 and maturities from 3 months to 2 years, with the same parameters as above. Drag it to rotate and scroll to zoom. Choose $\\rho$ and $\\xi$ with the buttons. At the defaults ($\\rho = -0.7$, $\\xi = 0.5$) the skew $\\text{IV}(80) - \\text{IV}(120)$ is 11.53 percentage points at 3 months, 8.49 at 1 year and 5.76 at 2 years: the skew flattens as maturity grows. Over a longer horizon the variance has more time to revert to $\\theta$, so the distribution of the log return looks more nearly normal. With $\\rho = 0$ the surface is a nearly symmetric valley, and with $\\rho = +0.3$ the tilt reverses."),
    figure("iv-surface"),

    h("Pricing in the Heston model"),
    p("The price of a European call is still the discounted risk-neutral expectation $C_0 = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}[(S_T - K)^+]$. There is no formula as short as Black–Scholes, but there are two standard routes."),
    p("The first is simulation, as in \"Monte Carlo option pricing\". Split $[0, T]$ into small steps $\\Delta t$. In each step draw two independent standard normals $Z_1, Z_2$, set $\\varepsilon_1 = Z_1$ and $\\varepsilon_2 = \\rho Z_1 + \\sqrt{1-\\rho^2}\\,Z_2$, so that the two shocks have correlation $\\rho$, and update"),
    eq("v_{t+\\Delta t} = v_t + \\kappa(\\theta - v_t)\\,\\Delta t + \\xi\\sqrt{v_t^+}\\,\\sqrt{\\Delta t}\\,\\varepsilon_2,"),
    eq("S_{t+\\Delta t} = S_t\\exp\\Big(\\big(r - \\tfrac{1}{2}v_t^+\\big)\\Delta t + \\sqrt{v_t^+}\\,\\sqrt{\\Delta t}\\,\\varepsilon_1\\Big)."),
    p("Here $v_t^+ = \\max(v_t, 0)$ guards against the small negative values that a discrete step can produce. Averaging the discounted payoff over many paths gives the price, with the standard error from \"Monte Carlo option pricing\"."),
    p("The second route is semi-analytic. Heston showed that the characteristic function of $\\ln S_T$ has a closed form. The call price can then be written as $S_0P_1 - Ke^{-rT}P_2$, the same shape as Black–Scholes, where $P_1$ and $P_2$ are probabilities computed by a one-dimensional numerical integral. This is fast enough to fit the five parameters to a whole surface of market prices."),

    h("Summary"),
    list(
      "The Heston model lets the variance $v_t$ follow its own mean-reverting random process, correlated with the price.",
      "$v_0$ is today's variance, $\\theta$ the long-run level, $\\kappa$ the reversion speed (half-life $\\ln 2/\\kappa$), $\\xi$ the vol-of-vol and $\\rho$ the correlation.",
      "The Feller condition $2\\kappa\\theta \\ge \\xi^2$ keeps the variance away from zero.",
      "Negative $\\rho$ produces the equity skew; larger $\\xi$ produces a more curved smile.",
      "Prices come from simulation or from a numerical integral of the characteristic function.",
    ),
    lab("/heston", "Simulate price and variance paths and price options in the Heston lab"),
  ],

  hu: [
    p("Az „Implikált volatilitás és a volatilitás-mosoly” című lecke egy olyan piaci tényt írt le, amelyet „A Black–Scholes-képlet” nem tud megmagyarázni: ha minden jegyzett opcióárból visszaszámoljuk a saját $\\sigma$-ját, az implikált volatilitások a kötési ár függvényében mosolyt vagy ferdeséget rajzolnak ki, nem vízszintes vonalat. Az ilyen alakot előállító modellben a volatilitásnak változnia kell. Ez a lecke a Heston-modellt építi fel, amelyben maga a variancia is véletlenszerűen mozog, és megmutatja, hogyan alakítja két paramétere a mosolyt."),

    h("A konstans volatilitás és korlátai"),
    p("A geometriai Brown-mozgásban a véletlen sokkok mérete sosem változik. A megfigyelt hozamok másként viselkednek. Nyugodt és viharos időszakok váltják egymást, vagyis a volatilitás időben csomósodik. Az árfolyam nagy esései jellemzően növekvő volatilitással járnak együtt. A hozamok eloszlásának pedig vastagabb a széle, mint a normális eloszlásé, különösen lefelé."),
    p("Konstans $\\sigma$ mellett ezek egyike sem jöhet létre. A kézenfekvő megoldás az, hogy a variancia maga is véletlen folyamat legyen, egy második véletlenforrással hajtva."),

    h("A Heston-modell"),
    p("Jelölje $v_t$ a részvényhozamok pillanatnyi varianciáját, így a pillanatnyi volatilitás $\\sqrt{v_t}$. A $\\mathbb{Q}$ kockázatsemleges mérték alatt, osztalék nélkül a **Heston-modell**"),
    eq("dS_t = rS_t\\,dt + \\sqrt{v_t}\\,S_t\\,dW^{(1)}_t,"),
    eq("dv_t = \\kappa(\\theta - v_t)\\,dt + \\xi\\sqrt{v_t}\\,dW^{(2)}_t,"),
    p("ahol $W^{(1)}$ és $W^{(2)}$ olyan Brown-mozgások, amelyek korrelációja $\\rho$, azaz $dW^{(1)}_t\\,dW^{(2)}_t = \\rho\\,dt$. Az első egyenlet a „Geometriai Brown-mozgás” című lecke modellje, csak $\\sigma$ helyén a mozgó $\\sqrt{v_t}$ áll. A második egyenlet a variancia mozgását írja le."),

    h("A paraméterek"),
    list(
      "$v_0$: a mai variancia. $\\sqrt{v_0}$ a jelenlegi volatilitás.",
      "$\\theta$: a hosszú távú variancia. Hosszú távon $v_t$-t a $\\theta$ felé húzza a modell, így $\\sqrt{\\theta}$ a hosszú távú volatilitás.",
      "$\\kappa$: az átlaghoz való visszatérés sebessége. A $\\kappa(\\theta - v_t)$ drift pozitív, ha a variancia $\\theta$ alatt van, negatív, ha fölötte, és annál erősebb, minél nagyobb $\\kappa$.",
      "$\\xi$: a variancia volatilitása (vol-of-vol). Azt adja meg, mennyire ingadozik maga a variancia.",
      "$\\rho$: az árfolyam és a variancia sokkjai közötti korreláció.",
    ),
    p("A véletlen tag nélkül a variancia exponenciálisan közelítene $\\theta$-hoz. A véletlen tag az átlagos pályán nem változtat, így a variancia várható értéke a $t$ időpontban"),
    eq("\\mathbb{E}^{\\mathbb{Q}}[v_t] = \\theta + (v_0 - \\theta)\\,e^{-\\kappa t}."),
    p("A $\\theta$-tól való eltérés $\\ln 2/\\kappa$ évenként feleződik. Ez egy varianciasokk **felezési ideje**."),
    p("A $dW^{(2)}$ előtti $\\sqrt{v_t}$ tényező miatt a sokkok kisebbek lesznek, ahogy a variancia nullához közelít. Ha az átlaghoz húzó erő elég nagy a vol-of-volhoz képest, a variancia sosem éri el a nullát. Ez a **Feller-feltétel**:"),
    eq("2\\kappa\\theta \\ge \\xi^2."),
    p("Ha nem teljesül, a variancia elérheti a nullát, majd visszapattan. A modell ekkor is használható, de a szimulációban gondosan kell kezelni a nulla környékét."),

    {
      kind: "check",
      id: "stochastic-volatility/half-life",
      prompt: "A Heston-modellben a variancia $\\kappa = 4$ sebességgel tér vissza az átlaghoz. Hány év egy varianciasokk felezési ideje?",
      answer: { type: "number", value: 0.1733, tolerance: 0.002, unit: "év" },
      explain: "A $\\theta$-tól való eltérés $e^{-\\kappa t}$ szerint csökken, így $\\ln 2/\\kappa = 0{,}693/4 \\approx 0{,}173$ év alatt feleződik, ami nagyjából két hónap.",
    },
    h("Számpélda"),
    p("Legyen $v_0 = 0{,}09$, $\\theta = 0{,}04$ és $\\kappa = 2$. A mai volatilitás $\\sqrt{0{,}09} = 30\\%$, a hosszú távú $\\sqrt{0{,}04} = 20\\%$. A felezési idő $\\ln 2/2 \\approx 0{,}35$ év, valamivel több mint négy hónap."),
    p("Fél év múlva a variancia várható értéke $0{,}04 + 0{,}05\\,e^{-1} \\approx 0{,}0584$, ami körülbelül 24,2% volatilitás. Egy év múlva $0{,}04 + 0{,}05\\,e^{-2} \\approx 0{,}0468$, körülbelül 21,6%."),
    p("A Feller-feltételhez: $2\\kappa\\theta = 0{,}16$. Ha $\\xi = 0{,}3$, akkor $\\xi^2 = 0{,}09 \\le 0{,}16$, a feltétel teljesül. Ha $\\xi = 0{,}5$, akkor $\\xi^2 = 0{,}25 > 0{,}16$, a feltétel sérül, és a variancia elérheti a nullát."),

    {
      kind: "worked",
      title: "Várható variancia és a Feller-feltétel ellenőrzése",
      steps: [
        { text: "Legyen $v_0 = 0{,}0625$ (25%-os volatilitás), $\\theta = 0{,}04$, $\\kappa = 1{,}5$. Egy varianciasokk felezési ideje, években.", tex: "\\ln 2 / \\kappa", result: { value: 0.4621, tolerance: 0.0005 } },
        { text: "A várható variancia egy év múlva.", tex: "\\theta + (v_0 - \\theta)\\,e^{-\\kappa \\cdot 1}", result: { value: 0.04502, tolerance: 0.00002 } },
        { text: "A megfelelő volatilitás, százalékban.", tex: "\\sqrt{\\mathbb{E}^{\\mathbb{Q}}[v_1]}", result: { value: 21.22, tolerance: 0.01, unit: "%" } },
        { text: "A Feller-tartalék $\\xi = 0{,}35$ mellett; negatív, tehát a feltétel épp nem teljesül.", tex: "2\\kappa\\theta - \\xi^2", result: { value: -0.0025, tolerance: 0.00005 } },
      ],
    },

    h("A korreláció és a ferdeség"),
    p("Részvényeknél $\\rho$ jellemzően negatív, gyakran $-0{,}5$ és $-0{,}9$ között. Negatív $\\rho$ mellett az árfolyam esése általában a variancia növekedésével jár. Ez a **tőkeáttételi hatás**: ha a részvényárfolyam esik, a vállalat adóssága a saját tőkéhez képest nagyobb lesz, és a részvény kockázatosabbá válik."),
    p("Nézzük, mit jelent ez $S_T$ eloszlására. Az eső pályák varianciája nő, ezért lefelé jobban szétszóródnak. Az emelkedő pályák varianciája csökken, ezért közelebb maradnak egymáshoz. A bal oldali szél hosszabb lesz a jobb oldalinál. A pénzen kívüli putok, amelyek éppen ebben a bal szélben fizetnek, többet érnek, mint a Black–Scholes-modellben, így az implikált volatilitásuk magasabb. Az implikált volatilitás ezért a kötési ár növekedésével csökken: ez a **ferdeség** (skew)."),

    {
      kind: "check",
      id: "stochastic-volatility/skew-side",
      prompt: "$\\rho = -0{,}7$ mellett melyik opciók implikált volatilitása magasabb a pénzen lévőkénél?",
      answer: { type: "choice", options: ["Az alacsony kötési árú (pénzen kívüli) putoké", "A magas kötési árú (pénzen kívüli) calloké", "Minden kötési áron ugyanannyi", "Egyiké sem: $\\rho$ csak a szintet tolja el"], correct: 0 },
      explain: "A negatív $\\rho$ a zuhanó pályákon növeli a varianciát, és megnyújtja a bal farkat, ezért az alacsony kötési árak drágábbak lesznek, mint a Black–Scholes-modellben: ez a részvénypiaci ferdeség.",
    },
    h("A vol-of-vol és a görbület"),
    p("A $\\xi$ paraméter szabja meg, mennyit mozog a variancia. Ha $\\xi = 0$, a variancia a determinisztikus pályáját követi, a modell közel áll az időben változó volatilitású Black–Scholes-modellhez, és a mosoly szinte lapos. Nagyobb $\\xi$ mellett nyugodt és nagyon viharos pályák keverednek. Az így kapott hozameloszlás csúcsa élesebb, mindkét széle vastagabb, mint az azonos varianciájú normális eloszlásé. A pénztől mindkét irányban távoli opciók értéke nő, és a mosoly mindkét végén felfelé hajlik."),
    note("A Heston-modellben $\\rho$ megdönti az implikált volatilitás görbéjét (negatív $\\rho$ adja a részvénypiaci ferdeséget), $\\xi$ pedig meghajlítja (nagyobb vol-of-vol nagyobb görbületet ad)."),
    p("Az ábra a Heston-modell implikált volatilitását mutatja a kötési ár függvényében, $S_0 = 100$, $r = 0$, $T = 1$, $v_0 = \\theta = 0{,}04$ és $\\kappa = 2$ mellett. Minden pont a Heston-féle call-ár Black–Scholes-implikált volatilitása az adott kötési áron; a Heston-árat az alább leírt karakterisztikus függvényből számolja az ábra. A $\\sqrt{\\theta} = 20\\%$ szintű vízszintes vonal a Black–Scholes- (konstans volatilitású) referencia. A kijelzők az implikált volatilitást mutatják $K = 80$, $100$ és $120$ mellett, valamint a $\\text{IV}(80) - \\text{IV}(120)$ ferdeséget."),
    p("Az alapértelmezett $\\rho = -0{,}7$, $\\xi = 0{,}5$ mellett az implikált volatilitások 23,03%, 18,05% és 14,54%, a ferdeség 8,49 százalékpont. Vidd $\\rho$-t $-0{,}9$ felé, és a ferdeség nő. $\\rho = 0$ mellett ugyanez a három kötési ár 20,26%, 18,76% és 19,82%: nagyjából szimmetrikus mosoly, amelynek minimuma a pénz közelében van. $\\xi$ növelésével a görbe egyre jobban hajlik. Figyeld meg azt is, hogy a pénzbeli implikált volatilitás 20% alatt marad, pedig a variancia $\\theta$-ról indul, és oda tér vissza: a vol-of-vol a középtől a szélek felé csoportosítja át az értéket."),
    figure("vol-smile"),

    p("A fenti mosoly egy egész **implikált volatilitási felület** egyetlen, $T = 1$-hez tartozó metszete: a felület minden kötési árhoz és minden lejárathoz megad egy implikált volatilitást. A következő ábra ezt a felületet rajzolja meg 70 és 130 közötti kötési árakra és 3 hónap és 2 év közötti lejáratokra, a fentivel azonos paraméterekkel. Húzással forgatható, görgetéssel nagyítható. A $\\rho$ és a $\\xi$ a gombokkal választható. Alapbeállítással ($\\rho = -0{,}7$, $\\xi = 0{,}5$) a $\\text{IV}(80) - \\text{IV}(120)$ ferdeség 3 hónapra 11,53, 1 évre 8,49, 2 évre 5,76 százalékpont: a ferdeség a lejárattal laposodik. Hosszabb távon a variancia több időt kap, hogy visszatérjen $\\theta$-hoz, ezért a loghozam eloszlása közelebb kerül a normálishoz. $\\rho = 0$ mellett a felület csaknem szimmetrikus völgy, $\\rho = +0{,}3$ mellett a dőlés megfordul."),
    figure("iv-surface"),

    h("Árazás a Heston-modellben"),
    p("Egy európai call ára továbbra is a diszkontált kockázatsemleges várható érték, $C_0 = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}[(S_T - K)^+]$. A Black–Scholes-képlethez hasonló rövid képlet nincs, de két bevett út létezik."),
    p("Az első a szimuláció, mint a „Monte Carlo-opcióárazás” című leckében. Osszuk fel $[0, T]$-t kis $\\Delta t$ lépésekre. Minden lépésben sorsoljunk két független standard normális $Z_1, Z_2$ értéket, legyen $\\varepsilon_1 = Z_1$ és $\\varepsilon_2 = \\rho Z_1 + \\sqrt{1-\\rho^2}\\,Z_2$, így a két sokk korrelációja $\\rho$, majd frissítsünk:"),
    eq("v_{t+\\Delta t} = v_t + \\kappa(\\theta - v_t)\\,\\Delta t + \\xi\\sqrt{v_t^+}\\,\\sqrt{\\Delta t}\\,\\varepsilon_2,"),
    eq("S_{t+\\Delta t} = S_t\\exp\\Big(\\big(r - \\tfrac{1}{2}v_t^+\\big)\\Delta t + \\sqrt{v_t^+}\\,\\sqrt{\\Delta t}\\,\\varepsilon_1\\Big)."),
    p("Itt $v_t^+ = \\max(v_t, 0)$ kiszűri azokat a kis negatív értékeket, amelyeket egy diszkrét lépés előállíthat. A diszkontált kifizetést sok pályán átlagolva kapjuk az árat, a „Monte Carlo-opcióárazás” leckéből ismert standard hibával."),
    p("A második út félig analitikus. Heston megmutatta, hogy $\\ln S_T$ karakterisztikus függvénye zárt alakban felírható. A call ára ekkor $S_0P_1 - Ke^{-rT}P_2$ alakú, ugyanolyan szerkezetű, mint a Black–Scholes-képlet, ahol $P_1$ és $P_2$ egydimenziós numerikus integrállal számolt valószínűségek. Ez elég gyors ahhoz, hogy az öt paramétert egy teljes piaci árfelülethez illesszük."),

    h("Összefoglalás"),
    list(
      "A Heston-modellben a $v_t$ variancia saját, átlaghoz visszatérő véletlen folyamatot követ, amely korrelál az árfolyammal.",
      "$v_0$ a mai variancia, $\\theta$ a hosszú távú szint, $\\kappa$ a visszatérés sebessége ($\\ln 2/\\kappa$ felezési idővel), $\\xi$ a vol-of-vol, $\\rho$ a korreláció.",
      "A $2\\kappa\\theta \\ge \\xi^2$ Feller-feltétel távol tartja a varianciát a nullától.",
      "Negatív $\\rho$ adja a részvénypiaci ferdeséget, nagyobb $\\xi$ erősebben hajló mosolyt.",
      "Az árak szimulációból vagy a karakterisztikus függvény numerikus integráljából adódnak.",
    ),
    lab("/heston", "Szimulálj árfolyam- és variancia-pályákat, és árazz opciókat a Heston-laborban"),
  ],
};
