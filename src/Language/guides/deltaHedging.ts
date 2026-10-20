import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const deltaHedging: GuideLessonContent = {
  en: [
    p("In \"The one-step binomial model\" the number of shares $\\Delta$ in the replicating portfolio appeared as the solution of two equations. This lesson shows that $\\Delta$ is also a sensitivity: how much the option value changes when the stock price moves. That reading turns replication into a practical tool, **hedging**, and leads to a second sensitivity, gamma, which measures how well a hedge holds up. It builds on \"Multi-step trees and backward induction\"."),

    h("Delta in a tree"),
    p("Take one node of a binomial tree. From the current stock price $S$ the stock moves to $S_u = uS$ or $S_d = dS$, and the call is then worth $C_u$ or $C_d$. The replicating portfolio holds $\\Delta$ shares, with"),
    eq("\\Delta = \\frac{C_u - C_d}{S_u - S_d}."),
    p("This is a ratio of changes: change in option value divided by change in stock price. In the worked example of the one-step lesson ($S_0 = 100$, $u = 1.2$, $d = 0.9$, $K = 100$) the call pays 20 or 0 and the stock ends at 120 or 90, so $\\Delta = 20/30 \\approx 0.667$. Each unit of stock movement moves the option by about two thirds of a unit."),

    h("Delta as a derivative"),
    p("Let the time step $\\Delta t$ shrink, as in the multi-step trees. The two prices $S_u$ and $S_d$ move closer to $S$, and the difference quotient above becomes a derivative. Write $C(S, t)$ for the option value as a function of the current stock price and time. Then"),
    eq("\\Delta = \\frac{\\partial C}{\\partial S}."),
    p("Geometrically, $\\Delta$ is the **slope** of the curve $S \\mapsto C(S,t)$ at today's price. For a call this curve is increasing and convex: deep out of the money it is flat (the option is nearly worthless whatever the stock does), deep in the money it runs parallel to the line $S - Ke^{-rT}$. So the delta of a call always lies between 0 and 1:"),
    eq("0 \\le \\Delta_{\\text{call}} \\le 1."),
    p("A put has delta between $-1$ and $0$, because its value falls when the stock rises."),

    h("The hedged portfolio"),
    p("Suppose you own one call and want to remove your exposure to small stock moves. Sell $\\Delta$ shares short. The combined position is"),
    eq("\\Pi = C - \\Delta S."),
    p("Over a short interval the stock changes by $dS$. To first order, the call changes by $\\Delta\\,dS$ and the short stock position changes by $-\\Delta\\,dS$, so"),
    eq("d\\Pi \\approx \\Delta\\,dS - \\Delta\\,dS = 0."),
    p("A position with zero first-order sensitivity to the stock is called **delta-neutral**. This is the replicating portfolio of the tree lessons read the other way round: instead of building the option from stock and bond, you cancel the option's stock exposure with stock."),
    note("Delta $\\Delta = \\partial C/\\partial S$ is the number of shares that replicates the option locally. Holding $C - \\Delta S$ removes exposure to small stock moves."),
    {
      kind: "check",
      id: "delta-hedging/hedge-shares",
      prompt: "A dealer has sold 100 calls, each with delta $\\Delta = 0.6$. How many shares must she buy to be delta-neutral?",
      answer: { type: "number", value: 60, tolerance: 0.01 },
      explain: "The short calls have a total delta of $-100 \\cdot 0.6 = -60$, so buying 60 shares brings the position to zero delta.",
    },

    h("Gamma and the hedge error"),
    p("The cancellation above is only first-order. A Taylor expansion of $C$ in $S$, ignoring the passage of time over the short interval, gives"),
    eq("C(S + dS) \\approx C(S) + \\Delta\\,dS + \\tfrac{1}{2}\\,\\Gamma\\,(dS)^2, \\qquad \\Gamma = \\frac{\\partial^2 C}{\\partial S^2}."),
    p("**Gamma** $\\Gamma$ is the curvature of the value curve: how fast delta itself changes when $S$ moves. Substituting into the hedged portfolio, the linear terms cancel and what remains is"),
    eq("d\\Pi \\approx \\tfrac{1}{2}\\,\\Gamma\\,(dS)^2."),
    p("For a long call $\\Gamma > 0$, so the hedged position gains a little on any large move, up or down. The error grows with the square of the move: double the move and the error is four times larger. Gamma is largest for options near the money and close to maturity, where the value curve bends most sharply."),
    {
      kind: "check",
      id: "delta-hedging/gamma-sign",
      prompt: "What is the sign of gamma for a long call?",
      answer: { type: "choice", options: ["Positive", "Negative", "Zero", "Positive below the strike, negative above it"], correct: 0 },
      explain: "The value curve of a call is convex in $S$, so its second derivative $\\Gamma$ is positive everywhere. The delta-hedged long call therefore gains on large moves either way.",
    },
    p("The figure plots the call value against $S$ (with $K = 100$, $r = 5\\%$) together with the tangent line at the current price $S_0$; the tangent's slope is $\\Delta$. The dashed line is the payoff at maturity. The vertical gap between curve and tangent is exactly the hedge error; the readouts show it for a move of 10 up and 10 down. Move $S_0$ and watch $\\Delta$ run from near 0 to near 1; shorten $T$ or lower $\\sigma$ and note that the curve hugs the payoff more tightly, the bend at $K$ sharpens and $\\Gamma$ near the strike rises."),
    figure("delta-tangent"),

    h("A worked example"),
    p("Take $S_0 = 100$, $K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$. The call is worth about 10.45, with $\\Delta \\approx 0.637$ and $\\Gamma \\approx 0.0188$. A dealer who sold 100 calls hedges by buying about 63.7 shares."),
    p("If the stock jumps to 110, the tangent predicts a call value of $10.45 + 0.637 \\cdot 10 \\approx 16.82$, while the true value is about 17.66. The gap is about 0.84 per call. For a drop to 90 the gap is about 1.01. The gamma estimate gives $\\tfrac{1}{2} \\cdot 0.0188 \\cdot 10^2 \\approx 0.94$, between the two. For a move of only 1 the error is about 0.009, a hundred times smaller, as the square law predicts."),
    {
      kind: "worked",
      title: "One rebalancing step after a move to 102",
      steps: [
        { text: "Start from the same call ($S_0 = K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$), held long and hedged by shorting $\\Delta = N(d_1)$ shares:", tex: "\\Delta = N(0.35)", result: { value: 0.6368, tolerance: 0.0005 } },
        { text: "Gamma at the same point:", tex: "\\Gamma = \\frac{\\varphi(d_1)}{S_0\\,\\sigma\\sqrt{T}}", result: { value: 0.01876, tolerance: 0.0001 } },
        { text: "The stock jumps to 102. The gamma term predicts the gain of the hedged position:", tex: "\\tfrac{1}{2}\\,\\Gamma\\,(dS)^2 = \\tfrac{1}{2} \\cdot 0.01876 \\cdot 2^2", result: { value: 0.0375, tolerance: 0.0005 } },
        { text: "Repricing the call exactly at 102 and subtracting the stock leg gives nearly the same:", tex: "C(102) - C(100) - \\Delta \\cdot 2", result: { value: 0.0368, tolerance: 0.0005 } },
        { text: "The new delta is higher, so the hedge must be rebalanced by shorting more shares:", tex: "N\\!\\left(\\frac{\\ln 1.02 + 0.07}{0.2}\\right)", result: { value: 0.6733, tolerance: 0.0005 } },
      ],
    },

    h("Rebalancing"),
    p("Delta changes whenever $S$ or $t$ changes, so a hedge set up today is only correct today. Keeping the position delta-neutral means **rebalancing**: recomputing $\\Delta$ and adjusting the share holding at regular intervals. In the tree this happens at every node, which is exactly what backward induction prescribes."),
    p("In practice rebalancing is discrete, say once a day. Between rebalances the stock moves by a finite amount and the hedge error $\\tfrac{1}{2}\\Gamma(dS)^2$ accumulates. Rebalancing more often makes each error smaller (it is proportional to the square of the stock move), but trading costs grow with the number of trades. Think of steering a car: small, frequent corrections keep you in the lane, but each one costs a little effort. Perfect replication, as assumed in option pricing, corresponds to continuous rebalancing with no trading costs."),

    h("A simulated hedge"),
    p("The figure follows a short call over three months ($S_0 = K = 100$, $\\sigma = 20\\%$, $r = 5\\%$) along one simulated path. The hedged book holds $\\Delta$ shares and rebalances every 1, 5 or 21 trading days; the unhedged book only holds the premium. Press Play to watch both evolve day by day. The unhedged result swings with the stock, while the hedged one stays close to zero. The readouts give the spread of the final result over 200 paths: it grows roughly with the square root of the rebalancing interval, as the $\\tfrac12\\Gamma(dS)^2$ error suggests."),
    figure("hedge-simulation"),

    h("Summary"),
    list(
      "In a tree, $\\Delta = (C_u - C_d)/(S_u - S_d)$ is both the replicating share holding and the sensitivity of the option to the stock.",
      "In the continuous limit $\\Delta = \\partial C/\\partial S$, the slope of the value curve; for a call $0 \\le \\Delta \\le 1$.",
      "The portfolio $C - \\Delta S$ is delta-neutral; its remaining change is $\\tfrac{1}{2}\\Gamma(dS)^2$, with gamma the curvature.",
      "Hedges must be rebalanced; discrete rebalancing leaves an error of about $\\tfrac{1}{2}\\Gamma(dS)^2$ per interval, which shrinks as the intervals get shorter.",
    ),
    note("The next lessons replace the tree with a continuous model of the stock. In that model delta of a call has a closed form, $N(d_1)$."),
    lab("/delta-hedging", "Run a delta hedge step by step in the Delta Hedging lab"),
  ],

  hu: [
    p("„Az egylépéses binomiális modell” leckében a replikáló portfólió $\\Delta$ részvényszáma két egyenlet megoldásaként jelent meg. Ez a lecke megmutatja, hogy $\\Delta$ egyben érzékenység is: mennyit változik az opció értéke, ha a részvényár elmozdul. Ebből az olvasatból lesz a replikációból gyakorlati eszköz, a **fedezés**, és ebből jutunk el egy második érzékenységhez, a gammához, amely azt méri, mennyire tart ki egy fedezés. A lecke a „Többlépéses fák és visszafelé indukció” anyagára épül."),

    h("Delta a binomiális fában"),
    p("Vegyük a binomiális fa egy csomópontját. A pillanatnyi $S$ részvényárból az ár $S_u = uS$-re vagy $S_d = dS$-re lép, az opció értéke ekkor $C_u$ vagy $C_d$. A replikáló portfólió $\\Delta$ darab részvényt tart, ahol"),
    eq("\\Delta = \\frac{C_u - C_d}{S_u - S_d}."),
    p("Ez változások hányadosa: az opció értékének változása osztva a részvényár változásával. Az egylépéses lecke példájában ($S_0 = 100$, $u = 1{,}2$, $d = 0{,}9$, $K = 100$) a vételi opció 20-at vagy 0-t fizet, a részvény 120-on vagy 90-en zár, így $\\Delta = 20/30 \\approx 0{,}667$. A részvény minden egységnyi elmozdulása nagyjából kétharmad egységgel mozdítja az opciót."),

    h("Delta mint derivált"),
    p("Csökkentsük a $\\Delta t$ időlépést, ahogy a többlépéses fáknál. Ekkor $S_u$ és $S_d$ egyre közelebb kerül $S$-hez, és a fenti különbségi hányados deriválttá válik. Jelölje $C(S, t)$ az opció értékét a pillanatnyi részvényár és az idő függvényében. Ekkor"),
    eq("\\Delta = \\frac{\\partial C}{\\partial S}."),
    p("Geometriailag $\\Delta$ az $S \\mapsto C(S,t)$ görbe **meredeksége** a mai árnál. Vételi opciónál ez a görbe növekvő és konvex: mélyen pénzen kívül lapos (az opció szinte semmit sem ér, bármit tesz a részvény), mélyen pénzen belül párhuzamos az $S - Ke^{-rT}$ egyenessel. A call deltája ezért mindig 0 és 1 közé esik:"),
    eq("0 \\le \\Delta_{\\text{call}} \\le 1."),
    p("Az eladási opció deltája $-1$ és $0$ között van, mert értéke csökken, ha a részvény drágul."),

    h("A fedezett portfólió"),
    p("Tegyük fel, hogy van egy vételi opciód, és meg akarod szüntetni a kis részvényár-mozgásokkal szembeni kitettségedet. Shortolj $\\Delta$ darab részvényt. Az együttes pozíció"),
    eq("\\Pi = C - \\Delta S."),
    p("Egy rövid időszak alatt a részvényár $dS$-sel változik. Elsőrendben az opció $\\Delta\\,dS$-sel, a rövid részvénypozíció $-\\Delta\\,dS$-sel változik, így"),
    eq("d\\Pi \\approx \\Delta\\,dS - \\Delta\\,dS = 0."),
    p("Azt a pozíciót, amelynek elsőrendű érzékenysége a részvényárra nulla, **delta-semlegesnek** nevezzük. Ez a fás leckék replikáló portfóliója fordított irányból nézve: ahelyett, hogy részvényből és kötvényből rakjuk össze az opciót, az opció részvénykitettségét részvénnyel semlegesítjük."),
    note("A $\\Delta = \\partial C/\\partial S$ delta az a részvényszám, amely lokálisan replikálja az opciót. A $C - \\Delta S$ pozíció érzéketlen a kis részvényár-mozgásokra."),
    {
      kind: "check",
      id: "delta-hedging/hedge-shares",
      prompt: "Egy árjegyző 100 callt adott el, mindegyik deltája $\\Delta = 0{,}6$. Hány részvényt kell vennie, hogy delta-semleges legyen?",
      answer: { type: "number", value: 60, tolerance: 0.01 },
      explain: "Az eladott callok együttes deltája $-100 \\cdot 0{,}6 = -60$, így 60 részvény megvételével a pozíció deltája nulla lesz.",
    },

    h("Gamma és a fedezési hiba"),
    p("A fenti kioltás csak elsőrendben pontos. $C$ Taylor-sora $S$ szerint, a rövid időszak alatti időmúlást elhanyagolva:"),
    eq("C(S + dS) \\approx C(S) + \\Delta\\,dS + \\tfrac{1}{2}\\,\\Gamma\\,(dS)^2, \\qquad \\Gamma = \\frac{\\partial^2 C}{\\partial S^2}."),
    p("A **gamma** ($\\Gamma$) az értékgörbe görbülete: azt méri, milyen gyorsan változik maga a delta, ha $S$ elmozdul. A fedezett portfólióba helyettesítve a lineáris tagok kiesnek, és ez marad:"),
    eq("d\\Pi \\approx \\tfrac{1}{2}\\,\\Gamma\\,(dS)^2."),
    p("Vételi opció tulajdonosánál $\\Gamma > 0$, így a fedezett pozíció minden nagy mozgáson nyer egy keveset, akár felfelé, akár lefelé. A hiba a mozgás négyzetével nő: kétszer akkora mozgásnál négyszer akkora. A gamma a pénz körüli, lejárathoz közeli opcióknál a legnagyobb, ahol az értékgörbe a legélesebben hajlik."),
    {
      kind: "check",
      id: "delta-hedging/gamma-sign",
      prompt: "Milyen előjelű egy hosszú call gammája?",
      answer: { type: "choice", options: ["Pozitív", "Negatív", "Nulla", "A kötési ár alatt pozitív, fölötte negatív"], correct: 0 },
      explain: "A call értékgörbéje $S$-ben konvex, így a második deriváltja, $\\Gamma$, mindenhol pozitív. A delta-fedezett hosszú call ezért bármelyik irányú nagy mozgáson nyer.",
    },
    p("Az ábra a vételi opció értékét mutatja $S$ függvényében ($K = 100$, $r = 5\\%$), a mai $S_0$ árhoz húzott érintővel együtt; az érintő meredeksége $\\Delta$. A szaggatott vonal a lejáratkori kifizetés. A görbe és az érintő közti függőleges távolság éppen a fedezési hiba; a kijelzők ezt 10 egységnyi emelkedésre és esésre mutatják. Mozgasd $S_0$-t, és figyeld, ahogy $\\Delta$ közel 0-ról közel 1-re nő; csökkentsd $T$-t vagy $\\sigma$-t, és látni fogod, hogy a görbe szorosabban simul a kifizetéshez, a $K$-nál lévő törés élesebb lesz, és a kötési ár körül nő $\\Gamma$."),
    figure("delta-tangent"),

    h("Számpélda"),
    p("Legyen $S_0 = 100$, $K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$. A vételi opció értéke kb. 10,45, $\\Delta \\approx 0{,}637$ és $\\Gamma \\approx 0{,}0188$. Egy árjegyző, aki 100 callt adott el, nagyjából 63,7 részvény megvételével fedez."),
    p("Ha a részvény 110-re ugrik, az érintő $10{,}45 + 0{,}637 \\cdot 10 \\approx 16{,}82$ opcióértéket jósol, a valódi érték viszont kb. 17,66. A különbség opciónként kb. 0,84. 90-re eséskor a különbség kb. 1,01. A gammából adódó becslés $\\tfrac{1}{2} \\cdot 0{,}0188 \\cdot 10^2 \\approx 0{,}94$, a kettő között. Mindössze 1 egységnyi mozgásnál a hiba kb. 0,009, százszor kisebb, ahogy a négyzetes szabály mondja."),
    {
      kind: "worked",
      title: "Egy újrasúlyozási lépés a 102-re ugrás után",
      steps: [
        { text: "Induljunk ugyanabból a callból ($S_0 = K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$), amelyet hosszan tartunk, és $\\Delta = N(d_1)$ részvény shortolásával fedezünk:", tex: "\\Delta = N(0{,}35)", result: { value: 0.6368, tolerance: 0.0005 } },
        { text: "A gamma ugyanitt:", tex: "\\Gamma = \\frac{\\varphi(d_1)}{S_0\\,\\sigma\\sqrt{T}}", result: { value: 0.01876, tolerance: 0.0001 } },
        { text: "A részvény 102-re ugrik. A gammatag megjósolja a fedezett pozíció nyereségét:", tex: "\\tfrac{1}{2}\\,\\Gamma\\,(dS)^2 = \\tfrac{1}{2} \\cdot 0{,}01876 \\cdot 2^2", result: { value: 0.0375, tolerance: 0.0005 } },
        { text: "Ha a callt 102-nél pontosan újraárazzuk, és levonjuk a részvényláb változását, majdnem ugyanezt kapjuk:", tex: "C(102) - C(100) - \\Delta \\cdot 2", result: { value: 0.0368, tolerance: 0.0005 } },
        { text: "Az új delta nagyobb, ezért az újrasúlyozáskor további részvényeket kell shortolni:", tex: "N\\!\\left(\\frac{\\ln 1{,}02 + 0{,}07}{0{,}2}\\right)", result: { value: 0.6733, tolerance: 0.0005 } },
      ],
    },

    h("Újrasúlyozás"),
    p("A delta változik, valahányszor $S$ vagy $t$ változik, ezért a ma beállított fedezés csak ma pontos. A delta-semlegesség fenntartása **újrasúlyozást** igényel: rendszeres időközönként újraszámoljuk $\\Delta$-t, és igazítjuk a részvényállományt. A fában ez minden csomópontban megtörténik, pontosan ezt írja elő a visszafelé indukció."),
    p("A gyakorlatban az újrasúlyozás diszkrét, mondjuk naponta egyszer. Két igazítás között a részvény véges mértékben mozdul el, és a $\\tfrac{1}{2}\\Gamma(dS)^2$ fedezési hiba felhalmozódik. Gyakoribb újrasúlyozással az egyes hibák kisebbek (a részvényár-elmozdulás négyzetével arányosak), viszont a kereskedési költség a tranzakciók számával nő. Gondolj az autóvezetésre: a kicsi, gyakori kormánykorrekciók a sávban tartanak, de mindegyik egy kis erőfeszítésbe kerül. Az opcióárazásban feltételezett tökéletes replikáció a folytonos, költségmentes újrasúlyozásnak felel meg."),

    h("Egy szimulált fedezés"),
    p("Az ábra egy eladott callt követ három hónapon át ($S_0 = K = 100$, $\\sigma = 20\\%$, $r = 5\\%$) egy szimulált pályán. A fedezett könyv $\\Delta$ darab részvényt tart, és 1, 5 vagy 21 kereskedési naponként igazít; a fedezetlen könyv csak a díjat tartja. Nyomd meg a Lejátszás gombot, és figyeld napról napra mindkettőt. A fedezetlen eredmény a részvénnyel együtt leng, a fedezett a nulla közelében marad. A kijelzők 200 pálya végeredményének szórását mutatják: ez nagyjából az újrasúlyozási időköz négyzetgyökével nő, ahogy a $\\tfrac12\\Gamma(dS)^2$ hiba alapján várható."),
    figure("hedge-simulation"),

    h("Összefoglalás"),
    list(
      "A fában $\\Delta = (C_u - C_d)/(S_u - S_d)$ egyszerre a replikáló részvényszám és az opció részvényárra vett érzékenysége.",
      "Folytonos határesetben $\\Delta = \\partial C/\\partial S$, az értékgörbe meredeksége; vételi opcióra $0 \\le \\Delta \\le 1$.",
      "A $C - \\Delta S$ portfólió delta-semleges; a megmaradó változása $\\tfrac{1}{2}\\Gamma(dS)^2$, ahol a gamma a görbület.",
      "A fedezést újra kell súlyozni; diszkrét újrasúlyozásnál intervallumonként kb. $\\tfrac{1}{2}\\Gamma(dS)^2$ hiba marad, amely rövidebb intervallumoknál kisebb.",
    ),
    note("A következő leckék a fát a részvény folytonos modelljével váltják fel. Abban a modellben a call deltájának zárt alakja van: $N(d_1)$."),
    lab("/delta-hedging", "Futtass lépésről lépésre delta-fedezést a Delta-fedezés laborban"),
  ],
};
