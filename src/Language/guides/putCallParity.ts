import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const putCallParity: GuideLessonContent = {
  en: [
    p("This lesson derives an exact relation between the prices of a European call and a European put. It combines the synthetic forward from \"Combining positions\" with the law of one price from \"Arbitrage and the forward price\". Like the forward price, the result needs no model for how the stock moves."),

    h("Setting"),
    p("Take a European call and a European put on the same non-dividend-paying stock, with the same strike $K$ and the same maturity $T$. Their prices today are $C_0$ and $P_0$. The stock trades at $S_0$, and the continuously compounded risk-free rate is $r$, so a zero-coupon bond paying $K$ at $T$ costs $Ke^{-rT}$ today. The market assumptions are those of \"Arbitrage and the forward price\": no transaction costs, borrowing and lending at $r$, short selling allowed."),

    h("Two portfolios with the same payoff"),
    p("From \"Combining positions\", a long call and a short put with the same strike pay"),
    eq("(S_T - K)^+ - (K - S_T)^+ = S_T - K"),
    p("for every value of $S_T$. Now build two portfolios:"),
    list(
      "**Portfolio A:** buy one call and sell one put. Cost today $C_0 - P_0$. Payoff at $T$: $S_T - K$.",
      "**Portfolio B:** buy one share and borrow $Ke^{-rT}$, so that $K$ is owed at $T$. Cost today $S_0 - Ke^{-rT}$. Payoff at $T$: $S_T - K$.",
    ),
    p("Portfolio B is the stock-and-loan replication of a forward with delivery price $K$, as in the cash-and-carry argument. The two portfolios pay exactly the same amount in every state at $T$, so the law of one price says they cost the same today:"),
    eq("C_0 - P_0 = S_0 - K\\,e^{-rT}."),
    p("This is **put–call parity**. Rearranged as $C_0 + Ke^{-rT} = P_0 + S_0$, it reads: a call plus cash equal to the discounted strike is worth the same as a put plus the stock. Both sides pay $\\max(S_T, K)$ at maturity."),
    note("Put–call parity: $C_0 - P_0 = S_0 - Ke^{-rT}$ for European options on a non-dividend-paying stock with the same strike and maturity. It follows from no arbitrage alone."),

    h("A numerical check"),
    p("Take $S_0 = 100$, $K = 100$, $r = 5\\%$, $T = 1$. The right-hand side is"),
    eq("S_0 - K\\,e^{-rT} = 100 - 100\\,e^{-0.05} \\approx 100 - 95.12 = 4.88."),
    p("The Black–Scholes formula, derived in the lesson \"The Black–Scholes formula\", prices these options with volatility $\\sigma = 20\\%$ at $C_0 \\approx 10.45$ and $P_0 \\approx 5.57$. The difference is $4.88$, as parity requires. With a different volatility both prices change, but by the same amount, so their difference stays at 4.88."),
    p("Now suppose a dealer offers the call at 11 while the put is still at 5.57. Then $C_0 - P_0 = 5.43 > 4.88$, so portfolio A is too expensive relative to B. Sell A and buy B: sell the call, buy the put, buy the share and borrow $95.12$. The cash flow today is"),
    eq("11 - 5.57 - 100 + 95.12 \\approx 0.55,"),
    p("and at $T$ the positions cancel exactly: the short call and long put together pay $-(S_T - K)$, the share and the loan pay $S_T - K$. The 0.55 is kept without risk."),
    {
      kind: "check",
      id: "put-call-parity/put-from-call",
      prompt: "A European call with $K = 100$ and $T = 1$ costs 7.2. The stock is at $S_0 = 100$ and $r = 5\\%$. What must the put with the same strike and maturity cost?",
      answer: { type: "number", value: 2.32, tolerance: 0.01 },
      explain: "$P_0 = C_0 - S_0 + Ke^{-rT} = 7.2 - 100 + 100\\,e^{-0.05} \\approx 7.2 - 4.88 = 2.32$.",
    },
    {
      kind: "worked",
      title: "Checking parity with the synthetic forward",
      steps: [
        { text: "Portfolio B borrows the discounted strike, so that $K$ is owed at $T$.", tex: "K\\,e^{-rT} = 100\\,e^{-0.05}", result: { value: 95.12, tolerance: 0.01 } },
        { text: "B costs one share minus that loan.", tex: "S_0 - K\\,e^{-rT}", result: { value: 4.88, tolerance: 0.01 } },
        { text: "Portfolio A, long the call at 10.45 and short the put at 5.57, costs", tex: "C_0 - P_0 = 10.45 - 5.57", result: { value: 4.88, tolerance: 0.01 } },
        { text: "Both pay $S_T - K$ at $T$. At $S_T = 120$, for example, each pays", tex: "(120 - 100)^+ - (100 - 120)^+", result: { value: 20, tolerance: 0.01 } },
      ],
    },
    p("The figure fixes $S_0 = 100$ and $r = 5\\%$ and lets you move $K$, $\\sigma$ and $T$. The chart overlays the payoff of a long call plus a short put on the forward payoff $S_T - K$; the two lines coincide for every strike. The readouts give the Black–Scholes prices $C_0$ and $P_0$, their difference, and $S_0 - Ke^{-rT}$. Change $\\sigma$ and note that $C_0$ and $P_0$ both move while $C_0 - P_0$ does not; it changes only with $K$ and $T$."),
    figure("put-call-parity"),

    h("What parity does and does not tell you"),
    p("Parity is **model-free**: it holds whatever the distribution of $S_T$, because the argument never uses probabilities. It links the two prices, so knowing one gives the other. A desk that prices calls also prices puts, and the put price follows from the call price by $P_0 = C_0 - S_0 + Ke^{-rT}$."),
    p("Parity does not tell you the level of either price. It fixes the difference $C_0 - P_0$, while the volatility of the stock determines how large both are. Finding that level needs a model of the stock price, which starts in \"The one-step binomial model\"."),
    p("The result relies on its assumptions. With dividends, the stock leg must be reduced by the present value of the dividends. For American options, early exercise breaks the exact equality and leaves only inequalities."),
    {
      kind: "check",
      id: "put-call-parity/european-only",
      prompt: "For which options does the exact equality $C_0 - P_0 = S_0 - Ke^{-rT}$ hold?",
      answer: { type: "choice", options: ["European options on a non-dividend-paying stock", "American options on a non-dividend-paying stock", "Any options, whatever the exercise style", "Only at-the-money options"], correct: 0 },
      explain: "The argument holds both portfolios to $T$. Early exercise of American options breaks that, and leaves only inequalities; dividends change the stock leg.",
    },

    h("Simple no-arbitrage bounds"),
    p("The same reasoning bounds the call price without a model. For the upper bound, a call never pays more than the stock, since $(S_T - K)^+ \\le S_T$ for $K \\ge 0$. A portfolio that always pays less cannot cost more, so $C_0 \\le S_0$."),
    p("For the lower bound, the call payoff is never negative, so $C_0 \\ge 0$. Also, $(S_T - K)^+ \\ge S_T - K$, so the call is worth at least the forward-like portfolio B, which costs $S_0 - Ke^{-rT}$. Combining:"),
    eq("\\max\\left(S_0 - K\\,e^{-rT},\\,0\\right) \\le C_0 \\le S_0."),
    p("The lower bound also follows from parity: since $P_0 \\ge 0$, $C_0 = P_0 + S_0 - Ke^{-rT} \\ge S_0 - Ke^{-rT}$. In the example the call must lie between 4.88 and 100. These bounds are wide; they exclude absurd prices but leave the actual level to a model."),

    h("Summary"),
    list(
      "A long call and a short put with the same strike and maturity pay $S_T - K$, the same as a share financed by borrowing $Ke^{-rT}$.",
      "By the law of one price, $C_0 - P_0 = S_0 - Ke^{-rT}$.",
      "Parity is model-free: it links the call and put prices but does not fix their level.",
      "Without a model the call price is only bounded: $\\max(S_0 - Ke^{-rT}, 0) \\le C_0 \\le S_0$.",
    ),
    note("To pin down the actual option price, the next lessons add a model for the stock price, starting with a single step up or down."),
    lab("/payoff", "Combine calls and puts into a synthetic forward in the Payoff lab"),
  ],

  hu: [
    p("Ez a lecke pontos összefüggést vezet le egy európai call és egy európai put ára között. A „Pozíciók kombinálása” lecke szintetikus határidős ügyletét kapcsolja össze az „Arbitrázs és a határidős ár” lecke egy ár törvényével. A határidős árhoz hasonlóan az eredmény semmilyen modellt nem igényel a részvény mozgására."),

    h("A keret"),
    p("Vegyünk egy európai callt és egy európai putot ugyanarra az osztalékot nem fizető részvényre, azonos $K$ kötési árral és $T$ lejárattal. Mai áruk $C_0$ és $P_0$. A részvény ára $S_0$, a folytonos kockázatmentes kamatláb $r$, így egy $T$-ben $K$-t fizető zérókuponos kötvény ma $Ke^{-rT}$-be kerül. A piaci feltevések ugyanazok, mint az „Arbitrázs és a határidős ár” leckében: nincs tranzakciós költség, $r$ kamaton lehet hitelt felvenni és pénzt elhelyezni, a shortolás megengedett."),

    h("Két portfólió azonos kifizetéssel"),
    p("A „Pozíciók kombinálása” lecke szerint egy long call és egy short put azonos kötési árral"),
    eq("(S_T - K)^+ - (K - S_T)^+ = S_T - K"),
    p("összeget fizet $S_T$ bármely értéke mellett. Építsünk két portfóliót:"),
    list(
      "**A portfólió:** veszünk egy callt és eladunk egy putot. Mai költség $C_0 - P_0$. Kifizetés $T$-ben: $S_T - K$.",
      "**B portfólió:** veszünk egy részvényt és felveszünk $Ke^{-rT}$ hitelt, amelyből $T$-ben $K$ tartozás lesz. Mai költség $S_0 - Ke^{-rT}$. Kifizetés $T$-ben: $S_T - K$.",
    ),
    p("A B portfólió egy $K$ szállítási árú határidős ügylet részvénnyel és hitellel való replikálása, mint a cash-and-carry érvelésben. A két portfólió $T$-ben minden állapotban pontosan ugyanannyit fizet, így az egy ár törvénye szerint ma is ugyanannyiba kerülnek:"),
    eq("C_0 - P_0 = S_0 - K\\,e^{-rT}."),
    p("Ez a **put–call paritás**. $C_0 + Ke^{-rT} = P_0 + S_0$ alakban így olvasható: egy call plusz a diszkontált kötési árnyi készpénz ugyanannyit ér, mint egy put plusz a részvény. Lejáratkor mindkét oldal $\\max(S_T, K)$-t fizet."),
    note("Put–call paritás: $C_0 - P_0 = S_0 - Ke^{-rT}$ osztalékot nem fizető részvényre szóló, azonos kötési árú és lejáratú európai opciókra. Pusztán az arbitrázsmentességből következik."),

    h("Számpélda"),
    p("Legyen $S_0 = 100$, $K = 100$, $r = 5\\%$, $T = 1$. A jobb oldal"),
    eq("S_0 - K\\,e^{-rT} = 100 - 100\\,e^{-0{,}05} \\approx 100 - 95{,}12 = 4{,}88."),
    p("A Black–Scholes-képlet, amelyet „A Black–Scholes-képlet” lecke vezet le, $\\sigma = 20\\%$ volatilitás mellett $C_0 \\approx 10{,}45$ és $P_0 \\approx 5{,}57$ árat ad. A különbség $4{,}88$, ahogy a paritás előírja. Más volatilitásnál mindkét ár megváltozik, de ugyanannyival, így a különbségük 4,88 marad."),
    p("Tegyük fel, hogy egy árjegyző 11-ért kínálja a callt, a put ára pedig továbbra is 5,57. Ekkor $C_0 - P_0 = 5{,}43 > 4{,}88$, vagyis az A portfólió drága B-hez képest. Adjuk el A-t és vegyük meg B-t: eladjuk a callt, megvesszük a putot, megvesszük a részvényt és felveszünk $95{,}12$ hitelt. A mai pénzáram"),
    eq("11 - 5{,}57 - 100 + 95{,}12 \\approx 0{,}55,"),
    p("$T$-ben pedig a pozíciók pontosan kioltják egymást: az eladott call és a megvett put együtt $-(S_T - K)$-t fizet, a részvény és a hitel $S_T - K$-t. A 0,55 kockázat nélkül nálunk marad."),
    {
      kind: "check",
      id: "put-call-parity/put-from-call",
      prompt: "Egy $K = 100$ kötési árú, $T = 1$ lejáratú európai call ára 7,2. A részvény $S_0 = 100$, $r = 5\\%$. Mennyibe kell kerülnie az azonos kötési árú és lejáratú putnak?",
      answer: { type: "number", value: 2.32, tolerance: 0.01 },
      explain: "$P_0 = C_0 - S_0 + Ke^{-rT} = 7{,}2 - 100 + 100\\,e^{-0{,}05} \\approx 7{,}2 - 4{,}88 = 2{,}32$.",
    },
    {
      kind: "worked",
      title: "A paritás ellenőrzése a szintetikus határidős ügylettel",
      steps: [
        { text: "A B portfólió a diszkontált kötési árat veszi fel hitelként, így $T$-ben $K$ a tartozás.", tex: "K\\,e^{-rT} = 100\\,e^{-0{,}05}", result: { value: 95.12, tolerance: 0.01 } },
        { text: "B ára egy részvény mínusz ez a hitel.", tex: "S_0 - K\\,e^{-rT}", result: { value: 4.88, tolerance: 0.01 } },
        { text: "Az A portfólió, a 10,45-ös long call és az 5,57-es short put ára", tex: "C_0 - P_0 = 10{,}45 - 5{,}57", result: { value: 4.88, tolerance: 0.01 } },
        { text: "$T$-ben mindkettő $S_T - K$-t fizet. Például $S_T = 120$ mellett mindkettő ennyit:", tex: "(120 - 100)^+ - (100 - 120)^+", result: { value: 20, tolerance: 0.01 } },
      ],
    },
    p("Az ábra rögzíti az $S_0 = 100$ és $r = 5\\%$ értékeket, és $K$, $\\sigma$, $T$ állítható. A grafikon egy long call és egy short put együttes kifizetését rajzolja rá az $S_T - K$ határidős kifizetésre; a két vonal minden kötési árnál egybeesik. A kijelzők a $C_0$ és $P_0$ Black–Scholes-árat, a különbségüket és $S_0 - Ke^{-rT}$-t mutatják. Változtasd $\\sigma$-t, és figyeld meg, hogy $C_0$ és $P_0$ is mozog, $C_0 - P_0$ viszont nem; az csak $K$-val és $T$-vel változik."),
    figure("put-call-parity"),

    h("Mit mond meg a paritás, és mit nem"),
    p("A paritás **modellfüggetlen**: $S_T$ eloszlásától függetlenül érvényes, mert az érvelés sehol sem használ valószínűségeket. Összeköti a két árat, így az egyikből megkapjuk a másikat. Aki callokat áraz, az putokat is áraz: a put ára $P_0 = C_0 - S_0 + Ke^{-rT}$."),
    p("Azt viszont nem mondja meg, mekkora bármelyik ár. A $C_0 - P_0$ különbséget rögzíti, de hogy mindkettő mekkora, azt a részvény volatilitása határozza meg. Ehhez már modell kell a részvényárra, amely „Az egylépéses binomiális modell” leckében kezdődik."),
    p("Az eredmény a feltevéseire épül. Osztalék esetén a részvénylábat csökkenteni kell az osztalékok jelenértékével. Amerikai opcióknál a korai lehívás lehetősége megszünteti a pontos egyenlőséget, és csak egyenlőtlenségek maradnak."),
    {
      kind: "check",
      id: "put-call-parity/european-only",
      prompt: "Mely opciókra érvényes pontosan a $C_0 - P_0 = S_0 - Ke^{-rT}$ egyenlőség?",
      answer: { type: "choice", options: ["Osztalékot nem fizető részvényre szóló európai opciókra", "Osztalékot nem fizető részvényre szóló amerikai opciókra", "Bármilyen opcióra, lehívási módtól függetlenül", "Csak at-the-money opciókra"], correct: 0 },
      explain: "Az érvelés mindkét portfóliót $T$-ig tartja. Az amerikai opciók korai lehívása ezt megtöri, és csak egyenlőtlenségek maradnak; az osztalék a részvénylábat változtatja meg.",
    },

    h("Egyszerű arbitrázsmentes korlátok"),
    p("Ugyanez a gondolatmenet modell nélkül is korlátozza a call árát. Felső korlát: a call sosem fizet többet a részvénynél, hiszen $K \\ge 0$ esetén $(S_T - K)^+ \\le S_T$. Ami mindig kevesebbet fizet, az nem kerülhet többe, tehát $C_0 \\le S_0$."),
    p("Alsó korlát: a call kifizetése sosem negatív, így $C_0 \\ge 0$. Továbbá $(S_T - K)^+ \\ge S_T - K$, tehát a call legalább annyit ér, mint a határidős jellegű B portfólió, amely $S_0 - Ke^{-rT}$-be kerül. Együtt:"),
    eq("\\max\\left(S_0 - K\\,e^{-rT},\\,0\\right) \\le C_0 \\le S_0."),
    p("Az alsó korlát a paritásból is adódik: mivel $P_0 \\ge 0$, $C_0 = P_0 + S_0 - Ke^{-rT} \\ge S_0 - Ke^{-rT}$. A példában a call ára 4,88 és 100 közé kell esnie. Ezek a korlátok tágak: kizárják az abszurd árakat, a tényleges szintet azonban a modellre hagyják."),

    h("Összefoglalás"),
    list(
      "Egy long call és egy short put azonos kötési árral és lejárattal $S_T - K$-t fizet, ugyanannyit, mint egy $Ke^{-rT}$ hitelből vett részvény.",
      "Az egy ár törvénye szerint $C_0 - P_0 = S_0 - Ke^{-rT}$.",
      "A paritás modellfüggetlen: összeköti a call és a put árát, de a szintjüket nem rögzíti.",
      "Modell nélkül a call ára csak korlátozható: $\\max(S_0 - Ke^{-rT}, 0) \\le C_0 \\le S_0$.",
    ),
    note("A tényleges opciós ár meghatározásához a következő leckék modellt adnak a részvényárra, kezdve egyetlen fel- vagy lefelé lépéssel."),
    lab("/payoff", "Rakj össze callokból és putokból szintetikus határidős ügyletet a Kifizetés laborban"),
  ],
};
