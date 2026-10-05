import { BlockMath, InlineMath } from "react-katex";
import { useI18n } from "../../../i18n";
import GuideTryIt from "../components/GuideTryIt";

function NoArbitrageGuideHU() {
  return (
    <div className="guide-content">
      <p>
        Az előző lecke egy jövőbeli kifizetést adott. Most a központi kérdés:{" "}
        <strong>mennyit ér ez ma?</strong> A meglepő válasz az, hogy az árat nem
        a vágyaink, hanem egyetlen szabály határozza meg – a{" "}
        <strong>nincs arbitrázs</strong> elve.
      </p>

      <h3>1. A pénz időértéke</h3>
      <p>
        Ma 100 forint többet ér, mint egy év múlva 100 forint, mert a mait
        kockázatmentesen befektethetjük. Ha a kockázatmentes kamat{" "}
        <InlineMath math="r" />, akkor a mai <InlineMath math="B_0" /> egy év
        múlva ennyire nő:
      </p>

      <BlockMath math="B_T = B_0\,e^{rT}." />

      <p>
        Visszafelé ugyanez <strong>diszkontálás</strong>: egy biztos jövőbeli{" "}
        <InlineMath math="C" /> összeg mai értéke
      </p>

      <BlockMath math="\text{PV} = C\,e^{-rT}." />

      <h3>2. Az egy ár törvénye</h3>
      <p>
        A kulcsgondolat egyszerű: ha két portfólió <em>minden</em> jövőbeli
        helyzetben pontosan ugyanazt fizeti, akkor ma ugyanannyiba kell
        kerülniük. Ha nem, egy kereskedő megveszi az olcsóbbat, eladja a
        drágábbat, és kockázat nélkül azonnali profitot zsebel be.
      </p>

      <p className="guide-highlight">
        Az arbitrázs ingyenpénz kockázat nélkül. A likvid piacok gyakorlatilag
        azonnal eltüntetik – ezért feltételezzük, hogy nincs. Ez a feltevés
        önmagában elég az árazáshoz.
      </p>

      <h3>3. Első eredmény: put–call paritás</h3>
      <p>
        Az előző leckéből tudjuk, hogy egy vett call mínusz egy eladott put
        (azonos <InlineMath math="K" /> strike-kal) a lejáratkor pontosan egy
        forwardot ad:
      </p>

      <BlockMath math="C_T - P_T = S_T - K." />

      <p>
        Építsünk két portfóliót, amelyek ezt a jobb oldalt{" "}
        <InlineMath math="S_T - K" />-t adják lejáratkor:
      </p>

      <ul>
        <li>
          <strong>A:</strong> veszünk egy callt és eladunk egy putot –
          költsége ma <InlineMath math="C_0 - P_0" />.
        </li>
        <li>
          <strong>B:</strong> veszünk egy részvényt és kölcsönveszünk{" "}
          <InlineMath math="K\,e^{-rT}" />-t – költsége ma{" "}
          <InlineMath math="S_0 - K\,e^{-rT}" />.
        </li>
      </ul>

      <p>
        A B portfólió lejáratkor <InlineMath math="S_T" />-t ér, mínusz a
        visszafizetett <InlineMath math="K" /> hitel, azaz szintén{" "}
        <InlineMath math="S_T - K" />. Mivel a két portfólió kifizetése{" "}
        <em>mindig</em> azonos, a mai áruk is egyenlő:
      </p>

      <BlockMath math="C_0 - P_0 = S_0 - K\,e^{-rT}." />

      <p>
        Ez a <strong>put–call paritás</strong>. Nem feltételeztünk semmit a
        részvény jövőbeli viselkedéséről, mégis egy pontos árkapcsolatot kaptunk –
        tisztán a nincs arbitrázs elvéből.
      </p>

      <h3>Miért fontos ez?</h3>
      <p>
        A paritás a call és put árát összeköti, de külön-külön még nem adja meg
        őket. Ahhoz egy modell kell arra, hogyan mozog a részvény. A
        legegyszerűbb ilyen modell – ahol a részvény egy lépésben kétfelé mehet –
        vezet el a kockázatsemleges árazáshoz. Ez a következő lecke.
      </p>

      <GuideTryIt to="/payoff" label="Próbáld ki">
        állíts össze egy szintetikus forwardot a Payoff Lab-ban
      </GuideTryIt>
    </div>
  );
}

function NoArbitrageGuideEN() {
  return (
    <div className="guide-content">
      <p>
        The previous lesson gave us a future payoff. Now the central question:{" "}
        <strong>what is it worth today?</strong> The surprising answer is that
        the price is pinned down not by our wishes but by a single rule — the
        principle of <strong>no arbitrage</strong>.
      </p>

      <h3>1. The time value of money</h3>
      <p>
        100 today is worth more than 100 a year from now, because today's money
        can be invested risk-free. If the risk-free rate is{" "}
        <InlineMath math="r" />, then <InlineMath math="B_0" /> today grows to
      </p>

      <BlockMath math="B_T = B_0\,e^{rT}." />

      <p>
        Running this backwards is <strong>discounting</strong>: the value today
        of a certain future amount <InlineMath math="C" /> is
      </p>

      <BlockMath math="\text{PV} = C\,e^{-rT}." />

      <h3>2. The law of one price</h3>
      <p>
        The key idea is simple: if two portfolios pay exactly the same in{" "}
        <em>every</em> future state, they must cost the same today. If they did
        not, a trader would buy the cheaper one, sell the dearer one, and pocket
        an instant, risk-free profit.
      </p>

      <p className="guide-highlight">
        Arbitrage is free money with no risk. Liquid markets erase it almost
        instantly — so we assume it does not exist. That assumption alone is
        enough to price.
      </p>

      <h3>3. A first result: put–call parity</h3>
      <p>
        From the previous lesson, a long call minus a short put (same strike{" "}
        <InlineMath math="K" />) pays exactly a forward at maturity:
      </p>

      <BlockMath math="C_T - P_T = S_T - K." />

      <p>
        Build two portfolios that both deliver this right-hand side{" "}
        <InlineMath math="S_T - K" /> at maturity:
      </p>

      <ul>
        <li>
          <strong>A:</strong> buy a call and sell a put — costs{" "}
          <InlineMath math="C_0 - P_0" /> today.
        </li>
        <li>
          <strong>B:</strong> buy one share and borrow{" "}
          <InlineMath math="K\,e^{-rT}" /> — costs{" "}
          <InlineMath math="S_0 - K\,e^{-rT}" /> today.
        </li>
      </ul>

      <p>
        At maturity portfolio B is worth <InlineMath math="S_T" /> minus the{" "}
        <InlineMath math="K" /> loan repaid, i.e. also{" "}
        <InlineMath math="S_T - K" />. Since the two portfolios pay the same in{" "}
        <em>every</em> state, their prices today must be equal:
      </p>

      <BlockMath math="C_0 - P_0 = S_0 - K\,e^{-rT}." />

      <p>
        This is <strong>put–call parity</strong>. We assumed nothing about how
        the stock behaves in the future, yet we obtained an exact price
        relationship — purely from no arbitrage.
      </p>

      <h3>Why this matters</h3>
      <p>
        Parity links the call and put prices, but does not pin either one down on
        its own. For that we need a model of how the stock moves. The simplest
        such model — where the stock can go up or down in one step — leads to
        risk-neutral pricing. That is the next lesson.
      </p>

      <GuideTryIt to="/payoff" label="Try it">
        assemble a synthetic forward in the Payoff Lab
      </GuideTryIt>
    </div>
  );
}

export default function NoArbitrageGuide() {
  const { language } = useI18n();
  return language === "hu" ? <NoArbitrageGuideHU /> : <NoArbitrageGuideEN />;
}
