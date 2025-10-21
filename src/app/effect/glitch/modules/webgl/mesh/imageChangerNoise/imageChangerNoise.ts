import * as THREE from 'three'
import { LoadedAssets } from '../../setupMember'
import vertexShader from './vertex.glsl'
import fragmentShader from './fragment.glsl'

export type UpdateImageChangerState = () => void

export type TriggerGlitch = (duration?: number) => void

export type ImageChangerNoise = (
  loadedAssets: LoadedAssets,
) => {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  currentPhase: number
  update: UpdateImageChangerState,
  triggerGlitch: TriggerGlitch,
}

export const imageChangerNoise: ImageChangerNoise = (
  loadedAssets: LoadedAssets,
) => {
  // フェーズ定数
  const PHASES = {
    PHASE_1: 0.0,       // 画像1フェーズ
    PHASE_GLITCH: 1.0,  // 切り替えフェーズ（グリッチ）
    PHASE_2: 2.0,       // 画像2フェーズ（完了）
  }

  // 状態管理用の変数
  let currentPhase = PHASES.PHASE_1
  let isGlitchActive = false
  let glitchStartTime = 0
  let glitchDuration = 1.0 // デフォルト1秒

  /**
   * メッシュ生成
   */
  const geo = new THREE.PlaneGeometry(20, 20, 1, 1)

  const mat = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: { value: 0 },
      u_texture_01: { value: loadedAssets.textures['sample-01'] },
      u_texture_02: { value: loadedAssets.textures['sample-02'] },
      u_phase: { value: PHASES.PHASE_1 },
      u_glitch_progress: { value: 0.0 },
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
        // グリッチ完了
        isGlitchActive = false
        currentPhase = PHASES.PHASE_2
        mesh.material.uniforms.u_glitch_progress.value = 0.0
        console.log('Glitch completed → Image 2')
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
  }
}
