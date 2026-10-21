import { BlockMath } from "react-katex";
import { Panel } from "../../../components/layout";
import { IntuitionTrigger } from "../../../components/intuition";
import { useI18n } from "../../../i18n";

/// Where the error comes from: the hedge is linear, the option is curved.
export default function HedgeExplainer() {
  const { t } = useI18n();
  return (
    <Panel title={t("deltaHedgingWhyTitle")} className="dh-why" actions={<><IntuitionTrigger sectionId="gamma" /><IntuitionTrigger sectionId="theta" /></>}>
      <ol className="dh-why-list">
        <li>{t("deltaHedgingWhy1")}</li>
        <li>{t("deltaHedgingWhy2")}</li>
        <li>{t("deltaHedgingWhy3")}</li>
      </ol>
      <BlockMath math={String.raw`\Delta V \approx \underbrace{\Delta\,\Delta S}_{\text{hedge}} + \tfrac12\,\Gamma\,(\Delta S)^2 + \Theta\,\Delta t`} />
      <BlockMath math={String.raw`\text{residual} \approx \tfrac12\,\Gamma\,\big[(\Delta S)^2 - \sigma^2 S^2\,\Delta t\big]`} />
      <p className="dh-caption">{t("deltaHedgingWhy4")}</p>
    </Panel>
  );
}
