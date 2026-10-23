import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const callableBonds: GuideLessonContent = {
  en: [
    p("\"Bond prices and yields\" and \"Duration and convexity\" priced bonds whose cash flows are fixed in advance. Many corporate and agency bonds are not: the issuer may repay them early. This lesson treats that right as an option held by the issuer, shows how it caps the bond's price when yields fall, and explains why such a bond can have negative convexity. Options were introduced in \"Forwards, calls and puts\"; here only the idea of a right without an obligation is needed. Notation: face value $F = 100$, annual coupon $c$, yield $y$ with annual compounding, price $P$."),

    h("The call feature"),
    p("A **callable bond** lets the issuer buy the bond back from the holder at a fixed **call price**, usually par, on or after a first call date. The years before that date are the **call protection** period. Take a 10-year bond with a 6% coupon, callable at 100 after 3 years. If market yields for this issuer fall to 4%, a new 7-year bond would cost the issuer 4% a year instead of 6%. The issuer then calls the old bond at 100 and refinances. If yields rise, the issuer keeps the cheap 6% debt. The holder gets the bad outcome in both directions: low reinvestment rates when the bond is called, and a falling price when it is not."),

    h("A callable bond as a straight bond minus a call"),
    p("Holding the callable bond is the same as holding a **straight bond** with the same coupon and maturity and having sold the issuer a call option on it, with strike equal to the call price:"),
    eq("P_{\\text{callable}} = P_{\\text{straight}} - C_{\\text{call}}."),
    p("The option has value because the future yield is uncertain. A two-state illustration: suppose that in 3 years the yield is either 4% or 8%, each with probability one half, and that money is discounted at 5%. The remaining 7-year bond is then worth $112.00$ or $89.59$. In the low-yield state the issuer calls and pays 100, taking away $12.00$ from the holder; in the high-yield state nothing happens. Today the call is worth about"),
    eq("C_{\\text{call}} \\approx \\frac{\\tfrac{1}{2}\\,(112.00 - 100)}{1.05^{3}} \\approx 5.18."),
    note("A callable bond is a straight bond minus a call option sold to the issuer. The holder is paid for the option through a lower price, which means a higher yield, than on a comparable straight bond."),

    p("Repeat the two-state illustration with a wider range: in 3 years the yield is 3% or 7%, again each with probability one half and discounting at 5%."),
    {
      kind: "worked",
      title: "Two-state call value with yields of 3% or 7%",
      steps: [
        { text: "Value in 3 years of the remaining 7-year 6% bond if the yield is 3%.", tex: "B_{\\text{low}} = \\sum_{t=1}^{7} \\frac{6}{1.03^t} + \\frac{100}{1.03^7}", result: { value: 118.69, tolerance: 0.02 } },
        { text: "Its value if the yield is 7%; the issuer does not call.", tex: "B_{\\text{high}} = \\sum_{t=1}^{7} \\frac{6}{1.07^t} + \\frac{100}{1.07^7}", result: { value: 94.61, tolerance: 0.02 } },
        { text: "Today's call value: the expected payoff $\\max(B - 100, 0)$, discounted for 3 years.", tex: "C_{\\text{call}} = \\frac{\\tfrac{1}{2}\\,\\max(B_{\\text{low}} - 100,\\,0)}{1.05^{3}}", result: { value: 8.07, tolerance: 0.02 } },
        { text: "Callable price, with the straight bond worth 107.72 (from the worked example below).", tex: "P_{\\text{straight}} - C_{\\text{call}}", result: { value: 99.65, tolerance: 0.03 } },
      ],
    },
    p("A wider spread of future yields makes the call worth more, 8.07 instead of 5.18, and the callable bond cheaper."),
    {
      kind: "check",
      id: "callable-bonds/volatility-effect",
      prompt: "The market starts to expect much more volatile interest rates; today's yields and everything else stay the same. What happens to the price of the callable bond?",
      answer: {
        type: "choice",
        options: [
          "It falls, because the issuer's call option becomes more valuable.",
          "It rises, because a more volatile bond is worth more.",
          "It stays the same, because the yield has not changed.",
          "It moves to the straight bond's price.",
        ],
        correct: 0,
      },
      explain: "$P_{\\text{callable}} = P_{\\text{straight}} - C_{\\text{call}}$. The straight bond does not change, while an option is worth more when the future is more uncertain, so the holder's price falls.",
    },

    h("Yield to maturity, yield to call, yield to worst"),
    p("A callable bond has more than one natural yield. The **yield to maturity** assumes the bond is never called. The **yield to call** assumes it is called at the first call date: coupons up to that date, then the call price. Investors usually quote the **yield to worst**, the lower of the two, because the issuer will choose whichever outcome is cheaper for the issuer, which is the worse one for the holder."),

    h("A worked example"),
    p("For the 10-year 6% bond at a market yield of 5%, the straight bond is worth"),
    eq("P_{\\text{straight}} = \\sum_{t=1}^{10} \\frac{6}{1.05^{t}} + \\frac{100}{1.05^{10}} \\approx 107.72."),
    p("Value the call as an option on the bond at the first call date: in 3 years the yield is uncertain (lognormal around 5%, with 20% volatility per year), the issuer calls whenever the remaining 7-year bond is worth more than 100, and the payoff is discounted back. This gives $C_{\\text{call}} \\approx 7.13$, so the callable bond is worth about $100.59$. At that price:"),
    list(
      "yield to maturity: 5.92%;",
      "yield to call (coupons for 3 years, then 100): 5.78%;",
      "yield to worst: 5.78%.",
    ),
    p("The 92 basis points between the 5% market yield and the callable's yield to maturity, and the 7.13 points of price, are the holder's compensation for the call."),

    h("Price compression and negative convexity"),
    p("As yields fall, a straight bond keeps rising. A callable bond rises much less, because a higher price makes the call more likely to be exercised: its price is compressed towards the call price. From 5% to 4% the straight bond gains $8.50$, the callable only $4.09$. From 5% to 6% the straight bond loses $7.72$, the callable $4.75$. Duration and convexity are therefore measured on the actual price function, by shifting the yield by a small $\\Delta y$ in each direction:"),
    eq("D_{\\text{eff}} = \\frac{P_{-} - P_{+}}{2\\,P\\,\\Delta y}, \\qquad C_{\\text{eff}} = \\frac{P_{+} + P_{-} - 2P}{P\\,(\\Delta y)^2}."),
    p("At 5% with $\\Delta y = 0.1\\%$ the callable has an **effective duration** of about 4.42, against a modified duration of 7.52 for the straight bond, and an **effective convexity** of about $-68$, against $+72$. Negative convexity means the price curve bends the wrong way: the holder loses more when yields rise than it gains when they fall by the same amount. It appears where the call is most valuable relative to its sensitivity, around and below the coupon rate. At high yields the call is almost worthless and the callable behaves like the straight bond again."),
    p("A longer call protection period shrinks the call's value: at 5%, with 5 years of protection the call is worth 5.53 and the bond 102.20; if it is callable from the first coupon date, the call is worth 7.74 and the bond 99.98. This model is deliberately simple: it allows a call only at the first call date. A full valuation lets the issuer call at every date after the protection period and builds a tree of future interest rates, in the spirit of \"Multi-step trees and backward induction\"."),
    p("In the figure, the straight bond's price–yield curve lies above the callable bond's, and the shaded band between them is the value of the call. Drag the point along the yield axis, or focus it and use the arrow keys. The dashed line is the tangent at that yield, and the label above the point says whether the callable curve is convex or concave there. The readouts give both prices, the call value, the three yields and the effective duration and convexity. Move the point from 9% down to 3% and watch the label switch to negative convexity as the gap widens. Then change the call protection and see the band shrink as protection lengthens."),
    figure("callable-price-yield"),

    {
      kind: "check",
      id: "callable-bonds/negative-convexity",
      prompt: "At a yield of 5% the callable bond has an effective convexity of about $-68$. Yields move 1 percentage point up or down. Compared with a bond of the same duration and zero convexity, the callable bond…",
      answer: {
        type: "choice",
        options: [
          "loses more when yields rise than it gains when they fall",
          "gains more when yields fall than it loses when they rise",
          "moves exactly as its duration predicts in both directions",
          "does not react to yield changes, because of the call",
        ],
        correct: 0,
      },
      explain: "With negative convexity the price curve lies below its tangent, so the term $\\tfrac{1}{2}C_{\\text{eff}}P(\\Delta y)^2$ subtracts in both directions. From 5% the lesson's numbers show it: $+4.09$ for a fall, $-4.75$ for a rise.",
    },

    h("Summary"),
    list(
      "A callable bond gives the issuer the right to repay at the call price after the protection period.",
      "Its price is the straight bond's price minus the value of the issuer's call; the holder is compensated by a higher yield.",
      "Yield to worst, the lower of yield to maturity and yield to call, is the conservative quote.",
      "Near and below the coupon rate the price is compressed towards the call price: effective duration falls and convexity turns negative.",
    ),
    note("The next lesson, \"Credit risk: default probabilities and credit spreads\", looks at another reason a bond can pay less than promised: the issuer may not pay at all."),
    lab("/bond-pricing", "Price bonds and compare their price–yield curves in the Bond Pricing lab"),
  ],

  hu: [
    p("A „Kötvényárak és hozamok” és a „Duráció és konvexitás” című lecke olyan kötvényeket árazott, amelyek pénzáramai előre rögzítettek. Sok vállalati és állami ügynökségi kötvény nem ilyen: a kibocsátó korábban visszafizetheti. Ez a lecke ezt a jogot a kibocsátó kezében lévő opcióként kezeli, megmutatja, hogyan korlátozza a kötvény árát, amikor a hozamok csökkennek, és megmagyarázza, miért lehet egy ilyen kötvény konvexitása negatív. Az opciókat a „Határidős ügyletek, call és put opciók” című lecke vezette be; itt csak annyi kell, hogy az opció jog, kötelezettség nélkül. Jelölés: $F = 100$ névérték, éves $c$ kupon, éves kamatozású $y$ hozam, $P$ ár."),

    h("A visszahívási jog"),
    p("A **visszahívható kötvényt** a kibocsátó egy rögzített **visszahívási áron**, többnyire névértéken, visszavásárolhatja a tulajdonostól egy első visszahívási időponttól kezdve. Az ezt megelőző évek a **visszahívási védelem** időszaka. Vegyünk egy tízéves, 6%-os kuponú kötvényt, amely 3 év után 100-on visszahívható. Ha a kibocsátó piaci hozama 4%-ra csökken, egy új hétéves kötvény évi 6% helyett 4%-ba kerülne neki. Ekkor 100-on visszahívja a régi kötvényt, és újrafinanszírozza magát. Ha a hozamok nőnek, megtartja az olcsó, 6%-os adósságot. A tulajdonos mindkét irányban a rosszabbik kimenetet kapja: alacsony újrabefektetési kamatot, ha visszahívják a kötvényt, és csökkenő árat, ha nem."),

    h("A visszahívható kötvény mint fix kötvény mínusz egy call opció"),
    p("A visszahívható kötvény tartása ugyanaz, mint egy azonos kuponú és lejáratú, nem visszahívható **fix kötvény** tartása, miközben a tulajdonos eladott a kibocsátónak egy call opciót erre a kötvényre, a visszahívási árral mint kötési árral:"),
    eq("P_{\\text{visszahívható}} = P_{\\text{fix}} - C_{\\text{opció}}."),
    p("Az opciónak azért van értéke, mert a jövőbeli hozam bizonytalan. Egy kétállapotú szemléltetés: tegyük fel, hogy 3 év múlva a hozam vagy 4%, vagy 8%, mindkettő fél valószínűséggel, és a diszkontálás 5%-kal történik. A hátralévő hétéves kötvény ekkor $112{,}00$-t vagy $89{,}59$-et ér. Az alacsony hozamú állapotban a kibocsátó visszahívja és 100-at fizet, így $12{,}00$-t vesz el a tulajdonostól; a magas hozamú állapotban nem történik semmi. Ma az opció nagyjából ennyit ér:"),
    eq("C_{\\text{opció}} \\approx \\frac{\\tfrac{1}{2}\\,(112{,}00 - 100)}{1{,}05^{3}} \\approx 5{,}18."),
    note("A visszahívható kötvény egy fix kötvény mínusz a kibocsátónak eladott call opció. A tulajdonos az opcióért alacsonyabb árat, azaz magasabb hozamot kap, mint egy hasonló fix kötvényen."),

    p("Ismételjük meg a kétállapotú példát szélesebb tartománnyal: 3 év múlva a hozam 3% vagy 7%, ismét fele-fele valószínűséggel, 5%-os diszkontálással."),
    {
      kind: "worked",
      title: "A visszahívási opció értéke két állapotban, 3%-os vagy 7%-os hozammal",
      steps: [
        { text: "A hátralévő 7 éves, 6%-os kötvény értéke 3 év múlva 3%-os hozamnál.", tex: "B_{\\text{alacsony}} = \\sum_{t=1}^{7} \\frac{6}{1{,}03^t} + \\frac{100}{1{,}03^7}", result: { value: 118.69, tolerance: 0.02 } },
        { text: "Az értéke 7%-os hozamnál; ekkor a kibocsátó nem hívja vissza.", tex: "B_{\\text{magas}} = \\sum_{t=1}^{7} \\frac{6}{1{,}07^t} + \\frac{100}{1{,}07^7}", result: { value: 94.61, tolerance: 0.02 } },
        { text: "A visszahívási opció mai értéke: a $\\max(B - 100, 0)$ kifizetés várható értéke, 3 évre diszkontálva.", tex: "C_{\\text{call}} = \\frac{\\tfrac{1}{2}\\,\\max(B_{\\text{alacsony}} - 100,\\,0)}{1{,}05^{3}}", result: { value: 8.07, tolerance: 0.02 } },
        { text: "A visszahívható kötvény ára; a fix kötvény ára 107,72 (a lenti számpéldából).", tex: "P_{\\text{fix}} - C_{\\text{call}}", result: { value: 99.65, tolerance: 0.03 } },
      ],
    },
    p("A jövőbeli hozamok szélesebb szóródása értékesebbé teszi az opciót (5,18 helyett 8,07), a visszahívható kötvényt pedig olcsóbbá."),
    {
      kind: "check",
      id: "callable-bonds/volatility-effect",
      prompt: "A piac hirtelen sokkal ingadozóbb kamatokra számít; a mai hozamok és minden más változatlan. Mi történik a visszahívható kötvény árával?",
      answer: {
        type: "choice",
        options: [
          "Csökken, mert a kibocsátó visszahívási opciója értékesebb lesz.",
          "Nő, mert egy ingadozóbb kötvény többet ér.",
          "Változatlan, mert a hozam nem változott.",
          "A fix kötvény árához igazodik.",
        ],
        correct: 0,
      },
      explain: "A visszahívható kötvény a fix kötvény és a kibocsátónak eladott opció különbsége. A fix kötvény nem változik, az opció viszont többet ér, ha a jövő bizonytalanabb, így a tulajdonos számára az ár csökken.",
    },

    h("Lejáratig, visszahívásig és legrosszabb esetre számított hozam"),
    p("Egy visszahívható kötvénynek több természetes hozama van. A **lejáratig számított hozam** feltételezi, hogy a kötvényt soha nem hívják vissza. A **visszahívásig számított hozam** feltételezi, hogy az első visszahívási időpontban visszahívják: addig kuponokat fizet, utána a visszahívási árat. A befektetők általában a **legrosszabb hozamot** jegyzik, a kettő közül az alacsonyabbat, mert a kibocsátó a számára olcsóbb, vagyis a tulajdonos számára rosszabb kimenetet választja."),

    h("Számpélda"),
    p("A tízéves, 6%-os kötvény fix változata 5%-os piaci hozam mellett"),
    eq("P_{\\text{fix}} = \\sum_{t=1}^{10} \\frac{6}{1{,}05^{t}} + \\frac{100}{1{,}05^{10}} \\approx 107{,}72."),
    p("Az opciót a kötvényre szóló opcióként értékeljük az első visszahívási időpontban: 3 év múlva a hozam bizonytalan (lognormális 5% körül, évi 20%-os volatilitással), a kibocsátó akkor hív vissza, ha a hátralévő hétéves kötvény 100-nál többet ér, és a kifizetést visszadiszkontáljuk. Így $C_{\\text{opció}} \\approx 7{,}13$, a visszahívható kötvény tehát nagyjából $100{,}59$-et ér. Ezen az áron:"),
    list(
      "lejáratig számított hozam: 5,92%;",
      "visszahívásig számított hozam (3 évig kupon, utána 100): 5,78%;",
      "legrosszabb hozam: 5,78%.",
    ),
    p("Az 5%-os piaci hozam és a visszahívható kötvény lejáratig számított hozama közötti 92 bázispont, illetve az árban mutatkozó 7,13 pont a tulajdonos ellentételezése a visszahívási jogért."),

    h("Árkompresszió és negatív konvexitás"),
    p("Csökkenő hozamok mellett a fix kötvény ára tovább emelkedik. A visszahívható kötvényé sokkal kevésbé, mert a magasabb ár valószínűbbé teszi a visszahívást: az ára a visszahívási ár felé nyomódik össze. 5%-ról 4%-ra a fix kötvény $8{,}50$-et nyer, a visszahívható csak $4{,}09$-et. 5%-ról 6%-ra a fix kötvény $7{,}72$-t veszít, a visszahívható $4{,}75$-öt. A durációt és a konvexitást ezért a tényleges árfüggvényen mérjük, a hozamot egy kis $\\Delta y$-nal mindkét irányba eltolva:"),
    eq("D_{\\text{eff}} = \\frac{P_{-} - P_{+}}{2\\,P\\,\\Delta y}, \\qquad C_{\\text{eff}} = \\frac{P_{+} + P_{-} - 2P}{P\\,(\\Delta y)^2}."),
    p("5%-on, $\\Delta y = 0{,}1\\%$-kal a visszahívható kötvény **effektív durációja** nagyjából 4,42, szemben a fix kötvény 7,52-es módosított durációjával, **effektív konvexitása** pedig nagyjából $-68$, szemben a $+72$-vel. A negatív konvexitás azt jelenti, hogy az árgörbe rossz irányba hajlik: a tulajdonos többet veszít a hozamok emelkedésén, mint amennyit ugyanakkora csökkenésen nyer. Ott jelentkezik, ahol a visszahívási jog értékes, a kuponráta körül és alatta. Magas hozamoknál a jog szinte semmit sem ér, és a visszahívható kötvény ismét úgy viselkedik, mint a fix."),
    p("Hosszabb visszahívási védelem csökkenti az opció értékét: 5%-on 5 év védelemmel az opció 5,53-at ér és a kötvény 102,20-at; ha az első kuponfizetéstől visszahívható, az opció 7,74-et ér és a kötvény 99,98-at. Ez a modell szándékosan egyszerű: csak az első visszahívási időpontban enged visszahívást. Egy teljes értékelés a védelmi időszak után minden időpontban megengedi a visszahívást, és a jövőbeli kamatlábak fáját építi fel, a „Többlépéses fák és visszafelé indukció” szellemében."),
    p("Az ábrán a fix kötvény ár–hozam görbéje a visszahívható kötvényé fölött fut, a kettő közötti sáv a visszahívási opció értéke. Húzd a pontot a hozamtengely mentén, vagy jelöld ki és használd a nyílbillentyűket. A szaggatott vonal az érintő az adott hozamnál, a pont fölötti felirat pedig megmondja, hogy ott a visszahívható görbe konvex vagy konkáv. A kijelzők mutatják a két árat, az opció értékét, a három hozamot, valamint az effektív durációt és konvexitást. Vidd a pontot 9%-ról 3%-ra, és figyeld, ahogy a sáv szélesedésével a felirat negatív konvexitásra vált. Ezután változtasd a visszahívási védelmet, és nézd, hogyan keskenyedik a sáv a védelem hosszabbodásával."),
    figure("callable-price-yield"),

    {
      kind: "check",
      id: "callable-bonds/negative-convexity",
      prompt: "5%-os hozamnál a visszahívható kötvény effektív konvexitása körülbelül $-68$. A hozam 1 százalékponttal emelkedik vagy csökken. Egy azonos durációjú, nulla konvexitású kötvényhez képest a visszahívható kötvény…",
      answer: {
        type: "choice",
        options: [
          "többet veszít hozamemelkedéskor, mint amennyit nyer hozamcsökkenéskor",
          "többet nyer hozamcsökkenéskor, mint amennyit veszít hozamemelkedéskor",
          "mindkét irányban pontosan a durációja szerint mozog",
          "a visszahívás miatt nem reagál a hozamváltozásra",
        ],
        correct: 0,
      },
      explain: "Negatív konvexitásnál az árgörbe az érintője alatt fut, így a $\\tfrac{1}{2}C_{\\text{eff}}P(\\Delta y)^2$ tag mindkét irányban levon. 5%-ról a lecke számai is mutatják: csökkenéskor $+4{,}09$, emelkedéskor $-4{,}75$.",
    },

    h("Összefoglalás"),
    list(
      "A visszahívható kötvény feljogosítja a kibocsátót, hogy a védelmi időszak után a visszahívási áron visszafizesse.",
      "Az ára a fix kötvény ára mínusz a kibocsátó call opciójának értéke; a tulajdonost magasabb hozam kárpótolja.",
      "A legrosszabb hozam, vagyis a lejáratig és a visszahívásig számított hozam közül az alacsonyabb, az óvatos jegyzési konvenció.",
      "A kuponráta körül és alatta az ár a visszahívási ár felé nyomódik össze: az effektív duráció csökken, a konvexitás negatívvá válik.",
    ),
    note("A következő lecke, a „Hitelkockázat: csődvalószínűség és hitelfelár”, egy másik okot vizsgál, amiért egy kötvény kevesebbet fizethet az ígértnél: a kibocsátó esetleg egyáltalán nem fizet."),
    lab("/bond-pricing", "Árazz kötvényeket, és hasonlítsd össze az ár–hozam görbéiket a Kötvényárazás laborban"),
  ],
};
