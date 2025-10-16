import * as THREE from 'three'
import { GetSpotLight, SpotLightSettings } from '../../../setup/lights/lightsTypes'
import { setGUI } from '../../gui'

/**
 * スポットライトGUI設定
 */
export const setSpotLightGUI: (
  name: string,
  light: THREE.SpotLight,
  settings: Parameters<GetSpotLight>[0]
) => THREE.SpotLight = (
  name,
  light,
  settings
) => {
  /**
   * 位置のGUIの設定
   */
  if (settings?.position) {
    if (settings.position.x === undefined) settings.position.x = 0
    if (settings.position.y === undefined) settings.position.y = 0
    if (settings.position.z === undefined) settings.position.z = 0

    const positionGUI = setGUI(
      `【${name}】位置`,
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
        light.position[controller.property as 'x' | 'y' | 'z'] = value
      })
    })
  }

  /**
   * ターゲットのGUIの設定
   */
  if (settings?.target) {
    if (settings.target.x === undefined) settings.target.x = 0
    if (settings.target.y === undefined) settings.target.y = 0
    if (settings.target.z === undefined) settings.target.z = 0

    const targetGUI = setGUI(
      `【${name}】ターゲット`,
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
        light.target.position[controller.property as 'x' | 'y' | 'z'] = value
      })
    })
  }

  /**
   * パラメータのGUIの設定
   */
  if (settings?.parameters) {
    if (settings.parameters.intensity === undefined) settings.parameters.intensity = 1
    if (settings.parameters.distance === undefined) settings.parameters.distance = 0
    if (settings.parameters.angle === undefined) settings.parameters.angle = Math.PI / 3
    if (settings.parameters.decay === undefined) settings.parameters.decay = 2
    if (settings.parameters.penumbra === undefined) settings.parameters.penumbra = 0
    if (settings.parameters.color === undefined) settings.parameters.color = '#ffffff'

    const parametersGUI = setGUI(
      `【${name}】設定値`,
      {
        intensity: { type: 'number', label: 'Intensity', min: 0, max: 500, step: 1 },
        distance: { type: 'number', label: 'Distance', min: 0, max: 500, step: 1 },
        angle: { type: 'number', label: 'Angle', min: 0, max: Math.PI / 2, step: 0.01 },
        decay: { type: 'number', label: 'Decay', min: 0, max: 2, step: 0.01 },
        penumbra: { type: 'number', label: 'Penumbra', min: 0, max: 1, step: 0.01 },
        color: { type: 'color', label: 'Color' }
      },
      settings?.parameters
    )

    // パラメータの変更を反映
    parametersGUI.controllers.forEach((controller) => {
      controller.onChange((value) => {
        if (controller.property === 'color') {
          light.color.set(value)
        } else {
          light[controller.property as keyof SpotLightSettings['parameters']] = value
        }
      })
    })
  }

  if (settings?.shadow) {
    if (settings.shadow.mapSize === undefined) settings.shadow.mapSize = { width: 2048, height: 2048 }
    if (settings.shadow.camera === undefined) settings.shadow.camera = { near: 0.1, far: 1000 }
    if (settings.shadow.focus === undefined) settings.shadow.focus = 0
    if (settings.shadow.mapSize.width === undefined) settings.shadow.mapSize.width = 2048
    if (settings.shadow.mapSize.height === undefined) settings.shadow.mapSize.height = 2048
    if (settings.shadow.camera.near === undefined) settings.shadow.camera.near = 0.1
    if (settings.shadow.camera.far === undefined) settings.shadow.camera.far = 1000

    console.log(settings.shadow)

    // const shadowGUI = setGUI(
    //   `【${name}】シャドウ`,
    //   {
    //     'mapSize.width': { type: 'number', label: 'Map Size Width', min: 0, max: 2048, step: 64 },
    //     'mapSize.height': { type: 'number', label: 'Map Size Height', min: 0, max: 2048, step: 64 },
    //     'camera.near': { type: 'number', label: 'Camera Near', min: 0.1, max: 10, step: 0.1 },
    //     'camera.far': { type: 'number', label: 'Camera Far', min: 100, max: 1000, step: 10 },
    //     focus: { type: 'number', label: 'Focus', min: 0, max: 2, step: 0.1 }
    //   },
    //   settings?.shadow
    // )

    // シャドウの変更を反映
    // shadowGUI.controllers.forEach((controller) => {
    //   controller.onChange((value) => {
    //     light.shadow[controller.property as keyof SpotLightShadowSettings] = value
    //   })
    // })
  }

  return light
}
