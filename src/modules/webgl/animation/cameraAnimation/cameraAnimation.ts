import * as THREE from 'three'
import { webglCtrl } from '../../setupMember'
import gsap from 'gsap'
import CustomEase from 'gsap/CustomEase'

type CameraAnimationState = {
  isAnimating: boolean
  timeline: gsap.core.Timeline | null
}

const state: CameraAnimationState = {
  isAnimating: false,
  timeline: null,
}

export const cameraAnimation = (
  endPosition: THREE.Vector3,
  endTarget: THREE.Vector3,
  duration: number = 2000
): CameraAnimationState | null => {
  if (!webglCtrl.camera) return null

  cameraAnimationInit()

  // アニメーション用のターゲット位置オブジェクト
  const animationTarget = {
    x: webglCtrl.camera.position.x,
    y: webglCtrl.camera.position.y,
    z: webglCtrl.camera.position.z,
    lookAtX: 0, // 現在のlookAt方向を計算して設定する必要があるが、簡単のため0で初期化
    lookAtY: 0,
    lookAtZ: 0
  }

  // 現在カメラが見ている方向を計算（簡易版）
  const direction = new THREE.Vector3()
  webglCtrl.camera.getWorldDirection(direction)
  const currentLookAt = webglCtrl.camera.position.clone().add(direction)

  animationTarget.lookAtX = currentLookAt.x
  animationTarget.lookAtY = currentLookAt.y
  animationTarget.lookAtZ = currentLookAt.z

  // 新しいタイムラインを作成
  state.timeline = gsap.timeline({
    onComplete: () => {
      state.isAnimating = false
      state.timeline = null
      // アニメーション完了時にlookAtで最終的な向きを確定
      webglCtrl.camera?.lookAt(endTarget)
    }
  })

  // カメラ位置と向きを同時にアニメーション
  state.timeline.to(animationTarget, {
    x: endPosition.x,
    y: endPosition.y,
    z: endPosition.z,
    lookAtX: endTarget.x,
    lookAtY: endTarget.y,
    lookAtZ: endTarget.z,
    duration: duration / 1000, // GSAPは秒単位
    ease: CustomEase.create('custom', 'M0,0 C0.656,0.079 0.41,1 1,1 '),
    onUpdate: () => {
      // アニメーション中にカメラ位置と向きを更新
      if (webglCtrl.camera) {
        webglCtrl.camera.position.set(animationTarget.x, animationTarget.y, animationTarget.z)
        webglCtrl.camera.lookAt(animationTarget.lookAtX, animationTarget.lookAtY, animationTarget.lookAtZ)
      }
    }
  }, 0)

  return {
    isAnimating: state.isAnimating,
    timeline: state.timeline,
  }
}

export const cameraAnimationInit = () => {
  // 既存のアニメーションを停止
  if (state.timeline) {
    state.timeline.kill()
  }

  state.isAnimating = true
}
