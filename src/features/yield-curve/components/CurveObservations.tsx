import { useI18n } from "../../../i18n";
import type { TermPoint } from "../yieldCurve.types";
import { describeEffects } from "../effects.math";
import { IntuitionTrigger } from "../../../components/intuition";

export default function CurveObservations({ before, after }: { before: TermPoint; after: TermPoint }) {
  const { t } = useI18n();
  const observations = describeEffects(before, after);
  return (
    <div className="yc-observations">
      <h3>{t("ycTakeaways")} <IntuitionTrigger sectionId="local-amplification" /></h3>
      {observations.length ? (
        <ol>{observations.map(({ key, values }) => (
          <li key={key}>{Object.entries(values).reduce((text, [name, value]) =>
            text.replaceAll(`{${name}}`, value), t(key))}</li>
        ))}</ol>
      ) : <p>{t("ycTryEdit").replaceAll("{maturity}", after.label)}</p>}
    </div>
  );
}
