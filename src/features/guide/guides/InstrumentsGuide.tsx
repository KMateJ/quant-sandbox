import { BlockMath, InlineMath } from "react-katex";
import { useI18n } from "../../../i18n";
import GuideLink from "../components/GuideLink";

function InstrumentsGuideHU() {
  return (
    <div className="guide-content">
      <p>
        Ez az útmutató azt a kérdést válaszolja meg, hogy pontosan{" "}
        <strong>milyen pénzügyi objektumokat</strong> nézünk az oldalon, és mit
        jelent az, hogy egy eszköz kifizetése a részvényár lejáratkori értékétől
        függ.
      </p>

      <p>
        A kiindulópont a <strong>Payoff Lab</strong>. Ott egy lejárati
        időpontban gondolkodunk. Nem az érdekel minket, hogy az árfolyam addig
        milyen utat járt be, hanem az, hogy a <strong>lejárat pillanatában</strong>{" "}
        mennyi a részvény ára, és ebből milyen kifizetés következik.
      </p>

      <p>
        Jelölje <InlineMath math="S_T" /> a részvény árát lejáratkor. Ekkor egy
        derivatíva kifizetése egy függvény:
      </p>

      <BlockMath math={"X = f(S_T)"} />

      <p>A legfontosabb példák, amikkel indulunk:</p>

      <h3>1. Európai call opció</h3>
      <p>
        A call azt adja meg, hogy lejáratkor jogod van megvenni a részvényt egy
        előre rögzített <strong>kötési áron</strong>, amit általában{" "}
        <InlineMath math="K" /> jelöl.
      </p>

      <BlockMath math={"X_{\\mathrm{call}} = (S_T - K)^+"} />

      <p>
        Itt a <InlineMath math={"x^+ = \\max(x,0)"} /> jelölést
        használjuk. Ez azt jelenti, hogy ha a részvényár nagyobb, mint a
        strike, akkor a call értékes, ha nem, akkor a kifizetés nulla.
      </p>

      <p>
        Nézd meg rögtön a saját oldaladon egy előre beállított példán:{" "}
        <GuideLink to="/payoff?preset=long-call">
          long call preset megnyitása
        </GuideLink>
        .
      </p>

      <h3>2. Európai put opció</h3>
      <p>
        A put ennek a tükörképe: jogod van eladni a részvényt a strike áron.
      </p>

      <BlockMath math={"X_{\\mathrm{put}} = (K - S_T)^+"} />

      <p>Ez akkor ér sokat, ha a részvény árfolyama leesik.</p>

      <p>
        Ehhez:{" "}
        <GuideLink to="/payoff?preset=long-put">
          long put preset megnyitása
        </GuideLink>
        .
      </p>

      <h3>3. Forward</h3>
      <p>
        A forward nem opció, hanem kötelezettség. Lejáratkor a kifizetés
        lineáris:
      </p>

      <BlockMath math={"X_{\\mathrm{forward}} = S_T - K"} />

      <p>
        Ez azért fontos, mert sok összetettebb stratégia végül ugyanilyen
        lineáris alakot ad. A Payoff Lab egyik legjobb része pont az, hogy ezt
        vizuálisan meg tudod nézni.
      </p>

      <p>
        A te oldaladon ehhez a legjobb kiindulópont most a{" "}
        <GuideLink to="/payoff?preset=synthetic-long-forward">
          synthetic long forward
        </GuideLink>
        , mert rögtön látszik, hogy egy call és egy put együtt hogyan ad ki egy
        forward-szerű profilt. Ezt a rendszered automatikusan felismeri is.
      </p>

      <h3>Mit jelent az, hogy európai?</h3>
      <p>
        Azt, hogy most csak a <strong>lejárati időpont</strong> érdekel. Nem
        foglalkozunk azzal, hogy közben mikor lehet lehívni, csak a végső
        állapottal.
      </p>

      <h3>Miért payoff-pal kezdünk?</h3>
      <p>
        Azért, mert a payoff a legősibb objektum az egész opcióárazásban.
        Mielőtt árat számolnánk, deltat fedeznénk vagy kockázatsemleges
        mértékről beszélnénk, először meg kell érteni:
      </p>

      <ul>
        <li>mi az eszköz lejáratkori kifizetése,</li>
        <li>mikor keres pénzt,</li>
        <li>mikor veszít pénzt,</li>
        <li>hogyan változik a részvényár függvényében.</li>
      </ul>

      <h3>Mit érdemes most kipróbálni?</h3>
      <ul>
        <li>
          <GuideLink to="/payoff?preset=long-call">Long call</GuideLink>
        </li>
        <li>
          <GuideLink to="/payoff?preset=long-put">Long put</GuideLink>
        </li>
        <li>
          <GuideLink to="/payoff?preset=long-stock">Long stock</GuideLink>
        </li>
        <li>
          <GuideLink to="/payoff?preset=synthetic-long-forward">
            Synthetic long forward
          </GuideLink>
        </li>
      </ul>

      <p>
        Külön figyeld meg, hogy a call és a put <strong>töréspontos</strong>,
        míg a forward <strong>lineáris</strong>. Ez később kulcsfontosságú lesz,
        amikor replikáló portfóliókról és hedge-ről beszélünk.
      </p>

      <p className="guide-highlight">
        Ha már tudod, hogy egy eszköz mit fizet lejáratkor, a következő nagy
        kérdés az lesz: mennyit ér ez ma?
      </p>

      <p>
        Erre vezet majd rá a következő útmutató a kockázatsemleges mértékről.
      </p>
    </div>
  );
}

function InstrumentsGuideEN() {
  return (
    <div className="guide-content">
      <p>
        This guide answers a basic question:{" "}
        <strong>what financial objects</strong> are we actually studying on the
        site, and what does it mean to say that a derivative payoff depends on
        the stock price at maturity?
      </p>

      <p>
        The natural starting point is the <strong>Payoff Lab</strong>. There we
        think in terms of a terminal date. We do not care yet about the full
        path of the stock before maturity. We care about the{" "}
        <strong>stock price at maturity</strong>, and how the payoff depends on
        it.
      </p>

      <p>
        Let <InlineMath math="S_T" /> denote the stock price at maturity. Then a
        derivative payoff is a function
      </p>

      <BlockMath math={"X = f(S_T)"} />

      <p>The main examples are the following:</p>

      <h3>1. European call option</h3>
      <p>
        A call gives you the right, at maturity, to buy the stock at a fixed
        <strong> strike price</strong>, usually denoted by{" "}
        <InlineMath math="K" />.
      </p>

      <BlockMath math={"X_{\\mathrm{call}} = (S_T - K)^+"} />

      <p>
        Here <InlineMath math={"x^+ = \\max(x,0)"} /> means that the
        payoff is positive only when the stock ends above the strike.
      </p>

      <p>
        Try it directly on your site:{" "}
        <GuideLink to="/payoff?preset=long-call">
          open the long call preset
        </GuideLink>
        .
      </p>

      <h3>2. European put option</h3>
      <p>
        A put is the mirror image: it gives you the right to sell at the strike.
      </p>

      <BlockMath math={"X_{\\mathrm{put}} = (K - S_T)^+"} />

      <p>So the put becomes valuable when the stock price falls.</p>

      <p>
        See:{" "}
        <GuideLink to="/payoff?preset=long-put">
          open the long put preset
        </GuideLink>
        .
      </p>

      <h3>3. Forward</h3>
      <p>
        A forward is not an option but an obligation. Its terminal payoff is
        linear:
      </p>

      <BlockMath math={"X_{\\mathrm{forward}} = S_T - K"} />

      <p>
        This matters because many more complicated strategies eventually
        collapse into this same linear shape.
      </p>

      <p>
        On your site, the best shortcut is{" "}
        <GuideLink to="/payoff?preset=synthetic-long-forward">
          synthetic long forward
        </GuideLink>
        , where you can already see how a call and a put combine into a
        forward-like profile. Your current logic also detects this automatically.
      </p>

      <h3>What does “European” mean here?</h3>
      <p>
        It means that we only focus on the <strong>maturity date</strong>. We
        are not yet discussing early exercise. We only care about the final
        payoff.
      </p>

      <h3>Why start with payoff?</h3>
      <p>
        Because payoff is the most primitive object in option pricing. Before we
        compute prices, talk about delta hedging, or introduce the risk-neutral
        measure, we first need to understand:
      </p>

      <ul>
        <li>what the instrument pays at maturity,</li>
        <li>when it makes money,</li>
        <li>when it loses money,</li>
        <li>how it depends on the stock price.</li>
      </ul>

      <h3>What should you try now?</h3>
      <ul>
        <li>
          <GuideLink to="/payoff?preset=long-call">Long call</GuideLink>
        </li>
        <li>
          <GuideLink to="/payoff?preset=long-put">Long put</GuideLink>
        </li>
        <li>
          <GuideLink to="/payoff?preset=long-stock">Long stock</GuideLink>
        </li>
        <li>
          <GuideLink to="/payoff?preset=synthetic-long-forward">
            Synthetic long forward
          </GuideLink>
        </li>
      </ul>

      <p>
        Notice that calls and puts are <strong>kinked</strong>, while the
        forward is <strong>linear</strong>. This will matter later when we talk
        about replication and hedging.
      </p>

      <p className="guide-highlight">
        Once you know what something pays at maturity, the next big question is:
        what is that payoff worth today?
      </p>

      <p>
        That leads naturally to the next tutorial on the risk-neutral measure.
      </p>
    </div>
  );
}

export default function InstrumentsGuide() {
  const { language } = useI18n();
  return language === "hu" ? <InstrumentsGuideHU /> : <InstrumentsGuideEN />;
}