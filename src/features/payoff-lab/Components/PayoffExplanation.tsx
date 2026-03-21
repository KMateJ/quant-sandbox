import SectionCard from "../../../components/SectionCard";
import { useI18n } from "../../../i18n";

export default function PayoffExplanation() {
  const { language, t } = useI18n();

  return (
    <SectionCard
      title={t("payoffExplanationTitle")}
      subtitle={t("payoffExplanationSubtitle")}
    >
      <div className="text-block">
        {language === "hu" ? (
          <>
            <p>
              A vízszintes tengely az alaptermék lejáratkori árát jelöli: <code>S_T</code>.
              A függőleges tengely a stratégia kifizetését (payoff) vagy profitját mutatja.
              A grafikon tehát azt mutatja meg, hogyan viselkedik a stratégia különböző
              jövőbeli árak mellett.
            </p>

            <p>
              A payoff a lejáratkori kifizetés, a profit pedig a payoff mínusz a
              kezdeti költségek, például opciós prémiumok. A grafikon tetején
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

            <h4>{t("payoffExplanationHeadingPositions")}</h4>

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

            <h4>{t("payoffExplanationHeadingTypes")}</h4>

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

            <h4>{t("payoffExplanationHeadingAlgebra")}</h4>

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
          </>
        ) : (
          <>
            <p>
              The horizontal axis shows the terminal price of the underlying: <code>S_T</code>.
              The vertical axis shows the strategy payoff or profit.
              So the chart tells you how the strategy behaves under different
              future price outcomes.
            </p>

            <p>
              Payoff is the terminal cash flow, while profit is payoff minus
              initial costs, for example option premiums. At the top of the chart
              you can choose which view you want to see.
            </p>

            <p>
              The dashed vertical lines mark the important strike levels,
              meaning the prices where the shape of the strategy changes.
            </p>

            <p>
              If you enable “Show legs separately”, the individual components
              of the strategy appear on separate curves, so you can see how each
              instrument contributes to the aggregated result.
            </p>

            <h4>{t("payoffExplanationHeadingPositions")}</h4>

            <p>
              A <b>long</b> position means you buy the instrument.
              A <b>short</b> position is the opposite: you sell the instrument
              or take on an obligation related to it.
            </p>

            <p>
              Most strategies are really combinations of long and short positions.
              For example, a covered call consists of a long stock position and a
              short call option.
            </p>

            <h4>{t("payoffExplanationHeadingTypes")}</h4>

            <p>
              <b>Stock:</b> direct ownership of the underlying asset.
              The payoff increases linearly as the price rises.
            </p>

            <p>
              <b>Call option:</b> gives you the right to buy the asset at maturity
              at a given <code> strike </code> price.
              The payoff only starts increasing above the strike.
            </p>

            <p>
              <b>Put option:</b> gives you the right to sell the asset at maturity
              at a given strike price.
              The payoff increases below the strike.
            </p>

            <p>
              <b>Forward:</b> an obligation to buy or sell the asset
              at a fixed future price. The payoff is linear and crosses zero
              around the contract price.
            </p>

            <p>
              <b>Cash:</b> a simple cash position with interest.
              The value of cash grows according to the interest rate (<code>rate</code>).
            </p>

            <h4>{t("payoffExplanationHeadingAlgebra")}</h4>

            <p>
              Many different strategies actually produce the same payoff shape.
              For example:
            </p>

            <p>
              <code>Long Call − Short Put = Synthetic Long Forward</code>
            </p>

            <p>
              This means that a suitable combination of a call and a put
              can generate the same payoff curve as a forward contract.
              The chart detects this automatically and shows it as an overlay.
            </p>

            <p>
              With the preset strategies, you can try classic option structures
              such as the covered call or the call butterfly.
            </p>
          </>
        )}
      </div>
    </SectionCard>
  );
}