import { ParentSize } from "@visx/responsive";
import { ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { ladderRows, MAX_BARS_NARROW, type LadderRow } from "../swap.math";
import { money, rate, years } from "../swapFormat";
import type { SwapModel } from "../useSwap";
import LadderTable from "./LadderTable";
import LegLadderInner from "./LegLadderInner";

const HEIGHT = 280;

/// The cash-flow ladder and its table, linked by the selected payment. At phone width a swap with more than
/// twenty payments is shown per year so bars stay readable.
export default function LegLadder({ lab }: { lab: SwapModel }) {
  const { t } = useI18n();
  const narrow = useMediaQuery("(max-width: 640px)");
  if (!lab.derived) return null;
  const { payments } = lab.derived.legs;
  const byYear = narrow && payments.length > MAX_BARS_NARROW;
  const rows = ladderRows(payments, lab.spec.payer, byYear);
  const label = (r: LadderRow) =>
    t("irsLadderPoint", { t: years(r.t), fwd: rate(r.forward, 2), df: r.df.toFixed(4), pvFloat: money(r.pvFloating), pvFixed: money(r.pvFixed), net: money(r.net) });

  return (
    <ChartContainer title={t("irsLadderTitle")}>
      <p className="irs-legend">
        <span className="irs-key irs-key--floating" />{t("irsLegFloating")}
        <span className="irs-key irs-key--fixed" />{t("irsLegFixed")}
        <span className="irs-key irs-key--net" />{t("irsLegNet")}
        {byYear && <em>{t("irsByYear")}</em>}
      </p>
      <div style={{ height: HEIGHT }}>
        <ParentSize>
          {({ width }) => width > 0 && (
            <LegLadderInner rows={rows} width={width} height={HEIGHT} selected={lab.selected} onSelect={lab.setSelected}
              label={label} ariaLabel={t("irsLadderAria")} />
          )}
        </ParentSize>
      </div>
      <LadderTable rows={rows} selected={lab.selected} onSelect={lab.setSelected} />
    </ChartContainer>
  );
}
