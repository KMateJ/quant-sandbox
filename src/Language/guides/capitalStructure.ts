import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const capitalStructure: GuideLessonContent = {
  en: [
    p("The lesson \"The weighted average cost of capital\" took the mix of debt and equity as given. A firm can change that mix: borrow and buy back shares, or issue shares and repay debt. This lesson asks whether doing so changes the value of the firm and its cost of capital. The answer, due to Modigliani and Miller, is no in a world without taxes, and yes, through the tax shield, once corporate taxes are included."),

    h("Capital structure and leverage"),
    p("A firm's **capital structure** is its mix of debt $D$ and equity $E$. It is described by the **debt ratio** $D/V$, with $V = D + E$, or equivalently by the **debt-to-equity ratio** $D/E$. The two are linked by"),
    eq("\\frac{D}{E} = \\frac{D/V}{1 - D/V}."),
    p("A firm that uses debt is called **levered**; the same firm with no debt is **unlevered**. Using more debt is called increasing **leverage**. Throughout the lesson the firm's operations, and therefore its operating cash flows, stay fixed. Only the way those cash flows are split between lenders and shareholders changes."),

    h("Assumptions"),
    p("Modigliani and Miller work in an idealised market. State the assumptions explicitly, because each conclusion below depends on them:"),
    list(
      "No taxes (relaxed later in the lesson).",
      "No costs of bankruptcy or financial distress.",
      "Investors and firms can borrow and lend at the same rate.",
      "Everyone has the same information, and there are no transaction costs.",
    ),

    h("Firm value without taxes"),
    p("Let $V_U$ be the value of the unlevered firm and $V_L$ the value of the same firm with debt. **Modigliani–Miller Proposition I** states that without taxes"),
    eq("V_L = V_U."),
    p("The argument is a no-arbitrage argument. Owning all the debt and all the equity of the levered firm gives exactly the operating cash flows of the firm, which are the same with or without debt. Two claims to the same cash flows must have the same price. A shareholder who wants more leverage can also borrow personally and buy more shares (\"homemade leverage\"), so the firm cannot create value by doing the borrowing for them."),
    p("A fair picture is a pizza: cutting it into more or fewer slices does not change how much pizza there is."),

    h("The cost of equity rises with leverage"),
    p("Write $r_U$ for the return investors require on the unlevered firm, the **unlevered cost of capital**. It reflects only the business risk of the operations. Since $V_L = V_U$ and the cash flows are unchanged, the return on the whole levered firm is still $r_U$, so its WACC (without taxes) equals $r_U$:"),
    eq("r_U = \\frac{E}{V}\\,r_E + \\frac{D}{V}\\,r_D."),
    p("Multiply by $V/E$ and solve for the cost of equity $r_E$:"),
    eq("r_E = r_U\\,\\frac{V}{E} - r_D\\,\\frac{D}{E} = r_U\\Big(1 + \\frac{D}{E}\\Big) - r_D\\,\\frac{D}{E} = r_U + (r_U - r_D)\\,\\frac{D}{E}."),
    p("This is **Modigliani–Miller Proposition II**. Debt is cheaper than equity, $r_D < r_U$, but borrowing more does not lower the WACC: the shareholders bear the same business risk on a smaller stake, so their required return $r_E$ rises exactly enough to offset the cheaper debt."),
    p("Example: $r_U = 10\\%$, $r_D = 5\\%$ and $D/V = 40\\%$, so $D/E = 0.4/0.6 \\approx 0.667$. Then $r_E = 10\\% + 5\\% \\times 0.667 \\approx 13.33\\%$, and the WACC is $0.6 \\times 13.33\\% + 0.4 \\times 5\\% = 10\\% = r_U$."),
    note("Without taxes, capital structure is irrelevant: $V_L = V_U$, the WACC equals $r_U$ at every debt ratio, and $r_E = r_U + (r_U - r_D)\\,D/E$."),
    {
      kind: "check",
      id: "capital-structure/mm2-no-tax",
      prompt: "Without taxes, a firm has $r_U = 12\\%$ and borrows at $r_D = 6\\%$ with a debt-to-equity ratio $D/E = 1$. What return do its shareholders require?",
      answer: { type: "number", value: 18, tolerance: 0.05, unit: "%" },
      explain: "Proposition II: $r_E = r_U + (r_U - r_D)\\,D/E = 12\\% + 6\\% \\times 1 = 18\\%$. The WACC stays at $0.5 \\times 18\\% + 0.5 \\times 6\\% = 12\\% = r_U$.",
    },

    h("Corporate taxes and the tax shield"),
    p("Now add a corporate tax rate $t$. As in \"The weighted average cost of capital\", interest is deductible, so a firm with debt $D$ at rate $r_D$ saves $t\\,r_D D$ in tax every year. Assume the debt is **perpetual**: the firm keeps the amount $D$ outstanding forever. The tax savings are then a perpetuity, and discounting it at $r_D$ (it is as safe as the interest payments) gives the value of the tax shield:"),
    eq("\\text{PV(tax shield)} = \\frac{t\\,r_D D}{r_D} = t\\,D, \\qquad V_L = V_U + t\\,D."),
    p("Example: an unlevered firm worth $V_U = 1000$ that borrows $D = 400$ at $t = 25\\%$ is worth $V_L = 1000 + 0.25 \\times 400 = 1100$. The extra 100 is money that no longer goes to the tax authority."),
    p("The formulas for the costs of capital change accordingly. With perpetual debt they become"),
    eq("r_E = r_U + (r_U - r_D)(1 - t)\\,\\frac{D}{E}, \\qquad \\text{WACC} = \\frac{E}{V}\\,r_E + \\frac{D}{V}\\,r_D(1 - t) = r_U\\Big(1 - t\\,\\frac{D}{V}\\Big)."),
    p("With the numbers above ($r_U = 10\\%$, $r_D = 5\\%$, $D/V = 40\\%$) and $t = 25\\%$:"),
    {
      kind: "worked",
      title: "Costs of capital with corporate taxes",
      steps: [
        { text: "The debt-to-equity ratio from $D/V$.", tex: "\\frac{D}{E} = \\frac{D/V}{1 - D/V}", result: { value: 0.667, tolerance: 0.001 } },
        { text: "Proposition II with taxes: the cost of equity.", tex: "r_E = r_U + (r_U - r_D)(1 - t)\\,\\frac{D}{E}", result: { value: 12.5, tolerance: 0.01, unit: "%" } },
        { text: "The after-tax cost of debt.", tex: "r_D\\,(1 - t)", result: { value: 3.75, tolerance: 0.01, unit: "%" } },
        { text: "The WACC from the weighted average.", tex: "\\text{WACC} = \\frac{E}{V}\\,r_E + \\frac{D}{V}\\,r_D(1 - t)", result: { value: 9, tolerance: 0.01, unit: "%" } },
        { text: "The shortcut gives the same number.", tex: "r_U\\Big(1 - t\\,\\frac{D}{V}\\Big)", result: { value: 9, tolerance: 0.01, unit: "%" } },
      ],
    },
    p("The WACC is below $r_U = 10\\%$ and now falls as leverage rises."),
    p("The next figure draws these values as bars for an unlevered firm worth $V_U = 100$. The upper bar is the unlevered firm, all equity. The lower bar is the same firm with debt, split into debt $D$ and equity $E$, and the hatched slice beyond the dashed mark at $V_U$ is the tax shield $t\\,D$. Drag the boundary between debt and equity (or focus it and use the arrow keys) to set $D/V$ between 0 and 80%; the bars underneath show $r_E$, the after-tax cost of debt and the WACC against the dashed mark at $r_U$. At $D/V = 40\\%$ the firm carries $D \\approx 44.4$, is worth $V_L \\approx 111.1$ and the readouts repeat $12.5\\%$ and $9\\%$. Switch the tax to \"None\": the lower bar keeps the length of the upper one however much debt you add, which is Proposition I, while $r_E$ still climbs."),
    figure("capital-split"),

    h("Costs of capital against leverage"),
    p("The figure plots, against the debt ratio $D/V$ from 0 to 80%, the cost of equity $r_E$, the after-tax cost of debt $r_D(1 - t)$ and the WACC, all under the formulas with taxes. Sliders set $r_U$, $r_D$, the tax rate $t$ and the chosen $D/V$, which is marked by a reference line; the readouts give $r_E$, the after-tax cost of debt and the WACC there. At the defaults ($r_U = 10\\%$, $r_D = 5\\%$, $t = 25\\%$, $D/V = 40\\%$) they show $12.5\\%$, $3.75\\%$ and $9\\%$, as computed above. Set $t$ to zero and the WACC line becomes flat at $r_U$: that is Proposition I and II without taxes. Raise $t$ and note that the WACC slopes down more steeply."),
    figure("wacc-leverage"),

    h("Limits of the result"),
    p("Taken literally, the version with taxes says a firm should be financed almost entirely by debt. Real firms are not, because the assumptions fail at high leverage. Heavily indebted firms face **costs of financial distress**: higher borrowing rates, lost customers and suppliers, legal costs in bankruptcy. The *trade-off view* of capital structure balances the tax shield against these costs, which suggests a moderate debt ratio at which firm value is highest. The figure and the lab show only the tax side of this balance."),
    {
      kind: "check",
      id: "capital-structure/why-not-all-debt",
      prompt: "With taxes, $V_L = V_U + t\\,D$ keeps rising with debt. Why do real firms still not borrow almost everything?",
      answer: {
        type: "choice",
        options: [
          "Because the tax shield stops growing once debt exceeds half of firm value.",
          "Because heavy debt brings costs of financial distress that outweigh the extra tax shield.",
          "Because Proposition I says that debt destroys value.",
          "Because the cost of debt is always higher than the cost of equity.",
        ],
        correct: 1,
      },
      explain: "The formula assumes no costs of financial distress. At high leverage those costs (dearer borrowing, lost customers, bankruptcy costs) grow faster than the tax shield, so the trade-off view finds the best debt ratio at a moderate level.",
    },

    h("Summary"),
    list(
      "Capital structure is the mix of debt and equity, measured by $D/V$ or $D/E$; operating cash flows do not depend on it.",
      "Without taxes, $V_L = V_U$ and the WACC equals the unlevered cost of capital $r_U$ at any leverage (Proposition I).",
      "The cost of equity rises with leverage: $r_E = r_U + (r_U - r_D)\\,D/E$ (Proposition II).",
      "With corporate taxes and perpetual debt, $V_L = V_U + tD$, $r_E = r_U + (r_U - r_D)(1 - t)\\,D/E$ and $\\text{WACC} = r_U(1 - t\\,D/V)$.",
      "Costs of financial distress, which the model leaves out, limit how much debt is worth taking on.",
    ),
    note("The next lesson, \"Discounted cash flow valuation\", uses the WACC to value an entire firm from its free cash flows."),
    lab("/capital-structure", "See how leverage moves the cost of equity, the WACC and firm value in the Capital Structure lab"),
  ],

  hu: [
    p("A „Súlyozott átlagos tőkeköltség” című lecke adottnak vette a hitel és a saját tőke arányát. Egy vállalat ezt az arányt meg tudja változtatni: hitelt vehet fel és visszavásárolhat részvényeket, vagy részvényt bocsáthat ki és visszafizethet hitelt. Ez a lecke azt vizsgálja, változik-e ettől a vállalat értéke és a tőkeköltsége. Modigliani és Miller válasza: adók nélküli világban nem, társasági adó mellett viszont igen, a kamatadópajzson keresztül."),

    h("Tőkeszerkezet és tőkeáttétel"),
    p("A vállalat **tőkeszerkezete** az idegen tőke ($D$) és a saját tőke ($E$) aránya. Leírható az **eladósodottsági rátával**, $D/V$-vel, ahol $V = D + E$, vagy ezzel egyenértékűen a **hitel–saját tőke aránnyal**, $D/E$-vel. A kettő kapcsolata"),
    eq("\\frac{D}{E} = \\frac{D/V}{1 - D/V}."),
    p("A hitelt használó vállalat **tőkeáttételes**; ugyanez a vállalat hitel nélkül **tőkeáttétel nélküli**. Több hitel használata a **tőkeáttétel** növelése. A lecke során a vállalat működése, így a működési pénzáramai is változatlanok. Csak az változik, hogyan oszlanak meg ezek a pénzáramok a hitelezők és a részvényesek között."),

    h("Feltevések"),
    p("Modigliani és Miller idealizált piacon dolgozik. A feltevéseket érdemes kimondani, mert az alábbi következtetések mindegyike rajtuk múlik:"),
    list(
      "Nincsenek adók (ezt a lecke később feloldja).",
      "Nincsenek csőd- vagy pénzügyi nehézségi költségek.",
      "A befektetők és a vállalatok ugyanazon a kamaton vehetnek fel és helyezhetnek ki pénzt.",
      "Mindenki ugyanazzal az információval rendelkezik, és nincsenek tranzakciós költségek.",
    ),

    h("A vállalat értéke adók nélkül"),
    p("Legyen $V_U$ a tőkeáttétel nélküli vállalat értéke, $V_L$ pedig ugyanannak a vállalatnak az értéke hitellel. A **Modigliani–Miller I. tétel** szerint adók nélkül"),
    eq("V_L = V_U."),
    p("Az érvelés arbitrázsmentességi érv. Aki a tőkeáttételes vállalat teljes hitelét és teljes saját tőkéjét birtokolja, pontosan a vállalat működési pénzáramait kapja, amelyek hitellel és hitel nélkül is ugyanazok. Két, ugyanazokra a pénzáramokra szóló követelésnek ugyanannyinak kell lennie az árának. Az a részvényes, aki nagyobb tőkeáttételt szeretne, maga is felvehet hitelt, és vehet belőle több részvényt („házi tőkeáttétel”), így a vállalat nem teremthet értéket azzal, hogy helyette vesz fel hitelt."),
    p("Jó kép erre egy pizza: attól, hogy több vagy kevesebb szeletre vágjuk, nem lesz több vagy kevesebb pizza."),

    h("A saját tőke költsége nő a tőkeáttétellel"),
    p("Jelölje $r_U$ a tőkeáttétel nélküli vállalattól elvárt hozamot, a **tőkeáttétel nélküli tőkeköltséget**. Ez csak a működés üzleti kockázatát tükrözi. Mivel $V_L = V_U$, és a pénzáramok változatlanok, a teljes tőkeáttételes vállalat hozama továbbra is $r_U$, így (adók nélkül) a WACC-je $r_U$:"),
    eq("r_U = \\frac{E}{V}\\,r_E + \\frac{D}{V}\\,r_D."),
    p("Szorozzunk $V/E$-vel, és fejezzük ki a saját tőke költségét, $r_E$-t:"),
    eq("r_E = r_U\\,\\frac{V}{E} - r_D\\,\\frac{D}{E} = r_U\\Big(1 + \\frac{D}{E}\\Big) - r_D\\,\\frac{D}{E} = r_U + (r_U - r_D)\\,\\frac{D}{E}."),
    p("Ez a **Modigliani–Miller II. tétel**. A hitel olcsóbb a saját tőkénél, $r_D < r_U$, mégsem csökken a WACC, ha a vállalat több hitelt vesz fel: a részvényesek ugyanazt az üzleti kockázatot kisebb részesedésen viselik, ezért az elvárt hozamuk, $r_E$, éppen annyival nő, amennyi kiegyenlíti az olcsóbb hitelt."),
    p("Példa: $r_U = 10\\%$, $r_D = 5\\%$ és $D/V = 40\\%$, így $D/E = 0{,}4/0{,}6 \\approx 0{,}667$. Ekkor $r_E = 10\\% + 5\\% \\times 0{,}667 \\approx 13{,}33\\%$, a WACC pedig $0{,}6 \\times 13{,}33\\% + 0{,}4 \\times 5\\% = 10\\% = r_U$."),
    note("Adók nélkül a tőkeszerkezet közömbös: $V_L = V_U$, a WACC minden eladósodottság mellett $r_U$, és $r_E = r_U + (r_U - r_D)\\,D/E$."),
    {
      kind: "check",
      id: "capital-structure/mm2-no-tax",
      prompt: "Adók nélkül egy vállalatnál $r_U = 12\\%$, a hitel kamata $r_D = 6\\%$, és az eladósodottság $D/E = 1$. Mekkora hozamot várnak el a részvényesek?",
      answer: { type: "number", value: 18, tolerance: 0.05, unit: "%" },
      explain: "A II. tétel szerint $r_E = r_U + (r_U - r_D)\\,D/E = 12\\% + 6\\% \\times 1 = 18\\%$. A WACC marad $0{,}5 \\times 18\\% + 0{,}5 \\times 6\\% = 12\\% = r_U$.",
    },

    h("Társasági adó és kamatadópajzs"),
    p("Vezessünk be egy $t$ társasági adókulcsot. Ahogy a „Súlyozott átlagos tőkeköltség” leckében, a kamat levonható, így egy $D$ hitellel, $r_D$ kamaton finanszírozott vállalat évente $t\\,r_D D$ adót takarít meg. Tegyük fel, hogy a hitel **örökjáradék jellegű**: a vállalat a $D$ összeget örökké fenntartja. Az adómegtakarítás ekkor örökjáradék, és $r_D$-vel diszkontálva (ugyanolyan biztos, mint a kamatfizetések) megkapjuk az adópajzs értékét:"),
    eq("\\text{PV(adópajzs)} = \\frac{t\\,r_D D}{r_D} = t\\,D, \\qquad V_L = V_U + t\\,D."),
    p("Példa: egy $V_U = 1000$ értékű, tőkeáttétel nélküli vállalat, amely $t = 25\\%$ mellett $D = 400$ hitelt vesz fel, $V_L = 1000 + 0{,}25 \\times 400 = 1100$-at ér. A többlet 100 olyan pénz, amely már nem az adóhatósághoz kerül."),
    p("A tőkeköltségek képletei ennek megfelelően módosulnak. Örökjáradék jellegű hitel mellett"),
    eq("r_E = r_U + (r_U - r_D)(1 - t)\\,\\frac{D}{E}, \\qquad \\text{WACC} = \\frac{E}{V}\\,r_E + \\frac{D}{V}\\,r_D(1 - t) = r_U\\Big(1 - t\\,\\frac{D}{V}\\Big)."),
    p("A fenti számokkal ($r_U = 10\\%$, $r_D = 5\\%$, $D/V = 40\\%$) és $t = 25\\%$ mellett:"),
    {
      kind: "worked",
      title: "Tőkeköltségek társasági adóval",
      steps: [
        { text: "Az eladósodottság $D/E$ alakban, $D/V$-ből.", tex: "\\frac{D}{E} = \\frac{D/V}{1 - D/V}", result: { value: 0.667, tolerance: 0.001 } },
        { text: "A II. tétel adóval: a saját tőke költsége.", tex: "r_E = r_U + (r_U - r_D)(1 - t)\\,\\frac{D}{E}", result: { value: 12.5, tolerance: 0.01, unit: "%" } },
        { text: "Az adózás utáni hitelköltség.", tex: "r_D\\,(1 - t)", result: { value: 3.75, tolerance: 0.01, unit: "%" } },
        { text: "A WACC a súlyozott átlagból.", tex: "\\text{WACC} = \\frac{E}{V}\\,r_E + \\frac{D}{V}\\,r_D(1 - t)", result: { value: 9, tolerance: 0.01, unit: "%" } },
        { text: "A rövidebb képlet ugyanezt adja.", tex: "r_U\\Big(1 - t\\,\\frac{D}{V}\\Big)", result: { value: 9, tolerance: 0.01, unit: "%" } },
      ],
    },
    p("A WACC kisebb, mint $r_U = 10\\%$, és most csökken, ahogy a tőkeáttétel nő."),
    p("A következő ábra sávokként rajzolja meg ezeket az értékeket egy $V_U = 100$ értékű, tőkeáttétel nélküli vállalatra. A felső sáv a tőkeáttétel nélküli, csak saját tőkéből finanszírozott vállalat. Az alsó ugyanez a vállalat hitellel, $D$ hitelre és $E$ saját tőkére bontva; a $V_U$-nál húzott szaggatott jelen túli sávozott rész a $t\\,D$ adópajzs. Húzd a hitel és a saját tőke közötti határt (vagy fókuszálj rá, és használd a nyílbillentyűket), és állítsd $D/V$-t 0 és 80% közé; az alatta lévő sávok $r_E$-t, az adózás utáni hitelköltséget és a WACC-t mutatják az $r_U$-nál húzott szaggatott jelhez képest. $D/V = 40\\%$ mellett a vállalat hitele $D \\approx 44{,}4$, értéke $V_L \\approx 111{,}1$, a kijelzők pedig ismét $12{,}5\\%$-ot és $9\\%$-ot mutatnak. Kapcsold az adót „Nincs” állásba: az alsó sáv akármennyi hitel mellett is ugyanolyan hosszú marad, mint a felső, ez az I. tétel, miközben $r_E$ tovább nő."),
    figure("capital-split"),

    h("Tőkeköltségek a tőkeáttétel függvényében"),
    p("Az ábra a $D/V$ eladósodottsági ráta függvényében, 0 és 80% között mutatja a saját tőke költségét ($r_E$), az adózás utáni hitelköltséget ($r_D(1 - t)$) és a WACC-t, az adót tartalmazó képletek szerint. A csúszkák $r_U$-t, $r_D$-t, a $t$ adókulcsot és a választott $D/V$ értéket állítják, ez utóbbit függőleges vonal jelöli; a kijelzők itt adják meg $r_E$-t, az adózás utáni hitelköltséget és a WACC-t. Az alapbeállításokkal ($r_U = 10\\%$, $r_D = 5\\%$, $t = 25\\%$, $D/V = 40\\%$) $12{,}5\\%$-ot, $3{,}75\\%$-ot és $9\\%$-ot mutatnak, ahogy fent kiszámoltuk. Állítsd $t$-t nullára: a WACC vonala vízszintes lesz $r_U$ magasságában, ez az I. és II. tétel adók nélkül. Növeld $t$-t, és figyeld, hogy a WACC meredekebben lejt."),
    figure("wacc-leverage"),

    h("Az eredmény korlátai"),
    p("Szó szerint véve az adót is tartalmazó változat azt mondja, hogy a vállalatot szinte teljes egészében hitelből kellene finanszírozni. A valódi vállalatok nem így tesznek, mert nagy tőkeáttételnél a feltevések nem teljesülnek. Az erősen eladósodott vállalatok **pénzügyi nehézségi költségekkel** szembesülnek: drágább hitellel, elpártoló vevőkkel és beszállítókkal, csőd esetén jogi költségekkel. A tőkeszerkezet *átváltási (trade-off) elmélete* az adópajzsot ezekkel a költségekkel állítja szembe, ami egy mérsékelt eladósodottságot sugall, ahol a vállalat értéke a legnagyobb. Az ábra és a labor ennek a mérlegnek csak az adóoldalát mutatja."),
    {
      kind: "check",
      id: "capital-structure/why-not-all-debt",
      prompt: "Adóval a $V_L = V_U + t\\,D$ érték az adóssággal folyamatosan nő. Miért nem vesznek fel mégis a valódi vállalatok szinte csak hitelt?",
      answer: {
        type: "choice",
        options: [
          "Mert a kamatadópajzs nem nő tovább, ha az adósság meghaladja a vállalatérték felét.",
          "Mert a nagy adósság pénzügyi nehézségi költségekkel jár, amelyek meghaladják a további adópajzsot.",
          "Mert az I. tétel szerint az adósság értéket rombol.",
          "Mert az idegen tőke mindig drágább a saját tőkénél.",
        ],
        correct: 1,
      },
      explain: "A képlet nem számol a pénzügyi nehézségek költségeivel. Nagy tőkeáttételnél ezek a költségek (drágább hitel, elvesztett vevők, csődköltségek) gyorsabban nőnek, mint az adópajzs, ezért a kompromisszumos elmélet szerint a legjobb eladósodottság mérsékelt.",
    },

    h("Összefoglalás"),
    list(
      "A tőkeszerkezet a hitel és a saját tőke aránya, $D/V$-vel vagy $D/E$-vel mérve; a működési pénzáramok nem függnek tőle.",
      "Adók nélkül $V_L = V_U$, és a WACC bármilyen tőkeáttétel mellett a tőkeáttétel nélküli $r_U$ tőkeköltséggel egyenlő (I. tétel).",
      "A saját tőke költsége nő a tőkeáttétellel: $r_E = r_U + (r_U - r_D)\\,D/E$ (II. tétel).",
      "Társasági adóval és örökjáradék jellegű hitellel $V_L = V_U + tD$, $r_E = r_U + (r_U - r_D)(1 - t)\\,D/E$ és $\\text{WACC} = r_U(1 - t\\,D/V)$.",
      "A modellből kimaradó pénzügyi nehézségi költségek korlátozzák, mennyi hitelt érdemes felvenni.",
    ),
    note("A következő lecke, „Diszkontált pénzáram alapú értékelés”, a WACC segítségével egy egész vállalatot értékel a szabad pénzáramaiból."),
    lab("/capital-structure", "Nézd meg, hogyan mozgatja a tőkeáttétel a saját tőke költségét, a WACC-t és a vállalat értékét a Tőkeszerkezet laborban"),
  ],
};
