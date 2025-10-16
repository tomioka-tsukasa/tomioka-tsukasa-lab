import * as THREE from 'three'
import { GetSpotLight } from './lightsTypes'

/**
 * スポットライト取得
 */
export const getSpotLight: GetSpotLight = (
  settings,
) => {
  const { parameters, position, target, shadow } = settings ?? {}

  const light = new THREE.SpotLight(
    parameters?.color ?? 0xffffff,
    parameters?.intensity ?? 1,
    parameters?.distance ?? 0,
    parameters?.angle ?? Math.PI / 3,
    parameters?.penumbra ?? 0,
    parameters?.decay ?? 2
  )

  if (position) {
    if (position.x !== undefined) light.position.x = position.x
    if (position.y !== undefined) light.position.y = position.y
    if (position.z !== undefined) light.position.z = position.z
  }

  if (target) {
    if (target.x !== undefined) light.target.position.x = target.x
    if (target.y !== undefined) light.target.position.y = target.y
    if (target.z !== undefined) light.target.position.z = target.z
  }

  if (shadow) {
    if (shadow.mapSize) {
      if (shadow.mapSize.width !== undefined) light.shadow.mapSize.width = shadow.mapSize.width
      if (shadow.mapSize.height !== undefined) light.shadow.mapSize.height = shadow.mapSize.height
    }
    if (shadow.camera) {
      if (shadow.camera.near !== undefined) light.shadow.camera.near = shadow.camera.near
      if (shadow.camera.far !== undefined) light.shadow.camera.far = shadow.camera.far
    }
    if (shadow.focus !== undefined) light.shadow.focus = shadow.focus
  }

  return light
}
