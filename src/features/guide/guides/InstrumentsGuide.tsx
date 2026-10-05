import { BlockMath, InlineMath } from "react-katex";
import { useI18n } from "../../../i18n";
import GuideTryIt from "../components/GuideTryIt";

function InstrumentsGuideHU() {
  return (
    <div className="guide-content">
      <p>
        Mielőtt bármit is áraznánk, tisztázni kell, hogy pontosan{" "}
        <strong>mit is árazunk</strong>. A derivatíva egy szerződés, amelynek a
        kifizetése egy másik dolog – itt egy részvény – árától függ. A legelső
        kérdés nem az, hogy mennyit ér ma, hanem az, hogy{" "}
        <strong>mennyit fizet lejáratkor</strong>.
      </p>

      <p>
        Egyetlen lejárati időpontban gondolkodunk. Nem számít, milyen utat járt
        be az árfolyam odáig; csak az, hogy a lejárat pillanatában mennyi a
        részvény ára. Jelölje ezt <InlineMath math="S_T" />. Ekkor a kifizetés
        egy függvény:
      </p>

      <BlockMath math="X = f(S_T)" />

      <p>
        Az egész derivatívaelmélet célja, hogy ehhez a jövőbeli{" "}
        <InlineMath math="X" />-hez egy mai árat rendeljen. Előbb nézzük meg a
        három alapvető kifizetést.
      </p>

      <h3>1. Európai call opció</h3>
      <p>
        A call <em>jogot</em> ad arra, hogy lejáratkor megvedd a részvényt egy
        előre rögzített <strong>kötési áron</strong> (<InlineMath math="K" />).
        Ha a részvény többet ér, élsz a joggal és nyersz{" "}
        <InlineMath math="S_T - K" />-t; ha kevesebbet, nem élsz vele, és a
        kifizetés nulla:
      </p>

      <BlockMath math="X_{\text{call}} = (S_T - K)^+" />

      <p>
        A <InlineMath math="x^+ = \max(x, 0)" /> jelölés rögzíti, hogy a
        kifizetés sosem negatív – egy jogot nem vagy köteles használni.
      </p>

      <h3>2. Európai put opció</h3>
      <p>
        A put a tükörkép: jogot ad az <em>eladásra</em> a kötési áron. Akkor ér
        sokat, ha a részvény leesik:
      </p>

      <BlockMath math="X_{\text{put}} = (K - S_T)^+" />

      <h3>3. Forward</h3>
      <p>
        A forward nem jog, hanem <strong>kötelezettség</strong>: lejáratkor
        kötelezően megveszed a részvényt <InlineMath math="K" />-ért. Nincs
        választás, ezért a kifizetés lineáris és negatív is lehet:
      </p>

      <BlockMath math="X_{\text{forward}} = S_T - K" />

      <h3>Mi a lényeg?</h3>
      <p>
        Figyeld meg a formák különbségét: a call és a put{" "}
        <strong>töréspontos</strong> (van egy könyök a strike-nál), a forward
        pedig <strong>egyenes</strong>. Ez a különbség lesz később a kulcs: a
        töréspont teszi az opciót igazán érdekessé, és emiatt kell majd
        dinamikusan fedezni.
      </p>

      <p>
        Egy fontos építőkő, amit érdemes már most észrevenni: egy{" "}
        <strong>vett call</strong> és egy <strong>eladott put</strong> ugyanazzal
        a strike-kal együtt pontosan egy forward kifizetését adja –
      </p>

      <BlockMath math="(S_T - K)^+ - (K - S_T)^+ = S_T - K." />

      <p className="guide-highlight">
        Ha tudjuk, mit fizet egy eszköz lejáratkor, jön a következő nagy kérdés:
        mennyit ér ez ma? Erre a „nincs arbitrázs” elve ad választ.
      </p>

      <GuideTryIt to="/payoff" label="Próbáld ki">
        rajzold meg ezeket a kifizetéseket a Payoff Lab-ban
      </GuideTryIt>
    </div>
  );
}


function InstrumentsGuideEN() {
  return (
    <div className="guide-content">
      <p>
        Before we can price anything, we need to be precise about{" "}
        <strong>what we are pricing</strong>. A derivative is a contract whose
        payoff depends on something else — here, a stock. The very first
        question is not what it is worth today, but{" "}
        <strong>what it pays at maturity</strong>.
      </p>

      <p>
        We think in terms of a single maturity date. The path the stock took to
        get there does not matter yet; only its price at maturity does. Call that{" "}
        <InlineMath math="S_T" />. Then the payoff is a function:
      </p>

      <BlockMath math="X = f(S_T)" />

      <p>
        The whole goal of derivative pricing is to attach a value <em>today</em>{" "}
        to this future <InlineMath math="X" />. First, the three building-block
        payoffs.
      </p>

      <h3>1. European call option</h3>
      <p>
        A call gives you the <em>right</em> to buy the stock at maturity for a
        fixed <strong>strike price</strong> (<InlineMath math="K" />). If the
        stock is worth more, you exercise and gain <InlineMath math="S_T - K" />;
        if it is worth less, you walk away and the payoff is zero:
      </p>

      <BlockMath math="X_{\text{call}} = (S_T - K)^+" />

      <p>
        The notation <InlineMath math="x^+ = \max(x, 0)" /> captures that the
        payoff is never negative — you are never forced to use a right.
      </p>

      <h3>2. European put option</h3>
      <p>
        A put is the mirror image: the right to <em>sell</em> at the strike. It
        becomes valuable when the stock falls:
      </p>

      <BlockMath math="X_{\text{put}} = (K - S_T)^+" />

      <h3>3. Forward</h3>
      <p>
        A forward is not a right but an <strong>obligation</strong>: at maturity
        you must buy the stock for <InlineMath math="K" />. There is no choice,
        so the payoff is linear and can be negative:
      </p>

      <BlockMath math="X_{\text{forward}} = S_T - K" />

      <h3>Why this matters</h3>
      <p>
        Notice the difference in shape: the call and put are{" "}
        <strong>kinked</strong> (there is an elbow at the strike), while the
        forward is a <strong>straight line</strong>. That difference is the key
        to everything later: the kink is what makes an option interesting, and
        what will force us to hedge it dynamically.
      </p>

      <p>
        One building block worth noticing already: a <strong>long call</strong>{" "}
        and a <strong>short put</strong> at the same strike together reproduce a
        forward payoff —
      </p>

      <BlockMath math="(S_T - K)^+ - (K - S_T)^+ = S_T - K." />

      <p className="guide-highlight">
        Once we know what an instrument pays at maturity, the next big question
        is: what is that worth today? The principle of no arbitrage answers it.
      </p>

      <GuideTryIt to="/payoff" label="Try it">
        draw these payoffs yourself in the Payoff Lab
      </GuideTryIt>
    </div>
  );
}


export default function InstrumentsGuide() {
  const { language } = useI18n();
  return language === "hu" ? <InstrumentsGuideHU /> : <InstrumentsGuideEN />;
}