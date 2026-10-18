import { useMemo, useState } from "react";
import SegmentedControl from "../../../../../components/ui/SegmentedControl";
import { useI18n } from "../../../../../i18n";
import { EULER_SETUP, eulerPath, exactPath, fineIncrements, strongErrors, type EulerSteps } from "../../../guide.interactive.eulerConvergence.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";
import EulerConvergenceErrors from "./EulerConvergenceErrors";
import EulerConvergencePaths from "./EulerConvergencePaths";

/// One Brownian path drives the exact GBM solution and Euler approximations with 4 to 256 steps.
export default function EulerConvergenceFigure() {
  const { t } = useI18n();
  const [n, setN] = useState<EulerSteps>(16);
  const [seed, setSeed] = useState(1);
  const [at, setAt] = useState<number | null>(null);
  const dW = useMemo(() => fineIncrements(seed), [seed]);
  const exact = useMemo(() => exactPath(dW), [dW]);
  const euler = useMemo(() => eulerPath(dW, n), [dW, n]);
  // Fixed seeds, independent of the path shown, so the error panel doesn't jump with "New path".
  const errors = useMemo(() => strongErrors(), []);
  const exactT = exact[exact.length - 1];
  const eulerT = euler[euler.length - 1];
  const exactAt = at === null ? NaN : exact[(at * EULER_SETUP.fine) / n];

  const changeN = (next: EulerSteps) => {
    setN(next);
    setAt(null);
  };

  return (
    <GuideFigure title={t("ixEuTitle")} labId="gbm">
      <div className="gf-toolbar ixeu-controls">
        <SegmentedControl<EulerSteps>
          options={EULER_SETUP.steps.map((s) => ({ value: s, label: t("ixEuSteps", { n: s }) }))}
          value={n}
          onChange={changeN}
          ariaLabel={t("ixEuStepsAria")}
        />
        <button type="button" className="preset-btn" onClick={() => setSeed((s) => s + 1)}>{t("ixEuNewPath")}</button>
      </div>
      <div className="ixeu-legend" aria-hidden="true">
        <span className="ixeu-key ixeu-key--exact">{t("ixEuExact")}</span>
        <span className="ixeu-key ixeu-key--euler">{t("ixEuEuler", { n })}</span>
      </div>
      <div className="gf-chart ixeu-paths">
        <EulerConvergencePaths exact={exact} euler={euler} at={at} onAt={setAt} />
      </div>
      <p className="ixeu-at-text" aria-live="polite">
        {at === null
          ? t("ixEuInspect")
          : t("ixEuAt", { t: fmt((at / n) * EULER_SETUP.T, 3), exact: fmt(exactAt, 2), euler: fmt(euler[at], 2), err: fmt(euler[at] - exactAt, 2) })}
      </p>
      <div className="ixeu-head">{t("ixEuErrorsHead")}</div>
      <div className="gf-chart ixeu-errors" role="img" aria-label={t("ixEuErrorsAria")}>
        <EulerConvergenceErrors errors={errors} current={n} />
      </div>
      <FigureReadout
        items={[
          { label: t("ixEuExactT"), value: fmt(exactT, 2) },
          { label: t("ixEuEulerT"), value: fmt(eulerT, 2) },
          { label: t("ixEuErrT"), value: fmt(eulerT - exactT, 2), tone: "strong" },
          { label: t("ixEuMeanErr", { n }), value: fmt(errors.find((e) => e.n === n)?.error ?? NaN, 2), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
