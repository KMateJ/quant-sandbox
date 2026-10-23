import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const correlatedBrownianMotions: GuideLessonContent = {
  en: [
    p("Everything so far used one Brownian motion at a time. Real models rarely do. A stock and its volatility move together, a basket option depends on several assets at once, and a portfolio is exactly the situation of \"Diversification and correlation\". This lesson builds two Brownian motions with a chosen correlation, from the properties in \"Properties of Brownian motion\", shows how the same construction extends to many assets, and states the two-dimensional version of the rule in \"Itô's lemma\". It also says where correlation enters pricing models and how it is simulated with the scheme of \"Simulating SDEs: the Euler–Maruyama scheme\"."),

    h("Two Brownian motions with correlation ρ"),
    p("Two standard Brownian motions $W_1$ and $W_2$ have **correlation** $\\rho \\in [-1, 1]$ if their increments over a short interval $dt$ have correlation $\\rho$. In the language of quadratic variation this is a single rule for the cross term:"),
    eq("d\\langle W_1, W_2 \\rangle_t = \\rho\\,dt, \\qquad d\\langle W_i \\rangle_t = dt."),
    p("It is easy to build such a pair from two **independent** Brownian motions $W_1$ and $W_\\perp$. Keep $W_1$ and mix the other in:"),
    eq("W_2 = \\rho\\,W_1 + \\sqrt{1 - \\rho^2}\\;W_\\perp."),
    p("Then $W_2$ has independent normal increments with variance $(\\rho^2 + 1 - \\rho^2)\\,dt = dt$, so it is a standard Brownian motion in its own right, and its increment covaries with that of $W_1$ by $\\rho\\,dt$. At $\\rho = 0$ the two are independent. At $\\rho = \\pm 1$ they are the same path or its mirror image. The figure draws both paths from one set of random shocks and lets you move $\\rho$. Start at the default $\\rho = -0.7$ and watch the paths mostly mirror each other; the sample correlation of the increments is noisy for a path with only 250 steps, but the construction fixes the exact value of $\\langle W_1, W_2 \\rangle_T = \\rho\\,T$, which is $-0.70$ for $T = 1$."),
    figure("correlated-paths"),

    h("The Cholesky factor"),
    p("The construction above is a matrix product. Write the independent shocks of one step as a vector $\\varepsilon = (\\varepsilon_1, \\varepsilon_2)$ of standard normals and the correlated ones as $Z = L\\,\\varepsilon$ with"),
    eq("L = \\begin{pmatrix} 1 & 0 \\\\ \\rho & \\sqrt{1 - \\rho^2} \\end{pmatrix}, \\qquad L L^{\\top} = \\begin{pmatrix} 1 & \\rho \\\\ \\rho & 1 \\end{pmatrix}."),
    p("This $L$ is the **Cholesky factor** of the correlation matrix. For $n$ assets with correlation matrix $C$, the same idea works: find a lower-triangular $L$ with $L L^{\\top} = C$ and set $Z = L\\,\\varepsilon$ for independent $\\varepsilon$. Such an $L$ exists exactly when $C$ is **positive definite**, which is a real restriction. A table of pairwise correlations chosen independently, say $\\rho_{12} = \\rho_{13} = 0.9$ and $\\rho_{23} = -0.9$, can fail it, and then no set of random variables has those correlations. The algorithm reports the failure when a square root of a non-positive number would be needed; the figure's readout $\\sqrt{1 - \\rho^2}$ is that square root for two assets, and it vanishes at $\\rho = \\pm 1$."),
    {
      kind: "check",
      id: "correlated-brownian-motions/second-weight",
      prompt: "Two Brownian motions have correlation $\\rho = 0.6$. In the construction $W_2 = \\rho W_1 + \\sqrt{1-\\rho^2}\\,W_\\perp$, what is the weight of the independent motion $W_\\perp$?",
      answer: { type: "number", value: 0.8, tolerance: 0.001 },
      explain: "The weight is $\\sqrt{1 - \\rho^2} = \\sqrt{1 - 0.36} = \\sqrt{0.64} = 0.8$. Note that $0.6^2 + 0.8^2 = 1$, so the variance stays 1.",
    },

    h("The two-dimensional Itô rule"),
    p("Let $dX = \\mu_1\\,dt + \\sigma_1\\,dW_1$ and $dY = \\mu_2\\,dt + \\sigma_2\\,dW_2$ with $d\\langle W_1, W_2 \\rangle = \\rho\\,dt$. For a smooth function $f(t, x, y)$, \"Itô's lemma\" extends by one extra term, the cross term, because $dX\\,dY = \\rho\\,\\sigma_1 \\sigma_2\\,dt$:"),
    eq("df = f_t\\,dt + f_x\\,dX + f_y\\,dY + \\tfrac{1}{2} f_{xx}\\,\\sigma_1^2\\,dt + \\tfrac{1}{2} f_{yy}\\,\\sigma_2^2\\,dt + f_{xy}\\,\\rho\\,\\sigma_1 \\sigma_2\\,dt."),
    p("With $f(x, y) = x\\,y$ this is the **product rule** for correlated processes:"),
    eq("d(XY) = X\\,dY + Y\\,dX + \\rho\\,\\sigma_1 \\sigma_2\\,dt."),
    p("For two Brownian motions themselves ($X = W_1$, $Y = W_2$, $\\sigma_1 = \\sigma_2 = 1$) the extra term is $\\rho\\,dt$. The product $W_1 W_2$ is therefore not a martingale; its drift is $\\rho$, and taking expectations gives $E[W_1(T)\\,W_2(T)] = \\rho\\,T$."),

    h("Where correlation enters"),
    p("In the Heston model of \"Stochastic volatility and the Heston model\", the price and the variance are driven by Brownian motions with correlation $\\rho$:"),
    eq("dS = \\mu S\\,dt + \\sqrt{v}\\,S\\,dW_1, \\qquad dv = \\kappa(\\theta - v)\\,dt + \\xi\\sqrt{v}\\,dW_2, \\qquad d\\langle W_1, W_2 \\rangle = \\rho\\,dt."),
    p("Equity indices fall when volatility rises, so the calibrated $\\rho$ is negative, typically between $-0.5$ and $-0.9$. That negative sign is what tilts the implied volatility smile into a skew. Correlation also drives **basket and spread options**, whose payoff depends on several assets: the variance of a weighted sum includes $2\\,w_i w_j\\,\\rho_{ij}\\,\\sigma_i \\sigma_j$ terms, exactly as the portfolio variance does. A copula would let the dependence differ from this linear one; we do not need it here."),

    h("Simulating correlated assets"),
    p("In the Euler scheme the only change is the shock. At each step draw independent standard normals $\\varepsilon_1, \\varepsilon_2$ and use $Z_1 = \\varepsilon_1$, $Z_2 = \\rho\\,\\varepsilon_1 + \\sqrt{1 - \\rho^2}\\,\\varepsilon_2$ in place of the two independent shocks. Everything else, including the pricing average of \"Monte Carlo option pricing\", stays as it was."),
    {
      kind: "worked",
      title: "Correlated shocks for ρ = −0.7, and the product rule",
      steps: [
        { text: "The weight of the independent shock is the second Cholesky entry.", tex: "L_{22} = \\sqrt{1 - (-0.7)^2}", result: { value: 0.7141, tolerance: 0.001 } },
        { text: "Draw $\\varepsilon_1 = 0.8$ and $\\varepsilon_2 = -0.3$. The first correlated shock is $Z_1 = \\varepsilon_1 = 0.8$; the second mixes both.", tex: "Z_2 = \\rho\\,\\varepsilon_1 + L_{22}\\,\\varepsilon_2 = -0.7 \\times 0.8 + 0.7141 \\times (-0.3)", result: { value: -0.7742, tolerance: 0.001 } },
        { text: "The product rule gives $d(W_1 W_2) = W_2\\,dW_1 + W_1\\,dW_2 + \\rho\\,dt$. The two stochastic integrals have mean zero, so the expected product after $T = 1$ is $\\rho T$.", tex: "E[W_1(1)\\,W_2(1)] = \\rho \\cdot 1", result: { value: -0.7, tolerance: 0.001 } },
      ],
    },
    {
      kind: "check",
      id: "correlated-brownian-motions/heston-sign",
      prompt: "In the Heston model, which sign of the correlation $\\rho$ between the price and variance shocks produces the equity-style skew, with low strikes pricing at higher implied volatility?",
      answer: { type: "choice", options: ["Negative", "Zero", "Positive", "The sign does not matter"], correct: 0 },
      explain: "Negative $\\rho$ means volatility tends to rise when the price falls. Down-moves then come with larger swings, so low-strike options are worth more, which is the observed skew.",
    },

    h("Summary"),
    list(
      "Two Brownian motions have correlation $\\rho$ when $d\\langle W_1, W_2 \\rangle = \\rho\\,dt$; build them as $W_2 = \\rho W_1 + \\sqrt{1 - \\rho^2}\\,W_\\perp$.",
      "For $n$ assets, correlated shocks are $Z = L\\varepsilon$, where $L L^{\\top} = C$ is the Cholesky factor, which exists exactly when $C$ is positive definite.",
      "The two-dimensional Itô rule adds the cross term $f_{xy}\\,\\rho\\,\\sigma_1 \\sigma_2\\,dt$, which gives $d(XY) = X\\,dY + Y\\,dX + \\rho\\,\\sigma_1 \\sigma_2\\,dt$.",
      "Correlation drives the skew in Heston (with $\\rho < 0$ for equities) and the price of basket and spread options.",
    ),
    note("The next lesson, \"Mean reversion: Ornstein–Uhlenbeck and Vasicek\", returns to one-dimensional models and adds a pull towards a long-run level."),
    lab("/heston", "See the effect of the price–variance correlation in the Heston lab"),
  ],

  hu: [
    p("Eddig mindig egyetlen Brown-mozgással dolgoztunk. A valódi modellek ritkán elégednek meg eggyel. A részvény és a volatilitása együtt mozog, egy kosáropció egyszerre több eszköztől függ, egy portfólió pedig éppen az a helyzet, amelyről a „Diverzifikáció és korreláció” szól. A lecke két, tetszőleges korrelációjú Brown-mozgást épít fel „A Brown-mozgás tulajdonságai” leckében szereplő tulajdonságokból, megmutatja, hogyan terjed ki az eljárás sok eszközre, és kimondja az „Az Itô-lemma” szabályának kétdimenziós változatát. Azt is elmondja, hol jelenik meg a korreláció az árazási modellekben, és hogyan szimuláljuk az „SDE-k szimulációja: az Euler–Maruyama-séma” módszerével."),

    h("Két Brown-mozgás ρ korrelációval"),
    p("Két standard Brown-mozgásnak, $W_1$-nek és $W_2$-nek $\\rho \\in [-1, 1]$ a **korrelációja**, ha a növekményeik korrelációja egy rövid $dt$ szakaszon $\\rho$. A kvadratikus variáció nyelvén ez egyetlen szabály a keresztszorzatra:"),
    eq("d\\langle W_1, W_2 \\rangle_t = \\rho\\,dt, \\qquad d\\langle W_i \\rangle_t = dt."),
    p("Ilyen párt könnyű építeni két **független** Brown-mozgásból, $W_1$-ből és $W_\\perp$-ből. A $W_1$-et megtartjuk, a másikat belekeverjük:"),
    eq("W_2 = \\rho\\,W_1 + \\sqrt{1 - \\rho^2}\\;W_\\perp."),
    p("Ekkor $W_2$ növekményei függetlenek és normálisak $(\\rho^2 + 1 - \\rho^2)\\,dt = dt$ szórásnégyzettel, tehát önmagában is standard Brown-mozgás, a növekménye pedig $\\rho\\,dt$-vel kovariál a $W_1$ növekményével. $\\rho = 0$-nál a két mozgás független, $\\rho = \\pm 1$-nél ugyanaz a pálya vagy annak tükörképe. Az ábra mindkét pályát ugyanabból a véletlen sorozatból rajzolja, és a $\\rho$-t mozgathatod. Indulj az alapértelmezett $\\rho = -0{,}7$-ről, és nézd, hogyan tükrözik nagyjából egymást a pályák; a növekmények mintakorrelációja egy mindössze 250 lépéses pályán zajos, de a konstrukció pontosan rögzíti, hogy $\\langle W_1, W_2 \\rangle_T = \\rho\\,T$, ami $T = 1$-re $-0{,}70$."),
    figure("correlated-paths"),

    h("A Cholesky-felbontás"),
    p("A fenti konstrukció egy mátrixszorzat. Írjuk egy lépés független sokkjait $\\varepsilon = (\\varepsilon_1, \\varepsilon_2)$ standard normális vektorként, a korreláltakat pedig $Z = L\\,\\varepsilon$ alakban:"),
    eq("L = \\begin{pmatrix} 1 & 0 \\\\ \\rho & \\sqrt{1 - \\rho^2} \\end{pmatrix}, \\qquad L L^{\\top} = \\begin{pmatrix} 1 & \\rho \\\\ \\rho & 1 \\end{pmatrix}."),
    p("Ez az $L$ a korrelációs mátrix **Cholesky-felbontása**. $n$ eszközre, $C$ korrelációs mátrixszal ugyanez a gondolat működik: keressünk olyan alsó háromszögmátrixot, amelyre $L L^{\\top} = C$, és legyen $Z = L\\,\\varepsilon$ független $\\varepsilon$-ra. Ilyen $L$ pontosan akkor létezik, ha $C$ **pozitív definit**, ami valódi megszorítás. A páronkénti korrelációk egymástól független megválasztása, például $\\rho_{12} = \\rho_{13} = 0{,}9$ és $\\rho_{23} = -0{,}9$, megbukhat rajta, és akkor semmilyen valószínűségi változó-rendszernek sincsenek ezek a korrelációi. Az algoritmus akkor jelzi a hibát, amikor nem pozitív szám négyzetgyökére lenne szükség; az ábra $\\sqrt{1 - \\rho^2}$ kijelzője két eszköznél éppen ez a négyzetgyök, és $\\rho = \\pm 1$-nél eltűnik."),
    {
      kind: "check",
      id: "correlated-brownian-motions/second-weight",
      prompt: "Két Brown-mozgás korrelációja $\\rho = 0{,}6$. A $W_2 = \\rho W_1 + \\sqrt{1-\\rho^2}\\,W_\\perp$ konstrukcióban mekkora a független $W_\\perp$ mozgás súlya?",
      answer: { type: "number", value: 0.8, tolerance: 0.001 },
      explain: "A súly $\\sqrt{1 - \\rho^2} = \\sqrt{1 - 0{,}36} = \\sqrt{0{,}64} = 0{,}8$. Vedd észre, hogy $0{,}6^2 + 0{,}8^2 = 1$, így a szórásnégyzet 1 marad.",
    },

    h("A kétdimenziós Itô-szabály"),
    p("Legyen $dX = \\mu_1\\,dt + \\sigma_1\\,dW_1$ és $dY = \\mu_2\\,dt + \\sigma_2\\,dW_2$, ahol $d\\langle W_1, W_2 \\rangle = \\rho\\,dt$. Egy sima $f(t, x, y)$ függvényre „Az Itô-lemma” egyetlen taggal bővül, a keresztaggal, mert $dX\\,dY = \\rho\\,\\sigma_1 \\sigma_2\\,dt$:"),
    eq("df = f_t\\,dt + f_x\\,dX + f_y\\,dY + \\tfrac{1}{2} f_{xx}\\,\\sigma_1^2\\,dt + \\tfrac{1}{2} f_{yy}\\,\\sigma_2^2\\,dt + f_{xy}\\,\\rho\\,\\sigma_1 \\sigma_2\\,dt."),
    p("Az $f(x, y) = x\\,y$ függvénnyel ez a korrelált folyamatok **szorzatszabálya**:"),
    eq("d(XY) = X\\,dY + Y\\,dX + \\rho\\,\\sigma_1 \\sigma_2\\,dt."),
    p("Magukra a Brown-mozgásokra ($X = W_1$, $Y = W_2$, $\\sigma_1 = \\sigma_2 = 1$) a pótlólagos tag $\\rho\\,dt$. A $W_1 W_2$ szorzat ezért nem martingál; a driftje $\\rho$, és a várható értéket véve $E[W_1(T)\\,W_2(T)] = \\rho\\,T$."),

    h("Hol jelenik meg a korreláció"),
    p("A „Sztochasztikus volatilitás és a Heston-modell” leckében az árfolyamot és a varianciát $\\rho$ korrelációjú Brown-mozgások hajtják:"),
    eq("dS = \\mu S\\,dt + \\sqrt{v}\\,S\\,dW_1, \\qquad dv = \\kappa(\\theta - v)\\,dt + \\xi\\sqrt{v}\\,dW_2, \\qquad d\\langle W_1, W_2 \\rangle = \\rho\\,dt."),
    p("A részvényindexek esnek, amikor a volatilitás nő, ezért a kalibrált $\\rho$ negatív, jellemzően $-0{,}5$ és $-0{,}9$ között. Ez a negatív előjel ferdíti el az implikált volatilitási mosolyt. A korreláció hajtja a **kosár- és spread opciókat** is, amelyek kifizetése több eszköztől függ: egy súlyozott összeg szórásnégyzetében ott vannak a $2\\,w_i w_j\\,\\rho_{ij}\\,\\sigma_i \\sigma_j$ tagok, pontosan úgy, mint a portfólió szórásnégyzetében. Egy kopula azt is megengedné, hogy a függőség eltérjen ettől a lineáris alaktól; itt erre nem lesz szükségünk."),

    h("Korrelált eszközök szimulációja"),
    p("Az Euler-sémában csak a sokk változik. Minden lépésben húzzunk független standard normális $\\varepsilon_1, \\varepsilon_2$ értékeket, és a két független sokk helyett használjuk a $Z_1 = \\varepsilon_1$, $Z_2 = \\rho\\,\\varepsilon_1 + \\sqrt{1 - \\rho^2}\\,\\varepsilon_2$ párt. Minden más, a „Monte Carlo-opcióárazás” árazó átlagával együtt, ugyanaz marad."),
    {
      kind: "worked",
      title: "Korrelált sokkok ρ = −0,7 esetén, és a szorzatszabály",
      steps: [
        { text: "A független sokk súlya a Cholesky-felbontás második eleme.", tex: "L_{22} = \\sqrt{1 - (-0{,}7)^2}", result: { value: 0.7141, tolerance: 0.001 } },
        { text: "Húzzuk $\\varepsilon_1 = 0{,}8$-at és $\\varepsilon_2 = -0{,}3$-at. Az első korrelált sokk $Z_1 = \\varepsilon_1 = 0{,}8$; a második mindkettőt keveri.", tex: "Z_2 = \\rho\\,\\varepsilon_1 + L_{22}\\,\\varepsilon_2 = -0{,}7 \\times 0{,}8 + 0{,}7141 \\times (-0{,}3)", result: { value: -0.7742, tolerance: 0.001 } },
        { text: "A szorzatszabály szerint $d(W_1 W_2) = W_2\\,dW_1 + W_1\\,dW_2 + \\rho\\,dt$. A két sztochasztikus integrál várható értéke nulla, így a szorzat várható értéke $T = 1$ után $\\rho T$.", tex: "E[W_1(1)\\,W_2(1)] = \\rho \\cdot 1", result: { value: -0.7, tolerance: 0.001 } },
      ],
    },
    {
      kind: "check",
      id: "correlated-brownian-motions/heston-sign",
      prompt: "A Heston-modellben az árfolyam- és a varianciasokk $\\rho$ korrelációjának melyik előjele adja a részvényekre jellemző ferdeséget, vagyis az alacsony kötési árfolyamok magasabb implikált volatilitását?",
      answer: { type: "choice", options: ["Negatív", "Nulla", "Pozitív", "Az előjel nem számít"], correct: 0 },
      explain: "Negatív $\\rho$ azt jelenti, hogy a volatilitás hajlamos nőni, amikor az árfolyam esik. A lefelé mozgásokat így nagyobb kilengések kísérik, az alacsony kötési árfolyamú opciók többet érnek, és ez a megfigyelt ferdeség.",
    },

    h("Összefoglalás"),
    list(
      "Két Brown-mozgás korrelációja $\\rho$, ha $d\\langle W_1, W_2 \\rangle = \\rho\\,dt$; építsd őket $W_2 = \\rho W_1 + \\sqrt{1 - \\rho^2}\\,W_\\perp$ alakban.",
      "$n$ eszköznél a korrelált sokkok $Z = L\\varepsilon$, ahol $L L^{\\top} = C$ a Cholesky-felbontás, amely pontosan akkor létezik, ha $C$ pozitív definit.",
      "A kétdimenziós Itô-szabály az $f_{xy}\\,\\rho\\,\\sigma_1 \\sigma_2\\,dt$ keresztaggal bővül, ebből $d(XY) = X\\,dY + Y\\,dX + \\rho\\,\\sigma_1 \\sigma_2\\,dt$.",
      "A korreláció hajtja a Heston-modell ferdeségét (részvényeknél $\\rho < 0$), valamint a kosár- és spread opciók árát.",
    ),
    note("A következő lecke, az „Átlaghoz visszahúzó folyamatok: Ornstein–Uhlenbeck és Vasicek”, visszatér az egydimenziós modellekhez, és egy hosszú távú szint felé húzó erőt ad hozzá."),
    lab("/heston", "Nézd meg az ár–variancia korreláció hatását a Heston-laborban"),
  ],
};
