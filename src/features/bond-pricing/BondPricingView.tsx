import { useMemo } from "react";
import { PageHeader, Workspace, Panel, ChartContainer } from "../../components/layout";
import { Tabs } from "../../components/ui";
import { useUrlState } from "../../components/useUrlState";
import { useI18n } from "../../i18n";
import { analyzeStream, regularCoupon, withFlow } from "./bondPricing.math";
import { BOND_SCHEMA, activeFlows, bondPatch, customFlows, type BondTab as TabId } from "./bondPricing.url";
import BondParameters from "./Components/BondParameters";
import BondMetrics from "./Components/BondMetrics";
import CashFlowTimeline from "./Components/CashFlowTimeline";
import PresentValueTable from "./Components/PresentValueTable";
import PriceYieldExplorer from "./Components/PriceYieldExplorer";
import PullToPar from "./Components/PullToPar";
import { IntuitionTrigger } from "../../components/intuition";

const MAX_YTM = 0.2;
const TAB_TITLE = { cashflows: "bondTimelineTitle", "price-yield": "bondPyTitle", "pull-to-par": "bondTabPullToPar" } as const;

export default function BondPricingView() {
  const { t } = useI18n();

  // `state` keeps its identity until the URL changes, so it is a safe memo dependency.
  const [state, setState] = useUrlState(BOND_SCHEMA);
  const { bond, tab, cf } = useMemo(() => {
    const { tab, cf, ...bond } = state;
    return { bond, tab, cf };
  }, [state]);
  const isCustom = customFlows(bond, cf) !== null;
  const flows = useMemo(() => activeFlows(bond, cf), [bond, cf]);
  // Reads the flows from the latest URL state, so fast drags and key repeats never build on a stale stream.
  const setFlow = (index: number, value: number) =>
    setState((s) => ({ cf: withFlow(activeFlows(s, s.cf), index, value) }));

  const setYtm = (ytm: number) => setState({ ytm });
  const setTab = (next: TabId) => setState({ tab: next });

  const { face, couponRate, freq, ytm } = bond;

  const analytics = useMemo(() => analyzeStream(flows, regularCoupon(bond), ytm, freq), [flows, bond, ytm, freq]);

  return (
    <div className="intuition-on-demand">
      <PageHeader title={t("bondPricingTitle")} description={t("bondPricingDesc")} />

      <Workspace columns="sidebar">
        <Panel title={t("bondParamsTitle")}>
          <BondParameters bond={bond} maxYtm={MAX_YTM} onChange={(patch) => setState(bondPatch(patch))} />
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
              {t(TAB_TITLE[tab])}{" "}
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
                  { id: "pull-to-par", label: t("bondTabPullToPar") },
                ]}
              />
            }
          >
            {tab === "cashflows" && (
              <CashFlowTimeline rows={analytics.rows} face={face} custom={isCustom}
                onFlow={setFlow} onReset={() => setState({ cf: null })} />
            )}
            {tab === "pull-to-par" && <PullToPar bond={bond} />}
            {tab === "price-yield" && (
              <div className="chart-wrap">
                <PriceYieldExplorer
                  face={face}
                  coupon={couponRate}
                  flows={flows}
                  custom={isCustom}
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
