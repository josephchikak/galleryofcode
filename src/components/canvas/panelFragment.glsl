uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uTime;
uniform float uHover;
uniform float uFade;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  // Slow-breathing diagonal gradient between the project's two colors
  float t = vUv.y * 0.7 + vUv.x * 0.3 + 0.12 * sin(uTime * 0.35 + vUv.x * 4.0);
  vec3 col = mix(uColorA, uColorB, clamp(t, 0.0, 1.0));

  // Fine grid — blueprint / systems feel
  vec2 g = fract(vUv * vec2(18.0, 11.0));
  float line = step(0.965, g.x) + step(0.955, g.y);
  col += line * 0.05;

  // Animated grain
  col += hash(vUv * vec2(412.0, 123.0) + fract(uTime)) * 0.05 - 0.025;

  // Green border glow on hover
  float edge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
  col = mix(col, vec3(0.0, 1.0, 0.4), uHover * smoothstep(0.05, 0.0, edge) * 0.9);

  gl_FragColor = vec4(col, uFade);
}
