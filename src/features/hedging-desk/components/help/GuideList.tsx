/// Term/text rows as a definition list (keys, mistakes, glossary).
export default function GuideList({ items }: { items: { term: string; text: string }[] }) {
  return (
    <dl className="hdesk-help-kv">
      {items.map((item) => (
        <div key={item.term}>
          <dt>{item.term}</dt>
          <dd>{item.text}</dd>
        </div>
      ))}
    </dl>
  );
}
