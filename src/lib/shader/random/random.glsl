/**
 * ランダム関数ライブラリ
 * The Book of Shaders準拠のランダム生成関数
 * https://thebookofshaders.com/10/?lan=jp
*/

// 基本的な1Dランダム関数
float random(float x) {
  return fract(sin(x * 12.9898) * 43758.5453);
}

// 2Dベクトル用のランダム関数
float random2d(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// 改良版1Dランダム（より良い分布）
float randomImproved(float x) {
  return fract(sin(x * 127.1) * 43758.5453);
}

// 改良版2Dランダム（より良い分布）
float random2dImproved(vec2 st) {
  return fract(sin(dot(st.xy, vec2(127.1, 311.7))) * 43758.5453123);
}

// 高品質2Dランダム関数
float random2dHQ(vec2 st) {
  vec3 a = fract(st.xyx * vec3(443.897, 441.423, 437.195));
  a += dot(a, a.yzx + 19.19);
  return fract((a.x + a.y) * a.z);
}

// 符号付きランダム（-1 から 1 の範囲）
float randomSigned(float x) {
  return random(x) * 2.0 - 1.0;
}

// 符号付き2Dランダム（-1 から 1 の範囲）
float random2dSigned(vec2 st) {
  return random2d(st) * 2.0 - 1.0;
}

// 範囲指定ランダム
float randomRange(float x, float min_val, float max_val) {
  return mix(min_val, max_val, random(x));
}

// 2D範囲指定ランダム
float random2dRange(vec2 st, float min_val, float max_val) {
  return mix(min_val, max_val, random2d(st));
}
