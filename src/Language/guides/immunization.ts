import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const immunization: GuideLessonContent = {
  en: [
    p("\"Duration and convexity\" measured how much a single bond's price moves when its yield changes. This lesson turns that measurement into a hedge. An investor who owes a fixed amount at a fixed date can choose bonds whose value tracks the value of the debt, so that a change in interest rates hurts neither side more than the other. The notation is the one from \"Bond prices and yields\": face value $F = 100$, annual coupons, yields with annual compounding, Macaulay duration $D$ and convexity $C$. Throughout, the yield curve is flat and moves in parallel."),

    h("A fixed liability"),
    p("A pension fund must pay $L = 1\\,000\\,000$ in exactly 7 years. At a flat yield of $y = 5\\%$ the present value of this **liability** is"),
    eq("PV_L = \\frac{L}{(1+y)^{7}} = \\frac{1\\,000\\,000}{1.05^{7}} \\approx 710\\,681."),
    p("The liability is a zero-coupon payment, so its duration is its maturity, $D_L = 7$, and its convexity is $C_L = 7 \\cdot 8/1.05^2 \\approx 50.79$. The fund holds bonds worth exactly $PV_L$ today. The difference between the value of its bonds and $PV_L$ is its **surplus**; the aim is to keep it from turning negative when rates move."),

    h("Price risk and reinvestment risk"),
    p("A rise in yields does two things to a bond portfolio held for $H$ years. The bonds' market value falls at once (**price risk**), but every coupon received before $H$ is reinvested at the higher rate (**reinvestment risk** works in the holder's favour). A fall in yields does the opposite. The value at the horizon of a portfolio worth $P(y)$ today is $V_H = P(y)\\,(1+y)^{H}$, and its sensitivity to the yield is"),
    eq("\\frac{d \\ln V_H}{dy} = \\frac{P'(y)}{P(y)} + \\frac{H}{1+y} = \\frac{H - D}{1+y},"),
    p("using $P'/P = -D/(1+y)$ from the previous lesson. When the holding period equals the duration, $H = D$, the two effects cancel to first order: a small parallel shift leaves the horizon value unchanged."),

    h("Matching present value and duration"),
    p("This gives the recipe called **immunization**. Choose assets such that"),
    eq("PV_A = PV_L \\qquad \\text{and} \\qquad D_A = D_L,"),
    p("where $D_A$ is the value-weighted average of the bonds' durations. With two bonds, a short one with duration $D_S$ and a long one with duration $D_{Lg}$, put the share $w$ of the money into the short bond and $1 - w$ into the long one. The duration condition $w\\,D_S + (1-w)\\,D_{Lg} = D_L$ gives"),
    eq("w = \\frac{D_{Lg} - D_L}{D_{Lg} - D_S}."),
    note("Immunization: hold assets with the same present value and the same duration as the liability. Then a small parallel shift in yields changes both values by the same amount."),

    {
      kind: "check",
      id: "immunization/barbell-weight",
      prompt: "A liability has duration 7. You immunize it with a short bond of duration 2 and a long bond of duration 10. What share of the money goes into the short bond? Answer in percent.",
      answer: { type: "number", value: 37.5, tolerance: 0.5, unit: "%" },
      explain: "From $w\\,D_S + (1 - w)\\,D_{Lg} = D_L$: $w = (10 - 7)/(10 - 2) = 0.375$. The closer the liability's duration is to the long bond's, the less goes into the short one.",
    },

    h("A worked example"),
    p("Use a 2-year and a 12-year bond, both with a 5% coupon, so both trade at par at $y = 5\\%$. Their durations are $D_S \\approx 1.952$ and $D_{Lg} \\approx 9.306$, hence"),
    eq("w = \\frac{9.306 - 7}{9.306 - 1.952} \\approx 0.3136."),
    p("The fund buys 222 888 of the 2-year bond and 487 793 of the 12-year bond, together 710 681, and its asset duration is exactly 7. Now shift every yield by the same amount and reprice everything:"),
    list(
      "$\\Delta y = -1\\%$: assets and liability both rise by about 49 200; the surplus is $+747$.",
      "$\\Delta y = +1\\%$: both fall by about 45 600; the surplus is $+642$.",
      "$\\Delta y = \\pm 3\\%$: the surplus is $+7\\,861$ and $+4\\,985$.",
    ),
    p("Compare the two unhedged choices. With everything in the 2-year bond, a 1% fall in yields leaves a deficit of 35 832, because the bond barely gains while the liability rises sharply. With everything in the 12-year bond, a 1% rise leaves a deficit of 13 958."),

    p("The same two bonds can immunize a different liability. Try 500 000 due in 5 years, still at a flat 5%."),
    {
      kind: "worked",
      title: "Immunizing a five-year liability with the 2-year and 12-year bonds",
      steps: [
        { text: "Present value of the liability.", tex: "PV_L = \\frac{500\\,000}{1.05^{5}}", result: { value: 391763, tolerance: 2 } },
        { text: "Share of the money in the 2-year bond, using $D_S \\approx 1.952$ and $D_{Lg} \\approx 9.306$.", tex: "w = \\frac{D_{Lg} - D_L}{D_{Lg} - D_S}", result: { value: 0.5856, tolerance: 0.0005 } },
        { text: "Amount invested in the 2-year bond.", tex: "w \\cdot PV_L", result: { value: 229411, tolerance: 100 } },
        { text: "Amount invested in the 12-year bond.", tex: "(1 - w) \\cdot PV_L", result: { value: 162352, tolerance: 100 } },
      ],
    },
    p("A shorter liability needs more of the short bond: 59% of the money instead of 31%."),

    h("Why the surplus stays positive"),
    p("Duration matching removes the first-order term of the surplus. The second-order term comes from the difference in convexity:"),
    eq("\\Delta S \\approx \\tfrac{1}{2}\\,(C_A - C_L)\\,PV_L\\,(\\Delta y)^2."),
    p("A **barbell** of a short and a long bond spreads its cash flows around the liability date, which gives it more convexity than a single payment at year 7: here $C_A \\approx 70.27$ against $C_L \\approx 50.79$. The formula predicts a surplus of about 692 for a 1% move in either direction, close to the exact 747 and 642. As long as $C_A \\ge C_L$, any small parallel shift leaves a non-negative surplus. The protection is only as good as that assumption: if short and long yields move by different amounts, the barbell can lose."),

    {
      kind: "check",
      id: "immunization/convexity-sign",
      prompt: "A duration-matched barbell has more convexity than the liability ($C_A > C_L$). Yields shift in parallel by a small amount. What happens to the surplus?",
      answer: {
        type: "choice",
        options: [
          "It becomes slightly positive whether yields rise or fall.",
          "It stays exactly zero, because the durations match.",
          "It turns positive when yields fall and negative when they rise.",
          "It turns negative in both directions.",
        ],
        correct: 0,
      },
      explain: "Duration matching removes the first-order term; what is left is $\\tfrac{1}{2}(C_A - C_L)\\,PV_L\\,(\\Delta y)^2$, which is positive for either sign of $\\Delta y$ when $C_A > C_L$.",
    },

    h("Rebalancing"),
    p("An immunized position does not stay immunized on its own. If yields stay where they are, every duration shortens by one year per year and the match survives. When yields move, the durations of the two bonds change by different amounts, while the liability's does not: after a 1% rise the asset duration is 6.796, after a 1% fall it is 7.205, against $D_L = 7$ in both cases. The fund has to re-solve for $w$ and trade back to the target, and in practice it does so periodically rather than continuously."),
    p("In the figure the portfolio holds the face amounts fixed at the start. Drag the shock marker along the track, or use the arrow keys, to shift all yields by up to 300 basis points either way. The two bars show the present values of the assets and of the liability, and the readouts give the surplus and both durations. The small chart below plots the surplus against the shock; the stretches you have dragged across are highlighted. With the duration-matched portfolio the curve is a shallow U that never drops below zero. Switch to \"All in the short bond\" or \"All in the long bond\" and the same drag opens a deficit on one side."),
    figure("immunization-shock"),

    h("Summary"),
    list(
      "A fixed liability is a zero-coupon payment: its duration is its maturity.",
      "Over a horizon equal to the duration, price risk and reinvestment risk cancel to first order.",
      "Immunization matches present value and duration; with two bonds, the weight follows from $w\\,D_S + (1-w)\\,D_{Lg} = D_L$.",
      "With asset convexity at least that of the liability, small parallel shifts leave a non-negative surplus; non-parallel moves are not covered.",
      "Durations drift as yields move, so the position must be rebalanced.",
    ),
    note("The next lesson, \"Spot rates, forward rates and the yield curve\", drops the flat curve and lets yields differ by maturity, which is what immunization against parallel shifts leaves exposed."),
    lab("/immunization", "Try it in the Immunization Lab"),
  ],

  hu: [
    p("A „Duráció és konvexitás” című lecke azt mérte, mennyit mozdul egyetlen kötvény ára, ha megváltozik a hozama. Ez a lecke ebből a mérésből fedezést készít. Aki egy rögzített napon rögzített összeggel tartozik, olyan kötvényeket választhat, amelyek értéke együtt mozog a tartozás értékével, így a kamatlábak változása egyik oldalt sem sújtja jobban a másiknál. A jelölés ugyanaz, mint a „Kötvényárak és hozamok” című leckében: $F = 100$ névérték, éves kuponok, éves kamatozású hozamok, $D$ Macaulay-duráció és $C$ konvexitás. A hozamgörbe végig lapos, és párhuzamosan mozdul el."),

    h("Egy rögzített kötelezettség"),
    p("Egy nyugdíjpénztárnak pontosan 7 év múlva $L = 1\\,000\\,000$ összeget kell kifizetnie. Lapos, $y = 5\\%$-os hozam mellett ennek a **kötelezettségnek** a jelenértéke"),
    eq("PV_L = \\frac{L}{(1+y)^{7}} = \\frac{1\\,000\\,000}{1{,}05^{7}} \\approx 710\\,681."),
    p("A kötelezettség egyetlen, kupon nélküli kifizetés, így a durációja a lejárata, $D_L = 7$, a konvexitása pedig $C_L = 7 \\cdot 8/1{,}05^2 \\approx 50{,}79$. A pénztár ma pontosan $PV_L$ értékű kötvényt tart. A kötvények értéke és $PV_L$ különbsége a **többlet**; a cél az, hogy ez kamatmozgáskor se legyen negatív."),

    h("Árfolyamkockázat és újrabefektetési kockázat"),
    p("A hozamok emelkedése két dolgot tesz egy $H$ évig tartott kötvényportfólióval. A kötvények piaci értéke azonnal csökken (**árfolyamkockázat**), viszont minden $H$ előtt kapott kupont a magasabb kamaton lehet újra befektetni (az **újrabefektetési kockázat** itt a tulajdonos javára dolgozik). A hozamok csökkenése fordított hatású. A ma $P(y)$ értékű portfólió értéke a $H$ időpontban $V_H = P(y)\\,(1+y)^{H}$, és ennek hozamérzékenysége"),
    eq("\\frac{d \\ln V_H}{dy} = \\frac{P'(y)}{P(y)} + \\frac{H}{1+y} = \\frac{H - D}{1+y},"),
    p("ahol felhasználtuk az előző lecke $P'/P = -D/(1+y)$ összefüggését. Ha a tartási idő megegyezik a durációval, $H = D$, a két hatás elsőrendben kioltja egymást: egy kis párhuzamos eltolódás nem változtat a horizontbeli értéken."),

    h("A jelenérték és a duráció illesztése"),
    p("Ebből adódik az **immunizáció** receptje. Olyan eszközöket kell választani, amelyekre"),
    eq("PV_A = PV_L \\qquad \\text{és} \\qquad D_A = D_L,"),
    p("ahol $D_A$ a kötvények durációinak értékkel súlyozott átlaga. Két kötvénnyel, egy $D_S$ durációjú rövid és egy $D_{Lg}$ durációjú hosszú kötvénnyel, a pénz $w$ hányadát a rövid, $1 - w$ hányadát a hosszú kötvénybe tesszük. A $w\\,D_S + (1-w)\\,D_{Lg} = D_L$ feltételből"),
    eq("w = \\frac{D_{Lg} - D_L}{D_{Lg} - D_S}."),
    note("Immunizáció: a kötelezettséggel azonos jelenértékű és azonos durációjú eszközöket kell tartani. Ekkor egy kis párhuzamos hozameltolódás mindkét értéket ugyanannyival változtatja."),

    {
      kind: "check",
      id: "immunization/barbell-weight",
      prompt: "Egy kötelezettség durációja 7. Egy 2-es durációjú rövid és egy 10-es durációjú hosszú kötvénnyel immunizálod. A pénz hányad részét fekteted a rövid kötvénybe? A választ százalékban add meg.",
      answer: { type: "number", value: 37.5, tolerance: 0.5, unit: "%" },
      explain: "A $w\\,D_S + (1 - w)\\,D_{Lg} = D_L$ feltételből $w = (10 - 7)/(10 - 2) = 0{,}375$. Minél közelebb van a kötelezettség durációja a hosszú kötvényéhez, annál kevesebb kerül a rövidbe.",
    },

    h("Számpélda"),
    p("Vegyünk egy kétéves és egy tizenkét éves, egyaránt 5%-os kuponú kötvényt; $y = 5\\%$ mellett mindkettő névértéken forog. A durációk $D_S \\approx 1{,}952$ és $D_{Lg} \\approx 9{,}306$, így"),
    eq("w = \\frac{9{,}306 - 7}{9{,}306 - 1{,}952} \\approx 0{,}3136."),
    p("A pénztár 222 888 értékben vesz a kétéves és 487 793 értékben a tizenkét éves kötvényből, összesen 710 681 értékben, és az eszközök durációja pontosan 7. Most toljuk el az összes hozamot ugyanannyival, és árazzunk újra mindent:"),
    list(
      "$\\Delta y = -1\\%$: az eszközök és a kötelezettség is nagyjából 49 200-zal nő; a többlet $+747$.",
      "$\\Delta y = +1\\%$: mindkettő nagyjából 45 600-zal csökken; a többlet $+642$.",
      "$\\Delta y = \\pm 3\\%$: a többlet $+7\\,861$, illetve $+4\\,985$.",
    ),
    p("Vessük össze a két fedezetlen változattal. Ha minden a kétéves kötvényben van, 1%-os hozamcsökkenés 35 832-es hiányt okoz, mert a kötvény alig drágul, a kötelezettség viszont erősen nő. Ha minden a tizenkét éves kötvényben van, 1%-os emelkedés után 13 958 a hiány."),

    p("Ugyanez a két kötvény más kötelezettséget is immunizálhat. Legyen 500 000 esedékes 5 év múlva, továbbra is 5%-os lapos hozamgörbe mellett."),
    {
      kind: "worked",
      title: "Ötéves kötelezettség immunizálása a 2 és a 12 éves kötvénnyel",
      steps: [
        { text: "A kötelezettség jelenértéke.", tex: "PV_L = \\frac{500\\,000}{1{,}05^{5}}", result: { value: 391763, tolerance: 2 } },
        { text: "A 2 éves kötvénybe fektetett hányad, $D_S \\approx 1{,}952$ és $D_{Lg} \\approx 9{,}306$ mellett.", tex: "w = \\frac{D_{Lg} - D_L}{D_{Lg} - D_S}", result: { value: 0.5856, tolerance: 0.0005 } },
        { text: "A 2 éves kötvénybe fektetett összeg.", tex: "w \\cdot PV_L", result: { value: 229411, tolerance: 100 } },
        { text: "A 12 éves kötvénybe fektetett összeg.", tex: "(1 - w) \\cdot PV_L", result: { value: 162352, tolerance: 100 } },
      ],
    },
    p("Rövidebb kötelezettséghez több rövid kötvény kell: a pénz 59%-a a korábbi 31% helyett."),

    h("Miért marad pozitív a többlet"),
    p("A durációillesztés eltünteti a többlet elsőrendű tagját. A másodrendű tag a konvexitások különbségéből adódik:"),
    eq("\\Delta S \\approx \\tfrac{1}{2}\\,(C_A - C_L)\\,PV_L\\,(\\Delta y)^2."),
    p("Egy rövid és egy hosszú kötvényből álló **súlyzóportfólió** a pénzáramait a kötelezettség időpontja köré teríti, ezért nagyobb a konvexitása, mint egyetlen hetedik évi kifizetésé: itt $C_A \\approx 70{,}27$, szemben a $C_L \\approx 50{,}79$-cel. A képlet 1%-os elmozdulásra mindkét irányban nagyjából 692-es többletet ad, közel a pontos 747-hez és 642-höz. Amíg $C_A \\ge C_L$, minden kis párhuzamos eltolódás nemnegatív többletet hagy. A védelem azonban csak ennyit ér: ha a rövid és a hosszú hozamok eltérően mozognak, a súlyzó veszíthet."),

    {
      kind: "check",
      id: "immunization/convexity-sign",
      prompt: "Egy durációra illesztett súlyzóportfólió konvexitása nagyobb a kötelezettségénél ($C_A > C_L$). A hozamok kicsit, párhuzamosan elmozdulnak. Mi történik a többlettel?",
      answer: {
        type: "choice",
        options: [
          "Kissé pozitív lesz, akár emelkednek, akár csökkennek a hozamok.",
          "Pontosan nulla marad, mert a durációk egyeznek.",
          "Hozamcsökkenéskor pozitív, hozamemelkedéskor negatív lesz.",
          "Mindkét irányban negatív lesz.",
        ],
        correct: 0,
      },
      explain: "A durációillesztés eltünteti az elsőrendű tagot; ami marad, az $\\tfrac{1}{2}(C_A - C_L)\\,PV_L\\,(\\Delta y)^2$, ez $C_A > C_L$ esetén $\\Delta y$ bármely előjelére pozitív.",
    },

    h("Újrasúlyozás"),
    p("Az immunizált pozíció magától nem marad immunizált. Ha a hozamok nem változnak, minden duráció évente egy évvel rövidül, és az illesztés megmarad. Ha viszont a hozamok elmozdulnak, a két kötvény durációja eltérő mértékben változik, a kötelezettségé pedig nem: 1%-os emelkedés után az eszközök durációja 6,796, 1%-os csökkenés után 7,205, miközben $D_L = 7$ mindkét esetben. A pénztárnak újra ki kell számolnia $w$-t, és kereskedéssel vissza kell állítania a célsúlyt; a gyakorlatban ezt időszakonként teszi, nem folyamatosan."),
    p("Az ábrán a portfólió a kezdetben rögzített névértékeket tartja. Húzd a sokk jelölőjét a sávon, vagy használd a nyílbillentyűket, és told el az összes hozamot legfeljebb 300 bázisponttal bármelyik irányba. A két sáv az eszközök és a kötelezettség jelenértékét mutatja, a kijelzők a többletet és a két durációt. Alatta a kis grafikon a többletet ábrázolja a sokk függvényében; a már bejárt szakaszok kiemelve látszanak. Durációillesztett portfóliónál a görbe lapos U alakú, és sosem megy nulla alá. Válts a „Csak a rövid kötvény” vagy a „Csak a hosszú kötvény” beállításra, és ugyanaz a húzás az egyik oldalon hiányt nyit."),
    figure("immunization-shock"),

    h("Összefoglalás"),
    list(
      "Egy rögzített kötelezettség kupon nélküli kifizetés: a durációja a lejárata.",
      "A durációval egyenlő horizonton az árfolyamkockázat és az újrabefektetési kockázat elsőrendben kioltja egymást.",
      "Az immunizáció a jelenértéket és a durációt illeszti; két kötvénnyel a súly a $w\\,D_S + (1-w)\\,D_{Lg} = D_L$ egyenletből adódik.",
      "Ha az eszközök konvexitása legalább akkora, mint a kötelezettségé, a kis párhuzamos eltolódások nemnegatív többletet hagynak; a nem párhuzamos mozgások ellen nem véd.",
      "A hozamok mozgásával a durációk elcsúsznak, ezért a pozíciót újra kell súlyozni.",
    ),
    note("A következő lecke, az „Azonnali kamatok, forward kamatok és a hozamgörbe”, elhagyja a lapos görbét, és lejáratonként eltérő hozamokat enged meg; éppen ez az, ami ellen a párhuzamos eltolódásra épülő immunizáció nem véd."),
    lab("/immunization", "Próbáld ki az Immunizációs laborban"),
  ],
};
