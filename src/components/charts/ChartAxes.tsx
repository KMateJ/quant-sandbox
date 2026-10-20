import { AxisBottom, AxisLeft } from "@visx/axis";
import type { ScaleLinear } from "@visx/vendor/d3-scale";
import { CHART_COLORS } from "./chart.theme";
import { estimateTextWidth } from "./labels.logic";
import { edgeAnchor, thinTicks, tickCount } from "./ticks.logic";

type Props = {
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  innerW: number;
  innerH: number;
  isMobile: boolean;
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  /// Explicit tick positions win over the width-based count, but are thinned so their labels never touch.
  xTickValues?: number[];
  yNumTicks?: number;
};

/// The subset of `values` whose formatted labels fit along the x axis without touching, allowing for the
/// edge labels being anchored inward.
function fitTicks(values: number[], xScale: Props["xScale"], innerW: number, format: Props["xFormat"], fontSize: number): number[] {
  const widths = values.map((v) => estimateTextWidth(format ? format(v) : String(v), fontSize));
  const centres = values.map((v, i) => {
    const pos = xScale(v);
    const anchor = edgeAnchor(pos, innerW);
    return anchor === "start" ? pos + widths[i] / 2 : anchor === "end" ? pos - widths[i] / 2 : pos;
  });
  return thinTicks(centres, widths).map((i) => values[i]);
}

/// Bottom and left axes shared by the line and scatter charts. The tick count follows the plot's own
/// size (a narrow chart in a desktop column gets few ticks) and the edge labels anchor inward so
/// they are never clipped.
export default function ChartAxes({ xScale, yScale, innerW, innerH, isMobile, xFormat, yFormat, xTickValues, yNumTicks }: Props) {
  const fontSize = isMobile ? 11 : 12;
  const stroke = CHART_COLORS.axis;
  const fitted = xTickValues && fitTicks(xTickValues, xScale, innerW, xFormat, fontSize);
  return (
    <>
      <AxisBottom
        top={innerH}
        scale={xScale}
        tickValues={fitted}
        numTicks={tickCount(innerW, 48, 2, 8)}
        tickFormat={xFormat && ((v) => xFormat(Number(v)))}
        stroke={stroke}
        tickStroke={stroke}
        tickLabelProps={(value) => ({ fill: stroke, fontSize, textAnchor: edgeAnchor(xScale(Number(value)), innerW) })}
      />
      <AxisLeft
        scale={yScale}
        numTicks={yNumTicks ?? tickCount(innerH, 28, 2, 7)}
        tickFormat={yFormat && ((v) => yFormat(Number(v)))}
        stroke={stroke}
        tickStroke={stroke}
        tickLabelProps={() => ({ fill: stroke, fontSize, textAnchor: "end", dx: "-0.25em", dy: "0.25em" })}
      />
    </>
  );
}
