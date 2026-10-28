import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, p } from "./blocks";

export const glostenMilgrom: GuideLessonContent = {
  en: [
    p("\"Adverse selection and informed trading\" showed that a market maker, a dealer who continuously quotes a price to buy and a price to sell, loses money to traders who know more than the quote does, and that the spread has to be wide enough to pay for those losses. This lesson builds the simplest model in which that statement is derived instead of asserted: the Glosten–Milgrom model. It uses the conditional expectations and the martingale property from \"Conditional expectation and martingales\". The quotes are conditional expectations, the maker's belief is a martingale, and the spread, the learning and the speed of learning all follow from Bayes' rule."),

    h("Set-up"),
    p("The asset is worth $V$, which is either $0$ or $1$ and is revealed only at the end. Everyone starts from the same prior belief $\\mu_0 = P(V = 1)$. Traders arrive one at a time, and each trades one unit with the market maker, who quotes a **bid** $b$ (the price the maker pays) and an **ask** $a$ (the price the maker charges). Independently of everything else, each trader is:"),
    list(
      "informed with probability $\\pi$: knows $V$, buys if $V = 1$ and sells if $V = 0$;",
      "a noise trader with probability $1-\\pi$: buys or sells with probability $\\tfrac12$ each, whatever $V$ is.",
    ),
    p("The maker is risk-neutral and competes with other makers, so quotes are set to make the expected profit on each trade zero. The maker knows $\\pi$ and the current belief $\\mu$, but cannot tell an informed trader from a noise trader: all that is seen is the direction of the trade."),

    h("Quotes as conditional expectations"),
    p("Take the ask. When a trader buys at $a$, the maker receives $a$ and owes an asset worth $V$, so the profit on the trade is $a - V$. Requiring zero expected profit given that a buy has happened, and the same for a sell, gives"),
    eq("a = E[V \\mid \\text{buy}], \\qquad b = E[V \\mid \\text{sell}]."),
    p("Because $V$ is $0$ or $1$, its conditional expectation is the conditional probability that $V = 1$, and Bayes' rule computes it. First the chance of a buy in each state. If $V = 1$, an informed trader buys for sure and a noise trader buys half the time; if $V = 0$, only noise traders buy:"),
    eq("P(\\text{buy} \\mid V=1) = \\pi + \\frac{1-\\pi}{2} = \\frac{1+\\pi}{2}, \\qquad P(\\text{buy} \\mid V=0) = \\frac{1-\\pi}{2}."),
    p("Selling is the mirror image: $P(\\text{sell} \\mid V=1) = (1-\\pi)/2$ and $P(\\text{sell} \\mid V=0) = (1+\\pi)/2$. Bayes' rule with prior $\\mu$ then gives"),
    eq("a = \\frac{\\mu\\,(1+\\pi)}{\\mu\\,(1+\\pi) + (1-\\mu)\\,(1-\\pi)}, \\qquad b = \\frac{\\mu\\,(1-\\pi)}{\\mu\\,(1-\\pi) + (1-\\mu)\\,(1+\\pi)}."),
    p("A buy is more likely when the asset is worth 1, so a buy raises the belief and $a > \\mu$; a sell lowers it and $b < \\mu$. The ask lies above the prior and the bid below it."),
    {
      kind: "check",
      id: "glosten-milgrom/ask",
      prompt: "The informed share is $\\pi = 0.5$ and the belief is $\\mu = 0.5$. What is the ask?",
      answer: { type: "number", value: 0.75, tolerance: 0.001 },
      explain: "$a = \\dfrac{0.5 \\cdot 1.5}{0.5 \\cdot 1.5 + 0.5 \\cdot 0.5} = \\dfrac{0.75}{1} = 0.75$. A buy comes from an informed trader or a noise trader three times out of four in state $V=1$, against one in four in state $V=0$.",
    },

    h("The spread"),
    p("At $\\mu = \\tfrac12$ the factors $\\mu$ and $1-\\mu$ cancel and"),
    eq("a = \\frac{1+\\pi}{2}, \\qquad b = \\frac{1-\\pi}{2}, \\qquad a - b = \\pi."),
    p("The spread equals the informed share. With no informed traders, $\\pi = 0$, a trade says nothing about $V$, so both quotes equal the prior, the fair value $E[V]$, and the spread is zero. As $\\pi$ grows the spread grows, and at $\\pi = 1$ every trade reveals $V$, so the quotes are 0 and 1: the whole range. The spread is not a fee for effort. It is exactly the amount that makes the maker break even against the traders who know more."),
    {
      kind: "check",
      id: "glosten-milgrom/no-informed",
      prompt: "Set $\\pi = 0$, so nobody is informed. What happens to the spread?",
      answer: { type: "choice", options: ["It is zero", "It is unchanged", "It doubles", "It depends on the prior"], correct: 0 },
      explain: "With $\\pi = 0$ a buy is as likely when $V=0$ as when $V=1$, so Bayes' rule leaves the belief unchanged: $a = b = \\mu$ for every prior. The spread is zero whatever the prior is.",
    },

    h("Learning from the trades"),
    p("After a buy the maker's belief is $P(V=1 \\mid \\text{buy})$, which by construction is the ask. A buy therefore moves the belief from $\\mu$ to $a$, a sell moves it to $b$, and the next quotes are computed from the new belief. The belief is the only thing the maker has to remember."),
    p("In odds, Bayes' rule is a multiplication. A buy multiplies the odds $\\mu/(1-\\mu)$ by the likelihood ratio $P(\\text{buy}\\mid V=1)/P(\\text{buy}\\mid V=0) = (1+\\pi)/(1-\\pi)$, and a sell divides by the same factor. After $B$ buys and $S$ sells, in any order,"),
    eq("\\frac{\\mu_t}{1-\\mu_t} = \\frac{\\mu_0}{1-\\mu_0}\\left(\\frac{1+\\pi}{1-\\pi}\\right)^{B-S}."),
    p("Only the difference between buys and sells matters. With $\\pi = 0.2$ the factor is $1.5$, and a buy followed by a sell returns the belief exactly to where it was."),
    p("The belief is also a martingale from the maker's point of view. Let $q = P(\\text{buy}) = \\mu\\,\\tfrac{1+\\pi}{2} + (1-\\mu)\\,\\tfrac{1-\\pi}{2}$. The denominator of $a$ is $2q$, so $q\\,a = \\mu\\,(1+\\pi)/2$, and in the same way $(1-q)\\,b = \\mu\\,(1-\\pi)/2$. Adding the two,"),
    eq("q\\,a + (1-q)\\,b = \\frac{\\mu\\,(1+\\pi)}{2} + \\frac{\\mu\\,(1-\\pi)}{2} = \\mu."),
    p("The expected next belief equals the current belief, so $\\mu_t = E[V \\mid \\text{trades so far}]$ is a martingale, as in \"Conditional expectation and martingales\". Quotes never drift in a predictable direction; they move only when a trade surprises the maker. A bounded martingale converges, and since informed trades push towards the truth, the belief converges to $V$: the price discovers the value through the order flow."),
    {
      kind: "worked",
      title: "One round of quoting with π = 0.2 and a prior of 0.5",
      steps: [
        { text: "A buy when $V=1$: informed traders always buy, noise traders half the time.", tex: "P(\\text{buy}\\mid V=1) = \\pi + \\tfrac{1-\\pi}{2}", result: { value: 0.6, tolerance: 0.0005 } },
        { text: "A buy when $V=0$: only noise traders buy.", tex: "P(\\text{buy}\\mid V=0) = \\tfrac{1-\\pi}{2}", result: { value: 0.4, tolerance: 0.0005 } },
        { text: "The ask is the belief after a buy.", tex: "a = \\dfrac{0.5\\cdot 0.6}{0.5\\cdot 0.6 + 0.5\\cdot 0.4}", result: { value: 0.6, tolerance: 0.0005 } },
        { text: "The bid is the belief after a sell, so the spread is $\\pi$.", tex: "b = \\dfrac{0.5\\cdot 0.4}{0.5\\cdot 0.4 + 0.5\\cdot 0.6}, \\quad a - b", result: { value: 0.2, tolerance: 0.0005 } },
        { text: "A buy arrives, and the belief moves to the old ask.", tex: "\\mu_1 = a", result: { value: 0.6, tolerance: 0.0005 } },
        { text: "Probability that the next trade is a buy at the new belief.", tex: "q = 0.6\\cdot 0.6 + 0.4\\cdot 0.4", result: { value: 0.52, tolerance: 0.0005 } },
        { text: "The new ask is higher: a buy is now more likely to come from an informed trader.", tex: "a_1 = \\dfrac{0.6\\cdot 0.6}{0.52}", result: { value: 0.6923, tolerance: 0.0005 } },
        { text: "The new bid is the old prior again: a sell undoes the buy.", tex: "b_1 = \\dfrac{0.6\\cdot 0.4}{0.6\\cdot 0.4 + 0.4\\cdot 0.6}", result: { value: 0.5, tolerance: 0.0005 } },
        { text: "Martingale check: the expected next belief equals the current belief.", tex: "q\\,a_1 + (1-q)\\,b_1 = 0.52\\cdot 0.6923 + 0.48\\cdot 0.5", result: { value: 0.6, tolerance: 0.0005 } },
      ],
    },

    h("A forty-trade example"),
    p("The figure draws 40 trades from the model. The red line is the ask, the green line the bid and the dashed line the belief $\\mu$; the dotted horizontal line marks the true value $V$. The tiles under the chart are the trades, B for a buy and S for a sell. Click a tile to flip that trade and every later quote changes, while the quotes before it stay put. At the defaults ($\\pi = 20\\%$, $V = 1$) the belief after 40 trades is 0.692 and the spread is 0.171. The belief first reached 90% after 30 trades and then fell back, because a run of noise sells outweighed the informed buys. Now move $\\pi$ to 50%: the spread starts at 0.5 and the belief reaches 90% after four trades. Set $\\pi$ to 0% and the three lines collapse onto 0.5, because nothing can be learned."),
    figure("gm-learning"),

    h("How fast the belief learns"),
    p("Each trade moves the log-odds of $V=1$ by $\\pm\\ln\\frac{1+\\pi}{1-\\pi}$. If $V=1$, the move is up with probability $(1+\\pi)/2$ and down with probability $(1-\\pi)/2$, so the expected gain per trade is"),
    eq("\\frac{1+\\pi}{2}\\ln\\frac{1+\\pi}{1-\\pi} - \\frac{1-\\pi}{2}\\ln\\frac{1+\\pi}{1-\\pi} = \\pi\\,\\ln\\frac{1+\\pi}{1-\\pi}."),
    p("For small $\\pi$, $\\ln\\frac{1+\\pi}{1-\\pi} = 2\\pi + \\tfrac23\\pi^3 + \\cdots$, so the gain is about $2\\pi^2$. The information in a trade grows with the square of the informed share: doubling $\\pi$ makes learning about four times faster. Reaching 90% means moving the log-odds from 0 to $\\ln 9 \\approx 2.197$, which takes about $2.197/(0.2\\ln 1.5) \\approx 27$ trades on average at $\\pi = 0.2$ and about 6.5 at $\\pi = 0.4$. One sequence, like the one in the figure, scatters around these averages."),
    {
      kind: "check",
      id: "glosten-milgrom/learning-speed",
      prompt: "The informed share rises from $\\pi = 0.1$ to $\\pi = 0.3$. Roughly how many times faster does the belief learn, using the gain $2\\pi^2$ per trade?",
      answer: { type: "number", value: 9, tolerance: 0.5 },
      explain: "The gain per trade scales with $\\pi^2$, and tripling $\\pi$ multiplies it by $3^2 = 9$. The exact gains $\\pi\\ln\\frac{1+\\pi}{1-\\pi}$ give $0.1857/0.0201 \\approx 9.25$.",
    },

    h("What the model leaves out"),
    p("Every trade is one unit, so size carries no information, and the maker's inventory plays no role. The informed trader is mechanical: always trading towards $V$, with no concern for what the trade does to the price. A strategic insider would spread orders over time, which is what Kyle's model of informed trading studies. The maker must also know $\\pi$, which in practice has to be estimated. The two results that survive in richer models are that the spread compensates for adverse selection and that prices learn through the order flow."),

    h("Summary"),
    list(
      "A competitive, risk-neutral maker sets the ask to $E[V \\mid \\text{buy}]$ and the bid to $E[V \\mid \\text{sell}]$; Bayes' rule gives both in closed form.",
      "At a prior of $\\tfrac12$ the spread equals the informed share $\\pi$; it is zero when nobody is informed.",
      "After a trade the belief moves to the quote that was hit. It is a martingale, depends only on the number of buys minus sells, and converges to the true value.",
      "The expected log-odds gain per trade is $\\pi\\ln\\frac{1+\\pi}{1-\\pi} \\approx 2\\pi^2$, so doubling $\\pi$ makes learning about four times faster.",
      "The model ignores size, inventory and strategic informed traders.",
    ),
    lab("/glosten-milgrom", "Open the Glosten–Milgrom lab"),
  ],

  hu: [
    p("A „Kedvezőtlen kiválasztás és informált kereskedés” lecke megmutatta, hogy a market maker (árjegyző), vagyis a folyamatosan vételi és eladási árat jegyző kereskedő pénzt veszít azokon, akik többet tudnak, mint amennyit a jegyzés tükröz, és hogy a spreadnek elég szélesnek kell lennie e veszteségek fedezéséhez. Ez a lecke a legegyszerűbb modellt építi fel, amelyben ez az állítás nem kijelentés, hanem levezetés: ez a Glosten–Milgrom-modell. A „Feltételes várható érték és martingálok” leckéből a feltételes várható értéket és a martingáltulajdonságot használja. A jegyzések feltételes várható értékek, a market maker hiedelme martingál, a spread, a tanulás és a tanulás sebessége pedig egyaránt a Bayes-tételből következik."),

    h("A modell felépítése"),
    p("Az eszköz értéke $V$, ami vagy $0$, vagy $1$, és csak a végén derül ki. Mindenki ugyanabból az előzetes hiedelemből indul: $\\mu_0 = P(V = 1)$. A kereskedők egyesével érkeznek, és mindegyik egy egységet kötnek a market maker-rel, aki **bid** árat $b$ (amit a market maker fizet) és **ask** árat $a$ (amit a market maker kér) jegyez. Minden más eseménytől függetlenül egy kereskedő:"),
    list(
      "$\\pi$ valószínűséggel informált: ismeri $V$-t, és vesz, ha $V = 1$, illetve elad, ha $V = 0$;",
      "$1-\\pi$ valószínűséggel zajkereskedő: $\\tfrac12$–$\\tfrac12$ valószínűséggel vesz vagy elad, bármennyi is $V$.",
    ),
    p("A market maker kockázatsemleges, és más market maker-ekkel versenyez, ezért a jegyzéseit úgy állítja be, hogy minden kötésen nulla legyen a várható nyeresége. Ismeri $\\pi$-t és az aktuális $\\mu$ hiedelmet, de az informált kereskedőt nem tudja megkülönböztetni a zajkereskedőtől: csak a kötés irányát látja."),

    h("A jegyzések mint feltételes várható értékek"),
    p("Nézzük az ask árat. Amikor egy kereskedő $a$ áron vesz, a market maker $a$-t kap, és egy $V$ értékű eszközzel tartozik, tehát a kötés nyeresége $a - V$. Ha azt követeljük, hogy a várható nyereség nulla legyen, feltéve hogy vétel történt (eladásra ugyanígy), akkor"),
    eq("a = E[V \\mid \\text{vétel}], \\qquad b = E[V \\mid \\text{eladás}]."),
    p("Mivel $V$ értéke $0$ vagy $1$, a feltételes várható értéke megegyezik annak feltételes valószínűségével, hogy $V = 1$, ezt pedig a Bayes-tétel adja. Először a vétel valószínűsége az egyes állapotokban. Ha $V = 1$, az informált kereskedő biztosan vesz, a zajkereskedő az esetek felében; ha $V = 0$, csak a zajkereskedők vesznek:"),
    eq("P(\\text{vétel} \\mid V=1) = \\pi + \\frac{1-\\pi}{2} = \\frac{1+\\pi}{2}, \\qquad P(\\text{vétel} \\mid V=0) = \\frac{1-\\pi}{2}."),
    p("Az eladás a tükörképe: $P(\\text{eladás} \\mid V=1) = (1-\\pi)/2$ és $P(\\text{eladás} \\mid V=0) = (1+\\pi)/2$. A $\\mu$ előzetes hiedelemmel a Bayes-tétel ezt adja:"),
    eq("a = \\frac{\\mu\\,(1+\\pi)}{\\mu\\,(1+\\pi) + (1-\\mu)\\,(1-\\pi)}, \\qquad b = \\frac{\\mu\\,(1-\\pi)}{\\mu\\,(1-\\pi) + (1-\\mu)\\,(1+\\pi)}."),
    p("Vétel valószínűbb, ha az eszköz értéke 1, ezért a vétel növeli a hiedelmet, és $a > \\mu$; az eladás csökkenti, és $b < \\mu$. Az ask az előzetes hiedelem fölött, a bid alatta van."),
    {
      kind: "check",
      id: "glosten-milgrom/ask",
      prompt: "Az informált kereskedők aránya $\\pi = 0{,}5$, a hiedelem $\\mu = 0{,}5$. Mennyi az ask?",
      answer: { type: "number", value: 0.75, tolerance: 0.001 },
      explain: "$a = \\dfrac{0{,}5 \\cdot 1{,}5}{0{,}5 \\cdot 1{,}5 + 0{,}5 \\cdot 0{,}5} = \\dfrac{0{,}75}{1} = 0{,}75$. A $V=1$ állapotban a vétel az esetek háromnegyedében történik, a $V=0$ állapotban csak egynegyedében.",
    },

    h("A spread"),
    p("$\\mu = \\tfrac12$ esetén $\\mu$ és $1-\\mu$ kiesik, és"),
    eq("a = \\frac{1+\\pi}{2}, \\qquad b = \\frac{1-\\pi}{2}, \\qquad a - b = \\pi."),
    p("A spread megegyezik az informált kereskedők arányával. Ha senki sem informált, $\\pi = 0$, a kötés semmit sem árul el $V$-ről, ezért mindkét jegyzés az előzetes hiedelemmel, vagyis az $E[V]$ valódi értékkel egyenlő, a spread pedig nulla. A $\\pi$ növekedésével a spread nő, és $\\pi = 1$ esetén minden kötés felfedi $V$-t, így a jegyzések 0 és 1: a teljes tartomány. A spread nem a fáradozás díja. Pontosan annyi, amennyi a market maker-t nullszaldósra hozza a nála többet tudó kereskedőkkel szemben."),
    {
      kind: "check",
      id: "glosten-milgrom/no-informed",
      prompt: "Legyen $\\pi = 0$, vagyis senki sem informált. Mi történik a spreaddel?",
      answer: { type: "choice", options: ["Nulla lesz", "Nem változik", "Megduplázódik", "Az előzetes hiedelemtől függ"], correct: 0 },
      explain: "$\\pi = 0$ esetén a vétel ugyanolyan valószínű $V=0$ mellett, mint $V=1$ mellett, így a Bayes-tétel nem módosítja a hiedelmet: minden előzetes hiedelemre $a = b = \\mu$. A spread nulla, bármi is az előzetes hiedelem.",
    },

    h("Tanulás a kötésekből"),
    p("Vétel után a market maker hiedelme $P(V=1 \\mid \\text{vétel})$, ami a konstrukció szerint az ask. A vétel tehát $\\mu$-t $a$-ra, az eladás $b$-re mozgatja, és a következő jegyzések az új hiedelemből számolódnak. A market maker-nek csak ezt az egy számot kell megjegyeznie."),
    p("Esélyekben a Bayes-tétel szorzás. A vétel az $\\mu/(1-\\mu)$ esélyt megszorozza a $P(\\text{vétel}\\mid V=1)/P(\\text{vétel}\\mid V=0) = (1+\\pi)/(1-\\pi)$ valószínűségi hányadossal, az eladás ugyanezzel osztja. $B$ vétel és $S$ eladás után, bármilyen sorrendben,"),
    eq("\\frac{\\mu_t}{1-\\mu_t} = \\frac{\\mu_0}{1-\\mu_0}\\left(\\frac{1+\\pi}{1-\\pi}\\right)^{B-S}."),
    p("Csak a vételek és eladások különbsége számít. $\\pi = 0{,}2$ esetén a szorzó $1{,}5$, és egy vételt követő eladás pontosan oda viszi vissza a hiedelmet, ahonnan indult."),
    p("A hiedelem a market maker szemszögéből martingál is. Legyen $q = P(\\text{vétel}) = \\mu\\,\\tfrac{1+\\pi}{2} + (1-\\mu)\\,\\tfrac{1-\\pi}{2}$. Az $a$ nevezője $2q$, így $q\\,a = \\mu\\,(1+\\pi)/2$, és ugyanígy $(1-q)\\,b = \\mu\\,(1-\\pi)/2$. A kettőt összeadva"),
    eq("q\\,a + (1-q)\\,b = \\frac{\\mu\\,(1+\\pi)}{2} + \\frac{\\mu\\,(1-\\pi)}{2} = \\mu."),
    p("A várható következő hiedelem megegyezik a jelenlegivel, tehát $\\mu_t = E[V \\mid \\text{eddigi kötések}]$ martingál, ahogy a „Feltételes várható érték és martingálok” leckében. A jegyzések sosem sodródnak előre megjósolható irányba; csak akkor mozdulnak, ha egy kötés meglepi a market maker-t. A korlátos martingál konvergál, és mivel az informált kötések az igazság felé tolnak, a hiedelem $V$-hez tart: az ár a megbízásáramláson keresztül fedezi fel az értéket."),
    {
      kind: "worked",
      title: "Egy jegyzési kör π = 0,2 és 0,5-ös előzetes hiedelem mellett",
      steps: [
        { text: "Vétel, ha $V=1$: az informált kereskedők mindig vesznek, a zajkereskedők az esetek felében.", tex: "P(\\text{vétel}\\mid V=1) = \\pi + \\tfrac{1-\\pi}{2}", result: { value: 0.6, tolerance: 0.0005 } },
        { text: "Vétel, ha $V=0$: csak a zajkereskedők vesznek.", tex: "P(\\text{vétel}\\mid V=0) = \\tfrac{1-\\pi}{2}", result: { value: 0.4, tolerance: 0.0005 } },
        { text: "Az ask a vétel utáni hiedelem.", tex: "a = \\dfrac{0{,}5\\cdot 0{,}6}{0{,}5\\cdot 0{,}6 + 0{,}5\\cdot 0{,}4}", result: { value: 0.6, tolerance: 0.0005 } },
        { text: "A bid az eladás utáni hiedelem, így a spread $\\pi$.", tex: "b = \\dfrac{0{,}5\\cdot 0{,}4}{0{,}5\\cdot 0{,}4 + 0{,}5\\cdot 0{,}6}, \\quad a - b", result: { value: 0.2, tolerance: 0.0005 } },
        { text: "Vétel érkezik, és a hiedelem a régi askra ugrik.", tex: "\\mu_1 = a", result: { value: 0.6, tolerance: 0.0005 } },
        { text: "Az új hiedelem mellett annak valószínűsége, hogy a következő kötés vétel.", tex: "q = 0{,}6\\cdot 0{,}6 + 0{,}4\\cdot 0{,}4", result: { value: 0.52, tolerance: 0.0005 } },
        { text: "Az új ask magasabb: a vétel most nagyobb eséllyel jön informált kereskedőtől.", tex: "a_1 = \\dfrac{0{,}6\\cdot 0{,}6}{0{,}52}", result: { value: 0.6923, tolerance: 0.0005 } },
        { text: "Az új bid ismét a régi előzetes hiedelem: az eladás visszavonja a vételt.", tex: "b_1 = \\dfrac{0{,}6\\cdot 0{,}4}{0{,}6\\cdot 0{,}4 + 0{,}4\\cdot 0{,}6}", result: { value: 0.5, tolerance: 0.0005 } },
        { text: "Martingálellenőrzés: a várható következő hiedelem megegyezik a jelenlegivel.", tex: "q\\,a_1 + (1-q)\\,b_1 = 0{,}52\\cdot 0{,}6923 + 0{,}48\\cdot 0{,}5", result: { value: 0.6, tolerance: 0.0005 } },
      ],
    },

    h("Egy negyvenkötéses példa"),
    p("Az ábra a modellből húz 40 kötést. A piros vonal az ask, a zöld a bid, a szaggatott a $\\mu$ hiedelem; a pontozott vízszintes vonal a valódi $V$ értéket jelöli. A diagram alatti csempék a kötések: B a vétel, S az eladás. Egy csempére kattintva megfordítod az adott kötést, és minden későbbi jegyzés megváltozik, a korábbiak viszont maradnak. Az alapbeállításnál ($\\pi = 20\\%$, $V = 1$) a hiedelem 40 kötés után 0,692, a spread 0,171. A hiedelem 30 kötés után érte el először a 90%-ot, aztán visszaesett, mert egy zajeladás-sorozat felülmúlta az informált vételeket. Állítsd most $\\pi$-t 50%-ra: a spread 0,5-ről indul, és a hiedelem négy kötés után eléri a 90%-ot. Ha $\\pi$ 0%, a három vonal 0,5-re omlik össze, mert nincs mit tanulni."),
    figure("gm-learning"),

    h("A tanulás sebessége"),
    p("Minden kötés $\\pm\\ln\\frac{1+\\pi}{1-\\pi}$-vel mozdítja el a $V=1$ log-esélyét. Ha $V=1$, a mozgás $(1+\\pi)/2$ valószínűséggel felfelé, $(1-\\pi)/2$ valószínűséggel lefelé irányul, így a kötésenkénti várható nyereség"),
    eq("\\frac{1+\\pi}{2}\\ln\\frac{1+\\pi}{1-\\pi} - \\frac{1-\\pi}{2}\\ln\\frac{1+\\pi}{1-\\pi} = \\pi\\,\\ln\\frac{1+\\pi}{1-\\pi}."),
    p("Kis $\\pi$-re $\\ln\\frac{1+\\pi}{1-\\pi} = 2\\pi + \\tfrac23\\pi^3 + \\cdots$, tehát a nyereség nagyjából $2\\pi^2$. Egy kötés információtartalma az informált arány négyzetével nő: a $\\pi$ megduplázása nagyjából négyszer gyorsabb tanulást ad. A 90% eléréséhez a log-esélynek 0-ról $\\ln 9 \\approx 2{,}197$-re kell mozdulnia, ami átlagosan nagyjából $2{,}197/(0{,}2\\ln 1{,}5) \\approx 27$ kötés $\\pi = 0{,}2$ mellett, és körülbelül 6,5 kötés $\\pi = 0{,}4$ mellett. Egyetlen sorozat, mint az ábrán látható, ezen átlagok körül szóródik."),
    {
      kind: "check",
      id: "glosten-milgrom/learning-speed",
      prompt: "Az informált arány $\\pi = 0{,}1$-ről $\\pi = 0{,}3$-ra nő. Nagyjából hányszor gyorsabban tanul a hiedelem, ha a kötésenkénti nyereség $2\\pi^2$?",
      answer: { type: "number", value: 9, tolerance: 0.5 },
      explain: "A kötésenkénti nyereség $\\pi^2$-tel arányos, és a $\\pi$ háromszorozása $3^2 = 9$-szeresére növeli. A pontos $\\pi\\ln\\frac{1+\\pi}{1-\\pi}$ értékekkel $0{,}1857/0{,}0201 \\approx 9{,}25$.",
    },

    h("Amit a modell kihagy"),
    p("Minden kötés egy egység, így a méret nem hordoz információt, és a market maker készlete sem játszik szerepet. Az informált kereskedő mechanikus: mindig $V$ felé kereskedik, és nem törődik azzal, mit tesz a kötése az árral. Egy stratégiai bennfentes az időben szétosztaná a megbízásait, és éppen ezt vizsgálja a Kyle-féle informált kereskedési modell. A market maker-nek ezenkívül ismernie kell $\\pi$-t, amit a gyakorlatban becsülni kell. Két eredmény marad meg a gazdagabb modellekben is: a spread a kedvezőtlen kiválasztást kompenzálja, és az árak a megbízásáramláson keresztül tanulnak."),

    h("Összefoglalás"),
    list(
      "A versenyző, kockázatsemleges market maker az askot $E[V \\mid \\text{vétel}]$-re, a bidet $E[V \\mid \\text{eladás}]$-re állítja; a Bayes-tétel mindkettőt zárt alakban adja.",
      "$\\tfrac12$ előzetes hiedelemnél a spread megegyezik az informált kereskedők $\\pi$ arányával; ha senki sem informált, nulla.",
      "Egy kötés után a hiedelem arra a jegyzésre ugrik, amelyet eltaláltak. Martingál, csak a vételek és eladások különbségétől függ, és a valódi értékhez tart.",
      "A kötésenkénti várható log-esélynyereség $\\pi\\ln\\frac{1+\\pi}{1-\\pi} \\approx 2\\pi^2$, ezért a $\\pi$ megduplázása nagyjából négyszer gyorsabb tanulást ad.",
      "A modell elhanyagolja a méretet, a készletet és a stratégiai informált kereskedőt.",
    ),
    lab("/glosten-milgrom", "Nyisd meg a Glosten–Milgrom labort"),
  ],
};
