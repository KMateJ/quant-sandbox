import SectionCard from "../../../components/SectionCard";

export default function BinomialExplanation() {
  return (
    <SectionCard title="Intuíció" subtitle="Mit mutat ez a modell?">
      <div className="text-block">
        <p>
          Ebben a binomiális modellben minden időlépésben a részvényár kétféleképpen
          változhat: vagy megszorzódik <b>u</b>-val, vagy <b>d</b>-vel.
        </p>

        <p>
          A modellben minden periódus <b>1 év</b>. A kockázatsemleges valószínűség:
          <b> q = (1 + r - d) / (u - d)</b>.
        </p>

        <p>
          Először a fa legvégén kiszámoljuk a payoffot, például call opciónál
          <b> max(S - K, 0)</b>. Ezután visszafelé haladunk, és minden csomópontban
          a következő két lehetséges érték diszkontált várható értékét vesszük.
        </p>

        <p>
          Klasszikus arbitrázsmentes helyzetben teljesül, hogy <b>d &lt; 1 + r &lt; u</b>,
          ekkor a <b>q</b> valóban 0 és 1 közé esik.
        </p>

        <p>
          A gyökércsomópontban az opció értéke egy replikáló portfólióval is előállítható:
          egy megfelelő számú részvény és egy kötvénypozíció együtt ugyanazt a kifizetést adja,
          mint az opció a következő lépés két lehetséges állapotában.
        </p>
      </div>
    </SectionCard>
  );
}