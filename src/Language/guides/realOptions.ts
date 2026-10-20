import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const realOptions: GuideLessonContent = {
  en: [
    p("The lessons \"Net present value and internal rate of return\" and \"Discounted cash flow valuation\" valued a project as if its plan were fixed today. Real managers can wait, expand, scale down or stop as information arrives. This lesson values that flexibility with the binomial tree from \"Multi-step trees and backward induction\" and the early-exercise logic from \"American options and early exercise\"."),

    h("Flexibility in investment decisions"),
    p("The static NPV rule compares the present value $V$ of a project's cash flows with the investment $I$ and accepts when $V - I > 0$. It treats the decision as **now or never**: invest today on the current plan, or drop the project for good. Most real projects are not like that. A firm holding a licence or a plot of land can usually **delay** the investment, **expand** capacity if demand turns out strong, **abandon** the project and sell the assets if it goes badly, or **switch** inputs or outputs. Each of these is a right without an obligation, so each has the payoff shape of an option. Such options on real assets are called **real options**."),

    h("Mapping a project to an option"),
    p("Take the right to invest in a project. Exercising it means paying $I$ and receiving a project worth $V$, so the payoff is $(V - I)^+$, the payoff of a call. The pieces translate as follows:"),
    list(
      "Underlying: the present value $V$ of the project's cash flows, the quantity a DCF valuation produces.",
      "Strike: the investment cost $I$.",
      "Maturity $T$: how long the opportunity stays open (a licence period, a patent life, a lease on land).",
      "Volatility $\\sigma$: the uncertainty of $V$, how much the project's value can change per year.",
      "Dividend yield $\\delta$: the cash flows the project would already pay while the firm is waiting, as a yield on $V$. They are lost by waiting.",
    ),
    p("Since the firm can invest at any date up to $T$, the option to delay is an **American call** on $V$ with strike $I$."),

    h("When waiting pays"),
    p("With $\\delta = 0$ the argument from \"American options and early exercise\" carries over. Investing at time $t$ gives $V_t - I$, while keeping the right is worth at least $V_t - Ie^{-r(T-t)}$, which is larger: waiting delays the payment of $I$ and keeps the protection against a fall in $V$. So with no forgone cash flows it is never optimal to invest before $T$."),
    p("With $\\delta > 0$ waiting has a cost. A project already running pays roughly $\\delta V$ per year, and a firm that waits receives none of it. When the project is deep in the money, a fall below $I$ is unlikely, so the protection is worth little, while the forgone cash flow $\\delta V$ is large because $V$ is large. Then investing at once beats waiting, exactly as a large dividend can make early exercise of an American call optimal."),

    {
      kind: "check",
      id: "real-options/no-early-investment",
      prompt: "A firm holds a three-year licence to build a plant. Waiting costs nothing in forgone cash flows ($\\delta = 0$), and today $V > I$. When should the firm invest?",
      answer: {
        type: "choice",
        options: [
          "Now, because the static NPV is positive.",
          "Not before the licence expires; then invest if $V_T > I$.",
          "As soon as $V$ exceeds $I$ by $\\sigma V$.",
          "Never: with $\\delta = 0$ the option is worthless.",
        ],
        correct: 1,
      },
      explain: "With $\\delta = 0$ the option to delay is like an American call on a stock without dividends. Keeping the right is worth at least $V_t - Ie^{-r(T-t)}$, more than the $V_t - I$ from investing now, so investing before $T$ is never optimal.",
    },

    h("Valuation on a binomial tree"),
    p("Split $[0, T]$ into $n$ steps of length $\\Delta t = T/n$. As in \"Multi-step trees and backward induction\", $V$ moves up by $u = e^{\\sigma\\sqrt{\\Delta t}}$ or down by $d = 1/u$ in each step. The forgone cash flows lower the risk-neutral growth of $V$ from $r$ to $r - \\delta$, so the risk-neutral probability is"),
    eq("q = \\frac{e^{(r-\\delta)\\Delta t} - d}{u - d}."),
    p("At maturity the value of the opportunity is $(V_T - I)^+$. At every earlier node the firm compares investing now with waiting one more step, and backward induction keeps the better of the two:"),
    eq("F = \\max\\Big(V - I,\\; e^{-r\\Delta t}\\big[q\\,F_{\\text{up}} + (1-q)\\,F_{\\text{down}}\\big]\\Big)."),
    p("The value $F_0$ at the root is the value of the investment opportunity, called the **expanded NPV**. A now-or-never decision is worth $\\max(V_0 - I, 0)$, since a project with negative NPV is simply rejected. The difference is the value of flexibility."),
    note("Expanded NPV = now-or-never value + value of flexibility, where the now-or-never value is $\\max(V_0 - I, 0)$. Some texts write expanded NPV = static NPV + option premium; with a negative static NPV the premium then also covers the shortfall below zero."),

    {
      kind: "check",
      id: "real-options/risk-neutral-q",
      prompt: "On a tree with one step per year, $\\sigma = 25\\%$, $r = 5\\%$ and $\\delta = 1\\%$, what is the risk-neutral probability $q$ of an up move?",
      answer: { type: "number", value: 0.5186, tolerance: 0.002 },
      explain: "$u = e^{0.25} \\approx 1.2840$ and $d = 1/u \\approx 0.7788$, so $q = (e^{0.04} - 0.7788)/(1.2840 - 0.7788) \\approx 0.2620/0.5052 \\approx 0.519$.",
    },

    h("Worked example"),
    p("Let $V_0 = 100$, $I = 105$, $\\sigma = 30\\%$, $r = 5\\%$, $\\delta = 4\\%$ and $T = 3$ years, with one step per year ($\\Delta t = 1$). Then $u = e^{0.3} \\approx 1.3499$, $d \\approx 0.7408$, the one-step discount factor is $e^{-0.05} \\approx 0.9512$, and"),
    eq("q = \\frac{e^{0.01} - 0.7408}{1.3499 - 0.7408} \\approx 0.4421."),
    p("The static NPV is $100 - 105 = -5$, so the now-or-never rule rejects the project. The tree tells a different story."),
    list(
      "Year 3: $V$ is 245.96, 134.99, 74.08 or 40.66. The opportunity is worth $(V - 105)^+$: 140.96, 29.99, 0 and 0.",
      "Year 2, $V = 182.21$: waiting is worth $0.9512\\,(0.4421 \\cdot 140.96 + 0.5579 \\cdot 29.99) \\approx 75.19$, investing gives 77.21. **Invest.** The forgone cash flow in the last year, about $182.21\\,(1 - e^{-0.04}) \\approx 7.14$, exceeds the interest saved on $I$, about 5.12.",
      "Year 2, $V = 100$: waiting 12.61 against $-5$ now, so wait. At $V = 54.88$ the opportunity is worthless.",
      "Year 1, $V = 134.99$: waiting $0.9512\\,(0.4421 \\cdot 77.21 + 0.5579 \\cdot 12.61) \\approx 39.16$ against 29.99 now, so wait. At $V = 74.08$: waiting 5.30, wait.",
      "Year 0: waiting $0.9512\\,(0.4421 \\cdot 39.16 + 0.5579 \\cdot 5.30) \\approx 19.28$ against $-5$ now, so wait.",
    ),
    p("The expanded NPV is 19.28. A project that the static rule rejects is a valuable opportunity, provided the firm keeps the right to wait. All of its 19.28 is value of flexibility."),
    {
      kind: "worked",
      title: "The tree inputs and the expanded NPV",
      steps: [
        { text: "Up factor for one-year steps with $\\sigma = 30\\%$.", tex: "u = e^{0.3}", result: { value: 1.3499, tolerance: 0.0001 } },
        { text: "Down factor, the reciprocal.", tex: "d = 1/u", result: { value: 0.7408, tolerance: 0.0001 } },
        { text: "Risk-neutral probability, with the growth of $V$ lowered by the forgone yield $\\delta = 4\\%$.", tex: "q = \\frac{e^{0.05 - 0.04} - d}{u - d}", result: { value: 0.4421, tolerance: 0.0002 } },
        { text: "Backward induction from year 3, keeping the larger of investing and waiting at every node, gives the value at the root.", tex: "F_0 = \\max\\big(V_0 - I,\\; e^{-r}[q\\,F_{\\text{up}} + (1-q)\\,F_{\\text{down}}]\\big)", result: { value: 19.28, tolerance: 0.01 } },
      ],
    },

    p("The figure uses the same setting: $V_0 = 100$, $r = 5\\%$ and a 3-step tree over $T = 3$ years. Sliders set the investment cost $I$ (60 to 140), the volatility $\\sigma$ (10% to 60%) and the forgone cash-flow yield $\\delta$ (0% to 10%). The chart plots the static NPV $V_0 - I$ and the expanded NPV against $I$ from 60 to 140, with a vertical line at the chosen $I$. The readouts show the static NPV, the expanded NPV, the value of flexibility (expanded NPV minus $\\max(V_0 - I, 0)$) and today's decision. Set $\\delta = 0$ and note that the expanded NPV stays above the static NPV for every $I$, so waiting always has value. Raise $\\delta$ and lower $I$ to find the region where investing now is optimal. Raise $\\sigma$ and watch the expanded NPV curve lift away from the static line."),
    figure("real-option-tree"),

    h("The option to expand"),
    p("Suppose that by paying an extra $I_e$ the firm can scale the project up by a fraction $x$, turning $V$ into $(1 + x)V$. At a date when the option can be used, the project with the option is worth $\\max\\big(V,\\,(1+x)V - I_e\\big) = V + (xV - I_e)^+$. The expansion right is therefore a call on $xV$ with strike $I_e$, valued on the same tree by adding this term at the decision nodes. It pays off exactly in the states where demand turned out strong."),

    h("The option to abandon"),
    p("If the firm can stop the project and sell its assets for a **salvage value** $A$, then at each decision date the project is worth $\\max(V, A) = V + (A - V)^+$. The abandonment right is a **put** on $V$ with strike $A$. It limits the downside: in bad states the firm walks away with $A$ instead of keeping a project worth less. On the tree, each node takes the larger of the continuation value and $A$."),

    h("Limits of the analogy"),
    p("Option pricing rests on replication: the option's payoff can be copied by trading the underlying, which pins the price down. A project's value $V$ is not traded, so no such portfolio exists in general. The risk-neutral valuation used above is then an approximation, justified if some traded asset (a commodity, a listed firm in the same business) moves closely with $V$. The inputs are also harder to estimate than for a stock option: $\\sigma$ and $\\delta$ have to be inferred from forecasts, and competitors may take the opportunity away before $T$."),

    h("Summary"),
    list(
      "Static NPV assumes a now-or-never decision; the rights to delay, expand, abandon or switch are options on the project value $V$.",
      "The option to delay is an American call on $V$ with strike $I$; the forgone cash-flow yield $\\delta$ plays the role of a dividend yield.",
      "With $\\delta = 0$ investing early is never optimal; with $\\delta > 0$ investing at once can be optimal when the project is deep in the money.",
      "On a binomial tree with $q = (e^{(r-\\delta)\\Delta t} - d)/(u - d)$, each node takes the maximum of investing now and waiting; the root value is the expanded NPV.",
      "Expanding is a call and abandoning is a put on $V$; since $V$ is not traded, the valuation is an approximation.",
    ),
    lab("/npv-irr", "Value an option to expand a project in the Real options tab of the NPV & IRR lab"),
  ],

  hu: [
    p("A „Nettó jelenérték és belső megtérülési ráta” és a „Diszkontált pénzáram alapú értékelés” című lecke úgy értékelt egy projektet, mintha a terve ma rögzülne. A valódi vezetők várhatnak, bővíthetnek, visszaléphetnek vagy leállíthatják a projektet, ahogy újabb információ érkezik. Ez a lecke ennek a rugalmasságnak az értékét határozza meg a „Többlépéses fák és visszafelé indukció” lecke binomiális fájával és az „Amerikai opciók és korai lehívás” lecke korai lehívásról szóló gondolatmenetével."),

    h("Rugalmasság a beruházási döntésekben"),
    p("A statikus NPV-szabály a projekt pénzáramainak $V$ jelenértékét veti össze az $I$ beruházással, és akkor fogadja el a projektet, ha $V - I > 0$. A döntést **most vagy soha** jellegűnek tekinti: vagy ma beruházunk a jelenlegi terv szerint, vagy végleg elvetjük a projektet. A legtöbb valódi projekt nem ilyen. Egy engedély vagy telek birtokában a vállalat általában **elhalaszthatja** a beruházást, **bővítheti** a kapacitást, ha a kereslet erősnek bizonyul, **felhagyhat** a projekttel és eladhatja az eszközöket, ha rosszul alakul, vagy **válthat** az alapanyagok vagy a termékek között. Mindegyik jog kötelezettség nélkül, ezért mindegyiknek opciós kifizetésszerkezete van. A reáleszközökre szóló ilyen opciókat **reálopcióknak** nevezzük."),

    h("Projekt mint opció"),
    p("Vegyük a projektbe való beruházás jogát. A jog gyakorlása azt jelenti, hogy kifizetjük $I$-t, és egy $V$ értékű projektet kapunk, a kifizetés tehát $(V - I)^+$, egy vételi opció kifizetése. Az elemek így feleltethetők meg egymásnak:"),
    list(
      "Alaptermék: a projekt pénzáramainak $V$ jelenértéke, vagyis az, amit egy DCF-értékelés kiszámol.",
      "Kötési ár: az $I$ beruházási költség.",
      "Lejárat ($T$): meddig áll nyitva a lehetőség (engedély időtartama, szabadalom élettartama, telekbérlet).",
      "Volatilitás ($\\sigma$): $V$ bizonytalansága, vagyis hogy mennyit változhat a projekt értéke egy év alatt.",
      "Osztalékhozam ($\\delta$): azok a pénzáramok $V$-hez viszonyított hozamként, amelyeket a projekt már termelne, amíg a vállalat vár. A várakozással ezek elvesznek.",
    ),
    p("Mivel a vállalat $T$-ig bármikor beruházhat, a halasztási opció egy $V$-re szóló, $I$ kötési árú **amerikai call**."),

    h("Mikor éri meg várni"),
    p("$\\delta = 0$ esetén az „Amerikai opciók és korai lehívás” lecke érvelése átvihető. A $t$ időpontban beruházva $V_t - I$-t kapunk, a jog megtartása viszont legalább $V_t - Ie^{-r(T-t)}$-t ér, ami nagyobb: a várakozás későbbre tolja $I$ kifizetését, és megőrzi a védelmet $V$ esése ellen. Elmaradó pénzáramok nélkül tehát sosem optimális $T$ előtt beruházni."),
    p("$\\delta > 0$ esetén a várakozásnak ára van. Egy már működő projekt évente nagyjából $\\delta V$-t fizet, a váró vállalat ebből semmit sem kap meg. Ha a projekt mélyen pénzben van, $V$ csak kis eséllyel esik $I$ alá, így a védelem keveset ér, az elmaradó $\\delta V$ pénzáram viszont nagy, mert $V$ nagy. Ilyenkor az azonnali beruházás jobb a várakozásnál, ahogy egy nagy osztalék is optimálissá teheti egy amerikai call korai lehívását."),

    {
      kind: "check",
      id: "real-options/no-early-investment",
      prompt: "Egy vállalat hároméves engedéllyel rendelkezik egy üzem megépítésére. A várakozás nem jár elmaradó pénzáramlással ($\\delta = 0$), és ma $V > I$. Mikor érdemes beruháznia?",
      answer: {
        type: "choice",
        options: [
          "Most, mert a statikus NPV pozitív.",
          "Az engedély lejárta előtt nem; akkor pedig, ha $V_T > I$.",
          "Amint $V$ legalább $\\sigma V$-vel meghaladja $I$-t.",
          "Soha: $\\delta = 0$ mellett az opció értéktelen.",
        ],
        correct: 1,
      },
      explain: "$\\delta = 0$ mellett a halasztási opció olyan, mint egy osztalékot nem fizető részvényre szóló amerikai vételi opció. A jog megtartása legalább $V_t - Ie^{-r(T-t)}$-t ér, többet, mint a mostani beruházás $V_t - I$ értéke, így $T$ előtt sosem optimális beruházni.",
    },

    h("Értékelés binomiális fán"),
    p("Osszuk a $[0, T]$ intervallumot $n$ darab $\\Delta t = T/n$ hosszú lépésre. A „Többlépéses fák és visszafelé indukció” leckéhez hasonlóan $V$ minden lépésben $u = e^{\\sigma\\sqrt{\\Delta t}}$-szeresére nő vagy $d = 1/u$-szorosára csökken. Az elmaradó pénzáramok $V$ kockázatsemleges növekedését $r$-ről $r - \\delta$-ra csökkentik, így a kockázatsemleges valószínűség"),
    eq("q = \\frac{e^{(r-\\delta)\\Delta t} - d}{u - d}."),
    p("Lejáratkor a lehetőség értéke $(V_T - I)^+$. Minden korábbi csomópontban a vállalat összeveti az azonnali beruházást az egy lépéssel további várakozással, és a visszafelé indukció a kettő közül a jobbat tartja meg:"),
    eq("F = \\max\\Big(V - I,\\; e^{-r\\Delta t}\\big[q\\,F_{\\text{fel}} + (1-q)\\,F_{\\text{le}}\\big]\\Big)."),
    p("A gyökérben kapott $F_0$ a beruházási lehetőség értéke, a **kiterjesztett NPV**. Egy most-vagy-soha döntés $\\max(V_0 - I, 0)$-t ér, hiszen a negatív NPV-jű projektet egyszerűen elvetjük. A kettő különbsége a rugalmasság értéke."),
    note("Kiterjesztett NPV = most-vagy-soha érték + a rugalmasság értéke, ahol a most-vagy-soha érték $\\max(V_0 - I, 0)$. Egyes tankönyvek a kiterjesztett NPV = statikus NPV + opciós prémium alakot használják; negatív statikus NPV esetén ez a prémium a nulla alatti hiányt is fedezi."),

    {
      kind: "check",
      id: "real-options/risk-neutral-q",
      prompt: "Évente egy lépéses fán $\\sigma = 25\\%$, $r = 5\\%$ és $\\delta = 1\\%$. Mekkora a felfelé lépés $q$ kockázatsemleges valószínűsége?",
      answer: { type: "number", value: 0.5186, tolerance: 0.002 },
      explain: "$u = e^{0{,}25} \\approx 1{,}2840$ és $d = 1/u \\approx 0{,}7788$, így $q = (e^{0{,}04} - 0{,}7788)/(1{,}2840 - 0{,}7788) \\approx 0{,}2620/0{,}5052 \\approx 0{,}519$.",
    },

    h("Számpélda"),
    p("Legyen $V_0 = 100$, $I = 105$, $\\sigma = 30\\%$, $r = 5\\%$, $\\delta = 4\\%$ és $T = 3$ év, évente egy lépéssel ($\\Delta t = 1$). Ekkor $u = e^{0{,}3} \\approx 1{,}3499$, $d \\approx 0{,}7408$, az egylépéses diszkontfaktor $e^{-0{,}05} \\approx 0{,}9512$, és"),
    eq("q = \\frac{e^{0{,}01} - 0{,}7408}{1{,}3499 - 0{,}7408} \\approx 0{,}4421."),
    p("A statikus NPV $100 - 105 = -5$, a most-vagy-soha szabály tehát elveti a projektet. A fa mást mutat."),
    list(
      "3. év: $V$ értéke 245,96, 134,99, 74,08 vagy 40,66. A lehetőség $(V - 105)^+$-t ér: 140,96, 29,99, 0 és 0.",
      "2. év, $V = 182{,}21$: a várakozás értéke $0{,}9512\\,(0{,}4421 \\cdot 140{,}96 + 0{,}5579 \\cdot 29{,}99) \\approx 75{,}19$, az azonnali beruházás 77,21-et ad. **Beruházunk.** Az utolsó évben elmaradó pénzáram, nagyjából $182{,}21\\,(1 - e^{-0{,}04}) \\approx 7{,}14$, több, mint az $I$ halasztásán megtakarított kamat, ami körülbelül 5,12.",
      "2. év, $V = 100$: a várakozás 12,61-et ér, szemben a mostani $-5$-tel, tehát várunk. $V = 54{,}88$ mellett a lehetőség értéktelen.",
      "1. év, $V = 134{,}99$: a várakozás $0{,}9512\\,(0{,}4421 \\cdot 77{,}21 + 0{,}5579 \\cdot 12{,}61) \\approx 39{,}16$, a mostani beruházás 29,99, tehát várunk. $V = 74{,}08$ mellett a várakozás 5,30-at ér, várunk.",
      "0. év: a várakozás $0{,}9512\\,(0{,}4421 \\cdot 39{,}16 + 0{,}5579 \\cdot 5{,}30) \\approx 19{,}28$, a mostani beruházás $-5$, tehát várunk.",
    ),
    p("A kiterjesztett NPV 19,28. Az a projekt, amelyet a statikus szabály elvet, értékes lehetőség, feltéve, hogy a vállalat megtartja a várakozás jogát. A teljes 19,28 a rugalmasság értéke."),
    {
      kind: "worked",
      title: "A fa bemenetei és a kiterjesztett NPV",
      steps: [
        { text: "Az emelkedési tényező egyéves lépésekre, $\\sigma = 30\\%$ mellett.", tex: "u = e^{0{,}3}", result: { value: 1.3499, tolerance: 0.0001 } },
        { text: "A csökkenési tényező, ennek reciproka.", tex: "d = 1/u", result: { value: 0.7408, tolerance: 0.0001 } },
        { text: "A kockázatsemleges valószínűség; $V$ növekedését a $\\delta = 4\\%$-os elmaradó hozam csökkenti.", tex: "q = \\frac{e^{0{,}05 - 0{,}04} - d}{u - d}", result: { value: 0.4421, tolerance: 0.0002 } },
        { text: "A 3. évtől visszafelé haladva, minden csúcsban a beruházás és a várakozás közül a nagyobbat megtartva, megkapjuk a gyökér értékét.", tex: "F_0 = \\max\\big(V_0 - I,\\; e^{-r}[q\\,F_{\\text{fel}} + (1-q)\\,F_{\\text{le}}]\\big)", result: { value: 19.28, tolerance: 0.01 } },
      ],
    },

    p("Az ábra ugyanezt a helyzetet mutatja: $V_0 = 100$, $r = 5\\%$, háromlépéses fa $T = 3$ évre. A csúszkák az $I$ beruházási költséget (60 és 140 között), a $\\sigma$ volatilitást (10% és 60% között) és az elmaradó pénzáramok $\\delta$ hozamát (0% és 10% között) állítják. A grafikon a $V_0 - I$ statikus NPV-t és a kiterjesztett NPV-t mutatja $I$ függvényében 60 és 140 között, a választott $I$-nél függőleges vonallal. A kijelzők a statikus NPV-t, a kiterjesztett NPV-t, a rugalmasság értékét (a kiterjesztett NPV mínusz $\\max(V_0 - I, 0)$) és a mai döntést mutatják. Állítsd $\\delta$-t nullára, és figyeld meg, hogy a kiterjesztett NPV minden $I$ mellett a statikus fölött marad, vagyis a várakozásnak mindig van értéke. Növeld $\\delta$-t és csökkentsd $I$-t, hogy megtaláld azt a tartományt, ahol az azonnali beruházás az optimális. Növeld $\\sigma$-t, és nézd, hogyan emelkedik el a kiterjesztett NPV görbéje a statikus egyenestől."),
    figure("real-option-tree"),

    h("Bővítési opció"),
    p("Tegyük fel, hogy egy további $I_e$ kifizetésével a vállalat $x$ hányaddal növelheti a projektet, így $V$-ből $(1 + x)V$ lesz. Egy olyan időpontban, amikor az opció használható, a projekt az opcióval együtt $\\max\\big(V,\\,(1+x)V - I_e\\big) = V + (xV - I_e)^+$-t ér. A bővítés joga tehát egy $xV$-re szóló, $I_e$ kötési árú call, amely ugyanazon a fán értékelhető úgy, hogy a döntési csomópontokban hozzáadjuk ezt a tagot. Pontosan azokban az állapotokban fizet, ahol a kereslet erősnek bizonyult."),

    h("Felhagyási opció"),
    p("Ha a vállalat leállíthatja a projektet, és $A$ **likvidációs értékért** eladhatja az eszközeit, akkor minden döntési időpontban a projekt értéke $\\max(V, A) = V + (A - V)^+$. A felhagyás joga tehát egy $V$-re szóló, $A$ kötési árú **eladási opció**. A lefelé mutató kockázatot korlátozza: rossz állapotokban a vállalat $A$-val távozik ahelyett, hogy egy kevesebbet érő projektet tartana meg. A fán minden csomópont a továbbvitel értékének és $A$-nak a nagyobbikát veszi."),

    h("Az analógia korlátai"),
    p("Az opcióárazás a replikáláson alapul: az opció kifizetése lemásolható az alaptermékkel kereskedve, és ez rögzíti az árat. A projekt $V$ értékével viszont nem kereskednek, így ilyen portfólió általában nem létezik. A fenti kockázatsemleges értékelés ezért közelítés, amely akkor indokolt, ha van olyan kereskedett eszköz (nyersanyag, azonos ágazatban működő tőzsdei cég), amely szorosan együtt mozog $V$-vel. A bemenetek is nehezebben becsülhetők, mint egy részvényopciónál: $\\sigma$-t és $\\delta$-t előrejelzésekből kell kikövetkeztetni, és a versenytársak $T$ előtt elvihetik a lehetőséget."),

    h("Összefoglalás"),
    list(
      "A statikus NPV most-vagy-soha döntést feltételez; a halasztás, bővítés, felhagyás vagy váltás joga a projekt $V$ értékére szóló opció.",
      "A halasztási opció $V$-re szóló, $I$ kötési árú amerikai call; az elmaradó pénzáramok $\\delta$ hozama az osztalékhozam szerepét játssza.",
      "$\\delta = 0$ mellett a korai beruházás sosem optimális; $\\delta > 0$ mellett mélyen pénzben lévő projektnél az azonnali beruházás lehet optimális.",
      "A $q = (e^{(r-\\delta)\\Delta t} - d)/(u - d)$ valószínűségű binomiális fán minden csomópont az azonnali beruházás és a várakozás maximumát veszi; a gyökérbeli érték a kiterjesztett NPV.",
      "A bővítés call, a felhagyás put $V$-re; mivel $V$-vel nem kereskednek, az értékelés közelítés.",
    ),
    lab("/npv-irr", "Értékeld egy projekt bővítési opcióját az NPV és IRR labor Reálopciók lapján"),
  ],
};
