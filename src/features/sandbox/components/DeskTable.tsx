import { Link } from "react-router-dom";
import Panel from "../../../components/layout/Panel";
import { useI18n } from "../../../i18n";
import { DESK_MISSIONS } from "../sandbox.data";
import type { SandboxDesk } from "../useSandboxData";

/// One row per game desk: name, module, missions done and a link to open it.
export default function DeskTable({ desks }: { desks: SandboxDesk[] }) {
  const { t } = useI18n();
  return (
    <Panel id="sbx-desks" title={t("sbxDesksTitle")} className="gdesk-panel" flush>
      <div className="gdesk-scroll">
        <table className="gdesk-matrix sbx-table">
          <thead>
            <tr>
              <th scope="col">{t("sbxColDesk")}</th>
              <th scope="col">{t("sbxColModule")}</th>
              <th scope="col">{t("sbxColMissions")}</th>
              <th scope="col">{t("sbxColDone")}</th>
              <th scope="col" aria-label={t("sbxOpenDesk")} />
            </tr>
          </thead>
          <tbody>
            {desks.map((d) => (
              <tr key={d.deskId}>
                <th scope="row">{t(d.item.labelKey)}</th>
                <td>{t(d.module.navKey)}</td>
                <td>{d.completed.length} / {DESK_MISSIONS}</td>
                <td>{d.completed.length ? d.completed.join(" ") : "—"}</td>
                <td><Link to={d.item.to}>{t("sbxOpenDesk")}</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
