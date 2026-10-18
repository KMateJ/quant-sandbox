import { PageHeader, Workspace } from "../../components/layout";
import { useI18n } from "../../i18n";
import { useRiskReturnLab } from "./useRiskReturnLab";
import RiskReturnControls from "./components/RiskReturnControls";
import RiskReturnChart from "./components/RiskReturnChart";
import RiskReturnResults from "./components/RiskReturnResults";
import ReturnCalibration from "./components/ReturnCalibration";

export default function RiskReturnView() {
  const { t } = useI18n();
  const lab = useRiskReturnLab();
  const { mu, sigma, rf, w } = lab.state;

  return (
    <>
      <PageHeader title={t("riskReturnTitle")} description={t("riskReturnDesc")} />

      <Workspace columns="sidebar">
        <RiskReturnControls lab={lab} />

        <div className="module-main">
          <RiskReturnChart lab={lab} />
          <RiskReturnResults portReturn={lab.portReturn} portVol={lab.portVol} sharpe={lab.sharpe} weight={lab.state.w} />
          <ReturnCalibration portReturn={lab.portReturn} portVol={lab.portVol} resetKey={`${mu}|${sigma}|${rf}|${w}`} />
        </div>
      </Workspace>
    </>
  );
}
