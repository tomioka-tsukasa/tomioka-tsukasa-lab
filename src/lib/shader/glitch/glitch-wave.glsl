/**
 * @brief Y軸中心グリッチエフェクトを生成
 *
 * Y軸の中心（Y=0）を基準として、距離に応じて減衰するグリッチエフェクトを生成します。
 * 波形とランダムノイズを組み合わせて、電波干渉のような不規則な変形を作成します。
 *
 * @param[in] position 頂点位置
 * @param[in] uv UV座標
 * @param[in] time 時間パラメータ
 * @param[in] plane_height プレーンジオメトリの高さ
 * @param[in] ampli_height 振幅の高さ係数
 * @param[in] glitch_intensity グリッチの強度係数
 * @param[in] glitch_progress グリッチの進行度 (0.0-1.0)
 * @param[in] high 高周波成分の係数
 * @param[in] mid 中間周波成分の係数
 * @param[in] low 低周波成分の係数
 * @param[in] wave_speed 波の速度係数
 *
 * @return float 適用すべきX軸オフセット値
 *
 * @dependencies
 * 依存関数リスト
 * - @/lib/shader/random/random.glsl (random関数が必要)
 * - @/lib/shader/wave/wave-complex-3.glsl (wave_complex_3関数が必要)
 *
 * @details
 * アルゴリズム:
 * 1. Y軸中心からの距離を計算し正規化
 * 2. 距離に基づく強度減衰を計算（Y=0で最大強度）
 * 3. wave_complex_3関数を使用して複雑な波形を生成
 * 4. ランダムノイズを追加して不規則性を演出
 * 5. グリッチ進行度と強度を適用して最終オフセット値を計算
 *
 * 使用例:
 * @code
 * float offset = glitch_wave(
 *   position, uv,
 *   u_time, u_plane_height, u_ampli_height, u_glitch_intensity, u_glitch_progress,
 *   6.0, 3.0, 1.0, 1.0
 * );
 * newPosition.x += offset;
 * @endcode
 *
 * @author Generated with Claude Code
 * @date 2025-10-23
 */

#include "@/lib/shader/wave/wave-complex-3.glsl"

float glitch_wave(
  vec3 position,
  vec2 uv,

  // uniforms
  float time,
  float plane_height,
  float ampli_height,
  float glitch_intensity,
  float glitch_progress,

  // parameters
  float high,
  float mid,
  float low,
  float wave_speed
) {
  // ========== Y軸中心からの距離計算 ==========
  // Y軸方向の中心（Y=0）からの距離を計算
  float yDistance = abs(position.y); // Y=0からの絶対距離

  // Y軸の距離を正規化（PlaneGeometryの高さに合わせる）
  float maxYDistance = plane_height / 2.0 * ampli_height; // -plane_height/2〜plane_height/2の範囲なので最大plane_height/2
  float normalizedYDistance = yDistance / maxYDistance; // 0.0〜1.0の範囲

  // ========== Y軸中心強度の計算 ==========
  float yIntensity = smoothstep(1.0, 0.0, normalizedYDistance);
  // Y軸の中心（Y=0）に近いほど強い変形
  // Y=0で最大強度1.0、Y=±plane_height/2で強度0.0

  // ========== グリッチ強度の計算 ==========
  float intensity = glitch_progress * glitch_intensity;
  // glitch_progress: 0.0〜1.0（グリッチの進行度）
  // yIntensity: 0.0〜1.0（Y軸中心からの距離による減衰）

  // ========== 波形とノイズの生成 ==========
  float wave = wave_complex_3(
    position.y,
    high,
    mid,
    low,
    time,
    (1. + glitch_progress),
    wave_speed
  );

  // ランダムノイズも追加
  float randomNoise = random(position.y + time) - 0.5;

  // 波形とノイズを組み合わせ
  float noise = wave + randomNoise;

  // ========== 最終的なオフセット値を返却 ==========
  return noise * intensity;
}
