import SectionCard from "../../../components/SectionCard";
import type { BinomialTreeResult } from "../binomial.types";

type BinomialSummaryProps = {
  tree: BinomialTreeResult;
};

export default function BinomialSummary({ tree }: BinomialSummaryProps) {
  return (
    <SectionCard title="Összefoglaló" subtitle="A modell fő mennyiségei">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-title">Opció ára</div>
          <div className="stat-value">{tree.price.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">u</div>
          <div className="stat-value">{tree.u.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">d</div>
          <div className="stat-value">{tree.d.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">p</div>
          <div className="stat-value">{tree.p.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Δt</div>
          <div className="stat-value">{tree.dt.toFixed(4)}</div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Diszkont faktor</div>
          <div className="stat-value">{tree.discount.toFixed(4)}</div>
        </div>
      </div>
    </SectionCard>
  );
}