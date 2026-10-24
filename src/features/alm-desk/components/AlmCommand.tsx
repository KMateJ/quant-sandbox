import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CommandBar, QuoteStrip, money, pct, signed, signedMoney, type QuoteCell } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { yieldAt } from "../../immunization/immunization.math";
import { spreadBp } from "../deskView.math";
import type { AlmDeskModel } from "../useAlmDesk";

const tone = (x: number): QuoteCell["tone"] => (x > 0 ? "up" : x < 0 ? "down" : undefined);

/// Command bar (ticker, code, title, clock, view actions, Sandbox link) and the quote strip.
export default function AlmCommand({ desk, actions }: { desk: AlmDeskModel; actions: ReactNode }) {
  const { t } = useI18n();
  const { game } = desk.state;
  const { cfg, risk } = desk;
  const curve = game.curve;
  const last = game.history.at(-1)?.shock;
  const bp = (x: number) => `${signed(x)} bp`;
  const cells: QuoteCell[] = [
    { label: t("almdQ1y"), value: pct(yieldAt(curve, 1), 2) },
    { label: t("almdQ5y"), value: pct(yieldAt(curve, 5), 2) },
    { label: t("almdQ10y"), value: pct(yieldAt(curve, 10), 2) },
    { label: t("almdQ2s10s"), value: bp(spreadBp(curve, 2, 10)) },
    { label: t("almdQShock"), value: last ? t("almdShockValue", { p: bp(last.parallelBp), tw: bp(last.twistBp) }) : t("almdShockNone") },
    { label: t("almdQAssets"), value: money(risk.assets) },
    { label: t("almdQLiability"), value: money(risk.liability) },
    { label: t("almdQFunded"), value: pct(risk.funded, 1) },
    { label: t("almdQSurplus"), value: signedMoney(risk.surplus), tone: tone(Math.round(risk.surplus)) },
  ];
  const clock = t("almdClock", { n: game.round, years: cfg.years, left: cfg.years - game.round });
  return (
    <>
      <CommandBar
        ticker="PNSN Liability"
        code="ALMD <GO>"
        title={t("almdTitle")}
        clock={clock}
        demo={desk.demo}
        actions={
          <>
            {actions}
            <Link className="gdesk-cmd-btn" to="/sandbox">{t("gkSandboxLink")}</Link>
          </>
        }
      />
      <QuoteStrip id="almd-quotes" cells={cells} />
    </>
  );
}
