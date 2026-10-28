import type { KeyboardEvent } from "react";
import { useI18n } from "../../../../i18n";
import { evKey, formatEventDate } from "../episodes.format";
import type { Episode } from "../episodes.types";

type Props = { episode: Episode; current: number; onJump: (index: number) => void };

/// Real-date events as a list; the current one is tinted, click or arrow keys jump the model to it.
export default function EpisodeTimeline({ episode, current, onJump }: Props) {
  const { t, language } = useI18n();
  const onKey = (e: KeyboardEvent<HTMLOListElement>) => {
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = Math.min(episode.events.length - 1, Math.max(0, current + step));
    onJump(next);
    e.currentTarget.querySelectorAll<HTMLButtonElement>("button")[next]?.focus();
  };
  return (
    <ol className="syrep-timeline" aria-label={t("syrEpTimelineAria")} onKeyDown={onKey}>
      {episode.events.map((ev, i) => (
        <li key={ev.key}>
          <button type="button" className={i === current ? "syrep-event is-current" : "syrep-event"} aria-current={i === current} tabIndex={i === Math.max(0, current) ? 0 : -1} onClick={() => onJump(i)}>
            <time dateTime={ev.date}>{formatEventDate(ev.date, language)}</time>
            <span>{t(evKey(ev.key, "title"))}</span>
          </button>
        </li>
      ))}
    </ol>
  );
}
