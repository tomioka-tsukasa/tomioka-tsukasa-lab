uniform float u_time;
uniform float u_glitch_progress;
uniform float u_phase;
uniform float u_plane_height;
uniform float u_ampli_height;
uniform float u_glitch_intensity;
varying vec2 vUv;
varying vec2 vPosition;

#include "@/lib/shader/random/random.glsl"
#include "@/lib/shader/glitch/glitch-wave.glsl"

void main() {
  vec3 newPosition = position;

  // ========== Y軸グリッチエフェクト ==========
  float glitchOffset = glitch_wave(
    newPosition,
    uv,

    // uniforms
    u_time,
    u_plane_height,
    u_ampli_height,
    u_glitch_intensity,
    u_glitch_progress,

    // parameters
    6.,   // high
    3.,   // mid
    1.,   // low
    1.,   // wave_speed
    0.    // basis_y_axis
  );

  // ========== 頂点位置の変形 ==========
  newPosition.x += glitchOffset;

  // ========== 頂点情報を出力 ==========
  vUv = uv;
  vPosition = position.xy;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
