import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const valuationMultiples: GuideLessonContent = {
  en: [
    p("\"Discounted cash flow valuation\" values a firm from its own forecast cash flows. In practice analysts almost always check that number against a second one: what similar firms trade for in the market. This lesson explains that relative valuation with multiples, how to apply a multiple correctly, and how a multiple connects back to the discounting of the earlier lesson."),

    h("What a multiple is"),
    p("A **multiple** is a market value divided by a measure of the firm's size or performance. If comparable firms trade at about 15 times their earnings, a similar firm with earnings of 4 per share might be worth about $15 \\times 4 = 60$ per share. The multiple turns one firm's market price into a rate that can be applied to another firm."),
    p("The common multiples fall into two families, depending on whose claim the numerator measures:"),
    list(
      "**Equity multiples** put the value of the shares on top: price to earnings (P/E), price to book value of equity (P/B). The denominator must also belong to shareholders: net income, book equity.",
      "**Enterprise multiples** put the **enterprise value** on top, the value of the whole business to all its investors, $\\text{EV} = \\text{equity value} + \\text{net debt}$. The denominator must be earned before any payment to lenders: EBITDA (earnings before interest, taxes, depreciation and amortisation), EBIT or sales.",
    ),
    p("Mixing the families is the most common error. EBITDA is earned for lenders and shareholders together, so dividing the share price by EBITDA compares a part with the whole, and the result depends on how much debt the firm has, not on how well it operates."),
    note("Numerator and denominator must belong to the same investors: equity value with net income or book equity, enterprise value with EBITDA, EBIT or sales."),
    {
      kind: "check",
      id: "valuation-multiples/consistent-pair",
      prompt: "Which of these multiples pairs a numerator and a denominator that belong to the same investors?",
      answer: {
        type: "choice",
        options: ["Share price / EBITDA", "Enterprise value / net income", "Enterprise value / EBITDA", "Share price / sales"],
        correct: 2,
      },
      explain: "EBITDA is earned for lenders and shareholders together, so it goes with the enterprise value. Price with EBITDA or sales, or EV with net income, mixes a part with the whole, and the result depends on the firm's debt.",
    },

    h("From a multiple to a value"),
    p("Applying an enterprise multiple gives an enterprise value; the equity value then follows by subtracting net debt, exactly as at the end of a DCF valuation:"),
    eq("\\text{EV}_{\\text{target}} = m \\cdot \\text{EBITDA}_{\\text{target}}, \\qquad \\text{Equity}_{\\text{target}} = \\text{EV}_{\\text{target}} - \\text{net debt}."),
    p("Example: a target with EBITDA of 50 and net debt of 120 (in millions), valued at 10 times EBITDA, has $\\text{EV} = 500$ and equity worth $500 - 120 = 380$. Using 500 as the equity value would overstate it by the whole debt."),
    {
      kind: "check",
      id: "valuation-multiples/equity-from-ev",
      prompt: "Peers trade at 8 times EBITDA. The target has EBITDA of 80 and net debt of 200. What is its implied equity value?",
      answer: { type: "number", value: 440, tolerance: 0.5 },
      explain: "The enterprise multiple gives $\\text{EV} = 8 \\times 80 = 640$; subtracting net debt leaves $640 - 200 = 440$ for the shareholders.",
    },

    h("Choosing comparable firms"),
    p("A multiple is only as good as the firms it comes from. **Comparable firms** (peers) should resemble the target in what drives value: the same industry and business model, similar growth, similar risk and similar margins. Peers are rarely perfect, so the analyst summarises several of them."),
    p("Example: five peers trade at P/E ratios of 14, 16, 15, 22 and 13, and the target earns 4 per share. The **median** is the middle value after sorting (13, 14, 15, 16, 22)."),
    {
      kind: "worked",
      title: "Mean and median P/E of five peers",
      steps: [
        { text: "The mean of the five peer multiples.", tex: "\\bar m = \\frac{1}{5}\\sum_{i=1}^{5} m_i", result: { value: 16, tolerance: 0.01 } },
        { text: "The median: the middle value of the sorted list.", tex: "\\tilde m = m_{(3)}", result: { value: 15, tolerance: 0.01 } },
        { text: "Value per share using the mean.", tex: "P = \\bar m \\cdot E", result: { value: 64, tolerance: 0.01 } },
        { text: "Value per share using the median.", tex: "P = \\tilde m \\cdot E", result: { value: 60, tolerance: 0.01 } },
      ],
    },
    p("The single high value of 22 pulls the mean up but does not move the median, which is why the median is the usual summary."),

    h("Multiples and growth"),
    p("Peers seldom have the same growth, and faster-growing firms deserve higher multiples. A simple fix is to plot the peers' multiples against their expected growth and fit a straight line by least squares, $m = a + b \\cdot g$. The target's multiple is then read off the line at its own expected growth, instead of taking the median of firms that grow faster or slower than it does."),
    p("The figure does this with six made-up but plausible peers, A to F, valued on EV/EBITDA, and the target from the example above (EBITDA 50, net debt 120). Drag the diamond sideways, or focus it and use the arrow keys, to set the target's expected growth; it slides along the fitted line, and the readouts show the multiple on the line, the implied enterprise value and the implied equity value. Click a peer to drop it from the fit, and click again to bring it back. At the defaults, with all six peers and 7% growth, the line gives 11.38 times EBITDA and an equity value of 449.2. Peer F trades at 16.5 times on takeover rumours; drop it and the line gives 10.30 times and an equity value of 394.8, and the median falls from 10.35 to 9.9. One unusual peer moves the answer by more than 10%."),
    figure("multiples-peers"),

    h("The justified multiple"),
    p("A multiple is not only a market convention; it can be derived from the discounting of the previous lessons. Suppose a firm pays out a fixed share $b$ of its earnings as dividends, and earnings and dividends grow at $g$ for ever. With the Gordon formula and required return $r$, the share price today is"),
    eq("P_0 = \\frac{D_1}{r - g} = \\frac{b\\,E_0\\,(1 + g)}{r - g}, \\qquad \\frac{P_0}{E_0} = \\frac{b\\,(1 + g)}{r - g}."),
    p("This **justified P/E** shows what a multiple encodes: it rises with growth and payout and falls with risk. With $b = 60\\%$, $r = 9\\%$ and $g = 3\\%$, the justified P/E is $0.6 \\times 1.03 / 0.06 = 10.3$. If peers trade at 15 times earnings, the market is either expecting more growth or less risk than these inputs, or the peers are expensive. A multiple is therefore a compressed DCF: it hides the same assumptions, but does not state them."),

    h("Summary"),
    list(
      "A multiple divides a market value by a size or performance measure; it transfers a market price from peers to the target.",
      "Equity values pair with equity measures (P/E, P/B) and enterprise values with operating measures (EV/EBITDA, EV/Sales); equity value is EV minus net debt.",
      "The median is the usual summary of peer multiples because a single outlier moves the mean but not the median.",
      "Differences in growth can be handled by regressing multiples on growth and reading the target's multiple off the line.",
      "The justified P/E $b(1+g)/(r-g)$ links a multiple to the same inputs as a DCF valuation.",
    ),
    note("The next lesson, \"Real options: the value of flexibility\", adds what neither DCF nor multiples capture well: the value of being able to delay, expand or abandon a project."),
    lab("/valuation", "Compare a multiple-based value with a full DCF in the Valuation lab"),
  ],

  hu: [
    p("A „Diszkontált pénzáram alapú értékelés” egy vállalatot a saját előrejelzett pénzáramaiból értékel. A gyakorlatban az elemzők szinte mindig összevetik ezt az értéket egy másodikkal: azzal, amennyit hasonló vállalatokért a piac fizet. Ez a lecke a szorzókkal történő relatív értékelést mutatja be: hogyan kell egy szorzót helyesen alkalmazni, és hogyan kapcsolódik a szorzó az előző lecke diszkontálásához."),

    h("Mi a szorzó"),
    p("A **szorzó** egy piaci érték osztva a vállalat méretének vagy teljesítményének valamely mérőszámával. Ha a hasonló vállalatok nagyjából a nyereségük 15-szörösén forognak, egy részvényenként 4 nyereséget termelő hasonló vállalat részvényenként nagyjából $15 \\times 4 = 60$-at érhet. A szorzó az egyik vállalat piaci árát olyan arányszámmá alakítja, amely egy másik vállalatra is alkalmazható."),
    p("A szokásos szorzók két családba tartoznak aszerint, hogy a számláló kinek a követelését méri:"),
    list(
      "A **saját tőkére vonatkozó szorzók** számlálójában a részvények értéke áll: árfolyam/nyereség (P/E), árfolyam/saját tőke könyv szerinti értéke (P/B). A nevezőnek is a részvényesekhez kell tartoznia: adózott eredmény, könyv szerinti saját tőke.",
      "A **vállalatértékre vonatkozó szorzók** számlálójában a **vállalatérték** (enterprise value) áll, a teljes üzlet értéke minden befektető számára, $\\text{EV} = \\text{saját tőke értéke} + \\text{nettó adósság}$. A nevezőnek a hitelezőknek járó kifizetések előtt kell keletkeznie: EBITDA (kamat, adó és értékcsökkenés előtti eredmény), EBIT vagy árbevétel.",
    ),
    p("A két család összekeverése a leggyakoribb hiba. Az EBITDA-t a hitelezők és a részvényesek együtt kapják, ezért ha az árfolyamot EBITDA-val osztjuk, egy részt hasonlítunk az egészhez, és az eredmény attól függ, mennyi adóssága van a vállalatnak, nem attól, mennyire jól működik."),
    note("A számlálónak és a nevezőnek ugyanazokhoz a befektetőkhöz kell tartoznia: a saját tőke értéke az adózott eredménnyel vagy a könyv szerinti saját tőkével, a vállalatérték az EBITDA-val, az EBIT-tel vagy az árbevétellel."),
    {
      kind: "check",
      id: "valuation-multiples/consistent-pair",
      prompt: "Az alábbi szorzók közül melyikben tartozik a számláló és a nevező ugyanazokhoz a befektetőkhöz?",
      answer: {
        type: "choice",
        options: ["Árfolyam / EBITDA", "Vállalatérték / adózott eredmény", "Vállalatérték / EBITDA", "Árfolyam / árbevétel"],
        correct: 2,
      },
      explain: "Az EBITDA-t a hitelezőknek és a részvényeseknek együtt termeli a vállalat, ezért a vállalatértékhez illik. Az árfolyam az EBITDA-val vagy az árbevétellel, illetve a vállalatérték az adózott eredménnyel részt állít szembe az egésszel, és az eredmény a vállalat adósságától függ.",
    },

    h("A szorzótól az értékig"),
    p("Egy vállalatérték-szorzó alkalmazása vállalatértéket ad; a saját tőke értéke ebből a nettó adósság levonásával adódik, pontosan úgy, mint egy DCF-értékelés végén:"),
    eq("\\text{EV}_{\\text{cél}} = m \\cdot \\text{EBITDA}_{\\text{cél}}, \\qquad \\text{Saját tőke}_{\\text{cél}} = \\text{EV}_{\\text{cél}} - \\text{nettó adósság}."),
    p("Példa: egy célvállalat EBITDA-ja 50, nettó adóssága 120 (millió). Az EBITDA tízszeresén értékelve $\\text{EV} = 500$, a saját tőke értéke pedig $500 - 120 = 380$. Ha az 500-at a saját tőke értékének vennénk, a teljes adóssággal túlbecsülnénk."),
    {
      kind: "check",
      id: "valuation-multiples/equity-from-ev",
      prompt: "A társcégek az EBITDA nyolcszorosán forognak. A célvállalat EBITDA-ja 80, nettó adóssága 200. Mennyi a saját tőkéjének implikált értéke?",
      answer: { type: "number", value: 440, tolerance: 0.5 },
      explain: "A vállalatérték-szorzóból $\\text{EV} = 8 \\times 80 = 640$; a nettó adósság levonása után $640 - 200 = 440$ marad a részvényeseknek.",
    },

    h("A hasonló vállalatok kiválasztása"),
    p("Egy szorzó csak annyira jó, amennyire a vállalatok, amelyekből származik. A **hasonló vállalatoknak** (társcégeknek) abban kell hasonlítaniuk a célvállalatra, ami az értéket hajtja: ugyanaz az iparág és üzleti modell, hasonló növekedés, hasonló kockázat és hasonló árrés. Tökéletes társcég ritkán van, ezért az elemző több cég szorzóját foglalja össze."),
    p("Számpélda: öt társcég P/E-je 14, 16, 15, 22 és 13, a célvállalat részvényenként 4 nyereséget termel. A **medián** a sorba rendezés (13, 14, 15, 16, 22) utáni középső érték."),
    {
      kind: "worked",
      title: "Öt társcég P/E-jének átlaga és mediánja",
      steps: [
        { text: "Az öt társcég szorzójának átlaga.", tex: "\\bar m = \\frac{1}{5}\\sum_{i=1}^{5} m_i", result: { value: 16, tolerance: 0.01 } },
        { text: "A medián: a rendezett sor középső eleme.", tex: "\\tilde m = m_{(3)}", result: { value: 15, tolerance: 0.01 } },
        { text: "Részvényenkénti érték az átlaggal.", tex: "P = \\bar m \\cdot E", result: { value: 64, tolerance: 0.01 } },
        { text: "Részvényenkénti érték a mediánnal.", tex: "P = \\tilde m \\cdot E", result: { value: 60, tolerance: 0.01 } },
      ],
    },
    p("Az egyetlen magas, 22-es érték felhúzza az átlagot, a mediánt viszont nem mozdítja el; ezért a medián a szokásos összefoglaló."),

    h("Szorzók és növekedés"),
    p("A társcégek ritkán nőnek ugyanolyan ütemben, és a gyorsabban növekvő vállalatok magasabb szorzót érdemelnek. Egyszerű megoldás, ha a társcégek szorzóit a várt növekedésük függvényében ábrázoljuk, és a legkisebb négyzetek módszerével egyenest illesztünk rájuk, $m = a + b \\cdot g$. A célvállalat szorzóját ezután a saját várt növekedésénél olvassuk le az egyenesről, ahelyett hogy nála gyorsabban vagy lassabban növekvő cégek mediánját vennénk."),
    p("Az ábra ezt mutatja hat kitalált, de életszerű társcéggel (A–F) EV/EBITDA alapon, a fenti példa célvállalatával (EBITDA 50, nettó adósság 120). Húzd oldalra a rombuszt, vagy jelöld ki és használd a nyílbillentyűket, hogy beállítsd a célvállalat várt növekedését; a rombusz az illesztett egyenesen csúszik, a kijelzők pedig az egyenesen leolvasott szorzót, az implikált vállalatértéket és az implikált saját tőkét mutatják. Egy társcégre kattintva kiveheted az illesztésből, újabb kattintással visszateheted. Alapbeállításnál, mind a hat társcéggel és 7%-os növekedéssel, az egyenes az EBITDA 11,38-szorosát és 449,2-es saját tőke értéket ad. Az F társcég felvásárlási hírek miatt 16,5-szörösön forog; ha kiveszed, az egyenes 10,30-szorost és 394,8-as saját tőke értéket ad, a medián pedig 10,35-ről 9,9-re esik. Egyetlen szokatlan társcég több mint 10%-kal mozdítja el az eredményt."),
    figure("multiples-peers"),

    h("Az indokolt szorzó"),
    p("A szorzó nem csak piaci konvenció; az előző leckék diszkontálásából le is vezethető. Tegyük fel, hogy egy vállalat nyereségének állandó $b$ hányadát fizeti ki osztalékként, és a nyereség és az osztalék örökké $g$ ütemben nő. A Gordon-képlettel és $r$ elvárt hozammal a mai árfolyam"),
    eq("P_0 = \\frac{D_1}{r - g} = \\frac{b\\,E_0\\,(1 + g)}{r - g}, \\qquad \\frac{P_0}{E_0} = \\frac{b\\,(1 + g)}{r - g}."),
    p("Ez az **indokolt P/E** megmutatja, mit kódol egy szorzó: a növekedéssel és a kifizetési aránnyal nő, a kockázattal csökken. $b = 60\\%$, $r = 9\\%$ és $g = 3\\%$ mellett az indokolt P/E $0{,}6 \\times 1{,}03 / 0{,}06 = 10{,}3$. Ha a társcégek a nyereségük 15-szörösén forognak, akkor a piac vagy nagyobb növekedést, vagy kisebb kockázatot vár, mint ezek a feltevések, vagy a társcégek drágák. A szorzó tehát egy összesűrített DCF: ugyanazokat a feltevéseket rejti, csak nem mondja ki őket."),

    h("Összefoglalás"),
    list(
      "A szorzó egy piaci értéket oszt egy méret- vagy teljesítménymutatóval; a társcégek piaci árát viszi át a célvállalatra.",
      "A saját tőke értéke saját tőkére vonatkozó mutatóval (P/E, P/B), a vállalatérték működési mutatóval (EV/EBITDA, EV/árbevétel) párosul; a saját tőke értéke az EV mínusz a nettó adósság.",
      "A társcégek szorzóit szokás a mediánnal összefoglalni, mert egyetlen kiugró érték az átlagot elmozdítja, a mediánt nem.",
      "A növekedésbeli különbségek kezelhetők, ha a szorzókat a növekedésre regresszáljuk, és a célvállalat szorzóját az egyenesről olvassuk le.",
      "Az indokolt P/E, $b(1+g)/(r-g)$, ugyanazokhoz a bemenetekhez köti a szorzót, mint egy DCF-értékelés.",
    ),
    note("A következő lecke, a „Reálopciók: a rugalmasság értéke”, azt teszi hozzá, amit sem a DCF, sem a szorzók nem ragadnak meg jól: annak értékét, hogy egy projektet el lehet halasztani, bővíteni vagy le lehet állítani."),
    lab("/valuation", "Vesd össze a szorzó alapú értéket egy teljes DCF-fel az Értékelés laborban"),
  ],
};
