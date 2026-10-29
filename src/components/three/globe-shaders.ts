// Night Route palette for WebGL; mirrors the night tokens in globals.css.
export const GLOBE_PALETTE = {
  body: "#102136",
  limb: "#1c3352",
  atmosphere: "#4078c8",
  dot: "#eef0ea",
  route: "#f0609e",
} as const;

/** Land dots: round, larger and brighter where they face the viewer, gone on the far side. */
export const pointsVertex = /* glsl */ `
  uniform float uSize;
  varying float vFacing;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 normal = normalize(normalMatrix * position);
    vFacing = dot(normal, normalize(-mvPosition.xyz));
    gl_PointSize = max(1.5, uSize * (0.55 + 0.45 * max(vFacing, 0.0)) / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const pointsFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uDim;
  varying float vFacing;

  void main() {
    if (vFacing <= 0.0) discard;
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.32, d) * (0.12 + 0.62 * vFacing) * uDim;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;

/** Shared by the body and the atmosphere: view-space normal and direction to the eye. */
export const shellVertex = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

/** The night ground of the planet, lifting towards a cooler limb. */
export const bodyFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uLimb;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float fresnel = pow(1.0 - max(dot(vNormal, vView), 0.0), 3.0);
    gl_FragColor = vec4(mix(uColor, uLimb, fresnel), 1.0);
    #include <colorspace_fragment>
  }
`;

/** A back-faced shell: strongest just outside the limb, fading to nothing at its own edge. */
export const atmosphereFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uStrength;
  varying vec3 vNormal;
  varying vec3 vView;

  void main() {
    float glow = pow(clamp(-dot(vNormal, vView) / 0.5, 0.0, 1.0), 2.4);
    gl_FragColor = vec4(uColor, glow * uStrength);
    #include <colorspace_fragment>
  }
`;

/** Background stars: fixed screen size, each with its own brightness. */
export const starsVertex = /* glsl */ `
  uniform float uSize;
  attribute float aBrightness;
  varying float vBrightness;

  void main() {
    vBrightness = aBrightness;
    gl_PointSize = uSize * (0.6 + aBrightness);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const starsFragment = /* glsl */ `
  uniform vec3 uColor;
  varying float vBrightness;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(uColor, smoothstep(0.5, 0.1, d) * vBrightness);
    #include <colorspace_fragment>
  }
`;
