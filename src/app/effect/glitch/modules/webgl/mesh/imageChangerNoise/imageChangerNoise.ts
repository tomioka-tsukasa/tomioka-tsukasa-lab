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

export type SetManualProgress = (textureProgress: number, glitchProgress?: number) => void

export type OnEffectCompleted = () => void

export type SetOnEffectCompleted = (callback: OnEffectCompleted | null) => void

export type SetTextures = (texture1Key: string, texture2Key: string) => void

export type ImageChangerNoise = (
  loadedAssets: LoadedAssets,
) => {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  currentPhase: number
  update: UpdateImageChangerState,
  triggerGlitch: TriggerGlitch,
  updateShaderParams: UpdateShaderParams,
  resetGlitch: ResetGlitch,
  setManualProgress: SetManualProgress,
  setOnEffectCompleted: SetOnEffectCompleted,
  setTextures: SetTextures,
}

export const imageChangerNoise: ImageChangerNoise = (
  loadedAssets: LoadedAssets,
) => {
  // 状態管理用の変数（フェーズ不要）
  let isGlitchActive = false
  let glitchStartTime = 0
  let glitchDuration = 1.0 // デフォルト1秒
  let isManualMode = false
  let onEffectCompleted: OnEffectCompleted | null = null

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
      u_texture_progress: { value: 0.0 },
      u_glitch_progress: { value: 0.0 },
      u_plane_height: { value: 20.0 },
      u_ampli_height: { value: 1.6 },
      u_glitch_intensity: { value: 2.0 },
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
    isManualMode = false // 自動モードに切り替え
    isGlitchActive = true
    glitchStartTime = mesh.material.uniforms.u_time.value
    glitchDuration = duration
    console.log(`Glitch triggered! Duration: ${duration}s`)
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
    isGlitchActive = false
    glitchStartTime = 0
    isManualMode = false

    // uniformsもリセット
    mesh.material.uniforms.u_texture_progress.value = 0.0
    mesh.material.uniforms.u_glitch_progress.value = 0.0

    console.log('Glitch effect reset to initial state')
  }

  /**
   * テクスチャ設定
   */
  const setTextures: SetTextures = (texture1Key: string, texture2Key: string) => {
    if (loadedAssets.textures[texture1Key] && loadedAssets.textures[texture2Key]) {
      mesh.material.uniforms.u_texture_01.value = loadedAssets.textures[texture1Key]
      mesh.material.uniforms.u_texture_02.value = loadedAssets.textures[texture2Key]
      console.log(`Textures updated: ${texture1Key} → ${texture2Key}`)
    } else {
      console.warn(`Texture not found: ${texture1Key} or ${texture2Key}`)
    }
  }

  /**
   * 完了コールバック設定
   */
  const setOnEffectCompleted: SetOnEffectCompleted = (callback: OnEffectCompleted | null) => {
    onEffectCompleted = callback
  }

  /**
   * マニュアル進行度設定
   */
  const setManualProgress: SetManualProgress = (textureProgress: number, glitchProgress?: number) => {
    isManualMode = true

    // テクスチャ進行度: 0.0→1.0
    const clampedTextureProgress = Math.max(0, Math.min(1, textureProgress))
    mesh.material.uniforms.u_texture_progress.value = clampedTextureProgress

    // グリッチ進行度: 指定された場合はその値、未指定の場合はテクスチャ進行度と同じ
    const finalGlitchProgress = glitchProgress !== undefined ? glitchProgress : textureProgress
    const clampedGlitchProgress = Math.max(0, Math.min(1, finalGlitchProgress))
    mesh.material.uniforms.u_glitch_progress.value = clampedGlitchProgress
  }

  /**
   * 状態アップデート
   */
  const update: UpdateImageChangerState = () => {
    // 時間を更新
    mesh.material.uniforms.u_time.value += 0.01

    // マニュアルモードの場合は自動更新をスキップ
    if (isManualMode) {
      return
    }

    // グリッチ処理（GSAP版: setManualProgressを使用）
    if (isGlitchActive) {
      const elapsed = mesh.material.uniforms.u_time.value - glitchStartTime
      const timeProgress = Math.min(elapsed / glitchDuration, 1.0)

      // setManualProgressを呼び出してGSAPと同じロジックを使用
      setManualProgress(timeProgress)

      if (timeProgress >= 1.0) {
        // グリッチアニメーション完了
        isGlitchActive = false
        console.log('Glitch animation completed → Image 2')

        // 完了コールバックを呼び出し
        if (onEffectCompleted) {
          onEffectCompleted()
        }
      }
    }
  }

  return {
    update,
    mesh,
    currentPhase: 1.0, // 常にグリッチフェーズ（互換性のため）
    triggerGlitch,
    updateShaderParams,
    resetGlitch,
    setManualProgress,
    setOnEffectCompleted,
    setTextures,
  }
}
