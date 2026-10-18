import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const greeks: GuideLessonContent = {
  en: [
    p("\"Delta and hedging\" measured how an option's value responds to the stock price and showed that a delta hedge leaves a residual governed by gamma. The stock price is not the only input that moves. Time passes, volatility changes and interest rates shift. This lesson defines one sensitivity for each input, the **Greeks**, and shows that two of them, gamma and theta, are tied together by the requirement that a hedged position earns the risk-free rate."),

    h("Option value as a function of its inputs"),
    p("Write $V(S, t, \\sigma, r)$ for the value of an option (a call or a put with strike $K$ and maturity date $T$) when the stock price is $S$, the current date is $t$, the volatility is $\\sigma$ and the risk-free rate is $r$. The previous lesson, \"The Black–Scholes formula\", gave $V$ in closed form for a European call and put. This lesson asks how that value responds when each input moves, which is what its partial derivatives measure. All numbers in this lesson are computed with that formula."),
    p("Each Greek is the partial derivative of $V$ with respect to one input, holding the others fixed:"),
    eq("\\Delta = \\frac{\\partial V}{\\partial S}, \\quad \\Gamma = \\frac{\\partial^2 V}{\\partial S^2}, \\quad \\Theta = \\frac{\\partial V}{\\partial t}, \\quad \\mathcal{V} = \\frac{\\partial V}{\\partial \\sigma}, \\quad \\rho = \\frac{\\partial V}{\\partial r}."),
    p("Vega is not a Greek letter; we write it as $\\mathcal{V}$. Theta is the change as calendar time $t$ advances, so the remaining time to maturity $T - t$ shrinks."),

    h("Delta and gamma"),
    p("Delta, from \"Delta and hedging\", is the slope of the value curve $S \\mapsto V$: the number of shares that replicates the option locally. It is dimensionless (shares per option); a call has $0 \\le \\Delta \\le 1$, a put $-1 \\le \\Delta \\le 0$."),
    p("Gamma is the curvature of the same curve, the rate at which delta changes when $S$ moves. Its unit is one over the price unit: $\\Gamma = 0.02$ means delta rises by about 0.02 for each unit rise in $S$. A long call or put has $\\Gamma > 0$. Put–call parity, $C - P = S - Ke^{-r(T-t)}$, shows that a call and a put with the same strike have the same gamma, because the right-hand side is linear in $S$."),
    p("Gamma is largest near the strike and grows as maturity approaches. Close to maturity the value curve approaches the kinked payoff $(S - K)^+$, which is flat on one side of $K$ and has slope 1 on the other. The whole change in slope then happens in a narrow region around $K$, so the curvature there becomes large, while far from $K$ it goes to zero."),

    h("Vega"),
    p("Vega measures the change in value when volatility changes. Since $\\sigma$ is a number like 0.25, a change of 1 in $\\sigma$ is enormous, so vega is usually quoted per percentage point: $\\mathcal{V}/100$ is the value change when $\\sigma$ goes from 25% to 26%."),
    p("For both calls and puts $\\mathcal{V} > 0$: options are **long volatility**. The reason is the shape of the payoff. Higher volatility spreads the possible values of $S_T$ further in both directions. For a call, the extra upside raises the payoff without limit, while the extra downside costs nothing once $S_T < K$, because the payoff is floored at 0. A convex payoff gains on average from more dispersion. By put–call parity, call and put have the same vega, since $S - Ke^{-r(T-t)}$ does not depend on $\\sigma$."),

    h("Theta and rho"),
    p("Theta is the change in value per unit of calendar time, with everything else fixed. It is quoted per year, and dividing by 365 gives the change per day. For a long call $\\Theta < 0$: as maturity approaches, there is less time for the stock to move in the holder's favour, and the value decays towards the payoff. This is **time decay**. A deep in-the-money put can have positive theta, because waiting brings the strike payment closer and its discounted value rises."),
    p("Rho is the change in value when $r$ changes, quoted per percentage point like vega. A call has $\\rho > 0$: the holder pays $K$ only at maturity, and a higher rate lowers the present value $Ke^{-r(T-t)}$ of that payment. A put has $\\rho < 0$ for the same reason. For short-dated equity options rho is usually the least important Greek."),

    h("The Taylor expansion of the option value"),
    p("Over a short interval $dt$ the inputs change by $dS$, $d\\sigma$ and $dr$. Expanding $V$ to second order in $S$ and first order in the other inputs gives"),
    eq("dV \\approx \\Delta\\,dS + \\tfrac{1}{2}\\,\\Gamma\\,(dS)^2 + \\Theta\\,dt + \\mathcal{V}\\,d\\sigma + \\rho\\,dr."),
    p("The term $(dS)^2$ is kept because stock moves over a short interval are of order $\\sqrt{dt}$, as in \"Random walks and Brownian motion\", so $(dS)^2$ is of order $dt$, the same size as the theta term. Squares of the other changes are much smaller and are dropped."),

    h("Gamma against theta in a hedged position"),
    p("Hold one option and short $\\Delta$ shares, and finance the position at the risk-free rate, so its net value $V - \\Delta S$ earns $r$. Over $dt$ with $\\sigma$ and $r$ fixed, the $\\Delta\\,dS$ terms cancel and the profit in excess of interest is"),
    eq("d\\Pi - r(V - \\Delta S)\\,dt \\approx \\tfrac{1}{2}\\,\\Gamma\\,(dS)^2 + \\big(\\Theta - rV + rS\\Delta\\big)\\,dt."),
    p("Now make one modelling assumption: over a short interval the stock return $dS/S$ has variance $\\sigma^2 dt$, so $(dS)^2$ equals $\\sigma^2 S^2 dt$ on average. A hedged position whose expected excess profit is not zero would be a riskless gain or loss as the hedge is rebalanced continuously, which no-arbitrage rules out. Setting the excess profit to zero when $(dS)^2 = \\sigma^2 S^2 dt$ gives"),
    eq("\\Theta + \\tfrac{1}{2}\\,\\sigma^2 S^2\\,\\Gamma + rS\\,\\Delta - rV = 0."),
    p("This is the Black–Scholes equation, stated here as the condition that a delta-hedged option earns exactly the risk-free rate. Substituting it back, the hedged profit over $dt$ becomes"),
    eq("\\text{P\\&L} \\approx \\tfrac{1}{2}\\,\\Gamma\\,\\big((dS)^2 - \\sigma^2 S^2\\,dt\\big)."),
    p("Gamma and theta are two sides of one trade-off. A long option position has $\\Gamma > 0$ and gains on every large move, whatever its direction, and it pays for this through theta every day. It profits when the realised squared move exceeds $\\sigma^2 S^2 dt$ and loses when the stock moves less. The seller of the option holds the opposite position: steady theta income, losses on large moves."),
    note("For a delta-hedged option, $\\Theta + \\tfrac{1}{2}\\sigma^2 S^2 \\Gamma + rS\\Delta - rV = 0$. Positive gamma is paid for with negative theta; the hedge breaks even when the stock moves by about $\\sigma S\\sqrt{dt}$."),

    h("A worked example"),
    p("Take a call with $S = 100$, $K = 100$, $T - t = 0.5$ years, $r = 5\\%$ and $\\sigma = 25\\%$. The Black–Scholes formula gives a value of $V \\approx 8.26$ and"),
    list(
      "$\\Delta \\approx 0.591$ and $\\Gamma \\approx 0.0220$;",
      "$\\mathcal{V} \\approx 27.47$, that is 0.275 per percentage point of $\\sigma$;",
      "$\\Theta \\approx -9.41$ per year, that is $-9.41/365 \\approx -0.0258$ per day;",
      "$\\rho \\approx 25.41$, that is 0.254 per percentage point of $r$.",
    ),
    p("Check the relation: $\\tfrac{1}{2}\\sigma^2 S^2 \\Gamma = \\tfrac{1}{2} \\cdot 0.0625 \\cdot 10\\,000 \\cdot 0.02198 \\approx 6.87$, $rS\\Delta \\approx 2.95$ and $rV \\approx 0.41$, so $-9.41 + 6.87 + 2.95 - 0.41 = 0$."),
    p("Now let one day pass while the stock rises to 102 and volatility rises to 26%. The expansion predicts $0.591 \\cdot 2 + \\tfrac{1}{2} \\cdot 0.0220 \\cdot 4 - 0.0258 + 0.275 \\approx 1.475$; repricing with the formula gives a change of 1.470. For the delta-hedged position (with $\\sigma$ unchanged) the break-even daily move is $\\sigma S \\sqrt{1/365} \\approx 1.31$. A move of 2 gives $\\tfrac{1}{2} \\cdot 0.0220 \\cdot (4 - 1.71) \\approx 0.025$ per option; a move smaller than 1.31 gives a loss."),

    h("The Greeks across stock prices"),
    p("The figure plots one Greek of the call at a time against the stock price $S$ from 40 to 160, with $K = 100$ and $r = 5\\%$ fixed. A switch selects delta, gamma, vega or theta, and sliders set the time to maturity $T$ (0.05 to 2 years) and the volatility $\\sigma$. The readouts at $S = 100$ show delta, gamma, vega, theta and the value of $\\Theta + \\tfrac{1}{2}\\sigma^2 S^2 \\Gamma + rS\\Delta - rV$, which stays at zero for every setting. Select gamma and shrink $T$: the peak at the strike grows sharply (from about 0.010 at $T = 2$ to 0.071 at $T = 0.05$ with $\\sigma = 25\\%$) while theta at the strike falls from $-9.41$ to about $-24.8$ per year. Then select vega and note that it is largest near the strike and grows with $T$."),
    figure("greeks-profile"),

    h("Summary"),
    list(
      "The Greeks are partial derivatives of the option value: $\\Delta$ and $\\Gamma$ in $S$, $\\Theta$ in time, vega $\\mathcal{V}$ in $\\sigma$, $\\rho$ in $r$.",
      "Gamma is the curvature of the value curve; it peaks near the strike and grows as maturity approaches. Calls and puts with the same strike share gamma and vega.",
      "Options are long volatility ($\\mathcal{V} > 0$) because the payoff is convex; a long call loses value with time ($\\Theta < 0$).",
      "To second order, $dV \\approx \\Delta\\,dS + \\tfrac{1}{2}\\Gamma(dS)^2 + \\Theta\\,dt + \\mathcal{V}\\,d\\sigma$.",
      "A delta-hedged option earns $\\tfrac{1}{2}\\Gamma((dS)^2 - \\sigma^2S^2dt)$; requiring it to earn the risk-free rate gives $\\Theta + \\tfrac{1}{2}\\sigma^2S^2\\Gamma + rS\\Delta - rV = 0$.",
    ),
    note("The next lesson, \"Implied volatility and the volatility smile\", turns the question around: given a market price, which $\\sigma$ does the formula need, and why does that number depend on the strike."),
    lab("/black-scholes", "Explore the Greek surfaces across stock price and maturity in the Black–Scholes lab"),
  ],

  hu: [
    p("A „Delta és fedezés” lecke azt mérte, hogyan reagál az opció értéke a részvényárra, és megmutatta, hogy a delta-fedezés után a gamma által meghatározott maradék hiba marad. A részvényár azonban nem az egyetlen bemenet, amely mozog. Telik az idő, változik a volatilitás és a kamatláb. Ez a lecke minden bemenethez definiál egy érzékenységet, ezek a **görögök**, és megmutatja, hogy kettőt közülük, a gammát és a thétát, összeköt az a követelmény, hogy a fedezett pozíció a kockázatmentes kamatot hozza."),

    h("Az opció értéke mint a bemenetek függvénye"),
    p("Jelölje $V(S, t, \\sigma, r)$ egy opció (egy $K$ kötési árú, $T$ lejárati időpontú vételi vagy eladási opció) értékét, ha a részvényár $S$, az aktuális időpont $t$, a volatilitás $\\sigma$ és a kockázatmentes kamatláb $r$. Az előző lecke, „A Black–Scholes-képlet”, zárt alakban adta meg $V$-t európai vételi és eladási opcióra. Ez a lecke azt vizsgálja, hogyan reagál ez az érték, ha az egyes bemenetek elmozdulnak; ezt mérik a parciális deriváltjai. A leckében szereplő számokat ezzel a képlettel számoltuk."),
    p("Minden görög $V$ parciális deriváltja egy bemenet szerint, a többit rögzítve:"),
    eq("\\Delta = \\frac{\\partial V}{\\partial S}, \\quad \\Gamma = \\frac{\\partial^2 V}{\\partial S^2}, \\quad \\Theta = \\frac{\\partial V}{\\partial t}, \\quad \\mathcal{V} = \\frac{\\partial V}{\\partial \\sigma}, \\quad \\rho = \\frac{\\partial V}{\\partial r}."),
    p("A vega nem görög betű; a jele itt $\\mathcal{V}$. A théta a $t$ naptári idő előrehaladásával járó változás, vagyis miközben a lejáratig hátralévő $T - t$ idő csökken."),

    h("Delta és gamma"),
    p("A delta a „Delta és fedezés” leckéből ismert: az $S \\mapsto V$ értékgörbe meredeksége, az a részvényszám, amely lokálisan replikálja az opciót. Mértékegység nélküli (részvény per opció); vételi opcióra $0 \\le \\Delta \\le 1$, eladásira $-1 \\le \\Delta \\le 0$."),
    p("A gamma ugyanennek a görbének a görbülete, vagyis az, hogy milyen gyorsan változik a delta, ha $S$ elmozdul. Mértékegysége az áregység reciproka: $\\Gamma = 0{,}02$ azt jelenti, hogy $S$ minden egységnyi emelkedésére a delta kb. 0,02-dal nő. Vett callnál és putnál $\\Gamma > 0$. A put–call paritásból, $C - P = S - Ke^{-r(T-t)}$, látszik, hogy az azonos kötési árú call és put gammája megegyezik, hiszen a jobb oldal $S$-ben lineáris."),
    p("A gamma a kötési ár közelében a legnagyobb, és a lejárat közeledtével nő. Lejárat előtt az értékgörbe egyre jobban megközelíti az $(S - K)^+$ megtört kifizetést, amely $K$ egyik oldalán vízszintes, a másikon 1 meredekségű. A meredekség teljes változása ekkor egy szűk sávban történik $K$ körül, ezért ott a görbület nagy, $K$-tól távol pedig nullához tart."),

    h("Vega"),
    p("A vega azt méri, mennyit változik az érték, ha a volatilitás változik. Mivel $\\sigma$ egy 0,25-höz hasonló szám, $\\sigma$ 1-gyel való változása óriási; a vegát ezért általában százalékpontra vetítve adják meg: $\\mathcal{V}/100$ az értékváltozás, ha $\\sigma$ 25%-ról 26%-ra nő."),
    p("Vételi és eladási opcióra egyaránt $\\mathcal{V} > 0$: az opció tulajdonosa **a volatilitás emelkedésén nyer**. Ennek oka a kifizetés alakja. Nagyobb volatilitás mellett $S_T$ lehetséges értékei mindkét irányban jobban szóródnak. Callnál a nagyobb felfelé mozgás korlátlanul növeli a kifizetést, a nagyobb lefelé mozgás viszont semmibe sem kerül, ha már $S_T < K$, mert a kifizetés alulról 0-nál korlátos. A konvex kifizetés átlagosan nyer a nagyobb szóródáson. A put–call paritás szerint a call és a put vegája megegyezik, mert $S - Ke^{-r(T-t)}$ nem függ $\\sigma$-tól."),

    h("Théta és rhó"),
    p("A théta az értékváltozás egységnyi naptári idő alatt, minden mást rögzítve. Évre vetítve adják meg; 365-tel osztva a napi változást kapjuk. Vett callnál $\\Theta < 0$: a lejárat közeledtével kevesebb idő marad arra, hogy a részvény a tulajdonos javára mozduljon, és az érték a kifizetés felé kopik. Ez az **időbeli értékvesztés**. Mélyen pénzen belüli put thétája pozitív is lehet, mert a várakozással a kötési ár megkapása közelebb kerül, és diszkontált értéke nő."),
    p("A rhó az értékváltozás, ha $r$ változik; a vegához hasonlóan százalékpontra vetítve adják meg. Callnál $\\rho > 0$: a tulajdonos csak lejáratkor fizeti ki $K$-t, és magasabb kamat mellett ennek $Ke^{-r(T-t)}$ jelenértéke kisebb. Ugyanezért a put rhója negatív. Rövid lejáratú részvényopcióknál a rhó általában a legkevésbé fontos görög."),

    h("Az opció értékének Taylor-sora"),
    p("Egy rövid $dt$ időszak alatt a bemenetek $dS$-sel, $d\\sigma$-val és $dr$-rel változnak. $V$-t $S$-ben másodrendig, a többi bemenetben elsőrendig kifejtve:"),
    eq("dV \\approx \\Delta\\,dS + \\tfrac{1}{2}\\,\\Gamma\\,(dS)^2 + \\Theta\\,dt + \\mathcal{V}\\,d\\sigma + \\rho\\,dr."),
    p("A $(dS)^2$ tagot azért tartjuk meg, mert a részvényár rövid idő alatti elmozdulása $\\sqrt{dt}$ nagyságrendű, ahogy a „Véletlen bolyongás és Brown-mozgás” leckében láttuk, így $(dS)^2$ nagyságrendje $dt$, ugyanakkora, mint a théta-tagé. A többi változás négyzete sokkal kisebb, ezeket elhagyjuk."),

    h("Gamma és théta a fedezett pozícióban"),
    p("Tartsunk egy opciót és $\\Delta$ darab shortolt részvényt, és finanszírozzuk a pozíciót kockázatmentes kamaton, így a $V - \\Delta S$ nettó érték $r$-rel kamatozik. Egy $dt$ időszak alatt, rögzített $\\sigma$ és $r$ mellett a $\\Delta\\,dS$ tagok kiesnek, és a kamat feletti nyereség"),
    eq("d\\Pi - r(V - \\Delta S)\\,dt \\approx \\tfrac{1}{2}\\,\\Gamma\\,(dS)^2 + \\big(\\Theta - rV + rS\\Delta\\big)\\,dt."),
    p("Most tegyünk egy modellfeltevést: rövid időszak alatt a $dS/S$ hozam varianciája $\\sigma^2 dt$, így $(dS)^2$ átlagosan $\\sigma^2 S^2 dt$. Ha a fedezett pozíció várható többletnyeresége nem nulla volna, a folytonosan újrasúlyozott fedezés kockázatmentes nyereséget vagy veszteséget adna, amit az arbitrázsmentesség kizár. A többletnyereséget $(dS)^2 = \\sigma^2 S^2 dt$ mellett nullának véve"),
    eq("\\Theta + \\tfrac{1}{2}\\,\\sigma^2 S^2\\,\\Gamma + rS\\,\\Delta - rV = 0."),
    p("Ez a Black–Scholes-egyenlet, itt annak feltételeként megfogalmazva, hogy a delta-fedezett opció pontosan a kockázatmentes kamatot hozza. Visszahelyettesítve a fedezett pozíció $dt$ alatti eredménye"),
    eq("\\text{P\\&L} \\approx \\tfrac{1}{2}\\,\\Gamma\\,\\big((dS)^2 - \\sigma^2 S^2\\,dt\\big)."),
    p("A gamma és a théta ugyanannak a cserének a két oldala. A vett opció gammája pozitív, minden nagy mozgáson nyer, iránytól függetlenül, és ezért a thétán keresztül naponta fizet. Akkor nyer, ha a ténylegesen megvalósult négyzetes elmozdulás nagyobb $\\sigma^2 S^2 dt$-nél, és veszít, ha a részvény kevesebbet mozog. Az opció kiírója az ellenkező oldalon áll: egyenletes théta-bevétel, veszteség a nagy mozgásokon."),
    note("Delta-fedezett opcióra $\\Theta + \\tfrac{1}{2}\\sigma^2 S^2 \\Gamma + rS\\Delta - rV = 0$. A pozitív gammát negatív thétával fizetjük meg; a fedezés akkor nullszaldós, ha a részvény kb. $\\sigma S\\sqrt{dt}$-vel mozdul el."),

    h("Számpélda"),
    p("Vegyünk egy vételi opciót, ahol $S = 100$, $K = 100$, $T - t = 0{,}5$ év, $r = 5\\%$ és $\\sigma = 25\\%$. A Black–Scholes-képlet szerint az érték $V \\approx 8{,}26$, továbbá"),
    list(
      "$\\Delta \\approx 0{,}591$ és $\\Gamma \\approx 0{,}0220$;",
      "$\\mathcal{V} \\approx 27{,}47$, azaz $\\sigma$ minden százalékpontjára 0,275;",
      "$\\Theta \\approx -9{,}41$ évente, azaz $-9{,}41/365 \\approx -0{,}0258$ naponta;",
      "$\\rho \\approx 25{,}41$, azaz $r$ minden százalékpontjára 0,254.",
    ),
    p("Ellenőrizzük az összefüggést: $\\tfrac{1}{2}\\sigma^2 S^2 \\Gamma = \\tfrac{1}{2} \\cdot 0{,}0625 \\cdot 10\\,000 \\cdot 0{,}02198 \\approx 6{,}87$, $rS\\Delta \\approx 2{,}95$ és $rV \\approx 0{,}41$, így $-9{,}41 + 6{,}87 + 2{,}95 - 0{,}41 = 0$."),
    p("Teljen el egy nap, miközben a részvény 102-re, a volatilitás 26%-ra emelkedik. A Taylor-sor $0{,}591 \\cdot 2 + \\tfrac{1}{2} \\cdot 0{,}0220 \\cdot 4 - 0{,}0258 + 0{,}275 \\approx 1{,}475$ változást jósol; a képlettel újraárazva a változás 1,470. A delta-fedezett pozíció (változatlan $\\sigma$ mellett) napi nullszaldós elmozdulása $\\sigma S \\sqrt{1/365} \\approx 1{,}31$. Egy 2 egységnyi mozgás opciónként $\\tfrac{1}{2} \\cdot 0{,}0220 \\cdot (4 - 1{,}71) \\approx 0{,}025$ nyereséget hoz; 1,31-nél kisebb mozgás veszteséget."),

    h("A görögök a részvényár függvényében"),
    p("Az ábra a call egy-egy görögjét mutatja a részvényár függvényében, $S$ 40 és 160 között, rögzített $K = 100$ és $r = 5\\%$ mellett. Egy kapcsolóval választható a delta, a gamma, a vega vagy a théta, a csúszkák a lejáratig hátralévő $T$ időt (0,05 és 2 év között) és a $\\sigma$ volatilitást állítják. A kijelzők $S = 100$-nál mutatják a deltát, a gammát, a vegát, a thétát és a $\\Theta + \\tfrac{1}{2}\\sigma^2 S^2 \\Gamma + rS\\Delta - rV$ kifejezés értékét, amely minden beállításnál nulla marad. Válaszd a gammát, és csökkentsd $T$-t: a kötési árnál lévő csúcs erősen megnő (25%-os $\\sigma$ mellett $T = 2$-nél kb. 0,010, $T = 0{,}05$-nél 0,071), a théta a kötési árnál pedig $-9{,}41$-ről kb. $-24{,}8$-ra csökken évente. Ezután válaszd a vegát, és figyeld meg, hogy a kötési ár közelében a legnagyobb, és $T$-vel nő."),
    figure("greeks-profile"),

    h("Összefoglalás"),
    list(
      "A görögök az opció értékének parciális deriváltjai: $\\Delta$ és $\\Gamma$ $S$ szerint, $\\Theta$ az idő szerint, a $\\mathcal{V}$ vega $\\sigma$ szerint, $\\rho$ pedig $r$ szerint.",
      "A gamma az értékgörbe görbülete; a kötési ár közelében a legnagyobb, és a lejárat közeledtével nő. Az azonos kötési árú call és put gammája és vegája megegyezik.",
      "Az opció tulajdonosa a volatilitás emelkedésén nyer ($\\mathcal{V} > 0$), mert a kifizetés konvex; a vett call értéke az idővel csökken ($\\Theta < 0$).",
      "Másodrendig $dV \\approx \\Delta\\,dS + \\tfrac{1}{2}\\Gamma(dS)^2 + \\Theta\\,dt + \\mathcal{V}\\,d\\sigma$.",
      "A delta-fedezett opció eredménye $\\tfrac{1}{2}\\Gamma((dS)^2 - \\sigma^2S^2dt)$; abból a követelményből, hogy a kockázatmentes kamatot hozza, $\\Theta + \\tfrac{1}{2}\\sigma^2S^2\\Gamma + rS\\Delta - rV = 0$ adódik.",
    ),
    note("A következő lecke, az „Implikált volatilitás és a volatilitás-mosoly”, megfordítja a kérdést: adott piaci árhoz milyen $\\sigma$ kell a képletbe, és miért függ ez a szám a kötési ártól."),
    lab("/black-scholes", "Vizsgáld a görögök felületeit a részvényár és a lejárat függvényében a Black–Scholes laborban"),
  ],
};
