import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GetCamera } from './cameraTypes'
import { setupMember } from '@/modules/webgl/setupMember'

/**
 * カメラ取得
 */
export const getCamera: GetCamera = (settings = {}) => {
  const camera = new THREE.PerspectiveCamera(
    settings.parameters?.fov ?? 75,
    settings.parameters?.aspect ?? window.innerWidth / window.innerHeight,
    settings.parameters?.near ?? 0.1,
    settings.parameters?.far ?? 1000
  )
  camera.position.x = settings.position?.x ?? 0
  camera.position.y = settings.position?.y ?? 0
  camera.position.z = settings.position?.z ?? 0

  camera.lookAt(
    settings?.target?.x ?? 0,
    settings?.target?.y ?? 0,
    settings?.target?.z ?? 0,
  )

  return camera
}

/**
 * カメラのコントロールを取得する
 */
export const getControls: (
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  target?: {
    x: number,
    y: number,
    z: number,
  },
) => OrbitControls = (
  camera,
  renderer,
  target,
) => {
  const ctrl = new OrbitControls(camera, renderer.domElement)
  // ctrl.autoRotate = true
  ctrl.autoRotateSpeed = 2
  ctrl.target.set(
    target?.x ?? 0,
    target?.y ?? 0,
    target?.z ?? 0,
  )
  ctrl.update()

  return ctrl
}

/**
 * カメラの現在の位置と向きを取得する
 */
export const getCameraInfo = (
  camera: THREE.PerspectiveCamera,
  controls: OrbitControls
) => {
  controls.addEventListener('change', () => {
    if (!setupMember.controls.debug) {
      return
    }

    // カメラの位置を取得
    const position = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z
    }

    console.log('>> カメラ位置:')
    console.log(position)
    console.log('>> カメラターゲット:')
    console.log(controls.target)
  })
}
