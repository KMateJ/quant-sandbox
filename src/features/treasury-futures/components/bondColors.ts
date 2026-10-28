/// One colour per basket position, shared by every Treasury chart so a bond keeps its colour.
const BOND_COLORS = ["#38bdf8", "#a78bfa", "#34d399", "#fb923c", "#f472b6", "#facc15", "#60a5fa"];

export const bondColor = (index: number) => BOND_COLORS[index % BOND_COLORS.length];
