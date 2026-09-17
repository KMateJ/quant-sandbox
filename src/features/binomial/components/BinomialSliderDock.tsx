import type { TreeMode } from "../binomial.types";
import { useI18n } from "../../../i18n";
import SliderDock, { type SliderDescriptor } from "../../../components/SliderDock";

type BinomialSliderDockProps = {
  mode: TreeMode;
  S0: number;
  K: number;
  u: number;
  d: number;
  r: number;
  q: number;
  h: number;
  steps: number;
  onS0Change: (value: number) => void;
  onKChange: (value: number) => void;
  onUChange: (value: number) => void;
  onDChange: (value: number) => void;
  onRChange: (value: number) => void;
  onQChange: (value: number) => void;
  onHChange: (value: number) => void;
  onStepsChange: (value: number) => void;
};

export default function BinomialSliderDock(props: BinomialSliderDockProps) {
  const { language, t } = useI18n();
  const isRates = props.mode === "rates";

  const sliders: SliderDescriptor[] = isRates
    ? [
        {
          key: "r0",
          symbol: "r₀",
          name: language === "hu" ? "r₀ (kezdeti rövid kamat)" : "r₀ (initial short rate)",
          value: props.r,
          min: 0,
          max: 0.3,
          step: 0.01,
          format: (v) => v.toFixed(2),
          onChange: props.onRChange,
        },
        {
          key: "q",
          symbol: "q",
          name: language === "hu" ? "q (up probability)" : "q (up probability)",
          value: props.q,
          min: 0,
          max: 1,
          step: 0.01,
          format: (v) => v.toFixed(2),
          onChange: props.onQChange,
        },
        {
          key: "h",
          symbol: "h",
          name: language === "hu" ? "h (log-lépésköz)" : "h (log step size)",
          value: props.h,
          min: 0.02,
          max: 0.7,
          step: 0.01,
          format: (v) => v.toFixed(2),
          onChange: props.onHChange,
        },
        {
          key: "steps",
          symbol: "N",
          name: t("binomialStepsLabel"),
          value: props.steps,
          min: 1,
          max: 8,
          step: 1,
          format: (v) => String(v),
          onChange: props.onStepsChange,
        },
      ]
    : [
        {
          key: "s0",
          symbol: "S₀",
          name: t("binomialS0Label"),
          value: props.S0,
          min: 20,
          max: 200,
          step: 1,
          format: (v) => String(v),
          onChange: props.onS0Change,
        },
        {
          key: "k",
          symbol: "K",
          name: t("binomialKLabel"),
          value: props.K,
          min: 20,
          max: 200,
          step: 1,
          format: (v) => String(v),
          onChange: props.onKChange,
        },
        {
          key: "u",
          symbol: "u",
          name: t("binomialULabel"),
          value: props.u,
          min: 1.01,
          max: 2,
          step: 0.01,
          format: (v) => v.toFixed(2),
          onChange: props.onUChange,
        },
        {
          key: "d",
          symbol: "d",
          name: t("binomialDLabel"),
          value: props.d,
          min: 0.1,
          max: 0.99,
          step: 0.01,
          format: (v) => v.toFixed(2),
          onChange: props.onDChange,
        },
        {
          key: "r",
          symbol: "r",
          name: t("binomialRLabel"),
          value: props.r,
          min: 0,
          max: 0.3,
          step: 0.01,
          format: (v) => v.toFixed(2),
          onChange: props.onRChange,
        },
        {
          key: "steps",
          symbol: "N",
          name: t("binomialStepsLabel"),
          value: props.steps,
          min: 1,
          max: 8,
          step: 1,
          format: (v) => String(v),
          onChange: props.onStepsChange,
        },
      ];

  return <SliderDock sliders={sliders} />;
}
