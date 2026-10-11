import { ChartContainer } from "../../components/layout";
import { useI18n } from "../../i18n";
import { histogram } from "./stochasticModels.math";

type Props = { values: ArrayLike<number> };

export default function TerminalDistribution({ values }: Props) {
  const { t } = useI18n();
  const { bins, minimum, maximum } = histogram(values);
  const max = Math.max(...bins.map((bin) => bin.count), 1);
  return (
    <ChartContainer
      className="stoch-distribution-frame"
      title={t("stochTerminalDistribution")}
    >
      <div
        className="stoch-histogram"
        role="img"
        aria-label={t("stochHistogramDescription", { paths: values.length })}
      >
        {bins.map((bin, index) => (
          <div
            className="stoch-histogram-bin"
            key={index}
            title={`${bin.center.toFixed(1)}: ${bin.count}`}
            style={{ height: `${(bin.count / max) * 100}%` }}
          />
        ))}
      </div>
      <div className="stoch-histogram-axis">
        <span>{minimum}</span>
        <span>{t("stochTerminalPosition")}</span>
        <span>{maximum}</span>
      </div>
    </ChartContainer>
  );
}
