import SectionCard from "../../../components/SectionCard";
import { useI18n } from "../../../i18n";
import type { GreekKey, GreeksComparison } from "../heston.types";

type Props = {
  data: GreeksComparison | null;
};

const GREEK_META: Record<
  GreekKey,
  { symbol: string; nameEn: string; nameHu: string; decimals: number }
> = {
  delta: { symbol: "Δ", nameEn: "Delta", nameHu: "Delta", decimals: 4 },
  gamma: { symbol: "Γ", nameEn: "Gamma", nameHu: "Gamma", decimals: 4 },
  vega: { symbol: "𝒱", nameEn: "Vega", nameHu: "Vega", decimals: 3 },
  theta: { symbol: "Θ", nameEn: "Theta", nameHu: "Theta", decimals: 3 },
  rho: { symbol: "ρ", nameEn: "Rho", nameHu: "Rho", decimals: 3 },
};

export default function HestonGreeksSummary({ data }: Props) {
  const { language } = useI18n();
  const isHu = language === "hu";

  return (
    <SectionCard
      title={isHu ? "Görögök: Heston vs Black–Scholes" : "Greeks: Heston vs Black–Scholes"}
      subtitle={
        isHu
          ? "ATM görögök az S₀ pontban, ugyanazzal a σ = √v₀ volatilitással összehasonlítva"
          : "At-the-money Greeks at S₀, compared with Black–Scholes using σ = √v₀"
      }
    >
      {data ? (
        <>
          <div className="greeks-table-wrap">
            <table className="greeks-table">
              <thead>
                <tr>
                  <th>{isHu ? "Görög" : "Greek"}</th>
                  <th>Black–Scholes</th>
                  <th>Heston (MC)</th>
                  <th>{isHu ? "Eltérés" : "Difference"}</th>
                </tr>
              </thead>
              <tbody>
                <tr className="greeks-price-row">
                  <td>{isHu ? "Ár" : "Price"}</td>
                  <td>{data.bsPrice.toFixed(4)}</td>
                  <td>{data.hestonPrice.toFixed(4)}</td>
                  <td>{(data.hestonPrice - data.bsPrice).toFixed(4)}</td>
                </tr>
                {data.rows.map((row) => {
                  const meta = GREEK_META[row.key];
                  const diff = row.heston - row.bs;
                  return (
                    <tr key={row.key}>
                      <td>
                        <span className="greek-symbol">{meta.symbol}</span>{" "}
                        {isHu ? meta.nameHu : meta.nameEn}
                      </td>
                      <td>{row.bs.toFixed(meta.decimals)}</td>
                      <td>{row.heston.toFixed(meta.decimals)}</td>
                      <td className={diff >= 0 ? "greek-pos" : "greek-neg"}>
                        {diff >= 0 ? "+" : ""}
                        {diff.toFixed(meta.decimals)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="text-block greeks-note">
            {isHu ? (
              <>
                <p>
                  A Black–Scholes görögök zárt képletből jönnek, egyetlen konstans
                  σ = √v₀ mellett. A Heston görögöket Monte Carlo szimulációból
                  becsüljük véges differenciákkal, közös véletlen számokkal, hogy a
                  bump-and-revalue stabil maradjon.
                </p>
                <p>
                  A legfontosabb különbség a <strong>Delta</strong> és a{" "}
                  <strong>Vega</strong> körül jelenik meg. Mivel a Heston
                  modellben a volatilitás maga is sztochasztikus és a ρ
                  korreláció összeköti az árfolyam- és variancia-sokkokat, a
                  Heston delta már tartalmaz egy közvetett volatilitási hatást is:
                  ha az árfolyam esik, a volatilitás jellemzően nő (negatív ρ),
                  ami eltéríti a deltát a Black–Scholes értéktől. Ez ugyanaz a
                  mechanizmus, ami a volatilitási görbét (smile/skew) létrehozza.
                </p>
                <p>
                  A <strong>Vega</strong> a Hestonban nem egyetlen szám: itt a
                  kezdeti variancia (v₀) érzékenységét mutatjuk, de a valódi
                  volatilitási kitettség szétoszlik a v₀, θ, κ és ξ paraméterek
                  között. Ezért a Heston vega általában eltér, és a modell
                  gazdagabb vega-struktúrát ad, mint a Black–Scholes egyetlen
                  vega száma.
                </p>
              </>
            ) : (
              <>
                <p>
                  The Black–Scholes Greeks come from closed-form formulas with a
                  single constant σ = √v₀. The Heston Greeks are estimated from
                  the Monte Carlo price using central finite differences with
                  common random numbers, which keeps the bump-and-revalue stable.
                </p>
                <p>
                  The most telling differences show up in <strong>Delta</strong>{" "}
                  and <strong>Vega</strong>. Because volatility is itself
                  stochastic in Heston and the correlation ρ links the price and
                  variance shocks, the Heston delta already bakes in an indirect
                  volatility effect: when the spot falls, volatility typically
                  rises (negative ρ), which pulls delta away from the
                  Black–Scholes value. This is the same mechanism that produces
                  the volatility smile/skew.
                </p>
                <p>
                  <strong>Vega</strong> is not a single number in Heston — here we
                  report the sensitivity to the initial variance v₀, but the true
                  volatility exposure is spread across v₀, θ, κ and ξ. So the
                  Heston vega generally differs and the model carries a richer
                  vega structure than the one vega of Black–Scholes.
                </p>
              </>
            )}
          </div>
        </>
      ) : (
        <div className="text-block">
          <p>{isHu ? "Görögök számítása…" : "Computing Greeks…"}</p>
        </div>
      )}
    </SectionCard>
  );
}
