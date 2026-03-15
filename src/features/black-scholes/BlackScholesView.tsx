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
  blackScholesDelta,
  blackScholesGamma,
  blackScholesVega,
  makeMaturities,
} from "./blackScholes.math";
import SliderField from "../../components/SliederField";

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

type MetricKey = "price" | "delta" | "gamma" | "vega";

export default function BlackScholesView() {
  const [strike, setStrike] = useState(100);
  const [rate, setRate] = useState(0.05);
  const [volatility, setVolatility] = useState(0.2);
  const [maxMaturity, setMaxMaturity] = useState(5);
  const [curveCount, setCurveCount] = useState(5);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [metric, setMetric] = useState<MetricKey>("price");

  const maturities = useMemo(
    () => makeMaturities(maxMaturity, curveCount),
    [maxMaturity, curveCount]
  );

  const yDomain = useMemo<[number, number]>(() => {
    if (metric === "price") return [0, 175];
    if (metric === "delta") return [0, 1];
    if (metric === "gamma") return [0, 0.12];
    if (metric === "vega") return [0, 100];
    return [0, 200];
  }, [metric]);

  const chartData = useMemo<ChartRow[]>(() => {
    const sMin = 10;
    const sMax = 200;
    const pointCount = 140;

    const metricFn = (S: number, T: number) => {
      switch (metric) {
        case "delta":
          return blackScholesDelta(S, strike, T, rate, volatility);
        case "gamma":
          return blackScholesGamma(S, strike, T, rate, volatility);
        case "vega":
          return blackScholesVega(S, strike, T, rate, volatility);
        case "price":
        default:
          return blackScholesCall(S, strike, T, rate, volatility);
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
  }, [maturities, strike, rate, volatility, metric]);

  const atmPrice = useMemo(() => {
    return blackScholesCall(strike, strike, 1, rate, volatility).toFixed(3);
  }, [strike, rate, volatility]);

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
                 <div className="stat-value">C(S=K, T=1) ≈ {atmPrice}</div>
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
         title={
           metric === "price"
             ? "Black–Scholes call árak"
             : metric === "delta"
             ? "Black–Scholes Delta"
             : metric === "gamma"
             ? "Black–Scholes Gamma"
             : "Black–Scholes Vega"
         }
         subtitle="A kiválasztott mennyiség a részvényár függvényében több lejáratra"
       >
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
       </SectionCard>

       <SectionCard
         title="Intuíció"
         subtitle="Mit mutat a grafikon?"
       >
         <div className="text-block">
           <p>
             A grafikon azt mutatja meg, hogyan függ egy európai call opció
             értéke a részvény árától különböző lejáratok mellett.
           </p>

           <p>
             Ha a részvény ára nagyon alacsony a strike-hoz képest, az opció
             értéke közel nulla, mert kicsi az esélye, hogy lejáratkor
             nyereséges lesz. Ahogy a részvény ára nő, az opció értéke is nő.
           </p>

           <p>
             A különböző görbék különböző lejáratokat jelentenek. A hosszabb
             lejárat általában magasabb opcióárat jelent, mert több idő van
             arra, hogy az ár kedvező irányba mozogjon.
           </p>

           <p>
             A Delta, Gamma és Vega nézetek azt mutatják meg, mennyire érzékeny
             az opció ára a különböző paraméterek változására.
           </p>
         </div>
       </SectionCard>
     </div>
   </div>
) ;
}