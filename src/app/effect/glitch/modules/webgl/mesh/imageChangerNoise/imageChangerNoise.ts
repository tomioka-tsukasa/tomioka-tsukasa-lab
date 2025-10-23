import * as THREE from 'three'
import { LoadedAssets } from '../../setupMember'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export type UpdateImageChangerState = () => void

export type TriggerGlitch = (duration?: number) => void

export type UpdateShaderParams = (params: {
  ampliHeight?: number
  glitchIntensity?: number
  high?: number
  mid?: number
  low?: number
  waveSpeed?: number
  basisYAxis?: number
}) => void

export type ResetGlitch = () => void

export type ImageChangerNoise = (
  loadedAssets: LoadedAssets,
) => {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  currentPhase: number
  update: UpdateImageChangerState,
  triggerGlitch: TriggerGlitch,
  updateShaderParams: UpdateShaderParams,
  resetGlitch: ResetGlitch,
}

export const imageChangerNoise: ImageChangerNoise = (
  loadedAssets: LoadedAssets,
) => {
  // フェーズ定数
  const PHASES = {
    PHASE_1: 0.0,         // 画像1フェーズ
    PHASE_GLITCH: 1.0,    // 切り替えフェーズ（グリッチ）
    PHASE_FADEOUT: 2.0,   // フェードアウトフェーズ
    PHASE_2: 3.0,         // 画像2フェーズ（完了）
  }

  // 状態管理用の変数
  let currentPhase = PHASES.PHASE_1
  let isGlitchActive = false
  let glitchStartTime = 0
  let glitchDuration = 1.0 // デフォルト1秒
  let fadeoutStartTime = 0

  /**
   * メッシュ生成
   */
  const geo = new THREE.PlaneGeometry(20, 20, 500, 500)

  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: { value: 0 },
      u_texture_01: { value: loadedAssets.textures['sample-01'] },
      u_texture_02: { value: loadedAssets.textures['sample-02'] },
      u_phase: { value: PHASES.PHASE_1 },
      u_glitch_progress: { value: 0.0 },
      u_plane_height: { value: 20.0 },
      u_ampli_height: { value: 1.6 },
      u_glitch_intensity: { value: 10.2 },
      u_high: { value: 6.0 },
      u_mid: { value: 3.0 },
      u_low: { value: 1.0 },
      u_wave_speed: { value: 1.0 },
      u_basis_y_axis: { value: 0.0 },
    },
    wireframe: false,
    side: THREE.DoubleSide,
  })

  const mesh = new THREE.Mesh(geo, mat)
  mesh.position.set(0, 10, 0)

  console.log(mesh)

  /**
   * グリッチトリガー
   */
  const triggerGlitch: TriggerGlitch = (duration = 1.0) => {
    if (currentPhase === PHASES.PHASE_1) {
      isGlitchActive = true
      glitchStartTime = mesh.material.uniforms.u_time.value
      glitchDuration = duration
      currentPhase = PHASES.PHASE_GLITCH
      console.log(`Glitch triggered! Duration: ${duration}s`)
    }
  }

  /**
   * シェーダーパラメータ更新
   */
  const updateShaderParams: UpdateShaderParams = (params) => {
    if (params.ampliHeight !== undefined) {
      mesh.material.uniforms.u_ampli_height.value = params.ampliHeight
    }
    if (params.glitchIntensity !== undefined) {
      mesh.material.uniforms.u_glitch_intensity.value = params.glitchIntensity
    }
    if (params.high !== undefined) {
      mesh.material.uniforms.u_high.value = params.high
    }
    if (params.mid !== undefined) {
      mesh.material.uniforms.u_mid.value = params.mid
    }
    if (params.low !== undefined) {
      mesh.material.uniforms.u_low.value = params.low
    }
    if (params.waveSpeed !== undefined) {
      mesh.material.uniforms.u_wave_speed.value = params.waveSpeed
    }
    if (params.basisYAxis !== undefined) {
      mesh.material.uniforms.u_basis_y_axis.value = params.basisYAxis
    }
  }

  /**
   * グリッチリセット
   */
  const resetGlitch: ResetGlitch = () => {
    currentPhase = PHASES.PHASE_1
    isGlitchActive = false
    glitchStartTime = 0
    fadeoutStartTime = 0

    // uniformsもリセット
    mesh.material.uniforms.u_phase.value = PHASES.PHASE_1
    mesh.material.uniforms.u_glitch_progress.value = 0.0

    console.log('Glitch effect reset to initial state')
  }

  /**
   * 状態アップデート
   */
  const update: UpdateImageChangerState = () => {
    // 時間を更新
    mesh.material.uniforms.u_time.value += 0.01

    // グリッチ処理
    if (isGlitchActive && currentPhase === PHASES.PHASE_GLITCH) {
      const elapsed = mesh.material.uniforms.u_time.value - glitchStartTime
      const glitchProgress = Math.min(elapsed / glitchDuration, 1.0)

      mesh.material.uniforms.u_glitch_progress.value = glitchProgress

      if (glitchProgress >= 1.0) {
        // グリッチ完了 → フェードアウト開始
        currentPhase = PHASES.PHASE_FADEOUT
        fadeoutStartTime = mesh.material.uniforms.u_time.value
        console.log('Glitch completed → Starting fadeout')
      }
    }

    // フェードアウト処理
    if (currentPhase === PHASES.PHASE_FADEOUT) {
      const elapsed = mesh.material.uniforms.u_time.value - fadeoutStartTime
      const fadeoutProgress = Math.min(elapsed / glitchDuration, 1.0)

      // 1.0から0.0へフェードアウト
      mesh.material.uniforms.u_glitch_progress.value = 1.0 - fadeoutProgress

      if (fadeoutProgress >= 1.0) {
        // フェードアウト完了
        isGlitchActive = false
        currentPhase = PHASES.PHASE_2
        mesh.material.uniforms.u_glitch_progress.value = 0.0
        console.log('Fadeout completed → Image 2')
      }
    }

    // uniformに状態を送信
    mesh.material.uniforms.u_phase.value = currentPhase
  }

  return {
    update,
    mesh,
    currentPhase,
    triggerGlitch,
    updateShaderParams,
    resetGlitch,
  }
}
