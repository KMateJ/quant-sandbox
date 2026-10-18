import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, h, lab, list, note, p } from "./blocks";

export const wacc: GuideLessonContent = {
  en: [
    p("The lesson \"Net present value and internal rate of return\" discounted project cash flows at a rate $r$ without saying where that rate comes from. For a project with the same risk as the firm as a whole, the standard answer is the weighted average cost of capital. This lesson builds it from the returns demanded by the firm's two groups of investors."),

    h("Debt and equity"),
    p("A firm raises money from two kinds of investors. **Lenders** (bondholders, banks) provide **debt** $D$: they receive fixed interest payments and get their money back first if the firm fails. **Shareholders** provide **equity** $E$: they receive whatever is left after the lenders are paid, so their payoff is uncertain. The total value of the firm's financing is"),
    eq("V = D + E."),
    p("Think of the firm as a pie of cash flows shared between the two groups. The lenders' slice is smaller but safer; the shareholders' slice is larger on average but riskier."),

    h("Cost of equity"),
    p("The **cost of equity** $r_E$ is the annual return shareholders require for holding the firm's shares. Nobody quotes it directly; it must be estimated from the risk of the shares. The usual tool is the capital asset pricing model (CAPM), introduced in the lesson \"CAPM, beta and the security market line\":"),
    eq("r_E = r_f + \\beta_E\\,\\big(\\mathbb{E}[R_m] - r_f\\big),"),
    p("where $r_f$ is the risk-free rate, $\\mathbb{E}[R_m] - r_f$ the market risk premium, and $\\beta_E$ measures how strongly the share price moves with the market. Example: $r_f = 3\\%$, a market risk premium of $6\\%$ and $\\beta_E = 1.5$ give $r_E = 3\\% + 1.5 \\times 6\\% = 12\\%$."),
    {
      kind: "check",
      id: "wacc/cost-of-equity",
      prompt: "The risk-free rate is 2%, the market risk premium 5% and the firm's equity beta 1.2. What cost of equity does the CAPM give?",
      answer: { type: "number", value: 8, tolerance: 0.05, unit: "%" },
      explain: "$r_E = r_f + \\beta_E\\,(\\mathbb{E}[R_m] - r_f) = 2\\% + 1.2 \\times 5\\% = 8\\%$. The beta scales the market risk premium, not the whole market return.",
    },

    h("Cost of debt"),
    p("The **cost of debt** $r_D$ is the annual return lenders require, roughly the yield the firm pays on new borrowing. It is lower than $r_E$, because debt is paid first and its payments are fixed."),
    p("Interest has a second advantage: it is deducted from taxable profit. With a corporate tax rate $t$, every unit of interest paid lowers the tax bill by $t$ units. Example: a firm with $D = 400$ at $r_D = 6\\%$ pays 24 in interest per year; at $t = 25\\%$ this saves $0.25 \\times 24 = 6$ in tax. This saving is the **interest tax shield**. The effective cost of debt to the firm is therefore the **after-tax cost of debt**"),
    eq("r_D\\,(1 - t)."),
    p("In the example, $6\\% \\times (1 - 0.25) = 4.5\\%$."),

    h("The weighted average"),
    p("The firm as a whole must earn enough on its assets to pay both groups what they require. Weighting each cost by its share of the financing gives the **weighted average cost of capital**:"),
    eq("\\text{WACC} = \\frac{E}{V}\\,r_E + \\frac{D}{V}\\,r_D\\,(1 - t)."),
    note("The WACC is the return the firm's assets must earn to satisfy both shareholders and lenders after tax. It is the discount rate for projects with the same risk as the firm."),
    p("Example: $E = 600$ and $D = 400$, with $r_E = 12\\%$, $r_D = 6\\%$ and $t = 25\\%$."),
    {
      kind: "worked",
      title: "WACC of a firm with 600 of equity and 400 of debt",
      steps: [
        { text: "Equity's share of the financing, with $V = D + E$.", tex: "E/V", result: { value: 60, tolerance: 0.05, unit: "%" } },
        { text: "Debt's share of the financing.", tex: "D/V", result: { value: 40, tolerance: 0.05, unit: "%" } },
        { text: "After-tax cost of debt.", tex: "r_D\\,(1 - t)", result: { value: 4.5, tolerance: 0.01, unit: "%" } },
        { text: "Equity's contribution to the average.", tex: "\\frac{E}{V}\\,r_E", result: { value: 7.2, tolerance: 0.01, unit: "%" } },
        { text: "Debt's contribution to the average.", tex: "\\frac{D}{V}\\,r_D\\,(1 - t)", result: { value: 1.8, tolerance: 0.01, unit: "%" } },
        { text: "Add the two contributions.", tex: "\\text{WACC} = \\frac{E}{V}\\,r_E + \\frac{D}{V}\\,r_D\\,(1 - t)", result: { value: 9, tolerance: 0.01, unit: "%" } },
      ],
    },
    p("A project of average risk for this firm should therefore be evaluated with an NPV at $r = 9\\%$."),

    h("Market values, not book values"),
    p("The weights $E/V$ and $D/V$ must use **market values**: the share price times the number of shares, and the market value of the debt. The balance sheet shows **book values**, which record what was paid in the past and can be far from what investors would pay today."),
    p("Example: suppose the firm above has book equity of only 250, while its shares are worth 600 in the market. With book weights $250/650$ and $400/650$, the WACC would be about $7.38\\%$ instead of $9\\%$. Discounting at that lower rate would make too many projects look profitable. The returns $r_E$ and $r_D$ are demanded on what the investors' claims are worth today, so the weights must be measured the same way."),
    {
      kind: "check",
      id: "wacc/market-weights",
      prompt: "Why must the WACC weights use market values rather than balance-sheet (book) values?",
      answer: {
        type: "choice",
        options: [
          "Book values are not audited, so they are unreliable.",
          "Investors require their returns on what their claims are worth today, which is the market value.",
          "Book weights always give a higher WACC, which rejects good projects.",
          "Market values only matter for firms that pay corporate tax.",
        ],
        correct: 1,
      },
      explain: "$r_E$ and $r_D$ are returns demanded on today's value of the shares and the debt, so the weights must measure that same value. Book values record past prices and can push the WACC either way; in the example they lowered it to about $7.38\\%$.",
    },

    h("When the WACC applies"),
    p("Discounting at the WACC rests on assumptions that should be stated explicitly:"),
    list(
      "The project has the same business risk as the firm's existing assets. A riskier project needs a higher rate, a safer one a lower rate.",
      "The project is financed with the same mix of debt and equity as the firm, and that mix stays roughly constant.",
      "The cash flows being discounted are the project's cash flows before any payments to lenders; financing enters only through the rate.",
    ),
    p("A firm that uses one company-wide WACC for every project tends to accept risky projects that should be rejected and reject safe ones that should be accepted."),

    h("Summary"),
    list(
      "A firm is financed by debt $D$ and equity $E$, with total value $V = D + E$.",
      "The cost of equity $r_E$ is estimated from share risk, typically with the CAPM; the cost of debt $r_D$ is the lenders' required yield.",
      "Interest is tax-deductible, so debt effectively costs $r_D(1 - t)$.",
      "$\\text{WACC} = (E/V)\\,r_E + (D/V)\\,r_D(1 - t)$, with market-value weights; it is the discount rate for projects of average risk.",
    ),
    note("The next lesson, \"Capital structure and the Modigliani–Miller theorems\", asks whether changing the mix of debt and equity changes the WACC itself."),
    lab("/wacc", "Change the costs of capital, the tax rate and the debt ratio in the WACC lab"),
  ],

  hu: [
    p("A „Nettó jelenérték és belső megtérülési ráta” című lecke egy $r$ rátával diszkontálta a projekt pénzáramait, de nem mondta meg, honnan származik ez a ráta. Ha a projekt ugyanolyan kockázatú, mint a vállalat egésze, a szokásos válasz a súlyozott átlagos tőkeköltség. Ez a lecke a vállalat két befektetői csoportja által elvárt hozamokból építi fel."),

    h("Idegen tőke és saját tőke"),
    p("Egy vállalat kétféle befektetőtől von be pénzt. A **hitelezők** (kötvénytulajdonosok, bankok) **idegen tőkét** adnak, $D$-t: rögzített kamatot kapnak, és csőd esetén elsőként kapják vissza a pénzüket. A **részvényesek** **saját tőkét** adnak, $E$-t: azt kapják, ami a hitelezők kifizetése után megmarad, így a hozamuk bizonytalan. A vállalat finanszírozásának teljes értéke"),
    eq("V = D + E."),
    p("Képzeljük el a vállalatot pénzáramokból álló tortaként, amelyen a két csoport osztozik. A hitelezők szelete kisebb, de biztosabb; a részvényeseké átlagosan nagyobb, de kockázatosabb."),

    h("A saját tőke költsége"),
    p("A **saját tőke költsége**, $r_E$, az az éves hozam, amelyet a részvényesek a vállalat részvényeinek tartásáért elvárnak. Senki sem jegyzi közvetlenül; a részvény kockázatából kell megbecsülni. A szokásos eszköz a tőkepiaci eszközárazási modell (CAPM), amelyet a „CAPM, béta és az értékpapír-piaci egyenes” című lecke mutat be:"),
    eq("r_E = r_f + \\beta_E\\,\\big(\\mathbb{E}[R_m] - r_f\\big),"),
    p("ahol $r_f$ a kockázatmentes kamatláb, $\\mathbb{E}[R_m] - r_f$ a piaci kockázati prémium, $\\beta_E$ pedig azt méri, mennyire erősen mozog a részvény árfolyama a piaccal. Példa: $r_f = 3\\%$, $6\\%$-os piaci kockázati prémium és $\\beta_E = 1{,}5$ mellett $r_E = 3\\% + 1{,}5 \\times 6\\% = 12\\%$."),
    {
      kind: "check",
      id: "wacc/cost-of-equity",
      prompt: "A kockázatmentes kamatláb 2%, a piaci kockázati prémium 5%, a vállalat saját tőkéjének bétája 1,2. Mekkora saját tőke költséget ad a CAPM?",
      answer: { type: "number", value: 8, tolerance: 0.05, unit: "%" },
      explain: "$r_E = r_f + \\beta_E\\,(\\mathbb{E}[R_m] - r_f) = 2\\% + 1{,}2 \\times 5\\% = 8\\%$. A béta a piaci kockázati prémiumot skálázza, nem a teljes piaci hozamot.",
    },

    h("Az idegen tőke költsége"),
    p("Az **idegen tőke költsége**, $r_D$, a hitelezők által elvárt éves hozam, nagyjából az a hozam, amelyet a vállalat új hitelfelvételnél fizet. Alacsonyabb $r_E$-nél, mert a hitelezőket fizetik ki elsőként, és a kifizetéseik rögzítettek."),
    p("A kamatnak van egy második előnye is: levonható az adóalapból. $t$ társasági adókulcs mellett minden kifizetett kamategység $t$ egységgel csökkenti az adót. Példa: egy $D = 400$ hitellel rendelkező vállalat $r_D = 6\\%$ mellett évi 24 kamatot fizet; $t = 25\\%$ esetén ez $0{,}25 \\times 24 = 6$ adót takarít meg. Ez a megtakarítás a **kamatadópajzs**. A hitel tényleges költsége a vállalat számára ezért az **adózás utáni hitelköltség**:"),
    eq("r_D\\,(1 - t)."),
    p("A példában $6\\% \\times (1 - 0{,}25) = 4{,}5\\%$."),

    h("A súlyozott átlag"),
    p("A vállalatnak az eszközein összességében annyit kell keresnie, hogy mindkét csoportnak megadja az elvárt hozamot. Ha mindkét költséget a finanszírozásbeli arányával súlyozzuk, megkapjuk a **súlyozott átlagos tőkeköltséget** (WACC):"),
    eq("\\text{WACC} = \\frac{E}{V}\\,r_E + \\frac{D}{V}\\,r_D\\,(1 - t)."),
    note("A WACC az a hozam, amelyet a vállalat eszközeinek adózás után el kell érniük ahhoz, hogy a részvényesek és a hitelezők is megkapják az elvárt hozamukat. Ez a diszkontráta a vállalattal azonos kockázatú projektekhez."),
    p("Példa: $E = 600$ és $D = 400$, valamint $r_E = 12\\%$, $r_D = 6\\%$ és $t = 25\\%$."),
    {
      kind: "worked",
      title: "Egy 600 saját és 400 idegen tőkéjű vállalat WACC-je",
      steps: [
        { text: "A saját tőke aránya a finanszírozásban, ahol $V = D + E$.", tex: "E/V", result: { value: 60, tolerance: 0.05, unit: "%" } },
        { text: "Az idegen tőke aránya a finanszírozásban.", tex: "D/V", result: { value: 40, tolerance: 0.05, unit: "%" } },
        { text: "Az idegen tőke adózás utáni költsége.", tex: "r_D\\,(1 - t)", result: { value: 4.5, tolerance: 0.01, unit: "%" } },
        { text: "A saját tőke hozzájárulása az átlaghoz.", tex: "\\frac{E}{V}\\,r_E", result: { value: 7.2, tolerance: 0.01, unit: "%" } },
        { text: "Az idegen tőke hozzájárulása az átlaghoz.", tex: "\\frac{D}{V}\\,r_D\\,(1 - t)", result: { value: 1.8, tolerance: 0.01, unit: "%" } },
        { text: "Adjuk össze a két hozzájárulást.", tex: "\\text{WACC} = \\frac{E}{V}\\,r_E + \\frac{D}{V}\\,r_D\\,(1 - t)", result: { value: 9, tolerance: 0.01, unit: "%" } },
      ],
    },
    p("A vállalat egy átlagos kockázatú projektjét tehát $r = 9\\%$-os diszkontrátával számolt NPV alapján kell értékelni."),

    h("Piaci érték, nem könyv szerinti érték"),
    p("Az $E/V$ és $D/V$ súlyokat **piaci értéken** kell számolni: a részvényárfolyam szorozva a részvények számával, illetve a hitel piaci értéke. A mérleg **könyv szerinti értékeket** mutat, amelyek azt rögzítik, mennyit fizettek a múltban, és messze eshetnek attól, amennyit a befektetők ma fizetnének."),
    p("Példa: tegyük fel, hogy a fenti vállalat könyv szerinti saját tőkéje csak 250, miközben a részvényei 600-at érnek a piacon. $250/650$ és $400/650$ könyv szerinti súlyokkal a WACC kb. $7{,}38\\%$ lenne $9\\%$ helyett. Ezzel az alacsonyabb rátával diszkontálva túl sok projekt tűnne jövedelmezőnek. Az $r_E$ és $r_D$ hozamot a befektetők arra várják el, amit a követelésük ma ér, ezért a súlyokat is így kell mérni."),
    {
      kind: "check",
      id: "wacc/market-weights",
      prompt: "Miért piaci értékkel, és nem a mérleg szerinti (könyv szerinti) értékkel kell számolni a WACC súlyait?",
      answer: {
        type: "choice",
        options: [
          "Mert a könyv szerinti értékeket nem auditálják, ezért megbízhatatlanok.",
          "Mert a befektetők arra várnak el hozamot, amit a követelésük ma ér, ez pedig a piaci érték.",
          "Mert a könyv szerinti súlyok mindig magasabb WACC-t adnak, és így jó projekteket utasítanánk el.",
          "Mert a piaci érték csak a társasági adót fizető vállalatoknál számít.",
        ],
        correct: 1,
      },
      explain: "Az $r_E$ és az $r_D$ a részvények és az adósság mai értékére elvárt hozam, ezért a súlyoknak is ugyanezt az értéket kell mérniük. A könyv szerinti érték múltbeli árakat rögzít, és bármelyik irányba eltérítheti a WACC-t; a példában kb. $7{,}38\\%$-ra csökkentette.",
    },

    h("Mikor alkalmazható a WACC"),
    p("A WACC-vel való diszkontálás feltevésekre épül, amelyeket érdemes kimondani:"),
    list(
      "A projekt üzleti kockázata megegyezik a vállalat meglévő eszközeiével. Kockázatosabb projekthez magasabb, biztonságosabbhoz alacsonyabb ráta kell.",
      "A projektet ugyanolyan hitel–saját tőke arányban finanszírozzák, mint a vállalatot, és ez az arány nagyjából állandó marad.",
      "A diszkontált pénzáramok a projekt hitelezőknek történő kifizetések előtti pénzáramai; a finanszírozás csak a rátán keresztül jelenik meg.",
    ),
    p("Az a vállalat, amely minden projekthez ugyanazt a vállalati szintű WACC-t használja, hajlamos elfogadni olyan kockázatos projekteket, amelyeket el kellene utasítania, és elutasítani olyan biztonságosakat, amelyeket el kellene fogadnia."),

    h("Összefoglalás"),
    list(
      "A vállalatot $D$ idegen tőke és $E$ saját tőke finanszírozza, összértéke $V = D + E$.",
      "A saját tőke költségét, $r_E$-t, a részvény kockázatából becsüljük, jellemzően CAPM-mel; az idegen tőke költsége, $r_D$, a hitelezők elvárt hozama.",
      "A kamat levonható az adóalapból, így a hitel tényleges költsége $r_D(1 - t)$.",
      "$\\text{WACC} = (E/V)\\,r_E + (D/V)\\,r_D(1 - t)$, piaci értékű súlyokkal; ez az átlagos kockázatú projektek diszkontrátája.",
    ),
    note("A következő lecke, „Tőkeszerkezet és a Modigliani–Miller-tételek”, azt vizsgálja, hogy a hitel és a saját tőke arányának megváltoztatása módosítja-e magát a WACC-t."),
    lab("/wacc", "Változtasd a tőkeköltségeket, az adókulcsot és az eladósodottságot a WACC laborban"),
  ],
};
