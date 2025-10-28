varying vec2 vUv;
varying vec2 vPosition;
uniform float u_time;
uniform sampler2D u_texture_01;
uniform sampler2D u_texture_02;
uniform float u_texture_progress;
uniform float u_glitch_progress;

#include "@/lib/shader/random/random.glsl"
#include "@/lib/shader/glitch/scan-line-noise.glsl"
#include "@/lib/shader/aberration/rgb-aberration-texture.glsl"

/**
 * @brief テクスチャのエフェクトを適用
 *
 * @param[in] tex サンプリングするテクスチャ
 * @param[in] uv UV座標 (0.0-1.0の範囲)
 * @param[in] time 時間パラメータ
 *
 * @return vec3 エフェクトが適用されたテクスチャカラー
*/
vec3 effected_tex(
  sampler2D tex,
  vec2 uv,
  float time
) {
  // 走査線ノイズ
  vec3 effect_stnoi = scan_line_noise(
    vec2(uv.x, uv.y + time * 0.05),
    420.0,
    2.4,
    10.0
  );

  // RGB色収差エフェクト
  vec3 ab_tex = rgb_aberration_texture(
    uv,
    tex,
    vec2(0.01, 0.0),
    vec2(-0.01, 0.0)
  );

  // 最終的なエフェクト
  vec3 result = ab_tex + effect_stnoi * 0.16;

  return result;
}

void main() {
  // テクスチャのサンプリング
  vec3 tex01 = effected_tex(u_texture_01, vUv, u_time);
  vec3 tex02 = effected_tex(u_texture_02, vUv, u_time);

  // ベースとなるテクスチャミックス（直線進行: 0→1）
  vec3 baseResult = mix(tex01, tex02, u_texture_progress);

  // グリッチ効果（JavaScript側で計算された山なりカーブを使用）
  float randomNoise = random(vUv.y * 100.);
  float effectMask = step(randomNoise, u_glitch_progress);

  // グリッチ結果: ランダムにtex02を混ぜる
  vec3 glitchResult = mix(tex01, tex02, effectMask);

  // 最終結果: グリッチ強度に応じてベースとグリッチをミックス
  vec3 result = mix(baseResult, glitchResult, u_glitch_progress);

  gl_FragColor = vec4(result, 1.0);
}
