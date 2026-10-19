// Simulated futures fanning out from where the known path ends.
const FUTURES = [
  "M380 120L422 95L462 100L500 72L540 80L580 58L620 66L660 45L700 50L740 38L770 42",
  "M380 120L420 105L455 115L495 90L530 98L570 75L610 85L650 60L690 70L730 50L770 58",
  "M380 120L420 112L460 125L500 108L540 122L580 110L620 128L660 112L700 126L740 115L770 120",
  "M380 120L415 130L450 118L490 140L525 128L565 150L600 140L640 165L680 150L720 175L770 168",
  "M380 120L418 140L452 155L488 148L522 172L560 165L598 190L636 182L676 205L716 198L770 220",
];

const KNOWN = "M40 238L70 222L95 232L125 200L150 210L180 176L205 186L235 154L260 164L290 132L315 142L345 112L380 120";

/// Not-found illustration: a price path that breaks off at "now" (tagged 404) and fans out into possible futures.
export default function NotFoundArt() {
  return (
    <svg className="not-found-art" viewBox="0 0 800 290" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="nf-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.3" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="nf-cone" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--primary)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--primary)" stopOpacity="0.06" />
        </linearGradient>
      </defs>

      <g stroke="var(--border)" strokeWidth="1" fill="none">
        <path d="M30 40H780M30 100H780M30 160H780M30 220H780" strokeDasharray="2 7" />
        <path d="M30 20V262H780" />
      </g>

      <path d="M380 120C410 66 560 34 770 20V244C560 214 410 170 380 120Z" fill="url(#nf-cone)" />
      <g fill="none" stroke="var(--muted)" strokeWidth="1.6" strokeLinejoin="round" opacity="0.45">
        {FUTURES.map((d) => <path key={d} d={d} />)}
      </g>
      <path d="M380 120L770 118" stroke="var(--primary)" strokeWidth="2" strokeDasharray="6 7" opacity="0.7" />

      <path d={`${KNOWN}V262H40Z`} fill="url(#nf-area)" />
      <path d={KNOWN} fill="none" stroke="var(--primary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />

      <path d="M380 28V262" stroke="var(--muted)" strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />
      <g className="not-found-callout">
        <path d="M380 104V80" stroke="var(--primary)" strokeWidth="1.5" />
        <rect x="334" y="40" width="92" height="40" rx="6" fill="var(--primary)" />
        <text x="380" y="68" textAnchor="middle" fontSize="22" fontWeight="800" fill="var(--text-inverse)">404</text>
      </g>
      <circle className="not-found-pulse" cx="380" cy="120" r="10" fill="var(--primary)" />
      <circle cx="380" cy="120" r="6.5" fill="var(--primary)" stroke="var(--surface)" strokeWidth="2.5" />

      <g fill="var(--muted)" fontSize="15" fontStyle="italic" fontFamily="'Source Serif 4 Variable', Georgia, serif">
        <text x="40" y="282">t</text>
        <text x="380" y="282" textAnchor="middle">t = now</text>
        <text x="768" y="282" textAnchor="end">T</text>
        <text x="40" y="16">S(t)</text>
      </g>
    </svg>
  );
}
