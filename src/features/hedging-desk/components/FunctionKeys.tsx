import { useI18n } from "../../../i18n";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { FUNCTION_KEYS, keyEnabled, useFunctionKeys } from "../useFunctionKeys";

/// Day stepping, auto-hedge, new path and restart (also on F2–F9), plus the status line under the desk screen.
export default function FunctionKeys({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  useFunctionKeys(desk);
  return (
    <footer className="hdesk-footer">
      <div className="hdesk-keys" id="hd-keys" role="group" aria-label={t("hdKeysAria")}>
        {FUNCTION_KEYS.map((key) => (
          <button
            key={key.code}
            type="button"
            className="hdesk-fkey"
            disabled={!keyEnabled(key, desk)}
            aria-keyshortcuts={key.code}
            onClick={() => key.run(desk)}
          >
            <span className="hdesk-fkey-code">{key.code}</span>
            <span className="hdesk-fkey-label">{t(key.label)}</span>
          </button>
        ))}
      </div>
      <p className="hdesk-status">{t("hdStatusLine", { seed: desk.seed })}</p>
    </footer>
  );
}
