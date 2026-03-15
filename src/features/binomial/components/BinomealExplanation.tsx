import SectionCard from "../../../components/SectionCard";

export default function BinomialExplanation() {
  return (
    <SectionCard title="Intuíció" subtitle="Mit látunk a fán?">
      <div className="text-block">
        <p>
          A binomiális modellben minden időlépésben a részvényár két irányba
          mozoghat: felfelé egy <b>u</b> szorzóval, vagy lefelé egy <b>d</b>
          szorzóval.
        </p>

        <p>
          A leveleken először kiszámoljuk a lejáratkori kifizetést, majd onnan
          visszafelé haladva minden csomópontban a jövőbeli értékek
          diszkontált, kockázatsemleges várható értékét vesszük.
        </p>

        <p>
          Európai opciónál csak lejáratkor lehet lehívni. Amerikai opciónál
          minden köztes pontban összehasonlíthatjuk az azonnali lehívási értéket
          a folytatási értékkel.
        </p>

        <p>
          Ha növeled a lépésszámot, a binomiális modell egyre finomabb lesz, és
          sok esetben közelít a Black–Scholes árhoz.
        </p>
      </div>
    </SectionCard>
  );
}