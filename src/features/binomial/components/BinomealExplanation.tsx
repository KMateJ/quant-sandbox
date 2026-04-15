import SectionCard from "../../../components/SectionCard";
import { useI18n } from "../../../i18n";
import type { TreeMode } from "../binomial.types";

type BinomialExplanationProps = {
  mode: TreeMode;
};

export default function BinomialExplanation({ mode }: BinomialExplanationProps) {
  const { language, t } = useI18n();

  const isRates = mode === "rates";

  return (
    <SectionCard
      title={t("binomialExplanationTitle")}
      subtitle={
        isRates
          ? language === "hu"
            ? "Ugyanaz a fa nézet, most rövid kamatokkal és kötvényárazással"
            : "The same tree layout, now with short rates and bond pricing"
          : t("binomialExplanationSubtitle")
      }
    >
      <div className="text-block">
        {isRates ? (
          language === "hu" ? (
            <>
              <p>
                Ebben a módban minden csomópont egy <b>rövid kamatot</b> reprezentál. A kamat a
                következő időlépésben a <b>h</b> log-lépésköz alapján mozog, vagyis a szorzók
                <b>u = e^h</b> és <b>d = e^-h</b>.
              </p>
              <p>
                A <b>q</b> paraméter az emelkedő ág valószínűsége. A terminális időpontban egy
                zérókötvény kifizetése <b>1</b>, majd visszafelé haladva minden csomópontban a
                következő két érték diszkontált várható értékét számoljuk.
              </p>
              <p>
                Egy csomópontban tehát: <b>B = (q · B_up + (1-q) · B_down) / (1 + r)</b>.
              </p>
              <p>
                A gyökérben kapott <b>P(0,T)</b> a kötvény jelenlegi ára, ebből pedig a megjelenített
                hozam <b>y(0,T) = -ln(P(0,T)) / T</b> képlettel számolódik.
              </p>
            </>
          ) : (
            <>
              <p>
                In this mode, each node represents a <b>short rate</b>. At the next time step the rate
                moves according to the log step size <b>h</b>, so the factors are
                <b>u = e^h</b> and <b>d = e^-h</b>.
              </p>
              <p>
                The parameter <b>q</b> is the probability of the upward branch. At maturity a zero-coupon
                bond pays <b>1</b>, and then we move backward by taking the discounted expected value of
                the two next node values.
              </p>
              <p>
                At each node: <b>B = (q · B_up + (1-q) · B_down) / (1 + r)</b>.
              </p>
              <p>
                The root value is <b>P(0,T)</b>, and the displayed yield is computed as
                <b> y(0,T) = -ln(P(0,T)) / T</b>.
              </p>
            </>
          )
        ) : language === "hu" ? (
          <>
            <p>
              Ebben a binomiális modellben minden időlépésben a részvényár kétféleképpen változhat:
              vagy megszorzódik <b>u</b>-val, vagy <b>d</b>-vel.
            </p>
            <p>
              A modellben minden periódus <b>1 év</b>. A kockázatsemleges valószínűség:
              <b> q = (1 + r - d) / (u - d)</b>.
            </p>
            <p>
              Először a fa legvégén kiszámoljuk a payoffot, például call opciónál
              <b> max(S - K, 0)</b>. Ezután visszafelé haladunk, és minden csomópontban a következő
              két lehetséges érték diszkontált várható értékét vesszük.
            </p>
            <p>
              Klasszikus arbitrázsmentes helyzetben teljesül, hogy <b>d &lt; 1 + r &lt; u</b>, ekkor a
              <b>q</b> valóban 0 és 1 közé esik.
            </p>
            <p>
              A gyökércsomópontban az opció értéke egy replikáló portfólióval is előállítható: egy
              megfelelő számú részvény és egy kötvénypozíció együtt ugyanazt a kifizetést adja,
              mint az opció a következő lépés két lehetséges állapotában.
            </p>
          </>
        ) : (
          <>
            <p>
              In this binomial model, at each time step the stock price can move in two ways: it is
              multiplied either by <b>u</b> or by <b>d</b>.
            </p>
            <p>
              Each period in the model is <b>1 year</b>. The risk-neutral probability is:
              <b> q = (1 + r - d) / (u - d)</b>.
            </p>
            <p>
              First, we compute the payoff at the terminal nodes of the tree, for example
              <b> max(S - K, 0)</b> for a call option. Then we move backward, and at each node we take
              the discounted expected value of the two possible next outcomes.
            </p>
            <p>
              In the classical no-arbitrage case, we have <b>d &lt; 1 + r &lt; u</b>, and then <b>q</b>
              indeed lies between 0 and 1.
            </p>
            <p>
              At the root node, the option value can also be replicated by a replicating portfolio: an
              appropriate number of shares together with a bond position produces the same payoff as the
              option in the two possible states of the next step.
            </p>
          </>
        )}
      </div>
    </SectionCard>
  );
}
