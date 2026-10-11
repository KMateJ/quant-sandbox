import type { TranslationKey } from "../../i18n";
import type { ProjectMetrics, ProjectModel, TornadoRow } from "./npvIrr.types";
import { money, pct } from "./npvIrr.format";

export type Insight = { tone: "good" | "bad" | "info"; text: string };

type T = (key: TranslationKey) => string;

/// Replace {token} placeholders in a localized template string.
function fill(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

/// Short, state-aware explanations shown beside the model — never a static wall of text.
export function interpret(
  model: ProjectModel,
  metrics: ProjectMetrics,
  tornado: TornadoRow[],
  t: T
): Insight[] {
  const out: Insight[] = [];
  const vars = {
    npv: money(metrics.npv),
    irr: pct(metrics.irr),
    rate: pct(model.rate),
    pi: metrics.pi.toFixed(2),
  };
  const hasIrr = Number.isFinite(metrics.irr);

  if (metrics.npv > 1e-6 && hasIrr && metrics.irr > model.rate) {
    out.push({ tone: "good", text: fill(t("npvInsightAccept"), vars) });
  } else if (metrics.npv < -1e-6) {
    out.push({ tone: "bad", text: fill(t("npvInsightReject"), vars) });
  } else {
    out.push({ tone: "info", text: fill(t("npvInsightMarginal"), vars) });
  }

  if (!hasIrr) {
    out.push({ tone: "info", text: t("npvInsightNoIrr") });
  } else {
    const margin = metrics.irr - model.rate;
    out.push({
      tone: "info",
      text: fill(margin > 0.05 ? t("npvInsightBroad") : t("npvInsightNarrow"), vars),
    });
  }

  if (metrics.irrSecondary != null) {
    out.push({ tone: "info", text: t("npvInsightMultipleIrr") });
  }

  if (tornado.length > 0) {
    out.push({
      tone: "info",
      text: fill(t("npvInsightDriver"), { driver: t(driverKey(tornado[0].variable)) }),
    });
  }

  return out;
}

function driverKey(variable: TornadoRow["variable"]): TranslationKey {
  const map: Record<TornadoRow["variable"], TranslationKey> = {
    annual: "npvVarAnnual",
    rate: "npvVarRate",
    outlay: "npvVarOutlay",
    years: "npvVarYears",
    growth: "npvVarGrowth",
  };
  return map[variable];
}
