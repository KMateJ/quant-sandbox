import { PageHeader, Panel } from "../../components/layout";
import { useI18n } from "../../i18n";
import FamaFrenchLab from "./components/FamaFrenchLab";
import { useFamaFrenchData } from "./useFamaFrenchData";

export default function FamaFrenchView() {
  const { t } = useI18n();
  const { status, data } = useFamaFrenchData();

  return (
    <>
      <PageHeader title={t("ffmTitle")} description={t("ffmDesc")} />
      {data ? (
        <FamaFrenchLab data={data} />
      ) : (
        <Panel>
          <p className="control-hint" role="status">
            {t(status === "error" ? "ffmLoadError" : "ffmLoading")}
          </p>
        </Panel>
      )}
    </>
  );
}
