uniform sampler2D tDiffuse;
uniform float uTime;
uniform float uStrength;
uniform float uSpeed;
uniform float uRgbOffset;
uniform float uScanlines;
uniform vec2 uResolution;

varying vec2 vUv;

float random(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 uv = vUv;

  // ランダムな水平グリッチライン
  float glitchLine = floor(uv.y * uScanlines);
  float glitchNoise = random(vec2(glitchLine, floor(uTime * uSpeed))) * 2.0 - 1.0;

  // グリッチ強度に基づくUV歪み
  float glitchAmount = glitchNoise * uStrength;
  if (abs(glitchNoise) > 0.8) {
    uv.x += glitchAmount;
  }

  // RGB色収差エフェクト
  float r = texture2D(tDiffuse, uv + vec2(uRgbOffset, 0.0)).r;
  float g = texture2D(tDiffuse, uv).g;
  float b = texture2D(tDiffuse, uv - vec2(uRgbOffset, 0.0)).b;

  // ランダムノイズ
  float noise = random(uv + uTime) * 0.1;

  // スキャンライン効果
  float scanline = sin(uv.y * uScanlines * 2.0) * 0.05;

  vec3 color = vec3(r, g, b);
  color += noise + scanline;

  gl_FragColor = vec4(color, 1.0);
}