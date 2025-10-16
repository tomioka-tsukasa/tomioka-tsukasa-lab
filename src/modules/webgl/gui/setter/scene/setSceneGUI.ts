import * as THREE from 'three'
import { setGUI } from '../../gui'

/**
 * SceneのGUI設定
 */
export const setSceneGUI = (
  scene: THREE.Scene,
  envmap: THREE.Texture | null,
  settings: {
    environmentIntensity?: number
    background?: boolean
  }
) => {
  /**
   * 位置のGUIの設定
   */
  if (settings.environmentIntensity) {
    const environmentGUI = setGUI(
      '【シーン】環境テクスチャ強さ',
      {
        environmentIntensity: { type: 'number', label: 'intensity', min: -5, max: 5, step: 0.1 },
      },
      {
        environmentIntensity: settings.environmentIntensity,
      },
    )

    // 位置の変更を反映
    environmentGUI.controllers.forEach((controller) => {
      controller.onChange((value) => {
        console.log('environmentIntensity', value)
        scene.environmentIntensity = value
      })
    })
  }

  /**
   * 背景のGUIの設定
   */
  const backgroundGUI = setGUI(
    '【シーン】背景',
    {
      background: { type: 'boolean', label: 'background' },
    },
    {
      background: settings.background ?? false,
    },
  )

  // 背景の変更を反映
  backgroundGUI.controllers.forEach((controller) => {
    controller.onChange((value) => {
      scene.background = value ? envmap : null
    })
  })
}
