import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p, steps } from "./blocks";

export const americanOptions: GuideLessonContent = {
  en: [
    p("All options priced so far could be exercised only at maturity. Many traded options, including most single-stock options, can be exercised at any time up to maturity. This lesson prices that extra right with the tree from \"Multi-step trees and backward induction\", shows why it is worthless for a call on a stock without dividends but valuable for a put, and explains how \"Put–call parity\" changes."),

    h("European and American exercise"),
    p("A **European** option gives the right to exercise only at maturity $T$. An **American** option gives the right to exercise at any time $t \\le T$. Exercising a call at time $t$ pays $S_t - K$; exercising a put pays $K - S_t$. This amount is the **intrinsic value** of the option at time $t$: $(S_t - K)^+$ for a call and $(K - S_t)^+$ for a put."),
    p("Throughout the lesson the stock pays no dividends, and $r$ is the continuously compounded risk-free rate."),
    p("Two inequalities follow directly from the definition. An American option gives every right the European one gives, and more, so it is worth at least as much. And an American option can always be exercised immediately, so it is worth at least its intrinsic value. If it traded below that, buying it and exercising at once would be an arbitrage."),
    eq("V^{\\text{Am}}_t \\ \\ge\\ V^{\\text{Eu}}_t, \\qquad V^{\\text{Am}}_t \\ \\ge\\ \\text{intrinsic value at } t."),

    h("Backward induction with early exercise"),
    p("In a tree the holder of an American option decides at each node whether to exercise. Exercising gives the intrinsic value. Not exercising keeps the option alive one more step, which is worth the discounted risk-neutral average of the two successor values, the **continuation value**. A rational holder takes the larger of the two. Backward induction therefore changes in a single place:"),
    eq("V_{i,j} = \\max\\Big( \\underbrace{(K - S_{i,j})^+}_{\\text{exercise}},\\ \\underbrace{e^{-r\\Delta t}\\big[q\\,V_{i+1,j+1} + (1-q)\\,V_{i+1,j}\\big]}_{\\text{continuation}} \\Big),"),
    p("written here for a put, with $q = (e^{r\\Delta t} - d)/(u - d)$ as before. At maturity the value is the payoff. Nodes where the exercise value is larger form the **exercise region**: if the stock reaches such a node, the holder exercises there."),
    note("**American option in a tree.** At every node take the larger of the intrinsic value and the continuation value. A node where the intrinsic value wins is a node where the option is exercised."),

    h("Worked example"),
    p("Take the two-step tree of \"Multi-step trees and backward induction\": $S_0 = 100$, $T = 1$, $\\sigma = 20\\%$, $r = 5\\%$, $n = 2$, so $u \\approx 1.1519$, $d \\approx 0.8681$, $q \\approx 0.5539$ and the one-step discount factor is $e^{-0.025} \\approx 0.9753$. Price a put with $K = 100$."),
    steps(
      "Prices at maturity: $100u^2 \\approx 132.69$, $100$, $100d^2 \\approx 75.36$. Put payoffs: $0$, $0$, $24.64$.",
      "Upper node after one step ($S \\approx 115.19$): both successors pay 0, so the continuation value is 0 and so is the intrinsic value.",
      "Lower node after one step ($S \\approx 86.81$): continuation value $0.9753\\,(0.5539\\cdot 0 + 0.4461\\cdot 24.64) \\approx 10.72$. Intrinsic value $100 - 86.81 = 13.19$. Exercise wins, so the node is worth $13.19$.",
      "Root, American: $0.9753\\,(0.5539\\cdot 0 + 0.4461\\cdot 13.19) \\approx 5.74$. At the root the intrinsic value is 0, so the holder waits.",
      "Root, European: the same calculation with $10.72$ in place of $13.19$ gives $\\approx 4.66$.",
    ),
    p("The right to exercise early is worth $5.74 - 4.66 = 1.07$ in this coarse tree. It comes entirely from the lower node, where the stock has fallen far enough that taking $K - S$ now beats waiting."),
    p("The figure below draws the same tree node by node. Every node shows the stock price $S$ and the put value $P$; nodes where exercising now beats waiting are highlighted. Select 2 steps and click the lower node after one step: the panel writes out the continuation value $0.9753\\,(0.5539\\cdot 0 + 0.4461\\cdot 24.64) \\approx 10.72$, the intrinsic value $13.19$, and their maximum. Switch the rule to European and that node falls back to its continuation value, so the root drops from $5.74$ to $4.66$. With more steps more nodes near the bottom of the tree are exercised, and the premium readout shows how much the right is worth at each tree size (for example $0.33$ with 3 steps and $0.79$ with 4); the coarse trees jump around before settling, as in \"Multi-step trees and backward induction\"."),
    figure("american-tree"),

    h("No early exercise of a call"),
    p("For a call on a stock without dividends the extra right is worthless. A European call is bounded below by the no-arbitrage bound from \"Put–call parity\":"),
    eq("C^{\\text{Eu}}_t \\ \\ge\\ S_t - K e^{-r(T-t)} \\ >\\ S_t - K \\qquad (r > 0,\\ t < T)."),
    p("So even a European call, which cannot be exercised before $T$, is worth more than the $S_t - K$ that early exercise would give. Selling the call is always better than exercising it, and the American call has the same price as the European one. The reason is that exercising early pays $K$ sooner than necessary, which loses interest, and gives up the protection the option provides if the stock falls."),
    p("For a put the interest argument works the other way. Exercising early *receives* $K$ sooner, and the cash then earns interest. When the stock is far below the strike, the interest on $K$ outweighs the remaining chance of a further fall, and early exercise is optimal. The **early-exercise premium** $P^{\\text{Am}} - P^{\\text{Eu}}$ is therefore positive for a put."),

    h("The exercise boundary"),
    p("For an American put, the exercise region at each time $t$ consists of all stock prices below a critical level $S^*(t)$, the **exercise boundary**. Above $S^*(t)$ the holder waits; at or below it, the holder exercises. The boundary lies below $K$ and rises towards $K$ as $t$ approaches $T$, because with little time left there is little reason to wait. It is not given by a closed-form formula; the tree finds it numerically as the dividing line between exercise and continuation nodes."),

    h("Put–call parity for American options"),
    p("Parity $C - P = S_0 - Ke^{-rT}$ relies on both options being held to maturity. With early exercise the equality becomes a pair of bounds. For a stock without dividends,"),
    eq("S_0 - K \\ \\le\\ C^{\\text{Am}} - P^{\\text{Am}} \\ \\le\\ S_0 - K e^{-rT}."),
    p("The right-hand inequality holds because $C^{\\text{Am}} = C^{\\text{Eu}}$ and $P^{\\text{Am}} \\ge P^{\\text{Eu}}$. Example with the parameters above, $K = 100$ and a 100-step tree: $C \\approx 10.43$ and $P^{\\text{Am}} \\approx 6.08$, so $C - P^{\\text{Am}} \\approx 4.35$, which lies between $0$ and $100 - 100e^{-0.05} \\approx 4.88$."),

    h("European and American put compared"),
    p("The figure prices both puts on a CRR tree with 100 steps, $S_0 = 100$, $r = 5\\%$ and $T = 1$. It plots the European and the American put value against the stock price from 50 to 150, together with the payoff $(K - S)^+$, and a solid line marks $S_0 = 100$. Sliders set the strike $K$ and the volatility $\\sigma$. The readouts give, at $S_0 = 100$, both put values, their difference, and the **critical price** $S^*$: the highest stock price at which the American put equals its payoff, so that exercising today is optimal. It is the exercise boundary $S^*(t)$ of the previous section, read off today. At the defaults $K = 100$, $\\sigma = 20\\%$ the European put is worth about 5.55, the American about 6.08, a premium of about 0.53, and $S^* \\approx 81.6$. Below $S^*$ the American curve runs along the payoff line, while the European curve drops below the payoff. Raise $K$ to 120 and note that the premium grows to about 2.73 and $S^*$ moves up to about 98, because the put is deep in the money and the interest on $K$ matters more. Raise $\\sigma$ instead and $S^*$ falls: with more volatility, waiting for a further fall is worth more."),
    figure("american-boundary"),

    h("Summary"),
    list(
      "An American option can be exercised at any time; it is worth at least the European option and at least its intrinsic value.",
      "In a tree, each node takes the larger of the intrinsic value and the discounted risk-neutral continuation value.",
      "An American call on a stock without dividends is never exercised early, so it has the European price; an American put can be worth more than the European put.",
      "Early exercise of a put is optimal below an exercise boundary $S^*(t) < K$ that rises towards $K$ near maturity.",
      "Put–call parity becomes the bounds $S_0 - K \\le C^{\\text{Am}} - P^{\\text{Am}} \\le S_0 - Ke^{-rT}$.",
    ),
    lab("/binomial", "Price options on a multi-step tree in the Binomial lab"),
  ],

  hu: [
    p("Az eddig árazott opciókat csak lejáratkor lehetett lehívni. Sok kereskedett opció, köztük az egyedi részvényekre szóló opciók többsége, a lejáratig bármikor lehívható. Ez a lecke a „Többlépéses fák és visszafelé indukció” lecke fájával árazza ezt a többletjogot, megmutatja, miért értéktelen osztalékot nem fizető részvényre szóló vételi opciónál, és miért értékes eladási opciónál, végül azt, hogyan változik a „Put–call paritás”."),

    h("Európai és amerikai lehívás"),
    p("Az **európai** opció csak a $T$ lejáratkor hívható le. Az **amerikai** opció bármely $t \\le T$ időpontban lehívható. Egy call lehívása a $t$ időpontban $S_t - K$-t fizet, egy puté $K - S_t$-t. Ez az összeg az opció **belső értéke** a $t$ időpontban: callnál $(S_t - K)^+$, putnál $(K - S_t)^+$."),
    p("A lecke végig osztalékot nem fizető részvényt feltételez, és $r$ a folytonos kamatozású kockázatmentes kamatláb."),
    p("A definícióból rögtön két egyenlőtlenség adódik. Az amerikai opció minden jogot megad, amit az európai, és még többet is, ezért legalább annyit ér. Az amerikai opció ráadásul bármikor azonnal lehívható, így legalább a belső értékét éri. Ha ennél olcsóbban forogna, megvenni és azonnal lehívni arbitrázs lenne."),
    eq("V^{\\text{Am}}_t \\ \\ge\\ V^{\\text{Eu}}_t, \\qquad V^{\\text{Am}}_t \\ \\ge\\ \\text{belső érték } t\\text{-ben}."),

    h("Visszafelé indukció korai lehívással"),
    p("Egy fában az amerikai opció tulajdonosa minden csomópontban eldönti, lehív-e. A lehívás a belső értéket adja. Ha nem hív le, az opció még egy lépésig él, ennek értéke a két utód értékének diszkontált kockázatsemleges átlaga, a **továbbtartási érték**. Az észszerű tulajdonos a kettő közül a nagyobbat választja. A visszafelé indukció ezért egyetlen ponton változik:"),
    eq("V_{i,j} = \\max\\Big( \\underbrace{(K - S_{i,j})^+}_{\\text{lehívás}},\\ \\underbrace{e^{-r\\Delta t}\\big[q\\,V_{i+1,j+1} + (1-q)\\,V_{i+1,j}\\big]}_{\\text{továbbtartás}} \\Big),"),
    p("itt putra felírva, a korábbi $q = (e^{r\\Delta t} - d)/(u - d)$ valószínűséggel. Lejáratkor az érték a kifizetés. Azok a csomópontok, ahol a lehívás értéke a nagyobb, alkotják a **lehívási tartományt**: ha az árfolyam ilyen csomópontba jut, a tulajdonos ott lehív."),
    note("**Amerikai opció a fában.** Minden csomópontban a belső érték és a továbbtartási érték közül a nagyobbat vesszük. Ahol a belső érték nyer, ott az opciót lehívják."),

    h("Kidolgozott példa"),
    p("Vegyük a „Többlépéses fák és visszafelé indukció” lecke kétlépéses fáját: $S_0 = 100$, $T = 1$, $\\sigma = 20\\%$, $r = 5\\%$, $n = 2$, így $u \\approx 1{,}1519$, $d \\approx 0{,}8681$, $q \\approx 0{,}5539$, az egylépéses diszkontfaktor pedig $e^{-0{,}025} \\approx 0{,}9753$. Árazzunk egy $K = 100$ kötési árú putot."),
    steps(
      "Lejárati árak: $100u^2 \\approx 132{,}69$, $100$, $100d^2 \\approx 75{,}36$. A put kifizetései: $0$, $0$, $24{,}64$.",
      "Felső csomópont egy lépés után ($S \\approx 115{,}19$): mindkét utód 0-t fizet, így a továbbtartási érték 0, és a belső érték is 0.",
      "Alsó csomópont egy lépés után ($S \\approx 86{,}81$): a továbbtartási érték $0{,}9753\\,(0{,}5539\\cdot 0 + 0{,}4461\\cdot 24{,}64) \\approx 10{,}72$. A belső érték $100 - 86{,}81 = 13{,}19$. A lehívás nyer, így a csomópont értéke $13{,}19$.",
      "Gyökér, amerikai: $0{,}9753\\,(0{,}5539\\cdot 0 + 0{,}4461\\cdot 13{,}19) \\approx 5{,}74$. A gyökérben a belső érték 0, így a tulajdonos vár.",
      "Gyökér, európai: ugyanez a számítás $13{,}19$ helyett $10{,}72$-vel $\\approx 4{,}66$-ot ad.",
    ),
    p("A korai lehívás joga ebben a durva fában $5{,}74 - 4{,}66 = 1{,}07$-et ér. Ez teljes egészében az alsó csomópontból származik, ahol az árfolyam annyira esett, hogy a $K - S$ azonnali felvétele jobb a várakozásnál."),
    p("Az alábbi ábra ugyanezt a fát rajzolja meg csomópontról csomópontra. Minden csomópont az $S$ árfolyamot és a put $P$ értékét mutatja; kiemelve azok a csomópontok látszanak, ahol a lehívás most jobb a várakozásnál. Válasszunk 2 lépést, és kattintsunk az egy lépés utáni alsó csomópontra: a panel kiírja a továbbtartási értéket, $0{,}9753\\,(0{,}5539\\cdot 0 + 0{,}4461\\cdot 24{,}64) \\approx 10{,}72$, a $13{,}19$-es belső értéket és a kettő maximumát. Állítsuk a szabályt európaira: ez a csomópont visszaesik a továbbtartási értékére, így a gyökér értéke $5{,}74$-ről $4{,}66$-ra csökken. Több lépésnél a fa alján egyre több csomópontban éri meg lehívni, és a prémium kijelzője mutatja, mennyit ér a jog az adott fán (például 3 lépésnél $0{,}33$, 4 lépésnél $0{,}79$); a durva fák értéke ugrál, mielőtt beállna, ahogy a „Többlépéses fák és visszafelé indukció” leckében is láttuk."),
    figure("american-tree"),

    h("A call korai lehívása nem éri meg"),
    p("Osztalékot nem fizető részvényre szóló callnál a többletjog értéktelen. Az európai callt alulról a „Put–call paritás” leckében levezetett arbitrázsmentes korlát határolja:"),
    eq("C^{\\text{Eu}}_t \\ \\ge\\ S_t - K e^{-r(T-t)} \\ >\\ S_t - K \\qquad (r > 0,\\ t < T)."),
    p("Tehát már az európai call is, amely $T$ előtt le sem hívható, többet ér annál az $S_t - K$-nál, amelyet a korai lehívás adna. A call eladása mindig jobb a lehívásánál, így az amerikai call ára megegyezik az európaiéval. Az ok az, hogy a korai lehívás a szükségesnél hamarabb fizeti ki $K$-t, ami kamatveszteség, és lemond arról a védelemről, amelyet az opció az árfolyam esése esetén nyújt."),
    p("Putnál a kamatérv fordítva működik. A korai lehívás hamarabb *kapja meg* $K$-t, és a pénz onnantól kamatozik. Ha az árfolyam jóval a kötési ár alatt van, $K$ kamata többet ér a további esés maradék esélyénél, és a korai lehívás optimális. A $P^{\\text{Am}} - P^{\\text{Eu}}$ **korai lehívási prémium** ezért putnál pozitív."),

    h("A lehívási határ"),
    p("Amerikai putnál a lehívási tartomány minden $t$ időpontban egy $S^*(t)$ kritikus szint alatti árfolyamokból áll, ez a **lehívási határ**. $S^*(t)$ fölött a tulajdonos vár, azon vagy alatta lehív. A határ $K$ alatt fekszik, és $t$ a $T$-hez közeledve $K$ felé emelkedik, mert kevés hátralévő idő mellett kevés ok van a várakozásra. Zárt képlet nem adja meg; a fa numerikusan találja meg, a lehívási és a továbbtartási csomópontok választóvonalaként."),

    h("Put–call paritás amerikai opciókra"),
    p("A $C - P = S_0 - Ke^{-rT}$ paritás azon múlik, hogy mindkét opciót lejáratig tartjuk. Korai lehívás mellett az egyenlőségből két korlát lesz. Osztalékot nem fizető részvényre"),
    eq("S_0 - K \\ \\le\\ C^{\\text{Am}} - P^{\\text{Am}} \\ \\le\\ S_0 - K e^{-rT}."),
    p("A jobb oldali egyenlőtlenség azért teljesül, mert $C^{\\text{Am}} = C^{\\text{Eu}}$ és $P^{\\text{Am}} \\ge P^{\\text{Eu}}$. Példa a fenti paraméterekkel, $K = 100$ mellett, 100 lépéses fával: $C \\approx 10{,}43$ és $P^{\\text{Am}} \\approx 6{,}08$, így $C - P^{\\text{Am}} \\approx 4{,}35$, ami $0$ és $100 - 100e^{-0{,}05} \\approx 4{,}88$ közé esik."),

    h("Az európai és az amerikai put összevetése"),
    p("Az ábra mindkét putot 100 lépéses CRR-fán árazza, $S_0 = 100$, $r = 5\\%$ és $T = 1$ mellett. Az európai és az amerikai put értékét ábrázolja az árfolyam függvényében 50 és 150 között, a $(K - S)^+$ kifizetéssel együtt, $S_0 = 100$-at pedig folytonos vonal jelöli. A csúszkák a $K$ kötési árat és a $\\sigma$ volatilitást állítják. A kijelzők $S_0 = 100$-nál mutatják a két put értékét, a különbségüket és az $S^*$ **kritikus árat**: azt a legmagasabb árfolyamot, amelynél az amerikai put értéke egyenlő a kifizetésével, vagyis a mai lehívás optimális. Ez az előző szakasz $S^*(t)$ lehívási határa, mai időpontban leolvasva. Az alapbeállítással ($K = 100$, $\\sigma = 20\\%$) az európai put nagyjából 5,55-öt, az amerikai nagyjából 6,08-at ér, a prémium körülbelül 0,53, és $S^* \\approx 81{,}6$. $S^*$ alatt az amerikai görbe a kifizetési vonalon halad, az európai görbe pedig a kifizetés alá süllyed. Emeljük $K$-t 120-ra, és figyeljük meg, hogy a prémium nagyjából 2,73-ra nő, $S^*$ pedig körülbelül 98-ra emelkedik, mert a put mélyen pénzben van, és $K$ kamata többet számít. Ha inkább $\\sigma$-t növeljük, $S^*$ csökken: nagyobb volatilitás mellett többet ér kivárni egy további esést."),
    figure("american-boundary"),

    h("Összefoglalás"),
    list(
      "Az amerikai opció bármikor lehívható; legalább annyit ér, mint az európai, és legalább a belső értékét.",
      "A fában minden csomópont a belső érték és a diszkontált kockázatsemleges továbbtartási érték közül a nagyobbat veszi fel.",
      "Osztalékot nem fizető részvényre szóló amerikai callt sosem éri meg korán lehívni, így ára az európaiéval egyezik; az amerikai put többet érhet az európainál.",
      "A put korai lehívása egy $S^*(t) < K$ lehívási határ alatt optimális, amely a lejárat felé $K$-hoz emelkedik.",
      "A put–call paritásból az $S_0 - K \\le C^{\\text{Am}} - P^{\\text{Am}} \\le S_0 - Ke^{-rT}$ korlátpár lesz.",
    ),
    lab("/binomial", "Opciók árazása többlépéses fán a Binomiális laborban"),
  ],
};
