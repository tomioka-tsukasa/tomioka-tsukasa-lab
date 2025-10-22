varying vec2 vUv;
varying vec2 vPosition;
uniform float u_time;
uniform sampler2D u_texture_01;
uniform sampler2D u_texture_02;
uniform float u_phase;
uniform float u_glitch_progress;

float random(float x) {
  return fract(sin(x * 12.9898) * 43758.5453);
}

float random2d(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

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

vec3 stripe_noise(
  vec2 uv
) {
  float stripeCount = 420.0;
  float stripe = mod(floor(uv.y * stripeCount), 2.4);
  stripe = step(stripe, 0.9); // 0の時だけ1.0、他は0.0 (1:4の比率)

  float noiseScale = 10.0;
  float noise = random2d(uv * noiseScale);

  // ストライプ部分でのみノイズを適用
  vec3 result = vec3(noise * stripe);

  return result;
}

vec3 effected_tex(
  sampler2D tex,
  vec2 uv,
  float time
) {
  vec3 effect_stnoi = stripe_noise(vec2(uv.x, uv.y + time * 0.05));
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
