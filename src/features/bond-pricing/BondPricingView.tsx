import { useMemo, useState } from "react";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { Tabs } from "../../components/ui";
import { useI18n } from "../../i18n";
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

  const [face, setFace] = useState(100);
  const [coupon, setCoupon] = useState(0.05);
  const [years, setYears] = useState(10);
  const [freq, setFreq] = useState(2);
  const [ytm, setYtm] = useState(0.06);
  const [tab, setTab] = useState<TabId>("cashflows");

  const analytics = useMemo(
    () => analyzeBond({ face, couponRate: coupon, ytm, years, freq }),
    [face, coupon, ytm, years, freq]
  );

  return (
    <div className="intuition-on-demand">
      <PageHeader title={t("bondPricingTitle")} description={t("bondPricingDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("bondParamsTitle")}>
          <BondParameters
            face={face}
            coupon={coupon}
            years={years}
            freq={freq}
            ytm={ytm}
            maxYtm={MAX_YTM}
            onFace={setFace}
            onCoupon={setCoupon}
            onYears={setYears}
            onFreq={setFreq}
            onYtm={setYtm}
          />
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
                  coupon={coupon}
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
