import { Suspense, type ComponentType } from "react";
import { Navigate, useParams } from "react-router-dom";
import type { LabLesson } from "./labLessons";

/// Routes a lab with lessons: the root renders `Root`, `<base>/<id>` the lesson, anything else returns to `base`.
export default function LabLessonPages({ base, Root, lessons }: { base: string; Root: ComponentType; lessons: LabLesson[] }) {
  const { "*": page } = useParams();
  if (!page) return <Root />;
  const lesson = lessons.find((l) => l.id === page);
  if (!lesson) return <Navigate to={base} replace />;
  return (
    <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
      <lesson.Component />
    </Suspense>
  );
}
