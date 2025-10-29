import * as THREE from 'three'
import { LoadedAssets } from './setupMember'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

export interface ImageChangerNoiseCtrl {
  mesh: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>
  currentPhase: number
  update: () => void
  triggerGlitch: (duration?: number) => void
  updateShaderParams: (params: {
    ampliHeight?: number
    glitchIntensity?: number
    high?: number
    mid?: number
    low?: number
    waveSpeed?: number
    basisYAxis?: number
  }) => void
  resetGlitch: () => void
  setManualProgress?: (textureProgress: number, glitchProgress?: number) => void
  setOnEffectCompleted: (callback: (() => void) | null) => void
  setTextures: (texture1Key: string, texture2Key: string) => void
}

/**
 * WebGLを生成する関数の型
 */
export type CreateWebGL = (
  loadingComplete: () => void,
) => void

/**
 * WebGLを初期化する関数の型
 */
export type InitWebGL = (
  loadingComplete: () => void,
  loadedAssets: LoadedAssets,
) => void

/**
 * WebGL管理オブジェクト
 */
export type WebGLCtrl = {
  loadComplete: boolean,
  renderer: THREE.WebGLRenderer | null
  camera: THREE.Camera | null
  scene: THREE.Scene | null
  envmaps: LoadedAssets['envmaps'] | null
  textures: LoadedAssets['textures'] | null
  controls: OrbitControls | null
}
