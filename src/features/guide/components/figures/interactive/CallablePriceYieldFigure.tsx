import { useMemo, useState } from "react";
import { ParentSize } from "@visx/responsive";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { callableQuote, priceCurves, type Protection } from "../../../guide.interactive.callablePriceYield.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import CallablePriceYieldChart from "./CallablePriceYieldChart";

/// A 10-year 6% bond callable at 100: straight and callable price curves, the call's value between them,
/// and a draggable yield whose tangent shows where the callable curve bends the wrong way.
export default function CallablePriceYieldFigure() {
  const { t } = useI18n();
  const [protection, setProtection] = useState<Protection>(3);
  const [y, setY] = useState(0.05);
  const curve = useMemo(() => priceCurves(protection), [protection]);
  const quote = useMemo(() => callableQuote(y, protection), [y, protection]);

  return (
    <GuideFigure title={t("ixCbTitle")} labId="callable-bond">
      <div className="gf-toolbar">
        <SegmentedControl<Protection>
          ariaLabel={t("ixCbProtection")}
          value={protection}
          onChange={setProtection}
          options={[
            { value: 1, label: t("ixCbProtection1") },
            { value: 3, label: t("ixCbProtection3") },
            { value: 5, label: t("ixCbProtection5") },
          ]}
        />
        <span className="cb-hint">{t("ixCbHint")}</span>
      </div>
      <div className="cb-chart-wrap">
        <ParentSize debounceTime={0}>
          {({ width }) => (width > 0 ? <CallablePriceYieldChart curve={curve} y={y} quote={quote} onChange={setY} width={width} /> : null)}
        </ParentSize>
      </div>
      <ul className="cb-legend">
        <li><span className="cb-swatch cb-swatch--straight" />{t("ixCbStraight")}</li>
        <li><span className="cb-swatch cb-swatch--callable" />{t("ixCbCallable")}</li>
        <li><span className="cb-swatch cb-swatch--gap" />{t("ixCbCallValue")}</li>
        <li><span className="cb-swatch cb-swatch--tangent" />{t("ixCbTangent")}</li>
      </ul>
      <FigureReadout
        items={[
          { label: t("ixCbYield"), value: pct(y, 2) },
          { label: t("ixCbStraightPrice"), value: fmt(quote.straight, 2) },
          { label: t("ixCbCallablePrice"), value: fmt(quote.callable, 2), tone: "strong" },
          { label: t("ixCbCallValue"), value: fmt(quote.call, 2), tone: "accent" },
          { label: t("ixCbYtm"), value: pct(quote.ytm, 2) },
          { label: t("ixCbYtc"), value: pct(quote.ytc, 2) },
          { label: t("ixCbYtw"), value: pct(quote.ytw, 2) },
          { label: t("ixCbDuration"), value: fmt(quote.duration, 2) },
          { label: t("ixCbConvexity"), value: fmt(quote.convexity, 1) },
        ]}
      />
    </GuideFigure>
  );
}
