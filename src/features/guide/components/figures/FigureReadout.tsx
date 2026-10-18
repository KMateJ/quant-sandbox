export type ReadoutItem = { label: string; value: string; tone?: "accent" | "strong" };

/// Label / value pairs under a figure.
export default function FigureReadout({ items }: { items: ReadoutItem[] }) {
  return (
    <dl className="gf-readout gf-readout--row">
      {items.map((item) => (
        <div key={item.label} className="gf-readout-item">
          <dt>{item.label}</dt>
          <dd className={item.tone ? `gf-${item.tone}` : undefined}>{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}
