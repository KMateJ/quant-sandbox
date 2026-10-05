import { BlockMath, InlineMath } from "react-katex";
import { useI18n } from "../../../i18n";
import GuideTryIt from "../components/GuideTryIt";

function TowardBlackScholesGuideHU() {
  return (
    <div className="guide-content">
      <p>
        Eddig egyetlen lépésben gondolkodtunk: a részvény felmegy vagy lemegy.
        A valóságban az ár folyamatosan mozog. A híd a kettő között egyszerű:{" "}
        <strong>sok apró lépés</strong>.
      </p>

      <h3>1. Egy lépésből sok lépés</h3>
      <p>
        Osszuk a <InlineMath math="T" /> időt <InlineMath math="n" /> kis
        szakaszra. Minden szakaszon a részvény egy picit megy fel vagy le, és
        minden csomópontban ugyanazt a kockázatsemleges árazást alkalmazzuk, mint
        az egylépéses fában. Ez a <strong>binomiális fa</strong>.
      </p>

      <p>
        Ahogy <InlineMath math="n \to \infty" /> és a lépések egyre finomabbak
        lesznek, a részvénypálya egy folytonos véletlen görbévé simul.
      </p>

      <h3>2. A határeset: geometriai Brown-mozgás</h3>
      <p>
        A finomodó binomiális fa határesete a{" "}
        <strong>geometriai Brown-mozgás</strong> (GBM). Ebben a hozamok apró,
        független, normális eloszlású lökésekből állnak, és az ár sosem negatív:
      </p>

      <BlockMath math="dS_t = \mu S_t\,dt + \sigma S_t\,dW_t." />

      <p>
        Itt <InlineMath math="\sigma" /> a <strong>volatilitás</strong> – a
        lökések nagysága –, <InlineMath math="W_t" /> pedig a véletlent hordozó
        Brown-mozgás. Ugyanaz a kettősség, mint az egylépéses modellben:{" "}
        <InlineMath math="u" /> és <InlineMath math="d" /> helyett most{" "}
        <InlineMath math="\sigma" /> méri, mennyire szór szét a jövő.
      </p>

      <h3>3. Árazás a folytonos időben</h3>
      <p>
        A logika változatlan. Kockázatsemleges mérték alatt a részvény
        várható hozama a kockázatmentes <InlineMath math="r" />, és a derivatíva
        ára a diszkontált várható kifizetés:
      </p>

      <BlockMath math="V_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}\!\left[(S_T - K)^+\right]." />

      <p>
        Ezt a várható értéket a GBM esetén zárt alakban ki lehet számolni. Az
        eredmény a <strong>Black–Scholes-képlet</strong>:
      </p>

      <BlockMath math="C = S_0\,N(d_1) - K e^{-rT} N(d_2)," />

      <BlockMath math="d_{1,2} = \frac{\ln(S_0/K) + (r \pm \tfrac{1}{2}\sigma^2)T}{\sigma\sqrt{T}}." />

      <p>
        Itt <InlineMath math="N" /> a standard normális eloszlásfüggvény. A
        képlet ijesztőnek tűnhet, de minden darabja ismerős: diszkontálás,
        strike, volatilitás és idő.
      </p>

      <h3>4. A delta is folytonossá válik</h3>
      <p>
        Az előző leckéből a delta a két állapot különbségi hányadosa volt. A
        határesetben ez pontosan deriválttá válik, és a call deltája egyszerű
        alakot ölt:
      </p>

      <BlockMath math="\Delta = \frac{\partial C}{\partial S_0} = N(d_1)." />

      <p>
        A folytonos delta hedge ugyanaz, mint korábban, csak most{" "}
        <em>folyamatosan</em> újrasúlyozunk: mindig <InlineMath math="N(d_1)" />{" "}
        részvényt tartunk a call ellenében.
      </p>

      <p className="guide-highlight">
        A Black–Scholes-modell nem új ötlet, hanem a már ismert kettő – a
        kockázatsemleges árazás és a delta hedge – folytonos idejű határesete.
        Innen nyílik meg a görögök, a volatilitás és a sztochasztikus modellek
        világa.
      </p>

      <GuideTryIt to="/black-scholes" label="Próbáld ki">
        mozgasd a volatilitást és figyeld az árat és a deltát a Black–Scholes
        eszközben
      </GuideTryIt>
    </div>
  );
}

function TowardBlackScholesGuideEN() {
  return (
    <div className="guide-content">
      <p>
        So far we thought in a single step: the stock goes up or down. In
        reality the price moves all the time. The bridge between the two is
        simple: <strong>many small steps</strong>.
      </p>

      <h3>1. From one step to many</h3>
      <p>
        Split the time <InlineMath math="T" /> into <InlineMath math="n" /> small
        intervals. On each one the stock moves up or down a little, and at every
        node we apply the same risk-neutral pricing as in the one-step tree. This
        is the <strong>binomial tree</strong>.
      </p>

      <p>
        As <InlineMath math="n \to \infty" /> and the steps get finer, the stock
        path smooths into a continuous random curve.
      </p>

      <h3>2. The limit: geometric Brownian motion</h3>
      <p>
        The limit of the refining binomial tree is{" "}
        <strong>geometric Brownian motion</strong> (GBM). Returns are built from
        tiny, independent, normally distributed shocks, and the price never goes
        negative:
      </p>

      <BlockMath math="dS_t = \mu S_t\,dt + \sigma S_t\,dW_t." />

      <p>
        Here <InlineMath math="\sigma" /> is the <strong>volatility</strong> —
        the size of the shocks — and <InlineMath math="W_t" /> is the Brownian
        motion carrying the randomness. It is the same duality as in the one-step
        model: instead of <InlineMath math="u" /> and <InlineMath math="d" />,{" "}
        <InlineMath math="\sigma" /> now measures how widely the future spreads
        out.
      </p>

      <h3>3. Pricing in continuous time</h3>
      <p>
        The logic is unchanged. Under the risk-neutral measure the stock's
        expected return is the risk-free rate <InlineMath math="r" />, and the
        derivative price is the discounted expected payoff:
      </p>

      <BlockMath math="V_0 = e^{-rT}\,\mathbb{E}^{\mathbb{Q}}\!\left[(S_T - K)^+\right]." />

      <p>
        For GBM this expectation can be computed in closed form. The result is
        the <strong>Black–Scholes formula</strong>:
      </p>

      <BlockMath math="C = S_0\,N(d_1) - K e^{-rT} N(d_2)," />

      <BlockMath math="d_{1,2} = \frac{\ln(S_0/K) + (r \pm \tfrac{1}{2}\sigma^2)T}{\sigma\sqrt{T}}." />

      <p>
        Here <InlineMath math="N" /> is the standard normal distribution
        function. The formula can look intimidating, but every piece is familiar:
        discounting, strike, volatility and time.
      </p>

      <h3>4. Delta becomes continuous too</h3>
      <p>
        In the previous lesson delta was a two-state difference quotient. In the
        limit it becomes exactly a derivative, and the call's delta takes a clean
        form:
      </p>

      <BlockMath math="\Delta = \frac{\partial C}{\partial S_0} = N(d_1)." />

      <p>
        Continuous delta hedging is the same idea as before, but now we rebalance{" "}
        <em>continuously</em>: we always hold <InlineMath math="N(d_1)" /> shares
        against the call.
      </p>

      <p className="guide-highlight">
        Black–Scholes is not a new idea but the continuous-time limit of the two
        we already know — risk-neutral pricing and delta hedging. From here the
        world of the Greeks, volatility and stochastic models opens up.
      </p>

      <GuideTryIt to="/black-scholes" label="Try it">
        move the volatility and watch the price and delta in the Black–Scholes
        tool
      </GuideTryIt>
    </div>
  );
}

export default function TowardBlackScholesGuide() {
  const { language } = useI18n();
  return language === "hu" ? (
    <TowardBlackScholesGuideHU />
  ) : (
    <TowardBlackScholesGuideEN />
  );
}
