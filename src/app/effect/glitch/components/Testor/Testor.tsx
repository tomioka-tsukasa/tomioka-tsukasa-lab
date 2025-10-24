'use client'

import { TestorPanel, WebGLProvider, GlitchSettings, useWebGL } from '@/components/TestorPanel'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { webglCtrl } from '../../modules/webgl/setupMember'
import * as styles from './Testor.css'

const TestorContent = () => {
  const { setImageChangerNoiseCtrl } = useWebGL()
  const pathname = usePathname()

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

  // sample-01 ページの場合は非表示
  const isOnSample01 = pathname?.includes('/effect/glitch/sample-01')

  return (
    <TestorPanel
      effectType='glitch'
      onGlitchTrigger={handleGlitchTrigger}
      initialVisible={!isOnSample01}
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
