/**
 * @brief 固定オフセットによるRGB色収差エフェクトを生成
 *
 * 指定された固定オフセット値を使用してRGB色収差エフェクトを適用します。
 * レンズの収差やビンテージカメラの効果を模擬するのに適しています。
 *
 * @param[in] uv UV座標 (0.0-1.0の範囲)
 * @param[in] tex サンプリングするテクスチャ
 * @param[in] r_offset R成分のUVオフセット値
 * @param[in] b_offset B成分のUVオフセット値
 *
 * @return vec3 RGB色収差が適用されたテクスチャカラー
 *
 * @details
 * アルゴリズム:
 * 1. R成分を r_offset でオフセットしてサンプリング
 * 2. G成分を元の位置でサンプリング
 * 3. B成分を b_offset でオフセットしてサンプリング
 * 4. 各成分を結合してRGBベクターを生成
 *
 * 使用例:
 * @code
 * vec3 aberration = aberration_texture(vUv, u_texture, vec2(0.01, 0.0), vec2(-0.01, 0.0));
 * @endcode
 *
 * @author Generated with Claude Code
 * @date 2025-10-23
 */
vec3 rgb_aberration_texture(
  vec2 uv,
  sampler2D tex,
  vec2 r_offset,
  vec2 b_offset
) {
  float r = texture2D(tex, uv + r_offset).r;
  float g = texture2D(tex, uv).g;
  float b = texture2D(tex, uv + b_offset).b;

  return vec3(r, g, b);
}
