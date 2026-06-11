uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uGrid;
uniform sampler2D uAtlas;
uniform float uChars;
uniform vec3 uColor;
uniform float uFade;

varying vec2 vUv;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

void main() {
  vec2 cell = floor(vUv * uGrid);
  vec2 cellUv = fract(vUv * uGrid);
  vec2 cellCenter = (cell + 0.5) / uGrid;

  // Sparse drifting base field: a slowly re-rolled subset of cells is dimly lit
  float n = hash(cell + floor(uTime * 0.5) * 0.37);
  float base = smoothstep(0.82, 1.0, n) * 0.35;

  // Cursor proximity: brighten and scramble (aspect-corrected distance)
  vec2 d = (cellCenter - uMouse) * vec2(uGrid.x / uGrid.y, 1.0);
  float prox = smoothstep(0.22, 0.0, length(d));
  float scramble = hash(cell + floor(uTime * 9.0));
  float brightness = clamp(base + prox * (0.45 + 0.55 * scramble), 0.0, 1.0);

  // Brightness picks the glyph: denser characters when brighter
  float idx = floor(brightness * (uChars - 1.0) + 0.5);
  vec2 atlasUv = vec2((idx + cellUv.x) / uChars, cellUv.y);
  float glyph = texture2D(uAtlas, atlasUv).r;

  float alpha = glyph * brightness * uFade;
  gl_FragColor = vec4(uColor, alpha);
}
