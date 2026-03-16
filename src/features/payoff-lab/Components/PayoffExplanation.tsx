import SectionCard from "../../../components/SectionCard";

export default function PayoffExplanation() {
  return (
    <SectionCard
      title="Mit látsz a grafikonon?"
      subtitle="Opciós és szintetikus stratégiák vizuális értelmezése"
    >
      <div className="text-block">

        <p>
          A vízszintes tengely az alaptermék lejáratkori árát jelöli: <code>S_T</code>.
          A függőleges tengely a stratégia kifizetését (payoff) vagy profitját mutatja.
          A grafikon tehát azt mutatja meg, hogyan viselkedik a stratégia különböző
          jövőbeli árak mellett.
        </p>

        <p>
          A payoff a lejáratkori kifizetés, a profit pedig a payoff mínusz a
          kezdeti költségek (például opciós prémium). A grafikon tetején
          választható, hogy melyik nézetet szeretnéd látni.
        </p>

        <p>
          A szaggatott függőleges vonalak a fontos strike szinteket jelölik,
          vagyis azokat az árakat, ahol a stratégia viselkedése megváltozik.
        </p>

        <p>
          A „Lábak külön” opció bekapcsolásával a stratégia egyes komponensei
          külön görbéken jelennek meg, így látható, hogy az egyes eszközök
          hogyan járulnak hozzá az összesített eredményhez.
        </p>

        <h4>Long és Short pozíciók</h4>

        <p>
          A <b>long</b> pozíció azt jelenti, hogy az eszközt megvásárolod.
          A <b>short</b> pozíció ennek az ellenkezője: az eszközt eladod vagy
          eladási kötelezettséget vállalsz rá.
        </p>

        <p>
          A legtöbb stratégia valójában long és short pozíciók kombinációja.
          Például egy covered call stratégia egy long részvényből és egy
          short call opcióból áll.
        </p>

        <h4>Az eszköztípusok jelentése</h4>

        <p>
          <b>Stock:</b> az alaptermék közvetlen birtoklása. A payoff lineárisan
          nő az ár emelkedésével.
        </p>

        <p>
          <b>Call opció:</b> jogot ad arra, hogy a lejáratkor egy adott
          <code> strike </code> áron megvásárold az eszközt.
          A payoff csak a strike fölött kezd növekedni.
        </p>

        <p>
          <b>Put opció:</b> jogot ad arra, hogy a lejáratkor egy adott
          strike áron eladd az eszközt.
          A payoff a strike alatt növekszik.
        </p>

        <p>
          <b>Forward:</b> kötelezettség az eszköz megvásárlására vagy eladására
          egy rögzített áron a jövőben. A payoff lineáris, és a
          kötési ár körül metszi a nullát.
        </p>

        <p>
          <b>Cash:</b> egy egyszerű pénzpozíció kamattal.
          A cash értéke a kamatláb (<code>rate</code>) szerint nő.
        </p>

        <h4>Opció algebra</h4>

        <p>
          Sok különböző stratégia valójában ugyanazt a kifizetési alakot adja.
          Például:
        </p>

        <p>
          <code>Long Call − Short Put = Synthetic Long Forward</code>
        </p>

        <p>
          Ez azt jelenti, hogy egy call és egy put megfelelő kombinációja
          ugyanazt a payoff görbét adhatja, mint egy forward szerződés.
          A grafikon ezt automatikusan felismeri és overlay görbével jelzi.
        </p>

        <p>
          A preset stratégiák segítségével kipróbálhatod a klasszikus
          opciós konstrukciókat, például a covered call-t vagy a
          call butterfly stratégiát.
        </p>

      </div>
    </SectionCard>
  );
}