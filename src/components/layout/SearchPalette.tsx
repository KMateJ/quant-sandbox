import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useI18n } from "../../i18n";
import { searchItems } from "./search.logic";
import { useSearchItems } from "./useSearchItems";

type Props = { onClose: () => void };

/// Modal palette over every lab and lesson; ↑/↓ move, Enter opens, Esc closes.
export default function SearchPalette({ onClose }: Props) {
  const { t } = useI18n();
  const navigate = useNavigate();
  const items = useSearchItems();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const results = useMemo(() => searchItems(items, query), [items, query]);
  const groups = [
    { key: "searchLabs", rows: results.filter((r) => r.kind === "lab") },
    { key: "searchLessons", rows: results.filter((r) => r.kind === "lesson") },
  ] as const;
  const flat = groups.flatMap((g) => g.rows);
  const optionId = (i: number) => `${listId}-${i}`;

  useEffect(() => inputRef.current?.focus(), []);

  const open = (index: number) => {
    const target = flat[index];
    if (!target) return;
    navigate(target.href);
    onClose();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "Tab") e.preventDefault();
    else if (e.key === "Enter") open(active);
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (flat.length) setActive((i) => (i + (e.key === "ArrowDown" ? 1 : -1) + flat.length) % flat.length);
    }
  };

  let index = -1;
  return createPortal(
    <div className="search-backdrop" onMouseDown={onClose}>
      <div
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label={t("searchTitle")}
        onMouseDown={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <input
          ref={inputRef}
          className="search-input"
          role="combobox"
          aria-expanded={flat.length > 0}
          aria-controls={listId}
          aria-activedescendant={flat.length ? optionId(active) : undefined}
          aria-autocomplete="list"
          value={query}
          placeholder={t("searchPlaceholder")}
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
          }}
        />
        <div id={listId} role="listbox" className="search-results">
          {query.trim() && flat.length === 0 && <p className="search-empty">{t("searchEmpty", { query: query.trim() })}</p>}
          {groups.map((g) =>
            g.rows.length ? (
              <div key={g.key} role="group" aria-label={t(g.key)}>
                <div className="search-group">{t(g.key)}</div>
                {g.rows.map((row) => {
                  const i = ++index;
                  return (
                    <div
                      key={row.id}
                      id={optionId(i)}
                      role="option"
                      aria-selected={i === active}
                      className={i === active ? "search-option active" : "search-option"}
                      onMouseEnter={() => setActive(i)}
                      onClick={() => open(i)}
                    >
                      <span className="search-option-title">{row.title}</span>
                      <span className="search-option-context">{row.context}</span>
                    </div>
                  );
                })}
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
