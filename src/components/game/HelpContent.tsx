import { Fragment, useState, type ReactNode } from "react";
import { useI18n, type TranslationKey } from "../../i18n";
import { TONE_ORDER } from "../../lib/game/advice";
import type { AdviceTone } from "../../lib/game/game.types";

export type AdviceView = {
  id: string;
  tone: AdviceTone;
  title: string;
  body: string;
  action?: { label: string; run: () => void; disabled?: boolean };
};

const HEADS: Record<AdviceTone, TranslationKey> = {
  urgent: "gkAdvHeadUrgent", suggest: "gkAdvHeadSuggest", info: "gkAdvHeadInfo", done: "gkAdvHeadDone",
};
const TONES = (Object.keys(TONE_ORDER) as AdviceTone[]).sort((a, b) => TONE_ORDER[a] - TONE_ORDER[b]);

/// Next-move advice grouped by tone, with a live count of urgent items.
export function AdviceList({ items }: { items: AdviceView[] }) {
  const { t } = useI18n();
  const urgent = items.filter((a) => a.tone === "urgent").length;
  return (
    <div>
      <div aria-live="polite" className="gdesk-advice-count">{urgent > 0 ? `${t(HEADS.urgent)}: ${urgent}` : ""}</div>
      {items.length === 0 && <p className="gdesk-help-p">{t("gkAdvEmpty")}</p>}
      {TONES.map((tone) => {
        const group = items.filter((a) => a.tone === tone);
        if (group.length === 0) return null;
        return (
          <section key={tone}>
            <h3 className="gdesk-help-h">{t(HEADS[tone])}</h3>
            <ul className="gdesk-advice-list">
              {group.map((a) => (
                <li key={a.id} className={`gdesk-help-section gdesk-advice gdesk-help-tone--${a.tone}`}>
                  <strong className="gdesk-advice-title">{a.title}</strong>
                  <p className="gdesk-help-p">{a.body}</p>
                  {a.action && (
                    <div className="gdesk-help-actions">
                      <button type="button" className="gdesk-btn" disabled={a.action.disabled} onClick={a.action.run}>{a.action.label}</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

type WhatIfProps = {
  title: string;
  body?: string;
  rows: { label: string; value: string }[];
  verdicts: { text: string; tone: "good" | "bad" | "neutral" }[];
  /// Shown instead of the numbers when the scenario cannot run.
  block?: string;
  action?: { label: string; run: () => void };
  detail?: ReactNode;
};

const VERDICT_TONE = { good: "done", bad: "urgent", neutral: "info" } as const;

/// One what-if scenario: headline numbers, verdicts, optional detail and a "put in ticket" action.
export function WhatIfCard({ title, body, rows, verdicts, block, action, detail }: WhatIfProps) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <section className="gdesk-wi-card">
      <h3 className="gdesk-wi-title">{title}</h3>
      {block ? (
        <p className="gdesk-help-p gdesk-wi-block">{block}</p>
      ) : (
        <>
          {body && <p className="gdesk-help-p">{body}</p>}
          <dl className="gdesk-help-kv">
            {rows.map((r) => (
              <Fragment key={r.label}>
                <dt>{r.label}</dt>
                <dd>{r.value}</dd>
              </Fragment>
            ))}
          </dl>
          <ul className="gdesk-wi-verdicts">
            {verdicts.map((v) => <li key={v.text} className={`gdesk-help-tone--${VERDICT_TONE[v.tone]}`}>{v.text}</li>)}
          </ul>
          <div className="gdesk-help-actions">
            {detail && (
              <button type="button" className="gdesk-btn" aria-expanded={open} onClick={() => setOpen(!open)}>{t("gkWhatIfDetails")}</button>
            )}
            {action && <button type="button" className="gdesk-btn" onClick={action.run}>{action.label}</button>}
          </div>
          {open && detail && <div className="gdesk-wi-detail">{detail}</div>}
        </>
      )}
    </section>
  );
}
