import SectionCard from "../../../components/SectionCard";

export default function PayoffExplanation() {
  return (
    <SectionCard
      title="Mit látsz a grafikonon?"
      subtitle="A lejáratkori kifizetési profil vizuális értelmezése"
    >
      <div className="text-block">
        <p>
          A vízszintes tengely az alaptermék lejáratkori árát jelöli: <code>S_T</code>.
          A függőleges tengely az összesített payoffot vagy profitot mutatja.
        </p>
        <p>
          Call opció esetén a kifizetés csak a strike fölött indul növekedni, put esetén
          pedig a strike alatt. A stock lineáris, a forward szintén lineáris, de egy
          rögzített kötési ár körül.
        </p>
        <p>
          A szaggatott függőleges vonalak a fontos strike szinteket jelölik. Ha a
          stratégia megfelel egy ismert szintetikus konstrukciónak, a grafikon külön
          overlay görbén megmutatja az ennek megfelelő forward profilt is.
        </p>
      </div>
    </SectionCard>
  );
}