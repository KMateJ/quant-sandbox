type GuideAccordionHeaderProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onClick: () => void;
};

export default function GuideAccordionHeader({
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
      <div className="guide-header-text">
        <div className="guide-header-title">{title}</div>
        <div className="guide-header-description">{description}</div>
      </div>

      <div className="guide-header-icon">{isOpen ? "−" : "+"}</div>
    </button>
  );
}