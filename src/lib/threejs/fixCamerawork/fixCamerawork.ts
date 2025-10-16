import { SpMqWidth } from '@/styles/responsive.config'
import * as THREE from 'three'

export const fixCamerawork = (
  position: { x: number, y: number, z: number, mobile: { x: number, y: number, z: number } },
  target: { x: number, y: number, z: number, mobile: { x: number, y: number, z: number } },
  rotation: { x: number, y: number, z: number, mobile: { x: number, y: number, z: number } },
): {
  position: { x: number, y: number, z: number },
  target: { x: number, y: number, z: number },
  rotation: { x: number, y: number, z: number },
  positionVector: THREE.Vector3,
  targetVector: THREE.Vector3,
} => {
  const isMobile = window.innerWidth <= SpMqWidth

  const result = isMobile ? {
    // スマホの場合
    position: {
      x: position.mobile.x,
      y: position.mobile.y,
      z: position.mobile.z,
    },
    target: {
      x: target.mobile.x,
      y: target.mobile.y,
      z: target.mobile.z,
    },
    rotation: {
      x: rotation.mobile.x,
      y: rotation.mobile.y,
      z: rotation.mobile.z,
    },
  } : {
    // PCの場合
    position: {
      x: position.x,
      y: position.y,
      z: position.z,
    },
    target: {
      x: target.x,
      y: target.y,
      z: target.z,
    },
    rotation: {
      x: rotation.x,
      y: rotation.y,
      z: rotation.z,
    },
  }

  return {
    ...result,
    positionVector: new THREE.Vector3(result.position.x, result.position.y, result.position.z),
    targetVector: new THREE.Vector3(result.target.x, result.target.y, result.target.z),
  }
}
