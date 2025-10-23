/**
 * @brief 時間による動的RGB色収差エフェクトを生成
 *
 * 時間パラメータに基づいて動的に変化するRGB色収差エフェクトを適用します。
 * 収差の強度と方向が時間とともに回転・変化し、よりダイナミックな効果を生成します。
 *
 * @param[in] uv UV座標 (0.0-1.0の範囲)
 * @param[in] tex サンプリングするテクスチャ
 * @param[in] time 時間パラメータ 収差の強度と回転角度の計算に使用
 *
 * @return vec3 RGB色収差が適用されたテクスチャカラー
 *
 * @details
 * アルゴリズム:
 * 1. sin(time)で収差強度を0.002-0.008の範囲で振動させる
 * 2. time * 0.5で収差方向を時間とともに回転させる
 * 3. R成分を正方向、B成分を負方向にオフセット
 * 4. G成分は元の位置でサンプリング
 *
 * 使用例:
 * @code
 * vec3 dynamicAberration = aberration_texture_time(vUv, u_texture, u_time);
 * gl_FragColor = vec4(dynamicAberration, 1.0);
 * @endcode
 *
 * @author Generated with Claude Code
 * @date 2025-10-23
 */
vec3 aberration_texture_time(
  vec2 uv,
  sampler2D tex,
  float time
) {
  // 時間とともに収差の強度が変化
  float aberration = sin(time) * 0.003 + 0.005;

  // 収差の方向が回転
  float angle = time * 0.5;
  vec2 direction = vec2(cos(angle), sin(angle));
  vec2 redOffset = direction * aberration;
  vec2 blueOffset = -direction * aberration;

  float t2_r = texture2D(tex, uv + redOffset).r;
  float t2_g = texture2D(tex, uv).g;
  float t2_b = texture2D(tex, uv + blueOffset).b;

  return vec3(t2_r, t2_g, t2_b);
}

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
 * vec2 redOffset = vec2(0.01, 0.0);
 * vec2 blueOffset = vec2(-0.01, 0.0);
 * vec3 fixedAberration = aberration_texture(vUv, u_texture, redOffset, blueOffset);
 * @endcode
 *
 * @author Generated with Claude Code
 * @date 2025-10-23
 */
vec3 aberration_texture(
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
