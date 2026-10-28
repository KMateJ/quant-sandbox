import { PageHeader, Workspace } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import EntityPanel from "../network/components/EntityPanel";
import MostSystemicPredict from "../network/components/MostSystemicPredict";
import NetworkPanel from "../network/components/NetworkPanel";
import StructureExplain from "../network/components/StructureExplain";
import SystemStats from "../network/components/SystemStats";
import { useNetworkPage } from "../network/useNetworkPage";

/// Network explorer: the editable network with filters and encodings, the selected institution, system numbers and the predict round.
export default function NetworkPage() {
  const { t } = useI18n();
  const m = useNetworkPage();
  return (
    <>
      <PageHeader title={t("syrTitle")} description={t("syrDesc")} />
      <SystemStats m={m} />
      <Workspace columns="single" className="syr-workspace">
        <NetworkPanel m={m} />
        <EntityPanel m={m} />
      </Workspace>
      <MostSystemicPredict />
      <StructureExplain />
    </>
  );
}
