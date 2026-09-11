/**
 * PriceChart — SVG sparkline chart for market price history.
 *
 * Props:
 *   data — array of [label, value] tuples
 *          e.g. [['Monday', 2280], ['Tuesday', 2320], ...]
 */
export function PriceChart({ data }) {
  const w = 640,
    h = 180,
    min = Math.min(...data.map((x) => x[1])) - 80,
    max = Math.max(...data.map((x) => x[1])) + 80,
    pts = data
      .map(
        (x, i) =>
          `${(i * w) / (data.length - 1)},${h - 20 - ((x[1] - min) / (max - min)) * 125}`
      )
      .join(' ');

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
        <path d={`M0,${h} ${pts} ${w},${h}Z`} />
        <polyline points={pts} />
      </svg>
      <div>
        {data.map((x) => (
          <span key={x[0]}>{x[0].slice(0, 3)}</span>
        ))}
      </div>
    </div>
  );
}
