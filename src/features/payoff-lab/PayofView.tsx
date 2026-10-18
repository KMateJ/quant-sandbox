import { useSearchParams } from "react-router-dom";
import { useI18n } from "../../i18n";
import { PageHeader } from "../../components/layout";
import { Tabs } from "../../components/ui";
import StrategyLab from "./StrategyLab";
import ReplicationLab from "./replication/components/ReplicationLab";
import { useReplication } from "./replication/useReplication";
import { buildSearchParams } from "./payoff.url";
import type { PositionGroup, StrategyLeg } from "./payoff.types";

type Lab = "builder" | "replicate";

export default function PayoffView() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const lab: Lab = searchParams.get("lab") === "replicate" ? "replicate" : "builder";
  // Lives here so the drawn payoff survives switching tabs.
  const replication = useReplication(lab === "replicate");

  const setLab = (next: Lab) =>
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next === "replicate") params.set("lab", "replicate");
      else params.delete("lab");
      return params;
    }, { replace: true });

  const openInBuilder = (next: { legs: StrategyLeg[]; groups: PositionGroup[] }, showComponents: boolean) => {
    setSearchParams(buildSearchParams("payoff", showComponents, null, next.legs, next.groups));
    window.scrollTo({ top: 0 });
  };

  return (<>
    <PageHeader
      title={t("navPayoff")}
      actions={
        <Tabs<Lab>
          segmented
          items={[
            { id: "builder", label: t("payoffLabTabBuilder") },
            { id: "replicate", label: t("payoffLabTabReplicate") },
          ]}
          value={lab}
          onChange={setLab}
          ariaLabel={t("payoffLabTabsAria")}
        />
      }
    />
    {lab === "replicate"
      ? <ReplicationLab model={replication} onOpenInBuilder={openInBuilder} />
      : <StrategyLab />}
  </>);
}
