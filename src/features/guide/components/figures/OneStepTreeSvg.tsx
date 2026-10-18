type OneStepTreeSvgProps = {
  label: string;
  s0: string;
  su: string;
  sd: string;
  cu: string;
  cd: string;
  q: string;
  price: string;
};

const NODE_W = 116;
const NODE_H = 40;

function Node({ x, y, top, bottom }: { x: number; y: number; top: string; bottom: string }) {
  return (
    <g transform={`translate(${x},${y})`}>
      <rect className="gf-node" width={NODE_W} height={NODE_H} rx={3} />
      <text className="gf-node-main" x={NODE_W / 2} y={17} textAnchor="middle">{top}</text>
      <text className="gf-node-sub" x={NODE_W / 2} y={32} textAnchor="middle">{bottom}</text>
    </g>
  );
}

/// One-step binomial tree: today's node and the two states at maturity, each with S and C.
export default function OneStepTreeSvg({ label, s0, su, sd, cu, cd, q, price }: OneStepTreeSvgProps) {
  return (
    <svg className="gf-tree" viewBox="0 0 340 170" role="img" aria-label={label}>
      <path className="gf-edge" d={`M${8 + NODE_W} 85 L216 30 M${8 + NODE_W} 85 L216 140`} />
      <text className="gf-edge-q" x={160} y={42}>q {q}</text>
      <text className="gf-edge-label" x={160} y={136}>1−q</text>
      <Node x={8} y={65} top={`S₀ ${s0}`} bottom={`C₀ ${price}`} />
      <Node x={216} y={10} top={`S ${su}`} bottom={`C ${cu}`} />
      <Node x={216} y={120} top={`S ${sd}`} bottom={`C ${cd}`} />
    </svg>
  );
}
