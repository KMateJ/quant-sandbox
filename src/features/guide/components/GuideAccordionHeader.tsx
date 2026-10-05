type GuideAccordionHeaderProps = {
  index: number;
  title: string;
  description: string;
  isOpen: boolean;
  onClick: () => void;
};

export default function GuideAccordionHeader({
  index,
  title,
  description,
  isOpen,
  onClick,
}: GuideAccordionHeaderProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="guide-header"
      aria-expanded={isOpen}
    >
      <span className="guide-header-index" aria-hidden="true">
        {String(index).padStart(2, "0")}
      </span>
      <div className="guide-header-text">
        <div className="guide-header-title">{title}</div>
        <div className="guide-header-description">{description}</div>
      </div>

      <div className="guide-header-icon">{isOpen ? "−" : "+"}</div>
    </button>
  );
}