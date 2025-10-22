uniform float u_time;
uniform float u_glitch_progress;
uniform float u_phase;
varying vec2 vUv;
varying vec2 vPosition;

float random(float x) {
  return fract(sin(x * 12.9898) * 43758.5453);
}

float createComplexWave(float pos, float time) {
  float wave = sin(pos * 2.1 + time);

  return wave;
}

void main() {
  vec3 newPosition = position;

  // ========== パラメータ ==========
  float planeHeight = 20.0;
  float ampliHeight = 1.6;
  float glitchIntensity = 10.2;

  // ========== Y軸中心からの距離計算 ==========
  // Y軸方向の中心（Y=0）からの距離を計算
  float yDistance = abs(newPosition.y); // Y=0からの絶対距離

  // Y軸の距離を正規化（PlaneGeometryの高さは20なので、最大距離は10）
  float maxYDistance = planeHeight / 2.0 * ampliHeight; // -10〜10の範囲なので最大10
  float normalizedYDistance = yDistance / maxYDistance; // 0.0〜1.0の範囲

  // ========== Y軸中心強度の計算 ==========
  // Y軸の中心（Y=0）に近いほど強い変形
  float yIntensity = smoothstep(1.0, 0.0, normalizedYDistance);
  // Y=0で最大強度1.0、Y=±10で強度0.0

  // ========== グリッチ強度の計算 ==========
  float intensity = u_glitch_progress * yIntensity * glitchIntensity;
  // u_glitch_progress: 0.0〜1.0（グリッチの進行度）
  // yIntensity: 0.0〜1.0（Y軸中心からの距離による減衰）
  // 10.0: 最大振幅

  // ========== 波形とノイズの生成 ==========
  // 荒い波形を生成
  float wave = createComplexWave(newPosition.y, u_time);

  // ランダムノイズも追加
  float randomNoise = random(newPosition.y + u_time) - 0.5;

  // 波形とノイズを組み合わせ
  float noise = wave * randomNoise;

  // ランダムノイズ（電波ノイズ風の不規則な歪み）
  // float noise = random(newPosition.y * 0.5 + u_time) - 0.5;
  // position.y * 0.5: Y座標ベースのランダムシード
  // u_time: 時間による変化
  // - 0.5: -0.5〜0.5の範囲に調整

  // ========== 頂点位置の変形 ==========
  newPosition.x += noise * intensity;

  // UV座標と位置を渡す
  vUv = uv;
  vPosition = position.xy;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}

// void main() {
//   // UV座標と位置を渡す
//   vUv = uv;
//   vPosition = position.xy;

//   gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
