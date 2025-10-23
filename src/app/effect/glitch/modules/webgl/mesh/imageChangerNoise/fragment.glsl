varying vec2 vUv;
varying vec2 vPosition;
uniform float u_time;
uniform sampler2D u_texture_01;
uniform sampler2D u_texture_02;
uniform float u_phase;
uniform float u_glitch_progress;

#include "@/lib/shader/random/random.glsl"
#include "@/lib/shader/glitch/scan-line-noise.glsl"
#include "@/lib/shader/aberration/rgb-aberration.glsl"

vec3 effected_tex(
  sampler2D tex,
  vec2 uv,
  float time
) {
  vec3 effect_stnoi = scan_line_noise(vec2(uv.x, uv.y + time * 0.05), 420.0, 2.4, 10.0);
  vec3 ab_tex = aberration_texture(uv, tex, vec2(0.01, 0.0), vec2(-0.01, 0.0));

  vec3 result = ab_tex + effect_stnoi * 0.16;

  return result;
}

void main() {
  // テクスチャのサンプリング
  vec3 tex01 = effected_tex(u_texture_01, vUv, u_time);
  vec3 tex02 = effected_tex(u_texture_02, vUv, u_time);

  // 状態に応じた処理
  vec3 result = tex01; // デフォルトは画像1

  if (u_phase == 1.0) {
    // グリッチフェーズ: u_glitch_progressを使用
    float randomNoise = random(vUv.y * 100.);
    float effectMask = step(randomNoise, u_glitch_progress);

    result = mix(tex01, tex02, effectMask);
    // result = tex01;
  } else if (u_phase >= 2.0) {
    // 完了: 画像2固定
    result = tex02;
  }

  gl_FragColor = vec4(result, 1.0);
}
