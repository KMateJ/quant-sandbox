import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p, steps } from "./blocks";

export const multiStepTrees: GuideLessonContent = {
  en: [
    p("A single up-or-down move is too crude to describe a stock over months. This lesson chains many one-step models into a tree and prices an option by applying the formula from \"Risk-neutral probabilities\" at every node, starting at maturity and working back to today. It also uses the $\\sqrt{\\Delta t}$ scaling from \"Random walks and Brownian motion\" and continuous discounting from \"Interest, compounding and discounting\"."),

    h("Splitting the time to maturity"),
    p("Divide the time to maturity $T$ into $n$ equal steps of length"),
    eq("\\Delta t = \\frac{T}{n}."),
    p("In each step the stock is multiplied by $u$ or by $d$, independently of earlier steps. The risk-free bond now grows continuously, so over one step it is multiplied by $e^{r\\Delta t}$ rather than by $(1+r)$. Each step is a copy of the one-step model with the growth factor $1+r$ replaced by $e^{r\\Delta t}$, so the no-arbitrage condition becomes $d < e^{r\\Delta t} < u$, and the risk-neutral probability of an up move is"),
    eq("q = \\frac{e^{r\\Delta t} - d}{u - d}."),
    p("The assumptions are the same as before: no dividends, fractional trading, no transaction costs, borrowing and lending at $r$."),

    h("The recombining tree"),
    p("An up move followed by a down move gives $S_0ud$, and a down move followed by an up move gives $S_0du$, the same number. Paths that contain the same number of up moves end at the same node. Such a tree is called **recombining**. After $i$ steps there are only $i+1$ distinct prices,"),
    eq("S_{i,j} = S_0\\,u^{j}\\,d^{\\,i-j}, \\qquad j = 0, 1, \\dots, i,"),
    p("where $j$ counts the up moves. The whole tree has $(n+1)(n+2)/2$ nodes, while the number of paths is $2^n$. For $n = 100$ that is 5151 nodes instead of about $1.3 \\cdot 10^{30}$ paths, which is what makes trees practical."),

    h("Choosing $u$ and $d$"),
    p("The factors $u$ and $d$ should make the tree's stock behave like a stock with annual volatility $\\sigma$. The Cox–Ross–Rubinstein (CRR) choice is"),
    eq("u = e^{\\sigma\\sqrt{\\Delta t}}, \\qquad d = \\frac{1}{u} = e^{-\\sigma\\sqrt{\\Delta t}}."),
    p("Each step changes the log price by $\\pm\\sigma\\sqrt{\\Delta t}$. This is the scaled coin-flip walk from \"Random walks and Brownian motion\": over $n$ steps the variance of the log price change is close to $n\\,\\sigma^2\\Delta t = \\sigma^2 T$, which matches the square-root-of-time rule. Because $d = 1/u$, an up move and a down move cancel, so the tree is centred on $S_0$ in log terms."),

    h("Backward induction"),
    p("At maturity the option value at each node is its payoff. For a call, $C_{n,j} = (S_{n,j} - K)^+$. One step earlier, each node together with its two successors is a one-step model, so its value is the discounted risk-neutral average of the two successor values:"),
    eq("C_{i,j} = e^{-r\\Delta t}\\big[q\\,C_{i+1,j+1} + (1-q)\\,C_{i+1,j}\\big]."),
    p("Repeating this step by step back to the root gives the price $C_0 = C_{0,0}$. At each node the replicating portfolio of \"The one-step binomial model\" still exists, with $\\Delta_{i,j} = (C_{i+1,j+1} - C_{i+1,j})/(S_{i+1,j+1} - S_{i+1,j})$, so the price is the cost of a strategy that is rebalanced at every step."),
    note("**Backward induction.** Set the values at maturity equal to the payoff, then move back one step at a time, replacing each node by $e^{-r\\Delta t}$ times the $q$-weighted average of its two successors. The value at the root is the arbitrage-free price."),

    h("Worked example"),
    p("Let $S_0 = 100$, $K = 100$, $T = 1$, $\\sigma = 20\\%$, $r = 5\\%$ and $n = 2$, so $\\Delta t = 0.5$."),
    steps(
      "Factors: $u = e^{0.2\\sqrt{0.5}} \\approx 1.1519$, $d = 1/u \\approx 0.8681$, $e^{r\\Delta t} = e^{0.025} \\approx 1.0253$.",
      "Risk-neutral probability: $q = \\dfrac{1.0253 - 0.8681}{1.1519 - 0.8681} \\approx 0.5539$.",
      "Prices at maturity: $S_{2,2} = 100u^2 \\approx 132.69$, $S_{2,1} = 100$, $S_{2,0} = 100d^2 \\approx 75.36$.",
      "Payoffs: $C_{2,2} \\approx 32.69$, $C_{2,1} = 0$, $C_{2,0} = 0$.",
      "Step 1: $C_{1,1} = \\dfrac{0.5539\\cdot 32.69 + 0.4461\\cdot 0}{1.0253} \\approx 17.66$, and $C_{1,0} = 0$ because both its successors are worth zero.",
      "Root: $C_0 = \\dfrac{0.5539\\cdot 17.66}{1.0253} \\approx 9.54$.",
    ),
    p("The Black–Scholes price for the same inputs, derived in a later lesson, is about 10.45. Two steps give a rough answer; more steps get closer."),

    h("The distribution of the terminal price"),
    p("Under $\\mathbb{Q}$ each step is an independent up move with probability $q$, so the number of up moves $j$ by maturity has a binomial distribution. The probability of ending at node $j$ is the number of paths to it times the probability of each path:"),
    eq("\\mathbb{Q}(S_T = S_0u^jd^{\\,n-j}) = \\binom{n}{j}\\,q^j(1-q)^{n-j}."),
    p("Backward induction for a European option therefore gives the same result as a single discounted expectation over the terminal nodes:"),
    eq("C_0 = e^{-rT}\\sum_{j=0}^{n}\\binom{n}{j}\\,q^j(1-q)^{n-j}\\,\\big(S_0u^jd^{\\,n-j} - K\\big)^+."),
    p("As $n$ grows, the binomial distribution of $j$ approaches a normal distribution, so $\\ln S_T$ becomes normally distributed. This is the log-normal model behind Black–Scholes."),

    h("Convergence to the Black–Scholes price"),
    p("The figure plots the CRR call price against the number of steps $n$ from 1 to 150, with $S_0 = 100$, $r = 5\\%$ and $T = 1$, and the Black–Scholes price as a horizontal line. With $K = 100$ and $\\sigma = 20\\%$ the tree gives 12.16 for $n = 1$, 9.54 for $n = 2$, 10.25 for $n = 10$ and 10.43 for $n = 100$, against 10.45. The approach is not smooth: the price zigzags between even and odd $n$, because the terminal nodes shift relative to the strike as $n$ changes, and the payoff has a kink at $K$. Move $K$ and $\\sigma$ and note that the size of the zigzag changes, while the curve always settles on the reference line."),
    figure("tree-convergence"),

    h("American options"),
    p("An American option can be exercised at any node. Backward induction handles this with one change: at each node take the larger of the exercise value and the continuation value given by the formula above. For a call on a stock without dividends early exercise is never optimal, so its price equals the European one. For an American put it can be optimal, and the tree is the standard way to price it."),

    h("Summary"),
    list(
      "A multi-step tree splits $T$ into $n$ steps of length $\\Delta t = T/n$; the bond grows by $e^{r\\Delta t}$ per step and $q = (e^{r\\Delta t} - d)/(u-d)$.",
      "The CRR choice $u = e^{\\sigma\\sqrt{\\Delta t}}$, $d = 1/u$ gives a recombining tree whose log-price variance over $T$ is about $\\sigma^2 T$.",
      "Backward induction applies the one-step pricing formula at every node, from maturity back to today.",
      "The number of up moves is binomially distributed under $\\mathbb{Q}$, and the tree price converges, with oscillation, to the Black–Scholes price as $n$ grows.",
    ),
    lab("/binomial", "Build multi-step trees and watch convergence in the Binomial lab"),
  ],

  hu: [
    p("Egyetlen felfelé vagy lefelé lépés túl durva ahhoz, hogy hónapokon át leírja egy részvény mozgását. Ez a lecke sok egylépéses modellt fűz fává, és egy opciót úgy áraz, hogy a „Kockázatsemleges valószínűségek” lecke képletét minden csomópontban alkalmazza, a lejárattól visszafelé haladva a mai napig. Felhasználja a „Véletlen bolyongás és Brown-mozgás” lecke $\\sqrt{\\Delta t}$-s skálázását és a „Kamat, kamatozás és diszkontálás” lecke folytonos diszkontálását is."),

    h("A futamidő felosztása"),
    p("Osszuk fel a $T$ futamidőt $n$ egyenlő lépésre, amelyek hossza"),
    eq("\\Delta t = \\frac{T}{n}."),
    p("Minden lépésben a részvény árát $u$-val vagy $d$-vel szorozzuk, a korábbi lépésektől függetlenül. A kockázatmentes kötvény most folytonosan kamatozik, így egy lépés alatt $e^{r\\Delta t}$-szeresére nő, nem $(1+r)$-szeresére. Minden lépés az egylépéses modell egy példánya, amelyben az $1+r$ szorzó helyén $e^{r\\Delta t}$ áll, ezért az arbitrázsmentességi feltétel $d < e^{r\\Delta t} < u$, a felfelé lépés kockázatsemleges valószínűsége pedig"),
    eq("q = \\frac{e^{r\\Delta t} - d}{u - d}."),
    p("A feltevések a korábbiak: nincs osztalék, tört mennyiség is kereskedhető, nincs tranzakciós költség, és $r$ kamaton lehet hitelt felvenni és betétet elhelyezni."),

    h("A rekombináló fa"),
    p("Egy felfelé, majd egy lefelé lépés $S_0ud$-t ad, egy lefelé, majd egy felfelé lépés $S_0du$-t, ami ugyanaz a szám. Az ugyanannyi felfelé lépést tartalmazó utak ugyanabban a csomópontban végződnek. Az ilyen fát **rekombináló** fának nevezzük. $i$ lépés után csak $i+1$ különböző ár van,"),
    eq("S_{i,j} = S_0\\,u^{j}\\,d^{\\,i-j}, \\qquad j = 0, 1, \\dots, i,"),
    p("ahol $j$ a felfelé lépések száma. A teljes fának $(n+1)(n+2)/2$ csomópontja van, míg az utak száma $2^n$. $n = 100$ esetén ez 5151 csomópont a nagyjából $1{,}3 \\cdot 10^{30}$ út helyett; ettől használható a gyakorlatban a fa."),

    h("Az $u$ és $d$ megválasztása"),
    p("Az $u$ és $d$ szorzókat úgy kell megválasztani, hogy a fában mozgó részvény úgy viselkedjen, mint egy $\\sigma$ éves volatilitású részvény. A Cox–Ross–Rubinstein (CRR) választás"),
    eq("u = e^{\\sigma\\sqrt{\\Delta t}}, \\qquad d = \\frac{1}{u} = e^{-\\sigma\\sqrt{\\Delta t}}."),
    p("Minden lépés $\\pm\\sigma\\sqrt{\\Delta t}$-vel változtatja a logaritmikus árat. Ez a „Véletlen bolyongás és Brown-mozgás” lecke skálázott pénzfeldobásos bolyongása: $n$ lépés alatt a logaritmikus árváltozás varianciája közel $n\\,\\sigma^2\\Delta t = \\sigma^2 T$, ami megfelel a négyzetgyökös időszabálynak. Mivel $d = 1/u$, egy felfelé és egy lefelé lépés kioltja egymást, így a fa logaritmikus skálán $S_0$ körül szimmetrikus."),

    h("Visszafelé indukció"),
    p("Lejáratkor az opció értéke minden csomópontban a kifizetése; callnál $C_{n,j} = (S_{n,j} - K)^+$. Egy lépéssel korábban minden csomópont a két utódjával együtt egy egylépéses modell, így értéke a két utódérték diszkontált kockázatsemleges átlaga:"),
    eq("C_{i,j} = e^{-r\\Delta t}\\big[q\\,C_{i+1,j+1} + (1-q)\\,C_{i+1,j}\\big]."),
    p("Ezt lépésenként a gyökérig ismételve kapjuk a $C_0 = C_{0,0}$ árat. Minden csomópontban létezik „Az egylépéses binomiális modell” lecke replikáló portfóliója, $\\Delta_{i,j} = (C_{i+1,j+1} - C_{i+1,j})/(S_{i+1,j+1} - S_{i+1,j})$ részvénnyel, így az ár egy lépésenként újrasúlyozott stratégia költsége."),
    note("**Visszafelé indukció.** Lejáratkor az értékek a kifizetéssel egyeznek; ezután lépésenként visszafelé haladva minden csomópont értéke a két utód $q$-val súlyozott átlagának $e^{-r\\Delta t}$-szerese. A gyökérben kapott érték az arbitrázsmentes ár."),

    h("Kidolgozott példa"),
    p("Legyen $S_0 = 100$, $K = 100$, $T = 1$, $\\sigma = 20\\%$, $r = 5\\%$ és $n = 2$, tehát $\\Delta t = 0{,}5$."),
    steps(
      "Szorzók: $u = e^{0{,}2\\sqrt{0{,}5}} \\approx 1{,}1519$, $d = 1/u \\approx 0{,}8681$, $e^{r\\Delta t} = e^{0{,}025} \\approx 1{,}0253$.",
      "Kockázatsemleges valószínűség: $q = \\dfrac{1{,}0253 - 0{,}8681}{1{,}1519 - 0{,}8681} \\approx 0{,}5539$.",
      "Árak lejáratkor: $S_{2,2} = 100u^2 \\approx 132{,}69$, $S_{2,1} = 100$, $S_{2,0} = 100d^2 \\approx 75{,}36$.",
      "Kifizetések: $C_{2,2} \\approx 32{,}69$, $C_{2,1} = 0$, $C_{2,0} = 0$.",
      "1. lépés: $C_{1,1} = \\dfrac{0{,}5539\\cdot 32{,}69 + 0{,}4461\\cdot 0}{1{,}0253} \\approx 17{,}66$, és $C_{1,0} = 0$, mert mindkét utódja nulla értékű.",
      "Gyökér: $C_0 = \\dfrac{0{,}5539\\cdot 17{,}66}{1{,}0253} \\approx 9{,}54$.",
    ),
    p("Ugyanezekkel a bemenetekkel a Black–Scholes-ár, amelyet egy későbbi lecke vezet le, körülbelül 10,45. Két lépés durva közelítést ad; több lépéssel közelebb kerülünk."),

    h("A lejárati ár eloszlása"),
    p("$\\mathbb{Q}$ alatt minden lépés egymástól függetlenül $q$ valószínűséggel felfelé lépés, így a lejáratig megtett felfelé lépések $j$ száma binomiális eloszlású. A $j$ csomópontba érkezés valószínűsége az odavezető utak száma szorozva egy út valószínűségével:"),
    eq("\\mathbb{Q}(S_T = S_0u^jd^{\\,n-j}) = \\binom{n}{j}\\,q^j(1-q)^{n-j}."),
    p("Európai opciónál a visszafelé indukció ezért ugyanazt adja, mint egyetlen diszkontált várható érték a lejárati csomópontokon:"),
    eq("C_0 = e^{-rT}\\sum_{j=0}^{n}\\binom{n}{j}\\,q^j(1-q)^{n-j}\\,\\big(S_0u^jd^{\\,n-j} - K\\big)^+."),
    p("Ahogy $n$ nő, $j$ binomiális eloszlása normális eloszláshoz tart, így $\\ln S_T$ normális eloszlásúvá válik. Ez a Black–Scholes mögötti lognormális modell."),

    h("Konvergencia a Black–Scholes-árhoz"),
    p("Az ábra a CRR call árát mutatja a lépésszám függvényében ($n = 1$-től 150-ig), $S_0 = 100$, $r = 5\\%$ és $T = 1$ mellett, a Black–Scholes-árat pedig vízszintes egyenesként. $K = 100$ és $\\sigma = 20\\%$ esetén a fa $n = 1$-re 12,16-ot, $n = 2$-re 9,54-et, $n = 10$-re 10,25-öt, $n = 100$-ra 10,43-at ad, szemben a 10,45-tel. A közeledés nem sima: az ár cikcakkban ugrál páros és páratlan $n$ között, mert $n$ változásával a lejárati csomópontok elcsúsznak a kötési árhoz képest, a kifizetésnek pedig $K$-nál töréspontja van. Mozgasd $K$-t és $\\sigma$-t, és figyeld meg, hogy a cikcakk mérete változik, a görbe viszont mindig a referenciavonalra áll be."),
    figure("tree-convergence"),

    h("Amerikai opciók"),
    p("Az amerikai opció bármelyik csomópontban lehívható. A visszafelé indukció ezt egyetlen módosítással kezeli: minden csomópontban a lehívási érték és a fenti képlet szerinti továbbtartási érték közül a nagyobbat vesszük. Osztalékot nem fizető részvényre szóló callnál a korai lehívás sosem optimális, így az ára megegyezik az európaiéval. Amerikai putnál viszont lehet optimális, és árazására a fa a szokásos eszköz."),

    h("Összefoglalás"),
    list(
      "A többlépéses fa $T$-t $n$ darab $\\Delta t = T/n$ hosszú lépésre bontja; a kötvény lépésenként $e^{r\\Delta t}$-szeresére nő, és $q = (e^{r\\Delta t} - d)/(u-d)$.",
      "A CRR-választás, $u = e^{\\sigma\\sqrt{\\Delta t}}$, $d = 1/u$, rekombináló fát ad, amelynek logaritmikus árvarianciája $T$ alatt körülbelül $\\sigma^2 T$.",
      "A visszafelé indukció minden csomópontban az egylépéses árazási képletet alkalmazza, a lejárattól a mai napig.",
      "A felfelé lépések száma $\\mathbb{Q}$ alatt binomiális eloszlású, és a fa ára $n$ növelésével oszcillálva a Black–Scholes-árhoz tart.",
    ),
    lab("/binomial", "Építs többlépéses fákat, és kövesd a konvergenciát a Binomiális laborban"),
  ],
};
