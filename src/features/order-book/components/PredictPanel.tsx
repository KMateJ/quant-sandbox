import { PredictReveal } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { previewMarket } from "../../../lib/market/book";
import { fmtTicks, touch } from "../orderBook.math";
import type { OrderBookLab } from "../useOrderBookLab";

/// Predict: drag the marker on the price ruler to where the market order will average, then reveal.
export default function PredictPanel({ lab }: { lab: OrderBookLab }) {
  const { t } = useI18n();
  const { question, pr, sim } = lab;
  const { bid, ask } = touch(sim.book);
  const isBuy = question.side === "buy";
  const far = previewMarket(sim.book, question.side, question.size * 2).rows.at(-1)?.price ?? (isBuy ? ask : bid) ?? 0;
  const near = (isBuy ? ask : bid) ?? far;
  const [lo, hi] = isBuy ? [near, far + 1] : [far - 1, near];
  const value = pr.guess ?? (isBuy ? lo : hi);
  const retry = () => (pr.revealed ? lab.nextRound() : pr.retry());

  return (
    <div className="obk-predict">
      <p className="obk-predict-q">{t(isBuy ? "obkPredictBuy" : "obkPredictSell", { n: question.size.toLocaleString("en-US") })}</p>
      <label className="obk-ruler">
        <span>{t("obkRulerLabel")}</span>
        <input type="range" min={lo} max={hi} step={0.1} value={value} disabled={pr.revealed}
          onChange={(e) => pr.setGuess(Number(e.target.value))} aria-valuetext={fmtTicks(value, 3)} />
        <span className="obk-ruler-ends"><span>{fmtTicks(lo)}</span><b>{pr.guess === null ? "–" : fmtTicks(pr.guess, 3)}</b><span>{fmtTicks(hi)}</span></span>
      </label>
      <PredictReveal
        state={{ ...pr, retry }}
        prompt={t("obkPredictPrompt")}
        format={(v) => (Math.abs(v) < 1000 ? `${v.toFixed(2)}¢` : fmtTicks(v, 3))}
        input="plot"
        explain={{
          question: t("obkExplainQ"),
          options: (["A", "B", "C"] as const).map((k) => ({ text: t(`obkExplain${k}`), feedback: t(`obkExplain${k}Fb`), correct: k === "B" })),
        }}
      />
    </div>
  );
}
