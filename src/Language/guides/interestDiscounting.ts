import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const interestDiscounting: GuideLessonContent = {
  en: [
    p("Almost every pricing formula in finance compares money at different dates. Before options, portfolios or bonds, we need one tool: a way to move an amount of money forward or backward in time. This lesson builds that tool."),

    h("The time value of money"),
    p("If you have 100 today, you can put it in a bank account (or buy a government bill) and have more than 100 in a year, with essentially no risk. So 100 today is worth more than 100 promised in a year. The extra amount you are paid for waiting is **interest**, and the rate at which it accrues is the **interest rate** $r$, quoted per year."),
    p("Throughout these lessons $r$ means the **risk-free** rate: the rate on a loan that is certain to be repaid. Risky lending earns more, but that extra is compensation for risk, not for time."),

    h("Simple interest"),
    p("With simple interest you earn $r$ on the original amount only. After $T$ years an initial amount $B_0$ has grown to"),
    eq("B_T = B_0\\,(1 + rT)."),
    p("Growth is linear in time. This is how some short-term money market instruments are quoted, but it ignores the fact that interest already earned could itself earn interest."),

    h("Compound interest"),
    p("With annual compounding, the interest earned in year one is added to the balance, and in year two you earn interest on the larger amount. After $T$ whole years:"),
    eq("B_T = B_0\\,(1 + r)^T."),
    p("If interest is credited $m$ times per year, each period pays $r/m$ and there are $mT$ periods:"),
    eq("B_T = B_0\\left(1 + \\frac{r}{m}\\right)^{mT}."),
    p("A snowball is a fair picture: the bigger it gets, the more snow it picks up per turn. More frequent compounding gives slightly more growth, because interest starts earning interest sooner."),

    h("Continuous compounding"),
    p("Let the number of compounding periods $m$ grow without limit. The expression above converges to an exponential:"),
    eq("\\lim_{m\\to\\infty}\\left(1 + \\frac{r}{m}\\right)^{mT} = e^{rT}, \\qquad B_T = B_0\\,e^{rT}."),
    p("Continuous compounding is the convention used in option pricing (Black–Scholes, binomial trees with small steps) because exponentials are easy to multiply and differentiate: growing for $T_1$ and then for $T_2$ is the same as growing for $T_1 + T_2$, since $e^{rT_1}e^{rT_2} = e^{r(T_1+T_2)}$."),
    p("The figure compares the three conventions for the same quoted rate. At low rates and short horizons they are almost identical; the gap opens up as $r$ and $T$ grow."),
    figure("compounding"),
    {
      kind: "check",
      id: "interest-discounting/continuous-vs-annual",
      prompt: "You invest 100 for 5 years at a quoted rate of 6%. Which convention leaves you with more money at the end?",
      answer: { type: "choice", options: ["Annual compounding", "Continuous compounding", "Both give the same amount", "It depends on the starting amount"], correct: 1 },
      explain: "Continuous compounding credits interest on interest without delay: $100\\,e^{0.3} \\approx 134.99$ against $100 \\times 1.06^5 \\approx 133.82$ with annual compounding.",
    },

    h("Discounting"),
    p("Discounting is compounding run backwards. If a payment $C$ arrives at time $T$, its **present value** is the amount you would need to invest today to have exactly $C$ at $T$:"),
    eq("\\text{PV} = C\\,e^{-rT} \\quad\\text{(continuous)}, \\qquad \\text{PV} = \\frac{C}{(1+r)^T} \\quad\\text{(annual)}."),
    p("The multiplier $e^{-rT}$ is called the **discount factor**. It is always between 0 and 1 for a positive rate, and it shrinks the further away the payment is."),
    p("Example: with $r = 5\\%$ and continuous compounding, 100 paid in two years is worth $100\\,e^{-0.1} \\approx 90.48$ today. Investing 90.48 at 5% for two years gives back exactly 100."),
    {
      kind: "check",
      id: "interest-discounting/present-value-annual",
      prompt: "A payment of 1,000 arrives in 5 years. With an annually compounded rate of 6%, what is it worth today?",
      answer: { type: "number", value: 747.26, tolerance: 0.5 },
      explain: "$\\text{PV} = 1{,}000/1.06^5 = 1{,}000/1.3382 \\approx 747.26$.",
    },

    h("Converting between conventions"),
    p("The same growth can be quoted in different conventions. A continuously compounded rate $r_c$ and an annually compounded rate $r_a$ describe the same growth when"),
    eq("e^{r_c} = 1 + r_a \\quad\\Longleftrightarrow\\quad r_c = \\ln(1 + r_a)."),
    p("So 5% continuous is the same as about 5.13% annual. When you compare rates, always check which convention they use."),
    p("The same idea converts a rate compounded $m$ times a year into its **effective annual rate**, the annually compounded rate that gives the same growth: $r_{\\text{eff}} = (1 + r/m)^m - 1$."),
    {
      kind: "worked",
      title: "From a monthly quoted rate to a five-year discount factor",
      steps: [
        { text: "A savings account quotes 6% a year, compounded monthly. One year of growth is twelve months at 0.5% each; subtract 1 to get the effective annual rate.", tex: "r_{\\text{eff}} = \\left(1 + \\tfrac{0.06}{12}\\right)^{12} - 1", result: { value: 6.17, tolerance: 0.01, unit: "%" } },
        { text: "Discounting over 5 years means dividing by five years of that growth, that is 60 monthly periods.", tex: "\\left(1 + \\tfrac{0.06}{12}\\right)^{-60} = (1 + r_{\\text{eff}})^{-5}", result: { value: 0.7414, tolerance: 0.0005 } },
      ],
    },

    h("Summary"),
    list(
      "Money today is worth more than the same amount later, because it can earn the risk-free rate $r$.",
      "Compounding moves money forward: $B_T = B_0(1+r)^T$, or $B_0e^{rT}$ in continuous time.",
      "Discounting moves money back: $\\text{PV} = Ce^{-rT}$. The factor $e^{-rT}$ is the discount factor.",
    ),
    note("Every later lesson uses the discount factor $e^{-rT}$. Whenever a formula compares a future payment with a price today, this factor is how the two are put on the same footing."),
    lab("/tvm", "Work through present and future values in the Time Value of Money lab"),
  ],

  hu: [
    p("A pénzügyi árazási képletek szinte mindegyike különböző időpontokban esedékes pénzösszegeket hasonlít össze. Mielőtt opciókról, portfóliókról vagy kötvényekről beszélnénk, egyetlen eszközre van szükségünk: arra, hogyan visszük egy pénzösszeg értékét előre vagy hátra az időben. Ez a lecke ezt az eszközt építi fel."),

    h("A pénz időértéke"),
    p("Ha ma van 100 egységed, beteheted bankba (vagy vehetsz állampapírt), és egy év múlva lényegében kockázat nélkül több mint 100 lesz belőle. Ezért a ma kapott 100 többet ér, mint az egy év múlva ígért 100. A várakozásért kapott többlet a **kamat**, az évre vetített mértéke pedig a **kamatláb**, $r$."),
    p("A leckékben $r$ mindig a **kockázatmentes** kamatlábat jelenti: olyan hitel kamatát, amelynek visszafizetése biztos. A kockázatos hitelezés többet hoz, de ez a többlet a kockázatért jár, nem az időért."),

    h("Egyszerű kamatozás"),
    p("Egyszerű kamatozásnál csak az eredeti összeg után jár $r$ kamat. $T$ év alatt a kezdeti $B_0$ összeg erre nő:"),
    eq("B_T = B_0\\,(1 + rT)."),
    p("A növekedés az időben lineáris. Egyes rövid lejáratú pénzpiaci termékeket így jegyeznek, de ez a módszer figyelmen kívül hagyja, hogy a már megkapott kamat is kamatozhatna."),

    h("Kamatos kamat"),
    p("Éves kamatozásnál az első év kamatát hozzáírják az egyenleghez, így a második évben már a nagyobb összeg után kapsz kamatot. $T$ egész év után:"),
    eq("B_T = B_0\\,(1 + r)^T."),
    p("Ha évente $m$-szer írják jóvá a kamatot, minden periódus $r/m$-et fizet, és összesen $mT$ periódus van:"),
    eq("B_T = B_0\\left(1 + \\frac{r}{m}\\right)^{mT}."),
    p("Jó kép erre egy hógolyó: minél nagyobb, annál több havat szed fel fordulatonként. A gyakoribb kamatjóváírás kicsit nagyobb növekedést ad, mert a kamat hamarabb kezd maga is kamatozni."),

    h("Folytonos kamatozás"),
    p("Növeljük a kamatperiódusok $m$ számát minden határon túl. A fenti kifejezés egy exponenciálishoz tart:"),
    eq("\\lim_{m\\to\\infty}\\left(1 + \\frac{r}{m}\\right)^{mT} = e^{rT}, \\qquad B_T = B_0\\,e^{rT}."),
    p("Az opcióárazásban (Black–Scholes, sok kis lépésből álló binomiális fa) a folytonos kamatozás a szokásos konvenció, mert az exponenciálisokat könnyű szorozni és deriválni: $T_1$ ideig, majd $T_2$ ideig növekedni ugyanaz, mint $T_1 + T_2$ ideig, hiszen $e^{rT_1}e^{rT_2} = e^{r(T_1+T_2)}$."),
    p("Az ábra ugyanarra a kamatlábra hasonlítja össze a három konvenciót. Alacsony kamatnál és rövid távon szinte egybeesnek; a különbség $r$ és $T$ növekedésével nyílik ki."),
    figure("compounding"),
    {
      kind: "check",
      id: "interest-discounting/continuous-vs-annual",
      prompt: "100-at fektetsz be 5 évre, 6%-os jegyzett kamatláb mellett. Melyik konvencióval lesz több pénzed a végén?",
      answer: { type: "choice", options: ["Éves kamatozással", "Folytonos kamatozással", "Mindkettő ugyanannyit ad", "A kezdőösszegtől függ"], correct: 1 },
      explain: "Folytonos kamatozásnál a kamat késedelem nélkül kezd kamatozni: $100\\,e^{0{,}3} \\approx 134{,}99$, szemben az éves kamatozás $100 \\times 1{,}06^5 \\approx 133{,}82$-ével.",
    },

    h("Diszkontálás"),
    p("A diszkontálás a kamatozás visszafelé. Ha egy $C$ kifizetés a $T$ időpontban érkezik, a **jelenértéke** az az összeg, amelyet ma be kellene fektetni ahhoz, hogy $T$-ben pontosan $C$ legyen belőle:"),
    eq("\\text{PV} = C\\,e^{-rT} \\quad\\text{(folytonos)}, \\qquad \\text{PV} = \\frac{C}{(1+r)^T} \\quad\\text{(éves)}."),
    p("Az $e^{-rT}$ szorzó neve **diszkontfaktor**. Pozitív kamatnál mindig 0 és 1 közé esik, és annál kisebb, minél távolabbi a kifizetés."),
    p("Példa: $r = 5\\%$ folytonos kamat mellett a két év múlva fizetett 100 mai értéke $100\\,e^{-0{,}1} \\approx 90{,}48$. Ha ma 90,48-at befektetünk 5%-on két évre, pontosan 100-at kapunk vissza."),
    {
      kind: "check",
      id: "interest-discounting/present-value-annual",
      prompt: "Egy 1000-es kifizetés 5 év múlva érkezik. Évi 6%-os, évente tőkésített kamatláb mellett mennyit ér ma?",
      answer: { type: "number", value: 747.26, tolerance: 0.5 },
      explain: "$\\text{PV} = 1000/1{,}06^5 = 1000/1{,}3382 \\approx 747{,}26$.",
    },

    h("Átváltás a konvenciók között"),
    p("Ugyanazt a növekedést különböző konvenciókban is meg lehet adni. Egy folytonos $r_c$ és egy éves $r_a$ kamatláb akkor írja le ugyanazt a növekedést, ha"),
    eq("e^{r_c} = 1 + r_a \\quad\\Longleftrightarrow\\quad r_c = \\ln(1 + r_a)."),
    p("Az 5%-os folytonos kamat tehát nagyjából 5,13%-os éves kamatnak felel meg. Kamatlábak összehasonlításakor mindig nézd meg, melyik konvenció szerint értendők."),
    p("Ugyanígy váltható át egy évente $m$-szer tőkésített kamatláb az **effektív éves kamatlábra**, vagyis arra az évente tőkésített rátára, amely ugyanakkora növekedést ad: $r_{\\text{eff}} = (1 + r/m)^m - 1$."),
    {
      kind: "worked",
      title: "Havi tőkésítésű kamatlábtól az ötéves diszkontfaktorig",
      steps: [
        { text: "Egy megtakarítási számla évi 6%-ot jegyez, havi tőkésítéssel. Egy év növekedése tizenkét hónap, egyenként 0,5%-kal; 1-et levonva kapjuk az effektív éves kamatlábat.", tex: "r_{\\text{eff}} = \\left(1 + \\tfrac{0{,}06}{12}\\right)^{12} - 1", result: { value: 6.17, tolerance: 0.01, unit: "%" } },
        { text: "Öt évre diszkontálni annyi, mint elosztani öt év ilyen növekedésével, vagyis 60 havi periódussal.", tex: "\\left(1 + \\tfrac{0{,}06}{12}\\right)^{-60} = (1 + r_{\\text{eff}})^{-5}", result: { value: 0.7414, tolerance: 0.0005 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "A mai pénz többet ér, mint ugyanannyi később, mert kockázatmentesen kamatozhat $r$-rel.",
      "A kamatozás előre viszi a pénzt: $B_T = B_0(1+r)^T$, folytonos időben $B_0e^{rT}$.",
      "A diszkontálás visszahozza: $\\text{PV} = Ce^{-rT}$. Az $e^{-rT}$ a diszkontfaktor.",
    ),
    note("Minden további lecke használja az $e^{-rT}$ diszkontfaktort. Valahányszor egy képlet egy jövőbeli kifizetést a mai árral vet össze, ez a szorzó hozza őket közös nevezőre."),
    lab("/tvm", "Számolj jelen- és jövőértéket a Pénz időértéke laborban"),
  ],
};
