import { type FlagProps } from "./flag-props";

const STAR_POINTS = 5;
const STAR_OUTER = 9;
const STAR_INNER = 3.6;
// The star sits inside the crescent, one point aimed at the hoist.
const STAR_CENTER_X = 2.5;

function starPath(): string {
  const points = Array.from({ length: STAR_POINTS * 2 }, (_, i) => {
    const radius = i % 2 === 0 ? STAR_OUTER : STAR_INNER;
    const angle = Math.PI + (i * Math.PI) / STAR_POINTS;
    return `${(STAR_CENTER_X + radius * Math.cos(angle)).toFixed(3)},${(radius * Math.sin(angle)).toFixed(3)}`;
  });
  return `M${points.join("L")}Z`;
}

export function TunisiaFlag({ className }: FlagProps) {
  return (
    <svg viewBox="-60 -40 120 80" className={className} aria-hidden="true" focusable="false">
      <rect x="-60" y="-40" width="120" height="80" fill="#E70013" />
      <circle r="20" fill="#fff" />
      <circle r="15" fill="#E70013" />
      <circle cx="4" r="12" fill="#fff" />
      <path d={starPath()} fill="#E70013" />
    </svg>
  );
}
