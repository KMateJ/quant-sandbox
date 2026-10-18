import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p, steps } from "./blocks";

export const blackScholes: GuideLessonContent = {
  en: [
    p("This lesson derives the Black–Scholes price of a European call and put. It puts together three earlier results: pricing as a discounted risk-neutral expectation (\"Risk-neutral probabilities\"), the log-normal stock price under $\\mathbb{Q}$ (\"Geometric Brownian motion\") and put–call parity (\"Put–call parity\"). It also connects to \"Delta and hedging\", since the formula comes with an explicit delta."),

    h("Assumptions"),
    p("The Black–Scholes model makes the following assumptions. Each one is a simplification, and the last section returns to the ones that matter most."),
    list(
      "The stock follows geometric Brownian motion with constant volatility $\\sigma$ and pays no dividends.",
      "The risk-free rate $r$ is constant and continuously compounded; you can borrow and lend at $r$.",
      "Trading is continuous, there are no transaction costs or taxes, and short selling is allowed.",
      "There is no arbitrage.",
      "The option is European: it can be exercised only at maturity $T$.",
    ),
    p("Under these assumptions the option can be replicated by continuous delta hedging, so its price is the cost of replication. As in the tree lessons, that cost equals the discounted expected payoff under the risk-neutral measure $\\mathbb{Q}$."),

    h("The price as an expectation"),
    p("For a call with strike $K$ the payoff is $X = (S_T - K)^+$, so"),
    eq("C_0 = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}\\left[(S_T - K)^+\\right]."),
    p("Under $\\mathbb{Q}$ the stock is GBM with drift $r$. Writing $W_T^{\\mathbb{Q}} = \\sqrt{T}\\,Z$ with $Z \\sim N(0,1)$,"),
    eq("S_T = S_0 \\exp\\!\\left( \\left(r - \\tfrac{1}{2}\\sigma^2\\right)T + \\sigma\\sqrt{T}\\,Z \\right)."),

    h("The Black–Scholes differential equation"),
    p("This expectation can be reached another way, which is how Black and Scholes originally argued. Hold a portfolio that is long one option worth $V(S,t)$ and short $\\Delta$ shares. By Itô's lemma the option value changes by"),
    eq("dV = \\left( \\frac{\\partial V}{\\partial t} + \\tfrac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} \\right) dt + \\frac{\\partial V}{\\partial S}\\,dS."),
    p("Choosing $\\Delta = \\partial V/\\partial S$ cancels the random $dS$ term, so the hedged portfolio $\\Pi = V - \\Delta S$ is riskless and must earn the rate $r$. Setting its return equal to $r\\Pi$ gives the **Black–Scholes partial differential equation**:"),
    eq("\\frac{\\partial V}{\\partial t} + \\tfrac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0."),
    p("Every European option on the stock satisfies the same equation; only the terminal condition differs. For the call it is $V(S,T) = (S_T - K)^+$, and solving the PDE with that boundary condition gives exactly the formula derived below. The Feynman–Kac theorem makes the two routes equivalent: it rewrites the solution of this PDE as the discounted risk-neutral expectation."),

    h("Deriving the formula"),
    p("The computation takes three steps."),
    steps(
      "Find when the option is exercised. $S_T > K$ is equivalent to $Z > -d_2$, where $d_2 = \\dfrac{\\ln(S_0/K) + (r - \\frac{1}{2}\\sigma^2)T}{\\sigma\\sqrt{T}}$.",
      "Split the payoff: $(S_T - K)^+ = S_T\\,\\mathbf{1}_{\\{S_T > K\\}} - K\\,\\mathbf{1}_{\\{S_T > K\\}}$, where $\\mathbf{1}$ is 1 if the event happens and 0 otherwise.",
      "Take the expectation of each part separately and discount.",
    ),
    p("The second part is the easy one. Since $Z$ is standard normal and $N$ is symmetric,"),
    eq("\\mathbb{Q}(S_T > K) = \\mathbb{Q}(Z > -d_2) = N(d_2)."),
    p("For the first part, write $\\varphi$ for the standard normal density. Completing the square in the exponent gives $e^{\\sigma\\sqrt{T}z - \\frac{1}{2}\\sigma^2 T}\\,\\varphi(z) = \\varphi(z - \\sigma\\sqrt{T})$, so"),
    eq("\\mathbb{E}^{\\mathbb{Q}}\\left[S_T\\,\\mathbf{1}_{\\{S_T > K\\}}\\right] = S_0 e^{rT} \\int_{-d_2}^{\\infty} \\varphi(z - \\sigma\\sqrt{T})\\,dz = S_0 e^{rT}\\, N(d_2 + \\sigma\\sqrt{T})."),
    p("Define $d_1 = d_2 + \\sigma\\sqrt{T}$. Discounting both parts by $e^{-rT}$ gives the **Black–Scholes formula**:"),
    eq("C_0 = S_0\\,N(d_1) - K e^{-rT} N(d_2), \\qquad d_{1,2} = \\frac{\\ln(S_0/K) + \\left(r \\pm \\frac{1}{2}\\sigma^2\\right)T}{\\sigma\\sqrt{T}}."),
    p("The real drift $\\mu$ does not appear anywhere. Two investors who disagree about the expected return but agree on $\\sigma$ agree on the price."),

    h("Reading the two terms"),
    p("The formula has the shape \"stock received minus strike paid, each weighted by something\"."),
    list(
      "$N(d_2)$ is the $\\mathbb{Q}$-probability that the call is exercised, so $Ke^{-rT}N(d_2)$ is the present value of the expected strike payment.",
      "$S_0 N(d_1)$ is the present value of receiving the stock in the states where the call is exercised. It is larger than $S_0 N(d_2)$ because exercise happens exactly when $S_T$ is high.",
      "$N(d_1) = \\partial C_0/\\partial S_0$ is the call's **delta**: the replicating portfolio holds $N(d_1)$ shares and borrows $Ke^{-rT}N(d_2)$.",
    ),
    p("The last point is the continuous version of the tree result $C = \\Delta S + B$, with $\\Delta = N(d_1)$ and $B = -Ke^{-rT}N(d_2)$. Differentiating the formula also produces terms from $d_1$ and $d_2$ depending on $S_0$, but they cancel exactly."),
    note("$C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$, with $d_2 = d_1 - \\sigma\\sqrt{T}$. $N(d_2)$ is the risk-neutral exercise probability and $N(d_1)$ is the delta."),

    h("The put"),
    p("Put–call parity $C_0 - P_0 = S_0 - Ke^{-rT}$ holds in any arbitrage-free model, so it holds here. Solving for $P_0$ and using $1 - N(x) = N(-x)$:"),
    eq("P_0 = K e^{-rT} N(-d_2) - S_0\\,N(-d_1)."),
    p("The put's delta is $N(d_1) - 1 = -N(-d_1)$, between $-1$ and $0$."),

    h("A worked example"),
    p("Take $S_0 = 100$, $K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$. Then"),
    eq("d_1 = \\frac{\\ln 1 + (0.05 + 0.02)}{0.2} = 0.35, \\qquad d_2 = 0.35 - 0.2 = 0.15."),
    p("From normal tables $N(0.35) \\approx 0.6368$ and $N(0.15) \\approx 0.5596$. The discount factor is $e^{-0.05} \\approx 0.9512$. So $C_0 \\approx 100 \\cdot 0.6368 - 95.12 \\cdot 0.5596 \\approx 10.45$, and by parity $P_0 \\approx 10.45 - (100 - 95.12) \\approx 5.57$. The call has delta 0.637 and a 56% risk-neutral chance of being exercised."),

    h("How the price depends on the inputs"),
    list(
      "**Stock price** $S_0$: the call rises and the put falls; the slopes are the deltas.",
      "**Volatility** $\\sigma$: both prices rise. The holder gains from large moves on one side and loses at most the premium on the other.",
      "**Maturity** $T$: without dividends the call rises with $T$; more time means more spread in $S_T$ and a smaller present value of the strike.",
      "**Rate** $r$: the call rises and the put falls, because the strike is paid later and discounted more.",
    ),
    p("Two limits check the formula. As $\\sigma \\to 0$ the stock grows deterministically at $r$ and $C_0 \\to (S_0 - Ke^{-rT})^+$, the lower bound from \"Put–call parity\". As $T \\to 0$ the price tends to the payoff $(S_0 - K)^+$."),
    p("The figure plots the price against $S_0$ for $K = 100$, with the payoff at maturity dashed. Switch between call and put. Raise $\\sigma$ or $T$ and note that the curve lifts away from the payoff, most near the strike (a deep in-the-money put is the exception: its value can sit below the payoff); lower them and the curve collapses onto the payoff. The readouts at $S_0 = 100$ show the price, $d_1$, $d_2$, $N(d_1)$ and $N(d_2)$, so you can repeat the worked example."),
    figure("black-scholes-price"),

    h("Limitations of the model"),
    p("Market option prices can be turned back into a volatility: the **implied volatility** is the $\\sigma$ that makes the Black–Scholes formula match the observed price. If the model were exact, every option on the same stock would have the same implied volatility. In practice, implied volatility varies with strike (the **volatility smile** or skew, with low strikes usually more expensive) and with maturity."),
    p("The main causes are assumptions that fail: volatility is not constant but changes randomly and tends to rise when prices fall; prices sometimes jump; and returns have fatter tails than the normal distribution. Models such as Heston keep the risk-neutral pricing framework but let the volatility follow its own random process, which produces a smile. Black–Scholes remains the common language: prices are quoted as implied volatilities, and its delta is the starting point for hedging."),

    h("Summary"),
    list(
      "Under the Black–Scholes assumptions, $C_0 = e^{-rT}\\mathbb{E}^{\\mathbb{Q}}[(S_T - K)^+]$ with $S_T$ log-normal and drift $r$.",
      "The result is $C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$; the put follows from parity.",
      "$N(d_2)$ is the risk-neutral exercise probability, $N(d_1)$ the delta; the real drift $\\mu$ does not enter.",
      "Prices rise with $\\sigma$; the volatility smile shows that a single constant $\\sigma$ does not fit the market, which the Heston lab addresses.",
    ),
    lab("/black-scholes", "Explore prices and Greeks in the Black–Scholes lab"),
  ],

  hu: [
    p("Ez a lecke levezeti az európai vételi és eladási opció Black–Scholes-árát. Három korábbi eredményt rak össze: az árat mint diszkontált kockázatsemleges várható értéket („Kockázatsemleges valószínűségek”), a lognormális részvényárat $\\mathbb{Q}$ alatt („Geometriai Brown-mozgás”) és a put–call paritást („Put–call paritás”). Kapcsolódik a „Delta és fedezés” leckéhez is, mert a képlet explicit deltát ad."),

    h("Feltevések"),
    p("A Black–Scholes-modell az alábbi feltevésekkel él. Mindegyik egyszerűsítés; az utolsó szakasz visszatér a legfontosabbakhoz."),
    list(
      "A részvény állandó $\\sigma$ volatilitású geometriai Brown-mozgást követ, és nem fizet osztalékot.",
      "Az $r$ kockázatmentes kamatláb állandó és folytonos kamatozású; $r$-en lehet hitelt felvenni és betétet elhelyezni.",
      "A kereskedés folytonos, nincs tranzakciós költség és adó, a shortolás megengedett.",
      "Nincs arbitrázs.",
      "Az opció európai: csak a $T$ lejáratkor hívható le.",
    ),
    p("E feltevések mellett az opció folytonos delta-fedezéssel replikálható, így ára a replikáció költsége. Ahogy a fás leckékben, ez a költség a $\\mathbb{Q}$ kockázatsemleges mérték szerinti diszkontált várható kifizetés."),

    h("Az ár mint várható érték"),
    p("$K$ kötési árú vételi opcióra a kifizetés $X = (S_T - K)^+$, így"),
    eq("C_0 = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}\\left[(S_T - K)^+\\right]."),
    p("$\\mathbb{Q}$ alatt a részvény $r$ driftű GBM. A $W_T^{\\mathbb{Q}} = \\sqrt{T}\\,Z$ jelöléssel, ahol $Z \\sim N(0,1)$,"),
    eq("S_T = S_0 \\exp\\!\\left( \\left(r - \\tfrac{1}{2}\\sigma^2\\right)T + \\sigma\\sqrt{T}\\,Z \\right)."),

    h("A Black–Scholes-differenciálegyenlet"),
    p("Ez a várható érték másként is levezethető — eredetileg Black és Scholes így érvelt. Tartsunk egy portfóliót, amely egy $V(S,t)$ értékű opcióra hosszú, és $\\Delta$ részvényre rövid. Itô-lemma szerint az opció értékének változása"),
    eq("dV = \\left( \\frac{\\partial V}{\\partial t} + \\tfrac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} \\right) dt + \\frac{\\partial V}{\\partial S}\\,dS."),
    p("A $\\Delta = \\partial V/\\partial S$ választással kiesik a véletlen $dS$ tag, így a fedezett $\\Pi = V - \\Delta S$ portfólió kockázatmentes, ezért $r$ ütemben kell kamatoznia. Hozamát $r\\Pi$-vel egyenlővé téve adódik a **Black–Scholes parciális differenciálegyenlet**:"),
    eq("\\frac{\\partial V}{\\partial t} + \\tfrac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} + rS\\frac{\\partial V}{\\partial S} - rV = 0."),
    p("A részvényre szóló minden európai opció ugyanezt az egyenletet elégíti ki; csak a lejáratkori feltétel más. A call esetén ez $V(S,T) = (S_T - K)^+$, és az egyenletet ezzel a peremfeltétellel megoldva pontosan a lenti képletet kapjuk. A két út egyenértékűségét a Feynman–Kac-tétel biztosítja: a PDE megoldását diszkontált kockázatsemleges várható értékként írja fel."),

    h("A képlet levezetése"),
    p("A számolás három lépés."),
    steps(
      "Határozzuk meg, mikor hívják le az opciót: $S_T > K$ ekvivalens azzal, hogy $Z > -d_2$, ahol $d_2 = \\dfrac{\\ln(S_0/K) + (r - \\frac{1}{2}\\sigma^2)T}{\\sigma\\sqrt{T}}$.",
      "Bontsuk fel a kifizetést: $(S_T - K)^+ = S_T\\,\\mathbf{1}_{\\{S_T > K\\}} - K\\,\\mathbf{1}_{\\{S_T > K\\}}$, ahol $\\mathbf{1}$ értéke 1, ha az esemény bekövetkezik, különben 0.",
      "Vegyük külön-külön a két rész várható értékét, és diszkontáljunk.",
    ),
    p("A második rész a könnyebb. Mivel $Z$ standard normális és $N$ szimmetrikus,"),
    eq("\\mathbb{Q}(S_T > K) = \\mathbb{Q}(Z > -d_2) = N(d_2)."),
    p("Az első részhez jelölje $\\varphi$ a standard normális sűrűségfüggvényt. A kitevőben teljes négyzetté kiegészítve $e^{\\sigma\\sqrt{T}z - \\frac{1}{2}\\sigma^2 T}\\,\\varphi(z) = \\varphi(z - \\sigma\\sqrt{T})$, így"),
    eq("\\mathbb{E}^{\\mathbb{Q}}\\left[S_T\\,\\mathbf{1}_{\\{S_T > K\\}}\\right] = S_0 e^{rT} \\int_{-d_2}^{\\infty} \\varphi(z - \\sigma\\sqrt{T})\\,dz = S_0 e^{rT}\\, N(d_2 + \\sigma\\sqrt{T})."),
    p("Legyen $d_1 = d_2 + \\sigma\\sqrt{T}$. Mindkét részt $e^{-rT}$-vel diszkontálva kapjuk a **Black–Scholes-képletet**:"),
    eq("C_0 = S_0\\,N(d_1) - K e^{-rT} N(d_2), \\qquad d_{1,2} = \\frac{\\ln(S_0/K) + \\left(r \\pm \\frac{1}{2}\\sigma^2\\right)T}{\\sigma\\sqrt{T}}."),
    p("A valódi $\\mu$ drift sehol sem szerepel. Két befektető, akik a várható hozamban nem értenek egyet, de $\\sigma$-ban igen, ugyanazt az árat kapják."),

    h("A két tag jelentése"),
    p("A képlet szerkezete: „kapott részvény mínusz kifizetett kötési ár, mindkettő valamivel súlyozva”."),
    list(
      "$N(d_2)$ annak $\\mathbb{Q}$-valószínűsége, hogy az opciót lehívják, így $Ke^{-rT}N(d_2)$ a várható kötésiár-fizetés jelenértéke.",
      "$S_0 N(d_1)$ annak jelenértéke, hogy a lehívási állapotokban megkapjuk a részvényt. Nagyobb, mint $S_0 N(d_2)$, mert a lehívás éppen akkor történik, amikor $S_T$ magas.",
      "$N(d_1) = \\partial C_0/\\partial S_0$ a call **deltája**: a replikáló portfólió $N(d_1)$ részvényt tart, és $Ke^{-rT}N(d_2)$ hitelt vesz fel.",
    ),
    p("Az utolsó pont a fás $C = \\Delta S + B$ eredmény folytonos változata, $\\Delta = N(d_1)$ és $B = -Ke^{-rT}N(d_2)$ mellett. A képlet deriválásakor $d_1$ és $d_2$ $S_0$-függéséből további tagok is keletkeznek, de ezek pontosan kiejtik egymást."),
    note("$C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$, ahol $d_2 = d_1 - \\sigma\\sqrt{T}$. $N(d_2)$ a kockázatsemleges lehívási valószínűség, $N(d_1)$ a delta."),

    h("Az eladási opció"),
    p("A $C_0 - P_0 = S_0 - Ke^{-rT}$ put–call paritás minden arbitrázsmentes modellben teljesül, így itt is. $P_0$-ra megoldva és $1 - N(x) = N(-x)$-et használva:"),
    eq("P_0 = K e^{-rT} N(-d_2) - S_0\\,N(-d_1)."),
    p("A put deltája $N(d_1) - 1 = -N(-d_1)$, $-1$ és $0$ közé esik."),

    h("Számpélda"),
    p("Legyen $S_0 = 100$, $K = 100$, $r = 5\\%$, $\\sigma = 20\\%$, $T = 1$. Ekkor"),
    eq("d_1 = \\frac{\\ln 1 + (0{,}05 + 0{,}02)}{0{,}2} = 0{,}35, \\qquad d_2 = 0{,}35 - 0{,}2 = 0{,}15."),
    p("Normális táblázatból $N(0{,}35) \\approx 0{,}6368$ és $N(0{,}15) \\approx 0{,}5596$. A diszkontfaktor $e^{-0{,}05} \\approx 0{,}9512$. Így $C_0 \\approx 100 \\cdot 0{,}6368 - 95{,}12 \\cdot 0{,}5596 \\approx 10{,}45$, a paritásból pedig $P_0 \\approx 10{,}45 - (100 - 95{,}12) \\approx 5{,}57$. A call deltája 0,637, és 56% a kockázatsemleges esélye a lehívásnak."),

    h("Az ár függése a bemenetektől"),
    list(
      "**Részvényár** ($S_0$): a call drágul, a put olcsóbb lesz; a meredekségek a delták.",
      "**Volatilitás** ($\\sigma$): mindkét ár nő. A tulajdonos az egyik oldalon nyer a nagy mozgásokon, a másikon legfeljebb az opciós díjat veszíti el.",
      "**Lejárat** ($T$): osztalék nélkül a call ára $T$-vel nő; több idő nagyobb szóródást ad $S_T$-ben, és kisebb a kötési ár jelenértéke.",
      "**Kamatláb** ($r$): a call drágul, a put olcsóbb lesz, mert a kötési árat később fizetjük, és jobban diszkontáljuk.",
    ),
    p("Két határeset ellenőrzi a képletet. Ha $\\sigma \\to 0$, a részvény determinisztikusan $r$ ütemben nő, és $C_0 \\to (S_0 - Ke^{-rT})^+$, ami a „Put–call paritás” lecke alsó korlátja. Ha $T \\to 0$, az ár a $(S_0 - K)^+$ kifizetéshez tart."),
    p("Az ábra az árat mutatja $S_0$ függvényében $K = 100$ mellett, szaggatottan a lejáratkori kifizetéssel. Válts a call és a put között. Növeld $\\sigma$-t vagy $T$-t: a görbe elemelkedik a kifizetéstől, leginkább a kötési ár körül (kivétel a mélyen pénzben lévő put, amelynek értéke a kifizetés alá is kerülhet); csökkentsd őket, és a görbe rásimul a kifizetésre. Az $S_0 = 100$-nál mutatott értékek (ár, $d_1$, $d_2$, $N(d_1)$, $N(d_2)$) alapján a számpélda megismételhető."),
    figure("black-scholes-price"),

    h("A modell korlátai"),
    p("A piaci opcióárakból visszaszámolható egy volatilitás: az **implikált volatilitás** az a $\\sigma$, amellyel a Black–Scholes-képlet a megfigyelt árat adja. Ha a modell pontos lenne, ugyanarra a részvényre szóló minden opció implikált volatilitása azonos volna. A valóságban az implikált volatilitás függ a kötési ártól (ez a **volatilitásmosoly** vagy ferdeség; az alacsony kötési árú opciók rendszerint drágábbak) és a lejárattól."),
    p("A fő ok, hogy egyes feltevések nem teljesülnek: a volatilitás nem állandó, hanem véletlenszerűen változik, és esésnél jellemzően megugrik; az árak néha ugranak; a hozamok eloszlásának vastagabb a farka a normálisnál. A Heston-modellhez hasonló modellek megtartják a kockázatsemleges árazás keretét, de a volatilitásnak saját véletlen folyamatot adnak, és ebből mosoly adódik. A Black–Scholes-modell ennek ellenére közös nyelv maradt: az árakat implikált volatilitásban jegyzik, deltája pedig a fedezés kiindulópontja."),

    h("Összefoglalás"),
    list(
      "A Black–Scholes-feltevések mellett $C_0 = e^{-rT}\\mathbb{E}^{\\mathbb{Q}}[(S_T - K)^+]$, ahol $S_T$ lognormális, $r$ drifttel.",
      "Az eredmény $C_0 = S_0N(d_1) - Ke^{-rT}N(d_2)$; a put ára a paritásból adódik.",
      "$N(d_2)$ a kockázatsemleges lehívási valószínűség, $N(d_1)$ a delta; a valódi $\\mu$ drift nem szerepel.",
      "Az árak $\\sigma$-val nőnek; a volatilitásmosoly mutatja, hogy egyetlen állandó $\\sigma$ nem illeszkedik a piachoz, ezzel foglalkozik a Heston-labor.",
    ),
    lab("/black-scholes", "Vizsgáld az árakat és a görög betűket a Black–Scholes laborban"),
  ],
};
