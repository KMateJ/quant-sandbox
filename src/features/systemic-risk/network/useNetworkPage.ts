import { useCallback, useMemo, useState } from "react";
import { layoutFor } from "../../../components/charts/network/network.logic";
import { useUrlState } from "../../../components/useUrlState";
import { useI18n } from "../../../i18n";
import { UNIT_PRICES } from "../engine/accounting.math";
import { addEdit, applyEdits, decodeEdits, encodeEdits, type Edit } from "../engine/edits.math";
import { balance, systemicRanking } from "../engine/metrics.math";
import { presetNetwork, type PresetId } from "../engine/presets.math";
import type { ExposureType, InstKind } from "../engine/systemic.types";
import { KIND_ORDER, TYPE_ORDER, type EditTool } from "./network.types";
import { NETWORK_SCHEMA, formatSet, parseSet } from "./network.url";
import { instLabel, systemStats, toNetEdges, toNetNodes } from "./networkView.math";

/// What the exposure form is open for: a new link between two institutions, or an existing exposure.
export type FormTarget = { kind: "new"; lender: string; borrower: string } | { kind: "edit"; id: string };

const LAYOUT_BOX = { width: 900, height: 520 };
const ALL_KINDS = new Set<InstKind>(KIND_ORDER);
const ALL_TYPES = new Set<ExposureType>(TYPE_ORDER);

/// State of the network explorer: the network from the URL (`net`, `seed`, `edits`), its metrics, the chart data
/// for the current filters and encodings, and the edit actions that write back to the URL.
export function useNetworkPage() {
  const { t } = useI18n();
  const [s, set] = useUrlState(NETWORK_SCHEMA);
  const [tool, setTool] = useState<EditTool>("select");
  const [form, setForm] = useState<FormTarget | null>(null);

  const base = useMemo(() => presetNetwork(s.net as PresetId, s.seed, { degree: s.deg }), [s.net, s.seed, s.deg]);
  const edits = useMemo(() => decodeEdits(s.edits), [s.edits]);
  const net = useMemo(() => applyEdits(base, edits), [base, edits]);
  const ranking = useMemo(() => systemicRanking(net), [net]);
  const debtRank = useMemo(() => new Map(ranking.map((r) => [r.id, r.debtRank])), [ranking]);
  const stats = useMemo(() => systemStats(net, ranking), [net, ranking]);
  const kinds = useMemo(() => parseSet(s.kinds, KIND_ORDER), [s.kinds]);
  const types = useMemo(() => parseSet(s.types, TYPE_ORDER), [s.types]);
  const kindName = useCallback((k: InstKind) => t(`syrKind_${k}`), [t]);
  const shortName = useCallback((k: InstKind) => t(`syrKindShort_${k}`), [t]);

  const nodes = useMemo(
    () => toNetNodes(net, { sizeBy: s.size, colorBy: s.color, kinds, debtRank, label: shortName }),
    [net, s.size, s.color, kinds, debtRank, shortName],
  );
  const edges = useMemo(() => toNetEdges(net, types, new Set(nodes.map((n) => n.id))), [net, types, nodes]);
  // Positions come from the unedited network and fixed sizes, so edits and encodings never rearrange the picture.
  const positions = useMemo(() => {
    const flat = toNetNodes(base, { sizeBy: "assets", colorBy: "kind", kinds: ALL_KINDS });
    return layoutFor(flat, toNetEdges(base, ALL_TYPES), LAYOUT_BOX.width, LAYOUT_BOX.height, s.seed);
  }, [base, s.seed]);

  const selected = net.institutions.find((i) => i.id === s.sel) ?? null;
  const rank = selected ? ranking.findIndex((r) => r.id === selected.id) + 1 : 0;
  const metrics = selected ? balance(selected, net, UNIT_PRICES) : null;
  const labelOf = useCallback(
    (id: string) => {
      const inst = net.institutions.find((i) => i.id === id);
      return inst ? instLabel(inst, kindName) : id;
    },
    [net, kindName],
  );

  const writeEdits = (next: Edit[]) => set({ edits: encodeEdits(next) });
  const toggle = <T extends string>(current: ReadonlySet<T>, all: readonly T[], item: T) => {
    const next = new Set(current);
    if (next.has(item)) next.delete(item);
    else next.add(item);
    return formatSet(next.size ? next : new Set(all), all);
  };

  return {
    s, set, tool, setTool, form, setForm, base, net, edits, ranking, debtRank, stats, kinds, types,
    nodes, edges, positions, selected, rank, metrics, labelOf, kindName,
    select: (id: string | null) => set({ sel: id ?? "" }),
    setNet: (id: string) => { setForm(null); set({ net: id as PresetId, edits: "", sel: "" }); },
    toggleKind: (k: InstKind) => set({ kinds: toggle(kinds, KIND_ORDER, k) }),
    toggleType: (k: ExposureType) => set({ types: toggle(types, TYPE_ORDER, k) }),
    addExposure: (lender: string, borrower: string, type: ExposureType, amount: number) =>
      writeEdits([...edits, addEdit(edits, lender, borrower, type, amount)]),
    setAmount: (id: string, amount: number) =>
      writeEdits([...edits.filter((e) => !(e.op === "set" && e.id === id)), { op: "set", id, amount }]),
    deleteExposure: (id: string) => writeEdits([...edits, { op: "del", id }]),
    resetEdits: () => { setForm(null); set({ edits: "" }); },
  };
}

export type NetworkPageModel = ReturnType<typeof useNetworkPage>;
