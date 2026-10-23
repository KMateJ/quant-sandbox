import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const curveRisk: GuideLessonContent = {
  en: [
    p("\"Duration and convexity\" measured the price risk of a bond with one number, and it did so by moving a single yield. \"Spot rates, forward rates and the yield curve\" showed that there is no single yield: every maturity has its own zero rate. This lesson asks what happens to a bond when the curve moves in a way that is not parallel, and how to measure the exposure to each part of the curve separately."),
    p("Throughout, rates are annually compounded zero rates read off one upward-sloping curve: 3.0% at 1 year, 3.4% at 2, 3.9% at 5, 4.3% at 10 and 4.6% at 30 years, with straight lines between these points. A bond is a set of cash flows $CF_t$, and each is discounted at the zero rate of its own maturity."),

    h("Pricing off the curve"),
    p("The price of a bond on a zero curve is the sum of its discounted cash flows, each at its own rate $z_t$:"),
    eq("P = \\sum_t \\frac{CF_t}{(1+z_t)^t}."),
    p("Take a 5-year bond with a 4% annual coupon and face value 100. Its cash flows are 4, 4, 4, 4 and 104 at the ends of years 1 to 5, and discounting each at its zero rate gives $P \\approx 100.57$. The yield to maturity is a single average of the five zero rates; the price itself needs all of them."),

    h("Shapes of a curve move"),
    p("Curves rarely move in parallel. Three simple shapes cover most of what happens. A **parallel shift** moves every rate by the same amount. A **steepener** or **flattener** changes the slope: in a steepener the short rates fall relative to the long ones, in a flattener the short rates rise relative to the long ones. A **butterfly** changes the curvature: the middle of the curve moves against the two ends."),
    p("The figure uses exactly the shapes of the yield curve lab. A shock of $+50$ bp as a steepener lowers the 1-year rate by about 38 bp, the 5-year rate by about 16 bp and the 30-year rate by under 3 bp: the short end does the moving."),

    h("Key-rate durations"),
    p("One duration cannot say where on the curve the risk sits. A **key-rate duration** can. Pick key maturities, here 2, 5, 10 and 30 years. For each key rate, move that rate by a small amount $\\Delta y$, let the neighbouring zero rates follow it down linearly to zero at the adjacent key maturities, and record the relative price change:"),
    eq("\\text{KRD}_k = -\\frac{1}{P}\\,\\frac{\\Delta P}{\\Delta y_k}."),
    p("The weights are built so that, at every maturity, the shares of the key rates add up to one. Moving all key rates together is therefore the same as a parallel shift, and the key-rate durations add up to the ordinary duration against a parallel move of the zero curve:"),
    eq("\\sum_k \\text{KRD}_k = D."),
    p("For the 5-year bond this duration is 4.46 years. It splits into $\\text{KRD}_{2} = 0.22$, $\\text{KRD}_{5} = 4.23$ and zero for the 10- and 30-year keys: nearly all of the risk sits at the 5-year point, as it must, because the bond has no cash flow beyond year 5. A change in any other part of the curve leaves its price almost untouched."),
    {
      kind: "check",
      id: "curve-risk/krd-sum",
      prompt: "A portfolio has key-rate durations of 0.30, 1.10, 2.40 and 0.90 years at the 2-, 5-, 10- and 30-year points. What is its duration against a parallel shift of the curve?",
      answer: { type: "number", value: 4.7, tolerance: 0.005, unit: "years" },
      explain: "The key-rate durations add up to the duration against a parallel shift: $0.30 + 1.10 + 2.40 + 0.90 = 4.70$ years.",
    },

    h("Bullet against barbell"),
    p("Two portfolios can have the same price and the same duration and still behave differently. Compare the 5-year bond, a **bullet**, with a **barbell** of two zero-coupon bonds, one maturing in 2 years and one in 30, weighted so that its price and its duration equal the bullet's. About 91% of the barbell's value sits in the short zero and 9% in the long one."),
    p("Both have a duration of 4.46 years, so \"Duration and convexity\" cannot tell them apart. Their key-rate durations can: the bullet is 4.23 at the 5-year key, while the barbell is 1.75 at the 2-year key and 2.70 at the 30-year key and nothing in between. Under a parallel move of $+50$ bp the bullet falls 2.20% and the barbell 2.13%; the small gap is the barbell's greater convexity, the point made in \"Immunization and duration matching\". Under a $+50$ bp steepener the bullet gains 0.74% and the barbell only 0.59%, and under a flattener the bullet loses 0.74% against the barbell's 0.58%. In the butterfly, which pushes the middle of the curve up, the bullet loses 0.59% and the barbell 0.32%. A single duration hides these differences; the key-rate durations explain them."),
    figure("key-rate-shocks"),
    p("In the figure, choose a shape and a size. The upper chart shows the zero curve before and after the shock; the lower one shows the key-rate durations of the bullet and the barbell. The readouts give each portfolio's price change and the sum of the bullet's key-rate durations."),
    {
      kind: "check",
      id: "curve-risk/bullet-barbell",
      prompt: "A bullet and a barbell have the same price and duration. Only the 5-year rate rises, by 10 bp, and the 2- and 30-year rates stay put. Which loses more?",
      answer: { type: "choice", options: ["The 5-year bullet", "The 2/30-year barbell", "They lose the same, because their durations are equal"], correct: 0 },
      explain: "The bullet's duration sits at the 5-year point (key-rate duration 4.23), while the barbell has no exposure to that rate. The bullet loses about $4.23 \\times 0.10\\% \\approx 0.42\\%$; the barbell loses almost nothing.",
    },

    h("Using the numbers"),
    p("Key-rate durations let a risk manager state a view precisely. An investor who expects the curve to steepen can choose which key rates the portfolio is exposed to. To hedge, they pick instruments whose key-rate durations cancel the portfolio's at each key point, rather than only matching the total duration. The cost is that the result depends on the chosen key points and on how the shock is spread between them, so key-rate durations describe a particular decomposition of the curve, not a law of nature."),
    {
      kind: "worked",
      title: "Price change of the 5-year bond in a +50 bp steepener",
      steps: [
        { text: "Price the cash flows 4, 4, 4, 4, 104 off the curve.", tex: "P = \\sum_t \\frac{CF_t}{(1+z_t)^t}", result: { value: 100.57, tolerance: 0.01 } },
        { text: "The steepener lowers the 2-year zero rate by (in bp).", tex: "\\Delta z_2", result: { value: -29.12, tolerance: 0.1 } },
        { text: "It lowers the 5-year zero rate by (in bp).", tex: "\\Delta z_5", result: { value: -15.84, tolerance: 0.1 } },
        { text: "The bond's key-rate durations at the 2- and 5-year points.", tex: "\\text{KRD}_2,\\ \\text{KRD}_5 = 0.22,\\ 4.23" },
        { text: "First-order price change in per cent: the key-rate durations times the rate falls.", tex: "\\frac{\\Delta P}{P} \\approx -\\sum_k \\text{KRD}_k\\,\\Delta z_k", result: { value: 0.73, tolerance: 0.02, unit: "%" } },
        { text: "Repricing off the shocked curve gives 0.74%: the small difference is convexity.", tex: "\\frac{P_{\\text{shocked}}}{P} - 1", result: { value: 0.74, tolerance: 0.02, unit: "%" } },
      ],
    },

    h("Summary"),
    list(
      "A bond is priced off the whole zero curve: $P = \\sum_t CF_t/(1+z_t)^t$.",
      "Curve moves have shapes: parallel, steepener, flattener and butterfly.",
      "Key-rate durations measure the price sensitivity to each key maturity; they add up to the duration against a parallel shift.",
      "Equal price and duration do not mean equal risk: a bullet and a barbell differ in their key-rate durations and react differently to non-parallel moves.",
      "Key-rate durations depend on the chosen key points and on how a shock is spread between them.",
    ),
    note("A later lesson, \"Bond futures and the cheapest-to-deliver\", prices a contract on a basket of bonds, where the curve level and slope decide which bond is delivered."),
    lab("/yield-curve", "Open the Yield Curve lab to shock the curve yourself"),
  ],
  hu: [
    p("A „Duráció és konvexitás” egyetlen számmal mérte egy kötvény árkockázatát, és ehhez egyetlen hozamot mozgatott. Az „Azonnali kamatok, forward kamatok és a hozamgörbe” megmutatta, hogy nincs egyetlen hozam: minden lejárathoz saját zérókamat tartozik. Ez a lecke azt kérdezi, mi történik egy kötvénnyel, ha a görbe nem párhuzamosan mozdul, és hogyan mérhető külön-külön a görbe egyes szakaszaihoz tartozó kitettség."),
    p("A lecke végig évente kamatozó zérókamatokkal számol, egyetlen emelkedő görbéről leolvasva: 1 évre 3,0%, 2 évre 3,4%, 5 évre 3,9%, 10 évre 4,3% és 30 évre 4,6%, a pontok között egyenesekkel. A kötvény pénzáramok $CF_t$ halmaza, és mindegyiket a saját lejáratához tartozó zérókamattal diszkontáljuk."),

    h("Árazás a görbéről"),
    p("A kötvény ára a zérógörbén a diszkontált pénzáramok összege, mindegyik a saját $z_t$ kamatán:"),
    eq("P = \\sum_t \\frac{CF_t}{(1+z_t)^t}."),
    p("Vegyünk egy 5 éves kötvényt 4%-os éves kuponnal és 100-as névértékkel. Pénzáramai az 1–5. év végén 4, 4, 4, 4 és 104; mindegyiket a zérókamatával diszkontálva $P \\approx 100{,}57$. A lejáratig számított hozam az öt zérókamat egyetlen átlaga; az ár megállapításához mind az öt kell."),

    h("A görbemozgás alakjai"),
    p("A görbék ritkán mozdulnak párhuzamosan. A mozgások nagy részét három egyszerű alak írja le. A **párhuzamos eltolás** minden kamatot ugyanannyival mozgat. A **meredekedés** (steepener) vagy **ellaposodás** (flattener) a meredekséget változtatja: meredekedéskor a rövid kamatok esnek a hosszúakhoz képest, ellaposodáskor emelkednek. A **pillangó** a görbületet változtatja: a görbe közepe a két vég ellen mozdul."),
    p("Az ábra pontosan a hozamgörbe-labor alakjait használja. Egy $+50$ bázispontos meredekedés az 1 éves kamatot mintegy 38 bázisponttal, az 5 évest körülbelül 16-tal, a 30 évest kevesebb mint 3 bázisponttal csökkenti: a rövid vég mozog."),

    h("Kulcskamat-durációk"),
    p("Egyetlen duráció nem mondja meg, a görbe melyik pontján van a kockázat. A **kulcskamat-duráció** igen. Válasszunk kulcslejáratokat, itt 2, 5, 10 és 30 évet. Minden kulcskamatot mozdítsunk el egy kis $\\Delta y$ értékkel, a szomszédos zérókamatok kövessék lineárisan, a szomszédos kulcslejáratnál nullára csökkenve, és jegyezzük fel a relatív árváltozást:"),
    eq("\\text{KRD}_k = -\\frac{1}{P}\\,\\frac{\\Delta P}{\\Delta y_k}."),
    p("A súlyokat úgy építjük fel, hogy minden lejáratnál a kulcskamatok részesedései egyet adjanak. Az összes kulcskamat együttes mozgatása így egy párhuzamos eltolás, és a kulcskamat-durációk összege a zérógörbe párhuzamos mozgásával szembeni durációt adja:"),
    eq("\\sum_k \\text{KRD}_k = D."),
    p("Az 5 éves kötvény durációja 4,46 év. Ez így oszlik meg: $\\text{KRD}_{2} = 0{,}22$, $\\text{KRD}_{5} = 4{,}23$, a 10 és 30 éves kulcsnál nulla. A kockázat szinte teljesen az 5 éves pontra esik, ahogy kell, hiszen a kötvénynek nincs pénzárama az 5. év után. A görbe bármely más szakaszának mozgása alig érinti az árát."),
    {
      kind: "check",
      id: "curve-risk/krd-sum",
      prompt: "Egy portfólió kulcskamat-durációi a 2, 5, 10 és 30 éves pontnál 0,30, 1,10, 2,40 és 0,90 év. Mekkora a durációja a görbe párhuzamos eltolásával szemben?",
      answer: { type: "number", value: 4.7, tolerance: 0.005, unit: "év" },
      explain: "A kulcskamat-durációk összege a párhuzamos eltolással szembeni durációt adja: $0{,}30 + 1{,}10 + 2{,}40 + 0{,}90 = 4{,}70$ év.",
    },

    h("Bullet és barbell"),
    p("Két portfólió lehet azonos árú és azonos durációjú, mégis másképp viselkedhet. Hasonlítsuk össze az 5 éves kötvényt, a **bulletet** egy **barbellel**, vagyis két zérókuponos kötvénnyel, az egyik 2, a másik 30 év múlva jár le, úgy súlyozva, hogy ára és durációja egyezzen a bulletével. A barbell értékének körülbelül 91%-a a rövid, 9%-a a hosszú zéróban van."),
    p("Mindkettő durációja 4,46 év, tehát a „Duráció és konvexitás” nem tudja megkülönböztetni őket. A kulcskamat-durációk igen: a bullet 4,23 az 5 éves kulcsnál, a barbell 1,75 a 2 éves és 2,70 a 30 éves kulcsnál, köztük semmi. $+50$ bázispontos párhuzamos mozgásnál a bullet 2,20%-ot, a barbell 2,13%-ot veszít; a kis különbség a barbell nagyobb konvexitása, amit az „Immunizáció és durációillesztés” tárgyalt. $+50$ bázispontos meredekedésnél a bullet 0,74%-ot, a barbell csak 0,59%-ot nyer, ellaposodásnál a bullet 0,74%-ot veszít a barbell 0,58%-ával szemben. A pillangónál, amely a görbe közepét emeli, a bullet 0,59%-ot, a barbell 0,32%-ot veszít. Az egyetlen duráció elrejti ezeket a különbségeket, a kulcskamat-durációk megmagyarázzák őket."),
    figure("key-rate-shocks"),
    p("Az ábrán válassz alakot és méretet. A felső grafikon a zérógörbét mutatja a sokk előtt és után, az alsó a bullet és a barbell kulcskamat-durációit. A kijelzők az egyes portfóliók árváltozását és a bullet kulcskamat-durációinak összegét adják."),
    {
      kind: "check",
      id: "curve-risk/bullet-barbell",
      prompt: "Egy bullet és egy barbell ára és durációja azonos. Csak az 5 éves kamat emelkedik 10 bázisponttal, a 2 és 30 éves kamat változatlan. Melyik veszít többet?",
      answer: { type: "choice", options: ["Az 5 éves bullet", "A 2/30 éves barbell", "Ugyanannyit, mert a durációjuk egyenlő"], correct: 0 },
      explain: "A bullet durációja az 5 éves pontnál van (kulcskamat-duráció 4,23), a barbellnek nincs kitettsége erre a kamatra. A bullet nagyjából $4{,}23 \\times 0{,}10\\% \\approx 0{,}42\\%$-ot veszít, a barbell szinte semmit.",
    },

    h("A számok használata"),
    p("A kulcskamat-durációk lehetővé teszik, hogy a kockázatkezelő pontosan fogalmazza meg a piaci várakozását. Aki a görbe meredekedésére számít, megválaszthatja, mely kulcskamatoknak legyen kitéve a portfólió. Fedezéskor olyan eszközöket választ, amelyek kulcskamat-durációi minden kulcspontban kioltják a portfólióét, nem csak az összeget illesztik. Ennek az ára, hogy az eredmény a választott kulcspontoktól és a sokk kulcspontok közötti elosztásától függ, így a kulcskamat-durációk a görbe egy bizonyos felbontását írják le, nem természeti törvényt."),
    {
      kind: "worked",
      title: "Az 5 éves kötvény árváltozása +50 bázispontos meredekedésben",
      steps: [
        { text: "A 4, 4, 4, 4, 104 pénzáramok árazása a görbéről.", tex: "P = \\sum_t \\frac{CF_t}{(1+z_t)^t}", result: { value: 100.57, tolerance: 0.01 } },
        { text: "A meredekedés ennyivel csökkenti a 2 éves zérókamatot (bázispontban).", tex: "\\Delta z_2", result: { value: -29.12, tolerance: 0.1 } },
        { text: "Ennyivel csökkenti az 5 éves zérókamatot (bázispontban).", tex: "\\Delta z_5", result: { value: -15.84, tolerance: 0.1 } },
        { text: "A kötvény kulcskamat-durációi a 2 és 5 éves pontnál.", tex: "\\text{KRD}_2,\\ \\text{KRD}_5 = 0{,}22,\\ 4{,}23" },
        { text: "Elsőrendű árváltozás százalékban: a kulcskamat-durációk szorozva a kamatesésekkel.", tex: "\\frac{\\Delta P}{P} \\approx -\\sum_k \\text{KRD}_k\\,\\Delta z_k", result: { value: 0.73, tolerance: 0.02, unit: "%" } },
        { text: "A sokkolt görbéről újraárazva 0,74%: a kis eltérés a konvexitás.", tex: "\\frac{P_{\\text{sokk}}}{P} - 1", result: { value: 0.74, tolerance: 0.02, unit: "%" } },
      ],
    },

    h("Összefoglalás"),
    list(
      "A kötvényt a teljes zérógörbéről árazzuk: $P = \\sum_t CF_t/(1+z_t)^t$.",
      "A görbemozgásoknak alakjuk van: párhuzamos eltolás, meredekedés, ellaposodás és pillangó.",
      "A kulcskamat-durációk az egyes kulcslejáratokhoz tartozó árérzékenységet mérik; összegük a párhuzamos eltolással szembeni duráció.",
      "Az azonos ár és duráció nem jelent azonos kockázatot: a bullet és a barbell kulcskamat-durációi különböznek, és nem párhuzamos mozgásokra másképp reagálnak.",
      "A kulcskamat-durációk a választott kulcspontoktól és a sokk kulcspontok közötti elosztásától függnek.",
    ),
    note("Egy későbbi lecke, a „Kötvényfutures és a legolcsóbban szállítható kötvény”, egy kötvénykosárra szóló szerződést árazza, ahol a görbe szintje és meredeksége dönti el, melyik kötvényt szállítják."),
    lab("/yield-curve", "Nyisd meg a Hozamgörbe labort, és sokkold magad a görbét"),
  ],
};
