uniform vec3 uColor;
uniform float uFade;

varying float vElevation;
varying float vDistance;

void main() {
  // Brighter on ridges, dimmer in valleys; fade toward the horizon
  // (custom ShaderMaterial does not receive scene fog, so fade manually)
  float ridge = 0.35 + 0.65 * smoothstep(0.0, 1.8, vElevation);
  float distanceFade = 1.0 - smoothstep(10.0, 55.0, vDistance);
  float alpha = ridge * distanceFade * uFade * 0.5;
  gl_FragColor = vec4(uColor, alpha);
}
