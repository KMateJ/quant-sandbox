import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const instruments: GuideLessonContent = {
  en: [
    p("This lesson introduces the three basic derivative contracts: forwards, calls and puts. It describes each one by what it pays at maturity, which is the starting point for every pricing argument that follows. It uses the risk-free rate and discount factor from \"Interest, compounding and discounting\"."),

    h("Underlying asset and derivative"),
    p("An **underlying asset** is something traded in its own right, such as a share of stock. We write $S_0$ for its price today and $S_T$ for its price at a later date $T$, measured in years. Today $S_0$ is known; $S_T$ is not."),
    p("A **derivative** is a contract whose payment is determined by the price of the underlying. The contract fixes a **maturity** $T$ and a rule that turns $S_T$ into a cash amount. That amount is the **payoff**:"),
    eq("X = f(S_T)."),
    p("The function $f$ is written into the contract. All three instruments in this lesson differ only in the choice of $f$. Throughout, we assume the stock pays no dividends, that there are no transaction costs, and that the contract is settled in cash: the parties exchange the payoff $X$ rather than shares."),

    h("Long and short positions"),
    p("Every contract has two sides. The party who receives the payoff $X$ is **long** the contract; the party who pays it is **short**. Whatever one side gains at maturity, the other side loses, so the payoff of the short position is $-X$. For this reason it is enough to describe the long side."),

    h("The forward contract"),
    p("A **forward contract** is an agreement made today to buy the underlying at time $T$ for a price $K$ fixed today, called the **delivery price**. Both sides are obliged to trade. The buyer (long) pays $K$ and receives an asset worth $S_T$, so the long payoff is"),
    eq("X_{\\text{fwd}} = S_T - K."),
    p("The payoff is a straight line with slope 1 in $S_T$. It is positive when the stock ends above $K$ and negative when it ends below. Because the long side can lose, nobody pays to enter a standard forward: $K$ is chosen so that the contract costs nothing today. How to choose that $K$ is the subject of \"Arbitrage and the forward price\"."),

    h("The call option"),
    p("An **option** gives its holder a right, not an obligation. A **call option** with **strike** $K$ and maturity $T$ gives the right to buy the underlying at time $T$ for $K$. The holder uses this right (exercises) only when it pays: if $S_T > K$ she buys for $K$ something worth $S_T$; if $S_T \\le K$ she lets the option expire. The call payoff is therefore"),
    eq("X_{\\text{call}} = \\max(S_T - K,\\,0) = (S_T - K)^+."),
    p("The notation $x^+ = \\max(x, 0)$ will be used throughout. Compared with the forward, the call removes the negative part of the payoff: the holder keeps the upside and never pays at maturity."),

    h("The put option"),
    p("A **put option** gives the right to sell the underlying at time $T$ for the strike $K$. The holder exercises when the stock ends below the strike, since she can then sell for $K$ something worth only $S_T$:"),
    eq("X_{\\text{put}} = \\max(K - S_T,\\,0) = (K - S_T)^+."),
    p("A put works like insurance on a share: if the stock falls below $K$, the put pays the shortfall. Its payoff is largest, equal to $K$, when the stock is worthless, and it is zero for any $S_T \\ge K$."),
    p("The options described here are **European**: they can be exercised only at $T$. **American** options can be exercised at any time up to $T$; they return in \"Multi-step trees and backward induction\"."),
    p("The figure plots the payoff at maturity against $S_T$. Switch between call, put and forward, and move the strike $K$. Note that the forward line crosses zero exactly at $K$, while each option payoff has a kink at $K$ and is flat at zero on one side of it."),
    figure("payoff"),
    note("Forward payoff $S_T - K$, call payoff $(S_T - K)^+$, put payoff $(K - S_T)^+$. A forward is an obligation; an option is a right, which is why an option has a price today."),
    {
      kind: "check",
      id: "instruments/long-put-payoff",
      prompt: "You hold a European put with strike $K = 100$. At maturity the stock is at $S_T = 85$. What is the payoff?",
      answer: { type: "number", value: 15, tolerance: 0.01 },
      explain: "The put pays $(K - S_T)^+ = (100 - 85)^+ = 15$: you sell for 100 a share worth 85.",
    },

    h("Payoff and profit"),
    p("Because an option payoff is never negative, the right has value, and the buyer pays the seller a **premium** when the contract is signed. We write $C_0$ for the price of a call today and $P_0$ for the price of a put. The payoff ignores this cost. The **profit** of the long position subtracts it:"),
    eq("\\text{profit}_{\\text{call}} = (S_T - K)^+ - C_0\\,e^{rT}."),
    p("The premium is paid at time 0 and the payoff arrives at time $T$, so the premium is grown by $e^{rT}$ to compare amounts at the same date. For short maturities and low rates this factor is close to 1, and the examples below simply subtract the premium."),
    p("Example: a call with $K = 100$ costs 6. If $S_T = 115$, the payoff is 15 and the profit is $15 - 6 = 9$. If $S_T = 103$, the payoff is 3 and the profit is $-3$: the option was exercised, but did not recover its cost. If $S_T = 95$, the payoff is 0 and the loss is the full premium of 6. The break-even level is $K + C_0 = 106$."),
    p("For a put with $K = 100$ and premium 4, the payoff at $S_T = 90$ is 10 and the profit is 6. The break-even level is $K - P_0 = 96$."),
    p("For the short side, the profit is the premium received minus the payoff. The seller of a call earns at most the premium and has unlimited potential loss; the seller of a put loses at most $K - P_0$."),
    p("A forward has no premium, so for a forward the payoff and the profit coincide. With $K = 100$ and $S_T = 112$ the long side gains 12 and the short side loses 12."),
    {
      kind: "worked",
      title: "Profit of a long call across final prices",
      steps: [
        { text: "A call with $K = 100$ costs 4.2. At $S_T = 90$ it expires worthless, so the loss is the premium.", tex: "(90 - 100)^+ - 4.2", result: { value: -4.2, tolerance: 0.01 } },
        { text: "At $S_T = 100$ the payoff is still zero.", tex: "(100 - 100)^+ - 4.2", result: { value: -4.2, tolerance: 0.01 } },
        { text: "At $S_T = 110$ the payoff of 10 more than covers the premium.", tex: "(110 - 100)^+ - 4.2", result: { value: 5.8, tolerance: 0.01 } },
        { text: "At $S_T = 120$ every extra unit of $S_T$ adds one unit of profit.", tex: "(120 - 100)^+ - 4.2", result: { value: 15.8, tolerance: 0.01 } },
        { text: "The break-even level is the strike plus the premium.", tex: "K + C_0", result: { value: 104.2, tolerance: 0.01 } },
      ],
    },
    {
      kind: "check",
      id: "instruments/unlimited-loss",
      prompt: "Which of these positions has an unlimited potential loss at maturity?",
      answer: { type: "choice", options: ["Long call", "Long put", "Short call", "Short put"], correct: 2 },
      explain: "The short call pays $(S_T - K)^+$, which grows without bound as $S_T$ rises. A short put loses at most $K - P_0$; long options lose at most their premium.",
    },

    h("Summary"),
    list(
      "A derivative pays $X = f(S_T)$ at maturity $T$; the function $f$ is fixed in the contract.",
      "Long receives $X$, short pays $X$; the two payoffs sum to zero.",
      "Forward: obligation, payoff $S_T - K$, costs nothing to enter.",
      "Call: right to buy, payoff $(S_T - K)^+$. Put: right to sell, payoff $(K - S_T)^+$. Options cost a premium.",
      "Profit equals payoff minus the cost of entering, carried to time $T$.",
    ),
    note("The next lesson adds these payoffs together. Because payoffs are just functions of $S_T$, a portfolio of contracts pays the sum of the individual payoffs."),
    lab("/payoff", "Build and compare single-instrument payoffs in the Payoff lab"),
  ],

  hu: [
    p("Ez a lecke a három alapvető származtatott terméket mutatja be: a határidős ügyletet, a call és a put opciót. Mindegyiket azzal írjuk le, mit fizet lejáratkor, mert minden későbbi árazási érvelés ebből indul. A kockázatmentes kamatlábat és a diszkontfaktort a „Kamat, kamatozás és diszkontálás” leckéből használjuk."),

    h("Alaptermék és származtatott termék"),
    p("Az **alaptermék** olyan eszköz, amellyel önmagában is kereskednek, például egy részvény. Mai árát $S_0$, egy későbbi $T$ időpontbeli (években mért) árát $S_T$ jelöli. Ma $S_0$ ismert, $S_T$ viszont nem."),
    p("A **származtatott termék** (derivatíva) olyan szerződés, amelynek kifizetését az alaptermék ára határozza meg. A szerződés rögzít egy $T$ **lejáratot** és egy szabályt, amely $S_T$-ből pénzösszeget csinál. Ez az összeg a **kifizetés**:"),
    eq("X = f(S_T)."),
    p("Az $f$ függvényt a szerződés rögzíti; a lecke három terméke csak ebben különbözik. Végig feltesszük, hogy a részvény nem fizet osztalékot, nincsenek tranzakciós költségek, és az elszámolás pénzben történik: a felek az $X$ kifizetést cserélik ki, nem részvényeket."),

    h("Long és short pozíció"),
    p("Minden szerződésnek két oldala van. Aki az $X$ kifizetést kapja, az **hosszú** (long) pozícióban van; aki fizeti, az **rövid** (short) pozícióban. Amit lejáratkor az egyik fél nyer, azt a másik elveszíti, így a short pozíció kifizetése $-X$. Ezért elég a long oldalt leírni."),

    h("A határidős ügylet"),
    p("A **határidős ügylet** (forward) olyan ma kötött megállapodás, hogy $T$-ben a ma rögzített $K$ áron megvesszük az alapterméket; $K$ neve **szállítási ár**. Mindkét fél köteles teljesíteni. A vevő (long fél) $K$-t fizet, és $S_T$ értékű eszközt kap, így a kifizetése"),
    eq("X_{\\text{fwd}} = S_T - K."),
    p("A kifizetés $S_T$-ben egy 1 meredekségű egyenes: pozitív, ha a részvény $K$ fölött zár, és negatív, ha alatta. Mivel a long fél veszíthet is, a szokásos határidős ügyletbe senki sem fizet a belépésért: $K$-t úgy választják, hogy a szerződés ma semmibe se kerüljön. Hogy ez melyik $K$, azt az „Arbitrázs és a határidős ár” lecke tárgyalja."),

    h("A call opció"),
    p("Az **opció** jogot ad a tulajdonosának, nem kötelezettséget. A $K$ **kötési árú** és $T$ lejáratú **vételi opció** (call) feljogosít arra, hogy $T$-ben $K$-ért megvegyük az alapterméket. A tulajdonos csak akkor él a jogával (hívja le az opciót), ha megéri: ha $S_T > K$, akkor $K$-ért vesz valamit, ami $S_T$-t ér; ha $S_T \\le K$, hagyja lejárni. A call kifizetése tehát"),
    eq("X_{\\text{call}} = \\max(S_T - K,\\,0) = (S_T - K)^+."),
    p("Az $x^+ = \\max(x, 0)$ jelölést a továbbiakban végig használjuk. A határidős ügylethez képest a call levágja a kifizetés negatív részét: a tulajdonos megtartja a felfelé mozgás hasznát, lejáratkor pedig sosem fizet."),

    h("A put opció"),
    p("Az **eladási opció** (put) arra jogosít fel, hogy $T$-ben $K$ kötési áron eladjuk az alapterméket. A tulajdonos akkor hívja le, ha a részvény a kötési ár alatt zár, hiszen ekkor $K$-ért adhat el valamit, ami csak $S_T$-t ér:"),
    eq("X_{\\text{put}} = \\max(K - S_T,\\,0) = (K - S_T)^+."),
    p("A put olyan, mint egy biztosítás a részvényre: ha az árfolyam $K$ alá esik, a put kifizeti a különbözetet. A kifizetés akkor a legnagyobb, $K$, ha a részvény értéktelenné válik, és nulla minden $S_T \\ge K$ esetén."),
    p("Az itt leírt opciók **európaiak**: csak $T$-ben hívhatók le. Az **amerikai** opciók $T$-ig bármikor lehívhatók; ezekre a „Többlépéses fák és visszafelé indukció” leckében térünk vissza."),
    p("Az ábra a lejáratkori kifizetést mutatja $S_T$ függvényében. Válts a call, a put és a határidős ügylet között, és mozgasd a $K$ kötési árat. Figyeld meg, hogy a határidős egyenes pontosan $K$-ban metszi a nullát, míg mindkét opció kifizetésének $K$-ban töréspontja van, és az egyik oldalon nullán marad."),
    figure("payoff"),
    note("Határidős kifizetés $S_T - K$, call kifizetés $(S_T - K)^+$, put kifizetés $(K - S_T)^+$. A határidős ügylet kötelezettség, az opció jog, ezért az opciónak ma ára van."),
    {
      kind: "check",
      id: "instruments/long-put-payoff",
      prompt: "Egy $K = 100$ kötési árú európai put van nálad. Lejáratkor a részvény $S_T = 85$. Mennyi a kifizetés?",
      answer: { type: "number", value: 15, tolerance: 0.01 },
      explain: "A put $(K - S_T)^+ = (100 - 85)^+ = 15$-öt fizet: 100-ért adsz el egy 85-öt érő részvényt.",
    },

    h("Kifizetés és nyereség"),
    p("Mivel az opció kifizetése sosem negatív, a jognak értéke van: a vevő a szerződéskötéskor **opciós díjat** (prémiumot) fizet az eladónak. A call mai árát $C_0$, a putét $P_0$ jelöli. A kifizetés ezt a költséget nem tartalmazza; a long pozíció **nyeresége** levonja:"),
    eq("\\text{nyereség}_{\\text{call}} = (S_T - K)^+ - C_0\\,e^{rT}."),
    p("A díjat a 0 időpontban fizetjük, a kifizetés $T$-ben érkezik, ezért a díjat $e^{rT}$-vel felkamatoljuk, hogy azonos időpontbeli összegeket hasonlítsunk össze. Rövid lejáratnál és alacsony kamatnál ez a szorzó közel 1, ezért az alábbi példák egyszerűen levonják a díjat."),
    p("Példa: egy $K = 100$ kötési árú call 6-ba kerül. Ha $S_T = 115$, a kifizetés 15, a nyereség $15 - 6 = 9$. Ha $S_T = 103$, a kifizetés 3, a nyereség $-3$: az opciót lehívták, de nem hozta vissza az árát. Ha $S_T = 95$, a kifizetés 0, a veszteség a teljes 6-os díj. A fedezeti pont $K + C_0 = 106$."),
    p("Egy $K = 100$ kötési árú, 4-es díjú put kifizetése $S_T = 90$ mellett 10, a nyereség 6. A fedezeti pont $K - P_0 = 96$."),
    p("A short oldal nyeresége a kapott díj mínusz a kifizetés. A call eladója legfeljebb a díjat keresheti meg, vesztesége viszont korlátlan lehet; a put eladója legfeljebb $K - P_0$-t veszíthet."),
    p("A határidős ügyletnek nincs díja, így ott a kifizetés és a nyereség megegyezik. $K = 100$ és $S_T = 112$ mellett a long fél 12-t nyer, a short fél 12-t veszít."),
    {
      kind: "worked",
      title: "Egy long call nyeresége különböző záróárak mellett",
      steps: [
        { text: "Egy $K = 100$ kötési árú call ára 4,2. $S_T = 90$ mellett értéktelenül jár le, a veszteség a díj.", tex: "(90 - 100)^+ - 4{,}2", result: { value: -4.2, tolerance: 0.01 } },
        { text: "$S_T = 100$ mellett a kifizetés még mindig nulla.", tex: "(100 - 100)^+ - 4{,}2", result: { value: -4.2, tolerance: 0.01 } },
        { text: "$S_T = 110$ mellett a 10-es kifizetés már bőven fedezi a díjat.", tex: "(110 - 100)^+ - 4{,}2", result: { value: 5.8, tolerance: 0.01 } },
        { text: "$S_T = 120$ mellett $S_T$ minden további egysége egy egység nyereséget hoz.", tex: "(120 - 100)^+ - 4{,}2", result: { value: 15.8, tolerance: 0.01 } },
        { text: "A fedezeti pont a kötési ár plusz a díj.", tex: "K + C_0", result: { value: 104.2, tolerance: 0.01 } },
      ],
    },
    {
      kind: "check",
      id: "instruments/unlimited-loss",
      prompt: "Az alábbi pozíciók közül melyiknek korlátlan a lehetséges vesztesége lejáratkor?",
      answer: { type: "choice", options: ["Long call", "Long put", "Short call", "Short put"], correct: 2 },
      explain: "A short call $(S_T - K)^+$-t fizet, ami $S_T$ emelkedésével korlát nélkül nő. A short put legfeljebb $K - P_0$-t veszít, a long opciók legfeljebb a díjukat.",
    },

    h("Összefoglalás"),
    list(
      "A származtatott termék a $T$ lejáratkor $X = f(S_T)$ összeget fizet; az $f$ függvényt a szerződés rögzíti.",
      "A long fél kapja, a short fél fizeti $X$-et; a két kifizetés összege nulla.",
      "Határidős ügylet: kötelezettség, kifizetése $S_T - K$, a belépés ingyenes.",
      "Call: vételi jog, kifizetése $(S_T - K)^+$. Put: eladási jog, kifizetése $(K - S_T)^+$. Az opcióért díjat kell fizetni.",
      "A nyereség a kifizetés mínusz a belépés $T$-re felkamatolt költsége.",
    ),
    note("A következő lecke összeadja ezeket a kifizetéseket. Mivel a kifizetések egyszerűen $S_T$ függvényei, egy szerződésekből álló portfólió az egyes kifizetések összegét fizeti."),
    lab("/payoff", "Építs és hasonlíts össze egyedi kifizetéseket a Kifizetés laborban"),
  ],
};
