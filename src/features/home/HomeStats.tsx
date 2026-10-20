import { useI18n } from "../../i18n";
import { LAB_CATEGORIES, LAB_COUNT, LESSON_COUNT } from "./home.data";
import HomeContinue from "./HomeContinue";

/// Ruled row of headline counts (computed from the registries) plus the Continue cell.
export default function HomeStats() {
  const { t } = useI18n();
  const stats = [
    { value: LAB_COUNT, label: t("homeStatLabs") },
    { value: LESSON_COUNT, label: t("homeStatLessons") },
    { value: LAB_CATEGORIES.length, label: t("homeStatAreas") },
    { value: 2, label: t("homeStatLanguages") },
  ];

  return (
    <section className="home-stats ruled-grid">
      {stats.map((s) => (
        <div key={s.label} className="home-stat">
          <span className="home-stat-value">{s.value}</span>
          <span className="home-stat-label">{s.label}</span>
        </div>
      ))}
      <HomeContinue />
    </section>
  );
}
