import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p, steps } from "./blocks";

export const interestRateSwaps: GuideLessonContent = {
  en: [
    p("An interest rate swap is the most traded interest rate derivative. Two parties exchange interest payments on the same amount: one pays a fixed rate, the other a floating rate that is reset every period. This lesson shows that a swap is a pair of bonds in disguise, prices it with the discount factors of \"Spot rates, forward rates and the yield curve\", and derives the par swap rate. It also uses bond pricing from \"Bond prices and yields\"."),

    h("A plain-vanilla swap"),
    p("A **plain-vanilla interest rate swap** is fixed by four things:"),
    list(
      "a **notional** $N$, the amount on which interest is calculated. It is never exchanged;",
      "a **fixed rate** $s$, agreed today for the whole life of the swap;",
      "a **floating rate** $L_i$ for each period, a short-term reference rate observed at the start of the period (the **reset date**) and paid at its end;",
      "**payment dates** $t_1 < t_2 < \\dots < t_n$, with accrual fractions $\\tau_i = t_i - t_{i-1}$ in years ($t_0 = 0$).",
    ),
    p("On each date $t_i$ the **fixed leg** pays $N s\\,\\tau_i$ and the **floating leg** pays $N L_i\\,\\tau_i$. In practice only the difference changes hands. The party that pays fixed and receives floating holds a **payer swap**; the other side holds a **receiver swap**. Throughout this lesson payments are annual, so $\\tau_i = 1$, but the formulas keep $\\tau_i$ so they work for any frequency."),

    h("The swap as two bonds"),
    p("Add a fictitious exchange of the notional $N$ at maturity $t_n$ on both legs. The two exchanges cancel, so the swap is unchanged. Now each leg is a bond:"),
    list(
      "the fixed leg is a **fixed-rate bond** with face value $N$ and coupon $s\\,\\tau_i$ per period;",
      "the floating leg is a **floating-rate note** (FRN), a bond whose coupon is the floating rate of each period.",
    ),
    p("A receiver swap is therefore long the fixed-rate bond and short the FRN, and a payer swap is the reverse. Its value is the difference of two bond prices:"),
    eq("V_{\\text{receiver}} = B_{\\text{fix}} - B_{\\text{float}}, \\qquad V_{\\text{payer}} = B_{\\text{float}} - B_{\\text{fix}}."),

    h("The floating-rate note on a reset date"),
    p("Assume the floating rate $L_i$ is the market rate for lending from $t_{i-1}$ to $t_i$, the same rate the discount factors are built from. Then an FRN is worth exactly its face value on every reset date. Work backwards from the end:"),
    steps(
      "At the last reset date $t_{n-1}$ the note will pay $N(1 + L_n\\tau_n)$ at $t_n$. Discounting one period at the same rate $L_n$ gives $N(1 + L_n\\tau_n)/(1 + L_n\\tau_n) = N$.",
      "At $t_{n-2}$ the note pays the coupon $N L_{n-1}\\tau_{n-1}$ at $t_{n-1}$ and is then worth $N$. Together that is $N(1 + L_{n-1}\\tau_{n-1})$, which again discounts to $N$.",
      "Repeating the argument back to today gives $B_{\\text{float}} = N$ at $t_0 = 0$.",
    ),
    p("The intuition: the coupon always pays the current market rate, so the note never trades away from par at a reset. Between reset dates its value moves only a little, because the next coupon is already fixed."),

    h("The fixed leg and the par swap rate"),
    p("Write $P(0,t)$ for the discount factor, the price today of 1 paid at $t$. The fixed-rate bond is a set of known cash flows, so"),
    eq("B_{\\text{fix}} = N s \\sum_{i=1}^{n} \\tau_i\\,P(0,t_i) + N\\,P(0,t_n)."),
    p("The sum $A = \\sum_i \\tau_i P(0,t_i)$ is the **annuity factor**: the value today of receiving 1 per year on the payment dates. A new swap is agreed at the fixed rate that makes it worth zero to both sides, $B_{\\text{fix}} = B_{\\text{float}} = N$. Dividing by $N$ and solving for that rate gives the **par swap rate** $S_n$ of an $n$-period swap:"),
    eq("S_n = \\frac{1 - P(0,t_n)}{\\sum_{i=1}^{n} \\tau_i\\,P(0,t_i)} = \\frac{1 - P(0,t_n)}{A}."),
    note("The par swap rate is the coupon of a bond priced at par: $S_n = (1 - P(0,t_n))/A$, where $A = \\sum_i \\tau_i P(0,t_i)$ is the annuity factor."),

    {
      kind: "check",
      id: "interest-rate-swaps/par-rate",
      prompt: "Annual payments, discount factors $P(0,1) = 0.96$ and $P(0,2) = 0.92$. What is the two-year par swap rate? Answer in percent.",
      answer: { type: "number", value: 4.255, tolerance: 0.01, unit: "%" },
      explain: "$S_2 = (1 - 0.92)/(0.96 + 0.92) = 0.08/1.88 \\approx 4.26\\%$: one minus the last discount factor, over the annuity factor.",
    },

    h("A three-year example"),
    p("Take annual payments and the discount factors $P(0,1) = 0.9589$, $P(0,2) = 0.9160$ and $P(0,3) = 0.8730$. They come from an upward-sloping curve with annually compounded zero rates of about 4.28%, 4.49% and 4.63%, via $P(0,t) = (1 + r(t))^{-t}$; this is the default curve of the figure below. The annuity factor is $A = 0.9589 + 0.9160 + 0.8730 = 2.7479$, and"),
    eq("S_3 = \\frac{1 - 0.8730}{2.7479} = \\frac{0.1270}{2.7479} \\approx 4.62\\%."),
    p("Check: a bond paying 4.62 per year on 100 for three years is worth $4.62 \\cdot 2.7479 + 100 \\cdot 0.8730 \\approx 100.0$, so it trades at par, as it should."),
    p("The one-year forward rates implied by these discount factors are $f_i = P(0,t_{i-1})/P(0,t_i) - 1$: about 4.28%, 4.69% and 4.92%. The par swap rate lies between them. It is their average weighted by the discount factors, $S_n = \\sum_i \\tau_i P(0,t_i)\\,f_i / A$, which follows from $1 - P(0,t_n) = \\sum_i \\big(P(0,t_{i-1}) - P(0,t_i)\\big)$."),

    h("The value of an existing swap"),
    p("After a swap is agreed, rates move and its value is no longer zero. Suppose right after the trade above the whole curve shifts up by half a percentage point, and the discount factors become $0.9543$, $0.9073$ and $0.8606$. The new annuity factor is $A' = 2.7222$, and the new par rate is $S_3' = 0.1394/2.7222 \\approx 5.12\\%$."),
    p("Consider the payer swap with notional $N = 10{,}000{,}000$ that pays the contracted rate $s = S_3 \\approx 4.62\\%$. The floating leg is still worth $N$; the fixed leg is now worth less. Its value is"),
    eq("V_{\\text{payer}} = N\\big[(1 - P(0,t_n)) - s\\,A'\\big] = N\\,(S_n' - s)\\,A' \\approx 10{,}000{,}000 \\times 0.00499 \\times 2.7222 \\approx 135{,}900."),
    p("The payer gains because it locked in paying 4.62% when the market rate for the same swap is now 5.12%. The second form is worth remembering: an existing swap is worth the difference between the current and the contracted swap rate, paid on the annuity."),
    p("The same formula gives the swap's sensitivity. A change of one basis point (0.01%) in the swap rate changes the value by about $N A \\times 0.0001$. This is the swap's **DV01**, here $10{,}000{,}000 \\times 2.7222 \\times 0.0001 \\approx 2{,}722$. It plays the role that duration played in \"Duration and convexity\"."),
    p("The figure lays out this swap's cash flows on a timeline. Each year the payer receives the floating payment, an upward arrow of length $N f_i$ (its expected value, from the forward rate), and pays the fixed payment $N s$, a downward arrow. The solid part of each arrow is its present value and the faded rest is the discount. Hover over, focus or tap a payment to see its amount, its discount factor $P(0,t_i)$ and the multiplication that gives its present value. On today's curve the two legs are worth the same, so the swap is worth 0. Then switch the curve to +50 bp and note that only the floating arrows grow, because the fixed rate was agreed at 4.62%; the value to the payer becomes about 135,800, the number computed above. The small gap to 135,900 comes from rounding the swap rates."),
    figure("swap-timeline"),

    p("Now let the curve fall instead: the whole zero curve moves down by half a percentage point, and the discount factors become $0.9635$, $0.9248$ and $0.8856$."),
    {
      kind: "worked",
      title: "The same payer swap after a 50 bp fall",
      steps: [
        { text: "New annuity factor.", tex: "A' = \\sum_{i=1}^{3} P'(0,t_i)", result: { value: 2.7739, tolerance: 0.0005 } },
        { text: "New three-year par swap rate.", tex: "S_3' = \\frac{1 - P'(0,t_3)}{A'}", result: { value: 4.124, tolerance: 0.005, unit: "%" } },
        { text: "Value to the payer, who still pays $s = 4.62\\%$ (more precisely 4.622%) on $N = 10{,}000{,}000$.", tex: "V_{\\text{payer}} = N\\,(S_3' - s)\\,A'", result: { value: -138100, tolerance: 400 } },
        { text: "DV01 on the new curve.", tex: "N\\,A' \\times 0.0001", result: { value: 2774, tolerance: 2 } },
      ],
    },
    p("The loss on a fall is a little larger than the gain on a rise of the same size, because the annuity factor is larger when rates are lower."),
    {
      kind: "check",
      id: "interest-rate-swaps/payer-falls",
      prompt: "You entered a payer swap (you pay fixed, receive floating) at the par rate. The next day the whole curve falls. What is your swap worth now?",
      answer: {
        type: "choice",
        options: [
          "Less than zero: you pay a fixed rate above the new par rate.",
          "More than zero: lower rates make the fixed payments cheaper to discount.",
          "Exactly zero: the floating leg stays at par.",
          "It depends on the notional, not on rates.",
        ],
        correct: 0,
      },
      explain: "$V_{\\text{payer}} = N\\,(S_n' - s)\\,A'$ and $S_n' < s$ after a fall, so the value is negative. The floating leg does stay at par, but the fixed leg you owe is now worth more.",
    },

    h("Uses of swaps"),
    list(
      "**Changing the type of debt.** A firm that issued a fixed-rate bond and enters a receiver swap receives fixed and pays floating, so in total it pays a floating rate. A payer swap turns floating-rate debt into fixed.",
      "**Hedging interest rate risk.** A bank whose assets are long fixed-rate loans can pay fixed on a swap so that a rise in rates no longer hurts it.",
      "**Expressing a view on rates.** A payer swap gains when rates rise and a receiver swap gains when they fall, without buying or selling any bonds.",
    ),

    h("Par swap rates and the zero curve"),
    p("The figure uses a smooth zero curve $r(t) = \\text{level} + \\text{slope}\\,(1 - e^{-t/3})$ with annual compounding, so $P(0,t) = (1 + r(t))^{-t}$, the same convention as the annual fixed payments. The **level** is the rate at the short end ($r(0) = \\text{level}$), and the **slope** is how far the long end lies above it: as $t$ grows, $r(t)$ approaches level + slope. For each maturity $n$ from 1 to 10 years it draws the zero rate $r(n)$ and the par swap rate $S_n$. The readouts give the 5-year par swap rate, the 5-year annuity factor, the DV01 of a 5-year swap per 1,000,000 of notional and the 10-year par swap rate. At the defaults (level 4%, slope +1 percentage point) the 5-year swap rate is about 4.79% against a 5-year zero rate of 4.81%, the annuity factor is 4.3695, the DV01 about 437 and the 10-year swap rate 4.94% against a zero rate of 4.96%. Set the slope to zero: with a flat curve the par swap rate equals the zero rate at every maturity. With a rising curve the swap rate lies slightly below the zero rate of the same maturity, because it weights the early, lower forward rates more heavily; in the example above $S_3 \\approx 4.62\\%$ against a 3-year zero rate of 4.63%. Make the slope negative and the swap rate lies slightly above."),
    figure("swap-rate"),

    h("Summary"),
    list(
      "A swap exchanges fixed payments $N s\\tau_i$ for floating payments $N L_i\\tau_i$ on a notional that is never exchanged.",
      "A receiver swap is a long fixed-rate bond and a short floating-rate note; the note is worth par on every reset date.",
      "The par swap rate is $S_n = (1 - P(0,t_n))/A$ with the annuity factor $A = \\sum_i \\tau_i P(0,t_i)$.",
      "An existing payer swap paying $s$ is worth $N(S_n' - s)A'$, and its DV01 is about $N A \\times 0.0001$.",
    ),
    lab("/yield-curve", "Shape the curve whose discount factors price the swap in the Yield Curve lab"),
  ],

  hu: [
    p("A kamatswap (kamatcsereügylet) a legtöbbet kereskedett kamatderivatíva. Két fél ugyanarra az összegre számolt kamatfizetéseket cserél: az egyik fix kamatot fizet, a másik változót, amelyet minden időszak elején újra rögzítenek. A lecke megmutatja, hogy a swap valójában két kötvény különbsége, beárazza az „Azonnali kamatok, forward kamatok és a hozamgörbe” című lecke diszkontfaktoraival, és levezeti a par swapkamatot. Épít a „Kötvényárak és hozamok” kötvényárazására is."),

    h("Az egyszerű kamatswap"),
    p("Az **egyszerű (plain-vanilla) kamatswapot** négy dolog határozza meg:"),
    list(
      "a **névleges összeg** $N$, amelyre a kamatot számolják; ezt soha nem cserélik ki;",
      "a **fix kamatláb** $s$, amelyet ma rögzítenek az ügylet teljes futamidejére;",
      "minden időszakra egy **változó kamatláb** $L_i$: egy rövid lejáratú referenciakamat, amelyet az időszak elején, a **kamatfixálás napján** figyelnek meg, és az időszak végén fizetnek;",
      "a **kifizetési napok** $t_1 < t_2 < \\dots < t_n$, a $\\tau_i = t_i - t_{i-1}$ években mért kamatszámítási hányadokkal ($t_0 = 0$).",
    ),
    p("Minden $t_i$ napon a **fix láb** $N s\\,\\tau_i$ összeget, a **változó láb** $N L_i\\,\\tau_i$ összeget fizet. A gyakorlatban csak a különbség cserél gazdát. Aki fixet fizet és változót kap, az **fix fizető swapot** (payer swap) tart; a másik fél **fix kapó swapot** (receiver swap). A leckében a kifizetések évesek, így $\\tau_i = 1$, a képletek azonban megtartják $\\tau_i$-t, hogy bármilyen gyakoriságra érvényesek legyenek."),

    h("A swap mint két kötvény"),
    p("Adjunk hozzá mindkét lábhoz a $t_n$ lejáratkor egy képzeletbeli $N$ összegű tőkecserét. A két csere kiejti egymást, így a swap nem változik. Most viszont mindkét láb kötvény:"),
    list(
      "a fix láb egy $N$ névértékű, időszakonként $s\\,\\tau_i$ kupont fizető **fix kamatozású kötvény**;",
      "a változó láb egy **változó kamatozású kötvény** (FRN), amelynek kuponja mindig az adott időszak változó kamata.",
    ),
    p("A fix kapó swap tehát long pozíció a fix kamatozású kötvényben és short pozíció az FRN-ben, a fix fizető swap ennek fordítottja. Értéke két kötvényár különbsége:"),
    eq("V_{\\text{kapó}} = B_{\\text{fix}} - B_{\\text{vált}}, \\qquad V_{\\text{fizető}} = B_{\\text{vált}} - B_{\\text{fix}}."),

    h("A változó kamatozású kötvény a kamatfixálás napján"),
    p("Tegyük fel, hogy az $L_i$ változó kamat a $t_{i-1}$ és $t_i$ közötti hitelezés piaci kamata, ugyanaz, amelyből a diszkontfaktorok épülnek. Ekkor az FRN minden kamatfixálási napon pontosan a névértékét éri. Haladjunk visszafelé a végétől:"),
    steps(
      "Az utolsó, $t_{n-1}$ fixálási napon a kötvény $t_n$-kor $N(1 + L_n\\tau_n)$ összeget fog fizetni. Egy időszakot ugyanazzal az $L_n$ kamattal diszkontálva $N(1 + L_n\\tau_n)/(1 + L_n\\tau_n) = N$ adódik.",
      "A $t_{n-2}$ napon a kötvény $t_{n-1}$-kor $N L_{n-1}\\tau_{n-1}$ kupont fizet, és utána $N$-et ér. Ez együtt $N(1 + L_{n-1}\\tau_{n-1})$, ami ismét $N$-re diszkontálódik.",
      "Az érvelést mai napig visszafelé ismételve $B_{\\text{vált}} = N$ adódik $t_0 = 0$-kor.",
    ),
    p("A szemléletes ok: a kupon mindig az aktuális piaci kamatot fizeti, ezért a kötvény fixáláskor sosem tér el a névértéktől. Két fixálási nap között is csak kicsit mozog, mert a következő kupon már rögzített."),

    h("A fix láb és a par swapkamat"),
    p("Jelölje $P(0,t)$ a diszkontfaktort, a $t$-kor fizetett 1 mai árát. A fix kamatozású kötvény ismert pénzáramokból áll, így"),
    eq("B_{\\text{fix}} = N s \\sum_{i=1}^{n} \\tau_i\\,P(0,t_i) + N\\,P(0,t_n)."),
    p("Az $A = \\sum_i \\tau_i P(0,t_i)$ összeg az **annuitásfaktor**: az évi 1 egység mai értéke a kifizetési napokon. Új swapot olyan fix kamattal kötnek, amely mellett mindkét félnek nulla az értéke, vagyis $B_{\\text{fix}} = B_{\\text{vált}} = N$. $N$-nel osztva és erre a kamatra rendezve kapjuk egy $n$ időszakos swap **par swapkamatát**, $S_n$-et:"),
    eq("S_n = \\frac{1 - P(0,t_n)}{\\sum_{i=1}^{n} \\tau_i\\,P(0,t_i)} = \\frac{1 - P(0,t_n)}{A}."),
    note("A par swapkamat egy névértéken forgó kötvény kuponja: $S_n = (1 - P(0,t_n))/A$, ahol $A = \\sum_i \\tau_i P(0,t_i)$ az annuitásfaktor."),

    {
      kind: "check",
      id: "interest-rate-swaps/par-rate",
      prompt: "Éves kifizetések, diszkontfaktorok: $P(0,1) = 0{,}96$ és $P(0,2) = 0{,}92$. Mekkora a kétéves par swapkamat? A választ százalékban add meg.",
      answer: { type: "number", value: 4.255, tolerance: 0.01, unit: "%" },
      explain: "$S_2 = (1 - 0{,}92)/(0{,}96 + 0{,}92) = 0{,}08/1{,}88 \\approx 4{,}26\\%$: egy mínusz az utolsó diszkontfaktor, osztva az annuitásfaktorral.",
    },

    h("Hároméves számpélda"),
    p("Legyenek a kifizetések évesek, a diszkontfaktorok pedig $P(0,1) = 0{,}9589$, $P(0,2) = 0{,}9160$ és $P(0,3) = 0{,}8730$. Ezek egy emelkedő görbéből származnak, nagyjából 4,28%, 4,49% és 4,63%-os éves kamatozású zérókamatokkal, a $P(0,t) = (1 + r(t))^{-t}$ összefüggés szerint; ez az alábbi ábra alapgörbéje. Az annuitásfaktor $A = 0{,}9589 + 0{,}9160 + 0{,}8730 = 2{,}7479$, és"),
    eq("S_3 = \\frac{1 - 0{,}8730}{2{,}7479} = \\frac{0{,}1270}{2{,}7479} \\approx 4{,}62\\%."),
    p("Ellenőrzés: egy 100 névértékre három évig évi 4,62-t fizető kötvény értéke $4{,}62 \\cdot 2{,}7479 + 100 \\cdot 0{,}8730 \\approx 100{,}0$, vagyis névértéken forog, ahogy kell."),
    p("A diszkontfaktorokból adódó egyéves forward kamatok $f_i = P(0,t_{i-1})/P(0,t_i) - 1$: nagyjából 4,28%, 4,69% és 4,92%. A par swapkamat ezek között van. Ez a forward kamatok diszkontfaktorokkal súlyozott átlaga, $S_n = \\sum_i \\tau_i P(0,t_i)\\,f_i / A$, ami az $1 - P(0,t_n) = \\sum_i \\big(P(0,t_{i-1}) - P(0,t_i)\\big)$ azonosságból következik."),

    h("Egy meglévő swap értéke"),
    p("Megkötése után a kamatok elmozdulnak, és a swap értéke már nem nulla. Tegyük fel, hogy közvetlenül a fenti ügylet után az egész görbe fél százalékponttal felfelé tolódik, és a diszkontfaktorok $0{,}9543$, $0{,}9073$ és $0{,}8606$ lesznek. Az új annuitásfaktor $A' = 2{,}7222$, az új par kamat $S_3' = 0{,}1394/2{,}7222 \\approx 5{,}12\\%$."),
    p("Nézzük azt az $N = 10\\,000\\,000$ névleges összegű fix fizető swapot, amely a szerződéses $s = S_3 \\approx 4{,}62\\%$-os kamatot fizeti. A változó láb továbbra is $N$-et ér, a fix láb értéke viszont csökkent. Az ügylet értéke"),
    eq("V_{\\text{fizető}} = N\\big[(1 - P(0,t_n)) - s\\,A'\\big] = N\\,(S_n' - s)\\,A' \\approx 10\\,000\\,000 \\times 0{,}00499 \\times 2{,}7222 \\approx 135\\,900."),
    p("A fix fizető nyer, mert 4,62% fizetését rögzítette, miközben ugyanerre a swapra most 5,12% a piaci kamat. A második alakot érdemes megjegyezni: egy meglévő swap értéke a mostani és a szerződéses swapkamat különbsége, az annuitásfaktorral szorozva."),
    p("Ugyanez a képlet adja az ügylet érzékenységét. Egy bázispontos (0,01%-os) swapkamat-változás nagyjából $N A \\times 0{,}0001$-gyel változtatja az értéket. Ez a swap **DV01**-e, itt $10\\,000\\,000 \\times 2{,}7222 \\times 0{,}0001 \\approx 2722$. Ugyanazt a szerepet tölti be, mint a duráció a „Duráció és konvexitás” című leckében."),
    p("Az ábra ennek a swapnak a pénzáramait egy időtengelyen mutatja. A fix fizető minden évben megkapja a változó kifizetést, egy $N f_i$ hosszú felfelé mutató nyilat (a várható értékét, a forward kamatból), és kifizeti az $N s$ fix összeget, egy lefelé mutató nyilat. Minden nyíl teli része a jelenértéke, a halvány maradék a diszkont. Vidd az egeret egy kifizetésre, fókuszáld vagy koppints rá, és látod az összegét, a $P(0,t_i)$ diszkontfaktort és a szorzást, amely a jelenértékét adja. A mai görbén a két láb ugyanannyit ér, így a swap értéke 0. Ezután állítsd a görbét +50 bázispontra: csak a változó nyilak nőnek, mert a fix kamatot 4,62%-on rögzítették, és a fix fizető számára az érték nagyjából 135 800 lesz, a fent kiszámolt szám. A 135 900-tól való kis eltérés a swapkamatok kerekítéséből adódik."),
    figure("swap-timeline"),

    p("Most essen a görbe: a teljes zérókupon-görbe fél százalékponttal lejjebb kerül, a diszkontfaktorok pedig $0{,}9635$, $0{,}9248$ és $0{,}8856$ lesznek."),
    {
      kind: "worked",
      title: "Ugyanaz a fix fizető swap 50 bázispontos esés után",
      steps: [
        { text: "Az új annuitásfaktor.", tex: "A' = \\sum_{i=1}^{3} P'(0,t_i)", result: { value: 2.7739, tolerance: 0.0005 } },
        { text: "Az új hároméves par swapkamat.", tex: "S_3' = \\frac{1 - P'(0,t_3)}{A'}", result: { value: 4.124, tolerance: 0.005, unit: "%" } },
        { text: "Az érték a fix fizetőnek, aki továbbra is $s = 4{,}62\\%$-ot (pontosabban 4,622%-ot) fizet $N = 10\\,000\\,000$ névértékre.", tex: "V_{\\text{fix}} = N\\,(S_3' - s)\\,A'", result: { value: -138100, tolerance: 400 } },
        { text: "A DV01 az új görbén.", tex: "N\\,A' \\times 0{,}0001", result: { value: 2774, tolerance: 2 } },
      ],
    },
    p("Az esés okozta veszteség kicsit nagyobb, mint az ugyanakkora emelkedés okozta nyereség, mert alacsonyabb kamatok mellett nagyobb az annuitásfaktor."),
    {
      kind: "check",
      id: "interest-rate-swaps/payer-falls",
      prompt: "Par kamaton fix fizető swapot kötöttél (fixet fizetsz, változót kapsz). Másnap az egész görbe esik. Mennyit ér most a swapod?",
      answer: {
        type: "choice",
        options: [
          "Kevesebbet nullánál: az új par kamatnál magasabb fix kamatot fizetsz.",
          "Többet nullánál: alacsonyabb kamatok mellett olcsóbb diszkontálni a fix kifizetéseket.",
          "Pontosan nullát: a változó láb névértéken marad.",
          "A névértéktől függ, nem a kamatoktól.",
        ],
        correct: 0,
      },
      explain: "$V_{\\text{fix}} = N\\,(S_n' - s)\\,A'$, és esés után $S_n' < s$, ezért az érték negatív. A változó láb valóban névértéken marad, de a fizetendő fix láb most többet ér.",
    },

    h("A swapok felhasználása"),
    list(
      "**Az adósság típusának megváltoztatása.** Egy vállalat, amely fix kamatozású kötvényt bocsátott ki, és fix kapó swapot köt, fixet kap és változót fizet, így összességében változó kamatot fizet. A fix fizető swap a változó kamatozású adósságot alakítja fixszé.",
      "**Kamatkockázat fedezése.** Egy bank, amelynek eszközei hosszú, fix kamatozású hitelek, a swapon fixet fizethet, így a kamatemelkedés már nem árt neki.",
      "**Kamatvárakozás kifejezése.** A fix fizető swap emelkedő kamatoknál nyer, a fix kapó csökkenőknél, kötvények vétele vagy eladása nélkül.",
    ),

    h("Par swapkamatok és a zérókupon-görbe"),
    p("Az ábra az $r(t) = \\text{szint} + \\text{meredekség}\\,(1 - e^{-t/3})$ sima zérókupon-görbét használja éves kamatozással, így $P(0,t) = (1 + r(t))^{-t}$, ugyanazzal a konvencióval, mint az éves fix kifizetések. A **szint** a rövid vég kamata ($r(0) = \\text{szint}$), a **meredekség** pedig azt adja meg, mennyivel van fölötte a hosszú vég: $t$ növekedésével $r(t)$ a szint + meredekség értékhez közelít. Minden $n$ lejáratra 1 és 10 év között megrajzolja az $r(n)$ zérókamatot és az $S_n$ par swapkamatot. A kijelzők az ötéves par swapkamatot, az ötéves annuitásfaktort, egy ötéves swap 1 000 000 névleges összegre vett DV01-ét és a tízéves par swapkamatot mutatják. Alapbeállításnál (4%-os szint, +1 százalékpontos meredekség) az ötéves swapkamat nagyjából 4,79%, szemben a 4,81%-os ötéves zérókamattal, az annuitásfaktor 4,3695, a DV01 körülbelül 437, a tízéves swapkamat pedig 4,94%, szemben a 4,96%-os zérókamattal. Állítsuk a meredekséget nullára: lapos görbénél a par swapkamat minden lejáraton egyenlő a zérókamattal. Emelkedő görbénél a swapkamat kicsivel az azonos lejáratú zérókamat alatt van, mert a korai, alacsonyabb forward kamatokat nagyobb súllyal veszi; a fenti példában $S_3 \\approx 4{,}62\\%$, míg a hároméves zérókamat 4,63%. Negatív meredekségnél a swapkamat kicsivel fölötte van."),
    figure("swap-rate"),

    h("Összefoglalás"),
    list(
      "A swap $N s\\tau_i$ fix fizetéseket cserél $N L_i\\tau_i$ változó fizetésekre egy soha ki nem cserélt névleges összegen.",
      "A fix kapó swap long pozíció egy fix kamatozású kötvényben és short egy változó kamatozásúban; ez utóbbi minden fixálási napon névértéket ér.",
      "A par swapkamat $S_n = (1 - P(0,t_n))/A$, ahol $A = \\sum_i \\tau_i P(0,t_i)$ az annuitásfaktor.",
      "Egy meglévő, $s$-et fizető fix fizető swap értéke $N(S_n' - s)A'$, DV01-e nagyjából $N A \\times 0{,}0001$.",
    ),
    lab("/yield-curve", "Alakítsd a swapot árazó diszkontfaktorok görbéjét a Hozamgörbe laborban"),
  ],
};
