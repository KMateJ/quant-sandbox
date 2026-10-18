import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import { eq, figure, h, lab, list, note, p } from "./blocks";

export const noArbitrage: GuideLessonContent = {
  en: [
    p("This lesson finds the delivery price of a forward contract without any model for the future stock price. The argument rests on one assumption, that the market offers no arbitrage, and on the discount factor from \"Interest, compounding and discounting\". The forward itself was defined in \"Forwards, calls and puts\"."),

    h("Market assumptions"),
    p("We work in an idealised market. Anyone can borrow and lend at the same risk-free rate $r$ (continuously compounded). The stock can be bought or sold short in any quantity; **short selling** means borrowing a share, selling it today and buying it back later to return it. There are no transaction costs, taxes or dividends, and both parties to a contract honour it."),

    h("Arbitrage"),
    p("An **arbitrage** is a trading strategy that costs nothing to set up, can never lose money, and makes a positive profit in at least some outcomes. An equivalent form: a strategy that brings in money today and never requires a payment later."),
    p("Think of two shops selling the same item at different prices: buy in the cheap one, sell in the expensive one, and the profit is certain. In a liquid market, traders exploit such gaps as soon as they appear, and their buying and selling moves the prices until the gap closes. Pricing theory therefore assumes that arbitrage opportunities do not exist."),

    h("The law of one price"),
    p("The most useful consequence is the **law of one price**: if two portfolios have the same payoff in every possible state at time $T$, they must have the same price today. Otherwise one would buy the cheaper portfolio and sell the dearer one. The payoffs cancel at $T$, and the price difference is kept today as a riskless profit."),
    note("No arbitrage implies the law of one price: two portfolios with identical payoffs at $T$ have the same price today. Pricing by replication applies this rule again and again."),

    h("The cash-and-carry argument"),
    p("A forward obliges the long side to buy the stock at $T$ for the delivery price $K$. There is another way to own the stock at $T$: borrow $S_0$, buy the stock today and hold it. Compare the two positions:"),
    list(
      "**Portfolio A:** a long forward with delivery price $K$. Cost today 0. At $T$: pay $K$, receive the stock.",
      "**Portfolio B:** buy one share for $S_0$, financed by borrowing $S_0$. Cost today 0. At $T$: hold the stock and repay the loan with interest, $S_0e^{rT}$.",
    ),
    p("Both portfolios cost nothing and both end with one share at $T$. Their only difference is the cash paid at $T$: $K$ in A and $S_0e^{rT}$ in B. The law of one price forces these amounts to be equal. The **forward price** $F_0$ is the delivery price that makes a new forward cost nothing:"),
    eq("F_0 = S_0\\,e^{rT}."),
    p("The forward price is today's stock price carried forward at the risk-free rate. Notice what is missing: the expected return of the stock, its volatility and anyone's opinion about $S_T$. Investors who disagree about the stock must still agree on $F_0$."),

    h("When the quoted forward price is wrong"),
    p("Suppose a dealer quotes a forward with delivery price $F^{\\text{q}}$ different from $S_0e^{rT}$."),
    p("**Quote too high**, $F^{\\text{q}} > S_0e^{rT}$: do the **cash-and-carry** trade. Borrow $S_0$, buy the stock, and sell a forward at $F^{\\text{q}}$. At $T$, deliver the stock, receive $F^{\\text{q}}$, and repay $S_0e^{rT}$. The profit is"),
    eq("F^{\\text{q}} - S_0\\,e^{rT} > 0,"),
    p("whatever $S_T$ turned out to be: the stock leg and the forward leg offset each other exactly."),
    p("**Quote too low**, $F^{\\text{q}} < S_0e^{rT}$: do the **reverse cash-and-carry** trade. Short the stock, invest the $S_0$ received at $r$, and buy a forward at $F^{\\text{q}}$. At $T$, the investment has grown to $S_0e^{rT}$; pay $F^{\\text{q}}$ to take delivery of a share and return it to the lender. The profit is $S_0e^{rT} - F^{\\text{q}} > 0$."),
    p("Example: $S_0 = 100$, $r = 5\\%$, $T = 1$. The fair forward price is $100\\,e^{0.05} \\approx 105.13$. If the quote is 108, cash-and-carry locks in $108 - 105.13 = 2.87$ at maturity. If the quote is 103, the reverse trade locks in $105.13 - 103 = 2.13$."),
    p("The figure uses $S_0 = 100$. Set $r$ and $T$, then move the quoted forward price away from the fair value. The readouts name the strategy that exploits the gap. The chart plots, against $S_T$, the payoff of the stock-and-loan leg, the payoff of the forward leg and their sum. The two legs are mirror-image lines, so the sum is flat: the profit does not depend on $S_T$. It shrinks to zero when the quote equals $S_0e^{rT}$."),
    figure("forward-arbitrage"),

    h("Forward price and the value of a forward contract"),
    p("Two quantities are easily confused. The **forward price** $F_t$ is the delivery price that makes a *new* forward, entered at time $t$, worth zero; by the argument above, $F_t = S_te^{r(T-t)}$. The **value** of an *existing* forward with a fixed delivery price $K$ changes as the stock moves."),
    p("To value it at time $t$, use the same replication. The long forward delivers a share worth $S_T$ in exchange for $K$ at $T$. Holding one share today and owing $K$ at $T$ has the same payoff, and owing $K$ at $T$ is worth $-Ke^{-r(T-t)}$ today. So"),
    eq("f_t = S_t - K\\,e^{-r(T-t)}."),
    p("At inception $K = F_0 = S_0e^{rT}$ and $f_0 = 0$, as it should be. Example: a one-year forward was entered at $K = 105.13$. Six months later the stock is at 110, so"),
    eq("f_{0.5} = 110 - 105.13\\,e^{-0.05\\times 0.5} \\approx 110 - 102.53 = 7.47."),
    p("The long side holds a contract worth 7.47, even though new six-month forwards are now struck at $110\\,e^{0.025} \\approx 112.78$, not at 105.13."),

    h("Summary"),
    list(
      "An arbitrage costs nothing, never loses and sometimes gains; pricing theory assumes none exist.",
      "No arbitrage implies the law of one price: equal payoffs at $T$ mean equal prices today.",
      "Replicating the forward with stock and a loan gives $F_0 = S_0e^{rT}$, independent of any view on $S_T$.",
      "A quote above $F_0$ is exploited by cash-and-carry, a quote below by reverse cash-and-carry; the locked-in profit does not depend on $S_T$.",
      "An existing forward with delivery price $K$ is worth $f_t = S_t - Ke^{-r(T-t)}$.",
    ),
    note("\"Put–call parity\" applies the same replication argument to options: it compares a call and a put with a forward and needs no model for the stock."),
    lab("/payoff", "Compare forward and option payoffs in the Payoff lab"),
  ],

  hu: [
    p("Ez a lecke a határidős ügylet szállítási árát határozza meg anélkül, hogy bármilyen modellt feltételeznénk a jövőbeli részvényárra. Az érvelés egyetlen feltevésre épül, hogy a piacon nincs arbitrázs, valamint a „Kamat, kamatozás és diszkontálás” lecke diszkontfaktorára. Magát a határidős ügyletet a „Határidős ügyletek, call és put opciók” lecke definiálta."),

    h("Piaci feltevések"),
    p("Idealizált piacon dolgozunk. Bárki vehet fel hitelt és helyezhet el pénzt ugyanazon az $r$ kockázatmentes (folytonos) kamatlábon. A részvény tetszőleges mennyiségben vehető és shortolható; a **fedezetlen eladás** (short) azt jelenti, hogy kölcsönveszünk egy részvényt, ma eladjuk, később visszavásároljuk és visszaadjuk. Nincsenek tranzakciós költségek, adók és osztalék, és a szerződő felek teljesítik a vállalásaikat."),

    h("Arbitrázs"),
    p("Az **arbitrázs** olyan kereskedési stratégia, amelynek felépítése semmibe sem kerül, soha nem veszít pénzt, és legalább néhány kimenetelben pozitív nyereséget hoz. Ezzel egyenértékű: olyan stratégia, amely ma pénzt hoz, és később soha nem kell fizetni miatta."),
    p("Gondolj két boltra, amelyek ugyanazt a terméket különböző áron árulják: az olcsóban veszel, a drágában eladod, és a nyereség biztos. Likvid piacon a kereskedők az ilyen réseket azonnal kihasználják, a vételeik és eladásaik pedig addig mozdítják az árakat, amíg a rés be nem zárul. Az árazáselmélet ezért feltételezi, hogy arbitrázslehetőség nincs."),

    h("Az egy ár törvénye"),
    p("A leghasznosabb következmény az **egy ár törvénye**: ha két portfólió $T$-ben minden lehetséges állapotban ugyanannyit fizet, akkor ma is ugyanannyiba kell kerülniük. Különben megvennénk az olcsóbbat és eladnánk a drágábbat: a kifizetések $T$-ben kioltják egymást, az árkülönbség pedig ma kockázatmentes nyereségként nálunk marad."),
    note("Az arbitrázsmentességből következik az egy ár törvénye: a $T$-ben azonos kifizetésű portfóliók ára ma is azonos. A replikáláson alapuló árazás újra és újra ezt a szabályt alkalmazza."),

    h("A cash-and-carry érvelés"),
    p("A határidős ügylet arra kötelezi a hosszú felet, hogy $T$-ben $K$ szállítási áron megvegye a részvényt. A részvényhez $T$-ben másként is hozzájuthatunk: felveszünk $S_0$ hitelt, ma megvesszük a részvényt, és megtartjuk. Hasonlítsuk össze a két pozíciót:"),
    list(
      "**A portfólió:** hosszú határidős ügylet $K$ szállítási árral. Mai költség 0. $T$-ben: fizetünk $K$-t, megkapjuk a részvényt.",
      "**B portfólió:** veszünk egy részvényt $S_0$-ért, $S_0$ hitelből finanszírozva. Mai költség 0. $T$-ben: nálunk a részvény, a hitelt kamatostul, $S_0e^{rT}$ összegben visszafizetjük.",
    ),
    p("Mindkét portfólió ingyenes, és mindkettő egy részvénnyel zárul $T$-ben. Egyetlen különbség a $T$-ben fizetett pénz: A-ban $K$, B-ben $S_0e^{rT}$. Az egy ár törvénye miatt ennek a két összegnek egyenlőnek kell lennie. A **határidős ár** $F_0$ az a szállítási ár, amely mellett egy új határidős ügylet semmibe sem kerül:"),
    eq("F_0 = S_0\\,e^{rT}."),
    p("A határidős ár tehát a mai részvényár a kockázatmentes kamattal előrevetítve. Érdemes megnézni, mi hiányzik belőle: a részvény várható hozama, a volatilitása és bárki véleménye $S_T$-ről. A részvényt eltérően megítélő befektetőknek is ugyanabban az $F_0$-ban kell megegyezniük."),

    h("Ha a jegyzett határidős ár eltér"),
    p("Tegyük fel, hogy egy árjegyző $S_0e^{rT}$-től eltérő $F^{\\text{q}}$ szállítási árat jegyez."),
    p("**Túl magas jegyzés**, $F^{\\text{q}} > S_0e^{rT}$: **cash-and-carry** ügylet. Felveszünk $S_0$ hitelt, megvesszük a részvényt, és eladunk egy határidős ügyletet $F^{\\text{q}}$ áron. $T$-ben leszállítjuk a részvényt, megkapjuk $F^{\\text{q}}$-t, és visszafizetünk $S_0e^{rT}$-t. A nyereség"),
    eq("F^{\\text{q}} - S_0\\,e^{rT} > 0,"),
    p("bármi lett is $S_T$: a részvényláb és a határidős láb pontosan kioltja egymást."),
    p("**Túl alacsony jegyzés**, $F^{\\text{q}} < S_0e^{rT}$: **fordított cash-and-carry**. Shortoljuk a részvényt, a kapott $S_0$-t elhelyezzük $r$ kamaton, és veszünk egy határidős ügyletet $F^{\\text{q}}$ áron. $T$-ben a befektetés $S_0e^{rT}$-re nőtt; $F^{\\text{q}}$-t fizetünk a részvényért, és visszaadjuk a kölcsönadónak. A nyereség $S_0e^{rT} - F^{\\text{q}} > 0$."),
    p("Példa: $S_0 = 100$, $r = 5\\%$, $T = 1$. A fair határidős ár $100\\,e^{0{,}05} \\approx 105{,}13$. Ha a jegyzés 108, a cash-and-carry lejáratkor $108 - 105{,}13 = 2{,}87$ nyereséget rögzít. Ha a jegyzés 103, a fordított ügylet $105{,}13 - 103 = 2{,}13$-at."),
    p("Az ábra $S_0 = 100$-zal számol. Állítsd be $r$-t és $T$-t, majd told el a jegyzett határidős árat a fair értéktől. A kijelzők megnevezik a rést kihasználó stratégiát. A grafikon $S_T$ függvényében mutatja a részvény-plusz-hitel láb, a határidős láb és az összegük kifizetését. A két láb egymás tükörképe, így az összeg vízszintes: a nyereség nem függ $S_T$-től. Nullára csökken, amikor a jegyzés éppen $S_0e^{rT}$."),
    figure("forward-arbitrage"),

    h("Határidős ár és a határidős szerződés értéke"),
    p("Két mennyiséget könnyű összekeverni. A **határidős ár** $F_t$ az a szállítási ár, amely mellett egy $t$-ben kötött *új* határidős ügylet értéke nulla; a fenti érvelés szerint $F_t = S_te^{r(T-t)}$. Egy rögzített $K$ szállítási árú, *már meglévő* határidős ügylet **értéke** viszont a részvénnyel együtt mozog."),
    p("Az értékét $t$-ben ugyanazzal a replikálással kapjuk. A hosszú határidős ügylet $T$-ben $S_T$ értékű részvényt ad $K$-ért cserébe. Ugyanezt fizeti, ha ma tartunk egy részvényt, és $T$-ben $K$-val tartozunk; a $T$-beli $K$ tartozás mai értéke $-Ke^{-r(T-t)}$. Tehát"),
    eq("f_t = S_t - K\\,e^{-r(T-t)}."),
    p("Megkötéskor $K = F_0 = S_0e^{rT}$ és $f_0 = 0$, ahogy kell. Példa: egy egyéves határidős ügyletet $K = 105{,}13$ áron kötöttünk. Fél év múlva a részvény 110-en áll, így"),
    eq("f_{0{,}5} = 110 - 105{,}13\\,e^{-0{,}05\\cdot 0{,}5} \\approx 110 - 102{,}53 = 7{,}47."),
    p("A hosszú fél szerződése 7,47-et ér, noha az új, féléves határidős ügyleteket már $110\\,e^{0{,}025} \\approx 112{,}78$ áron kötik, nem 105,13-on."),

    h("Összefoglalás"),
    list(
      "Az arbitrázs ingyenes, soha nem veszít, és néha nyer; az árazáselmélet feltételezi, hogy nincs ilyen.",
      "Az arbitrázsmentességből következik az egy ár törvénye: $T$-ben azonos kifizetés, ma azonos ár.",
      "A határidős ügylet részvénnyel és hitellel replikálva $F_0 = S_0e^{rT}$-t ad, függetlenül attól, mit gondolunk $S_T$-ről.",
      "Az $F_0$ feletti jegyzést cash-and-carry, az alattit fordított cash-and-carry használja ki; a rögzített nyereség nem függ $S_T$-től.",
      "Egy meglévő, $K$ szállítási árú határidős ügylet értéke $f_t = S_t - Ke^{-r(T-t)}$.",
    ),
    note("A „Put–call paritás” lecke ugyanezt a replikációs érvelést alkalmazza opciókra: a callt és a putot egy határidős ügylettel veti össze, és nincs szükség modellre a részvényárra."),
    lab("/payoff", "Hasonlítsd össze a határidős és opciós kifizetéseket a Kifizetés laborban"),
  ],
};
