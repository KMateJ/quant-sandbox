import { ChartContainer } from "../../../components/layout";
import { ChallengeRecord, StatCard } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { YouQuote } from "../useYouQuote";
import { QUOTE_ROUND } from "../useYouQuote";
import { fmt3 } from "./gmChart";
import QuoteRuler from "./QuoteRuler";

type Props = { game: YouQuote; trueV: 0 | 1; scored: boolean };

const signed = (v: number) => `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(2)}`;

/// You quote before each trade against a Bayes rival; after 20 trades V and your P&L are revealed.
export default function YouQuotePanel({ game, trueV, scored }: Props) {
  const { t } = useI18n();
  const last = game.outcomes[game.outcomes.length - 1];
  const lastStep = game.index > 0 ? game.path[game.index - 1] : null;
  return (
    <ChartContainer
      title={t(scored ? "glmChallengeTitle" : "glmYouQuoteTitle")}
      actions={<button type="button" className="preset-btn" onClick={game.restart}>{t("glmRestart")}</button>}
    >
      <p className="glm-caption">{t("glmYouQuoteHelp")}</p>
      <div className="glm-youquote">
        <QuoteRuler quote={game.quote} onChange={game.setQuote} belief={game.mu} disabled={game.done} />
        <div className="glm-youquote-side">
          <p className="glm-log-line" aria-live="polite">
            {last && lastStep
              ? t(last.won ? "glmYouWon" : "glmRivalWon", {
                  side: t(last.trade === "B" ? "glmBuyWord" : "glmSellWord"),
                  price: fmt3(last.price),
                  bayesBid: fmt3(lastStep.bid),
                  bayesAsk: fmt3(lastStep.ask),
                })
              : t("glmYouQuoteStart")}
          </p>
          <button type="button" className="preset-btn glm-commit" onClick={game.commit} disabled={game.done}>
            {t("glmQuoteBtn", { n: Math.min(game.index + 1, QUOTE_ROUND), total: QUOTE_ROUND })}
          </button>
          <div className="glm-readouts">
            <StatCard label={t("glmMeanError")} value={fmt3(game.error)} />
            <StatCard label={t("glmTradesWon")} value={`${game.won} / ${game.index}`} />
            <StatCard label={t("glmPublicBelief")} value={fmt3(game.mu)} />
          </div>
          {game.done && game.pnl !== null && (
            <p className="glm-result">
              {t("glmRoundDone", { v: trueV, pnl: signed(game.pnl) })} {scored ? t(game.hit ? "glmHit" : "glmMiss") : ""}
            </p>
          )}
          {scored && <ChallengeRecord id={game.challengeId} />}
        </div>
      </div>
    </ChartContainer>
  );
}
