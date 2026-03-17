import SectionCard from "../../../components/SectionCard";
import type { BinomialTreeResult } from "../binomial.types";

type BinomialSummaryProps = {
  tree: BinomialTreeResult;
};

export default function BinomialSummary({ tree }: BinomialSummaryProps) {
  return (
    <SectionCard title="Összefoglaló" subtitle="A modell fő mennyiségei">
      {!tree.isValid && tree.validationMessage ? (
        <div className="warning-card">
          <div className="warning-title">Figyelmeztetés</div>
          <div className="warning-text">{tree.validationMessage}</div>
        </div>
      ) : null}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Opció ára</div>
          <div className="stat-value">{tree.price.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">q</div>
          <div className="stat-value">{tree.q.toFixed(4)}</div>
        </div>

        {tree.replicatingPortfolio ? (
          <div className="stat-card">
            <div className="stat-title">Gyökérbeli replikáló portfólió</div>
                  
            <div className="stat-value">
              <div className="replication-row">
                <span>Stock position</span>
                <span className={tree.replicatingPortfolio.delta >= 0 ? "replication-positive" : "replication-negative"}>
                  {tree.replicatingPortfolio.delta >= 0 ? "+" : ""}
                  {tree.replicatingPortfolio.delta.toFixed(4)} · S₀
                </span>
              </div>
                      
              <div className="replication-row">
                <span>Cash position</span>
                <span className={tree.replicatingPortfolio.bond >= 0 ? "replication-positive" : "replication-negative"}>
                  {tree.replicatingPortfolio.bond >= 0 ? "+" : ""}
                  {tree.replicatingPortfolio.bond.toFixed(4)}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        <div className="stat-card">
          <div className="stat-title">u</div>
          <div className="stat-value">{tree.u.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">d</div>
          <div className="stat-value">{tree.d.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Diszkont faktor</div>
          <div className="stat-value">{tree.discount.toFixed(4)}</div>
        </div>


        
      </div>


    </SectionCard>
  );
}