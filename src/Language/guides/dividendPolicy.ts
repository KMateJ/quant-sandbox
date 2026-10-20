import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const dividendPolicy: GuideLessonContent = {
  en: [
    p("A share entitles its owner to the dividends the firm will pay. Valuing it is therefore a discounting problem of the kind solved in \"Interest, compounding and discounting\", and with steady growth the sum collapses to the growing perpetuity of \"Annuities, perpetuities and loan amortization\". This lesson derives that formula, shows where the growth comes from, and asks the question that \"Capital structure and the Modigliani–Miller theorems\" asked about debt, now about payout: does it matter how much of its earnings a firm pays out?"),

    h("Dividends and the dividend discount model"),
    p("Let $D_t$ be the dividend per share expected at the end of year $t$, and $k$ the return shareholders require on a share of this risk, the **cost of equity**. The price today is the present value of all future dividends, the **dividend discount model**:"),
    eq("P_0 = \\sum_{t=1}^{\\infty} \\frac{D_t}{(1+k)^t}."),
    p("A share has no maturity, so the sum is infinite. It may seem that an investor who plans to sell after a year is buying the dividend and the sale price, not an infinite stream; but the sale price is itself the present value of the dividends from year 2 on, so the two views agree."),

    h("The Gordon growth formula"),
    p("If dividends grow at a constant rate $g$, so that $D_t = D_1 (1+g)^{t-1}$, the sum is a growing perpetuity. Provided $g < k$ it converges to the **Gordon growth formula**:"),
    eq("P_0 = \\frac{D_1}{k - g}."),
    p("The formula is simple, and it is very sensitive near $g = k$: as the growth rate approaches the discount rate the denominator goes to zero and the price explodes. For $g \\ge k$ the sum diverges and the formula has no meaning; no firm can grow faster than the discount rate for ever. Rearranged, $k = D_1/P_0 + g$: the required return is the dividend yield plus the growth rate."),

    h("Growth from retained earnings"),
    p("Growth is not free. A firm grows its earnings by reinvesting part of them. Let $E_1$ be next year's earnings per share (EPS), $d$ the **payout ratio** (the share of earnings paid as dividends) and $b = 1 - d$ the **retention ratio**. If retained earnings are invested at a **return on equity** ROE, earnings and dividends grow at"),
    eq("g = b \\cdot \\text{ROE}, \\qquad D_1 = d \\cdot E_1, \\qquad P_0 = \\frac{d\\,E_1}{k - b\\,\\text{ROE}}."),
    p("Here is the trade-off. Retaining more lowers today's dividend but raises the growth rate. Which effect wins depends only on how ROE compares with $k$. If the firm earns more on reinvested money than shareholders require, retention creates value and the price rises as the payout falls. If it earns less, retention destroys value, and shareholders would be better off receiving the cash."),
    figure("payout-ddm"),
    p("The figure plots the Gordon price against the payout ratio for EPS of 5, with the flat line $E_1/k$ for comparison. At the defaults (ROE 12%, $k$ 10%, payout 40%) the growth rate is 7.20%, the dividend is 2.00, the price is 71.43 and the PVGO (defined below) is 21.43. Set ROE below $k$ and the curve slopes the other way; set it equal to $k$ and the curve lies on the flat line. Points where $g \\ge k$ are left off, and the readouts show a dash."),
    {
      kind: "worked",
      title: "Pricing the default share",
      steps: [
        { text: "Growth from retention of 60% at an ROE of 12%.", tex: "g = 0.6 \\times 0.12", result: { value: 0.072, tolerance: 0.0001 } },
        { text: "Next year's dividend at a 40% payout of EPS 5.", tex: "D_1 = 0.4 \\times 5", result: { value: 2, tolerance: 0.001 } },
        { text: "The Gordon price.", tex: "P_0 = \\frac{2}{0.10 - 0.072}", result: { value: 71.43, tolerance: 0.01 } },
        { text: "The no-growth value: all earnings paid out for ever.", tex: "\\frac{E_1}{k} = \\frac{5}{0.10}", result: { value: 50, tolerance: 0.01 } },
        { text: "The present value of growth opportunities.", tex: "\\text{PVGO} = 71.43 - 50", result: { value: 21.43, tolerance: 0.01 } },
      ],
    },
    {
      kind: "check",
      id: "dividend-policy/full-payout",
      prompt: "EPS is 5 and the cost of equity is 10%. What is the Gordon price if the firm pays out all its earnings (payout 100%)?",
      answer: { type: "number", value: 50, tolerance: 0.01 },
      explain: "With full payout nothing is retained, so $g = 0$ and $D_1 = 5$. The price is $5 / 0.10 = 50$, the no-growth value $E_1/k$, whatever the ROE.",
    },

    h("Payout irrelevance"),
    p("Now set ROE equal to $k$. The price becomes $d E_1 / (k - (1-d)k) = E_1/k$ for every payout ratio: in the figure the curve sits on the flat line. Reinvesting at exactly the required return neither creates nor destroys value, so how earnings are split between dividends and reinvestment does not matter."),
    p("Miller and Modigliani showed that this holds far more generally. In perfect capital markets (no taxes, no transaction costs, no information asymmetry) and with the investment policy fixed, the payout policy does not affect the value of the firm. The argument is the same as for capital structure: investors can undo any policy themselves. A shareholder who wants more cash than the firm pays can sell a few shares, a **homemade dividend**; one who wants less can reinvest the dividend in more shares. Since anyone can build the payout they want at no cost, no one pays extra for a particular policy."),
    p("The same reasoning covers **share buybacks**. Paying 100 as a dividend or using it to repurchase shares hands shareholders the same cash; the dividend leaves every holder with the same number of shares at a lower price, the buyback leaves fewer shares at an unchanged price. In perfect markets the two are equivalent."),
    {
      kind: "check",
      id: "dividend-policy/irrelevance",
      prompt: "In the dividend discount model with growth from retained earnings, when does the payout ratio have no effect on the share price?",
      answer: { type: "choice", options: ["Whenever ROE is above the cost of equity", "When ROE equals the cost of equity and markets have no frictions", "Only when the payout ratio is 100%", "Never: a higher payout always raises the price"], correct: 1 },
      explain: "With ROE = $k$ the price is $E_1/k$ for every payout, and the Miller–Modigliani argument needs perfect markets (no taxes, costs or information gaps) so that homemade dividends are free. With ROE above $k$ retention adds value; below $k$ it destroys value.",
    },

    h("When payout matters"),
    p("**Taxes.** Where dividends are taxed more heavily than capital gains, or the gain can be deferred until a sale, cash paid as a dividend is worth less to the shareholder than the same cash returned through a buyback. Different tax positions also attract different investors to different policies, the so-called clientele effect."),
    p("**Signalling.** Managers know more about future earnings than outside investors. Because firms are reluctant to cut dividends, raising one is a costly and therefore credible signal that management expects earnings to hold up, and prices often react to dividend announcements accordingly."),
    p("**Agency.** Cash left inside the firm can be spent on projects that serve managers rather than shareholders. Committing to pay it out reduces that risk, which is one reason mature firms with few good projects pay high dividends."),

    h("The present value of growth opportunities"),
    p("The Gordon price can be split into the value of the current earnings, paid out for ever, and the rest:"),
    eq("P_0 = \\frac{E_1}{k} + \\text{PVGO}."),
    p("The **present value of growth opportunities** (PVGO) is the part of the price that comes from future investments. It is positive only if those investments earn more than $k$; it is zero when ROE equals $k$, however much the firm reinvests; and it is negative when ROE is below $k$ and the firm keeps reinvesting. A high PVGO share is a growth stock whose price depends on projects it has not yet made."),
    note("The dividend discount model values equity directly. The discounted cash flow valuation later in this track values the whole firm from its free cash flows and uses the same Gordon formula for the terminal value."),

    h("Summary"),
    list(
      "The dividend discount model prices a share as the present value of all future dividends at the cost of equity $k$.",
      "With constant growth $g < k$ it reduces to the Gordon formula $P_0 = D_1/(k - g)$.",
      "Growth comes from retained earnings, $g = b \\cdot \\text{ROE}$; retention raises the price if and only if ROE exceeds $k$.",
      "With ROE = $k$ and perfect markets, payout is irrelevant: homemade dividends and buybacks undo any policy.",
      "Taxes, signalling and agency costs are the reasons payout matters in practice.",
      "PVGO $= P_0 - E_1/k$ is the value of future growth; at the defaults it is 21.43 of a 71.43 price.",
    ),
    lab("/valuation", "Open the Valuation Lab to see the Gordon formula at work in a terminal value"),
  ],
  hu: [
    p("A részvény tulajdonosát megilletik a vállalat által kifizetendő osztalékok. Az értékelése tehát olyan diszkontálási feladat, amilyet a „Kamat, kamatozás és diszkontálás” megoldott, és egyenletes növekedés mellett az összeg az „Annuitások, örökjáradékok és hiteltörlesztés” növekvő örökjáradékává egyszerűsödik. Ez a lecke levezeti ezt a képletet, megmutatja, honnan jön a növekedés, és azt a kérdést teszi fel a kifizetésről, amelyet a „Tőkeszerkezet és a Modigliani–Miller-tételek” az adósságról: számít-e, hogy a vállalat a nyereségének mekkora részét fizeti ki?"),

    h("Osztalékok és az osztalékdiszkont-modell"),
    p("Legyen $D_t$ a $t$-edik év végén várt egy részvényre jutó osztalék, $k$ pedig az ilyen kockázatú részvénytől elvárt hozam, a **sajáttőke-költség**. A mai ár az összes jövőbeli osztalék jelenértéke, ez az **osztalékdiszkont-modell**:"),
    eq("P_0 = \\sum_{t=1}^{\\infty} \\frac{D_t}{(1+k)^t}."),
    p("A részvénynek nincs lejárata, ezért az összeg végtelen. Úgy tűnhet, hogy aki egy év múlva eladja a részvényt, az osztalékot és az eladási árat veszi meg, nem egy végtelen sort; csakhogy az eladási ár maga is a 2. évtől kezdődő osztalékok jelenértéke, így a két nézőpont ugyanazt adja."),

    h("A Gordon-féle növekedési képlet"),
    p("Ha az osztalékok állandó $g$ ütemben nőnek, vagyis $D_t = D_1 (1+g)^{t-1}$, az összeg növekvő örökjáradék. Ha $g < k$, akkor a **Gordon-féle növekedési képlethez** konvergál:"),
    eq("P_0 = \\frac{D_1}{k - g}."),
    p("A képlet egyszerű, és $g = k$ közelében nagyon érzékeny: ahogy a növekedési ütem megközelíti a diszkontrátát, a nevező nullához tart, az ár pedig elszáll. Ha $g \\ge k$, az összeg divergál, és a képletnek nincs értelme; egyetlen vállalat sem nőhet örökké gyorsabban a diszkontrátánál. Átrendezve $k = D_1/P_0 + g$: az elvárt hozam az osztalékhozam és a növekedési ütem összege."),

    h("Növekedés a visszatartott nyereségből"),
    p("A növekedés nem ingyenes. A vállalat úgy növeli a nyereségét, hogy egy részét visszaforgatja. Legyen $E_1$ a jövő évi egy részvényre jutó nyereség (EPS), $d$ a **kifizetési arány** (a nyereség osztalékként kifizetett hányada), $b = 1 - d$ pedig a **visszatartási arány**. Ha a visszatartott nyereséget **sajáttőke-arányos megtérüléssel** (ROE) fekteti be, a nyereség és az osztalék üteme"),
    eq("g = b \\cdot \\text{ROE}, \\qquad D_1 = d \\cdot E_1, \\qquad P_0 = \\frac{d\\,E_1}{k - b\\,\\text{ROE}}."),
    p("Ez a mérlegelés lényege. A nagyobb visszatartás csökkenti a mai osztalékot, de növeli a növekedési ütemet. Hogy melyik hatás győz, csak azon múlik, hogyan viszonyul a ROE a $k$-hoz. Ha a vállalat többet keres a visszaforgatott pénzen, mint amit a részvényesek elvárnak, a visszatartás értéket teremt, és az ár a kifizetés csökkenésével nő. Ha kevesebbet, a visszatartás értéket rombol, és a részvényesek jobban járnának, ha megkapnák a pénzt."),
    figure("payout-ddm"),
    p("Az ábra a Gordon-féle árat mutatja a kifizetési arány függvényében 5-ös EPS mellett, összehasonlításként a vízszintes $E_1/k$ vonallal. Az alapbeállításokon (ROE 12%, $k$ 10%, kifizetés 40%) a növekedési ütem 7,20%, az osztalék 2,00, az ár 71,43, a (lent definiált) PVGO pedig 21,43. Ha a ROE-t $k$ alá állítod, a görbe a másik irányba lejt; ha egyenlővé teszed vele, a görbe a vízszintes vonalra kerül. Azokat a pontokat, ahol $g \\ge k$, az ábra kihagyja, a kijelzők pedig gondolatjelet mutatnak."),
    {
      kind: "worked",
      title: "Az alapbeállítású részvény árazása",
      steps: [
        { text: "Növekedés 60%-os visszatartásból 12%-os ROE mellett.", tex: "g = 0{,}6 \\times 0{,}12", result: { value: 0.072, tolerance: 0.0001 } },
        { text: "A jövő évi osztalék az 5-ös EPS 40%-os kifizetésével.", tex: "D_1 = 0{,}4 \\times 5", result: { value: 2, tolerance: 0.001 } },
        { text: "A Gordon-féle ár.", tex: "P_0 = \\frac{2}{0{,}10 - 0{,}072}", result: { value: 71.43, tolerance: 0.01 } },
        { text: "A növekedés nélküli érték: a teljes nyereség örökké kifizetve.", tex: "\\frac{E_1}{k} = \\frac{5}{0{,}10}", result: { value: 50, tolerance: 0.01 } },
        { text: "A növekedési lehetőségek jelenértéke.", tex: "\\text{PVGO} = 71{,}43 - 50", result: { value: 21.43, tolerance: 0.01 } },
      ],
    },
    {
      kind: "check",
      id: "dividend-policy/full-payout",
      prompt: "Az EPS 5, a sajáttőke-költség 10%. Mennyi a Gordon-féle ár, ha a vállalat a teljes nyereségét kifizeti (100%-os kifizetés)?",
      answer: { type: "number", value: 50, tolerance: 0.01 },
      explain: "Teljes kifizetésnél semmit sem tart vissza, így $g = 0$ és $D_1 = 5$. Az ár $5 / 0{,}10 = 50$, a növekedés nélküli $E_1/k$ érték, a ROE-tól függetlenül.",
    },

    h("A kifizetés irrelevanciája"),
    p("Most legyen a ROE egyenlő $k$-val. Az ár $d E_1 / (k - (1-d)k) = E_1/k$ minden kifizetési arányra: az ábrán a görbe a vízszintes vonalon fekszik. A pontosan az elvárt hozamon történő visszaforgatás nem teremt és nem is rombol értéket, így mindegy, hogyan oszlik meg a nyereség osztalék és visszaforgatás között."),
    p("Miller és Modigliani megmutatta, hogy ez sokkal általánosabban is igaz. Tökéletes tőkepiacon (nincs adó, tranzakciós költség, információs aszimmetria) és rögzített beruházási politika mellett a kifizetési politika nem befolyásolja a vállalat értékét. Az érv ugyanaz, mint a tőkeszerkezetnél: a befektetők bármely politikát maguk is visszacsinálhatnak. Aki több pénzt szeretne, mint amennyit a vállalat fizet, eladhat néhány részvényt, ez a **házi osztalék**; aki kevesebbet, az osztalékot újabb részvényekbe forgathatja. Mivel bárki ingyen előállíthatja a kívánt kifizetést, senki sem fizet többet egy adott politikáért."),
    p("Ugyanez az érvelés vonatkozik a **saját részvény visszavásárlására**. Ha a vállalat 100-at osztalékként fizet ki, vagy ugyanezzel részvényeket vásárol vissza, a részvényesek ugyanannyi készpénzt kapnak; az osztalék után minden tulajdonosnak ugyanannyi részvénye marad alacsonyabb áron, a visszavásárlás után kevesebb részvény marad változatlan áron. Tökéletes piacon a kettő egyenértékű."),
    {
      kind: "check",
      id: "dividend-policy/irrelevance",
      prompt: "A visszatartott nyereségből növekvő osztalékdiszkont-modellben mikor nincs hatása a kifizetési aránynak a részvényárra?",
      answer: { type: "choice", options: ["Mindig, ha a ROE nagyobb a sajáttőke-költségnél", "Ha a ROE egyenlő a sajáttőke-költséggel, és a piacon nincsenek súrlódások", "Csak 100%-os kifizetési aránynál", "Soha: a nagyobb kifizetés mindig emeli az árat"], correct: 1 },
      explain: "ROE = $k$ esetén az ár minden kifizetésnél $E_1/k$, a Miller–Modigliani-érvhez pedig tökéletes piac kell (nincs adó, költség, információs rés), hogy a házi osztalék ingyenes legyen. Ha a ROE nagyobb $k$-nál, a visszatartás értéket ad; ha kisebb, értéket rombol.",
    },

    h("Amikor a kifizetés számít"),
    p("**Adók.** Ahol az osztalékot magasabb adó terheli, mint az árfolyamnyereséget, vagy a nyereség adója az eladásig halasztható, az osztalékként kifizetett egy forint kevesebbet ér a részvényesnek, mint a visszavásárlással visszaadott. A különböző adóhelyzetek különböző befektetőket vonzanak a különböző politikákhoz, ez az úgynevezett klientúrahatás."),
    p("**Jelzés.** A vezetők többet tudnak a jövőbeli nyereségről, mint a külső befektetők. Mivel a vállalatok nem szívesen csökkentik az osztalékot, egy emelés költséges, ezért hihető jelzés arról, hogy a vezetés tartósnak várja a nyereséget, és az árak gyakran ennek megfelelően reagálnak az osztalékbejelentésekre."),
    p("**Ügynökprobléma.** A vállalatban hagyott készpénzt olyan projektekre is el lehet költeni, amelyek a vezetőket szolgálják, nem a részvényeseket. A kifizetés vállalása csökkenti ezt a kockázatot; ez az egyik oka, hogy a kevés jó projekttel rendelkező, érett vállalatok magas osztalékot fizetnek."),

    h("A növekedési lehetőségek jelenértéke"),
    p("A Gordon-féle ár felbontható a jelenlegi, örökké kifizetett nyereség értékére és a maradékra:"),
    eq("P_0 = \\frac{E_1}{k} + \\text{PVGO}."),
    p("A **növekedési lehetőségek jelenértéke** (PVGO) az ár azon része, amely a jövőbeli beruházásokból származik. Csak akkor pozitív, ha ezek a beruházások többet hoznak $k$-nál; nulla, ha a ROE egyenlő $k$-val, akármennyit forgat is vissza a vállalat; és negatív, ha a ROE $k$ alatt van, a vállalat mégis visszaforgat. A magas PVGO-jú részvény növekedési részvény, amelynek ára még meg nem valósított projekteken múlik."),
    note("Az osztalékdiszkont-modell közvetlenül a saját tőkét értékeli. A pálya későbbi részén a diszkontált pénzáramos értékelés a teljes vállalatot értékeli a szabad pénzáramaiból, és a maradványértékhez ugyanezt a Gordon-képletet használja."),

    h("Összefoglalás"),
    list(
      "Az osztalékdiszkont-modell a részvényt az összes jövőbeli osztalék $k$ sajáttőke-költséggel számolt jelenértékeként árazza.",
      "Állandó $g < k$ növekedésnél a Gordon-képletre egyszerűsödik: $P_0 = D_1/(k - g)$.",
      "A növekedés a visszatartott nyereségből jön, $g = b \\cdot \\text{ROE}$; a visszatartás pontosan akkor emeli az árat, ha a ROE nagyobb $k$-nál.",
      "ROE = $k$ és tökéletes piac mellett a kifizetés irreleváns: a házi osztalék és a visszavásárlás bármely politikát visszacsinál.",
      "Az adók, a jelzés és az ügynökköltségek miatt számít a kifizetés a gyakorlatban.",
      "A PVGO $= P_0 - E_1/k$ a jövőbeli növekedés értéke; az alapbeállításokon a 71,43-as árból 21,43.",
    ),
    lab("/valuation", "Nyisd meg az Értékelés labort, és nézd meg a Gordon-képletet a maradványértékben"),
  ],
};
