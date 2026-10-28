import { useMemo } from "react";
import { useI18n, type TranslationKey } from "../../../../i18n";
import type { Institution } from "../../engine/systemic.types";
import { assetExposures, failPreview, systemEquity } from "../shockPreview.math";
import { useGraphText } from "../useGraphText";
import type { ShocksPageState } from "../useShocksPage";

const bn = (v: number) => `$${v.toFixed(v >= 100 ? 0 : 1)}bn`;

/// "What you are about to hit": the facts behind the setup, before any day is played.
export default function ShockPreview({ page }: { page: ShocksPageState }) {
  const { t } = useI18n();
  const { nameOf } = useGraphText();
  const { net, fail, url } = page;
  const who = useMemo(() => (fail ? failPreview(net, fail) : null), [net, fail]);
  const assets = useMemo(() => assetExposures(net, url.drop), [net, url.drop]);
  const equity = useMemo(() => systemEquity(net), [net]);
  const nameById = (id: string | null) => {
    const inst: Institution | undefined = net.institutions.find((i) => i.id === id);
    return inst ? nameOf(inst) : "";
  };
  const hit = assets.reduce((s, a) => s + a.loss, 0);
  return (
    <div className="syr-shock-preview">
      <h3 className="syr-shock-sub">{t("syrShockPreview")}</h3>
      {who && fail && (
        <dl className="syr-shock-facts">
          <dt>{t("syrShockPvAssets")}</dt>
          <dd>{bn(who.assets)} · {t("syrShockPvShare", { pct: who.assetShare.toFixed(1) })}</dd>
          <dt>{t("syrShockPvLeverage")}</dt>
          <dd>{who.leverage.toFixed(1)}×</dd>
          <dt>{t("syrShockPvReach")}</dt>
          <dd>{who.reach.toFixed(0)}%</dd>
          <dt>{t("syrShockPvLenders")}</dt>
          <dd>{who.lenders}{who.biggestLender && ` · ${t("syrShockPvBiggest", { name: nameById(who.biggestLender.id), amount: bn(who.biggestLender.amount) })}`}</dd>
        </dl>
      )}
      <table className="syr-shock-holdings">
        <thead>
          <tr>
            <th scope="col">{t("syrShockPvAsset")}</th>
            <th scope="col">{t("syrShockPvHeld")}</th>
            <th scope="col">{t("syrShockPvLoss")}</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((a) => (
            <tr key={a.asset}>
              <th scope="row">
                {t(`syrShockAsset_${a.asset}` as TranslationKey)}
                {a.topHolder && <small>{t("syrShockPvTop", { name: nameById(a.topHolder) })}</small>}
              </th>
              <td>{bn(a.held)}</td>
              <td>{a.loss > 0 ? `−${bn(a.loss)}` : "–"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="syr-shock-hit">
        {hit > 0 ? t("syrShockPvHit", { loss: bn(hit), pct: ((100 * hit) / equity).toFixed(0) }) : t("syrShockPvNoHit", { equity: bn(equity) })}
      </p>
    </div>
  );
}
