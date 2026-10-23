import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p, steps } from "./blocks";

export const exoticOptions: GuideLessonContent = {
  en: [
    p("So far every option in this track paid a function of the final price $S_T$ alone. This lesson looks at options whose payoff is either non-standard or depends on the whole price path: digital, barrier and Asian options. It uses the pricing rule from \"Risk-neutral probabilities\", the formula from \"The Black–Scholes formula\" and the simulation method from \"Monte Carlo option pricing\", and it shows where the static replication of \"Static replication: Breeden–Litzenberger and Carr–Madan\" stops working."),

    h("Exotic options"),
    p("An option is called **exotic** when it is not a plain European or American call or put. There are two ways to depart from the standard contract. The payoff can be a different function of $S_T$, such as a fixed cash amount. Or the payoff can be **path-dependent**: it depends on prices at dates before $T$, for example on the maximum or the average of the path."),
    p("The difference matters for hedging. A European payoff $f(S_T)$ can be built statically from bonds, a forward and vanilla options, as the Carr–Madan result showed. A path-dependent payoff cannot in general: two paths that end at the same $S_T$ can pay different amounts, so no portfolio of instruments that pay a function of $S_T$ can match it. The pricing rule is unchanged, though. The price is still the discounted $\\mathbb{Q}$-expectation of the payoff $X$:"),
    eq("V_0 = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}[X]."),

    h("Digital options"),
    p("A **digital** (cash-or-nothing) call pays 1 at $T$ if $S_T > K$ and nothing otherwise. Its payoff is the indicator $\\mathbf{1}\\{S_T > K\\}$, a step instead of a ramp. The expected payoff is the risk-neutral probability of finishing above the strike, which \"The Black–Scholes formula\" identified as $N(d_2)$. Discounting gives"),
    eq("D_0 = e^{-rT}\\,\\mathbb{Q}(S_T > K) = e^{-rT} N(d_2), \\qquad d_2 = \\frac{\\ln(S_0/K) + (r - \\tfrac12\\sigma^2)T}{\\sigma\\sqrt{T}}."),
    p("With $S_0 = K = 100$, $r = 5\\%$, $\\sigma = 20\\%$ and $T = 1$, $d_2 = 0.03/0.2 = 0.15$, $N(d_2) \\approx 0.5596$ and $D_0 \\approx 0.5323$. The digital is still a European payoff. It is the limit of a tight call spread from \"Combining positions\": long $1/h$ calls struck at $K$ and short $1/h$ calls struck at $K + h$, with $h \\to 0$."),
    p("Its delta shows why digitals are hard to hedge. Differentiating $D_0$ with respect to $S_0$ gives $\\Delta = e^{-rT}\\varphi(d_2)/(S_0\\sigma\\sqrt{T})$, where $\\varphi$ is the standard normal density. At the money the factor $1/\\sqrt{T}$ makes it blow up as expiry approaches: about $0.019$ with one year left, $0.069$ with one month and $0.381$ with one day. Near expiry the hedge must swing between holding almost nothing and holding a large position as the price crosses $K$."),
    {
      kind: "check",
      id: "exotic-options/digital-price",
      prompt: "A cash-or-nothing call pays 1 if $S_T > K$. With $S_0 = K = 100$, $r = 5\\%$, $\\sigma = 20\\%$ and $T = 1$, what is it worth today?",
      answer: { type: "number", value: 0.5323, tolerance: 0.002 },
      explain: "$d_2 = 0.15$ and $N(0.15) \\approx 0.5596$, so $D_0 = e^{-0.05} \\cdot 0.5596 \\approx 0.5323$.",
    },
    {
      kind: "worked",
      title: "An out-of-the-money digital call",
      steps: [
        { text: "Same market, strike raised to $K = 110$:", tex: "d_2 = \\frac{\\ln(100/110) + (0.05 - 0.02) \\cdot 1}{0.2}", result: { value: -0.3266, tolerance: 0.001 } },
        { text: "Risk-neutral probability of finishing above 110:", tex: "N(d_2)", result: { value: 0.372, tolerance: 0.001 } },
        { text: "Discount the expected payment of 1:", tex: "D_0 = e^{-0.05} \\cdot 0.372", result: { value: 0.3539, tolerance: 0.001 } },
      ],
    },

    h("Barrier options"),
    p("A **barrier option** is a vanilla option that is switched off or on when the price touches a level $B$. A **knock-out** option dies, paying nothing, if the barrier is touched before $T$; a **knock-in** option comes to life only if it is touched. The most common example is the **up-and-out call** with $B > K$. Writing $M_T$ for the maximum of the path up to $T$, its payoff is"),
    eq("X = (S_T - K)^+\\,\\mathbf{1}\\{M_T < B\\}."),
    p("The payoff is never larger than the vanilla payoff, so the up-and-out call is cheaper than the vanilla. It loses exactly the paths that matter most to a call holder: those that rise far. As $B$ falls toward $K$ its value goes to zero, because a path that finishes above $K \\ge B$ must have touched $B$. As $B$ rises the barrier is touched less often and the price approaches the vanilla price."),
    p("Volatility acts in two directions. Higher $\\sigma$ makes large final payoffs more likely, which raises the vanilla price, but it also makes touching $B$ more likely. With a barrier close to the spot the second effect wins, and the up-and-out call can get cheaper as $\\sigma$ rises."),
    {
      kind: "check",
      id: "exotic-options/up-and-out-cheaper",
      prompt: "Compare an up-and-out call (barrier $B > K$) with the vanilla call with the same $K$ and $T$.",
      answer: { type: "choice", options: ["The up-and-out call is worth less", "The up-and-out call is worth more", "They are worth the same", "It depends on whether $B$ is touched"], correct: 0 },
      explain: "On every path the barrier payoff is at most the vanilla payoff, and on paths that touch $B$ it is zero while the vanilla may pay. So its price is lower, by the value of the up-and-in call.",
    },

    h("In–out parity"),
    p("Hold an up-and-in call and an up-and-out call with the same $K$, $B$ and $T$. On every path exactly one of them is alive, and the live one pays $(S_T - K)^+$. Together they pay the vanilla payoff on every path, so by the law of one price"),
    eq("C_0^{\\text{in}} + C_0^{\\text{out}} = C_0."),
    p("Pricing one of the two barrier options therefore prices the other."),

    h("Discrete and continuous monitoring"),
    p("A contract must say how the barrier is checked. Textbook formulas assume **continuous monitoring**: the price is watched at every instant. Real contracts often use **discrete monitoring**, for example at each daily close. A path can cross $B$ between two observation dates and come back unnoticed, so a discretely monitored knock-out is knocked out less often and is worth more than its continuously monitored version. The figure below monitors 100 dates in the year."),

    h("Asian options"),
    p("An **Asian option** pays on the average price over a set of monitoring dates $t_1, \\dots, t_n$ instead of the final price. The arithmetic-average Asian call pays"),
    eq("X = (A_T - K)^+, \\qquad A_T = \\frac{1}{n}\\sum_{k=1}^{n} S_{t_k}."),
    p("An average moves less than the price itself: early prices in the average have had little time to drift away, and their errors partly cancel. For averaging over the whole period the volatility of the average is roughly $\\sigma/\\sqrt{3}$, about 11.5% when $\\sigma = 20\\%$. Lower volatility means a smaller time value, so the Asian call is cheaper than the vanilla. Averaging also makes the contract hard to manipulate by moving the price on a single day."),
    p("A sum of log-normal prices is not log-normal, so the arithmetic Asian call has no closed form. The geometric average is log-normal and has a Black–Scholes-type formula; since it moves closely with the arithmetic one, it is a natural control variate in the sense of \"Monte Carlo option pricing\"."),

    h("Pricing by Monte Carlo"),
    p("For path-dependent payoffs a single draw of $S_T$ is not enough: we need the whole path at the monitoring dates. Under $\\mathbb{Q}$ the stock follows geometric Brownian motion with drift $r$, and the exact solution steps from one date to the next with $\\Delta t = T/n$:"),
    eq("S_{t_{k+1}} = S_{t_k}\\exp\\big((r - \\tfrac12\\sigma^2)\\Delta t + \\sigma\\sqrt{\\Delta t}\\,Z_{k+1}\\big)."),
    steps(
      "Simulate $N$ paths at the $n$ monitoring dates with independent standard normal $Z$'s.",
      "On each path record what the payoff needs: $S_T$, the running maximum $M_T$, the average $A_T$.",
      "Compute each path's payoff, average over the $N$ paths and multiply by $e^{-rT}$.",
    ),
    p("The same paths price all the contracts at once; only the payoff function changes. The standard error behaves as described in \"Monte Carlo option pricing\"."),

    h("A worked example"),
    p("Take $S_0 = 100$, $K = 100$, $r = 5\\%$, $T = 1$, $\\sigma = 20\\%$, 100 monitoring dates, barrier $B = 130$, and simulate 20 000 paths (seed 1). The estimates are:"),
    list(
      "Vanilla call: $10.37$; the Black–Scholes price is $10.45$, within about one standard error ($\\approx 0.10$).",
      "Asian call: $5.77$, a little over half the vanilla price.",
      "Up-and-out call with $B = 130$: $3.69$, so the up-and-in call is worth $10.37 - 3.69 = 6.68$ by in–out parity.",
      "Digital call paying 1: $0.530$, against the closed form $e^{-rT}N(d_2) \\approx 0.532$.",
    ),
    p("The barrier removes almost two thirds of the vanilla value, because a 30% rise within a year is not unusual at 20% volatility."),
    p("The figure uses these settings: $S_0 = 100$, $K = 100$, $r = 5\\%$, $T = 1$, with 20 000 paths simulated under $\\mathbb{Q}$ and monitored at 100 dates. The sliders set the volatility $\\sigma$ (10% to 50%) and the barrier level $B$ (105 to 250), and \"New sample\" draws new paths. The chart plots the up-and-out call price against $B$ from 105 to 250, with the vanilla Black–Scholes price as a horizontal line and a vertical line at the chosen $B$. The readouts give the Monte Carlo vanilla call, the Asian call, the up-and-out call at $B$ and the digital call paying 1. Push $B$ down toward $K$ and watch the barrier price fall to zero. Then raise $\\sigma$: the vanilla gets dearer, while at $B = 130$ the up-and-out call gets cheaper, from about $3.69$ at 20% to about $1.88$ at 30%."),
    figure("exotic-prices"),
    note("Path-dependent options rarely have closed forms, but they are priced by the same rule as any other claim: simulate paths under $\\mathbb{Q}$, evaluate the payoff on each path, average and discount."),

    h("Summary"),
    list(
      "An exotic option has a non-standard payoff or one that depends on the path; path-dependent payoffs cannot in general be replicated statically with vanillas.",
      "A digital call pays 1 if $S_T > K$; its price is $e^{-rT}N(d_2)$ and its delta spikes near expiry at the money.",
      "An up-and-out call is cheaper than the vanilla, falls to zero as $B$ approaches $K$, and satisfies $C_0^{\\text{in}} + C_0^{\\text{out}} = C_0$; discrete monitoring knocks out less often.",
      "Averaging lowers volatility, so an arithmetic Asian call is cheaper than the vanilla and has no closed form.",
      "Monte Carlo prices all of them from the same simulated paths at the monitoring dates.",
    ),
    lab("/monte-carlo", "Simulate risk-neutral paths and price payoffs in the Monte Carlo lab"),
  ],

  hu: [
    p("Ezen a pályán eddig minden opció kizárólag a végső $S_T$ ár függvényét fizette. Ez a lecke olyan opciókat vizsgál, amelyek kifizetése vagy nem szokványos, vagy a teljes árfolyamúttól függ: a digitális, a barrier és az ázsiai opciókat. A „Kockázatsemleges valószínűségek” árazási szabályára, „A Black–Scholes-képlet” eredményére és a „Monte Carlo-opcióárazás” szimulációs módszerére épít, és megmutatja, hol nem működik már a „Statikus replikáció: Breeden–Litzenberger és Carr–Madan” lecke statikus replikációja."),

    h("Egzotikus opciók"),
    p("**Egzotikusnak** nevezünk egy opciót, ha nem egyszerű európai vagy amerikai call vagy put. A szokványos szerződéstől kétféleképpen lehet eltérni. A kifizetés lehet $S_T$ más függvénye, például egy rögzített pénzösszeg. Vagy a kifizetés lehet **útfüggő**: a $T$ előtti árfolyamoktól is függ, például az út maximumától vagy átlagától."),
    p("A különbség a fedezésnél számít. Egy $f(S_T)$ európai kifizetés statikusan felépíthető kötvényekből, határidős ügyletből és egyszerű opciókból, ahogy a Carr–Madan-felbontás megmutatta. Útfüggő kifizetésre ez általában nem igaz: két út, amely ugyanabban az $S_T$-ben ér véget, eltérő összeget fizethet, így $S_T$ függvényét fizető eszközökből álló portfólió nem képes követni. Az árazási szabály viszont nem változik: az ár továbbra is az $X$ kifizetés diszkontált $\\mathbb{Q}$ szerinti várható értéke:"),
    eq("V_0 = e^{-rT}\\,\\mathbb{E}^{\\mathbb{Q}}[X]."),

    h("Digitális opciók"),
    p("A **digitális** (cash-or-nothing) call $T$-ben 1-et fizet, ha $S_T > K$, egyébként semmit. Kifizetése az $\\mathbf{1}\\{S_T > K\\}$ indikátor: lépcső, nem rámpa. A várható kifizetés annak kockázatsemleges valószínűsége, hogy az ár a kötési ár fölött zár; „A Black–Scholes-képlet” ezt $N(d_2)$-ként azonosította. Diszkontálva"),
    eq("D_0 = e^{-rT}\\,\\mathbb{Q}(S_T > K) = e^{-rT} N(d_2), \\qquad d_2 = \\frac{\\ln(S_0/K) + (r - \\tfrac12\\sigma^2)T}{\\sigma\\sqrt{T}}."),
    p("$S_0 = K = 100$, $r = 5\\%$, $\\sigma = 20\\%$ és $T = 1$ mellett $d_2 = 0{,}03/0{,}2 = 0{,}15$, $N(d_2) \\approx 0{,}5596$ és $D_0 \\approx 0{,}5323$. A digitális opció még európai kifizetés: a „Pozíciók kombinálása” lecke szűk call-spreadjének határesete, ahol $1/h$ darab $K$ kötési árú callt veszünk és $1/h$ darab $K + h$ kötési árú callt eladunk, $h \\to 0$ mellett."),
    p("A deltája mutatja, miért nehéz fedezni. $D_0$-t $S_0$ szerint deriválva $\\Delta = e^{-rT}\\varphi(d_2)/(S_0\\sigma\\sqrt{T})$, ahol $\\varphi$ a standard normális sűrűségfüggvény. Az $1/\\sqrt{T}$ tényező miatt a pénznél lévő opció deltája a lejárat közeledtével felrobban: egy évvel a lejárat előtt kb. $0{,}019$, egy hónappal előtte $0{,}069$, egy nappal előtte $0{,}381$. A lejárat közelében a fedezőpozíciónak szinte semmiből nagy pozícióba kell átlendülnie, ahogy az ár átlépi $K$-t."),
    {
      kind: "check",
      id: "exotic-options/digital-price",
      prompt: "Egy cash-or-nothing call 1-et fizet, ha $S_T > K$. $S_0 = K = 100$, $r = 5\\%$, $\\sigma = 20\\%$ és $T = 1$ mellett mennyit ér ma?",
      answer: { type: "number", value: 0.5323, tolerance: 0.002 },
      explain: "$d_2 = 0{,}15$ és $N(0{,}15) \\approx 0{,}5596$, így $D_0 = e^{-0{,}05} \\cdot 0{,}5596 \\approx 0{,}5323$.",
    },
    {
      kind: "worked",
      title: "Egy pénzen kívüli digitális call",
      steps: [
        { text: "Ugyanaz a piac, a kötési ár $K = 110$-re nő:", tex: "d_2 = \\frac{\\ln(100/110) + (0{,}05 - 0{,}02) \\cdot 1}{0{,}2}", result: { value: -0.3266, tolerance: 0.001 } },
        { text: "Annak kockázatsemleges valószínűsége, hogy az ár 110 fölött zár:", tex: "N(d_2)", result: { value: 0.372, tolerance: 0.001 } },
        { text: "Diszkontáljuk az 1-es kifizetés várható értékét:", tex: "D_0 = e^{-0{,}05} \\cdot 0{,}372", result: { value: 0.3539, tolerance: 0.001 } },
      ],
    },

    h("Barrier opciók"),
    p("A **barrier opció** olyan egyszerű opció, amely kikapcsol vagy bekapcsol, ha az árfolyam eléri a $B$ szintet. A **kiütéses** (knock-out) opció megszűnik és semmit sem fizet, ha az árfolyam $T$ előtt eléri a korlátot; a **beütéses** (knock-in) opció csak akkor lép életbe, ha eléri. A leggyakoribb példa a $B > K$ korlátú **felső kiütéses call** (up-and-out call). Jelölje $M_T$ az út maximumát $T$-ig; ekkor a kifizetés"),
    eq("X = (S_T - K)^+\\,\\mathbf{1}\\{M_T < B\\}."),
    p("Ez a kifizetés sosem nagyobb az egyszerű callénál, ezért a felső kiütéses call olcsóbb. Éppen azokat az utakat veszíti el, amelyek a call tulajdonosának a legtöbbet érnék: a nagyot emelkedőket. Ha $B$ a $K$ felé csökken, az értéke nullához tart, hiszen egy $K \\ge B$ fölött záró útnak érintenie kellett $B$-t. Ha $B$ nő, a korlátot egyre ritkábban érik el, és az ár az egyszerű call árához közelít."),
    p("A volatilitás két irányba hat. Nagyobb $\\sigma$ mellett valószínűbbek a nagy végső kifizetések, ez emeli az egyszerű call árát, de valószínűbb az is, hogy az út eléri $B$-t. Ha a korlát közel van az azonnali árfolyamhoz, a második hatás erősebb, és a felső kiütéses call $\\sigma$ növelésével olcsóbbá válhat."),
    {
      kind: "check",
      id: "exotic-options/up-and-out-cheaper",
      prompt: "Hasonlíts össze egy felső kiütéses callt ($B > K$ korláttal) az azonos $K$ kötési árú és $T$ lejáratú egyszerű callal.",
      answer: { type: "choice", options: ["A felső kiütéses call kevesebbet ér", "A felső kiütéses call többet ér", "Ugyanannyit érnek", "Attól függ, eléri-e az ár $B$-t"], correct: 0 },
      explain: "Minden úton a barrier opció kifizetése legfeljebb akkora, mint az egyszerűé, és a $B$-t elérő utakon nulla, miközben az egyszerű call fizethet. Ezért olcsóbb, éppen a felső beütéses call értékével.",
    },

    h("Be–ki paritás"),
    p("Tartsunk egy felső beütéses és egy felső kiütéses callt ugyanazzal a $K$, $B$ és $T$ paraméterrel. Minden úton pontosan az egyik él, és az élő $(S_T - K)^+$-t fizet. Együtt tehát minden úton az egyszerű call kifizetését adják, így az egy ár törvénye szerint"),
    eq("C_0^{\\text{in}} + C_0^{\\text{out}} = C_0."),
    p("A két barrier opció közül az egyiket beárazva a másik ára is adott."),

    h("Diszkrét és folytonos megfigyelés"),
    p("A szerződésnek rögzítenie kell, hogyan ellenőrzik a korlátot. A tankönyvi képletek **folytonos megfigyelést** feltételeznek: az árfolyamot minden pillanatban figyelik. A valódi szerződések gyakran **diszkrét megfigyelést** használnak, például minden napi záróárnál. Egy út két megfigyelési időpont között átlépheti $B$-t, majd észrevétlenül visszatérhet, ezért a diszkréten megfigyelt kiütéses opciót ritkábban ütik ki, és többet ér folytonosan megfigyelt változatánál. Az alábbi ábra az év során 100 időpontban figyel."),

    h("Ázsiai opciók"),
    p("Az **ázsiai opció** a végső ár helyett a $t_1, \\dots, t_n$ megfigyelési időpontokban mért árak átlagára fizet. A számtani átlagra szóló ázsiai call kifizetése"),
    eq("X = (A_T - K)^+, \\qquad A_T = \\frac{1}{n}\\sum_{k=1}^{n} S_{t_k}."),
    p("Az átlag kevésbé mozog, mint maga az árfolyam: az átlag korai tagjainak kevés idejük volt elsodródni, és az eltéréseik részben kioltják egymást. A teljes időszakra vett átlag volatilitása nagyjából $\\sigma/\\sqrt{3}$, $\\sigma = 20\\%$ mellett kb. 11,5%. Kisebb volatilitás kisebb időértéket jelent, ezért az ázsiai call olcsóbb az egyszerűnél. Az átlagolás ráadásul megnehezíti, hogy valaki egyetlen nap árfolyamának mozgatásával befolyásolja a kifizetést."),
    p("Lognormális árak összege nem lognormális, ezért a számtani átlagú ázsiai callra nincs zárt képlet. A mértani átlag lognormális, és van rá Black–Scholes-típusú képlet; mivel szorosan együtt mozog a számtanival, a „Monte Carlo-opcióárazás” értelmében természetes kontrollváltozó."),

    h("Árazás Monte Carlo-módszerrel"),
    p("Útfüggő kifizetésnél nem elég $S_T$ egyetlen sorsolása: a teljes útra szükség van a megfigyelési időpontokban. $\\mathbb{Q}$ alatt a részvény $r$ driftű geometriai Brown-mozgást követ, és a pontos megoldás $\\Delta t = T/n$ lépésekben halad egyik időpontról a következőre:"),
    eq("S_{t_{k+1}} = S_{t_k}\\exp\\big((r - \\tfrac12\\sigma^2)\\Delta t + \\sigma\\sqrt{\\Delta t}\\,Z_{k+1}\\big)."),
    steps(
      "Szimulálj $N$ utat az $n$ megfigyelési időpontban független standard normális $Z$-kkel.",
      "Minden úton jegyezd fel, amire a kifizetésnek szüksége van: $S_T$, a futó maximum $M_T$, az átlag $A_T$.",
      "Számold ki minden út kifizetését, átlagold az $N$ útra, és szorozd meg $e^{-rT}$-vel.",
    ),
    p("Ugyanazok az utak egyszerre árazzák az összes szerződést; csak a kifizetésfüggvény változik. A standard hiba úgy viselkedik, ahogy a „Monte Carlo-opcióárazás” lecke leírta."),

    h("Számpélda"),
    p("Legyen $S_0 = 100$, $K = 100$, $r = 5\\%$, $T = 1$, $\\sigma = 20\\%$, 100 megfigyelési időpont, $B = 130$ korlát, és szimuláljunk 20 000 utat (1-es seed). A becslések:"),
    list(
      "Egyszerű call: $10{,}37$; a Black–Scholes-ár $10{,}45$, nagyjából egy standard hibán ($\\approx 0{,}10$) belül.",
      "Ázsiai call: $5{,}77$, az egyszerű call árának valamivel több mint fele.",
      "Felső kiütéses call $B = 130$ mellett: $3{,}69$, így a be–ki paritás szerint a felső beütéses call értéke $10{,}37 - 3{,}69 = 6{,}68$.",
      "Az 1-et fizető digitális call: $0{,}530$, szemben a zárt $e^{-rT}N(d_2) \\approx 0{,}532$ értékkel.",
    ),
    p("A korlát az egyszerű call értékének csaknem kétharmadát elviszi, mert 20%-os volatilitás mellett egy év alatt egy 30%-os emelkedés nem ritka."),
    p("Az ábra ezekkel a beállításokkal dolgozik: $S_0 = 100$, $K = 100$, $r = 5\\%$, $T = 1$, 20 000 $\\mathbb{Q}$ alatt szimulált út, 100 megfigyelési időponttal. A csúszkák a $\\sigma$ volatilitást (10%-tól 50%-ig) és a $B$ korlátszintet (105-től 250-ig) állítják, az „Új minta” gomb új utakat sorsol. A grafikon a felső kiütéses call árát mutatja $B$ függvényében 105 és 250 között, az egyszerű call Black–Scholes-árával mint vízszintes vonallal és egy függőleges vonallal a választott $B$-nél. A kijelzők a Monte Carlo-val becsült egyszerű callt, az ázsiai callt, a $B$ korlátú felső kiütéses callt és az 1-et fizető digitális callt mutatják. Told le $B$-t $K$ felé, és figyeld, ahogy a barrier opció ára nullára esik. Aztán emeld $\\sigma$-t: az egyszerű call drágul, a $B = 130$ korlátú felső kiütéses call viszont olcsóbb lesz, 20%-nál kb. $3{,}69$-ről 30%-nál kb. $1{,}88$-ra."),
    figure("exotic-prices"),
    note("Az útfüggő opciókra ritkán van zárt képlet, de ugyanazzal a szabállyal árazhatók, mint bármely más követelés: szimulálj utakat $\\mathbb{Q}$ alatt, értékeld ki a kifizetést minden úton, átlagold és diszkontáld."),

    h("Összefoglalás"),
    list(
      "Egzotikus az az opció, amelynek kifizetése nem szokványos vagy az úttól függ; útfüggő kifizetés általában nem replikálható statikusan egyszerű opciókkal.",
      "A digitális call 1-et fizet, ha $S_T > K$; ára $e^{-rT}N(d_2)$, deltája a lejárat előtt a pénznél kiugrik.",
      "A felső kiütéses call olcsóbb az egyszerűnél, értéke nullához tart, ahogy $B$ közelít $K$-hoz, és teljesül $C_0^{\\text{in}} + C_0^{\\text{out}} = C_0$; diszkrét megfigyelésnél ritkábban ütik ki.",
      "Az átlagolás csökkenti a volatilitást, ezért a számtani átlagú ázsiai call olcsóbb az egyszerűnél, és nincs rá zárt képlet.",
      "A Monte Carlo-módszer ugyanazokból a megfigyelési időpontokban szimulált utakból mindegyiket beárazza.",
    ),
    lab("/monte-carlo", "Szimulálj kockázatsemleges utakat és árazz kifizetéseket a Monte Carlo laborban"),
  ],
};
