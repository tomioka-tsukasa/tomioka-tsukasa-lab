import { detectBrowser, detectTouchDevice } from '@/lib/deviceInfo/detector/detector'
import { DEVICE_TYPE } from '@/lib/deviceInfo/deviceInfoConstants'
import { PixelRatioManager } from './pixelRatioManagerTypes'
import { setupMember } from '@/modules/webgl/setupMember'

/**
 * Three.jsのレンダラーにピクセル比率を適用
 */
export const pixelRatioManager: PixelRatioManager = (
  canvas,
  options,
) => {
  if (typeof window === 'undefined') return null

  const ua = window.navigator.userAgent
  const hasMultiTouch = detectTouchDevice()
  const browserInfo = detectBrowser(ua, hasMultiTouch)

  let pixelRatio = 0

  if (browserInfo.deviceType === DEVICE_TYPE.PC) {
    // 希望の割合を参考にピクセル比率を設定
    const wishPixelRatio = fixPixelRatioWish(options.wishPixelRatioPercent)

    // デバイスのピクセル比率の最適化
    const devicePixelRatio = fixPixelRatioDevice(canvas, wishPixelRatio, options.baseSize)

    // 最低限の PixelRatio を保証
    pixelRatio = Math.max(devicePixelRatio, options.minPixelRatio)

    // ログ
    console.log('[PixelRatio-PC] window.devicePixelRatio:', window.devicePixelRatio)
    console.log('[PixelRatio-PC] wishPixelRatio:', wishPixelRatio)
    console.log('[PixelRatio-PC] pixelRatio:', pixelRatio)

    if (setupMember.renderer.debug) {
      pixelRatio *= setupMember.renderer.debugPixelRatioPercent
      console.log('[PixelRatio-PC] debugPixelRatio:', pixelRatio)
    }

  } else {

    /**
     * デバイスタイプがSPの場合はデバイスのピクセル比率をそのまま適用
     */
    pixelRatio = window.devicePixelRatio * options.mobileWishPixelRatioPercent

    console.log('[PixelRatio-SP] pixelRatio:', pixelRatio)
  }

  return {
    getPixelRatio: () => {
      return pixelRatio
    },
    setPixelRatio: (
      renderer,
    ) => {
      renderer.setPixelRatio(pixelRatio)
    },
  }
}

/**
 * 【希望の値を参考にピクセル比率を固定】
 * @param wishPixelRatio 希望するピクセル比率
 * @returns 適用するピクセル比率
 */
export const fixPixelRatioWish = (
  wishPercent: number,
): number => {
  const devicePixelRatio = window.devicePixelRatio

  return devicePixelRatio * wishPercent
}

/**
 * 【デバイスのピクセル比率の最適化】
 * @param canvas キャンバス
 * @param pixelRatio ピクセル比率
 * @param baseSize 基準サイズ
 * @returns 適用するピクセル比率
 */
export const fixPixelRatioDevice = (
  canvas: HTMLCanvasElement,
  pixelRatio: number,
  baseSize: {
    width: number,
    height: number,
  }
) => {
  const baseArea = baseSize.width * baseSize.height
  const actualArea = canvas.clientWidth * canvas.clientHeight
  const scaling = Math.sqrt(baseArea / actualArea)

  console.log('[PixelRatio-PC] devide size scaling:', scaling)

  if (scaling > 1) {
    // baseSize よりも小さい場合はピクセル比率を固定
    return pixelRatio
  } else {
    // baseSize よりも大きい場合はピクセル比率を最適化
    return pixelRatio * scaling
  }
}
