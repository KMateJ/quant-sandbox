import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const npvIrr: GuideLessonContent = {
  en: [
    p("A firm constantly decides which projects to take on: a new machine, a new product line, a new plant. Each project costs money now and is expected to return money later. This lesson turns that comparison into two numbers, the net present value and the internal rate of return, using the discounting from \"Interest, compounding and discounting\"."),

    h("Cash flows of a project"),
    p("Describe a project by its **cash flows**: the amounts of money it pays out or brings in, by date. Write $CF_t$ for the net cash flow at the end of year $t$, with $t = 0$ meaning today. A typical project has a negative $CF_0$ (the investment) followed by positive cash flows $CF_1, \\dots, CF_N$."),
    p("Two modelling choices are made here. Cash flows arrive at the end of each year, and the rate used to discount them is quoted with annual compounding. Both match the lab."),

    h("The discount rate"),
    p("In this lesson $r$ is the **discount rate** of the project: the annual return investors could earn elsewhere on an investment of the same risk. It is also called the *opportunity cost of capital* or the *required return*. It is not a risk-free rate; it is higher, because project cash flows are uncertain."),

    h("Net present value"),
    p("Discount every cash flow back to today with the annual discount factor $1/(1+r)^t$ and add them up. The result is the **net present value**:"),
    eq("\\text{NPV}(r) = CF_0 + \\frac{CF_1}{1+r} + \\frac{CF_2}{(1+r)^2} + \\cdots + \\frac{CF_N}{(1+r)^N} = \\sum_{t=0}^{N} \\frac{CF_t}{(1+r)^t}."),
    p("The NPV is the value the project adds today. Investors could reproduce the project's future cash flows in the market for their present value; the project delivers them for the cost $-CF_0$ instead. The difference is a gain (or loss) to the owners."),
    note("NPV rule: accept a project when $\\text{NPV} > 0$. Among mutually exclusive projects, choose the one with the highest NPV."),

    h("A project with equal annual cash flows"),
    p("Consider a project that costs 100 today and pays the same amount $C$ at the end of each of the next $N$ years. The cash flows after $t = 0$ form an **annuity**, and their present value has a closed form. Summing the geometric series gives"),
    eq("\\sum_{t=1}^{N} \\frac{C}{(1+r)^t} = C \\cdot \\frac{1 - (1+r)^{-N}}{r}, \\qquad \\text{NPV}(r) = -100 + C \\cdot \\frac{1 - (1+r)^{-N}}{r}."),
    p("Example: $C = 30$, $N = 5$ and $r = 10\\%$."),
    {
      kind: "worked",
      title: "NPV of a project with equal annual cash flows",
      steps: [
        { text: "The annuity factor: the present value of 1 a year for $N$ years.", tex: "\\frac{1 - (1+r)^{-N}}{r}", result: { value: 3.7908, tolerance: 0.0005 } },
        { text: "Present value of the inflows: $C$ times the annuity factor.", tex: "\\text{PV} = C \\cdot \\frac{1 - (1+r)^{-N}}{r}", result: { value: 113.72, tolerance: 0.01 } },
        { text: "Subtract the investment to get the NPV; it is positive, so the project creates value.", tex: "\\text{NPV} = -100 + \\text{PV}", result: { value: 13.72, tolerance: 0.01 } },
      ],
    },
    p("With $N = 4$ instead, the inflows are worth only about $95.10$ and the NPV is $-4.90$."),

    h("The NPV profile"),
    p("Plot the NPV against the discount rate. This curve is the **NPV profile**. At $r = 0$ it equals the plain sum of the cash flows ($-100 + 5 \\times 30 = 50$ in the example). As $r$ rises, later cash flows are discounted more heavily and the NPV falls. For the example project it is $29.88$ at $5\\%$, $13.72$ at $10\\%$, $0.56$ at $15\\%$ and $-10.28$ at $20\\%$."),

    h("Internal rate of return"),
    p("The **internal rate of return** (IRR) is the discount rate at which the NPV is exactly zero:"),
    eq("\\sum_{t=0}^{N} \\frac{CF_t}{(1+\\text{IRR})^t} = 0."),
    p("It is where the NPV profile crosses the horizontal axis. There is no general formula for it; it is found numerically, by trying rates until the NPV changes sign and then narrowing the interval. For the example project the IRR is about $15.24\\%$. Read it as the annual return the project itself earns on the money tied up in it."),
    p("For a project with one outflow followed by inflows, the profile falls steadily, so the IRR rule agrees with the NPV rule: the NPV is positive exactly when $r < \\text{IRR}$."),
    {
      kind: "check",
      id: "npv-irr/irr-root",
      prompt: "A project costs 100 today, pays nothing after one year and pays 121 after two years. What is its IRR?",
      answer: { type: "number", value: 10, tolerance: 0.05, unit: "%" },
      explain: "The IRR solves $-100 + 121/(1+\\text{IRR})^2 = 0$, so $(1+\\text{IRR})^2 = 1.21$ and $\\text{IRR} = 10\\%$: the rate at which the NPV is exactly zero.",
    },
    p("The figure plots the NPV profile, for rates from 0 to 40%, of a project that costs 100 and pays $C$ per year for $N$ years. Sliders set $C$, $N$ and $r$; the readouts show the NPV at $r$, the IRR and the undiscounted sum of the cash flows. At the default settings ($C = 25$, $N = 5$, $r = 10\\%$) the NPV is about $-5.23$ and the IRR about $7.93\\%$: the project loses value. Raise $C$, lengthen $N$ or lower $r$ until the NPV crosses zero. Moving $r$ slides along the curve without changing it, so the IRR stays fixed."),
    figure("npv-profile"),

    h("Profitability index"),
    p("The **profitability index** divides the present value of the inflows by the initial investment:"),
    eq("\\text{PI} = \\frac{\\sum_{t=1}^{N} CF_t/(1+r)^t}{-CF_0}."),
    p("In the example $\\text{PI} = 113.72/100 \\approx 1.14$: each unit invested returns 1.14 units of present value. $\\text{PI} > 1$ is the same condition as $\\text{NPV} > 0$. The index is useful when capital is limited and projects must be ranked by value per unit invested."),

    h("Where the IRR misleads"),
    p("The IRR is popular because a percentage is easy to communicate, but it can give wrong answers in two situations."),
    p("**Mutually exclusive projects.** Project A costs 100 and returns 120 after one year; project B costs 100 and returns 150 after three years. A has an IRR of $20\\%$, B only about $14.47\\%$. At $r = 10\\%$, however, the NPV of A is $120/1.1 - 100 \\approx 9.09$, and that of B is $150/1.1^3 - 100 \\approx 12.70$. B adds more value. The profiles cross at about $11.80\\%$; below that rate the NPV ranking and the IRR ranking disagree, and the NPV ranking is the right one, because it measures value in money, not in percent."),
    p("**Cash flows that change sign more than once.** A project with cash flows $-100$, $+230$, $-132$ has NPV zero at both $10\\%$ and $20\\%$. Its profile rises and then falls, so there are two IRRs and neither is a meaningful rate of return. The NPV at the actual discount rate still answers the question."),
    {
      kind: "check",
      id: "npv-irr/exclusive",
      prompt: "Two mutually exclusive projects: A has the higher IRR, B has the higher NPV at the firm's discount rate. Which one should the firm take?",
      answer: { type: "choice", options: ["A, because its percentage return is higher", "B, because it adds more value at the actual discount rate", "Either, since both have a positive NPV", "Neither, until the IRRs agree"], correct: 1 },
      explain: "The NPV measures value in money at the rate the firm actually faces; the IRR ranks percentages and ignores scale and timing. When the two rankings disagree, the NPV is the right one.",
    },
    p("In the next figure you build the cash flows yourself. Each darker bar is the cash flow of one year, from year 0 to year 6; drag it up or down to change it. The lighter bar behind it is its present value $CF_t/(1+r)^t$ at the rate $r$, so you can see how much less a later flow is worth today. The readouts give the NPV at $r$, the IRR and the undiscounted sum. The default flows are the project from before, $-100$ now and 25 a year for five years, with NPV $-5.23$ at $10\\%$ and an IRR of $7.93\\%$. Now drag year 0 to $-40$ and year 6 to $-100$, a project that ends with a clean-up cost. The flows change sign twice, the NPV is zero at about $13.3\\%$ and again at about $30.8\\%$, and the IRR readout reports several possible IRRs. The NPV is $-1.68$ at $r = 10\\%$ and $+1.28$ at $r = 20\\%$: whether the project is worth taking depends on the actual discount rate, which only the NPV uses."),
    figure("cashflow-builder"),

    h("Summary"),
    list(
      "A project is a list of dated cash flows; discount each at the project's discount rate $r$ and add them to get the NPV.",
      "Accept projects with positive NPV; among exclusive alternatives, take the highest NPV.",
      "The IRR is the rate at which the NPV is zero, where the NPV profile crosses the axis.",
      "The profitability index is the present value of the inflows per unit invested; $\\text{PI} > 1$ exactly when $\\text{NPV} > 0$.",
      "For ranking exclusive projects and for cash flows that change sign several times, trust the NPV over the IRR.",
    ),
    note("A later lesson, \"The weighted average cost of capital\", estimates the discount rate $r$ that every NPV calculation needs."),
    lab("/npv-irr", "Build project cash flows and explore NPV, IRR and the NPV profile in the NPV & IRR lab"),
  ],

  hu: [
    p("Egy vállalat folyamatosan dönt arról, mely projektekbe vágjon bele: új gépbe, új termékcsaládba, új üzembe. Minden projekt most pénzbe kerül, és később várhatóan pénzt hoz. Ez a lecke ezt az összevetést két számmá alakítja, a nettó jelenértékké és a belső megtérülési rátává, a „Kamat, kamatozás és diszkontálás” című lecke diszkontálására építve."),

    h("Egy projekt pénzáramai"),
    p("Egy projektet a **pénzáramaival** írunk le: azokkal az összegekkel, amelyeket adott időpontokban kifizet vagy behoz. Jelölje $CF_t$ a $t$-edik év végi nettó pénzáramot, ahol $t = 0$ a mai napot jelenti. Egy tipikus projektnek negatív a $CF_0$ (a beruházás), utána pedig pozitív $CF_1, \\dots, CF_N$ pénzáramok következnek."),
    p("Két modellezési döntést hozunk. A pénzáramok minden év végén érkeznek, és a diszkontráta éves kamatozással értendő. Mindkettő a labor beállításaival egyezik."),

    h("A diszkontráta"),
    p("Ebben a leckében $r$ a projekt **diszkontrátája**: az az éves hozam, amelyet a befektetők máshol, azonos kockázatú befektetéssel elérhetnének. Más néven *alternatív tőkeköltség* vagy *elvárt hozam*. Ez nem kockázatmentes kamatláb; annál magasabb, mert a projekt pénzáramai bizonytalanok."),

    h("Nettó jelenérték"),
    p("Diszkontáljuk vissza minden pénzáramot a mai napra az $1/(1+r)^t$ éves diszkontfaktorral, és adjuk össze őket. Az eredmény a **nettó jelenérték** (NPV):"),
    eq("\\text{NPV}(r) = CF_0 + \\frac{CF_1}{1+r} + \\frac{CF_2}{(1+r)^2} + \\cdots + \\frac{CF_N}{(1+r)^N} = \\sum_{t=0}^{N} \\frac{CF_t}{(1+r)^t}."),
    p("Az NPV az az érték, amelyet a projekt ma hozzátesz. A projekt jövőbeli pénzáramait a befektetők a piacon a jelenértékükért meg tudnák szerezni; a projekt ehelyett $-CF_0$ költségért adja őket. A különbség a tulajdonosok nyeresége (vagy vesztesége)."),
    note("NPV-szabály: fogadjuk el a projektet, ha $\\text{NPV} > 0$. Egymást kizáró projektek közül a legnagyobb NPV-jűt válasszuk."),

    h("Egyenlő éves pénzáramú projekt"),
    p("Vegyünk egy projektet, amely ma 100-ba kerül, és a következő $N$ év mindegyikének végén ugyanakkora $C$ összeget fizet. A $t = 0$ utáni pénzáramok **annuitást** alkotnak, amelynek jelenértékére zárt képlet adható. A mértani sor összegzésével"),
    eq("\\sum_{t=1}^{N} \\frac{C}{(1+r)^t} = C \\cdot \\frac{1 - (1+r)^{-N}}{r}, \\qquad \\text{NPV}(r) = -100 + C \\cdot \\frac{1 - (1+r)^{-N}}{r}."),
    p("Példa: $C = 30$, $N = 5$ és $r = 10\\%$."),
    {
      kind: "worked",
      title: "Egyenlő éves pénzáramú projekt NPV-je",
      steps: [
        { text: "Az annuitásfaktor: évi 1 egység $N$ éven át tartó kifizetésének jelenértéke.", tex: "\\frac{1 - (1+r)^{-N}}{r}", result: { value: 3.7908, tolerance: 0.0005 } },
        { text: "A beáramlások jelenértéke: $C$ szorozva az annuitásfaktorral.", tex: "\\text{PV} = C \\cdot \\frac{1 - (1+r)^{-N}}{r}", result: { value: 113.72, tolerance: 0.01 } },
        { text: "Vonjuk le a beruházást, így kapjuk az NPV-t; pozitív, tehát a projekt értéket teremt.", tex: "\\text{NPV} = -100 + \\text{PV}", result: { value: 13.72, tolerance: 0.01 } },
      ],
    },
    p("Ha $N = 4$, a beáramlások csak kb. $95{,}10$-et érnek, és az NPV $-4{,}90$."),

    h("Az NPV-profil"),
    p("Ábrázoljuk az NPV-t a diszkontráta függvényében. Ez a görbe az **NPV-profil**. $r = 0$ mellett a pénzáramok egyszerű összegével egyenlő (a példában $-100 + 5 \\times 30 = 50$). Ahogy $r$ nő, a későbbi pénzáramokat egyre erősebben diszkontáljuk, és az NPV csökken. A példaprojektnél $5\\%$-on $29{,}88$, $10\\%$-on $13{,}72$, $15\\%$-on $0{,}56$, $20\\%$-on pedig $-10{,}28$."),

    h("Belső megtérülési ráta"),
    p("A **belső megtérülési ráta** (IRR) az a diszkontráta, amely mellett az NPV pontosan nulla:"),
    eq("\\sum_{t=0}^{N} \\frac{CF_t}{(1+\\text{IRR})^t} = 0."),
    p("Ez az a pont, ahol az NPV-profil metszi a vízszintes tengelyt. Általános képlet nincs rá; numerikusan keressük meg, olyan rátákat próbálva, amelyek között az NPV előjelet vált, majd az intervallumot szűkítve. A példaprojekt IRR-je kb. $15{,}24\\%$. Úgy olvassuk, mint azt az éves hozamot, amelyet maga a projekt termel a benne lekötött pénzen."),
    p("Ha egy projektnél egyetlen kiáramlást csak beáramlások követnek, a profil folyamatosan csökken, így az IRR-szabály egybevág az NPV-szabállyal: az NPV pontosan akkor pozitív, ha $r < \\text{IRR}$."),
    {
      kind: "check",
      id: "npv-irr/irr-root",
      prompt: "Egy projekt ma 100-ba kerül, egy év múlva nem fizet semmit, két év múlva pedig 121-et fizet. Mekkora az IRR-je?",
      answer: { type: "number", value: 10, tolerance: 0.05, unit: "%" },
      explain: "Az IRR a $-100 + 121/(1+\\text{IRR})^2 = 0$ egyenlet megoldása, tehát $(1+\\text{IRR})^2 = 1{,}21$ és $\\text{IRR} = 10\\%$: az a ráta, amelyen az NPV éppen nulla.",
    },
    p("Az ábra 0 és 40% közötti rátákra mutatja annak a projektnek az NPV-profilját, amely 100-ba kerül, és $N$ éven át évi $C$-t fizet. A csúszkák $C$-t, $N$-t és $r$-t állítják; a kijelzők az $r$-en vett NPV-t, az IRR-t és a pénzáramok diszkontálatlan összegét mutatják. Az alapbeállításokkal ($C = 25$, $N = 5$, $r = 10\\%$) az NPV kb. $-5{,}23$, az IRR kb. $7{,}93\\%$: a projekt értéket rombol. Növeld $C$-t, hosszabbítsd $N$-t vagy csökkentsd $r$-t, amíg az NPV át nem lép a nullán. Az $r$ mozgatása csak végigcsúszik a görbén, nem változtatja meg, ezért az IRR helyben marad."),
    figure("npv-profile"),

    h("Jövedelmezőségi index"),
    p("A **jövedelmezőségi index** a beáramlások jelenértékét osztja el a kezdő beruházással:"),
    eq("\\text{PI} = \\frac{\\sum_{t=1}^{N} CF_t/(1+r)^t}{-CF_0}."),
    p("A példában $\\text{PI} = 113{,}72/100 \\approx 1{,}14$: minden befektetett egység 1,14 egységnyi jelenértéket hoz. A $\\text{PI} > 1$ feltétel ugyanaz, mint az $\\text{NPV} > 0$. Az index akkor hasznos, ha a tőke korlátozott, és a projekteket a befektetett egységre jutó érték szerint kell rangsorolni."),

    h("Ahol az IRR félrevezet"),
    p("Az IRR azért népszerű, mert egy százalékot könnyű kommunikálni, de két helyzetben rossz választ adhat."),
    p("**Egymást kizáró projektek.** Az A projekt 100-ba kerül, és egy év múlva 120-at hoz; a B projekt 100-ba kerül, és három év múlva 150-et hoz. Az A projekt IRR-je $20\\%$, a B-é csak kb. $14{,}47\\%$. $r = 10\\%$ mellett viszont A nettó jelenértéke $120/1{,}1 - 100 \\approx 9{,}09$, B-é pedig $150/1{,}1^3 - 100 \\approx 12{,}70$. B több értéket teremt. A két profil kb. $11{,}80\\%$-nál metszi egymást; ez alatt az NPV és az IRR szerinti sorrend ellentmond egymásnak, és az NPV szerinti a helyes, mert pénzben méri az értéket, nem százalékban."),
    p("**Többször előjelet váltó pénzáramok.** A $-100$, $+230$, $-132$ pénzáramú projekt NPV-je $10\\%$-on és $20\\%$-on is nulla. A profilja előbb emelkedik, majd csökken, így két IRR-je van, és egyik sem értelmes hozamráta. A tényleges diszkontrátán számolt NPV ilyenkor is megadja a választ."),
    {
      kind: "check",
      id: "npv-irr/exclusive",
      prompt: "Két egymást kizáró projekt közül A-nak magasabb az IRR-je, B-nek viszont a vállalat diszkontrátáján magasabb az NPV-je. Melyiket válassza a vállalat?",
      answer: { type: "choice", options: ["A-t, mert magasabb a százalékos hozama", "B-t, mert a tényleges diszkontrátán több értéket teremt", "Bármelyiket, hiszen mindkettő NPV-je pozitív", "Egyiket sem, amíg az IRR-ek meg nem egyeznek"], correct: 1 },
      explain: "Az NPV pénzben méri az értéket azon a rátán, amellyel a vállalat valóban szembesül; az IRR százalékokat rangsorol, és figyelmen kívül hagyja a méretet és az időzítést. Ha a két rangsor eltér, az NPV a helyes.",
    },
    p("A következő ábrán a pénzáramokat magunk építjük fel. Minden sötétebb oszlop egy év pénzárama a 0. évtől a 6. évig; fel vagy le húzva változtatható. A mögötte lévő halványabb oszlop a jelenértéke, $CF_t/(1+r)^t$ az $r$ ráta mellett, így látszik, mennyivel kevesebbet ér ma egy későbbi pénzáram. A kijelzők az $r$ melletti NPV-t, az IRR-t és a diszkontálatlan összeget mutatják. Az alapértelmezett pénzáramok a korábbi projektéi: most $-100$, utána öt éven át évi 25; az NPV $10\\%$-on $-5{,}23$, az IRR $7{,}93\\%$. Húzd most a 0. évet $-40$-re, a 6. évet $-100$-ra: ez egy olyan projekt, amelynek a végén helyreállítási költség merül fel. A pénzáramok kétszer váltanak előjelet, az NPV nagyjából $13{,}3\\%$-on és $30{,}8\\%$-on is nulla, és az IRR-kijelző jelzi, hogy több IRR lehetséges. Az NPV $r = 10\\%$ mellett $-1{,}68$, $r = 20\\%$ mellett $+1{,}28$: hogy megéri-e a projekt, a tényleges diszkontrátán múlik, és ezt csak az NPV veszi figyelembe."),
    figure("cashflow-builder"),

    h("Összefoglalás"),
    list(
      "Egy projekt időponthoz rendelt pénzáramok listája; mindegyiket a projekt $r$ diszkontrátájával diszkontálva és összeadva kapjuk az NPV-t.",
      "Fogadjuk el a pozitív NPV-jű projekteket; egymást kizáró alternatívák közül a legnagyobb NPV-jűt.",
      "Az IRR az a ráta, amelyen az NPV nulla, vagyis ahol az NPV-profil metszi a tengelyt.",
      "A jövedelmezőségi index a beáramlások befektetett egységre jutó jelenértéke; $\\text{PI} > 1$ pontosan akkor, ha $\\text{NPV} > 0$.",
      "Kizáró projektek rangsorolásánál és többször előjelet váltó pénzáramoknál az NPV-re hagyatkozzunk, ne az IRR-re.",
    ),
    note("Egy későbbi lecke, „Súlyozott átlagos tőkeköltség”, azt az $r$ diszkontrátát becsli meg, amelyre minden NPV-számításnak szüksége van."),
    lab("/npv-irr", "Építs projekt-pénzáramokat, és vizsgáld az NPV-t, az IRR-t és az NPV-profilt az NPV és IRR laborban"),
  ],
};
