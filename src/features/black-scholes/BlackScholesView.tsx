import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SectionCard from "../../components/SectionCard";
import {
  blackScholesCall,
  blackScholesPut,
  blackScholesDelta,
  blackScholesPutDelta,
  blackScholesGamma,
  blackScholesVega,
  blackScholesTheta,
  blackScholesPutTheta,
  blackScholesRho,
  blackScholesPutRho,
  makeMaturities,
} from "./blackScholes.math";
import SliderField from "../../components/SliderField";

type ChartRow = {
  S: number;
  [key: string]: number;
};

const lineColors = [
  "#1d4ed8",
  "#059669",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
];

type MetricKey = "price" | "delta" | "gamma" | "vega" | "theta" | "rho";
type OptionType = "call" | "put";

function getMetricTitle(metric: MetricKey, optionType: OptionType): string {
  if (metric === "price") {
    return `Black–Scholes ${optionType} árak`;
  }

  return `Black–Scholes ${optionType === "call" ? "Call" : "Put"} ${
    metric.charAt(0).toUpperCase() + metric.slice(1)
  }`;
}

export default function BlackScholesView() {
  const [strike, setStrike] = useState(100);
  const [rate, setRate] = useState(0.05);
  const [volatility, setVolatility] = useState(0.2);
  const [maxMaturity, setMaxMaturity] = useState(5);
  const [curveCount, setCurveCount] = useState(5);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [metric, setMetric] = useState<MetricKey>("price");
  const [optionType, setOptionType] = useState<OptionType>("call");
  const [chartOpen, setChartOpen] = useState(true);

  const maturities = useMemo(
    () => makeMaturities(maxMaturity, curveCount),
    [maxMaturity, curveCount]
  );

  const yDomain = useMemo<[number, number]>(() => {
    if (metric === "price") return [0, 175];
    if (metric === "delta") return optionType === "put" ? [-1, 0] : [0, 1];
    if (metric === "gamma") return [0, 0.12];
    if (metric === "vega") return [0, 100];
    if (metric === "theta") return optionType === "put" ? [-25, 15] : [-30, 10];
    if (metric === "rho") return optionType === "put" ? [-250, 0] : [0, 250];
    return [0, 200];
  }, [metric, optionType]);

  const chartData = useMemo<ChartRow[]>(() => {
    const sMin = 10;
    const sMax = 200;
    const pointCount = 140;

    const metricFn = (S: number, T: number) => {
      switch (metric) {
        case "price":
          return optionType === "call"
            ? blackScholesCall(S, strike, T, rate, volatility)
            : blackScholesPut(S, strike, T, rate, volatility);

        case "delta":
          return optionType === "call"
            ? blackScholesDelta(S, strike, T, rate, volatility)
            : blackScholesPutDelta(S, strike, T, rate, volatility);

        case "gamma":
          return blackScholesGamma(S, strike, T, rate, volatility);

        case "vega":
          return blackScholesVega(S, strike, T, rate, volatility);

        case "theta":
          return optionType === "call"
            ? blackScholesTheta(S, strike, T, rate, volatility)
            : blackScholesPutTheta(S, strike, T, rate, volatility);

        case "rho":
          return optionType === "call"
            ? blackScholesRho(S, strike, T, rate, volatility)
            : blackScholesPutRho(S, strike, T, rate, volatility);

        default:
          return optionType === "call"
            ? blackScholesCall(S, strike, T, rate, volatility)
            : blackScholesPut(S, strike, T, rate, volatility);
      }
    };

    return Array.from({ length: pointCount }, (_, i) => {
      const S = sMin + (i / (pointCount - 1)) * (sMax - sMin);
      const row: ChartRow = {
        S: Number(S.toFixed(2)),
      };

      for (const T of maturities) {
        row[`T=${T}`] = Number(metricFn(S, T).toFixed(6));
      }

      return row;
    });
  }, [maturities, strike, rate, volatility, metric, optionType]);

  const atmPrice = useMemo(() => {
    const value =
      optionType === "call"
        ? blackScholesCall(strike, strike, 1, rate, volatility)
        : blackScholesPut(strike, strike, 1, rate, volatility);

    return value.toFixed(3);
  }, [strike, rate, volatility, optionType]);

  return (
    <div className="view-layout">
      <div className="view-controls">
        <SectionCard
          title=""
          headerLeft={
            <button
              type="button"
              className="toggle-button"
              onClick={() => setControlsOpen((prev) => !prev)}
            >
              {controlsOpen ? "Összecsukás" : "Megjelenítés"}
            </button>
          }
        >
          <div className="metric-switch">
            <button
              type="button"
              className={optionType === "call" ? "metric-button active" : "metric-button"}
              onClick={() => setOptionType("call")}
            >
              Call
            </button>
            <button
              type="button"
              className={optionType === "put" ? "metric-button active" : "metric-button"}
              onClick={() => setOptionType("put")}
            >
              Put
            </button>
          </div>

          <div className="metric-switch">
            <button
              type="button"
              className={metric === "price" ? "metric-button active" : "metric-button"}
              onClick={() => setMetric("price")}
            >
              Price
            </button>
            <button
              type="button"
              className={metric === "delta" ? "metric-button active" : "metric-button"}
              onClick={() => setMetric("delta")}
            >
              Delta
            </button>
            <button
              type="button"
              className={metric === "gamma" ? "metric-button active" : "metric-button"}
              onClick={() => setMetric("gamma")}
            >
              Gamma
            </button>
            <button
              type="button"
              className={metric === "vega" ? "metric-button active" : "metric-button"}
              onClick={() => setMetric("vega")}
            >
              Vega
            </button>
            <button
              type="button"
              className={metric === "theta" ? "metric-button active" : "metric-button"}
              onClick={() => setMetric("theta")}
            >
              Theta
            </button>
            <button
              type="button"
              className={metric === "rho" ? "metric-button active" : "metric-button"}
              onClick={() => setMetric("rho")}
            >
              Rho
            </button>
          </div>

          {controlsOpen ? (
            <>
              <div className="controls-grid">
                <SliderField
                  label="K (strike)"
                  min={20}
                  max={200}
                  step={1}
                  value={strike}
                  onChange={setStrike}
                />

                <SliderField
                  label="r (kamat)"
                  min={0}
                  max={0.2}
                  step={0.005}
                  value={rate}
                  onChange={setRate}
                  formatValue={(v) => v.toFixed(3)}
                />

                <SliderField
                  label="σ (volatilitás)"
                  min={0.01}
                  max={1}
                  step={0.01}
                  value={volatility}
                  onChange={setVolatility}
                  formatValue={(v) => v.toFixed(2)}
                />

                <SliderField
                  label="T_max"
                  min={0.25}
                  max={20}
                  step={0.25}
                  value={maxMaturity}
                  onChange={setMaxMaturity}
                  formatValue={(v) => `${v.toFixed(2)} év`}
                />

                <SliderField
                  label="Görbék száma"
                  min={2}
                  max={6}
                  step={1}
                  value={curveCount}
                  onChange={setCurveCount}
                  formatValue={(v) => `${v.toFixed(0)} db`}
                />
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-title">ATM példa</div>
                  <div className="stat-value">
                    {optionType === "call" ? "C" : "P"}(S=K, T=1) ≈ {atmPrice}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Lejárati tartomány</div>
                  <div className="stat-value">
                    {maturities[0]?.toFixed(2)} év →{" "}
                    {maturities[maturities.length - 1]?.toFixed(2)} év
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="param-summary">
              <div>opció = {optionType}</div>
              <div>K = {strike}</div>
              <div>r = {rate.toFixed(3)}</div>
              <div>σ = {volatility.toFixed(2)}</div>
              <div>Tmax = {maxMaturity.toFixed(2)}</div>
              <div>görbék = {curveCount}</div>
              <div>mód = {metric}</div>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="view-main">
        <SectionCard
          className="chart-card"
          title={getMetricTitle(metric, optionType)}
          subtitle={`A kiválasztott mennyiség a részvényár függvényében több lejáratra`}
          headerLeft={
            <button
              type="button"
              className="toggle-button"
              onClick={() => setChartOpen((prev) => !prev)}
            >
              {chartOpen ? "Összecsukás" : "Megjelenítés"}
            </button>
          }
        >
          {chartOpen && (
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                <XAxis
                  dataKey="S"
                  type="number"
                  domain={[10, 200]}
                  tickCount={8}
                  stroke="#94a3b8"
                />
                <YAxis domain={yDomain} tickCount={7} stroke="#94a3b8" />
                <ReferenceLine
                  x={strike}
                  stroke="#94a3b8"
                  strokeDasharray="4 4"
                />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    border: "1px solid #475569",
                    borderRadius: "8px",
                  }}
                  labelStyle={{ color: "#e2e8f0" }}
                  formatter={(value, name) => {
                    const numericValue =
                      typeof value === "number" ? value : Number(value ?? 0);

                    const digits =
                      metric === "gamma" ? 5 : metric === "delta" ? 4 : 3;

                    return [numericValue.toFixed(digits), String(name)];
                  }}
                  labelFormatter={(label) => `S = ${label}`}
                />
                <Legend />
                {maturities.map((T, index) => (
                  <Line
                    key={T}
                    type="monotone"
                    dataKey={`T=${T}`}
                    dot={false}
                    stroke={lineColors[index % lineColors.length]}
                    strokeWidth={2.5}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            </div>
            )}
            {!chartOpen && (
              <div className="param-summary">
                Grafikon elrejtve
              </div>
            )}
        </SectionCard>

        <SectionCard title="Intuíció" subtitle="Mit mutat a grafikon?">
          <div className="text-block">
            <p>
              Ez az ábra azt mutatja meg, hogyan változik egy európai{" "}
              {optionType === "call" ? "call" : "put"} opció értéke és érzékenysége a
              részvényár függvényében, több különböző lejárat mellett. A vízszintes
              tengelyen az alaptermék ára ({`S`}) szerepel, a görbék pedig azt mutatják,
              hogy ugyanazon paraméterek mellett hogyan alakul az opció ára vagy valamely
              görög mutatója eltérő lejáratok esetén.
            </p>

            <p>
              A <strong>Price</strong> nézet az opció elméleti értékét mutatja. Call
              esetén az opció annál értékesebb, minél magasabb a részvényár a strike-hoz
              képest, mert annál nagyobb az esélye és a mértéke annak, hogy a lejáratkori
              kifizetés pozitív lesz. Put esetén ennek fordítottja igaz: akkor nő az
              opció értéke, ha a részvényár a strike alá kerül. A hosszabb lejárat
              általában nagyobb értéket jelent, mert több idő áll rendelkezésre arra,
              hogy az ár kedvező irányba mozduljon el. Ez az úgynevezett{" "}
              <strong>időérték</strong>.
            </p>

            <p>
              A szaggatott függőleges vonal a <strong>strike árfolyamot</strong> jelöli.
              Ennek környéke különösen fontos, mert itt szokott a legtöbb érzékenységi
              mutató látványosan viselkedni. Amikor az opció közel van az at-the-money
              állapothoz, egy kis árfolyamváltozás is jelentősen módosíthatja a várható
              lejáratkori kimenetet, ezért az opció ára és görögjei itt a legérdekesebbek.
            </p>

            <p>
              A <strong>Delta</strong> azt mutatja meg, hogy az opció ára körülbelül
              mennyivel változik, ha a részvényár 1 egységgel elmozdul. Call esetén a
              delta 0 és 1 között mozog: mélyen out-of-the-money helyzetben közel 0,
              mélyen in-the-money helyzetben közel 1. Ez intuitívan azt jelenti, hogy egy
              nagyon értéktelen call alig reagál a részvény kis mozgásaira, míg egy mélyen
              pénzben lévő call már szinte úgy viselkedik, mint maga a részvény. Put
              esetén a delta jellemzően -1 és 0 közötti: minél inkább in-the-money a put,
              annál közelebb kerül -1-hez.
            </p>

            <p>
              A <strong>Gamma</strong> a delta változási sebességét méri, vagyis azt
              mutatja meg, mennyire gyorsan változik a delta a részvényár függvényében.
              A gamma tipikusan a strike környékén a legnagyobb, különösen rövidebb
              lejáratoknál. Ennek az az intuíciója, hogy at-the-money állapot közelében
              egy kis árfolyammozgás is könnyen átbillentheti az opciót az egyik
              tartományból a másikba, ezért a delta itt a leginstabilabb. Mélyen
              in-the-money vagy out-of-the-money tartományban a gamma általában kicsi,
              mert ott a delta már közel állandó.
            </p>

            <p>
              A <strong>Vega</strong> azt méri, hogy az opció ára mennyire érzékeny az
              implikált vagy feltételezett volatilitás változására. A magasabb
              volatilitás általában növeli mind a call, mind a put értékét, mert nagyobb
              bizonytalanság mellett nagyobb az esélye a kedvező kimenetnek, miközben a
              veszteség az opció vevője számára korlátozott. A vega gyakran az
              at-the-money tartományban magas, és hosszabb lejáratoknál is jelentősebb
              lehet, mert több idő alatt a bizonytalanság jobban be tud árazódni az
              opció értékébe.
            </p>

            <p>
              A <strong>Theta</strong> az idő múlásának hatását mutatja: azt fejezi ki,
              hogyan változik az opció ára, ha minden más paraméter változatlan marad,
              miközben csökken a lejáratig hátralévő idő. A theta sok esetben negatív az
              opció vevője számára, mert az időérték fokozatosan leépül. Ez különösen
              fontos a strike környékén, ahol az opció még jelentős időértékkel
              rendelkezik. Rövid lejárat közelében ez az időveszteség felgyorsulhat, ezért
              a theta görbék gyakran itt mutatnak meredekebb viselkedést.
            </p>

            <p>
              A <strong>Rho</strong> a kamatlábra való érzékenységet mutatja. Call
              opcióknál a kamatláb emelkedése általában növeli az opció értékét, míg put
              opcióknál gyakran csökkenti azt. Ennek oka, hogy a strike jövőbeli
              kifizetésének jelenértéke függ a kamatlábtól: magasabb kamat mellett a
              jövőbeni strike jelenértéke alacsonyabb. A rho jellemzően hosszabb
              lejáratoknál fontosabb, mert a kamathatásnak ott több ideje van felhalmozódni.
            </p>

            <p>
              A különböző lejáratú görbék összehasonlítása segít megérteni, hogy az opció
              értéke nemcsak az aktuális részvényártól függ, hanem attól is, mennyi idő
              maradt a lejáratig. Rövidebb lejáratnál a görbék gyakran élesebbek, mert
              kevesebb idő marad a bizonytalanság „kidolgozására”. Hosszabb lejáratnál a
              görbék simábbak és az időérték dominánsabb szerepet kaphat.
            </p>

            <p>
              Összességében a grafikon azt segít intuitívan megérteni, hogy az opció árát
              nem egyetlen tényező mozgatja. A részvényár, a hátralévő idő, a
              volatilitás és a kamatláb egyszerre hatnak az értékre. A görögök pedig
              ennek az összetett rendszernek a „helyi érzékenységeit” írják le: megmutatják,
              hogy egy adott pontban melyik tényező mennyire fontos, és milyen irányban
              hat az opció árára.
            </p>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}