import { Camera } from 'three'
import { GetCamera } from '../../../setup/camera/cameraTypes'
import { setGUI } from '../../gui'

/**
 * PerspectiveCameraのGUI設定
 */
export const setCameraGUI = (
  camera: Camera,
  settings: Parameters<GetCamera>[0]
) => {
  /**
   * 位置のGUIの設定
   */
  if (settings?.position) {
    if (settings.position.x === undefined) settings.position.x = 0
    if (settings.position.y === undefined) settings.position.y = 0
    if (settings.position.z === undefined) settings.position.z = 0

    const positionGUI = setGUI(
      '【カメラ】位置',
      {
        x: { type: 'number', label: 'X Position', min: -500, max: 500, step: 1 },
        y: { type: 'number', label: 'Y Position', min: -500, max: 500, step: 1 },
        z: { type: 'number', label: 'Z Position', min: -500, max: 500, step: 1 }
      },
      settings?.position
    )

    // 位置の変更を反映
    positionGUI.controllers.forEach((controller) => {
      controller.onChange((value) => {
        camera.position[controller.property as 'x' | 'y' | 'z'] = value
      })
    })
  }

  /**
   * カメラターゲットの設定
   */
  if (settings?.target) {
    if (settings.target.x === undefined) settings.target.x = 0
    if (settings.target.y === undefined) settings.target.y = 0
    if (settings.target.z === undefined) settings.target.z = 0

    const targetGUI = setGUI(
      '【カメラ】ターゲット',
      {
        x: { type: 'number', label: 'X Position', min: -500, max: 500, step: 1 },
        y: { type: 'number', label: 'Y Position', min: -500, max: 500, step: 1 },
        z: { type: 'number', label: 'Z Position', min: -500, max: 500, step: 1 }
      },
      settings?.target
    )

    // 位置の変更を反映
    targetGUI.controllers.forEach((controller) => {
      controller.onChange((value) => {
        camera.lookAt(value)
      })
    })
  }
}
