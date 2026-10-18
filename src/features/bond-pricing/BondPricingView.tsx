import { useCallback, useMemo, useState } from "react";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { Tabs } from "../../components/ui";
import { useI18n } from "../../i18n";
import type { BondSpec } from "../../lib/finance/bond";
import { analyzeBond } from "./bondPricing.math";
import BondParameters from "./Components/BondParameters";
import BondMetrics from "./Components/BondMetrics";
import CashFlowTimeline from "./Components/CashFlowTimeline";
import PresentValueTable from "./Components/PresentValueTable";
import PriceYieldExplorer from "./Components/PriceYieldExplorer";
import { IntuitionTrigger } from "../../components/intuition";

const MAX_YTM = 0.2;
type TabId = "cashflows" | "price-yield";

export default function BondPricingView() {
  const { t } = useI18n();

  const [bond, setBond] = useState<BondSpec>({
    face: 100,
    couponRate: 0.05,
    years: 10,
    freq: 2,
    ytm: 0.06,
  });
  const [tab, setTab] = useState<TabId>("cashflows");

  const patchBond = useCallback(
    (patch: Partial<BondSpec>) => setBond((prev) => ({ ...prev, ...patch })),
    []
  );
  const setYtm = useCallback((ytm: number) => patchBond({ ytm }), [patchBond]);

  const { face, couponRate, years, freq, ytm } = bond;

  const analytics = useMemo(() => analyzeBond(bond), [bond]);

  return (
    <div className="intuition-on-demand">
      <PageHeader title={t("bondPricingTitle")} description={t("bondPricingDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("bondParamsTitle")}>
          <BondParameters bond={bond} maxYtm={MAX_YTM} onChange={patchBond} />
        </Panel>

        <div className="module-main">
          <BondMetrics
            cleanPrice={analytics.price}
            face={face}
            ytm={ytm}
            macaulay={analytics.macaulay}
            modified={analytics.modified}
            convexity={analytics.convexity}
          />

          <ChartContainer
            title={<span className="intuition-reveal">
              {tab === "cashflows" ? t("bondTimelineTitle") : t("bondPyTitle")}{" "}
              <IntuitionTrigger sectionId={tab === "cashflows" ? "cash-flows" : "price-yield"} />
            </span>}
            actions={
              <Tabs
                segmented
                ariaLabel={t("bondParamsTitle")}
                value={tab}
                onChange={(id) => setTab(id as TabId)}
                items={[
                  { id: "cashflows", label: t("bondTabCashflows") },
                  { id: "price-yield", label: t("bondTabPriceYield") },
                ]}
              />
            }
          >
            {tab === "cashflows" ? (
              <CashFlowTimeline rows={analytics.rows} />
            ) : (
              <div className="chart-wrap">
                <PriceYieldExplorer
                  face={face}
                  coupon={couponRate}
                  years={years}
                  freq={freq}
                  ytm={ytm}
                  price={analytics.price}
                  modified={analytics.modified}
                  convexity={analytics.convexity}
                  maxYtm={MAX_YTM}
                  onYtm={setYtm}
                />
              </div>
            )}
          </ChartContainer>

          {tab === "cashflows" && (
            <PresentValueTable rows={analytics.rows} price={analytics.price} />
          )}
        </div>
      </Workspace>
    </div>
  );
}
