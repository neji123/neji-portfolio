import { type OrthographicView, projectOrthographic } from "@/lib/geo";
import { routeArc } from "@/lib/route-arc";
import { type LandDot, type LatLon } from "@/types/geo";
import { type JourneyLeg, type JourneyStop, type JourneyStopId } from "@/types/journey";

const RADIUS = 500;
const VIEW_PADDING = 120;
const DOT_MIN_RADIUS = 1.4;
const DOT_DEPTH_RADIUS = 1.8;
const DOT_MIN_OPACITY = 0.12;
const DOT_DEPTH_OPACITY = 0.62;
const LABEL_OFFSET = 18;

/** Share of the drawing the globe's disc fills; the 3D globe frames itself to the same size. */
export const GLOBE_DISC_FRACTION = RADIUS / (RADIUS + VIEW_PADDING);

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

function arcPath(from: LatLon, to: LatLon, view: OrthographicView, legIndex: number): string {
  let path = "";
  let drawing = false;
  routeArc(from, to, legIndex).forEach(({ point, altitude }) => {
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

/** One circle as a path: two half-arcs from its left edge. */
function dotPath(x: number, y: number, r: number): string {
  const diameter = (r * 2).toFixed(2);
  return `M${(x - r).toFixed(1)},${y.toFixed(1)}a${r.toFixed(2)},${r.toFixed(2)} 0 1,0 ${diameter},0a${r.toFixed(2)},${r.toFixed(2)} 0 1,0 -${diameter},0`;
}

/**
 * The land dots, one path per opacity step instead of one element per dot: the same picture
 * with a few dozen nodes rather than two thousand (a lighter page and a faster hydration).
 */
function dotLayers(
  dots: readonly LandDot[],
  view: OrthographicView,
): { opacity: string; d: string }[] {
  const layers = new Map<string, string>();
  dots.forEach(([lat, lon]) => {
    const p = projectOrthographic({ lat, lon }, view);
    if (p.depth <= 0) return;
    const opacity = (DOT_MIN_OPACITY + DOT_DEPTH_OPACITY * p.depth).toFixed(2);
    const r = DOT_MIN_RADIUS + DOT_DEPTH_RADIUS * p.depth;
    layers.set(opacity, (layers.get(opacity) ?? "") + dotPath(p.x, p.y, r));
  });
  return Array.from(layers, ([opacity, d]) => ({ opacity, d }));
}

/** The static globe: server-rendered, shown first and kept whenever WebGL is unavailable. */
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
        {dotLayers(dots, view).map(({ opacity, d }) => (
          <path key={opacity} d={d} opacity={opacity} />
        ))}
      </g>
      <g fill="none" stroke="var(--route)" strokeWidth="3" strokeLinecap="round">
        {route.map(([fromId, toId], index) => {
          const from = stopsById.get(fromId);
          const to = stopsById.get(toId);
          if (!from || !to) return null;
          return <path key={`${fromId}-${toId}`} d={arcPath(from, to, view, index)} />;
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
