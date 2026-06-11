uniform float uTime;

varying float vElevation;
varying float vDistance;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

void main() {
  vec3 pos = position;
  // The plane is rotated flat, so local xy maps to world xz.
  // Scrolling the noise field along y makes the terrain flow toward the camera.
  vec2 p = vec2(pos.x * 0.08, pos.y * 0.08 + uTime * 0.06);
  float elevation = noise(p * 2.0) * 1.6 + noise(p * 6.0) * 0.4;
  // Flatten a corridor down the middle so the area under the hero text stays calm
  float center = smoothstep(0.0, 14.0, abs(pos.x));
  elevation *= 0.25 + 0.75 * center;
  pos.z += elevation;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vElevation = elevation;
  vDistance = -mv.z;
  gl_Position = projectionMatrix * mv;
}
