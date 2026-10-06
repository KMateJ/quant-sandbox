import SliderDock, { type SliderDescriptor } from "../../../components/SliderDock";

export default function BinomialSliderDock({ sliders }: { sliders: SliderDescriptor[] }) {
  return <SliderDock sliders={sliders} chartSelector=".chart-wrap, .binomial-svg-wrap" />;
}
