import type { ReactNode } from "react";
import { PageHeader, Panel, Workspace } from "../../../components/layout";
import { ControlGroup } from "../../../components/ui";
import { useI18n, type TranslationKey } from "../../../i18n";

export type SdeStat = { label: string; value: string };

type Props = {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  controls: ReactNode;
  stats: SdeStat[];
  children: ReactNode;
};

/// Shared frame of the SDE sub-pages: header, a controls + readouts panel and a stack of charts.
export default function SdeLayout({ titleKey, descKey, controls, stats, children }: Props) {
  const { t } = useI18n();
  return (
    <>
      <PageHeader title={t(titleKey)} description={t(descKey)} />
      <Workspace columns="sidebar">
        <Panel title={t("gbmControlsTitle")}>
          <div className="controls-grid">{controls}</div>
          <ControlGroup label={t("gbmMetricsLabel")}>
            <div className="stats-grid">
              {stats.map((s) => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-title">{s.label}</div>
                  <div className="stat-value">{s.value}</div>
                </div>
              ))}
            </div>
          </ControlGroup>
        </Panel>
        <div className="sde-stack">{children}</div>
      </Workspace>
    </>
  );
}
