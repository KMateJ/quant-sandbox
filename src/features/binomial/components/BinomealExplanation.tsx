import SectionCard from "../../../components/SectionCard";
import { useI18n } from "../../../i18n";

export default function BinomialExplanation() {
  const { language, t } = useI18n();

  return (
    <SectionCard
      title={t("binomialExplanationTitle")}
      subtitle={t("binomialExplanationSubtitle")}
    >
      <div className="text-block">
        {language === "hu" ? (
          <>
            <p>
              Ebben a binomiális modellben minden időlépésben a részvényár
              kétféleképpen változhat: vagy megszorzódik <b>u</b>-val, vagy <b>d</b>-vel.
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
          </>
        ) : (
          <>
            <p>
              In this binomial model, at each time step the stock price can move in two ways:
              it is multiplied either by <b>u</b> or by <b>d</b>.
            </p>
            <p>
              Each period in the model is <b>1 year</b>. The risk-neutral probability is:
              <b> q = (1 + r - d) / (u - d)</b>.
            </p>
            <p>
              First, we compute the payoff at the terminal nodes of the tree, for example
              <b> max(S - K, 0)</b> for a call option. Then we move backward, and at each node
              we take the discounted expected value of the two possible next outcomes.
            </p>
            <p>
              In the classical no-arbitrage case, we have <b>d &lt; 1 + r &lt; u</b>,
              and then <b>q</b> indeed lies between 0 and 1.
            </p>
            <p>
              At the root node, the option value can also be replicated by a replicating portfolio:
              an appropriate number of shares together with a bond position produces the same payoff
              as the option in the two possible states of the next step.
            </p>
          </>
        )}
      </div>
    </SectionCard>
  );
}