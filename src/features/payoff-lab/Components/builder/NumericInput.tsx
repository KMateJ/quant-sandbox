import { useEffect, useRef, useState } from "react";

function formatNumericValue(value: number | undefined, fallbackValue: number) {
  const resolved = typeof value === "number" && Number.isFinite(value)
    ? value
    : fallbackValue;
  return String(resolved);
}

function parseNumericDraft(raw: string): number | null {
  const normalized = raw.trim().replace(",", ".");
  if (!normalized) return null;

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

type NumericInputProps = {
  value: number | undefined;
  fallbackValue: number;
  onCommit: (value: number) => void;
  className?: string;
  selectOnFocus?: boolean;
  inputMode?: "numeric" | "decimal";
};

/// Text input that edits a number as a draft and commits on blur/Enter (Escape reverts).
export default function NumericInput({
  value,
  fallbackValue,
  onCommit,
  className = "payoff-input",
  selectOnFocus = true,
  inputMode = "numeric",
}: NumericInputProps) {
  const [draft, setDraft] = useState(() =>
    formatNumericValue(value, fallbackValue)
  );
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const shouldSelectOnPointerUpRef = useRef(false);

  useEffect(() => {
    if (!isEditing) {
      setDraft(formatNumericValue(value, fallbackValue));
    }
  }, [fallbackValue, isEditing, value]);

  function commitDraft() {
    const parsed = parseNumericDraft(draft);

    if (parsed === null) {
      setDraft(formatNumericValue(value, fallbackValue));
      return;
    }

    onCommit(parsed);
    setDraft(String(parsed));
  }

  return (
    <input
      ref={inputRef}
      className={className}
      type="text"
      inputMode={inputMode}
      enterKeyHint="done"
      autoComplete="off"
      spellCheck={false}
      value={draft}
      onFocus={() => {
        setIsEditing(true);

        if (!selectOnFocus) return;

        shouldSelectOnPointerUpRef.current = true;
        requestAnimationFrame(() => {
          inputRef.current?.select();
        });
      }}
      onPointerUp={(event) => {
        if (!shouldSelectOnPointerUpRef.current) return;

        event.preventDefault();
        shouldSelectOnPointerUpRef.current = false;
        inputRef.current?.select();
      }}
      onChange={(event) => {
        shouldSelectOnPointerUpRef.current = false;
        setDraft(event.target.value);
      }}
      onBlur={() => {
        shouldSelectOnPointerUpRef.current = false;
        setIsEditing(false);
        commitDraft();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.currentTarget.blur();
          return;
        }

        if (event.key === "Escape") {
          shouldSelectOnPointerUpRef.current = false;
          setIsEditing(false);
          setDraft(formatNumericValue(value, fallbackValue));
          event.currentTarget.blur();
        }
      }}
    />
  );
}
