'use client'

import { TestorPanel, WebGLProvider, GlitchSettings, useWebGL } from '@/components/TestorPanel'
import { useEffect } from 'react'
import { webglCtrl } from '../../modules/webgl/setupMember'
import * as styles from './Testor.css'

const TestorContent = () => {
  const { setImageChangerNoiseCtrl } = useWebGL()

  useEffect(() => {
    // WebGL初期化を監視してContextに登録
    const checkWebGL = () => {
      if (webglCtrl.imageChangerNoiseCtrl) {
        setImageChangerNoiseCtrl(webglCtrl.imageChangerNoiseCtrl)
      } else {
        setTimeout(checkWebGL, 100)
      }
    }

    checkWebGL()
  }, [setImageChangerNoiseCtrl])

  const handleGlitchTrigger = (settings: GlitchSettings) => {
    console.log('Glitch triggered with settings:', settings)
  }

  return (
    <TestorPanel
      effectType='glitch'
      onGlitchTrigger={handleGlitchTrigger}
      initialVisible={false}
    />
  )
}

export const Testor = () => {
  return (
    <div className={styles.container}>
      <WebGLProvider>
        <TestorContent />
      </WebGLProvider>
    </div>
  )
}
