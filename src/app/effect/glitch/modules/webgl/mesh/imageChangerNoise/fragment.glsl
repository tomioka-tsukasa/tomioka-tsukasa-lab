varying vec2 vUv;
uniform float u_time;
uniform sampler2D u_texture_01;
uniform sampler2D u_texture_02;
varying vec2 vPosition;

float random(float x) {
  return fract(sin(x * 12.9898) * 43758.5453);
}

float random2d(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main() {
  // ステップ1: 2つのテクスチャをサンプリング
  vec3 texture1 = texture2D(u_texture_01, vUv).rgb;
  vec3 texture2 = texture2D(u_texture_02, vUv).rgb;

  // ステップ2: 切り替えパラメータ追加が必要
  // uniform float u_transition; // 0.0 = 1枚目、1.0 = 2枚目
  float transition = sin(u_time * 1.5) * .5 + .5;

  // ステップ3: 基本的な切り替え（フェード）
  vec3 simpleTransition = mix(texture1, texture2, transition);

  // ステップ4a: ランダム切り替えの仕組み
  float pixelRandom = random2d(vUv * 100.0); // ピクセルごとのランダム値
  float threshold = transition; // 切り替えの閾値
  // float mask = step(pixelRandom, threshold);

  // ステップ4b: 垂直ストライプでランダムにする場合
  float stripeRandom = random(vUv.y * 100.);
  float mask = step(stripeRandom, threshold);

  // ステップ5: step関数を使って判定
  vec3 randomTransition = mix(texture1, texture2, mask);

  vec3 color = randomTransition; // 仮の色
  gl_FragColor = vec4(color, 1.0);
}
