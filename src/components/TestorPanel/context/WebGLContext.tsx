'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { ImageChangerNoiseCtrl } from '@/modules/webgl/webglTypes'

interface WebGLContextType {
  imageChangerNoiseCtrl: ImageChangerNoiseCtrl | null
  setImageChangerNoiseCtrl: (ctrl: ImageChangerNoiseCtrl) => void
  triggerGlitch: (duration?: number) => void
  resetGlitch: () => void
}

const WebGLContext = createContext<WebGLContextType | null>(null)

interface WebGLProviderProps {
  children: ReactNode
}

export const WebGLProvider = ({ children }: WebGLProviderProps) => {
  const [imageChangerNoiseCtrl, setImageChangerNoiseCtrlState] = useState<ImageChangerNoiseCtrl | null>(null)

  const setImageChangerNoiseCtrl = useCallback((ctrl: ImageChangerNoiseCtrl) => {
    setImageChangerNoiseCtrlState(ctrl)
  }, [])

  const triggerGlitch = useCallback((duration = 1.0) => {
    if (imageChangerNoiseCtrl) {
      imageChangerNoiseCtrl.triggerGlitch(duration)
      console.log('Glitch triggered from context with duration:', duration)
    } else {
      console.warn('ImageChangerNoiseCtrl not available')
    }
  }, [imageChangerNoiseCtrl])

  const resetGlitch = useCallback(() => {
    if (imageChangerNoiseCtrl) {
      imageChangerNoiseCtrl.resetGlitch()
      console.log('Glitch reset from context')
    } else {
      console.warn('ImageChangerNoiseCtrl not available')
    }
  }, [imageChangerNoiseCtrl])

  return (
    <WebGLContext.Provider
      value={{
        imageChangerNoiseCtrl,
        setImageChangerNoiseCtrl,
        triggerGlitch,
        resetGlitch
      }}
    >
      {children}
    </WebGLContext.Provider>
  )
}

export const useWebGL = () => {
  const context = useContext(WebGLContext)
  if (!context) {
    throw new Error('useWebGL must be used within a WebGLProvider')
  }

  return context
}
