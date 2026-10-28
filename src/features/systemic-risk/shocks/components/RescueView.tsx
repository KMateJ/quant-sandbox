import { useMemo } from "react";
import { Panel, Workspace } from "../../../../components/layout";
import { useI18n } from "../../../../i18n";
import type { ShocksPageState } from "../useShocksPage";
import { chunkCount, RESCUE_CHUNK } from "../rescue.math";
import { useRescueGame } from "../useRescueGame";
import ContagionGraph from "./ContagionGraph";
import RescuePanel from "./RescuePanel";

/// Rescue mode: click institutions to place capital chunks, then run and compare with the rule-of-thumb policies.
export default function RescueView({ page }: { page: ShocksPageState }) {
  const { t } = useI18n();
  const { net, params, url } = page;
  const game = useRescueGame(net, params);
  const view = useMemo(() => {
    const end = game.shown.days.at(-1)!;
    const badges = Object.fromEntries([...new Set(game.placed)].map((id) => [id, `+${RESCUE_CHUNK * chunkCount(game.placed, id)}`]));
    return { status: end.status, badges };
  }, [game.shown, game.placed]);
  return (
    <Workspace columns="sidebar" className="syr-rescue-main">
      <Panel dominant flush title={t("syrShockRescueGraph")} footer={<p>{t(game.rows ? "syrShockRescueAfter" : "syrShockRescueBefore")}</p>}>
        <ContagionGraph net={net} view={view} onSelect={(id) => id && game.add(id)} ariaLabel={t("syrShockRescueAria")} layoutKey={`${url.net}${url.seed}`} />
      </Panel>
      <RescuePanel game={game} net={net} />
    </Workspace>
  );
}
