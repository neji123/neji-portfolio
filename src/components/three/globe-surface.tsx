"use client";

import { useFrame } from "@react-three/fiber";
import { type RefObject, useMemo, useRef } from "react";
import { BackSide, Color, type ShaderMaterial } from "three";

import { landDots } from "@/content/land-dots";

import { type GlobeDriver } from "./globe-driver";
import { dampFactor, toVector3 } from "./globe-math";
import { createGlobeLook, PLACEMENT_DAMPING, stepLook } from "./globe-scenes";
import {
  atmosphereFragment,
  bodyFragment,
  GLOBE_PALETTE,
  pointsFragment,
  pointsVertex,
  shellVertex,
} from "./globe-shaders";

const SPHERE_SEGMENTS = 64;
const ATMOSPHERE_RADIUS = 1.16;
const ATMOSPHERE_STRENGTH = 0.55;
const DOT_RADIUS = 1.002;
/** Half the land grid (2.2°): desktop fills each cell with three extra dots. */
const DENSE_STEP = 1.1;
const MAX_LATITUDE = 89;
/**
 * Dot diameter as a share of the canvas height, at the hero's viewing distance; the shader
 * divides by depth, so the value carries that distance.
 */
const DOT_SCALE = 0.0157;
const SPARSE_DOT_BOOST = 1.15;

/** The land grid; `dense` adds the in-between points of each cell for large screens. */
function landPositions(dense: boolean): Float32Array {
  const places: { lat: number; lon: number }[] = [];
  for (const [lat, lon] of landDots) {
    places.push({ lat, lon });
    if (!dense || lat + DENSE_STEP > MAX_LATITUDE) continue;
    const lonStep = DENSE_STEP / Math.cos((lat * Math.PI) / 180);
    places.push(
      { lat: lat + DENSE_STEP, lon },
      { lat, lon: lon + lonStep },
      { lat: lat + DENSE_STEP, lon: lon + lonStep },
    );
  }
  const positions = new Float32Array(places.length * 3);
  places.forEach((place, i) => toVector3(place, DOT_RADIUS).toArray(positions, i * 3));
  return positions;
}

type GlobeSurfaceProps = {
  /** Fewer dots on phones and low-power devices. */
  sparse: boolean;
  /** Read for the globe's brightness, which dims as it recedes behind the reading sections. */
  driver: RefObject<GlobeDriver>;
  reducedMotion: boolean;
};

export function GlobeSurface({ sparse, driver, reducedMotion }: GlobeSurfaceProps) {
  const pointsMaterial = useRef<ShaderMaterial>(null);
  const atmosphereMaterial = useRef<ShaderMaterial>(null);
  const look = useRef(createGlobeLook());
  const positions = useMemo(() => landPositions(!sparse), [sparse]);
  const uniforms = useMemo(
    () => ({
      body: {
        uColor: { value: new Color(GLOBE_PALETTE.body) },
        uLimb: { value: new Color(GLOBE_PALETTE.limb) },
      },
      atmosphere: {
        uColor: { value: new Color(GLOBE_PALETTE.atmosphere) },
        uStrength: { value: ATMOSPHERE_STRENGTH },
      },
      points: {
        uColor: { value: new Color(GLOBE_PALETTE.dot) },
        uSize: { value: 1 },
        uDim: { value: 1 },
      },
    }),
    [],
  );

  useFrame(({ size, viewport }, delta) => {
    const input = driver.current;
    const { dim } = stepLook(
      look.current,
      input.scenes,
      input.scene,
      input.wide,
      reducedMotion,
      dampFactor(PLACEMENT_DAMPING, delta),
    );
    const atmosphere = atmosphereMaterial.current?.uniforms.uStrength;
    if (atmosphere) atmosphere.value = ATMOSPHERE_STRENGTH * dim;
    const material = pointsMaterial.current;
    if (!material?.uniforms.uSize || !material.uniforms.uDim) return;
    const boost = sparse ? SPARSE_DOT_BOOST : 1;
    material.uniforms.uSize.value = DOT_SCALE * size.height * viewport.dpr * boost;
    material.uniforms.uDim.value = dim;
  });

  return (
    <group>
      <mesh renderOrder={0}>
        <sphereGeometry args={[1, SPHERE_SEGMENTS, SPHERE_SEGMENTS]} />
        <shaderMaterial
          vertexShader={shellVertex}
          fragmentShader={bodyFragment}
          uniforms={uniforms.body}
        />
      </mesh>
      <points renderOrder={1}>
        <bufferGeometry key={positions.length}>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <shaderMaterial
          ref={pointsMaterial}
          vertexShader={pointsVertex}
          fragmentShader={pointsFragment}
          uniforms={uniforms.points}
          transparent
          depthWrite={false}
        />
      </points>
      <mesh renderOrder={2}>
        <sphereGeometry args={[ATMOSPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS]} />
        <shaderMaterial
          ref={atmosphereMaterial}
          vertexShader={shellVertex}
          fragmentShader={atmosphereFragment}
          uniforms={uniforms.atmosphere}
          side={BackSide}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
