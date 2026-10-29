"use client";

import { Line } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { type ComponentRef, useMemo, useRef } from "react";
import { DoubleSide, type Mesh, type MeshBasicMaterial, Vector3 } from "three";

import { ARC_SEGMENTS, routeArc } from "@/lib/route-arc";
import { type GlobeStop, type JourneyLeg, type JourneyStopId } from "@/types/journey";

import { dampFactor, toVector3 } from "./globe-math";
import { GLOBE_PALETTE } from "./globe-shaders";

/** Seconds: the route draws itself leg by leg once the globe appears. */
const DRAW = { delay: 0.5, perLeg: 1.1, stagger: 0.85 } as const;
const PULSE_PERIOD = 2.4;
const PULSE_SCALE = { from: 0.6, to: 1.8, still: 1.2 } as const;
const PULSE_OPACITY = { from: 0.9, still: 0.6 } as const;
const LINE_WIDTH = 2.5;
/** Legs away from the role being read step back so the active one leads. */
const DIMMED_LEG_OPACITY = 0.32;
const MARKER = { radius: 0.013, current: 0.017, lift: 1.003, emphasis: 1.7 } as const;
const RING = { inner: 0.026, outer: 0.033, lift: 1.004 } as const;
const DAMPING = 6;

type LineRef = ComponentRef<typeof Line>;

type GlobeRouteProps = {
  stops: readonly GlobeStop[];
  route: readonly JourneyLeg[];
  /** The stop of the role being read, which the route emphasises. */
  activeStop: JourneyStopId | null;
  hoveredStop: JourneyStopId | null;
  reducedMotion: boolean;
};

function easeOutCubic(t: number): number {
  return 1 - (1 - t) ** 3;
}

function clamp01(t: number): number {
  return Math.min(1, Math.max(0, t));
}

export function GlobeRoute({
  stops,
  route,
  activeStop,
  hoveredStop,
  reducedMotion,
}: GlobeRouteProps) {
  const lines = useRef<(LineRef | null)[]>([]);
  const markers = useRef<(Mesh | null)[]>([]);
  const ring = useRef<Mesh>(null);
  const startedAt = useRef<number | null>(null);

  const legs = useMemo(() => {
    const byId = new Map(stops.map((stop) => [stop.id, stop]));
    return route.flatMap(([fromId, toId], index) => {
      const from = byId.get(fromId);
      const to = byId.get(toId);
      if (!from || !to) return [];
      const points = routeArc(from, to, index).map(({ point, altitude }) =>
        toVector3(point, 1 + altitude),
      );
      return [{ key: `${fromId}-${toId}`, from: fromId, to: toId, points }];
    });
  }, [stops, route]);

  const current = stops.find((stop) => stop.current);
  const ringPlacement = useMemo(() => {
    if (!current) return null;
    const position = toVector3(current, RING.lift);
    return { position, facing: position.clone().multiplyScalar(2) };
  }, [current]);

  useFrame((state, delta) => {
    startedAt.current ??= state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime - startedAt.current;
    const k = reducedMotion ? 1 : dampFactor(DAMPING, delta);

    legs.forEach((leg, i) => {
      const line = lines.current[i];
      if (!line) return;
      const drawn = reducedMotion
        ? 1
        : easeOutCubic(clamp01((elapsed - DRAW.delay - i * DRAW.stagger) / DRAW.perLeg));
      line.geometry.instanceCount = Math.round(drawn * ARC_SEGMENTS);
      const leads = activeStop === null || leg.from === activeStop || leg.to === activeStop;
      const target = leads ? 1 : DIMMED_LEG_OPACITY;
      line.material.opacity += (target - line.material.opacity) * k;
    });

    stops.forEach((stop, i) => {
      const marker = markers.current[i];
      if (!marker) return;
      const target = stop.id === hoveredStop || stop.id === activeStop ? MARKER.emphasis : 1;
      marker.scale.setScalar(marker.scale.x + (target - marker.scale.x) * k);
    });

    const pulse = ring.current;
    if (pulse) {
      const material = pulse.material as MeshBasicMaterial;
      if (reducedMotion) {
        pulse.scale.setScalar(PULSE_SCALE.still);
        material.opacity = PULSE_OPACITY.still;
      } else {
        const phase = (elapsed % PULSE_PERIOD) / PULSE_PERIOD;
        const eased = easeOutCubic(phase);
        pulse.scale.setScalar(PULSE_SCALE.from + (PULSE_SCALE.to - PULSE_SCALE.from) * eased);
        material.opacity = PULSE_OPACITY.from * (1 - eased);
      }
    }
  });

  return (
    <group>
      {legs.map((leg, i) => (
        <Line
          key={leg.key}
          ref={(line) => {
            lines.current[i] = line;
          }}
          points={leg.points}
          color={GLOBE_PALETTE.route}
          lineWidth={LINE_WIDTH}
          transparent
          depthWrite={false}
          toneMapped={false}
        />
      ))}
      {stops.map((stop, i) => (
        <mesh
          key={stop.id}
          ref={(mesh) => {
            markers.current[i] = mesh;
          }}
          position={toVector3(stop, MARKER.lift, new Vector3())}
        >
          <sphereGeometry args={[stop.current ? MARKER.current : MARKER.radius, 16, 16]} />
          <meshBasicMaterial color={GLOBE_PALETTE.route} toneMapped={false} />
        </mesh>
      ))}
      {ringPlacement ? (
        <mesh
          ref={ring}
          position={ringPlacement.position}
          onUpdate={(mesh) => mesh.lookAt(ringPlacement.facing)}
        >
          <ringGeometry args={[RING.inner, RING.outer, 48]} />
          <meshBasicMaterial
            color={GLOBE_PALETTE.route}
            side={DoubleSide}
            transparent
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ) : null}
    </group>
  );
}
