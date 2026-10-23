import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const optionsOnOtherUnderlyings: GuideLessonContent = {
  en: [
    p("\"The Black–Scholes formula\" prices an option on a stock that pays no dividends. Real underlyings are more varied: stocks and indices pay dividends, a currency earns interest abroad, and a futures contract costs nothing to hold. This lesson shows that all of them need the same small change, and that the change is easiest to see through the forward price from \"Arbitrage and the forward price\"."),

    h("A continuous dividend yield"),
    p("Suppose the stock pays a dividend at a continuous rate $q$ of its price. Holding one share for time $T$ then also earns the dividends, which reinvested in the stock turn one share into $e^{qT}$ shares at expiry. To end with exactly one share, replicate with only $e^{-qT}$ shares today. The stock price that matters in the model is therefore the price net of dividends to come, $S_0 e^{-qT}$, and the formula is the old one with that substitution:"),
    eq("c = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2), \\qquad p = K e^{-rT} N(-d_2) - S_0 e^{-qT} N(-d_1),"),
    eq("d_1 = \\frac{\\ln(S_0/K) + (r - q + \\tfrac12\\sigma^2)\\,T}{\\sigma\\sqrt T}, \\qquad d_2 = d_1 - \\sigma\\sqrt T."),
    p("Only two things changed: the spot is discounted at $q$, and the drift in $d_1$ is $r - q$ instead of $r$. A higher yield makes a call cheaper and a put dearer, because dividends leave the stock lower at expiry. Setting $q = 0$ returns the original formula exactly."),

    h("The forward price as the common thread"),
    p("The forward price of the stock for delivery at $T$ is $F = S_0 e^{(r-q)T}$, as in \"Arbitrage and the forward price\" with the dividend income subtracted. Substitute $S_0 e^{-qT} = F e^{-rT}$ into the call formula and the yield disappears from view:"),
    eq("c = e^{-rT}\\,\\bigl[\\,F\\,N(d_1) - K\\,N(d_2)\\,\\bigr], \\qquad d_1 = \\frac{\\ln(F/K) + \\tfrac12\\sigma^2 T}{\\sigma\\sqrt T}."),
    p("This is the one formula behind every case below. The option depends on the underlying only through its forward price $F$, the strike and the volatility; what changes from one underlying to the next is how $F$ is built from today's price."),

    h("Index options"),
    p("A stock index pays the dividends of its many members, which add up to a fairly smooth stream. Treating it as a continuous yield $q$ is the standard approximation, and the formula above applies with $S_0$ the index level. A single stock paying a few large dividends is different: a common fix replaces $S_0$ by the price less the present value of the dividends due before expiry, and then uses the ordinary formula (the escrowed-dividend method). We do not derive it here."),

    h("Currency options: Garman–Kohlhagen"),
    p("Prices are quoted in the domestic currency per unit of foreign currency, with domestic rate $r_d$ and foreign rate $r_f$. A holder of the foreign currency earns the foreign interest rate, which plays exactly the role of a dividend yield: $q = r_f$. The forward exchange rate is $F = S_0 e^{(r_d - r_f)T}$, the covered interest parity relation, and the call is $e^{-r_d T}[F N(d_1) - K N(d_2)]$. This is the Garman–Kohlhagen formula."),

    h("Options on futures: Black-76"),
    p("A futures contract needs no investment to enter, so holding it earns nothing and costs nothing to finance. Its price behaves like a stock paying a yield equal to the interest rate, $q = r$, so $F e^{-rT}$ stands in for $S_0 e^{-qT}$ in the formula and the rate drops out of $d_1$. With $F$ the futures price, the call is again $e^{-rT}[F N(d_1) - K N(d_2)]$; this is the Black-76 formula, widely used for options on commodities, interest rate futures and, with forward yields, caps and swaptions. For the futures themselves see \"Bond futures and the cheapest-to-deliver\"."),
    p("The figure uses a stock with strike 100 and spot 100, volatility 20% and one year to expiry. At the defaults (rate 5%, dividend yield 3%) the call costs 8.65 against 10.45 without a yield, the put costs 6.73, and the forward is 102.02. Raise the yield and watch the call curve sink towards the payoff line; set it to zero and the two curves coincide."),
    figure("dividend-yield-price"),

    h("Put–call parity with a yield"),
    p("The relation from \"Put–call parity\" survives with the same substitution: a call minus a put is a forward, valued at today's money,"),
    eq("c - p = S_0 e^{-qT} - K e^{-rT}."),
    p("A call and a put on the same underlying, strike and expiry therefore carry the same information about the yield."),
    {
      kind: "check",
      id: "options-on-other-underlyings/put-from-call",
      prompt: "A stock at 50 pays a continuous dividend yield of 2%; the risk-free rate is 4%. A European call with strike 50 and six months to expiry costs 4.41. What is the put with the same strike and expiry?",
      answer: { type: "number", value: 3.92, tolerance: 0.02 },
      explain: "By parity $p = c - S_0 e^{-qT} + K e^{-rT} = 4.41 - 50e^{-0.01} + 50e^{-0.02} = 4.41 - 49.50 + 49.01 \\approx 3.92$.",
    },
    {
      kind: "check",
      id: "options-on-other-underlyings/black-76-yield",
      prompt: "Which yield turns the generalised formula into the Black-76 formula for an option on a futures price?",
      answer: { type: "choice", options: ["$q = 0$", "$q = r$", "$q = r_f - r$", "$q = \\sigma$"], correct: 1 },
      explain: "A futures contract earns no income and needs no financing, so it behaves like an asset whose yield equals the interest rate: $q = r$. Then $S_0 e^{(r-q)T}$ is simply the futures price.",
    },
    {
      kind: "worked",
      title: "A Garman–Kohlhagen call on EUR/USD",
      steps: [
        { text: "Forward rate (spot 1.10, dollar rate 5%, euro rate 3%, one year).", tex: "F = S_0\\,e^{(r_d - r_f)T}", result: { value: 1.1222, tolerance: 0.0005 } },
        { text: "With strike 1.10 and volatility 10%, the first normal argument.", tex: "d_1 = \\frac{\\ln(F/K) + \\tfrac12\\sigma^2 T}{\\sigma\\sqrt T}", result: { value: 0.25, tolerance: 0.002 } },
        { text: "The second argument.", tex: "d_2 = d_1 - \\sigma\\sqrt T", result: { value: 0.15, tolerance: 0.002 } },
        { text: "With $N(d_1) = 0.5987$ and $N(d_2) = 0.5596$, the call in dollars per euro.", tex: "c = e^{-r_d T}\\,[F\\,N(d_1) - K\\,N(d_2)]", result: { value: 0.0536, tolerance: 0.0004 } },
      ],
    },

    h("Summary"),
    list(
      "With a continuous yield $q$, replace $S_0$ by $S_0 e^{-qT}$ in the Black–Scholes formula; $d_1$ then has drift $r - q$.",
      "Every case is one formula in the forward price: $c = e^{-rT}[F N(d_1) - K N(d_2)]$ with $F = S_0 e^{(r-q)T}$.",
      "Indices use the dividend yield, currencies the foreign rate (Garman–Kohlhagen), futures $q = r$ (Black-76).",
      "Put–call parity becomes $c - p = S_0 e^{-qT} - K e^{-rT}$.",
    ),
    note("A later lesson, \"Implied volatility and the volatility smile\", turns the question around: given a market price, which $\\sigma$ does the formula need."),
    lab("/black-scholes", "Price calls and puts in the Black–Scholes lab"),
  ],
  hu: [
    p("„A Black–Scholes-képlet” egy osztalékot nem fizető részvényre szóló opciót árazott. A valódi alaptermékek változatosabbak: a részvények és az indexek osztalékot fizetnek, a deviza külföldön kamatot hoz, a határidős ügylet (future) tartása pedig semmibe sem kerül. Ez a lecke megmutatja, hogy mindegyikhez ugyanaz a kis módosítás kell, és hogy ez a módosítás az „Arbitrázs és a határidős ár” leckéből ismert forward áron keresztül látszik a legjobban."),

    h("Folytonos osztalékhozam"),
    p("Tegyük fel, hogy a részvény az árának folytonos $q$ hányadát fizeti osztalékként. Egy részvény $T$ ideig tartása ekkor az osztalékot is hozza, amelyet a részvénybe visszaforgatva egy részvényből lejáratkor $e^{qT}$ részvény lesz. Hogy pontosan egy részvénnyel zárjunk, ma csak $e^{-qT}$ részvénnyel kell replikálni. A modellben tehát a még várható osztalékokkal csökkentett ár számít, $S_0 e^{-qT}$, és a képlet a régi, ezzel a behelyettesítéssel:"),
    eq("c = S_0 e^{-qT} N(d_1) - K e^{-rT} N(d_2), \\qquad p = K e^{-rT} N(-d_2) - S_0 e^{-qT} N(-d_1),"),
    eq("d_1 = \\frac{\\ln(S_0/K) + (r - q + \\tfrac12\\sigma^2)\\,T}{\\sigma\\sqrt T}, \\qquad d_2 = d_1 - \\sigma\\sqrt T."),
    p("Csak két dolog változott: a spotot $q$-val diszkontáljuk, és $d_1$ driftje $r - q$ lett $r$ helyett. Magasabb hozam olcsóbbá teszi a callt és drágábbá a putot, mert az osztalék alacsonyabban hagyja a részvényt lejáratkor. $q = 0$ esetén pontosan az eredeti képletet kapjuk vissza."),

    h("A forward ár mint közös szál"),
    p("A részvény $T$ időpontra szóló forward ára $F = S_0 e^{(r-q)T}$, ahogy az „Arbitrázs és a határidős ár” leckében, levonva az osztalékjövedelmet. Ha az $S_0 e^{-qT} = F e^{-rT}$ összefüggést behelyettesítjük a call képletébe, a hozam eltűnik a képletből:"),
    eq("c = e^{-rT}\\,\\bigl[\\,F\\,N(d_1) - K\\,N(d_2)\\,\\bigr], \\qquad d_1 = \\frac{\\ln(F/K) + \\tfrac12\\sigma^2 T}{\\sigma\\sqrt T}."),
    p("Ez az egyetlen képlet áll az alábbi esetek mögött. Az opció az alaptermékről csak a forward árat, a kötési árat és a volatilitást „látja”; alaptermékenként csak az változik, hogyan áll össze $F$ a mai árból."),

    h("Indexopciók"),
    p("A tőzsdeindex sok összetevő osztalékát fizeti, amelyek együtt viszonylag egyenletes folyamot adnak. Ezt folytonos $q$ hozamként kezelni a szokásos közelítés, és a fenti képlet érvényes, ahol $S_0$ az index szintje. Egyetlen, néhány nagy osztalékot fizető részvény más eset: gyakori megoldás, hogy $S_0$ helyére a lejáratig esedékes osztalékok jelenértékével csökkentett árat írjuk, és a szokásos képletet használjuk (escrowed-dividend módszer). Ezt itt nem vezetjük le."),

    h("Devizaopciók: Garman–Kohlhagen"),
    p("Az árfolyamot belföldi pénznemben fejezzük ki egy egység külföldi pénzre, a belföldi kamatláb $r_d$, a külföldi $r_f$. A külföldi pénz birtokosa a külföldi kamatot keresi, ami pontosan az osztalékhozam szerepét tölti be: $q = r_f$. A határidős árfolyam $F = S_0 e^{(r_d - r_f)T}$, a fedezett kamatparitás, a call pedig $e^{-r_d T}[F N(d_1) - K N(d_2)]$. Ez a Garman–Kohlhagen-képlet."),

    h("Határidős ügyletre szóló opciók: Black-76"),
    p("A határidős ügylet megkötéséhez nem kell befektetés, ezért tartása sem hoz jövedelmet, sem finanszírozást nem igényel. Úgy viselkedik, mint egy olyan részvény, amelynek hozama a kamatlábbal egyenlő, $q = r$, így $F e^{-rT}$ áll $S_0 e^{-qT}$ helyén, és a kamatláb kiesik $d_1$-ből. Ha $F$ a határidős ár, a call ismét $e^{-rT}[F N(d_1) - K N(d_2)]$; ez a Black-76-képlet, amelyet széles körben használnak árutermékekre, kamatfuturesekre, és forward hozamokkal capekre és swaptionökre. Magukról a határidős ügyletekről lásd a „Kötvényfutures és a legolcsóbban szállítható kötvény” leckét."),
    p("Az ábra 100-as kötési árú és 100-as spotú részvényt használ, 20%-os volatilitással és egyéves lejárattal. Az alapbeállításnál (kamat 5%, osztalékhozam 3%) a call 8,65-be kerül a hozam nélküli 10,45-tel szemben, a put 6,73, a forward pedig 102,02. Emeld a hozamot, és nézd, hogyan süllyed a call görbéje a kifizetési vonal felé; nullán a két görbe egybeesik."),
    figure("dividend-yield-price"),

    h("Put–call paritás hozammal"),
    p("A „Put–call paritás” leckéből ismert összefüggés ugyanezzel a behelyettesítéssel érvényes marad: egy call mínusz egy put egy forward, mai pénzben értékelve,"),
    eq("c - p = S_0 e^{-qT} - K e^{-rT}."),
    p("Ugyanazon alaptermékre, kötési árra és lejáratra szóló call és put ezért ugyanazt mondja a hozamról."),
    {
      kind: "check",
      id: "options-on-other-underlyings/put-from-call",
      prompt: "Egy 50-es árú részvény folytonos 2%-os osztalékhozamot fizet; a kockázatmentes kamatláb 4%. Egy 50-es kötési árú, féléves európai call ára 4,41. Mennyi az ugyanilyen kötési árú és lejáratú put ára?",
      answer: { type: "number", value: 3.92, tolerance: 0.02 },
      explain: "A paritásból $p = c - S_0 e^{-qT} + K e^{-rT} = 4{,}41 - 50e^{-0{,}01} + 50e^{-0{,}02} = 4{,}41 - 49{,}50 + 49{,}01 \\approx 3{,}92$.",
    },
    {
      kind: "check",
      id: "options-on-other-underlyings/black-76-yield",
      prompt: "Melyik hozam teszi az általánosított képletet a határidős árra szóló opció Black-76-képletévé?",
      answer: { type: "choice", options: ["$q = 0$", "$q = r$", "$q = r_f - r$", "$q = \\sigma$"], correct: 1 },
      explain: "A határidős ügylet nem hoz jövedelmet és nem igényel finanszírozást, ezért úgy viselkedik, mint egy olyan eszköz, amelynek hozama a kamatlábbal egyenlő: $q = r$. Ekkor $S_0 e^{(r-q)T}$ éppen a határidős ár.",
    },
    {
      kind: "worked",
      title: "Garman–Kohlhagen-call az EUR/USD árfolyamra",
      steps: [
        { text: "Határidős árfolyam (spot 1,10, dollárkamat 5%, eurókamat 3%, egy év).", tex: "F = S_0\\,e^{(r_d - r_f)T}", result: { value: 1.1222, tolerance: 0.0005 } },
        { text: "1,10-es kötési árral és 10%-os volatilitással az első normális argumentum.", tex: "d_1 = \\frac{\\ln(F/K) + \\tfrac12\\sigma^2 T}{\\sigma\\sqrt T}", result: { value: 0.25, tolerance: 0.002 } },
        { text: "A második argumentum.", tex: "d_2 = d_1 - \\sigma\\sqrt T", result: { value: 0.15, tolerance: 0.002 } },
        { text: "$N(d_1) = 0{,}5987$ és $N(d_2) = 0{,}5596$ mellett a call ára dollárban, egy euróra vetítve.", tex: "c = e^{-r_d T}\\,[F\\,N(d_1) - K\\,N(d_2)]", result: { value: 0.0536, tolerance: 0.0004 } },
      ],
    },

    h("Összefoglalás"),
    list(
      "Folytonos $q$ hozam esetén a Black–Scholes-képletben $S_0$ helyére $S_0 e^{-qT}$ kerül; $d_1$ driftje ekkor $r - q$.",
      "Minden eset egyetlen képlet a forward árban: $c = e^{-rT}[F N(d_1) - K N(d_2)]$, ahol $F = S_0 e^{(r-q)T}$.",
      "Az index az osztalékhozamot, a deviza a külföldi kamatot (Garman–Kohlhagen), a határidős ügylet a $q = r$ értéket használja (Black-76).",
      "A put–call paritás $c - p = S_0 e^{-qT} - K e^{-rT}$ alakot ölt.",
    ),
    note("Egy későbbi lecke, az „Implikált volatilitás és a volatilitás-mosoly”, megfordítja a kérdést: adott piaci árhoz milyen $\\sigma$ kell a képletbe."),
    lab("/black-scholes", "Árazz callokat és putokat a Black–Scholes laborban"),
  ],
};
