'use client'

import { useCallback } from 'react'
import { GlitchSettings } from '../types'
import { useWebGL } from '../context/WebGLContext'

export const useGlitchControl = () => {
  const { imageChangerNoiseCtrl, triggerGlitch: contextTriggerGlitch, resetGlitch: contextResetGlitch } = useWebGL()

  const triggerGlitch = useCallback((settings: GlitchSettings) => {
    if (imageChangerNoiseCtrl) {
      // シェーダーパラメータを更新
      imageChangerNoiseCtrl.updateShaderParams({
        planeHeight: settings.planeHeight,
        ampliHeight: settings.ampliHeight,
        glitchIntensity: settings.glitchIntensity
      })

      console.log('Updated shader parameters:', {
        planeHeight: settings.planeHeight,
        ampliHeight: settings.ampliHeight,
        glitchIntensity: settings.glitchIntensity
      })

      // テクスチャ更新は将来実装
      console.log('Texture paths:', {
        texture1: settings.texture1Path,
        texture2: settings.texture2Path
      })

      // グリッチを発動
      contextTriggerGlitch(settings.duration)
    } else {
      console.warn('ImageChangerNoiseCtrl not available. Make sure WebGL is initialized.')
    }
  }, [imageChangerNoiseCtrl, contextTriggerGlitch])

  const updateShaderParams = useCallback((settings: GlitchSettings) => {
    if (imageChangerNoiseCtrl) {
      imageChangerNoiseCtrl.updateShaderParams({
        planeHeight: settings.planeHeight,
        ampliHeight: settings.ampliHeight,
        glitchIntensity: settings.glitchIntensity
      })
    }
  }, [imageChangerNoiseCtrl])

  const resetGlitch = useCallback(() => {
    contextResetGlitch()
  }, [contextResetGlitch])

  return {
    triggerGlitch,
    updateShaderParams,
    resetGlitch
  }
}
