import { useI18n } from "../../../i18n";
import type { PortfolioMetrics } from "../portfolioLab.types";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

type Props = {
  current: PortfolioMetrics;
  diversification: number;
};

/// Four-stat summary strip (return, volatility, Sharpe, diversification benefit).
export default function PortfolioMetricStrip({ current, diversification }: Props) {
  const { t } = useI18n();
  return (
    <div className="metric-strip">
      <div className="stat-card">
        <div className="stat-title">{t("portfolioReturn")}</div>
        <div className="stat-value">{pct(current.ret)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-title">{t("portfolioVol")}</div>
        <div className="stat-value">{pct(current.vol)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-title">{t("portfolioSharpe")}</div>
        <div className="stat-value">{current.sharpe.toFixed(2)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-title">{t("portfolioDiversification")}</div>
        <div className="stat-value">{pct(diversification)}</div>
      </div>
    </div>
  );
}
