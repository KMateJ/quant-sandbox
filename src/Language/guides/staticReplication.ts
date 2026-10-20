import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const staticReplication: GuideLessonContent = {
  en: [
    p("The previous lessons priced options inside a model: a tree, geometric Brownian motion, a stochastic variance. This lesson goes the other way. It starts from the call prices quoted in the market and asks what they tell us without any model. Two results answer it. Breeden–Litzenberger reads the risk-neutral distribution of $S_T$ off call prices, and Carr–Madan builds any European payoff from bonds, a forward and options. Both extend the last section of \"Combining positions\" and use the pricing rule from \"Risk-neutral probabilities\"."),

    h("Prices as discounted expectations"),
    p("A **European payoff** is paid only at maturity $T$ and depends only on the price at that date: $X = f(S_T)$. Calls, puts, forwards and the butterfly are all of this kind. By the rule from \"Risk-neutral probabilities\", its price today is the discounted expectation under $\\mathbb{Q}$. Suppose $S_T$ has a **risk-neutral density** $q(K)$ under $\\mathbb{Q}$, so that $\\mathbb{Q}(a < S_T < b) = \\int_a^b q(K)\\,dK$. Then"),
    eq("V_0 = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}[f(S_T)] = e^{-rT}\\int_0^{\\infty} f(K)\\,q(K)\\,dK."),
    p("The variable of integration is called $K$ on purpose: it runs over the possible values of $S_T$, and these will be matched with strikes. If we knew $q$, every European payoff could be priced by one integral. The question is where $q$ comes from."),

    h("The butterfly and the density"),
    p("Take three calls with strikes $K - h$, $K$ and $K + h$, all with the same maturity. Write $C(K)$ for the price today of the call with strike $K$. The butterfly from \"Combining positions\" buys one $K-h$ call, sells two $K$ calls and buys one $K+h$ call. Its payoff is a tent of height $h$ centred at $K$ and zero outside $(K-h, K+h)$. Divide the position by $h^2$: the tent now has height $1/h$ and base $2h$, so its area is 1."),
    p("As $h$ shrinks the tent becomes a narrow spike of area 1 at $K$. Its expected payoff is approximately $q(K)$ times its area, so it tends to the density $q(K)$. Pricing the scaled butterfly by the formula above gives"),
    eq("\\frac{C(K-h) - 2C(K) + C(K+h)}{h^2} \\;\\longrightarrow\\; e^{-rT}\\,q(K) \\qquad (h \\to 0)."),
    p("The left-hand side is the central difference that approximates a second derivative, so the limit is $\\partial^2 C/\\partial K^2$."),

    h("The Breeden–Litzenberger formula"),
    p("The same result follows by differentiating the call price directly. Write it as an integral over the density:"),
    eq("C(K) = e^{-rT}\\int_K^{\\infty} (s - K)\\,q(s)\\,ds."),
    p("Differentiate with respect to $K$. The integrand vanishes at the lower limit $s = K$, so only the derivative of $(s - K)$ remains:"),
    eq("\\frac{\\partial C}{\\partial K} = -e^{-rT}\\int_K^{\\infty} q(s)\\,ds = -e^{-rT}\\,\\mathbb{Q}(S_T > K)."),
    p("So the slope of the call price across strikes is minus the discounted probability of exercise. Differentiating once more removes the integral:"),
    eq("\\frac{\\partial^2 C}{\\partial K^2} = e^{-rT}\\,q(K) \\quad\\Longleftrightarrow\\quad q(K) = e^{rT}\\,\\frac{\\partial^2 C}{\\partial K^2}."),
    note("**Breeden–Litzenberger:** the risk-neutral density of $S_T$ is $q(K) = e^{rT}\\,\\partial^2 C/\\partial K^2$. It is read directly from call prices across strikes, with no model for how the price moves."),
    {
      kind: "check",
      id: "static-replication/bl-identity",
      prompt: "Which identity is the Breeden–Litzenberger formula?",
      answer: { type: "choice", options: ["$\\partial^2 C/\\partial K^2 = e^{-rT}q(K)$", "$\\partial C/\\partial K = e^{-rT}q(K)$", "$\\partial^2 C/\\partial S^2 = e^{-rT}q(K)$", "$\\partial C/\\partial K = N(d_1)$"], correct: 0 },
      explain: "The first strike derivative is $-e^{-rT}\\mathbb{Q}(S_T > K)$; differentiating once more gives the discounted density. The second derivative in $S$ is gamma, a different object.",
    },

    h("The implied density and the skew"),
    p("In \"The Black–Scholes formula\" a single $\\sigma$ gives every call price, and the density read off them is the lognormal density of geometric Brownian motion. \"Implied volatility and the volatility smile\" showed that markets quote a different implied volatility for each strike, typically higher for low strikes. Feeding such prices into Breeden–Litzenberger gives a density that is no longer lognormal: higher prices for low-strike options mean more risk-neutral probability of large falls, so the left tail is fatter."),
    p("An example: with $S_0 = 100$, $r = 5\\%$, $T = 1$ and a flat $\\sigma = 20\\%$, the probability $\\mathbb{Q}(S_T < 80)$ is about 10.0%. Let the implied volatility instead be $\\sigma(K) = 0.2 - 0.2\\ln(K/F)$, with forward price $F = S_0e^{rT}$. The density read off these prices gives about 11.9%."),
    p("The figure fixes $S_0 = 100$, $r = 5\\%$ and $T = 1$. Sliders set the volatility $\\sigma$, a skew that moves the implied volatility linearly in $\\ln(K/F)$ (0 means flat Black–Scholes), and the centre $K$ and half-width $h$ of a butterfly. The chart shows the density $q(K)$ read off the call prices; with a non-zero skew the lognormal density of the flat-volatility model is drawn for comparison. The readouts give the butterfly price divided by $h^2$, the exact value $e^{-rT}q(K)$ it approximates, and the total mass $\\int q\\,dK$, which stays close to 1. Shrink $h$ and watch the butterfly approach the density value; then make the skew negative and watch the left tail grow."),
    figure("bl-density"),
    p("With $\\sigma = 20\\%$, no skew and centre 100, the exact value is $e^{-rT}q(100) \\approx 0.01876$. A butterfly with $h = 5$ gives 0.01867 and one with $h = 1$ gives 0.01876."),
    {
      kind: "check",
      id: "static-replication/butterfly-density",
      prompt: "With the flat 20% prices above, the 95/100/105 butterfly costs $C(95) - 2C(100) + C(105) \\approx 0.4667$. What estimate of the risk-neutral density $q(100)$ does it give?",
      answer: { type: "number", value: 0.01963, tolerance: 0.0002 },
      explain: "Divide by $h^2 = 25$ to get $0.01867 \\approx e^{-rT}q(100)$, then undo the discounting: $q(100) \\approx e^{0.05} \\cdot 0.01867 \\approx 0.0196$.",
    },

    h("The spanning formula"),
    p("Breeden–Litzenberger turns call prices into a density. Carr–Madan does the reverse: it writes a payoff as a combination of option payoffs. Let $f$ be twice differentiable and fix any level $a > 0$, called the anchor. Taylor's theorem with the remainder written as an integral (one integration by parts) gives, for $S > a$,"),
    eq("f(S) = f(a) + f'(a)(S - a) + \\int_a^S f''(K)\\,(S - K)\\,dK."),
    p("For $S > a$ the factor $(S - K)$ is positive inside the integral and $(S-K)^+ = 0$ for $K > S$, so the integral equals $\\int_a^{\\infty} f''(K)(S-K)^+\\,dK$. The case $S < a$ is the mirror image and produces puts. Both cases combine into"),
    eq("f(S) = f(a) + f'(a)(S - a) + \\int_0^a f''(K)\\,(K - S)^+\\,dK + \\int_a^{\\infty} f''(K)\\,(S - K)^+\\,dK."),
    p("Read it term by term: $f(a)$ zero-coupon bonds, $f'(a)$ forward contracts with delivery price $a$, and at every strike $K$ an amount $f''(K)\\,dK$ of puts below the anchor and calls above it. Taking prices of both sides, with $P(K)$ the put price:"),
    eq("V_0 = e^{-rT}f(a) + e^{-rT}f'(a)(F - a) + \\int_0^a f''(K)\\,P(K)\\,dK + \\int_a^{\\infty} f''(K)\\,C(K)\\,dK."),
    p("Choosing $a = F$ makes the forward cost nothing, and every option in the portfolio is out of the money: puts below $F$, calls above it. The log contract behind a variance swap is replicated exactly this way, with $f''(K) = 1/K^2$."),

    h("Piecewise-linear payoffs"),
    p("If $f$ is made of straight pieces, $f''$ is zero everywhere except at the kinks. At a kink $K_i$ the slope jumps by $c_i$ (slope after minus slope before), and $f''$ acts like a point mass of size $c_i$ there. The integrals collapse into sums, and the portfolio holds finitely many options, $c_i$ of them at each kink. With $a = 0$ there are no puts and we recover the bonds-stock-calls recipe of \"Combining positions\"; with $a$ above the last kink there are only puts."),
    note("**Carr–Madan:** for any anchor $a$, a payoff is $f(a)$ bonds, $f'(a)$ forwards struck at $a$, puts below $a$ and calls above it, with $f''(K)\\,dK$ options at strike $K$. Every choice of $a$ pays the same at $T$, so without arbitrage every choice costs the same."),

    h("A worked example"),
    p("Take the payoff that is 0 below 90, rises with slope 1 from 90 to 100 and stays at 10 above 100. Its kinks are at 90 (slope change $+1$) and 100 (slope change $-1$). Use $S_0 = 100$, $r = 5\\%$, $T = 1$ and Black–Scholes prices with $\\sigma = 20\\%$, so $F = 100e^{0.05} \\approx 105.13$."),
    list(
      "Calls ($a = 0$): $f(0) = 0$ and $f'(0) = 0$, so long one 90 call and short one 100 call, the bull call spread. Cost $16.70 - 10.45 = 6.25$.",
      "Around $F$ ($a = F$): $f(F) = 10$ and $f'(F) = 0$; both kinks lie below $F$, so they become puts. Hold 10 bonds, long one 90 put and short one 100 put. Cost $10 \\times 0.9512 + 2.31 - 5.57 = 6.25$.",
    ),
    p("Check the second portfolio at $S_T = 95$: $10 + 0 - 5 = 5$, the target value. The two portfolios have the same payoff for every $S_T$, so they have the same price; their equality is put–call parity applied at each kink. A kink above $F$ would have been replicated with a call."),
    {
      kind: "worked",
      title: "A bull spread replicated around the forward",
      steps: [
        { text: "Target: the 100/110 bull call spread, slope 1 between 100 and 110. Same market, so $F \\approx 105.13$. At the anchor $a = F$ the payoff is", tex: "f(F) = F - 100", result: { value: 5.13, tolerance: 0.01 } },
        { text: "Hold $f(F)$ zero-coupon bonds and $f'(F) = 1$ forward struck at $F$, which costs nothing. The bonds cost", tex: "e^{-rT}f(F)", result: { value: 4.88, tolerance: 0.01 } },
        { text: "The kink at 100 lies below $F$ (slope change $+1$), so buy one 100 put:", tex: "P(100)", result: { value: 5.57, tolerance: 0.01 } },
        { text: "The kink at 110 lies above $F$ (slope change $-1$), so sell one 110 call:", tex: "C(110)", result: { value: 6.04, tolerance: 0.01 } },
        { text: "Total cost of the portfolio around $F$:", tex: "4.88 + 5.57 - 6.04", result: { value: 4.41, tolerance: 0.01 } },
        { text: "It matches the calls-only recipe ($a = 0$), as it must:", tex: "C(100) - C(110) = 10.45 - 6.04", result: { value: 4.41, tolerance: 0.01 } },
      ],
    },

    h("Finitely many strikes"),
    p("Listed options trade only at a grid of strikes, say every 5. A payoff with kinks between grid points, or with curved pieces, can then be replicated only approximately: the portfolio follows the straight-line interpolation of $f$ between neighbouring strikes. The same limitation affects the density, because $\\partial^2 C/\\partial K^2$ must be estimated from finitely many prices, and the far tails, where few strikes are quoted, are the least reliable part."),

    h("Summary"),
    list(
      "The price of a European payoff $f(S_T)$ is $e^{-rT}\\int f(K)\\,q(K)\\,dK$, with $q$ the risk-neutral density.",
      "A butterfly scaled by $1/h^2$ prices a narrow spike; in the limit $q(K) = e^{rT}\\,\\partial^2 C/\\partial K^2$, and $\\partial C/\\partial K = -e^{-rT}\\mathbb{Q}(S_T > K)$.",
      "The density implied by a negative skew has a fatter left tail than the lognormal.",
      "Carr–Madan writes any payoff as bonds, a forward and options weighted by $f''$; for piecewise-linear payoffs this is one option position per kink, sized by the slope change.",
      "Different anchors give different portfolios with the same payoff and therefore the same price; with a finite strike grid the replication is approximate.",
    ),
    lab("/payoff?lab=replicate", "Draw a payoff and compare its three replicating portfolios in the Replicate payoff tab of the Payoff lab"),
  ],

  hu: [
    p("Az előző leckék egy modellen belül árazták az opciókat: binomiális fában, geometriai Brown-mozgással, sztochasztikus varianciával. Ez a lecke fordítva halad. A piacon jegyzett call-árakból indul ki, és azt kérdezi, mit árulnak el ezek modell nélkül. Két eredmény ad választ. A Breeden–Litzenberger-formula a call-árakból olvassa ki $S_T$ kockázatsemleges eloszlását, a Carr–Madan-felbontás pedig bármely európai kifizetést kötvényekből, határidős ügyletből és opciókból rak össze. Mindkettő a „Pozíciók kombinálása” lecke utolsó szakaszát viszi tovább, és a „Kockázatsemleges valószínűségek” lecke árazási szabályát használja."),

    h("Az ár mint diszkontált várható érték"),
    p("Egy **európai kifizetés** csak a $T$ lejáratkor esedékes, és csak az akkori árfolyamtól függ: $X = f(S_T)$. Ilyen a call, a put, a határidős ügylet és a pillangó is. A „Kockázatsemleges valószínűségek” lecke szabálya szerint a mai ára a $\\mathbb{Q}$ szerinti diszkontált várható érték. Tegyük fel, hogy $S_T$-nek $\\mathbb{Q}$ alatt van egy $q(K)$ **kockázatsemleges sűrűségfüggvénye**, azaz $\\mathbb{Q}(a < S_T < b) = \\int_a^b q(K)\\,dK$. Ekkor"),
    eq("V_0 = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}[f(S_T)] = e^{-rT}\\int_0^{\\infty} f(K)\\,q(K)\\,dK."),
    p("Az integrálási változót szándékosan hívjuk $K$-nak: $S_T$ lehetséges értékein fut végig, és ezeket kötési árakkal fogjuk párba állítani. Ha ismernénk $q$-t, minden európai kifizetés árát egyetlen integrál adná meg. A kérdés az, honnan vesszük $q$-t."),

    h("A pillangó és a sűrűség"),
    p("Vegyünk három azonos lejáratú callt $K - h$, $K$ és $K + h$ kötési árral, és jelölje $C(K)$ a $K$ kötési árú call mai árát. A „Pozíciók kombinálása” lecke pillangója vesz egy $K-h$-s callt, elad két $K$-s callt és vesz egy $K+h$-s callt. Kifizetése egy $K$ körüli, $h$ magasságú sátor, amely a $(K-h, K+h)$ intervallumon kívül nulla. Osszuk el a pozíciót $h^2$-tel: a sátor magassága $1/h$, alapja $2h$, a területe tehát 1."),
    p("Ahogy $h$ csökken, a sátor egy 1 területű keskeny tüskévé válik $K$-ban. Várható kifizetése közelítőleg $q(K)$ és a terület szorzata, így a $q(K)$ sűrűséghez tart. A skálázott pillangót a fenti képlettel árazva"),
    eq("\\frac{C(K-h) - 2C(K) + C(K+h)}{h^2} \\;\\longrightarrow\\; e^{-rT}\\,q(K) \\qquad (h \\to 0)."),
    p("A bal oldal a második deriváltat közelítő centrális differencia, a határérték tehát $\\partial^2 C/\\partial K^2$."),

    h("A Breeden–Litzenberger-formula"),
    p("Ugyanez az eredmény a call-ár közvetlen deriválásával is kijön. Írjuk fel a call árát a sűrűséggel:"),
    eq("C(K) = e^{-rT}\\int_K^{\\infty} (s - K)\\,q(s)\\,ds."),
    p("Deriváljunk $K$ szerint. Az integrandus az $s = K$ alsó határon nulla, így csak $(s - K)$ deriváltja marad:"),
    eq("\\frac{\\partial C}{\\partial K} = -e^{-rT}\\int_K^{\\infty} q(s)\\,ds = -e^{-rT}\\,\\mathbb{Q}(S_T > K)."),
    p("A call-ár kötési ár szerinti meredeksége tehát a lehívás diszkontált valószínűségének ellentettje. Még egyszer deriválva eltűnik az integrál:"),
    eq("\\frac{\\partial^2 C}{\\partial K^2} = e^{-rT}\\,q(K) \\quad\\Longleftrightarrow\\quad q(K) = e^{rT}\\,\\frac{\\partial^2 C}{\\partial K^2}."),
    note("**Breeden–Litzenberger:** $S_T$ kockázatsemleges sűrűsége $q(K) = e^{rT}\\,\\partial^2 C/\\partial K^2$. Közvetlenül a különböző kötési árú call-árakból olvasható ki, az árfolyam mozgására vonatkozó modell nélkül."),
    {
      kind: "check",
      id: "static-replication/bl-identity",
      prompt: "Melyik azonosság a Breeden–Litzenberger-formula?",
      answer: { type: "choice", options: ["$\\partial^2 C/\\partial K^2 = e^{-rT}q(K)$", "$\\partial C/\\partial K = e^{-rT}q(K)$", "$\\partial^2 C/\\partial S^2 = e^{-rT}q(K)$", "$\\partial C/\\partial K = N(d_1)$"], correct: 0 },
      explain: "A kötési ár szerinti első derivált $-e^{-rT}\\mathbb{Q}(S_T > K)$; még egyszer deriválva a diszkontált sűrűséget kapjuk. Az $S$ szerinti második derivált a gamma, az más mennyiség.",
    },

    h("Az implikált sűrűség és a ferdeség"),
    p("„A Black–Scholes-képlet” leckében egyetlen $\\sigma$ adja az összes call-árat, és a belőlük kiolvasott sűrűség a geometriai Brown-mozgás lognormális sűrűsége. Az „Implikált volatilitás és a volatilitás-mosoly” lecke megmutatta, hogy a piac minden kötési árhoz más implikált volatilitást jegyez, jellemzően magasabbat az alacsony kötési áraknál. Ha ilyen árakat teszünk a Breeden–Litzenberger-formulába, a sűrűség már nem lognormális: a drágább alacsony kötési árú opciók nagy esések nagyobb kockázatsemleges valószínűségét jelentik, vagyis a bal oldali szél vastagabb."),
    p("Egy példa: $S_0 = 100$, $r = 5\\%$, $T = 1$ és állandó $\\sigma = 20\\%$ mellett $\\mathbb{Q}(S_T < 80)$ körülbelül 10,0%. Ha viszont az implikált volatilitás $\\sigma(K) = 0{,}2 - 0{,}2\\ln(K/F)$, ahol $F = S_0e^{rT}$ a határidős árfolyam, akkor az árakból kiolvasott sűrűség körülbelül 11,9%-ot ad."),
    p("Az ábrán $S_0 = 100$, $r = 5\\%$ és $T = 1$ rögzített. A csúszkák a $\\sigma$ volatilitást, egy ferdeséget (az implikált volatilitás $\\ln(K/F)$-ben lineárisan változik; 0 az állandó volatilitású Black–Scholes-eset), valamint egy pillangó $K$ középpontját és $h$ félszélességét állítják. A grafikon a call-árakból kiolvasott $q(K)$ sűrűséget mutatja; nem nulla ferdeségnél összehasonlításként az állandó volatilitású modell lognormális sűrűsége is látszik. A kijelzők a $h^2$-tel osztott pillangóárat, az általa közelített pontos $e^{-rT}q(K)$ értéket és a teljes $\\int q\\,dK$ tömeget mutatják, amely 1 közelében marad. Csökkentsd $h$-t, és figyeld, ahogy a pillangó a sűrűség értékéhez közelít; utána állíts negatív ferdeséget, és nézd, ahogy a bal oldali szél megvastagszik."),
    figure("bl-density"),
    p("$\\sigma = 20\\%$, nulla ferdeség és 100-as középpont mellett a pontos érték $e^{-rT}q(100) \\approx 0{,}01876$. A $h = 5$ félszélességű pillangó 0,01867-et, a $h = 1$-es 0,01876-ot ad."),
    {
      kind: "check",
      id: "static-replication/butterfly-density",
      prompt: "A fenti, állandó 20%-os árakkal a 95/100/105-ös pillangó ára $C(95) - 2C(100) + C(105) \\approx 0{,}4667$. Milyen becslést ad a $q(100)$ kockázatsemleges sűrűségre?",
      answer: { type: "number", value: 0.01963, tolerance: 0.0002 },
      explain: "$h^2 = 25$-tel osztva $0{,}01867 \\approx e^{-rT}q(100)$, majd a diszkontálást visszacsinálva $q(100) \\approx e^{0{,}05} \\cdot 0{,}01867 \\approx 0{,}0196$.",
    },

    h("A feszítési képlet"),
    p("A Breeden–Litzenberger-formula call-árakból sűrűséget csinál. A Carr–Madan-felbontás a fordítottját teszi: egy kifizetést opciók kifizetéseinek kombinációjaként ír fel. Legyen $f$ kétszer differenciálható, és rögzítsünk egy tetszőleges $a > 0$ szintet, a horgonyt. Az integrál alakú maradéktagos Taylor-formula (egyetlen parciális integrálás) $S > a$ esetén ezt adja:"),
    eq("f(S) = f(a) + f'(a)(S - a) + \\int_a^S f''(K)\\,(S - K)\\,dK."),
    p("Ha $S > a$, az integrálon belül $(S - K)$ pozitív, $K > S$ esetén pedig $(S-K)^+ = 0$, így az integrál egyenlő $\\int_a^{\\infty} f''(K)(S-K)^+\\,dK$-val. Az $S < a$ eset ennek tükörképe, és putokat ad. A két eset együtt:"),
    eq("f(S) = f(a) + f'(a)(S - a) + \\int_0^a f''(K)\\,(K - S)^+\\,dK + \\int_a^{\\infty} f''(K)\\,(S - K)^+\\,dK."),
    p("Tagonként olvasva: $f(a)$ darab zérókuponos kötvény, $f'(a)$ darab $a$ szállítási árú határidős ügylet, és minden $K$ kötési árnál $f''(K)\\,dK$ mennyiségű opció, a horgony alatt put, fölötte call. Mindkét oldal árát véve, $P(K)$-val jelölve a put árát:"),
    eq("V_0 = e^{-rT}f(a) + e^{-rT}f'(a)(F - a) + \\int_0^a f''(K)\\,P(K)\\,dK + \\int_a^{\\infty} f''(K)\\,C(K)\\,dK."),
    p("Az $a = F$ választásnál a határidős ügylet semmibe sem kerül, és a portfólió minden opciója kiesik a pénzből: $F$ alatt putok, fölötte callok. A varianciaswap mögötti log-szerződést pontosan így lehet replikálni, $f''(K) = 1/K^2$ súlyokkal."),

    h("Szakaszonként lineáris kifizetések"),
    p("Ha $f$ egyenes szakaszokból áll, $f''$ a töréspontokon kívül mindenhol nulla. Egy $K_i$ töréspontban a meredekség $c_i$-vel ugrik (utána mínusz előtte), és $f''$ ott egy $c_i$ nagyságú pontszerű tömegként viselkedik. Az integrálok összegekké válnak, a portfólió véges sok opciót tartalmaz, minden töréspontban $c_i$ darabot. Az $a = 0$ választásnál nincs put, és visszakapjuk a „Pozíciók kombinálása” lecke kötvény-részvény-call receptjét; ha $a$ az utolsó töréspont fölött van, csak putok maradnak."),
    note("**Carr–Madan:** tetszőleges $a$ horgonyra egy kifizetés $f(a)$ kötvény, $f'(a)$ darab $a$ árú határidős ügylet, $a$ alatt putok és fölötte callok, a $K$ kötési árnál $f''(K)\\,dK$ opcióval. Minden $a$ ugyanazt fizeti $T$-ben, ezért arbitrázsmentes piacon mindegyik ugyanannyiba kerül."),

    h("Számpélda"),
    p("Vegyük azt a kifizetést, amely 90 alatt 0, 90 és 100 között 1-es meredekséggel nő, 100 fölött pedig 10. Töréspontjai 90-nél ($+1$ meredekségváltozás) és 100-nál ($-1$) vannak. Legyen $S_0 = 100$, $r = 5\\%$, $T = 1$, és számoljunk $\\sigma = 20\\%$-os Black–Scholes-árakkal, így $F = 100e^{0{,}05} \\approx 105{,}13$."),
    list(
      "Callokkal ($a = 0$): $f(0) = 0$ és $f'(0) = 0$, tehát egy vett 90-es és egy eladott 100-as call, vagyis bull call spread. Ára $16{,}70 - 10{,}45 = 6{,}25$.",
      "$F$ körül ($a = F$): $f(F) = 10$ és $f'(F) = 0$; mindkét töréspont $F$ alatt van, ezért putok lesznek belőlük. 10 kötvény, egy vett 90-es put és egy eladott 100-as put. Ára $10 \\cdot 0{,}9512 + 2{,}31 - 5{,}57 = 6{,}25$.",
    ),
    p("Ellenőrizzük a második portfóliót $S_T = 95$-nél: $10 + 0 - 5 = 5$, épp a célérték. A két portfólió minden $S_T$-re ugyanannyit fizet, ezért az áruk is azonos; ez az egyezés a töréspontonként alkalmazott put–call paritás. Egy $F$ fölötti töréspontot callal replikáltunk volna."),
    {
      kind: "worked",
      title: "Egy bull spread replikálása a határidős ár körül",
      steps: [
        { text: "Cél: a 100/110-es bull call spread, 100 és 110 között 1-es meredekséggel. Ugyanaz a piac, így $F \\approx 105{,}13$. Az $a = F$ horgonynál a kifizetés", tex: "f(F) = F - 100", result: { value: 5.13, tolerance: 0.01 } },
        { text: "Tartsunk $f(F)$ zérókuponos kötvényt és $f'(F) = 1$ darab $F$ szállítási árú határidős ügyletet, amely ingyenes. A kötvények ára", tex: "e^{-rT}f(F)", result: { value: 4.88, tolerance: 0.01 } },
        { text: "A 100-as töréspont $F$ alatt van ($+1$ meredekségváltozás), ezért veszünk egy 100-as putot:", tex: "P(100)", result: { value: 5.57, tolerance: 0.01 } },
        { text: "A 110-es töréspont $F$ fölött van ($-1$ meredekségváltozás), ezért eladunk egy 110-es callt:", tex: "C(110)", result: { value: 6.04, tolerance: 0.01 } },
        { text: "Az $F$ körüli portfólió teljes költsége:", tex: "4{,}88 + 5{,}57 - 6{,}04", result: { value: 4.41, tolerance: 0.01 } },
        { text: "Megegyezik a csak callokból álló ($a = 0$) recepttel, ahogy kell:", tex: "C(100) - C(110) = 10{,}45 - 6{,}04", result: { value: 4.41, tolerance: 0.01 } },
      ],
    },

    h("Véges sok kötési ár"),
    p("Tőzsdén csak egy rácson, például ötösével jegyeznek kötési árakat. A rácspontok közé eső töréspontú vagy görbe szakaszokat tartalmazó kifizetés ezért csak közelítőleg replikálható: a portfólió $f$-nek a szomszédos kötési árak közötti lineáris interpolációját követi. Ugyanez a korlát érinti a sűrűséget is, mert $\\partial^2 C/\\partial K^2$-t véges sok árból kell becsülni, és a szélek, ahol kevés kötési árat jegyeznek, a legkevésbé megbízhatók."),

    h("Összefoglalás"),
    list(
      "Egy $f(S_T)$ európai kifizetés ára $e^{-rT}\\int f(K)\\,q(K)\\,dK$, ahol $q$ a kockázatsemleges sűrűség.",
      "Az $1/h^2$-tel skálázott pillangó egy keskeny tüskét áraz; a határértékben $q(K) = e^{rT}\\,\\partial^2 C/\\partial K^2$, továbbá $\\partial C/\\partial K = -e^{-rT}\\mathbb{Q}(S_T > K)$.",
      "Negatív ferdeség mellett az implikált sűrűség bal oldali széle vastagabb a lognormálisnál.",
      "A Carr–Madan-felbontás bármely kifizetést kötvényekből, határidős ügyletből és $f''$-vel súlyozott opciókból rak össze; szakaszonként lineáris kifizetésnél töréspontonként egy opciópozíció, a meredekségváltozásnyi mennyiséggel.",
      "Különböző horgonyok különböző portfóliókat adnak ugyanazzal a kifizetéssel, tehát ugyanazzal az árral; véges kötésiár-rácson a replikáció közelítő.",
    ),
    lab("/payoff?lab=replicate", "Rajzolj kifizetést, és hasonlítsd össze a három replikáló portfóliót a Payoff labor Payoff replikálás lapján"),
  ],
};
