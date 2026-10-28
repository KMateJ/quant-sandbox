import NetworkGraph from "../../../../components/charts/network/NetworkGraph";
import { Panel } from "../../../../components/layout";
import { SegmentedControl, Tabs } from "../../../../components/ui";
import { useMediaQuery } from "../../../../components/useMediaQuery";
import { useI18n } from "../../../../i18n";
import { useNetLabels } from "../useNetLabels";
import type { EditTool, ViewMode } from "../network.types";
import type { NetworkPageModel } from "../useNetworkPage";
import ExposureForm from "./ExposureForm";
import ExposureMatrix from "./ExposureMatrix";
import FilterLegend from "./FilterLegend";
import NetworkControls from "./NetworkControls";
import NodeSearch from "./NodeSearch";

/// The dominant figure: network graph or exposure matrix with the encodings, filters, search and edit tools.
export default function NetworkPanel({ m }: { m: NetworkPageModel }) {
  const { t } = useI18n();
  const labels = useNetLabels();
  const narrow = useMediaQuery("(max-width: 640px)");
  const { s, set, tool } = m;
  const connecting = s.edit && tool === "connect";
  const onConnect = (lender: string, borrower: string) => m.setForm({ kind: "new", lender, borrower });
  const onEdge = (id: string) => (tool === "delete" ? m.deleteExposure(id) : m.setForm({ kind: "edit", id }));
  const formKey = m.form ? (m.form.kind === "new" ? `${m.form.lender}>${m.form.borrower}` : m.form.id) : "none";

  const views = [{ id: "graph" as ViewMode, label: t("syrViewGraph") }, { id: "matrix" as ViewMode, label: t("syrViewMatrix") }];
  const tools = (["select", "connect", "delete"] as EditTool[]).map((v) => ({ value: v, label: t(`syrTool_${v}`) }));

  return (
    <Panel
      dominant
      title={t("syrNetworkTitle")}
      actions={
        <>
          <Tabs<ViewMode> segmented items={views} value={s.view} onChange={(view) => set({ view })} ariaLabel={t("syrViewLabel")} />
          <button type="button" className={s.edit ? "preset-btn preset-btn--active" : "preset-btn"} aria-pressed={s.edit} onClick={() => { set({ edit: !s.edit }); m.setForm(null); }}>
            {t("syrEditMode")}
          </button>
        </>
      }
    >
      <NetworkControls m={m} />
      <FilterLegend m={m} />
      <NodeSearch m={m} />
      {s.edit && (
        <div className="syr-edit-bar">
          <SegmentedControl<EditTool> ariaLabel={t("syrToolLabel")} value={tool} onChange={m.setTool} options={tools} />
          {m.edits.length > 0 && (
            <span className="syr-edited">
              {t("syrEdited", { count: m.edits.length })}{" "}
              <button type="button" className="syr-link" onClick={m.resetEdits}>{t("syrResetEdits")}</button>
            </span>
          )}
          <span className="control-hint">{t(`syrToolHint_${tool}`)}</span>
        </div>
      )}
      <ExposureForm key={formKey} m={m} />
      {s.view === "graph" ? (
        <div className="syr-graph">
          <NetworkGraph
            nodes={m.nodes}
            edges={m.edges}
            height={narrow ? 380 : 500}
            seed={s.seed}
            positions={m.positions}
            selectedId={s.sel || null}
            onSelect={m.select}
            onEdgeSelect={s.edit ? onEdge : undefined}
            connectMode={connecting}
            onConnect={s.edit ? onConnect : undefined}
            ariaLabel={t("syrGraphAria")}
            labels={labels}
          />
        </div>
      ) : (
        <ExposureMatrix m={m} />
      )}
    </Panel>
  );
}
