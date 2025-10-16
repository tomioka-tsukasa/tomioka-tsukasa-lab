import * as THREE from 'three'
import { GetRenderer } from './rendererTypes'
import { pixelRatioManager } from '@/lib/threejs/pixelRatioManager/pixelRatioManager'

/**
 * レンダラー取得
 */
export const getRenderer: GetRenderer = (
  canvas,
  options,
  parameters,
) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: parameters?.antialias ?? true,
    ...parameters,
  })
  renderer.setSize(window.innerWidth, window.innerHeight)

  /**
   * カラー設定
   */
  renderer.setClearColor(new THREE.Color(0x000000))
  renderer.outputColorSpace = THREE.SRGBColorSpace

  /**
   * パフォーマンス設定
   */
  pixelRatioManager(
    renderer.domElement,
    options.pixelRatio,
  )?.setPixelRatio(renderer)

  /**
   * シャドウ設定
   */
  if (options?.shadow) {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
  }

  /**
   * トーン設定
   */
  if (options?.toneMapping) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = options.toneMapping || 1
  }

  return renderer
}
