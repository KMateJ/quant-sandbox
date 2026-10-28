import { useId, useState } from "react";
import { useI18n } from "../../../../i18n";
import type { NetworkPageModel } from "../useNetworkPage";

/// Type a label ("Bank C") to select that institution; the suggestions list every label.
export default function NodeSearch({ m }: { m: NetworkPageModel }) {
  const { t } = useI18n();
  const id = useId();
  const [text, setText] = useState("");
  const labels = m.net.institutions.map((i) => ({ id: i.id, label: m.labelOf(i.id) }));

  const change = (value: string) => {
    setText(value);
    const q = value.trim().toLowerCase();
    if (!q) return;
    const exact = labels.find((l) => l.label.toLowerCase() === q);
    const partial = labels.filter((l) => l.label.toLowerCase().includes(q));
    const hit = exact ?? (partial.length === 1 ? partial[0] : undefined);
    if (hit) m.select(hit.id);
  };

  return (
    <div className="syr-search">
      <label htmlFor={id}>{t("syrSearch")}</label>
      <input id={id} type="search" list={`${id}-list`} value={text} onChange={(e) => change(e.target.value)} placeholder={t("syrSearchPlaceholder")} />
      <datalist id={`${id}-list`}>{labels.map((l) => <option key={l.id} value={l.label} />)}</datalist>
    </div>
  );
}
