import type { ComponentType } from "react";
import { Tabs, type TabItem } from "../../../components/ui";
import { useI18n, type TranslationKey } from "../../../i18n";
import type { FfData, FfTabId, FfTabProps } from "../famaFrench.types";
import { FF_TABS } from "../famaFrench.url";
import { useFfPeriod } from "../useFfPeriod";
import PeriodBar from "./PeriodBar";
import FundTab from "./tabs/FundTab";
import AlphaTab from "./tabs/AlphaTab";
import SortTab from "./tabs/SortTab";
import CrossSectionTab from "./tabs/CrossSectionTab";

const TAB_VIEWS: Record<FfTabId, ComponentType<FfTabProps>> = {
  fund: FundTab,
  alpha: AlphaTab,
  sort: SortTab,
  cross: CrossSectionTab,
};

const TAB_LABELS: Record<FfTabId, TranslationKey> = {
  fund: "ffmTabFund",
  alpha: "ffmTabAlpha",
  sort: "ffmTabSort",
  cross: "ffmTabCross",
};

/// The loaded lab: shared sample period, the four tabs and the data attribution.
export default function FamaFrenchLab({ data }: { data: FfData }) {
  const { t } = useI18n();
  const { tab, window, setWindow, setTab } = useFfPeriod(data);
  const items: TabItem<FfTabId>[] = FF_TABS.map((id) => ({ id, label: t(TAB_LABELS[id]) }));
  const Active = TAB_VIEWS[tab];

  return (
    <div className="ffm-lab">
      <PeriodBar data={data} window={window} onChange={setWindow} />
      <Tabs<FfTabId> items={items} value={tab} onChange={setTab} ariaLabel={t("ffmTabsLabel")} />
      <Active data={data} window={window} />
      <p className="ffm-source">
        {t("ffmSource", { source: data.source, date: data.retrieved })}{" "}
        <a href={data.url} target="_blank" rel="noreferrer">
          {t("ffmSourceLink")}
        </a>
      </p>
    </div>
  );
}
