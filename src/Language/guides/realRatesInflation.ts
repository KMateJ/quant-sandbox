import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, p } from "./blocks";

export const realRatesInflation: GuideLessonContent = {
  en: [
    p("\"Interest, compounding and discounting\" treated a rate as a plain number: money grows by $r$ each year. In practice the money you get back buys less if prices have risen, so a rate that looks generous can hide a loss. This lesson separates the **nominal** rate, quoted in money, from the **real** rate, measured in purchasing power, and uses the split to price bonds whose payments follow inflation. It builds on \"Bond prices and yields\" and borrows the idea of a spread from \"Credit risk: default probabilities and credit spreads\"."),

    h("Nominal and real"),
    p("A **nominal** amount is a number of currency units. A **real** amount is the same money expressed in units of purchasing power, that is, deflated by a price index. If prices rise by a factor $(1+\\pi)$ over a year, where $\\pi$ is the inflation rate, 100 next year buys what $100/(1+\\pi)$ buys today."),
    p("Suppose you lend 100 at a nominal rate $i$ for a year and inflation is $\\pi$. You receive $100\\,(1+i)$ in money, which is worth $100\\,(1+i)/(1+\\pi)$ in today's purchasing power. The **real rate** $r$ is the growth of purchasing power:"),
    eq("1 + r = \\frac{1+i}{1+\\pi}."),

    h("The Fisher relation"),
    p("Rearranged, the definition of the real rate is the **Fisher relation**:"),
    eq("1 + i = (1+r)(1+\\pi), \\qquad i = r + \\pi + r\\pi \\approx r + \\pi."),
    p("The approximation $i \\approx r + \\pi$ drops the cross term $r\\pi$, which is small when both rates are small. For $r = 2\\%$ and $\\pi = 3\\%$ the exact nominal rate is $1.02 \\times 1.03 - 1 = 5.06\\%$, against the approximate 5.00%. At moderate rates the difference is a few hundredths of a percentage point; at high inflation it is not negligible."),
    {
      kind: "check",
      id: "real-rates-inflation/fisher",
      prompt: "The real rate is 2% and expected inflation is 3%. What is the exact nominal rate implied by the Fisher relation, in per cent?",
      answer: { type: "number", value: 5.06, tolerance: 0.005, unit: "%" },
      explain: "$1 + i = (1+r)(1+\\pi) = 1.02 \\times 1.03 = 1.0506$, so $i = 5.06\\%$. The approximation $r + \\pi = 5\\%$ leaves out the cross term $r\\pi = 0.06\\%$.",
    },

    h("Discounting real cash flows"),
    p("Both ways of describing a payment are equivalent, provided they are not mixed. **Real cash flows are discounted at the real rate, nominal cash flows at the nominal rate.** A payment that is 100 in today's purchasing power in $t$ years is $100\\,(1+\\pi)^t$ in money; discounting that at $(1+i)^t = (1+r)^t(1+\\pi)^t$ gives $100/(1+r)^t$, the same value as discounting the real amount at $r$."),
    p("The classic error is to discount real flows at a nominal rate (or nominal flows at a real rate). The result understates the value of the first by the factor $(1+\\pi)^t$ and overstates the second by the same factor. Over 10 years at 3% inflation the factor $1.03^{10} \\approx 1.34$ makes the last payment's value wrong by 34%."),

    h("Inflation-linked bonds"),
    p("An **inflation-linked bond**, or linker, fixes its payments in real terms. Its principal is scaled by the price index, and the coupon is a fixed real rate applied to that scaled principal. With an index factor $(1+\\pi)^t$, a real coupon rate $c$ and face value 100, the nominal payment at time $t$ is"),
    eq("100\\,c\\,(1+\\pi)^t \\quad (t = 1, \\dots, T-1), \\qquad 100\\,(c+1)\\,(1+\\pi)^T \\ \\text{at maturity.}"),
    p("The price per 100 of indexed principal is then the real flows discounted at the real rate:"),
    eq("P = \\sum_{t=1}^{T} \\frac{100\\,c}{(1+r)^t} + \\frac{100}{(1+r)^T}."),
    p("The result does not depend on the inflation forecast: by the consistency rule, discounting the indexed nominal flows at the Fisher nominal rate gives the same number. That is the attraction of a linker. Its real value is fixed; a nominal bond's real value changes with inflation."),
    figure("fisher-real-rate"),
    p("In the figure, the two bonds are both worth 100 at the expected inflation: the nominal bond has a coupon equal to the Fisher nominal yield, the linker a real coupon equal to the real rate. The chart shows their value in today's purchasing power as realised inflation changes. The linker stays at 100; the nominal bond falls as inflation rises above the expectation, because its coupons and principal are fixed in money. With a real rate of 1%, expected inflation of 3% and realised inflation of 5%, the nominal bond (10 years) is worth 85.17 in real terms."),

    h("Breakeven inflation"),
    p("The market prices both kinds of bond. The difference between the nominal yield $i$ and the real yield $r$ of bonds of the same maturity is the inflation that would make an investor indifferent, the **breakeven inflation rate**:"),
    eq("\\pi_{\\text{BE}} = \\frac{1+i}{1+r} - 1 \\approx i - r."),
    p("If a nominal bond yields 4.03% and a linker 1%, the breakeven is $1.0403/1.01 - 1 = 3.00\\%$. If actual inflation turns out higher, the linker was the better holding; if lower, the nominal bond. Breakeven inflation is not a pure forecast. Like a credit spread, it is a market price that also contains compensation for risk (inflation uncertainty, differences in liquidity), so it may differ from what investors expect."),
    {
      kind: "check",
      id: "real-rates-inflation/who-benefits",
      prompt: "Which bond's nominal cash flows rise when inflation turns out higher than expected?",
      answer: { type: "choice", options: ["A fixed-coupon nominal bond", "An inflation-linked bond", "Neither", "Both"], correct: 1 },
      explain: "A linker's principal and coupons are scaled by the price index, so its nominal payments rise with inflation and its real value stays fixed. A nominal bond's payments are fixed in money, so its real value falls.",
    },
    {
      kind: "check",
      id: "real-rates-inflation/breakeven",
      prompt: "A nominal bond yields 4.5% and a linker of the same maturity yields 1.5%. What is the exact breakeven inflation rate, in per cent?",
      answer: { type: "number", value: 2.96, tolerance: 0.01, unit: "%" },
      explain: "$\\pi_{\\text{BE}} = 1.045/1.015 - 1 \\approx 2.96\\%$; the difference of the yields, 3.00%, is a slight overstatement.",
    },

    h("Pricing a linker"),
    p("Consider a 10-year linker with a 2% real coupon, priced at a real yield of 1%, with inflation of 3% a year. Because the real coupon is above the real yield, the bond trades above its indexed principal. The first nominal coupon is the real coupon scaled by one year of inflation, and the principal is scaled by ten."),
    {
      kind: "worked",
      title: "A 10-year inflation-linked bond with a 2% real coupon",
      steps: [
        { text: "The real annuity factor at 1% over 10 years.", tex: "\\frac{1 - 1.01^{-10}}{0.01}", result: { value: 9.4713, tolerance: 0.001 } },
        { text: "Present value of the 2% real coupons per 100 of principal.", tex: "2 \\times 9.4713", result: { value: 18.9426, tolerance: 0.01 } },
        { text: "Present value of the indexed principal.", tex: "\\frac{100}{1.01^{10}}", result: { value: 90.5287, tolerance: 0.01 } },
        { text: "The price per 100 of indexed principal.", tex: "P = 18.9426 + 90.5287", result: { value: 109.47, tolerance: 0.01 } },
        { text: "The first nominal coupon, with 3% inflation.", tex: "100 \\times 0.02 \\times 1.03", result: { value: 2.06, tolerance: 0.001 } },
        { text: "The nominal principal repaid at maturity.", tex: "100 \\times 1.03^{10}", result: { value: 134.39, tolerance: 0.01 } },
      ],
    },

    h("Summary"),
    list(
      "A real amount is a nominal amount deflated by a price index; the real rate is the growth of purchasing power.",
      "The Fisher relation is $1+i = (1+r)(1+\\pi)$; the approximation $i \\approx r + \\pi$ leaves out the cross term $r\\pi$.",
      "Discount real cash flows at the real rate and nominal cash flows at the nominal rate; never mix them.",
      "An inflation-linked bond has a fixed real value: its principal and coupons follow the price index, and it is priced by discounting real flows at the real rate.",
      "Breakeven inflation, the nominal yield against the real yield, is a market price that also contains a risk premium.",
    ),
    lab("/bond-pricing", "Open the Bond Lab to price a bond at different yields"),
  ],
  hu: [
    p("A „Kamat, kamatozás és diszkontálás” a kamatlábat egyszerű számként kezelte: a pénz évente $r$-rel nő. A gyakorlatban a visszakapott pénzen kevesebbet lehet venni, ha az árak emelkedtek, így egy bőkezűnek látszó kamat is veszteséget rejthet. Ez a lecke szétválasztja a pénzben kifejezett **nominális** kamatot a vásárlóerőben mért **reálkamattól**, és a felbontással olyan kötvényeket árazunk, amelyek kifizetései követik az inflációt. A „Kötvényárak és hozamok” leckére épít, és a felár fogalmát a „Hitelkockázat: csődvalószínűség és hitelfelár” leckéből kölcsönzi."),

    h("Nominális és reál"),
    p("A **nominális** összeg pénzegységek száma. A **reál** összeg ugyanez a pénz vásárlóerőben kifejezve, vagyis árindexszel deflálva. Ha az árak egy év alatt $(1+\\pi)$-szeresükre nőnek, ahol $\\pi$ az infláció, akkor a jövő évi 100 annyit vesz, mint ma a $100/(1+\\pi)$."),
    p("Tegyük fel, hogy 100-at kölcsönzünk egy évre $i$ nominális kamattal, az infláció pedig $\\pi$. Pénzben $100\\,(1+i)$-t kapunk vissza, ami mai vásárlóerőben $100\\,(1+i)/(1+\\pi)$ értékű. A **reálkamat** $r$ a vásárlóerő növekedése:"),
    eq("1 + r = \\frac{1+i}{1+\\pi}."),

    h("A Fisher-összefüggés"),
    p("Átrendezve a reálkamat definíciója a **Fisher-összefüggés**:"),
    eq("1 + i = (1+r)(1+\\pi), \\qquad i = r + \\pi + r\\pi \\approx r + \\pi."),
    p("Az $i \\approx r + \\pi$ közelítés elhagyja az $r\\pi$ keresztszorzatot, ami kicsi, ha mindkét kamat kicsi. $r = 2\\%$ és $\\pi = 3\\%$ esetén a pontos nominális kamat $1{,}02 \\times 1{,}03 - 1 = 5{,}06\\%$, a közelítő 5,00%. Mérsékelt kamatoknál a különbség néhány század százalékpont; magas inflációnál már nem elhanyagolható."),
    {
      kind: "check",
      id: "real-rates-inflation/fisher",
      prompt: "A reálkamat 2%, a várt infláció 3%. Mekkora a Fisher-összefüggésből adódó pontos nominális kamat, százalékban?",
      answer: { type: "number", value: 5.06, tolerance: 0.005, unit: "%" },
      explain: "$1 + i = (1+r)(1+\\pi) = 1{,}02 \\times 1{,}03 = 1{,}0506$, tehát $i = 5{,}06\\%$. A közelítő $r + \\pi = 5\\%$ kihagyja az $r\\pi = 0{,}06\\%$ keresztszorzatot.",
    },

    h("Reál pénzáramok diszkontálása"),
    p("A kifizetés két leírása egyenértékű, ha nem keverjük őket. **A reál pénzáramokat a reálkamattal, a nominálisakat a nominális kamattal diszkontáljuk.** Egy kifizetés, amely $t$ év múlva mai vásárlóerőben 100, pénzben $100\\,(1+\\pi)^t$; ezt $(1+i)^t = (1+r)^t(1+\\pi)^t$-vel diszkontálva $100/(1+r)^t$-t kapunk, ugyanazt, mint a reál összeget $r$-rel diszkontálva."),
    p("A klasszikus hiba a reál pénzáramokat nominális kamattal (vagy a nominálisakat reálkamattal) diszkontálni. Az eredmény az elsőt $(1+\\pi)^t$-szeresével alulbecsüli, a másodikat ugyanennyivel felülbecsüli. 10 év alatt, 3% inflációnál az $1{,}03^{10} \\approx 1{,}34$ szorzó az utolsó kifizetés értékét 34%-kal téveszti el."),

    h("Inflációkövető kötvények"),
    p("Az **inflációkövető kötvény** a kifizetéseit reálértékben rögzíti. A tőkéjét az árindex skálázza, a kupon pedig egy fix reálkamat erre a skálázott tőkére. $(1+\\pi)^t$ indexszorzóval, $c$ reálkupon-kamattal és 100-as névértékkel a nominális kifizetés a $t$ időpontban"),
    eq("100\\,c\\,(1+\\pi)^t \\quad (t = 1, \\dots, T-1), \\qquad 100\\,(c+1)\\,(1+\\pi)^T \\ \\text{a lejáratkor.}"),
    p("Az ár 100 indexált tőkére vetítve a reál pénzáramok reálkamattal diszkontált összege:"),
    eq("P = \\sum_{t=1}^{T} \\frac{100\\,c}{(1+r)^t} + \\frac{100}{(1+r)^T}."),
    p("Az eredmény nem függ az inflációs előrejelzéstől: a konzisztencia-szabály szerint az indexált nominális pénzáramokat a Fisher-féle nominális kamattal diszkontálva ugyanazt a számot kapjuk. Ez az inflációkövető kötvény vonzereje. Reálértéke rögzített; a nominális kötvény reálértéke az inflációval változik."),
    figure("fisher-real-rate"),
    p("Az ábrán mindkét kötvény értéke 100 a várt inflációnál: a nominális kötvény kuponja a Fisher-féle nominális hozam, az inflációkövetőé a reálkamattal egyenlő reálkupon. A grafikon a mai vásárlóerőben mért értéküket mutatja a ténylegesen megvalósuló infláció függvényében. Az inflációkövető kötvény 100 marad; a nominális kötvény értéke csökken, ha az infláció a vártnál magasabb, mert kuponjai és tőkéje pénzben rögzítettek. 1%-os reálkamat, 3%-os várt és 5%-os tényleges infláció mellett a nominális (10 éves) kötvény reálértéke 85,17."),

    h("Kiegyenlítő infláció"),
    p("A piac mindkét típusú kötvényt árazza. Az azonos lejáratú kötvények $i$ nominális és $r$ reálhozama közötti különbség az az infláció, amelynél a befektető közömbös, a **kiegyenlítő (breakeven) inflációs ráta**:"),
    eq("\\pi_{\\text{BE}} = \\frac{1+i}{1+r} - 1 \\approx i - r."),
    p("Ha a nominális kötvény hozama 4,03%, az inflációkövetőé 1%, a kiegyenlítő infláció $1{,}0403/1{,}01 - 1 = 3{,}00\\%$. Ha a tényleges infláció magasabb, az inflációkövető volt a jobb választás, ha alacsonyabb, a nominális kötvény. A kiegyenlítő infláció nem tiszta előrejelzés. A hitelfelárhoz hasonlóan piaci ár, amely kockázati kompenzációt is tartalmaz (inflációs bizonytalanság, likviditási különbségek), ezért eltérhet attól, amit a befektetők várnak."),
    {
      kind: "check",
      id: "real-rates-inflation/who-benefits",
      prompt: "Melyik kötvény nominális pénzáramai nőnek, ha az infláció a vártnál magasabb?",
      answer: { type: "choice", options: ["A fix kuponos nominális kötvényé", "Az inflációkövető kötvényé", "Egyiké sem", "Mindkettőé"], correct: 1 },
      explain: "Az inflációkövető kötvény tőkéjét és kuponjait az árindex skálázza, így nominális kifizetései nőnek az inflációval, reálértéke pedig állandó. A nominális kötvény kifizetései pénzben rögzítettek, így reálértéke csökken.",
    },
    {
      kind: "check",
      id: "real-rates-inflation/breakeven",
      prompt: "Egy nominális kötvény hozama 4,5%, egy azonos lejáratú inflációkövetőé 1,5%. Mekkora a pontos kiegyenlítő inflációs ráta, százalékban?",
      answer: { type: "number", value: 2.96, tolerance: 0.01, unit: "%" },
      explain: "$\\pi_{\\text{BE}} = 1{,}045/1{,}015 - 1 \\approx 2{,}96\\%$; a hozamok különbsége, 3,00%, kissé túlbecsüli.",
    },

    h("Egy inflációkövető kötvény árazása"),
    p("Vegyünk egy 10 éves inflációkövető kötvényt 2%-os reálkuponnal, 1%-os reálhozamon árazva, évi 3% inflációval. Mivel a reálkupon a reálhozam fölött van, a kötvény az indexált tőkéje fölött forog. Az első nominális kupon az egyéves inflációval skálázott reálkupon, a tőkét tízévnyi infláció skálázza."),
    {
      kind: "worked",
      title: "Egy 10 éves inflációkövető kötvény 2%-os reálkuponnal",
      steps: [
        { text: "A reál annuitásfaktor 1%-nál, 10 évre.", tex: "\\frac{1 - 1{,}01^{-10}}{0{,}01}", result: { value: 9.4713, tolerance: 0.001 } },
        { text: "A 2%-os reálkuponok jelenértéke 100 tőkére.", tex: "2 \\times 9{,}4713", result: { value: 18.9426, tolerance: 0.01 } },
        { text: "Az indexált tőke jelenértéke.", tex: "\\frac{100}{1{,}01^{10}}", result: { value: 90.5287, tolerance: 0.01 } },
        { text: "Az ár 100 indexált tőkére.", tex: "P = 18{,}9426 + 90{,}5287", result: { value: 109.47, tolerance: 0.01 } },
        { text: "Az első nominális kupon 3% inflációnál.", tex: "100 \\times 0{,}02 \\times 1{,}03", result: { value: 2.06, tolerance: 0.001 } },
        { text: "A lejáratkor visszafizetett nominális tőke.", tex: "100 \\times 1{,}03^{10}", result: { value: 134.39, tolerance: 0.01 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "A reál összeg az árindexszel deflált nominális összeg; a reálkamat a vásárlóerő növekedése.",
      "A Fisher-összefüggés $1+i = (1+r)(1+\\pi)$; az $i \\approx r + \\pi$ közelítés elhagyja az $r\\pi$ keresztszorzatot.",
      "A reál pénzáramokat reálkamattal, a nominálisakat nominális kamattal diszkontáljuk; soha ne keverjük őket.",
      "Az inflációkövető kötvény reálértéke rögzített: tőkéje és kuponjai követik az árindexet, és a reál pénzáramok reálkamattal diszkontálásával árazzuk.",
      "A kiegyenlítő infláció, a nominális és a reálhozam különbsége, piaci ár, amely kockázati prémiumot is tartalmaz.",
    ),
    lab("/bond-pricing", "Nyisd meg a Kötvény labort, és árazz kötvényeket különböző hozamokon"),
  ],
};
