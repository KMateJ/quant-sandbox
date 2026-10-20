import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const bondPricing: GuideLessonContent = {
  en: [
    p("A bond is the simplest traded security whose value comes entirely from discounting: it promises fixed payments on fixed dates, and its price is what those payments are worth today. This lesson prices a bond, defines its yield and explains why prices and yields move in opposite directions. It builds on \"Interest, compounding and discounting\"."),

    h("A bond as a list of cash flows"),
    p("A plain fixed-rate bond has a **face value** $F$ (also called par or principal), an annual **coupon rate** $c$ and a **maturity** of $T$ years. Throughout this track we take $F = 100$ and assume one coupon per year. The holder receives a coupon $cF$ at the end of each year $t = 1, \\dots, T$ and, together with the last coupon, the face value $F$."),
    p("Example: a 10-year bond with $c = 5\\%$ pays 5 at the end of years 1 to 9 and $5 + 100 = 105$ at the end of year 10. Nothing else is uncertain in this description; we assume the issuer does not default."),

    h("Price as a present value"),
    p("Discount every cash flow at one annual rate $y$, using annual compounding as in \"Interest, compounding and discounting\", and add up the present values. The result is the **price** $P$:"),
    eq("P = \\sum_{t=1}^{T} \\frac{cF}{(1+y)^t} + \\frac{F}{(1+y)^T}."),
    p("The coupons form an annuity, so the sum has a closed form:"),
    eq("P = cF\\,\\frac{1 - (1+y)^{-T}}{y} + \\frac{F}{(1+y)^T}."),
    p("Each term is a payment times a discount factor $1/(1+y)^t$. The further away a payment is, the more it is shrunk."),
    {
      kind: "worked",
      title: "Pricing a 3-year bond one cash flow at a time",
      steps: [
        { text: "A 3-year bond with a 4% coupon pays 4, 4 and 104. At $y = 5\\%$, discount the first coupon by one year.", tex: "\\frac{4}{1.05}", result: { value: 3.81, tolerance: 0.01 } },
        { text: "The second coupon is discounted by two years.", tex: "\\frac{4}{1.05^2}", result: { value: 3.63, tolerance: 0.01 } },
        { text: "The last coupon and the face value arrive together after three years.", tex: "\\frac{104}{1.05^3}", result: { value: 89.84, tolerance: 0.01 } },
        { text: "The price is the sum of the three present values.", tex: "P = 3.81 + 3.63 + 89.84", result: { value: 97.28, tolerance: 0.01 } },
      ],
    },

    h("Yield to maturity"),
    p("In the market the direction is reversed: the price $P$ is observed, and $y$ is unknown. The **yield to maturity** (YTM) is the single rate $y$ that makes the present value of the cash flows equal to the market price. In the language of investment appraisal it is the **internal rate of return** of buying the bond at $P$ and holding it to maturity."),
    p("There is no closed form for $y$ when $T > 1$; it is found numerically (for example by bisection), which is easy because the price is a strictly decreasing function of $y$. The yield is a summary number: it assumes every cash flow is discounted at the same rate."),
    note("Yield to maturity: the one discount rate $y$ at which the present value of all promised cash flows equals the bond's price."),

    h("The price–yield relation"),
    p("Every term in the price formula has $y$ in the denominator, so a higher yield gives a lower price and a lower yield a higher price. The relation is not a straight line. Differentiating each term $(1+y)^{-t}$ twice gives a positive result, so the curve $y \\mapsto P(y)$ is **convex**: it falls steeply at low yields and flattens at high yields. A rise of 1% in yield therefore lowers the price by less than a fall of 1% raises it."),

    h("Premium, par and discount bonds"),
    p("Compare the coupon rate with the yield."),
    list(
      "**Par**: if $c = y$, the price equals $F$. Each year the coupon pays exactly the interest the market demands, so nothing needs to be made up through the price.",
      "**Premium**: if $c > y$, the bond pays more than the market rate, and buyers pay more than $F$ for it.",
      "**Discount**: if $c < y$, the coupons are too low, and the bond sells below $F$ so that the gain from the price rising to $F$ at maturity makes up the shortfall.",
    ),
    {
      kind: "check",
      id: "bond-pricing/three-year-price",
      prompt: "A 3-year bond with face value 100 pays a 5% annual coupon. What is its price at a yield of 6%?",
      answer: { type: "number", value: 97.33, tolerance: 0.02 },
      explain: "$P = 5/1.06 + 5/1.06^2 + 105/1.06^3 \\approx 4.72 + 4.45 + 88.16 = 97.33$.",
    },
    {
      kind: "check",
      id: "bond-pricing/coupon-below-yield",
      prompt: "A bond's coupon rate is below its yield to maturity. Where does its price stand relative to the face value?",
      answer: { type: "choice", options: ["Above the face value", "At the face value", "Below the face value", "It depends on the maturity"], correct: 2 },
      explain: "With $c < y$ the coupons pay less than the market demands, so the bond trades at a discount; the rise to $F$ by maturity makes up the difference.",
    },

    h("Zero-coupon bonds"),
    p("A **zero-coupon bond** has $c = 0$: it pays only $F$ at $T$. Its price is a single discounted amount,"),
    eq("P = \\frac{F}{(1+y)^T},"),
    p("so its yield can be solved directly: $y = (F/P)^{1/T} - 1$. A 10-year zero at $y = 6\\%$ costs $100/1.06^{10} \\approx 55.84$. Zeros always trade at a discount for positive yields, and they are the building blocks of every other bond: a coupon bond is a bundle of zeros, one for each payment date."),

    h("Current yield"),
    p("A simpler number often quoted is the **current yield**, the annual coupon divided by the price, $cF/P$. It ignores the gain or loss from the price moving to $F$ at maturity. For a discount bond the YTM is higher than the current yield, which is in turn higher than the coupon rate; for a premium bond the order is reversed. At par all three coincide."),

    h("A worked example"),
    p("Take $c = 5\\%$, $T = 10$, $y = 6\\%$. The annuity factor is $(1 - 1.06^{-10})/0.06 \\approx 7.360$, so"),
    eq("P = 5 \\cdot 7.360 + \\frac{100}{1.06^{10}} \\approx 36.80 + 55.84 = 92.64."),
    p("The coupon is below the yield, so the bond trades at a discount. Its current yield is $5/92.64 \\approx 5.40\\%$, between the coupon rate of 5% and the YTM of 6%. Raising the coupon to 7% at the same yield gives about 107.36, a premium; at $y = 5\\%$ the 5% bond is worth exactly 100."),
    p("The figure plots the price against yields from 0% to 15%, with a horizontal line at par (100) and a vertical line at the chosen yield. The readouts show the price, whether it is at a premium, at par or at a discount, and the current yield. Move $y$ across the coupon rate and note that the price crosses 100 exactly there. Raise $T$ and note that the curve gets steeper and more curved; set $c$ to 0 to see a zero-coupon bond."),
    figure("price-yield"),

    h("Pull to par"),
    p("If the yield stays the same, the price of a bond moves towards $F$ as maturity approaches, because fewer coupons are left to be over- or under-priced and the face value is discounted over a shorter time. With $c = 5\\%$ and $y = 6\\%$, the price is about 92.64 with 10 years left, 95.79 with 5 years left and 99.06 with one year left; at maturity it is 100. This is the **pull to par**. In the figure, shorten $T$ at a fixed yield and the curve flattens towards the par line."),

    h("Summary"),
    list(
      "A fixed-rate bond is a list of known cash flows: coupons $cF$ each year and the face value $F$ at maturity.",
      "Its price is the present value of those cash flows; the yield to maturity is the single rate that reproduces the market price (the bond's IRR).",
      "Price and yield move in opposite directions along a convex curve.",
      "The bond trades at par when $c = y$, at a premium when $c > y$ and at a discount when $c < y$; with an unchanged yield its price is pulled to par as maturity approaches.",
    ),
    note("The next lesson, \"Duration and convexity\", measures the slope and the curvature of the price–yield curve."),
    lab("/bond-pricing", "Price bonds and solve for yields in the Bond Pricing lab"),
  ],

  hu: [
    p("A kötvény a legegyszerűbb olyan értékpapír, amelynek értéke teljes egészében diszkontálásból adódik: rögzített időpontokban rögzített kifizetéseket ígér, az ára pedig az, amennyit ezek a kifizetések ma érnek. Ez a lecke beárazza a kötvényt, definiálja a hozamát, és megmagyarázza, miért mozog az ár és a hozam ellentétes irányban. A „Kamat, kamatozás és diszkontálás” lecke anyagára épül."),

    h("A kötvény mint pénzáramlások sora"),
    p("Egy egyszerű fix kamatozású kötvénynek van **névértéke** ($F$, más néven tőkeösszeg), éves **kuponrátája** ($c$) és **lejárata** ($T$ év). Ebben a témakörben mindig $F = 100$, és évente egy kuponfizetést feltételezünk. A tulajdonos minden $t = 1, \\dots, T$ év végén $cF$ kupont kap, az utolsó kuponnal együtt pedig a névértéket is."),
    p("Példa: egy 10 éves, $c = 5\\%$-os kötvény az 1–9. év végén 5-öt, a 10. év végén $5 + 100 = 105$-öt fizet. Ebben a leírásban semmi sem bizonytalan; feltesszük, hogy a kibocsátó nem megy csődbe."),

    h("Az ár mint jelenérték"),
    p("Diszkontáljunk minden pénzáramlást ugyanazzal az éves $y$ rátával, éves kamatozással, ahogy a „Kamat, kamatozás és diszkontálás” leckében, és adjuk össze a jelenértékeket. Az eredmény az **ár**, $P$:"),
    eq("P = \\sum_{t=1}^{T} \\frac{cF}{(1+y)^t} + \\frac{F}{(1+y)^T}."),
    p("A kuponok annuitást alkotnak, így az összegnek zárt alakja van:"),
    eq("P = cF\\,\\frac{1 - (1+y)^{-T}}{y} + \\frac{F}{(1+y)^T}."),
    p("Minden tag egy kifizetés szorozva az $1/(1+y)^t$ diszkontfaktorral. Minél távolabbi egy kifizetés, annál jobban zsugorodik."),
    {
      kind: "worked",
      title: "Egy hároméves kötvény árazása pénzáramlásonként",
      steps: [
        { text: "Egy hároméves, 4%-os kuponú kötvény 4-et, 4-et és 104-et fizet. $y = 5\\%$ mellett az első kupont egy évvel diszkontáljuk.", tex: "\\frac{4}{1{,}05}", result: { value: 3.81, tolerance: 0.01 } },
        { text: "A második kupont két évvel.", tex: "\\frac{4}{1{,}05^2}", result: { value: 3.63, tolerance: 0.01 } },
        { text: "Az utolsó kupon és a névérték együtt érkezik, három év múlva.", tex: "\\frac{104}{1{,}05^3}", result: { value: 89.84, tolerance: 0.01 } },
        { text: "Az ár a három jelenérték összege.", tex: "P = 3{,}81 + 3{,}63 + 89{,}84", result: { value: 97.28, tolerance: 0.01 } },
      ],
    },

    h("Lejáratig számított hozam"),
    p("A piacon fordított az irány: az árat látjuk, $y$ az ismeretlen. A **lejáratig számított hozam** (YTM) az az egyetlen $y$ ráta, amellyel a pénzáramlások jelenértéke éppen a piaci árat adja. A beruházás-értékelés nyelvén ez annak a **belső megtérülési rátája** (IRR), hogy a kötvényt $P$-n megvesszük és lejáratig tartjuk."),
    p("$T > 1$ esetén $y$-ra nincs zárt képlet; numerikusan keressük meg (például intervallumfelezéssel), ami könnyű, mert az ár $y$-nak szigorúan csökkenő függvénye. A hozam összefoglaló szám: feltételezi, hogy minden pénzáramlást ugyanazzal a rátával diszkontálunk."),
    note("Lejáratig számított hozam: az az egyetlen $y$ diszkontráta, amellyel az összes ígért pénzáramlás jelenértéke megegyezik a kötvény árával."),

    h("Az ár–hozam kapcsolat"),
    p("Az árképlet minden tagjában $y$ a nevezőben áll, így magasabb hozam alacsonyabb árat, alacsonyabb hozam magasabb árat jelent. A kapcsolat nem egyenes. Az $(1+y)^{-t}$ tagokat kétszer deriválva pozitív eredményt kapunk, tehát az $y \\mapsto P(y)$ görbe **konvex**: alacsony hozamoknál meredeken esik, magas hozamoknál ellaposodik. Egy 1%-os hozamemelkedés ezért kevésbé csökkenti az árat, mint amennyivel egy 1%-os hozamcsökkenés növeli."),

    h("Prémiumos, névértéken és diszkonton forgó kötvények"),
    p("Vessük össze a kuponrátát a hozammal."),
    list(
      "**Névértéken (par)**: ha $c = y$, az ár $F$. A kupon minden évben pontosan annyi kamatot fizet, amennyit a piac elvár, így az áron keresztül nincs mit kiegyenlíteni.",
      "**Prémiummal**: ha $c > y$, a kötvény többet fizet a piaci rátánál, ezért a vevők $F$-nél többet adnak érte.",
      "**Diszkonttal**: ha $c < y$, a kupon túl alacsony, ezért a kötvény $F$ alatt forog, hogy a lejáratig $F$-ig emelkedő ár pótolja a hiányt.",
    ),
    {
      kind: "check",
      id: "bond-pricing/three-year-price",
      prompt: "Egy hároméves, 100-as névértékű kötvény évi 5%-os kupont fizet. Mennyi az ára 6%-os hozam mellett?",
      answer: { type: "number", value: 97.33, tolerance: 0.02 },
      explain: "$P = 5/1{,}06 + 5/1{,}06^2 + 105/1{,}06^3 \\approx 4{,}72 + 4{,}45 + 88{,}16 = 97{,}33$.",
    },
    {
      kind: "check",
      id: "bond-pricing/coupon-below-yield",
      prompt: "Egy kötvény kuponrátája a lejáratig számított hozama alatt van. Hol áll az ára a névértékhez képest?",
      answer: { type: "choice", options: ["A névérték fölött", "Pontosan a névértéken", "A névérték alatt", "A lejárattól függ"], correct: 2 },
      explain: "$c < y$ esetén a kuponok kevesebbet fizetnek, mint amit a piac elvár, ezért a kötvény diszkonton forog; a lejáratig $F$-ig emelkedő ár pótolja a különbséget.",
    },

    h("Elemi (zérókuponos) kötvények"),
    p("A **zérókuponos kötvény** kuponrátája $c = 0$: csak $T$-ben fizet $F$-et. Ára egyetlen diszkontált összeg,"),
    eq("P = \\frac{F}{(1+y)^T},"),
    p("így a hozama közvetlenül kifejezhető: $y = (F/P)^{1/T} - 1$. Egy 10 éves zérókuponos kötvény $y = 6\\%$ mellett $100/1{,}06^{10} \\approx 55{,}84$-be kerül. Pozitív hozamnál a zérókuponos kötvény mindig diszkonton forog, és minden más kötvény építőköve: a kuponos kötvény zérókuponos kötvények csomagja, minden kifizetési időpontra egy."),

    h("Szelvényhozam"),
    p("Gyakran idéznek egy egyszerűbb számot, a **szelvényhozamot** (current yield): az éves kupon osztva az árral, $cF/P$. Ez figyelmen kívül hagyja, hogy lejáratig az ár $F$-hez mozdul, és ebből nyereség vagy veszteség adódik. Diszkontos kötvénynél a YTM nagyobb a szelvényhozamnál, az pedig nagyobb a kuponrátánál; prémiumos kötvénynél fordított a sorrend. Névértéken mindhárom egyenlő."),

    h("Számpélda"),
    p("Legyen $c = 5\\%$, $T = 10$, $y = 6\\%$. Az annuitásfaktor $(1 - 1{,}06^{-10})/0{,}06 \\approx 7{,}360$, így"),
    eq("P = 5 \\cdot 7{,}360 + \\frac{100}{1{,}06^{10}} \\approx 36{,}80 + 55{,}84 = 92{,}64."),
    p("A kupon a hozam alatt van, ezért a kötvény diszkonton forog. Szelvényhozama $5/92{,}64 \\approx 5{,}40\\%$, az 5%-os kuponráta és a 6%-os YTM között. Ugyanilyen hozam mellett 7%-os kuponnal az ár kb. 107,36, prémiumos; $y = 5\\%$ mellett az 5%-os kötvény pontosan 100-at ér."),
    p("Az ábra az árat mutatja 0% és 15% közötti hozamok függvényében, vízszintes vonallal a névértéknél (100) és függőlegessel a választott hozamnál. A kijelzők az árat, azt, hogy prémiummal, névértéken vagy diszkonttal forog-e, valamint a szelvényhozamot mutatják. Mozgasd $y$-t a kuponráta egyik oldaláról a másikra, és figyeld meg, hogy az ár pontosan ott metszi a 100-at. Növeld $T$-t, és a görbe meredekebb és görbültebb lesz; állítsd $c$-t 0-ra, és zérókuponos kötvényt kapsz."),
    figure("price-yield"),

    h("Névértékhez húzás"),
    p("Ha a hozam nem változik, a kötvény ára a lejárat közeledtével $F$ felé mozdul, mert egyre kevesebb kupon marad, amely túl- vagy alulárazott lehetne, és a névértéket egyre rövidebb időre diszkontáljuk. $c = 5\\%$ és $y = 6\\%$ mellett az ár 10 év hátralévő futamidőnél kb. 92,64, 5 évnél 95,79, egy évnél 99,06, lejáratkor pedig 100. Ez a **névértékhez húzás** (pull to par). Az ábrán rögzített hozam mellett csökkentsd $T$-t: a görbe a névértékvonal felé laposodik."),

    h("Összefoglalás"),
    list(
      "A fix kamatozású kötvény ismert pénzáramlások sora: évente $cF$ kupon, lejáratkor az $F$ névérték.",
      "Az ára e pénzáramlások jelenértéke; a lejáratig számított hozam az az egyetlen ráta, amely visszaadja a piaci árat (a kötvény IRR-je).",
      "Az ár és a hozam ellentétes irányban mozog, egy konvex görbe mentén.",
      "A kötvény $c = y$ esetén névértéken, $c > y$ esetén prémiummal, $c < y$ esetén diszkonttal forog; változatlan hozam mellett az ára a lejárat közeledtével a névérték felé tart.",
    ),
    note("A következő lecke, a „Duráció és konvexitás”, az ár–hozam görbe meredekségét és görbületét méri."),
    lab("/bond-pricing", "Árazz kötvényeket és számolj hozamot a Kötvényárazás laborban"),
  ],
};
