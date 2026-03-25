import { BlockMath, InlineMath } from "react-katex";
import { useI18n } from "../../../i18n";
import GuideLink from "../components/GuideLink";

function DeltaHedgingGuideHU() {
  return (
    <div className="guide-content">
      <p className="guide-highlight">
        Ha már tudjuk, hogyan árazzunk replikációval, akkor a következő kérdés:
        hogyan védjük ki az árfolyam kis elmozdulásait?
      </p>

      <p>
        Az előző útmutatóban láttuk, hogy egy derivatíva ára nem találgatásból,
        hanem <strong>replikációból</strong> jön: megpróbáljuk ugyanazt a
        jövőbeli kifizetést részvényből és készpénzből előállítani.
      </p>

      <p>
        Innen már csak egy kis lépés a delta hedgelés gondolata. Ha tudjuk,
        mennyire érzékeny a derivatíva értéke a részvényár változására, akkor
        megpróbálhatjuk ezt az érzékenységet részvénypozícióval ellensúlyozni.
      </p>

      <h3>1. Mi a probléma, amit a hedge megold?</h3>

      <p>
        Tegyük fel, hogy van egy call opciód. Ha a részvény ára változik, az
        opció értéke is változik.
      </p>

      <p className="guide-highlight">
        A hedge célja nem az, hogy minden kockázatot eltüntessünk örökre, hanem
        az, hogy a részvény kis elmozdulásaira az összpozíció minél kevésbé
        reagáljon.
      </p>

      <p>
        Vagyis szeretnénk egy olyan portfóliót építeni, amelyben a derivatíva és
        a részvény együtt rövid távon kiegyenlítik egymást.
      </p>

      <h3>2. A delta mint érzékenység</h3>

      <p>
        A delta azt méri, hogy a derivatíva értéke mennyit változik, ha a
        részvény ára egy kicsit megváltozik.
      </p>

      <BlockMath math={"Delta = dV/dS"} />

      <p>
        Ezt úgy lehet olvasni, hogy a delta a derivatíva árának{" "}
        <strong>helyi meredeksége</strong> a részvényár szerint.
      </p>

      <p>
        Ha például egy opciónak a deltája <InlineMath math="0.6" />, akkor egy
        kis részvényár-emelkedésre az opció értéke körülbelül ennek 60%-ával
        mozdul ugyanabba az irányba.
      </p>

      <h3>3. A binomiális modellben a delta még nagyon kézzelfogható</h3>

      <p>
        Egy egyperiódusos binomiális modellben a derivatíva értéke a két
        állapotban legyen <InlineMath math="X_u" /> és{" "}
        <InlineMath math="X_d" />. A részvény a két állapotban{" "}
        <InlineMath math="uS_0" /> és <InlineMath math="dS_0" />.
      </p>

      <p>A replikáló portfólió részvénykitettsége:</p>

      <BlockMath math={"Delta = (X_u - X_d)/((u-d)S_0)"} />

      <p>
        Ez pontosan ugyanaz a <InlineMath math="Delta" />, amit az előző
        guide-ban már láttunk a replikációból.
      </p>

      <p className="guide-highlight">
        A binomiális modellben a delta egyszerre két dolog:
        <br />
        a replikáló portfólió részvényszáma
        <br />
        és
        <br />a derivatíva árérzékenysége.
      </p>

      <p>Ez az egyik legfontosabb kapcsolat az egész opcióelméletben.</p>

      <h3>4. Mit jelent a hedge konkrétan?</h3>

      <p>
        Tegyük fel, hogy van egy opciós pozíciód, amelynek deltája{" "}
        <InlineMath math="Delta" />. Ha ehhez felveszel egy megfelelő
        részvénypozíciót az ellenkező irányban, akkor a teljes portfólió első
        rendű részvénykitettsége lenullázható.
      </p>

      <p>
        Például ha long vagy egy opción, akkor a hedge-elt portfólió egyik
        természetes alakja:
      </p>

      <BlockMath math={"Pi = V - Delta S"} />

      <p>Ennek kis elmozdulásokra a változása közel:</p>

      <BlockMath math={"dPi approx dV - Delta dS"} />

      <p>
        Ha <InlineMath math={"Delta = dV/dS"} />, akkor az első rendű rész
        kiesik, és a portfólió rövid távon sokkal kevésbé lesz érzékeny a
        részvény mozgására.
      </p>

      <h3>5. Miért csak “kis” mozgásokra működik így?</h3>

      <p>
        Azért, mert a delta egy <strong>helyi</strong> mennyiség. Egy adott
        pontban mondja meg a meredekséget.
      </p>

      <p>
        Ha a részvény ára sokat változik, akkor általában maga a delta is
        megváltozik.
      </p>

      <p className="guide-highlight">
        A delta hedge ezért nem egyszeri művelet, hanem folyamatos újraigazítási
        probléma.
      </p>

      <p>
        Ezt hívjuk <strong>rebalanszolásnak</strong>: időről időre újra kell
        állítani, hány darab részvényt tartunk a hedge-ben.
      </p>

      <h3>6. Mi történik egy call opciónál?</h3>

      <p>Egy európai call deltája tipikusan 0 és 1 között van.</p>

      <ul>
        <li>
          mélyen out-of-the-money helyzetben a delta kicsi, mert az opció értéke
          alig reagál a részvény kis mozgásaira,
        </li>
        <li>at-the-money környékén a delta gyorsabban változik,</li>
        <li>
          mélyen in-the-money helyzetben a delta közel 1, mert az opció már
          majdnem úgy viselkedik, mint maga a részvény.
        </li>
      </ul>

      <p>
        Ezért egy call hedge-eléséhez általában nem ugyanannyi részvényt tartunk
        minden árfolyamszinten.
      </p>

      <h3>7. Kapcsolat a gamma-val</h3>

      <p>
        Ha a delta maga is változik, akkor fontos kérdés lesz, milyen gyorsan
        változik.
      </p>

      <p>Ezt méri a gamma:</p>

      <BlockMath math={"Gamma = d^2V/dS^2"} />

      <p>
        A gamma azt mondja meg, mennyire instabil a delta. Minél nagyobb a
        gamma, annál gyakrabban kell a hedge-et újraigazítani.
      </p>

      <p>
        Delta hedgelésről tehát nem érdemes úgy beszélni, hogy közben
        elfelejtjük: a hedge minőségét nagyban befolyásolja az is, hogyan mozog
        a delta.
      </p>

      <h3>8. A binomiális modellből a folytonos modell felé</h3>

      <p>
        A binomiális modellben a delta még két állapot különbségéből számolható.
        A folytonos idejű modellben ugyanez a gondolat deriváltként jelenik meg.
      </p>

      <p>Vagyis a képlet</p>

      <BlockMath math={"Delta = (X_u - X_d)/((u-d)S_0)"} />

      <p>fokozatosan átmegy abba az intuícióba, hogy</p>

      <BlockMath math={"Delta = dV/dS"} />

      <p>A diszkrét különbségi hányadosból helyi meredekség lesz.</p>

      <h3>9. Miért központi fogalom ez az opcióárazásban?</h3>

      <p>Azért, mert a delta hedgelés összeköti:</p>

      <ul>
        <li>a replikáció gondolatát,</li>
        <li>az arbitrázsmentes árazást,</li>
        <li>és a Black–Scholes-típusú folytonos modelleket.</li>
      </ul>

      <p className="guide-highlight">
        A nagy ötlet az, hogy ha egy derivatíva kockázatát helyben ki tudjuk
        hedge-elni részvénnyel, akkor az ára nem szabadon lebeg, hanem a piac
        szerkezetéből következik.
      </p>

      <h3>10. Mit érdemes most kipróbálni?</h3>

      <ul>
        <li>
          <GuideLink to="/binomial?s0=100&k=100&u=1.2&d=0.9&r=0.05&steps=1&type=call">
            Egyperiódusos call a binomiális modellen
          </GuideLink>
        </li>
        <li>
          <GuideLink to="/binomial?s0=100&k=100&u=1.2&d=0.85&r=0.05&steps=4&type=call">
            Többlépéses call a binomiális modellen
          </GuideLink>
        </li>
        <li>
          <GuideLink to="/payoff?preset=long-call">
            Call payoff a Payoff Labben
          </GuideLink>
        </li>
      </ul>

      <p>Külön figyeld meg:</p>

      <ul>
        <li>hogyan változik a hedge aránya különböző állapotokban,</li>
        <li>miért nem marad állandó a delta,</li>
        <li>és hogyan kapcsolódik a replikáció a hedge-hez.</li>
      </ul>

      <h3>11. A lényeg egy mondatban</h3>

      <p className="guide-highlight">
        A delta hedgelés lényege, hogy a derivatíva részvényár-érzékenységét egy
        megfelelő ellenirányú részvénypozícióval helyben kioltsuk.
      </p>
    </div>
  );
}

function DeltaHedgingGuideEN() {
  return (
    <div className="guide-content">
      <p className="guide-highlight">
        Once we know how pricing comes from replication, the next question is:
        how do we neutralize small stock-price moves?
      </p>

      <p>
        In the previous guide, we saw that a derivative price is not guessed but
        obtained by <strong>replication</strong>: we try to reproduce the same
        future payoff using stock and cash.
      </p>

      <p>
        Delta hedging is the next natural step. If we know how sensitive the
        derivative value is to the stock price, we can try to offset that
        sensitivity with a stock position.
      </p>

      <h3>1. What problem is hedging solving?</h3>

      <p>
        Suppose you hold a call option. When the stock price moves, the option
        value moves as well.
      </p>

      <p className="guide-highlight">
        The goal of hedging is not to eliminate all risk forever. It is to make
        the total position much less sensitive to small stock-price moves.
      </p>

      <p>
        In other words, we want to build a portfolio in which the derivative and
        the stock locally offset each other.
      </p>

      <h3>2. Delta as sensitivity</h3>

      <p>
        Delta measures how much the derivative value changes when the stock
        price changes by a small amount.
      </p>

      <BlockMath math={"Delta = dV/dS"} />

      <p>
        You can read this as the <strong>local slope</strong> of the derivative
        price with respect to the stock price.
      </p>

      <p>
        For example, if an option has delta <InlineMath math="0.6" />, then for
        a small increase in the stock price, the option value moves by roughly
        60% as much in the same direction.
      </p>

      <h3>3. In the binomial model delta is very concrete</h3>

      <p>
        In a one-period binomial model, let the derivative pay{" "}
        <InlineMath math="X_u" /> and <InlineMath math="X_d" /> in the two
        states. The stock becomes <InlineMath math="uS_0" /> or{" "}
        <InlineMath math="dS_0" />.
      </p>

      <p>The stock position in the replicating portfolio is</p>

      <BlockMath math={"Delta = (X_u - X_d)/((u-d)S_0)"} />

      <p>
        This is exactly the same <InlineMath math="Delta" /> that already
        appeared in the replication argument.
      </p>

      <p className="guide-highlight">
        In the binomial model delta is two things at once:
        <br />
        the number of shares in the replicating portfolio
        <br />
        and
        <br />
        the price sensitivity of the derivative.
      </p>

      <p>This is one of the most important links in option theory.</p>

      <h3>4. What does the hedge look like in practice?</h3>

      <p>
        Suppose you hold an option with delta <InlineMath math="Delta" />. If
        you take an opposite stock position of the right size, the first-order
        stock exposure of the total portfolio can be neutralized.
      </p>

      <p>For example, if you are long the option, a natural hedged portfolio is</p>

      <BlockMath math={"Pi = V - Delta S"} />

      <p>For small moves, its change is approximately</p>

      <BlockMath math={"dPi approx dV - Delta dS"} />

      <p>
        If <InlineMath math={"Delta = dV/dS"} />, then the first-order term
        cancels, and the portfolio becomes much less sensitive to the stock over
        short horizons.
      </p>

      <h3>5. Why does this work only for “small” moves?</h3>

      <p>
        Because delta is a <strong>local</strong> quantity. It tells you the
        slope at one point.
      </p>

      <p>If the stock price moves a lot, delta itself will usually change.</p>

      <p className="guide-highlight">
        So delta hedging is not a one-time action. It is a repeated rebalancing
        problem.
      </p>

      <p>
        That is why the hedge position has to be updated over time as the stock
        and the option value evolve.
      </p>

      <h3>6. What happens for a call option?</h3>

      <p>The delta of a European call is typically between 0 and 1.</p>

      <ul>
        <li>
          deep out-of-the-money, delta is small because the option barely reacts
          to small stock moves,
        </li>
        <li>near the money, delta changes more rapidly,</li>
        <li>
          deep in-the-money, delta gets close to 1 because the option starts to
          behave almost like the stock itself.
        </li>
      </ul>

      <p>
        So a call option is not hedged with the same number of shares at every
        stock level.
      </p>

      <h3>7. The connection to gamma</h3>

      <p>
        If delta changes, then an important next question is how quickly it
        changes.
      </p>

      <p>That is measured by gamma:</p>

      <BlockMath math={"Gamma = d^2V/dS^2"} />

      <p>
        Gamma tells us how unstable delta is. The larger the gamma, the more
        frequently the hedge has to be adjusted.
      </p>

      <p>
        So delta hedging is never the whole story by itself: its quality depends
        strongly on how much delta moves.
      </p>

      <h3>8. From the binomial model toward continuous time</h3>

      <p>
        In the binomial model delta comes from a two-state difference quotient.
        In continuous time, the same idea appears as a derivative.
      </p>

      <p>In other words,</p>

      <BlockMath math={"Delta = (X_u - X_d)/((u-d)S_0)"} />

      <p>gradually becomes the intuition that</p>

      <BlockMath math={"Delta = dV/dS"} />

      <p>The discrete slope becomes a local slope.</p>

      <h3>9. Why is this central in option pricing?</h3>

      <p>Because delta hedging connects</p>

      <ul>
        <li>replication,</li>
        <li>arbitrage-free pricing,</li>
        <li>and Black–Scholes-type continuous-time models.</li>
      </ul>

      <p className="guide-highlight">
        The big idea is that if a derivative’s local stock risk can be hedged
        using the stock itself, then its price is not free-floating: it is
        pinned down by the market structure.
      </p>

      <h3>10. What should you try now?</h3>

      <ul>
        <li>
          <GuideLink to="/binomial?s0=100&k=100&u=1.2&d=0.9&r=0.05&steps=1&type=call">
            One-period call in the binomial model
          </GuideLink>
        </li>
        <li>
          <GuideLink to="/binomial?s0=100&k=100&u=1.2&d=0.85&r=0.05&steps=4&type=call">
            Multi-step call in the binomial model
          </GuideLink>
        </li>
        <li>
          <GuideLink to="/payoff?preset=long-call">
            Call payoff in the Payoff Lab
          </GuideLink>
        </li>
      </ul>

      <p>Pay special attention to</p>

      <ul>
        <li>how the hedge ratio changes across states,</li>
        <li>why delta is not constant,</li>
        <li>and how replication turns into hedging.</li>
      </ul>

      <h3>11. The essence in one sentence</h3>

      <p className="guide-highlight">
        Delta hedging means locally offsetting a derivative’s stock-price
        sensitivity with an opposite stock position of the right size.
      </p>
    </div>
  );
}

export default function DeltaHedgingGuide() {
  const { language } = useI18n();
  return language === "hu" ? <DeltaHedgingGuideHU /> : <DeltaHedgingGuideEN />;
}