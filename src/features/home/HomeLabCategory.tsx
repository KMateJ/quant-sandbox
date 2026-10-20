import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { CATEGORY_DESC_KEYS, CATEGORY_LABEL_KEYS, type ModuleDef } from "../../modules/registry";
import { guideTrackById, guideTrackPath, trackLessons } from "../guide/guide.meta";
import type { LabCategory } from "./home.data";
import { categoryNumber, labDescKey, orderTiles } from "./home.model";
import { GUIDE_FILLER_VIZ, MODULE_VIZ } from "./home.viz";
import HomeLabTile from "./HomeLabTile";

type Props = { category: LabCategory; index: number; mods: ModuleDef[]; guideFiller: boolean };

/// One area of the labs index: numbered header, track link and its ruled bento of tiles.
export default function HomeLabCategory({ category, index, mods, guideFiller }: Props) {
  const { t } = useI18n();
  const track = guideTrackById(category);
  const trackName = t(track.titleKey);
  const lessonCount = trackLessons(track).length;
  const tiles = orderTiles(index, mods.map((m) => ({ id: m.id, featured: Boolean(m.homeFeatured) })));

  return (
    <section className="home-category">
      <header className="home-category-head">
        <span className="home-category-num">{categoryNumber(index)}</span>
        <h3 className="home-category-name">{t(CATEGORY_LABEL_KEYS[category])}</h3>
        <p className="home-category-desc">{t(CATEGORY_DESC_KEYS[category])}</p>
        <Link to={guideTrackPath(category)} className="home-link">
          {t("homeCategoryGuide", { track: trackName, n: lessonCount })}
        </Link>
      </header>
      <div className="home-bento">
        {tiles.map((tile) => {
          const m = mods.find((x) => x.id === tile.id)!;
          return (
            <HomeLabTile
              key={tile.id}
              code={tile.code}
              to={m.path}
              name={t(m.navKey)}
              desc={t(labDescKey(m.id))}
              viz={MODULE_VIZ[m.id]}
              status={m.status}
              featured={tile.featured}
            />
          );
        })}
        {guideFiller && (
          <HomeLabTile
            code={`${categoryNumber(index)}.${tiles.length + 1}`}
            to={guideTrackPath(category)}
            name={t("homeGuideTileName", { track: trackName })}
            desc={t("homeGuideTileDesc", { n: lessonCount })}
            viz={GUIDE_FILLER_VIZ}
          />
        )}
      </div>
    </section>
  );
}
