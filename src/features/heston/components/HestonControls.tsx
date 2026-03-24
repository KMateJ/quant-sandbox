import SectionCard from "../../../components/SectionCard";
import SliderField from "../../../components/SliderField";
import type {
  HestonControlsSetters,
  HestonControlsState,
} from "../heston.types";

type Props = {
  language: string;
  controlsOpen: boolean;
  setControlsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  values: HestonControlsState;
  setters: HestonControlsSetters;
  feller: number;
};

export default function HestonControls({
  language,
  controlsOpen,
  setControlsOpen,
  values,
  setters,
  feller,
}: Props) {
  const {
    S0,
    strike,
    rate,
    v0,
    theta,
    kappa,
    xi,
    rho,
    maturity,
    steps,
    pathCount,
    pricingSteps,
    pricingPaths,
  } = values;

  const {
    setS0,
    setStrike,
    setRate,
    setV0,
    setTheta,
    setKappa,
    setXi,
    setRho,
    setMaturity,
    setSteps,
    setPathCount,
    setPricingSteps,
    setPricingPaths,
  } = setters;

  return (
    <SectionCard
      title=""
      headerLeft={
        <button
          type="button"
          className="toggle-button"
          onClick={() => setControlsOpen((prev) => !prev)}
        >
          {controlsOpen ? "-" : "+"}
        </button>
      }
    >
      {controlsOpen ? (
        <>
          <div className="controls-grid">
            <SliderField label="S0" min={20} max={200} step={1} value={S0} onChange={setS0} />
            <SliderField label="K (strike)" min={20} max={200} step={1} value={strike} onChange={setStrike} />
            <SliderField
              label="r"
              min={0}
              max={0.2}
              step={0.005}
              value={rate}
              onChange={setRate}
              formatValue={(v) => v.toFixed(3)}
            />
            <SliderField
              label="v0"
              min={0.0001}
              max={0.25}
              step={0.0025}
              value={v0}
              onChange={setV0}
              formatValue={(v) => v.toFixed(4)}
            />
            <SliderField
              label="θ"
              min={0.0001}
              max={0.25}
              step={0.0025}
              value={theta}
              onChange={setTheta}
              formatValue={(v) => v.toFixed(4)}
            />
            <SliderField
              label="κ"
              min={0.1}
              max={10}
              step={0.1}
              value={kappa}
              onChange={setKappa}
              formatValue={(v) => v.toFixed(2)}
            />
            <SliderField
              label="ξ (vol-of-vol)"
              min={0.01}
              max={2}
              step={0.01}
              value={xi}
              onChange={setXi}
              formatValue={(v) => v.toFixed(2)}
            />
            <SliderField
              label="ρ"
              min={-0.99}
              max={0.99}
              step={0.01}
              value={rho}
              onChange={setRho}
              formatValue={(v) => v.toFixed(2)}
            />
            <SliderField
              label="T"
              min={0.25}
              max={10}
              step={0.25}
              value={maturity}
              onChange={setMaturity}
              formatValue={(v) =>
                language === "hu" ? `${v.toFixed(2)} év` : `${v.toFixed(2)} years`
              }
            />
            <SliderField
              label="Path steps"
              min={25}
              max={500}
              step={25}
              value={steps}
              onChange={setSteps}
            />
            <SliderField
              label="Visual paths"
              min={1}
              max={30}
              step={1}
              value={pathCount}
              onChange={setPathCount}
            />
            <SliderField
              label="Pricing steps"
              min={25}
              max={400}
              step={25}
              value={pricingSteps}
              onChange={setPricingSteps}
            />
            <SliderField
              label="Pricing paths"
              min={100}
              max={2000}
              step={100}
              value={pricingPaths}
              onChange={setPricingPaths}
            />
          </div>

          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-title">Initial vol</div>
              <div className="stat-value">{Math.sqrt(v0).toFixed(3)}</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Long-run vol</div>
              <div className="stat-value">{Math.sqrt(theta).toFixed(3)}</div>
            </div>

            <div className="stat-card">
              <div className="stat-title">Feller</div>
              <div className="stat-value">
                {feller >= 0 ? "ok" : "violated"} ({feller.toFixed(4)})
              </div>
            </div>
          </div>

          <div className="param-summary" style={{ marginTop: 12 }}>
            <div>
              MC pricing uses {pricingPaths} paths and {pricingSteps} time steps.
            </div>
            <div>
              Higher values give smoother Heston curves but slower updates.
            </div>
          </div>
        </>
      ) : (
        <div className="param-summary">
          <div>S0 = {S0}</div>
          <div>K = {strike}</div>
          <div>r = {rate.toFixed(3)}</div>
          <div>v0 = {v0.toFixed(4)}</div>
          <div>θ = {theta.toFixed(4)}</div>
          <div>κ = {kappa.toFixed(2)}</div>
          <div>ξ = {xi.toFixed(2)}</div>
          <div>ρ = {rho.toFixed(2)}</div>
          <div>T = {maturity.toFixed(2)}</div>
        </div>
      )}
    </SectionCard>
  );
}