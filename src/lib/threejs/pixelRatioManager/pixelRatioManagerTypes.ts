import * as THREE from 'three'
import { GetRendererOptions } from '@/modules/webgl/setup/renderer/rendererTypes'

export type PixelRatioManager = (
  canvas: HTMLCanvasElement,
  options: GetRendererOptions['pixelRatio'],
) => {
  getPixelRatio: () => number,
  setPixelRatio: (
    renderer: THREE.WebGLRenderer,
  ) => void,
} | null
