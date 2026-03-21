import SectionCard from "../../../components/SectionCard";
import { useI18n } from "../../../i18n";

export default function HestonExplanation() {
  const { language } = useI18n();
  const isHu = language === "hu";

  return (
    <SectionCard
      title={isHu ? "Intuíció és értelmezés" : "Intuition and interpretation"}
      subtitle={
        isHu
          ? "Mit mond a Heston modell, és hogyan látszik ez a grafikonokon?"
          : "What does the Heston model say, and how does it appear in the charts?"
      }
    >
      <div className="text-block">
        {isHu ? (
          <>
            <p>
              A Heston modell megértésének legjobb kiindulópontja az, hogy a
              Black–Scholes világában a volatilitás egyetlen szám. Kiválasztunk
              egy σ értéket, és onnantól azt úgy kezeljük, mintha a teljes
              modell során változatlan maradna. Ez matematikailag nagyon szép,
              de gazdasági szempontból túl merev. A valós piacon a bizonytalanság
              nem állandó háttérzaj, hanem maga is mozog, időnként nyugodt,
              időnként ideges, néha hirtelen felrobban, majd lassan
              visszacsillapodik. A Heston modell ezt az egyszerű, de nagyon
              fontos megfigyelést emeli be a matematikába.
            </p>

            <p>
              A modell két folyamatot ír le egyszerre. Az egyik az árfolyam
              mozgása, a másik a variancia mozgása. Az árfolyam egyenlete így
              néz ki:
            </p>

            <pre>
{`dS = μ S dt + √v S dW₁`}
            </pre>

            <p>
              A második egyenlet pedig azt mondja meg, hogyan viselkedik maga a
              variancia:
            </p>

            <pre>
{`dv = κ(θ − v) dt + ξ √v dW₂`}
            </pre>

            <p>
              Az első egyenletben érdemes megfigyelni, hogy már nem egy konstans
              σ szerepel, hanem a √v. Ez azt jelenti, hogy az árfolyam
              pillanatnyi szórása attól függ, hogy éppen mekkora a variancia.
              Ha v magas, akkor az árfolyam is idegesebben mozog. Ha v alacsony,
              akkor a pályák kisimulnak. Vagyis a Heston modellben az
              árfolyammozgás intenzitása nem előre rögzített, hanem együtt él a
              modellel.
            </p>

            <p>
              A második egyenlet még fontosabb intuíciót hordoz. A{" "}
              <strong>κ(θ − v)</strong> tag egy visszahúzó erő. Ha a variancia a
              hosszú távú átlag, vagyis θ fölé emelkedik, akkor ez a tag lefelé
              húzza vissza. Ha túl alacsonyra esik, akkor felfelé húzza. Ez a
              mean reversion, vagyis középhez való visszatérés gondolata. Ezt
              úgy lehet elképzelni, mintha a piacnak lenne egy “természetes”
              nyugalmi szintje. Néha ettől nagyon eltávolodik, például pánikban
              vagy eufóriában, de tartósan ritkán marad teljesen elszakadva
              tőle.
            </p>

            <p>
              Ha a variance paths grafikonra nézel, tulajdonképpen ezt a
              visszahúzó mechanizmust látod. A pályák nem egyszerűen szabadon
              sodródnak, hanem folyamatosan próbálnak a θ környékére visszatérni.
              Ha a θ-t emeled, az olyan, mintha a rendszer új “normál”
              volatilitási szintjét magasabbra tennéd. Ilyenkor a variance paths
              pályák jellemzően magasabb régióban mozognak, és az egész modell
              feszesebb, zajosabb piaci környezetet sugall. A price charton ez
              általában magasabb opciós árakban jelenik meg, a smile charton
              pedig magasabb implied vol szintként.
            </p>

            <p>
              A κ, vagyis a mean reversion sebessége azt szabályozza, mennyire
              erős ez a visszahúzó erő. Ha κ kicsi, a variancia sokáig el tud
              kóborolni a hosszú távú átlagtól. Ha egyszer felugrik, lassan jön
              vissza; ha leesik, lassan emelkedik fel. Ez a variance paths
              grafikonon úgy látszik, hogy a pályák lustábban, elnyújtottabban
              mozognak. Ha viszont κ nagy, akkor a variancia minden eltérés után
              gyorsan visszatér a θ szintre. Ilyenkor a pályák kevésbé
              “csatangolnak el”, és az egész rendszer fegyelmezettebbnek tűnik.
              Jó mentális kép erre egy rugó: kis κ esetén a rugó laza, nagy κ
              esetén feszes.
            </p>

            <p>
              A ξ paramétert gyakran vol-of-vol néven emlegetik, és ez valóban a
              “volatilitás volatilitása”. Ez elsőre absztraktnak hangzik, de
              vizuálisan nagyon könnyű megérteni. A ξ azt mondja meg, mennyire
              rángatja a véletlen zaj magát a varianciát. Ha ξ kicsi, akkor a
              variance paths szép, simább görbéket mutat, és a rendszer inkább
              egy lassan hullámzó volatilitási rezsimként viselkedik. Ha ξ nagy,
              akkor a volatilitás maga is nagyon ideges lesz: hirtelen tüskék,
              nagy ugrások, vadabb mozgás jelenik meg. Ez az árfolyamon is
              nyomot hagy, mert időnként hirtelen kitágul a bizonytalanság
              tartománya. Az implied vol smile görbülete gyakran éppen emiatt
              erősödik: a jövőbeli volatilitás nemcsak bizonytalan, hanem maga a
              bizonytalanság is erősen ingadozik.
            </p>

            <p>
              A ρ paraméter az egyik legérdekesebb része a modellnek, mert ez
              kapcsolja össze az árfolyam- és variancia-sokkokat. Matematikailag
              azt mondja meg, mennyire korrelál a két Wiener-folyamat. Pénzügyi
              intuíció szempontjából viszont ennél beszédesebb úgy fogalmazni,
              hogy mit történik a volatilitással, amikor az árfolyam rossz vagy
              jó hírt kap. Ha ρ negatív, akkor a lefelé irányuló ármozgásokhoz
              gyakran emelkedő volatilitás társul. Ez nagyon ismerős viselkedés
              részvénypiacokon: amikor az ár esik, a piac megijed, és a jövőre
              vonatkozó bizonytalanság megnő. A smile charton ez tipikusan skew
              formájában látszik, vagyis az alacsonyabb strike-okhoz magasabb
              implied vol tartozik. Ha a ρ-t közel nullára állítod, ez az
              aszimmetria gyengül. Ha pedig pozitív irányba viszed, akkor egy
              egészen más világot modellezel, ahol a jó hírekhez is növekvő
              volatilitás társulhat.
            </p>

            <p>
              Érdemes külön megfigyelni, hogy a Heston modell miért tud olyan
              jelenségeket leírni, amelyeket a Black–Scholes nem. A
              Black–Scholes-ban ugyanaz az egyetlen σ érvényes minden strike-ra
              és minden pillanatra, ezért ott az implied vol felület alapvetően
              lapos. A Heston-ban viszont a jövőbeli volatilitás útvonala maga is
              bizonytalan. Ez azt jelenti, hogy két különböző strike opció
              érzékenysége más lesz arra, hogy a jövőben milyen volatilitási
              rezsimek következhetnek be. Pont ebből a mechanizmusból születik
              meg a smile vagy a skew. Vagyis a görbe nem valami “ráerőltetett”
              extra effekt, hanem annak a következménye, hogy a modell komolyabban
              veszi a volatilitás dinamikáját.
            </p>

            <p>
              A BS vs Heston price chartot is így érdemes olvasni. Nem pusztán
              arról van szó, hogy két külön képlet más számot ad. A különbség
              mögött az a gondolat áll, hogy a Heston modell egy egész
              eloszlást rendel a jövőbeli volatilitási pályákhoz. Emiatt az
              opció értéke nemcsak az aktuális vol szintjétől függ, hanem attól
              is, hogy a jövőben mennyi esély van nyugodt vagy turbulens
              szakaszokra. Amikor a két görbe eltér egymástól, azt úgy is lehet
              olvasni, hogy a Heston modell másképp árazza a jövőbeli bizonytalanság
              szerkezetét.
            </p>

            <p>
              A modellben a kezdeti variancia, vagyis v₀ szintén nagyon fontos.
              Ez mondja meg, hogy honnan indul a rendszer. Rövid lejáratoknál
              különösen nagy szerepe van, mert ha kevés idő marad lejáratig,
              akkor a kezdeti állapot nagyon erősen meghatározza a várható
              viselkedést. Ha v₀ magas, akkor rövid távon is azonnal érezhetően
              “forróbb” a modell. Ha v₀ alacsony, de θ magas, akkor egy
              érdekes helyzet jön létre: jelenleg nyugodt a piac, de a modell
              szerint hosszabb távon egy magasabb vol szint felé húz a rendszer.
              Ezért a rövid és hosszú lejáratok eltérően reagálhatnak ugyanarra a
              paraméterbeállításra.
            </p>

            <p>
              A Feller-feltétel, vagyis a <strong>2κθ ≥ ξ²</strong>, technikai
              részletnek tűnhet, de van mögötte intuíció. A bal oldal a
              visszahúzó erő és a hosszú távú szint közös “stabilizáló”
              hatását jelenti, míg a jobb oldal a zaj erősségének négyzete.
              Ha a zaj túl erős a stabilizáló mechanizmushoz képest, akkor a
              variancia könnyebben kerül nagyon közel a nullához. Ez nem azt
              jelenti, hogy a modell használhatatlan, de numerikusan és
              intuitívan már egy sokkal instabilabb tartományba lépsz át. Olyan,
              mintha a rendszerben a kontroll már majdnem elveszne a zajjal
              szemben.
            </p>

            <p>
              Ha játszani akarsz a paraméterekkel, érdemes történetekben
              gondolkodni, nem csak számokban. Egy magas κ és alacsony ξ olyan
              piacot idéz, ahol a volatilitás kileng ugyan, de gyorsan
              lenyugszik, és összességében rendezett marad. Egy alacsony κ és
              magas ξ már inkább olyan világot fest, ahol a volatilitási sokkok
              tartósabban velünk maradnak, és a bizonytalanság önmagát is
              felerősítheti. Egy erősen negatív ρ olyan piacot mutat, ahol az
              esésekhez félelem társul, ezért a downside kockázat különösen
              drága lesz az opciókban. Ha mindehhez magas θ társul, akkor már nem
              csak epizodikus pánikokról beszélünk, hanem egy eleve feszült
              alapállapotról.
            </p>

            <p>
              Az interaktív grafikonokat ezért nem pusztán numerikus outputként
              érdemes nézni. A stock paths megmutatja, hogyan él együtt az
              árfolyam a változó volatilitással. A variance paths feltárja a
              modell belső motorját. A price chart azt mutatja meg, hogyan
              fordítódik le ez a dinamika opciós árakra. A smile pedig azt,
              hogyan jelenik meg mindez a piacon megszokott implied vol nyelvén.
              Ha a négy ábrát együtt figyeled, akkor a Heston modell nem egy
              bonyolult képletnek tűnik, hanem egy történetnek arról, hogy a
              piaci bizonytalanság maga is változó, visszatérő és sokszor az
              árfolyamesésekkel együtt erősödő jelenség.
            </p>

            <p>
              Röviden: a Black–Scholes azt feltételezi, hogy a kockázati háttér
              állandó, a Heston pedig azt mondja, hogy maga a kockázati háttér is
              él. Pont ezért alkalmasabb arra, hogy a valós piaci smile és skew
              jelenségeket legalább részben megmagyarázza.
            </p>
          </>
        ) : (
          <>
            <p>
              The best starting point for understanding the Heston model is to
              compare it with the Black–Scholes world. In Black–Scholes,
              volatility is just a single number. Once a value for σ is chosen,
              it remains fixed throughout the model. This is mathematically
              elegant, but economically too rigid. In real markets, uncertainty
              is not a constant background level. Sometimes markets are calm,
              sometimes nervous, sometimes volatility spikes suddenly and then
              slowly decays. The Heston model brings this simple but crucial
              observation into the mathematics.
            </p>

            <p>
              The model describes two processes at the same time. One is the
              stock price, the other is the variance. The stock price equation
              is
            </p>

            <pre>
{`dS = μ S dt + √v S dW₁`}
            </pre>

            <p>
              while the variance evolves according to
            </p>

            <pre>
{`dv = κ(θ − v) dt + ξ √v dW₂`}
            </pre>

            <p>
              In the first equation, the important detail is that volatility is
              no longer a constant σ, but the square root of a stochastic
              variance process. This means that the intensity of price movement
              depends on the current state of variance. When v is high, the
              stock path becomes more erratic. When v is low, the path becomes
              smoother. In other words, the uncertainty attached to the stock is
              not fixed in advance, but evolves over time.
            </p>

            <p>
              The second equation contains the core intuition of the model. The
              term <strong>κ(θ − v)</strong> is a pull-back mechanism. If
              variance rises above its long-run level θ, this term pulls it
              downward. If variance falls too low, it pushes it upward. This is
              the idea of mean reversion. A useful picture is to think of the
              market as having a typical “normal” volatility level. It can move
              away from that level for a while, but tends not to drift away
              forever.
            </p>

            <p>
              This is exactly what you see in the variance paths chart. The
              paths do not simply wander freely. They fluctuate, but they keep
              being drawn back toward θ. If you increase θ, you are effectively
              moving the model’s normal volatility regime upward. The whole
              system becomes more tense, and both option prices and implied
              volatilities usually shift higher as well.
            </p>

            <p>
              The parameter κ controls how quickly this reversion happens. Small
              κ means variance can stay away from its long-run level for a long
              time. Large κ means variance returns quickly after a shock. A good
              mental image is a spring: with low κ the spring is loose, with
              high κ it is tight.
            </p>

            <p>
              The parameter ξ is the volatility of volatility. This tells you
              how noisy the variance process itself is. If ξ is small, variance
              moves in a smoother and more controlled way. If ξ is large,
              variance becomes jumpier and more unstable. The stock paths then
              inherit this instability because periods of calm can suddenly turn
              into periods of much larger movement. This is one of the reasons
              why the implied volatility smile becomes more pronounced.
            </p>

            <p>
              The parameter ρ is especially important because it connects price
              shocks and variance shocks. Financially, it answers the question:
              what tends to happen to volatility when the stock price receives a
              bad or good shock? In many equity markets ρ is negative, meaning
              price drops are associated with rising volatility. This is one of
              the mechanisms behind the familiar downside skew in implied
              volatility.
            </p>

            <p>
              The reason Heston can produce a smile or skew, while
              Black–Scholes cannot, is that future volatility is itself random.
              Different strikes become sensitive to different volatility
              scenarios, and this naturally creates curvature in implied
              volatility. The smile is not an artificial extra feature of the
              model. It emerges from the richer volatility dynamics.
            </p>

            <p>
              The initial variance v₀ is also important, especially at short
              maturities. When there is little time left, the starting state of
              the system matters a lot. A high v₀ means the model begins in a
              stressed environment. A low v₀ together with a high θ describes a
              market that is calm now but expected to revert toward a more
              volatile long-run regime.
            </p>

            <p>
              The Feller condition, <strong>2κθ ≥ ξ²</strong>, can be understood
              as a balance between stabilizing forces and noise. The left side
              reflects the strength of mean reversion and the long-run level,
              while the right side reflects the intensity of volatility shocks.
              If noise is too strong relative to stabilizing forces, variance
              may approach zero too often, which can make simulations less
              stable.
            </p>

            <p>
              When you experiment with the sliders, it helps to think in
              stories, not just in numbers. High κ and low ξ describe a market
              where volatility shocks fade quickly. Low κ and high ξ describe a
              market where shocks are persistent and volatility itself is
              unstable. Strongly negative ρ describes a market where falling
              prices are tied to fear. Combined with high θ, this creates a
              persistently nervous market regime.
            </p>

            <p>
              The four charts together tell a coherent story. The stock paths
              show how the asset behaves under changing volatility. The variance
              paths show the internal engine of the model. The price chart shows
              how this richer uncertainty structure affects option values. The
              smile chart shows how the same mechanism appears in the language
              traders actually use: implied volatility.
            </p>

            <p>
              In short, Black–Scholes assumes a constant risk background, while
              Heston treats the risk background as something alive and evolving.
              That is why Heston is much better suited to capturing realistic
              smile and skew behavior.
            </p>
          </>
        )}
      </div>
    </SectionCard>
  );
}