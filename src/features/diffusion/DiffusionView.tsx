import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import SectionCard from "../../components/SectionCard";
import { diffusionSolution, makeTimes } from "./diffusion.math";
import SliderField from "../../components/SliderField";

type ChartRow = {
  x: number;
  [key: string]: number;
};

const lineColors = [
  "#22c55e",
  "#84cc16",
  "#eab308",
  "#f97316",
  "#ef4444",
  "#38bdf8",
];

function formatTimeLabel(t: number): string {
  if (t < 0) return `t=${t} múlt`;
  if (t > 0) return `t=${t} jövő`;
  return "t=0";
}

export default function DiffusionView() {
  const [controlsOpen, setControlsOpen] = useState(true);

  const [kappa, setKappa] = useState(0.003);
  const [n, setN] = useState(4);
  const [tMin, setTMin] = useState(-2);
  const [tMax, setTMax] = useState(2);
  const [curveCount, setCurveCount] = useState(5);

  const times = useMemo(() => makeTimes(tMin, tMax, curveCount), [tMin, tMax, curveCount]);

  const chartData = useMemo<ChartRow[]>(() => {
    const pointCount = 240;
    const xMin = 0;
    const xMax = 2 * Math.PI;

    return Array.from({ length: pointCount }, (_, i) => {
      const x = xMin + (i / (pointCount - 1)) * (xMax - xMin);
      const row: ChartRow = { x: Number(x.toFixed(4)) };

      for (const t of times) {
        row[formatTimeLabel(t)] = Number(
          diffusionSolution(x, kappa, n, t).toFixed(6)
        );
      }

      return row;
    });
  }, [times, kappa, n]);

  const amplitudeBound = useMemo(() => {
    const candidates = times.map((t) => Math.exp(-kappa * n * n * t));
    const maxAmp = Math.max(...candidates, 1);
    const padded = maxAmp * 1.15;
    return Number(Math.min(Math.max(padded, 1.2), 10).toFixed(2));
  }, [times, kappa, n]);
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
            {controlsOpen ? "+" : "-"}
          </button>
        }
      >
        {controlsOpen ? (
          <>
            <div className="controls-grid">
              <SliderField
                label="κ (diffúzió)"
                min={0.0001}
                max={0.05}
                step={0.0005}
                value={kappa}
                onChange={setKappa}
                formatValue={(v) => v.toFixed(4)}
              />

              <SliderField
                label="n (hullámszám)"
                min={1}
                max={12}
                step={1}
                value={n}
                onChange={setN}
                formatValue={(v) => `${v.toFixed(0)}`}
              />

              <SliderField
                label="t_min"
                min={-5}
                max={0}
                step={0.1}
                value={tMin}
                onChange={setTMin}
                formatValue={(v) => v.toFixed(1)}
              />

              <SliderField
                label="t_max"
                min={0}
                max={5}
                step={0.1}
                value={tMax}
                onChange={setTMax}
                formatValue={(v) => v.toFixed(1)}
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
                <div className="stat-title">Időtartomány</div>
                <div className="stat-value">
                  {times[0]?.toFixed(2)} → {times[times.length - 1]?.toFixed(2)}
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-title">Max amplitúdó skála</div>
                <div className="stat-value">± {amplitudeBound.toFixed(2)}</div>
              </div>
            </div>
          </>
        ) : (
          <div className="param-summary">
            <div>κ = {kappa.toFixed(4)}</div>
            <div>n = {n}</div>
            <div>t_min = {tMin.toFixed(1)}</div>
            <div>t_max = {tMax.toFixed(1)}</div>
            <div>görbék = {curveCount}</div>
          </div>
        )}
      </SectionCard>
    </div>

    <div className="view-main">
      <SectionCard
        className="chart-card"
        title="Diffúziós egyenlet"
        subtitle="u(t, x) = exp(-κ n² t) sin(nx)"
      >
        <div className="chart-wrap">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis
                dataKey="x"
                type="number"
                domain={[0, 2 * Math.PI]}
                tickCount={7}
                stroke="#94a3b8"
              />
              <YAxis
                domain={[-amplitudeBound, amplitudeBound]}
                tickCount={7}
                stroke="#94a3b8"
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
                  return [numericValue.toFixed(4), String(name)];
                }}
                labelFormatter={(label) => `x = ${Number(label).toFixed(3)}`}
              />
              <Legend />
              {times.map((t, index) => (
                <Line
                  key={t}
                  type="monotone"
                  dataKey={formatTimeLabel(t)}
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
        subtitle="Mit látunk a diffúziós egyenletnél?"
      >
        <div className="text-block">
          <p>
            A diffúziós egyenlet azt írja le, hogyan simulnak ki az idő
            előrehaladtával a térbeli különbségek egy rendszerben.
          </p>

          <p>
            A megoldásban a szinuszos kezdeti állapot amplitúdóját az
            <code> exp(-κ n² t) </code> faktor szabályozza. Pozitív időben ez
            csillapít, ezért a hullám fokozatosan kisimul.
          </p>

          <p>
            Negatív időben ugyanez a tényező felerősödést okoz, ezért a
            visszafelé folytatás instabillá válik. Ez jól mutatja, hogy a
            diffúziós folyamat természetes iránya az előrehaladó idő.
          </p>

          <p>
            A <b>κ</b> a diffúzió erősségét, az <b>n</b> pedig a térbeli
            frekvenciát szabályozza: nagyobb κ gyorsabb csillapodást, nagyobb n
            pedig érzékenyebb viselkedést okoz.
          </p>
        </div>
      </SectionCard>
    </div>
  </div>
);
}