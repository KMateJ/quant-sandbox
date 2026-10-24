import { useI18n } from "../../../i18n";
import { num } from "../../../components/game/gameFormat";
import type { OptionType } from "../engine/desk.types";
import { optionId } from "../engine/instruments.math";
import { instrumentLabel } from "../sidePanels.math";
import type { HedgingDeskModel } from "../useHedgingDesk";

type Props = { desk: HedgingDeskModel; strike: number; atm: boolean; readOnly: boolean };

/// One strike: call quote button | strike | put quote button.
export default function ChainRow({ desk, strike, atm, readOnly }: Props) {
  const { t } = useI18n();
  const side = (type: OptionType) => {
    const id = optionId(type, strike);
    const q = desk.quote(id);
    const selected = desk.ticket.id === id;
    const label = t("hdSideChainPick", {
      inst: instrumentLabel(id),
      bid: num(q.bid, 2),
      ask: num(q.ask, 2),
      delta: num(q.delta, 2),
    });
    return (
      <button
        type="button"
        className={`hdesk-chain-side hdesk-chain-side--${type}`}
        aria-label={label}
        aria-pressed={selected}
        disabled={readOnly}
        onClick={() => desk.setTicketId(id)}
      >
        <span className="gdesk-num">{num(q.bid, 2)}</span>
        <span className="gdesk-num">{num(q.ask, 2)}</span>
        <span className="gdesk-num hdesk-chain-delta">{num(q.delta, 2)}</span>
      </button>
    );
  };
  return (
    <div className={`hdesk-chain-row ${atm ? "hdesk-chain-row--atm" : ""}`}>
      {side("C")}
      <span className="hdesk-chain-strike gdesk-num">{num(strike, 1)}</span>
      {side("P")}
    </div>
  );
}
