import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p, steps } from "./blocks";

export const impliedVolatility: GuideLessonContent = {
  en: [
    p("\"The Black–Scholes formula\" turns five inputs into an option price. This lesson runs the formula backwards: it takes the market price as given and asks which volatility produces it. The answer, the implied volatility, is how options are actually quoted, and comparing it across strikes and maturities shows where the model disagrees with the market."),

    h("The one unobserved input"),
    p("Look at the inputs of the call price $C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$. The stock price $S_0$ is on the screen, the strike $K$ and maturity $T$ are written in the contract, and the risk-free rate $r$ can be read off government bills. The volatility $\\sigma$ is different: it describes how much the stock will move between now and $T$, and nobody can observe that in advance. A historical estimate from past returns is one guess, but traders do not have to agree on it."),
    p("So the formula can be read the other way round. If the market already shows a price for the option, the only free input is $\\sigma$, and we can solve for it."),

    h("Price as a function of volatility"),
    p("Fix $S_0$, $K$, $T$ and $r$, and treat the call price as a function of $\\sigma$ alone. Its derivative is the option's **vega**. Differentiating the formula (the terms from $d_1$ and $d_2$ combine as they did for delta) gives"),
    eq("\\mathcal{V} = \\frac{\\partial C_0}{\\partial \\sigma} = S_0\\,\\varphi(d_1)\\sqrt{T} > 0,"),
    p("where $\\varphi$ is the standard normal density. Vega is strictly positive, so the price is strictly increasing in $\\sigma$. At the two ends, as $\\sigma \\to 0$ the stock grows deterministically and the price falls to $\\max(S_0 - Ke^{-rT}, 0)$; as $\\sigma \\to \\infty$ the call approaches the stock itself and the price rises to $S_0$. These are exactly the no-arbitrage bounds from \"Put–call parity\":"),
    eq("\\max\\left(S_0 - Ke^{-rT},\\, 0\\right) < C_0 < S_0."),
    p("A continuous, strictly increasing function that sweeps the whole interval between the bounds hits every price inside it exactly once. A quoted price inside the bounds therefore pins down one and only one $\\sigma$. A price outside the bounds is an arbitrage, and no volatility can explain it."),
    note("The **implied volatility** of an option is the unique $\\sigma$ for which the Black–Scholes price equals the market price. It exists whenever the price lies strictly between the no-arbitrage bounds."),
    {
      kind: "check",
      id: "implied-volatility/above-model-price",
      prompt: "A call trades above the Black–Scholes price computed with $\\sigma = 20\\%$. What can you say about its implied volatility?",
      answer: { type: "choice", options: ["It is above 20%", "It is below 20%", "It is exactly 20%", "Nothing without knowing the real drift"], correct: 0 },
      explain: "The price is strictly increasing in $\\sigma$ (vega is positive), so a higher price needs a higher volatility.",
    },

    h("Solving for the volatility"),
    p("There is no closed-form inverse of the formula, so the implied volatility is found numerically. Two methods are standard."),
    steps(
      "**Bisection.** Start with a low $\\sigma_L$ whose price is below the quote and a high $\\sigma_H$ whose price is above it. Price the midpoint; if it is too high, it becomes the new $\\sigma_H$, otherwise the new $\\sigma_L$. Each step halves the interval, so the method always converges, slowly but surely.",
      "**Newton's method.** Start from a guess $\\sigma_0$ and follow the tangent of the price curve to the quoted price. The slope of the tangent is vega, so each step is $\\sigma_{n+1} = \\sigma_n - (C(\\sigma_n) - C^{\\text{mkt}})/\\mathcal{V}(\\sigma_n)$. Near the answer the number of correct digits roughly doubles per step.",
    ),
    p("Newton is much faster but can overshoot when vega is small, which happens for options far from the money or very close to maturity. Production code often combines the two: Newton steps, with a bisection fallback whenever a step leaves the bracketing interval."),

    h("A worked example"),
    p("Take $S_0 = 100$, $K = 100$, $T = 1$, $r = 5\\%$, and a quoted call price of 12.00. The bounds are $100 - 100e^{-0.05} \\approx 4.88$ and 100, so the quote is admissible. From \"The Black–Scholes formula\" we know that $\\sigma = 20\\%$ gives 10.45, which is too low, and $\\sigma = 30\\%$ gives 14.23, which is too high. Bisection on $[20\\%, 30\\%]$:"),
    list(
      "$\\sigma = 25\\%$: price 12.34, too high, so the interval becomes $[20\\%, 25\\%]$.",
      "$\\sigma = 22.5\\%$: price 11.39, too low, so the interval becomes $[22.5\\%, 25\\%]$.",
      "$\\sigma = 23.75\\%$: price 11.86, too low, so the interval becomes $[23.75\\%, 25\\%]$.",
    ),
    p("Newton from $\\sigma_0 = 20\\%$ is quicker. Vega there is $\\mathcal{V} \\approx 37.52$ (price per unit of $\\sigma$, so about 0.375 per volatility point):"),
    eq("\\sigma_1 = 0.20 - \\frac{10.4506 - 12}{37.52} \\approx 0.2413, \\qquad C(\\sigma_1) \\approx 12.0066."),
    p("A second step, with $\\mathcal{V} \\approx 37.81$, moves $\\sigma$ by $-0.0066/37.81 \\approx -0.0002$ and lands on $\\sigma \\approx 24.11\\%$, correct to four digits. The market is pricing this option as if the stock had an annual volatility of 24.11%."),
    {
      kind: "check",
      id: "implied-volatility/quote-nine",
      prompt: "Same option ($S_0 = K = 100$, $T = 1$, $r = 5\\%$), but now the quoted call price is 9.00. What is its implied volatility, in percent?",
      answer: { type: "number", value: 16.11, tolerance: 0.1, unit: "%" },
      explain: "At 20% the price is 10.45, too high, and at 10% it is about 6.80, too low. The first bisection step prices 15% at 8.59, too low, so the answer lies in $[15\\%, 20\\%]$; continuing gives about 16.11%.",
    },
    {
      kind: "worked",
      title: "Two Newton steps for a quote of 9.00",
      steps: [
        { text: "Start from $\\sigma_0 = 20\\%$, where the price is 10.4506 and vega is 37.52. The first step, in percent:", tex: "\\sigma_1 = 0.20 - \\frac{10.4506 - 9}{37.52}", result: { value: 16.13, tolerance: 0.02, unit: "%" } },
        { text: "Price at $\\sigma_1$, now only slightly above the quote:", tex: "C(\\sigma_1)", result: { value: 9.01, tolerance: 0.01 } },
        { text: "Second step, with vega $\\approx 36.96$ at $\\sigma_1$:", tex: "\\sigma_2 = \\sigma_1 - \\frac{C(\\sigma_1) - 9}{36.96}", result: { value: 16.11, tolerance: 0.02, unit: "%" } },
      ],
    },
    p("The figure shows the same construction. Spot $S_0 = 100$ and $r = 5\\%$ are fixed; sliders set the quoted call price, the strike $K$ and the maturity $T$. The curve is the Black–Scholes call price against $\\sigma$ from 1% to 100%, the horizontal line is the quoted price, and the vertical line marks where they cross: the implied volatility. The readouts show the implied volatility, vega at that volatility, and the lower and upper no-arbitrage bounds. Raise the quoted price and watch the crossing move right, so implied volatility rises. Then push the price below the lower bound: the horizontal line no longer meets the curve and the implied volatility readout shows a dash."),
    figure("implied-vol"),

    h("Quoting in volatility"),
    p("Because the map between price and implied volatility is one-to-one, traders quote options in volatility rather than in money. The reason is comparability. A price of 12.00 means little until you know the strike, the maturity and the stock price; an implied volatility of 24% can be compared directly across strikes, maturities and even underlyings, and with the volatility you expect the stock to realise. The price is recovered by plugging the quoted volatility into the formula."),
    p("Calls and puts with the same strike and maturity share the same implied volatility. Put–call parity $C_0 - P_0 = S_0 - Ke^{-rT}$ holds for market prices without any model, and it also holds for Black–Scholes prices at every $\\sigma$. If $\\sigma^*$ reproduces the market call, then"),
    eq("P_0^{\\text{mkt}} = C_0^{\\text{mkt}} - S_0 + Ke^{-rT} = C^{\\text{BS}}(\\sigma^*) - S_0 + Ke^{-rT} = P^{\\text{BS}}(\\sigma^*)."),
    p("In the example the put must cost $12.00 - (100 - 95.12) \\approx 7.12$, and its implied volatility is again 24.11%."),

    h("The volatility smile and the skew"),
    p("If the Black–Scholes model were correct, the stock would have one volatility, and every option on it would show that same implied volatility. Market data do not look like that. Plotting implied volatility against the strike for a fixed maturity gives a curve, not a flat line. On equity indices it slopes downward: low-strike options, in particular out-of-the-money puts, carry clearly higher implied volatilities than at-the-money options, and high strikes somewhat lower ones. This shape is called the **skew**. In other markets, for example currencies, the curve is closer to symmetric and rises on both sides, which is where the name **volatility smile** comes from."),
    p("Implied volatility also varies with maturity at a fixed strike, which is called the **term structure** of volatility. In calm markets short-dated volatility tends to be below long-dated volatility; after a sharp sell-off the order often reverses. The two effects together form the implied volatility surface over strike and maturity."),

    h("What the smile says about the model"),
    p("The smile is the market's way of saying that it does not price with a lognormal distribution and a constant $\\sigma$. A high implied volatility at low strikes means that out-of-the-money puts cost more than the model allows, so the market assigns more probability to large falls than a lognormal distribution does: the risk-neutral distribution has a **fatter left tail**. The term structure says that volatility itself is not a fixed number but moves over time, and in equity markets it tends to rise when prices fall."),
    p("Traders still use Black–Scholes, but as a quoting convention rather than as a description of the stock. The formula is a fixed, well-understood map between price and volatility, and the smile records how the market deviates from it. Implied volatility has been described as the wrong number to put in the wrong formula to get the right price. A model in which volatility itself is random, and which produces a smile on its own, is the topic of the next lesson."),

    h("Summary"),
    list(
      "Every Black–Scholes input except $\\sigma$ is observable; the implied volatility is the $\\sigma$ that reproduces the market price.",
      "Vega $S_0\\varphi(d_1)\\sqrt{T}$ is positive, so the price increases strictly in $\\sigma$, and any price strictly inside $\\max(S_0 - Ke^{-rT}, 0) < C_0 < S_0$ gives exactly one implied volatility.",
      "It is found by bisection (safe) or Newton's method with vega (fast); in the example a price of 12.00 gives 24.11%.",
      "Calls and puts with the same $K$ and $T$ have the same implied volatility, by put–call parity.",
      "Implied volatility varies with strike (smile, skew) and maturity (term structure), so the market does not price with a single lognormal $\\sigma$.",
    ),
    note("Black–Scholes survives as a quoting convention. The next lesson builds a model whose prices produce a smile; its lab is the Heston lab."),
    lab("/black-scholes", "See how the price responds to volatility in the Black–Scholes lab"),
  ],

  hu: [
    p("„A Black–Scholes-képlet” öt bemenetből opciós árat számol. Ez a lecke visszafelé használja a képletet: adottnak veszi a piaci árat, és azt kérdezi, milyen volatilitás adja ki. A válasz, az implikált volatilitás, a piacon az opciók jegyzésének módja, és ha kötési áronként és lejáratonként összevetjük, megmutatja, hol tér el a modell a piactól."),

    h("Az egyetlen nem megfigyelhető bemenet"),
    p("Nézzük a $C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$ call-ár bemeneteit. Az $S_0$ részvényár látszik a képernyőn, a $K$ kötési ár és a $T$ lejárat a szerződésben szerepel, az $r$ kockázatmentes kamatláb pedig leolvasható a rövid lejáratú állampapírokról. A $\\sigma$ volatilitás más: azt írja le, mennyit mozog majd a részvény most és $T$ között, és ezt előre senki sem figyelheti meg. A múltbeli hozamokból becsült történeti volatilitás egy lehetséges kiindulópont, de a kereskedőknek nem kell egyetérteniük benne."),
    p("A képlet ezért fordítva is olvasható. Ha a piacon már van ára az opciónak, az egyetlen szabad bemenet $\\sigma$, és erre megoldhatjuk az egyenletet."),

    h("Az ár mint a volatilitás függvénye"),
    p("Rögzítsük $S_0$-t, $K$-t, $T$-t és $r$-et, és tekintsük a call árát csak $\\sigma$ függvényének. A deriváltja az opció **vegája**. A képletet deriválva ($d_1$ és $d_2$ tagjai ugyanúgy összevonódnak, mint a deltánál):"),
    eq("\\mathcal{V} = \\frac{\\partial C_0}{\\partial \\sigma} = S_0\\,\\varphi(d_1)\\sqrt{T} > 0,"),
    p("ahol $\\varphi$ a standard normális sűrűségfüggvény. A vega szigorúan pozitív, így az ár $\\sigma$-ban szigorúan nő. A két végen: ha $\\sigma \\to 0$, a részvény determinisztikusan nő, és az ár $\\max(S_0 - Ke^{-rT}, 0)$-ra csökken; ha $\\sigma \\to \\infty$, a call egyre inkább maga a részvény, és az ár $S_0$-hoz tart. Ezek éppen a „Put–call paritás” lecke arbitrázsmentes korlátai:"),
    eq("\\max\\left(S_0 - Ke^{-rT},\\, 0\\right) < C_0 < S_0."),
    p("Egy folytonos, szigorúan növő függvény, amely a két korlát közötti teljes intervallumot bejárja, minden közbülső értéket pontosan egyszer vesz fel. A korlátok közé eső jegyzett ár tehát egyetlen $\\sigma$-t határoz meg. A korlátokon kívüli ár arbitrázst jelent, és semmilyen volatilitás nem magyarázza."),
    note("Egy opció **implikált volatilitása** az az egyetlen $\\sigma$, amelyre a Black–Scholes-ár megegyezik a piaci árral. Akkor létezik, ha az ár szigorúan az arbitrázsmentes korlátok közé esik."),
    {
      kind: "check",
      id: "implied-volatility/above-model-price",
      prompt: "Egy call ára a $\\sigma = 20\\%$-kal számolt Black–Scholes-ár fölött van. Mit mondhatsz az implikált volatilitásáról?",
      answer: { type: "choice", options: ["20% fölött van", "20% alatt van", "Pontosan 20%", "A valós drift ismerete nélkül semmit"], correct: 0 },
      explain: "Az ár $\\sigma$-ban szigorúan nő (a vega pozitív), így magasabb árhoz magasabb volatilitás kell.",
    },

    h("A volatilitás kiszámítása"),
    p("A képletnek nincs zárt alakú inverze, ezért az implikált volatilitást numerikusan keressük. Két módszer a szokásos."),
    steps(
      "**Intervallumfelezés (biszekció).** Induljunk egy alacsony $\\sigma_L$-ből, amelynek ára a jegyzés alatt van, és egy magas $\\sigma_H$-ból, amelynek ára fölötte. Árazzuk be a felezőpontot; ha túl drága, ez lesz az új $\\sigma_H$, különben az új $\\sigma_L$. Minden lépés felezi az intervallumot, így a módszer mindig konvergál, lassan, de biztosan.",
      "**Newton-módszer.** Egy $\\sigma_0$ kezdőértékből az árgörbe érintője mentén lépünk a jegyzett árhoz. Az érintő meredeksége a vega, így egy lépés $\\sigma_{n+1} = \\sigma_n - (C(\\sigma_n) - C^{\\text{piaci}})/\\mathcal{V}(\\sigma_n)$. A megoldás közelében a helyes jegyek száma lépésenként nagyjából megduplázódik.",
    ),
    p("A Newton-módszer jóval gyorsabb, de túllőhet, ha a vega kicsi; ez a pénztől távoli vagy a lejárathoz nagyon közeli opcióknál fordul elő. A gyakorlati kód gyakran kombinálja a kettőt: Newton-lépéseket tesz, és felezésre vált, ha egy lépés kivezetne a közrefogó intervallumból."),

    h("Számpélda"),
    p("Legyen $S_0 = 100$, $K = 100$, $T = 1$, $r = 5\\%$, és a jegyzett call-ár 12,00. A korlátok $100 - 100e^{-0{,}05} \\approx 4{,}88$ és 100, tehát a jegyzés megengedett. „A Black–Scholes-képlet” leckéből tudjuk, hogy $\\sigma = 20\\%$ mellett az ár 10,45, ez túl alacsony, $\\sigma = 30\\%$ mellett pedig 14,23, ez túl magas. Felezés a $[20\\%, 30\\%]$ intervallumon:"),
    list(
      "$\\sigma = 25\\%$: az ár 12,34, túl magas, az intervallum $[20\\%, 25\\%]$ lesz.",
      "$\\sigma = 22{,}5\\%$: az ár 11,39, túl alacsony, az intervallum $[22{,}5\\%, 25\\%]$ lesz.",
      "$\\sigma = 23{,}75\\%$: az ár 11,86, túl alacsony, az intervallum $[23{,}75\\%, 25\\%]$ lesz.",
    ),
    p("A Newton-módszer $\\sigma_0 = 20\\%$-ból gyorsabb. Itt a vega $\\mathcal{V} \\approx 37{,}52$ (ár egységnyi $\\sigma$-ra, vagyis volatilitáspontonként kb. 0,375):"),
    eq("\\sigma_1 = 0{,}20 - \\frac{10{,}4506 - 12}{37{,}52} \\approx 0{,}2413, \\qquad C(\\sigma_1) \\approx 12{,}0066."),
    p("A második lépés $\\mathcal{V} \\approx 37{,}81$ mellett $-0{,}0066/37{,}81 \\approx -0{,}0002$-vel mozdítja $\\sigma$-t, és $\\sigma \\approx 24{,}11\\%$-nál áll meg, négy jegyre pontosan. A piac tehát úgy árazza ezt az opciót, mintha a részvény éves volatilitása 24,11% lenne."),
    {
      kind: "check",
      id: "implied-volatility/quote-nine",
      prompt: "Ugyanez az opció ($S_0 = K = 100$, $T = 1$, $r = 5\\%$), de most a jegyzett call-ár 9,00. Mennyi az implikált volatilitása százalékban?",
      answer: { type: "number", value: 16.11, tolerance: 0.1, unit: "%" },
      explain: "20%-on az ár 10,45, túl magas, 10%-on kb. 6,80, túl alacsony. Az első felezési lépés 15%-on 8,59-et ad, túl alacsony, így a válasz a $[15\\%, 20\\%]$ intervallumban van; folytatva kb. 16,11% adódik.",
    },
    {
      kind: "worked",
      title: "Két Newton-lépés a 9,00-es jegyzésre",
      steps: [
        { text: "Induljunk $\\sigma_0 = 20\\%$-ból, ahol az ár 10,4506, a vega 37,52. Az első lépés százalékban:", tex: "\\sigma_1 = 0{,}20 - \\frac{10{,}4506 - 9}{37{,}52}", result: { value: 16.13, tolerance: 0.02, unit: "%" } },
        { text: "Az ár $\\sigma_1$-nél már csak kicsivel van a jegyzés fölött:", tex: "C(\\sigma_1)", result: { value: 9.01, tolerance: 0.01 } },
        { text: "Második lépés, $\\sigma_1$-nél $\\approx 36{,}96$ vegával:", tex: "\\sigma_2 = \\sigma_1 - \\frac{C(\\sigma_1) - 9}{36{,}96}", result: { value: 16.11, tolerance: 0.02, unit: "%" } },
      ],
    },
    p("Az ábra ugyanezt a keresést mutatja. Az $S_0 = 100$ árfolyam és az $r = 5\\%$ kamat rögzített; csúszkákkal állítható a jegyzett call-ár, a $K$ kötési ár és a $T$ lejárat. A görbe a Black–Scholes call-ár $\\sigma$ függvényében 1% és 100% között, a vízszintes vonal a jegyzett ár, a függőleges vonal pedig a metszéspontot jelöli: ez az implikált volatilitás. A kijelzők az implikált volatilitást, az ott vett vegát, valamint az alsó és felső arbitrázsmentes korlátot mutatják. Emeld a jegyzett árat: a metszéspont jobbra csúszik, az implikált volatilitás nő. Utána vidd az árat az alsó korlát alá: a vízszintes vonal már nem metszi a görbét, és az implikált volatilitás helyén gondolatjel áll."),
    figure("implied-vol"),

    h("Jegyzés volatilitásban"),
    p("Mivel az ár és az implikált volatilitás kölcsönösen egyértelműen megfelelnek egymásnak, a kereskedők az opciókat volatilitásban jegyzik, nem pénzben. Az ok az összehasonlíthatóság. Egy 12,00-es ár keveset mond, amíg nem ismerjük a kötési árat, a lejáratot és a részvényárat; egy 24%-os implikált volatilitás viszont közvetlenül összevethető más kötési árakkal, lejáratokkal, sőt más alaptermékekkel is, és azzal a volatilitással, amelyet a részvénytől várunk. Az árat a jegyzett volatilitás képletbe helyettesítésével kapjuk vissza."),
    p("Az azonos kötési árú és lejáratú call és put implikált volatilitása ugyanaz. A $C_0 - P_0 = S_0 - Ke^{-rT}$ put–call paritás modelltől függetlenül teljesül a piaci árakra, és minden $\\sigma$ mellett a Black–Scholes-árakra is. Ha $\\sigma^*$ visszaadja a piaci call-árat, akkor"),
    eq("P_0^{\\text{piaci}} = C_0^{\\text{piaci}} - S_0 + Ke^{-rT} = C^{\\text{BS}}(\\sigma^*) - S_0 + Ke^{-rT} = P^{\\text{BS}}(\\sigma^*)."),
    p("A példában a putnak $12{,}00 - (100 - 95{,}12) \\approx 7{,}12$-be kell kerülnie, és implikált volatilitása szintén 24,11%."),

    h("A volatilitás-mosoly és a ferdeség"),
    p("Ha a Black–Scholes-modell helyes volna, a részvénynek egyetlen volatilitása lenne, és minden rá szóló opció ugyanazt az implikált volatilitást mutatná. A piaci adatok nem ilyenek. Rögzített lejárat mellett az implikált volatilitást a kötési ár függvényében ábrázolva görbét kapunk, nem vízszintes egyenest. Részvényindexeken a görbe lefelé lejt: az alacsony kötési árú opciók, különösen a pénzen kívüli putok implikált volatilitása jól láthatóan magasabb a pénznél lévőkénél, a magas kötési áraké pedig valamivel alacsonyabb. Ezt az alakot **ferdeségnek** (skew) nevezik. Más piacokon, például a devizapiacon, a görbe szimmetrikusabb, és mindkét oldalon emelkedik; innen ered a **volatilitás-mosoly** elnevezés."),
    p("Rögzített kötési ár mellett az implikált volatilitás a lejárattal is változik; ez a volatilitás **lejárati szerkezete**. Nyugodt piacon a rövid lejáratú volatilitás jellemzően a hosszú lejáratú alatt van, egy éles esés után a sorrend gyakran megfordul. A két hatás együtt adja a kötési ár és a lejárat fölött kifeszülő implikált volatilitási felületet."),

    h("Mit mond a mosoly a modellről"),
    p("A mosoly azt jelzi, hogy a piac nem lognormális eloszlással és állandó $\\sigma$-val áraz. Az alacsony kötési árakon mért magas implikált volatilitás azt jelenti, hogy a pénzen kívüli putok drágábbak, mint amit a modell megenged, vagyis a piac a nagy esésekhez több valószínűséget rendel, mint a lognormális eloszlás: a kockázatsemleges eloszlás **bal farka vastagabb**. A lejárati szerkezet pedig azt mutatja, hogy maga a volatilitás sem rögzített szám, hanem időben mozog, és részvénypiacon jellemzően akkor emelkedik, amikor az árak esnek."),
    p("A kereskedők ennek ellenére használják a Black–Scholes-képletet, de jegyzési konvencióként, nem a részvény leírásaként. A képlet rögzített, jól ismert megfeleltetés ár és volatilitás között, a mosoly pedig rögzíti, mennyiben tér el ettől a piac. Az implikált volatilitást úgy is jellemezték, mint a rossz számot, amelyet a rossz képletbe írva a helyes árat kapjuk. Olyan modell, amelyben maga a volatilitás is véletlen, és amely magától mosolyt ad, a következő lecke témája."),

    h("Összefoglalás"),
    list(
      "A Black–Scholes-bemenetek közül csak $\\sigma$ nem figyelhető meg; az implikált volatilitás az a $\\sigma$, amely visszaadja a piaci árat.",
      "Az $S_0\\varphi(d_1)\\sqrt{T}$ vega pozitív, így az ár $\\sigma$-ban szigorúan nő, és minden, a $\\max(S_0 - Ke^{-rT}, 0) < C_0 < S_0$ korlátok közé eső ár pontosan egy implikált volatilitást ad.",
      "Kiszámítása felezéssel (biztos) vagy a vegát használó Newton-módszerrel (gyors) történik; a példában a 12,00-es ár 24,11%-ot ad.",
      "Az azonos $K$-jú és $T$-jű call és put implikált volatilitása a put–call paritás miatt megegyezik.",
      "Az implikált volatilitás függ a kötési ártól (mosoly, ferdeség) és a lejárattól (lejárati szerkezet), vagyis a piac nem egyetlen lognormális $\\sigma$-val áraz.",
    ),
    note("A Black–Scholes-modell jegyzési konvencióként él tovább. A következő lecke olyan modellt épít, amelynek árai mosolyt adnak; ehhez a Heston-labor tartozik."),
    lab("/black-scholes", "Nézd meg a Black–Scholes laborban, hogyan reagál az ár a volatilitásra"),
  ],
};
