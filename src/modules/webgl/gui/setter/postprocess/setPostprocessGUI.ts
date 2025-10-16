import { setGUI } from '../../gui'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

export const setPostprocessGUI = (
  bloomPass: UnrealBloomPass,
  settings: {
    bloomPass?: {
      strength: number,
      radius: number,
      threshold: number,
    },
  }
) => {
  /**
   * UnrealBloomPass 設定
   */
  if (settings.bloomPass) {
    const environmentGUI = setGUI(
      '【Postprocess / UnrealBloomPass】',
      {
        strength: { type: 'number', label: 'strength', min: 0, max: 10, step: 0.01 },
        radius: { type: 'number', label: 'radius', min: 0, max: 2, step: 0.01 },
        threshold: { type: 'number', label: 'threshold', min: 0, max: 2, step: 0.01 },
      },
      {
        strength: settings.bloomPass.strength,
        radius: settings.bloomPass.radius,
        threshold: settings.bloomPass.threshold,
      },
    )

    // 位置の変更を反映
    environmentGUI.controllers.forEach((controller) => {
      controller.onChange((value) => {
        bloomPass[controller.property as 'strength' | 'radius' | 'threshold'] = value
      })
    })
  }
}
