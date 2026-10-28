import { FACTOR_LABEL } from "../famaFrench.math";
import type { FactorId } from "../famaFrench.types";
import { factorColor } from "./factorColor";

/// A colour swatch next to the factor's symbol, so colour is never the only cue.
export default function FactorName({ id }: { id: FactorId }) {
  return (
    <span className="ffm-factor">
      <span className="ffm-swatch" style={{ background: factorColor(id) }} aria-hidden="true" />
      {FACTOR_LABEL[id]}
    </span>
  );
}
