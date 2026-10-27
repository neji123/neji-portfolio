import {
  angularDistance,
  greatCircle,
  type OrthographicView,
  projectOrthographic,
} from "@/lib/geo";
import { type LandDot, type LatLon } from "@/types/geo";
import { type JourneyLeg, type JourneyStop, type JourneyStopId } from "@/types/journey";

const RADIUS = 500;
const VIEW_PADDING = 120;
const ARC_SEGMENTS = 72;
const ARC_BASE_LIFT = 0.06;
const ARC_LIFT_PER_RADIAN = 0.12;
const DOT_MIN_RADIUS = 1.4;
const DOT_DEPTH_RADIUS = 1.8;
const DOT_MIN_OPACITY = 0.12;
const DOT_DEPTH_OPACITY = 0.62;
const LABEL_OFFSET = 18;
// Consecutive legs that share a corridor (Tunis → Montréal → France) fly at different heights.
const ALTERNATE_LEG_LIFT = 1.9;

type GlobeFallbackProps = {
  dots: readonly LandDot[];
  stops: readonly JourneyStop[];
  route: readonly JourneyLeg[];
  cityLabels: Record<JourneyStopId, string>;
  center: LatLon;
  label: string;
  labelSize?: number;
  className?: string;
};

function arcPath(from: LatLon, to: LatLon, view: OrthographicView, liftScale: number): string {
  const lift = liftScale * (ARC_BASE_LIFT + ARC_LIFT_PER_RADIAN * angularDistance(from, to));
  const points = greatCircle(from, to, ARC_SEGMENTS);
  let path = "";
  let drawing = false;
  points.forEach((point, i) => {
    const altitude = lift * Math.sin((Math.PI * i) / ARC_SEGMENTS);
    const projected = projectOrthographic(point, view, altitude);
    if (!projected.visible) {
      drawing = false;
      return;
    }
    path += `${drawing ? "L" : "M"}${projected.x.toFixed(1)},${projected.y.toFixed(1)}`;
    drawing = true;
  });
  return path;
}

export function GlobeFallback({
  dots,
  stops,
  route,
  cityLabels,
  center,
  label,
  labelSize = 22,
  className,
}: GlobeFallbackProps) {
  const view: OrthographicView = { center, radius: RADIUS };
  const extent = RADIUS + VIEW_PADDING;
  const stopsById = new Map(stops.map((stop) => [stop.id, stop]));

  return (
    <svg
      viewBox={`${-extent} ${-extent} ${extent * 2} ${extent * 2}`}
      className={className}
      role="img"
      aria-label={label}
    >
      <circle r={RADIUS} fill="var(--globe)" />
      <g fill="var(--dot)">
        {dots.map(([lat, lon]) => {
          const p = projectOrthographic({ lat, lon }, view);
          if (p.depth <= 0) return null;
          return (
            <circle
              key={`${lat},${lon}`}
              cx={p.x.toFixed(1)}
              cy={p.y.toFixed(1)}
              r={(DOT_MIN_RADIUS + DOT_DEPTH_RADIUS * p.depth).toFixed(2)}
              opacity={(DOT_MIN_OPACITY + DOT_DEPTH_OPACITY * p.depth).toFixed(2)}
            />
          );
        })}
      </g>
      <g fill="none" stroke="var(--route)" strokeWidth="3" strokeLinecap="round">
        {route.map(([fromId, toId], index) => {
          const from = stopsById.get(fromId);
          const to = stopsById.get(toId);
          if (!from || !to) return null;
          const liftScale = index % 2 === 0 ? ALTERNATE_LEG_LIFT : 1;
          return <path key={`${fromId}-${toId}`} d={arcPath(from, to, view, liftScale)} />;
        })}
      </g>
      {stops.map((stop) => {
        const p = projectOrthographic(stop, view);
        if (!p.visible) return null;
        return (
          <g key={stop.id} transform={`translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`}>
            {stop.current ? (
              <circle
                r="18"
                fill="none"
                stroke="var(--route)"
                strokeWidth="3"
                className="globe-pulse"
              />
            ) : null}
            <circle r={stop.current ? 8 : 6} fill="var(--route)" />
            <text
              y={-LABEL_OFFSET}
              fontSize={labelSize}
              fill="var(--dot)"
              textAnchor="middle"
              direction="ltr"
            >
              {cityLabels[stop.id]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
