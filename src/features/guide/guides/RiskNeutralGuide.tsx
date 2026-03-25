import { BlockMath, InlineMath } from "react-katex";
import { useI18n } from "../../../i18n";
import GuideLink from "../components/GuideLink";

function RiskNeutralGuideHU() {
  return (
    <div className="guide-content">
      <p className="guide-highlight">
        Hogyan lehet ma árat adni valaminek, amely csak a jövőben fizet?
      </p>

      <p>
        A <GuideLink to="/payoff?preset=long-call">Payoff Lab</GuideLink> oldalon
        már láttuk, hogy egy derivatíva lejáratkori kifizetése tipikusan a
        részvény jövőbeli árától függ. Ha a lejáratkori payoffot már értjük,
        akkor a következő kérdés az:
      </p>

      <p className="guide-highlight">
        mennyit ér ma ez a bizonytalan jövőbeli kifizetés?
      </p>

      <h3>1. Az első ötlet: vegyünk átlagot</h3>

      <p>
        Ha egy kifizetés bizonytalan, természetes első gondolat, hogy a mai ár
        valamilyen jövőbeli átlagból jön.
      </p>

      <p>Vegyünk egy egyszerű játékot. Dobsz egy szabályos kockával:</p>

      <ul>
        <li>ha páros jön ki, kapsz 100-at,</li>
        <li>ha páratlan jön ki, kapsz 50-et.</li>
      </ul>

      <p>A szokásos várható érték:</p>

      <BlockMath math={"E^P[X] = (1/2) · 100 + (1/2) · 50 = 75"} />

      <p>
        Ez a <InlineMath math="P" /> alatti várható érték, vagyis a valódi
        valószínűségek szerinti átlag.
      </p>

      <p>
        Matematikailag ez teljesen természetes. Pénzügyileg azonban még nem
        világos, hogy ez valóban a helyes ár.
      </p>

      <p>
        Ennek az az oka, hogy a pénzügyben egy árnak nem elég egy “jó
        átlagnak” lennie. Az árnak összhangban kell lennie a piacon
        kereskedhető más eszközök áraival is.
      </p>

      <p>
        Ha ugyanazt a jövőbeli kifizetést más eszközökből is elő lehet állítani,
        akkor a derivatíva ára nem lehet tetszőleges. Különben arbitrázs
        jelenne meg.
      </p>

      <p className="guide-highlight">
        Tehát nem pusztán átlagot keresünk, hanem arbitrázsmentes árat.
      </p>

      <h3>2. Miért akarunk “cinkelni a kockán”?</h3>

      <p>
        A pénzügyben nem azt keressük, hogy mi a legvalószínűbb jövő, hanem azt,
        hogyan kell a lehetséges kimeneteket súlyozni ahhoz, hogy a kapott ár
        összhangban legyen a piaccal.
      </p>

      <p className="guide-highlight">
        Nem azt kérdezzük, mi fog történni, hanem azt, milyen súlyozás mellett
        lesz a mai ár fair.
      </p>

      <p>
        A “cinkelt kocka” itt nem csalást jelent, hanem egy új súlyozást. Ez a
        súlyozás nem a valóság leírására szolgál, hanem az arbitrázsmentes
        árazásra.
      </p>

      <h3>3. Először gondolkodjunk kamat nélkül</h3>

      <p>
        A logika tisztasága kedvéért először tegyük fel, hogy a mai és a holnapi
        pénz ugyanannyit ér. Vagyis most még nincs kamat.
      </p>

      <p>
        Ha egy termék két lehetséges kifizetése <InlineMath math="X_u" /> és{" "}
        <InlineMath math="X_d" />, akkor szeretnénk a mai árat valahogy így
        felírni:
      </p>

      <BlockMath math={"V_0 = qX_u + (1-q)X_d"} />

      <p>
        Ez formailag várható értéknek néz ki. A különbség az, hogy a{" "}
        <InlineMath math="q" /> itt nem feltétlenül a világ valódi
        valószínűsége, hanem az a súly, amely mellett az ár fair lesz.
      </p>

      <h3>4. Mit jelent itt az, hogy fair?</h3>

      <p>
        A fair itt arbitrázsmentest jelent. Nem szeretnénk olyan helyzetet,
        ahol valaki
      </p>

      <ul>
        <li>nempozitív kezdeti költséggel indul,</li>
        <li>biztosan nem veszít,</li>
        <li>és valamelyik állapotban szigorúan nyer.</li>
      </ul>

      <p>Ha ilyen lehetőség lenne, akkor az árak nincsenek összhangban.</p>

      <h3>5. A legegyszerűbb részvénymodell</h3>

      <p>
        Legyen a részvény mai ára <InlineMath math="S_0" />. Egy periódus múlva
        két dolog történhet:
      </p>

      <BlockMath math={"S_1 in {uS_0, dS_0}"} />

      <p>
        Itt <InlineMath math="u" /> a fel-szorzó, <InlineMath math="d" /> pedig a
        le-szorzó.
      </p>

      <p>
        Például ha <InlineMath math="u=1.2" /> és <InlineMath math="d=0.9" />,
        akkor a részvény vagy 20%-kal felmegy, vagy 10%-kal lemegy.
      </p>

      <h3>
        6. A kulcsgondolat: ne találgassuk az árat, hanem másoljuk le a
        kifizetést
      </h3>

      <p className="guide-highlight">
        A derivatíva árát nem kitaláljuk, hanem replikáljuk.
      </p>

      <p>
        Tegyük fel, hogy a derivatíva a két állapotban{" "}
        <InlineMath math="X_u" /> és <InlineMath math="X_d" /> kifizetést ad.
      </p>

      <p>
        Ha ezt a kifizetést elő tudjuk állítani részvény és készpénz megfelelő
        kombinációjával, akkor a derivatíva mai árának meg kell egyeznie ennek
        a portfóliónak a mai árával.
      </p>

      <p>
        Kamat nélkül egy <InlineMath math="Delta" /> darab részvényből és{" "}
        <InlineMath math="B" /> készpénzből álló portfólió a két állapotban ezt
        adja:
      </p>

      <BlockMath math={"Delta uS_0 + B = X_u"} />
      <BlockMath math={"Delta dS_0 + B = X_d"} />

      <p>
        Két állapot van, ezért két egyenletből meg tudjuk határozni a két
        ismeretlent: <InlineMath math="Delta" />-t és <InlineMath math="B" />-t.
      </p>

      <p>A különbségből:</p>

      <BlockMath math={"Delta (u-d)S_0 = X_u - X_d"} />

      <BlockMath math={"Delta = (X_u - X_d)/((u-d)S_0)"} />

      <p>Ezután például az első egyenletből:</p>

      <BlockMath math={"B = X_u - Delta uS_0"} />

      <p>Így a derivatíva mai ára:</p>

      <BlockMath math={"V_0 = Delta S_0 + B"} />

      <h3>7. Innen bukkan elő a q</h3>

      <p className="guide-highlight">
        És most jön a fontos felismerés: ugyanaz az ár átírható várható érték
        alakba.
      </p>

      <BlockMath math={"V_0 = qX_u + (1-q)X_d"} />

      <p>ahol</p>

      <BlockMath math={"q = (1-d)/(u-d)"} />

      <p>
        Ezt a <InlineMath math="q" />-t nem mi találtuk ki. A replikációból
        jött ki.
      </p>

      <p>
        Vagyis a “cinkelt kocka” súlya nem vélemény, hanem az
        arbitrázsmentességből következő szám.
      </p>

      <p>Ebből az is következik, hogy</p>

      <BlockMath math={"qu + (1-q)d = 1"} />

      <p>Tehát ebben a súlyozásban a részvény várható szorzója éppen 1.</p>

      <h3>8. Miért kockázatsemleges ez a világ?</h3>

      <p>
        Azért, mert ebben az árazási világban a kockázat nem kap külön jutalmat.
        Kamat nélkül:
      </p>

      <BlockMath math={"E^Q[S_1] = S_0"} />

      <p className="guide-highlight">
        A <InlineMath math="Q" /> nem a valóság leírása, hanem az
        arbitrázsmentes árazás nyelve.
      </p>

      <h3>9. Most tegyük vissza a kamatot</h3>

      <p>
        Ha az egy periódusos kockázatmentes növekedési tényező{" "}
        <InlineMath math="1+r" />, akkor a replikációs egyenletek:
      </p>

      <BlockMath math={"Delta uS_0 + B(1+r) = X_u"} />
      <BlockMath math={"Delta dS_0 + B(1+r) = X_d"} />

      <p>Ekkor a kockázatsemleges súly:</p>

      <BlockMath math={"q = ((1+r)-d)/(u-d)"} />

      <p>és a mai ár:</p>

      <BlockMath math={"V_0 = (1/(1+r))(qX_u + (1-q)X_d)"} />

      <p>Most a kulcsazonosság:</p>

      <BlockMath math={"qu + (1-q)d = 1+r"} />

      <p>vagyis</p>

      <BlockMath math={"E^Q[S_1] = (1+r)S_0"} />

      <p>diszkontálva pedig</p>

      <BlockMath math={"E^Q[(S_1/(1+r))] = S_0"} />

      <p>Ez a binomiális modell legegyszerűbb martingálgondolata.</p>

      <h3>10. P és Q szerepe</h3>

      <ul>
        <li><InlineMath math="P" />: mi történik valójában,</li>
        <li><InlineMath math="Q" />: hogyan kell arbitrázsmentesen árazni.</li>
      </ul>

      <p>
        Nem az a jó kérdés, hogy melyik az “igazi”, hanem az, hogy melyik mire
        való.
      </p>

      <h3>11. A lényeg egy mondatban</h3>

      <p className="guide-highlight">
        A kockázatsemleges mérték nem a valószínűbb jövőt mondja meg, hanem azt
        a súlyozást adja, amely mellett a jelenbeli ár arbitrázsmentes lesz.
      </p>

      <p>
        Innen a következő természetes lépés az, hogy ez a replikációs gondolat
        hogyan vezet el a delta hedgeléshez.
      </p>
    </div>
  );
}

function RiskNeutralGuideEN() {
  return (
    <div className="guide-content">
      <p className="guide-highlight">
        How can we assign a price today to something that will only pay in the
        future?
      </p>

      <p>
        On the <GuideLink to="/payoff?preset=long-call">Payoff Lab</GuideLink>,
        we already saw that a derivative is typically defined through its payoff
        at maturity. Once that terminal payoff is clear, the next question is:
      </p>

      <p className="guide-highlight">
        what is that uncertain future payoff worth today?
      </p>

      <h3>1. The first idea: take an average</h3>

      <p>
        If a payoff is uncertain, the most natural first idea is that its price
        today should come from some average of future outcomes.
      </p>

      <p>Consider a simple game. You roll a fair die:</p>

      <ul>
        <li>if the result is even, you receive 100,</li>
        <li>if the result is odd, you receive 50.</li>
      </ul>

      <p>The usual expected value is</p>

      <BlockMath math={"E^P[X] = (1/2) · 100 + (1/2) · 50 = 75"} />

      <p>
        This is the expectation under <InlineMath math="P" />, that is, under
        the real-world probabilities.
      </p>

      <p>
        Mathematically this is perfectly natural. Financially, however, it is
        still not clear that this is the correct price.
      </p>

      <p>
        The reason is that in finance a price does not just need to be “some
        good average” of future payoffs. It also has to be consistent with the
        prices of other traded assets in the market.
      </p>

      <p>
        If the same future payoff can be created using other traded assets, then
        the derivative price cannot be arbitrary. Otherwise an arbitrage
        opportunity would appear.
      </p>

      <p className="guide-highlight">
        So we are not merely looking for an average. We are looking for an
        arbitrage-free price.
      </p>

      <h3>2. Why would we want to “load the die”?</h3>

      <p>
        In finance the point is not to guess the most likely future. The point
        is to find a weighting of possible outcomes that is consistent with
        market prices.
      </p>

      <p className="guide-highlight">
        We are not asking what will happen. We are asking under what weighting
        today’s price becomes fair.
      </p>

      <p>
        Here the “loaded die” is not about cheating. It means introducing a new
        weighting of outcomes. Its role is not to describe reality, but to make
        pricing arbitrage-free.
      </p>

      <h3>3. First think without interest</h3>

      <p>
        To keep the logic clean, let us first assume that today’s money and
        tomorrow’s money are worth the same. So for the moment there is no
        interest rate.
      </p>

      <p>
        If a product pays <InlineMath math="X_u" /> in the up state and{" "}
        <InlineMath math="X_d" /> in the down state, we would like to write its
        current value in the form
      </p>

      <BlockMath math={"V_0 = qX_u + (1-q)X_d"} />

      <p>
        Formally this looks like an expectation. But <InlineMath math="q" /> is
        not necessarily the true probability of the up state. It is the weight
        that makes the current price fair.
      </p>

      <h3>4. What does “fair” mean here?</h3>

      <p>
        Here “fair” means arbitrage-free. We do not want a situation where
        someone can
      </p>

      <ul>
        <li>start with zero or nonpositive initial cost,</li>
        <li>never lose,</li>
        <li>and make a strict profit in at least one state.</li>
      </ul>

      <p>If that were possible, prices would be inconsistent.</p>

      <h3>5. The simplest stock model</h3>

      <p>
        Let the stock price today be <InlineMath math="S_0" />. One period
        later, it becomes either
      </p>

      <BlockMath math={"S_1 in {uS_0, dS_0}"} />

      <p>
        Here <InlineMath math="u" /> is the up factor and{" "}
        <InlineMath math="d" /> is the down factor.
      </p>

      <p>
        For example, if <InlineMath math="u=1.2" /> and{" "}
        <InlineMath math="d=0.9" />, the stock either rises by 20% or falls by
        10%.
      </p>

      <h3>6. The key idea: do not guess the price, replicate the payoff</h3>

      <p className="guide-highlight">
        We do not invent the derivative price. We reproduce its payoff.
      </p>

      <p>
        Suppose the derivative pays <InlineMath math="X_u" /> and{" "}
        <InlineMath math="X_d" /> in the two states.
      </p>

      <p>
        If we can create exactly the same future payoff using a combination of
        stock and cash, then the derivative price today must equal the cost of
        that portfolio.
      </p>

      <p>
        Without interest, a portfolio consisting of <InlineMath math="Delta" />{" "}
        shares and <InlineMath math="B" /> units of cash gives
      </p>

      <BlockMath math={"Delta uS_0 + B = X_u"} />
      <BlockMath math={"Delta dS_0 + B = X_d"} />

      <p>
        There are two states, so these two equations determine the two
        unknowns: <InlineMath math="Delta" /> and <InlineMath math="B" />.
      </p>

      <p>Taking the difference gives</p>

      <BlockMath math={"Delta (u-d)S_0 = X_u - X_d"} />

      <BlockMath math={"Delta = (X_u - X_d)/((u-d)S_0)"} />

      <p>Then, for example from the first equation,</p>

      <BlockMath math={"B = X_u - Delta uS_0"} />

      <p>So the derivative price today is</p>

      <BlockMath math={"V_0 = Delta S_0 + B"} />

      <h3>7. This is where q appears</h3>

      <p className="guide-highlight">
        And now comes the important point: the same price can be rewritten in
        expectation form.
      </p>

      <BlockMath math={"V_0 = qX_u + (1-q)X_d"} />

      <p>where</p>

      <BlockMath math={"q = (1-d)/(u-d)"} />

      <p>
        We did not choose <InlineMath math="q" /> by hand. It comes out of
        replication.
      </p>

      <p>
        So the “loaded die” is not a subjective opinion. It is the number
        forced on us by arbitrage-free pricing.
      </p>

      <p>This also implies</p>

      <BlockMath math={"qu + (1-q)d = 1"} />

      <p>So under this weighting the expected stock multiplier is exactly 1.</p>

      <h3>8. Why is this called risk-neutral?</h3>

      <p>
        Because in this pricing world risk does not earn a separate premium.
        Without interest:
      </p>

      <BlockMath math={"E^Q[S_1] = S_0"} />

      <p className="guide-highlight">
        <InlineMath math="Q" /> is not meant to describe reality. It is the
        natural language of arbitrage-free pricing.
      </p>

      <h3>9. Now put interest back in</h3>

      <p>
        If the one-period risk-free growth factor is <InlineMath math="1+r" />,
        then the replication equations become
      </p>

      <BlockMath math={"Delta uS_0 + B(1+r) = X_u"} />
      <BlockMath math={"Delta dS_0 + B(1+r) = X_d"} />

      <p>Then the risk-neutral weight is</p>

      <BlockMath math={"q = ((1+r)-d)/(u-d)"} />

      <p>and the current price is</p>

      <BlockMath math={"V_0 = (1/(1+r))(qX_u + (1-q)X_d)"} />

      <p>The key identity is now</p>

      <BlockMath math={"qu + (1-q)d = 1+r"} />

      <p>which means</p>

      <BlockMath math={"E^Q[S_1] = (1+r)S_0"} />

      <p>and in discounted form</p>

      <BlockMath math={"E^Q[(S_1/(1+r))] = S_0"} />

      <p>This is the simplest martingale statement in the binomial model.</p>

      <h3>10. The roles of P and Q</h3>

      <ul>
        <li><InlineMath math="P" />: what actually happens,</li>
        <li>
          <InlineMath math="Q" />: how prices must be weighted to be
          arbitrage-free.
        </li>
      </ul>

      <p>
        So the right question is not which one is “true”, but what each one is
        for.
      </p>

      <h3>11. The essence in one sentence</h3>

      <p className="guide-highlight">
        The risk-neutral measure does not tell us which future is more likely.
        It gives the weighting under which today’s price is arbitrage-free.
      </p>

      <p>
        From here, the next natural step is to see how this replication idea
        leads to delta hedging.
      </p>
    </div>
  );
}

export default function RiskNeutralGuide() {
  const { language } = useI18n();
  return language === "hu" ? <RiskNeutralGuideHU /> : <RiskNeutralGuideEN />;
}