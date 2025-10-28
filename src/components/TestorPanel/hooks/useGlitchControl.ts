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
        ampliHeight: settings.ampliHeight,
        glitchIntensity: settings.glitchIntensity,
        high: settings.high,
        mid: settings.mid,
        low: settings.low,
        waveSpeed: settings.waveSpeed,
        basisYAxis: settings.basisYAxis
      })

      console.log('Updated shader parameters:', {
        ampliHeight: settings.ampliHeight,
        glitchIntensity: settings.glitchIntensity,
        high: settings.high,
        mid: settings.mid,
        low: settings.low,
        waveSpeed: settings.waveSpeed,
        basisYAxis: settings.basisYAxis
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
        ampliHeight: settings.ampliHeight,
        glitchIntensity: settings.glitchIntensity,
        high: settings.high,
        mid: settings.mid,
        low: settings.low,
        waveSpeed: settings.waveSpeed,
        basisYAxis: settings.basisYAxis
      })
    }
  }, [imageChangerNoiseCtrl])

  const resetGlitch = useCallback(() => {
    contextResetGlitch()
  }, [contextResetGlitch])

  const setManualProgress = useCallback((progress: number) => {
    if (imageChangerNoiseCtrl) {
      imageChangerNoiseCtrl.setManualProgress?.(progress)
    }
  }, [imageChangerNoiseCtrl])

  return {
    triggerGlitch,
    updateShaderParams,
    resetGlitch,
    setManualProgress
  }
}
