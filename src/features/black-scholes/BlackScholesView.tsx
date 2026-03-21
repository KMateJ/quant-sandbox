import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
import { useI18n } from "../../i18n";

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

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseNumber(
  value: string | null,
  fallback: number,
  min: number,
  max: number,
  decimals?: number
) {
  if (value == null || value.trim() === "") return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  const clamped = clamp(parsed, min, max);
  if (decimals == null) return clamped;
  return Number(clamped.toFixed(decimals));
}

function parseMetric(value: string | null): MetricKey {
  if (
    value === "price" ||
    value === "delta" ||
    value === "gamma" ||
    value === "vega" ||
    value === "theta" ||
    value === "rho"
  ) {
    return value;
  }

  return "price";
}

function parseOptionType(value: string | null): OptionType {
  return value === "put" ? "put" : "call";
}

function formatNumber(value: number, decimals?: number) {
  if (decimals == null) return String(value);
  return String(Number(value.toFixed(decimals)));
}

function getMetricTitle(
  metric: MetricKey,
  optionType: OptionType,
  t: (key: string) => string
): string {
  const optionLabel =
    optionType === "call"
      ? t("blackScholesOptionCall")
      : t("blackScholesOptionPut");

  switch (metric) {
    case "price":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} ${t("blackScholesMetricPriceAccusative")}`;
    case "delta":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} Delta`;
    case "gamma":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} Gamma`;
    case "vega":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} Vega`;
    case "theta":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} Theta`;
    case "rho":
      return `${t("blackScholesTitlePrefix")} ${optionLabel} Rho`;
    default:
      return `${t("blackScholesTitlePrefix")} ${optionLabel} ${t("blackScholesMetricPriceAccusative")}`;
  }
}

export default function BlackScholesView() {
  const { t, language } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const queryString = searchParams.toString();

  const [strike, setStrike] = useState(() =>
    parseNumber(searchParams.get("k"), 100, 20, 200)
  );
  const [rate, setRate] = useState(() =>
    parseNumber(searchParams.get("r"), 0.05, 0, 0.2, 3)
  );
  const [volatility, setVolatility] = useState(() =>
    parseNumber(searchParams.get("sigma"), 0.2, 0.01, 1, 2)
  );
  const [maxMaturity, setMaxMaturity] = useState(() =>
    parseNumber(searchParams.get("tmax"), 5, 0.25, 20, 2)
  );
  const [curveCount, setCurveCount] = useState(() =>
    parseNumber(searchParams.get("curves"), 5, 2, 6)
  );
  const [controlsOpen, setControlsOpen] = useState(true);
  const [metric, setMetric] = useState<MetricKey>(() =>
    parseMetric(searchParams.get("metric"))
  );
  const [optionType, setOptionType] = useState<OptionType>(() =>
    parseOptionType(searchParams.get("type"))
  );
  const [chartOpen, setChartOpen] = useState(true);

  useEffect(() => {
    setStrike(parseNumber(searchParams.get("k"), 100, 20, 200));
    setRate(parseNumber(searchParams.get("r"), 0.05, 0, 0.2, 3));
    setVolatility(parseNumber(searchParams.get("sigma"), 0.2, 0.01, 1, 2));
    setMaxMaturity(parseNumber(searchParams.get("tmax"), 5, 0.25, 20, 2));
    setCurveCount(parseNumber(searchParams.get("curves"), 5, 2, 6));
    setMetric(parseMetric(searchParams.get("metric")));
    setOptionType(parseOptionType(searchParams.get("type")));
  }, [queryString, searchParams]);

  useEffect(() => {
    const next = new URLSearchParams();
    next.set("k", formatNumber(strike));
    next.set("r", formatNumber(rate, 3));
    next.set("sigma", formatNumber(volatility, 2));
    next.set("tmax", formatNumber(maxMaturity, 2));
    next.set("curves", formatNumber(curveCount));
    next.set("metric", metric);
    next.set("type", optionType);

    const nextString = next.toString();
    if (nextString !== queryString) {
      setSearchParams(next, { replace: true });
    }
  }, [
    strike,
    rate,
    volatility,
    maxMaturity,
    curveCount,
    metric,
    optionType,
    queryString,
    setSearchParams,
  ]);

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
              {controlsOpen ? "-" : "+"}
            </button>
          }
        >
          <div className="metric-switch">
            <button
              type="button"
              className={optionType === "call" ? "metric-button active" : "metric-button"}
              onClick={() => setOptionType("call")}
            >
              {t("blackScholesOptionCall")}
            </button>
            <button
              type="button"
              className={optionType === "put" ? "metric-button active" : "metric-button"}
              onClick={() => setOptionType("put")}
            >
              {t("blackScholesOptionPut")}
            </button>
          </div>

          <div className="metric-switch">
            <button
              type="button"
              className={metric === "price" ? "metric-button active" : "metric-button"}
              onClick={() => setMetric("price")}
            >
              {t("blackScholesMetricPrice")}
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
                  label={t("blackScholesStrikeLabel")}
                  min={20}
                  max={200}
                  step={1}
                  value={strike}
                  onChange={setStrike}
                />

                <SliderField
                  label={t("blackScholesRateLabel")}
                  min={0}
                  max={0.2}
                  step={0.005}
                  value={rate}
                  onChange={setRate}
                  formatValue={(v) => v.toFixed(3)}
                />

                <SliderField
                  label={t("blackScholesVolatilityLabel")}
                  min={0.01}
                  max={1}
                  step={0.01}
                  value={volatility}
                  onChange={setVolatility}
                  formatValue={(v) => v.toFixed(2)}
                />

                <SliderField
                  label={t("blackScholesMaxMaturityLabel")}
                  min={0.25}
                  max={20}
                  step={0.25}
                  value={maxMaturity}
                  onChange={setMaxMaturity}
                  formatValue={(v) =>
                    language === "hu"
                      ? `${v.toFixed(2)} év`
                      : `${v.toFixed(2)} years`
                  }
                />

                <SliderField
                  label={t("blackScholesCurveCountLabel")}
                  min={2}
                  max={6}
                  step={1}
                  value={curveCount}
                  onChange={setCurveCount}
                  formatValue={(v) =>
                    language === "hu"
                      ? `${v.toFixed(0)} db`
                      : `${v.toFixed(0)} curves`
                  }
                />
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <div className="stat-title">{t("blackScholesAtmExample")}</div>
                  <div className="stat-value">
                    {optionType === "call" ? "C" : "P"}(S=K, T=1) ≈ {atmPrice}
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">{t("blackScholesMaturityRange")}</div>
                  <div className="stat-value">
                    {maturities[0]?.toFixed(2)} {language === "hu" ? "év" : "years"} →{" "}
                    {maturities[maturities.length - 1]?.toFixed(2)}{" "}
                    {language === "hu" ? "év" : "years"}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="param-summary">
              <div>
                {t("blackScholesSummaryOption")} = {optionType}
              </div>
              <div>K = {strike}</div>
              <div>r = {rate.toFixed(3)}</div>
              <div>σ = {volatility.toFixed(2)}</div>
              <div>Tmax = {maxMaturity.toFixed(2)}</div>
              <div>
                {t("blackScholesSummaryCurves")} = {curveCount}
              </div>
              <div>
                {t("blackScholesSummaryMode")} = {metric}
              </div>
            </div>
          )}
        </SectionCard>
      </div>

      <div className="view-main">
        <SectionCard
          className="chart-card"
          title={getMetricTitle(metric, optionType, t)}
          subtitle={t("blackScholesChartSubtitle")}
          headerLeft={
            <button
              type="button"
              className="toggle-button"
              onClick={() => setChartOpen((prev) => !prev)}
            >
              {chartOpen ? "-" : "+"}
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
                    labelFormatter={(label) => `${t("blackScholesTooltipStock")} = ${label}`}
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
            <div className="param-summary">{t("blackScholesChartHidden")}</div>
          )}
        </SectionCard>

        <SectionCard
          title={t("blackScholesExplanationTitle")}
          subtitle={t("blackScholesExplanationSubtitle")}
        >
          <div className="text-block">
            {language === "hu" ? (
              <>
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
              </>
            ) : (
              <>
                <p>
                  This chart shows how the value and sensitivities of a European{" "}
                  {optionType === "call" ? "call" : "put"} option change as a function of
                  the stock price, for several different maturities. On the horizontal axis
                  you see the underlying price ({`S`}), and the curves show how the option
                  price or one of its Greeks behaves for different maturities under the same
                  parameter set.
                </p>

                <p>
                  The <strong>Price</strong> view shows the theoretical option value. For a
                  call, the option becomes more valuable as the stock price rises above the
                  strike, because the probability and magnitude of a positive terminal payoff
                  increase. For a put, the opposite holds: the option becomes more valuable
                  when the stock price falls below the strike. A longer maturity usually
                  means a higher value because there is more time for the price to move in a
                  favorable direction. This is the so-called <strong>time value</strong>.
                </p>

                <p>
                  The dashed vertical line marks the <strong>strike price</strong>. This area
                  is especially important because many sensitivity measures behave most
                  dramatically around it. When the option is close to at-the-money, even a
                  small move in the stock price can significantly change the expected terminal
                  outcome, so the option value and its Greeks are often most interesting there.
                </p>

                <p>
                  <strong>Delta</strong> shows approximately how much the option price changes
                  when the stock price moves by 1 unit. For a call, delta lies between 0 and
                  1: close to 0 when deeply out-of-the-money and close to 1 when deeply
                  in-the-money. Intuitively, this means a nearly worthless call barely reacts
                  to small stock moves, while a deep in-the-money call behaves almost like the
                  stock itself. For a put, delta is typically between -1 and 0: the more
                  in-the-money the put is, the closer delta gets to -1.
                </p>

                <p>
                  <strong>Gamma</strong> measures the rate of change of delta, meaning how
                  quickly delta changes as the stock price moves. Gamma is typically largest
                  around the strike, especially for shorter maturities. The intuition is that
                  near at-the-money, even a small stock move can flip the option more clearly
                  from one regime to another, so delta is most unstable there. Deep
                  in-the-money or out-of-the-money, gamma is usually small because delta is
                  already close to constant.
                </p>

                <p>
                  <strong>Vega</strong> measures how sensitive the option price is to changes
                  in implied or assumed volatility. Higher volatility generally increases the
                  value of both calls and puts, because under greater uncertainty the chance
                  of a favorable outcome is larger, while the buyer's downside remains
                  limited. Vega is often high around at-the-money and can also be more
                  significant for longer maturities, because uncertainty has more time to be
                  priced into the option value.
                </p>

                <p>
                  <strong>Theta</strong> shows the effect of the passage of time: it tells
                  you how the option price changes when all other parameters stay fixed while
                  the remaining time to maturity decreases. Theta is often negative for the
                  option buyer because time value gradually decays. This is especially
                  important near the strike, where the option still has substantial time
                  value. Close to short maturity this time decay can accelerate, so theta
                  curves often become steeper there.
                </p>

                <p>
                  <strong>Rho</strong> measures sensitivity to the interest rate. For call
                  options, a higher interest rate usually increases the option value, while
                  for put options it often decreases it. The reason is that the present value
                  of the future strike payment depends on the interest rate: at higher rates,
                  the present value of the future strike is lower. Rho is generally more
                  important for longer maturities because the interest-rate effect has more
                  time to accumulate.
                </p>

                <p>
                  Comparing curves with different maturities helps explain that the option
                  value depends not only on the current stock price, but also on how much
                  time remains until expiration. For shorter maturities the curves are often
                  sharper because there is less time for uncertainty to “work itself out.”
                  For longer maturities the curves are smoother and time value can play a
                  more dominant role.
                </p>

                <p>
                  Overall, the chart helps build intuition that option value is not driven by
                  a single factor. Stock price, time to maturity, volatility, and the
                  interest rate all affect value simultaneously. The Greeks describe the
                  “local sensitivities” of this system: they show which factor matters most
                  at a given point and in which direction it moves the option price.
                </p>
              </>
            )}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}