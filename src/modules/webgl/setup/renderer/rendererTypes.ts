import * as THREE from 'three'

/**
 * レンダラー取得
 */
export type GetRenderer = (
  canvas: HTMLCanvasElement,
  options: GetRendererOptions,
  parameters?: ConstructorParameters<typeof THREE.WebGLRenderer>[0],
) => THREE.WebGLRenderer

export type GetRendererOptions = {
  pixelRatio: {
    baseSize: {
      width: number,
      height: number,
    },
    wishPixelRatioPercent: number,
    mobileWishPixelRatioPercent: number,
    minPixelRatio: number,
  },
  shadow?: boolean,
  toneMapping?: number,
}
