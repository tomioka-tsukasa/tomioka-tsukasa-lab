uniform float u_time;
uniform float u_glitch_progress;
uniform float u_phase;
varying vec2 vUv;
varying vec2 vPosition;

float random(float x) {
  return fract(sin(x * 12.9898) * 43758.5453);
}

float createComplexWave(float pos, float time) {
  float wave1 = sin(pos * 0.3 + time * 1.5) * 3.0;
  float wave2 = sin(pos * 0.8 + time * 2.2) * 1.5;
  float wave3 = sin(pos * 2.1 + time * 3.8) * 0.8;

  return wave1 + wave2 + wave3;
}

void main() {
  vec3 newPosition = position;

  // グリッチの強度を計算
  float intensity = u_glitch_progress * 3.0; // 最大強度3.0

  // 基本的な波
  float wave = createComplexWave(position.y, u_time);

  // ランダムノイズを追加
  float noise = (random(position.y * 0.1 + u_time) - 0.5) * 1.0;

  newPosition.x += (noise * intensity);

  // UV座標と位置を渡す
  vUv = uv;
  vPosition = vec2(newPosition.x, newPosition.y);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
