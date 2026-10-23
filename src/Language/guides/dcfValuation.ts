import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const dcfValuation: GuideLessonContent = {
  en: [
    p("The lesson \"Net present value and internal rate of return\" valued a single project by discounting its cash flows. A whole firm can be valued the same way: it is a collection of projects that keeps producing cash. This lesson builds a discounted cash flow (DCF) valuation from the firm's free cash flows, the WACC from \"The weighted average cost of capital\", and a formula for cash flows that continue forever."),

    h("Free cash flow"),
    p("The cash flow to discount is the **free cash flow** (FCF): the cash the firm's operations generate in a year after paying taxes and making the investments needed to keep growing, but before any payments to lenders or shareholders. With $t$ the corporate tax rate,"),
    eq("\\text{FCF} = \\text{EBIT}\\,(1 - t) + \\text{depreciation} - \\text{capital expenditure} - \\Delta\\text{NWC}."),
    p("Each term has a reason. **EBIT** (earnings before interest and taxes) is operating profit; $\\text{EBIT}(1-t)$ is that profit after the tax the operations would pay with no debt, so financing is kept out of the cash flow, as \"The weighted average cost of capital\" required. **Depreciation** is an accounting charge, not a cash payment, so it is added back. **Capital expenditure** is cash spent on new equipment and buildings. $\\Delta\\text{NWC}$ is the increase in net working capital (inventories plus receivables minus payables), cash tied up in day-to-day operations."),
    p("Example: EBIT of 200, $t = 25\\%$, depreciation of 40, capital expenditure of 60 and an increase in working capital of 10 give $\\text{FCF} = 150 + 40 - 60 - 10 = 120$."),
    {
      kind: "check",
      id: "dcf-valuation/free-cash-flow",
      prompt: "A firm has EBIT of 100, a tax rate of 20%, depreciation of 30, capital expenditure of 50 and an increase in net working capital of 5. What is its free cash flow?",
      answer: { type: "number", value: 55, tolerance: 0.5 },
      explain: "$\\text{FCF} = 100 \\times 0.8 + 30 - 50 - 5 = 55$. Depreciation is added back because it is not a cash payment; investment and extra working capital are cash spent.",
    },

    h("Enterprise value"),
    p("Free cash flow belongs to all investors together, lenders and shareholders. Discounting it at the WACC therefore gives the value of the whole firm, its **enterprise value**:"),
    eq("\\text{EV} = \\sum_{k=1}^{\\infty} \\frac{\\text{FCF}_k}{(1 + \\text{WACC})^k}."),
    p("The sum has no end, because a firm has no fixed maturity. In practice it is split in two: an **explicit forecast** of the next few years, usually five, where the analyst projects each cash flow, and a **terminal value** that summarises everything after."),

    h("Growing perpetuity"),
    p("To value the cash flows beyond the forecast, assume that from some point they grow at a constant rate $g$ forever: $\\text{FCF}_{k+1} = \\text{FCF}_k\\,(1+g)$. Write $W$ for the WACC. The present value of such a stream, starting with $\\text{FCF}_1$ in one year, is a geometric series with ratio $(1+g)/(1+W)$:"),
    eq("\\sum_{k=1}^{\\infty} \\frac{\\text{FCF}_1 (1+g)^{k-1}}{(1+W)^k} = \\frac{\\text{FCF}_1}{1+W} \\sum_{j=0}^{\\infty} \\Big(\\frac{1+g}{1+W}\\Big)^j = \\frac{\\text{FCF}_1}{W - g}."),
    p("The series converges only when $g < W$. This is the **Gordon growth formula**. A growth rate at or above the discount rate would give an infinite value, which signals an impossible assumption: no firm can outgrow the economy forever."),
    {
      kind: "check",
      id: "dcf-valuation/growth-limit",
      prompt: "A spreadsheet DCF gives an enormous or negative terminal value. The analyst has set the perpetual growth rate $g$ equal to or above the WACC. What does this mean?",
      answer: {
        type: "choice",
        options: [
          "The firm is extremely valuable and the result should be kept.",
          "The assumption is impossible: the Gordon formula needs $g < W$.",
          "The terminal value should be discounted at $g$ instead of the WACC.",
          "Five forecast years are too few; adding years fixes it.",
        ],
        correct: 1,
      },
      explain: "The growing perpetuity converges only when $g < W$. At $g \\ge W$ the series has no finite sum, so the formula's output is meaningless: no firm can grow faster than its discount rate forever.",
    },

    h("Terminal value"),
    p("Apply the formula at the end of the forecast. If the forecast covers years 1 to 5, the **terminal value** at year 5 is the value then of all cash flows from year 6 on:"),
    eq("\\text{TV}_5 = \\frac{\\text{FCF}_6}{W - g}, \\qquad \\text{EV} = \\sum_{k=1}^{5} \\frac{\\text{FCF}_k}{(1+W)^k} + \\frac{\\text{TV}_5}{(1+W)^5}."),
    p("The terminal value is itself a future amount, so it is discounted back five years like any other cash flow."),

    h("A worked example"),
    p("Take $\\text{FCF}_1 = 10$, growing at $g = 2\\%$ per year forever, and $W = 9\\%$. The forecast cash flows are 10, 10.20, 10.40, 10.61 and 10.82; discounted at 9% they are worth 9.17, 8.59, 8.03, 7.52 and 7.04."),
    {
      kind: "worked",
      title: "Enterprise value with a five-year forecast and a terminal value",
      steps: [
        { text: "Present value of the five forecast years.", tex: "\\sum_{k=1}^{5} \\frac{\\text{FCF}_1 (1+g)^{k-1}}{(1+W)^k}", result: { value: 40.35, tolerance: 0.01 } },
        { text: "The first cash flow after the forecast.", tex: "\\text{FCF}_6 = \\text{FCF}_1 (1+g)^5", result: { value: 11.04, tolerance: 0.01 } },
        { text: "Terminal value at year 5, from the Gordon formula.", tex: "\\text{TV}_5 = \\frac{\\text{FCF}_6}{W - g}", result: { value: 157.73, tolerance: 0.01 } },
        { text: "Discount the terminal value back five years.", tex: "\\frac{\\text{TV}_5}{(1+W)^5}", result: { value: 102.51, tolerance: 0.01 } },
        { text: "Enterprise value: the forecast years plus the discounted terminal value.", tex: "\\text{EV} = \\sum_{k=1}^{5} \\frac{\\text{FCF}_k}{(1+W)^k} + \\frac{\\text{TV}_5}{(1+W)^5}", result: { value: 142.86, tolerance: 0.01 } },
      ],
    },
    p("Since one growth rate applies to every year here, this equals the Gordon formula for the whole stream, $10/0.07 \\approx 142.86$, which is a useful check."),
    note("Most of a DCF value usually sits in the terminal value. In the example it is $102.51/142.86 \\approx 71.8\\%$ of the total, so the long-run assumptions on $g$ and the WACC matter more than the detailed forecast."),

    h("Sensitivity to the assumptions"),
    p("Because $W - g$ sits in a denominator, small changes in either have large effects. Raising $g$ from 2% to 4% lifts the value from 142.86 to $10/0.05 = 200$; lowering the WACC from 9% to 8% lifts it to $10/0.06 \\approx 166.67$. The present value of the five forecast years barely moves in either case. A DCF valuation should therefore always be reported with a range of $g$ and WACC values, not as a single number."),
    p("The figure shows this split. It plots, against $g$, the present value of years 1 to 5, the present value of the terminal value, and their total, for a firm with $\\text{FCF}_1 = 10$ and a five-year forecast. Sliders set the WACC and $g$; the readouts give the total value, the terminal value's share and the present value of the forecast years at the chosen $g$; $g$ can be raised up to 5%, and at most to one point below the WACC. The defaults (WACC 9%, $g = 2\\%$) reproduce the example: 142.86, about 71.8% from the terminal value. Raise $g$ and note that the terminal part grows steeply while the forecast part stays almost flat; lower the WACC and both rise."),
    figure("dcf-terminal"),

    h("From enterprise value to equity value"),
    p("Enterprise value belongs to lenders and shareholders together. The shareholders' part, the **equity value**, is what remains after subtracting **net debt** (debt minus cash):"),
    eq("\\text{equity value} = \\text{EV} - (\\text{debt} - \\text{cash}), \\qquad \\text{value per share} = \\frac{\\text{equity value}}{\\text{number of shares}}."),
    p("Example: with $\\text{EV} = 142.86$, debt of 45, cash of 5 and 10 shares, the equity value is $142.86 - 40 = 102.86$, or about 10.29 per share. Comparing this with the market price is how an analyst decides whether a share looks cheap or expensive."),

    h("Summary"),
    list(
      "Free cash flow is the cash operations produce after tax and investment, before any financing payments.",
      "Discounting free cash flow at the WACC gives the enterprise value of the firm.",
      "A stream growing at $g < W$ forever is worth $\\text{FCF}_1/(W - g)$; applied at the end of the forecast, this is the terminal value.",
      "The terminal value usually dominates, so results are very sensitive to $g$ and the WACC.",
      "Equity value is enterprise value minus net debt.",
    ),
    lab("/valuation", "Build a DCF valuation and test the terminal value assumptions in the Valuation lab"),
  ],

  hu: [
    p("A „Nettó jelenérték és belső megtérülési ráta” című lecke egyetlen projektet értékelt a pénzáramai diszkontálásával. Egy egész vállalat ugyanígy értékelhető: projektek összessége, amely folyamatosan pénzt termel. Ez a lecke a diszkontált pénzáram (DCF) alapú értékelést a vállalat szabad pénzáramaiból, a „Súlyozott átlagos tőkeköltség” című lecke WACC-jéből és az örökké tartó pénzáramokra vonatkozó képletből építi fel."),

    h("Szabad pénzáram"),
    p("A diszkontálandó pénzáram a **szabad pénzáram** (FCF): az a pénz, amelyet a vállalat működése egy év alatt megtermel az adók megfizetése és a további növekedéshez szükséges beruházások után, de a hitelezőknek vagy részvényeseknek teljesített kifizetések előtt. $t$ társasági adókulccsal"),
    eq("\\text{FCF} = \\text{EBIT}\\,(1 - t) + \\text{értékcsökkenés} - \\text{beruházás} - \\Delta\\text{NWC}."),
    p("Minden tagnak megvan az oka. Az **EBIT** (kamatfizetés és adózás előtti eredmény) a működési eredmény; $\\text{EBIT}(1-t)$ ez az eredmény annak az adónak a levonása után, amelyet a működés hitel nélkül fizetne, így a finanszírozás kimarad a pénzáramból, ahogy a „Súlyozott átlagos tőkeköltség” lecke megkívánta. Az **értékcsökkenés** könyvelési tétel, nem pénzkifizetés, ezért visszaadjuk. A **beruházás** új gépekre és épületekre költött pénz. A $\\Delta\\text{NWC}$ a nettó forgótőke (készletek plusz vevőkövetelések mínusz szállítói tartozások) növekménye, a napi működésben lekötött pénz."),
    p("Példa: 200 EBIT, $t = 25\\%$, 40 értékcsökkenés, 60 beruházás és 10 forgótőke-növekmény mellett $\\text{FCF} = 150 + 40 - 60 - 10 = 120$."),
    {
      kind: "check",
      id: "dcf-valuation/free-cash-flow",
      prompt: "Egy vállalat EBIT-je 100, az adókulcs 20%, az értékcsökkenés 30, a beruházás 50, a nettó forgótőke pedig 5-tel nő. Mekkora a szabad pénzárama?",
      answer: { type: "number", value: 55, tolerance: 0.5 },
      explain: "$\\text{FCF} = 100 \\times 0{,}8 + 30 - 50 - 5 = 55$. Az értékcsökkenést visszaadjuk, mert nem pénzkiadás; a beruházás és a forgótőke növekménye viszont elköltött pénz.",
    },

    h("Vállalatérték"),
    p("A szabad pénzáram az összes befektetőt együtt illeti, a hitelezőket és a részvényeseket is. A WACC-vel diszkontálva ezért a teljes vállalat értékét kapjuk, a **vállalatértéket** (enterprise value, EV):"),
    eq("\\text{EV} = \\sum_{k=1}^{\\infty} \\frac{\\text{FCF}_k}{(1 + \\text{WACC})^k}."),
    p("Az összegnek nincs vége, mert egy vállalatnak nincs rögzített lejárata. A gyakorlatban két részre bontjuk: a következő néhány év, jellemzően öt év **explicit előrejelzésére**, amelyben az elemző minden pénzáramot egyenként becsül, és egy **maradványértékre**, amely minden későbbit összefoglal."),

    h("Növekvő örökjáradék"),
    p("Az előrejelzésen túli pénzáramok értékeléséhez tegyük fel, hogy egy ponttól kezdve örökké állandó $g$ ütemben nőnek: $\\text{FCF}_{k+1} = \\text{FCF}_k\\,(1+g)$. Jelölje $W$ a WACC-t. Egy egy év múlva $\\text{FCF}_1$-gyel induló ilyen pénzáram jelenértéke $(1+g)/(1+W)$ hányadosú mértani sor:"),
    eq("\\sum_{k=1}^{\\infty} \\frac{\\text{FCF}_1 (1+g)^{k-1}}{(1+W)^k} = \\frac{\\text{FCF}_1}{1+W} \\sum_{j=0}^{\\infty} \\Big(\\frac{1+g}{1+W}\\Big)^j = \\frac{\\text{FCF}_1}{W - g}."),
    p("A sor csak $g < W$ esetén konvergál. Ez a **Gordon-féle növekedési képlet**. A diszkontrátával egyenlő vagy annál nagyobb növekedési ütem végtelen értéket adna, ami lehetetlen feltevésre utal: egyetlen vállalat sem nőhet örökké gyorsabban a gazdaságnál."),
    {
      kind: "check",
      id: "dcf-valuation/growth-limit",
      prompt: "Egy táblázatkezelőben épített DCF-modell óriási vagy negatív maradványértéket ad. Az elemző az örökös növekedési ütemet, $g$-t, a WACC-vel egyenlőre vagy annál nagyobbra állította. Mit jelent ez?",
      answer: {
        type: "choice",
        options: [
          "A vállalat rendkívül értékes, az eredményt meg kell tartani.",
          "A feltevés lehetetlen: a Gordon-képlethez $g < W$ kell.",
          "A maradványértéket a WACC helyett $g$-vel kell diszkontálni.",
          "Öt előrejelzési év túl kevés; több évvel megoldódik.",
        ],
        correct: 1,
      },
      explain: "A növekvő örökjáradék csak $g < W$ esetén konvergál. Ha $g \\ge W$, a sornak nincs véges összege, így a képlet eredménye értelmetlen: egyetlen vállalat sem nőhet örökké gyorsabban a diszkontrátájánál.",
    },

    h("Maradványérték"),
    p("Alkalmazzuk a képletet az előrejelzés végén. Ha az előrejelzés az 1–5. évet fedi le, az 5. évi **maradványérték** a 6. évtől kezdődő összes pénzáram akkori értéke:"),
    eq("\\text{TV}_5 = \\frac{\\text{FCF}_6}{W - g}, \\qquad \\text{EV} = \\sum_{k=1}^{5} \\frac{\\text{FCF}_k}{(1+W)^k} + \\frac{\\text{TV}_5}{(1+W)^5}."),
    p("A maradványérték maga is jövőbeli összeg, ezért ugyanúgy öt évvel diszkontáljuk vissza, mint bármely más pénzáramot."),

    h("Számpélda"),
    p("Legyen $\\text{FCF}_1 = 10$, amely évente örökké $g = 2\\%$-kal nő, és $W = 9\\%$. Az előrejelzett pénzáramok 10; 10,20; 10,40; 10,61 és 10,82; 9%-kal diszkontálva 9,17; 8,59; 8,03; 7,52 és 7,04 az értékük."),
    {
      kind: "worked",
      title: "Vállalatérték ötéves előrejelzéssel és maradványértékkel",
      steps: [
        { text: "Az öt előrejelzett év jelenértéke.", tex: "\\sum_{k=1}^{5} \\frac{\\text{FCF}_1 (1+g)^{k-1}}{(1+W)^k}", result: { value: 40.35, tolerance: 0.01 } },
        { text: "Az előrejelzés utáni első pénzáram.", tex: "\\text{FCF}_6 = \\text{FCF}_1 (1+g)^5", result: { value: 11.04, tolerance: 0.01 } },
        { text: "A maradványérték az 5. évben a Gordon-képletből.", tex: "\\text{TV}_5 = \\frac{\\text{FCF}_6}{W - g}", result: { value: 157.73, tolerance: 0.01 } },
        { text: "Diszkontáljuk vissza a maradványértéket öt évvel.", tex: "\\frac{\\text{TV}_5}{(1+W)^5}", result: { value: 102.51, tolerance: 0.01 } },
        { text: "Vállalatérték: az előrejelzett évek plusz a diszkontált maradványérték.", tex: "\\text{EV} = \\sum_{k=1}^{5} \\frac{\\text{FCF}_k}{(1+W)^k} + \\frac{\\text{TV}_5}{(1+W)^5}", result: { value: 142.86, tolerance: 0.01 } },
      ],
    },
    p("Mivel itt minden évre ugyanaz a növekedési ütem vonatkozik, ez megegyezik a teljes pénzáramra alkalmazott Gordon-képlettel, $10/0{,}07 \\approx 142{,}86$, ami hasznos ellenőrzés."),
    note("A DCF-érték nagy része általában a maradványértékben van. A példában ez az összes $102{,}51/142{,}86 \\approx 71{,}8\\%$-a, így a $g$-re és a WACC-re vonatkozó hosszú távú feltevések többet számítanak a részletes előrejelzésnél."),

    h("Érzékenység a feltevésekre"),
    p("Mivel $W - g$ a nevezőben áll, bármelyikük kis változása nagy hatással jár. Ha $g$ 2%-ról 4%-ra nő, az érték 142,86-ról $10/0{,}05 = 200$-ra emelkedik; ha a WACC 9%-ról 8%-ra csökken, $10/0{,}06 \\approx 166{,}67$-re. Az öt előrejelzett év jelenértéke egyik esetben sem mozdul lényegesen. A DCF-értékelést ezért mindig $g$- és WACC-értékek tartományával kell közölni, nem egyetlen számként."),
    p("Az ábra ezt a felbontást mutatja. A $g$ függvényében ábrázolja az 1–5. év jelenértékét, a maradványérték jelenértékét és a kettő összegét egy $\\text{FCF}_1 = 10$ pénzáramú, ötéves előrejelzésű vállalatra. A csúszkák a WACC-t és $g$-t állítják; a kijelzők a választott $g$ mellett adják meg a teljes értéket, a maradványérték részarányát és az előrejelzési évek jelenértékét; $g$ legfeljebb 5%-ig, és legfeljebb egy százalékponttal a WACC alá emelhető. Az alapbeállítások (WACC 9%, $g = 2\\%$) a példát adják vissza: 142,86, ebből kb. 71,8% a maradványérték. Növeld $g$-t, és figyeld, hogy a maradványérték meredeken nő, miközben az előrejelzési rész szinte vízszintes marad; a WACC-t csökkentve mindkettő nő."),
    figure("dcf-terminal"),

    h("A vállalatértéktől a saját tőke értékéig"),
    p("A vállalatérték a hitelezőket és a részvényeseket együtt illeti. A részvényesek része, a **saját tőke értéke**, a **nettó adósság** (adósság mínusz pénzeszközök) levonása után marad:"),
    eq("\\text{saját tőke értéke} = \\text{EV} - (\\text{adósság} - \\text{pénzeszközök}), \\qquad \\text{egy részvény értéke} = \\frac{\\text{saját tőke értéke}}{\\text{részvények száma}}."),
    p("Példa: $\\text{EV} = 142{,}86$, 45 adósság, 5 pénzeszköz és 10 részvény mellett a saját tőke értéke $142{,}86 - 40 = 102{,}86$, részvényenként kb. 10,29. Ezt a piaci árfolyammal összevetve dönti el az elemző, hogy egy részvény olcsónak vagy drágának tűnik."),

    h("Összefoglalás"),
    list(
      "A szabad pénzáram az a pénz, amelyet a működés adózás és beruházás után, a finanszírozási kifizetések előtt megtermel.",
      "A szabad pénzáram WACC-vel diszkontálva a vállalatértéket adja.",
      "Egy örökké $g < W$ ütemben növekvő pénzáram értéke $\\text{FCF}_1/(W - g)$; az előrejelzés végén alkalmazva ez a maradványérték.",
      "Általában a maradványérték dominál, ezért az eredmény nagyon érzékeny $g$-re és a WACC-re.",
      "A saját tőke értéke a vállalatérték mínusz a nettó adósság.",
    ),
    lab("/valuation", "Építs DCF-értékelést, és teszteld a maradványérték feltevéseit az Értékelés laborban"),
  ],
};
