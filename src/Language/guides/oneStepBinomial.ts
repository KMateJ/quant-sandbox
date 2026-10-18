import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p, steps } from "./blocks";

export const oneStepBinomial: GuideLessonContent = {
  en: [
    p("This lesson builds the simplest model in which an option has a definite price. It uses the payoffs from \"Forwards, calls and puts\" and the replication argument from \"Arbitrage and the forward price\": if a portfolio of traded assets pays exactly what the option pays, the option must cost what the portfolio costs. Here we construct that portfolio explicitly."),

    h("The model"),
    p("There is one period, from today (time 0) to a single future date (time 1), and two traded assets:"),
    list(
      "A **stock** with price $S_0$ today. At time 1 it is worth either $uS_0$ (the up state) or $dS_0$ (the down state), with $d < u$. The numbers $u$ and $d$ are the **up factor** and **down factor**.",
      "A **risk-free bond** (or bank account). One unit invested today is worth $1+r$ at time 1 in both states. In the one-step lessons $r$ is the simple rate for the whole period, so money grows by the factor $(1+r)$, not $e^{rT}$.",
    ),
    p("We also assume that both assets can be bought or sold short in any quantity, including fractions, with no transaction costs and no dividends, and that borrowing and lending happen at the same rate $r$."),
    p("The model says nothing about how likely the up state is. A real-world probability $p$ exists, but, as we will see, the option price does not use it."),

    h("The no-arbitrage condition"),
    p("The model is only sensible if neither asset dominates the other. If $1+r \\ge u$, the bond pays at least as much as the stock in every state, so shorting the stock and buying the bond is an arbitrage. If $1+r \\le d$, the stock beats the bond in every state, and borrowing to buy the stock is an arbitrage. So we require"),
    eq("d < 1 + r < u."),
    p("In words: the risk-free growth factor must lie strictly between the two possible stock growth factors."),

    h("Option payoffs at the two nodes"),
    p("Take a European call with strike $K$ expiring at time 1. Its value at time 1 is its payoff in each state:"),
    eq("C_u = (uS_0 - K)^+, \\qquad C_d = (dS_0 - K)^+."),
    p("Nothing here is specific to calls. Any payoff $X$ that depends only on the stock price at time 1 is described by two numbers, $X_u$ and $X_d$, and the rest of the lesson works for every such payoff."),

    h("The replicating portfolio"),
    p("Buy $\\Delta$ shares of the stock and put $B$ into the bond ($B < 0$ means borrowing). Today this costs $\\Delta S_0 + B$. At time 1 it is worth $\\Delta uS_0 + B(1+r)$ in the up state and $\\Delta dS_0 + B(1+r)$ in the down state. We want these to equal the option values:"),
    eq("\\begin{aligned} \\Delta\\,uS_0 + B(1+r) &= C_u, \\\\ \\Delta\\,dS_0 + B(1+r) &= C_d. \\end{aligned}"),
    p("Two linear equations, two unknowns. Subtracting the second from the first removes $B$:"),
    eq("\\Delta = \\frac{C_u - C_d}{uS_0 - dS_0}."),
    p("$\\Delta$ is the change in option value divided by the change in stock price across the two states. Substituting back into the down-state equation gives the bond position:"),
    eq("B = \\frac{C_d - \\Delta\\,dS_0}{1+r} = \\frac{uC_d - dC_u}{(u-d)(1+r)}."),
    p("For a call, $C_u \\ge C_d$, so $0 \\le \\Delta \\le 1$, and $B \\le 0$: the replicating portfolio holds part of a share financed partly by borrowing."),

    h("Price equals the cost of replication"),
    p("The portfolio and the call have the same value in both states at time 1. If they had different prices today, you could buy the cheaper one, sell the dearer one, and keep the difference with no risk at time 1. That is an arbitrage, so the law of one price forces"),
    eq("C_0 = \\Delta S_0 + B."),
    note("In the one-step binomial model the option price is the cost today of the stock-and-bond portfolio that reproduces its payoff in both states. No probabilities and no attitudes to risk enter this argument."),

    h("Worked example"),
    p("Let $S_0 = 100$, $u = 1.2$, $d = 0.9$, $r = 2\\%$ per period and $K = 100$. The condition $0.9 < 1.02 < 1.2$ holds."),
    steps(
      "Stock at time 1: $uS_0 = 120$ or $dS_0 = 90$.",
      "Call at time 1: $C_u = (120 - 100)^+ = 20$ and $C_d = (90 - 100)^+ = 0$.",
      "Shares: $\\Delta = \\dfrac{20 - 0}{120 - 90} = \\dfrac{2}{3} \\approx 0.6667$.",
      "Bond: $B = \\dfrac{0 - \\tfrac{2}{3}\\cdot 90}{1.02} = -\\dfrac{60}{1.02} \\approx -58.82$, a loan of 58.82.",
      "Price: $C_0 = \\tfrac{2}{3}\\cdot 100 - 58.82 \\approx 66.67 - 58.82 = 7.84$.",
    ),
    p("Check: in the up state the portfolio is worth $\\tfrac{2}{3}\\cdot 120 - 60 = 20$, in the down state $\\tfrac{2}{3}\\cdot 90 - 60 = 0$. The loan repayment is $58.82 \\cdot 1.02 = 60$ in both states. The portfolio matches the call exactly."),
    p("If the call traded at 9, you would sell it, spend 7.84 building the portfolio and keep 1.16 today. At time 1 the portfolio pays exactly what you owe on the call, whichever state occurs."),

    h("Exploring the tree"),
    p("The figure draws the one-step tree with the stock price and the call value at each node, and reports $\\Delta$, $B$ and the call price. Change $u$, $d$, $r$ and $K$. Raising $K$ shrinks $C_u$ and so lowers both $\\Delta$ and the price; widening the gap between $u$ and $d$ raises the price. Move $r$, $u$ or $d$ so that $1+r$ leaves the interval $(d, u)$ and the figure warns that the no-arbitrage condition fails. The readout $q$ is the subject of the next lesson."),
    figure("one-step-tree"),

    h("Summary"),
    list(
      "The one-step model has a stock moving to $uS_0$ or $dS_0$ and a bond growing by $1+r$, with $d < 1+r < u$ to rule out arbitrage.",
      "Any payoff at time 1 is replicated by $\\Delta = (C_u - C_d)/(uS_0 - dS_0)$ shares and $B = (C_d - \\Delta dS_0)/(1+r)$ in the bond.",
      "By the law of one price the option costs $C_0 = \\Delta S_0 + B$.",
      "The real-world probability of the up move never appears in the price.",
    ),
    note("\"Risk-neutral probabilities\" rewrites $\\Delta S_0 + B$ as a discounted weighted average of $C_u$ and $C_d$, which is the form that carries over to every later pricing model."),
    lab("/binomial", "Build and price binomial trees in the Binomial lab"),
  ],

  hu: [
    p("Ez a lecke azt a legegyszerűbb modellt építi fel, amelyben egy opciónak egyértelmű ára van. A „Határidős ügyletek, call és put opciók” lecke kifizetéseire és az „Arbitrázs és a határidős ár” lecke replikációs érvére épít: ha forgalmazott termékekből álló portfólió pontosan azt fizeti, amit az opció, akkor az opció ára a portfólió árával egyezik meg. Most ezt a portfóliót konkrétan előállítjuk."),

    h("A modell"),
    p("Egyetlen periódus van, a mai naptól (0. időpont) egy jövőbeli időpontig (1. időpont), és két forgalmazott termék:"),
    list(
      "Egy **részvény**, amelynek mai ára $S_0$. Az 1. időpontban értéke vagy $uS_0$ (felfelé állapot), vagy $dS_0$ (lefelé állapot), ahol $d < u$. Az $u$ és $d$ számok a **felfelé** és **lefelé szorzó**.",
      "Egy **kockázatmentes kötvény** (vagy bankszámla). A ma befektetett egy egység az 1. időpontban mindkét állapotban $1+r$-et ér. Az egylépéses leckékben $r$ a teljes periódusra vonatkozó egyszerű kamatláb, így a pénz $(1+r)$-szeresére nő, nem $e^{rT}$-szeresére.",
    ),
    p("Feltesszük továbbá, hogy mindkét termékből tetszőleges (akár tört) mennyiséget lehet venni vagy shortolni, nincs tranzakciós költség és osztalék, és ugyanazon az $r$ kamaton lehet hitelt felvenni és betétet elhelyezni."),
    p("A modell semmit nem mond arról, mennyire valószínű a felfelé állapot. Létezik egy valós $p$ valószínűség, de mint látni fogjuk, az opció ára nem használja."),

    h("Az arbitrázsmentességi feltétel"),
    p("A modell csak akkor értelmes, ha egyik termék sem jobb a másiknál minden állapotban. Ha $1+r \\ge u$, a kötvény minden állapotban legalább annyit fizet, mint a részvény, így a részvény shortolása és kötvény vásárlása arbitrázs. Ha $1+r \\le d$, a részvény minden állapotban veri a kötvényt, és hitelből részvényt venni arbitrázs. Ezért megköveteljük, hogy"),
    eq("d < 1 + r < u."),
    p("Szavakkal: a kockázatmentes növekedési szorzó szigorúan a részvény két lehetséges szorzója közé esik."),

    h("Az opció kifizetése a két csúcsban"),
    p("Vegyünk egy európai vételi opciót $K$ kötési árral és 1. időpontbeli lejárattal. Az 1. időpontban az értéke az adott állapotbeli kifizetés:"),
    eq("C_u = (uS_0 - K)^+, \\qquad C_d = (dS_0 - K)^+."),
    p("Ebben semmi sem jellemző kifejezetten a callra. Minden olyan $X$ kifizetést, amely csak az 1. időpontbeli részvényártól függ, két szám ír le, $X_u$ és $X_d$, és a lecke további része minden ilyen kifizetésre érvényes."),

    h("A replikáló portfólió"),
    p("Vegyünk $\\Delta$ darab részvényt, és tegyünk $B$ összeget a kötvénybe ($B < 0$ hitelfelvételt jelent). Ez ma $\\Delta S_0 + B$-be kerül. Az 1. időpontban az értéke felfelé állapotban $\\Delta uS_0 + B(1+r)$, lefelé állapotban $\\Delta dS_0 + B(1+r)$. Azt akarjuk, hogy ezek egyezzenek az opció értékeivel:"),
    eq("\\begin{aligned} \\Delta\\,uS_0 + B(1+r) &= C_u, \\\\ \\Delta\\,dS_0 + B(1+r) &= C_d. \\end{aligned}"),
    p("Két lineáris egyenlet, két ismeretlen. Az elsőből kivonva a másodikat $B$ kiesik:"),
    eq("\\Delta = \\frac{C_u - C_d}{uS_0 - dS_0}."),
    p("$\\Delta$ tehát az opció értékének változása osztva a részvényár változásával a két állapot között. A lefelé állapot egyenletébe visszahelyettesítve megkapjuk a kötvénypozíciót:"),
    eq("B = \\frac{C_d - \\Delta\\,dS_0}{1+r} = \\frac{uC_d - dC_u}{(u-d)(1+r)}."),
    p("Callnál $C_u \\ge C_d$, ezért $0 \\le \\Delta \\le 1$ és $B \\le 0$: a replikáló portfólió egy részvény töredékét tartja, részben hitelből finanszírozva."),

    h("Az ár a replikáció költsége"),
    p("A portfólió és a call az 1. időpontban mindkét állapotban ugyanannyit ér. Ha ma eltérne az áruk, megvehetnénk az olcsóbbat, eladhatnánk a drágábbat, és kockázat nélkül megtarthatnánk a különbséget. Ez arbitrázs, ezért az egy ár törvénye kikényszeríti, hogy"),
    eq("C_0 = \\Delta S_0 + B."),
    note("Az egylépéses binomiális modellben az opció ára annak a részvényből és kötvényből álló portfóliónak a mai költsége, amely mindkét állapotban reprodukálja a kifizetését. Ebben az érvelésben sem valószínűségek, sem kockázati attitűdök nem szerepelnek."),

    h("Kidolgozott példa"),
    p("Legyen $S_0 = 100$, $u = 1{,}2$, $d = 0{,}9$, periódusonként $r = 2\\%$ és $K = 100$. A $0{,}9 < 1{,}02 < 1{,}2$ feltétel teljesül."),
    steps(
      "Részvény az 1. időpontban: $uS_0 = 120$ vagy $dS_0 = 90$.",
      "Call az 1. időpontban: $C_u = (120 - 100)^+ = 20$ és $C_d = (90 - 100)^+ = 0$.",
      "Részvények száma: $\\Delta = \\dfrac{20 - 0}{120 - 90} = \\dfrac{2}{3} \\approx 0{,}6667$.",
      "Kötvény: $B = \\dfrac{0 - \\tfrac{2}{3}\\cdot 90}{1{,}02} = -\\dfrac{60}{1{,}02} \\approx -58{,}82$, vagyis 58,82 hitel.",
      "Ár: $C_0 = \\tfrac{2}{3}\\cdot 100 - 58{,}82 \\approx 66{,}67 - 58{,}82 = 7{,}84$.",
    ),
    p("Ellenőrzés: felfelé állapotban a portfólió értéke $\\tfrac{2}{3}\\cdot 120 - 60 = 20$, lefelé $\\tfrac{2}{3}\\cdot 90 - 60 = 0$. A hitel visszafizetése mindkét állapotban $58{,}82 \\cdot 1{,}02 = 60$. A portfólió kifizetése tehát pontosan megegyezik a calléval."),
    p("Ha a call 9-en kereskedne, eladnánk, 7,84-ért felépítenénk a portfóliót, és ma megtartanánk 1,16-ot. Az 1. időpontban a portfólió pontosan annyit fizet, amennyivel a call miatt tartozunk, bármelyik állapot következik be."),

    h("A fa vizsgálata"),
    p("Az ábra felrajzolja az egylépéses fát, minden csúcsban a részvényárral és a call értékével, és kiírja $\\Delta$-t, $B$-t és a call árát. Változtasd $u$-t, $d$-t, $r$-t és $K$-t. A $K$ növelése csökkenti $C_u$-t, így $\\Delta$-t és az árat is; ha $u$ és $d$ távolabb kerül egymástól, nő az ár. Ha $r$, $u$ vagy $d$ mozgatásával $1+r$ kikerül a $(d, u)$ intervallumból, az ábra jelzi, hogy az arbitrázsmentességi feltétel sérül. A kiírt $q$ értékkel a következő lecke foglalkozik."),
    figure("one-step-tree"),

    h("Összefoglalás"),
    list(
      "Az egylépéses modellben a részvény $uS_0$-ra vagy $dS_0$-ra lép, a kötvény $1+r$-szeresére nő, és az arbitrázs kizárásához $d < 1+r < u$ kell.",
      "Bármely 1. időpontbeli kifizetést $\\Delta = (C_u - C_d)/(uS_0 - dS_0)$ részvény és $B = (C_d - \\Delta dS_0)/(1+r)$ kötvény replikál.",
      "Az egy ár törvénye miatt az opció ára $C_0 = \\Delta S_0 + B$.",
      "A felfelé lépés valós valószínűsége sehol nem jelenik meg az árban.",
    ),
    note("A „Kockázatsemleges valószínűségek” lecke a $\\Delta S_0 + B$ árat $C_u$ és $C_d$ diszkontált súlyozott átlagaként írja fel; ez a forma öröklődik minden későbbi árazási modellbe."),
    lab("/binomial", "Építs és árazz binomiális fákat a Binomiális laborban"),
  ],
};
