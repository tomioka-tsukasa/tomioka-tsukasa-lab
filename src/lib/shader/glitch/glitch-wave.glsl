/**
 * @brief Y軸中心グリッチエフェクトを生成
 *
 * Y軸の中心（Y=0）を基準として、距離に応じて減衰するグリッチエフェクトを生成します。
 * 波形とランダムノイズを組み合わせて、電波干渉のような不規則な変形を作成します。
 *
 * @param[in] position 頂点位置
 * @param[in] time 時間パラメータ
 * @param[in] plane_height プレーンジオメトリの高さ
 * @param[in] ampli_height 振幅の高さ係数
 * @param[in] glitch_intensity グリッチの強度係数
 * @param[in] glitch_progress グリッチの進行度 (0.0-1.0)
 *
 * @return float 適用すべきX軸オフセット値
 *
 * @dependencies
 * 依存関数リスト
 * - @/lib/shader/random/random.glsl (random関数が必要)
 * - createComplexWave関数が必要（呼び出し元で定義）
 *
 * @details
 * アルゴリズム:
 * 1. Y軸中心からの距離を計算し正規化
 * 2. 距離に基づく強度減衰を計算（Y=0で最大強度）
 * 3. 複雑な波形とランダムノイズを生成
 * 4. 最終的なオフセット値を計算
 *
 * 使用例:
 * @code
 * float offset = glitch_wave(position, u_time, u_plane_height, u_ampli_height, u_glitch_intensity, u_glitch_progress);
 * newPosition.x += offset;
 * @endcode
 *
 * @author Generated with Claude Code
 * @date 2025-10-23
 */
float create_complex_wave(float pos, float time) {
  float wave = sin(pos * 2.1 + time);

  return wave;
}

float glitch_wave(
  vec3 position,
  float time,
  float plane_height,
  float ampli_height,
  float glitch_intensity,
  float glitch_progress
) {
  // ========== Y軸中心からの距離計算 ==========
  // Y軸方向の中心（Y=0）からの距離を計算
  float yDistance = abs(position.y); // Y=0からの絶対距離

  // Y軸の距離を正規化（PlaneGeometryの高さは20なので、最大距離は10）
  float maxYDistance = plane_height / 2.0 * ampli_height; // -10〜10の範囲なので最大10
  float normalizedYDistance = yDistance / maxYDistance; // 0.0〜1.0の範囲

  // ========== Y軸中心強度の計算 ==========
  // Y軸の中心（Y=0）に近いほど強い変形
  float yIntensity = smoothstep(1.0, 0.0, normalizedYDistance);
  // Y=0で最大強度1.0、Y=±10で強度0.0

  // ========== グリッチ強度の計算 ==========
  float intensity = glitch_progress * yIntensity * glitch_intensity;
  // glitch_progress: 0.0〜1.0（グリッチの進行度）
  // yIntensity: 0.0〜1.0（Y軸中心からの距離による減衰）

  // ========== 波形とノイズの生成 ==========
  // 荒い波形を生成
  float wave = create_complex_wave(position.y, time);

  // ランダムノイズも追加
  float randomNoise = random(position.y + time) - 0.5;

  // 波形とノイズを組み合わせ
  float noise = wave * randomNoise;

  // ========== 最終的なオフセット値を返却 ==========
  return noise * intensity;
}