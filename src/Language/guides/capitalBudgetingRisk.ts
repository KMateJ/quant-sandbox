import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const capitalBudgetingRisk: GuideLessonContent = {
  en: [
    p("\"Net present value and internal rate of return\" turned a project into one number: discount the cash flows at the rate $r$, subtract the investment, accept if the result is positive. Every input to that calculation, though, is a forecast. This lesson asks how much the NPV moves when the forecasts are wrong, and turns the single number into a range and then a distribution. The level cash flows are valued with the annuity factor from \"Annuities, perpetuities and loan amortization\"."),

    h("One number hides the risk"),
    p("Take a project that costs 1,000 today and runs for 5 years. Each year it sells 100 units at a price of 15, with a variable cost of 8 per unit and a fixed cost of 200. The discount rate is 8%. The annual cash flow is"),
    eq("CF = Q\\,(P - c) - F = 100 \\times (15 - 8) - 200 = 500,"),
    p("and since it is the same every year, its present value is the cash flow times the 5-year annuity factor:"),
    eq("NPV = CF \\cdot \\frac{1 - (1+r)^{-T}}{r} - I = 500 \\times 3.9927 - 1{,}000 = 996.36."),
    p("A positive NPV of almost 1,000 looks comfortable. But the 100 units and the price of 15 are guesses about a market that does not exist yet. Two projects with the same NPV can differ greatly in how likely they are to lose money, and the single number says nothing about that. The tools below, in increasing order of effort, describe that uncertainty."),

    h("Sensitivity analysis"),
    p("**Sensitivity analysis** changes one input at a time, holding all the others at their base values, and records the NPV. A common convention is ±10% for every input, so the results are comparable. For the project above:"),
    list(
      "Units sold (90 / 110): NPV 716.87 / 1,275.84.",
      "Price (13.50 / 16.50): NPV 397.45 / 1,595.26.",
      "Unit cost (7.20 / 8.80): NPV 1,315.77 / 676.94.",
      "Fixed cost (180 / 220): NPV 1,076.21 / 916.50.",
      "Investment (900 / 1,100): NPV 1,096.36 / 896.36.",
      "Discount rate (7.2% / 8.8%): NPV 1,039.17 / 954.96.",
    ),
    p("The price is by far the most important input: a 10% change in price moves the margin per unit from 7 to 5.50 or 8.50, which is a 21% change in the margin, and the NPV moves by about 600 either way. The discount rate matters least here. Sorting the inputs by the width of their range, often drawn as a **tornado chart**, tells you where to spend effort on better forecasts."),
    {
      kind: "worked",
      title: "Base NPV and a 10% change in units sold",
      steps: [
        { text: "The annual cash flow at the base case.", tex: "100 \\times (15 - 8) - 200", result: { value: 500, tolerance: 0.01 } },
        { text: "The 5-year annuity factor at 8%.", tex: "\\frac{1 - 1.08^{-5}}{0.08}", result: { value: 3.9927, tolerance: 0.0005 } },
        { text: "The base NPV.", tex: "500 \\times 3.9927 - 1{,}000", result: { value: 996.36, tolerance: 0.05 } },
        { text: "The cash flow with 10% fewer units (90).", tex: "90 \\times 7 - 200", result: { value: 430, tolerance: 0.01 } },
        { text: "The NPV with 90 units.", tex: "430 \\times 3.9927 - 1{,}000", result: { value: 716.87, tolerance: 0.05 } },
        { text: "The NPV with 110 units.", tex: "570 \\times 3.9927 - 1{,}000", result: { value: 1275.84, tolerance: 0.05 } },
      ],
    },
    {
      kind: "check",
      id: "capital-budgeting-risk/one-at-a-time",
      prompt: "What does a sensitivity analysis change at each step?",
      answer: { type: "choice", options: ["All inputs together, in their best or worst direction", "One input, with all the others held at their base values", "The discount rate only", "Random draws of every input"], correct: 1 },
      explain: "Sensitivity analysis moves one input at a time and keeps the others at the base case, so each NPV change can be attributed to that input. Moving inputs together is scenario analysis; random draws are Monte Carlo simulation.",
    },

    h("Break-even analysis"),
    p("Sensitivity asks how much the NPV moves; **break-even analysis** asks how far an input can move before the NPV reaches zero. Because the NPV is linear in units sold here, the break-even can be found by hand: the project needs an annual cash flow of $1{,}000 / 3.9927 = 250.46$, so"),
    eq("Q^{*}\\,(15 - 8) - 200 = 250.46 \\quad\\Rightarrow\\quad Q^{*} = \\frac{450.46}{7} = 64.35."),
    p("Sales can fall by more than a third before the project destroys value. The same reasoning gives a break-even price of 12.50 (17% below the base) and a break-even unit cost of 10.50 (31% above). For inputs that enter non-linearly, such as the discount rate, the break-even is found numerically; for the rate it is the IRR. A break-even close to the base value is a warning that a modest forecast error will flip the decision."),
    {
      kind: "check",
      id: "capital-budgeting-risk/break-even-units",
      prompt: "With all other inputs at their base values, how many units per year must the project sell for its NPV to be zero?",
      answer: { type: "number", value: 64.35, tolerance: 0.1, unit: "units" },
      explain: "The required annual cash flow is $1{,}000 / 3.9927 = 250.46$. Adding back the fixed cost gives a margin of 450.46, and dividing by the unit margin of 7 gives 64.35 units.",
    },

    h("Scenario analysis"),
    p("Inputs rarely move one at a time. A weak market usually means both fewer units and a lower price. **Scenario analysis** moves several inputs together into a consistent story. With a best case of 120 units at 16.50 and a worst case of 80 units at 13.50 (all else at base), the NPV is 2,274.02 in the best case, 996.36 in the base case and −41.75 in the worst case. The joint move is much larger than either one-input range, and the worst case is now a loss."),
    p("Scenarios are easy to explain to a decision maker, but they show only three points. They do not say how likely the worst case is, and the choice of 'worst' is itself a judgement."),

    h("Monte Carlo simulation"),
    p("**Monte Carlo simulation** replaces each uncertain input by a probability distribution, draws many joint samples, and computes the NPV for each one. The result is a whole distribution of NPVs. In the figure, units sold are normal with mean 100 and standard deviation 20, the price is normal with mean 15 and standard deviation 1.5 (both truncated at zero), and the other inputs are fixed. The standard deviation is the same measure of spread as in \"Returns and volatility\"; here it measures how far a forecast is likely to be off."),
    figure("npv-distribution"),
    p("With 5,000 seeded draws at the default settings, the base-case NPV is 996.36, the mean of the simulated NPVs is 993.77 (the inputs enter almost linearly, so the mean stays close to the base case, apart from sampling noise), the probability of a negative NPV is 11.0% and the 5th percentile is −271.85. Set both standard deviations to zero and the histogram collapses to a single bar at 996.36; widen them and the mass left of the zero marker grows."),
    note("The simulation is only as good as its input distributions. Units and price are drawn independently here; in practice they are often correlated (a high price may cut sales), and ignoring that correlation can make the spread too wide or too narrow."),

    h("What to do with the distribution"),
    p("The mean simulated NPV is still the number to compare with zero when the firm is diversified and the rate $r$ already prices the project's risk. Discounting at $r$ and then penalising the spread again would count the risk twice. The distribution adds information that the mean does not: the **probability of a loss**, the size of a bad outcome (the 5th percentile, the same idea as value at risk), and which inputs drive the downside. That information guides practical decisions: whether to run a pilot to learn about demand before investing in full, whether to sign a fixed-price contract to remove price risk, or whether the firm can survive the bad tail at all."),
    p("Some of those decisions are themselves valuable: the right to wait, expand or abandon once the uncertainty resolves is worth more the wider the distribution. That is the subject of the real options lesson later in this track."),

    h("Summary"),
    list(
      "A single NPV hides how uncertain its inputs are; the same NPV can carry very different risk.",
      "Sensitivity analysis moves one input at a time (for example ±10%) and ranks the inputs by their effect on NPV.",
      "Break-even analysis finds the value of an input at which NPV is zero; for the default project, 64.35 units a year.",
      "Scenario analysis moves several inputs together into best, base and worst cases.",
      "Monte Carlo simulation gives the whole NPV distribution: its mean, the probability of a loss and percentiles of the downside.",
    ),
    lab("/npv-irr", "Open the NPV & IRR Lab to run sensitivities and scenarios on your own cash flows"),
  ],
  hu: [
    p("A „Nettó jelenérték és belső megtérülési ráta” egy projektet egyetlen számmá alakított: diszkontáld a pénzáramokat $r$ rátával, vond le a beruházást, és fogadd el, ha az eredmény pozitív. A számítás minden bemenete azonban előrejelzés. Ez a lecke azt kérdezi, mennyit mozdul az NPV, ha az előrejelzések tévednek, és az egyetlen számból előbb egy sávot, majd egy eloszlást csinál. Az egyenletes pénzáramokat az „Annuitások, örökjáradékok és hiteltörlesztés” annuitásfaktorával értékeljük."),

    h("Egy szám elrejti a kockázatot"),
    p("Vegyünk egy projektet, amely ma 1000-be kerül, és 5 évig fut. Évente 100 egységet ad el 15-ös áron, egységenként 8 változó költséggel és 200 fix költséggel. A diszkontráta 8%. Az éves pénzáram"),
    eq("CF = Q\\,(P - c) - F = 100 \\times (15 - 8) - 200 = 500,"),
    p("és mivel minden évben ugyanannyi, a jelenértéke a pénzáram szorozva az 5 éves annuitásfaktorral:"),
    eq("NPV = CF \\cdot \\frac{1 - (1+r)^{-T}}{r} - I = 500 \\times 3{,}9927 - 1000 = 996{,}36."),
    p("A közel 1000-es pozitív NPV megnyugtatónak tűnik. De a 100 egység és a 15-ös ár egy még nem létező piacra vonatkozó becslés. Két azonos NPV-jű projekt nagyon különbözhet abban, mekkora eséllyel veszít pénzt, és erről az egyetlen szám semmit sem mond. Az alábbi eszközök, egyre több munkával, ezt a bizonytalanságot írják le."),

    h("Érzékenységvizsgálat"),
    p("Az **érzékenységvizsgálat** egyszerre egy bemenetet változtat, a többit az alapértéken tartja, és feljegyzi az NPV-t. Gyakori konvenció minden bemenetre ±10%, így az eredmények összevethetők. A fenti projektre:"),
    list(
      "Eladott mennyiség (90 / 110): NPV 716,87 / 1275,84.",
      "Ár (13,50 / 16,50): NPV 397,45 / 1595,26.",
      "Egységköltség (7,20 / 8,80): NPV 1315,77 / 676,94.",
      "Fix költség (180 / 220): NPV 1076,21 / 916,50.",
      "Beruházás (900 / 1100): NPV 1096,36 / 896,36.",
      "Diszkontráta (7,2% / 8,8%): NPV 1039,17 / 954,96.",
    ),
    p("Messze az ár a legfontosabb bemenet: 10%-os árváltozás az egységnyi fedezetet 7-ről 5,50-re vagy 8,50-re viszi, ez a fedezet 21%-os változása, és az NPV mindkét irányban nagyjából 600-zal mozdul. A diszkontráta itt számít a legkevésbé. Ha a bemeneteket a sávjuk szélessége szerint sorba rendezed (ezt gyakran **tornádódiagramként** rajzolják), látod, hol érdemes jobb előrejelzésre energiát fordítani."),
    {
      kind: "worked",
      title: "Az alap NPV és az eladott mennyiség 10%-os változása",
      steps: [
        { text: "Az éves pénzáram az alapesetben.", tex: "100 \\times (15 - 8) - 200", result: { value: 500, tolerance: 0.01 } },
        { text: "Az 5 éves annuitásfaktor 8%-on.", tex: "\\frac{1 - 1{,}08^{-5}}{0{,}08}", result: { value: 3.9927, tolerance: 0.0005 } },
        { text: "Az alap NPV.", tex: "500 \\times 3{,}9927 - 1000", result: { value: 996.36, tolerance: 0.05 } },
        { text: "A pénzáram 10%-kal kevesebb (90) egységgel.", tex: "90 \\times 7 - 200", result: { value: 430, tolerance: 0.01 } },
        { text: "Az NPV 90 egységgel.", tex: "430 \\times 3{,}9927 - 1000", result: { value: 716.87, tolerance: 0.05 } },
        { text: "Az NPV 110 egységgel.", tex: "570 \\times 3{,}9927 - 1000", result: { value: 1275.84, tolerance: 0.05 } },
      ],
    },
    {
      kind: "check",
      id: "capital-budgeting-risk/one-at-a-time",
      prompt: "Mit változtat az érzékenységvizsgálat egy-egy lépésben?",
      answer: { type: "choice", options: ["Minden bemenetet együtt, a legjobb vagy legrosszabb irányba", "Egyetlen bemenetet, a többit az alapértéken tartva", "Csak a diszkontrátát", "Minden bemenet véletlen húzását"], correct: 1 },
      explain: "Az érzékenységvizsgálat egyszerre egy bemenetet mozgat, a többit az alapesetben hagyja, így minden NPV-változás annak a bemenetnek tulajdonítható. A bemenetek együttes mozgatása a forgatókönyv-elemzés, a véletlen húzás a Monte Carlo-szimuláció.",
    },

    h("Fedezetipont-elemzés"),
    p("Az érzékenység azt kérdezi, mennyit mozdul az NPV; a **fedezetipont-elemzés** azt, hogy meddig mozdulhat egy bemenet, mielőtt az NPV nullára csökken. Mivel itt az NPV lineáris az eladott mennyiségben, a fedezeti pont kézzel is megkapható: a projektnek $1000 / 3{,}9927 = 250{,}46$ éves pénzáram kell, tehát"),
    eq("Q^{*}\\,(15 - 8) - 200 = 250{,}46 \\quad\\Rightarrow\\quad Q^{*} = \\frac{450{,}46}{7} = 64{,}35."),
    p("Az eladások több mint egyharmadával csökkenhetnek, mielőtt a projekt értéket rombol. Ugyanígy a fedezeti ár 12,50 (17%-kal az alap alatt), a fedezeti egységköltség 10,50 (31%-kal felette). A nemlineárisan belépő bemenetekre, például a diszkontrátára, a fedezeti pontot numerikusan keressük; a rátára ez éppen az IRR. Ha a fedezeti pont közel van az alapértékhez, az figyelmeztetés: egy mérsékelt előrejelzési hiba is megfordítja a döntést."),
    {
      kind: "check",
      id: "capital-budgeting-risk/break-even-units",
      prompt: "Ha minden más bemenet az alapértékén van, évente hány egységet kell eladnia a projektnek, hogy az NPV nulla legyen?",
      answer: { type: "number", value: 64.35, tolerance: 0.1, unit: "egység" },
      explain: "A szükséges éves pénzáram $1000 / 3{,}9927 = 250{,}46$. A fix költséget hozzáadva 450,46 fedezet kell, ezt az egységnyi 7-es fedezettel osztva 64,35 egység adódik.",
    },

    h("Forgatókönyv-elemzés"),
    p("A bemenetek ritkán mozognak egyenként. A gyenge piac általában kevesebb eladott egységet és alacsonyabb árat is jelent. A **forgatókönyv-elemzés** több bemenetet egy következetes történetbe rendezve mozgat együtt. Ha a legjobb eset 120 egység 16,50-es áron, a legrosszabb 80 egység 13,50-es áron (minden más az alapon), akkor az NPV a legjobb esetben 2274,02, az alapesetben 996,36, a legrosszabban −41,75. Az együttes mozgás sokkal nagyobb, mint bármelyik egybemenetes sáv, és a legrosszabb eset már veszteség."),
    p("A forgatókönyveket könnyű elmagyarázni a döntéshozónak, de csak három pontot mutatnak. Nem mondják meg, mennyire valószínű a legrosszabb eset, és már a „legrosszabb” kiválasztása is mérlegelés kérdése."),

    h("Monte Carlo-szimuláció"),
    p("A **Monte Carlo-szimuláció** minden bizonytalan bemenetet valószínűségi eloszlással helyettesít, sok együttes mintát húz, és mindegyikre kiszámítja az NPV-t. Az eredmény az NPV-k teljes eloszlása. Az ábrán az eladott mennyiség normális 100 várható értékkel és 20 szórással, az ár normális 15 várható értékkel és 1,5 szórással (mindkettő nullánál csonkolva), a többi bemenet rögzített. A szórás ugyanaz a szóródási mérték, mint a „Hozamok és volatilitás” leckében; itt azt méri, mennyire tévedhet egy előrejelzés."),
    figure("npv-distribution"),
    p("Az alapbeállításokon 5000 rögzített magú húzással az alapeseti NPV 996,36, a szimulált NPV-k átlaga 993,77 (a bemenetek majdnem lineárisan lépnek be, így az átlag a mintavételi zajtól eltekintve az alapeset közelében marad), a negatív NPV valószínűsége 11,0%, az 5. percentilis pedig −271,85. Ha mindkét szórást nullára állítod, a hisztogram egyetlen oszloppá zsugorodik 996,36-nál; ha növeled őket, a nulla jelölőtől balra eső tömeg nő."),
    note("A szimuláció csak annyira jó, amennyire a bemeneti eloszlásai. Itt a mennyiséget és az árat egymástól függetlenül húzzuk; a gyakorlatban gyakran korrelálnak (a magas ár csökkentheti az eladásokat), és ennek elhanyagolása túl szélessé vagy túl szűkké teheti a szóródást."),

    h("Mit kezdjünk az eloszlással"),
    p("A szimulált NPV átlaga továbbra is az a szám, amelyet nullával vetünk össze, ha a vállalat diverzifikált, és az $r$ ráta már beárazza a projekt kockázatát. Ha $r$-rel diszkontálunk, majd a szóródásért még egyszer büntetünk, a kockázatot kétszer számoljuk. Az eloszlás olyan információt ad, amit az átlag nem: a **veszteség valószínűségét**, egy rossz kimenet méretét (az 5. percentilis, ugyanaz a gondolat, mint a kockáztatott érték) és azt, hogy mely bemenetek okozzák a veszteségkockázatot. Ez gyakorlati döntéseket irányít: érdemes-e próbaüzemmel tanulni a keresletről a teljes beruházás előtt, érdemes-e fix áras szerződéssel kiiktatni az árkockázatot, és túléli-e egyáltalán a vállalat a rossz kimeneteket."),
    p("E döntések némelyike maga is értékes: a várakozás, a bővítés vagy a kiszállás joga, miután a bizonytalanság feloldódik, annál többet ér, minél szélesebb az eloszlás. Erről szól a reálopciókról szóló lecke a pálya későbbi részében."),

    h("Összefoglalás"),
    list(
      "Egyetlen NPV elrejti, mennyire bizonytalanok a bemenetei; ugyanaz az NPV nagyon különböző kockázatot hordozhat.",
      "Az érzékenységvizsgálat egyszerre egy bemenetet mozgat (például ±10%-kal), és a bemeneteket az NPV-re gyakorolt hatásuk szerint rangsorolja.",
      "A fedezetipont-elemzés megkeresi azt a bemeneti értéket, amelynél az NPV nulla; az alapprojektnél ez évi 64,35 egység.",
      "A forgatókönyv-elemzés több bemenetet együtt mozgat legjobb, alap- és legrosszabb esetbe.",
      "A Monte Carlo-szimuláció a teljes NPV-eloszlást adja: az átlagát, a veszteség valószínűségét és az alsó percentiliseket.",
    ),
    lab("/npv-irr", "Nyisd meg az NPV és IRR labort, és futtass érzékenységeket és forgatókönyveket a saját pénzáramaidra"),
  ],
};
