/**
 * @brief 3種類の周波数を合成した複雑な波形を生成
 *
 * 高周波、中間周波、低周波の3つのsin波を合成して複雑な波形パターンを生成します。
 * 各波は異なる周波数（6倍、3倍、1倍）を持ち、振幅と速度で統一的に制御されます。
 *
 * @param[in] pos 位置パラメータ（通常はposition.yやUV座標）
 * @param[in] high 高周波成分の振幅係数
 * @param[in] mid 中間周波成分の振幅係数
 * @param[in] low 低周波成分の振幅係数
 * @param[in] time 時間パラメータ（アニメーション用）
 * @param[in] amp 振幅係数（全体の波の強さを制御）
 * @param[in] speed 速度係数（時間変化の速さを制御）
 *
 * @return float 合成された波形の値
 *
 * @details
 * アルゴリズム:
 * 1. 高周波: sin(pos * 6 * amp + time * speed) * high - 細かい波
 * 2. 中間周波: sin(pos * 3 * amp + time * speed) * mid - 中程度の波
 * 3. 低周波: sin(pos * 1 * amp + time * speed) * low - 粗い波
 * 4. 3つの波を加算して最終的な波形を生成
 *
 * 使用例:
 * @code
 * float complexWave = wave_complex_3(position.y, 1.0, 0.5, 0.3, u_time, 2.0, 1.5);
 * newPosition.x += complexWave * 0.1;
 * @endcode
 *
 * @author Generated with Claude Code
 * @date 2025-10-23
 */
float wave_complex_3(
  float pos,
  float high,
  float mid,
  float low,
  float time,
  float amp,
  float speed
) {
  // 高周波（細かい波）
  float highWave = sin(pos * high * amp + time * speed);

  // 中間周波
  float midWave = sin(pos * mid * amp + time * speed);

  // 低周波（粗い波）
  float lowWave = sin(pos * low * amp + time * speed);

  // 3つの波を合成
  return highWave + midWave + lowWave;
}
