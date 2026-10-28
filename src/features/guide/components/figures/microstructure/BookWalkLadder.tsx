import { useI18n } from "../../../../../i18n";
import { usd, type Walk } from "../../../guide.micro.limitOrderBook.math";
import { group } from "./bookWalkFormat";

type Props = { levels: { price: number; size: number }[]; walk: Walk; label: string };

/// The side of the book a market order hits, nearest level first; levels the order consumes are tinted and show how many shares it takes.
export default function BookWalkLadder({ levels, walk, label }: Props) {
  const { t } = useI18n();
  const taken = new Map(walk.rows.map((r) => [r.price, r]));
  return (
    <table className="gf-ms-limit-order-book-ladder" aria-label={label}>
      <thead>
        <tr>
          <th scope="col">{t("gfMsBookPrice")}</th>
          <th scope="col">{t("gfMsBookResting")}</th>
          <th scope="col">{t("gfMsBookCum")}</th>
          <th scope="col">{t("gfMsBookTake")}</th>
        </tr>
      </thead>
      <tbody>
        {levels.map((l, i) => {
          const row = taken.get(l.price);
          const cum = levels.slice(0, i + 1).reduce((s, x) => s + x.size, 0);
          return (
            <tr key={l.price} className={row ? "is-taken" : undefined}>
              <td>{usd(l.price).toFixed(2)}</td>
              <td>{group(l.size)}</td>
              <td>{group(cum)}</td>
              <td>{row ? group(row.take) : ""}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
