"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Color, type ShaderMaterial } from "three";

import { GLOBE_PALETTE, starsFragment, starsVertex } from "./globe-shaders";

/** Far beyond the camera's widest orbit, so the stars shift slowly as it turns: depth. */
const SKY_RADIUS = 40;
const COUNT = { sparse: 320, full: 900 } as const;
const BRIGHTNESS = { min: 0.08, range: 0.42 } as const;
/** Pixels at 1× before the per-star boost. */
const STAR_SIZE = 1.6;
/** A fixed seed: the same sky on every visit. */
const SEED = 7;
const LCG = { a: 1664525, c: 1013904223, m: 2 ** 32 } as const;

function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (LCG.a * state + LCG.c) % LCG.m;
    return state / LCG.m;
  };
}

function starField(count: number): { positions: Float32Array; brightness: Float32Array } {
  const random = seededRandom(SEED);
  const positions = new Float32Array(count * 3);
  const brightness = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    // Uniform on the sphere: z evenly spread, longitude random.
    const z = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const ring = Math.sqrt(1 - z * z);
    positions[i * 3] = SKY_RADIUS * ring * Math.cos(angle);
    positions[i * 3 + 1] = SKY_RADIUS * z;
    positions[i * 3 + 2] = SKY_RADIUS * ring * Math.sin(angle);
    brightness[i] = BRIGHTNESS.min + BRIGHTNESS.range * random() ** 2;
  }
  return { positions, brightness };
}

type GlobeStarsProps = {
  /** Fewer stars on phones and low-power devices. */
  sparse: boolean;
};

/** A quiet point field behind the globe, part of the same scene and the same camera. */
export function GlobeStars({ sparse }: GlobeStarsProps) {
  const field = useMemo(() => starField(sparse ? COUNT.sparse : COUNT.full), [sparse]);
  const uniforms = useMemo(
    () => ({ uColor: { value: new Color(GLOBE_PALETTE.dot) }, uSize: { value: STAR_SIZE } }),
    [],
  );

  const material = useRef<ShaderMaterial>(null);

  useFrame(({ viewport }) => {
    const pointSize = material.current?.uniforms.uSize;
    if (pointSize) pointSize.value = STAR_SIZE * viewport.dpr;
  });

  return (
    <points renderOrder={-1}>
      <bufferGeometry key={field.brightness.length}>
        <bufferAttribute attach="attributes-position" args={[field.positions, 3]} />
        <bufferAttribute attach="attributes-aBrightness" args={[field.brightness, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={material}
        vertexShader={starsVertex}
        fragmentShader={starsFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}
