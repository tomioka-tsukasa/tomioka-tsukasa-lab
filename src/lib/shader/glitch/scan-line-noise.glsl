/**
 * @brief 走査線ノイズエフェクトを生成
 *
 * CRTモニターやテレビの走査線を模したノイズパターンを生成します。
 * 指定した間隔で水平線を描画し、その線上にランダムノイズを適用します。
 *
 * @param[in] uv UV座標 (0.0-1.0の範囲)
 * @param[in] scan_line_count 走査線の数 (デフォルト: 420.0)
 * @param[in] scan_line_ratio 走査線の表示比率 (デフォルト: 2.4) mod演算で使用され、小さいほど線が密に表示される
 * @param[in] noise_scale ノイズのスケール値 (デフォルト: 10.0) 大きいほど細かいノイズパターンになる
 *
 * @return vec3 走査線ノイズの結果 (RGB全て同じ値)
 *
 * @details
 * アルゴリズム:
 * 1. Y座標に基づいて走査線位置を計算
 * 2. mod演算とstep関数で走査線マスクを生成
 * 3. 2Dランダム関数でノイズパターンを生成
 * 4. 走査線マスクとノイズを乗算してエフェクトを適用
 *
 * 使用例:
 * @code
 * vec3 noise = scan_line_noise(vUv, 800.0, 3.0, 15.0);
 * vec3 final_color = base_color + noise * 0.1;
 * @endcode
 *
 * @note random2d()関数が別途定義されている必要があります
 * @see random2d()
 *
 * @author Generated with Claude Code
 * @date 2025-10-23
 */
vec3 scan_line_noise(
  vec2 uv,
  float scan_line_count,
  float scan_line_ratio,
  float noise_scale
) {
  float scan_line = mod(floor(uv.y * scan_line_count), scan_line_ratio);
  scan_line = step(scan_line, 0.9); // 0の時だけ1.0、他は0.0 (1:4の比率)

  float noise = random2d(uv * noise_scale);

  // ストライプ部分でのみノイズを適用
  vec3 result = vec3(noise * scan_line);

  return result;
}
