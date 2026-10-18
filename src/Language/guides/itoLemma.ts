import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const itoLemma: GuideLessonContent = {
  en: [
    p("The lesson \"Random walks and Brownian motion\" showed that Brownian paths have no slope anywhere, so ordinary calculus does not apply to them directly. This lesson develops the replacement, **Itô's lemma**, the chain rule for functions of a random process. Its key ingredient is a surprising fact about squared increments of Brownian motion."),

    h("Increments in continuous time"),
    p("Write $dW_t$ for the increment of a Brownian motion over a short interval $dt$. From the definition of Brownian motion it is normal with mean zero and variance $dt$:"),
    eq("dW_t \\sim N(0,\\ dt), \\qquad \\mathbb{E}[dW_t] = 0, \\qquad \\mathbb{E}\\big[(dW_t)^2\\big] = dt."),
    p("A process driven by Brownian motion is described by its increment too. The general **Itô process** has a drift $a$ and a volatility $b$, which may depend on time and on the current value:"),
    eq("dX_t = a(t, X_t)\\,dt + b(t, X_t)\\,dW_t."),
    p("Read it as a recipe for one small step: a deterministic move $a\\,dt$ plus a random move $b\\,dW_t$ whose typical size is $b\\sqrt{dt}$. For small $dt$ the random part is much larger than the drift part, since $\\sqrt{dt}$ is much larger than $dt$."),

    h("Quadratic variation"),
    p("In ordinary calculus, squares of small increments are negligible: if $dx$ is small, $(dx)^2$ is much smaller and disappears in the limit. For Brownian motion this fails. Split $[0, T]$ into $n$ steps of length $\\Delta t = T/n$ and add up the squared increments:"),
    eq("Q_n = \\sum_{i=1}^{n} \\big(W_{t_i} - W_{t_{i-1}}\\big)^2."),
    p("Each squared increment has mean $\\Delta t$, so $\\mathbb{E}[Q_n] = n\\,\\Delta t = T$ for every $n$. Each one also has variance $2\\,\\Delta t^2$ (a property of the normal distribution), and the increments are independent, so"),
    eq("\\operatorname{Var}(Q_n) = n \\cdot 2\\,\\Delta t^2 = \\frac{2T^2}{n} \\longrightarrow 0 \\quad \\text{as } n \\to \\infty."),
    p("The sum keeps its mean $T$ while its randomness disappears: in the limit it equals $T$ exactly. This limit is the **quadratic variation** of Brownian motion. Example: on $[0,1]$ the standard deviation of $Q_n$ is $\\sqrt{2/n}$, which is $0.447$ for $n = 10$, $0.141$ for $n = 100$ and $0.0447$ for $n = 1000$."),
    p("For a smooth path the same sum goes to zero, because each squared increment is of order $\\Delta t^2$. Brownian motion is rough enough that its squared increments add up to something finite."),
    p("The sum of the absolute increments behaves very differently. Each $|\\Delta W|$ has mean $\\sqrt{2\\Delta t/\\pi}$, so on $[0,1]$ the **total variation** $\\sum |\\Delta W|$ has mean $n\\sqrt{2/(\\pi n)} = \\sqrt{2n/\\pi}$: about $2.52$ for $n = 10$, $7.98$ for $n = 100$ and $25.23$ for $n = 1000$. It grows without bound. The length travelled by a Brownian path is infinite, yet the sum of its squared steps settles down to elapsed time."),
    p("The figure draws four Brownian paths on $[0,1]$ built from $n$ normal increments $\\Delta W \\sim N(0, 1/n)$ and plots the running sum $\\sum (\\Delta W)^2$ of each against $t$, together with the line $t$. Switch between $n = 10$, $100$ and $1000$ and press \"New paths\" a few times. The running sums hug the line more tightly as $n$ grows. The readouts, computed over 2000 paths at $t = 1$, show the mean of $\\sum (\\Delta W)^2$ staying near 1, its standard deviation shrinking like $\\sqrt{2/n}$, and the mean of $\\sum |\\Delta W|$ growing like $\\sqrt{2n/\\pi}$."),
    figure("quadratic-variation"),
    p("The result is written as a set of multiplication rules for small increments:"),
    eq("(dW_t)^2 = dt, \\qquad dt\\,dW_t = 0, \\qquad (dt)^2 = 0."),
    note("Quadratic variation: the squared increments of Brownian motion over $[0,T]$ add up to $T$. In shorthand, $(dW_t)^2 = dt$."),

    h("Itô's lemma"),
    p("Let $f(t, x)$ be a smooth function and $X_t$ an Itô process as above. We want the increment of $Y_t = f(t, X_t)$. Expand $f$ to second order in a Taylor series:"),
    eq("df = \\frac{\\partial f}{\\partial t}\\,dt + \\frac{\\partial f}{\\partial x}\\,dX_t + \\frac{1}{2}\\frac{\\partial^2 f}{\\partial x^2}\\,(dX_t)^2 + \\cdots"),
    p("In ordinary calculus the third term would be dropped. Here it must be kept. Square $dX_t = a\\,dt + b\\,dW_t$ using the multiplication rules: the $(dt)^2$ and $dt\\,dW_t$ terms vanish and only $b^2 (dW_t)^2 = b^2\\,dt$ survives:"),
    eq("(dX_t)^2 = b^2\\,dt."),
    p("Higher-order terms are of order $dt^{3/2}$ or smaller and vanish. Substituting gives **Itô's lemma**:"),
    eq("df(t, X_t) = \\left( \\frac{\\partial f}{\\partial t} + a\\,\\frac{\\partial f}{\\partial x} + \\frac{1}{2}\\,b^2\\,\\frac{\\partial^2 f}{\\partial x^2} \\right) dt + b\\,\\frac{\\partial f}{\\partial x}\\,dW_t."),
    p("Compared with the ordinary chain rule there is one extra drift term, $\\tfrac12 b^2 f''$. It is the price of the roughness of Brownian paths: the curvature of $f$ turns the random fluctuations of $X$ into a systematic drift of $f(X)$."),

    h("The square of Brownian motion"),
    p("Take $X_t = W_t$ (so $a = 0$, $b = 1$) and $f(x) = x^2$, with $f' = 2x$ and $f'' = 2$. Itô's lemma gives"),
    eq("d\\big(W_t^2\\big) = dt + 2W_t\\,dW_t."),
    p("Ordinary calculus would give only $2W_t\\,dW_t$. The random term has mean zero, so taking expectations of the accumulated increments leaves $\\mathbb{E}[W_t^2] = t$, which agrees with $\\operatorname{Var}(W_t) = t$. Without the extra $dt$ the expectation would wrongly stay at zero."),

    h("The logarithm of a stock price"),
    p("The model of \"Geometric Brownian motion\" is $dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t$, an Itô process with $a = \\mu S$ and $b = \\sigma S$. Apply Itô's lemma to $f(S) = \\ln S$, with $f' = 1/S$ and $f'' = -1/S^2$:"),
    eq("d\\ln S_t = \\left( \\mu S \\cdot \\frac{1}{S} + \\frac{1}{2}\\,\\sigma^2 S^2 \\cdot \\left(-\\frac{1}{S^2}\\right) \\right) dt + \\sigma S \\cdot \\frac{1}{S}\\,dW_t = \\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right) dt + \\sigma\\,dW_t."),
    p("The right-hand side has constant coefficients, so it can be added up over $[0, T]$ directly:"),
    eq("\\ln S_T = \\ln S_0 + \\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right) T + \\sigma W_T."),
    p("This is the solution quoted in \"Geometric Brownian motion\", and the $-\\tfrac12\\sigma^2$ correction is exactly Itô's extra term. Naive calculus would have predicted a log drift of $\\mu$."),
    p("Example: $S_0 = 100$, $\\mu = 8\\%$, $\\sigma = 20\\%$. The log price drifts at $0.08 - \\tfrac12 \\cdot 0.2^2 = 0.06$ per year, not $0.08$. Over $T = 10$ years the centre of the log price is $\\ln 100 + 0.6$, which corresponds to a median price of $100\\,e^{0.6} \\approx 182.21$. The naive line $\\ln 100 + 0.8$ would point to $100\\,e^{0.8} \\approx 222.55$, which is the **mean** price, not where a typical path ends."),

    h("Size of the correction"),
    p("Take one day, $\\Delta t = 1/252$, with $\\sigma = 20\\%$. The random part of the return, $\\sigma\\,\\Delta W$, is typically about $0.2 \\times \\sqrt{1/252} \\approx 1.26\\%$. Its square is about $\\sigma^2 \\Delta t \\approx 0.016\\%$, the same order of magnitude as the daily drift $\\mu\\,\\Delta t \\approx 0.032\\%$. Adding up such squares day after day does not average out, because they are never negative. That is why the second-order term changes the drift and cannot be ignored."),

    h("Summary"),
    list(
      "An Itô process moves by $dX = a\\,dt + b\\,dW$: a drift step plus a random step of size about $b\\sqrt{dt}$.",
      "Squared Brownian increments add up to elapsed time: $(dW)^2 = dt$, while $dt\\,dW$ and $(dt)^2$ vanish.",
      "Itô's lemma: $df = (f_t + a f_x + \\tfrac12 b^2 f_{xx})\\,dt + b f_x\\,dW$. The term $\\tfrac12 b^2 f_{xx}$ is new compared with ordinary calculus.",
      "Applied to $\\ln S$ under GBM it gives $d\\ln S = (\\mu - \\tfrac12\\sigma^2)\\,dt + \\sigma\\,dW$.",
    ),
    note("The next lesson, \"Change of measure and Girsanov's theorem\", shows how the drift $\\mu$ in this solution is replaced by $r$ for pricing; \"Monte Carlo option pricing\" then uses the resulting formula to draw terminal stock prices and estimate option prices by averaging."),
    lab("/ito-process", "Compare the corrected and naive drift of the log price in the Itô Process lab"),
  ],

  hu: [
    p("A „Véletlen bolyongás és Brown-mozgás” című lecke megmutatta, hogy a Brown-pályáknak sehol sincs meredekségük, ezért a szokásos analízis közvetlenül nem alkalmazható rájuk. Ez a lecke a helyettesítőjét mutatja be, az **Itô-lemmát**, vagyis a véletlen folyamatok függvényeire vonatkozó láncszabályt. Kulcsa egy meglepő tény a Brown-mozgás növekményeinek négyzetéről."),

    h("Növekmények folytonos időben"),
    p("Jelölje $dW_t$ egy Brown-mozgás (Wiener-folyamat) növekményét egy rövid $dt$ időszak alatt. A Brown-mozgás definíciója szerint ez normális eloszlású, várható értéke nulla, varianciája $dt$:"),
    eq("dW_t \\sim N(0,\\ dt), \\qquad \\mathbb{E}[dW_t] = 0, \\qquad \\mathbb{E}\\big[(dW_t)^2\\big] = dt."),
    p("A Brown-mozgás hajtotta folyamatokat szintén a növekményükkel írjuk le. Az általános **Itô-folyamatnak** van egy $a$ driftje és egy $b$ volatilitása, amelyek függhetnek az időtől és a pillanatnyi értéktől:"),
    eq("dX_t = a(t, X_t)\\,dt + b(t, X_t)\\,dW_t."),
    p("Olvassuk egyetlen kis lépés receptjeként: egy determinisztikus $a\\,dt$ elmozdulás, plusz egy véletlen $b\\,dW_t$ elmozdulás, amelynek jellemző mérete $b\\sqrt{dt}$. Kis $dt$ esetén a véletlen rész sokkal nagyobb a drift résznél, hiszen $\\sqrt{dt}$ sokkal nagyobb $dt$-nél."),

    h("Kvadratikus variáció"),
    p("A szokásos analízisben a kis növekmények négyzete elhanyagolható: ha $dx$ kicsi, $(dx)^2$ még sokkal kisebb, és a határátmenetben eltűnik. A Brown-mozgásnál ez nem így van. Osszuk fel a $[0, T]$ intervallumot $n$ darab $\\Delta t = T/n$ hosszú lépésre, és adjuk össze a növekmények négyzetét:"),
    eq("Q_n = \\sum_{i=1}^{n} \\big(W_{t_i} - W_{t_{i-1}}\\big)^2."),
    p("Minden négyzetes növekmény várható értéke $\\Delta t$, így minden $n$-re $\\mathbb{E}[Q_n] = n\\,\\Delta t = T$. Mindegyik varianciája $2\\,\\Delta t^2$ (ez a normális eloszlás egy tulajdonsága), a növekmények pedig függetlenek, ezért"),
    eq("\\operatorname{Var}(Q_n) = n \\cdot 2\\,\\Delta t^2 = \\frac{2T^2}{n} \\longrightarrow 0 \\quad \\text{ha } n \\to \\infty."),
    p("Az összeg megtartja a $T$ várható értéket, a véletlensége viszont eltűnik: a határértékben pontosan $T$. Ez a határérték a Brown-mozgás **kvadratikus variációja**. Példa: a $[0,1]$ intervallumon $Q_n$ szórása $\\sqrt{2/n}$, ami $n = 10$ esetén $0{,}447$, $n = 100$ esetén $0{,}141$, $n = 1000$ esetén $0{,}0447$."),
    p("Egy sima pályára ugyanez az összeg nullához tart, mert minden négyzetes növekmény $\\Delta t^2$ nagyságrendű. A Brown-mozgás annyira egyenetlen, hogy a négyzetes növekményei véges összeget adnak."),
    p("Az abszolút növekmények összege egészen másképp viselkedik. Minden $|\\Delta W|$ várható értéke $\\sqrt{2\\Delta t/\\pi}$, így a $[0,1]$ intervallumon a $\\sum |\\Delta W|$ **teljes variáció** várható értéke $n\\sqrt{2/(\\pi n)} = \\sqrt{2n/\\pi}$: $n = 10$ esetén kb. $2{,}52$, $n = 100$ esetén $7{,}98$, $n = 1000$ esetén $25{,}23$. Ez minden határon túl nő. A Brown-pálya által megtett út végtelen hosszú, a lépések négyzetének összege mégis az eltelt időhöz tart."),
    p("Az ábra négy Brown-pályát rajzol a $[0,1]$ intervallumon, mindegyiket $n$ darab $\\Delta W \\sim N(0, 1/n)$ normális növekményből, és mindegyikre a $\\sum (\\Delta W)^2$ futó összeget ábrázolja $t$ függvényében, a $t$ egyenessel együtt. Válts az $n = 10$, $100$ és $1000$ között, és nyomd meg néhányszor az „Új pályák” gombot. A futó összegek $n$ növelésével egyre szorosabban követik az egyenest. A 2000 pályán, $t = 1$-nél számolt kijelzők szerint a $\\sum (\\Delta W)^2$ átlaga 1 közelében marad, szórása $\\sqrt{2/n}$-ként csökken, a $\\sum |\\Delta W|$ átlaga pedig $\\sqrt{2n/\\pi}$-ként nő."),
    figure("quadratic-variation"),
    p("Az eredményt a kis növekmények szorzási szabályaiként szokás felírni:"),
    eq("(dW_t)^2 = dt, \\qquad dt\\,dW_t = 0, \\qquad (dt)^2 = 0."),
    note("Kvadratikus variáció: a Brown-mozgás négyzetes növekményei a $[0,T]$ intervallumon $T$-t adnak összegként. Röviden: $(dW_t)^2 = dt$."),

    h("Az Itô-lemma"),
    p("Legyen $f(t, x)$ sima függvény, $X_t$ pedig a fenti Itô-folyamat. Az $Y_t = f(t, X_t)$ folyamat növekményét keressük. Fejtsük $f$-et másodrendig Taylor-sorba:"),
    eq("df = \\frac{\\partial f}{\\partial t}\\,dt + \\frac{\\partial f}{\\partial x}\\,dX_t + \\frac{1}{2}\\frac{\\partial^2 f}{\\partial x^2}\\,(dX_t)^2 + \\cdots"),
    p("A szokásos analízisben a harmadik tagot elhagynánk. Itt meg kell tartani. Emeljük négyzetre a $dX_t = a\\,dt + b\\,dW_t$ növekményt a szorzási szabályokkal: a $(dt)^2$ és $dt\\,dW_t$ tagok eltűnnek, csak $b^2 (dW_t)^2 = b^2\\,dt$ marad meg:"),
    eq("(dX_t)^2 = b^2\\,dt."),
    p("A magasabb rendű tagok $dt^{3/2}$ vagy kisebb nagyságrendűek, és eltűnnek. Behelyettesítve kapjuk az **Itô-lemmát**:"),
    eq("df(t, X_t) = \\left( \\frac{\\partial f}{\\partial t} + a\\,\\frac{\\partial f}{\\partial x} + \\frac{1}{2}\\,b^2\\,\\frac{\\partial^2 f}{\\partial x^2} \\right) dt + b\\,\\frac{\\partial f}{\\partial x}\\,dW_t."),
    p("A szokásos láncszabályhoz képest egyetlen új drifttag jelenik meg, a $\\tfrac12 b^2 f''$. Ez a Brown-pályák egyenetlenségének ára: $f$ görbülete $X$ véletlen ingadozásait $f(X)$ szisztematikus driftjévé alakítja."),

    h("A Brown-mozgás négyzete"),
    p("Legyen $X_t = W_t$ (tehát $a = 0$, $b = 1$) és $f(x) = x^2$, ahol $f' = 2x$ és $f'' = 2$. Az Itô-lemma szerint"),
    eq("d\\big(W_t^2\\big) = dt + 2W_t\\,dW_t."),
    p("A szokásos analízis csak a $2W_t\\,dW_t$ tagot adná. A véletlen tag várható értéke nulla, így a felhalmozott növekmények várható értékét véve $\\mathbb{E}[W_t^2] = t$ marad, összhangban a $\\operatorname{Var}(W_t) = t$ tulajdonsággal. Az extra $dt$ nélkül a várható érték tévesen nulla maradna."),

    h("A részvényár logaritmusa"),
    p("A „Geometriai Brown-mozgás” lecke modellje $dS_t = \\mu S_t\\,dt + \\sigma S_t\\,dW_t$, vagyis egy Itô-folyamat $a = \\mu S$ és $b = \\sigma S$ együtthatókkal. Alkalmazzuk az Itô-lemmát az $f(S) = \\ln S$ függvényre, ahol $f' = 1/S$ és $f'' = -1/S^2$:"),
    eq("d\\ln S_t = \\left( \\mu S \\cdot \\frac{1}{S} + \\frac{1}{2}\\,\\sigma^2 S^2 \\cdot \\left(-\\frac{1}{S^2}\\right) \\right) dt + \\sigma S \\cdot \\frac{1}{S}\\,dW_t = \\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right) dt + \\sigma\\,dW_t."),
    p("A jobb oldal együtthatói állandók, így a $[0, T]$ intervallumon közvetlenül összegezhető:"),
    eq("\\ln S_T = \\ln S_0 + \\left(\\mu - \\tfrac{1}{2}\\sigma^2\\right) T + \\sigma W_T."),
    p("Ez a „Geometriai Brown-mozgás” leckében idézett megoldás, és a $-\\tfrac12\\sigma^2$ korrekció pontosan az Itô-féle extra tag. A naiv analízis $\\mu$ log-driftet jósolt volna."),
    p("Példa: $S_0 = 100$, $\\mu = 8\\%$, $\\sigma = 20\\%$. A logár évente $0{,}08 - \\tfrac12 \\cdot 0{,}2^2 = 0{,}06$ ütemben sodródik, nem $0{,}08$-cal. $T = 10$ év alatt a logár középpontja $\\ln 100 + 0{,}6$, ami $100\\,e^{0{,}6} \\approx 182{,}21$ medián árnak felel meg. A naiv $\\ln 100 + 0{,}8$ egyenes $100\\,e^{0{,}8} \\approx 222{,}55$-re mutatna, ami a **várható** ár, nem pedig az, ahol egy tipikus pálya végződik."),

    h("A korrekció nagysága"),
    p("Vegyünk egy napot, $\\Delta t = 1/252$, $\\sigma = 20\\%$ mellett. A hozam véletlen része, $\\sigma\\,\\Delta W$, jellemzően kb. $0{,}2 \\times \\sqrt{1/252} \\approx 1{,}26\\%$. Ennek négyzete kb. $\\sigma^2 \\Delta t \\approx 0{,}016\\%$, ugyanolyan nagyságrendű, mint a napi $\\mu\\,\\Delta t \\approx 0{,}032\\%$ drift. Az ilyen négyzetek napról napra összeadva nem átlagolódnak ki, mert sosem negatívak. Ezért változtatja meg a másodrendű tag a driftet, és ezért nem hagyható el."),

    h("Összefoglalás"),
    list(
      "Egy Itô-folyamat $dX = a\\,dt + b\\,dW$ szerint mozog: egy drift lépés plusz egy kb. $b\\sqrt{dt}$ méretű véletlen lépés.",
      "A Brown-növekmények négyzete az eltelt időt adja összegként: $(dW)^2 = dt$, míg $dt\\,dW$ és $(dt)^2$ eltűnik.",
      "Itô-lemma: $df = (f_t + a f_x + \\tfrac12 b^2 f_{xx})\\,dt + b f_x\\,dW$. A $\\tfrac12 b^2 f_{xx}$ tag a szokásos analízishez képest új.",
      "GBM esetén $\\ln S$-re alkalmazva $d\\ln S = (\\mu - \\tfrac12\\sigma^2)\\,dt + \\sigma\\,dW$ adódik.",
    ),
    note("A következő lecke, a „Mértékcsere és a Girsanov-tétel”, megmutatja, hogyan lép árazáskor $r$ a megoldásban szereplő $\\mu$ drift helyére; ezután a „Monte Carlo-opcióárazás” az így kapott képlettel sorsol végső részvényárakat, és átlagolással becsül opciós árakat."),
    lab("/ito-process", "Hasonlítsd össze a logár korrigált és naiv driftjét az Itô-folyamat laborban"),
  ],
};
