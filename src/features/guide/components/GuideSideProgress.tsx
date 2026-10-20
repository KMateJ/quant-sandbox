/// Sidebar track row extras: mono "read / total" and a thin progress line along the row's bottom edge.
export default function GuideSideProgress({ read, total }: { read: number; total: number }) {
  return (
    <>
      <span className="side-progress-count">{read} / {total}</span>
      <span className="side-progress-line" aria-hidden="true">
        <span style={{ width: total ? `${(read / total) * 100}%` : 0 }} />
      </span>
    </>
  );
}
