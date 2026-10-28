import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const adverseSelection: GuideLessonContent = {
  en: [
    p("A market maker earns the spread from customers it knows nothing about. \"Market makers and liquidity\" showed the income of a round trip when the mid price does not move, and \"Queue position and fill probability\" showed that a resting order tends to be filled just before the price moves against it. This lesson explains why: some customers trade because they know where the price is going. It measures the damage with markouts, derives what one such customer costs, and shows how that cost pushes the best spread outward."),

    h("Informed and uninformed customers"),
    p("A **noise trader** trades for reasons unrelated to the next price move: to invest a pay cheque, raise cash, rebalance a fund, or hedge another position. Over a short horizon the mid price is as likely to rise as to fall after such a trade. An **informed trader** trades because it expects the mid price to move, and buys just before the price rises or sells just before it falls."),
    p("The market maker's quotes are the best bid and ask in the book described in \"The limit order book\", and anyone can hit them. The maker cannot tell the two kinds of customer apart at the moment of the trade. It sells to the informed buyer at the ask, the price then rises, and the maker is short something worth more than it received. This is **adverse selection**: the trades the maker gets are not a random sample, because the customers who most want to trade with it are the ones who expect to profit."),

    h("Markouts"),
    p("A **markout** measures this after the fact. Take a fill at time $t$ and a horizon $h$. Let $\\varepsilon = +1$ if the maker bought and $\\varepsilon = -1$ if it sold, and let $m$ be the mid price. The markout is the mid price move after the fill, signed from the maker's side:"),
    eq("M_h = \\varepsilon\\,(m_{t+h} - m_t)."),
    p("A positive markout means the price moved in the maker's favour. Marked to the mid at $t+h$, one unit bought at the bid $m_t - \\delta$ is worth $\\delta + M_h$ to the maker: the half-spread it captured, plus the markout. After noise fills the average markout is zero, so the maker keeps the half-spread $\\delta$. After informed fills the average markout is negative, and it takes back part or all of that $\\delta$."),
    {
      kind: "check",
      id: "adverse-selection/markout",
      prompt: "The average 10-second markout of a maker's buys is −0.8¢. What does that tell you?",
      answer: {
        type: "choice",
        options: [
          "After the maker buys, the mid price tends to fall, so the sellers knew something",
          "The maker earns 0.8¢ per share",
          "The spread is 0.8¢",
          "The fills were too slow",
        ],
        correct: 0,
      },
      explain: "A negative markout on buys means the mid price is lower 10 seconds later: the maker bought just before a fall. Sellers who do that systematically are informed. It says nothing directly about the spread or the speed of the fills.",
    },

    h("A model of the maker's income"),
    p("The maker quotes symmetrically, bid $m - \\delta$ and ask $m + \\delta$, with half-spread $\\delta$ in cents. Customers arrive at rate $\\lambda$ per second, and a share $\\pi$ of them is informed."),
    list(
      "A noise customer buys or sells with equal chance and accepts a price $\\delta$ away from the mid with probability $e^{-k\\delta}$: the wider the quote, the fewer customers take it. The maker earns $\\delta$ per fill, so one noise arrival is worth $\\delta\\,e^{-k\\delta}$ on average.",
      "An informed customer knows the value change $\\Delta V$ over the next $h$ seconds. With volatility $\\sigma$ in cents per $\\sqrt{\\text{s}}$, $\\Delta V$ is normal with mean 0 and standard deviation $s = \\sigma\\sqrt{h}$. It buys at the ask when $\\Delta V > \\delta$ and sells at the bid when $\\Delta V < -\\delta$; otherwise the spread eats its profit and it stays out.",
    ),

    h("The expected loss to an informed customer"),
    p("Suppose the informed customer buys at $m + \\delta$ because $\\Delta V > \\delta$. After $h$ seconds the maker, who sold, has lost the amount by which the value exceeds what it was paid, net of the spread:"),
    eq("\\text{loss} = \\Delta V - \\delta \\quad\\text{when } \\Delta V > \\delta, \\text{ and } 0 \\text{ otherwise.}"),
    p("Its expectation is the partial expectation $E[(\\Delta V - \\delta)^+]$. Write $\\Delta V = sZ$ with $Z$ standard normal, density $\\varphi$ and distribution function $\\Phi$, and put $a = \\delta/s$:"),
    eq("E[(\\Delta V - \\delta)^+] = s\\int_a^\\infty (z - a)\\,\\varphi(z)\\,dz = s\\left[\\int_a^\\infty z\\,\\varphi(z)\\,dz - a\\,(1 - \\Phi(a))\\right]."),
    p("Since $\\varphi'(z) = -z\\,\\varphi(z)$, the first integral equals $\\varphi(a)$. Therefore"),
    eq("L(\\delta) = E[(\\Delta V - \\delta)^+] = s\\,\\varphi(\\delta/s) - \\delta\\,\\bigl(1 - \\Phi(\\delta/s)\\bigr)."),
    p("By symmetry the sell side costs the same, so one informed arrival costs the maker $2L(\\delta)$ in expectation. With a zero spread $L(0) = s\\,\\varphi(0) = s/\\sqrt{2\\pi} \\approx 0.399\\,s$, and $L$ falls towards zero as $\\delta$ grows past a few multiples of $s$."),
    {
      kind: "check",
      id: "adverse-selection/loss-at-zero",
      prompt: "With a zero spread, an informed customer expects the value to move by a normal amount with standard deviation $s = 2.5$¢. What is the maker's expected loss on its buy side, in cents?",
      answer: { type: "number", value: 0.9974, tolerance: 0.01 },
      explain: "At $\\delta = 0$ the loss is $L(0) = s\\,\\varphi(0) = 2.5/\\sqrt{2\\pi} \\approx 0.997$¢: the informed customer collects the upward half of the move.",
    },

    h("Income rate and the best spread"),
    p("Noise arrivals come at rate $\\lambda(1-\\pi)$ and informed arrivals at rate $\\lambda\\pi$, so the maker's expected income per second is"),
    eq("R(\\delta) = \\lambda\\Bigl[(1-\\pi)\\,\\delta\\,e^{-k\\delta} - 2\\pi\\,L(\\delta)\\Bigr]."),
    p("Without informed customers, $\\pi = 0$ and $R(\\delta) = \\lambda\\,\\delta\\,e^{-k\\delta}$. Its derivative is $\\lambda\\,e^{-k\\delta}(1 - k\\delta)$, which is zero at $\\delta = 1/k$: this is the best half-spread when everyone is noise."),
    p("For $\\pi > 0$ we need $L'(\\delta)$. Differentiating $L$ with $a = \\delta/s$ gives $-a\\varphi(a) - (1 - \\Phi(a)) + a\\varphi(a)$, so $L'(\\delta) = -(1 - \\Phi(\\delta/s))$: widening the spread by a small step saves the maker exactly the probability that an informed customer still trades on one side. Setting $R'(\\delta) = 0$ gives the first-order condition"),
    eq("(1-\\pi)\\,e^{-k\\delta}\\,(k\\delta - 1) = 2\\pi\\,\\bigl(1 - \\Phi(\\delta/s)\\bigr)."),
    p("The right side is positive, so the left side must be too, which requires $k\\delta > 1$: **the best half-spread lies above $1/k$, and it moves outward as $\\pi$ or $s$ grows.** There is also a second effect. At $\\delta = 0$ the income is $-2\\pi\\lambda L(0) < 0$, so a maker with no spread loses money. The smallest half-spread $\\delta_0$ with $R(\\delta_0) = 0$ is the **break-even spread**: the noise income exactly pays for the informed loss. Below it the average arrival costs the maker money, whatever the volume."),
    {
      kind: "check",
      id: "adverse-selection/no-informed",
      prompt: "All customers are noise traders and the fill probability is $e^{-k\\delta}$ with $k = 0.4$ per cent. Which half-spread, in cents, maximises the maker's income?",
      answer: { type: "number", value: 2.5, tolerance: 0.01 },
      explain: "With $\\pi = 0$ the income is $\\lambda\\,\\delta\\,e^{-k\\delta}$, maximised at $\\delta = 1/k = 1/0.4 = 2.5$¢.",
    },
    {
      kind: "worked",
      title: "Income at half-spreads of 2¢ and 2.3¢",
      steps: [
        { text: "Take $\\lambda = 4$ arrivals a second, $k = 0.5$ per cent, $\\sigma = 1$¢ per $\\sqrt{\\text{s}}$, $h = 3$ s and $\\pi = 0.2$. The informed customers' view has standard deviation:", tex: "s = \\sigma\\sqrt{h} = \\sqrt{3}", result: { value: 1.7321, tolerance: 0.001 } },
        { text: "A noise arrival at $\\delta = 2$¢ earns, on average:", tex: "\\delta\\,e^{-k\\delta} = 2\\,e^{-1}", result: { value: 0.7358, tolerance: 0.001 } },
        { text: "An informed arrival costs one side's partial expectation. With $z = 2/\\sqrt{3} = 1.1547$ we have $\\varphi(z) = 0.2048$ and $1 - \\Phi(z) = 0.1241$:", tex: "L(2) = 1.7321 \\cdot 0.2048 - 2 \\cdot 0.1241", result: { value: 0.1066, tolerance: 0.0005 } },
        { text: "Net income per arrival is the noise share of the first minus both sides of the second:", tex: "0.8 \\cdot 0.7358 - 2 \\cdot 0.2 \\cdot 0.1066", result: { value: 0.546, tolerance: 0.001 } },
        { text: "With four arrivals a second the income rate is, in cents per second (131.04¢ a minute):", tex: "R(2) = 4 \\cdot 0.546", result: { value: 2.1839, tolerance: 0.001 } },
        { text: "Moving out to $\\delta = 2.3$¢ gives $2.3\\,e^{-1.15} = 0.7283$ and $L(2.3) = 0.0743$, so the income rate rises:", tex: "R(2.3) = 4\\,(0.8 \\cdot 0.7283 - 0.4 \\cdot 0.0743)", result: { value: 2.2116, tolerance: 0.001 } },
        { text: "Without informed customers the same $\\delta = 2$¢ would have earned $4 \\cdot 2e^{-1} = 2.9430$, so the informed share costs:", tex: "2.9430 - 2.1839", result: { value: 0.7591, tolerance: 0.001 } },
      ],
    },
    p("The best half-spread with no informed customers is $1/k = 2$¢. With 20% informed it is about 2.29¢, so the informed customers cost the maker about a quarter of its income at 2¢ and also push the best quote outward."),
    p("The figure draws $R(\\delta)$ in cents per minute. The dashed curve is the same flow with no informed customers; the solid curve is the current informed share. Vertical lines mark the break-even half-spread and the best half-spread. At the defaults (20% informed, volatility 1) the dashed curve peaks at 2¢, the solid curve peaks at 2.29¢ with 132.7¢ a minute, and the break-even is 0.32¢. At the handle's starting position of 2¢ the maker earns 141.3¢ from noise customers and loses 10.2¢ to informed ones, 131.0¢ net. Drag the handle along the chart, then raise the informed share to 40%: the best half-spread moves to 2.64¢ and the break-even to 0.74¢. Set volatility to 2 at 20%: the best half-spread is 2.85¢ and the net income at 2¢ falls to 83.1¢."),
    figure("toxic-income"),

    h("Toxic flow in practice"),
    p("Real makers cannot observe $\\pi$ or $s$, but they can compute markout curves: the average of $M_h$ for horizons from a fraction of a second to minutes, split by counterparty, venue, order size or strategy. A flow whose markout curve falls and stays negative is called **toxic**; a flow whose curve stays near zero is benign. Makers quote tighter, in more size, to the second kind, and wider or not at all to the first."),
    p("This is why flow is segmented. Brokers and venues separate retail orders, which rarely carry information about the next few seconds, from fast professional orders, and a maker can afford a narrow spread on the former. Wholesale market makers pay brokers for retail order flow because its markouts are close to zero. The informed customers do not disappear; they are priced in the spread everyone else sees."),
    note("A markout depends on the horizon $h$. Too short, and the information has not reached the price yet; too long, and unrelated noise swamps the average. Desks look at the whole curve, not one number."),

    h("Summary"),
    list(
      "A market maker cannot tell informed from noise customers at the time of the trade, so its fills are adversely selected.",
      "The markout $M_h = \\varepsilon\\,(m_{t+h} - m_t)$ is zero on average for noise fills and negative for informed fills.",
      "One informed arrival costs $2L(\\delta)$ with $L(\\delta) = s\\,\\varphi(\\delta/s) - \\delta\\,(1 - \\Phi(\\delta/s))$ and $s = \\sigma\\sqrt{h}$.",
      "Income is $R(\\delta) = \\lambda[(1-\\pi)\\,\\delta e^{-k\\delta} - 2\\pi L(\\delta)]$; the best half-spread moves above $1/k$ as the informed share grows, and below the break-even spread the maker loses money on average.",
    ),
    lab("/market-making", "Open the market making lab"),
  ],
  hu: [
    p("A market maker (árjegyző) a spreadet olyan ügyfelektől keresi meg, akikről semmit sem tud. A „Market makerek és a likviditás” lecke megmutatta, mekkora egy oda-vissza kötés bevétele, ha a mid ár nem mozdul, „A sorban elfoglalt hely és a teljesülés valószínűsége” pedig azt, hogy egy várakozó megbízás gyakran épp az ár ellene irányuló mozgása előtt teljesül. Ez a lecke megmagyarázza, miért: néhány ügyfél azért kereskedik, mert tudja, merre megy az ár. A kárt markouttal méri, levezeti, mibe kerül egy ilyen ügyfél, és megmutatja, hogyan tolja ez a költség kifelé a legjobb spreadet."),

    h("Informált és nem informált ügyfelek"),
    p("A **zajkereskedő** olyan okból kereskedik, ami nem függ a következő ármozgástól: befekteti a fizetését, készpénzt teremt, egy alap portfólióját igazítja vagy egy másik pozíciót fedez. Rövid távon az ilyen kötés után a mid ár ugyanolyan eséllyel emelkedik, mint amilyennel esik. Az **informált kereskedő** azért kereskedik, mert ármozgást vár: az emelkedés előtt vesz, az esés előtt elad."),
    p("A market maker jegyzései annak a könyvnek a legjobb bidje és askja, amelyet „A limitáras ajánlati könyv” ír le, és bárki rájuk üthet. A maker a kötés pillanatában nem tudja megkülönböztetni a két ügyféltípust. Az informált vevőnek az askon ad el, az ár ezután emelkedik, és a maker rövid pozícióban marad valamiben, ami többet ér annál, amennyit kapott érte. Ez a **kedvezőtlen kiválasztás**: a maker kötései nem véletlen minták, mert azok akarnak a leginkább vele kötni, akik nyereséget várnak."),

    h("Markout"),
    p("A **markout** utólag méri ezt. Vegyünk egy teljesülést a $t$ időpontban és egy $h$ horizontot. Legyen $\\varepsilon = +1$, ha a maker vett, és $\\varepsilon = -1$, ha eladott, $m$ pedig a mid ár. A markout a teljesülés utáni mid ármozgás a maker oldaláról előjelezve:"),
    eq("M_h = \\varepsilon\\,(m_{t+h} - m_t)."),
    p("A pozitív markout azt jelenti, hogy az ár a maker javára mozdult. A $t+h$ időpont mid árához értékelve egy darab, az $m_t - \\delta$ biden vett egység a makernek $\\delta + M_h$-t ér: a megszerzett fél spreadet plusz a markoutot. Zajteljesülések után az átlagos markout nulla, így a maker megtartja a $\\delta$ fél spreadet. Informált teljesülések után az átlagos markout negatív, és elviszi a $\\delta$ egy részét vagy egészét."),
    {
      kind: "check",
      id: "adverse-selection/markout",
      prompt: "A maker vételeinek átlagos 10 másodperces markoutja −0,8¢. Mit jelent ez?",
      answer: {
        type: "choice",
        options: [
          "A maker vétele után a mid ár hajlamos esni, vagyis az eladók tudtak valamit",
          "A maker részvényenként 0,8¢-et keres",
          "A spread 0,8¢",
          "A teljesülések túl lassúak voltak",
        ],
        correct: 0,
      },
      explain: "A vételek negatív markoutja azt jelenti, hogy 10 másodperccel később a mid ár alacsonyabb: a maker épp esés előtt vett. Az eladók, akik ezt rendszeresen megteszik, informáltak. A spreadről vagy a teljesülések sebességéről közvetlenül semmit sem mond.",
    },

    h("A market maker bevételének modellje"),
    p("A maker szimmetrikusan jegyez, a bid $m - \\delta$, az ask $m + \\delta$, ahol a $\\delta$ fél spread centben van. Az ügyfelek másodpercenként $\\lambda$ ütemben érkeznek, és közülük $\\pi$ arányban informáltak."),
    list(
      "A zajügyfél egyenlő eséllyel vesz vagy ad el, és a midtől $\\delta$ távolságra lévő árat $e^{-k\\delta}$ valószínűséggel fogadja el: minél szélesebb a jegyzés, annál kevesebben élnek vele. A maker kötésenként $\\delta$-t keres, így egy zajérkezés átlagosan $\\delta\\,e^{-k\\delta}$-t ér.",
      "Az informált ügyfél ismeri az érték következő $h$ másodperc alatti $\\Delta V$ változását. Ha a volatilitás $\\sigma$ cent $\\sqrt{\\text{s}}$-onként, a $\\Delta V$ normális eloszlású 0 várható értékkel és $s = \\sigma\\sqrt{h}$ szórással. Az askon vesz, ha $\\Delta V > \\delta$, és a biden ad el, ha $\\Delta V < -\\delta$; különben a spread elvinné a nyereségét, ezért kimarad.",
    ),

    h("Egy informált ügyfélen várható veszteség"),
    p("Tegyük fel, hogy az informált ügyfél az $m + \\delta$ áron vesz, mert $\\Delta V > \\delta$. $h$ másodperc múlva az eladó maker vesztesége az, amennyivel az érték meghaladja a kapott árat, a spreadet levonva:"),
    eq("\\text{veszteség} = \\Delta V - \\delta \\quad\\text{ha } \\Delta V > \\delta, \\text{ egyébként } 0."),
    p("Várható értéke az $E[(\\Delta V - \\delta)^+]$ részleges várható érték. Írjuk $\\Delta V = sZ$ alakban, ahol $Z$ standard normális, sűrűségfüggvénye $\\varphi$, eloszlásfüggvénye $\\Phi$, és legyen $a = \\delta/s$:"),
    eq("E[(\\Delta V - \\delta)^+] = s\\int_a^\\infty (z - a)\\,\\varphi(z)\\,dz = s\\left[\\int_a^\\infty z\\,\\varphi(z)\\,dz - a\\,(1 - \\Phi(a))\\right]."),
    p("Mivel $\\varphi'(z) = -z\\,\\varphi(z)$, az első integrál értéke $\\varphi(a)$. Ezért"),
    eq("L(\\delta) = E[(\\Delta V - \\delta)^+] = s\\,\\varphi(\\delta/s) - \\delta\\,\\bigl(1 - \\Phi(\\delta/s)\\bigr)."),
    p("Szimmetria miatt az eladási oldal ugyanennyibe kerül, így egy informált érkezés a makernek várhatóan $2L(\\delta)$-ba kerül. Nulla spreadnél $L(0) = s\\,\\varphi(0) = s/\\sqrt{2\\pi} \\approx 0{,}399\\,s$, és $L$ nullához tart, ha a $\\delta$ az $s$ néhány többszöröse fölé nő."),
    {
      kind: "check",
      id: "adverse-selection/loss-at-zero",
      prompt: "Nulla spreadnél az informált ügyfél az érték normális eloszlású változását várja $s = 2{,}5$¢ szórással. Mekkora a maker várható vesztesége a vételi oldalán, centben?",
      answer: { type: "number", value: 0.9974, tolerance: 0.01 },
      explain: "$\\delta = 0$ esetén a veszteség $L(0) = s\\,\\varphi(0) = 2{,}5/\\sqrt{2\\pi} \\approx 0{,}997$¢: az informált ügyfél elviszi a mozgás felfelé irányuló felét.",
    },

    h("A bevételi ráta és a legjobb spread"),
    p("A zajérkezések üteme $\\lambda(1-\\pi)$, az informált érkezéseké $\\lambda\\pi$, így a maker várható bevétele másodpercenként"),
    eq("R(\\delta) = \\lambda\\Bigl[(1-\\pi)\\,\\delta\\,e^{-k\\delta} - 2\\pi\\,L(\\delta)\\Bigr]."),
    p("Informált ügyfelek nélkül $\\pi = 0$ és $R(\\delta) = \\lambda\\,\\delta\\,e^{-k\\delta}$. A deriváltja $\\lambda\\,e^{-k\\delta}(1 - k\\delta)$, ami $\\delta = 1/k$-nál nulla: ez a legjobb fél spread, ha mindenki zajkereskedő."),
    p("$\\pi > 0$ esetén szükségünk van $L'(\\delta)$-ra. Az $L$-t $a = \\delta/s$ mellett deriválva $-a\\varphi(a) - (1 - \\Phi(a)) + a\\varphi(a)$ adódik, tehát $L'(\\delta) = -(1 - \\Phi(\\delta/s))$: ha a spreadet egy kicsit szélesítjük, a maker pont annak a valószínűségével spórol, hogy egy informált ügyfél még így is kötne az egyik oldalon. Az $R'(\\delta) = 0$ feltételből az elsőrendű feltétel:"),
    eq("(1-\\pi)\\,e^{-k\\delta}\\,(k\\delta - 1) = 2\\pi\\,\\bigl(1 - \\Phi(\\delta/s)\\bigr)."),
    p("A jobb oldal pozitív, tehát a bal oldalnak is az kell legyen, ami $k\\delta > 1$-et igényel: **a legjobb fél spread $1/k$ fölött van, és kifelé mozdul, ha a $\\pi$ vagy az $s$ nő.** Van egy második hatás is. $\\delta = 0$-nál a bevétel $-2\\pi\\lambda L(0) < 0$, vagyis spread nélkül a maker veszít. Az a legkisebb $\\delta_0$ fél spread, amelyre $R(\\delta_0) = 0$, a **nullszaldós spread**: a zajbevétel épp fedezi az informáltakon vesztett összeget. Alatta az átlagos érkezés pénzbe kerül a makernek, bármekkora is a forgalom."),
    {
      kind: "check",
      id: "adverse-selection/no-informed",
      prompt: "Minden ügyfél zajkereskedő, a teljesülés valószínűsége $e^{-k\\delta}$, ahol $k = 0{,}4$ centenként. Melyik fél spread (centben) maximalizálja a maker bevételét?",
      answer: { type: "number", value: 2.5, tolerance: 0.01 },
      explain: "$\\pi = 0$ esetén a bevétel $\\lambda\\,\\delta\\,e^{-k\\delta}$, amely $\\delta = 1/k = 1/0{,}4 = 2{,}5$¢-nél maximális.",
    },
    {
      kind: "worked",
      title: "Bevétel 2¢ és 2,3¢ fél spreadnél",
      steps: [
        { text: "Legyen $\\lambda = 4$ érkezés másodpercenként, $k = 0{,}5$ centenként, $\\sigma = 1$¢ $\\sqrt{\\text{s}}$-onként, $h = 3$ s és $\\pi = 0{,}2$. Az informált ügyfelek kilátásának szórása:", tex: "s = \\sigma\\sqrt{h} = \\sqrt{3}", result: { value: 1.7321, tolerance: 0.001 } },
        { text: "Egy zajérkezés $\\delta = 2$¢-nél átlagosan ennyit hoz:", tex: "\\delta\\,e^{-k\\delta} = 2\\,e^{-1}", result: { value: 0.7358, tolerance: 0.001 } },
        { text: "Egy informált érkezés az egyik oldal részleges várható értékébe kerül. $z = 2/\\sqrt{3} = 1{,}1547$ mellett $\\varphi(z) = 0{,}2048$ és $1 - \\Phi(z) = 0{,}1241$:", tex: "L(2) = 1.7321 \\cdot 0.2048 - 2 \\cdot 0.1241", result: { value: 0.1066, tolerance: 0.0005 } },
        { text: "Az egy érkezésre jutó nettó bevétel az első érték zajarányos része mínusz a második két oldala:", tex: "0.8 \\cdot 0.7358 - 2 \\cdot 0.2 \\cdot 0.1066", result: { value: 0.546, tolerance: 0.001 } },
        { text: "Másodpercenként négy érkezéssel a bevételi ráta cent per másodpercben (131,04¢ percenként):", tex: "R(2) = 4 \\cdot 0.546", result: { value: 2.1839, tolerance: 0.001 } },
        { text: "$\\delta = 2{,}3$¢-re kifelé lépve $2{,}3\\,e^{-1{,}15} = 0{,}7283$ és $L(2{,}3) = 0{,}0743$, így a bevételi ráta nő:", tex: "R(2.3) = 4\\,(0.8 \\cdot 0.7283 - 0.4 \\cdot 0.0743)", result: { value: 2.2116, tolerance: 0.001 } },
        { text: "Informált ügyfelek nélkül ugyanez a $\\delta = 2$¢ $4 \\cdot 2e^{-1} = 2{,}9430$-t keresne, így az informált arány költsége:", tex: "2.9430 - 2.1839", result: { value: 0.7591, tolerance: 0.001 } },
      ],
    },
    p("Informált ügyfelek nélkül a legjobb fél spread $1/k = 2$¢. 20% informált mellett kb. 2,29¢, tehát az informáltak a maker bevételének mintegy negyedébe kerülnek 2¢-nél, és a legjobb jegyzést is kifelé tolják."),
    p("Az ábra az $R(\\delta)$ görbét rajzolja cent per percben. A szaggatott görbe ugyanez az áramlás informált ügyfelek nélkül; a folytonos az aktuális informált aránnyal készült. A függőleges vonalak a nullszaldós és a legjobb fél spreadet jelölik. Az alapértékeknél (20% informált, volatilitás 1) a szaggatott görbe 2¢-nél éri el a csúcsát, a folytonos 2,29¢-nél, 132,7¢ per perccel, a nullszaldós érték pedig 0,32¢. A fogantyú 2¢-es kezdőhelyén a maker 141,3¢-et keres a zajügyfeleken és 10,2¢-et veszít az informáltakon, nettó 131,0¢. Húzd végig a fogantyút a grafikonon, majd emeld az informált arányt 40%-ra: a legjobb fél spread 2,64¢-re, a nullszaldós 0,74¢-re mozdul. Állítsd a volatilitást 2-re 20% mellett: a legjobb fél spread 2,85¢, a nettó bevétel 2¢-nél 83,1¢-re csökken."),
    figure("toxic-income"),

    h("Toxikus megbízásáramlás a gyakorlatban"),
    p("A valódi makerek nem látják a $\\pi$-t és az $s$-t, de ki tudják számolni a markout-görbéket: az $M_h$ átlagát a másodperc törtrészétől több percig terjedő horizontokra, ügyfél, piac, megbízásméret vagy stratégia szerint bontva. Azt az áramlást nevezik **toxikusnak**, amelynek markout-görbéje esik és negatív marad; az a jóindulatú, amelynek görbéje nulla közelében marad. A maker az utóbbinak szűkebben és nagyobb mennyiségben jegyez, az előbbinek szélesebben, vagy egyáltalán nem."),
    p("Ezért szegmentálják az áramlást. A brókerek és a piacok elválasztják a kisbefektetői megbízásokat, amelyek ritkán hordoznak információt a következő másodpercekről, a gyors, professzionális megbízásoktól, és a maker az előbbiekre megengedhet magának szűk spreadet. A nagykereskedő makerek azért fizetnek a brókereknek a kisbefektetői megbízásáramlásért, mert annak markoutja nulla közeli. Az informált ügyfelek nem tűnnek el; az összes többi ügyfél által látott spreadbe vannak beárazva."),
    note("A markout a $h$ horizonttól függ. Ha túl rövid, az információ még nem ért be az árba; ha túl hosszú, a független zaj elnyomja az átlagot. A desk a teljes görbét nézi, nem egyetlen számot."),

    h("Összefoglalás"),
    list(
      "A market maker a kötés pillanatában nem tudja megkülönböztetni az informált és a zajügyfeleket, ezért a teljesülései kedvezőtlenül kiválasztottak.",
      "Az $M_h = \\varepsilon\\,(m_{t+h} - m_t)$ markout a zajteljesüléseknél átlagosan nulla, az informált teljesüléseknél negatív.",
      "Egy informált érkezés $2L(\\delta)$-ba kerül, ahol $L(\\delta) = s\\,\\varphi(\\delta/s) - \\delta\\,(1 - \\Phi(\\delta/s))$ és $s = \\sigma\\sqrt{h}$.",
      "A bevétel $R(\\delta) = \\lambda[(1-\\pi)\\,\\delta e^{-k\\delta} - 2\\pi L(\\delta)]$; a legjobb fél spread az informált arány növekedésével $1/k$ fölé mozdul, és a nullszaldós spread alatt a maker átlagosan veszít.",
    ),
    lab("/market-making", "Nyisd meg a market making labort"),
  ],
};
