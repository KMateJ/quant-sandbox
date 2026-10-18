import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const durationConvexity: GuideLessonContent = {
  en: [
    p("In \"Bond prices and yields\" the price of a bond was a decreasing, convex function of its yield. This lesson puts numbers on that curve: **duration** measures its slope, **convexity** its curvature. Together they tell you how much a bond's price changes when yields move, without repricing it. The notation is the same: face value $F = 100$, annual coupons at rate $c$, maturity $T$, yield to maturity $y$ with annual compounding, price $P$."),

    h("Interest-rate risk"),
    p("A bond's cash flows are fixed, but its price is not: when market yields rise, the same cash flows are discounted more heavily and the price falls. This exposure is **interest-rate risk**. Two bonds can react very differently to the same change in yield; a 30-year bond loses far more than a 1-year bill. We want one number that captures this sensitivity."),

    h("Macaulay duration"),
    p("Write $CF_t$ for the cash flow at year $t$ (so $CF_t = cF$ for $t < T$ and $CF_T = cF + F$). Each cash flow contributes a present value $PV_t = CF_t/(1+y)^t$ to the price, and these contributions add up to $P$. The **Macaulay duration** is the average payment time, weighted by these present values:"),
    eq("D = \\sum_{t=1}^{T} t\\,\\frac{PV_t}{P}, \\qquad PV_t = \\frac{CF_t}{(1+y)^t}."),
    p("Think of a seesaw: put a weight $PV_t$ at distance $t$ along a beam; $D$ is the point where the beam balances. For a coupon bond the coupons pull the balance point earlier than $T$, so $D < T$. A **zero-coupon bond** has only one cash flow, all the weight sits at $T$, and its duration equals its maturity: $D = T$."),

    h("Modified duration"),
    p("Differentiate the price with respect to the yield. Each term $(1+y)^{-t}$ has derivative $-t\\,(1+y)^{-t-1}$, so"),
    eq("\\frac{dP}{dy} = -\\sum_{t=1}^{T} t\\,\\frac{CF_t}{(1+y)^{t+1}} = -\\frac{1}{1+y}\\sum_{t=1}^{T} t\\,PV_t = -\\frac{D}{1+y}\\,P."),
    p("The factor in front is the **modified duration**:"),
    eq("D_{mod} = \\frac{D}{1+y}, \\qquad \\frac{dP}{dy} = -D_{mod}\\,P."),
    p("For a small change $\\Delta y$ in yield, a first-order Taylor expansion gives the relative price change:"),
    eq("\\frac{\\Delta P}{P} \\approx -D_{mod}\\,\\Delta y."),
    p("A bond with $D_{mod} = 7.7$ loses about 7.7% of its value when its yield rises by one percentage point. Geometrically, this approximation replaces the price–yield curve by its tangent at the current yield, exactly as delta replaced the option value curve by its tangent in \"Delta and hedging\"."),
    note("Modified duration $D_{mod} = D/(1+y)$ is the percentage price change per unit change in yield: $\\Delta P/P \\approx -D_{mod}\\,\\Delta y$."),

    h("Dollar duration"),
    p("Portfolio managers often need the change in money rather than in percent. The **dollar duration** is $D_{mod}\\,P$, the price change per unit of yield; divided by 10 000 it gives the change per basis point (0.01%), often called DV01. Dollar durations add across positions, which is how a bond portfolio's interest-rate exposure is aggregated and hedged."),

    h("Convexity"),
    p("The tangent ignores the bend of the curve. Differentiating once more,"),
    eq("\\frac{d^2P}{dy^2} = \\sum_{t=1}^{T} t(t+1)\\,\\frac{CF_t}{(1+y)^{t+2}} > 0,"),
    p("and the **convexity** is this second derivative per unit of price:"),
    eq("C = \\frac{1}{P}\\,\\frac{d^2P}{dy^2}."),
    p("A second-order Taylor expansion then gives"),
    eq("\\frac{\\Delta P}{P} \\approx -D_{mod}\\,\\Delta y + \\tfrac{1}{2}\\,C\\,(\\Delta y)^2."),
    p("This mirrors the gamma term $\\tfrac{1}{2}\\Gamma(dS)^2$ of the delta hedge. Because $C > 0$ and $(\\Delta y)^2 \\ge 0$, the correction is always positive: when yields fall the bond gains more than duration predicts, and when they rise it loses less. Between two bonds with the same price and duration, the holder prefers the one with higher convexity, and in markets that extra protection is usually paid for with a slightly lower yield. Convexity grows roughly with the square of maturity, so it matters most for long bonds and large yield moves."),

    h("A worked example"),
    p("Take $c = 5\\%$, $T = 10$, $y_0 = 5\\%$. The bond trades at par, $P_0 = 100$. Summing the weighted payment times gives"),
    eq("D \\approx 8.108, \\qquad D_{mod} = \\frac{8.108}{1.05} \\approx 7.722, \\qquad C \\approx 75.0."),
    p("The dollar duration is about 772, so one basis point moves the price by about 0.077. Now shift the yield by one percentage point:"),
    list(
      "$\\Delta y = +1\\%$: the true price is 92.64, a change of $-7.36$. Duration alone predicts $-7.72$; adding convexity, $100\\,(-0.07722 + \\tfrac{1}{2}\\cdot 75.0 \\cdot 0.0001) \\approx -7.35$.",
      "$\\Delta y = -1\\%$: the true price is 108.11, a change of $+8.11$. Duration alone predicts $+7.72$; with convexity, $+8.10$.",
    ),
    p("The tangent overstates the loss and understates the gain, by about 0.36 and 0.39; the convexity term $\\tfrac{1}{2}C(\\Delta y)^2 P_0 \\approx 0.375$ closes almost all of the gap. For comparison, a 10-year zero at 5% has $D = 10$ and $D_{mod} \\approx 9.52$: with no coupons to pull the weight forward, it is more sensitive than the coupon bond."),
    p("The figure plots the true price against yields within 4 percentage points of $y_0$, together with the duration (tangent) approximation $P_0(1 - D_{mod}\\Delta y)$ and the duration-plus-convexity approximation $P_0(1 - D_{mod}\\Delta y + \\tfrac{1}{2}C\\Delta y^2)$. The readouts give $D$, $D_{mod}$, $C$ and, for $\\Delta y = \\pm 1\\%$, the true price change next to both approximations. Note that the tangent always lies below the true curve. Increase $T$ and watch duration and convexity grow and the tangent drift away faster; lower $c$ towards 0 and the Macaulay duration approaches $T$."),
    figure("duration-convexity"),

    h("Duration as a balance point"),
    p("Put each cash flow on a beam at its payment date, with a weight equal to its present value. The Macaulay duration is the point where the beam balances, because it is the present-value-weighted average time. In the figure, raise the yield and watch the fulcrum slide towards today: distant payments are discounted more, so they weigh less. Set the coupon to zero and the fulcrum sits exactly at maturity, as for any zero-coupon bond."),
    figure("duration-balance"),

    h("Summary"),
    list(
      "Macaulay duration $D$ is the present-value-weighted average time of a bond's cash flows; for a zero it equals the maturity.",
      "Modified duration $D_{mod} = D/(1+y)$ gives the first-order price change $\\Delta P/P \\approx -D_{mod}\\Delta y$, the tangent to the price–yield curve.",
      "Convexity $C = P^{-1}\\,d^2P/dy^2$ adds the second-order term $\\tfrac{1}{2}C(\\Delta y)^2$, which is always in the holder's favour.",
      "Dollar duration $D_{mod}P$ measures the money at risk per unit of yield and adds across a portfolio.",
    ),
    note("Duration treats all cash flows as discounted at one yield, so it measures a parallel shift. The next lesson lets each maturity have its own rate."),
    lab("/duration-convexity", "Compare true price changes with the approximations in the Duration and Convexity lab"),
  ],

  hu: [
    p("A „Kötvényárak és hozamok” leckében a kötvény ára a hozam csökkenő, konvex függvénye volt. Ez a lecke számokkal írja le ezt a görbét: a **duráció** a meredekségét, a **konvexitás** a görbületét méri. Együtt megmondják, mennyit változik a kötvény ára, ha a hozamok elmozdulnak, újraárazás nélkül. A jelölések változatlanok: $F = 100$ névérték, $c$ rátájú éves kuponok, $T$ lejárat, éves kamatozású $y$ lejáratig számított hozam, $P$ ár."),

    h("Kamatkockázat"),
    p("A kötvény pénzáramlásai rögzítettek, az ára viszont nem: ha a piaci hozamok emelkednek, ugyanazokat a pénzáramlásokat erősebben diszkontáljuk, és az ár esik. Ez a **kamatkockázat**. Két kötvény nagyon eltérően reagálhat ugyanarra a hozamváltozásra; egy 30 éves kötvény sokkal többet veszít, mint egy egyéves kincstárjegy. Egyetlen számot keresünk, amely ezt az érzékenységet megragadja."),

    h("Macaulay-duráció"),
    p("Jelölje $CF_t$ a $t$-edik év pénzáramlását (tehát $t < T$ esetén $CF_t = cF$, és $CF_T = cF + F$). Minden pénzáramlás $PV_t = CF_t/(1+y)^t$ jelenértékkel járul hozzá az árhoz, és ezek összege $P$. A **Macaulay-duráció** a kifizetési időpontok átlaga, e jelenértékekkel súlyozva:"),
    eq("D = \\sum_{t=1}^{T} t\\,\\frac{PV_t}{P}, \\qquad PV_t = \\frac{CF_t}{(1+y)^t}."),
    p("Gondolj egy mérleghintára: a gerenda $t$ távolságú pontjára $PV_t$ súlyt teszünk; $D$ az a pont, ahol a gerenda egyensúlyban van. Kuponos kötvénynél a kuponok $T$ elé húzzák az egyensúlyi pontot, így $D < T$. A **zérókuponos kötvénynek** egyetlen pénzáramlása van, minden súly $T$-ben ül, ezért durációja megegyezik a lejáratával: $D = T$."),

    h("Módosított duráció"),
    p("Deriváljuk az árat a hozam szerint. Az $(1+y)^{-t}$ tag deriváltja $-t\\,(1+y)^{-t-1}$, így"),
    eq("\\frac{dP}{dy} = -\\sum_{t=1}^{T} t\\,\\frac{CF_t}{(1+y)^{t+1}} = -\\frac{1}{1+y}\\sum_{t=1}^{T} t\\,PV_t = -\\frac{D}{1+y}\\,P."),
    p("Az elöl álló szorzó a **módosított duráció**:"),
    eq("D_{mod} = \\frac{D}{1+y}, \\qquad \\frac{dP}{dy} = -D_{mod}\\,P."),
    p("Kis $\\Delta y$ hozamváltozásra az elsőrendű Taylor-közelítés a relatív árváltozást adja:"),
    eq("\\frac{\\Delta P}{P} \\approx -D_{mod}\\,\\Delta y."),
    p("Egy $D_{mod} = 7{,}7$ módosított durációjú kötvény értéke kb. 7,7%-kal csökken, ha a hozama egy százalékponttal nő. Geometriailag ez a közelítés az ár–hozam görbét a mai hozamnál húzott érintőjével helyettesíti, pontosan úgy, ahogy a „Delta és fedezés” leckében a delta az opció értékgörbéjét helyettesítette az érintőjével."),
    note("A $D_{mod} = D/(1+y)$ módosított duráció az egységnyi hozamváltozásra jutó százalékos árváltozás: $\\Delta P/P \\approx -D_{mod}\\,\\Delta y$."),

    h("Pénzben mért duráció"),
    p("A portfóliókezelőknek gyakran nem százalékos, hanem pénzben mért változás kell. A **pénzben mért duráció** (dollar duration) $D_{mod}\\,P$, az egységnyi hozamváltozásra jutó árváltozás; 10 000-rel osztva a bázispontonkénti (0,01%) változást adja, ennek szokásos neve DV01. A pénzben mért durációk pozíciók között összeadódnak, így ezekkel összesíthető és fedezhető egy kötvényportfólió kamatkockázata."),

    h("Konvexitás"),
    p("Az érintő nem veszi figyelembe a görbe hajlását. Még egyszer deriválva"),
    eq("\\frac{d^2P}{dy^2} = \\sum_{t=1}^{T} t(t+1)\\,\\frac{CF_t}{(1+y)^{t+2}} > 0,"),
    p("a **konvexitás** pedig ez a második derivált egységnyi árra vetítve:"),
    eq("C = \\frac{1}{P}\\,\\frac{d^2P}{dy^2}."),
    p("A másodrendű Taylor-közelítés ekkor"),
    eq("\\frac{\\Delta P}{P} \\approx -D_{mod}\\,\\Delta y + \\tfrac{1}{2}\\,C\\,(\\Delta y)^2."),
    p("Ez a delta-fedezés $\\tfrac{1}{2}\\Gamma(dS)^2$ gammatagjának megfelelője. Mivel $C > 0$ és $(\\Delta y)^2 \\ge 0$, a korrekció mindig pozitív: ha a hozamok esnek, a kötvény többet nyer, mint amit a duráció jósol, ha emelkednek, kevesebbet veszít. Két azonos árú és durációjú kötvény közül a tulajdonos a nagyobb konvexitásút választja, és a piacon ezt a többletvédelmet általában valamivel alacsonyabb hozammal fizetik meg. A konvexitás nagyjából a lejárat négyzetével nő, ezért hosszú kötvényeknél és nagy hozammozgásoknál számít igazán."),

    h("Számpélda"),
    p("Legyen $c = 5\\%$, $T = 10$, $y_0 = 5\\%$. A kötvény névértéken forog, $P_0 = 100$. A súlyozott kifizetési időket összegezve"),
    eq("D \\approx 8{,}108, \\qquad D_{mod} = \\frac{8{,}108}{1{,}05} \\approx 7{,}722, \\qquad C \\approx 75{,}0."),
    p("A pénzben mért duráció kb. 772, így egy bázispont kb. 0,077-tel mozdítja az árat. Most toljuk el a hozamot egy százalékponttal:"),
    list(
      "$\\Delta y = +1\\%$: a valódi ár 92,64, a változás $-7{,}36$. A duráció egyedül $-7{,}72$-t jósol; konvexitással $100\\,(-0{,}07722 + \\tfrac{1}{2}\\cdot 75{,}0 \\cdot 0{,}0001) \\approx -7{,}35$.",
      "$\\Delta y = -1\\%$: a valódi ár 108,11, a változás $+8{,}11$. A duráció egyedül $+7{,}72$-t jósol; konvexitással $+8{,}10$.",
    ),
    p("Az érintő túlbecsüli a veszteséget és alulbecsüli a nyereséget, kb. 0,36-tal, illetve 0,39-cel; a $\\tfrac{1}{2}C(\\Delta y)^2 P_0 \\approx 0{,}375$ konvexitási tag szinte a teljes különbséget eltünteti. Összehasonlításképp egy 10 éves zérókuponos kötvényre 5%-on $D = 10$ és $D_{mod} \\approx 9{,}52$: mivel nincs kupon, amely előrébb húzná a súlypontot, érzékenyebb a kuponos kötvénynél."),
    p("Az ábra a valódi árat mutatja $y_0$ körül ±4 százalékponton belüli hozamokra, a $P_0(1 - D_{mod}\\Delta y)$ durációs (érintő) és a $P_0(1 - D_{mod}\\Delta y + \\tfrac{1}{2}C\\Delta y^2)$ durációs-konvexitási közelítéssel együtt. A kijelzők $D$-t, $D_{mod}$-ot, $C$-t, valamint $\\Delta y = \\pm 1\\%$ esetén a valódi árváltozást és mellette a két közelítést mutatják. Figyeld meg, hogy az érintő mindig a valódi görbe alatt marad. Növeld $T$-t: a duráció és a konvexitás nő, az érintő gyorsabban távolodik a görbétől; csökkentsd $c$-t 0 felé, és a Macaulay-duráció $T$-hez közelít."),
    figure("duration-convexity"),

    h("A duráció mint egyensúlyi pont"),
    p("Tegyük minden pénzáramot egy mérlegrúdra a kifizetés időpontjába, a jelenértékével megegyező súllyal. A Macaulay-duráció az a pont, ahol a rúd egyensúlyban van, hiszen ez a jelenértékkel súlyozott átlagos idő. Az ábrán emeld a hozamot, és figyeld, ahogy az alátámasztási pont a jelen felé csúszik: a távoli kifizetéseket erősebben diszkontáljuk, így kisebb a súlyuk. Állítsd a kupont nullára: az alátámasztás pontosan a lejáratnál van, ahogy minden zérókuponos kötvénynél."),
    figure("duration-balance"),

    h("Összefoglalás"),
    list(
      "A $D$ Macaulay-duráció a kötvény pénzáramlásainak jelenértékkel súlyozott átlagos időpontja; zérókuponos kötvényre a lejárattal egyenlő.",
      "A $D_{mod} = D/(1+y)$ módosított duráció az elsőrendű árváltozást adja, $\\Delta P/P \\approx -D_{mod}\\Delta y$: ez az ár–hozam görbe érintője.",
      "A $C = P^{-1}\\,d^2P/dy^2$ konvexitás hozzáadja a $\\tfrac{1}{2}C(\\Delta y)^2$ másodrendű tagot, amely mindig a tulajdonosnak kedvez.",
      "A $D_{mod}P$ pénzben mért duráció az egységnyi hozamváltozásra jutó kockázatot méri, és portfólión belül összeadódik.",
    ),
    note("A duráció minden pénzáramlást ugyanazzal a hozammal diszkontál, ezért párhuzamos eltolódást mér. A következő lecke minden lejáratnak saját kamatlábat ad."),
    lab("/duration-convexity", "Hasonlítsd össze a valódi árváltozást a közelítésekkel a Duráció és konvexitás laborban"),
  ],
};
